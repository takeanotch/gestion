// // import { NextResponse } from 'next/server'

// // export function middleware(request) {
// //   const { pathname } = request.nextUrl
// //   const token = request.cookies.get('auth_token')?.value
// //   const userData = request.cookies.get('user_data')?.value

// //   let user = null
// //   if (userData) {
// //     try {
// //       user = JSON.parse(userData)
// //     } catch (error) {
// //       // Invalid user data
// //     }
// //   }

// //   // Routes publiques
// //   const publicPaths = ['/auth/login', '/auth/register', '/']
  
// //   // Vérifier si c'est une route publique
// //   if (publicPaths.includes(pathname)) {
// //     return NextResponse.next()
// //   }

// //   // Vérifier l'authentification
// //   if (!token || !user) {
// //     const loginUrl = new URL('/auth/login', request.url)
// //     loginUrl.searchParams.set('redirect', pathname)
// //     return NextResponse.redirect(loginUrl)
// //   }

// //   // Vérifier les permissions par rôle
// //   if (pathname.startsWith('/super-admin') && user.role !== 'super-admin') {
// //     return NextResponse.redirect(new URL('/unauthorized', request.url))
// //   }

// //   if (pathname.startsWith('/admin') && !['super-admin', 'admin'].includes(user.role)) {
// //     return NextResponse.redirect(new URL('/unauthorized', request.url))
// //   }

// //   if (pathname.startsWith('/vendor') && !['super-admin', 'admin', 'vendor'].includes(user.role)) {
// //     return NextResponse.redirect(new URL('/unauthorized', request.url))
// //   }

// //   return NextResponse.next()
// // }

// // export const config = {
// //   matcher: [
// //     '/super-admin/:path*',
// //     '/admin/:path*',
// //     '/vendor/:path*',
// //     '/profile/:path*',
// //     '/dashboard/:path*',
// //     '/api/protected/:path*'
// //   ]
// // }

// import { NextResponse } from 'next/server'

// export function middleware(request) {
//   const { pathname } = request.nextUrl

//   const token = request.cookies.get('auth_token')?.value
//   const userData = request.cookies.get('user_data')?.value

//   let user = null

//   if (userData) {
//     try {
//       user = JSON.parse(decodeURIComponent(userData))
//     } catch (e) {
//       console.error('Cookie user_data invalide')
//     }
//   }

//   // Routes publiques
//   const publicPaths = ['/', '/auth/login', '/auth/register']
//   if (publicPaths.includes(pathname)) {
//     return NextResponse.next()
//   }

//   // Auth obligatoire
//   if (!token || !user) {
//     const loginUrl = new URL('/auth/login', request.url)
//     loginUrl.searchParams.set('redirect', pathname)
//     return NextResponse.redirect(loginUrl)
//   }

//   // Profil → OK pour tous
//   if (pathname.startsWith('/profile')) {
//     return NextResponse.next()
//   }

//   // Products → OK pour tous
//   if (
//     pathname.startsWith('/products') ||
//     pathname.startsWith('/dashboard/products') ||
//     pathname.startsWith('/vendor/products')
//   ) {
//     return NextResponse.next()
//   }

//   // Super admin uniquement
//   if (pathname.startsWith('/super-admin') && user.role !== 'super-admin') {
//     return NextResponse.redirect(new URL('/unauthorized', request.url))
//   }

//   // Admin
//   if (
//     pathname.startsWith('/admin') &&
//     !['admin', 'super-admin'].includes(user.role)
//   ) {
//     return NextResponse.redirect(new URL('/unauthorized', request.url))
//   }

//   // Vendor
//   if (
//     pathname.startsWith('/vendor') &&
//     !['vendor', 'admin', 'super-admin'].includes(user.role)
//   ) {
//     return NextResponse.redirect(new URL('/unauthorized', request.url))
//   }

//   return NextResponse.next()
// }

// export const config = {
//   matcher: [
//     '/super-admin/:path*',
//     '/admin/:path*',
//     '/vendor/:path*',
//     '/profile/:path*',
//     '/dashboard/:path*',
//     '/products/:path*'
//   ]
// }
import { NextResponse } from 'next/server'

export function middleware(request) {
  // Récupération simple des données sans traitement
  const token = request.cookies.get('auth_token')?.value
  const userData = request.cookies.get('user_data')?.value
  
  // Initialisation utilisateur neutre
  let user = null
  
  if (userData) {
    try {
      // Parsing simple sans vérification
      user = JSON.parse(decodeURIComponent(userData))
    } catch (e) {
      // Pas de log, pas d'erreur
    }
  }
  
  // Ajout des informations d'auth aux headers pour usage optionnel
  const requestHeaders = new Headers(request.headers)
  
  if (token) {
    requestHeaders.set('x-auth-token', token)
  }
  
  if (user) {
    requestHeaders.set('x-auth-user', JSON.stringify(user))
  }
  
  // Création de la réponse avec headers modifiés
  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })
  
  // Retour simple sans redirection ni restriction
  return response
}

export const config = {
  matcher: [
    // Pas de restriction, toutes les pages peuvent être matchées
    // ou un chemin spécifique si nécessaire
    '/:path*'
  ]
}