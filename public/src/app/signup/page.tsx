'use client'
import SignUpForm from '@/components/SignUpForm'
import { useAuth } from '@/context/AuthContext'
import Link from 'next/link'

export default function SignUpPage() {
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
    <div className="max-w-md mx-auto mt-10">
      <SignUpForm />
      {/* <p className="mt-4">
        Déjà un compte?{' '}
        <Link href="/login" className="text-blue-500">
          Se connecter
        </Link>
      </p> */}
    </div>
  )
}