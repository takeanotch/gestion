// import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
// import { NextResponse } from 'next/server'

// export async function middleware(req) {
//   const res = NextResponse.next()
//   const supabase = createMiddlewareClient({ req, res })

//   const {
//     data: { user },
//   } = await supabase.auth.getUser()

//   // Redirect to login if not authenticated
//   if (!user) {
//     return NextResponse.redirect(new URL('/login', req.url))
//   }

//   // Check user role for protected routes
//   const { data: profile } = await supabase
//     .from('profiles')
//     .select('roles(name)')
//     .eq('id', user.id)
//     .single()

//   // Admin-only routes
//   if (req.nextUrl.pathname.startsWith('/admin') && profile?.roles?.name !== 'admin') {
//     return NextResponse.redirect(new URL('/unauthorized', req.url))
//   }

//   // Editor-only routes
//   if (req.nextUrl.pathname.startsWith('/editor') && 
//       !['admin', 'editor'].includes(profile?.roles?.name)) {
//     return NextResponse.redirect(new URL('/unauthorized', req.url))
//   }

//   return res
// }

// export const config = {
//   matcher: [
//     '/dashboard',
//     '/admin/:path*',
//     '/editor/:path*',
//   ],
// }

// // middleware.ts
// import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
// import { NextResponse } from 'next/server'
// import type { NextRequest } from 'next/server'

// export async function middleware(request: NextRequest) {
//   const response = NextResponse.next()
//   const supabase = createMiddlewareClient({ req: request, res: response })

//   // 1. Vérification session
//   const { data: { session }, error: sessionError } = await supabase.auth.getSession()

//   if (!session || sessionError) {
//     return NextResponse.redirect(new URL('/login', request.url))
//   }

//   // 2. Vérification email confirmé (type-safe)
//   if (session.user && typeof session.user.email === 'string' && !session.user.email_confirmed_at) {
//     return NextResponse.redirect(
//       new URL(`/verify-email?email=${encodeURIComponent(session.user.email)}`, request.url)
//     )
//   }

//   // 3. Récupération rôle
//   const { data: profile, error: profileError } = await supabase
//     .from('profiles')
//     .select('role')
//     .eq('id', session.user.id)
//     .single()

//   if (!profile || profileError) {
//     return NextResponse.redirect(new URL('/login?error=profile_not_found', request.url))
//   }

//   // 4. Protection des routes
//   const path = request.nextUrl.pathname
//   const role = profile.role

//   // Admin routes
//   if (path.startsWith('/admin') && role !== 'admin') {
//     return NextResponse.redirect(new URL('/unauthorized', request.url))
//   }

//   // Editor routes
//   if (path.startsWith('/editor') && !['admin', 'editor'].includes(role)) {
//     return NextResponse.redirect(new URL('/unauthorized', request.url))
//   }

//   return response
// }

// export const config = {
//   matcher: [
//     '/dashboard/:path*',
//     '/admin/:path*',
//     '/editor/:path*',
//     '/profile/:path*'
//   ]
// }

// middleware.ts
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'


export async function middleware(request: NextRequest) {
  const response = NextResponse.next()
  const supabase = createMiddlewareClient({ req: request, res: response })
  
  // Forcer la récupération de session sans vérification
  await supabase.auth.getSession()
  
  return response
}