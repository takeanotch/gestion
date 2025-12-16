'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { authenticateUser } from '@/lib/auth'
import Link from 'next/link'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const result = await authenticateUser(email, password)

    if (result.success) {
      // Stocker les données utilisateur
      localStorage.setItem('auth_token', 'authenticated')
      localStorage.setItem('user_data', JSON.stringify(result.user))

      // Redirection basée sur le rôle
      const redirectPath = getRoleRedirect(result.user.role)
      router.push(redirectPath)
    } else {
      setError(result.message)
      setLoading(false)
    }
  }

  const getRoleRedirect = (role) => {
    const redirects = {
      'super-admin': '/super-admin',
      'admin': '/admin',
      'vendor': '/vendor'
    }
    return redirects[role] || '/'
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Shop Management
          </h1>
          <p className="text-gray-600">Connectez-vous à votre compte</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-700 p-3 rounded-md mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="votre@email.com"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Mot de passe
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Votre mot de passe"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
          >
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-600 text-center">
            Comptes de démonstration :
          </p>
          <div className="mt-2 space-y-1 text-sm">
            <p><span className="font-medium">Super Admin:</span> superadmin@shop.com / superadmin123</p>
            <p><span className="font-medium">Admin:</span> admin1@shop.com / admin123</p>
            <p><span className="font-medium">Vendor:</span> vendor1@shop.com / vendor123</p>
          </div>
        </div>
      </div>
    </div>
  )
}