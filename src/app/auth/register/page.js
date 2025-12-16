'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { hashPassword } from '@/lib/auth'

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    full_name: '',
    phone: '',
    shop_name: '',
    role: 'vendor', // Par défaut, les nouveaux s'inscrivent comme vendeurs
    address: ''
  })

  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
    
    // Effacer l'erreur quand l'utilisateur modifie le champ
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      })
    }
  }

  const validateForm = () => {
    const newErrors = {}

    // Validation de l'email
    if (!formData.email) {
      newErrors.email = 'L\'email est requis'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Format d\'email invalide'
    }

    // Validation du nom d'utilisateur
    if (!formData.username) {
      newErrors.username = 'Le nom d\'utilisateur est requis'
    } else if (formData.username.length < 3) {
      newErrors.username = 'Minimum 3 caractères'
    }

    // Validation du mot de passe
    if (!formData.password) {
      newErrors.password = 'Le mot de passe est requis'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Minimum 6 caractères'
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Doit contenir majuscule, minuscule et chiffre'
    }

    // Validation de la confirmation
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas'
    }

    // Validation du nom complet
    if (!formData.full_name) {
      newErrors.full_name = 'Le nom complet est requis'
    }

    // Validation du téléphone
    if (formData.phone && !/^[0-9+\s]+$/.test(formData.phone)) {
      newErrors.phone = 'Format de téléphone invalide'
    }

    // Validation du nom du magasin (obligatoire pour les vendeurs)
    if (formData.role === 'vendor' && !formData.shop_name) {
      newErrors.shop_name = 'Le nom du magasin est requis pour les vendeurs'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setLoading(true)
    setErrors({})

    try {
      // Vérifier si l'email existe déjà
      const { data: existingEmail } = await supabase
        .from('users')
        .select('email')
        .eq('email', formData.email)
        .single()

      if (existingEmail) {
        setErrors({ email: 'Cet email est déjà utilisé' })
        setLoading(false)
        return
      }

      // Vérifier si le username existe déjà
      const { data: existingUsername } = await supabase
        .from('users')
        .select('username')
        .eq('username', formData.username)
        .single()

      if (existingUsername) {
        setErrors({ username: 'Ce nom d\'utilisateur est déjà pris' })
        setLoading(false)
        return
      }

      // Hasher le mot de passe
      const hashedPassword = await hashPassword(formData.password)

      // Préparer les données pour l'insertion
      const userData = {
        username: formData.username,
        email: formData.email,
        password: hashedPassword,
        role: formData.role,
        full_name: formData.full_name,
        phone: formData.phone || null,
        address: formData.address || null,
        is_active: true // Les nouveaux comptes sont actifs par défaut
      }

      // Ajouter le shop_name seulement pour les vendeurs
      if (formData.role === 'vendor') {
        userData.shop_name = formData.shop_name
      }

      // Insérer l'utilisateur dans la base de données
      const { data: newUser, error } = await supabase
        .from('users')
        .insert([userData])
        .select()
        .single()

      if (error) {
        throw new Error(`Erreur lors de l'inscription: ${error.message}`)
      }

      // Enregistrer l'activité
      await supabase
        .from('user_activity')
        .insert({
          user_id: newUser.id,
          action_type: 'register',
          page_url: '/auth/register'
        })

      // Succès
      setSuccess(true)
      
      // Rediriger automatiquement après 3 secondes
      setTimeout(() => {
        router.push('/auth/login?registered=true')
      }, 3000)

    } catch (error) {
      console.error('Erreur inscription:', error)
      setErrors({ 
        general: error.message || 'Une erreur est survenue lors de l\'inscription' 
      })
    } finally {
      setLoading(false)
    }
  }

  // Si succès, afficher le message de confirmation
  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Inscription réussie !
          </h1>
          <p className="text-gray-600 mb-6">
            Votre compte a été créé avec succès.
            <br />
            Vous allez être redirigé vers la page de connexion...
          </p>
          <div className="animate-spin w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full mx-auto mb-6"></div>
          <Link
            href="/auth/login"
            className="inline-block px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
          >
            Se connecter maintenant
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Créer un compte
          </h1>
          <p className="text-gray-600">
            Rejoignez notre plateforme de gestion de magasin
          </p>
        </div>

        {errors.general && (
          <div className="bg-red-50 text-red-700 p-3 rounded-md mb-4">
            {errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Colonne gauche */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom dutilisateur *
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                    errors.username 
                      ? 'border-red-500 focus:ring-red-500' 
                      : 'border-gray-300 focus:ring-blue-500 focus:border-transparent'
                  }`}
                  placeholder="john_doe"
                />
                {errors.username && (
                  <p className="text-red-500 text-sm mt-1">{errors.username}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                    errors.email 
                      ? 'border-red-500 focus:ring-red-500' 
                      : 'border-gray-300 focus:ring-blue-500 focus:border-transparent'
                  }`}
                  placeholder="votre@email.com"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mot de passe *
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                    errors.password 
                      ? 'border-red-500 focus:ring-red-500' 
                      : 'border-gray-300 focus:ring-blue-500 focus:border-transparent'
                  }`}
                  placeholder="Votre mot de passe"
                />
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  Minimum 6 caractères avec majuscule, minuscule et chiffre
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirmer le mot de passe *
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                    errors.confirmPassword 
                      ? 'border-red-500 focus:ring-red-500' 
                      : 'border-gray-300 focus:ring-blue-500 focus:border-transparent'
                  }`}
                  placeholder="Confirmez votre mot de passe"
                />
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
                )}
              </div>
            </div>

            {/* Colonne droite */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom complet *
                </label>
                <input
                  type="text"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                    errors.full_name 
                      ? 'border-red-500 focus:ring-red-500' 
                      : 'border-gray-300 focus:ring-blue-500 focus:border-transparent'
                  }`}
                  placeholder="John Doe"
                />
                {errors.full_name && (
                  <p className="text-red-500 text-sm mt-1">{errors.full_name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Téléphone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                    errors.phone 
                      ? 'border-red-500 focus:ring-red-500' 
                      : 'border-gray-300 focus:ring-blue-500 focus:border-transparent'
                  }`}
                  placeholder="+33 1 23 45 67 89"
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type de compte
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="vendor">Vendeur (Magasin)</option>
                  <option value="admin">Administrateur (Sur invitation)</option>
                  <option value="super-admin">Super-admin</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  * Les comptes administrateur nécessitent une validation
                </p>
              </div>

              {formData.role === 'vendor' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nom du magasin *
                  </label>
                  <input
                    type="text"
                    name="shop_name"
                    value={formData.shop_name}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                      errors.shop_name 
                        ? 'border-red-500 focus:ring-red-500' 
                        : 'border-gray-300 focus:ring-blue-500 focus:border-transparent'
                    }`}
                    placeholder="Ma Boutique"
                  />
                  {errors.shop_name && (
                    <p className="text-red-500 text-sm mt-1">{errors.shop_name}</p>
                  )}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Adresse
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Adresse complète..."
                  rows="2"
                />
              </div>
            </div>
          </div>

          {/* Conditions d'utilisation */}
          <div className="mt-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                required
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">
                Jaccepte les{' '}
                <a href="/terms" className="text-blue-600 hover:underline">
                  conditions dutilisation
                </a>{' '}
                et la{' '}
                <a href="/privacy" className="text-blue-600 hover:underline">
                  politique de confidentialité
                </a>
              </span>
            </label>
          </div>

          {/* Bouton d'inscription */}
          <div className="mt-8">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200 font-medium"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Création du compte...
                </span>
              ) : (
                "S'inscrire"
              )}
            </button>
          </div>
        </form>

        {/* Lien vers la connexion */}
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Vous avez déjà un compte ?{' '}
            <Link 
              href="/auth/login" 
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Se connecter
            </Link>
          </p>
        </div>

        {/* Séparateur */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-600 text-center">
            Types de compte disponibles :
          </p>
          <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-3 bg-blue-50 rounded-lg">
              <div className="font-medium text-blue-700">Vendeur</div>
              <div className="text-xs text-blue-600">
                • Gestion de produits<br/>
                • Suivi des commandes<br/>
                • Statistiques de vente
              </div>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <div className="font-medium text-purple-700">Administrateur</div>
              <div className="text-xs text-purple-600">
                • Gestion des vendeurs<br/>
                • Supervision globale<br/>
                • Rapports détaillés
              </div>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <div className="font-medium text-green-700">Super Admin</div>
              <div className="text-xs text-green-600">
                • Gestion complète<br/>
                • Paramètres système<br/>
                • Sur invitation uniquement
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}