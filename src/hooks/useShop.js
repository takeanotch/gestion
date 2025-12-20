// hooks/useShop.js
'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export function useShop() {
  const [shop, setShop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchShopConfig();
  }, []);

  const fetchShopConfig = async () => {
    try {
      const { data, error } = await supabase
        .from('shop_config')
        .select('*')
        .single();

      if (error) throw error;
      
      setShop(data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching shop config:', err);
    } finally {
      setLoading(false);
    }
  };

  return {
    shop,
    loading,
    error,
    refresh: fetchShopConfig
  };
}