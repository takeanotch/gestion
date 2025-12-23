
// // 'use client'

// // import { useState, useEffect } from 'react'
// // import { usePathname } from 'next/navigation'
// // import { checkAuth } from '@/lib/auth'
// // import { supabase } from '@/lib/supabase'
// // import ReactCountryFlag from 'react-country-flag'
// // import {
// //   Menu,
// //   Search,
// //   Bell,
// //   User,
// //   ChevronDown,
// //   HelpCircle,
// //   Settings,
// //   LogOut,
// //   Calendar,
// //   Package,
// //   ShoppingBag,
// //   X,
// //   LayoutDashboard,
// //   Users,
// //   Store,
// //   BarChart3,
// //   ClipboardList,
// //   PieChart,
// //   QrCode,
// //   UserCircle,
// //   ShoppingCart,
// //   AlertCircle,
// //   Check,
// //   Trash2
// // } from 'lucide-react'

// // export default function TopBar({ sidebarCollapsed, isMobile, onMenuClick }) {
// //   const [user, setUser] = useState(null)
// //   const [profileImageUrl, setProfileImageUrl] = useState(null)
// //   const [notifications, setNotifications] = useState([])
// //   const [searchQuery, setSearchQuery] = useState('')
// //   const [showProfileMenu, setShowProfileMenu] = useState(false)
// //   const [showNotifications, setShowNotifications] = useState(false)
// //   const [showMobileMenu, setShowMobileMenu] = useState(false)
// //   const [showLanguageMenu, setShowLanguageMenu] = useState(false)
// //   const [currentLanguage, setCurrentLanguage] = useState('fr')
// //   const [lowStockCount, setLowStockCount] = useState(0)
// //   const [unreadNotifications, setUnreadNotifications] = useState([])
  
// //   const pathname = usePathname()

// //   useEffect(() => {
// //     const currentUser = checkAuth()
// //     setUser(currentUser)
    
// //     if (currentUser?.profile_image) {
// //       const { data } = supabase.storage
// //         .from('avatars')
// //         .getPublicUrl(currentUser.profile_image)
      
// //       setProfileImageUrl(data.publicUrl + '?t=' + new Date().getTime())
// //     }
    
// //     // Charger les notifications de stock faible
// //     loadLowStockNotifications()
    
// //     // Mettre en place un intervalle pour vérifier régulièrement
// //     const interval = setInterval(loadLowStockNotifications, 60000) // Toutes les minutes
    
// //     return () => clearInterval(interval)
// //   }, [])

// //   // Fonction pour charger les produits en stock faible
// //   const loadLowStockNotifications = async () => {
// //     try {
// //       const { data: products, error } = await supabase
// //         .from('products')
// //         .select(`
// //           *,
// //           category:categories(id, name),
// //           supplier:suppliers(id, name),
// //           stock:stock(quantity, minimum_threshold)
// //         `)
// //         .eq('is_active', true)
// //         .order('created_at', { ascending: false })

// //       if (!error && products) {
// //         // Filtrer les produits en stock faible
// //         const lowStockProducts = products.filter(product => {
// //           const stock = product.stock?.[0]
// //           return stock && stock.quantity <= stock.minimum_threshold
// //         })
        
// //         setLowStockCount(lowStockProducts.length)
        
// //         // Créer des notifications pour les produits en stock faible
// //         const stockNotifications = lowStockProducts.map(product => ({
// //           id: product.id,
// //           type: 'stock',
// //           title: 'Stock faible',
// //           message: `${product.name} - Il reste ${product.stock[0].quantity} unités (seuil: ${product.stock[0].minimum_threshold})`,
// //           productId: product.id,
// //           productName: product.name,
// //           currentStock: product.stock[0].quantity,
// //           threshold: product.stock[0].minimum_threshold,
// //           category: product.category?.name || 'Non catégorisé',
// //           supplier: product.supplier?.name || 'Inconnu',
// //           isRead: false,
// //           timestamp: new Date().toISOString()
// //         }))
        
// //         // Récupérer les notifications non lues depuis localStorage
// //         const savedNotifications = JSON.parse(localStorage.getItem('lowStockNotifications') || '[]')
        
// //         // Fusionner et éviter les doublons
// //         const mergedNotifications = [...savedNotifications]
        
// //         stockNotifications.forEach(newNotif => {
// //           const exists = mergedNotifications.some(
// //             notif => notif.productId === newNotif.productId && !notif.isRead
// //           )
// //           if (!exists) {
// //             mergedNotifications.unshift(newNotif)
// //           }
// //         })
        
// //         // Garder seulement les 20 dernières notifications
// //         const recentNotifications = mergedNotifications.slice(0, 20)
        
// //         setNotifications(recentNotifications)
        
// //         // Sauvegarder dans localStorage
// //         localStorage.setItem('lowStockNotifications', JSON.stringify(recentNotifications))
        
// //         // Compter les non lues
// //         const unread = recentNotifications.filter(n => !n.isRead)
// //         setUnreadNotifications(unread)
// //       }
// //     } catch (error) {
// //       console.error('Erreur chargement notifications stock:', error)
// //     }
// //   }

// //   const getRoleDisplay = (role) => {
// //     switch(role) {
// //       case 'super-admin': return 'Super Admin'
// //       case 'admin': return 'Administrateur'
// //       case 'vendor': return 'Vendeur'
// //       default: return 'Utilisateur'
// //     }
// //   }

// //   const getPageTitle = () => {
// //     const pathSegments = pathname.split('/').filter(segment => segment)
    
// //     if (pathSegments.length === 0) return 'Tableau de bord'
    
// //     const lastSegment = pathSegments[pathSegments.length - 1]
    
// //     const titles = {
// //       'dashboard': 'Tableau de bord',
// //       'profile': 'Mon Profil',
// //       'users': 'Utilisateurs',
// //       'products': 'Produits',
// //       'orders': 'Commandes',
// //       'inventory': 'Inventaire',
// //       'reports': 'Rapports',
// //       'vendors': 'Vendeurs',
// //       'stats': 'Statistiques',
// //       'scanner': 'Scanner',
// //       'settings': 'Paramètres',
// //       'help': 'Aide & Support'
// //     }
    
// //     return titles[lastSegment] || 
// //            lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1).replace('-', ' ')
// //   }

// //   const getMenuItems = () => {
// //     if (!user) return []

// //     const baseItems = [
// //       {
// //         title: 'Tableau de bord',
// //         icon: LayoutDashboard,
// //         href: user.role === 'super-admin' ? '/' :
// //               user.role === 'admin' ? '/admin' : '/vendor',
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
    
// //     return [...baseItems, ...specificItems].filter(item => 
// //       item.roles.includes(user.role)
// //     )
// //   }

// //   const handleSearch = (e) => {
// //     e.preventDefault()
// //     console.log('Recherche:', searchQuery)
// //   }

// //   const handleLogout = () => {
// //     localStorage.removeItem('auth_token')
// //     localStorage.removeItem('user_data')
// //     localStorage.removeItem('lowStockNotifications')
// //     window.location.href = '/auth/login'
// //   }

// //   const markNotificationAsRead = (notificationId) => {
// //     const updatedNotifications = notifications.map(notif => 
// //       notif.id === notificationId ? { ...notif, isRead: true } : notif
// //     )
    
// //     setNotifications(updatedNotifications)
// //     localStorage.setItem('lowStockNotifications', JSON.stringify(updatedNotifications))
    
// //     // Mettre à jour le compteur de non lus
// //     const unread = updatedNotifications.filter(n => !n.isRead)
// //     setUnreadNotifications(unread)
// //   }

// //   const markAllAsRead = () => {
// //     const updatedNotifications = notifications.map(notif => ({ ...notif, isRead: true }))
    
// //     setNotifications(updatedNotifications)
// //     setUnreadNotifications([])
// //     localStorage.setItem('lowStockNotifications', JSON.stringify(updatedNotifications))
// //   }

// //   const deleteNotification = (notificationId) => {
// //     const updatedNotifications = notifications.filter(notif => notif.id !== notificationId)
    
// //     setNotifications(updatedNotifications)
    
// //     const unread = updatedNotifications.filter(n => !n.isRead)
// //     setUnreadNotifications(unread)
    
// //     localStorage.setItem('lowStockNotifications', JSON.stringify(updatedNotifications))
// //   }

// //   const deleteAllNotifications = () => {
// //     if (confirm('Êtes-vous sûr de vouloir supprimer toutes les notifications ?')) {
// //       setNotifications([])
// //       setUnreadNotifications([])
// //       localStorage.setItem('lowStockNotifications', JSON.stringify([]))
// //     }
// //   }

// //   const getUnreadCount = () => {
// //     return unreadNotifications.length
// //   }

// //   const handleNotificationClick = () => {
// //     setShowNotifications(!showNotifications)
// //   }

// //   // Liste des langues réduite à Français et Anglais
// //   const languages = [
// //     { code: 'fr', name: 'Français', countryCode: 'FR' },
// //     { code: 'en', name: 'English', countryCode: 'GB' }
// //   ]

// //   const handleLanguageChange = (langCode) => {
// //     setCurrentLanguage(langCode)
// //     setShowLanguageMenu(false)
// //     console.log('Langue changée pour:', langCode)
// //   }

// //   const menuItems = getMenuItems()

// //   if (!user) return null

// //   const initials = user.full_name
// //     ? user.full_name.split(' ').map(part => part[0]).join('').toUpperCase().substring(0, 2)
// //     : 'U'

// //   return (
// //     <>
// //       <header className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm">
// //         <div className="px-4 sm:px-6">
// //           <div className="flex items-center justify-between h-14">
// //             {/* Partie gauche */}
// //             <div className="flex items-center">
// //               {/* Bouton menu mobile */}
// //               <button
// //                 onClick={() => setShowMobileMenu(true)}
// //                 className="p-2 mr-2 rounded-md md:hidden block text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none"
// //               >
// //                 <img className='w-[35px]' src='/menu3.png' alt="Menu" />
// //               </button>

// //               {/* Titre de la page */}
// //               <div className="flex items-center">
// //                 <h1 className="text-lg font-semibold text-gray-900">
// //                   {getPageTitle()}
// //                 </h1>
// //               </div>
// //             </div>

// //             {/* Partie droite */}
// //             <div className="flex items-center space-x-2">
// //               {/* Barre de recherche */}
// //               {!isMobile && (
// //                 <form onSubmit={handleSearch} className="relative mr-2">
// //                   <div className="relative">
// //                     <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
// //                     <input
// //                       type="search"
// //                       placeholder="Rechercher..."
// //                       value={searchQuery}
// //                       onChange={(e) => setSearchQuery(e.target.value)}
// //                       className="pl-10 pr-4 py-1.5 w-56 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-all"
// //                     />
// //                   </div>
// //                 </form>
// //               )}

// //               {/* Sélecteur de langue */}
// //               <div className="relative">
// //                 <button
// //                   onClick={() => setShowLanguageMenu(!showLanguageMenu)}
// //                   className="flex items-center space-x-2 p-1.5 rounded-md hover:bg-gray-100 text-gray-600 hover:text-gray-900 transition-colors"
// //                   title="Changer de langue"
// //                 >
// //                   <ReactCountryFlag
// //                     countryCode={languages.find(lang => lang.code === currentLanguage)?.countryCode || 'FR'}
// //                     svg
// //                     style={{
// //                       width: '1.25em',
// //                       height: '1.25em',
// //                       borderRadius: '2px'
// //                     }}
// //                     title={languages.find(lang => lang.code === currentLanguage)?.name}
// //                   />
// //                   <ChevronDown className="h-3 w-3" />
// //                 </button>

// //                 {/* Dropdown Langue */}
// //                 {showLanguageMenu && (
// //                   <>
// //                     <div
// //                       className="fixed inset-0 z-30"
// //                       onClick={() => setShowLanguageMenu(false)}
// //                     />
// //                     <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-40">
// //                       <div className="p-3 border-b border-gray-200">
// //                         <h3 className="font-semibold text-gray-900">Langue / Language</h3>
// //                       </div>
                      
// //                       <div className="py-2">
// //                         {languages.map((language) => (
// //                           <button
// //                             key={language.code}
// //                             onClick={() => handleLanguageChange(language.code)}
// //                             className={`
// //                               flex items-center w-full px-4 py-2 text-sm
// //                               ${currentLanguage === language.code
// //                                 ? 'bg-blue-50 text-blue-700'
// //                                 : 'text-gray-700 hover:bg-gray-50'
// //                               }
// //                             `}
// //                           >
// //                             <ReactCountryFlag
// //                               countryCode={language.countryCode}
// //                               svg
// //                               style={{
// //                                 width: '1.25em',
// //                                 height: '1.25em',
// //                                 marginRight: '12px',
// //                                 borderRadius: '2px'
// //                               }}
// //                               title={language.name}
// //                             />
// //                             <span className="flex-1 text-left">{language.name}</span>
// //                             {currentLanguage === language.code && (
// //                               <span className="text-blue-600 text-xs font-medium">✓</span>
// //                             )}
// //                           </button>
// //                         ))}
// //                       </div>
// //                     </div>
// //                   </>
// //                 )}
// //               </div>

// //               {/* Bouton d'aide */}
// //               <button
// //                 className="p-1.5 rounded-md hover:bg-gray-100 text-gray-600 hover:text-gray-900 transition-colors"
// //                 title="Aide"
// //               >
// //                 <HelpCircle className="h-4 w-4" />
// //               </button>

// //               {/* Notifications */}
// //               <div className="relative">
// //                 <button
// //                   onClick={handleNotificationClick}
// //                   className="p-1.5 rounded-md hover:bg-gray-100 text-gray-600 hover:text-gray-900 transition-colors relative"
// //                   title="Notifications"
// //                 >
// //                   <Bell className="h-4 w-4" />
// //                   {getUnreadCount() > 0 && (
// //                     <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center text-[10px]">
// //                       {getUnreadCount()}
// //                     </span>
// //                   )}
// //                 </button>

// //                 {/* Panneau des notifications */}
// //                 {showNotifications && (
// //                   <>
// //                     <div
// //                       className="fixed inset-0 z-30"
// //                       onClick={() => setShowNotifications(false)}
// //                     />
// //                     <div className="absolute right-0 mt-1 w-96 bg-white rounded-lg shadow-lg border border-gray-200 z-40">
// //                       <div className="p-4 border-b border-gray-200">
// //                         <div className="flex items-center justify-between">
// //                           <div className="flex items-center space-x-2">
// //                             <Bell className="h-5 w-5 text-gray-600" />
// //                             <h3 className="font-semibold text-gray-900">
// //                               Notifications
// //                               {getUnreadCount() > 0 && (
// //                                 <span className="ml-2 bg-red-100 text-red-800 text-xs px-2 py-0.5 rounded-full">
// //                                   {getUnreadCount()} non lu{getUnreadCount() > 1 ? 's' : ''}
// //                                 </span>
// //                               )}
// //                             </h3>
// //                           </div>
// //                           <div className="flex items-center space-x-2">
// //                             {getUnreadCount() > 0 && (
// //                               <button
// //                                 onClick={markAllAsRead}
// //                                 className="text-xs text-blue-600 hover:text-blue-800 hover:underline"
// //                                 title="Tout marquer comme lu"
// //                               >
// //                                 Tout lire
// //                               </button>
// //                             )}
// //                             {notifications.length > 0 && (
// //                               <button
// //                                 onClick={deleteAllNotifications}
// //                                 className="text-xs text-red-600 hover:text-red-800 hover:underline"
// //                                 title="Supprimer toutes les notifications"
// //                               >
// //                                 Tout effacer
// //                               </button>
// //                             )}
// //                           </div>
// //                         </div>
// //                       </div>
                      
// //                       <div className="max-h-96 overflow-y-auto">
// //                         {notifications.length > 0 ? (
// //                           <div className="divide-y divide-gray-100">
// //                             {notifications.map((notification) => (
// //                               <div
// //                                 key={`${notification.id}-${notification.timestamp}`}
// //                                 className={`
// //                                   p-3 hover:bg-gray-50 transition-colors
// //                                   ${!notification.isRead ? 'bg-blue-50/50' : ''}
// //                                 `}
// //                               >
// //                                 <div className="flex items-start justify-between">
// //                                   <div className="flex items-start space-x-3">
// //                                     <div className={`mt-0.5 ${notification.type === 'stock' ? 'text-red-600' : 'text-blue-600'}`}>
// //                                       {notification.type === 'stock' ? (
// //                                         <AlertCircle className="h-5 w-5" />
// //                                       ) : (
// //                                         <Bell className="h-5 w-5" />
// //                                       )}
// //                                     </div>
// //                                     <div className="flex-1 min-w-0">
// //                                       <div className="flex items-center space-x-2 mb-1">
// //                                         <p className="font-medium text-gray-900 text-sm">
// //                                           {notification.title}
// //                                         </p>
// //                                         {!notification.isRead && (
// //                                           <span className="inline-block w-2 h-2 bg-blue-500 rounded-full"></span>
// //                                         )}
// //                                       </div>
// //                                       <p className="text-sm text-gray-600 mb-1">
// //                                         {notification.message}
// //                                       </p>
// //                                       <div className="flex items-center space-x-4 text-xs text-gray-500">
// //                                         <span>
// //                                           Catégorie: {notification.category}
// //                                         </span>
// //                                         <span>
// //                                           Fournisseur: {notification.supplier}
// //                                         </span>
// //                                       </div>
// //                                       <div className="mt-1 text-xs text-gray-400">
// //                                         {new Date(notification.timestamp).toLocaleString('fr-FR', {
// //                                           day: '2-digit',
// //                                           month: '2-digit',
// //                                           year: 'numeric',
// //                                           hour: '2-digit',
// //                                           minute: '2-digit'
// //                                         })}
// //                                       </div>
// //                                     </div>
// //                                   </div>
// //                                   <div className="flex flex-col space-y-1 ml-2">
// //                                     {!notification.isRead && (
// //                                       <button
// //                                         onClick={() => markNotificationAsRead(notification.id)}
// //                                         className="p-1 text-green-600 hover:text-green-800 hover:bg-green-50 rounded"
// //                                         title="Marquer comme lu"
// //                                       >
// //                                         <Check className="h-4 w-4" />
// //                                       </button>
// //                                     )}
// //                                     <button
// //                                       onClick={() => deleteNotification(notification.id)}
// //                                       className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
// //                                       title="Supprimer"
// //                                     >
// //                                       <Trash2 className="h-4 w-4" />
// //                                     </button>
// //                                   </div>
// //                                 </div>
// //                               </div>
// //                             ))}
// //                           </div>
// //                         ) : (
// //                           <div className="p-8 text-center">
// //                             <Bell className="h-12 w-12 text-gray-300 mx-auto mb-3" />
// //                             <p className="text-gray-500 text-sm">
// //                               Aucune notification pour le moment
// //                             </p>
// //                           </div>
// //                         )}
// //                       </div>
                      
// //                       {/* Afficher le nombre de produits en stock faible */}
// //                       {lowStockCount > 0 && (
// //                         <div className="border-t border-gray-200 p-3 bg-red-50">
// //                           <div className="flex items-center justify-between">
// //                             <div className="flex items-center space-x-2">
// //                               <AlertCircle className="h-5 w-5 text-red-600" />
// //                               <span className="text-sm font-medium text-red-900">
// //                                 {lowStockCount} produit{lowStockCount > 1 ? 's' : ''} en stock faible
// //                               </span>
// //                             </div>
// //                             <a
// //                               href="/super-admin/products"
// //                               className="text-sm text-red-700 hover:text-red-900 hover:underline"
// //                               onClick={() => setShowNotifications(false)}
// //                             >
// //                               Voir les produits
// //                             </a>
// //                           </div>
// //                         </div>
// //                       )}
// //                     </div>
// //                   </>
// //                 )}
// //               </div>

// //               {/* Séparateur */}
// //               <div className="h-4 w-px bg-gray-300 mx-1" />

// //               {/* Profil utilisateur */}
// //               <div className="relative">
// //                 <button
// //                   onClick={() => setShowProfileMenu(!showProfileMenu)}
// //                   className="flex items-center space-x-2 p-1 rounded-md hover:bg-gray-100"
// //                 >
// //                   <div className="relative">
// //                     <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-100 flex items-center justify-center overflow-hidden">
// //                       {profileImageUrl ? (
// //                         <img
// //                           src={profileImageUrl}
// //                           alt={user.full_name || 'Utilisateur'}
// //                           className="w-full h-full object-cover"
// //                           onError={(e) => {
// //                             e.target.style.display = 'none'
// //                           }}
// //                         />
// //                       ) : (
// //                         <span className="font-medium text-blue-600 text-sm">
// //                           {initials}
// //                         </span>
// //                       )}
// //                     </div>
// //                     <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 border border-white rounded-full"></div>
// //                   </div>
                  
// //                   <ChevronDown className="h-4 w-4 text-gray-400" />
// //                 </button>

// //                 {/* Dropdown Profil */}
// //                 {showProfileMenu && (
// //                   <>
// //                     <div
// //                       className="fixed inset-0 z-30"
// //                       onClick={() => setShowProfileMenu(false)}
// //                     />
// //                     <div className="absolute right-0 mt-1 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-40">
// //                       <div className="p-4 border-b border-gray-200">
// //                         <div className="flex items-center space-x-3">
// //                           <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-100 flex items-center justify-center overflow-hidden">
// //                             {profileImageUrl ? (
// //                               <img
// //                                 src={profileImageUrl}
// //                                 alt={user.full_name || 'Utilisateur'}
// //                                 className="w-full h-full object-cover"
// //                               />
// //                             ) : (
// //                               <span className="font-medium text-blue-600">
// //                                 {initials}
// //                               </span>
// //                             )}
// //                           </div>
// //                           <div>
// //                             <p className="font-semibold text-gray-900">
// //                               {user.full_name || 'Utilisateur'}
// //                             </p>
// //                             <p className="text-sm text-gray-500">
// //                               {user.email}
// //                             </p>
// //                             <span className="inline-block mt-1 px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-700">
// //                               {getRoleDisplay(user.role)}
// //                             </span>
// //                           </div>
// //                         </div>
// //                       </div>
                      
// //                       <div className="py-1">
// //                         <a
// //                           href="/profile"
// //                           className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
// //                           onClick={() => setShowProfileMenu(false)}
// //                         >
// //                           <User className="h-4 w-4 mr-3 text-gray-400" />
// //                           Mon Profil
// //                         </a>
// //                         <a
// //                           href="/settings"
// //                           className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
// //                           onClick={() => setShowProfileMenu(false)}
// //                         >
// //                           <Settings className="h-4 w-4 mr-3 text-gray-400" />
// //                           Paramètres
// //                         </a>
// //                         <a
// //                           href="/help"
// //                           className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
// //                           onClick={() => setShowProfileMenu(false)}
// //                         >
// //                           <HelpCircle className="h-4 w-4 mr-3 text-gray-400" />
// //                           Aide & Support
// //                         </a>
// //                       </div>
                      
// //                       <div className="border-t border-gray-200 py-1">
// //                         <button
// //                           onClick={handleLogout}
// //                           className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
// //                         >
// //                           <LogOut className="h-4 w-4 mr-3" />
// //                           Déconnexion
// //                         </button>
// //                       </div>
// //                     </div>
// //                   </>
// //                 )}
// //               </div>
// //             </div>
// //           </div>
// //         </div>
// //       </header>

// //       {/* Menu Mobile Overlay */}
// //       {showMobileMenu && (
// //         <div className="fixed inset-0 z-40">
// //           <div 
// //             className="absolute inset-0 bg-black/50"
// //             onClick={() => setShowMobileMenu(false)}
// //           />
          
// //           <div className="absolute left-0 top-0 h-full w-64 bg-white shadow-xl transform transition-transform duration-300">
// //             <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100">
// //               <div className="flex items-center justify-between mb-4">
// //                 <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
// //                   <Package className="w-5 h-5 text-blue-600" />
// //                   ShopManage
// //                 </h2>
// //                 <button
// //                   onClick={() => setShowMobileMenu(false)}
// //                   className="p-2 rounded-md hover:bg-white/50"
// //                 >
// //                   <X className="h-5 w-5 text-gray-700" />
// //                 </button>
// //               </div>
              
// //               <div className="flex items-center space-x-3 p-2 rounded-lg bg-white/50">
// //                 <div className="relative">
// //                   <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 border border-blue-200 flex items-center justify-center overflow-hidden">
// //                     {profileImageUrl ? (
// //                       <img
// //                         src={profileImageUrl}
// //                         alt={user.full_name || 'Utilisateur'}
// //                         className="w-full h-full object-cover"
// //                       />
// //                     ) : (
// //                       <span className="font-semibold text-blue-600 text-sm">
// //                         {initials}
// //                       </span>
// //                     )}
// //                   </div>
// //                   <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
// //                 </div>
                
// //                 <div className="flex-1 min-w-0">
// //                   <p className="text-sm font-semibold text-gray-900 truncate">
// //                     {user.full_name || 'Utilisateur'}
// //                   </p>
// //                   <p className="text-xs text-gray-600 truncate">
// //                     {user.email}
// //                   </p>
// //                   <span className={`inline-block mt-1 px-2 py-0.5 text-xs rounded-full ${
// //                     user.role === 'super-admin' ? 'bg-red-100 text-red-800' :
// //                     user.role === 'admin' ? 'bg-blue-100 text-blue-800' :
// //                     'bg-green-100 text-green-800'
// //                   }`}>
// //                     {getRoleDisplay(user.role)}
// //                   </span>
// //                 </div>
// //               </div>
// //             </div>

// //             <nav className="flex-1 overflow-y-auto py-4">
// //               <div className="p-2">
// //                 <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 mb-2">
// //                   Navigation
// //                 </p>
// //                 <ul className="space-y-1">
// //                   {menuItems.map((item) => {
// //                     const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
// //                     const Icon = item.icon
                    
// //                     return (
// //                       <li key={item.href}>
// //                         <a
// //                           href={item.href}
// //                           className={`
// //                             flex items-center w-full text-left
// //                             py-3 px-4 
// //                             transition-colors duration-200
// //                             ${isActive
// //                               ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600'
// //                               : 'hover:bg-gray-50 text-gray-700'
// //                             }
// //                           `}
// //                           onClick={() => setShowMobileMenu(false)}
// //                         >
// //                           <Icon className={`
// //                             ${isActive
// //                               ? 'text-blue-600'
// //                               : 'text-gray-400'
// //                             }
// //                             w-5 h-5
// //                           `} />
// //                           <span className="ml-3 font-medium">{item.title}</span>
// //                         </a>
// //                       </li>
// //                     )
// //                   })}
// //                 </ul>
// //               </div>

// //               {/* Section notifications dans le menu mobile */}
// //               <div className="mt-6 px-2">
// //                 <div className="flex items-center justify-between px-3 mb-2">
// //                   <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
// //                     Notifications
// //                   </p>
// //                   {getUnreadCount() > 0 && (
// //                     <span className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
// //                       {getUnreadCount()}
// //                     </span>
// //                   )}
// //                 </div>
                
// //                 <div className="space-y-2 px-3">
// //                   {lowStockCount > 0 && (
// //                     <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
// //                       <div className="flex items-center space-x-2">
// //                         <AlertCircle className="w-4 h-4 text-red-600" />
// //                         <div>
// //                           <p className="text-sm font-medium text-red-900">
// //                             Stock faible détecté
// //                           </p>
// //                           <p className="text-xs text-red-700">
// //                             {lowStockCount} produit{lowStockCount > 1 ? 's' : ''} nécessite{lowStockCount > 1 ? 'nt' : ''} attention
// //                           </p>
// //                         </div>
// //                       </div>
// //                       <a
// //                         href="/super-admin/products"
// //                         className="mt-2 inline-block w-full text-center text-xs text-red-700 hover:text-red-900 border border-red-300 hover:border-red-400 rounded px-3 py-1.5"
// //                         onClick={() => setShowMobileMenu(false)}
// //                       >
// //                         Voir les produits
// //                       </a>
// //                     </div>
// //                   )}
                  
// //                   <a
// //                     href="#"
// //                     onClick={(e) => {
// //                       e.preventDefault()
// //                       setShowMobileMenu(false)
// //                       handleNotificationClick()
// //                     }}
// //                     className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 border border-gray-200 transition-colors"
// //                   >
// //                     <div className="flex items-center space-x-2">
// //                       <Bell className="w-4 h-4 text-gray-600" />
// //                       <span className="text-sm text-gray-700">Voir toutes les notifications</span>
// //                     </div>
// //                     {getUnreadCount() > 0 && (
// //                       <span className="w-2 h-2 bg-red-500 rounded-full"></span>
// //                     )}
// //                   </a>
// //                 </div>
// //               </div>

// //               {/* Section langue dans le menu mobile */}
// //               <div className="mt-6 px-2">
// //                 <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 mb-2">
// //                   Langue
// //                 </p>
// //                 <div className="grid grid-cols-2 gap-2 px-3">
// //                   {languages.map((language) => (
// //                     <button
// //                       key={language.code}
// //                       onClick={() => {
// //                         handleLanguageChange(language.code)
// //                         setShowMobileMenu(false)
// //                       }}
// //                       className={`
// //                         flex items-center justify-center p-3 rounded-lg
// //                         ${currentLanguage === language.code
// //                           ? 'bg-blue-50 border border-blue-200'
// //                           : 'hover:bg-gray-50 border border-transparent'
// //                         }
// //                       `}
// //                     >
// //                       <ReactCountryFlag
// //                         countryCode={language.countryCode}
// //                         svg
// //                         style={{
// //                           width: '1.5em',
// //                           height: '1.5em',
// //                           marginRight: '8px',
// //                           borderRadius: '2px'
// //                         }}
// //                         title={language.name}
// //                       />
// //                       <span className="text-sm font-medium text-gray-700">{language.name}</span>
// //                     </button>
// //                   ))}
// //                 </div>
// //               </div>

// //               <div className="mt-6 px-2">
// //                 <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 mb-2">
// //                   Application
// //                 </p>
// //                 <ul className="space-y-1">
// //                   <li>
// //                     <a
// //                       href="/settings"
// //                       className="flex items-center py-3 px-4 rounded-lg hover:bg-gray-50 text-gray-700 transition-colors"
// //                       onClick={() => setShowMobileMenu(false)}
// //                     >
// //                       <Settings className="w-5 h-5 text-gray-400 mr-3" />
// //                       <span>Paramètres</span>
// //                     </a>
// //                   </li>
// //                   <li>
// //                     <a
// //                       href="/help"
// //                       className="flex items-center py-3 px-4 rounded-lg hover:bg-gray-50 text-gray-700 transition-colors"
// //                       onClick={() => setShowMobileMenu(false)}
// //                     >
// //                       <HelpCircle className="w-5 h-5 text-gray-400 mr-3" />
// //                       <span>Aide & Support</span>
// //                     </a>
// //                   </li>
// //                   <li>
// //                     <button
// //                       onClick={() => {
// //                         handleLogout()
// //                         setShowMobileMenu(false)
// //                       }}
// //                       className="flex items-center w-full py-3 px-4 rounded-lg hover:bg-red-50 text-red-600 transition-colors"
// //                     >
// //                       <LogOut className="w-5 h-5 mr-3" />
// //                       <span>Déconnexion</span>
// //                     </button>
// //                   </li>
// //                 </ul>
// //               </div>

// //               <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-gray-50">
// //                 <p className="text-xs text-center text-gray-500">
// //                   © 2024 ShopManage v1.0
// //                 </p>
// //               </div>
// //             </nav>
// //           </div>
// //         </div>
// //       )}
// //     </>
// //   )
// // }


// 'use client'

// import { useState, useEffect } from 'react'
// import { usePathname } from 'next/navigation'
// import { checkAuth } from '@/lib/auth'
// import { supabase } from '@/lib/supabase'
// import { useLanguage } from '@/contexts/LanguageContext'
// import ReactCountryFlag from 'react-country-flag'
// import {
//   Menu,
//   Search,
//   Bell,
//   User,
//   ChevronDown,
//   HelpCircle,
//   Settings,
//   LogOut,
//   Calendar,
//   Package,
//   ShoppingBag,
//   X,
//   LayoutDashboard,
//   Users,
//   Store,
//   BarChart3,
//   ClipboardList,
//   PieChart,
//   QrCode,
//   UserCircle,
//   ShoppingCart,
//   AlertCircle,
//   Check,
//   Trash2,
//   Trash,
//   CheckCircle2
// } from 'lucide-react'

// export default function TopBar({ sidebarCollapsed, isMobile, onMenuClick }) {
//   const [user, setUser] = useState(null)
//   const [profileImageUrl, setProfileImageUrl] = useState(null)
//   const [notifications, setNotifications] = useState([])
//   const [searchQuery, setSearchQuery] = useState('')
//   const [showProfileMenu, setShowProfileMenu] = useState(false)
//   const [showNotifications, setShowNotifications] = useState(false)
//   const [showMobileMenu, setShowMobileMenu] = useState(false)
//   const [showLanguageMenu, setShowLanguageMenu] = useState(false)
//   const [lowStockCount, setLowStockCount] = useState(0)
//   const [unreadNotifications, setUnreadNotifications] = useState([])
  
//   const pathname = usePathname()
//   const { t, language, changeLanguage } = useLanguage()

//   // Charger la langue au démarrage
//   useEffect(() => {
//     const savedLanguage = localStorage.getItem('language') || 'fr';
//     if (savedLanguage && savedLanguage !== language) {
//       changeLanguage(savedLanguage);
//     }
//   }, []);

//   // Écouter les changements de langue
//   useEffect(() => {
//     const handleLanguageChange = () => {
//       // Recharger les données si nécessaire
//     };

//     window.addEventListener('languageChanged', handleLanguageChange);
//     return () => window.removeEventListener('languageChanged', handleLanguageChange);
//   }, []);

//   useEffect(() => {
//     const currentUser = checkAuth()
//     setUser(currentUser)
    
//     if (currentUser?.profile_image) {
//       const { data } = supabase.storage
//         .from('avatars')
//         .getPublicUrl(currentUser.profile_image)
      
//       setProfileImageUrl(data.publicUrl + '?t=' + new Date().getTime())
//     }
    
//     // Charger les notifications de stock faible
//     loadLowStockNotifications()
    
//     // Mettre en place un intervalle pour vérifier régulièrement
//     const interval = setInterval(loadLowStockNotifications, 60000)
    
//     return () => clearInterval(interval)
//   }, [])

//   // Fonction pour charger les produits en stock faible
//   const loadLowStockNotifications = async () => {
//     try {
//       const { data: products, error } = await supabase
//         .from('products')
//         .select(`
//           *,
//           category:categories(id, name),
//           supplier:suppliers(id, name),
//           stock:stock(quantity, minimum_threshold)
//         `)
//         .eq('is_active', true)
//         .order('created_at', { ascending: false })

//       if (!error && products) {
//         // Filtrer les produits en stock faible
//         const lowStockProducts = products.filter(product => {
//           const stock = product.stock?.[0]
//           return stock && stock.quantity <= stock.minimum_threshold
//         })
        
//         setLowStockCount(lowStockProducts.length)
        
//         // Créer des notifications pour les produits en stock faible
//         const stockNotifications = lowStockProducts.map(product => ({
//           id: product.id,
//           type: 'stock',
//           title: language === 'fr' ? 'Stock faible' : 'Low stock',
//           message: language === 'fr' 
//             ? `${product.name} - Il reste ${product.stock[0].quantity} unités (seuil: ${product.stock[0].minimum_threshold})`
//             : `${product.name} - Only ${product.stock[0].quantity} units left (threshold: ${product.stock[0].minimum_threshold})`,
//           productId: product.id,
//           productName: product.name,
//           currentStock: product.stock[0].quantity,
//           threshold: product.stock[0].minimum_threshold,
//           category: product.category?.name || (language === 'fr' ? 'Non catégorisé' : 'Uncategorized'),
//           supplier: product.supplier?.name || (language === 'fr' ? 'Inconnu' : 'Unknown'),
//           isRead: false,
//           timestamp: new Date().toISOString()
//         }))
        
//         // Récupérer les notifications non lues depuis localStorage
//         const savedNotifications = JSON.parse(localStorage.getItem('lowStockNotifications') || '[]')
        
//         // Mettre à jour les messages des notifications existantes avec la langue actuelle
//         const updatedSavedNotifications = savedNotifications.map(notif => ({
//           ...notif,
//           title: language === 'fr' ? 'Stock faible' : 'Low stock',
//           message: notif.type === 'stock' 
//             ? language === 'fr'
//               ? `${notif.productName} - Il reste ${notif.currentStock} unités (seuil: ${notif.threshold})`
//               : `${notif.productName} - Only ${notif.currentStock} units left (threshold: ${notif.threshold})`
//             : notif.message,
//           category: notif.category || (language === 'fr' ? 'Non catégorisé' : 'Uncategorized'),
//           supplier: notif.supplier || (language === 'fr' ? 'Inconnu' : 'Unknown')
//         }))
        
//         // Fusionner et éviter les doublons
//         const mergedNotifications = [...updatedSavedNotifications]
        
//         stockNotifications.forEach(newNotif => {
//           const exists = mergedNotifications.some(
//             notif => notif.productId === newNotif.productId && !notif.isRead
//           )
//           if (!exists) {
//             mergedNotifications.unshift(newNotif)
//           }
//         })
        
//         // Garder seulement les 20 dernières notifications
//         const recentNotifications = mergedNotifications.slice(0, 20)
        
//         setNotifications(recentNotifications)
        
//         // Sauvegarder dans localStorage
//         localStorage.setItem('lowStockNotifications', JSON.stringify(recentNotifications))
        
//         // Compter les non lues
//         const unread = recentNotifications.filter(n => !n.isRead)
//         setUnreadNotifications(unread)
//       }
//     } catch (error) {
//       console.error('Erreur chargement notifications stock:', error)
//     }
//   }

//   // Recharger les notifications quand la langue change
//   useEffect(() => {
//     if (notifications.length > 0) {
//       loadLowStockNotifications();
//     }
//   }, [language]);

//   const getRoleDisplay = (role) => {
//     return t(role) || role;
//   }

//   const getPageTitle = () => {
//     const pathSegments = pathname.split('/').filter(segment => segment)
    
//     if (pathSegments.length === 0) return t('dashboard')
    
//     const lastSegment = pathSegments[pathSegments.length - 1]
    
//     // Utiliser la traduction pour les titres de page
//     const translatedTitle = t(lastSegment)
//     if (translatedTitle !== lastSegment) {
//       return translatedTitle
//     }
    
//     // Fallback : capitaliser la première lettre
//     return lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1).replace('-', ' ')
//   }

//   const getMenuItems = () => {
//     if (!user) return []

//     const baseItems = [
//       {
//         title: t('dashboard'),
//         icon: LayoutDashboard,
//         href: user.role === 'super-admin' ? '/' :
//               user.role === 'admin' ? '/admin' : '/vendor',
//         roles: ['super-admin', 'admin', 'vendor']
//       },
//       {
//         title: t('profile'),
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
//           title: language === 'fr' ? 'Ventes' : 'Sales',
//           icon: ShoppingCart,
//           href: '/super-admin/sales',
//           roles: ['super-admin']
//         }
//       ],
//       'admin': [
//         {
//           title: language === 'fr' ? 'Vendeurs' : 'Sellers',
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
//           title: language === 'fr' ? 'Mes Produits' : 'My Products',
//           icon: Package,
//           href: '/vendor/products',
//           roles: ['vendor']
//         },
//         {
//           title: language === 'fr' ? 'Mes Commandes' : 'My Orders',
//           icon: ClipboardList,
//           href: '/vendor/orders',
//           roles: ['vendor']
//         },
//         {
//           title: language === 'fr' ? 'Mes Statistiques' : 'My Statistics',
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
    
//     return [...baseItems, ...specificItems].filter(item => 
//       item.roles.includes(user.role)
//     )
//   }

//   const handleSearch = (e) => {
//     e.preventDefault()
//     console.log('Recherche:', searchQuery)
//   }

//   const handleLogout = () => {
//     localStorage.removeItem('auth_token')
//     localStorage.removeItem('user_data')
//     localStorage.removeItem('lowStockNotifications')
//     window.location.href = '/auth/login'
//   }

//   const markNotificationAsRead = (notificationId) => {
//     const updatedNotifications = notifications.map(notif => 
//       notif.id === notificationId ? { ...notif, isRead: true } : notif
//     )
    
//     setNotifications(updatedNotifications)
//     localStorage.setItem('lowStockNotifications', JSON.stringify(updatedNotifications))
    
//     // Mettre à jour le compteur de non lus
//     const unread = updatedNotifications.filter(n => !n.isRead)
//     setUnreadNotifications(unread)
//   }

//   const markAllAsRead = () => {
//     const updatedNotifications = notifications.map(notif => ({ ...notif, isRead: true }))
    
//     setNotifications(updatedNotifications)
//     setUnreadNotifications([])
//     localStorage.setItem('lowStockNotifications', JSON.stringify(updatedNotifications))
//   }

//   const deleteNotification = (notificationId) => {
//     const updatedNotifications = notifications.filter(notif => notif.id !== notificationId)
    
//     setNotifications(updatedNotifications)
    
//     const unread = updatedNotifications.filter(n => !n.isRead)
//     setUnreadNotifications(unread)
    
//     localStorage.setItem('lowStockNotifications', JSON.stringify(updatedNotifications))
//   }

//   const deleteAllNotifications = () => {
//     if (confirm(language === 'fr' 
//       ? 'Êtes-vous sûr de vouloir supprimer toutes les notifications ?'
//       : 'Are you sure you want to delete all notifications?')) {
//       setNotifications([])
//       setUnreadNotifications([])
//       localStorage.setItem('lowStockNotifications', JSON.stringify([]))
//     }
//   }

//   const getUnreadCount = () => {
//     return unreadNotifications.length
//   }

//   const handleNotificationClick = () => {
//     setShowNotifications(!showNotifications)
//   }

//   // Liste des langues
//   const languages = [
//     { code: 'fr', name: 'Français', countryCode: 'FR' },
//     { code: 'en', name: 'English', countryCode: 'GB' }
//   ]

//   const handleLanguageChange = (langCode) => {
//     changeLanguage(langCode);
//     setShowLanguageMenu(false)
//     setShowMobileMenu(false)
//   }

//   const menuItems = getMenuItems()

//   if (!user) return null

//   const initials = user.full_name
//     ? user.full_name.split(' ').map(part => part[0]).join('').toUpperCase().substring(0, 2)
//     : 'U'

//   return (
//     <>
//       <header className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm">
//         <div className="px-4 sm:px-6">
//           <div className="flex items-center justify-between h-14">
//             {/* Partie gauche */}
//             <div className="flex items-center">
//               {/* Bouton menu mobile */}
//               <button
//                 onClick={() => setShowMobileMenu(true)}
//                 className="p-2 mr-2 rounded-md md:hidden block text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none"
//               >
//                 <img className='w-[35px]' src='/menu3.png' alt="Menu" />
//               </button>

//               {/* Titre de la page */}
//               <div className="flex items-center">
//                 <h1 className="text-lg font-semibold text-gray-900">
//                   {getPageTitle()}
//                 </h1>
//               </div>
//             </div>

//             {/* Partie droite */}
//             <div className="flex items-center space-x-2">
//               {/* Barre de recherche */}
//               {!isMobile && (
//                 <form onSubmit={handleSearch} className="relative mr-2">
//                   <div className="relative">
//                     <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
//                     <input
//                       type="search"
//                       placeholder={t('search')}
//                       value={searchQuery}
//                       onChange={(e) => setSearchQuery(e.target.value)}
//                       className="pl-10 pr-4 py-1.5 w-56 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-all"
//                     />
//                   </div>
//                 </form>
//               )}

//               {/* Sélecteur de langue */}
//               <div className="relative">
//                 <button
//                   onClick={() => setShowLanguageMenu(!showLanguageMenu)}
//                   className="flex items-center space-x-2 p-1.5 rounded-md hover:bg-gray-100 text-gray-600 hover:text-gray-900 transition-colors"
//                   title={language === 'fr' ? 'Changer de langue' : 'Change language'}
//                 >
//                   <ReactCountryFlag
//                     countryCode={languages.find(lang => lang.code === language)?.countryCode || 'FR'}
//                     svg
//                     style={{
//                       width: '1.25em',
//                       height: '1.25em',
//                       borderRadius: '2px'
//                     }}
//                     title={languages.find(lang => lang.code === language)?.name}
//                   />
//                   <ChevronDown className="h-3 w-3" />
//                 </button>

//                 {/* Dropdown Langue */}
//                 {showLanguageMenu && (
//                   <>
//                     <div
//                       className="fixed inset-0 z-30"
//                       onClick={() => setShowLanguageMenu(false)}
//                     />
//                     <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-40">
//                       <div className="p-3 border-b border-gray-200">
//                         <h3 className="font-semibold text-gray-900">{t('languageSelection')}</h3>
//                       </div>
                      
//                       <div className="py-2">
//                         {languages.map((languageItem) => (
//                           <button
//                             key={languageItem.code}
//                             onClick={() => handleLanguageChange(languageItem.code)}
//                             className={`
//                               flex items-center w-full px-4 py-2 text-sm
//                               ${language === languageItem.code
//                                 ? 'bg-blue-50 text-blue-700'
//                                 : 'text-gray-700 hover:bg-gray-50'
//                               }
//                             `}
//                           >
//                             <ReactCountryFlag
//                               countryCode={languageItem.countryCode}
//                               svg
//                               style={{
//                                 width: '1.25em',
//                                 height: '1.25em',
//                                 marginRight: '12px',
//                                 borderRadius: '2px'
//                               }}
//                               title={languageItem.name}
//                             />
//                             <span className="flex-1 text-left">{languageItem.name}</span>
//                             {language === languageItem.code && (
//                               <span className="text-blue-600 text-xs font-medium">✓</span>
//                             )}
//                           </button>
//                         ))}
//                       </div>
//                     </div>
//                   </>
//                 )}
//               </div>

//               {/* Bouton d'aide */}
//               <button
//                 className="p-1.5 rounded-md hover:bg-gray-100 text-gray-600 hover:text-gray-900 transition-colors"
//                 title={t('help')}
//               >
//                 <HelpCircle className="h-4 w-4" />
//               </button>

//               {/* Notifications */}
//               <div className="relative">
//                 <button
//                   onClick={handleNotificationClick}
//                   className="p-1.5 rounded-md hover:bg-gray-100 text-gray-600 hover:text-gray-900 transition-colors relative"
//                   title={t('notifications')}
//                 >
//                   <Bell className="h-4 w-4" />
//                   {getUnreadCount() > 0 && (
//                     <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center text-[10px]">
//                       {getUnreadCount()}
//                     </span>
//                   )}
//                 </button>

//                 {/* Panneau des notifications */}
//                 {showNotifications && (
//                   <>
//                     <div
//                       className="fixed inset-0 z-30"
//                       onClick={() => setShowNotifications(false)}
//                     />
//                     <div className="absolute tr -translate-x-[70%] left-1/2 top-[150%]  mt-1 w-[340px] bg-white rounded-lg shadow-lg border border-gray-200 z-40">
//                       <div className="p-4 border-b border-gray-200">
//                         <div className="flex items-center justify-between">
//                           <div className="flex items-center space-x-2">
//                             <Bell className="h-5 w-5 text-gray-600" />
//                             <h3 className="font-semibold text-xs text-gray-900">
//                               {t('notifications')}
//                               {getUnreadCount() > 0 && (
//                                 <span className="ml-2  bg-red-100 text-red-800 text-xs px-2 py-0.5 rounded-full">
//                                   {getUnreadCount()} {t('unread')}{getUnreadCount() > 1 && language === 'en' ? 's' : ''}
//                                 </span>
//                               )}
//                             </h3>
//                           </div>
//                           <div className="flex items-center space-x-2">
//                             {getUnreadCount() > 0 && (
//                               <button
//                                 onClick={markAllAsRead}
//                                 className="text-xs text-blue-600 hover:text-blue-800 hover:underline"
//                                 title={language === 'fr' ? "" : ""}
//                               >
//                                <CheckCircle2 className='w-4'/>
//                               </button>
//                             )}
//                             {notifications.length > 0 && (
//                               <button
//                                 onClick={deleteAllNotifications}
//                                 className="text-xs  text-red-600 hover:text-red-800 hover:underline"
//                                 title={language === 'fr' ? "Supprimer toutes les notifications" : "Delete all notifications"}
//                               >
//                                 <Trash className='w-4'/>
//                               </button>
//                             )}
//                           </div>
//                         </div>
//                       </div>
                      
//                       <div className="max-h-96 overflow-y-auto">
//                         {notifications.length > 0 ? (
//                           <div className="divide-y divide-gray-100">
//                             {notifications.map((notification) => (
//                               <div
//                                 key={`${notification.id}-${notification.timestamp}`}
//                                 className={`
//                                   p-3 hover:bg-gray-50 transition-colors
//                                   ${!notification.isRead ? 'bg-blue-50/50' : ''}
//                                 `}
//                               >
//                                 <div className="flex items-start justify-between">
//                                   <div className="flex items-start space-x-3">
//                                     <div className={`mt-0.5 ${notification.type === 'stock' ? 'text-red-600' : 'text-blue-600'}`}>
//                                       {notification.type === 'stock' ? (
//                                         <AlertCircle className="h-5 w-5" />
//                                       ) : (
//                                         <Bell className="h-5 w-5" />
//                                       )}
//                                     </div>
//                                     <div className="flex-1 min-w-0">
//                                       <div className="flex items-center space-x-2 mb-1">
//                                         <p className="font-medium text-gray-900 text-sm">
//                                           {notification.title}
//                                         </p>
//                                         {!notification.isRead && (
//                                           <span className="inline-block w-2 h-2 bg-blue-500 rounded-full"></span>
//                                         )}
//                                       </div>
//                                       <p className="text-sm text-gray-600 mb-1">
//                                         {notification.message}
//                                       </p>
//                                       <div className="flex items-center space-x-4 text-xs text-gray-500">
//                                         <span>
//                                           {t('category')}: {notification.category}
//                                         </span>
//                                         <span>
//                                           {t('supplier')}: {notification.supplier}
//                                         </span>
//                                       </div>
//                                       <div className="mt-1 text-xs text-gray-400">
//                                         {new Date(notification.timestamp).toLocaleString(language === 'fr' ? 'fr-FR' : 'en-GB', {
//                                           day: '2-digit',
//                                           month: '2-digit',
//                                           year: 'numeric',
//                                           hour: '2-digit',
//                                           minute: '2-digit'
//                                         })}
//                                       </div>
//                                     </div>
//                                   </div>
//                                   <div className="flex flex-col space-y-1 ml-2">
//                                     {!notification.isRead && (
//                                       <button
//                                         onClick={() => markNotificationAsRead(notification.id)}
//                                         className="p-1 text-green-600 hover:text-green-800 hover:bg-green-50 rounded"
//                                         title={t('markRead')}
//                                       >
//                                         <Check className="h-4 w-4" />
//                                       </button>
//                                     )}
//                                     <button
//                                       onClick={() => deleteNotification(notification.id)}
//                                       className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
//                                       title={t('delete')}
//                                     >
//                                       <Trash2 className="h-4 w-4" />
//                                     </button>
//                                   </div>
//                                 </div>
//                               </div>
//                             ))}
//                           </div>
//                         ) : (
//                           <div className="p-8 text-center">
//                             <Bell className="h-12 w-12 text-gray-300 mx-auto mb-3" />
//                             <p className="text-gray-500 text-sm">
//                               {t('noNotifications')}
//                             </p>
//                           </div>
//                         )}
//                       </div>
                      
//                       {/* Afficher le nombre de produits en stock faible */}
//                       {lowStockCount > 0 && (
//                         <div className="border-t border-gray-200 p-3 bg-red-50">
//                           <div className="flex items-center justify-between">
//                             <div className="flex items-center space-x-2">
//                               <AlertCircle className="h-5 w-5 text-red-600" />
//                               <span className="text-sm font-medium text-red-900">
//                                 {lowStockCount} {t('lowStockAlert')}
//                               </span>
//                             </div>
//                             <a
//                               href="/super-admin/products"
//                               className="text-sm text-red-700 hover:text-red-900 hover:underline"
//                               onClick={() => setShowNotifications(false)}
//                             >
//                               {t('viewProducts')}
//                             </a>
//                           </div>
//                         </div>
//                       )}
//                     </div>
//                   </>
//                 )}
//               </div>

//               {/* Séparateur */}
//               <div className="h-4 w-px bg-gray-300 mx-1" />

//               {/* Profil utilisateur */}
//               <div className="relative">
//                 <button
//                   onClick={() => setShowProfileMenu(!showProfileMenu)}
//                   className="flex items-center space-x-2 p-1 rounded-md hover:bg-gray-100"
//                 >
//                   <div className="relative">
//                     <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-100 flex items-center justify-center overflow-hidden">
//                       {profileImageUrl ? (
//                         <img
//                           src={profileImageUrl}
//                           alt={user.full_name || (language === 'fr' ? 'Utilisateur' : 'User')}
//                           className="w-full h-full object-cover"
//                           onError={(e) => {
//                             e.target.style.display = 'none'
//                           }}
//                         />
//                       ) : (
//                         <span className="font-medium text-blue-600 text-sm">
//                           {initials}
//                         </span>
//                       )}
//                     </div>
//                     <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 border border-white rounded-full"></div>
//                   </div>
                  
//                   <ChevronDown className="h-4 w-4 text-gray-400" />
//                 </button>

//                 {/* Dropdown Profil */}
//                 {showProfileMenu && (
//                   <>
//                     <div
//                       className="fixed inset-0 z-30"
//                       onClick={() => setShowProfileMenu(false)}
//                     />
//                     <div className="absolute right-0 mt-1 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-40">
//                       <div className="p-4 border-b border-gray-200">
//                         <div className="flex items-center space-x-3">
//                           <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-100 flex items-center justify-center overflow-hidden">
//                             {profileImageUrl ? (
//                               <img
//                                 src={profileImageUrl}
//                                 alt={user.full_name || (language === 'fr' ? 'Utilisateur' : 'User')}
//                                 className="w-full h-full object-cover"
//                               />
//                             ) : (
//                               <span className="font-medium text-blue-600">
//                                 {initials}
//                               </span>
//                             )}
//                           </div>
//                           <div>
//                             <p className="font-semibold text-gray-900">
//                               {user.full_name || (language === 'fr' ? 'Utilisateur' : 'User')}
//                             </p>
//                             <p className="text-sm text-gray-500">
//                               {user.email}
//                             </p>
//                             <span className="inline-block mt-1 px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-700">
//                               {getRoleDisplay(user.role)}
//                             </span>
//                           </div>
//                         </div>
//                       </div>
                      
//                       <div className="py-1">
//                         <a
//                           href="/profile"
//                           className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
//                           onClick={() => setShowProfileMenu(false)}
//                         >
//                           <User className="h-4 w-4 mr-3 text-gray-400" />
//                           {t('profile')}
//                         </a>
//                         <a
//                           href="/settings"
//                           className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
//                           onClick={() => setShowProfileMenu(false)}
//                         >
//                           <Settings className="h-4 w-4 mr-3 text-gray-400" />
//                           {t('settings')}
//                         </a>
//                         <a
//                           href="/help"
//                           className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
//                           onClick={() => setShowProfileMenu(false)}
//                         >
//                           <HelpCircle className="h-4 w-4 mr-3 text-gray-400" />
//                           {t('helpSupport')}
//                         </a>
//                       </div>
                      
//                       <div className="border-t border-gray-200 py-1">
//                         <button
//                           onClick={handleLogout}
//                           className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
//                         >
//                           <LogOut className="h-4 w-4 mr-3" />
//                           {t('logout')}
//                         </button>
//                       </div>
//                     </div>
//                   </>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       </header>

//       {/* Menu Mobile Overlay */}
//       {showMobileMenu && (
//         <div className="fixed inset-0 z-40">
//           <div 
//             className="absolute inset-0 bg-black/50"
//             onClick={() => setShowMobileMenu(false)}
//           />
          
//           <div className="absolute left-0 top-0 h-full w-64 bg-white shadow-xl transform transition-transform duration-300">
//             <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100">
//               <div className="flex items-center justify-between mb-4">
//                 <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
//                   <Package className="w-5 h-5 text-blue-600" />
//                   ShopManage
//                 </h2>
//                 <button
//                   onClick={() => setShowMobileMenu(false)}
//                   className="p-2 rounded-md hover:bg-white/50"
//                 >
//                   <X className="h-5 w-5 text-gray-700" />
//                 </button>
//               </div>
              
//               <div className="flex items-center space-x-3 p-2 rounded-lg bg-white/50">
//                 <div className="relative">
//                   <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 border border-blue-200 flex items-center justify-center overflow-hidden">
//                     {profileImageUrl ? (
//                       <img
//                         src={profileImageUrl}
//                         alt={user.full_name || (language === 'fr' ? 'Utilisateur' : 'User')}
//                         className="w-full h-full object-cover"
//                       />
//                     ) : (
//                       <span className="font-semibold text-blue-600 text-sm">
//                         {initials}
//                       </span>
//                     )}
//                   </div>
//                   <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
//                 </div>
                
//                 <div className="flex-1 min-w-0">
//                   <p className="text-sm font-semibold text-gray-900 truncate">
//                     {user.full_name || (language === 'fr' ? 'Utilisateur' : 'User')}
//                   </p>
//                   <p className="text-xs text-gray-600 truncate">
//                     {user.email}
//                   </p>
//                   <span className={`inline-block mt-1 px-2 py-0.5 text-xs rounded-full ${
//                     user.role === 'super-admin' ? 'bg-red-100 text-red-800' :
//                     user.role === 'admin' ? 'bg-blue-100 text-blue-800' :
//                     'bg-green-100 text-green-800'
//                   }`}>
//                     {getRoleDisplay(user.role)}
//                   </span>
//                 </div>
//               </div>
//             </div>

//             <nav className="flex-1 overflow-y-auto py-4">
//               <div className="p-2">
//                 <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 mb-2">
//                   {t('navigation')}
//                 </p>
//                 <ul className="space-y-1">
//                   {menuItems.map((item) => {
//                     const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
//                     const Icon = item.icon
                    
//                     return (
//                       <li key={item.href}>
//                         <a
//                           href={item.href}
//                           className={`
//                             flex items-center w-full text-left
//                             py-3 px-4 
//                             transition-colors duration-200
//                             ${isActive
//                               ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600'
//                               : 'hover:bg-gray-50 text-gray-700'
//                             }
//                           `}
//                           onClick={() => setShowMobileMenu(false)}
//                         >
//                           <Icon className={`
//                             ${isActive
//                               ? 'text-blue-600'
//                               : 'text-gray-400'
//                             }
//                             w-5 h-5
//                           `} />
//                           <span className="ml-3 font-medium">{item.title}</span>
//                         </a>
//                       </li>
//                     )
//                   })}
//                 </ul>
//               </div>

//               {/* Section notifications dans le menu mobile */}
//               <div className="mt-6 px-2">
//                 <div className="flex items-center justify-between px-3 mb-2">
//                   <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
//                     {t('notifications')}
//                   </p>
//                   {getUnreadCount() > 0 && (
//                     <span className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
//                       {getUnreadCount()}
//                     </span>
//                   )}
//                 </div>
                
//                 <div className="space-y-2 px-3">
//                   {lowStockCount > 0 && (
//                     <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
//                       <div className="flex items-center space-x-2">
//                         <AlertCircle className="w-4 h-4 text-red-600" />
//                         <div>
//                           <p className="text-sm font-medium text-red-900">
//                             {t('stockDetected')}
//                           </p>
//                           <p className="text-xs text-red-700">
//                             {lowStockCount} {t('attentionRequired')}
//                           </p>
//                         </div>
//                       </div>
//                       <a
//                         href="/super-admin/products"
//                         className="mt-2 inline-block w-full text-center text-xs text-red-700 hover:text-red-900 border border-red-300 hover:border-red-400 rounded px-3 py-1.5"
//                         onClick={() => setShowMobileMenu(false)}
//                       >
//                         {t('seeProducts')}
//                       </a>
//                     </div>
//                   )}
                  
//                   <a
//                     href="#"
//                     onClick={(e) => {
//                       e.preventDefault()
//                       setShowMobileMenu(false)
//                       handleNotificationClick()
//                     }}
//                     className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 border border-gray-200 transition-colors"
//                   >
//                     <div className="flex items-center space-x-2">
//                       <Bell className="w-4 h-4 text-gray-600" />
//                       <span className="text-sm text-gray-700">{t('seeAllNotifications')}</span>
//                     </div>
//                     {getUnreadCount() > 0 && (
//                       <span className="w-2 h-2 bg-red-500 rounded-full"></span>
//                     )}
//                   </a>
//                 </div>
//               </div>

//               {/* Section langue dans le menu mobile */}
//               <div className="mt-6 px-2">
//                 <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 mb-2">
//                   {t('language')}
//                 </p>
//                 <div className="grid grid-cols-2 gap-2 px-3">
//                   {languages.map((languageItem) => (
//                     <button
//                       key={languageItem.code}
//                       onClick={() => {
//                         handleLanguageChange(languageItem.code)
//                         setShowMobileMenu(false)
//                       }}
//                       className={`
//                         flex items-center justify-center p-3 rounded-lg
//                         ${language === languageItem.code
//                           ? 'bg-blue-50 border border-blue-200'
//                           : 'hover:bg-gray-50 border border-transparent'
//                         }
//                       `}
//                     >
//                       <ReactCountryFlag
//                         countryCode={languageItem.countryCode}
//                         svg
//                         style={{
//                           width: '1.5em',
//                           height: '1.5em',
//                           marginRight: '8px',
//                           borderRadius: '2px'
//                         }}
//                         title={languageItem.name}
//                       />
//                       <span className="text-sm font-medium text-gray-700">{languageItem.name}</span>
//                     </button>
//                   ))}
//                 </div>
//               </div>

//               <div className="mt-6 px-2">
//                 <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 mb-2">
//                   {t('application')}
//                 </p>
//                 <ul className="space-y-1">
//                   <li>
//                     <a
//                       href="/settings"
//                       className="flex items-center py-3 px-4 rounded-lg hover:bg-gray-50 text-gray-700 transition-colors"
//                       onClick={() => setShowMobileMenu(false)}
//                     >
//                       <Settings className="w-5 h-5 text-gray-400 mr-3" />
//                       <span>{t('settings')}</span>
//                     </a>
//                   </li>
//                   <li>
//                     <a
//                       href="/help"
//                       className="flex items-center py-3 px-4 rounded-lg hover:bg-gray-50 text-gray-700 transition-colors"
//                       onClick={() => setShowMobileMenu(false)}
//                     >
//                       <HelpCircle className="w-5 h-5 text-gray-400 mr-3" />
//                       <span>{t('helpSupport')}</span>
//                     </a>
//                   </li>
//                   <li>
//                     <button
//                       onClick={() => {
//                         handleLogout()
//                         setShowMobileMenu(false)
//                       }}
//                       className="flex items-center w-full py-3 px-4 rounded-lg hover:bg-red-50 text-red-600 transition-colors"
//                     >
//                       <LogOut className="w-5 h-5 mr-3" />
//                       <span>{t('logout')}</span>
//                     </button>
//                   </li>
//                 </ul>
//               </div>

//               <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-gray-50">
//                 <p className="text-xs text-center text-gray-500">
//                   © 2024 ShopManage v1.0
//                 </p>
//               </div>
//             </nav>
//           </div>
//         </div>
//       )}
//     </>
//   )
// }


'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { checkAuth } from '@/lib/auth'
import { supabase } from '@/lib/supabase'
import { useLanguage } from '@/contexts/LanguageContext'
import ReactCountryFlag from 'react-country-flag'
import {
  Menu,
  Search,
  Bell,
  User,
  ChevronDown,
  HelpCircle,
  Settings,
  LogOut,
  Calendar,
  Package,
  ShoppingBag,
  X,
  LayoutDashboard,
  Users,
  Store,
  BarChart3,
  ClipboardList,
  PieChart,
  QrCode,
  UserCircle,
  ShoppingCart,
  AlertCircle,
  Check,
  Trash2,
  Trash,
  CheckCircle2,
  DollarSign
} from 'lucide-react'

export default function TopBar({ sidebarCollapsed, isMobile, onMenuClick }) {
  const [user, setUser] = useState(null)
  const [profileImageUrl, setProfileImageUrl] = useState(null)
  const [notifications, setNotifications] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [showLanguageMenu, setShowLanguageMenu] = useState(false)
  const [lowStockCount, setLowStockCount] = useState(0)
  const [unreadNotifications, setUnreadNotifications] = useState([])
  
  const pathname = usePathname()
  const { t, language, changeLanguage } = useLanguage()

  // Charger la langue au démarrage
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') || 'fr';
    if (savedLanguage && savedLanguage !== language) {
      changeLanguage(savedLanguage);
    }
  }, []);

  // Écouter les changements de langue
  useEffect(() => {
    const handleLanguageChange = () => {
      // Recharger les données si nécessaire
    };

    window.addEventListener('languageChanged', handleLanguageChange);
    return () => window.removeEventListener('languageChanged', handleLanguageChange);
  }, []);

  useEffect(() => {
    const currentUser = checkAuth()
    setUser(currentUser)
    
    if (currentUser?.profile_image) {
      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(currentUser.profile_image)
      
      setProfileImageUrl(data.publicUrl + '?t=' + new Date().getTime())
    }
    
    // Charger les notifications de stock faible
    loadLowStockNotifications()
    
    // Mettre en place un intervalle pour vérifier régulièrement
    const interval = setInterval(loadLowStockNotifications, 60000)
    
    return () => clearInterval(interval)
  }, [])

  // Fonction pour charger les produits en stock faible
  const loadLowStockNotifications = async () => {
    try {
      const { data: products, error } = await supabase
        .from('products')
        .select(`
          *,
          category:categories(id, name),
          supplier:suppliers(id, name),
          stock:stock(quantity, minimum_threshold)
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false })

      if (!error && products) {
        // Filtrer les produits en stock faible
        const lowStockProducts = products.filter(product => {
          const stock = product.stock?.[0]
          return stock && stock.quantity <= stock.minimum_threshold
        })
        
        setLowStockCount(lowStockProducts.length)
        
        // Créer des notifications pour les produits en stock faible
        const stockNotifications = lowStockProducts.map(product => ({
          id: product.id,
          type: 'stock',
          title: language === 'fr' ? 'Stock faible' : 'Low stock',
          message: language === 'fr' 
            ? `${product.name} - Il reste ${product.stock[0].quantity} unités (seuil: ${product.stock[0].minimum_threshold})`
            : `${product.name} - Only ${product.stock[0].quantity} units left (threshold: ${product.stock[0].minimum_threshold})`,
          productId: product.id,
          productName: product.name,
          currentStock: product.stock[0].quantity,
          threshold: product.stock[0].minimum_threshold,
          category: product.category?.name || (language === 'fr' ? 'Non catégorisé' : 'Uncategorized'),
          supplier: product.supplier?.name || (language === 'fr' ? 'Inconnu' : 'Unknown'),
          isRead: false,
          timestamp: new Date().toISOString()
        }))
        
        // Récupérer les notifications non lues depuis localStorage
        const savedNotifications = JSON.parse(localStorage.getItem('lowStockNotifications') || '[]')
        
        // Mettre à jour les messages des notifications existantes avec la langue actuelle
        const updatedSavedNotifications = savedNotifications.map(notif => ({
          ...notif,
          title: language === 'fr' ? 'Stock faible' : 'Low stock',
          message: notif.type === 'stock' 
            ? language === 'fr'
              ? `${notif.productName} - Il reste ${notif.currentStock} unités (seuil: ${notif.threshold})`
              : `${notif.productName} - Only ${notif.currentStock} units left (threshold: ${notif.threshold})`
            : notif.message,
          category: notif.category || (language === 'fr' ? 'Non catégorisé' : 'Uncategorized'),
          supplier: notif.supplier || (language === 'fr' ? 'Inconnu' : 'Unknown')
        }))
        
        // Fusionner et éviter les doublons
        const mergedNotifications = [...updatedSavedNotifications]
        
        stockNotifications.forEach(newNotif => {
          const exists = mergedNotifications.some(
            notif => notif.productId === newNotif.productId && !notif.isRead
          )
          if (!exists) {
            mergedNotifications.unshift(newNotif)
          }
        })
        
        // Garder seulement les 20 dernières notifications
        const recentNotifications = mergedNotifications.slice(0, 20)
        
        setNotifications(recentNotifications)
        
        // Sauvegarder dans localStorage
        localStorage.setItem('lowStockNotifications', JSON.stringify(recentNotifications))
        
        // Compter les non lues
        const unread = recentNotifications.filter(n => !n.isRead)
        setUnreadNotifications(unread)
      }
    } catch (error) {
      console.error('Erreur chargement notifications stock:', error)
    }
  }

  // Recharger les notifications quand la langue change
  useEffect(() => {
    if (notifications.length > 0) {
      loadLowStockNotifications();
    }
  }, [language]);

  const getRoleDisplay = (role) => {
    return t(role) || role;
  }

  const getPageTitle = () => {
    const pathSegments = pathname.split('/').filter(segment => segment)
    
    if (pathSegments.length === 0) return t('dashboard')
    
    const lastSegment = pathSegments[pathSegments.length - 1]
    
    // Utiliser la traduction pour les titres de page
    const translatedTitle = t(lastSegment)
    if (translatedTitle !== lastSegment) {
      return translatedTitle
    }
    
    // Fallback : capitaliser la première lettre
    return lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1).replace('-', ' ')
  }

  const getMenuItems = () => {
    if (!user) return []

    const baseItems = [
      {
        title: t('dashboard'),
        icon: LayoutDashboard,
        href: user.role === 'super-admin' ? '/' :
              user.role === 'admin' ? '/admin' : '/vendor',
        roles: ['super-admin', 'admin', 'vendor']
      }
    ]

    const roleSpecificItems = {
      'super-admin': [
        {
          title: t('users'),
          icon: Users,
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
          title: language === 'fr' ? 'Ventes' : 'Sales',
          icon: ShoppingCart,
          href: '/super-admin/sales',
          roles: ['super-admin']
        },
        {
          title: t('shop'),
          icon: Store,
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
          title: language === 'fr' ? 'Vendeurs' : 'Sellers',
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
        // SEULEMENT 2 OPTIONS POUR VENDEUR - MIS À JOUR
        {
          title: t('myProfile'),
          icon: UserCircle,
          href: '/profile',
          roles: ['vendor']
        },
        {
          title: language === 'fr' ? 'Ventes' : 'Sales',
          icon: DollarSign,
          href: '/vendor/sales',
          roles: ['vendor']
        }
      ]
    }

    const userRole = user?.role || 'vendor'
    const specificItems = roleSpecificItems[userRole] || []
    
    return [...baseItems, ...specificItems].filter(item => 
      item.roles.includes(user.role)
    )
  }

  const handleSearch = (e) => {
    e.preventDefault()
    console.log('Recherche:', searchQuery)
  }

  const handleLogout = () => {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user_data')
    localStorage.removeItem('lowStockNotifications')
    window.location.href = '/auth/login'
  }

  const markNotificationAsRead = (notificationId) => {
    const updatedNotifications = notifications.map(notif => 
      notif.id === notificationId ? { ...notif, isRead: true } : notif
    )
    
    setNotifications(updatedNotifications)
    localStorage.setItem('lowStockNotifications', JSON.stringify(updatedNotifications))
    
    // Mettre à jour le compteur de non lus
    const unread = updatedNotifications.filter(n => !n.isRead)
    setUnreadNotifications(unread)
  }

  const markAllAsRead = () => {
    const updatedNotifications = notifications.map(notif => ({ ...notif, isRead: true }))
    
    setNotifications(updatedNotifications)
    setUnreadNotifications([])
    localStorage.setItem('lowStockNotifications', JSON.stringify(updatedNotifications))
  }

  const deleteNotification = (notificationId) => {
    const updatedNotifications = notifications.filter(notif => notif.id !== notificationId)
    
    setNotifications(updatedNotifications)
    
    const unread = updatedNotifications.filter(n => !n.isRead)
    setUnreadNotifications(unread)
    
    localStorage.setItem('lowStockNotifications', JSON.stringify(updatedNotifications))
  }

  const deleteAllNotifications = () => {
    if (confirm(language === 'fr' 
      ? 'Êtes-vous sûr de vouloir supprimer toutes les notifications ?'
      : 'Are you sure you want to delete all notifications?')) {
      setNotifications([])
      setUnreadNotifications([])
      localStorage.setItem('lowStockNotifications', JSON.stringify([]))
    }
  }

  const getUnreadCount = () => {
    return unreadNotifications.length
  }

  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications)
  }

  // Liste des langues
  const languages = [
    { code: 'fr', name: 'Français', countryCode: 'FR' },
    { code: 'en', name: 'English', countryCode: 'GB' }
  ]

  const handleLanguageChange = (langCode) => {
    changeLanguage(langCode);
    setShowLanguageMenu(false)
    setShowMobileMenu(false)
  }

  const menuItems = getMenuItems()

  if (!user) return null

  const initials = user.full_name
    ? user.full_name.split(' ').map(part => part[0]).join('').toUpperCase().substring(0, 2)
    : 'U'

  return (
    <>
      <header className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm">
        <div className="px-4 sm:px-6">
          <div className="flex items-center justify-between h-14">
            {/* Partie gauche */}
            <div className="flex items-center">
              {/* Bouton menu mobile */}
              <button
                onClick={() => setShowMobileMenu(true)}
                className="p-2 mr-2 rounded-md md:hidden block text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none"
              >
                <img className='w-[35px]' src='/menu3.png' alt="Menu" />
              </button>

              {/* Titre de la page */}
              <div className="flex items-center">
                <h1 className="text-lg font-semibold text-gray-900">
                  {getPageTitle()}
                </h1>
              </div>
            </div>

            {/* Partie droite */}
            <div className="flex items-center space-x-2">
              {/* Barre de recherche */}
              {!isMobile && (
                <form onSubmit={handleSearch} className="relative mr-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="search"
                      placeholder={t('search')}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 pr-4 py-1.5 w-56 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-all"
                    />
                  </div>
                </form>
              )}

              {/* Sélecteur de langue */}
              <div className="relative">
                <button
                  onClick={() => setShowLanguageMenu(!showLanguageMenu)}
                  className="flex items-center space-x-2 p-1.5 rounded-md hover:bg-gray-100 text-gray-600 hover:text-gray-900 transition-colors"
                  title={language === 'fr' ? 'Changer de langue' : 'Change language'}
                >
                  <ReactCountryFlag
                    countryCode={languages.find(lang => lang.code === language)?.countryCode || 'FR'}
                    svg
                    style={{
                      width: '1.25em',
                      height: '1.25em',
                      borderRadius: '2px'
                    }}
                    title={languages.find(lang => lang.code === language)?.name}
                  />
                  <ChevronDown className="h-3 w-3" />
                </button>

                {/* Dropdown Langue */}
                {showLanguageMenu && (
                  <>
                    <div
                      className="fixed inset-0 z-30"
                      onClick={() => setShowLanguageMenu(false)}
                    />
                    <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-40">
                      <div className="p-3 border-b border-gray-200">
                        <h3 className="font-semibold text-gray-900">{t('languageSelection')}</h3>
                      </div>
                      
                      <div className="py-2">
                        {languages.map((languageItem) => (
                          <button
                            key={languageItem.code}
                            onClick={() => handleLanguageChange(languageItem.code)}
                            className={`
                              flex items-center w-full px-4 py-2 text-sm
                              ${language === languageItem.code
                                ? 'bg-blue-50 text-blue-700'
                                : 'text-gray-700 hover:bg-gray-50'
                              }
                            `}
                          >
                            <ReactCountryFlag
                              countryCode={languageItem.countryCode}
                              svg
                              style={{
                                width: '1.25em',
                                height: '1.25em',
                                marginRight: '12px',
                                borderRadius: '2px'
                              }}
                              title={languageItem.name}
                            />
                            <span className="flex-1 text-left">{languageItem.name}</span>
                            {language === languageItem.code && (
                              <span className="text-blue-600 text-xs font-medium">✓</span>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Bouton d'aide */}
              <button
                className="p-1.5 rounded-md hover:bg-gray-100 text-gray-600 hover:text-gray-900 transition-colors"
                title={t('help')}
              >
                <HelpCircle className="h-4 w-4" />
              </button>

              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={handleNotificationClick}
                  className="p-1.5 rounded-md hover:bg-gray-100 text-gray-600 hover:text-gray-900 transition-colors relative"
                  title={t('notifications')}
                >
                  <Bell className="h-4 w-4" />
                  {getUnreadCount() > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center text-[10px]">
                      {getUnreadCount()}
                    </span>
                  )}
                </button>

                {/* Panneau des notifications */}
                {showNotifications && (
                  <>
                    <div
                      className="fixed inset-0 z-30"
                      onClick={() => setShowNotifications(false)}
                    />
                    <div className="absolute tr -translate-x-[70%] left-1/2 top-[150%]  mt-1 w-[340px] bg-white rounded-lg shadow-lg border border-gray-200 z-40">
                      <div className="p-4 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Bell className="h-5 w-5 text-gray-600" />
                            <h3 className="font-semibold text-xs text-gray-900">
                              {t('notifications')}
                              {getUnreadCount() > 0 && (
                                <span className="ml-2  bg-red-100 text-red-800 text-xs px-2 py-0.5 rounded-full">
                                  {getUnreadCount()} {t('unread')}{getUnreadCount() > 1 && language === 'en' ? 's' : ''}
                                </span>
                              )}
                            </h3>
                          </div>
                          <div className="flex items-center space-x-2">
                            {getUnreadCount() > 0 && (
                              <button
                                onClick={markAllAsRead}
                                className="text-xs text-blue-600 hover:text-blue-800 hover:underline"
                                title={language === 'fr' ? "" : ""}
                              >
                               <CheckCircle2 className='w-4'/>
                              </button>
                            )}
                            {notifications.length > 0 && (
                              <button
                                onClick={deleteAllNotifications}
                                className="text-xs  text-red-600 hover:text-red-800 hover:underline"
                                title={language === 'fr' ? "Supprimer toutes les notifications" : "Delete all notifications"}
                              >
                                <Trash className='w-4'/>
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="max-h-96 overflow-y-auto">
                        {notifications.length > 0 ? (
                          <div className="divide-y divide-gray-100">
                            {notifications.map((notification) => (
                              <div
                                key={`${notification.id}-${notification.timestamp}`}
                                className={`
                                  p-3 hover:bg-gray-50 transition-colors
                                  ${!notification.isRead ? 'bg-blue-50/50' : ''}
                                `}
                              >
                                <div className="flex items-start justify-between">
                                  <div className="flex items-start space-x-3">
                                    <div className={`mt-0.5 ${notification.type === 'stock' ? 'text-red-600' : 'text-blue-600'}`}>
                                      {notification.type === 'stock' ? (
                                        <AlertCircle className="h-5 w-5" />
                                      ) : (
                                        <Bell className="h-5 w-5" />
                                      )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center space-x-2 mb-1">
                                        <p className="font-medium text-gray-900 text-sm">
                                          {notification.title}
                                        </p>
                                        {!notification.isRead && (
                                          <span className="inline-block w-2 h-2 bg-blue-500 rounded-full"></span>
                                        )}
                                      </div>
                                      <p className="text-sm text-gray-600 mb-1">
                                        {notification.message}
                                      </p>
                                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                                        <span>
                                          {t('category')}: {notification.category}
                                        </span>
                                        <span>
                                          {t('supplier')}: {notification.supplier}
                                        </span>
                                      </div>
                                      <div className="mt-1 text-xs text-gray-400">
                                        {new Date(notification.timestamp).toLocaleString(language === 'fr' ? 'fr-FR' : 'en-GB', {
                                          day: '2-digit',
                                          month: '2-digit',
                                          year: 'numeric',
                                          hour: '2-digit',
                                          minute: '2-digit'
                                        })}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex flex-col space-y-1 ml-2">
                                    {!notification.isRead && (
                                      <button
                                        onClick={() => markNotificationAsRead(notification.id)}
                                        className="p-1 text-green-600 hover:text-green-800 hover:bg-green-50 rounded"
                                        title={t('markRead')}
                                      >
                                        <Check className="h-4 w-4" />
                                      </button>
                                    )}
                                    <button
                                      onClick={() => deleteNotification(notification.id)}
                                      className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
                                      title={t('delete')}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="p-8 text-center">
                            <Bell className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                            <p className="text-gray-500 text-sm">
                              {t('noNotifications')}
                            </p>
                          </div>
                        )}
                      </div>
                      
                      {/* Afficher le nombre de produits en stock faible */}
                      {lowStockCount > 0 && (
                        <div className="border-t border-gray-200 p-3 bg-red-50">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <AlertCircle className="h-5 w-5 text-red-600" />
                              <span className="text-sm font-medium text-red-900">
                                {lowStockCount} {t('lowStockAlert')}
                              </span>
                            </div>
                            <a
                              href="/super-admin/products"
                              className="text-sm text-red-700 hover:text-red-900 hover:underline"
                              onClick={() => setShowNotifications(false)}
                            >
                              {t('viewProducts')}
                            </a>
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>

              {/* Séparateur */}
              <div className="h-4 w-px bg-gray-300 mx-1" />

              {/* Profil utilisateur */}
              <div className="relative">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center space-x-2 p-1 rounded-md hover:bg-gray-100"
                >
                  <div className="relative">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-100 flex items-center justify-center overflow-hidden">
                      {profileImageUrl ? (
                        <img
                          src={profileImageUrl}
                          alt={user.full_name || (language === 'fr' ? 'Utilisateur' : 'User')}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.style.display = 'none'
                          }}
                        />
                      ) : (
                        <span className="font-medium text-blue-600 text-sm">
                          {initials}
                        </span>
                      )}
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 border border-white rounded-full"></div>
                  </div>
                  
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                </button>

                {/* Dropdown Profil */}
                {showProfileMenu && (
                  <>
                    <div
                      className="fixed inset-0 z-30"
                      onClick={() => setShowProfileMenu(false)}
                    />
                    <div className="absolute right-0 mt-1 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-40">
                      <div className="p-4 border-b border-gray-200">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-100 flex items-center justify-center overflow-hidden">
                            {profileImageUrl ? (
                              <img
                                src={profileImageUrl}
                                alt={user.full_name || (language === 'fr' ? 'Utilisateur' : 'User')}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <span className="font-medium text-blue-600">
                                {initials}
                              </span>
                            )}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">
                              {user.full_name || (language === 'fr' ? 'Utilisateur' : 'User')}
                            </p>
                            <p className="text-sm text-gray-500">
                              {user.email}
                            </p>
                            <span className="inline-block mt-1 px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-700">
                              {getRoleDisplay(user.role)}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="py-1">
                        <a
                          href="/profile"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          onClick={() => setShowProfileMenu(false)}
                        >
                          <User className="h-4 w-4 mr-3 text-gray-400" />
                          {t('profile')}
                        </a>
                        <a
                          href="/settings"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          onClick={() => setShowProfileMenu(false)}
                        >
                          <Settings className="h-4 w-4 mr-3 text-gray-400" />
                          {t('settings')}
                        </a>
                        <a
                          href="/help"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          onClick={() => setShowProfileMenu(false)}
                        >
                          <HelpCircle className="h-4 w-4 mr-3 text-gray-400" />
                          {t('helpSupport')}
                        </a>
                      </div>
                      
                      <div className="border-t border-gray-200 py-1">
                        <button
                          onClick={handleLogout}
                          className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                        >
                          <LogOut className="h-4 w-4 mr-3" />
                          {t('logout')}
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Menu Mobile Overlay */}
      {showMobileMenu && (
        <div className="fixed inset-0 z-40">
          <div 
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowMobileMenu(false)}
          />
          
          <div className="absolute left-0 top-0 h-full w-64 bg-white shadow-xl transform transition-transform duration-300">
            <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Package className="w-5 h-5 text-blue-600" />
                  ShopManage
                </h2>
                <button
                  onClick={() => setShowMobileMenu(false)}
                  className="p-2 rounded-md hover:bg-white/50"
                >
                  <X className="h-5 w-5 text-gray-700" />
                </button>
              </div>
              
              <div className="flex items-center space-x-3 p-2 rounded-lg bg-white/50">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 border border-blue-200 flex items-center justify-center overflow-hidden">
                    {profileImageUrl ? (
                      <img
                        src={profileImageUrl}
                        alt={user.full_name || (language === 'fr' ? 'Utilisateur' : 'User')}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="font-semibold text-blue-600 text-sm">
                        {initials}
                      </span>
                    )}
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    {user.full_name || (language === 'fr' ? 'Utilisateur' : 'User')}
                  </p>
                  <p className="text-xs text-gray-600 truncate">
                    {user.email}
                  </p>
                  <span className={`inline-block mt-1 px-2 py-0.5 text-xs rounded-full ${
                    user.role === 'super-admin' ? 'bg-red-100 text-red-800' :
                    user.role === 'admin' ? 'bg-blue-100 text-blue-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {getRoleDisplay(user.role)}
                  </span>
                </div>
              </div>
            </div>

            <nav className="flex-1 overflow-y-auto py-4">
              <div className="p-2">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 mb-2">
                  {t('navigation')}
                </p>
                <ul className="space-y-1">
                  {menuItems.map((item) => {
                    const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
                    const Icon = item.icon
                    
                    return (
                      <li key={item.href}>
                        <a
                          href={item.href}
                          className={`
                            flex items-center w-full text-left
                            py-3 px-4 
                            transition-colors duration-200
                            ${isActive
                              ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600'
                              : 'hover:bg-gray-50 text-gray-700'
                            }
                          `}
                          onClick={() => setShowMobileMenu(false)}
                        >
                          <Icon className={`
                            ${isActive
                              ? 'text-blue-600'
                              : 'text-gray-400'
                            }
                            w-5 h-5
                          `} />
                          <span className="ml-3 font-medium">{item.title}</span>
                        </a>
                      </li>
                    )
                  })}
                </ul>
              </div>

              {/* Section notifications dans le menu mobile */}
              <div className="mt-6 px-2">
                <div className="flex items-center justify-between px-3 mb-2">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    {t('notifications')}
                  </p>
                  {getUnreadCount() > 0 && (
                    <span className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
                      {getUnreadCount()}
                    </span>
                  )}
                </div>
                
                <div className="space-y-2 px-3">
                  {lowStockCount > 0 && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <AlertCircle className="w-4 h-4 text-red-600" />
                        <div>
                          <p className="text-sm font-medium text-red-900">
                            {t('stockDetected')}
                          </p>
                          <p className="text-xs text-red-700">
                            {lowStockCount} {t('attentionRequired')}
                          </p>
                        </div>
                      </div>
                      <a
                        href="/super-admin/products"
                        className="mt-2 inline-block w-full text-center text-xs text-red-700 hover:text-red-900 border border-red-300 hover:border-red-400 rounded px-3 py-1.5"
                        onClick={() => setShowMobileMenu(false)}
                      >
                        {t('seeProducts')}
                      </a>
                    </div>
                  )}
                  
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault()
                      setShowMobileMenu(false)
                      handleNotificationClick()
                    }}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 border border-gray-200 transition-colors"
                  >
                    <div className="flex items-center space-x-2">
                      <Bell className="w-4 h-4 text-gray-600" />
                      <span className="text-sm text-gray-700">{t('seeAllNotifications')}</span>
                    </div>
                    {getUnreadCount() > 0 && (
                      <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                    )}
                  </a>
                </div>
              </div>

              {/* Section langue dans le menu mobile */}
              <div className="mt-6 px-2">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 mb-2">
                  {t('language')}
                </p>
                <div className="grid grid-cols-2 gap-2 px-3">
                  {languages.map((languageItem) => (
                    <button
                      key={languageItem.code}
                      onClick={() => {
                        handleLanguageChange(languageItem.code)
                        setShowMobileMenu(false)
                      }}
                      className={`
                        flex items-center justify-center p-3 rounded-lg
                        ${language === languageItem.code
                          ? 'bg-blue-50 border border-blue-200'
                          : 'hover:bg-gray-50 border border-transparent'
                        }
                      `}
                    >
                      <ReactCountryFlag
                        countryCode={languageItem.countryCode}
                        svg
                        style={{
                          width: '1.5em',
                          height: '1.5em',
                          marginRight: '8px',
                          borderRadius: '2px'
                        }}
                        title={languageItem.name}
                      />
                      <span className="text-sm font-medium text-gray-700">{languageItem.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-6 px-2">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 mb-2">
                  {t('application')}
                </p>
                <ul className="space-y-1">
                  <li>
                    <a
                      href="/settings"
                      className="flex items-center py-3 px-4 rounded-lg hover:bg-gray-50 text-gray-700 transition-colors"
                      onClick={() => setShowMobileMenu(false)}
                    >
                      <Settings className="w-5 h-5 text-gray-400 mr-3" />
                      <span>{t('settings')}</span>
                    </a>
                  </li>
                  <li>
                    <a
                      href="/help"
                      className="flex items-center py-3 px-4 rounded-lg hover:bg-gray-50 text-gray-700 transition-colors"
                      onClick={() => setShowMobileMenu(false)}
                    >
                      <HelpCircle className="w-5 h-5 text-gray-400 mr-3" />
                      <span>{t('helpSupport')}</span>
                    </a>
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        handleLogout()
                        setShowMobileMenu(false)
                      }}
                      className="flex items-center w-full py-3 px-4 rounded-lg hover:bg-red-50 text-red-600 transition-colors"
                    >
                      <LogOut className="w-5 h-5 mr-3" />
                      <span>{t('logout')}</span>
                    </button>
                  </li>
                </ul>
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-gray-50">
                <p className="text-xs text-center text-gray-500">
                  © 2024 ShopManage v1.0
                </p>
              </div>
            </nav>
          </div>
        </div>
      )}
    </>
  )
}