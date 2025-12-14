// 'use client'
// import { useEffect, useState } from 'react'
// import { supabase } from '@/lib/supabase/supabaseClient'
// import { useAuth } from '@/context/AuthContext'
// import type { UserProfile, UserRole } from '@/types'

// export default function AdminUsersPage() {
//   const { user: currentUser } = useAuth()
//   const [users, setUsers] = useState<UserProfile[]>([])
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState<string | null>(null)

//   useEffect(() => {
//     if (currentUser?.role !== 'admin') return

//     const fetchUsers = async () => {
//       try {
//         const { data, error } = await supabase
//           .from('profiles')
//           .select('*')
//           .order('created_at', { ascending: false })

//         if (error) throw error
//         setUsers(data || [])
//       } catch (err) {
//         setError(err instanceof Error ? err.message : 'Erreur de chargement')
//       } finally {
//         setLoading(false)
//       }
//     }

//     fetchUsers()
//   }, [currentUser])

//   const updateUserRole = async (userId: string, newRole: UserRole) => {
//     try {
//       setLoading(true)
//       const { error } = await supabase
//         .from('profiles')
//         .update({ role: newRole })
//         .eq('id', userId)

//       if (error) throw error

//       // Mettre à jour le state local
//       setUsers(users.map(user => 
//         user.id === userId ? { ...user, role: newRole } : user
//       ))
//     } catch (err) {
//       setError(err instanceof Error ? err.message : 'Erreur de mise à jour')
//     } finally {
//       setLoading(false)
//     }
//   }

//   if (currentUser?.role !== 'admin') {
//     return <div className="p-4 text-red-500">Accès réservé aux administrateurs</div>
//   }

//   return (
//     <div className="p-4">
//       <h1 className="text-2xl font-bold mb-4">Gestion des Utilisateurs</h1>
      
//       {error && <div className="mb-4 p-2 bg-red-100 text-red-700">{error}</div>}
      
//       {loading ? (
//         <p>Chargement...</p>
//       ) : (
//         <div className="overflow-x-auto">
//           <table className="min-w-full bg-white">
//             <thead>
//               <tr className="bg-gray-100">
//                 <th className="py-2 px-4 border">Email</th>
//                 <th className="py-2 px-4 border">Rôle Actuel</th>
//                 <th className="py-2 px-4 border">Nouveau Rôle</th>
//                 <th className="py-2 px-4 border">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {users.map(user => (
//                 <tr key={user.id} className="hover:bg-gray-50">
//                   <td className="py-2 px-4 border">{user.email}</td>
//                   <td className="py-2 px-4 border capitalize">{user.role}</td>
//                   <td className="py-2 px-4 border">
//                     <select
//                       value={user.role}
//                       onChange={(e) => updateUserRole(user.id, e.target.value as UserRole)}
//                       className="p-1 border rounded"
//                       disabled={loading}
//                     >
//                       {['user', 'editor', 'admin'].map((role) => (
//                         <option key={role} value={role}>
//                           {role}
//                         </option>
//                       ))}
//                     </select>
//                   </td>
//                   <td className="py-2 px-4 border">
//                     <button
//                       onClick={() => updateUserRole(user.id, user.role)}
//                       className="bg-blue-500 text-white px-3 py-1 rounded disabled:opacity-50"
//                       disabled={loading}
//                     >
//                       Appliquer
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   )
// }
'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/supabaseClient'
import { useAuth } from '@/context/AuthContext'
import type { UserProfile, UserRole } from '@/types'

const ROLES: UserRole[] = [
  'admin',
  'gestionnaire',
  'verificateur',
  'user',
  'entreprise',
  'dgm',
  'itravail',
  'igeneral',
  'cnss'
]

export default function AdminUsersPage() {
  const { user: currentUser } = useAuth()
  const [users, setUsers] = useState<UserProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (currentUser?.role !== 'user') return

    const fetchUsers = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .order('created_at', { ascending: false })

        if (error) throw error
        setUsers(data || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur de chargement')
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [currentUser])

  const updateUserRole = async (userId: string, newRole: UserRole) => {
    try {
      setLoading(true)
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userId)

      if (error) throw error

      setUsers(users.map(user => 
        user.id === userId ? { ...user, role: newRole } : user
      ))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur de mise à jour')
    } finally {
      setLoading(false)
    }
  }

  if (currentUser?.role !== 'user') {
    return <div className="p-4 text-red-500">Accès réservé aux administrateurs</div>
  }

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h1 className="text-xl font-semibold mb-4">Gestion des Utilisateurs</h1>
      
      {error && (
        <div className="mb-4 p-2 bg-red-100 text-red-700 rounded text-sm">
          {error}
        </div>
      )}
      
      {loading ? (
        <div className="text-center py-8">Chargement en cours...</div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rôle</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.map(user => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm">{user.email}</td>
                  <td className="px-4 py-3 text-sm capitalize">{user.role}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <select
                        value={user.role}
                        onChange={(e) => updateUserRole(user.id, e.target.value as UserRole)}
                        className="text-sm border rounded px-2 py-1"
                        disabled={loading}
                      >
                        {ROLES.map((role) => (
                          <option key={role} value={role}>
                            {role}
                          </option>
                        ))}
                      </select>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}