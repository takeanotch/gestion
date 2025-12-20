// components/ShopLogo.jsx
'use client';

import Image from 'next/image';
import { Store } from 'lucide-react';

export default function ShopLogo({ 
  size = 40, 
  className = '',
  shop = null 
}) {
  if (!shop) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 rounded-lg ${className}`}
           style={{ width: size, height: size }}>
        <Store size={size * 0.6} className="text-gray-600" />
      </div>
    );
  }

  if (shop.shop_icon) {
    return (
      <div className={`relative ${className}`} 
           style={{ width: size, height: size }}>
        <Image
          src={shop.shop_icon}
          alt={shop.shop_name || 'Logo du shop'}
          fill
          className="object-contain"
          sizes={`${size}px`}
          priority={size > 60}
        />
      </div>
    );
  }

  // Fallback avec initiales
  return (
    <div className={`flex items-center justify-center bg-gray-900 text-white rounded-lg font-bold ${className}`}
         style={{ width: size, height: size }}>
      {shop.shop_name?.charAt(0) || 'M'}
    </div>
  );
}