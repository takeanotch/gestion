
// 'use client'
// import { useEffect } from 'react'
// import { useRouter, useSearchParams } from 'next/navigation'
// import { supabase } from '@/lib/supabase/supabaseClient'

// export default function ConfirmPage() {
//   const router = useRouter()
//   const params = useSearchParams()

//   useEffect(() => {
//     const confirmEmail = async () => {
//       const token_hash = params.get('token_hash')
//       const type = params.get('type')

//       if (!token_hash || type !== 'email') {
//         router.push('/login?error=invalid_token')
//         return
//       }

//       try {
//         const { error } = await supabase.auth.verifyOtp({
//           type: 'email',
//           token_hash
//         })

//         if (error) {
//           throw error
//         }

//         // Redirection après confirmation réussie
//         setTimeout(() => router.push('/dashboard'), 1000)
//       } catch (err) {
//         console.error('Confirmation error:', err)
        
//         // Gestion type-safe de l'erreur
//         const errorMessage = err instanceof Error 
//           ? err.message 
//           : 'Échec de la confirmation'
        
//         router.push(`/login?error=${encodeURIComponent(errorMessage)}`)
//       }
//     }

//     confirmEmail()
//   }, [params, router])

//   return (
//     <div className="flex items-center justify-center min-h-screen">
//       <div className="text-center p-6 bg-white rounded-lg shadow-md">
//         <h1 className="text-2xl font-bold mb-4">Validation en cours</h1>
//         <p>Veuillez patienter pendant la confirmation...</p>
//       </div>
//     </div>
//   )
// }
'use client'
import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase/supabaseClient'
import Image from 'next/image'
import { FiCheckCircle, FiAlertCircle, FiLoader } from 'react-icons/fi'

export default function ConfirmPage() {
  const router = useRouter()
  const params = useSearchParams()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    let timeoutId: NodeJS.Timeout

    const confirmEmail = async () => {
      const token_hash = params.get('token_hash')
      const type = params.get('type')

      if (!token_hash || type !== 'email') {
        setStatus('error')
        setErrorMessage('Token invalide ou manquant')
        timeoutId = setTimeout(() => router.push('/login?error=invalid_token'), 3000)
        return
      }

      try {
        const { error } = await supabase.auth.verifyOtp({
          type: 'email',
          token_hash
        })

        if (error) throw error

        setStatus('success')
        timeoutId = setTimeout(() => router.push('/dashboard'), 2000)
      } catch (err) {
        setStatus('error')
        const message = err instanceof Error ? err.message : 'Échec de la confirmation'
        setErrorMessage(message)
        console.error('Confirmation error:', err)
        
        timeoutId = setTimeout(() => {
          router.push(`/login?error=${encodeURIComponent(message)}`)
        }, 5000)
      }
    }

    // Délai artificiel pour éviter le flash d'écran si la confirmation est trop rapide
    const minLoadingTime = setTimeout(() => {
      confirmEmail()
    }, 500)

    return () => {
      clearTimeout(minLoadingTime)
      if (timeoutId) clearTimeout(timeoutId)
    }
  }, [params, router])

  const renderContent = () => {
    switch (status) {
      case 'success':
        return (
          <div className="text-center">
            <FiCheckCircle className="mx-auto h-12 w-12 text-green-500 mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Email confirmé avec succès !</h2>
            <p className="text-gray-600">Redirection en cours...</p>
          </div>
        )
      case 'error':
        return (
          <div className="text-center">
            <FiAlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Erreur de confirmation</h2>
            <p className="text-gray-600 mb-4">{errorMessage}</p>
            <p className="text-sm text-gray-500">Vous allez être redirigé vers la page de connexion</p>
          </div>
        )
      default:
        return (
          <div className="text-center">
            <FiLoader className="mx-auto h-12 w-12 text-blue-500 animate-spin mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Validation en cours</h2>
            <p className="text-gray-600">Veuillez patienter pendant la confirmation...</p>
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md mx-auto">
        {/* Logo - Même que dans le login */}
        <div className="w-40 mx-auto h-20 mb-8 relative">
          <Image
            src="/dgi.png"
            alt="Company Logo"
            fill
            className="object-contain"
            priority
          />
        </div>

        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
          {renderContent()}
        </div>

        {/* Footer avec informations utiles */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Si la redirection ne fonctionne pas, <a href="/login" className="text-blue-600 hover:underline">cliquez ici</a></p>
        </div>
      </div>
    </div>
  )
}