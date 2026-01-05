
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
  Printer,
  Cog,
  ShoppingBasket
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
        },
        {
          title: t('shop'),
          icon: HiCog,
          href: '/super-admin/shop',
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
                        ? 'text-blue-600 bg-blue-600/10'
                        : 'text-gray-400 hover:text-gray-700'
                      }
                    `}
                    onMouseEnter={() => setHoveredItem(item.title)}
                    onMouseLeave={() => setHoveredItem(null)}
                  >
                    <Icon className={`
                      w-5 h-5
                      ${isActive ? 'text-blue-600 ' : ''}
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