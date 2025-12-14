import { supabase } from './supabase';

export interface Customer {
  id?: string;
  customer_number: string;
  name: string;
  phone?: string;
  email?: string;
  loyalty_points?: number;
  purchase_count?: number;
  total_spent?: number;
  created_at?: string;
  updated_at?: string;
  local_id?: number;
  synced_at?: string;
  sync_status?: string;
  last_purchase_date?: string;
}

export interface CustomerFilters {
  search?: string;
  min_purchases?: number;
  min_total_spent?: number;
  has_loyalty_points?: boolean;
}

/**
 * Génère un numéro de client unique
 */
export function generateCustomerNumber(): string {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `C${year}${month}${day}-${random}`;
}

/**
 * Récupère tous les clients avec pagination
 */
export async function getCustomers(
  page: number = 1,
  limit: number = 20,
  filters?: CustomerFilters
): Promise<{
  customers: Customer[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
}> {
  let query = supabase
    .from('customers')
    .select('*', { count: 'exact' });

  // Appliquer les filtres
  if (filters) {
    if (filters.search) {
      query = query.or(`name.ilike.%${filters.search}%,customer_number.ilike.%${filters.search}%,phone.ilike.%${filters.search}%,email.ilike.%${filters.search}%`);
    }

    if (filters.min_purchases) {
      query = query.gte('purchase_count', filters.min_purchases);
    }

    if (filters.min_total_spent) {
      query = query.gte('total_spent', filters.min_total_spent);
    }

    if (filters.has_loyalty_points) {
      query = query.gt('loyalty_points', 0);
    }
  }

  // Calculer l'offset pour la pagination
  const offset = (page - 1) * limit;

  const { data: customers, error, count } = await query
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    console.error('Erreur lors de la récupération des clients:', error);
    throw error;
  }

  const total_pages = Math.ceil((count || 0) / limit);

  // Récupérer la date de dernière achat pour chaque client
  const customersWithLastPurchase = await Promise.all(
    (customers || []).map(async (customer) => {
      const { data: lastSale } = await supabase
        .from('sales')
        .select('sale_date')
        .or(`customer_name.ilike.%${customer.name}%,customer_phone.ilike.%${customer.phone}%,customer_email.ilike.%${customer.email}%`)
        .eq('status', 'completed')
        .order('sale_date', { ascending: false })
        .limit(1)
        .single();

      return {
        ...customer,
        last_purchase_date: lastSale?.sale_date || null
      };
    })
  );

  return {
    customers: customersWithLastPurchase || [],
    pagination: {
      page,
      limit,
      total: count || 0,
      total_pages
    }
  };
}

/**
 * Récupère un client par ID
 */
export async function getCustomerById(id: string): Promise<Customer | null> {
  const { data: customer, error } = await supabase
    .from('customers')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Erreur lors de la récupération du client:', error);
    return null;
  }

  // Récupérer la date de dernière achat
  const { data: lastSale } = await supabase
    .from('sales')
    .select('sale_date')
    .or(`customer_name.ilike.%${customer.name}%,customer_phone.ilike.%${customer.phone}%,customer_email.ilike.%${customer.email}%`)
    .eq('status', 'completed')
    .order('sale_date', { ascending: false })
    .limit(1)
    .single();

  // Récupérer l'historique des achats
  const { data: salesHistory } = await supabase
    .from('sales')
    .select('id, sale_number, sale_date, total_amount, payment_method, status')
    .or(`customer_name.ilike.%${customer.name}%,customer_phone.ilike.%${customer.phone}%,customer_email.ilike.%${customer.email}%`)
    .order('sale_date', { ascending: false })
    .limit(20);

  return {
    ...customer,
    last_purchase_date: lastSale?.sale_date || null,
    sales_history: salesHistory || []
  };
}

/**
 * Récupère un client par numéro
 */
export async function getCustomerByNumber(customerNumber: string): Promise<Customer | null> {
  const { data: customer, error } = await supabase
    .from('customers')
    .select('*')
    .eq('customer_number', customerNumber)
    .single();

  if (error) {
    return null;
  }

  return customer;
}

/**
 * Crée un nouveau client
 */
export async function createCustomer(customerData: Omit<Customer, 'id'>): Promise<{ success: boolean; customer?: Customer; error?: string }> {
  try {
    // Générer un numéro de client si non fourni
    const customerNumber = customerData.customer_number || generateCustomerNumber();

    // Vérifier si le numéro de client existe déjà
    const existingCustomer = await getCustomerByNumber(customerNumber);
    if (existingCustomer) {
      return { success: false, error: 'Ce numéro de client existe déjà' };
    }

    const { data: customer, error } = await supabase
      .from('customers')
      .insert([{
        customer_number: customerNumber,
        name: customerData.name,
        phone: customerData.phone || null,
        email: customerData.email || null,
        loyalty_points: customerData.loyalty_points || 0,
        purchase_count: customerData.purchase_count || 0,
        total_spent: customerData.total_spent || 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        sync_status: 'synced'
      }])
      .select()
      .single();

    if (error) {
      console.error('Erreur lors de la création du client:', error);
      return { success: false, error: error.message };
    }

    return { success: true, customer };

  } catch (error) {
    console.error('Erreur lors de la création du client:', error);
    return { success: false, error: 'Erreur lors de la création du client' };
  }
}

/**
 * Met à jour un client
 */
export async function updateCustomer(id: string, customerData: Partial<Customer>): Promise<{ success: boolean; error?: string }> {
  try {
    // Si le numéro de client est modifié, vérifier qu'il n'existe pas déjà
    if (customerData.customer_number) {
      const existingCustomer = await getCustomerByNumber(customerData.customer_number);
      if (existingCustomer && existingCustomer.id !== id) {
        return { success: false, error: 'Ce numéro de client existe déjà pour un autre client' };
      }
    }

    const { error } = await supabase
      .from('customers')
      .update({
        ...customerData,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);

    if (error) {
      console.error('Erreur lors de la mise à jour du client:', error);
      return { success: false, error: error.message };
    }

    return { success: true };

  } catch (error) {
    console.error('Erreur lors de la mise à jour du client:', error);
    return { success: false, error: 'Erreur lors de la mise à jour du client' };
  }
}

/**
 * Supprime un client
 */
export async function deleteCustomer(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    // Vérifier si le client a des ventes associées
    const { data: sales } = await supabase
      .from('sales')
      .select('id')
      .or(`customer_name.ilike.%${id}%,customer_phone.ilike.%${id}%,customer_email.ilike.%${id}%`)
      .limit(1);

    if (sales && sales.length > 0) {
      return { success: false, error: 'Ce client a des ventes associées et ne peut pas être supprimé' };
    }

    const { error } = await supabase
      .from('customers')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Erreur lors de la suppression du client:', error);
      return { success: false, error: error.message };
    }

    return { success: true };

  } catch (error) {
    console.error('Erreur lors de la suppression du client:', error);
    return { success: false, error: 'Erreur lors de la suppression du client' };
  }
}

/**
 * Ajoute des points de fidélité à un client
 */
export async function addLoyaltyPoints(customerId: string, points: number): Promise<{ success: boolean; newPoints?: number; error?: string }> {
  try {
    const customer = await getCustomerById(customerId);
    if (!customer) {
      return { success: false, error: 'Client non trouvé' };
    }

    const newPoints = (customer.loyalty_points || 0) + points;
    
    const { error } = await supabase
      .from('customers')
      .update({ 
        loyalty_points: newPoints,
        updated_at: new Date().toISOString()
      })
      .eq('id', customerId);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, newPoints };

  } catch (error) {
    console.error('Erreur ajout points fidélité:', error);
    return { success: false, error: 'Erreur lors de l\'ajout des points de fidélité' };
  }
}

/**
 * Met à jour les statistiques d'un client après une vente
 */
export async function updateCustomerStats(customerId: string, saleAmount: number): Promise<{ success: boolean; error?: string }> {
  try {
    const customer = await getCustomerById(customerId);
    if (!customer) {
      return { success: false, error: 'Client non trouvé' };
    }

    const newPurchaseCount = (customer.purchase_count || 0) + 1;
    const newTotalSpent = (customer.total_spent || 0) + saleAmount;
    
    // Ajouter des points de fidélité (1 point pour chaque 10€ dépensés)
    const pointsEarned = Math.floor(saleAmount / 10);
    const newLoyaltyPoints = (customer.loyalty_points || 0) + pointsEarned;

    const { error } = await supabase
      .from('customers')
      .update({ 
        purchase_count: newPurchaseCount,
        total_spent: newTotalSpent,
        loyalty_points: newLoyaltyPoints,
        updated_at: new Date().toISOString()
      })
      .eq('id', customerId);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };

  } catch (error) {
    console.error('Erreur mise à jour stats client:', error);
    return { success: false, error: 'Erreur lors de la mise à jour des statistiques du client' };
  }
}

/**
 * Recherche des clients
 */
export async function searchCustomers(searchTerm: string): Promise<Customer[]> {
  const { data: customers, error } = await supabase
    .from('customers')
    .select('*')
    .or(`name.ilike.%${searchTerm}%,customer_number.ilike.%${searchTerm}%,phone.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`)
    .order('name')
    .limit(20);

  if (error) {
    console.error('Erreur lors de la recherche:', error);
    return [];
  }

  return customers || [];
}

/**
 * Exporte les clients en CSV
 */
export async function exportCustomersCSV(filters?: CustomerFilters): Promise<string> {
  try {
    const { customers } = await getCustomers(1, 1000000, filters); // Limite élevée pour tout récupérer
    
    if (customers.length === 0) {
      return '';
    }

    // En-têtes CSV
    const headers = [
      'Numéro client',
      'Nom',
      'Téléphone',
      'Email',
      'Points fidélité',
      'Nombre d\'achats',
      'Total dépensé',
      'Date création',
      'Dernier achat'
    ];

    // Données CSV
    const rows = customers.map(customer => [
      customer.customer_number,
      customer.name,
      customer.phone || '',
      customer.email || '',
      customer.loyalty_points?.toString() || '0',
      customer.purchase_count?.toString() || '0',
      customer.total_spent?.toString().replace('.', ',') || '0',
      customer.created_at ? new Date(customer.created_at).toLocaleDateString('fr-FR') : '',
      customer.last_purchase_date ? new Date(customer.last_purchase_date).toLocaleDateString('fr-FR') : ''
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
 * Récupère les statistiques des clients
 */
export async function getCustomersStats(): Promise<{
  total_customers: number;
  active_customers: number;
  average_purchases: number;
  average_spent: number;
  total_loyalty_points: number;
  top_spenders: Array<{
    id: string;
    name: string;
    total_spent: number;
    purchase_count: number;
  }>;
}> {
  const { data: customers, error } = await supabase
    .from('customers')
    .select('*');

  if (error || !customers) {
    return {
      total_customers: 0,
      active_customers: 0,
      average_purchases: 0,
      average_spent: 0,
      total_loyalty_points: 0,
      top_spenders: []
    };
  }

  const active_customers = customers.filter(c => (c.purchase_count || 0) > 0).length;
  const total_purchases = customers.reduce((sum, c) => sum + (c.purchase_count || 0), 0);
  const total_spent = customers.reduce((sum, c) => sum + (c.total_spent || 0), 0);
  const total_loyalty_points = customers.reduce((sum, c) => sum + (c.loyalty_points || 0), 0);

  const top_spenders = customers
    .filter(c => (c.total_spent || 0) > 0)
    .sort((a, b) => (b.total_spent || 0) - (a.total_spent || 0))
    .slice(0, 10)
    .map(c => ({
      id: c.id!,
      name: c.name,
      total_spent: c.total_spent || 0,
      purchase_count: c.purchase_count || 0
    }));

  return {
    total_customers: customers.length,
    active_customers,
    average_purchases: customers.length > 0 ? total_purchases / customers.length : 0,
    average_spent: customers.length > 0 ? total_spent / customers.length : 0,
    total_loyalty_points,
    top_spenders
  };
}

/**
 * Récupère les clients avec des points de fidélité
 */
export async function getCustomersWithLoyaltyPoints(limit: number = 20): Promise<Customer[]> {
  const { data: customers, error } = await supabase
    .from('customers')
    .select('*')
    .gt('loyalty_points', 0)
    .order('loyalty_points', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Erreur récupération clients avec points:', error);
    return [];
  }

  return customers || [];
}

/**
 * Récupère les clients inactifs (pas d'achat depuis 30 jours)
 */
export async function getInactiveCustomers(days: number = 30): Promise<Customer[]> {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);

  const { data: customers, error } = await supabase
    .from('customers')
    .select('*')
    .gt('purchase_count', 0); // Seulement ceux qui ont déjà acheté

  if (error || !customers) {
    console.error('Erreur récupération clients inactifs:', error);
    return [];
  }

  // Filtrer les clients inactifs en vérifiant leur dernière vente
  const inactiveCustomers = await Promise.all(
    customers.map(async (customer) => {
      const { data: lastSale } = await supabase
        .from('sales')
        .select('sale_date')
        .or(`customer_name.ilike.%${customer.name}%,customer_phone.ilike.%${customer.phone}%,customer_email.ilike.%${customer.email}%`)
        .eq('status', 'completed')
        .order('sale_date', { ascending: false })
        .limit(1)
        .single();

      if (!lastSale) {
        return null; // Client sans vente
      }

      const lastPurchaseDate = new Date(lastSale.sale_date);
      if (lastPurchaseDate < cutoffDate) {
        return {
          ...customer,
          last_purchase_date: lastSale.sale_date
        };
      }

      return null;
    })
  );

  return inactiveCustomers.filter(c => c !== null) as Customer[];
} 
