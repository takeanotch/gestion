// // lib/supabase.ts
// import { createClient } from '@supabase/supabase-js';

// const supabaseUrl = 'https://ugzxfmfclutwnnbvbkqp.supabase.co';
// const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVnenhmbWZjbHV0d25uYnZia3FwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU2MzQ4MjUsImV4cCI6MjA4MTIxMDgyNX0.KXEraCRRe2vKZMerRFbElkyNRqiVV0hONzRDApLgBzc';

// export const supabase = createClient(supabaseUrl, supabaseAnonKey);


// // Types pour TypeScript
// export type Product = {
//   id: string;
//   name: string;
//   description: string;
//   category_id: string;
//   retail_price: number;
//   wholesale_price: number;
//   currency: string;
//   image_url: string | null;
//   image_path: string | null;
//   created_at: string;
//   category?: {
//     id: string;
//     name: string;
//   };
//   stock?: {
//     quantity: number;
//     minimum_threshold: number;
//   };
// };

// export type Category = {
//   id: string;
//   name: string;
//   created_at: string;
// };

// export type Stock = {
//   id: string;
//   product_id: string;
//   quantity: number;
//   minimum_threshold: number;
//   last_restocked: string | null;
// };
// lib/supabase.ts


import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ugzxfmfclutwnnbvbkqp.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVnenhmbWZjbHV0d25uYnZia3FwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU2MzQ4MjUsImV4cCI6MjA4MTIxMDgyNX0.KXEraCRRe2vKZMerRFbElkyNRqiVV0hONzRDApLgBzc';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types pour TypeScript
export type Product = {
  id: string;
  sku: string;
  name: string;
  description: string;
  category_id: string | null;
  unit_type: string;
  retail_price: number;
  wholesale_price: number;
  currency: string;
  image_url: string | null;
  image_path: string | null;
  created_at: string;
  updated_at: string;
  category?: {
    id: string;
    name: string;
  };
  stock?: Array<{
    quantity: number;
    minimum_threshold: number;
    last_restocked: string | null;
  }>;
};

export type Category = {
  id: string;
  name: string;
  created_at: string;
};

export type Stock = {
  id: string;
  product_id: string;
  quantity: number;
  minimum_threshold: number;
  last_restocked: string | null;
  created_at: string;
  updated_at: string;
};

export type UnitType = 
  | 'PIECE' 
  | 'KG' 
  | 'LITRE' 
  | 'METRE' 
  | 'BOUTEILLE' 
  | 'SACHET' 
  | 'CARTON';

export type Currency = 'EUR' | 'USD' | 'CDF';