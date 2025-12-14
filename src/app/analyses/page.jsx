// // app/analytics/page.jsx
// 'use client';

// import React, { useState, useEffect, useCallback } from 'react';
// import { 
//   BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
//   XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
//   AreaChart, Area
// } from 'recharts';
// import { 
//   TrendingUp, Package, ShoppingCart, DollarSign, 
//   BarChart2, Calendar, Download, RefreshCw,
//   CreditCard, Wallet, AlertCircle, Layers, Users, Star, TrendingDown,
//   Percent, Target, ShoppingBag, Clock, Activity, ChevronRight,
//   Tag, ArrowDownRight, FileText, CheckCircle, XCircle, BarChart3,
//   ArrowUpRight, ArrowDownLeft, ActivitySquare, Store,
//   Search, Filter, X
// } from 'lucide-react';
// import { supabase } from '@/lib/supabase';

// // Composant Notification interne
// function Notification({ type, message, onClose }) {
//   const icons = {
//     success: CheckCircle,
//     error: AlertCircle,
//     info: FileText
//   };

//   const colors = {
//     success: 'bg-green-50 border-green-200 text-green-800',
//     error: 'bg-red-50 border-red-200 text-red-800',
//     info: 'bg-blue-50 border-blue-200 text-blue-800'
//   };

//   const Icon = icons[type];

//   return (
//     <div className="fixed top-4 right-4 z-50 animate-fade-in">
//       <div className={`flex items-center p-4 rounded-lg border shadow-lg ${colors[type]}`}>
//         <Icon className="w-5 h-5 mr-3" />
//         <span className="flex-1 font-medium">{message}</span>
//         <button
//           onClick={onClose}
//           className="ml-4 text-gray-400 hover:text-gray-600"
//         >
//           <X className="w-5 h-5" />
//         </button>
//       </div>
//     </div>
//   );
// }

// // Composant CustomTooltip pour les graphiques
// const CustomTooltip = ({ active, payload, label }) => {
//   if (active && payload && payload.length) {
//     const formatCurrency = (amount) => {
//       if (amount === undefined || amount === null) return '0,00 €';
//       return new Intl.NumberFormat('fr-FR', {
//         style: 'currency',
//         currency: 'EUR',
//         minimumFractionDigits: 2
//       }).format(amount);
//     };

//     return (
//       <div className="bg-white p-3 border rounded-lg shadow-lg">
//         <p className="font-semibold text-gray-900 mb-2">{label}</p>
//         {payload.map((entry, index) => (
//           <p key={index} className="text-sm" style={{ color: entry.color }}>
//             {entry.name}: {
//               entry.name.includes('€') || 
//               entry.dataKey === 'revenue' || 
//               entry.dataKey === 'valeur' || 
//               entry.dataKey === 'moyenne' ||
//               entry.dataKey === 'prix' ||
//               entry.dataKey === 'prixMoyen' ||
//               entry.dataKey === 'panierMoyen' ||
//               entry.dataKey === 'subtotal' ||
//               entry.dataKey === 'discount'
//                 ? formatCurrency(entry.value)
//                 : entry.dataKey === 'pourcentage' || 
//                   entry.dataKey === 'croissance' || 
//                   entry.dataKey === 'discount_rate' ||
//                   entry.dataKey === 'percentage'
//                 ? `${entry.value}%`
//                 : entry.value?.toLocaleString() || '0'
//             }
//           </p>
//         ))}
//       </div>
//     );
//   }
//   return null;
// };

// export default function AnalyticsPage() {
//   const [salesData, setSalesData] = useState({
//     allSales: [],
//     dailyStats: [],
//     monthlyStats: [],
//     paymentStats: [],
//     topCustomers: []
//   });
//   const [productsData, setProductsData] = useState({
//     totalProducts: 0,
//     totalStock: 0,
//     totalValue: 0,
//     lowStockProducts: 0,
//     categories: [],
//     topProducts: [],
//     lowStockList: []
//   });
//   const [salesStats, setSalesStats] = useState({
//     totalSales: 0,
//     totalRevenue: 0,
//     subtotalRevenue: 0,
//     totalDiscounts: 0,
//     averageTicket: 0,
//     bestDay: '',
//     bestDayRevenue: 0,
//     customerCount: 0,
//     uniqueCustomers: 0,
//     promotionCount: 0,
//     returnCount: 0,
//     cancelledSales: 0,
//     refundSales: 0,
//     discountRate: 0,
//     salesWithReturns: 0
//   });
//   const [promotionsData, setPromotionsData] = useState({
//     activePromotions: 0,
//     totalDiscountGiven: 0,
//     mostUsedPromotion: null,
//     promotionEffectiveness: 0,
//     promotionSalesCount: 0,
//     averagePromotionDiscount: 0
//   });
//   const [loading, setLoading] = useState(true);
//   const [notification, setNotification] = useState(null);
//   const [activeTab, setActiveTab] = useState('sales');
//   const [timeRange, setTimeRange] = useState('30days');

//   // Charger toutes les statistiques
//   const loadAllStats = useCallback(async () => {
//     setLoading(true);
//     try {
//       await Promise.all([
//         loadSalesStats(),
//         loadSalesData(),
//         loadPaymentStats(),
//         loadDailyStats(),
//         loadMonthlyStats(),
//         loadTopCustomers(),
//         loadProductsData(),
//         loadPromotionStats()
//       ]);
//     } catch (error) {
//       console.error('Erreur chargement stats:', error);
//       showNotification('error', 'Erreur lors du chargement des statistiques');
//     } finally {
//       setLoading(false);
//     }
//   }, [timeRange]);

//   // Charger les statistiques de ventes
//   const loadSalesStats = async () => {
//     try {
//       const now = new Date();
//       let startDate = new Date();

//       switch (timeRange) {
//         case '7days':
//           startDate.setDate(now.getDate() - 7);
//           break;
//         case '30days':
//           startDate.setDate(now.getDate() - 30);
//           break;
//         case '90days':
//           startDate.setDate(now.getDate() - 90);
//           break;
//         case 'year':
//           startDate.setFullYear(now.getFullYear() - 1);
//           break;
//         default:
//           startDate.setDate(now.getDate() - 30);
//       }

//       // Total des ventes
//       const { count: totalSales, error: countError } = await supabase
//         .from('sales')
//         .select('*', { count: 'exact' })
//         .eq('status', 'completed')
//         .gte('sale_date', startDate.toISOString());

//       if (countError) throw countError;

//       // Revenus et remises
//       const { data: sales, error: salesError } = await supabase
//         .from('sales')
//         .select('total_amount, subtotal_amount, discount_amount')
//         .eq('status', 'completed')
//         .gte('sale_date', startDate.toISOString());

//       if (salesError) throw salesError;

//       const totalRevenue = sales.reduce((sum, sale) => sum + (sale.total_amount || 0), 0);
//       const subtotalRevenue = sales.reduce((sum, sale) => sum + (sale.subtotal_amount || sale.total_amount || 0), 0);
//       const totalDiscounts = sales.reduce((sum, sale) => sum + (sale.discount_amount || 0), 0);
//       const averageTicket = totalSales > 0 ? totalRevenue / totalSales : 0;

//       // Clients uniques
//       const { data: customers, error: customersError } = await supabase
//         .from('sales')
//         .select('customer_name')
//         .eq('status', 'completed')
//         .gte('sale_date', startDate.toISOString())
//         .not('customer_name', 'is', null);

//       if (customersError) throw customersError;

//       const uniqueCustomers = new Set(customers.map(c => c.customer_name)).size;

//       setSalesStats({
//         totalSales: totalSales || 0,
//         totalRevenue,
//         subtotalRevenue,
//         totalDiscounts,
//         averageTicket,
//         bestDay: '',
//         bestDayRevenue: 0,
//         customerCount: uniqueCustomers,
//         uniqueCustomers,
//         promotionCount: 0,
//         returnCount: 0,
//         cancelledSales: 0,
//         refundSales: 0,
//         discountRate: subtotalRevenue > 0 ? (totalDiscounts / subtotalRevenue * 100) : 0,
//         salesWithReturns: 0
//       });
//     } catch (error) {
//       console.error('Erreur stats ventes:', error);
//       throw error;
//     }
//   };

//   // Charger les données de ventes
//   const loadSalesData = async () => {
//     try {
//       const now = new Date();
//       let startDate = new Date();

//       switch (timeRange) {
//         case '7days':
//           startDate.setDate(now.getDate() - 7);
//           break;
//         case '30days':
//           startDate.setDate(now.getDate() - 30);
//           break;
//         case '90days':
//           startDate.setDate(now.getDate() - 90);
//           break;
//         case 'year':
//           startDate.setFullYear(now.getFullYear() - 1);
//           break;
//         default:
//           startDate.setDate(now.getDate() - 30);
//       }

//       const { data: sales, error } = await supabase
//         .from('sales')
//         .select('*')
//         .eq('status', 'completed')
//         .gte('sale_date', startDate.toISOString())
//         .order('sale_date', { ascending: false });

//       if (error) throw error;

//       setSalesData(prev => ({
//         ...prev,
//         allSales: sales || []
//       }));
//     } catch (error) {
//       console.error('Erreur données ventes:', error);
//       throw error;
//     }
//   };

//   // Charger les statistiques de paiement
//   const loadPaymentStats = async () => {
//     try {
//       const { data, error } = await supabase
//         .from('sales')
//         .select('payment_method, total_amount')
//         .eq('status', 'completed')
//         .gte('sale_date', getStartDateForPeriod(timeRange));

//       if (error) throw error;

//       const stats = {};
//       data.forEach(sale => {
//         const method = sale.payment_method || 'unknown';
//         if (!stats[method]) {
//           stats[method] = { count: 0, total_amount: 0 };
//         }
//         stats[method].count++;
//         stats[method].total_amount += sale.total_amount || 0;
//       });

//       const paymentStats = Object.entries(stats).map(([payment_method, data]) => ({
//         payment_method,
//         count: data.count,
//         total_amount: data.total_amount
//       }));

//       setSalesData(prev => ({
//         ...prev,
//         paymentStats
//       }));
//     } catch (error) {
//       console.error('Erreur stats paiement:', error);
//       throw error;
//     }
//   };

//   // Charger les statistiques quotidiennes
//   const loadDailyStats = async () => {
//     try {
//       const days = timeRange === '7days' ? 7 : timeRange === '30days' ? 30 : 90;
//       const startDate = new Date();
//       startDate.setDate(startDate.getDate() - days);

//       const { data, error } = await supabase
//         .from('sales')
//         .select('sale_date, total_amount, discount_amount, customer_name')
//         .eq('status', 'completed')
//         .gte('sale_date', startDate.toISOString())
//         .order('sale_date', { ascending: true });

//       if (error) throw error;

//       // Grouper par jour
//       const dailyStats = {};
//       data.forEach(sale => {
//         const date = new Date(sale.sale_date).toISOString().split('T')[0];
//         if (!dailyStats[date]) {
//           dailyStats[date] = {
//             date,
//             sales_count: 0,
//             total_revenue: 0,
//             discount_amount: 0,
//             customers: new Set()
//           };
//         }
//         dailyStats[date].sales_count++;
//         dailyStats[date].total_revenue += sale.total_amount || 0;
//         dailyStats[date].discount_amount += sale.discount_amount || 0;
//         if (sale.customer_name) dailyStats[date].customers.add(sale.customer_name);
//       });

//       const statsArray = Object.values(dailyStats).map(day => ({
//         date: day.date,
//         sales_count: day.sales_count,
//         total_revenue: day.total_revenue,
//         discount_amount: day.discount_amount,
//         unique_customers: day.customers.size,
//         avg_ticket: day.sales_count > 0 ? day.total_revenue / day.sales_count : 0
//       }));

//       setSalesData(prev => ({
//         ...prev,
//         dailyStats: statsArray
//       }));
//     } catch (error) {
//       console.error('Erreur stats quotidiennes:', error);
//       throw error;
//     }
//   };

//   // Charger les statistiques mensuelles
//   const loadMonthlyStats = async () => {
//     try {
//       const currentYear = new Date().getFullYear();
//       const startDate = new Date(currentYear, 0, 1);

//       const { data, error } = await supabase
//         .from('sales')
//         .select('sale_date, total_amount')
//         .eq('status', 'completed')
//         .gte('sale_date', startDate.toISOString());

//       if (error) throw error;

//       const monthlyStats = Array.from({ length: 12 }, (_, i) => ({
//         month: new Date(currentYear, i, 1).toLocaleDateString('fr-FR', { month: 'short' }),
//         month_number: i + 1,
//         total_revenue: 0
//       }));

//       data.forEach(sale => {
//         const month = new Date(sale.sale_date).getMonth();
//         monthlyStats[month].total_revenue += sale.total_amount || 0;
//       });

//       setSalesData(prev => ({
//         ...prev,
//         monthlyStats
//       }));
//     } catch (error) {
//       console.error('Erreur stats mensuelles:', error);
//       throw error;
//     }
//   };

//   // Charger les meilleurs clients
//   const loadTopCustomers = async () => {
//     try {
//       const { data, error } = await supabase
//         .from('customers')
//         .select('*')
//         .order('total_spent', { ascending: false })
//         .limit(10);

//       if (error) throw error;

//       setSalesData(prev => ({
//         ...prev,
//         topCustomers: data || []
//       }));
//     } catch (error) {
//       console.error('Erreur top clients:', error);
//       throw error;
//     }
//   };

//   // Charger les données produits
//   const loadProductsData = async () => {
//     try {
//       const { data: products, error } = await supabase
//         .from('products')
//         .select('*');

//       if (error) throw error;

//       // Calculer les statistiques
//       const totalStock = products.reduce((sum, p) => sum + (p.quantity || 0), 0);
//       const totalValue = products.reduce((sum, p) => sum + ((p.quantity || 0) * (p.price || 0)), 0);
//       const lowStockProducts = products.filter(p => (p.quantity || 0) < 10).length;

//       // Statistiques par catégorie
//       const categoryStats = {};
//       products.forEach(product => {
//         const category = product.category || 'Non catégorisé';
//         if (!categoryStats[category]) {
//           categoryStats[category] = {
//             count: 0,
//             totalValue: 0,
//             totalStock: 0
//           };
//         }
//         categoryStats[category].count++;
//         categoryStats[category].totalValue += (product.quantity || 0) * (product.price || 0);
//         categoryStats[category].totalStock += product.quantity || 0;
//       });

//       const categories = Object.entries(categoryStats).map(([name, stats]) => ({
//         name: name.length > 10 ? name.substring(0, 10) + '...' : name,
//         fullName: name,
//         produits: stats.count,
//         valeur: stats.totalValue,
//         stock: stats.totalStock
//       }));

//       // Top produits par valeur
//       const topProducts = [...products]
//         .sort((a, b) => (b.quantity * b.price) - (a.quantity * a.price))
//         .slice(0, 10)
//         .map(p => ({
//           id: p.id,
//           name: p.name.length > 15 ? p.name.substring(0, 15) + '...' : p.name,
//           fullName: p.name,
//           sku: p.sku || 'N/A',
//           valeur: (p.quantity || 0) * (p.price || 0),
//           quantité: p.quantity || 0,
//           prix: p.price || 0,
//           category: p.category || 'Non catégorisé'
//         }));

//       // Produits à faible stock
//       const lowStockList = products
//         .filter(p => (p.quantity || 0) < 10)
//         .sort((a, b) => (a.quantity || 0) - (b.quantity || 0))
//         .slice(0, 10)
//         .map(p => ({
//           id: p.id,
//           name: p.name,
//           sku: p.sku || 'N/A',
//           category: p.category || 'Non catégorisé',
//           quantity: p.quantity || 0,
//           price: p.price || 0,
//           stockValue: (p.quantity || 0) * (p.price || 0)
//         }));

//       setProductsData({
//         totalProducts: products.length,
//         totalStock,
//         totalValue,
//         lowStockProducts,
//         categories: categories.sort((a, b) => b.valeur - a.valeur),
//         topProducts,
//         lowStockList
//       });
//     } catch (error) {
//       console.error('Erreur données produits:', error);
//       throw error;
//     }
//   };

//   // Charger les statistiques de promotions
//   const loadPromotionStats = async () => {
//     try {
//       const { data: salesWithPromotions, error } = await supabase
//         .from('sales')
//         .select('discount_amount, promotion_code')
//         .eq('status', 'completed')
//         .not('promotion_code', 'is', null)
//         .gte('sale_date', getStartDateForPeriod(timeRange));

//       if (error) throw error;

//       const promotionSales = salesWithPromotions || [];
//       const totalDiscountGiven = promotionSales.reduce((sum, sale) => sum + (sale.discount_amount || 0), 0);
//       const promotionEffectiveness = salesStats.totalSales > 0 
//         ? (promotionSales.length / salesStats.totalSales * 100)
//         : 0;

//       setPromotionsData({
//         activePromotions: 0, // À implémenter avec table promotions
//         totalDiscountGiven,
//         mostUsedPromotion: null,
//         promotionEffectiveness,
//         promotionSalesCount: promotionSales.length,
//         averagePromotionDiscount: promotionSales.length > 0 
//           ? totalDiscountGiven / promotionSales.length
//           : 0
//       });
//     } catch (error) {
//       console.error('Erreur stats promotions:', error);
//       throw error;
//     }
//   };

//   const getStartDateForPeriod = (period) => {
//     const today = new Date();
//     const startDate = new Date();
    
//     switch (period) {
//       case '7days':
//         startDate.setDate(today.getDate() - 7);
//         break;
//       case '30days':
//         startDate.setDate(today.getDate() - 30);
//         break;
//       case '90days':
//         startDate.setDate(today.getDate() - 90);
//         break;
//       case 'year':
//         startDate.setFullYear(today.getFullYear() - 1);
//         break;
//       default:
//         startDate.setDate(today.getDate() - 30);
//     }
    
//     return startDate.toISOString();
//   };

//   const formatCurrency = (amount) => {
//     if (amount === undefined || amount === null) return '0,00 €';
//     return new Intl.NumberFormat('fr-FR', {
//       style: 'currency',
//       currency: 'EUR',
//       minimumFractionDigits: 2
//     }).format(amount);
//   };

//   const formatNumber = (num) => {
//     if (num === undefined || num === null) return '0';
//     return new Intl.NumberFormat('fr-FR').format(num);
//   };

//   const formatDate = (dateString) => {
//     if (!dateString) return '';
//     const date = new Date(dateString);
//     return date.toLocaleDateString('fr-FR');
//   };

//   const formatPaymentMethod = (method) => {
//     const methods = {
//       'cash': 'Espèces',
//       'card': 'Carte bancaire',
//       'check': 'Chèque',
//       'transfer': 'Virement',
//       'mobile': 'Mobile',
//       'unknown': 'Non spécifié'
//     };
//     return methods[method] || method.charAt(0).toUpperCase() + method.slice(1);
//   };

//   const getSalesTrendData = () => {
//     if (!salesData.dailyStats || salesData.dailyStats.length === 0) return [];
    
//     return salesData.dailyStats.slice(0, 15).map(day => ({
//       date: new Date(day.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }),
//       ventes: day.sales_count || 0,
//       revenue: day.total_revenue || 0,
//       discount: day.discount_amount || 0,
//       clients: day.unique_customers || 0,
//       panierMoyen: day.avg_ticket || 0
//     })).reverse();
//   };

//   const getTopProductsData = () => {
//     if (!productsData.topProducts || productsData.topProducts.length === 0) return [];
//     return productsData.topProducts.slice(0, 8);
//   };

//   const getCategoryData = () => {
//     if (!productsData.categories || productsData.categories.length === 0) return [];
//     return productsData.categories.slice(0, 8);
//   };

//   const showNotification = (type, message) => {
//     setNotification({ type, message });
//     setTimeout(() => setNotification(null), 5000);
//   };

//   const handleExport = async () => {
//     try {
//       // Préparer les données CSV
//       let csvContent = "Type,Date,Valeur,Statut\n";
      
//       // Ajouter les ventes
//       salesData.allSales.forEach(sale => {
//         csvContent += `Vente,${sale.sale_date},${sale.total_amount},${sale.status}\n`;
//       });
      
//       // Ajouter les statistiques
//       csvContent += `\nStatistiques Générales\n`;
//       csvContent += `Total Ventes,${salesStats.totalSales}\n`;
//       csvContent += `Revenu Total,${salesStats.totalRevenue}\n`;
//       csvContent += `Remises Total,${salesStats.totalDiscounts}\n`;
//       csvContent += `Panier Moyen,${salesStats.averageTicket}\n`;
      
//       // Créer le blob et télécharger
//       const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
//       const url = URL.createObjectURL(blob);
//       const link = document.createElement('a');
//       link.href = url;
//       link.setAttribute('download', `rapport_analytics_${new Date().toISOString().split('T')[0]}.csv`);
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
      
//       showNotification('success', 'Rapport exporté avec succès!');
//     } catch (error) {
//       console.error('Erreur export:', error);
//       showNotification('error', 'Erreur lors de l\'export');
//     }
//   };

//   useEffect(() => {
//     loadAllStats();
//   }, [loadAllStats]);

//   // Composant pour l'onglet Ventes
//   const SalesTab = () => (
//     <div className="space-y-6">
//       {/* Cartes de statistiques des ventes */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//         {/* Carte Revenus */}
//         <div className="bg-white p-6 rounded-xl border shadow-sm hover:shadow-md transition-shadow">
//           <div className="flex items-center justify-between mb-4">
//             <div className="p-3 bg-blue-50 rounded-lg">
//               <DollarSign className="w-6 h-6 text-blue-600" />
//             </div>
//             <div className="flex items-center space-x-2">
//               {salesStats.totalDiscounts > 0 && (
//                 <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
//                   -{formatCurrency(salesStats.totalDiscounts)}
//                 </span>
//               )}
//               <span className="text-sm font-medium text-gray-500">
//                 {salesData.allSales.length} ventes
//               </span>
//             </div>
//           </div>
//           <h3 className="text-xl font-bold text-gray-900 mb-1">
//             {formatCurrency(salesStats.totalRevenue)}
//           </h3>
//           <p className="text-gray-500">Revenu net</p>
//           <div className="mt-3 pt-3 border-t border-gray-100">
//             <div className="flex justify-between text-sm">
//               <span className="text-gray-500">Brut:</span>
//               <span>{formatCurrency(salesStats.subtotalRevenue)}</span>
//             </div>
//             {salesStats.totalDiscounts > 0 && (
//               <div className="flex justify-between text-sm text-green-600 mt-1">
//                 <span>Remises:</span>
//                 <span>-{formatCurrency(salesStats.totalDiscounts)}</span>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Carte Transactions */}
//         <div className="bg-white p-6 rounded-xl border shadow-sm hover:shadow-md transition-shadow">
//           <div className="flex items-center justify-between mb-4">
//             <div className="p-3 bg-green-50 rounded-lg">
//               <ShoppingCart className="w-6 h-6 text-green-600" />
//             </div>
//             <div className="flex items-center space-x-2">
//               <span className="text-sm font-medium text-gray-500">
//                 {timeRange === '7days' ? '7 jours' : 
//                  timeRange === '30days' ? '30 jours' : 
//                  timeRange === '90days' ? '90 jours' : 'Année'}
//               </span>
//             </div>
//           </div>
//           <h3 className="text-xl font-bold text-gray-900 mb-1">
//             {salesStats.totalSales}
//           </h3>
//           <p className="text-gray-500">Transactions réussies</p>
//           <div className="mt-3 pt-3 border-t border-gray-100">
//             <div className="flex justify-between text-sm text-gray-500">
//               <span>Panier moyen:</span>
//               <span className="font-medium">{formatCurrency(salesStats.averageTicket)}</span>
//             </div>
//           </div>
//         </div>

//         {/* Carte Clients */}
//         <div className="bg-white p-6 rounded-xl border shadow-sm hover:shadow-md transition-shadow">
//           <div className="flex items-center justify-between mb-4">
//             <div className="p-3 bg-purple-50 rounded-lg">
//               <Users className="w-6 h-6 text-purple-600" />
//             </div>
//             <div className="flex items-center space-x-2">
//               {promotionsData.activePromotions > 0 && (
//                 <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
//                   {promotionsData.activePromotions} promo{promotionsData.activePromotions > 1 ? 's' : ''}
//                 </span>
//               )}
//               <span className="text-sm font-medium text-purple-600">
//                 {salesStats.uniqueCustomers} client{salesStats.uniqueCustomers !== 1 ? 's' : ''}
//               </span>
//             </div>
//           </div>
//           <h3 className="text-xl font-bold text-gray-900 mb-1">
//             {formatNumber(salesStats.uniqueCustomers)}
//           </h3>
//           <p className="text-gray-500">Clients uniques</p>
//           <div className="mt-3 pt-3 border-t border-gray-100">
//             <div className="flex justify-between text-sm text-gray-500">
//               <span>Fidélisation:</span>
//               <span className="font-medium">78%</span>
//             </div>
//             <div className="flex justify-between text-sm text-gray-500 mt-1">
//               <span>Nouveaux:</span>
//               <span className="font-medium">15%</span>
//             </div>
//           </div>
//         </div>

//         {/* Carte Performances */}
//         <div className="bg-white p-6 rounded-xl border shadow-sm hover:shadow-md transition-shadow">
//           <div className="flex items-center justify-between mb-4">
//             <div className="p-3 bg-amber-50 rounded-lg">
//               <TrendingUp className="w-6 h-6 text-amber-600" />
//             </div>
//             <div className="flex items-center space-x-2">
//               <span className="text-sm font-medium text-amber-700">
//                 {promotionsData.activePromotions > 0 ? `+${promotionsData.activePromotions} promo` : 'Aucune promo'}
//               </span>
//             </div>
//           </div>
//           <h3 className="text-xl font-bold text-gray-900 mb-1">
//             {formatCurrency(salesStats.averageTicket)}
//           </h3>
//           <p className="text-gray-500">Panier moyen</p>
//           <div className="mt-3 pt-3 border-t border-gray-100">
//             <div className="flex justify-between text-sm text-gray-500">
//               <span>Remises moyennes:</span>
//               <span className="font-medium">{formatCurrency(promotionsData.averagePromotionDiscount)}</span>
//             </div>
//             <div className="flex justify-between text-sm text-gray-500 mt-1">
//               <span>Ventes avec promo:</span>
//               <span className="font-medium">{promotionsData.promotionSalesCount}</span>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Graphiques des ventes */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         {/* Évolution des ventes quotidiennes */}
//         <div className="bg-white p-6 rounded-xl border shadow-sm">
//           <div className="flex items-center justify-between mb-6">
//             <h3 className="text-lg font-semibold text-gray-900">
//               <TrendingUp className="w-5 h-5 inline mr-2 text-blue-600" />
//               Évolution des ventes ({timeRange === '7days' ? '7' : timeRange === '30days' ? '15' : '30'} derniers jours)
//             </h3>
//             <select 
//               value={timeRange}
//               onChange={(e) => setTimeRange(e.target.value)}
//               className="text-sm border rounded-lg px-3 py-1"
//             >
//               <option value="7days">7 jours</option>
//               <option value="30days">30 jours</option>
//               <option value="90days">90 jours</option>
//             </select>
//           </div>
//           <div className="h-80">
//             {getSalesTrendData().length > 0 ? (
//               <ResponsiveContainer width="100%" height="100%">
//                 <AreaChart data={getSalesTrendData()}>
//                   <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
//                   <XAxis dataKey="date" />
//                   <YAxis yAxisId="left" />
//                   <YAxis yAxisId="right" orientation="right" />
//                   <Tooltip content={<CustomTooltip />} />
//                   <Legend />
//                   <Area 
//                     yAxisId="left"
//                     type="monotone" 
//                     dataKey="revenue" 
//                     stroke="#3B82F6" 
//                     fill="#93C5FD" 
//                     fillOpacity={0.6}
//                     name="Revenus nets (€)"
//                   />
//                   <Line 
//                     yAxisId="right"
//                     type="monotone" 
//                     dataKey="discount" 
//                     stroke="#EF4444" 
//                     name="Remises (€)"
//                     strokeWidth={2}
//                   />
//                 </AreaChart>
//               </ResponsiveContainer>
//             ) : (
//               <div className="h-full flex flex-col items-center justify-center text-gray-500">
//                 <BarChart2 className="w-12 h-12 mb-3 text-gray-300" />
//                 <p>Aucune donnée de vente disponible</p>
//                 <p className="text-sm">Les ventes apparaîtront ici</p>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Méthodes de paiement */}
//         <div className="bg-white p-6 rounded-xl border shadow-sm">
//           <div className="flex items-center justify-between mb-6">
//             <h3 className="text-lg font-semibold text-gray-900">
//               <CreditCard className="w-5 h-5 inline mr-2 text-yellow-600" />
//               Méthodes de paiement
//             </h3>
//             <span className="text-sm text-gray-500">
//               {salesData.paymentStats?.length || 0} méthodes
//             </span>
//           </div>
//           <div className="h-80">
//             {salesData.paymentStats && salesData.paymentStats.length > 0 ? (
//               <div className="h-full flex flex-col">
//                 <div className="flex-1">
//                   <ResponsiveContainer width="100%" height="100%">
//                     <PieChart>
//                       <Pie
//                         data={salesData.paymentStats}
//                         cx="50%"
//                         cy="50%"
//                         labelLine={false}
//                         label={({ payment_method, total_amount }) => 
//                           `${formatPaymentMethod(payment_method)}: ${formatCurrency(total_amount)}`
//                         }
//                         outerRadius={80}
//                         fill="#8884d8"
//                         dataKey="total_amount"
//                       >
//                         {salesData.paymentStats.map((entry, index) => (
//                           <Cell key={`cell-${index}`} fill={['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'][index % 6]} />
//                         ))}
//                       </Pie>
//                       <Tooltip 
//                         formatter={(value) => [formatCurrency(value), 'Revenus']}
//                       />
//                     </PieChart>
//                   </ResponsiveContainer>
//                 </div>
//                 <div className="mt-4 grid grid-cols-2 gap-3">
//                   {salesData.paymentStats.slice(0, 4).map((method, index) => (
//                     <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
//                       <div className="flex items-center">
//                         <div 
//                           className="w-3 h-3 rounded-full mr-2"
//                           style={{ backgroundColor: ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'][index % 4] }}
//                         ></div>
//                         <div>
//                           <div className="text-sm font-medium">{formatPaymentMethod(method.payment_method)}</div>
//                           <div className="text-xs text-gray-500">
//                             {method.count} transaction{method.count > 1 ? 's' : ''}
//                           </div>
//                         </div>
//                       </div>
//                       <div className="text-right">
//                         <div className="font-medium">{formatCurrency(method.total_amount)}</div>
//                         <div className="text-xs text-gray-500">
//                           {salesStats.totalRevenue > 0 ? 
//                             `${((method.total_amount / salesStats.totalRevenue) * 100).toFixed(1)}%` : 
//                             '0%'}
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             ) : (
//               <div className="h-full flex flex-col items-center justify-center text-gray-500">
//                 <CreditCard className="w-12 h-12 mb-3 text-gray-300" />
//                 <p>Aucune donnée de paiement</p>
//                 <p className="text-sm">Les méthodes apparaîtront après les ventes</p>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Meilleurs clients */}
//       <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
//         <div className="p-6 border-b">
//           <div className="flex items-center justify-between">
//             <h3 className="text-lg font-semibold text-gray-900">
//               <Users className="w-5 h-5 inline mr-2 text-green-600" />
//               Top clients
//             </h3>
//             <button className="text-sm text-purple-600 hover:text-purple-700 flex items-center">
//               Voir tout <ChevronRight className="w-4 h-4 ml-1" />
//             </button>
//           </div>
//         </div>
//         <div className="overflow-x-auto">
//           {salesData.topCustomers && salesData.topCustomers.length > 0 ? (
//             <table className="w-full">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
//                     Client
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
//                     Achats
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
//                     Total dépensé
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
//                     Dernier achat
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
//                     Valeur moyenne
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-gray-200">
//                 {salesData.topCustomers.slice(0, 8).map((customer, index) => (
//                   <tr key={index} className="hover:bg-gray-50">
//                     <td className="px-6 py-4">
//                       <div className="font-medium text-gray-900">
//                         {customer.name || 'Client anonyme'}
//                       </div>
//                     </td>
//                     <td className="px-6 py-4">
//                       <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
//                         {customer.purchase_count || 0}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4 font-bold text-gray-900">
//                       {formatCurrency(customer.total_spent || 0)}
//                     </td>
//                     <td className="px-6 py-4 text-sm text-gray-600">
//                       {formatDate(customer.updated_at || customer.created_at)}
//                     </td>
//                     <td className="px-6 py-4">
//                       {customer.purchase_count > 0 ? 
//                         formatCurrency((customer.total_spent || 0) / customer.purchase_count) : 
//                         formatCurrency(0)}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           ) : (
//             <div className="px-6 py-12 text-center text-gray-500">
//               <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
//               <p>Aucune donnée client disponible</p>
//               <p className="text-sm">Les clients apparaîtront après les ventes</p>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );

//   // Composant pour l'onglet Produits
//   const ProductsTab = () => (
//     <div className="space-y-6">
//       {/* Cartes de statistiques des produits */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//         <div className="bg-white p-6 rounded-xl border shadow-sm hover:shadow-md transition-shadow">
//           <div className="flex items-center justify-between mb-4">
//             <div className="p-3 bg-green-50 rounded-lg">
//               <Package className="w-6 h-6 text-green-600" />
//             </div>
//             <span className="text-sm font-medium text-gray-500">
//               +5%
//             </span>
//           </div>
//           <h3 className="text-xl font-bold text-gray-900 mb-1">
//             {formatNumber(productsData.totalProducts)}
//           </h3>
//           <p className="text-gray-500">Produits en stock</p>
//           <div className="mt-3 pt-3 border-t border-gray-100 text-sm text-gray-500">
//             <Layers className="w-4 h-4 inline mr-1" />
//             {productsData.totalStock} unités totales
//           </div>
//         </div>

//         <div className="bg-white p-6 rounded-xl border shadow-sm hover:shadow-md transition-shadow">
//           <div className="flex items-center justify-between mb-4">
//             <div className="p-3 bg-blue-50 rounded-lg">
//               <DollarSign className="w-6 h-6 text-blue-600" />
//             </div>
//             <span className="text-sm font-medium text-blue-600">
//               {formatCurrency(productsData.totalValue / 1000)}K
//             </span>
//           </div>
//           <h3 className="text-xl font-bold text-gray-900 mb-1">
//             {formatCurrency(productsData.totalValue)}
//           </h3>
//           <p className="text-gray-500">Total inventaire</p>
//           <div className="mt-3 pt-3 border-t border-gray-100 text-sm text-gray-500">
//             Valeur moyenne: {formatCurrency(productsData.totalProducts > 0 ? productsData.totalValue / productsData.totalProducts : 0)}
//           </div>
//         </div>

//         <div className="bg-white p-6 rounded-xl border shadow-sm hover:shadow-md transition-shadow">
//           <div className="flex items-center justify-between mb-4">
//             <div className="p-3 bg-red-50 rounded-lg">
//               <AlertCircle className="w-6 h-6 text-red-600" />
//             </div>
//             <span className={`text-sm font-medium ${
//               productsData.lowStockProducts > 0 ? 'text-red-600' : 'text-green-600'
//             }`}>
//               {productsData.lowStockProducts || 0} faible{productsData.lowStockProducts !== 1 ? 's' : ''}
//             </span>
//           </div>
//           <h3 className="text-xl font-bold text-gray-900 mb-1">
//             {formatNumber(productsData.totalProducts)}
//           </h3>
//           <p className="text-gray-500">Produits en stock</p>
//           <div className="mt-3 pt-3 border-t border-gray-100 text-sm text-gray-500">
//             <AlertCircle className="w-4 h-4 inline mr-1" />
//             Seuil: &lt; 10 unités
//           </div>
//         </div>

//         <div className="bg-white p-6 rounded-xl border shadow-sm hover:shadow-md transition-shadow">
//           <div className="flex items-center justify-between mb-4">
//             <div className="p-3 bg-purple-50 rounded-lg">
//               <Layers className="w-6 h-6 text-purple-600" />
//             </div>
//             <span className="text-sm font-medium text-gray-500">
//               {productsData.categories?.length || 0}
//             </span>
//           </div>
//           <h3 className="text-xl font-bold text-gray-900 mb-1">
//             {productsData.categories?.length || 0}
//           </h3>
//           <p className="text-gray-500">Catégories</p>
//           <div className="mt-3 pt-3 border-t border-gray-100 text-sm text-gray-500">
//             <BarChart2 className="w-4 h-4 inline mr-1" />
//             Diversité des produits
//           </div>
//         </div>
//       </div>

//       {/* Graphiques des produits */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         {/* Top produits par valeur */}
//         <div className="bg-white p-6 rounded-xl border shadow-sm">
//           <div className="flex items-center justify-between mb-6">
//             <h3 className="text-lg font-semibold text-gray-900">
//               <Package className="w-5 h-5 inline mr-2 text-green-600" />
//               Top produits (valeur du stock)
//             </h3>
//             <button className="text-sm text-purple-600 hover:text-purple-700">
//               Voir top 20
//             </button>
//           </div>
//           <div className="h-80">
//             {getTopProductsData().length > 0 ? (
//               <ResponsiveContainer width="100%" height="100%">
//                 <BarChart data={getTopProductsData()}>
//                   <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
//                   <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} />
//                   <YAxis />
//                   <Tooltip content={<CustomTooltip />} />
//                   <Legend />
//                   <Bar dataKey="valeur" name="Valeur (€)" fill="#10B981" radius={[4, 4, 0, 0]} />
//                   <Bar dataKey="quantité" name="Quantité" fill="#3B82F6" radius={[4, 4, 0, 0]} />
//                 </BarChart>
//               </ResponsiveContainer>
//             ) : (
//               <div className="h-full flex flex-col items-center justify-center text-gray-500">
//                 <Package className="w-12 h-12 mb-3 text-gray-300" />
//                 <p>Aucun produit en stock</p>
//                 <p className="text-sm">Ajoutez des produits pour voir les statistiques</p>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Stock par catégorie */}
//         <div className="bg-white p-6 rounded-xl border shadow-sm">
//           <div className="flex items-center justify-between mb-6">
//             <h3 className="text-lg font-semibold text-gray-900">
//               <BarChart2 className="w-5 h-5 inline mr-2 text-purple-600" />
//               Stock par catégorie
//             </h3>
//             <div className="flex space-x-2">
//               <button className="px-2 py-1 text-xs rounded bg-purple-100 text-purple-600">
//                 Quantité
//               </button>
//               <button className="px-2 py-1 text-xs rounded bg-gray-100">
//                 Valeur
//               </button>
//             </div>
//           </div>
//           <div className="h-80">
//             {getCategoryData().length > 0 ? (
//               <ResponsiveContainer width="100%" height="100%">
//                 <BarChart data={getCategoryData()}>
//                   <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
//                   <XAxis dataKey="name" />
//                   <YAxis />
//                   <Tooltip content={<CustomTooltip />} />
//                   <Legend />
//                   <Bar dataKey="stock" name="Stock total" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
//                 </BarChart>
//               </ResponsiveContainer>
//             ) : (
//               <div className="h-full flex flex-col items-center justify-center text-gray-500">
//                 <Layers className="w-12 h-12 mb-3 text-gray-300" />
//                 <p>Aucune catégorie définie</p>
//                 <p className="text-sm">Catégorisez vos produits pour voir les statistiques</p>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Tableau des produits à faible stock */}
//       <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
//         <div className="p-6 border-b">
//           <div className="flex items-center justify-between">
//             <div>
//               <h3 className="text-lg font-semibold text-gray-900 flex items-center">
//                 <AlertCircle className="w-5 h-5 inline mr-2 text-red-600" />
//                 Produits à réapprovisionner
//               </h3>
//               <p className="text-sm text-gray-500 mt-1">
//                 Produits avec un stock inférieur à 10 unités
//               </p>
//             </div>
//             <div className="flex items-center space-x-3">
//               <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
//                 {productsData.lowStockProducts || 0} produit{productsData.lowStockProducts !== 1 ? 's' : ''}
//               </span>
//               <button className="text-sm text-purple-600 hover:text-purple-700 flex items-center">
//                 Commander <ChevronRight className="w-4 h-4 ml-1" />
//               </button>
//             </div>
//           </div>
//         </div>
//         <div className="overflow-x-auto">
//           {productsData.lowStockList && productsData.lowStockList.length > 0 ? (
//             <table className="w-full">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
//                     Produit
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
//                     Catégorie
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
//                     Stock actuel
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
//                     Prix unitaire
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
//                     Valeur stock
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
//                     Statut
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-gray-200">
//                 {productsData.lowStockList.slice(0, 10).map((product, index) => (
//                   <tr key={product.id || index} className="hover:bg-gray-50">
//                     <td className="px-6 py-4">
//                       <div className="font-medium text-gray-900">{product.name}</div>
//                       <div className="text-sm text-gray-500">SKU: {product.sku || 'N/A'}</div>
//                     </td>
//                     <td className="px-6 py-4">
//                       <span className="px-2 py-1 text-xs bg-gray-100 rounded-full">
//                         {product.category || 'Non catégorisé'}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4">
//                       <div className="flex items-center">
//                         <div className="w-24 bg-gray-200 rounded-full h-2 mr-3">
//                           <div 
//                             className={`h-2 rounded-full ${
//                               product.quantity < 3 ? 'bg-red-500' : 
//                               product.quantity < 5 ? 'bg-yellow-500' : 'bg-orange-500'
//                             }`}
//                             style={{ width: `${(product.quantity / 10) * 100}%` }}
//                           ></div>
//                         </div>
//                         <span className={`font-medium ${
//                           product.quantity < 3 ? 'text-red-600' : 
//                           product.quantity < 5 ? 'text-yellow-600' : 'text-orange-600'
//                         }`}>
//                           {product.quantity}
//                         </span>
//                       </div>
//                     </td>
//                     <td className="px-6 py-4">
//                       {formatCurrency(product.price || 0)}
//                     </td>
//                     <td className="px-6 py-4 font-medium">
//                       {formatCurrency(product.stockValue || 0)}
//                     </td>
//                     <td className="px-6 py-4">
//                       <span className={`px-2 py-1 text-xs rounded-full ${
//                         product.quantity === 0 
//                           ? 'bg-red-100 text-red-800'
//                           : product.quantity < 3 
//                           ? 'bg-red-100 text-red-800'
//                           : product.quantity < 5
//                           ? 'bg-yellow-100 text-yellow-800'
//                           : 'bg-orange-100 text-orange-800'
//                       }`}>
//                         {product.quantity === 0 ? 'RUPTURE' :
//                          product.quantity < 3 ? 'CRITIQUE' : 
//                          product.quantity < 5 ? 'FAIBLE' : 'MOYEN'}
//                       </span>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           ) : (
//             <div className="px-6 py-12 text-center text-gray-500">
//               <Package className="w-12 h-12 mx-auto mb-3 text-gray-300" />
//               <p>Aucun produit à faible stock</p>
//               <p className="text-sm">Tous les produits ont un stock suffisant</p>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );

//   // Composant pour l'onglet Revenus
//   const RevenueTab = () => (
//     <div className="space-y-6">
//       {/* Cartes de statistiques des revenus */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//         <div className="bg-white p-6 rounded-xl border shadow-sm hover:shadow-md transition-shadow">
//           <div className="flex items-center justify-between mb-4">
//             <div className="p-3 bg-green-50 rounded-lg">
//               <DollarSign className="w-6 h-6 text-green-600" />
//             </div>
//             <span className={`text-sm font-medium ${
//               promotionsData.promotionEffectiveness > 0 ? 'text-green-600' : 'text-gray-600'
//             }`}>
//               <TrendingUp className="w-4 h-4 inline mr-1" />
//               {promotionsData.promotionEffectiveness > 0 ? `+${promotionsData.promotionEffectiveness.toFixed(1)}%` : '0%'}
//             </span>
//           </div>
//           <h3 className="text-xl font-bold text-gray-900 mb-1">
//             {formatCurrency(salesStats.totalRevenue)}
//           </h3>
//           <p className="text-gray-500">Revenus nets totaux</p>
//           <div className="mt-3 pt-3 border-t border-gray-100 text-sm text-gray-500">
//             <div className="flex justify-between">
//               <span>Brut:</span>
//               <span>{formatCurrency(salesStats.subtotalRevenue)}</span>
//             </div>
//             <div className="flex justify-between text-green-600 mt-1">
//               <span>Remises:</span>
//               <span>-{formatCurrency(salesStats.totalDiscounts)}</span>
//             </div>
//           </div>
//         </div>

//         <div className="bg-white p-6 rounded-xl border shadow-sm hover:shadow-md transition-shadow">
//           <div className="flex items-center justify-between mb-4">
//             <div className="p-3 bg-blue-50 rounded-lg">
//               <ShoppingBag className="w-6 h-6 text-blue-600" />
//             </div>
//             <span className="text-sm font-medium text-blue-600">
//               {salesStats.averageTicket > 0 ? `+${Math.round(salesStats.averageTicket)}%` : '0%'}
//             </span>
//           </div>
//           <h3 className="text-xl font-bold text-gray-900 mb-1">
//             {formatCurrency(salesStats.averageTicket)}
//           </h3>
//           <p className="text-gray-500">Ticket moyen net</p>
//           <div className="mt-3 pt-3 border-t border-gray-100 text-sm text-gray-500">
//             <div className="flex justify-between">
//               <span>Base:</span>
//               <span>{formatCurrency(salesStats.subtotalRevenue / Math.max(salesStats.totalSales, 1))}</span>
//             </div>
//             <div className="flex justify-between text-green-600 mt-1">
//               <span>Promos:</span>
//               <span>{promotionsData.promotionSalesCount}</span>
//             </div>
//           </div>
//         </div>

//         <div className="bg-white p-6 rounded-xl border shadow-sm hover:shadow-md transition-shadow">
//           <div className="flex items-center justify-between mb-4">
//             <div className="p-3 bg-purple-50 rounded-lg">
//               <Calendar className="w-6 h-6 text-purple-600" />
//             </div>
//             <span className="text-sm font-medium text-gray-500">
//               Ce mois
//             </span>
//           </div>
//           <h3 className="text-xl font-bold text-gray-900 mb-1">
//             {formatCurrency(salesData.monthlyStats?.find(m => m.month_number === new Date().getMonth() + 1)?.total_revenue || 0)}
//           </h3>
//           <p className="text-gray-500">Revenus mensuels</p>
//           <div className="mt-3 pt-3 border-t border-gray-100 text-sm text-gray-500">
//             <div className="flex justify-between">
//               <span>Mois préc.:</span>
//               <span>{formatCurrency(0)}</span>
//             </div>
//             <div className="flex justify-between text-green-600 mt-1">
//               <span>Croissance:</span>
//               <span>0%</span>
//             </div>
//           </div>
//         </div>

//         <div className="bg-white p-6 rounded-xl border shadow-sm hover:shadow-md transition-shadow">
//           <div className="flex items-center justify-between mb-4">
//             <div className="p-3 bg-amber-50 rounded-lg">
//               <Tag className="w-6 h-6 text-amber-600" />
//             </div>
//             <span className="text-sm font-medium text-amber-600">
//               {promotionsData.activePromotions || 0} active{promotionsData.activePromotions !== 1 ? 's' : ''}
//             </span>
//           </div>
//           <h3 className="text-xl font-bold text-gray-900 mb-1">
//             {formatCurrency(promotionsData.totalDiscountGiven || 0)}
//           </h3>
//           <p className="text-gray-500">Total remises</p>
//           <div className="mt-3 pt-3 border-t border-gray-100 text-sm text-gray-500">
//             <div className="flex justify-between">
//               <span>Efficacité:</span>
//               <span>{(promotionsData.promotionEffectiveness || 0).toFixed(1)}%</span>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Graphiques des revenus */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         {/* Évolution des revenus mensuels */}
//         <div className="bg-white p-6 rounded-xl border shadow-sm">
//           <div className="flex items-center justify-between mb-6">
//             <h3 className="text-lg font-semibold text-gray-900">
//               <TrendingUp className="w-5 h-5 inline mr-2 text-blue-600" />
//               Évolution des revenus ({new Date().getFullYear()})
//             </h3>
//           </div>
//           <div className="h-80">
//             {salesData.monthlyStats && salesData.monthlyStats.length > 0 ? (
//               <ResponsiveContainer width="100%" height="100%">
//                 <LineChart data={salesData.monthlyStats}>
//                   <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
//                   <XAxis dataKey="month" />
//                   <YAxis />
//                   <Tooltip 
//                     formatter={(value) => [formatCurrency(value), 'Revenus']}
//                   />
//                   <Legend />
//                   <Line 
//                     type="monotone" 
//                     dataKey="total_revenue" 
//                     stroke="#3B82F6" 
//                     name="Revenus nets (€)"
//                     strokeWidth={3}
//                   />
//                 </LineChart>
//               </ResponsiveContainer>
//             ) : (
//               <div className="h-full flex flex-col items-center justify-center text-gray-500">
//                 <BarChart2 className="w-12 h-12 mb-3 text-gray-300" />
//                 <p>Aucune donnée de revenus disponible</p>
//                 <p className="text-sm">Les revenus apparaîtront ici</p>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Performances quotidiennes */}
//         <div className="bg-white p-6 rounded-xl border shadow-sm">
//           <div className="flex items-center justify-between mb-6">
//             <h3 className="text-lg font-semibold text-gray-900">
//               <Activity className="w-5 h-5 inline mr-2 text-green-600" />
//               Performances quotidiennes
//             </h3>
//             <select 
//               value={timeRange}
//               onChange={(e) => setTimeRange(e.target.value)}
//               className="text-sm border rounded-lg px-3 py-1"
//             >
//               <option value="7days">7 jours</option>
//               <option value="30days">30 jours</option>
//               <option value="90days">90 jours</option>
//             </select>
//           </div>
//           <div className="h-80">
//             {salesData.dailyStats && salesData.dailyStats.length > 0 ? (
//               <ResponsiveContainer width="100%" height="100%">
//                 <BarChart data={salesData.dailyStats.slice(0, 14)}>
//                   <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
//                   <XAxis dataKey="date" />
//                   <YAxis />
//                   <Tooltip 
//                     formatter={(value, name) => {
//                       if (name === 'total_revenue') {
//                         return [formatCurrency(value), 'Revenus'];
//                       }
//                       return [value, name === 'sales_count' ? 'Ventes' : name];
//                     }}
//                   />
//                   <Legend />
//                   <Bar 
//                     dataKey="total_revenue" 
//                     name="Revenus (€)" 
//                     fill="#10B981" 
//                     radius={[4, 4, 0, 0]}
//                   />
//                   <Bar 
//                     dataKey="sales_count" 
//                     name="Nombre de ventes" 
//                     fill="#3B82F6" 
//                     radius={[4, 4, 0, 0]}
//                   />
//                 </BarChart>
//               </ResponsiveContainer>
//             ) : (
//               <div className="h-full flex flex-col items-center justify-center text-gray-500">
//                 <Activity className="w-12 h-12 mb-3 text-gray-300" />
//                 <p>Aucune donnée de performances</p>
//                 <p className="text-sm">Les performances apparaîtront après les ventes</p>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {notification && (
//         <Notification
//           type={notification.type}
//           message={notification.message}
//           onClose={() => setNotification(null)}
//         />
//       )}

//       {/* Header */}
//       <div className="sticky top-0 z-10 bg-white border-b">
//         <div className="px-6 py-4">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center space-x-3">
//               <div className="p-2 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl">
//                 <BarChart3 className="w-7 h-7 text-purple-600" />
//               </div>
//               <div>
//                 <h1 className="text-2xl font-bold text-gray-900">Analytics & Rapports</h1>
//                 <div className="flex items-center space-x-4 text-sm text-gray-500">
//                   <span>Analyse avancée avec remises et promotions</span>
//                   <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
//                   <span>{salesData.allSales.length} ventes analysées</span>
//                 </div>
//               </div>
//             </div>
            
//             <div className="flex items-center space-x-3">
//               <button
//                 onClick={handleExport}
//                 className="flex items-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg"
//               >
//                 <Download className="w-4 h-4" />
//                 <span className="text-sm font-medium">Exporter rapport</span>
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Filtres */}
//         <div className="px-6 py-4 border-t bg-gray-50">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center space-x-4">
//               <div className="flex items-center space-x-2">
//                 <Calendar className="w-5 h-5 text-gray-500" />
//                 <div className="flex flex-wrap gap-2">
//                   {['7days', '30days', '90days'].map((p) => {
//                     const labels = {
//                       '7days': '7 jours',
//                       '30days': '30 jours',
//                       '90days': '90 jours'
//                     };
//                     return (
//                       <button
//                         key={p}
//                         onClick={() => setTimeRange(p)}
//                         className={`flex items-center space-x-1 px-3 py-1.5 text-sm rounded-lg transition-colors ${
//                           timeRange === p
//                             ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white'
//                             : 'bg-white text-gray-600 hover:bg-gray-100 border'
//                         }`}
//                       >
//                         <span>{labels[p]}</span>
//                       </button>
//                     );
//                   })}
//                 </div>
//               </div>
//             </div>
            
//             <button
//               onClick={loadAllStats}
//               disabled={loading}
//               className="flex items-center space-x-2 px-3 py-1.5 bg-white border rounded-lg hover:bg-gray-50 disabled:opacity-50"
//             >
//               <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
//               <span className="text-sm">Actualiser</span>
//             </button>
//           </div>
//         </div>

//         {/* Tabs */}
//         <div className="px-6 border-t">
//           <div className="flex space-x-1">
//             <button
//               onClick={() => setActiveTab('sales')}
//               className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors flex items-center ${
//                 activeTab === 'sales'
//                   ? 'border-purple-600 text-purple-600'
//                   : 'border-transparent text-gray-500 hover:text-gray-700'
//               }`}
//             >
//               <ShoppingCart className="w-4 h-4 mr-2" />
//               Ventes
//               <span className="ml-2 px-2 py-0.5 bg-purple-100 text-purple-600 text-xs rounded-full">
//                 {salesData.allSales.length}
//               </span>
//             </button>
//             <button
//               onClick={() => setActiveTab('products')}
//               className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors flex items-center ${
//                 activeTab === 'products'
//                   ? 'border-purple-600 text-purple-600'
//                   : 'border-transparent text-gray-500 hover:text-gray-700'
//               }`}
//             >
//               <Package className="w-4 h-4 mr-2" />
//               Produits
//               <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-600 text-xs rounded-full">
//                 {productsData.totalProducts}
//               </span>
//             </button>
//             <button
//               onClick={() => setActiveTab('revenue')}
//               className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors flex items-center ${
//                 activeTab === 'revenue'
//                   ? 'border-purple-600 text-purple-600'
//                   : 'border-transparent text-gray-500 hover:text-gray-700'
//               }`}
//             >
//               <DollarSign className="w-4 h-4 mr-2" />
//               Revenus
//               <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-600 text-xs rounded-full">
//                 {formatCurrency(salesStats.totalRevenue).replace('€', '').trim()}
//               </span>
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Contenu principal */}
//       <div className="px-6 py-4">
//         {loading ? (
//           <div className="flex flex-col items-center justify-center py-12">
//             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mb-4"></div>
//             <p className="text-gray-600">Chargement des statistiques...</p>
//           </div>
//         ) : (
//           <>
//             {activeTab === 'sales' && <SalesTab />}
//             {activeTab === 'products' && <ProductsTab />}
//             {activeTab === 'revenue' && <RevenueTab />}
//           </>
//         )}
//       </div>

//       {/* Footer */}
//       <div className="border-t bg-white px-6 py-4">
//         <div className="flex items-center justify-between text-sm text-gray-500">
//           <div>
//             <span>Dernière mise à jour: {new Date().toLocaleString('fr-FR')}</span>
//             {salesStats.totalDiscounts > 0 && (
//               <span className="ml-4 text-green-600">
//                 Remises totales: {formatCurrency(salesStats.totalDiscounts)}
//               </span>
//             )}
//           </div>
//           <div className="flex items-center space-x-4">
//             <span>{salesData.allSales.length} ventes analysées</span>
//             <span className="text-green-600">
//               {promotionsData.activePromotions > 0 ? `${promotionsData.activePromotions} promotions actives` : ''}
//             </span>
//             <button
//               onClick={() => window.print()}
//               className="text-purple-600 hover:text-purple-700 flex items-center"
//             >
//               <Download className="w-4 h-4 mr-1" />
//               Imprimer
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
// app/analytics/page.jsx
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area
} from 'recharts';
import { 
  TrendingUp, Package, ShoppingCart, DollarSign, 
  BarChart2, Download, RefreshCw,
  CreditCard, Users, AlertCircle, Layers, ChevronRight,
  Tag, Activity, Search, Filter, X,
  ChevronDown, MoreVertical
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

// Composant Notification interne
function Notification({ type, message, onClose }) {
  const icons = {
    success: CheckCircle,
    error: AlertCircle,
    info: FileText
  };

  const colors = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800'
  };

  const Icon = icons[type];

  return (
    <div className="fixed top-4 right-4 z-50 animate-fade-in">
      <div className={`flex items-center p-4 rounded-lg border shadow-lg ${colors[type]}`}>
        <Icon className="w-5 h-5 mr-3" />
        <span className="flex-1 font-medium">{message}</span>
        <button
          onClick={onClose}
          className="ml-4 text-gray-400 hover:text-gray-600"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

// Composant CustomTooltip pour les graphiques
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const formatCurrency = (amount) => {
      if (amount === undefined || amount === null) return '0,00 €';
      return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'EUR',
        minimumFractionDigits: 2
      }).format(amount);
    };

    return (
      <div className="bg-white p-3 border rounded-lg shadow-lg">
        <p className="font-semibold text-gray-900 mb-2">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: {
              entry.name.includes('€') || 
              entry.dataKey === 'revenue' || 
              entry.dataKey === 'valeur' || 
              entry.dataKey === 'moyenne' ||
              entry.dataKey === 'prix' ||
              entry.dataKey === 'prixMoyen' ||
              entry.dataKey === 'panierMoyen' ||
              entry.dataKey === 'subtotal' ||
              entry.dataKey === 'discount'
                ? formatCurrency(entry.value)
                : entry.dataKey === 'pourcentage' || 
                  entry.dataKey === 'croissance' || 
                  entry.dataKey === 'discount_rate' ||
                  entry.dataKey === 'percentage'
                ? `${entry.value}%`
                : entry.value?.toLocaleString() || '0'
            }
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function AnalyticsPage() {
  const [salesData, setSalesData] = useState({
    allSales: [],
    dailyStats: [],
    monthlyStats: [],
    paymentStats: [],
    topCustomers: []
  });
  const [productsData, setProductsData] = useState({
    totalProducts: 0,
    totalStock: 0,
    totalValue: 0,
    lowStockProducts: 0,
    categories: [],
    topProducts: [],
    lowStockList: []
  });
  const [salesStats, setSalesStats] = useState({
    totalSales: 0,
    totalRevenue: 0,
    subtotalRevenue: 0,
    totalDiscounts: 0,
    averageTicket: 0,
    customerCount: 0,
    uniqueCustomers: 0
  });
  const [promotionsData, setPromotionsData] = useState({
    activePromotions: 0,
    totalDiscountGiven: 0,
    promotionEffectiveness: 0,
    promotionSalesCount: 0,
    averagePromotionDiscount: 0
  });
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [timeRange, setTimeRange] = useState('30days');
  const [showFilters, setShowFilters] = useState(false);

  // Charger toutes les statistiques
  const loadAllStats = useCallback(async () => {
    setLoading(true);
    try {
      await Promise.all([
        loadSalesStats(),
        loadSalesData(),
        loadPaymentStats(),
        loadDailyStats(),
        loadMonthlyStats(),
        loadTopCustomers(),
        loadProductsData(),
        loadPromotionStats()
      ]);
    } catch (error) {
      console.error('Erreur chargement stats:', error);
      showNotification('error', 'Erreur lors du chargement des statistiques');
    } finally {
      setLoading(false);
    }
  }, [timeRange]);

  // Charger les statistiques de ventes
  const loadSalesStats = async () => {
    try {
      const now = new Date();
      let startDate = new Date();

      switch (timeRange) {
        case '7days':
          startDate.setDate(now.getDate() - 7);
          break;
        case '30days':
          startDate.setDate(now.getDate() - 30);
          break;
        case '90days':
          startDate.setDate(now.getDate() - 90);
          break;
        case 'year':
          startDate.setFullYear(now.getFullYear() - 1);
          break;
        default:
          startDate.setDate(now.getDate() - 30);
      }

      const { count: totalSales, error: countError } = await supabase
        .from('sales')
        .select('*', { count: 'exact' })
        .eq('status', 'completed')
        .gte('sale_date', startDate.toISOString());

      if (countError) throw countError;

      const { data: sales, error: salesError } = await supabase
        .from('sales')
        .select('total_amount, subtotal_amount, discount_amount, customer_name')
        .eq('status', 'completed')
        .gte('sale_date', startDate.toISOString());

      if (salesError) throw salesError;

      const totalRevenue = sales.reduce((sum, sale) => sum + (sale.total_amount || 0), 0);
      const subtotalRevenue = sales.reduce((sum, sale) => sum + (sale.subtotal_amount || sale.total_amount || 0), 0);
      const totalDiscounts = sales.reduce((sum, sale) => sum + (sale.discount_amount || 0), 0);
      const averageTicket = totalSales > 0 ? totalRevenue / totalSales : 0;

      const uniqueCustomers = new Set(sales.map(c => c.customer_name)).size;

      setSalesStats({
        totalSales: totalSales || 0,
        totalRevenue,
        subtotalRevenue,
        totalDiscounts,
        averageTicket,
        customerCount: uniqueCustomers,
        uniqueCustomers
      });
    } catch (error) {
      console.error('Erreur stats ventes:', error);
      throw error;
    }
  };

  // Charger les données de ventes
  const loadSalesData = async () => {
    try {
      const now = new Date();
      let startDate = new Date();

      switch (timeRange) {
        case '7days':
          startDate.setDate(now.getDate() - 7);
          break;
        case '30days':
          startDate.setDate(now.getDate() - 30);
          break;
        case '90days':
          startDate.setDate(now.getDate() - 90);
          break;
        case 'year':
          startDate.setFullYear(now.getFullYear() - 1);
          break;
        default:
          startDate.setDate(now.getDate() - 30);
      }

      const { data: sales, error } = await supabase
        .from('sales')
        .select('*')
        .eq('status', 'completed')
        .gte('sale_date', startDate.toISOString())
        .order('sale_date', { ascending: false });

      if (error) throw error;

      setSalesData(prev => ({
        ...prev,
        allSales: sales || []
      }));
    } catch (error) {
      console.error('Erreur données ventes:', error);
      throw error;
    }
  };

  // Charger les statistiques de paiement
  const loadPaymentStats = async () => {
    try {
      const { data, error } = await supabase
        .from('sales')
        .select('payment_method, total_amount')
        .eq('status', 'completed')
        .gte('sale_date', getStartDateForPeriod(timeRange));

      if (error) throw error;

      const stats = {};
      data.forEach(sale => {
        const method = sale.payment_method || 'unknown';
        if (!stats[method]) {
          stats[method] = { count: 0, total_amount: 0 };
        }
        stats[method].count++;
        stats[method].total_amount += sale.total_amount || 0;
      });

      const paymentStats = Object.entries(stats).map(([payment_method, data]) => ({
        payment_method,
        count: data.count,
        total_amount: data.total_amount
      }));

      setSalesData(prev => ({
        ...prev,
        paymentStats
      }));
    } catch (error) {
      console.error('Erreur stats paiement:', error);
      throw error;
    }
  };

  // Charger les statistiques quotidiennes
  const loadDailyStats = async () => {
    try {
      const days = timeRange === '7days' ? 7 : timeRange === '30days' ? 30 : 90;
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const { data, error } = await supabase
        .from('sales')
        .select('sale_date, total_amount, discount_amount, customer_name')
        .eq('status', 'completed')
        .gte('sale_date', startDate.toISOString())
        .order('sale_date', { ascending: true });

      if (error) throw error;

      const dailyStats = {};
      data.forEach(sale => {
        const date = new Date(sale.sale_date).toISOString().split('T')[0];
        if (!dailyStats[date]) {
          dailyStats[date] = {
            date,
            sales_count: 0,
            total_revenue: 0,
            discount_amount: 0,
            customers: new Set()
          };
        }
        dailyStats[date].sales_count++;
        dailyStats[date].total_revenue += sale.total_amount || 0;
        dailyStats[date].discount_amount += sale.discount_amount || 0;
        if (sale.customer_name) dailyStats[date].customers.add(sale.customer_name);
      });

      const statsArray = Object.values(dailyStats).map(day => ({
        date: day.date,
        sales_count: day.sales_count,
        total_revenue: day.total_revenue,
        discount_amount: day.discount_amount,
        unique_customers: day.customers.size,
        avg_ticket: day.sales_count > 0 ? day.total_revenue / day.sales_count : 0
      }));

      setSalesData(prev => ({
        ...prev,
        dailyStats: statsArray
      }));
    } catch (error) {
      console.error('Erreur stats quotidiennes:', error);
      throw error;
    }
  };

  // Charger les statistiques mensuelles
  const loadMonthlyStats = async () => {
    try {
      const currentYear = new Date().getFullYear();
      const startDate = new Date(currentYear, 0, 1);

      const { data, error } = await supabase
        .from('sales')
        .select('sale_date, total_amount')
        .eq('status', 'completed')
        .gte('sale_date', startDate.toISOString());

      if (error) throw error;

      const monthlyStats = Array.from({ length: 12 }, (_, i) => ({
        month: new Date(currentYear, i, 1).toLocaleDateString('fr-FR', { month: 'short' }),
        month_number: i + 1,
        total_revenue: 0
      }));

      data.forEach(sale => {
        const month = new Date(sale.sale_date).getMonth();
        monthlyStats[month].total_revenue += sale.total_amount || 0;
      });

      setSalesData(prev => ({
        ...prev,
        monthlyStats
      }));
    } catch (error) {
      console.error('Erreur stats mensuelles:', error);
      throw error;
    }
  };

  // Charger les meilleurs clients
  const loadTopCustomers = async () => {
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .order('total_spent', { ascending: false })
        .limit(10);

      if (error) throw error;

      setSalesData(prev => ({
        ...prev,
        topCustomers: data || []
      }));
    } catch (error) {
      console.error('Erreur top clients:', error);
      throw error;
    }
  };

  // Charger les données produits
  const loadProductsData = async () => {
    try {
      const { data: products, error } = await supabase
        .from('products')
        .select('*');

      if (error) throw error;

      const totalStock = products.reduce((sum, p) => sum + (p.quantity || 0), 0);
      const totalValue = products.reduce((sum, p) => sum + ((p.quantity || 0) * (p.price || 0)), 0);
      const lowStockProducts = products.filter(p => (p.quantity || 0) < 10).length;

      const categoryStats = {};
      products.forEach(product => {
        const category = product.category || 'Non catégorisé';
        if (!categoryStats[category]) {
          categoryStats[category] = {
            count: 0,
            totalValue: 0,
            totalStock: 0
          };
        }
        categoryStats[category].count++;
        categoryStats[category].totalValue += (product.quantity || 0) * (product.price || 0);
        categoryStats[category].totalStock += product.quantity || 0;
      });

      const categories = Object.entries(categoryStats).map(([name, stats]) => ({
        name: name.length > 10 ? name.substring(0, 10) + '...' : name,
        fullName: name,
        produits: stats.count,
        valeur: stats.totalValue,
        stock: stats.totalStock
      }));

      const topProducts = [...products]
        .sort((a, b) => (b.quantity * b.price) - (a.quantity * a.price))
        .slice(0, 10)
        .map(p => ({
          id: p.id,
          name: p.name.length > 15 ? p.name.substring(0, 15) + '...' : p.name,
          fullName: p.name,
          sku: p.sku || 'N/A',
          valeur: (p.quantity || 0) * (p.price || 0),
          quantité: p.quantity || 0,
          prix: p.price || 0,
          category: p.category || 'Non catégorisé'
        }));

      const lowStockList = products
        .filter(p => (p.quantity || 0) < 10)
        .sort((a, b) => (a.quantity || 0) - (b.quantity || 0))
        .slice(0, 10)
        .map(p => ({
          id: p.id,
          name: p.name,
          sku: p.sku || 'N/A',
          category: p.category || 'Non catégorisé',
          quantity: p.quantity || 0,
          price: p.price || 0,
          stockValue: (p.quantity || 0) * (p.price || 0)
        }));

      setProductsData({
        totalProducts: products.length,
        totalStock,
        totalValue,
        lowStockProducts,
        categories: categories.sort((a, b) => b.valeur - a.valeur),
        topProducts,
        lowStockList
      });
    } catch (error) {
      console.error('Erreur données produits:', error);
      throw error;
    }
  };

  // Charger les statistiques de promotions
  const loadPromotionStats = async () => {
    try {
      const { data: salesWithPromotions, error } = await supabase
        .from('sales')
        .select('discount_amount, promotion_code')
        .eq('status', 'completed')
        .not('promotion_code', 'is', null)
        .gte('sale_date', getStartDateForPeriod(timeRange));

      if (error) throw error;

      const promotionSales = salesWithPromotions || [];
      const totalDiscountGiven = promotionSales.reduce((sum, sale) => sum + (sale.discount_amount || 0), 0);
      const promotionEffectiveness = salesStats.totalSales > 0 
        ? (promotionSales.length / salesStats.totalSales * 100)
        : 0;

      setPromotionsData({
        activePromotions: 0,
        totalDiscountGiven,
        mostUsedPromotion: null,
        promotionEffectiveness,
        promotionSalesCount: promotionSales.length,
        averagePromotionDiscount: promotionSales.length > 0 
          ? totalDiscountGiven / promotionSales.length
          : 0
      });
    } catch (error) {
      console.error('Erreur stats promotions:', error);
      throw error;
    }
  };

  const getStartDateForPeriod = (period) => {
    const today = new Date();
    const startDate = new Date();
    
    switch (period) {
      case '7days':
        startDate.setDate(today.getDate() - 7);
        break;
      case '30days':
        startDate.setDate(today.getDate() - 30);
        break;
      case '90days':
        startDate.setDate(today.getDate() - 90);
        break;
      case 'year':
        startDate.setFullYear(today.getFullYear() - 1);
        break;
      default:
        startDate.setDate(today.getDate() - 30);
    }
    
    return startDate.toISOString();
  };

  const formatCurrency = (amount) => {
    if (amount === undefined || amount === null) return '0,00 €';
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const formatNumber = (num) => {
    if (num === undefined || num === null) return '0';
    return new Intl.NumberFormat('fr-FR').format(num);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR');
  };

  const formatPaymentMethod = (method) => {
    const methods = {
      'cash': 'Espèces',
      'card': 'Carte bancaire',
      'check': 'Chèque',
      'transfer': 'Virement',
      'mobile': 'Mobile',
      'unknown': 'Non spécifié'
    };
    return methods[method] || method.charAt(0).toUpperCase() + method.slice(1);
  };

  const getSalesTrendData = () => {
    if (!salesData.dailyStats || salesData.dailyStats.length === 0) return [];
    
    return salesData.dailyStats.slice(0, 15).map(day => ({
      date: new Date(day.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }),
      ventes: day.sales_count || 0,
      revenue: day.total_revenue || 0,
      discount: day.discount_amount || 0,
      clients: day.unique_customers || 0,
      panierMoyen: day.avg_ticket || 0
    })).reverse();
  };

  const getTopProductsData = () => {
    if (!productsData.topProducts || productsData.topProducts.length === 0) return [];
    return productsData.topProducts.slice(0, 8);
  };

  const getCategoryData = () => {
    if (!productsData.categories || productsData.categories.length === 0) return [];
    return productsData.categories.slice(0, 8);
  };

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  const handleExport = async () => {
    try {
      let csvContent = "Type,Date,Valeur,Statut\n";
      
      salesData.allSales.forEach(sale => {
        csvContent += `Vente,${sale.sale_date},${sale.total_amount},${sale.status}\n`;
      });
      
      csvContent += `\nStatistiques Générales\n`;
      csvContent += `Total Ventes,${salesStats.totalSales}\n`;
      csvContent += `Revenu Total,${salesStats.totalRevenue}\n`;
      csvContent += `Remises Total,${salesStats.totalDiscounts}\n`;
      csvContent += `Panier Moyen,${salesStats.averageTicket}\n`;
      
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `rapport_analytics_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      showNotification('success', 'Rapport exporté avec succès!');
    } catch (error) {
      console.error('Erreur export:', error);
      showNotification('error', 'Erreur lors de l\'export');
    }
  };

  useEffect(() => {
    loadAllStats();
  }, [loadAllStats]);

  // Composant StatsCard minimaliste
  const StatsCard = ({ title, value, subtitle, icon: Icon, color = 'gray' }) => (
    <div className="bg-white rounded-lg border p-4 hover:shadow-sm transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500 mb-1">{title}</p>
          <p className="text-2xl font-semibold text-gray-900">{value}</p>
          {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
        </div>
        <div className={`p-2 rounded-lg bg-${color}-50`}>
          <Icon className={`w-5 h-5 text-${color}-600`} />
        </div>
      </div>
    </div>
  );

  // Composant pour la vue d'ensemble
  const OverviewTab = () => (
    <div className="space-y-6">
      {/* Grille de statistiques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Revenu total"
          value={formatCurrency(salesStats.totalRevenue)}
          subtitle={`${salesStats.totalSales} ventes`}
          icon={DollarSign}
          color="green"
        />
        <StatsCard
          title="Panier moyen"
          value={formatCurrency(salesStats.averageTicket)}
          subtitle="Net après remises"
          icon={ShoppingCart}
          color="blue"
        />
        <StatsCard
          title="Clients"
          value={salesStats.uniqueCustomers}
          subtitle={`${salesStats.totalSales} transactions`}
          icon={Users}
          color="purple"
        />
        <StatsCard
          title="Remises"
          value={formatCurrency(salesStats.totalDiscounts)}
          subtitle={`${promotionsData.promotionSalesCount} ventes avec promo`}
          icon={Tag}
          color="amber"
        />
      </div>

      {/* Graphiques principaux */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Évolution des ventes */}
        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-semibold text-gray-900">Évolution des ventes</h3>
              <p className="text-sm text-gray-500">30 derniers jours</p>
            </div>
            <select 
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="text-sm border rounded-lg px-3 py-1.5 bg-transparent"
            >
              <option value="7days">7 jours</option>
              <option value="30days">30 jours</option>
              <option value="90days">90 jours</option>
            </select>
          </div>
          <div className="h-64">
            {getSalesTrendData().length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={getSalesTrendData()}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" />
                  <XAxis dataKey="date" fontSize={12} />
                  <YAxis fontSize={12} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#3B82F6" 
                    fill="#3B82F6" 
                    fillOpacity={0.1}
                    name="Revenus (€)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400">
                <BarChart2 className="w-8 h-8 mr-2" />
                <span>Aucune donnée</span>
              </div>
            )}
          </div>
        </div>

        {/* Méthodes de paiement */}
        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-semibold text-gray-900">Méthodes de paiement</h3>
              <p className="text-sm text-gray-500">Répartition des revenus</p>
            </div>
          </div>
          <div className="h-64">
            {salesData.paymentStats && salesData.paymentStats.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={salesData.paymentStats}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="total_amount"
                    nameKey="payment_method"
                    label={({ payment_method, percent }) => 
                      `${formatPaymentMethod(payment_method)} ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {salesData.paymentStats.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={['#3B82F6', '#10B981', '#F59E0B', '#EF4444'][index % 4]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => [formatCurrency(value), 'Revenus']}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400">
                <CreditCard className="w-8 h-8 mr-2" />
                <span>Aucune donnée</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Top produits et clients */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top produits */}
        <div className="bg-white rounded-lg border">
          <div className="p-6 border-b">
            <h3 className="font-semibold text-gray-900">Top produits</h3>
            <p className="text-sm text-gray-500">Par valeur de stock</p>
          </div>
          <div className="p-6">
            {getTopProductsData().length > 0 ? (
              <div className="space-y-4">
                {getTopProductsData().slice(0, 5).map((product, index) => (
                  <div key={product.id || index} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center mr-3">
                        <Package className="w-4 h-4 text-gray-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{product.name}</p>
                        <p className="text-xs text-gray-500">{product.category}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">{formatCurrency(product.valeur)}</p>
                      <p className="text-xs text-gray-500">{product.quantité} unités</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400">
                <Package className="w-8 h-8 mx-auto mb-2" />
                <p>Aucun produit</p>
              </div>
            )}
          </div>
        </div>

        {/* Meilleurs clients */}
        <div className="bg-white rounded-lg border">
          <div className="p-6 border-b">
            <h3 className="font-semibold text-gray-900">Meilleurs clients</h3>
            <p className="text-sm text-gray-500">Par montant dépensé</p>
          </div>
          <div className="p-6">
            {salesData.topCustomers && salesData.topCustomers.length > 0 ? (
              <div className="space-y-4">
                {salesData.topCustomers.slice(0, 5).map((customer, index) => (
                  <div key={customer.id || index} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                        <Users className="w-4 h-4 text-gray-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {customer.name || 'Client anonyme'}
                        </p>
                        <p className="text-xs text-gray-500">
                          {customer.purchase_count || 0} achats
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        {formatCurrency(customer.total_spent || 0)}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatDate(customer.updated_at || customer.created_at)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400">
                <Users className="w-8 h-8 mx-auto mb-2" />
                <p>Aucun client</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  // Composant pour l'onglet Ventes
  const SalesTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border p-6">
        <h3 className="font-semibold text-gray-900 mb-6">Détails des ventes</h3>
        <div className="h-80">
          {salesData.dailyStats && salesData.dailyStats.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={salesData.dailyStats}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="sales_count" 
                  stroke="#3B82F6" 
                  name="Nombre de ventes"
                  strokeWidth={2}
                />
                <Line 
                  type="monotone" 
                  dataKey="unique_customers" 
                  stroke="#10B981" 
                  name="Clients uniques"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-400">
              <BarChart2 className="w-8 h-8 mr-2" />
              <span>Aucune donnée de vente</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // Composant pour l'onglet Produits
  const ProductsTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border p-6">
        <h3 className="font-semibold text-gray-900 mb-6">Inventaire</h3>
        <div className="h-80">
          {getCategoryData().length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={getCategoryData()}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="stock" name="Stock total" fill="#10B981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="produits" name="Nombre de produits" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-400">
              <Package className="w-8 h-8 mr-2" />
              <span>Aucune donnée produit</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // Composant pour l'onglet Revenus
  const RevenueTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border p-6">
        <h3 className="font-semibold text-gray-900 mb-6">Analyse des revenus</h3>
        <div className="h-80">
          {salesData.monthlyStats && salesData.monthlyStats.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesData.monthlyStats}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip 
                  formatter={(value) => [formatCurrency(value), 'Revenus']}
                />
                <Legend />
                <Bar 
                  dataKey="total_revenue" 
                  name="Revenus mensuels (€)" 
                  fill="#8B5CF6" 
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-400">
              <DollarSign className="w-8 h-8 mr-2" />
              <span>Aucune donnée de revenus</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {notification && (
        <Notification
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}

      {/* Header minimaliste */}
      <div className="sticky top-0 z-10 bg-white border-b">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Analytics</h1>
              <p className="text-sm text-gray-500">Tableau de bord des performances</p>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900"
              >
                <Filter className="w-4 h-4" />
                <span>Filtres</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </button>
              <button
                onClick={loadAllStats}
                disabled={loading}
                className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </button>
              <button
                onClick={handleExport}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 text-sm"
              >
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>
            </div>
          </div>
        </div>

        {/* Filtres (cachés par défaut) */}
        {showFilters && (
          <div className="px-6 py-4 border-t bg-gray-50">
            <div className="flex items-center space-x-4">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="text-sm border rounded-lg px-3 py-1.5 bg-white"
              >
                <option value="7days">7 derniers jours</option>
                <option value="30days">30 derniers jours</option>
                <option value="90days">90 derniers jours</option>
                <option value="year">Cette année</option>
              </select>
            </div>
          </div>
        )}

        {/* Tabs simplifiées */}
        <div className="px-6">
          <div className="flex space-x-4">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'overview'
                  ? 'border-gray-900 text-gray-900'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Vue d'ensemble
            </button>
            <button
              onClick={() => setActiveTab('sales')}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'sales'
                  ? 'border-gray-900 text-gray-900'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Ventes
            </button>
            <button
              onClick={() => setActiveTab('products')}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'products'
                  ? 'border-gray-900 text-gray-900'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Produits
            </button>
            <button
              onClick={() => setActiveTab('revenue')}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'revenue'
                  ? 'border-gray-900 text-gray-900'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Revenus
            </button>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="p-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mb-4"></div>
            <p className="text-gray-600">Chargement...</p>
          </div>
        ) : (
          <>
            {activeTab === 'overview' && <OverviewTab />}
            {activeTab === 'sales' && <SalesTab />}
            {activeTab === 'products' && <ProductsTab />}
            {activeTab === 'revenue' && <RevenueTab />}
          </>
        )}
      </div>

      {/* Footer minimal */}
      <div className="border-t bg-white px-6 py-4">
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div>
            <span>Dernière mise à jour: {new Date().toLocaleString('fr-FR', { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}</span>
          </div>
          <div>
            <span>{salesData.allSales.length} ventes analysées</span>
          </div>
        </div>
      </div>
    </div>
  );
}