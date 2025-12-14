'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/supabaseClient'
import { useAuth } from '@/context/AuthContext'
import type { UserProfile, UserRole } from '@/types'
import { FiAlertTriangle, FiLoader, FiShield, FiUser, FiEdit2 } from 'react-icons/fi'

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
  const [state, setState] = useState<{
    users: UserProfile[]
    loading: boolean
    error: string | null
  }>({
    users: [],
    loading: true,
    error: null
  })

  useEffect(() => {
    if (currentUser?.role !== 'admin') return

    const fetchUsers = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .order('created_at', { ascending: false })

        if (error) throw error
        setState(prev => ({ ...prev, users: data || [], error: null }))
      } catch (err) {
        setState(prev => ({
          ...prev,
          error: err instanceof Error ? err.message : 'Erreur de chargement'
        }))
      } finally {
        setState(prev => ({ ...prev, loading: false }))
      }
    }

    fetchUsers()
  }, [currentUser])

  const updateUserRole = async (userId: string, newRole: UserRole) => {
    try {
      setState(prev => ({ ...prev, loading: true }))
      
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userId)

      if (error) throw error

      setState(prev => ({
        ...prev,
        users: prev.users.map(user => 
          user.id === userId ? { ...user, role: newRole } : user
        ),
        error: null
      }))
    } catch (err) {
      setState(prev => ({
        ...prev,
        error: err instanceof Error ? err.message : 'Erreur de mise à jour'
      }))
    } finally {
      setState(prev => ({ ...prev, loading: false }))
    }
  }

  if (currentUser?.role !== 'admin') {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <FiShield className="w-12 h-12 text-red-500 mb-4" />
        <h2 className="text-xl font-semibold text-red-600">Accès non autorisé</h2>
        <p className="text-gray-600 mt-2">
          Cette page est réservée aux administrateurs uniquement.
        </p>
      </div>
    )
  }

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <FiUser className="w-6 h-6 text-blue-600" />
        <h1 className="text-2xl font-semibold text-gray-800">Gestion des Utilisateurs</h1>
      </div>
      
      {state.error && (
        <div className="mb-4 p-3 flex items-center gap-2 bg-red-50 text-red-700 rounded-lg border border-red-100">
          <FiAlertTriangle className="flex-shrink-0" />
          <span>{state.error}</span>
        </div>
      )}
      
      {state.loading ? (
        <div className="flex flex-col items-center justify-center py-12 gap-3 text-gray-500">
          <FiLoader className="w-8 h-8 animate-spin" />
          <span>Chargement des utilisateurs...</span>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rôle
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {state.users.map(user => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                      {user.role}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center gap-2">
                        <FiEdit2 className="text-gray-400" />
                        <select
                          value={user.role}
                          onChange={(e) => updateUserRole(user.id, e.target.value as UserRole)}
                          className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                          disabled={state.loading}
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
        </div>
      )}
    </div>
  )
}