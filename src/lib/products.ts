import { supabase } from './supabase';

export interface Product {
  id?: string;
  sku: string;
  name: string;
  price: number;
  quantity: number;
  category?: string;
  supplier?: string;
  barcode?: string;
  image?: string;
  created_at?: string;
  updated_at?: string;
  local_id?: number;
  synced_at?: string;
  sync_status?: string;
}

/**
 * Récupère tous les produits
 */
export async function getAllProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Erreur lors de la récupération des produits:', error);
    throw error;
  }

  return data || [];
}

/**
 * Récupère un produit par ID
 */
export async function getProductById(id: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Erreur lors de la récupération du produit:', error);
    return null;
  }

  return data;
}

/**
 * Récupère un produit par SKU
 */
export async function getProductBySKU(sku: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('sku', sku)
    .single();

  if (error) {
    return null;
  }

  return data;
}

/**
 * Récupère un produit par code-barres
 */
export async function getProductByBarcode(barcode: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('barcode', barcode)
    .single();

  if (error) {
    return null;
  }

  return data;
}

/**
 * Ajoute un nouveau produit
 */
export async function addProduct(product: Omit<Product, 'id'>): Promise<{ success: boolean; error?: string; data?: Product }> {
  try {
    // Vérifier si le SKU existe déjà
    const existingProduct = await getProductBySKU(product.sku);
    if (existingProduct) {
      return { success: false, error: 'Cette référence (SKU) existe déjà' };
    }

    const { data, error } = await supabase
      .from('products')
      .insert([{
        ...product,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        sync_status: 'synced'
      }])
      .select()
      .single();

    if (error) {
      console.error('Erreur lors de l\'ajout du produit:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Erreur:', error);
    return { success: false, error: 'Erreur lors de l\'ajout du produit' };
  }
}

/**
 * Met à jour un produit
 */
export async function updateProduct(id: string, product: Partial<Product>): Promise<{ success: boolean; error?: string }> {
  try {
    // Si le SKU est modifié, vérifier qu'il n'existe pas déjà
    if (product.sku) {
      const existingProduct = await getProductBySKU(product.sku);
      if (existingProduct && existingProduct.id !== id) {
        return { success: false, error: 'Cette référence (SKU) existe déjà pour un autre produit' };
      }
    }

    const { error } = await supabase
      .from('products')
      .update({
        ...product,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);

    if (error) {
      console.error('Erreur lors de la mise à jour du produit:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Erreur:', error);
    return { success: false, error: 'Erreur lors de la mise à jour du produit' };
  }
}

/**
 * Supprime un produit
 */
export async function deleteProduct(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Erreur lors de la suppression du produit:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Erreur:', error);
    return { success: false, error: 'Erreur lors de la suppression du produit' };
  }
}

/**
 * Recherche des produits
 */
export async function searchProducts(searchTerm: string): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .or(`name.ilike.%${searchTerm}%,sku.ilike.%${searchTerm}%,barcode.ilike.%${searchTerm}%,category.ilike.%${searchTerm}%,supplier.ilike.%${searchTerm}%`)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Erreur lors de la recherche:', error);
    return [];
  }

  return data || [];
}

/**
 * Met à jour la quantité d'un produit
 */
export async function updateProductQuantity(id: string, quantityChange: number): Promise<{ success: boolean; newQuantity?: number; error?: string }> {
  try {
    const product = await getProductById(id);
    if (!product) {
      return { success: false, error: 'Produit non trouvé' };
    }

    const newQuantity = (product.quantity || 0) + quantityChange;
    
    if (newQuantity < 0) {
      return { success: false, error: 'Quantité insuffisante en stock' };
    }

    const { error } = await supabase
      .from('products')
      .update({ 
        quantity: newQuantity,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, newQuantity };
  } catch (error) {
    console.error('Erreur:', error);
    return { success: false, error: 'Erreur lors de la mise à jour de la quantité' };
  }
}

/**
 * Obtient les statistiques des produits
 */
export async function getProductsStats(): Promise<{
  total: number;
  low_stock: number;
  out_of_stock: number;
  total_value: number;
  categories: { category: string; count: number }[];
  suppliers: { supplier: string; count: number }[];
}> {
  const { data: products, error } = await supabase
    .from('products')
    .select('*');

  if (error || !products) {
    return {
      total: 0,
      low_stock: 0,
      out_of_stock: 0,
      total_value: 0,
      categories: [],
      suppliers: []
    };
  }

  const categoriesMap = new Map<string, number>();
  const suppliersMap = new Map<string, number>();
  let totalValue = 0;
  let lowStock = 0;
  let outOfStock = 0;

  products.forEach(product => {
    totalValue += (product.price || 0) * (product.quantity || 0);
    
    if (product.quantity <= 0) {
      outOfStock++;
    } else if (product.quantity < 10) {
      lowStock++;
    }

    if (product.category) {
      categoriesMap.set(product.category, (categoriesMap.get(product.category) || 0) + 1);
    }

    if (product.supplier) {
      suppliersMap.set(product.supplier, (suppliersMap.get(product.supplier) || 0) + 1);
    }
  });

  return {
    total: products.length,
    low_stock: lowStock,
    out_of_stock: outOfStock,
    total_value: parseFloat(totalValue.toFixed(2)),
    categories: Array.from(categoriesMap.entries()).map(([category, count]) => ({ category, count })),
    suppliers: Array.from(suppliersMap.entries()).map(([supplier, count]) => ({ supplier, count }))
  };
}

/**
 * Obtient les catégories uniques
 */
export async function getUniqueCategories(): Promise<string[]> {
  const { data, error } = await supabase
    .from('products')
    .select('category')
    .not('category', 'is', null)
    .order('category');

  if (error) {
    return [];
  }

  const categories = new Set(data.map(item => item.category).filter(Boolean));
  return Array.from(categories);
}