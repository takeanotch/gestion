import bcrypt from 'bcryptjs'
import { supabase } from './supabase'

const SALT_ROUNDS = 12

// Hasher un mot de passe
export async function hashPassword(password) {
  return await bcrypt.hash(password, SALT_ROUNDS)
}

// Vérifier un mot de passe
export async function verifyPassword(password, hashedPassword) {
  return await bcrypt.compare(password, hashedPassword)
}

// Authentifier un utilisateur
export async function authenticateUser(email, password) {
  try {
    // Récupérer l'utilisateur par email
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .eq('is_active', true)
      .single()

    if (error || !user) {
      return { success: false, message: 'Email ou mot de passe incorrect' }
    }

    // Vérifier le mot de passe
    const isPasswordValid = await verifyPassword(password, user.password)
    
    if (!isPasswordValid) {
      return { success: false, message: 'Email ou mot de passe incorrect' }
    }

    // Mettre à jour last_login
    await updateLastLogin(user.id)

    // Enregistrer le log de connexion
    await logLogin(user.id, true)

    // Retourner l'utilisateur sans le mot de passe
    const { password: _, ...userWithoutPassword } = user
    return { 
      success: true, 
      user: userWithoutPassword 
    }

  } catch (error) {
    console.error('Erreur authentification:', error)
    return { success: false, message: 'Erreur lors de l\'authentification' }
  }
}

// Mettre à jour last_login
export async function updateLastLogin(userId) {
  try {
    await supabase
      .from('users')
      .update({ 
        last_login: new Date().toISOString() 
      })
      .eq('id', userId)
  } catch (error) {
    console.error('Erreur mise à jour last_login:', error)
  }
}

// Logger la connexion
export async function logLogin(userId, success) {
  try {
    await supabase
      .from('login_logs')
      .insert({
        user_id: userId,
        success: success
      })
  } catch (error) {
    console.error('Erreur log login:', error)
  }
}

// Récupérer l'utilisateur par ID
export async function getUserById(userId) {
  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single()

    if (error || !user) {
      return null
    }

    const { password: _, ...userWithoutPassword } = user
    return userWithoutPassword
  } catch (error) {
    console.error('Erreur récupération utilisateur:', error)
    return null
  }
}

// Vérifier les permissions
export function checkPermission(user, requiredRole) {
  if (!user) return false

  const roleHierarchy = {
    'vendor': 1,
    'admin': 2,
    'super-admin': 3
  }

  const userLevel = roleHierarchy[user.role] || 0
  const requiredLevel = roleHierarchy[requiredRole] || 0

  return userLevel >= requiredLevel
}

// Obtenir la redirection par rôle
export function getRoleRedirect(role) {
  const redirects = {
    'super-admin': '/super-admin',
    'admin': '/admin',
    'vendor': '/vendor'
  }
  return redirects[role] || '/'
}

// Déconnexion
export async function logoutUser() {
  try {
    // Supprimer le token du localStorage
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user_data')
    
    return { success: true }
  } catch (error) {
    console.error('Erreur déconnexion:', error)
    return { success: false, message: 'Erreur lors de la déconnexion' }
  }
}

// Vérifier la session
export function checkAuth() {
  const token = localStorage.getItem('auth_token')
  const userData = localStorage.getItem('user_data')
  
  if (!token || !userData) {
    return null
  }

  try {
    const user = JSON.parse(userData)
    return user
  } catch (error) {
    return null
  }
}