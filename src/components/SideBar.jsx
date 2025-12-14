
// components/Sidebar.jsx
'use client'
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  FiHome,
  FiTrendingUp,
  FiPackage,
  FiUsers,
  FiBarChart2,
  FiSettings,
  FiUser,
  FiChevronLeft,
  FiChevronRight,
  FiDollarSign,
  FiShoppingBag,
  FiTarget,
  FiMessageSquare,
  FiLogout,
  FiMenu,
  FiX
} from 'react-icons/fi';
import { RiDashboardLine } from 'react-icons/ri';

const Sidebar = ({ onCollapse }) => {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Détecter si on est sur mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      // Sur mobile, on force le collapse par défaut et on ferme le menu
      if (window.innerWidth < 768) {
        setIsCollapsed(true);
        setIsMobileOpen(false);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleCollapse = () => {
    if (isMobile) {
      setIsMobileOpen(!isMobileOpen);
    } else {
      const newState = !isCollapsed;
      setIsCollapsed(newState);
      if (onCollapse) {
        onCollapse(newState);
      }
    }
  };

  const handleNavigation = () => {
    if (isMobile) {
      setIsMobileOpen(false);
    }
  };

  const navLinks = [
    { path: '/sales', label: 'Sales', icon: <FiDollarSign /> },
    { path: '/products', label: 'Products', icon: <FiPackage /> },
    { path: '/customers', label: 'Customers', icon: <FiUsers /> },
    { path: '/stats', label: 'Stats', icon: <FiBarChart2 /> },
    { path: '/settings', label: 'Settings', icon: <FiSettings /> },
    { path: '/user', label: 'User', icon: <FiUser /> },
  ];

  const dashboardLinks = [
    { label: 'Dashboard', icon: <RiDashboardLine />, active: true },
    { label: 'Leads', icon: <FiTarget />, count: 3 },
    { label: 'Deals', icon: <FiTrendingUp />, count: '2 due' },
    { label: 'Messages', icon: <FiMessageSquare />, count: 12 },
  ];

  // Overlay pour mobile
  const MobileOverlay = () => (
    <div 
      className={`fixed inset-0 bg-black/20  bg-opacity-50 z-40 transition-opacity duration-300 md:hidden ${
        isMobileOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
      onClick={() => setIsMobileOpen(false)}
    />
  );

  return (
    <>
      {/* Mobile Menu Button (Visible uniquement sur mobile) */}
      {isMobile && (
        <button
          onClick={handleCollapse}
          className="fixed top-4 right-4 z-50 p-2 bg-white backdrop-blur-2xl rounded-full shadow-md md:hidden"
        >
          {isMobileOpen ? <FiX size={24} /> : <FiMenu size={24} className='' />}
        </button>
      )}

      {/* Overlay pour mobile */}
      <MobileOverlay />

      {/* Sidebar */}
      <aside className={`
        h-screen fixed z-50 bg-white border-r border-gray-200 transition-all duration-300
        ${isMobile ? `
          transform ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
          w-64
        ` : `
          ${isCollapsed ? 'w-20' : 'w-64'}
        `}
      `}>
        {/* Toggle Button (Desktop seulement) */}
        {!isMobile && (
          <button
            onClick={handleCollapse}
            className="absolute -right-3 top-6 bg-white border border-gray-300 rounded-full p-1.5 shadow-sm hover:shadow-md transition-shadow z-10"
          >
            {isCollapsed ? <FiChevronRight size={18} /> : <FiChevronLeft size={18} />}
          </button>
        )}

        {/* Logo Section */}
        <div className="p-6 border-b border-gray-100">
          <div className={`flex items-center ${(isCollapsed && !isMobile) ? 'justify-center' : 'justify-between'}`}>
            {(!isCollapsed || isMobile) && (
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <FiTrendingUp className="text-white" size={20} />
                </div>
                <span className="text-xl font-semibold text-gray-800">Dashboard</span>
              </div>
            )}
            {(isCollapsed && !isMobile) && (
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mx-auto">
                <FiTrendingUp className="text-white" size={20} />
              </div>
            )}
          </div>
        </div>

        {/* User Profile */}
        <div className={`p-4 border-b border-gray-100 ${(isCollapsed && !isMobile) ? 'px-2' : 'px-4'}`}>
          <div className={`flex items-center ${(isCollapsed && !isMobile) ? 'justify-center' : 'space-x-3'}`}>
            <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
              <span className="font-semibold text-blue-600">J</span>
            </div>
            {(!isCollapsed || isMobile) && (
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate">John Corner</p>
                <p className="text-sm text-gray-500 truncate">john@mail.com</p>
              </div>
            )}
          </div>
        </div>

        {/* Main Navigation */}
        <div className="py-4 flex-1">
          <h3 className={`px-6 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 ${(isCollapsed && !isMobile) && 'text-center px-2'}`}>
            {(isCollapsed && !isMobile) ? '...' : 'Navigation'}
          </h3>
          <ul className="space-y-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.path;
              return (
                <li key={link.path}>
                  <Link
                    href={link.path}
                    onClick={handleNavigation}
                    className={`flex items-center ${(isCollapsed && !isMobile) ? 'justify-center px-2' : 'px-6'} py-3 text-sm transition-colors ${
                      isActive
                        ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <span className={isActive ? 'text-blue-600' : 'text-gray-400'}>
                      {link.icon}
                    </span>
                    {(!isCollapsed || isMobile) && <span className="ml-3">{link.label}</span>}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Bottom Section */}
        <div className={`mt-auto p-4 border-t border-gray-200 ${(isCollapsed && !isMobile) ? 'px-2' : 'px-4'}`}>
          <div className={`flex items-center ${(isCollapsed && !isMobile) ? 'justify-center' : 'justify-between'}`}>
            {(!isCollapsed || isMobile) && (
              <div className="text-xs text-gray-500">
                v2.1.0
              </div>
            )}
            <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
              <FiSettings size={20} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;