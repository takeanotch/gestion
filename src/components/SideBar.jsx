
// // // // 'use client'

// // // // import { useState, useEffect } from 'react'
// // // // import Link from 'next/link'
// // // // import { usePathname, useRouter } from 'next/navigation'
// // // // import { checkAuth } from '@/lib/auth'

// // // // export default function Sidebar({ onCollapse }) {
// // // //   const [collapsed, setCollapsed] = useState(false)
// // // //   const [user, setUser] = useState(null)
// // // //   const pathname = usePathname()
// // // //   const router = useRouter()

// // // //   useEffect(() => {
// // // //     const currentUser = checkAuth()
// // // //     setUser(currentUser)
    
// // // //     // Vérifier si l'utilisateur est connecté
// // // //     if (!currentUser) {
// // // //       router.push('/auth/login')
// // // //     }
// // // //   }, [router])

// // // //   const toggleSidebar = () => {
// // // //     const newState = !collapsed
// // // //     setCollapsed(newState)
// // // //     onCollapse(newState)
// // // //   }

// // // //   const handleLogout = () => {
// // // //     localStorage.removeItem('auth_token')
// // // //     localStorage.removeItem('user_data')
// // // //     router.push('/auth/login')
// // // //   }

// // // //   // Menu items selon le rôle
// // // //   const getMenuItems = () => {
// // // //     const baseItems = [
// // // //       {
// // // //         title: 'Tableau de bord',
// // // //         icon: '📊',
// // // //         href: user ? (
// // // //           user.role === 'super-admin' ? '/' :
// // // //           user.role === 'admin' ? '/admin' : '/vendor'
// // // //         ) : '/auth/login',
// // // //         roles: ['super-admin', 'admin', 'vendor']
// // // //       },
// // // //       {
// // // //         title: 'Mon Profil',
// // // //         icon: '👤',
// // // //         href: '/profile',
// // // //         roles: ['super-admin', 'admin', 'vendor']
// // // //       }
// // // //     ]

// // // //     const roleSpecificItems = {
// // // //       'super-admin': [
// // // //         {
// // // //           title: 'Utilisateurs',
// // // //           icon: '👥',
// // // //           href: '/super-admin/users',
// // // //           roles: ['super-admin']
// // // //         },
// // // //         {
// // // //           title: 'Magasins',
// // // //           icon: '🏪',
// // // //           href: '/super-admin/products',
// // // //           roles: ['super-admin']
// // // //         },
// // // //         {
// // // //           title: 'Statistiques',
// // // //           icon: '📈',
// // // //           href: '/super-admin/stats',
// // // //           roles: ['super-admin']
// // // //         }
// // // //       ],
// // // //       'admin': [
// // // //         {
// // // //           title: 'Vendeurs',
// // // //           icon: '👥',
// // // //           href: '/admin/vendors',
// // // //           roles: ['admin']
// // // //         },
// // // //         {
// // // //           title: 'Commandes',
// // // //           icon: '📦',
// // // //           href: '/admin/orders',
// // // //           roles: ['admin']
// // // //         },
// // // //         {
// // // //           title: 'Inventaire',
// // // //           icon: '📋',
// // // //           href: '/admin/inventory',
// // // //           roles: ['admin']
// // // //         }
// // // //       ],
// // // //       'vendor': [
// // // //         {
// // // //           title: 'Mes Produits',
// // // //           icon: '🛍️',
// // // //           href: '/vendor/products',
// // // //           roles: ['vendor']
// // // //         },
// // // //         {
// // // //           title: 'Mes Commandes',
// // // //           icon: '📋',
// // // //           href: '/vendor/orders',
// // // //           roles: ['vendor']
// // // //         },
// // // //         {
// // // //           title: 'Mes Statistiques',
// // // //           icon: '📊',
// // // //           href: '/vendor/stats',
// // // //           roles: ['vendor']
// // // //         }
// // // //       ]
// // // //     }

// // // //     const userRole = user?.role || 'vendor'
// // // //     const specificItems = roleSpecificItems[userRole] || []
    
// // // //     return [...baseItems, ...specificItems]
// // // //   }

// // // //   if (!user) {
// // // //     return null
// // // //   }

// // // //   const menuItems = getMenuItems()

// // // //   return (
// // // //     <aside className={`
// // // //       fixed left-0 top-0 h-screen bg-gray-900 text-white
// // // //       transition-all duration-300 z-30
// // // //       ${collapsed ? 'w-20' : 'w-64'}
// // // //       hidden md:block
// // // //     `}>
// // // //       {/* Header de la sidebar */}
// // // //       <div className="p-4 border-b border-gray-700">
// // // //         <div className="flex items-center justify-between">
// // // //           {!collapsed && (
// // // //             <h1 className="text-xl font-bold">Shop Management</h1>
// // // //           )}
// // // //           <button
// // // //             onClick={toggleSidebar}
// // // //             className="p-2 rounded-md hover:bg-gray-800 transition"
// // // //           >
// // // //             {collapsed ? '→' : '←'}
// // // //           </button>
// // // //         </div>
// // // //       </div>

// // // //       {/* Info utilisateur */}
// // // //       <div className="p-4 border-b border-gray-700">
// // // //         <div className="flex items-center space-x-3">
// // // //           <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center font-medium">
// // // //             {user.full_name?.charAt(0) || 'U'}
// // // //           </div>
// // // //           {!collapsed && (
// // // //             <div>
// // // //               <p className="font-medium">{user.full_name}</p>
// // // //               <p className="text-sm text-gray-400">
// // // //                 {user.role === 'super-admin' ? 'Super Admin' :
// // // //                  user.role === 'admin' ? 'Admin' : 'Vendeur'}
// // // //               </p>
// // // //             </div>
// // // //           )}
// // // //         </div>
// // // //       </div>

// // // //       {/* Menu */}
// // // //       <nav className="p-4">
// // // //         <ul className="space-y-2">
// // // //           {menuItems.map((item) => {
// // // //             // Vérifier si l'utilisateur a accès à cet item
// // // //             if (!item.roles.includes(user.role)) {
// // // //               return null
// // // //             }

// // // //             const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
            
// // // //             return (
// // // //               <li key={item.href}>
// // // //                 <Link
// // // //                   href={item.href}
// // // //                   className={`
// // // //                     flex items-center space-x-3 p-3 rounded-lg transition
// // // //                     ${isActive 
// // // //                       ? 'bg-blue-600 text-white' 
// // // //                       : 'hover:bg-gray-800 text-gray-300'
// // // //                     }
// // // //                     ${collapsed ? 'justify-center' : ''}
// // // //                   `}
// // // //                 >
// // // //                   <span className="text-xl">{item.icon}</span>
// // // //                   {!collapsed && <span>{item.title}</span>}
// // // //                 </Link>
// // // //               </li>
// // // //             )
// // // //           })}
// // // //         </ul>
// // // //       </nav>

// // // //       {/* Footer de la sidebar */}
// // // //       <div className="absolute bottom-0 w-full p-4 border-t border-gray-700">
// // // //         <button
// // // //           onClick={handleLogout}
// // // //           className={`
// // // //             flex items-center space-x-3 p-3 rounded-lg
// // // //             hover:bg-red-600 transition w-full
// // // //             ${collapsed ? 'justify-center' : ''}
// // // //           `}
// // // //         >
// // // //           <span>🚪</span>
// // // //           {!collapsed && <span>Déconnexion</span>}
// // // //         </button>
// // // //       </div>

// // // //       {/* Badge mobile */}
// // // //       <div className="md:hidden absolute -right-8 top-4 bg-blue-600 text-white p-2 rounded-r-lg">
// // // //         Menu
// // // //       </div>
// // // //     </aside>
// // // //   )
// // // // }
// // // 'use client'

// // // import { useState, useEffect } from 'react'
// // // import Link from 'next/link'
// // // import { usePathname, useRouter } from 'next/navigation'
// // // import { checkAuth } from '@/lib/auth'
// // // import {
// // //   HiChartBar,
// // //   HiCog,
// // //   HiChevronLeft,
// // //   HiQuestionMarkCircle,
// // //   HiLogout
// // // } from 'react-icons/hi'
// // // import {
// // //   LayoutDashboard,
// // //   Users,
// // //   Store,
// // //   BarChart3,
// // //   ShoppingBag,
// // //   Package,
// // //   ClipboardList,
// // //   PieChart,
// // //   User,
// // //   Settings,
// // //   HelpCircle,
// // //   Sidebar as SidebarIcon,
// // //   QrCode
// // // } from 'lucide-react'

// // // export default function Sidebar({ onCollapse }) {
// // //   const [collapsed, setCollapsed] = useState(false)
// // //   const [user, setUser] = useState(null)
// // //   const pathname = usePathname()
// // //   const router = useRouter()

// // //   useEffect(() => {
// // //     const currentUser = checkAuth()
// // //     setUser(currentUser)
    
// // //     if (!currentUser) {
// // //       router.push('/auth/login')
// // //     }
// // //   }, [router])

// // //   const toggleSidebar = () => {
// // //     const newState = !collapsed
// // //     setCollapsed(newState)
// // //     onCollapse?.(newState)
// // //   }

// // //   const handleLogout = () => {
// // //     localStorage.removeItem('auth_token')
// // //     localStorage.removeItem('user_data')
// // //     router.push('/auth/login')
// // //   }

// // //   const getInitials = (fullName) => {
// // //     if (!fullName) return 'U'
// // //     return fullName
// // //       .split(' ')
// // //       .map(part => part[0])
// // //       .join('')
// // //       .toUpperCase()
// // //       .substring(0, 2)
// // //   }

// // //   const getRoleDisplay = (role) => {
// // //     switch(role) {
// // //       case 'super-admin': return { label: 'Super Admin', color: 'bg-red-100 text-red-800' }
// // //       case 'admin': return { label: 'Administrateur', color: 'bg-blue-100 text-blue-800' }
// // //       case 'vendor': return { label: 'Vendeur', color: 'bg-green-100 text-green-800' }
// // //       default: return { label: 'Utilisateur', color: 'bg-gray-100 text-gray-800' }
// // //     }
// // //   }

// // //   // Menu items selon le rôle
// // //   const getMenuItems = () => {
// // //     const baseItems = [
// // //       {
// // //         title: 'Tableau de bord',
// // //         icon: LayoutDashboard,
// // //         href: user ? (
// // //           user.role === 'super-admin' ? '/' :
// // //           user.role === 'admin' ? '/admin' : '/vendor'
// // //         ) : '/auth/login',
// // //         roles: ['super-admin', 'admin', 'vendor']
// // //       },
// // //       {
// // //         title: 'Mon Profil',
// // //         icon: User,
// // //         href: '/profile',
// // //         roles: ['super-admin', 'admin', 'vendor']
// // //       }
// // //     ]

// // //     const roleSpecificItems = {
// // //       'super-admin': [
// // //         {
// // //           title: 'Utilisateurs',
// // //           icon: Users,
// // //           href: '/super-admin/users',
// // //           roles: ['super-admin']
// // //         },
// // //         {
// // //           title: 'Magasins',
// // //           icon: Store,
// // //           href: '/super-admin/stores',
// // //           roles: ['super-admin']
// // //         },
// // //         {
// // //           title: 'Statistiques',
// // //           icon: BarChart3,
// // //           href: '/super-admin/stats',
// // //           roles: ['super-admin']
// // //         },
// // //         {
// // //           title: 'Scanner',
// // //           icon: QrCode,
// // //           href: '/super-admin/scanner',
// // //           roles: ['super-admin']
// // //         }
// // //       ],
// // //       'admin': [
// // //         {
// // //           title: 'Vendeurs',
// // //           icon: Users,
// // //           href: '/admin/vendors',
// // //           roles: ['admin']
// // //         },
// // //         {
// // //           title: 'Commandes',
// // //           icon: ShoppingBag,
// // //           href: '/admin/orders',
// // //           roles: ['admin']
// // //         },
// // //         {
// // //           title: 'Inventaire',
// // //           icon: Package,
// // //           href: '/admin/inventory',
// // //           roles: ['admin']
// // //         },
// // //         {
// // //           title: 'Rapports',
// // //           icon: PieChart,
// // //           href: '/admin/reports',
// // //           roles: ['admin']
// // //         }
// // //       ],
// // //       'vendor': [
// // //         {
// // //           title: 'Mes Produits',
// // //           icon: Package,
// // //           href: '/vendor/products',
// // //           roles: ['vendor']
// // //         },
// // //         {
// // //           title: 'Mes Commandes',
// // //           icon: ClipboardList,
// // //           href: '/vendor/orders',
// // //           roles: ['vendor']
// // //         },
// // //         {
// // //           title: 'Mes Statistiques',
// // //           icon: BarChart3,
// // //           href: '/vendor/stats',
// // //           roles: ['vendor']
// // //         },
// // //         {
// // //           title: 'Scanner',
// // //           icon: QrCode,
// // //           href: '/vendor/scanner',
// // //           roles: ['vendor']
// // //         }
// // //       ]
// // //     }

// // //     const userRole = user?.role || 'vendor'
// // //     const specificItems = roleSpecificItems[userRole] || []
    
// // //     return [...baseItems, ...specificItems]
// // //   }

// // //   if (!user) {
// // //     return null
// // //   }

// // //   const menuItems = getMenuItems()
// // //   const roleInfo = getRoleDisplay(user.role)

// // //   return (
// // //     <div className={`
// // //       fixed left-0 top-0 h-screen bg-white border-r border-gray-200
// // //       transition-all duration-300 z-30 flex flex-col
// // //       ${collapsed ? 'w-16' : 'w-64'}
// // //       hidden md:flex
// // //     `}>
// // //       {/* Header de la sidebar */}
// // //       <div className="p-5 border-b border-gray-200">
// // //         <div className="flex items-center justify-between">
// // //           {!collapsed && (
// // //             <h1 className="text-xl font-bold inline-flex items-center gap-2 text-gray-800">
// // //               <Store className="w-6 h-6 text-blue-600" />
// // //               Shop Management
// // //             </h1>
// // //           )}
          
// // //           <button
// // //             onClick={toggleSidebar}
// // //             className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
// // //             title={collapsed ? "Développer" : "Réduire"}
// // //           >
// // //             {collapsed ? (
// // //               <SidebarIcon className="w-5 h-5 text-gray-600" />
// // //             ) : (
// // //               <HiChevronLeft className="w-5 h-5 text-gray-600" />
// // //             )}
// // //           </button>
// // //         </div>
      
// // //         {!collapsed && (
// // //           <div className="py-3 border-t border-gray-100 mt-4">
// // //             <div className="flex items-center space-x-3">
// // //               <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
// // //                 <span className="font-semibold text-blue-600 text-sm">
// // //                   {getInitials(user.full_name)}
// // //                 </span>
// // //               </div>
// // //               <div className="flex-1 min-w-0">
// // //                 <p className="text-sm font-medium text-gray-900 truncate">
// // //                   {user.full_name || 'Utilisateur'}
// // //                 </p>
// // //                 <div className="flex items-center gap-2 mt-1">
// // //                   <span className={`text-xs px-2 py-0.5 rounded-full ${roleInfo.color}`}>
// // //                     {roleInfo.label}
// // //                   </span>
// // //                   {user.email && (
// // //                     <span className="text-xs text-gray-500 truncate">
// // //                       {user.email}
// // //                     </span>
// // //                   )}
// // //                 </div>
// // //               </div>
// // //             </div>
// // //           </div>
// // //         )}
// // //       </div>

// // //       {/* Navigation */}
// // //       <nav className="flex-1 p-2 overflow-y-auto">
// // //         <ul className="space-y-1">
// // //           {menuItems.map((item) => {
// // //             if (!item.roles.includes(user.role)) {
// // //               return null
// // //             }

// // //             const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
// // //             const Icon = item.icon
            
// // //             return (
// // //               <li key={item.href}>
// // //                 <Link
// // //                   href={item.href}
// // //                   className={`
// // //                     flex items-center w-full text-left
// // //                     ${collapsed ? 'justify-center py-3 px-2' : 'py-2.5 px-4'}
// // //                     transition-colors rounded-lg
// // //                     ${isActive
// // //                       ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600'
// // //                       : 'hover:bg-gray-50 text-gray-700'
// // //                     }
// // //                   `}
// // //                 >
// // //                   <Icon className={`
// // //                     ${isActive
// // //                       ? 'text-blue-600'
// // //                       : 'text-gray-400'
// // //                     }
// // //                     ${collapsed ? 'w-4 h-4' : 'w-4 h-4'}
// // //                   `} />
// // //                   {!collapsed && (
// // //                     <span className="ml-3 font-medium text-sm">{item.title}</span>
// // //                   )}
// // //                 </Link>
// // //               </li>
// // //             )
// // //           })}
// // //         </ul>
// // //       </nav>

// // //       {/* Section inférieure */}
// // //       <div className="mt-auto border-t border-gray-200">
// // //         {!collapsed && (
// // //           <div className="p-4">
// // //             <div className="text-xs text-gray-500 mb-2">Application</div>
// // //             <div className="space-y-1">
// // //               <Link
// // //                 href="/settings"
// // //                 className="flex items-center w-full text-left py-2 px-3 rounded-lg hover:bg-gray-50 text-gray-700"
// // //               >
// // //                 <HiCog className="w-5 h-5" />
// // //                 <span className="ml-3 text-sm">Paramètres</span>
// // //               </Link>
// // //               <Link
// // //                 href="/help"
// // //                 className="flex items-center w-full text-left py-2 px-3 rounded-lg hover:bg-gray-50 text-gray-700"
// // //               >
// // //                 <HiQuestionMarkCircle className="w-5 h-5" />
// // //                 <span className="ml-3 text-sm">Aide & Support</span>
// // //               </Link>
// // //             </div>
// // //           </div>
// // //         )}

// // //         {/* Bouton de déconnexion */}
// // //         <div className={`pb-5 px-3 pt-2 border-t border-gray-200 ${collapsed ? 'rounded-full flex justify-center' : ''}`}>
// // //           <button
// // //             onClick={handleLogout}
// // //             className={`
// // //               flex items-center w-full
// // //               ${collapsed ? 'justify-center rounded-full' : ''}
// // //               py-2.5 px-3 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 transition-colors group
// // //             `}
// // //             title={collapsed ? "Déconnexion" : ""}
// // //           >
// // //             <HiLogout className="w-5 h-5 group-hover:text-red-800" />
// // //             {!collapsed && (
// // //               <span className="ml-3 font-medium text-sm group-hover:text-red-800">
// // //                 Déconnexion
// // //               </span>
// // //             )}
// // //           </button>
// // //         </div>
// // //       </div>

// // //       {/* Badge mobile */}
// // //       <div className="md:hidden absolute -right-8 top-4 bg-blue-600 text-white p-2 rounded-r-lg">
// // //         Menu
// // //       </div>
// // //     </div>
// // //   )
// // // }

// // 'use client'

// // import { useState, useEffect } from 'react'
// // import Link from 'next/link'
// // import { usePathname, useRouter } from 'next/navigation'
// // import { checkAuth } from '@/lib/auth'
// // import { supabase } from '@/lib/supabase'
// // import {
// //   HiChartBar,
// //   HiCog,
// //   HiChevronLeft,
// //   HiQuestionMarkCircle,
// //   HiLogout,
// //   HiShoppingBag,
// //   HiCurrencyDollar
// // } from 'react-icons/hi'
// // import {
// //   LayoutDashboard,
// //   Users,
// //   Store,
// //   BarChart3,
// //   ShoppingBag,
// //   Package,
// //   ClipboardList,
// //   PieChart,
// //   User,
// //   Settings,
// //   HelpCircle,
// //   Sidebar as SidebarIcon,
// //   QrCode,
// //   UserCircle,
// //   ShoppingCart,
// //   Package2,
// //   CogIcon
// // } from 'lucide-react'
// // import Image from 'next/image'

// // export default function Sidebar({ onCollapse }) {
// //   const [collapsed, setCollapsed] = useState(false)
// //   const [user, setUser] = useState(null)
// //   const [profileImageUrl, setProfileImageUrl] = useState(null)
// //   const pathname = usePathname()
// //   const router = useRouter()

// //   useEffect(() => {
// //     const currentUser = checkAuth()
// //     setUser(currentUser)
    
// //     if (!currentUser) {
// //       router.push('/auth/login')
// //       return
// //     }

// //     // Vérifier si l'utilisateur a une image de profil
// //     if (currentUser.profile_image) {
// //       // Utiliser getPublicUrl de Supabase comme dans le ProfilePage
// //       const { data } = supabase.storage
// //         .from('avatars')
// //         .getPublicUrl(currentUser.profile_image)
      
// //       // Ajouter un timestamp pour éviter le cache
// //       setProfileImageUrl(data.publicUrl + '?t=' + new Date().getTime())
// //     }
// //   }, [router])

// //   const toggleSidebar = () => {
// //     const newState = !collapsed
// //     setCollapsed(newState)
// //     onCollapse?.(newState)
// //   }

// //   const handleLogout = () => {
// //     localStorage.removeItem('auth_token')
// //     localStorage.removeItem('user_data')
// //     router.push('/auth/login')
// //   }

// //   const getInitials = (fullName) => {
// //     if (!fullName) return 'U'
// //     return fullName
// //       .split(' ')
// //       .map(part => part[0])
// //       .join('')
// //       .toUpperCase()
// //       .substring(0, 2)
// //   }

// //   const getRoleDisplay = (role) => {
// //     switch(role) {
// //       case 'super-admin': return { label: 'Super Admin', color: 'bg-red-100 text-red-800' }
// //       case 'admin': return { label: 'Administrateur', color: 'bg-blue-100 text-blue-800' }
// //       case 'vendor': return { label: 'Vendeur', color: 'bg-green-100 text-green-800' }
// //       default: return { label: 'Utilisateur', color: 'bg-gray-100 text-gray-800' }
// //     }
// //   }

// //   // Menu items selon le rôle
// //   const getMenuItems = () => {
// //     const baseItems = [
// //       {
// //         title: 'Tableau de bord',
// //         icon: LayoutDashboard,
// //         href: user ? (
// //           user.role === 'super-admin' ? '/' :
// //           user.role === 'admin' ? '/admin' : '/vendor'
// //         ) : '/auth/login',
// //         roles: ['super-admin', 'admin', 'vendor']
// //       },
// //       {
// //         title: 'Mon Profil',
// //         icon: UserCircle,
// //         href: '/profile',
// //         roles: ['super-admin', 'admin', 'vendor']
// //       }
// //     ]

// //     const roleSpecificItems = {
// //       'super-admin': [
// //         {
// //           title: 'Utilisateurs',
// //           icon: Users,
// //           href: '/super-admin/users',
// //           roles: ['super-admin']
// //         },
// //         {
// //           title: 'Produits',
// //           icon: Package,
// //           href: '/super-admin/products',
// //           roles: ['super-admin']
// //         },
// //         {
// //           title: 'Ventes',
// //           icon: ShoppingCart,
// //           href: '/super-admin/sales',
// //           roles: ['super-admin']
// //         },
      
// //         {
// //           title: 'Shop',
// //           icon: HiCog,
// //           href: '/super-admin/shop',
// //           roles: ['super-admin']
// //         }
// //         ,
      
// //         {
// //           title: 'Config Vente',
// //           icon: HiShoppingBag,
// //           href: '/super-admin/config',
// //           roles: ['super-admin']
// //         }
// //         ,
      
// //         {
// //           title: 'Rapport',
// //           icon: HiCurrencyDollar,
// //           href: '/super-admin/mouvement',
// //           roles: ['super-admin']
// //         }
// //       ],
// //       'admin': [
// //         {
// //           title: 'Vendeurs',
// //           icon: Users,
// //           href: '/admin/vendors',
// //           roles: ['admin']
// //         },
// //         {
// //           title: 'Commandes',
// //           icon: ShoppingBag,
// //           href: '/admin/orders',
// //           roles: ['admin']
// //         },
// //         {
// //           title: 'Inventaire',
// //           icon: Package,
// //           href: '/admin/inventory',
// //           roles: ['admin']
// //         },
// //         {
// //           title: 'Rapports',
// //           icon: PieChart,
// //           href: '/admin/reports',
// //           roles: ['admin']
// //         }
// //       ],
// //       'vendor': [
// //         {
// //           title: 'Mes Produits',
// //           icon: Package,
// //           href: '/vendor/products',
// //           roles: ['vendor']
// //         },
// //         {
// //           title: 'Mes Commandes',
// //           icon: ClipboardList,
// //           href: '/vendor/orders',
// //           roles: ['vendor']
// //         },
// //         {
// //           title: 'Mes Statistiques',
// //           icon: BarChart3,
// //           href: '/vendor/stats',
// //           roles: ['vendor']
// //         },
// //         {
// //           title: 'Scanner',
// //           icon: QrCode,
// //           href: '/vendor/scanner',
// //           roles: ['vendor']
// //         }
// //       ]
// //     }

// //     const userRole = user?.role || 'vendor'
// //     const specificItems = roleSpecificItems[userRole] || []
    
// //     return [...baseItems, ...specificItems]
// //   }

// //   if (!user) {
// //     return null
// //   }

// //   const menuItems = getMenuItems()
// //   const roleInfo = getRoleDisplay(user.role)
// //   const initials = getInitials(user.full_name)

// //   return (
// //     <div className={`
// //       fixed left-0 top-0 h-screen bg-white border-r border-gray-200
// //       transition-all duration-300 z-30 flex flex-col
// //       ${collapsed ? 'w-16' : 'w-64'}
// //       hidden md:flex
// //     `}>
// //       {/* Header de la sidebar */}
// //       <div className="py-3 px-6 border-b border-gray-200">
// //         <div className="flex items-center justify-between">
// //           {!collapsed && (
// //             <h1 className="text-xl font-bold inline-flex items-center gap-2 text-gray-800">
// //               <Package className="w-6 h-6 text-blue-600" />
// //               ShopManage 
// //             </h1>
// //           )}
          
// //           <button
// //             onClick={toggleSidebar}
// //             className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
// //             title={collapsed ? "Développer" : "Réduire"}
// //           >
// //             {collapsed ? (
// //               <SidebarIcon className="w-5 h-5 text-gray-600" />
// //             ) : (
// //               <HiChevronLeft className="w-5 h-5 text-gray-600" />
// //             )}
// //           </button>
// //         </div>
      
// //         {!collapsed && (
// //           <div className="py-3 border-t border-gray-100 mt-4">
// //             <div className="flex items-center space-x-3">
// //               {/* Avatar avec image ou initiales */}
// //               <div className="relative w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center overflow-hidden">
// //                 {profileImageUrl ? (
// //                   <>
// //                     {/* Image temporaire avec img pour éviter l'erreur Next.js Image */}
// //                     <img
// //                       src={profileImageUrl}
// //                       alt={user.full_name || 'Utilisateur'}
// //                       className="absolute inset-0 w-full h-full object-cover"
// //                       onError={(e) => {
// //                         // En cas d'erreur, masquer l'image et afficher les initiales
// //                         e.target.style.display = 'none'
// //                         e.target.parentNode.classList.remove('bg-gradient-to-br', 'from-blue-100', 'to-purple-100')
// //                         e.target.parentNode.classList.add('bg-gradient-to-br', 'from-blue-100', 'to-purple-100')
// //                       }}
// //                     />
// //                     {/* Fallback avec initiales */}
// //                     {/* <span className="font-semibold text-blue-600 text-sm relative z-10">
// //                       {initials}
// //                     </span> */}
// //                   </>
// //                 ) : (
// //                   <span className="font-semibold text-blue-600 text-sm">
// //                     {initials}
// //                   </span>
// //                 )}
// //               </div>
              
// //               <div className="flex-1 min-w-0">
// //                 <p className="text-sm font-medium text-gray-900 truncate">
// //                   {user.full_name || 'Utilisateur'}
// //                 </p>
// //                 <div className="flex items-center gap-2 mt-1">
// //                   {user.email && (
// //                     <span className="text-xs text-gray-500 truncate">
// //                       {user.email}
// //                     </span>
// //                   )}
// //                 </div>
// //                   <span className={`text-xs px-2 py-0.5 rounded-ful ${roleInfo.color}`}>
// //                     {roleInfo.label}
// //                   </span>
// //               </div>
// //             </div>
// //           </div>
// //         )}
// //       </div>

// //       {/* Navigation */}
// //       <nav className="flex-1 pl-2 overflow-y-auto">
// //         <ul className="space-y-1">
// //           {menuItems.map((item) => {
// //             if (!item.roles.includes(user.role)) {
// //               return null
// //             }

// //             const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
// //             const Icon = item.icon
            
// //             return (
// //               <li key={item.href}>
// //                 <Link
// //                   href={item.href}
// //                   className={`
// //                     flex items-center w-full text-left
// //                     ${collapsed ? 'justify-center py-3 px-2' : 'py-2.5 px-4'}
// //                     transition-colors 
// //                     ${isActive
// //                       ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600'
// //                       : 'hover:bg-gray-50 text-gray-700'
// //                     }
// //                   `}
// //                 >
// //                   <Icon className={`
// //                     ${isActive
// //                       ? 'text-blue-600'
// //                       : 'text-gray-400'
// //                     }
// //                     ${collapsed ? 'w-4 h-4' : 'w-4 h-4'}
// //                   `} />
// //                   {!collapsed && (
// //                     <span className="ml-3 font-medium text-sm">{item.title}</span>
// //                   )}
// //                 </Link>
// //               </li>
// //             )
// //           })}
// //         </ul>
// //       </nav>

// //       {/* Section inférieure */}
// //       <div className="mt-auto border-t border-gray-200">
// //         {!collapsed && (
// //           <div className="p-4">
// //             <div className="text-xs text-gray-500 mb-2">Application</div>
// //             <div className="space-y-1">
// //               <Link
// //                 href="/settings"
// //                 className="flex items-center w-full text-left py-2 px-3 rounded-lg hover:bg-gray-50 text-gray-700"
// //               >
// //                 <HiCog className="w-5 h-5" />
// //                 <span className="ml-3 text-sm">Paramètres</span>
// //               </Link>
// //               <Link
// //                 href="/help"
// //                 className="flex items-center w-full text-left py-2 px-3 rounded-lg hover:bg-gray-50 text-gray-700"
// //               >
// //                 <HiQuestionMarkCircle className="w-5 h-5" />
// //                 <span className="ml-3 text-sm">Aide & Support</span>
// //               </Link>
// //             </div>
// //           </div>
// //         )}

// //         {/* Bouton de déconnexion */}
// //         {/* <div className={`pb-5 px-3 pt-2 border-t border-gray-200 ${collapsed ? 'rounded-full flex justify-center' : ''}`}>
// //           <button
// //             onClick={handleLogout}
// //             className={`
// //               flex items-center w-full
// //               ${collapsed ? 'justify-center rounded-full' : ''}
// //               py-2.5 px-3 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 transition-colors group
// //             `}
// //             title={collapsed ? "Déconnexion" : ""}
// //           >
// //             <HiLogout className="w-5 h-5 group-hover:text-red-800" />
// //             {!collapsed && (
// //               <span className="ml-3 font-medium text-sm group-hover:text-red-800">
// //                 Déconnexion
// //               </span>
// //             )}
// //           </button>
// //         </div> */}
// //       </div>

// //       {/* Badge mobile */}
// //       <div className="md:hidden absolute -right-8 top-4 bg-blue-600 text-white p-2 rounded-r-lg">
// //         Menu
// //       </div>
// //     </div>
// //   )
// // }


// 'use client'

// import { useState, useEffect } from 'react'
// import Link from 'next/link'
// import { usePathname, useRouter } from 'next/navigation'
// import { checkAuth } from '@/lib/auth'
// import { supabase } from '@/lib/supabase'
// import { useLanguage } from '@/contexts/LanguageContext'
// import {
//   HiChartBar,
//   HiCog,
//   HiChevronLeft,
//   HiQuestionMarkCircle,
//   HiLogout,
//   HiShoppingBag,
//   HiCurrencyDollar,
//   HiUserGroup
// } from 'react-icons/hi'
// import {
//   LayoutDashboard,
//   Users,
//   Store,
//   BarChart3,
//   ShoppingBag,
//   Package,
//   ClipboardList,
//   PieChart,
//   User,
//   Settings,
//   HelpCircle,
//   Sidebar as SidebarIcon,
//   QrCode,
//   UserCircle,
//   ShoppingCart,
//   Package2,
//   CogIcon,
//   Globe
// } from 'lucide-react'

// export default function Sidebar({ onCollapse }) {
//   const [collapsed, setCollapsed] = useState(false)
//   const [user, setUser] = useState(null)
//   const [profileImageUrl, setProfileImageUrl] = useState(null)
//   const pathname = usePathname()
//   const router = useRouter()
//   const { t, language } = useLanguage()

//   useEffect(() => {
//     const currentUser = checkAuth()
//     setUser(currentUser)
    
//     if (!currentUser) {
//       router.push('/auth/login')
//       return
//     }

//     // Vérifier si l'utilisateur a une image de profil
//     if (currentUser.profile_image) {
//       const { data } = supabase.storage
//         .from('avatars')
//         .getPublicUrl(currentUser.profile_image)
      
//       setProfileImageUrl(data.publicUrl + '?t=' + new Date().getTime())
//     }
//   }, [router])

//   const toggleSidebar = () => {
//     const newState = !collapsed
//     setCollapsed(newState)
//     onCollapse?.(newState)
//   }

//   const handleLogout = () => {
//     localStorage.removeItem('auth_token')
//     localStorage.removeItem('user_data')
//     router.push('/auth/login')
//   }

//   const getInitials = (fullName) => {
//     if (!fullName) return 'U'
//     return fullName
//       .split(' ')
//       .map(part => part[0])
//       .join('')
//       .toUpperCase()
//       .substring(0, 2)
//   }

//   const getRoleDisplay = (role) => {
//     switch(role) {
//       case 'super-admin': 
//         return { 
//           label: language === 'fr' ? 'Super Admin' : 'Super Admin', 
//           color: 'bg-red-100 text-red-800' 
//         }
//       case 'admin': 
//         return { 
//           label: language === 'fr' ? 'Administrateur' : 'Administrator', 
//           color: 'bg-blue-100 text-blue-800' 
//         }
//       case 'vendor': 
//         return { 
//           label: language === 'fr' ? 'Vendeur' : 'Seller', 
//           color: 'bg-green-100 text-green-800' 
//         }
//       default: 
//         return { 
//           label: language === 'fr' ? 'Utilisateur' : 'User', 
//           color: 'bg-gray-100 text-gray-800' 
//         }
//     }
//   }

//   // Menu items selon le rôle
//   const getMenuItems = () => {
//     const baseItems = [
//       {
//         title: t('dashboard'),
//         icon: LayoutDashboard,
//         href: user ? (
//           user.role === 'super-admin' ? '/' :
//           user.role === 'admin' ? '/admin' : '/vendor'
//         ) : '/auth/login',
//         roles: ['super-admin', 'admin', 'vendor']
//       },
//       {
//         title: t('myProfile'),
//         icon: UserCircle,
//         href: '/profile',
//         roles: ['super-admin', 'admin', 'vendor']
//       }
//     ]

//     const roleSpecificItems = {
//       'super-admin': [
//         {
//           title: t('users'),
//           icon: Users,
//           href: '/super-admin/users',
//           roles: ['super-admin']
//         },
//         {
//           title: t('products'),
//           icon: Package,
//           href: '/super-admin/products',
//           roles: ['super-admin']
//         },
//         {
//           title: t('sales'),
//           icon: ShoppingCart,
//           href: '/super-admin/sales',
//           roles: ['super-admin']
//         },
//         {
//           title: t('shop'),
//           icon: HiCog,
//           href: '/super-admin/shop',
//           roles: ['super-admin']
//         },
//         {
//           title: t('saleConfig'),
//           icon: HiShoppingBag,
//           href: '/super-admin/config',
//           roles: ['super-admin']
//         },
//         {
//           title: t('reports'),
//           icon: HiCurrencyDollar,
//           href: '/super-admin/mouvement',
//           roles: ['super-admin']
//         }
//         ,
//         {
//           title: t('client'),
//           icon: HiUserGroup,
//           href: '/super-admin/customers',
//           roles: ['super-admin']
//         }
        
//       ],
//       'admin': [
//         {
//           title: t('vendors'),
//           icon: Users,
//           href: '/admin/vendors',
//           roles: ['admin']
//         },
//         {
//           title: t('orders'),
//           icon: ShoppingBag,
//           href: '/admin/orders',
//           roles: ['admin']
//         },
//         {
//           title: t('inventory'),
//           icon: Package,
//           href: '/admin/inventory',
//           roles: ['admin']
//         },
//         {
//           title: t('reports'),
//           icon: PieChart,
//           href: '/admin/reports',
//           roles: ['admin']
//         }
//       ],
//       'vendor': [
//         {
//           title: t('myProducts'),
//           icon: Package,
//           href: '/vendor/products',
//           roles: ['vendor']
//         },
//         {
//           title: t('myOrders'),
//           icon: ClipboardList,
//           href: '/vendor/orders',
//           roles: ['vendor']
//         },
//         {
//           title: t('myStats'),
//           icon: BarChart3,
//           href: '/vendor/stats',
//           roles: ['vendor']
//         },
//         {
//           title: t('scanner'),
//           icon: QrCode,
//           href: '/vendor/scanner',
//           roles: ['vendor']
//         }
//       ]
//     }

//     const userRole = user?.role || 'vendor'
//     const specificItems = roleSpecificItems[userRole] || []
    
//     return [...baseItems, ...specificItems]
//   }

//   if (!user) {
//     return null
//   }

//   const menuItems = getMenuItems()
//   const roleInfo = getRoleDisplay(user.role)
//   const initials = getInitials(user.full_name)

//   return (
//     <div className={`
//       fixed left-0 top-0 h-screen bg-white border-r border-gray-200
//       transition-all duration-300 z-30 flex flex-col
//       ${collapsed ? 'w-16' : 'w-64'}
//       hidden md:flex
//     `}>
//       {/* Header de la sidebar */}
//       <div className="py-3 px-6 border-b border-gray-200">
//         <div className="flex items-center justify-between">
//           {!collapsed && (
//             <h1 className="text-xl font-bold inline-flex items-center gap-2 text-gray-800">
//               <Package className="w-6 h-6 text-blue-600" />
//               {t('appName')}
//             </h1>
//           )}
          
//           <button
//             onClick={toggleSidebar}
//             className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
//             title={collapsed ? t('expand') : t('collapse')}
//           >
//             {collapsed ? (
//               <SidebarIcon className="w-5 h-5 text-gray-600" />
//             ) : (
//               <HiChevronLeft className="w-5 h-5 text-gray-600" />
//             )}
//           </button>
//         </div>
      
//         {!collapsed && (
//           <div className="py-3 border-t border-gray-100 mt-4">
//             <div className="flex items-center space-x-3">
//               {/* Avatar avec image ou initiales */}
//               <div className="relative w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center overflow-hidden">
//                 {profileImageUrl ? (
//                   <>
//                     <img
//                       src={profileImageUrl}
//                       alt={user.full_name || t('user')}
//                       className="absolute inset-0 w-full h-full object-cover"
//                       onError={(e) => {
//                         e.target.style.display = 'none'
//                         e.target.parentNode.classList.remove('bg-gradient-to-br', 'from-blue-100', 'to-purple-100')
//                         e.target.parentNode.classList.add('bg-gradient-to-br', 'from-blue-100', 'to-purple-100')
//                       }}
//                     />
//                   </>
//                 ) : (
//                   <span className="font-semibold text-blue-600 text-sm">
//                     {initials}
//                   </span>
//                 )}
//               </div>
              
//               <div className="flex-1 min-w-0">
//                 <p className="text-sm font-medium text-gray-900 truncate">
//                   {user.full_name || t('user')}
//                 </p>
//                 <div className="flex items-center gap-2 mt-1">
//                   {user.email && (
//                     <span className="text-xs text-gray-500 truncate">
//                       {user.email}
//                     </span>
//                   )}
//                 </div>
//                   <span className={`text-xs px-2 py-0.5 rounded-ful ${roleInfo.color}`}>
//                     {roleInfo.label}
//                   </span>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Navigation */}
//       <nav className="flex-1 pl-2 overflow-y-auto">
//         <ul className="space-y-1">
//           {menuItems.map((item) => {
//             if (!item.roles.includes(user.role)) {
//               return null
//             }

//             const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
//             const Icon = item.icon
            
//             return (
//               <li key={item.href}>
//                 <Link
//                   href={item.href}
//                   className={`
//                     flex items-center w-full text-left
//                     ${collapsed ? 'justify-center py-3 px-2' : 'py-2.5 px-4'}
//                     transition-colors 
//                     ${isActive
//                       ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600'
//                       : 'hover:bg-gray-50 text-gray-700'
//                     }
//                   `}
//                 >
//                   <Icon className={`
//                     ${isActive
//                       ? 'text-blue-600'
//                       : 'text-gray-400'
//                     }
//                     ${collapsed ? 'w-4 h-4' : 'w-4 h-4'}
//                   `} />
//                   {!collapsed && (
//                     <span className="ml-3 font-medium text-sm">{item.title}</span>
//                   )}
//                 </Link>
//               </li>
//             )
//           })}
//         </ul>
//       </nav>

//       {/* Section inférieure */}
//       <div className="mt-auto border-t border-gray-200">
//         {!collapsed && (
//           <div className="p-4">
//             <div className="text-xs text-gray-500 mb-2">{t('application')}</div>
//             <div className="space-y-1">
//               <Link
//                 href="/settings"
//                 className="flex items-center w-full text-left py-2 px-3 rounded-lg hover:bg-gray-50 text-gray-700"
//               >
//                 <HiCog className="w-5 h-5" />
//                 <span className="ml-3 text-sm">{t('settings')}</span>
//               </Link>
//               <Link
//                 href="/help"
//                 className="flex items-center w-full text-left py-2 px-3 rounded-lg hover:bg-gray-50 text-gray-700"
//               >
//                 <HiQuestionMarkCircle className="w-5 h-5" />
//                 <span className="ml-3 text-sm">{t('helpSupport')}</span>
//               </Link>
//             </div>
//           </div>
//         )}

//         {/* Badge mobile */}
//         <div className="md:hidden absolute -right-8 top-4 bg-blue-600 text-white p-2 rounded-r-lg">
//           {t('menu')}
//         </div>
//       </div>
//     </div>
//   )
// }

'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { checkAuth } from '@/lib/auth'
import { supabase } from '@/lib/supabase'
import { useLanguage } from '@/contexts/LanguageContext'
import ShopLogo from '@/components/shop/ShopLogo'
import { useShop } from '@/hooks/useShop';

import {
  HiCog,
  HiQuestionMarkCircle,
  HiLogout
} from 'react-icons/hi'
import {
  LayoutDashboard,
  Users,
  Store,
  Package,
  ShoppingBag,
  ShoppingCart,
  PieChart,
  UserCircle,
  DollarSign,
  Home,
  Package2,
  Settings,
  HelpCircle,
  User as UserIcon,
  Store as StoreIcon,
  BarChart3,
  Users as UsersIcon,
  Printer
} from 'lucide-react'

export default function Sidebar() {
   const { shop } = useShop();
  const [user, setUser] = useState(null)
  const [profileImageUrl, setProfileImageUrl] = useState(null)
  const [hoveredItem, setHoveredItem] = useState(null)
  const pathname = usePathname()
  const router = useRouter()
  const { t, language } = useLanguage()

  useEffect(() => {
    const currentUser = checkAuth()
    setUser(currentUser)
    
    if (!currentUser) {
      router.push('/auth/login')
      return
    }

    if (currentUser.profile_image) {
      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(currentUser.profile_image)
      
      setProfileImageUrl(data.publicUrl + '?t=' + new Date().getTime())
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user_data')
    router.push('/auth/login')
  }

  const getInitials = (fullName) => {
    if (!fullName) return 'U'
    return fullName
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2)
  }

  const getRoleDisplay = (role) => {
    switch(role) {
      case 'super-admin': 
        return { 
          label: language === 'fr' ? 'Super Admin' : 'Super Admin', 
          color: 'bg-red-100 text-red-800' 
        }
      case 'admin': 
        return { 
          label: language === 'fr' ? 'Administrateur' : 'Administrator', 
          color: 'bg-blue-100 text-blue-800' 
        }
      case 'vendor': 
        return { 
          label: language === 'fr' ? 'Vendeur' : 'Seller', 
          color: 'bg-green-100 text-green-800' 
        }
      default: 
        return { 
          label: language === 'fr' ? 'Utilisateur' : 'User', 
          color: 'bg-gray-100 text-gray-800' 
        }
    }
  }

  const getMenuItems = () => {
    const baseItems = [
      {
        title: t('dashboard'),
        icon: Home,
        href: user ? (
          user.role === 'super-admin' ? '/super-admin/dashboard' :
          user.role === 'admin' ? '/admin' : '/vendor/dashboard'
        ) : '/auth/login',
        roles: ['super-admin', 'admin', 'vendor']
      }
    ]

    const roleSpecificItems = {
      'super-admin': [
        {
          title: t('users'),
          icon: UsersIcon,
          href: '/super-admin/users',
          roles: ['super-admin']
        },
        {
          title: t('products'),
          icon: Package,
          href: '/super-admin/products',
          roles: ['super-admin']
        },
        {
          title: t('sales'),
          icon: ShoppingCart,
          href: '/super-admin/sales',
          roles: ['super-admin']
        },
        {
          title: t('shop'),
          icon: StoreIcon,
          href: '/super-admin/shop',
          roles: ['super-admin']
        },
        {
          title: t('reports'),
          icon: BarChart3,
          href: '/super-admin/mouvement',
          roles: ['super-admin']
        },
        {
          title: t('client'),
          icon: Users,
          href: '/super-admin/customers',
          roles: ['super-admin']
        },
        {
          title: t('myProfile'),
          icon: UserCircle,
          href: '/profile',
          roles: ['super-admin']
        }
      ],
      'admin': [
        {
          title: t('vendors'),
          icon: Users,
          href: '/admin/vendors',
          roles: ['admin']
        },
        {
          title: t('orders'),
          icon: ShoppingBag,
          href: '/admin/orders',
          roles: ['admin']
        },
        {
          title: t('inventory'),
          icon: Package,
          href: '/admin/inventory',
          roles: ['admin']
        },
        {
          title: t('reports'),
          icon: PieChart,
          href: '/admin/reports',
          roles: ['admin']
        },
        {
          title: t('myProfile'),
          icon: UserCircle,
          href: '/profile',
          roles: ['admin']
        }
      ],
      'vendor': [
        {
          title: t('myProfile'),
          icon: UserCircle,
          href: '/profile',
          roles: ['vendor']
        },
        {
          title: t('sales'),
          icon: DollarSign,
          href: '/vendor/sales',
          roles: ['vendor']
        }
        ,
        {
          title: t('print'),
          icon: Printer,
          href: '/vendor/print',
          roles: ['vendor']
        }
      ]
    }

    const userRole = user?.role || 'vendor'
    const specificItems = roleSpecificItems[userRole] || []
    
    return [...baseItems, ...specificItems]
  }

  if (!user) {
    return null
  }

  const menuItems = getMenuItems()
  const roleInfo = getRoleDisplay(user.role)
  const initials = getInitials(user.full_name)

  // Composant Tooltip
  const Tooltip = ({ children, text, isVisible }) => (
    <div className="relative">
      {children}
      {isVisible && (
        <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-3 z-50">
          <div className="px-3 py-2 bg-gray-900 text-white text-sm rounded-lg whitespace-nowrap shadow-lg">
            {text}
            <div className="absolute right-full top-1/2 transform -translate-y-1/2 w-0 h-0 
              border-t-[6px] border-b-[6px] border-l-0 border-r-[6px] 
              border-r-gray-900 border-t-transparent border-b-transparent">
            </div>
          </div>
        </div>
      )}
    </div>
  )

  return (
    <div className="fixed hidden  left-0 top-0 h-screen bg-white border-r border-gray-200 z-30 md:flex flex-col w-16">
      {/* Logo */}
      <div className="py-4 border-b border-gray-200  grid place-content-center">
        {/* <div className="flex items-center justify-center">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
            <Package2 className="w-5 h-5 text-white" />
          </div>
        </div> */}
           <ShopLogo shop={shop} size={40} />
      </div>

      {/* Avatar Utilisateur avec Tooltip */}
      {/* <div className="py-5 px-4 border-b border-gray-200">
        <Tooltip 
          text={
            <div className="text-left">
              <div className="font-medium mb-1">{user.full_name || t('user')}</div>
              <div className="text-xs text-gray-300 mb-2">{user.email}</div>
              <span className={`text-xs px-2 py-1 rounded-full ${roleInfo.color}`}>
                {roleInfo.label}
              </span>
            </div>
          }
          isVisible={hoveredItem === 'avatar'}
        >
          <div 
            className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center overflow-hidden cursor-pointer"
            onMouseEnter={() => setHoveredItem('avatar')}
            onMouseLeave={() => setHoveredItem(null)}
          >
            {profileImageUrl ? (
              <img
                src={profileImageUrl}
                alt={user.full_name || t('user')}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none'
                }}
              />
            ) : (
              <span className="font-semibold text-blue-600 text-sm">
                {initials}
              </span>
            )}
          </div>
        </Tooltip>
      </div> */}

      {/* Navigation avec Tooltips */}
      <nav className="flex-1 py-5">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            if (!item.roles.includes(user.role)) return null
            
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
            const Icon = item.icon

            return (
              <li key={item.href} className="relative">
                <Tooltip text={item.title} isVisible={hoveredItem === item.title}>
                  <Link
                    href={item.href}
                    className={`
                      flex items-center justify-center
                      py-3 relative
                      transition-colors
                      ${isActive
                        ? 'text-blue-600'
                        : 'text-gray-400 hover:text-gray-700'
                      }
                    `}
                    onMouseEnter={() => setHoveredItem(item.title)}
                    onMouseLeave={() => setHoveredItem(null)}
                  >
                    <Icon className={`
                      w-5 h-5
                      ${isActive ? 'text-blue-600' : ''}
                    `} />
                    
                    {isActive && (
                      <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-6 bg-blue-600 rounded-r-full"></div>
                    )}
                  </Link>
                </Tooltip>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Section inférieure avec Tooltips */}
      <div className="border-t border-gray-200 pt-5 pb-4">
        {/* Paramètres */}
        <div className="relative mb-2">
          <Tooltip text={t('settings')} isVisible={hoveredItem === 'settings'}>
            <Link
              href="/settings"
              className="flex items-center justify-center py-3 text-gray-400 hover:text-gray-700 transition-colors"
              onMouseEnter={() => setHoveredItem('settings')}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <Settings className="w-5 h-5" />
            </Link>
          </Tooltip>
        </div>

        {/* Aide */}
        <div className="relative mb-2">
          <Tooltip text={t('helpSupport')} isVisible={hoveredItem === 'help'}>
            <Link
              href="/help"
              className="flex items-center justify-center py-3 text-gray-400 hover:text-gray-700 transition-colors"
              onMouseEnter={() => setHoveredItem('help')}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <HelpCircle className="w-5 h-5" />
            </Link>
          </Tooltip>
        </div>

        {/* Déconnexion */}
        <div className="relative">
          <Tooltip text={t('logout')} isVisible={hoveredItem === 'logout'}>
            <button
              onClick={handleLogout}
              className="flex items-center justify-center py-3 text-gray-400 hover:text-red-600 transition-colors w-full"
              onMouseEnter={() => setHoveredItem('logout')}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <HiLogout className="w-5 h-5" />
            </button>
          </Tooltip>
        </div>
      </div>
    </div>
  )
}