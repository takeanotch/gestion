// components/UserProfile.tsx
'use client'
import { useAuth } from '@/context/AuthContext'

export default function UserProfile() {
  const { user } = useAuth()

  if (!user) return (
    <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
  )

  // Crée un nom d'affichage à partir de l'email si aucun nom n'est disponible
  const displayName = user.email?.split('@')[0] || 'Utilisateur'

  return (
    <div className="flex items-center gap-3">
      {/* Avatar avec initiale */}
      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-500 text-white font-medium">
        {displayName.charAt(0).toUpperCase()}
      </div>

      {/* Infos utilisateur */}
      <div>
        <p className="font-medium">{displayName}</p>
        <p className="text-xs text-gray-500 capitalize">
          {user.role || 'user'}
        </p>
      </div>
    </div>
  )
}