// //lib/auth
// import bcrypt from 'bcryptjs'
// import { supabase } from './supabase'

// const SALT_ROUNDS = 12

// // Hasher un mot de passe
// export async function hashPassword(password) {
//   return await bcrypt.hash(password, SALT_ROUNDS)
// }

// // Vérifier un mot de passe
// export async function verifyPassword(password, hashedPassword) {
//   return await bcrypt.compare(password, hashedPassword)
// }

// // Authentifier un utilisateur
// export async function authenticateUser(email, password) {
//   try {
//     // Récupérer l'utilisateur par email
//     const { data: user, error } = await supabase
//       .from('users')
//       .select('*')
//       .eq('email', email)
//       .eq('is_active', true)
//       .single()

//     if (error || !user) {
//       return { success: false, message: 'Email ou mot de passe incorrect' }
//     }

//     // Vérifier le mot de passe
//     const isPasswordValid = await verifyPassword(password, user.password)
    
//     if (!isPasswordValid) {
//       return { success: false, message: 'Email ou mot de passe incorrect' }
//     }

//     // Mettre à jour last_login
//     await updateLastLogin(user.id)

//     // Enregistrer le log de connexion
//     await logLogin(user.id, true)

//     // Retourner l'utilisateur sans le mot de passe
//     const { password: _, ...userWithoutPassword } = user
//     return { 
//       success: true, 
//       user: userWithoutPassword 
//     }

//   } catch (error) {
//     console.error('Erreur authentification:', error)
//     return { success: false, message: 'Erreur lors de l\'authentification' }
//   }
// }

// // Mettre à jour last_login
// export async function updateLastLogin(userId) {
//   try {
//     await supabase
//       .from('users')
//       .update({ 
//         last_login: new Date().toISOString() 
//       })
//       .eq('id', userId)
//   } catch (error) {
//     console.error('Erreur mise à jour last_login:', error)
//   }
// }

// // Logger la connexion
// export async function logLogin(userId, success) {
//   try {
//     await supabase
//       .from('login_logs')
//       .insert({
//         user_id: userId,
//         success: success
//       })
//   } catch (error) {
//     console.error('Erreur log login:', error)
//   }
// }

// // Récupérer l'utilisateur par ID
// export async function getUserById(userId) {
//   try {
//     const { data: user, error } = await supabase
//       .from('users')
//       .select('*')
//       .eq('id', userId)
//       .single()

//     if (error || !user) {
//       return null
//     }

//     const { password: _, ...userWithoutPassword } = user
//     return userWithoutPassword
//   } catch (error) {
//     console.error('Erreur récupération utilisateur:', error)
//     return null
//   }
// }

// // Vérifier les permissions
// export function checkPermission(user, requiredRole) {
//   if (!user) return false

//   const roleHierarchy = {
//     'vendor': 1,
//     'admin': 2,
//     'super-admin': 3
//   }

//   const userLevel = roleHierarchy[user.role] || 0
//   const requiredLevel = roleHierarchy[requiredRole] || 0

//   return userLevel >= requiredLevel
// }

// // Obtenir la redirection par rôle
// export function getRoleRedirect(role) {
//   const redirects = {
//     'super-admin': '/super-admin',
//     'admin': '/admin',
//     'vendor': '/vendor'
//   }
//   return redirects[role] || '/'
// }

// // Déconnexion
// export async function logoutUser() {
//   try {
//     // Supprimer le token du localStorage
//     localStorage.removeItem('auth_token')
//     localStorage.removeItem('user_data')
    
//     return { success: true }
//   } catch (error) {
//     console.error('Erreur déconnexion:', error)
//     return { success: false, message: 'Erreur lors de la déconnexion' }
//   }
// }

// // Vérifier la session
// export function checkAuth() {
//   const token = localStorage.getItem('auth_token')
//   const userData = localStorage.getItem('user_data')
  
//   if (!token || !userData) {
//     return null
//   }

//   try {
//     const user = JSON.parse(userData)
//     return user
//   } catch (error) {
//     return null
//   }
// }
// /lib/auth.js
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
      .single()

    if (error || !user) {
      return { success: false, message: 'Email ou mot de passe incorrect' }
    }

    // Vérifier si l'utilisateur est actif
    if (!user.is_active) {
      await logLogin(user.id, false, 'Compte désactivé')
      return { 
        success: false, 
        message: 'Votre compte a été désactivé. Contactez l\'administrateur.' 
      }
    }

    // Vérifier le mot de passe
    const isPasswordValid = await verifyPassword(password, user.password)
    
    if (!isPasswordValid) {
      await logLogin(user.id, false, 'Mot de passe incorrect')
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
export async function logLogin(userId, success, reason = '') {
  try {
    await supabase
      .from('login_logs')
      .insert({
        user_id: userId,
        success: success,
        login_time: new Date().toISOString(),
        reason: reason || (success ? 'Connexion réussie' : 'Échec de connexion')
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

    // Vérifier si l'utilisateur est actif
    if (!user.is_active) {
      // Déconnecter automatiquement si l'utilisateur est inactif
      logoutUser()
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

// Vérifier la session AVEC VÉRIFICATION D'ACTIVITÉ
export function checkAuth() {
  const token = localStorage.getItem('auth_token')
  const userData = localStorage.getItem('user_data')
  
  if (!token || !userData) {
    return null
  }

  try {
    const user = JSON.parse(userData)
    
    // VÉRIFICATION CRITIQUE : Si l'utilisateur est inactif dans localStorage
    if (!user.is_active) {
      // Déconnecter automatiquement
      logoutUser()
      return null
    }
    
    return user
  } catch (error) {
    return null
  }
}

// Vérification avancée avec appel à la BDD
export async function checkAuthWithVerification() {
  const user = checkAuth()
  
  if (!user) {
    return null
  }
  
  try {
    // Vérifier en base de données si l'utilisateur est toujours actif
    const { data: freshUser, error } = await supabase
      .from('users')
      .select('is_active')
      .eq('id', user.id)
      .single()

    if (error || !freshUser || !freshUser.is_active) {
      // Utilisateur désactivé en BDD
      logoutUser()
      return null
    }
    
    return user
  } catch (error) {
    console.error('Erreur vérification BDD:', error)
    return user // On retourne l'utilisateur du cache en cas d'erreur
  }
}

// Hook pour rediriger automatiquement les utilisateurs inactifs
export function useAuthProtection(router) {
  useEffect(() => {
    const user = checkAuth()
    
    if (!user) {
      router.push('/auth/login')
      return
    }
    
    // Si l'utilisateur est inactif, déconnecter et rediriger
    if (!user.is_active) {
      logoutUser()
      router.push('/auth/login')
    }
  }, [router])
}

// Fonction pour vérifier et rafraîchir l'état d'activité
export async function verifyUserActivity(userId) {
  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('is_active')
      .eq('id', userId)
      .single()

    if (error || !user) {
      return false
    }
    
    return user.is_active
  } catch (error) {
    console.error('Erreur vérification activité:', error)
    return false
  }
}