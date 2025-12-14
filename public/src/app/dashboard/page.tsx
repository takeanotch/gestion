// 'use client'
// import ProtectedRoute from '@/components/ProtectedRoute'
// import { useAuth } from '@/context/AuthContext'

// export default function Dashboard() {
//   const { user, signOut } = useAuth()

//   return (
//     <ProtectedRoute requiredRoles={['admin', 'editor']}>
//       <div className="max-w-4xl mx-auto mt-10">
//         <h1 className="text-2xl mb-4">Tableau de bord</h1>
//         <p>Bienvenue {user?.email} (Rôle: {user?.role})</p>
//         <button 
//           onClick={signOut} 
//           className="mt-4 p-2 bg-red-500 text-white rounded"
//         >
//           Déconnexion
//         </button>
//       </div>
//     </ProtectedRoute>
//   )
// }

// // app/dashboard/page.tsx
// 'use client'
// import { useEffect,useState } from 'react'
// import { useRouter } from 'next/navigation'
// import { supabase } from '@/lib/supabase/supabaseClient'
// import AdminDashboard from './_components/AdminDashboard'
// import EditorDashboard from './_components/EditorDashboard'
// import UserDashboard from './_components/UserDashboard'
// import LoadingSpinner from '@/components/Loader'
// import UserProfile from '@/components/UserProfile'

// export default function DashboardPage() {
//   const router = useRouter()
//   const [role, setRole] = useState<string | null>(null)
//   const [loading, setLoading] = useState(true)

//   useEffect(() => {
//     const fetchUserData = async () => {
//       const { data: { session }, error } = await supabase.auth.getSession()

//       if (!session || error) {
//         router.push('/login')
//         return
//       }

//       const { data: profile } = await supabase
//         .from('profiles')
//         .select('role')
//         .eq('id', session.user.id)
//         .single()

//       if (profile) {
//         setRole(profile.role)
//       } else {
//         router.push('/login?error=no_profile')
//       }
//       setLoading(false)
//     }

//     fetchUserData()
//   }, [router])

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <LoadingSpinner  />
//       </div>
//     )
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <header className="flex text-gray-400 justify-between items-center mb-8 p-4 bg-white rounded-lg shadow">
//         <h1 className="text-2xl font-bold">Tableau de Bord</h1>
//         <UserProfile/>
//       </header>
//       {role === 'admin' && <AdminDashboard />}
//       {role === 'editor' && <EditorDashboard />}
//       {role === 'user' && <UserDashboard />}
//     </div>
//   )
// }
// app/dashboard/page.tsx
'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/supabaseClient'
import AdminDashboard from './_components/AdminDashboard'
import EditorDashboard from './_components/EditorDashboard'
import UserDashboard from './_components/UserDashboard'
import LoadingSpinner from '@/components/Loader'
import UserProfile from '@/components/UserProfile'
import Image from 'next/image'
import { FiLogOut } from 'react-icons/fi'

export default function DashboardPage() {
  const router = useRouter()
  const [role, setRole] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUserData = async () => {
      const { data: { session }, error } = await supabase.auth.getSession()

      if (!session || error) {
        router.push('/login')
        return
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single()

      if (profile) {
        setRole(profile.role)
      } else {
        router.push('/login?error=no_profile')
      }
      setLoading(false)
    }

    fetchUserData()
  }, [router])

  const handleSignOut = async () => {
    setLoading(true)
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="flex text-gray-700 justify-between items-center mb-8 py-2 px-3 bg-white rounded-lg shadow">
        <h1 className="text-2xl font-bold">
             <div className="w-35 h-12 mb-5 relative">
        <Image
          src="/dgi.png" // Chemin vers votre logo
          alt="Company Logo"
          fill
          className="object-contain"
          priority
        />
      </div>
        </h1>
        <div className="flex items-center gap-4">
          <UserProfile />
         <button
  onClick={handleSignOut}
  className="flex items-center gap-1 text-bo font-bold px-2 py-2 text-sm font- rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors duration-200 "
>
  <FiLogOut className="text-gray-600" />
  <span>Logout</span>
</button>
        </div>
      </header>
      {role === 'admin' && <AdminDashboard />}
      {role === 'editor' && <EditorDashboard />}
      {role === 'user' && <UserDashboard />}
    </div>
  )
}