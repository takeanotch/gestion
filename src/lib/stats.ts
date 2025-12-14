// import { supabase } from './supabase';

// // Types
// export interface DailySales {
//   date: string;
//   sales_count: number;
//   total_revenue: number;
//   discount_amount: number;
//   unique_customers: number;
//   avg_ticket: number;
//   [key: string]: any; // Pour les propriétés supplémentaires
// }

// export interface MonthlySales {
//   month: string;
//   month_number: number;
//   total_revenue: number;
//   sales_count: number;
// }

// export interface PaymentMethodStats {
//   payment_method: string;
//   count: number;
//   total_amount: number;
//   percentage: number;
// }

// export interface ProductStats {
//   product_id: string;
//   product_name: string;
//   sku: string;
//   total_sold: number;
//   total_revenue: number;
//   average_price: number;
// }

// export interface CategoryStats {
//   category: string;
//   product_count: number;
//   total_stock: number;
//   total_value: number;
//   average_price: number;
// }

// export interface CustomerStats {
//   customer_name: string;
//   purchase_count: number;
//   total_spent: number;
//   last_purchase: string;
//   average_ticket: number;
// }

// export interface PerformanceStats {
//   total_sales: number;
//   total_revenue: number;
//   total_discounts: number;
//   average_ticket: number;
//   best_day: string;
//   best_day_revenue: number;
//   unique_customers: number;
//   promotion_usage: number;
// }

// /**
//  * Récupère les statistiques de vente quotidiennes
//  */
// export async function getDailySales(days: number = 30): Promise<DailySales[]> {
//   try {
//     const startDate = new Date();
//     startDate.setDate(startDate.getDate() - days);
    
//     const { data, error } = await supabase
//       .from('sales')
//       .select('*')
//       .gte('sale_date', startDate.toISOString())
//       .eq('status', 'completed')
//       .order('sale_date', { ascending: true });

//     if (error) {
//       console.error('Erreur récupération ventes quotidiennes:', error);
//       return [];
//     }

//     // Grouper les ventes par jour
//     const dailySalesMap: Record<string, DailySales & { unique_customers_set?: Set<string> }> = {};
    
//     data?.forEach(sale => {
//       const date = new Date(sale.sale_date);
//       const dateStr = date.toISOString().split('T')[0];
//       const formattedDate = date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
      
//       if (!dailySalesMap[dateStr]) {
//         dailySalesMap[dateStr] = {
//           date: formattedDate,
//           sales_count: 0,
//           total_revenue: 0,
//           discount_amount: 0,
//           unique_customers: 0,
//           avg_ticket: 0,
//           unique_customers_set: new Set<string>()
//         };
//       }
      
//       dailySalesMap[dateStr].sales_count++;
//       dailySalesMap[dateStr].total_revenue += sale.total_amount || 0;
//       dailySalesMap[dateStr].discount_amount += sale.discount_amount || 0;
      
//       // Ajouter le client à l'ensemble des clients uniques
//       if (sale.customer_name) {
//         dailySalesMap[dateStr].unique_customers_set!.add(sale.customer_name);
//         dailySalesMap[dateStr].unique_customers = dailySalesMap[dateStr].unique_customers_set!.size;
//       }
//     });

//     // Calculer le ticket moyen et nettoyer les données
//     const dailySales = Object.values(dailySalesMap).map(day => {
//       const dayData = { ...day };
//       dayData.avg_ticket = dayData.sales_count > 0 ? dayData.total_revenue / dayData.sales_count : 0;
//       delete dayData.unique_customers_set;
//       return dayData;
//     });

//     return dailySales.sort((a, b) => {
//       const dateA = new Date(a.date.split(' ')[0] + ' ' + new Date().getFullYear());
//       const dateB = new Date(b.date.split(' ')[0] + ' ' + new Date().getFullYear());
//       return dateA.getTime() - dateB.getTime();
//     });

//   } catch (error) {
//     console.error('Erreur getDailySales:', error);
//     return [];
//   }
// }

// /**
//  * Récupère les statistiques de vente mensuelles
//  */
// export async function getMonthlySales(year: number = new Date().getFullYear()): Promise<MonthlySales[]> {
//   try {
//     const { data, error } = await supabase
//       .from('sales')
//       .select('sale_date, total_amount')
//       .eq('status', 'completed')
//       .gte('sale_date', `${year}-01-01`)
//       .lte('sale_date', `${year}-12-31`);

//     if (error) {
//       console.error('Erreur récupération ventes mensuelles:', error);
//       return [];
//     }

//     const monthlySalesMap: Record<number, MonthlySales> = {};
//     const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];

//     // Initialiser tous les mois
//     for (let i = 1; i <= 12; i++) {
//       monthlySalesMap[i] = {
//         month: months[i - 1],
//         month_number: i,
//         total_revenue: 0,
//         sales_count: 0
//       };
//     }

//     // Agréger les données par mois
//     data?.forEach(sale => {
//       const month = new Date(sale.sale_date).getMonth() + 1;
//       monthlySalesMap[month].sales_count++;
//       monthlySalesMap[month].total_revenue += sale.total_amount || 0;
//     });

//     return Object.values(monthlySalesMap);

//   } catch (error) {
//     console.error('Erreur getMonthlySales:', error);
//     return [];
//   }
// }

// /**
//  * Récupère les statistiques par méthode de paiement
//  */
// export async function getPaymentMethodsStats(): Promise<PaymentMethodStats[]> {
//   try {
//     const { data, error } = await supabase
//       .from('sales')
//       .select('payment_method, total_amount')
//       .eq('status', 'completed');

//     if (error) {
//       console.error('Erreur récupération stats paiement:', error);
//       return [];
//     }

//     const paymentStatsMap: Record<string, PaymentMethodStats> = {};
//     let totalAmount = 0;

//     // Calculer les totaux par méthode de paiement
//     data?.forEach(sale => {
//       const method = sale.payment_method || 'unknown';
      
//       if (!paymentStatsMap[method]) {
//         paymentStatsMap[method] = {
//           payment_method: method,
//           count: 0,
//           total_amount: 0,
//           percentage: 0
//         };
//       }
      
//       paymentStatsMap[method].count++;
//       paymentStatsMap[method].total_amount += sale.total_amount || 0;
//       totalAmount += sale.total_amount || 0;
//     });

//     // Calculer les pourcentages
//     Object.values(paymentStatsMap).forEach(stat => {
//       stat.percentage = totalAmount > 0 ? (stat.total_amount / totalAmount) * 100 : 0;
//     });

//     return Object.values(paymentStatsMap).sort((a, b) => b.total_amount - a.total_amount);

//   } catch (error) {
//     console.error('Erreur getPaymentMethodsStats:', error);
//     return [];
//   }
// }

// /**
//  * Récupère les statistiques des produits vendus
//  */
// export async function getProductsStats(): Promise<ProductStats[]> {
//   try {
//     const { data: items, error } = await supabase
//       .from('sale_items')
//       .select('product_id, product_name, sku, quantity, unit_price, total')
//       .order('quantity', { ascending: false });

//     if (error) {
//       console.error('Erreur récupération stats produits:', error);
//       return [];
//     }

//     const productStatsMap: Record<string, ProductStats> = {};

//     items?.forEach(item => {
//       const productId = item.product_id || 'unknown';
      
//       if (!productStatsMap[productId]) {
//         productStatsMap[productId] = {
//           product_id: productId,
//           product_name: item.product_name || 'Produit inconnu',
//           sku: item.sku || 'N/A',
//           total_sold: 0,
//           total_revenue: 0,
//           average_price: 0
//         };
//       }
      
//       productStatsMap[productId].total_sold += item.quantity || 0;
//       productStatsMap[productId].total_revenue += item.total || 0;
//     });

//     // Calculer le prix moyen
//     Object.values(productStatsMap).forEach(stat => {
//       stat.average_price = stat.total_sold > 0 ? stat.total_revenue / stat.total_sold : 0;
//     });

//     return Object.values(productStatsMap).sort((a, b) => b.total_sold - a.total_sold);

//   } catch (error) {
//     console.error('Erreur getProductsStats:', error);
//     return [];
//   }
// }

// /**
//  * Récupère les statistiques par catégorie de produits
//  */
// export async function getCategoriesStats(): Promise<CategoryStats[]> {
//   try {
//     const { data: products, error } = await supabase
//       .from('products')
//       .select('category, quantity, price')
//       .order('category');

//     if (error) {
//       console.error('Erreur récupération stats catégories:', error);
//       return [];
//     }

//     const categoryStatsMap: Record<string, CategoryStats> = {};

//     products?.forEach(product => {
//       const category = product.category || 'Non catégorisé';
      
//       if (!categoryStatsMap[category]) {
//         categoryStatsMap[category] = {
//           category: category,
//           product_count: 0,
//           total_stock: 0,
//           total_value: 0,
//           average_price: 0
//         };
//       }
      
//       categoryStatsMap[category].product_count++;
//       categoryStatsMap[category].total_stock += product.quantity || 0;
//       categoryStatsMap[category].total_value += (product.quantity || 0) * (product.price || 0);
//     });

//     // Calculer le prix moyen par catégorie
//     Object.values(categoryStatsMap).forEach(stat => {
//       stat.average_price = stat.total_stock > 0 ? stat.total_value / stat.total_stock : 0;
//     });

//     return Object.values(categoryStatsMap).sort((a, b) => b.total_value - a.total_value);

//   } catch (error) {
//     console.error('Erreur getCategoriesStats:', error);
//     return [];
//   }
// }

// /**
//  * Récupère les statistiques des clients
//  */
// export async function getCustomersStats(limit: number = 20): Promise<CustomerStats[]> {
//   try {
//     const { data: sales, error } = await supabase
//       .from('sales')
//       .select('customer_name, total_amount, sale_date')
//       .eq('status', 'completed')
//       .not('customer_name', 'is', null)
//       .order('sale_date', { ascending: false });

//     if (error) {
//       console.error('Erreur récupération stats clients:', error);
//       return [];
//     }

//     const customerStatsMap: Record<string, CustomerStats> = {};

//     sales?.forEach(sale => {
//       const customerName = sale.customer_name!;
      
//       if (!customerStatsMap[customerName]) {
//         customerStatsMap[customerName] = {
//           customer_name: customerName,
//           purchase_count: 0,
//           total_spent: 0,
//           last_purchase: sale.sale_date,
//           average_ticket: 0
//         };
//       }
      
//       customerStatsMap[customerName].purchase_count++;
//       customerStatsMap[customerName].total_spent += sale.total_amount || 0;
      
//       // Mettre à jour la dernière date d'achat si plus récente
//       if (new Date(sale.sale_date) > new Date(customerStatsMap[customerName].last_purchase)) {
//         customerStatsMap[customerName].last_purchase = sale.sale_date;
//       }
//     });

//     // Calculer le ticket moyen par client
//     Object.values(customerStatsMap).forEach(stat => {
//       stat.average_ticket = stat.purchase_count > 0 ? stat.total_spent / stat.purchase_count : 0;
//     });

//     return Object.values(customerStatsMap)
//       .sort((a, b) => b.total_spent - a.total_spent)
//       .slice(0, limit);

//   } catch (error) {
//     console.error('Erreur getCustomersStats:', error);
//     return [];
//   }
// }

// /**
//  * Récupère les produits à faible stock
//  */
// export async function getLowStockProducts(threshold: number = 10): Promise<any[]> {
//   try {
//     const { data: products, error } = await supabase
//       .from('products')
//       .select('*')
//       .lt('quantity', threshold)
//       .gt('quantity', 0) // Exclure les produits en rupture
//       .order('quantity', { ascending: true });

//     if (error) {
//       console.error('Erreur récupération produits faible stock:', error);
//       return [];
//     }

//     return products || [];

//   } catch (error) {
//     console.error('Erreur getLowStockProducts:', error);
//     return [];
//   }
// }

// /**
//  * Récupère les produits en rupture de stock
//  */
// export async function getOutOfStockProducts(): Promise<any[]> {
//   try {
//     const { data: products, error } = await supabase
//       .from('products')
//       .select('*')
//       .eq('quantity', 0);

//     if (error) {
//       console.error('Erreur récupération produits rupture stock:', error);
//       return [];
//     }

//     return products || [];

//   } catch (error) {
//     console.error('Erreur getOutOfStockProducts:', error);
//     return [];
//   }
// }

// /**
//  * Récupère les statistiques de performances globales
//  */
// export async function getPerformanceStats(startDate?: string, endDate?: string): Promise<PerformanceStats> {
//   try {
//     let query = supabase
//       .from('sales')
//       .select('*')
//       .eq('status', 'completed');

//     if (startDate && endDate) {
//       query = query
//         .gte('sale_date', startDate)
//         .lte('sale_date', endDate);
//     }

//     const { data: sales, error } = await query;

//     if (error) {
//       console.error('Erreur récupération stats performances:', error);
//       return getDefaultPerformanceStats();
//     }

//     if (!sales || sales.length === 0) {
//       return getDefaultPerformanceStats();
//     }

//     // Calculer les statistiques
//     const totalSales = sales.length;
//     const totalRevenue = sales.reduce((sum, sale) => sum + (sale.total_amount || 0), 0);
//     const totalDiscounts = sales.reduce((sum, sale) => sum + (sale.discount_amount || 0), 0);
//     const averageTicket = totalSales > 0 ? totalRevenue / totalSales : 0;

//     // Trouver le meilleur jour
//     const dailyRevenue: Record<string, number> = {};
//     sales.forEach(sale => {
//       const date = new Date(sale.sale_date).toISOString().split('T')[0];
//       dailyRevenue[date] = (dailyRevenue[date] || 0) + (sale.total_amount || 0);
//     });

//     let bestDay = '';
//     let bestDayRevenue = 0;
//     Object.entries(dailyRevenue).forEach(([date, revenue]) => {
//       if (revenue > bestDayRevenue) {
//         bestDayRevenue = revenue;
//         bestDay = date;
//       }
//     });

//     // Clients uniques
//     const uniqueCustomers = new Set(sales.map(sale => sale.customer_name).filter(Boolean)).size;

//     // Utilisation des promotions
//     const promotionSales = sales.filter(sale => sale.promotion_code && sale.promotion_code.trim() !== '');
//     const promotionUsage = totalSales > 0 ? (promotionSales.length / totalSales) * 100 : 0;

//     return {
//       total_sales: totalSales,
//       total_revenue: totalRevenue,
//       total_discounts: totalDiscounts,
//       average_ticket: parseFloat(averageTicket.toFixed(2)),
//       best_day: bestDay,
//       best_day_revenue: parseFloat(bestDayRevenue.toFixed(2)),
//       unique_customers: uniqueCustomers,
//       promotion_usage: parseFloat(promotionUsage.toFixed(1))
//     };

//   } catch (error) {
//     console.error('Erreur getPerformanceStats:', error);
//     return getDefaultPerformanceStats();
//   }
// }

// /**
//  * Statistiques de performance par défaut
//  */
// function getDefaultPerformanceStats(): PerformanceStats {
//   return {
//     total_sales: 0,
//     total_revenue: 0,
//     total_discounts: 0,
//     average_ticket: 0,
//     best_day: '',
//     best_day_revenue: 0,
//     unique_customers: 0,
//     promotion_usage: 0
//   };
// }

// /**
//  * Récupère les statistiques de ventes par heure de la journée
//  */
// export async function getSalesByHour(): Promise<{ hour: number; count: number; revenue: number }[]> {
//   try {
//     const { data: sales, error } = await supabase
//       .from('sales')
//       .select('sale_date, total_amount')
//       .eq('status', 'completed')
//       .gte('sale_date', new Date(new Date().setDate(new Date().getDate() - 30)).toISOString());

//     if (error) {
//       console.error('Erreur récupération ventes par heure:', error);
//       return [];
//     }

//     const hoursMap: Record<number, { count: number; revenue: number }> = {};
    
//     // Initialiser toutes les heures
//     for (let hour = 0; hour < 24; hour++) {
//       hoursMap[hour] = { count: 0, revenue: 0 };
//     }

//     // Agréger par heure
//     sales?.forEach(sale => {
//       const hour = new Date(sale.sale_date).getHours();
//       hoursMap[hour].count++;
//       hoursMap[hour].revenue += sale.total_amount || 0;
//     });

//     // Convertir en tableau et formater
//     return Object.entries(hoursMap).map(([hour, stats]) => ({
//       hour: parseInt(hour),
//       count: stats.count,
//       revenue: parseFloat(stats.revenue.toFixed(2))
//     })).sort((a, b) => a.hour - b.hour);

//   } catch (error) {
//     console.error('Erreur getSalesByHour:', error);
//     return [];
//   }
// }

// /**
//  * Récupère les statistiques de croissance des ventes
//  */
// export async function getSalesGrowth(): Promise<{ 
//   current_period: { sales: number; revenue: number };
//   previous_period: { sales: number; revenue: number };
//   growth_percentage: { sales: number; revenue: number };
// }> {
//   try {
//     const now = new Date();
//     const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
//     const currentMonthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
//     const previousMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
//     const previousMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

//     // Ventes du mois courant
//     const { data: currentSales, error: currentError } = await supabase
//       .from('sales')
//       .select('total_amount')
//       .eq('status', 'completed')
//       .gte('sale_date', currentMonthStart.toISOString())
//       .lte('sale_date', currentMonthEnd.toISOString());

//     if (currentError) {
//       console.error('Erreur récupération ventes courantes:', currentError);
//       return getDefaultSalesGrowth();
//     }

//     // Ventes du mois précédent
//     const { data: previousSales, error: previousError } = await supabase
//       .from('sales')
//       .select('total_amount')
//       .eq('status', 'completed')
//       .gte('sale_date', previousMonthStart.toISOString())
//       .lte('sale_date', previousMonthEnd.toISOString());

//     if (previousError) {
//       console.error('Erreur récupération ventes précédentes:', previousError);
//       return getDefaultSalesGrowth();
//     }

//     const currentPeriod = {
//       sales: currentSales?.length || 0,
//       revenue: currentSales?.reduce((sum, sale) => sum + (sale.total_amount || 0), 0) || 0
//     };

//     const previousPeriod = {
//       sales: previousSales?.length || 0,
//       revenue: previousSales?.reduce((sum, sale) => sum + (sale.total_amount || 0), 0) || 0
//     };

//     const growthPercentage = {
//       sales: previousPeriod.sales > 0 ? 
//         ((currentPeriod.sales - previousPeriod.sales) / previousPeriod.sales) * 100 : 
//         currentPeriod.sales > 0 ? 100 : 0,
//       revenue: previousPeriod.revenue > 0 ? 
//         ((currentPeriod.revenue - previousPeriod.revenue) / previousPeriod.revenue) * 100 : 
//         currentPeriod.revenue > 0 ? 100 : 0
//     };

//     return {
//       current_period: {
//         sales: currentPeriod.sales,
//         revenue: parseFloat(currentPeriod.revenue.toFixed(2))
//       },
//       previous_period: {
//         sales: previousPeriod.sales,
//         revenue: parseFloat(previousPeriod.revenue.toFixed(2))
//       },
//       growth_percentage: {
//         sales: parseFloat(growthPercentage.sales.toFixed(1)),
//         revenue: parseFloat(growthPercentage.revenue.toFixed(1))
//       }
//     };

//   } catch (error) {
//     console.error('Erreur getSalesGrowth:', error);
//     return getDefaultSalesGrowth();
//   }
// }

// /**
//  * Croissance des ventes par défaut
//  */
// function getDefaultSalesGrowth() {
//   return {
//     current_period: { sales: 0, revenue: 0 },
//     previous_period: { sales: 0, revenue: 0 },
//     growth_percentage: { sales: 0, revenue: 0 }
//   };
// }

// /**
//  * Exporte les statistiques en CSV
//  */
// export async function exportStatsToCSV(type: 'sales' | 'products' | 'customers'): Promise<string> {
//   try {
//     let headers: string[] = [];
//     let rows: any[] = [];

//     switch (type) {
//       case 'sales':
//         headers = ['Date', 'Nombre de ventes', 'Revenus', 'Remises', 'Clients uniques', 'Ticket moyen'];
//         const dailyStats = await getDailySales(30);
//         rows = dailyStats.map(stat => [
//           stat.date,
//           stat.sales_count,
//           stat.total_revenue.toFixed(2),
//           stat.discount_amount.toFixed(2),
//           stat.unique_customers,
//           stat.avg_ticket.toFixed(2)
//         ]);
//         break;

//       case 'products':
//         headers = ['Produit', 'SKU', 'Quantité vendue', 'Revenus', 'Prix moyen'];
//         const productStats = await getProductsStats();
//         rows = productStats.slice(0, 50).map(stat => [
//           stat.product_name,
//           stat.sku,
//           stat.total_sold,
//           stat.total_revenue.toFixed(2),
//           stat.average_price.toFixed(2)
//         ]);
//         break;

//       case 'customers':
//         headers = ['Client', 'Nombre d\'achats', 'Total dépensé', 'Dernier achat', 'Ticket moyen'];
//         const customerStats = await getCustomersStats(50);
//         rows = customerStats.map(stat => [
//           stat.customer_name,
//           stat.purchase_count,
//           stat.total_spent.toFixed(2),
//           new Date(stat.last_purchase).toLocaleDateString('fr-FR'),
//           stat.average_ticket.toFixed(2)
//         ]);
//         break;
//     }

//     const csvContent = [
//       headers.join(';'),
//       ...rows.map(row => row.join(';'))
//     ].join('\n');

//     return csvContent;

//   } catch (error) {
//     console.error('Erreur export CSV:', error);
//     return '';
//   }
// }

// /**
//  * Récupère les statistiques résumées pour le dashboard
//  */
// export async function getDashboardStats(): Promise<{
//   today_sales: number;
//   today_revenue: number;
//   monthly_sales: number;
//   monthly_revenue: number;
//   low_stock_products: number;
//   out_of_stock_products: number;
//   top_selling_product: { name: string; quantity: number } | null;
// }> {
//   try {
//     const today = new Date();
//     const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
//     const todayEnd = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);
//     const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);

//     // Ventes du jour
//     const { data: todaySales, error: todayError } = await supabase
//       .from('sales')
//       .select('total_amount')
//       .eq('status', 'completed')
//       .gte('sale_date', todayStart.toISOString())
//       .lte('sale_date', todayEnd.toISOString());

//     // Ventes du mois
//     const { data: monthlySales, error: monthlyError } = await supabase
//       .from('sales')
//       .select('total_amount')
//       .eq('status', 'completed')
//       .gte('sale_date', monthStart.toISOString())
//       .lte('sale_date', todayEnd.toISOString());

//     // Produits à faible stock
//     const lowStockProducts = await getLowStockProducts(5);
//     const outOfStockProducts = await getOutOfStockProducts();

//     // Produit le plus vendu
//     const productStats = await getProductsStats();
//     const topSellingProduct = productStats.length > 0 ? {
//       name: productStats[0].product_name,
//       quantity: productStats[0].total_sold
//     } : null;

//     return {
//       today_sales: todaySales?.length || 0,
//       today_revenue: todaySales?.reduce((sum, sale) => sum + (sale.total_amount || 0), 0) || 0,
//       monthly_sales: monthlySales?.length || 0,
//       monthly_revenue: monthlySales?.reduce((sum, sale) => sum + (sale.total_amount || 0), 0) || 0,
//       low_stock_products: lowStockProducts.length,
//       out_of_stock_products: outOfStockProducts.length,
//       top_selling_product: topSellingProduct
//     };

//   } catch (error) {
//     console.error('Erreur getDashboardStats:', error);
//     return {
//       today_sales: 0,
//       today_revenue: 0,
//       monthly_sales: 0,
//       monthly_revenue: 0,
//       low_stock_products: 0,
//       out_of_stock_products: 0,
//       top_selling_product: null
//     };
//   }
// }
import { supabase } from './supabase';

// Types importés de sales.ts
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

export interface SaleFilters {
  startDate?: string;
  endDate?: string;
  status?: string;
  payment_method?: string;
  customer_name?: string;
  search?: string;
}

// Types spécifiques aux stats
export interface DailySales {
  date: string;
  sales_count: number;
  total_revenue: number;
  discount_amount: number;
  unique_customers: number;
  avg_ticket: number;
  [key: string]: any;
}

export interface MonthlySales {
  month: string;
  month_number: number;
  total_revenue: number;
  sales_count: number;
}

export interface PaymentMethodStats {
  payment_method: string;
  count: number;
  total_amount: number;
  percentage: number;
}

export interface ProductStats {
  product_id: string;
  product_name: string;
  sku: string;
  total_sold: number;
  total_revenue: number;
  average_price: number;
}

export interface CategoryStats {
  category: string;
  product_count: number;
  total_stock: number;
  total_value: number;
  average_price: number;
}

export interface CustomerStats {
  customer_name: string;
  purchase_count: number;
  total_spent: number;
  last_purchase: string;
  average_ticket: number;
}

export interface PerformanceStats {
  total_sales: number;
  total_revenue: number;
  total_discounts: number;
  average_ticket: number;
  best_day: string;
  best_day_revenue: number;
  unique_customers: number;
  promotion_usage: number;
}

// Fonctions importées de sales.ts
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

export async function getTopCustomers(limit: number = 10): Promise<Array<{
  customer_name: string;
  total_spent: number;
  purchase_count: number;
  last_purchase?: string;
}>> {
  const { data: sales, error } = await supabase
    .from('sales')
    .select('customer_name, total_amount, sale_date')
    .eq('status', 'completed')
    .not('customer_name', 'is', null)
    .order('sale_date', { ascending: false });

  if (error) {
    console.error('Erreur lors de la récupération des clients:', error);
    return [];
  }

  const customerMap = new Map<string, { 
    total_spent: number; 
    purchase_count: number;
    last_purchase: string;
  }>();

  sales?.forEach(sale => {
    if (sale.customer_name) {
      const existing = customerMap.get(sale.customer_name) || { 
        total_spent: 0, 
        purchase_count: 0,
        last_purchase: sale.sale_date
      };
      customerMap.set(sale.customer_name, {
        total_spent: existing.total_spent + (sale.total_amount || 0),
        purchase_count: existing.purchase_count + 1,
        last_purchase: new Date(sale.sale_date) > new Date(existing.last_purchase) 
          ? sale.sale_date 
          : existing.last_purchase
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

// Fonctions spécifiques aux statistiques
export async function getDailySales(days: number = 30): Promise<DailySales[]> {
  try {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    const { data, error } = await supabase
      .from('sales')
      .select('*')
      .gte('sale_date', startDate.toISOString())
      .eq('status', 'completed')
      .order('sale_date', { ascending: true });

    if (error) {
      console.error('Erreur récupération ventes quotidiennes:', error);
      return [];
    }

    const dailySalesMap: Record<string, DailySales & { unique_customers_set?: Set<string> }> = {};
    
    data?.forEach(sale => {
      const date = new Date(sale.sale_date);
      const dateStr = date.toISOString().split('T')[0];
      const formattedDate = date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
      
      if (!dailySalesMap[dateStr]) {
        dailySalesMap[dateStr] = {
          date: formattedDate,
          sales_count: 0,
          total_revenue: 0,
          discount_amount: 0,
          unique_customers: 0,
          avg_ticket: 0,
          unique_customers_set: new Set<string>()
        };
      }
      
      dailySalesMap[dateStr].sales_count++;
      dailySalesMap[dateStr].total_revenue += sale.total_amount || 0;
      dailySalesMap[dateStr].discount_amount += sale.discount_amount || 0;
      
      if (sale.customer_name) {
        dailySalesMap[dateStr].unique_customers_set!.add(sale.customer_name);
        dailySalesMap[dateStr].unique_customers = dailySalesMap[dateStr].unique_customers_set!.size;
      }
    });

    const dailySales = Object.values(dailySalesMap).map(day => {
      const dayData = { ...day };
      dayData.avg_ticket = dayData.sales_count > 0 ? dayData.total_revenue / dayData.sales_count : 0;
      delete dayData.unique_customers_set;
      return dayData;
    });

    return dailySales.sort((a, b) => {
      const dateA = new Date(a.date.split(' ')[0] + ' ' + new Date().getFullYear());
      const dateB = new Date(b.date.split(' ')[0] + ' ' + new Date().getFullYear());
      return dateA.getTime() - dateB.getTime();
    });

  } catch (error) {
    console.error('Erreur getDailySales:', error);
    return [];
  }
}

export async function getMonthlySales(year: number = new Date().getFullYear()): Promise<MonthlySales[]> {
  try {
    const { data, error } = await supabase
      .from('sales')
      .select('sale_date, total_amount')
      .eq('status', 'completed')
      .gte('sale_date', `${year}-01-01`)
      .lte('sale_date', `${year}-12-31`);

    if (error) {
      console.error('Erreur récupération ventes mensuelles:', error);
      return [];
    }

    const monthlySalesMap: Record<number, MonthlySales> = {};
    const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];

    for (let i = 1; i <= 12; i++) {
      monthlySalesMap[i] = {
        month: months[i - 1],
        month_number: i,
        total_revenue: 0,
        sales_count: 0
      };
    }

    data?.forEach(sale => {
      const month = new Date(sale.sale_date).getMonth() + 1;
      monthlySalesMap[month].sales_count++;
      monthlySalesMap[month].total_revenue += sale.total_amount || 0;
    });

    return Object.values(monthlySalesMap);

  } catch (error) {
    console.error('Erreur getMonthlySales:', error);
    return [];
  }
}

export async function getPaymentMethodsStats(): Promise<PaymentMethodStats[]> {
  try {
    const { data, error } = await supabase
      .from('sales')
      .select('payment_method, total_amount')
      .eq('status', 'completed');

    if (error) {
      console.error('Erreur récupération stats paiement:', error);
      return [];
    }

    const paymentStatsMap: Record<string, PaymentMethodStats> = {};
    let totalAmount = 0;

    data?.forEach(sale => {
      const method = sale.payment_method || 'unknown';
      
      if (!paymentStatsMap[method]) {
        paymentStatsMap[method] = {
          payment_method: method,
          count: 0,
          total_amount: 0,
          percentage: 0
        };
      }
      
      paymentStatsMap[method].count++;
      paymentStatsMap[method].total_amount += sale.total_amount || 0;
      totalAmount += sale.total_amount || 0;
    });

    Object.values(paymentStatsMap).forEach(stat => {
      stat.percentage = totalAmount > 0 ? (stat.total_amount / totalAmount) * 100 : 0;
    });

    return Object.values(paymentStatsMap).sort((a, b) => b.total_amount - a.total_amount);

  } catch (error) {
    console.error('Erreur getPaymentMethodsStats:', error);
    return [];
  }
}

export async function getProductsStats(): Promise<ProductStats[]> {
  try {
    const { data: items, error } = await supabase
      .from('sale_items')
      .select('product_id, product_name, sku, quantity, unit_price, total')
      .order('quantity', { ascending: false });

    if (error) {
      console.error('Erreur récupération stats produits:', error);
      return [];
    }

    const productStatsMap: Record<string, ProductStats> = {};

    items?.forEach(item => {
      const productId = item.product_id || 'unknown';
      
      if (!productStatsMap[productId]) {
        productStatsMap[productId] = {
          product_id: productId,
          product_name: item.product_name || 'Produit inconnu',
          sku: item.sku || 'N/A',
          total_sold: 0,
          total_revenue: 0,
          average_price: 0
        };
      }
      
      productStatsMap[productId].total_sold += item.quantity || 0;
      productStatsMap[productId].total_revenue += item.total || 0;
    });

    Object.values(productStatsMap).forEach(stat => {
      stat.average_price = stat.total_sold > 0 ? stat.total_revenue / stat.total_sold : 0;
    });

    return Object.values(productStatsMap).sort((a, b) => b.total_sold - a.total_sold);

  } catch (error) {
    console.error('Erreur getProductsStats:', error);
    return [];
  }
}

export async function getCategoriesStats(): Promise<CategoryStats[]> {
  try {
    const { data: products, error } = await supabase
      .from('products')
      .select('category, quantity, price')
      .order('category');

    if (error) {
      console.error('Erreur récupération stats catégories:', error);
      return [];
    }

    const categoryStatsMap: Record<string, CategoryStats> = {};

    products?.forEach(product => {
      const category = product.category || 'Non catégorisé';
      
      if (!categoryStatsMap[category]) {
        categoryStatsMap[category] = {
          category: category,
          product_count: 0,
          total_stock: 0,
          total_value: 0,
          average_price: 0
        };
      }
      
      categoryStatsMap[category].product_count++;
      categoryStatsMap[category].total_stock += product.quantity || 0;
      categoryStatsMap[category].total_value += (product.quantity || 0) * (product.price || 0);
    });

    Object.values(categoryStatsMap).forEach(stat => {
      stat.average_price = stat.total_stock > 0 ? stat.total_value / stat.total_stock : 0;
    });

    return Object.values(categoryStatsMap).sort((a, b) => b.total_value - a.total_value);

  } catch (error) {
    console.error('Erreur getCategoriesStats:', error);
    return [];
  }
}

export async function getPerformanceStats(startDate?: string, endDate?: string): Promise<PerformanceStats> {
  try {
    let query = supabase
      .from('sales')
      .select('*')
      .eq('status', 'completed');

    if (startDate && endDate) {
      query = query
        .gte('sale_date', startDate)
        .lte('sale_date', endDate);
    }

    const { data: sales, error } = await query;

    if (error) {
      console.error('Erreur récupération stats performances:', error);
      return getDefaultPerformanceStats();
    }

    if (!sales || sales.length === 0) {
      return getDefaultPerformanceStats();
    }

    const totalSales = sales.length;
    const totalRevenue = sales.reduce((sum, sale) => sum + (sale.total_amount || 0), 0);
    const totalDiscounts = sales.reduce((sum, sale) => sum + (sale.discount_amount || 0), 0);
    const averageTicket = totalSales > 0 ? totalRevenue / totalSales : 0;

    const dailyRevenue: Record<string, number> = {};
    sales.forEach(sale => {
      const date = new Date(sale.sale_date).toISOString().split('T')[0];
      dailyRevenue[date] = (dailyRevenue[date] || 0) + (sale.total_amount || 0);
    });

    let bestDay = '';
    let bestDayRevenue = 0;
    Object.entries(dailyRevenue).forEach(([date, revenue]) => {
      if (revenue > bestDayRevenue) {
        bestDayRevenue = revenue;
        bestDay = date;
      }
    });

    const uniqueCustomers = new Set(sales.map(sale => sale.customer_name).filter(Boolean)).size;
    const promotionSales = sales.filter(sale => sale.promotion_code && sale.promotion_code.trim() !== '');
    const promotionUsage = totalSales > 0 ? (promotionSales.length / totalSales) * 100 : 0;

    return {
      total_sales: totalSales,
      total_revenue: parseFloat(totalRevenue.toFixed(2)),
      total_discounts: parseFloat(totalDiscounts.toFixed(2)),
      average_ticket: parseFloat(averageTicket.toFixed(2)),
      best_day: bestDay,
      best_day_revenue: parseFloat(bestDayRevenue.toFixed(2)),
      unique_customers: uniqueCustomers,
      promotion_usage: parseFloat(promotionUsage.toFixed(1))
    };

  } catch (error) {
    console.error('Erreur getPerformanceStats:', error);
    return getDefaultPerformanceStats();
  }
}

function getDefaultPerformanceStats(): PerformanceStats {
  return {
    total_sales: 0,
    total_revenue: 0,
    total_discounts: 0,
    average_ticket: 0,
    best_day: '',
    best_day_revenue: 0,
    unique_customers: 0,
    promotion_usage: 0
  };
}

export async function getLowStockProducts(threshold: number = 10): Promise<any[]> {
  try {
    const { data: products, error } = await supabase
      .from('products')
      .select('*')
      .lt('quantity', threshold)
      .gt('quantity', 0)
      .order('quantity', { ascending: true });

    if (error) {
      console.error('Erreur récupération produits faible stock:', error);
      return [];
    }

    return products || [];

  } catch (error) {
    console.error('Erreur getLowStockProducts:', error);
    return [];
  }
}

export async function getOutOfStockProducts(): Promise<any[]> {
  try {
    const { data: products, error } = await supabase
      .from('products')
      .select('*')
      .eq('quantity', 0);

    if (error) {
      console.error('Erreur récupération produits rupture stock:', error);
      return [];
    }

    return products || [];

  } catch (error) {
    console.error('Erreur getOutOfStockProducts:', error);
    return [];
  }
}

export async function getSalesGrowth(): Promise<{ 
  current_period: { sales: number; revenue: number };
  previous_period: { sales: number; revenue: number };
  growth_percentage: { sales: number; revenue: number };
}> {
  try {
    const now = new Date();
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const currentMonthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    const previousMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const previousMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

    const { data: currentSales, error: currentError } = await supabase
      .from('sales')
      .select('total_amount')
      .eq('status', 'completed')
      .gte('sale_date', currentMonthStart.toISOString())
      .lte('sale_date', currentMonthEnd.toISOString());

    if (currentError) {
      console.error('Erreur récupération ventes courantes:', currentError);
      return getDefaultSalesGrowth();
    }

    const { data: previousSales, error: previousError } = await supabase
      .from('sales')
      .select('total_amount')
      .eq('status', 'completed')
      .gte('sale_date', previousMonthStart.toISOString())
      .lte('sale_date', previousMonthEnd.toISOString());

    if (previousError) {
      console.error('Erreur récupération ventes précédentes:', previousError);
      return getDefaultSalesGrowth();
    }

    const currentPeriod = {
      sales: currentSales?.length || 0,
      revenue: currentSales?.reduce((sum, sale) => sum + (sale.total_amount || 0), 0) || 0
    };

    const previousPeriod = {
      sales: previousSales?.length || 0,
      revenue: previousSales?.reduce((sum, sale) => sum + (sale.total_amount || 0), 0) || 0
    };

    const growthPercentage = {
      sales: previousPeriod.sales > 0 ? 
        ((currentPeriod.sales - previousPeriod.sales) / previousPeriod.sales) * 100 : 
        currentPeriod.sales > 0 ? 100 : 0,
      revenue: previousPeriod.revenue > 0 ? 
        ((currentPeriod.revenue - previousPeriod.revenue) / previousPeriod.revenue) * 100 : 
        currentPeriod.revenue > 0 ? 100 : 0
    };

    return {
      current_period: {
        sales: currentPeriod.sales,
        revenue: parseFloat(currentPeriod.revenue.toFixed(2))
      },
      previous_period: {
        sales: previousPeriod.sales,
        revenue: parseFloat(previousPeriod.revenue.toFixed(2))
      },
      growth_percentage: {
        sales: parseFloat(growthPercentage.sales.toFixed(1)),
        revenue: parseFloat(growthPercentage.revenue.toFixed(1))
      }
    };

  } catch (error) {
    console.error('Erreur getSalesGrowth:', error);
    return getDefaultSalesGrowth();
  }
}

function getDefaultSalesGrowth() {
  return {
    current_period: { sales: 0, revenue: 0 },
    previous_period: { sales: 0, revenue: 0 },
    growth_percentage: { sales: 0, revenue: 0 }
  };
}

export async function getDashboardStats(): Promise<{
  today_sales: number;
  today_revenue: number;
  monthly_sales: number;
  monthly_revenue: number;
  low_stock_products: number;
  out_of_stock_products: number;
  top_selling_product: { name: string; quantity: number } | null;
}> {
  try {
    const today = new Date();
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const todayEnd = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);

    const { data: todaySales, error: todayError } = await supabase
      .from('sales')
      .select('total_amount')
      .eq('status', 'completed')
      .gte('sale_date', todayStart.toISOString())
      .lte('sale_date', todayEnd.toISOString());

    const { data: monthlySales, error: monthlyError } = await supabase
      .from('sales')
      .select('total_amount')
      .eq('status', 'completed')
      .gte('sale_date', monthStart.toISOString())
      .lte('sale_date', todayEnd.toISOString());

    const lowStockProducts = await getLowStockProducts(5);
    const outOfStockProducts = await getOutOfStockProducts();

    const productStats = await getProductsStats();
    const topSellingProduct = productStats.length > 0 ? {
      name: productStats[0].product_name,
      quantity: productStats[0].total_sold
    } : null;

    return {
      today_sales: todaySales?.length || 0,
      today_revenue: todaySales?.reduce((sum, sale) => sum + (sale.total_amount || 0), 0) || 0,
      monthly_sales: monthlySales?.length || 0,
      monthly_revenue: monthlySales?.reduce((sum, sale) => sum + (sale.total_amount || 0), 0) || 0,
      low_stock_products: lowStockProducts.length,
      out_of_stock_products: outOfStockProducts.length,
      top_selling_product: topSellingProduct
    };

  } catch (error) {
    console.error('Erreur getDashboardStats:', error);
    return {
      today_sales: 0,
      today_revenue: 0,
      monthly_sales: 0,
      monthly_revenue: 0,
      low_stock_products: 0,
      out_of_stock_products: 0,
      top_selling_product: null
    };
  }
}

export async function getAllSalesForStats(filters?: SaleFilters): Promise<Sale[]> {
  try {
    // Récupérer toutes les ventes sans pagination pour les stats
    let query = supabase
      .from('sales')
      .select('*')
      .eq('status', 'completed');

    if (filters) {
      if (filters.startDate && filters.endDate) {
        query = query
          .gte('sale_date', filters.startDate)
          .lte('sale_date', filters.endDate);
      }

      if (filters.payment_method) {
        query = query.eq('payment_method', filters.payment_method);
      }

      if (filters.customer_name) {
        query = query.ilike('customer_name', `%${filters.customer_name}%`);
      }
    }

    const { data: sales, error } = await query
      .order('sale_date', { ascending: false });

    if (error) {
      console.error('Erreur récupération ventes pour stats:', error);
      return [];
    }

    return sales || [];

  } catch (error) {
    console.error('Erreur getAllSalesForStats:', error);
    return [];
  }
}