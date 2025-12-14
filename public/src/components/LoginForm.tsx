// 'use client'
// import { useState } from 'react'
// import { useAuth } from '../context/AuthContext'

// export default function LoginForm() {
//   const [email, setEmail] = useState('')
//   const [password, setPassword] = useState('')
//   const [error, setError] = useState<string | null>(null)
//   const { signIn } = useAuth()

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     try {
//       await signIn(email, password)
//     } catch (err) {
//       setError(err instanceof Error ? err.message : 'Une erreur est survenue')
//     }
//   }

//   return (
//     <form onSubmit={handleSubmit} className="flex flex-col gap-4">
//       {error && <div className="text-red-500">{error}</div>}
//       <input
//         type="email"
//         value={email}
//         onChange={(e) => setEmail(e.target.value)}
//         placeholder="Email"
//         required
//         className="p-2 border rounded"
//       />
//       <input
//         type="password"
//         value={password}
//         onChange={(e) => setPassword(e.target.value)}
//         placeholder="Mot de passe"
//         required
//         className="p-2 border rounded"
//       />
//       <button type="submit" className="p-2 bg-blue-500 text-white rounded">
//         Se connecter
//       </button>
//     </form>
//   )
// }


// 'use client'
// import { useState } from 'react'
// import { useAuth } from '../context/AuthContext'
// import { useRouter } from 'next/navigation'

// export default function LoginForm() {
//   const [email, setEmail] = useState('demo@example.com') // Valeur par défaut pour tester rapidement
//   const [password, setPassword] = useState('demo123') // Valeur par défaut pour tester rapidement
//   const [error, setError] = useState<string | null>(null)
//   const [isLoading, setIsLoading] = useState(false)
//   const { signIn } = useAuth()
//   const router = useRouter()

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setIsLoading(true)
//     setError(null)
    
//     try {
//       await signIn(email, password)
//       router.push('/dashboard') // Redirection après connexion réussie
//     } catch (err) {
//       setError(err instanceof Error ? err.message : 'Identifiants incorrects')
//       setIsLoading(false)
//     }
//   }

//   const handleDemoLogin = async () => {
//     setIsLoading(true)
//     setError(null)
    
//     try {
//       await signIn('demo@example.com', 'demo123')
//       router.push('/dashboard')
//     } catch (err) {
//       setError('Impossible de se connecter avec le compte démo')
//       setIsLoading(false)
//     }
//   }

//   return (
//     <div className="space-y-4">
//       <form onSubmit={handleSubmit} className="flex flex-col gap-4">
//         {error && (
//           <div className="p-3 bg-red-100 text-red-700 rounded-md">
//             {error}
//           </div>
//         )}
        
//         <div>
//           <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
//             Email
//           </label>
//           <input
//             id="email"
//             type="email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             placeholder="Email"
//             required
//             className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//           />
//         </div>
        
//         <div>
//           <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
//             Mot de passe
//           </label>
//           <input
//             id="password"
//             type="password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             placeholder="Mot de passe"
//             required
//             className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//           />
//         </div>
        
//         <button
//           type="submit"
//           disabled={isLoading}
//           className={`p-2 text-white rounded-md flex justify-center items-center ${
//             isLoading ? 'bg-blue-400' : 'bg-blue-500 hover:bg-blue-600'
//           }`}
//         >
//           {isLoading ? (
//             <>
//               <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                 <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                 <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//               </svg>
//               Connexion...
//             </>
//           ) : 'Se connecter'}
//         </button>
//       </form>
      
//       <div className="relative my-6">
//         <div className="absolute inset-0 flex items-center">
//           <div className="w-full border-t border-gray-300"></div>
//         </div>
//         <div className="relative flex justify-center text-sm">
//           <span className="px-2 bg-white text-gray-500">OU</span>
//         </div>
//       </div>
      
//       <button
//         onClick={handleDemoLogin}
//         disabled={isLoading}
//         className="w-full p-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:bg-green-400 flex justify-center items-center"
//       >
//         {isLoading ? 'Connexion...' : 'Connexion rapide avec compte démo'}
//       </button>
      
//       <div className="text-sm text-center pt-4">
//         <a href="/forgot-password" className="text-blue-500 hover:text-blue-700">
//           Mot de passe oublié ?
//         </a>
//       </div>
//     </div>
//   )
// }


'use client'
import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { signIn } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    
    try {
      await signIn(email, password)
      router.push('/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Email ou mot de passe incorrect')
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center bg-white py-5 px-4 sm:px-6 lg:px-8">
      {/* Logo - Remplacez par votre logo */}
      {/* <div className="w-40 h-20 mb-5 relative">
        <Image
          src="/dgi.png" // Chemin vers votre logo
          alt="Company Logo"
          fill
          className="object-contain"
          priority
        />
      </div> */}

      {/* Carte de connexion */}
      <div className="w-full max-w-md border border-gray-200 rounded-lg p-8 sm:p-10">
          <div className="w-40 mx-auto h-20 mb-5 relative">
        <Image
          src="/dgi.png" // Chemin vers votre logo
          alt="Company Logo"
          fill
          className="object-contain"
          priority
        />
      </div>
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Connexion</h1>
          <p className="mt-2 text-sm text-gray-500">Utilisez votre compte d'entreprise</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-md border border-red-100 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
              className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mot de passe"
              required
              className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 text-gray-600">
                Se souvenir de moi
              </label>
            </div>
            <a href="#" className="text-blue-600 hover:text-blue-500">
              Mot de passe oublié ?
            </a>
          </div>

          <div className="space-y-4">
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                isLoading ? 'opacity-75 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Connexion...
                </>
              ) : 'Se connecter'}
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Ou</span>
              </div>
            </div>

            <button
              type="button"
              className="w-full flex justify-center items-center py-2.5 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.545 10.239v3.821h5.445c-0.712 2.315-2.647 3.972-5.445 3.972-3.332 0-6.033-2.701-6.033-6.032s2.701-6.032 6.033-6.032c1.498 0 2.866 0.549 3.921 1.453l2.814-2.814c-1.784-1.664-4.153-2.675-6.735-2.675-5.522 0-10 4.477-10 10s4.478 10 10 10c8.396 0 10-7.524 10-10 0-0.668-0.069-1.325-0.189-1.961h-9.811z" />
              </svg>
              Se connecter Comme visteur
            </button>
          </div>
        </form>
      </div>

      <div className="mt-8 text-center text-sm text-gray-500">
        <p>
          Pas encore de compte ?{' '}
          <a href="/signup" className="text-blue-600 hover:text-blue-500">
            Créer un compte
          </a>
        </p>
      </div>
    </div>
  )
}