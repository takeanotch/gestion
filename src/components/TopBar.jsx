
'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { checkAuth } from '@/lib/auth'
import { supabase } from '@/lib/supabase'
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
  ShoppingCart
} from 'lucide-react'

export default function TopBar({ sidebarCollapsed, isMobile, onMenuClick }) {
  const [user, setUser] = useState(null)
  const [profileImageUrl, setProfileImageUrl] = useState(null)
  const [notifications, setNotifications] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  
  const pathname = usePathname()

  useEffect(() => {
    const currentUser = checkAuth()
    setUser(currentUser)
    
    if (currentUser?.profile_image) {
      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(currentUser.profile_image)
      
      setProfileImageUrl(data.publicUrl + '?t=' + new Date().getTime())
    }

    // Notifications simulées
    setNotifications([
      { id: 1, title: 'Nouvelle commande', message: 'Commande #12345 reçue', time: '2 min', read: false, icon: ShoppingBag },
      { id: 2, title: 'Stock faible', message: 'Produit XYZ presque épuisé', time: '1 heure', read: false, icon: Package },
      { id: 3, title: 'Réunion aujourd\'hui', message: 'Réunion hebdo à 15h', time: '3 heures', read: true, icon: Calendar },
    ])
  }, [])

  const getRoleDisplay = (role) => {
    switch(role) {
      case 'super-admin': return 'Super Admin'
      case 'admin': return 'Administrateur'
      case 'vendor': return 'Vendeur'
      default: return 'Utilisateur'
    }
  }

  const getPageTitle = () => {
    const pathSegments = pathname.split('/').filter(segment => segment)
    
    if (pathSegments.length === 0) return 'Tableau de bord'
    
    const lastSegment = pathSegments[pathSegments.length - 1]
    
    const titles = {
      'dashboard': 'Tableau de bord',
      'profile': 'Mon Profil',
      'users': 'Utilisateurs',
      'products': 'Produits',
      'orders': 'Commandes',
      'inventory': 'Inventaire',
      'reports': 'Rapports',
      'vendors': 'Vendeurs',
      'stats': 'Statistiques',
      'scanner': 'Scanner',
      'settings': 'Paramètres',
      'help': 'Aide & Support'
    }
    
    return titles[lastSegment] || 
           lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1).replace('-', ' ')
  }

  // Fonction pour récupérer les éléments du menu selon le rôle
  const getMenuItems = () => {
    if (!user) return []

    const baseItems = [
      {
        title: 'Tableau de bord',
        icon: LayoutDashboard,
        href: user.role === 'super-admin' ? '/' :
              user.role === 'admin' ? '/admin' : '/vendor',
        roles: ['super-admin', 'admin', 'vendor']
      },
      {
        title: 'Mon Profil',
        icon: UserCircle,
        href: '/profile',
        roles: ['super-admin', 'admin', 'vendor']
      }
    ]

    const roleSpecificItems = {
      'super-admin': [
        {
          title: 'Utilisateurs',
          icon: Users,
          href: '/super-admin/users',
          roles: ['super-admin']
        },
        {
          title: 'Produits',
          icon: Package,
          href: '/super-admin/products',
          roles: ['super-admin']
        },
        {
          title: 'Ventes',
          icon: ShoppingCart,
          href: '/super-admin/sales',
          roles: ['super-admin']
        }
      ],
      'admin': [
        {
          title: 'Vendeurs',
          icon: Users,
          href: '/admin/vendors',
          roles: ['admin']
        },
        {
          title: 'Commandes',
          icon: ShoppingBag,
          href: '/admin/orders',
          roles: ['admin']
        },
        {
          title: 'Inventaire',
          icon: Package,
          href: '/admin/inventory',
          roles: ['admin']
        },
        {
          title: 'Rapports',
          icon: PieChart,
          href: '/admin/reports',
          roles: ['admin']
        }
      ],
      'vendor': [
        {
          title: 'Mes Produits',
          icon: Package,
          href: '/vendor/products',
          roles: ['vendor']
        },
        {
          title: 'Mes Commandes',
          icon: ClipboardList,
          href: '/vendor/orders',
          roles: ['vendor']
        },
        {
          title: 'Mes Statistiques',
          icon: BarChart3,
          href: '/vendor/stats',
          roles: ['vendor']
        },
        {
          title: 'Scanner',
          icon: QrCode,
          href: '/vendor/scanner',
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

  const markNotificationAsRead = (id) => {
    setNotifications(notifications.map(notif => 
      notif.id === id ? { ...notif, read: true } : notif
    ))
  }

  const markAllAsRead = () => {
    setNotifications(notifications.map(notif => ({ ...notif, read: true })))
  }

  const getUnreadCount = () => {
    return notifications.filter(n => !n.read).length
  }

  const handleLogout = () => {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user_data')
    window.location.href = '/auth/login'
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
               <img className='w-[35px]' src='/menu3.png'/>
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
              {/* Barre de recherche (visible sur tablette+) */}
              {!isMobile && (
                <form onSubmit={handleSearch} className="relative mr-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="search"
                      placeholder="Rechercher..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 pr-4 py-1.5 w-56 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-all"
                    />
                  </div>
                </form>
              )}

              {/* Bouton d'aide */}
              <button
                className="p-1.5 rounded-md hover:bg-gray-100 text-gray-600 hover:text-gray-900 transition-colors"
                title="Aide"
              >
                <HelpCircle className="h-4 w-4" />
              </button>

              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-1.5 rounded-md hover:bg-gray-100 text-gray-600 hover:text-gray-900 transition-colors relative"
                >
                  <Bell className="h-4 w-4" />
                  {getUnreadCount() > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center text-[10px]">
                      {getUnreadCount()}
                    </span>
                  )}
                </button>

                {/* Dropdown Notifications */}
                {showNotifications && (
                  <>
                    <div
                      className="fixed inset-0 z-30"
                      onClick={() => setShowNotifications(false)}
                    />
                    <div className="absolute right-0 mt-1 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-40">
                      <div className="p-3 border-b border-gray-200">
                        <div className="flex justify-between items-center">
                          <h3 className="font-semibold text-gray-900">Notifications</h3>
                          {getUnreadCount() > 0 && (
                            <button
                              onClick={markAllAsRead}
                              className="text-xs text-blue-600 hover:text-blue-800"
                            >
                              Tout marquer comme lu
                            </button>
                          )}
                        </div>
                      </div>
                      
                      <div className="max-h-80 overflow-y-auto">
                        {notifications.length > 0 ? (
                          notifications.map((notification) => {
                            const Icon = notification.icon
                            return (
                              <div
                                key={notification.id}
                                className={`p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                                  !notification.read ? 'bg-blue-50' : ''
                                }`}
                                onClick={() => markNotificationAsRead(notification.id)}
                              >
                                <div className="flex items-start">
                                  <div className="flex-shrink-0 mt-0.5">
                                    <Icon className={`h-4 w-4 ${
                                      notification.read 
                                        ? 'text-gray-400' 
                                        : 'text-blue-500'
                                    }`} />
                                  </div>
                                  <div className="ml-3 flex-1">
                                    <div className="flex justify-between items-start">
                                      <p className={`text-sm font-medium ${
                                        notification.read
                                          ? 'text-gray-700'
                                          : 'text-gray-900'
                                      }`}>
                                        {notification.title}
                                      </p>
                                      <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                                        {notification.time}
                                      </span>
                                    </div>
                                    <p className="text-sm text-gray-600 mt-0.5">
                                      {notification.message}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            )
                          })
                        ) : (
                          <div className="p-4 text-center text-gray-500">
                            Aucune notification
                          </div>
                        )}
                      </div>
                      
                      <div className="p-3 border-t border-gray-200">
                        <a
                          href="/notifications"
                          className="block text-center text-xs text-blue-600 hover:text-blue-800 font-medium"
                        >
                          Voir toutes les notifications
                        </a>
                      </div>
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
                          alt={user.full_name || 'Utilisateur'}
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
                                alt={user.full_name || 'Utilisateur'}
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
                              {user.full_name || 'Utilisateur'}
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
                          Mon Profil
                        </a>
                        <a
                          href="/settings"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          onClick={() => setShowProfileMenu(false)}
                        >
                          <Settings className="h-4 w-4 mr-3 text-gray-400" />
                          Paramètres
                        </a>
                        <a
                          href="/help"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          onClick={() => setShowProfileMenu(false)}
                        >
                          <HelpCircle className="h-4 w-4 mr-3 text-gray-400" />
                          Aide & Support
                        </a>
                      </div>
                      
                      <div className="border-t border-gray-200 py-1">
                        <button
                          onClick={handleLogout}
                          className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                        >
                          <LogOut className="h-4 w-4 mr-3" />
                          Déconnexion
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
          {/* Overlay sombre */}
          <div 
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowMobileMenu(false)}
          />
          
          {/* Menu mobile */}
          <div className="absolute left-0 top-0 h-full w-64 bg-white shadow-xl transform transition-transform duration-300">
            {/* En-tête du menu mobile */}
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
              
              {/* Profil utilisateur */}
              <div className="flex items-center space-x-3 p-2 rounded-lg bg-white/50">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 border border-blue-200 flex items-center justify-center overflow-hidden">
                    {profileImageUrl ? (
                      <img
                        src={profileImageUrl}
                        alt={user.full_name || 'Utilisateur'}
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
                    {user.full_name || 'Utilisateur'}
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

            {/* Navigation mobile */}
            <nav className="flex-1 overflow-y-auto py-4">
              <div className="p-2">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 mb-2">
                  Navigation
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

              {/* Section basse du menu mobile */}
              <div className="mt-6 px-2">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 mb-2">
                  Application
                </p>
                <ul className="space-y-1">
                  <li>
                    <a
                      href="/settings"
                      className="flex items-center py-3 px-4 rounded-lg hover:bg-gray-50 text-gray-700 transition-colors"
                      onClick={() => setShowMobileMenu(false)}
                    >
                      <Settings className="w-5 h-5 text-gray-400 mr-3" />
                      <span>Paramètres</span>
                    </a>
                  </li>
                  <li>
                    <a
                      href="/help"
                      className="flex items-center py-3 px-4 rounded-lg hover:bg-gray-50 text-gray-700 transition-colors"
                      onClick={() => setShowMobileMenu(false)}
                    >
                      <HelpCircle className="w-5 h-5 text-gray-400 mr-3" />
                      <span>Aide & Support</span>
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
                      <span>Déconnexion</span>
                    </button>
                  </li>
                </ul>
              </div>

              {/* Version info */}
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