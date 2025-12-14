'use client'
import LoginForm from '@/components/LoginForm'
import { useAuth } from '@/context/AuthContext'
import Link from 'next/link'

export default function LoginPage() {
  const { user } = useAuth()

  if (user) {
    return (
      <div className="max-w-md mx-auto mt-10">
        <div>Vous êtes déjà connecté</div>
        <Link href="/dashboard" className="text-blue-500">
          Aller au tableau de bord
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto mt-5">
      <LoginForm />
      {/* <p className="mt-4">
        Pas encore de compte?{' '}
        <Link href="/signup" className="text-blue-500">
          S'inscrire
        </Link>
      </p> */}
    </div>
  )
}