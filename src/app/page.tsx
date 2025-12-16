// // app/page.tsx
// export default function Home() {
//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
//       {/* En-tête */}


//       {/* Pied de page */}
//       <footer className="mt-12 pt-8 border-t border-gray-200">
//         <div className="text-center text-gray-500 text-sm">
//           <p>© {new Date().getFullYear()} Votre Application. Tous droits réservés.</p>
//           <p className="mt-2">
//             Design créé avec ❤️ et{" "}
//             <span className="text-blue-500 font-semibold">Tailwind CSS</span>
//           </p>
//         </div>
//       </footer>
//     </div>
//   );
// }
'use client'
// pages/index.jsx ou app/page.jsx (selon votre structure)
import { useEffect } from 'react'
import { useRouter } from 'next/navigation' // Pour Next.js 13+ App Router
// ou import { useRouter } from 'next/router' // Pour Pages Router
import { checkAuth, getRoleRedirect } from '@/lib/auth'

export default function HomePage() {
  const router = useRouter()

  useEffect(() => {
    // Vérifier si l'utilisateur est connecté
    const user = checkAuth()
    
    if (!user) {
      // Si non connecté, rediriger vers la page de login
      router.push('/auth/login')
    } else {
      // Si connecté, rediriger vers le dashboard selon le rôle
      const redirectPath = getRoleRedirect(user.role)
      router.push(redirectPath)
    }
  }, [router])

  // Pendant la vérification/redirection, afficher un loader
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      flexDirection: 'column',
      gap: '20px'
    }}>
      <div>Vérification de authentification...</div>
      <div style={{ fontSize: '14px', color: '#666' }}>
        Redirection en cours...
      </div>
    </div>
  )
}