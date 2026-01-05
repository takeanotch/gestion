// 'use client'

// import { useState } from 'react'
// import { useRouter } from 'next/navigation'
// import { authenticateUser } from '@/lib/auth'
// import Link from 'next/link'

// export default function LoginPage() {
//   const [email, setEmail] = useState('')
//   const [password, setPassword] = useState('')
//   const [error, setError] = useState('')
//   const [loading, setLoading] = useState(false)
//   const router = useRouter()

//   const handleSubmit = async (e) => {
//     e.preventDefault()
//     setError('')
//     setLoading(true)

//     const result = await authenticateUser(email, password)

//     if (result.success) {
//       // Stocker les données utilisateur
//       localStorage.setItem('auth_token', 'authenticated')
//       localStorage.setItem('user_data', JSON.stringify(result.user))

//       // Redirection basée sur le rôle
//       const redirectPath = getRoleRedirect(result.user.role)
//       router.push(redirectPath)
//     } else {
//       setError(result.message)
//       setLoading(false)
//     }
//   }

//   const getRoleRedirect = (role) => {
//     const redirects = {
//       'super-admin': '/super-admin',
//       'admin': '/admin',
//       'vendor': '/vendor'
//     }
//     return redirects[role] || '/'
//   }

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100">
//       <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
//         <div className="text-center mb-8">
//           <h1 className="text-3xl font-bold text-gray-800 mb-2">
//             Shop Management
//           </h1>
//           <p className="text-gray-600">Connectez-vous à votre compte</p>
//         </div>

//         {error && (
//           <div className="bg-red-50 text-red-700 p-3 rounded-md mb-4">
//             {error}
//           </div>
//         )}

//         <form onSubmit={handleSubmit}>
//           <div className="mb-4">
//             <label className="block text-gray-700 text-sm font-medium mb-2">
//               Email
//             </label>
//             <input
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               placeholder="votre@email.com"
//               required
//             />
//           </div>

//           <div className="mb-6">
//             <label className="block text-gray-700 text-sm font-medium mb-2">
//               Mot de passe
//             </label>
//             <input
//               type="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               placeholder="Votre mot de passe"
//               required
//             />
//           </div>

//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
//           >
//             {loading ? 'Connexion...' : 'Se connecter'}
//           </button>
//         </form>

//         <div className="mt-6 pt-6 border-t border-gray-200">
//           <p className="text-sm text-gray-600 text-center">
//             Comptes de démonstration :
//           </p>
//           <div className="mt-2 space-y-1 text-sm">
//             <p><span className="font-medium">Super Admin:</span> nzana@gmail.com / 123Nzana</p>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { authenticateUser } from '@/lib/auth'
import ShopLogo from '@/components/shop/ShopLogo'
import { useShop } from '@/hooks/useShop';
export default function LoginPage() {
     const { shop } = useShop();
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
      localStorage.setItem('auth_token', 'authenticated')
      localStorage.setItem('user_data', JSON.stringify(result.user))

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white px-4">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto w-max">
           <ShopLogo shop={shop} size={100} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Shop Management
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Système de gestion professionnelle
          </p>
        </div>

        {/* Form Container */}
        <div className="space-y-6">
          {error && (
            <div className="px-4 py-3 text-sm text-red-700 bg-red-50 border border-red-100 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                Adresse email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition"
                placeholder="admin@entreprise.com"
                required
              />
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                Mot de passe
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition"
                placeholder="••••••••"
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 text-sm font-semibold text-white bg-gray-900 rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Connexion en cours...
                </span>
              ) : (
                'Se connecter'
              )}
            </button>
          </form>

          {/* Demo Account */}
          <div className="pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              <span className="font-medium">Compte démo :</span> nzana@gmail.com / 123Nzana
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center pt-4">
          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()} Shop Management. Tous droits réservés.
          </p>
        </div>
      </div>
    </div>
  )
}