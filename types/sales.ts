// types/sale.ts
export interface SaleItem {
  id: string;
  sku: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  discount_percent?: number;
  discount_amount?: number;
  subtotal: number;
  tax_percent?: number;
  tax_amount?: number;
  total: number;
  category?: string;
  returned_quantity?: number;
}

export interface SaleReturn {
  id: string;
  return_number: string;
  total_amount: number;
  reason?: string;
  processed_at: string;
}

export interface Sale {
  id: string;
  sale_number: string;
  sale_date: string;
  total_amount: number;
  subtotal_amount: number;
  discount_amount: number;
  tax_amount: number;
  payment_method: string;
  customer_name?: string;
  customer_phone?: string;
  customer_email?: string;
  notes?: string;
  status: 'completed' | 'cancelled' | 'refund' | 'pending';
  promotion_code?: string;
  created_at: string;
  updated_at?: string;
  items_count?: number;
  return_count?: number;
}

export interface SaleDetails extends Sale {
  items: SaleItem[];
  returns: SaleReturn[];
}

export interface SalesStats {
  total_sales: number;
  total_revenue: number;
  total_discounts: number;
  average_sale: number;
  unique_customers: number;
  payment_methods: Record<string, number>;
  daily_sales: Array<{ date: string; amount: number }>;
}

export interface PaginationResult<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
}