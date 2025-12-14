// app/verify-email/page.tsx
'use client'
import { useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase/supabaseClient'

export default function VerifyEmailPage() {
  const params = useSearchParams()
  const email = params.get('email')

  const resendEmail = async () => {
    await supabase.auth.resend({
      type: 'signup',
      email: email!,
      options: { emailRedirectTo: `${location.origin}/auth/confirm` }
    })
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Vérifiez votre email</h1>
      <p>Un lien a été envoyé à <strong>{email}</strong></p>
      
      <button
        onClick={resendEmail}
        className="w-full mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
      >
        Renvoyer le lien
      </button>
    </div>
  )
}