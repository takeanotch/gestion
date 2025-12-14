import { supabase } from './supabase';

export interface SaleItem {
  id?: string;
  sale_id?: string;
  product_id: string;
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
  local_id?: number;
  local_sale_id?: number;
  returned_quantity?: number; 
  synced_at?: string;
  sync_status?: string;
}

export interface Sale {
  id?: string;
  sale_number: string;
  sale_date: string;
  total_amount: number;
  subtotal_amount: number;
  discount_amount: number;
  tax_amount: number;
  payment_method: 'cash' | 'card' | 'check' | 'transfer' | 'mobile';
  customer_name?: string;
  customer_phone?: string;
  customer_email?: string;
  notes?: string;
  status?: 'completed' | 'cancelled' | 'pending' | 'refunded';
  promotion_code?: string;
  created_at?: string;
  updated_at?: string;
  local_id?: number;
  synced_at?: string;
  sync_status?: string;
  items?: SaleItem[];
}

export interface SaleStats {
  total_sales: number;
  total_revenue: number;
  total_discounts: number;
  average_sale: number;
  unique_customers: number;
  total_items: number;
  total_quantity: number;
}

export interface SaleFilters {
  startDate?: string;
  endDate?: string;
  status?: string;
  payment_method?: string;
  customer_name?: string;
  search?: string;
}

/**
 * Génère un numéro de vente unique
 */
export function generateSaleNumber(): string {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `V${year}${month}${day}-${random}`;
}

/**
 * Récupère toutes les ventes avec pagination
 */
export async function getSales(
  page: number = 1,
  limit: number = 20,
  filters?: SaleFilters
): Promise<{
  sales: Sale[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
}> {
  let query = supabase
    .from('sales')
    .select('*', { count: 'exact' });

  // Appliquer les filtres
  if (filters) {
    if (filters.startDate && filters.endDate) {
      query = query
        .gte('sale_date', filters.startDate)
        .lte('sale_date', filters.endDate);
    }

    if (filters.status) {
      query = query.eq('status', filters.status);
    }

    if (filters.payment_method) {
      query = query.eq('payment_method', filters.payment_method);
    }

    if (filters.customer_name) {
      query = query.ilike('customer_name', `%${filters.customer_name}%`);
    }

    if (filters.search) {
      query = query.or(`sale_number.ilike.%${filters.search}%,customer_name.ilike.%${filters.search}%,customer_phone.ilike.%${filters.search}%`);
    }
  }

  // Calculer l'offset pour la pagination
  const offset = (page - 1) * limit;

  const { data: sales, error, count } = await query
    .order('sale_date', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    console.error('Erreur lors de la récupération des ventes:', error);
    throw error;
  }

  const total_pages = Math.ceil((count || 0) / limit);

  return {
    sales: sales || [],
    pagination: {
      page,
      limit,
      total: count || 0,
      total_pages
    }
  };
}

/**
 * Récupère une vente par ID
 */
// export async function getSaleById(id: string): Promise<Sale | null> {
//   const { data: sale, error } = await supabase
//     .from('sales')
//     .select('*')
//     .eq('id', id)
//     .single();

//   if (error) {
//     console.error('Erreur lors de la récupération de la vente:', error);
//     return null;
//   }

//   // Récupérer les items de la vente
//   const { data: items } = await supabase
//     .from('sale_items')
//     .select('*')
//     .eq('sale_id', id);

//   return {
//     ...sale,
//     items: items || []
//   };
// }
/**
 * Récupère une vente par ID avec ses items et retours
 */
export async function getSaleById(id: string): Promise<Sale | null> {
  const { data: sale, error } = await supabase
    .from('sales')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Erreur lors de la récupération de la vente:', error);
    return null;
  }

  // Récupérer les items de la vente
  const { data: items } = await supabase
    .from('sale_items')
    .select('*')
    .eq('sale_id', id);

  // Récupérer les retours de la vente
  const { data: returns } = await supabase
    .from('sale_returns')
    .select('*')
    .eq('original_sale_id', id);

  // Pour chaque item, calculer la quantité déjà retournée
  const itemsWithReturns = await Promise.all(
    (items || []).map(async (item) => {
      const { data: returnItems } = await supabase
        .from('return_items')
        .select('quantity')
        .eq('original_sale_item_id', item.id);

      const returnedQuantity = returnItems?.reduce((sum, ri) => sum + ri.quantity, 0) || 0;

      return {
        ...item,
        returned_quantity: returnedQuantity
      };
    })
  );

  return {
    ...sale,
    items: itemsWithReturns,
    returns: returns || []
  };
}

/**
 * Récupère les statistiques des ventes
 */
export async function getSalesStats(
  period: 'today' | 'yesterday' | 'week' | 'month' | 'year' | 'all' = 'all'
): Promise<SaleStats> {
  let startDate: string | undefined;

  const now = new Date();
  
  switch (period) {
    case 'today':
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
      break;
    case 'yesterday':
      const yesterday = new Date(now);
      yesterday.setDate(now.getDate() - 1);
      startDate = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate()).toISOString();
      break;
    case 'week':
      const weekAgo = new Date(now);
      weekAgo.setDate(now.getDate() - 7);
      startDate = weekAgo.toISOString();
      break;
    case 'month':
      const monthAgo = new Date(now);
      monthAgo.setDate(now.getDate() - 30);
      startDate = monthAgo.toISOString();
      break;
    case 'year':
      const yearAgo = new Date(now);
      yearAgo.setFullYear(now.getFullYear() - 1);
      startDate = yearAgo.toISOString();
      break;
  }

  let query = supabase
    .from('sales')
    .select('*')
    .eq('status', 'completed');

  if (startDate) {
    query = query.gte('sale_date', startDate);
  }

  const { data: sales, error } = await query;

  if (error) {
    console.error('Erreur lors de la récupération des statistiques:', error);
    return {
      total_sales: 0,
      total_revenue: 0,
      total_discounts: 0,
      average_sale: 0,
      unique_customers: 0,
      total_items: 0,
      total_quantity: 0
    };
  }

  const total_sales = sales?.length || 0;
  const total_revenue = sales?.reduce((sum, sale) => sum + (sale.total_amount || 0), 0) || 0;
  const total_discounts = sales?.reduce((sum, sale) => sum + (sale.discount_amount || 0), 0) || 0;
  const average_sale = total_sales > 0 ? total_revenue / total_sales : 0;
  
  // Clients uniques (basé sur le nom)
  const uniqueCustomers = new Set(sales?.map(sale => sale.customer_name).filter(Boolean));
  
  // Pour les items, on devrait avoir une fonction séparée pour les compter
  // Pour l'instant, on retourne des valeurs par défaut
  const total_items = 0;
  const total_quantity = 0;

  return {
    total_sales,
    total_revenue,
    total_discounts,
    average_sale,
    unique_customers: uniqueCustomers.size,
    total_items,
    total_quantity
  };
}

/**
 * Crée une nouvelle vente
 */
export async function createSale(saleData: Sale): Promise<{ success: boolean; sale?: Sale; error?: string }> {
  try {
    // Vérifier qu'il y a au moins un item
    if (!saleData.items || saleData.items.length === 0) {
      return { success: false, error: 'La vente doit contenir au moins un article' };
    }

    // Générer un numéro de vente si non fourni
    const saleNumber = saleData.sale_number || generateSaleNumber();

    // Insérer la vente
    const { data: sale, error: saleError } = await supabase
      .from('sales')
      .insert([{
        sale_number: saleNumber,
        sale_date: saleData.sale_date || new Date().toISOString(),
        total_amount: saleData.total_amount,
        subtotal_amount: saleData.subtotal_amount,
        discount_amount: saleData.discount_amount || 0,
        tax_amount: saleData.tax_amount || 0,
        payment_method: saleData.payment_method,
        customer_name: saleData.customer_name || null,
        customer_phone: saleData.customer_phone || null,
        customer_email: saleData.customer_email || null,
        notes: saleData.notes || null,
        status: 'completed',
        promotion_code: saleData.promotion_code || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        sync_status: 'synced'
      }])
      .select()
      .single();

    if (saleError) {
      console.error('Erreur lors de la création de la vente:', saleError);
      return { success: false, error: saleError.message };
    }

    // Insérer les items de vente
    const saleItems = saleData.items.map(item => ({
      sale_id: sale.id,
      product_id: item.product_id,
      sku: item.sku,
      product_name: item.product_name,
      quantity: item.quantity,
      unit_price: item.unit_price,
      discount_percent: item.discount_percent || 0,
      discount_amount: item.discount_amount || 0,
      subtotal: item.subtotal,
      tax_percent: item.tax_percent || 0,
      tax_amount: item.tax_amount || 0,
      total: item.total,
      sync_status: 'synced'
    }));

    const { error: itemsError } = await supabase
      .from('sale_items')
      .insert(saleItems);

    if (itemsError) {
      console.error('Erreur lors de l\'insertion des items:', itemsError);
      
      // Supprimer la vente créée en cas d'erreur
      await supabase.from('sales').delete().eq('id', sale.id);
      
      return { success: false, error: itemsError.message };
    }

    // Mettre à jour les stocks des produits
    for (const item of saleData.items) {
      await updateProductStock(item.product_id, -item.quantity);
    }

    return { 
      success: true, 
      sale: {
        ...sale,
        items: saleData.items
      }
    };

  } catch (error) {
    console.error('Erreur lors de la création de la vente:', error);
    return { success: false, error: 'Erreur lors de la création de la vente' };
  }
}

/**
 * Met à jour le stock d'un produit
 */
async function updateProductStock(productId: string, quantityChange: number): Promise<void> {
  try {
    // Récupérer le produit actuel
    const { data: product } = await supabase
      .from('products')
      .select('quantity')
      .eq('id', productId)
      .single();

    if (product) {
      const newQuantity = Math.max(0, (product.quantity || 0) + quantityChange);
      
      await supabase
        .from('products')
        .update({ 
          quantity: newQuantity,
          updated_at: new Date().toISOString()
        })
        .eq('id', productId);
    }
  } catch (error) {
    console.error('Erreur lors de la mise à jour du stock:', error);
  }
}

/**
 * Annule une vente
 */
export async function cancelSale(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    // Récupérer la vente et ses items
    const { data: sale, error: saleError } = await supabase
      .from('sales')
      .select('*')
      .eq('id', id)
      .single();

    if (saleError || !sale) {
      return { success: false, error: 'Vente non trouvée' };
    }

    // Vérifier que la vente peut être annulée
    if (sale.status === 'cancelled') {
      return { success: false, error: 'Cette vente est déjà annulée' };
    }

    // Récupérer les items de la vente
    const { data: items } = await supabase
      .from('sale_items')
      .select('*')
      .eq('sale_id', id);

    // Restaurer les stocks
    if (items) {
      for (const item of items) {
        await updateProductStock(item.product_id, item.quantity);
      }
    }

    // Marquer la vente comme annulée
    const { error: updateError } = await supabase
      .from('sales')
      .update({
        status: 'cancelled',
        updated_at: new Date().toISOString()
      })
      .eq('id', id);

    if (updateError) {
      return { success: false, error: updateError.message };
    }

    return { success: true };

  } catch (error) {
    console.error('Erreur lors de l\'annulation de la vente:', error);
    return { success: false, error: 'Erreur lors de l\'annulation de la vente' };
  }
}

/**
 * Exporte les ventes en CSV
 */
export async function exportSalesCSV(filters?: SaleFilters): Promise<string> {
  try {
    const { sales } = await getSales(1, 1000000, filters); // Limite élevée pour tout récupérer
    
    if (sales.length === 0) {
      return '';
    }

    // En-têtes CSV
    const headers = [
      'Numéro de vente',
      'Date',
      'Client',
      'Téléphone',
      'Email',
      'Montant total',
      'Sous-total',
      'Remise',
      'TVA',
      'Méthode de paiement',
      'Statut',
      'Code promotion',
      'Notes'
    ];

    // Données CSV
    const rows = sales.map(sale => [
      sale.sale_number,
      new Date(sale.sale_date).toLocaleString('fr-FR'),
      sale.customer_name || '',
      sale.customer_phone || '',
      sale.customer_email || '',
      sale.total_amount.toString().replace('.', ','),
      sale.subtotal_amount.toString().replace('.', ','),
      sale.discount_amount.toString().replace('.', ','),
      sale.tax_amount.toString().replace('.', ','),
      sale.payment_method,
      sale.status,
      sale.promotion_code || '',
      sale.notes || ''
    ]);

    // Convertir en CSV
    const csvContent = [
      headers.join(';'),
      ...rows.map(row => row.join(';'))
    ].join('\n');

    return csvContent;

  } catch (error) {
    console.error('Erreur lors de l\'export CSV:', error);
    return '';
  }
}

/**
 * Récupère les clients fréquents
 */
export async function getTopCustomers(limit: number = 10): Promise<Array<{
  customer_name: string;
  total_spent: number;
  purchase_count: number;
}>> {
  const { data: sales, error } = await supabase
    .from('sales')
    .select('customer_name, total_amount')
    .eq('status', 'completed')
    .not('customer_name', 'is', null);

  if (error) {
    console.error('Erreur lors de la récupération des clients:', error);
    return [];
  }

  const customerMap = new Map<string, { total_spent: number; purchase_count: number }>();

  sales?.forEach(sale => {
    if (sale.customer_name) {
      const existing = customerMap.get(sale.customer_name) || { total_spent: 0, purchase_count: 0 };
      customerMap.set(sale.customer_name, {
        total_spent: existing.total_spent + (sale.total_amount || 0),
        purchase_count: existing.purchase_count + 1
      });
    }
  });

  return Array.from(customerMap.entries())
    .map(([customer_name, stats]) => ({
      customer_name,
      ...stats
    }))
    .sort((a, b) => b.total_spent - a.total_spent)
    .slice(0, limit);
}

/**
 * Récupère les produits les plus vendus
 */
export async function getTopProducts(limit: number = 10): Promise<Array<{
  product_name: string;
  sku: string;
  total_quantity: number;
  total_revenue: number;
}>> {
  const { data: items, error } = await supabase
    .from('sale_items')
    .select('product_name, sku, quantity, unit_price')
    .order('quantity', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Erreur lors de la récupération des produits:', error);
    return [];
  }

  const productMap = new Map<string, { sku: string; total_quantity: number; total_revenue: number }>();

  items?.forEach(item => {
    const existing = productMap.get(item.product_name) || { sku: item.sku, total_quantity: 0, total_revenue: 0 };
    productMap.set(item.product_name, {
      sku: item.sku,
      total_quantity: existing.total_quantity + item.quantity,
      total_revenue: existing.total_revenue + (item.quantity * item.unit_price)
    });
  });

  return Array.from(productMap.entries())
    .map(([product_name, stats]) => ({
      product_name,
      ...stats
    }))
    .sort((a, b) => b.total_quantity - a.total_quantity);
}

export interface ReturnItem {
  id?: string;
  return_id?: string;
  original_sale_item_id: string;
  product_id?: string;
  quantity: number;
  unit_price: number;
  reason?: string;
  created_at?: string;
  local_id?: number;
  local_return_id?: number;
  synced_at?: string;
  sync_status?: string;
}

export interface SaleReturn {
  id?: string;
  return_number: string;
  original_sale_id: string;
  total_amount: number;
  reason?: string;
  status?: 'completed' | 'pending' | 'cancelled';
  processed_by?: string;
  processed_at?: string;
  created_at?: string;
  local_id?: number;
  synced_at?: string;
  sync_status?: string;
  items?: ReturnItem[];
}

/**
 * Crée un retour de vente
 */
export async function createSaleReturn(returnData: {
  sale_id: string;
  items: {
    sale_item_id: string;
    quantity: number;
    reason?: string;
  }[];
  reason?: string;
  processed_by?: string;
}): Promise<{ success: boolean; saleReturn?: SaleReturn; error?: string }> {
  try {
    // Récupérer la vente originale
    const sale = await getSaleById(returnData.sale_id);
    if (!sale) {
      return { success: false, error: 'Vente non trouvée' };
    }

    // Vérifier que la vente n'est pas déjà annulée
    if (sale.status === 'cancelled') {
      return { success: false, error: 'Cette vente est annulée' };
    }

    // Récupérer les détails des items de la vente
    const saleItems = sale.items || [];
    let totalAmount = 0;
    const returnItems: ReturnItem[] = [];

    // Valider et calculer le total
    for (const item of returnData.items) {
      const saleItem = saleItems.find(si => si.id === item.sale_item_id);
      if (!saleItem) {
        return { success: false, error: `Item non trouvé: ${item.sale_item_id}` };
      }

      // Vérifier la quantité retournée
      if (item.quantity > saleItem.quantity) {
        return { success: false, error: `Quantité trop élevée pour ${saleItem.product_name}` };
      }

      totalAmount += item.quantity * saleItem.unit_price;
      
      returnItems.push({
        original_sale_item_id: item.sale_item_id,
        product_id: saleItem.product_id,
        quantity: item.quantity,
        unit_price: saleItem.unit_price,
        reason: item.reason
      });
    }

    // Générer un numéro de retour
    const returnNumber = `R${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(new Date().getDate()).padStart(2, '0')}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;

    // Créer le retour dans la base de données
    const { data: saleReturn, error: returnError } = await supabase
      .from('sale_returns')
      .insert([{
        return_number: returnNumber,
        original_sale_id: returnData.sale_id,
        total_amount: totalAmount,
        reason: returnData.reason || null,
        status: 'completed',
        processed_by: returnData.processed_by || 'Système',
        processed_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        sync_status: 'synced'
      }])
      .select()
      .single();

    if (returnError) {
      console.error('Erreur création retour:', returnError);
      return { success: false, error: returnError.message };
    }

    // Créer les items de retour
    const returnItemsData = returnItems.map(item => ({
      return_id: saleReturn.id,
      original_sale_item_id: item.original_sale_item_id,
      product_id: item.product_id,
      quantity: item.quantity,
      unit_price: item.unit_price,
      reason: item.reason || null,
      created_at: new Date().toISOString(),
      sync_status: 'synced'
    }));

    const { error: itemsError } = await supabase
      .from('return_items')
      .insert(returnItemsData);

    if (itemsError) {
      console.error('Erreur création items retour:', itemsError);
      
      // Supprimer le retour créé en cas d'erreur
      await supabase.from('sale_returns').delete().eq('id', saleReturn.id);
      
      return { success: false, error: itemsError.message };
    }

    // Mettre à jour les stocks des produits
    for (const item of returnItems) {
      if (item.product_id) {
        await updateProductStock(item.product_id, item.quantity);
      }
    }

    return { 
      success: true, 
      saleReturn: {
        ...saleReturn,
        items: returnItems
      }
    };

  } catch (error) {
    console.error('Erreur création retour:', error);
    return { success: false, error: 'Erreur lors de la création du retour' };
  }
}

/**
 * Récupère les retours d'une vente
 */
export async function getSaleReturns(saleId: string): Promise<SaleReturn[]> {
  const { data: returns, error } = await supabase
    .from('sale_returns')
    .select('*')
    .eq('original_sale_id', saleId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Erreur récupération retours:', error);
    return [];
  }

  // Pour chaque retour, récupérer les items
  const returnsWithItems = await Promise.all(
    (returns || []).map(async (saleReturn) => {
      const { data: items } = await supabase
        .from('return_items')
        .select('*')
        .eq('return_id', saleReturn.id);

      return {
        ...saleReturn,
        items: items || []
      };
    })
  );

  return returnsWithItems;
}





