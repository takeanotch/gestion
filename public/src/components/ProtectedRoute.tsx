'use client'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { UserRole } from '../types'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRoles?: UserRole[]
}

export default function ProtectedRoute({ children, requiredRoles = [] }: ProtectedRouteProps) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (loading) return

    if (!user) {
      router.push('/login')
    } else if (requiredRoles.length > 0 && !requiredRoles.includes(user.role)) {
      router.push('/unauthorized')
    }
  }, [user, loading, requiredRoles, router])

  if (loading || !user || (requiredRoles.length > 0 && !requiredRoles.includes(user.role))) {
    return <div>Chargement...</div>
  }

  return <>{children}</>
}