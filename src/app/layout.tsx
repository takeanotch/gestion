// app/layout.tsx
'use client'
import { useState,useEffect } from 'react';
import { Inter } from 'next/font/google';
import './globals.css';
import Sidebar from '@/components/SideBar';
const inter = Inter({ subsets: ['latin'] });



export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) 
{
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
   useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  return (
    // <">
    //   <body className={inter.className}>
      
    //       {children}
       
    //   </body>
    // </html>
      <html lang="fr" >
        <body className="flex min-h-screen bg-white">
      <Sidebar onCollapse={setSidebarCollapsed}/>
    <main className={`flex-1 transition-all duration-300 overflow-auto  ${isMobile ? 'ml-0' : sidebarCollapsed ? 'ml-20' : 'ml-64'}
          `}>
            
            
             <div className="pt-4">
              {children}
            </div>
      </main>
      </body>
    </html>
  );
}