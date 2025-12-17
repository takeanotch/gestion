// // // // app/layout.tsx
// // // 'use client'
// // // import { useState,useEffect } from 'react';
// // // import { Inter } from 'next/font/google';
// // // import './globals.css';
// // // import Sidebar from '@/components/SideBar';
// // // const inter = Inter({ subsets: ['latin'] });



// // // export default function RootLayout({
// // //   children,
// // // }: {
// // //   children: React.ReactNode;
// // // }) 
// // // {
// // //   const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
// // //   const [isMobile, setIsMobile] = useState(false);
// // //    useEffect(() => {
// // //     const checkMobile = () => {
// // //       setIsMobile(window.innerWidth < 768);
// // //     };

// // //     checkMobile();
// // //     window.addEventListener('resize', checkMobile);
    
// // //     return () => window.removeEventListener('resize', checkMobile);
// // //   }, []);
// // //   return (

// // //       <html lang="fr" >
// // //         <body className="flex min-h-screen bg-white">
// // //       <Sidebar onCollapse={setSidebarCollapsed}/>
// // //     <main className={`flex-1 transition-all duration-300 overflow-auto  ${isMobile ? 'ml-0' : sidebarCollapsed ? 'ml-20' : 'ml-64'}
// // //           `}>
            
            
// // //              <div className="pt-4">
// // //               {children}
// // //             </div>
// // //       </main>
// // //       </body>
// // //     </html>
// // //   );
// // // }

// // 'use client'

// // import { useState, useEffect } from 'react'
// // import './globals.css'
// // import Sidebar from '@/components/SideBar'
// // import { useRouter, usePathname } from 'next/navigation'
// // import { checkAuth } from '@/lib/auth'

// // export default function RootLayout({ children }) {
// //   const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
// //   const [isMobile, setIsMobile] = useState(false)
// //   const [isLoading, setIsLoading] = useState(true)
// //   const router = useRouter()
// //   const pathname = usePathname()

// //   useEffect(() => {
// //     // Vérifier la taille de l'écran
// //     const checkMobile = () => {
// //       setIsMobile(window.innerWidth < 768)
// //     }

// //     checkMobile()
// //     window.addEventListener('resize', checkMobile)

// //     // Vérifier l'authentification
// //     const verifyAuth = async () => {
// //       const user = checkAuth()
      
// //       // Routes publiques (pas besoin d'authentification)
// //       const publicRoutes = ['/auth/login', '/auth/register', '/']
      
// //       if (!publicRoutes.includes(pathname)) {
// //         // Si pas connecté et pas sur une route publique, rediriger vers login
// //         if (!user) {
// //           router.push('/auth/login')
// //           return
// //         }

// //         // Vérifier les permissions selon le rôle
// //         const allowedRoutes = {
// //           'super-admin': ['/super-admin', '/admin', '/vendor', '/profile', '/dashboard'],
// //           'admin': ['/admin', '/vendor', '/profile', '/dashboard'],
// //           'vendor': ['/vendor', '/profile']
// //         }

// //         const userRoutes = allowedRoutes[user.role] || []
// //         const isAllowed = userRoutes.some(route => pathname.startsWith(route))

// //         if (!isAllowed) {
// //           // Redirection selon le rôle
// //           const redirectMap = {
// //             'super-admin': '/super-admin',
// //             'admin': '/admin',
// //             'vendor': '/vendor'
// //           }
          
// //           router.push(redirectMap[user.role] || '/')
// //           return
// //         }
// //       }

// //       setIsLoading(false)
// //     }

// //     verifyAuth()

// //     return () => window.removeEventListener('resize', checkMobile)
// //   }, [pathname, router])

// //   // Si loading, afficher un spinner
// //   if (isLoading) {
// //     return (
// //       <html lang="fr">
// //         <body className="flex items-center justify-center min-h-screen bg-gray-50">
// //           <div className="text-center">
// //             <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
// //             <p className="mt-4 text-gray-600">Chargement...</p>
// //           </div>
// //         </body>
// //       </html>
// //     )
// //   }

// //   // Ne pas afficher la sidebar sur la page de login
// //   const hideSidebarRoutes = ['/auth/login', '/auth/register']
// //   const showSidebar = !hideSidebarRoutes.includes(pathname)

// //   return (
// //     <html lang="fr">
// //       <body className="flex min-h-screen bg-white">
// //         {showSidebar && (
// //           <Sidebar onCollapse={setSidebarCollapsed} />
// //         )}
        
// //         <main className={`
// //           flex-1 transition-all duration-300 overflow-auto
// //           ${showSidebar ? (isMobile ? 'ml-0' : sidebarCollapsed ? 'ml-20' : 'ml-64') : ''}
// //         `}>
// //           <div className="p-4 md:p-6">
// //             {children}
// //           </div>
// //         </main>
// //       </body>
// //     </html>
// //   )
// // }


// 'use client'

// import { useState, useEffect } from 'react'
// import './globals.css'
// import Sidebar from '@/components/SideBar'
// import TopBar from '@/components/TopBar' // Importez la top bar
// import { useRouter, usePathname } from 'next/navigation'
// import { checkAuth } from '@/lib/auth'

// export default function RootLayout({ children }) {
//   const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
//   const [isMobile, setIsMobile] = useState(false)
//   const [isLoading, setIsLoading] = useState(true)
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
//   const router = useRouter()
//   const pathname = usePathname()

//   useEffect(() => {
//     const checkMobile = () => {
//       setIsMobile(window.innerWidth < 768)
//       if (window.innerWidth >= 768) {
//         setMobileMenuOpen(false)
//       }
//     }

//     checkMobile()
//     window.addEventListener('resize', checkMobile)

//     const verifyAuth = async () => {
//       const user = checkAuth()
      
//       const publicRoutes = ['/auth/login', '/auth/register', '/']
      
//       if (!publicRoutes.includes(pathname)) {
//         if (!user) {
//           router.push('/auth/login')
//           return
//         }

//         const allowedRoutes = {
//           'super-admin': ['/super-admin', '/admin', '/vendor', '/profile', '/dashboard'],
//           'admin': ['/admin', '/vendor', '/profile', '/dashboard'],
//           'vendor': ['/vendor', '/profile']
//         }

//         const userRoutes = allowedRoutes[user.role] || []
//         const isAllowed = userRoutes.some(route => pathname.startsWith(route))

//         if (!isAllowed) {
//           const redirectMap = {
//             'super-admin': '/super-admin',
//             'admin': '/admin',
//             'vendor': '/vendor'
//           }
          
//           router.push(redirectMap[user.role] || '/')
//           return
//         }
//       }

//       setIsLoading(false)
//     }

//     verifyAuth()

//     return () => window.removeEventListener('resize', checkMobile)
//   }, [pathname, router])

//   if (isLoading) {
//     return (
//       <html lang="fr">
//         <body className="flex items-center justify-center min-h-screen bg-gray-50">
//           <div className="text-center">
//             <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
//             <p className="mt-4 text-gray-600">Chargement...</p>
//           </div>
//         </body>
//       </html>
//     )
//   }

//   const hideSidebarRoutes = ['/auth/login', '/auth/register']
//   const showSidebar = !hideSidebarRoutes.includes(pathname)

//   return (
//     <html lang="fr">
//       <body className="flex min-h-screen bg-white dark:bg-gray-900">
//         {showSidebar && (
//           <>
//             <Sidebar 
//               onCollapse={setSidebarCollapsed} 
//             />
            
//             {/* Overlay mobile */}
//             {mobileMenuOpen && isMobile && (
//               <div
//                 className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
//                 onClick={() => setMobileMenuOpen(false)}
//               />
//             )}
//           </>
//         )}
        
//         <div className={`
//           flex-1 flex flex-col transition-all duration-300
//           ${showSidebar ? (isMobile ? 'pl-0' : sidebarCollapsed ? 'pl-16' : 'pl-64') : ''}
//         `}>
//           {showSidebar && (
//             <TopBar 
//               sidebarCollapsed={sidebarCollapsed}
//               isMobile={isMobile}
//               onMenuClick={() => setMobileMenuOpen(!mobileMenuOpen)}
//             />
//           )}
          
//           <main className="flex-1 overflow-auto">
//             <div className="">
//               {children}
//             </div>
//           </main>
//         </div>
//       </body>
//     </html>
//   )
// }
'use client'

import { useState, useEffect } from 'react'
import './globals.css'
import Sidebar from '@/components/SideBar'
import TopBar from '@/components/TopBar'
import { useRouter, usePathname } from 'next/navigation'
import { checkAuth } from '@/lib/auth'
import { LanguageProvider } from '@/contexts/LanguageContext'
export default function RootLayout({ children }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const router = useRouter()
  const pathname = usePathname()

  /* -------------------- RESPONSIVE -------------------- */
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      if (!mobile) setMobileMenuOpen(false)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  /* -------------------- AUTH -------------------- */
  useEffect(() => {
    const verifyAuth = async () => {
      const user = checkAuth()

      const publicRoutes = ['/', '/auth/login', '/auth/register']
      if (publicRoutes.includes(pathname)) {
        return
      }

      if (!user) {
        router.push('/auth/login')
        return
      }

      const allowedRoutes = {
        'super-admin': ['/super-admin', '/admin', '/vendor', '/profile', '/dashboard'],
        admin: ['/admin', '/vendor', '/profile', '/dashboard'],
        vendor: ['/vendor', '/profile'],
      }

      const isAllowed = (allowedRoutes[user.role] || []).some(route =>
        pathname.startsWith(route)
      )

      if (!isAllowed) {
        const redirectMap = {
          'super-admin': '/super-admin',
          admin: '/admin',
          vendor: '/vendor',
        }
        router.push(redirectMap[user.role] || '/')
        return
      }

     
    }

    verifyAuth()
  }, [pathname, router])

  /* -------------------- LOADING -------------------- */
 
  /* -------------------- LAYOUT -------------------- */
  const hideSidebarRoutes = ['/auth/login', '/auth/register', '/']
  const showSidebar = !hideSidebarRoutes.includes(pathname)

  return (
    
    <html lang="fr">
      <body className="flex h-screen overflow-hidden bg-white dark:bg-gray-900">
<LanguageProvider>

        {/* SIDEBAR */}
        {showSidebar && (
          <Sidebar
            onCollapse={setSidebarCollapsed}
            isMobile={isMobile}
            mobileOpen={mobileMenuOpen}
            onCloseMobile={() => setMobileMenuOpen(false)}
          />
        )}

        {/* CONTENU */}
        <div
          className={`
            flex flex-col flex-1 transition-all overflow-auto duration-300
            ${showSidebar
              ? isMobile
                ? 'ml-0'
                : sidebarCollapsed
                  ? 'ml-20'
                  : 'ml-64'
              : ''}
          `}
        >
          {showSidebar && (
            <TopBar
              sidebarCollapsed={sidebarCollapsed}
              isMobile={isMobile}
              onMenuClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            />
          )}

          {/* UN SEUL SCROLL */}
          <main className="flex-1 overflow-auto overflow-x-hidden pb-9">
            
              {children}
         
          </main>
        </div>
</LanguageProvider>

      </body>
    </html>
  )
}
