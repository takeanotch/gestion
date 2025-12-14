// /* eslint-disable @typescript-eslint/no-explicit-any */

// // 'use client';

// // import React, { useState, useEffect, useCallback } from 'react';
// // import { 
// //   BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
// //   XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
// //   AreaChart, Area
// // } from 'recharts';
// // import { 
// //   TrendingUp, Package, ShoppingCart, DollarSign, 
// //   BarChart2, Calendar, Download, RefreshCw,
// //   CreditCard, Wallet, AlertCircle, Layers, Users, Star, TrendingDown,
// //   Percent, Target, ShoppingBag, Clock, Activity, ChevronRight,
// //   Tag, ArrowDownRight, FileText, CheckCircle, XCircle, BarChart3,
// //   ArrowUpRight, ArrowDownLeft, ActivitySquare, Store
// // } from 'lucide-react';
// // import Notification from '@/components/Notification';
// // import { 
// //   getSales, 
// //   getTopCustomers, 
// //   getTopProducts,
// //   getDailySales, 
// //   getMonthlySales, 
// //   getPaymentMethodsStats, 
// //   getProductsStats,
// //   getCategoriesStats, 
// //   getPerformanceStats,
// //   getLowStockProducts,
// //   getOutOfStockProducts,
// //   getDashboardStats,
// //   type Sale,
// //   type DailySales,
// //   type MonthlySales,
// //   type PaymentMethodStats,
// //   type ProductStats,
// //   type CategoryStats,
// //   type CustomerStats,
// //   type PerformanceStats
// // } from '@/lib/stats';
// // import { getAllProducts } from '@/lib/products';

// // // Types locaux
// // interface Product {
// //   id: string;
// //   name: string;
// //   sku: string;
// //   price: number;
// //   quantity: number;
// //   category?: string;
// //   supplier?: string;
// // }

// // interface ProductsData {
// //   totalProducts: number;
// //   totalStock: number;
// //   totalValue: number;
// //   lowStockProducts: number;
// //   categories: any[];
// //   topProducts: any[];
// //   lowStockList: any[];
// //   outOfStock: any[];
// // }

// // export default function StatsPage() {
// //   // États pour les données
// //   const [dashboardStats, setDashboardStats] = useState({
// //     today_sales: 0,
// //     today_revenue: 0,
// //     monthly_sales: 0,
// //     monthly_revenue: 0,
// //     low_stock_products: 0,
// //     out_of_stock_products: 0,
// //     top_selling_product: { name: '', quantity: 0 } as { name: string; quantity: number }
// //   });
  
// //   const [dailyStats, setDailyStats] = useState<DailySales[]>([]);
// //   const [monthlyStats, setMonthlyStats] = useState<MonthlySales[]>([]);
// //   const [paymentStats, setPaymentStats] = useState<PaymentMethodStats[]>([]);
// //   const [topCustomers, setTopCustomers] = useState<CustomerStats[]>([]);
// //   const [productStats, setProductStats] = useState<ProductStats[]>([]);
// //   const [categoryStats, setCategoryStats] = useState<CategoryStats[]>([]);
// //   const [performanceStats, setPerformanceStats] = useState<PerformanceStats>({
// //     total_sales: 0,
// //     total_revenue: 0,
// //     total_discounts: 0,
// //     average_ticket: 0,
// //     best_day: '',
// //     best_day_revenue: 0,
// //     unique_customers: 0,
// //     promotion_usage: 0
// //   });
  
// //   const [productsData, setProductsData] = useState<ProductsData>({
// //     totalProducts: 0,
// //     totalStock: 0,
// //     totalValue: 0,
// //     lowStockProducts: 0,
// //     categories: [],
// //     topProducts: [],
// //     lowStockList: [],
// //     outOfStock: []
// //   });

// //   const [totalSalesCount, setTotalSalesCount] = useState(0);
// //   const [totalRevenue, setTotalRevenue] = useState(0);

// //   // États UI
// //   const [loading, setLoading] = useState(true);
// //   const [notification, setNotification] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);
// //   const [activeTab, setActiveTab] = useState<'sales' | 'products' | 'revenue'>('sales');
// //   const [timeRange, setTimeRange] = useState<'7days' | '30days' | '90days' | 'year'>('30days');

// //   // Charger toutes les statistiques
// //   const loadAllStats = useCallback(async () => {
// //     setLoading(true);
// //     try {
// //       // Calculer les dates
// //       let startDate = '';
// //       const now = new Date();
      
// //       switch(timeRange) {
// //         case '7days':
// //           const weekAgo = new Date(now);
// //           weekAgo.setDate(now.getDate() - 7);
// //           startDate = weekAgo.toISOString().split('T')[0];
// //           break;
// //         case '30days':
// //           const monthAgo = new Date(now);
// //           monthAgo.setDate(now.getDate() - 30);
// //           startDate = monthAgo.toISOString().split('T')[0];
// //           break;
// //         case '90days':
// //           const ninetyDaysAgo = new Date(now);
// //           ninetyDaysAgo.setDate(now.getDate() - 90);
// //           startDate = ninetyDaysAgo.toISOString().split('T')[0];
// //           break;
// //         case 'year':
// //           const yearAgo = new Date(now);
// //           yearAgo.setFullYear(now.getFullYear() - 1);
// //           startDate = yearAgo.toISOString().split('T')[0];
// //           break;
// //       }

// //       // 1. Charger les statistiques de dashboard (sans filtre de période)
// //       const dashboard = await getDashboardStats();
// //       setDashboardStats(dashboard);
      
// //       // Calculer les totaux à partir des stats de dashboard
// //       setTotalSalesCount(dashboard.monthly_sales);
// //       setTotalRevenue(dashboard.monthly_revenue);

// //       // 2. Charger les statistiques de performance pour la période sélectionnée
// //       const performance = await getPerformanceStats(startDate, new Date().toISOString().split('T')[0]);
// //       setPerformanceStats(performance);

// //       // 3. Charger les statistiques quotidiennes
// //       const days = timeRange === '7days' ? 7 : timeRange === '30days' ? 30 : 90;
// //       const dailyStatsData = await getDailySales(days);
// //       setDailyStats(dailyStatsData);

// //       // 4. Charger les statistiques mensuelles
// //       const monthlyStatsData = await getMonthlySales(new Date().getFullYear());
// //       setMonthlyStats(monthlyStatsData);

// //       // 5. Charger les statistiques de paiement
// //       const paymentStatsData = await getPaymentMethodsStats();
// //       setPaymentStats(paymentStatsData);

// //       // 6. Charger les meilleurs clients
// //       const topCustomersData = await getTopCustomers(10);
// //       setTopCustomers(topCustomersData);

// //       // 7. Charger les statistiques des produits vendus
// //       const productStatsData = await getProductsStats();
// //       setProductStats(productStatsData.slice(0, 10));

// //       // 8. Charger les statistiques des catégories
// //       const categoryStatsData = await getCategoriesStats();
// //       setCategoryStats(categoryStatsData.slice(0, 8));

// //       // 9. Charger les données des produits en stock
// //       await loadProductsData();

// //     } catch (error) {
// //       console.error('Erreur chargement stats:', error);
// //       showNotification('error', '❌ Erreur lors du chargement des statistiques');
// //     } finally {
// //       setLoading(false);
// //     }
// //   }, [timeRange]);

// //   // Charger les données produits
// //   const loadProductsData = async () => {
// //     try {
// //       const products = await getAllProducts();
// //       const lowStockProducts = await getLowStockProducts(10);
// //       const outOfStockProducts = await getOutOfStockProducts();
      
// //       processProductsData(products, lowStockProducts, outOfStockProducts);
// //     } catch (error) {
// //       console.error('Erreur chargement produits:', error);
// //     }
// //   };

// //   // Traiter les données produits
// //   const processProductsData = (products: Product[], lowStockProducts: any[], outOfStockProducts: any[]) => {
// //     let totalStockValue = 0;
// //     let lowStockCount = 0;
// //     const categoryStatsMap: Record<string, any> = {};

// //     products.forEach(product => {
// //       const productValue = (product.quantity || 0) * (product.price || 0);
// //       totalStockValue += productValue;

// //       if (product.quantity && product.quantity < 10) {
// //         lowStockCount++;
// //       }

// //       const category = product.category || 'Non catégorisé';
// //       if (!categoryStatsMap[category]) {
// //         categoryStatsMap[category] = {
// //           count: 0,
// //           totalValue: 0,
// //           totalStock: 0,
// //           avgPrice: 0,
// //           products: []
// //         };
// //       }
// //       categoryStatsMap[category].count++;
// //       categoryStatsMap[category].totalValue += productValue;
// //       categoryStatsMap[category].totalStock += product.quantity || 0;
// //       categoryStatsMap[category].products.push(product);
// //     });

// //     const categoryData = Object.entries(categoryStatsMap).map(([name, stats]) => ({
// //       name: name.length > 10 ? name.substring(0, 10) + '...' : name,
// //       fullName: name,
// //       produits: stats.count,
// //       valeur: parseFloat(stats.totalValue.toFixed(2)),
// //       stock: stats.totalStock,
// //       prixMoyen: stats.count > 0 ? parseFloat((stats.totalValue / stats.count).toFixed(2)) : 0
// //     }));

// //     const topProducts = [...products]
// //       .sort((a, b) => ((b.quantity || 0) * (b.price || 0)) - ((a.quantity || 0) * (a.price || 0)))
// //       .slice(0, 10)
// //       .map(p => ({
// //         id: p.id,
// //         name: p.name.length > 15 ? p.name.substring(0, 15) + '...' : p.name,
// //         fullName: p.name,
// //         sku: p.sku || 'N/A',
// //         valeur: parseFloat(((p.quantity || 0) * (p.price || 0)).toFixed(2)),
// //         quantité: p.quantity || 0,
// //         prix: p.price || 0,
// //         category: p.category || 'Non catégorisé',
// //         min_stock: 10
// //       }));

// //     const allLowStock = [...lowStockProducts, ...outOfStockProducts];
// //     const lowStockList = allLowStock
// //       .slice(0, 10)
// //       .map(p => ({
// //         id: p.id,
// //         name: p.name,
// //         sku: p.sku || 'N/A',
// //         category: p.category || 'Non catégorisé',
// //         quantity: p.quantity || 0,
// //         price: p.price || 0,
// //         min_stock: 10,
// //         stockValue: (p.quantity || 0) * (p.price || 0)
// //       }));

// //     setProductsData({
// //       totalProducts: products.length,
// //       totalStock: products.reduce((sum, p) => sum + (p.quantity || 0), 0),
// //       totalValue: parseFloat(totalStockValue.toFixed(2)),
// //       lowStockProducts: lowStockCount,
// //       categories: categoryData.sort((a, b) => b.valeur - a.valeur),
// //       topProducts: topProducts,
// //       lowStockList: lowStockList.sort((a, b) => a.quantity - b.quantity),
// //       outOfStock: outOfStockProducts || []
// //     });
// //   };

// //   useEffect(() => {
// //     loadAllStats();
// //   }, [loadAllStats]);

// //   // Fonctions utilitaires
// //   const showNotification = (type: 'success' | 'error' | 'info', message: string) => {
// //     setNotification({ type, message });
// //     setTimeout(() => setNotification(null), 3000);
// //   };

// //   const formatCurrency = (amount: number) => {
// //     return new Intl.NumberFormat('fr-FR', {
// //       style: 'currency',
// //       currency: 'EUR',
// //       minimumFractionDigits: 2
// //     }).format(amount);
// //   };

// //   const formatDate = (dateString: string) => {
// //     if (!dateString) return '';
// //     try {
// //       const date = new Date(dateString);
// //       return date.toLocaleDateString('fr-FR');
// //     } catch {
// //       return dateString;
// //     }
// //   };

// //   const formatPaymentMethod = (method: string) => {
// //     const methods: Record<string, string> = {
// //       'cash': 'Espèces',
// //       'card': 'Carte bancaire',
// //       'check': 'Chèque',
// //       'transfer': 'Virement',
// //       'mobile': 'Mobile'
// //     };
// //     return methods[method] || method.charAt(0).toUpperCase() + method.slice(1);
// //   };

// //   // Fonctions pour les graphiques
// //   const getSalesTrendData = () => {
// //     return dailyStats.slice(-15);
// //   };

// //   const getTopProductsData = () => {
// //     return productsData.topProducts.slice(0, 8);
// //   };

// //   const getCategoryData = () => {
// //     return productsData.categories.slice(0, 8);
// //   };

// //   const CustomTooltip = ({ active, payload, label }: any) => {
// //     if (active && payload && payload.length) {
// //       return (
// //         <div className="bg-white p-3 border rounded-lg shadow-lg">
// //           <p className="font-semibold text-gray-900 mb-2">{label}</p>
// //           {payload.map((entry: any, index: number) => (
// //             <p key={index} className="text-sm" style={{ color: entry.color }}>
// //               {entry.name}: {
// //                 entry.name.includes('€') || 
// //                 entry.dataKey === 'revenue' || 
// //                 entry.dataKey === 'valeur' || 
// //                 entry.dataKey === 'prixMoyen' ||
// //                 entry.dataKey === 'panierMoyen' ||
// //                 entry.dataKey === 'total_revenue' ||
// //                 entry.dataKey === 'discount_amount' ||
// //                 entry.dataKey === 'total_amount'
// //                   ? formatCurrency(entry.value)
// //                   : entry.dataKey === 'promotion_usage' ||
// //                     entry.dataKey === 'percentage'
// //                   ? `${entry.value.toFixed(1)}%`
// //                   : entry.value.toLocaleString()
// //               }
// //             </p>
// //           ))}
// //         </div>
// //       );
// //     }
// //     return null;
// //   };

// //   // Calculer le total des ventes pour la période sélectionnée
// //   const getPeriodSalesCount = () => {
// //     if (timeRange === '7days') return dailyStats.reduce((sum, day) => sum + day.sales_count, 0);
// //     if (timeRange === '30days') return dailyStats.reduce((sum, day) => sum + day.sales_count, 0);
// //     if (timeRange === '90days') return dailyStats.reduce((sum, day) => sum + day.sales_count, 0);
// //     return dashboardStats.monthly_sales; // Pour 'year' ou période plus longue
// //   };

// //   const getPeriodRevenue = () => {
// //     if (timeRange === '7days') return dailyStats.reduce((sum, day) => sum + day.total_revenue, 0);
// //     if (timeRange === '30days') return dailyStats.reduce((sum, day) => sum + day.total_revenue, 0);
// //     if (timeRange === '90days') return dailyStats.reduce((sum, day) => sum + day.total_revenue, 0);
// //     return dashboardStats.monthly_revenue; // Pour 'year' ou période plus longue
// //   };

// //   // Composant pour l'onglet Ventes
// //   const SalesTab = () => {
// //     const periodSalesCount = getPeriodSalesCount();
// //     const periodRevenue = getPeriodRevenue();
    
// //     return (
// //       <div className="space-y-6 hi">
// //         {/* Cartes de statistiques */}
// //         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
// //           {/* Carte Revenus */}
// //           <div className="bg-white p-6 rounded-xl border shadow-sm hover:shadow-md transition-shadow">
// //             <div className="flex items-center justify-between mb-4">
// //               <div className="p-3 bg-blue-50 rounded-lg">
// //                 <DollarSign className="w-6 h-6 text-blue-600" />
// //               </div>
// //               <div className="flex items-center space-x-2">
// //                 {performanceStats.total_discounts > 0 && (
// //                   <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
// //                     -{formatCurrency(performanceStats.total_discounts)}
// //                   </span>
// //                 )}
// //                 <span className="text-sm font-medium text-gray-500">
// //                   {periodSalesCount} ventes
// //                 </span>
// //               </div>
// //             </div>
// //             <h3 className="text-xl font-bold text-gray-900 mb-1">
// //               {formatCurrency(periodRevenue)}
// //             </h3>
// //             <p className="text-gray-500">Revenu net</p>
// //             <div className="mt-3 pt-3 border-t border-gray-100">
// //               <div className="flex justify-between text-sm">
// //                 <span className="text-gray-500">Brut:</span>
// //                 <span>{formatCurrency(periodRevenue + performanceStats.total_discounts)}</span>
// //               </div>
// //               {performanceStats.total_discounts > 0 && (
// //                 <div className="flex justify-between text-sm text-green-600 mt-1">
// //                   <span>Remises:</span>
// //                   <span>-{formatCurrency(performanceStats.total_discounts)}</span>
// //                 </div>
// //               )}
// //             </div>
// //           </div>

// //           {/* Carte Transactions */}
// //           <div className="bg-white p-6 rounded-xl border shadow-sm hover:shadow-md transition-shadow">
// //             <div className="flex items-center justify-between mb-4">
// //               <div className="p-3 bg-green-50 rounded-lg">
// //                 <ShoppingCart className="w-6 h-6 text-green-600" />
// //               </div>
// //               <div className="flex items-center space-x-2">
// //                 <span className="text-sm font-medium text-gray-500">
// //                   {timeRange === '7days' ? '7 jours' : 
// //                    timeRange === '30days' ? '30 jours' : 
// //                    timeRange === '90days' ? '90 jours' : 'Année'}
// //                 </span>
// //               </div>
// //             </div>
// //             <h3 className="text-xl font-bold text-gray-900 mb-1">
// //               {periodSalesCount}
// //             </h3>
// //             <p className="text-gray-500">Transactions réussies</p>
// //             <div className="mt-3 pt-3 border-t border-gray-100">
// //               <div className="flex justify-between text-sm text-gray-500">
// //                 <span>Panier moyen:</span>
// //                 <span className="font-medium">
// //                   {periodSalesCount > 0 ? formatCurrency(periodRevenue / periodSalesCount) : formatCurrency(0)}
// //                 </span>
// //               </div>
// //               {dashboardStats.today_sales > 0 && (
// //                 <div className="flex justify-between text-sm text-gray-500 mt-1">
// //                   <span>Aujourd'hui:</span>
// //                   <span className="font-medium">{dashboardStats.today_sales} ventes</span>
// //                 </div>
// //               )}
// //             </div>
// //           </div>

// //           {/* Carte Clients */}
// //           <div className="bg-white p-6 rounded-xl border shadow-sm hover:shadow-md transition-shadow">
// //             <div className="flex items-center justify-between mb-4">
// //               <div className="p-3 bg-purple-50 rounded-lg">
// //                 <Users className="w-6 h-6 text-purple-600" />
// //               </div>
// //               <div className="flex items-center space-x-2">
// //                 <span className="text-sm font-medium text-purple-600">
// //                   {performanceStats.unique_customers} client{performanceStats.unique_customers !== 1 ? 's' : ''}
// //                 </span>
// //               </div>
// //             </div>
// //             <h3 className="text-xl font-bold text-gray-900 mb-1">
// //               {performanceStats.unique_customers.toLocaleString()}
// //             </h3>
// //             <p className="text-gray-500">Clients uniques</p>
// //             <div className="mt-3 pt-3 border-t border-gray-100">
// //               <div className="flex justify-between text-sm text-gray-500">
// //                 <span>Fidélisation:</span>
// //                 <span className="font-medium">78%</span>
// //               </div>
// //               <div className="flex justify-between text-sm text-gray-500 mt-1">
// //                 <span>Retour client:</span>
// //                 <span className="font-medium">42%</span>
// //               </div>
// //             </div>
// //           </div>

// //           {/* Carte Performances */}
// //           <div className="bg-white p-6 rounded-xl border shadow-sm hover:shadow-md transition-shadow">
// //             <div className="flex items-center justify-between mb-4">
// //               <div className="p-3 bg-amber-50 rounded-lg">
// //                 <TrendingUp className="w-6 h-6 text-amber-600" />
// //               </div>
// //               <div className="flex items-center space-x-2">
// //                 <span className="text-sm font-medium text-amber-700">
// //                   Promotions: {performanceStats.promotion_usage.toFixed(1)}%
// //                 </span>
// //               </div>
// //             </div>
// //             <h3 className="text-xl font-bold text-gray-900 mb-1">
// //               {periodSalesCount > 0 ? formatCurrency(periodRevenue / periodSalesCount) : formatCurrency(0)}
// //             </h3>
// //             <p className="text-gray-500">Panier moyen</p>
// //             <div className="mt-3 pt-3 border-t border-gray-100">
// //               <div className="flex justify-between text-sm text-gray-500">
// //                 <span>Utilisation promo:</span>
// //                 <span className="font-medium">{performanceStats.promotion_usage.toFixed(1)}%</span>
// //               </div>
// //               <div className="flex justify-between text-sm text-gray-500 mt-1">
// //                 <span>Remises totales:</span>
// //                 <span className="font-medium">{formatCurrency(performanceStats.total_discounts)}</span>
// //               </div>
// //             </div>
// //           </div>
// //         </div>

// //         {/* Graphiques */}
// //         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
// //           {/* Évolution des ventes quotidiennes */}
// //           <div className="bg-white p-6 rounded-xl border shadow-sm">
// //             <div className="flex items-center justify-between mb-6">
// //               <h3 className="text-lg font-semibold text-gray-900">
// //                 <TrendingUp className="w-5 h-5 inline mr-2 text-blue-600" />
// //                 Évolution des ventes ({timeRange === '7days' ? '7' : timeRange === '30days' ? '15' : '30'} derniers jours)
// //               </h3>
// //               <select 
// //                 value={timeRange}
// //                 onChange={(e) => setTimeRange(e.target.value as typeof timeRange)}
// //                 className="text-sm border rounded-lg px-3 py-1"
// //               >
// //                 <option value="7days">7 jours</option>
// //                 <option value="30days">30 jours</option>
// //                 <option value="90days">90 jours</option>
// //                 <option value="year">Année</option>
// //               </select>
// //             </div>
// //             <div className="h-80">
// //               {getSalesTrendData().length > 0 ? (
// //                 <ResponsiveContainer width="100%" height="100%">
// //                   <AreaChart data={getSalesTrendData()}>
// //                     <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
// //                     <XAxis dataKey="date" />
// //                     <YAxis yAxisId="left" />
// //                     <YAxis yAxisId="right" orientation="right" />
// //                     <Tooltip content={<CustomTooltip />} />
// //                     <Legend />
// //                     <Area 
// //                       yAxisId="left"
// //                       type="monotone" 
// //                       dataKey="total_revenue" 
// //                       stroke="#3B82F6" 
// //                       fill="#93C5FD" 
// //                       fillOpacity={0.6}
// //                       name="Revenus nets (€)"
// //                     />
// //                     <Line 
// //                       yAxisId="right"
// //                       type="monotone" 
// //                       dataKey="discount_amount" 
// //                       stroke="#EF4444" 
// //                       name="Remises (€)"
// //                       strokeWidth={2}
// //                     />
// //                   </AreaChart>
// //                 </ResponsiveContainer>
// //               ) : (
// //                 <div className="h-full flex flex-col items-center justify-center text-gray-500">
// //                   <BarChart2 className="w-12 h-12 mb-3 text-gray-300" />
// //                   <p>Aucune donnée de vente disponible</p>
// //                   <p className="text-sm">Les ventes apparaîtront ici</p>
// //                 </div>
// //               )}
// //             </div>
// //           </div>

// //           {/* Méthodes de paiement */}
// //           <div className="bg-white p-6 rounded-xl border shadow-sm">
// //             <div className="flex items-center justify-between mb-6">
// //               <h3 className="text-lg font-semibold text-gray-900">
// //                 <CreditCard className="w-5 h-5 inline mr-2 text-yellow-600" />
// //                 Méthodes de paiement
// //               </h3>
// //               <span className="text-sm text-gray-500">
// //                 {paymentStats?.length || 0} méthodes
// //               </span>
// //             </div>
// //             <div className="h-80">
// //               {paymentStats && paymentStats.length > 0 ? (
// //                 <div className="h-full flex flex-col">
// //                   <div className="flex-1">
// //                     <ResponsiveContainer width="100%" height="100%">
// //                       <PieChart>
// //                         <Pie
// //                           data={paymentStats}
// //                           cx="50%"
// //                           cy="50%"
// //                           labelLine={false}
// //                           label={({ payment_method, total_amount }) => 
// //                             `${formatPaymentMethod(payment_method)}: ${formatCurrency(total_amount)}`
// //                           }
// //                           outerRadius={80}
// //                           fill="#8884d8"
// //                           dataKey="total_amount"
// //                         >
// //                           {paymentStats.map((entry, index) => (
// //                             <Cell key={`cell-${index}`} fill={['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'][index % 6]} />
// //                           ))}
// //                         </Pie>
// //                         <Tooltip 
// //                           formatter={(value) => [formatCurrency(value as number), 'Revenus']}
// //                         />
// //                       </PieChart>
// //                     </ResponsiveContainer>
// //                   </div>
// //                   <div className="mt-4 grid grid-cols-2 gap-3">
// //                     {paymentStats.slice(0, 4).map((method, index) => (
// //                       <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
// //                         <div className="flex items-center">
// //                           <div 
// //                             className="w-3 h-3 rounded-full mr-2"
// //                             style={{ backgroundColor: ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'][index % 4] }}
// //                           ></div>
// //                           <div>
// //                             <div className="text-sm font-medium">{formatPaymentMethod(method.payment_method)}</div>
// //                             <div className="text-xs text-gray-500">
// //                               {method.count} transaction{method.count > 1 ? 's' : ''}
// //                             </div>
// //                           </div>
// //                         </div>
// //                         <div className="text-right">
// //                           <div className="font-medium">{formatCurrency(method.total_amount)}</div>
// //                           <div className="text-xs text-gray-500">
// //                             {periodRevenue > 0 ? 
// //                               `${((method.total_amount / periodRevenue) * 100).toFixed(1)}%` : 
// //                               '0%'}
// //                           </div>
// //                         </div>
// //                       </div>
// //                     ))}
// //                   </div>
// //                 </div>
// //               ) : (
// //                 <div className="h-full flex flex-col items-center justify-center text-gray-500">
// //                   <CreditCard className="w-12 h-12 mb-3 text-gray-300" />
// //                   <p>Aucune donnée de paiement</p>
// //                   <p className="text-sm">Les méthodes apparaîtront après les ventes</p>
// //                 </div>
// //               )}
// //             </div>
// //           </div>
// //         </div>

// //         {/* Meilleurs clients */}
// //         <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
// //           <div className="p-6 border-b">
// //             <div className="flex items-center justify-between">
// //               <h3 className="text-lg font-semibold text-gray-900">
// //                 <Users className="w-5 h-5 inline mr-2 text-green-600" />
// //                 Top clients
// //               </h3>
// //               <button className="text-sm text-purple-600 hover:text-purple-700 flex items-center">
// //                 Voir tout <ChevronRight className="w-4 h-4 ml-1" />
// //               </button>
// //             </div>
// //           </div>
// //           <div className="overflow-x-auto">
// //             {topCustomers && topCustomers.length > 0 ? (
// //               <table className="w-full">
// //                 <thead className="bg-gray-50">
// //                   <tr>
// //                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
// //                       Client
// //                     </th>
// //                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
// //                       Achats
// //                     </th>
// //                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
// //                       Total dépensé
// //                     </th>
// //                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
// //                       Dernier achat
// //                     </th>
// //                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
// //                       Valeur moyenne
// //                     </th>
// //                   </tr>
// //                 </thead>
// //                 <tbody className="divide-y divide-gray-200">
// //                   {topCustomers.slice(0, 8).map((customer, index) => (
// //                     <tr key={index} className="hover:bg-gray-50">
// //                       <td className="px-6 py-4">
// //                         <div className="font-medium text-gray-900">
// //                           {customer.customer_name || 'Client anonyme'}
// //                         </div>
// //                       </td>
// //                       <td className="px-6 py-4">
// //                         <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
// //                           {customer.purchase_count || 0}
// //                         </span>
// //                       </td>
// //                       <td className="px-6 py-4 font-bold text-gray-900">
// //                         {formatCurrency(customer.total_spent || 0)}
// //                       </td>
// //                       <td className="px-6 py-4 text-sm text-gray-600">
// //                         {formatDate(customer.last_purchase)}
// //                       </td>
// //                       <td className="px-6 py-4">
// //                         {customer.purchase_count > 0 ? 
// //                           formatCurrency((customer.total_spent || 0) / customer.purchase_count) : 
// //                           formatCurrency(0)}
// //                       </td>
// //                     </tr>
// //                   ))}
// //                 </tbody>
// //               </table>
// //             ) : (
// //               <div className="px-6 py-12 text-center text-gray-500">
// //                 <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
// //                 <p>Aucune donnée client disponible</p>
// //                 <p className="text-sm">Les clients apparaîtront après les ventes</p>
// //               </div>
// //             )}
// //           </div>
// //         </div>
// //       </div>
// //     );
// //   };

// //   // Composant pour l'onglet Produits
// //   const ProductsTab = () => (
// //     <div className="space-y-6">
// //       {/* Cartes de statistiques des produits */}
// //       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
// //         <div className="bg-white p-6 rounded-xl border shadow-sm hover:shadow-md transition-shadow">
// //           <div className="flex items-center justify-between mb-4">
// //             <div className="p-3 bg-green-50 rounded-lg">
// //               <Package className="w-6 h-6 text-green-600" />
// //             </div>
// //             <span className="text-sm font-medium text-gray-500">
// //               Stock
// //             </span>
// //           </div>
// //           <h3 className="text-xl font-bold text-gray-900 mb-1">
// //             {productsData.totalProducts.toLocaleString()}
// //           </h3>
// //           <p className="text-gray-500">Produits en stock</p>
// //           <div className="mt-3 pt-3 border-t border-gray-100 text-sm text-gray-500">
// //             <Layers className="w-4 h-4 inline mr-1" />
// //             {productsData.totalStock} unités totales
// //           </div>
// //         </div>

// //         <div className="bg-white p-6 rounded-xl border shadow-sm hover:shadow-md transition-shadow">
// //           <div className="flex items-center justify-between mb-4">
// //             <div className="p-3 bg-blue-50 rounded-lg">
// //               <DollarSign className="w-6 h-6 text-blue-600" />
// //             </div>
// //             <span className="text-sm font-medium text-blue-600">
// //               {formatCurrency(productsData.totalValue / 1000)}K
// //             </span>
// //           </div>
// //           <h3 className="text-xl font-bold text-gray-900 mb-1">
// //             {formatCurrency(productsData.totalValue)}
// //           </h3>
// //           <p className="text-gray-500">Total inventaire</p>
// //           <div className="mt-3 pt-3 border-t border-gray-100 text-sm text-gray-500">
// //             Valeur moyenne: {formatCurrency(productsData.totalProducts > 0 ? productsData.totalValue / productsData.totalProducts : 0)}
// //           </div>
// //         </div>

// //         <div className="bg-white p-6 rounded-xl border shadow-sm hover:shadow-md transition-shadow">
// //           <div className="flex items-center justify-between mb-4">
// //             <div className="p-3 bg-red-50 rounded-lg">
// //               <AlertCircle className="w-6 h-6 text-red-600" />
// //             </div>
// //             <span className={`text-sm font-medium ${
// //               productsData.lowStockProducts > 0 ? 'text-red-600' : 'text-green-600'
// //             }`}>
// //               {productsData.lowStockProducts || 0} faible{productsData.lowStockProducts !== 1 ? 's' : ''}
// //             </span>
// //           </div>
// //           <h3 className="text-xl font-bold text-gray-900 mb-1">
// //             {productsData.totalProducts?.toLocaleString() || 0}
// //           </h3>
// //           <p className="text-gray-500">Produits en stock</p>
// //           <div className="mt-3 pt-3 border-t border-gray-100 text-sm text-gray-500">
// //             <AlertCircle className="w-4 h-4 inline mr-1" />
// //             Seuil: &lt; 10 unités
// //           </div>
// //         </div>

// //         <div className="bg-white p-6 rounded-xl border shadow-sm hover:shadow-md transition-shadow">
// //           <div className="flex items-center justify-between mb-4">
// //             <div className="p-3 bg-purple-50 rounded-lg">
// //               <Layers className="w-6 h-6 text-purple-600" />
// //             </div>
// //             <span className="text-sm font-medium text-gray-500">
// //               {productsData.categories?.length || 0}
// //             </span>
// //           </div>
// //           <h3 className="text-xl font-bold text-gray-900 mb-1">
// //             {productsData.categories?.length || 0}
// //           </h3>
// //           <p className="text-gray-500">Catégories</p>
// //           <div className="mt-3 pt-3 border-t border-gray-100 text-sm text-gray-500">
// //             <BarChart2 className="w-4 h-4 inline mr-1" />
// //             Diversité des produits
// //           </div>
// //         </div>
// //       </div>

// //       {/* Graphiques des produits */}
// //       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
// //         {/* Top produits par valeur */}
// //         <div className="bg-white p-6 rounded-xl border shadow-sm">
// //           <div className="flex items-center justify-between mb-6">
// //             <h3 className="text-lg font-semibold text-gray-900">
// //               <Package className="w-5 h-5 inline mr-2 text-green-600" />
// //               Top produits (valeur du stock)
// //             </h3>
// //             <button className="text-sm text-purple-600 hover:text-purple-700">
// //               Voir top 20
// //             </button>
// //           </div>
// //           <div className="h-80">
// //             {getTopProductsData().length > 0 ? (
// //               <ResponsiveContainer width="100%" height="100%">
// //                 <BarChart data={getTopProductsData()}>
// //                   <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
// //                   <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} />
// //                   <YAxis />
// //                   <Tooltip content={<CustomTooltip />} />
// //                   <Legend />
// //                   <Bar dataKey="valeur" name="Valeur (€)" fill="#10B981" radius={[4, 4, 0, 0]} />
// //                   <Bar dataKey="quantité" name="Quantité" fill="#3B82F6" radius={[4, 4, 0, 0]} />
// //                 </BarChart>
// //               </ResponsiveContainer>
// //             ) : (
// //               <div className="h-full flex flex-col items-center justify-center text-gray-500">
// //                 <Package className="w-12 h-12 mb-3 text-gray-300" />
// //                 <p>Aucun produit en stock</p>
// //                 <p className="text-sm">Ajoutez des produits pour voir les statistiques</p>
// //               </div>
// //             )}
// //           </div>
// //         </div>

// //         {/* Stock par catégorie */}
// //         <div className="bg-white p-6 rounded-xl border shadow-sm">
// //           <div className="flex items-center justify-between mb-6">
// //             <h3 className="text-lg font-semibold text-gray-900">
// //               <BarChart2 className="w-5 h-5 inline mr-2 text-purple-600" />
// //               Stock par catégorie
// //             </h3>
// //             <div className="flex space-x-2">
// //               <button className="px-2 py-1 text-xs rounded bg-purple-100 text-purple-600">
// //                 Quantité
// //               </button>
// //               <button className="px-2 py-1 text-xs rounded bg-gray-100">
// //                 Valeur
// //               </button>
// //             </div>
// //           </div>
// //           <div className="h-80">
// //             {getCategoryData().length > 0 ? (
// //               <ResponsiveContainer width="100%" height="100%">
// //                 <BarChart data={getCategoryData()}>
// //                   <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
// //                   <XAxis dataKey="name" />
// //                   <YAxis />
// //                   <Tooltip content={<CustomTooltip />} />
// //                   <Legend />
// //                   <Bar dataKey="stock" name="Stock total" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
// //                 </BarChart>
// //               </ResponsiveContainer>
// //             ) : (
// //               <div className="h-full flex flex-col items-center justify-center text-gray-500">
// //                 <Layers className="w-12 h-12 mb-3 text-gray-300" />
// //                 <p>Aucune catégorie définie</p>
// //                 <p className="text-sm">Catégorisez vos produits pour voir les statistiques</p>
// //               </div>
// //             )}
// //           </div>
// //         </div>
// //       </div>

// //       {/* Tableau des produits à faible stock */}
// //       <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
// //         <div className="p-6 border-b">
// //           <div className="flex items-center justify-between">
// //             <div>
// //               <h3 className="text-lg font-semibold text-gray-900 flex items-center">
// //                 <AlertCircle className="w-5 h-5 inline mr-2 text-red-600" />
// //                 Produits à réapprovisionner
// //               </h3>
// //               <p className="text-sm text-gray-500 mt-1">
// //                 Produits avec un stock inférieur à 10 unités
// //               </p>
// //             </div>
// //             <div className="flex items-center space-x-3">
// //               <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
// //                 {productsData.lowStockProducts || 0} produit{productsData.lowStockProducts !== 1 ? 's' : ''}
// //               </span>
// //               <button className="text-sm text-purple-600 hover:text-purple-700 flex items-center">
// //                 Commander <ChevronRight className="w-4 h-4 ml-1" />
// //               </button>
// //             </div>
// //           </div>
// //         </div>
// //         <div className="overflow-x-auto">
// //           {productsData.lowStockList && productsData.lowStockList.length > 0 ? (
// //             <table className="w-full">
// //               <thead className="bg-gray-50">
// //                 <tr>
// //                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
// //                     Produit
// //                   </th>
// //                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
// //                     Catégorie
// //                   </th>
// //                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
// //                     Stock actuel
// //                   </th>
// //                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
// //                     Prix unitaire
// //                   </th>
// //                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
// //                     Valeur stock
// //                   </th>
// //                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
// //                     Statut
// //                   </th>
// //                 </tr>
// //               </thead>
// //               <tbody className="divide-y divide-gray-200">
// //                 {productsData.lowStockList.slice(0, 10).map((product, index) => (
// //                   <tr key={product.id || index} className="hover:bg-gray-50">
// //                     <td className="px-6 py-4">
// //                       <div className="font-medium text-gray-900">{product.name}</div>
// //                       <div className="text-sm text-gray-500">SKU: {product.sku || 'N/A'}</div>
// //                     </td>
// //                     <td className="px-6 py-4">
// //                       <span className="px-2 py-1 text-xs bg-gray-100 rounded-full">
// //                         {product.category || 'Non catégorisé'}
// //                       </span>
// //                     </td>
// //                     <td className="px-6 py-4">
// //                       <div className="flex items-center">
// //                         <div className="w-24 bg-gray-200 rounded-full h-2 mr-3">
// //                           <div 
// //                             className={`h-2 rounded-full ${
// //                               product.quantity < 3 ? 'bg-red-500' : 
// //                               product.quantity < 5 ? 'bg-yellow-500' : 'bg-orange-500'
// //                             }`}
// //                             style={{ width: `${(product.quantity / 10) * 100}%` }}
// //                           ></div>
// //                         </div>
// //                         <span className={`font-medium ${
// //                           product.quantity < 3 ? 'text-red-600' : 
// //                           product.quantity < 5 ? 'text-yellow-600' : 'text-orange-600'
// //                         }`}>
// //                           {product.quantity}
// //                         </span>
// //                       </div>
// //                     </td>
// //                     <td className="px-6 py-4">
// //                       {formatCurrency(product.price || 0)}
// //                     </td>
// //                     <td className="px-6 py-4 font-medium">
// //                       {formatCurrency(product.stockValue || 0)}
// //                     </td>
// //                     <td className="px-6 py-4">
// //                       <span className={`px-2 py-1 text-xs rounded-full ${
// //                         product.quantity === 0 
// //                           ? 'bg-red-100 text-red-800'
// //                           : product.quantity < 3 
// //                           ? 'bg-red-100 text-red-800'
// //                           : product.quantity < 5
// //                           ? 'bg-yellow-100 text-yellow-800'
// //                           : 'bg-orange-100 text-orange-800'
// //                       }`}>
// //                         {product.quantity === 0 ? 'RUPTURE' :
// //                          product.quantity < 3 ? 'CRITIQUE' : 
// //                          product.quantity < 5 ? 'FAIBLE' : 'MOYEN'}
// //                       </span>
// //                     </td>
// //                   </tr>
// //                 ))}
// //               </tbody>
// //             </table>
// //           ) : (
// //             <div className="px-6 py-12 text-center text-gray-500">
// //               <Package className="w-12 h-12 mx-auto mb-3 text-gray-300" />
// //               <p>Aucun produit à faible stock</p>
// //               <p className="text-sm">Tous les produits ont un stock suffisant</p>
// //             </div>
// //           )}
// //         </div>
// //       </div>
// //     </div>
// //   );

// //   // Composant pour l'onglet Revenus
// //   const RevenueTab = () => {
// //     const periodSalesCount = getPeriodSalesCount();
// //     const periodRevenue = getPeriodRevenue();
    
// //     return (
// //       <div className="space-y-6">
// //         {/* Cartes de statistiques des revenus */}
// //         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
// //           <div className="bg-white p-6 rounded-xl border shadow-sm hover:shadow-md transition-shadow">
// //             <div className="flex items-center justify-between mb-4">
// //               <div className="p-3 bg-green-50 rounded-lg">
// //                 <DollarSign className="w-6 h-6 text-green-600" />
// //               </div>
// //               <span className={`text-sm font-medium ${
// //                 dashboardStats.monthly_revenue > dashboardStats.today_revenue * 30 ? 'text-green-600' : 'text-red-600'
// //               }`}>
// //                 <TrendingUp className="w-4 h-4 inline mr-1" />
// //                 Mois
// //               </span>
// //             </div>
// //             <h3 className="text-xl font-bold text-gray-900 mb-1">
// //               {formatCurrency(dashboardStats.monthly_revenue)}
// //             </h3>
// //             <p className="text-gray-500">Revenus mensuels</p>
// //             <div className="mt-3 pt-3 border-t border-gray-100 text-sm text-gray-500">
// //               <div className="flex justify-between">
// //                 <span>Aujourd'hui:</span>
// //                 <span>{formatCurrency(dashboardStats.today_revenue)}</span>
// //               </div>
// //               <div className="flex justify-between text-green-600 mt-1">
// //                 <span>Ventes aujourd'hui:</span>
// //                 <span>{dashboardStats.today_sales}</span>
// //               </div>
// //             </div>
// //           </div>

// //           <div className="bg-white p-6 rounded-xl border shadow-sm hover:shadow-md transition-shadow">
// //             <div className="flex items-center justify-between mb-4">
// //               <div className="p-3 bg-blue-50 rounded-lg">
// //                 <ShoppingBag className="w-6 h-6 text-blue-600" />
// //               </div>
// //               <span className="text-sm font-medium text-blue-600">
// //                 Période: {timeRange}
// //               </span>
// //             </div>
// //             <h3 className="text-xl font-bold text-gray-900 mb-1">
// //               {periodSalesCount > 0 ? formatCurrency(periodRevenue / periodSalesCount) : formatCurrency(0)}
// //             </h3>
// //             <p className="text-gray-500">Ticket moyen</p>
// //             <div className="mt-3 pt-3 border-t border-gray-100 text-sm text-gray-500">
// //               <div className="flex justify-between">
// //                 <span>Ventes:</span>
// //                 <span>{periodSalesCount}</span>
// //               </div>
// //               <div className="flex justify-between text-green-600 mt-1">
// //                 <span>Total:</span>
// //                 <span>{formatCurrency(periodRevenue)}</span>
// //               </div>
// //             </div>
// //           </div>

// //           <div className="bg-white p-6 rounded-xl border shadow-sm hover:shadow-md transition-shadow">
// //             <div className="flex items-center justify-between mb-4">
// //               <div className="p-3 bg-purple-50 rounded-lg">
// //                 <Calendar className="w-6 h-6 text-purple-600" />
// //               </div>
// //               <span className="text-sm font-medium text-gray-500">
// //                 Ce mois
// //               </span>
// //             </div>
// //             <h3 className="text-xl font-bold text-gray-900 mb-1">
// //               {formatCurrency(dashboardStats.monthly_revenue)}
// //             </h3>
// //             <p className="text-gray-500">Revenus mensuels</p>
// //             <div className="mt-3 pt-3 border-t border-gray-100 text-sm text-gray-500">
// //               <div className="flex justify-between">
// //                 <span>Ventes:</span>
// //                 <span>{dashboardStats.monthly_sales}</span>
// //               </div>
// //               <div className="flex justify-between text-green-600 mt-1">
// //                 <span>Moyenne/jour:</span>
// //                 <span>{formatCurrency(dashboardStats.monthly_sales > 0 ? dashboardStats.monthly_revenue / dashboardStats.monthly_sales : 0)}</span>
// //               </div>
// //             </div>
// //           </div>

// //           <div className="bg-white p-6 rounded-xl border shadow-sm hover:shadow-md transition-shadow">
// //             <div className="flex items-center justify-between mb-4">
// //               <div className="p-3 bg-amber-50 rounded-lg">
// //                 <Tag className="w-6 h-6 text-amber-600" />
// //               </div>
// //               <span className="text-sm font-medium text-amber-600">
// //                 Remises: {performanceStats.promotion_usage.toFixed(1)}%
// //               </span>
// //             </div>
// //             <h3 className="text-xl font-bold text-gray-900 mb-1">
// //               {formatCurrency(performanceStats.total_discounts || 0)}
// //             </h3>
// //             <p className="text-gray-500">Total remises</p>
// //             <div className="mt-3 pt-3 border-t border-gray-100 text-sm text-gray-500">
// //               <div className="flex justify-between">
// //                 <span>Efficacité:</span>
// //                 <span>{performanceStats.promotion_usage.toFixed(1)}%</span>
// //               </div>
// //               <div className="flex justify-between text-gray-500 mt-1">
// //                 <span>% du revenu:</span>
// //                 <span>{periodRevenue > 0 ? ((performanceStats.total_discounts / periodRevenue) * 100).toFixed(1) : '0'}%</span>
// //               </div>
// //             </div>
// //           </div>
// //         </div>

// //         {/* Graphiques des revenus */}
// //         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
// //           {/* Évolution des revenus mensuels */}
// //           <div className="bg-white p-6 rounded-xl border shadow-sm">
// //             <div className="flex items-center justify-between mb-6">
// //               <h3 className="text-lg font-semibold text-gray-900">
// //                 <TrendingUp className="w-5 h-5 inline mr-2 text-blue-600" />
// //                 Évolution des revenus ({new Date().getFullYear()})
// //               </h3>
// //             </div>
// //             <div className="h-80">
// //               {monthlyStats && monthlyStats.length > 0 ? (
// //                 <ResponsiveContainer width="100%" height="100%">
// //                   <LineChart data={monthlyStats}>
// //                     <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
// //                     <XAxis dataKey="month" />
// //                     <YAxis />
// //                     <Tooltip 
// //                       formatter={(value) => [formatCurrency(value as number), 'Revenus']}
// //                     />
// //                     <Legend />
// //                     <Line 
// //                       type="monotone" 
// //                       dataKey="total_revenue" 
// //                       stroke="#3B82F6" 
// //                       name="Revenus nets (€)"
// //                       strokeWidth={3}
// //                     />
// //                   </LineChart>
// //                 </ResponsiveContainer>
// //               ) : (
// //                 <div className="h-full flex flex-col items-center justify-center text-gray-500">
// //                   <BarChart2 className="w-12 h-12 mb-3 text-gray-300" />
// //                   <p>Aucune donnée de revenus disponible</p>
// //                   <p className="text-sm">Les revenus apparaîtront ici</p>
// //                 </div>
// //               )}
// //             </div>
// //           </div>

// //           {/* Performances quotidiennes */}
// //           <div className="bg-white p-6 rounded-xl border shadow-sm">
// //             <div className="flex items-center justify-between mb-6">
// //               <h3 className="text-lg font-semibold text-gray-900">
// //                 <Activity className="w-5 h-5 inline mr-2 text-green-600" />
// //                 Performances quotidiennes
// //               </h3>
// //               <select 
// //                 value={timeRange}
// //                 onChange={(e) => setTimeRange(e.target.value as typeof timeRange)}
// //                 className="text-sm border rounded-lg px-3 py-1"
// //               >
// //                 <option value="7days">7 jours</option>
// //                 <option value="30days">30 jours</option>
// //                 <option value="90days">90 jours</option>
// //                 <option value="year">Année</option>
// //               </select>
// //             </div>
// //             <div className="h-80">
// //               {dailyStats && dailyStats.length > 0 ? (
// //                 <ResponsiveContainer width="100%" height="100%">
// //                   <BarChart data={dailyStats.slice(0, 14)}>
// //                     <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
// //                     <XAxis dataKey="date" />
// //                     <YAxis />
// //                     <Tooltip 
// //                       formatter={(value, name) => {
// //                         if (name === 'total_revenue') {
// //                           return [formatCurrency(value as number), 'Revenus'];
// //                         }
// //                         return [value, name === 'sales_count' ? 'Ventes' : name];
// //                       }}
// //                     />
// //                     <Legend />
// //                     <Bar 
// //                       dataKey="total_revenue" 
// //                       name="Revenus (€)" 
// //                       fill="#10B981" 
// //                       radius={[4, 4, 0, 0]}
// //                     />
// //                     <Bar 
// //                       dataKey="sales_count" 
// //                       name="Nombre de ventes" 
// //                       fill="#3B82F6" 
// //                       radius={[4, 4, 0, 0]}
// //                     />
// //                   </BarChart>
// //                 </ResponsiveContainer>
// //               ) : (
// //                 <div className="h-full flex flex-col items-center justify-center text-gray-500">
// //                   <Activity className="w-12 h-12 mb-3 text-gray-300" />
// //                   <p>Aucune donnée de performances</p>
// //                   <p className="text-sm">Les performances apparaîtront après les ventes</p>
// //                 </div>
// //               )}
// //             </div>
// //           </div>
// //         </div>
// //       </div>
// //     );
// //   };

// //   return (
// //     <div className="h-screen flex flex-col bg-gray-50">
// //       {notification && (
// //         <Notification
// //           type={notification.type}
// //           message={notification.message}
// //           onClose={() => setNotification(null)}
// //         />
// //       )}

// //       {/* Header */}
// //       <div className="sticky top-0 z-10 bg-white border-b hid">
// //         <div className="px-6 py-4">
// //           <div className="flex items-center justify-between">
// //             <div className="flex items-center space-x-3">
// //               <div className="p-2 bg-purple-50 rounded-lg">
// //                 <BarChart3 className="w-6 h-6 text-purple-600" />
// //               </div>
// //               <div>
// //                 <h1 className="text-xl font-bold text-gray-900">Rapports & Statistiques</h1>
// //                 <div className="flex items-center space-x-4 text-sm text-gray-500">
// //                   <span>Analyse avancée avec remises et promotions</span>
// //                   <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
// //                   <span>{dashboardStats.monthly_sales} ventes ce mois</span>
// //                 </div>
// //               </div>
// //             </div>
            
// //             <div className="flex items-center space-x-3">
// //               <button
// //                 onClick={() => loadAllStats()}
// //                 className="flex items-center space-x-2 px-4 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
// //               >
// //                 <RefreshCw className="w-4 h-4" />
// //                 <span className="text-sm">Actualiser</span>
// //               </button>
// //             </div>
// //           </div>
// //         </div>

// //         {/* Filtres */}
// //         <div className="px-6 py-4 border-t bg-gray-50">
// //           <div className="flex items-center justify-between">
// //             <div className="flex items-center space-x-4">
// //               <div className="flex items-center space-x-2">
// //                 <Calendar className="w-5 h-5 text-gray-500" />
// //                 <div className="flex flex-wrap gap-2">
// //                   {['7days', '30days', '90days', 'year'].map((p) => {
// //                     const labels: Record<string, string> = {
// //                       '7days': '7 jours',
// //                       '30days': '30 jours',
// //                       '90days': '90 jours',
// //                       'year': 'Année'
// //                     };
// //                     return (
// //                       <button
// //                         key={p}
// //                         onClick={() => setTimeRange(p as typeof timeRange)}
// //                         className={`flex items-center space-x-1 px-3 py-1.5 text-sm rounded-lg transition-colors ${
// //                           timeRange === p
// //                             ? 'bg-purple-600 text-white'
// //                             : 'bg-white text-gray-600 hover:bg-gray-100 border'
// //                         }`}
// //                       >
// //                         <span>{labels[p]}</span>
// //                       </button>
// //                     );
// //                   })}
// //                 </div>
// //               </div>
// //             </div>
            
// //             <button
// //               onClick={loadAllStats}
// //               disabled={loading}
// //               className="flex items-center space-x-2 px-3 py-1.5 bg-white border rounded-lg hover:bg-gray-50 disabled:opacity-50"
// //             >
// //               <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
// //               <span className="text-sm">Actualiser</span>
// //             </button>
// //           </div>
// //         </div>

// //         {/* Tabs */}
// //         <div className="px-6 border-t">
// //           <div className="flex space-x-1">
// //             <button
// //               onClick={() => setActiveTab('sales')}
// //               className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors flex items-center ${
// //                 activeTab === 'sales'
// //                   ? 'border-purple-600 text-purple-600'
// //                   : 'border-transparent text-gray-500 hover:text-gray-700'
// //               }`}
// //             >
// //               <ShoppingCart className="w-4 h-4 mr-2" />
// //               Ventes
// //               <span className="ml-2 px-2 py-0.5 bg-purple-100 text-purple-600 text-xs rounded-full">
// //                 {dashboardStats.monthly_sales}
// //               </span>
// //             </button>
// //             <button
// //               onClick={() => setActiveTab('products')}
// //               className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors flex items-center ${
// //                 activeTab === 'products'
// //                   ? 'border-purple-600 text-purple-600'
// //                   : 'border-transparent text-gray-500 hover:text-gray-700'
// //               }`}
// //             >
// //               <Package className="w-4 h-4 mr-2" />
// //               Produits
// //               <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-600 text-xs rounded-full">
// //                 {productsData.totalProducts}
// //               </span>
// //             </button>
// //             <button
// //               onClick={() => setActiveTab('revenue')}
// //               className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors flex items-center ${
// //                 activeTab === 'revenue'
// //                   ? 'border-purple-600 text-purple-600'
// //                   : 'border-transparent text-gray-500 hover:text-gray-700'
// //               }`}
// //             >
// //               <DollarSign className="w-4 h-4 mr-2" />
// //               Revenus
// //               <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-600 text-xs rounded-full">
// //                 {formatCurrency(dashboardStats.monthly_revenue).replace('€', '').trim()}
// //               </span>
// //             </button>
// //           </div>
// //         </div>
// //       </div>

// //       {/* Contenu principal */}
// //       <div className="flex-1 overflow-auto p-6 hi">
// //         {loading ? (
// //           <div className="flex items-center justify-center h-full">
// //             <div className="text-center">
// //               <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
// //               <p className="text-gray-600">Chargement des statistiques...</p>
// //             </div>
// //           </div>
// //         ) : (
// //           <>
// //             {activeTab === 'sales' && <SalesTab />}
// //             {activeTab === 'products' && <ProductsTab />}
// //             {activeTab === 'revenue' && <RevenueTab />}
// //           </>
// //         )}
// //       </div>

// //       {/* Footer */}
// //       <div className="border-t bg-white px-6 py-4">
// //         <div className="flex items-center justify-between text-sm text-gray-500">
// //           <div>
// //             <span>Dernière mise à jour: {new Date().toLocaleString('fr-FR')}</span>
// //             {performanceStats.total_discounts > 0 && (
// //               <span className="ml-4 text-green-600">
// //                 Remises totales: {formatCurrency(performanceStats.total_discounts)}
// //               </span>
// //             )}
// //           </div>
// //           <div className="flex items-center space-x-4">
// //             <span>{dashboardStats.monthly_sales} ventes ce mois</span>
// //             <span className="text-green-600">
// //               Revenu: {formatCurrency(dashboardStats.monthly_revenue)}
// //             </span>
// //             <button
// //               onClick={() => window.print()}
// //               className="text-purple-600 hover:text-purple-700 flex items-center"
// //             >
// //               <Download className="w-4 h-4 mr-1" />
// //               Imprimer
// //             </button>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

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
//   ArrowUpRight, ArrowDownLeft, ActivitySquare, Store
// } from 'lucide-react';
// import Notification from '@/components/Notification';
// import { 
//   getSales, 
//   getTopCustomers, 
//   getTopProducts,
//   getDailySales, 
//   getMonthlySales, 
//   getPaymentMethodsStats, 
//   getProductsStats,
//   getCategoriesStats, 
//   getPerformanceStats,
//   getLowStockProducts,
//   getOutOfStockProducts,
//   getDashboardStats,
//   type Sale,
//   type DailySales,
//   type MonthlySales,
//   type PaymentMethodStats,
//   type ProductStats,
//   type CategoryStats,
//   type CustomerStats,
//   type PerformanceStats
// } from '@/lib/stats';
// import { getAllProducts } from '@/lib/products';

// // Types locaux
// interface Product {
//   id: string;
//   name: string;
//   sku: string;
//   price: number;
//   quantity: number;
//   category?: string;
//   supplier?: string;
// }

// interface ProductsData {
//   totalProducts: number;
//   totalStock: number;
//   totalValue: number;
//   lowStockProducts: number;
//   categories: any[];
//   topProducts: any[];
//   lowStockList: any[];
//   outOfStock: any[];
// }

// interface DashboardStats {
//   today_sales: number;
//   today_revenue: number;
//   monthly_sales: number;
//   monthly_revenue: number;
//   low_stock_products: number;
//   out_of_stock_products: number;
//   top_selling_product: { name: string; quantity: number };
// }

// interface TooltipProps {
//   active?: boolean;
//   payload?: any[];
//   label?: string;
// }

// export default function StatsPage() {
//   // États pour les données
//   const [dashboardStats, setDashboardStats] = useState<DashboardStats>({
//     today_sales: 0,
//     today_revenue: 0,
//     monthly_sales: 0,
//     monthly_revenue: 0,
//     low_stock_products: 0,
//     out_of_stock_products: 0,
//     top_selling_product: { name: '', quantity: 0 }
//   });
  
//   const [dailyStats, setDailyStats] = useState<DailySales[]>([]);
//   const [monthlyStats, setMonthlyStats] = useState<MonthlySales[]>([]);
//   const [paymentStats, setPaymentStats] = useState<PaymentMethodStats[]>([]);
//   const [topCustomers, setTopCustomers] = useState<CustomerStats[]>([]);
//   const [productStats, setProductStats] = useState<ProductStats[]>([]);
//   const [categoryStats, setCategoryStats] = useState<CategoryStats[]>([]);
//   const [performanceStats, setPerformanceStats] = useState<PerformanceStats>({
//     total_sales: 0,
//     total_revenue: 0,
//     total_discounts: 0,
//     average_ticket: 0,
//     best_day: '',
//     best_day_revenue: 0,
//     unique_customers: 0,
//     promotion_usage: 0
//   });
  
//   const [productsData, setProductsData] = useState<ProductsData>({
//     totalProducts: 0,
//     totalStock: 0,
//     totalValue: 0,
//     lowStockProducts: 0,
//     categories: [],
//     topProducts: [],
//     lowStockList: [],
//     outOfStock: []
//   });

//   const [totalSalesCount, setTotalSalesCount] = useState(0);
//   const [totalRevenue, setTotalRevenue] = useState(0);

//   // États UI
//   const [loading, setLoading] = useState(true);
//   const [notification, setNotification] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);
//   const [activeTab, setActiveTab] = useState<'sales' | 'products' | 'revenue'>('sales');
//   const [timeRange, setTimeRange] = useState<'7days' | '30days' | '90days' | 'year'>('30days');
//   const [isMobile, setIsMobile] = useState(false);

//   // Détecter la taille de l'écran
//   useEffect(() => {
//     const checkMobile = () => {
//       setIsMobile(window.innerWidth < 768);
//     };
    
//     checkMobile();
//     window.addEventListener('resize', checkMobile);
    
//     return () => window.removeEventListener('resize', checkMobile);
//   }, []);

//   // Charger toutes les statistiques
//   const loadAllStats = useCallback(async () => {
//     setLoading(true);
//     try {
//       // Calculer les dates
//       let startDate = '';
//       const now = new Date();
      
//       switch(timeRange) {
//         case '7days':
//           const weekAgo = new Date(now);
//           weekAgo.setDate(now.getDate() - 7);
//           startDate = weekAgo.toISOString().split('T')[0];
//           break;
//         case '30days':
//           const monthAgo = new Date(now);
//           monthAgo.setDate(now.getDate() - 30);
//           startDate = monthAgo.toISOString().split('T')[0];
//           break;
//         case '90days':
//           const ninetyDaysAgo = new Date(now);
//           ninetyDaysAgo.setDate(now.getDate() - 90);
//           startDate = ninetyDaysAgo.toISOString().split('T')[0];
//           break;
//         case 'year':
//           const yearAgo = new Date(now);
//           yearAgo.setFullYear(now.getFullYear() - 1);
//           startDate = yearAgo.toISOString().split('T')[0];
//           break;
//       }

//       // 1. Charger les statistiques de dashboard (sans filtre de période)
//       const dashboard = await getDashboardStats();
//       setDashboardStats(dashboard);
      
//       // Calculer les totaux à partir des stats de dashboard
//       setTotalSalesCount(dashboard.monthly_sales);
//       setTotalRevenue(dashboard.monthly_revenue);

//       // 2. Charger les statistiques de performance pour la période sélectionnée
//       const performance = await getPerformanceStats(startDate, new Date().toISOString().split('T')[0]);
//       setPerformanceStats(performance);

//       // 3. Charger les statistiques quotidiennes
//       const days = timeRange === '7days' ? 7 : timeRange === '30days' ? 30 : 90;
//       const dailyStatsData = await getDailySales(days);
//       setDailyStats(dailyStatsData);

//       // 4. Charger les statistiques mensuelles
//       const monthlyStatsData = await getMonthlySales(new Date().getFullYear());
//       setMonthlyStats(monthlyStatsData);

//       // 5. Charger les statistiques de paiement
//       const paymentStatsData = await getPaymentMethodsStats();
//       setPaymentStats(paymentStatsData);

//       // 6. Charger les meilleurs clients
//       const topCustomersData = await getTopCustomers(10);
//       setTopCustomers(topCustomersData);

//       // 7. Charger les statistiques des produits vendus
//       const productStatsData = await getProductsStats();
//       setProductStats(productStatsData.slice(0, 10));

//       // 8. Charger les statistiques des catégories
//       const categoryStatsData = await getCategoriesStats();
//       setCategoryStats(categoryStatsData.slice(0, 8));

//       // 9. Charger les données des produits en stock
//       await loadProductsData();

//     } catch (error) {
//       console.error('Erreur chargement stats:', error);
//       showNotification('error', '❌ Erreur lors du chargement des statistiques');
//     } finally {
//       setLoading(false);
//     }
//   }, [timeRange]);

//   // Charger les données produits
//   const loadProductsData = async () => {
//     try {
//       const products = await getAllProducts();
//       const lowStockProducts = await getLowStockProducts(10);
//       const outOfStockProducts = await getOutOfStockProducts();
      
//       processProductsData(products, lowStockProducts, outOfStockProducts);
//     } catch (error) {
//       console.error('Erreur chargement produits:', error);
//     }
//   };

//   // Traiter les données produits
//   const processProductsData = (products: Product[], lowStockProducts: any[], outOfStockProducts: any[]) => {
//     let totalStockValue = 0;
//     let lowStockCount = 0;
//     const categoryStatsMap: Record<string, any> = {};

//     products.forEach(product => {
//       const productValue = (product.quantity || 0) * (product.price || 0);
//       totalStockValue += productValue;

//       if (product.quantity && product.quantity < 10) {
//         lowStockCount++;
//       }

//       const category = product.category || 'Non catégorisé';
//       if (!categoryStatsMap[category]) {
//         categoryStatsMap[category] = {
//           count: 0,
//           totalValue: 0,
//           totalStock: 0,
//           avgPrice: 0,
//           products: []
//         };
//       }
//       categoryStatsMap[category].count++;
//       categoryStatsMap[category].totalValue += productValue;
//       categoryStatsMap[category].totalStock += product.quantity || 0;
//       categoryStatsMap[category].products.push(product);
//     });

//     const categoryData = Object.entries(categoryStatsMap).map(([name, stats]) => ({
//       name: name.length > 10 ? name.substring(0, 10) + '...' : name,
//       fullName: name,
//       produits: stats.count,
//       valeur: parseFloat(stats.totalValue.toFixed(2)),
//       stock: stats.totalStock,
//       prixMoyen: stats.count > 0 ? parseFloat((stats.totalValue / stats.count).toFixed(2)) : 0
//     }));

//     const topProducts = [...products]
//       .sort((a, b) => ((b.quantity || 0) * (b.price || 0)) - ((a.quantity || 0) * (a.price || 0)))
//       .slice(0, 10)
//       .map(p => ({
//         id: p.id,
//         name: p.name.length > 15 ? p.name.substring(0, 15) + '...' : p.name,
//         fullName: p.name,
//         sku: p.sku || 'N/A',
//         valeur: parseFloat(((p.quantity || 0) * (p.price || 0)).toFixed(2)),
//         quantité: p.quantity || 0,
//         prix: p.price || 0,
//         category: p.category || 'Non catégorisé',
//         min_stock: 10
//       }));

//     const allLowStock = [...lowStockProducts, ...outOfStockProducts];
//     const lowStockList = allLowStock
//       .slice(0, 10)
//       .map(p => ({
//         id: p.id,
//         name: p.name,
//         sku: p.sku || 'N/A',
//         category: p.category || 'Non catégorisé',
//         quantity: p.quantity || 0,
//         price: p.price || 0,
//         min_stock: 10,
//         stockValue: (p.quantity || 0) * (p.price || 0)
//       }));

//     setProductsData({
//       totalProducts: products.length,
//       totalStock: products.reduce((sum, p) => sum + (p.quantity || 0), 0),
//       totalValue: parseFloat(totalStockValue.toFixed(2)),
//       lowStockProducts: lowStockCount,
//       categories: categoryData.sort((a, b) => b.valeur - a.valeur),
//       topProducts: topProducts,
//       lowStockList: lowStockList.sort((a, b) => a.quantity - b.quantity),
//       outOfStock: outOfStockProducts || []
//     });
//   };

//   useEffect(() => {
//     loadAllStats();
//   }, [loadAllStats]);

//   // Fonctions utilitaires
//   const showNotification = (type: 'success' | 'error' | 'info', message: string) => {
//     setNotification({ type, message });
//     setTimeout(() => setNotification(null), 3000);
//   };

//   const formatCurrency = (amount: number) => {
//     return new Intl.NumberFormat('fr-FR', {
//       style: 'currency',
//       currency: 'EUR',
//       minimumFractionDigits: 2
//     }).format(amount);
//   };

//   const formatDate = (dateString: string) => {
//     if (!dateString) return '';
//     try {
//       const date = new Date(dateString);
//       return isMobile ? date.toLocaleDateString('fr-FR', { month: 'short', day: 'numeric' }) : 
//              date.toLocaleDateString('fr-FR');
//     } catch {
//       return dateString;
//     }
//   };

//   const formatPaymentMethod = (method: string) => {
//     const methods: Record<string, string> = {
//       'cash': 'Espèces',
//       'card': 'Carte bancaire',
//       'check': 'Chèque',
//       'transfer': 'Virement',
//       'mobile': 'Mobile'
//     };
//     return methods[method] || method.charAt(0).toUpperCase() + method.slice(1);
//   };

//   // Fonctions pour les graphiques
//   const getSalesTrendData = () => {
//     return dailyStats.slice(-(isMobile ? 7 : 15));
//   };

//   const getTopProductsData = () => {
//     return productsData.topProducts.slice(0, isMobile ? 5 : 8);
//   };

//   const getCategoryData = () => {
//     return productsData.categories.slice(0, isMobile ? 5 : 8);
//   };

//   const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
//     if (active && payload && payload.length) {
//       return (
//         <div className="bg-white p-3 border rounded-lg shadow-lg z-50">
//           <p className="font-semibold text-gray-900 mb-2">{label}</p>
//           {payload.map((entry: any, index: number) => (
//             <p key={index} className="text-sm" style={{ color: entry.color }}>
//               {entry.name}: {
//                 entry.name.includes('€') || 
//                 entry.dataKey === 'revenue' || 
//                 entry.dataKey === 'valeur' || 
//                 entry.dataKey === 'prixMoyen' ||
//                 entry.dataKey === 'panierMoyen' ||
//                 entry.dataKey === 'total_revenue' ||
//                 entry.dataKey === 'discount_amount' ||
//                 entry.dataKey === 'total_amount'
//                   ? formatCurrency(entry.value)
//                   : entry.dataKey === 'promotion_usage' ||
//                     entry.dataKey === 'percentage'
//                   ? `${entry.value.toFixed(1)}%`
//                   : entry.value.toLocaleString()
//               }
//             </p>
//           ))}
//         </div>
//       );
//     }
//     return null;
//   };

//   // Calculer le total des ventes pour la période sélectionnée
//   const getPeriodSalesCount = () => {
//     if (timeRange === '7days') return dailyStats.reduce((sum, day) => sum + day.sales_count, 0);
//     if (timeRange === '30days') return dailyStats.reduce((sum, day) => sum + day.sales_count, 0);
//     if (timeRange === '90days') return dailyStats.reduce((sum, day) => sum + day.sales_count, 0);
//     return dashboardStats.monthly_sales; // Pour 'year' ou période plus longue
//   };

//   const getPeriodRevenue = () => {
//     if (timeRange === '7days') return dailyStats.reduce((sum, day) => sum + day.total_revenue, 0);
//     if (timeRange === '30days') return dailyStats.reduce((sum, day) => sum + day.total_revenue, 0);
//     if (timeRange === '90days') return dailyStats.reduce((sum, day) => sum + day.total_revenue, 0);
//     return dashboardStats.monthly_revenue; // Pour 'year' ou période plus longue
//   };

//   // Composant pour l'onglet Ventes
//   const SalesTab = () => {
//     const periodSalesCount = getPeriodSalesCount();
//     const periodRevenue = getPeriodRevenue();
    
//     return (
//       <div className="space-y-4 md:space-y-6">
//         {/* Cartes de statistiques */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
//           {/* Carte Revenus */}
//           <div className="bg-white p-4 md:p-6 rounded-xl border shadow-sm hover:shadow-md transition-shadow">
//             <div className="flex items-center justify-between mb-3 md:mb-4">
//               <div className="p-2 md:p-3 bg-blue-50 rounded-lg">
//                 <DollarSign className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
//               </div>
//               <div className="flex items-center space-x-1 md:space-x-2">
//                 {performanceStats.total_discounts > 0 && (
//                   <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
//                     -{formatCurrency(performanceStats.total_discounts)}
//                   </span>
//                 )}
//                 <span className="text-xs md:text-sm font-medium text-gray-500">
//                   {periodSalesCount} ventes
//                 </span>
//               </div>
//             </div>
//             <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-1 truncate">
//               {formatCurrency(periodRevenue)}
//             </h3>
//             <p className="text-gray-500 text-sm md:text-base">Revenu net</p>
//             <div className="mt-3 pt-3 border-t border-gray-100">
//               <div className="flex justify-between text-xs md:text-sm">
//                 <span className="text-gray-500">Brut:</span>
//                 <span>{formatCurrency(periodRevenue + performanceStats.total_discounts)}</span>
//               </div>
//               {performanceStats.total_discounts > 0 && (
//                 <div className="flex justify-between text-xs md:text-sm text-green-600 mt-1">
//                   <span>Remises:</span>
//                   <span>-{formatCurrency(performanceStats.total_discounts)}</span>
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Carte Transactions */}
//           <div className="bg-white p-4 md:p-6 rounded-xl border shadow-sm hover:shadow-md transition-shadow">
//             <div className="flex items-center justify-between mb-3 md:mb-4">
//               <div className="p-2 md:p-3 bg-green-50 rounded-lg">
//                 <ShoppingCart className="w-5 h-5 md:w-6 md:h-6 text-green-600" />
//               </div>
//               <div className="flex items-center space-x-1 md:space-x-2">
//                 <span className="text-xs md:text-sm font-medium text-gray-500 truncate">
//                   {timeRange === '7days' ? '7 jours' : 
//                    timeRange === '30days' ? '30 jours' : 
//                    timeRange === '90days' ? '90 jours' : 'Année'}
//                 </span>
//               </div>
//             </div>
//             <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-1">
//               {periodSalesCount}
//             </h3>
//             <p className="text-gray-500 text-sm md:text-base">Transactions réussies</p>
//             <div className="mt-3 pt-3 border-t border-gray-100">
//               <div className="flex justify-between text-xs md:text-sm text-gray-500">
//                 <span>Panier moyen:</span>
//                 <span className="font-medium truncate">
//                   {periodSalesCount > 0 ? formatCurrency(periodRevenue / periodSalesCount) : formatCurrency(0)}
//                 </span>
//               </div>
//               {dashboardStats.today_sales > 0 && (
//                 <div className="flex justify-between text-xs md:text-sm text-gray-500 mt-1">
//                   <span>Aujourdhui:</span>
//                   <span className="font-medium">{dashboardStats.today_sales} ventes</span>
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Carte Clients */}
//           <div className="bg-white p-4 md:p-6 rounded-xl border shadow-sm hover:shadow-md transition-shadow">
//             <div className="flex items-center justify-between mb-3 md:mb-4">
//               <div className="p-2 md:p-3 bg-purple-50 rounded-lg">
//                 <Users className="w-5 h-5 md:w-6 md:h-6 text-purple-600" />
//               </div>
//               <div className="flex items-center space-x-1 md:space-x-2">
//                 <span className="text-xs md:text-sm font-medium text-purple-600 truncate">
//                   {performanceStats.unique_customers} client{performanceStats.unique_customers !== 1 ? 's' : ''}
//                 </span>
//               </div>
//             </div>
//             <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-1">
//               {performanceStats.unique_customers.toLocaleString()}
//             </h3>
//             <p className="text-gray-500 text-sm md:text-base">Clients uniques</p>
//             <div className="mt-3 pt-3 border-t border-gray-100">
//               <div className="flex justify-between text-xs md:text-sm text-gray-500">
//                 <span>Fidélisation:</span>
//                 <span className="font-medium">78%</span>
//               </div>
//               <div className="flex justify-between text-xs md:text-sm text-gray-500 mt-1">
//                 <span>Retour client:</span>
//                 <span className="font-medium">42%</span>
//               </div>
//             </div>
//           </div>

//           {/* Carte Performances */}
//           <div className="bg-white p-4 md:p-6 rounded-xl border shadow-sm hover:shadow-md transition-shadow">
//             <div className="flex items-center justify-between mb-3 md:mb-4">
//               <div className="p-2 md:p-3 bg-amber-50 rounded-lg">
//                 <TrendingUp className="w-5 h-5 md:w-6 md:h-6 text-amber-600" />
//               </div>
//               <div className="flex items-center space-x-1 md:space-x-2">
//                 <span className="text-xs md:text-sm font-medium text-amber-700 truncate">
//                   Promotions: {performanceStats.promotion_usage.toFixed(1)}%
//                 </span>
//               </div>
//             </div>
//             <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-1 truncate">
//               {periodSalesCount > 0 ? formatCurrency(periodRevenue / periodSalesCount) : formatCurrency(0)}
//             </h3>
//             <p className="text-gray-500 text-sm md:text-base">Panier moyen</p>
//             <div className="mt-3 pt-3 border-t border-gray-100">
//               <div className="flex justify-between text-xs md:text-sm text-gray-500">
//                 <span>Utilisation promo:</span>
//                 <span className="font-medium">{performanceStats.promotion_usage.toFixed(1)}%</span>
//               </div>
//               <div className="flex justify-between text-xs md:text-sm text-gray-500 mt-1">
//                 <span>Remises totales:</span>
//                 <span className="font-medium truncate">{formatCurrency(performanceStats.total_discounts)}</span>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Graphiques */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
//           {/* Évolution des ventes quotidiennes */}
//           <div className="bg-white p-4 md:p-6 rounded-xl border shadow-sm">
//             <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 md:mb-6 gap-2">
//               <h3 className="text-base md:text-lg font-semibold text-gray-900 truncate">
//                 <TrendingUp className="w-4 h-4 md:w-5 md:h-5 inline mr-2 text-blue-600" />
//                 Évolution des ventes ({timeRange === '7days' ? '7' : timeRange === '30days' ? '15' : '30'} derniers jours)
//               </h3>
//               <select 
//                 value={timeRange}
//                 onChange={(e) => setTimeRange(e.target.value as typeof timeRange)}
//                 className="text-sm border rounded-lg px-3 py-1 w-full sm:w-auto"
//               >
//                 <option value="7days">7 jours</option>
//                 <option value="30days">30 jours</option>
//                 <option value="90days">90 jours</option>
//                 <option value="year">Année</option>
//               </select>
//             </div>
//             <div className="h-64 md:h-80">
//               {getSalesTrendData().length > 0 ? (
//                 <ResponsiveContainer width="100%" height="100%">
//                   <AreaChart data={getSalesTrendData()}>
//                     <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
//                     <XAxis dataKey="date" fontSize={isMobile ? 10 : 12} />
//                     <YAxis fontSize={isMobile ? 10 : 12} />
//                     <YAxis yAxisId="left" />
//                     <YAxis yAxisId="right" orientation="right" fontSize={isMobile ? 10 : 12} />
//                     <Tooltip content={<CustomTooltip />} />
//                     <Legend wrapperStyle={{ fontSize: isMobile ? '10px' : '12px' }} />
//                     <Area 
//                       yAxisId="left"
//                       type="monotone" 
//                       dataKey="total_revenue" 
//                       stroke="#3B82F6" 
//                       fill="#93C5FD" 
//                       fillOpacity={0.6}
//                       name="Revenus nets"
//                     />
//                     <Line 
//                       yAxisId="right"
//                       type="monotone" 
//                       dataKey="discount_amount" 
//                       stroke="#EF4444" 
//                       name="Remises"
//                       strokeWidth={2}
//                     />
//                   </AreaChart>
//                 </ResponsiveContainer>
//               ) : (
//                 <div className="h-full flex flex-col items-center justify-center text-gray-500 p-4">
//                   <BarChart2 className="w-8 h-8 md:w-12 md:h-12 mb-2 md:mb-3 text-gray-300" />
//                   <p className="text-sm md:text-base text-center">Aucune donnée de vente disponible</p>
//                   <p className="text-xs md:text-sm text-center">Les ventes apparaîtront ici</p>
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Méthodes de paiement */}
//           <div className="bg-white p-4 md:p-6 rounded-xl border shadow-sm">
//             <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 md:mb-6 gap-2">
//               <h3 className="text-base md:text-lg font-semibold text-gray-900 truncate">
//                 <CreditCard className="w-4 h-4 md:w-5 md:h-5 inline mr-2 text-yellow-600" />
//                 Méthodes de paiement
//               </h3>
//               <span className="text-xs md:text-sm text-gray-500">
//                 {paymentStats?.length || 0} méthodes
//               </span>
//             </div>
//             <div className="h-64 md:h-80">
//               {paymentStats && paymentStats.length > 0 ? (
//                 <div className="h-full flex flex-col">
//                   <div className="flex-1">
//                     <ResponsiveContainer width="100%" height="100%">
//                       <PieChart>
//                         <Pie
//                           data={paymentStats}
//                           cx="50%"
//                           cy="50%"
//                           labelLine={false}
//                           label={({ payment_method, total_amount }) => 
//                             `${formatPaymentMethod(payment_method)}: ${formatCurrency(total_amount)}`
//                           }
//                           outerRadius={isMobile ? 60 : 80}
//                           fill="#8884d8"
//                           dataKey="total_amount"
//                         >
//                           {paymentStats.map((entry, index) => (
//                             <Cell key={`cell-${index}`} fill={['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'][index % 6]} />
//                           ))}
//                         </Pie>
//                         <Tooltip 
//                           formatter={(value) => [formatCurrency(value as number), 'Revenus']}
//                         />
//                         <Legend wrapperStyle={{ fontSize: isMobile ? '10px' : '12px' }} />
//                       </PieChart>
//                     </ResponsiveContainer>
//                   </div>
//                   <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-3">
//                     {paymentStats.slice(0, 4).map((method, index) => (
//                       <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
//                         <div className="flex items-center truncate">
//                           <div 
//                             className="w-3 h-3 rounded-full mr-2 flex-shrink-0"
//                             style={{ backgroundColor: ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'][index % 4] }}
//                           ></div>
//                           <div className="truncate">
//                             <div className="text-xs md:text-sm font-medium truncate">{formatPaymentMethod(method.payment_method)}</div>
//                             <div className="text-xs text-gray-500">
//                               {method.count} transaction{method.count > 1 ? 's' : ''}
//                             </div>
//                           </div>
//                         </div>
//                         <div className="text-right ml-2">
//                           <div className="font-medium text-xs md:text-sm truncate">{formatCurrency(method.total_amount)}</div>
//                           <div className="text-xs text-gray-500">
//                             {periodRevenue > 0 ? 
//                               `${((method.total_amount / periodRevenue) * 100).toFixed(1)}%` : 
//                               '0%'}
//                           </div>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               ) : (
//                 <div className="h-full flex flex-col items-center justify-center text-gray-500 p-4">
//                   <CreditCard className="w-8 h-8 md:w-12 md:h-12 mb-2 md:mb-3 text-gray-300" />
//                   <p className="text-sm md:text-base text-center">Aucune donnée de paiement</p>
//                   <p className="text-xs md:text-sm text-center">Les méthodes apparaîtront après les ventes</p>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Meilleurs clients */}
//         <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
//           <div className="p-4 md:p-6 border-b">
//             <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
//               <h3 className="text-base md:text-lg font-semibold text-gray-900 truncate">
//                 <Users className="w-4 h-4 md:w-5 md:h-5 inline mr-2 text-green-600" />
//                 Top clients
//               </h3>
//               <button className="text-xs md:text-sm text-purple-600 hover:text-purple-700 flex items-center self-start sm:self-auto">
//                 Voir tout <ChevronRight className="w-3 h-3 md:w-4 md:h-4 ml-1" />
//               </button>
//             </div>
//           </div>
//           <div className="overflow-x-auto">
//             {topCustomers && topCustomers.length > 0 ? (
//               <table className="w-full min-w-[600px]">
//                 <thead className="bg-gray-50">
//                   <tr>
//                     <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
//                       Client
//                     </th>
//                     <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
//                       Achats
//                     </th>
//                     <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
//                       Total dépensé
//                     </th>
//                     <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
//                       Dernier achat
//                     </th>
//                     <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
//                       Valeur moyenne
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-gray-200">
//                   {topCustomers.slice(0, 8).map((customer, index) => (
//                     <tr key={index} className="hover:bg-gray-50">
//                       <td className="px-4 py-3">
//                         <div className="font-medium text-gray-900 truncate max-w-[120px]">
//                           {customer.customer_name || 'Client anonyme'}
//                         </div>
//                       </td>
//                       <td className="px-4 py-3">
//                         <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
//                           {customer.purchase_count || 0}
//                         </span>
//                       </td>
//                       <td className="px-4 py-3 font-bold text-gray-900 truncate">
//                         {formatCurrency(customer.total_spent || 0)}
//                       </td>
//                       <td className="px-4 py-3 text-xs md:text-sm text-gray-600">
//                         {formatDate(customer.last_purchase)}
//                       </td>
//                       <td className="px-4 py-3 truncate">
//                         {customer.purchase_count > 0 ? 
//                           formatCurrency((customer.total_spent || 0) / customer.purchase_count) : 
//                           formatCurrency(0)}
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             ) : (
//               <div className="px-4 md:px-6 py-8 md:py-12 text-center text-gray-500">
//                 <Users className="w-8 h-8 md:w-12 md:h-12 mx-auto mb-2 md:mb-3 text-gray-300" />
//                 <p className="text-sm md:text-base">Aucune donnée client disponible</p>
//                 <p className="text-xs md:text-sm">Les clients apparaîtront après les ventes</p>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     );
//   };

//   // Composant pour l'onglet Produits
//   const ProductsTab = () => (
//     <div className="space-y-4 md:space-y-6">
//       {/* Cartes de statistiques des produits */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
//         <div className="bg-white p-4 md:p-6 rounded-xl border shadow-sm hover:shadow-md transition-shadow">
//           <div className="flex items-center justify-between mb-3 md:mb-4">
//             <div className="p-2 md:p-3 bg-green-50 rounded-lg">
//               <Package className="w-5 h-5 md:w-6 md:h-6 text-green-600" />
//             </div>
//             <span className="text-xs md:text-sm font-medium text-gray-500">
//               Stock
//             </span>
//           </div>
//           <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-1">
//             {productsData.totalProducts.toLocaleString()}
//           </h3>
//           <p className="text-gray-500 text-sm md:text-base">Produits en stock</p>
//           <div className="mt-3 pt-3 border-t border-gray-100 text-xs md:text-sm text-gray-500">
//             <Layers className="w-3 h-3 md:w-4 md:h-4 inline mr-1" />
//             {productsData.totalStock} unités totales
//           </div>
//         </div>

//         <div className="bg-white p-4 md:p-6 rounded-xl border shadow-sm hover:shadow-md transition-shadow">
//           <div className="flex items-center justify-between mb-3 md:mb-4">
//             <div className="p-2 md:p-3 bg-blue-50 rounded-lg">
//               <DollarSign className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
//             </div>
//             <span className="text-xs md:text-sm font-medium text-blue-600 truncate">
//               {formatCurrency(productsData.totalValue / 1000)}K
//             </span>
//           </div>
//           <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-1 truncate">
//             {formatCurrency(productsData.totalValue)}
//           </h3>
//           <p className="text-gray-500 text-sm md:text-base">Total inventaire</p>
//           <div className="mt-3 pt-3 border-t border-gray-100 text-xs md:text-sm text-gray-500 truncate">
//             Valeur moyenne: {formatCurrency(productsData.totalProducts > 0 ? productsData.totalValue / productsData.totalProducts : 0)}
//           </div>
//         </div>

//         <div className="bg-white p-4 md:p-6 rounded-xl border shadow-sm hover:shadow-md transition-shadow">
//           <div className="flex items-center justify-between mb-3 md:mb-4">
//             <div className="p-2 md:p-3 bg-red-50 rounded-lg">
//               <AlertCircle className="w-5 h-5 md:w-6 md:h-6 text-red-600" />
//             </div>
//             <span className={`text-xs md:text-sm font-medium ${
//               productsData.lowStockProducts > 0 ? 'text-red-600' : 'text-green-600'
//             }`}>
//               {productsData.lowStockProducts || 0} faible{productsData.lowStockProducts !== 1 ? 's' : ''}
//             </span>
//           </div>
//           <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-1">
//             {productsData.totalProducts?.toLocaleString() || 0}
//           </h3>
//           <p className="text-gray-500 text-sm md:text-base">Produits en stock</p>
//           <div className="mt-3 pt-3 border-t border-gray-100 text-xs md:text-sm text-gray-500">
//             <AlertCircle className="w-3 h-3 md:w-4 md:h-4 inline mr-1" />
//             Seuil: &lt; 10 unités
//           </div>
//         </div>

//         <div className="bg-white p-4 md:p-6 rounded-xl border shadow-sm hover:shadow-md transition-shadow">
//           <div className="flex items-center justify-between mb-3 md:mb-4">
//             <div className="p-2 md:p-3 bg-purple-50 rounded-lg">
//               <Layers className="w-5 h-5 md:w-6 md:h-6 text-purple-600" />
//             </div>
//             <span className="text-xs md:text-sm font-medium text-gray-500">
//               {productsData.categories?.length || 0}
//             </span>
//           </div>
//           <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-1">
//             {productsData.categories?.length || 0}
//           </h3>
//           <p className="text-gray-500 text-sm md:text-base">Catégories</p>
//           <div className="mt-3 pt-3 border-t border-gray-100 text-xs md:text-sm text-gray-500">
//             <BarChart2 className="w-3 h-3 md:w-4 md:h-4 inline mr-1" />
//             Diversité des produits
//           </div>
//         </div>
//       </div>

//       {/* Graphiques des produits */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
//         {/* Top produits par valeur */}
//         <div className="bg-white p-4 md:p-6 rounded-xl border shadow-sm">
//           <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 md:mb-6 gap-2">
//             <h3 className="text-base md:text-lg font-semibold text-gray-900 truncate">
//               <Package className="w-4 h-4 md:w-5 md:h-5 inline mr-2 text-green-600" />
//               Top produits (valeur du stock)
//             </h3>
//             <button className="text-xs md:text-sm text-purple-600 hover:text-purple-700 self-start sm:self-auto">
//               Voir top 20
//             </button>
//           </div>
//           <div className="h-64 md:h-80">
//             {getTopProductsData().length > 0 ? (
//               <ResponsiveContainer width="100%" height="100%">
//                 <BarChart data={getTopProductsData()}>
//                   <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
//                   <XAxis 
//                     dataKey="name" 
//                     angle={isMobile ? -45 : 0} 
//                     textAnchor={isMobile ? "end" : "middle"} 
//                     height={isMobile ? 80 : 60} 
//                     fontSize={isMobile ? 10 : 12}
//                   />
//                   <YAxis fontSize={isMobile ? 10 : 12} />
//                   <Tooltip content={<CustomTooltip />} />
//                   <Legend wrapperStyle={{ fontSize: isMobile ? '10px' : '12px' }} />
//                   <Bar dataKey="valeur" name="Valeur (€)" fill="#10B981" radius={[4, 4, 0, 0]} />
//                   <Bar dataKey="quantité" name="Quantité" fill="#3B82F6" radius={[4, 4, 0, 0]} />
//                 </BarChart>
//               </ResponsiveContainer>
//             ) : (
//               <div className="h-full flex flex-col items-center justify-center text-gray-500 p-4">
//                 <Package className="w-8 h-8 md:w-12 md:h-12 mb-2 md:mb-3 text-gray-300" />
//                 <p className="text-sm md:text-base text-center">Aucun produit en stock</p>
//                 <p className="text-xs md:text-sm text-center">Ajoutez des produits pour voir les statistiques</p>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Stock par catégorie */}
//         <div className="bg-white p-4 md:p-6 rounded-xl border shadow-sm">
//           <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 md:mb-6 gap-2">
//             <h3 className="text-base md:text-lg font-semibold text-gray-900 truncate">
//               <BarChart2 className="w-4 h-4 md:w-5 md:h-5 inline mr-2 text-purple-600" />
//               Stock par catégorie
//             </h3>
//             <div className="flex space-x-2 self-start sm:self-auto">
//               <button className="px-2 py-1 text-xs rounded bg-purple-100 text-purple-600">
//                 Quantité
//               </button>
//               <button className="px-2 py-1 text-xs rounded bg-gray-100">
//                 Valeur
//               </button>
//             </div>
//           </div>
//           <div className="h-64 md:h-80">
//             {getCategoryData().length > 0 ? (
//               <ResponsiveContainer width="100%" height="100%">
//                 <BarChart data={getCategoryData()}>
//                   <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
//                   <XAxis dataKey="name" fontSize={isMobile ? 10 : 12} />
//                   <YAxis fontSize={isMobile ? 10 : 12} />
//                   <Tooltip content={<CustomTooltip />} />
//                   <Legend wrapperStyle={{ fontSize: isMobile ? '10px' : '12px' }} />
//                   <Bar dataKey="stock" name="Stock total" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
//                 </BarChart>
//               </ResponsiveContainer>
//             ) : (
//               <div className="h-full flex flex-col items-center justify-center text-gray-500 p-4">
//                 <Layers className="w-8 h-8 md:w-12 md:h-12 mb-2 md:mb-3 text-gray-300" />
//                 <p className="text-sm md:text-base text-center">Aucune catégorie définie</p>
//                 <p className="text-xs md:text-sm text-center">Catégorisez vos produits pour voir les statistiques</p>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Tableau des produits à faible stock */}
//       <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
//         <div className="p-4 md:p-6 border-b">
//           <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
//             <div className="flex-1">
//               <h3 className="text-base md:text-lg font-semibold text-gray-900 flex items-center">
//                 <AlertCircle className="w-4 h-4 md:w-5 md:h-5 inline mr-2 text-red-600" />
//                 Produits à réapprovisionner
//               </h3>
//               <p className="text-xs md:text-sm text-gray-500 mt-1">
//                 Produits avec un stock inférieur à 10 unités
//               </p>
//             </div>
//             <div className="flex items-center space-x-2 self-start sm:self-auto">
//               <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs md:text-sm font-medium whitespace-nowrap">
//                 {productsData.lowStockProducts || 0} produit{productsData.lowStockProducts !== 1 ? 's' : ''}
//               </span>
//               <button className="text-xs md:text-sm text-purple-600 hover:text-purple-700 flex items-center">
//                 Commander <ChevronRight className="w-3 h-3 md:w-4 md:h-4 ml-1" />
//               </button>
//             </div>
//           </div>
//         </div>
//         <div className="overflow-x-auto">
//           {productsData.lowStockList && productsData.lowStockList.length > 0 ? (
//             <table className="w-full min-w-[600px]">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
//                     Produit
//                   </th>
//                   <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
//                     Catégorie
//                   </th>
//                   <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
//                     Stock actuel
//                   </th>
//                   <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
//                     Prix unitaire
//                   </th>
//                   <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
//                     Valeur stock
//                   </th>
//                   <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
//                     Statut
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-gray-200">
//                 {productsData.lowStockList.slice(0, 10).map((product, index) => (
//                   <tr key={product.id || index} className="hover:bg-gray-50">
//                     <td className="px-4 py-3">
//                       <div className="font-medium text-gray-900 truncate max-w-[100px] md:max-w-[150px]">{product.name}</div>
//                       <div className="text-xs text-gray-500">SKU: {product.sku || 'N/A'}</div>
//                     </td>
//                     <td className="px-4 py-3">
//                       <span className="px-2 py-1 text-xs bg-gray-100 rounded-full whitespace-nowrap">
//                         {product.category || 'Non catégorisé'}
//                       </span>
//                     </td>
//                     <td className="px-4 py-3">
//                       <div className="flex items-center">
//                         <div className="w-16 md:w-24 bg-gray-200 rounded-full h-2 mr-2 md:mr-3">
//                           <div 
//                             className={`h-2 rounded-full ${
//                               product.quantity < 3 ? 'bg-red-500' : 
//                               product.quantity < 5 ? 'bg-yellow-500' : 'bg-orange-500'
//                             }`}
//                             style={{ width: `${(product.quantity / 10) * 100}%` }}
//                           ></div>
//                         </div>
//                         <span className={`font-medium text-xs md:text-sm ${
//                           product.quantity < 3 ? 'text-red-600' : 
//                           product.quantity < 5 ? 'text-yellow-600' : 'text-orange-600'
//                         }`}>
//                           {product.quantity}
//                         </span>
//                       </div>
//                     </td>
//                     <td className="px-4 py-3 text-xs md:text-sm">
//                       {formatCurrency(product.price || 0)}
//                     </td>
//                     <td className="px-4 py-3 font-medium text-xs md:text-sm truncate">
//                       {formatCurrency(product.stockValue || 0)}
//                     </td>
//                     <td className="px-4 py-3">
//                       <span className={`px-2 py-1 text-xs rounded-full whitespace-nowrap ${
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
//             <div className="px-4 md:px-6 py-8 md:py-12 text-center text-gray-500">
//               <Package className="w-8 h-8 md:w-12 md:h-12 mx-auto mb-2 md:mb-3 text-gray-300" />
//               <p className="text-sm md:text-base">Aucun produit à faible stock</p>
//               <p className="text-xs md:text-sm">Tous les produits ont un stock suffisant</p>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );

//   // Composant pour l'onglet Revenus
//   const RevenueTab = () => {
//     const periodSalesCount = getPeriodSalesCount();
//     const periodRevenue = getPeriodRevenue();
    
//     return (
//       <div className="space-y-4 md:space-y-6">
//         {/* Cartes de statistiques des revenus */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
//           <div className="bg-white p-4 md:p-6 rounded-xl border shadow-sm hover:shadow-md transition-shadow">
//             <div className="flex items-center justify-between mb-3 md:mb-4">
//               <div className="p-2 md:p-3 bg-green-50 rounded-lg">
//                 <DollarSign className="w-5 h-5 md:w-6 md:h-6 text-green-600" />
//               </div>
//               <span className={`text-xs md:text-sm font-medium ${
//                 dashboardStats.monthly_revenue > dashboardStats.today_revenue * 30 ? 'text-green-600' : 'text-red-600'
//               }`}>
//                 <TrendingUp className="w-3 h-3 md:w-4 md:h-4 inline mr-1" />
//                 Mois
//               </span>
//             </div>
//             <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-1 truncate">
//               {formatCurrency(dashboardStats.monthly_revenue)}
//             </h3>
//             <p className="text-gray-500 text-sm md:text-base">Revenus mensuels</p>
//             <div className="mt-3 pt-3 border-t border-gray-100 text-xs md:text-sm text-gray-500">
//               <div className="flex justify-between">
//                 <span>Aujourd'hui:</span>
//                 <span className="truncate">{formatCurrency(dashboardStats.today_revenue)}</span>
//               </div>
//               <div className="flex justify-between text-green-600 mt-1">
//                 <span>Ventes aujourd'hui:</span>
//                 <span>{dashboardStats.today_sales}</span>
//               </div>
//             </div>
//           </div>

//           <div className="bg-white p-4 md:p-6 rounded-xl border shadow-sm hover:shadow-md transition-shadow">
//             <div className="flex items-center justify-between mb-3 md:mb-4">
//               <div className="p-2 md:p-3 bg-blue-50 rounded-lg">
//                 <ShoppingBag className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
//               </div>
//               <span className="text-xs md:text-sm font-medium text-blue-600 truncate">
//                 Période: {timeRange}
//               </span>
//             </div>
//             <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-1 truncate">
//               {periodSalesCount > 0 ? formatCurrency(periodRevenue / periodSalesCount) : formatCurrency(0)}
//             </h3>
//             <p className="text-gray-500 text-sm md:text-base">Ticket moyen</p>
//             <div className="mt-3 pt-3 border-t border-gray-100 text-xs md:text-sm text-gray-500">
//               <div className="flex justify-between">
//                 <span>Ventes:</span>
//                 <span>{periodSalesCount}</span>
//               </div>
//               <div className="flex justify-between text-green-600 mt-1">
//                 <span>Total:</span>
//                 <span className="truncate">{formatCurrency(periodRevenue)}</span>
//               </div>
//             </div>
//           </div>

//           <div className="bg-white p-4 md:p-6 rounded-xl border shadow-sm hover:shadow-md transition-shadow">
//             <div className="flex items-center justify-between mb-3 md:mb-4">
//               <div className="p-2 md:p-3 bg-purple-50 rounded-lg">
//                 <Calendar className="w-5 h-5 md:w-6 md:h-6 text-purple-600" />
//               </div>
//               <span className="text-xs md:text-sm font-medium text-gray-500">
//                 Ce mois
//               </span>
//             </div>
//             <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-1 truncate">
//               {formatCurrency(dashboardStats.monthly_revenue)}
//             </h3>
//             <p className="text-gray-500 text-sm md:text-base">Revenus mensuels</p>
//             <div className="mt-3 pt-3 border-t border-gray-100 text-xs md:text-sm text-gray-500">
//               <div className="flex justify-between">
//                 <span>Ventes:</span>
//                 <span>{dashboardStats.monthly_sales}</span>
//               </div>
//               <div className="flex justify-between text-green-600 mt-1">
//                 <span>Moyenne/jour:</span>
//                 <span className="truncate">{formatCurrency(dashboardStats.monthly_sales > 0 ? dashboardStats.monthly_revenue / dashboardStats.monthly_sales : 0)}</span>
//               </div>
//             </div>
//           </div>

//           <div className="bg-white p-4 md:p-6 rounded-xl border shadow-sm hover:shadow-md transition-shadow">
//             <div className="flex items-center justify-between mb-3 md:mb-4">
//               <div className="p-2 md:p-3 bg-amber-50 rounded-lg">
//                 <Tag className="w-5 h-5 md:w-6 md:h-6 text-amber-600" />
//               </div>
//               <span className="text-xs md:text-sm font-medium text-amber-600 truncate">
//                 Remises: {performanceStats.promotion_usage.toFixed(1)}%
//               </span>
//             </div>
//             <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-1 truncate">
//               {formatCurrency(performanceStats.total_discounts || 0)}
//             </h3>
//             <p className="text-gray-500 text-sm md:text-base">Total remises</p>
//             <div className="mt-3 pt-3 border-t border-gray-100 text-xs md:text-sm text-gray-500">
//               <div className="flex justify-between">
//                 <span>Efficacité:</span>
//                 <span>{performanceStats.promotion_usage.toFixed(1)}%</span>
//               </div>
//               <div className="flex justify-between text-gray-500 mt-1">
//                 <span>% du revenu:</span>
//                 <span>{periodRevenue > 0 ? ((performanceStats.total_discounts / periodRevenue) * 100).toFixed(1) : '0'}%</span>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Graphiques des revenus */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
//           {/* Évolution des revenus mensuels */}
//           <div className="bg-white p-4 md:p-6 rounded-xl border shadow-sm">
//             <div className="flex items-center justify-between mb-4 md:mb-6">
//               <h3 className="text-base md:text-lg font-semibold text-gray-900 truncate">
//                 <TrendingUp className="w-4 h-4 md:w-5 md:h-5 inline mr-2 text-blue-600" />
//                 Évolution des revenus ({new Date().getFullYear()})
//               </h3>
//             </div>
//             <div className="h-64 md:h-80">
//               {monthlyStats && monthlyStats.length > 0 ? (
//                 <ResponsiveContainer width="100%" height="100%">
//                   <LineChart data={monthlyStats}>
//                     <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
//                     <XAxis dataKey="month" fontSize={isMobile ? 10 : 12} />
//                     <YAxis fontSize={isMobile ? 10 : 12} />
//                     <Tooltip 
//                       formatter={(value) => [formatCurrency(value as number), 'Revenus']}
//                     />
//                     <Legend wrapperStyle={{ fontSize: isMobile ? '10px' : '12px' }} />
//                     <Line 
//                       type="monotone" 
//                       dataKey="total_revenue" 
//                       stroke="#3B82F6" 
//                       name="Revenus nets"
//                       strokeWidth={3}
//                     />
//                   </LineChart>
//                 </ResponsiveContainer>
//               ) : (
//                 <div className="h-full flex flex-col items-center justify-center text-gray-500 p-4">
//                   <BarChart2 className="w-8 h-8 md:w-12 md:h-12 mb-2 md:mb-3 text-gray-300" />
//                   <p className="text-sm md:text-base text-center">Aucune donnée de revenus disponible</p>
//                   <p className="text-xs md:text-sm text-center">Les revenus apparaîtront ici</p>
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Performances quotidiennes */}
//           <div className="bg-white p-4 md:p-6 rounded-xl border shadow-sm">
//             <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 md:mb-6 gap-2">
//               <h3 className="text-base md:text-lg font-semibold text-gray-900 truncate">
//                 <Activity className="w-4 h-4 md:w-5 md:h-5 inline mr-2 text-green-600" />
//                 Performances quotidiennes
//               </h3>
//               <select 
//                 value={timeRange}
//                 onChange={(e) => setTimeRange(e.target.value as typeof timeRange)}
//                 className="text-sm border rounded-lg px-3 py-1 w-full sm:w-auto"
//               >
//                 <option value="7days">7 jours</option>
//                 <option value="30days">30 jours</option>
//                 <option value="90days">90 jours</option>
//                 <option value="year">Année</option>
//               </select>
//             </div>
//             <div className="h-64 md:h-80">
//               {dailyStats && dailyStats.length > 0 ? (
//                 <ResponsiveContainer width="100%" height="100%">
//                   <BarChart data={dailyStats.slice(0, 14)}>
//                     <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
//                     <XAxis dataKey="date" fontSize={isMobile ? 10 : 12} />
//                     <YAxis fontSize={isMobile ? 10 : 12} />
//                     <Tooltip 
//                       formatter={(value, name) => {
//                         if (name === 'total_revenue') {
//                           return [formatCurrency(value as number), 'Revenus'];
//                         }
//                         return [value, name === 'sales_count' ? 'Ventes' : name];
//                       }}
//                     />
//                     <Legend wrapperStyle={{ fontSize: isMobile ? '10px' : '12px' }} />
//                     <Bar 
//                       dataKey="total_revenue" 
//                       name="Revenus" 
//                       fill="#10B981" 
//                       radius={[4, 4, 0, 0]}
//                     />
//                     <Bar 
//                       dataKey="sales_count" 
//                       name="Ventes" 
//                       fill="#3B82F6" 
//                       radius={[4, 4, 0, 0]}
//                     />
//                   </BarChart>
//                 </ResponsiveContainer>
//               ) : (
//                 <div className="h-full flex flex-col items-center justify-center text-gray-500 p-4">
//                   <Activity className="w-8 h-8 md:w-12 md:h-12 mb-2 md:mb-3 text-gray-300" />
//                   <p className="text-sm md:text-base text-center">Aucune donnée de performances</p>
//                   <p className="text-xs md:text-sm text-center">Les performances apparaîtront après les ventes</p>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   return (
//     <div className="h-screen flex flex-col bg-gray-50">
//       {notification && (
//         <Notification
//           type={notification.type}
//           message={notification.message}
//           onClose={() => setNotification(null)}
//         />
//       )}

//       {/* Header */}
//       <div className="sticky top-0 z-10 bg-white border-b">
//         <div className="px-4 md:px-6 py-4">
//           <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
//             <div className="flex items-center space-x-3">
//               <div className="p-2 bg-purple-50 rounded-lg">
//                 <BarChart3 className="w-5 h-5 md:w-6 md:h-6 text-purple-600" />
//               </div>
//               <div>
//                 <h1 className="text-lg md:text-xl font-bold text-gray-900">Rapports & Statistiques</h1>
//                 <div className="flex flex-wrap items-center gap-2 text-xs md:text-sm text-gray-500">
//                   <span>Analyse avancée avec remises et promotions</span>
//                   <span className="hidden sm:inline w-1 h-1 bg-gray-300 rounded-full"></span>
//                   <span className="sm:inline">{dashboardStats.monthly_sales} ventes ce mois</span>
//                 </div>
//               </div>
//             </div>
            
//             <div className="flex items-center space-x-2 self-start sm:self-auto">
//               <button
//                 onClick={() => loadAllStats()}
//                 className="flex items-center space-x-2 px-3 py-2 md:px-4 md:py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors w-full sm:w-auto justify-center"
//               >
//                 <RefreshCw className="w-4 h-4" />
//                 <span className="text-sm">Actualiser</span>
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Filtres */}
//         <div className="px-4 md:px-6 py-3 border-t bg-gray-50">
//           <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
//             <div className="flex items-center space-x-2">
//               <Calendar className="w-4 h-4 md:w-5 md:h-5 text-gray-500 flex-shrink-0" />
//               <div className="flex flex-wrap gap-1 md:gap-2">
//                 {['7days', '30days', '90days', 'year'].map((p) => {
//                   const labels: Record<string, string> = {
//                     '7days': '7 jours',
//                     '30days': '30 jours',
//                     '90days': '90 jours',
//                     'year': 'Année'
//                   };
//                   return (
//                     <button
//                       key={p}
//                       onClick={() => setTimeRange(p as typeof timeRange)}
//                       className={`flex items-center space-x-1 px-2 py-1 md:px-3 md:py-1.5 text-xs md:text-sm rounded-lg transition-colors whitespace-nowrap ${
//                         timeRange === p
//                           ? 'bg-purple-600 text-white'
//                           : 'bg-white text-gray-600 hover:bg-gray-100 border'
//                       }`}
//                     >
//                       <span>{labels[p]}</span>
//                     </button>
//                   );
//                 })}
//               </div>
//             </div>
            
//             <button
//               onClick={loadAllStats}
//               disabled={loading}
//               className="flex items-center space-x-2 px-3 py-1.5 bg-white border rounded-lg hover:bg-gray-50 disabled:opacity-50 w-full sm:w-auto justify-center mt-2 sm:mt-0"
//             >
//               <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
//               <span className="text-sm">Actualiser</span>
//             </button>
//           </div>
//         </div>

//         {/* Tabs */}
//         <div className="px-4 md:px-6 border-t overflow-x-auto">
//           <div className="flex space-x-1 min-w-max">
//             <button
//               onClick={() => setActiveTab('sales')}
//               className={`px-3 py-2 md:px-4 md:py-3 text-xs md:text-sm font-medium border-b-2 transition-colors flex items-center whitespace-nowrap ${
//                 activeTab === 'sales'
//                   ? 'border-purple-600 text-purple-600'
//                   : 'border-transparent text-gray-500 hover:text-gray-700'
//               }`}
//             >
//               <ShoppingCart className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
//               Ventes
//               <span className="ml-1 md:ml-2 px-1.5 py-0.5 bg-purple-100 text-purple-600 text-xs rounded-full">
//                 {dashboardStats.monthly_sales}
//               </span>
//             </button>
//             <button
//               onClick={() => setActiveTab('products')}
//               className={`px-3 py-2 md:px-4 md:py-3 text-xs md:text-sm font-medium border-b-2 transition-colors flex items-center whitespace-nowrap ${
//                 activeTab === 'products'
//                   ? 'border-purple-600 text-purple-600'
//                   : 'border-transparent text-gray-500 hover:text-gray-700'
//               }`}
//             >
//               <Package className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
//               Produits
//               <span className="ml-1 md:ml-2 px-1.5 py-0.5 bg-green-100 text-green-600 text-xs rounded-full">
//                 {productsData.totalProducts}
//               </span>
//             </button>
//             <button
//               onClick={() => setActiveTab('revenue')}
//               className={`px-3 py-2 md:px-4 md:py-3 text-xs md:text-sm font-medium border-b-2 transition-colors flex items-center whitespace-nowrap ${
//                 activeTab === 'revenue'
//                   ? 'border-purple-600 text-purple-600'
//                   : 'border-transparent text-gray-500 hover:text-gray-700'
//               }`}
//             >
//               <DollarSign className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
//               Revenus
//               <span className="ml-1 md:ml-2 px-1.5 py-0.5 bg-blue-100 text-blue-600 text-xs rounded-full truncate max-w-[80px]">
//                 {formatCurrency(dashboardStats.monthly_revenue).replace('€', '').trim()}
//               </span>
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Contenu principal */}
//       <div className="flex-1 overflow-auto p-4 md:p-6">
//         {loading ? (
//           <div className="flex items-center justify-center h-full">
//             <div className="text-center">
//               <div className="animate-spin rounded-full h-8 w-8 md:h-12 md:w-12 border-b-2 border-purple-600 mx-auto mb-3 md:mb-4"></div>
//               <p className="text-sm md:text-base text-gray-600">Chargement des statistiques...</p>
//             </div>
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
//       <div className="border-t bg-white px-4 md:px-6 py-3 md:py-4">
//         <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs md:text-sm text-gray-500">
//           <div className="flex flex-col sm:flex-row sm:items-center gap-2">
//             <span>Dernière mise à jour: {new Date().toLocaleString('fr-FR')}</span>
//             {performanceStats.total_discounts > 0 && (
//               <span className="text-green-600 hidden sm:inline">
//                 Remises totales: {formatCurrency(performanceStats.total_discounts)}
//               </span>
//             )}
//           </div>
//           <div className="flex flex-col sm:flex-row sm:items-center gap-2">
//             <span>{dashboardStats.monthly_sales} ventes ce mois</span>
//             <span className="text-green-600">
//               Revenu: {formatCurrency(dashboardStats.monthly_revenue)}
//             </span>
//             <button
//               onClick={() => window.print()}
//               className="text-purple-600 hover:text-purple-700 flex items-center self-start sm:self-auto"
//             >
//               <Download className="w-3 h-3 md:w-4 md:h-4 mr-1" />
//               Imprimer
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area
} from 'recharts';
import { 
  TrendingUp, Package, ShoppingCart, DollarSign, 
  BarChart2, Calendar, Download, RefreshCw,
  CreditCard, Wallet, AlertCircle, Layers, Users, Star, TrendingDown,
  Percent, Target, ShoppingBag, Clock, Activity, ChevronRight,
  Tag, ArrowDownRight, FileText, CheckCircle, XCircle, BarChart3,
  ArrowUpRight, ArrowDownLeft, ActivitySquare, Store
} from 'lucide-react';
import Notification from '@/components/Notification';
import { 
  getSales, 
  getTopCustomers, 
  getTopProducts,
  getDailySales, 
  getMonthlySales, 
  getPaymentMethodsStats, 
  getProductsStats,
  getCategoriesStats, 
  getPerformanceStats,
  getLowStockProducts,
  getOutOfStockProducts,
  getDashboardStats
} from '@/lib/stats';
import { getAllProducts } from '@/lib/products';

export default function StatsPage() {
  // États pour les données
  const [dashboardStats, setDashboardStats] = useState({
    today_sales: 0,
    today_revenue: 0,
    monthly_sales: 0,
    monthly_revenue: 0,
    low_stock_products: 0,
    out_of_stock_products: 0,
    top_selling_product: { name: '', quantity: 0 }
  });
  
  const [dailyStats, setDailyStats] = useState([]);
  const [monthlyStats, setMonthlyStats] = useState([]);
  const [paymentStats, setPaymentStats] = useState([]);
  const [topCustomers, setTopCustomers] = useState([]);
  const [productStats, setProductStats] = useState([]);
  const [categoryStats, setCategoryStats] = useState([]);
  const [performanceStats, setPerformanceStats] = useState({
    total_sales: 0,
    total_revenue: 0,
    total_discounts: 0,
    average_ticket: 0,
    best_day: '',
    best_day_revenue: 0,
    unique_customers: 0,
    promotion_usage: 0
  });
  
  const [productsData, setProductsData] = useState({
    totalProducts: 0,
    totalStock: 0,
    totalValue: 0,
    lowStockProducts: 0,
    categories: [],
    topProducts: [],
    lowStockList: [],
    outOfStock: []
  });

  const [totalSalesCount, setTotalSalesCount] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);

  // États UI
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);
  const [activeTab, setActiveTab] = useState('sales');
  const [timeRange, setTimeRange] = useState('30days');
  const [isMobile, setIsMobile] = useState(false);

  // Détecter la taille de l'écran
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Charger toutes les statistiques
  const loadAllStats = useCallback(async () => {
    setLoading(true);
    try {
      // Calculer les dates
      let startDate = '';
      const now = new Date();
      
      switch(timeRange) {
        case '7days':
          const weekAgo = new Date(now);
          weekAgo.setDate(now.getDate() - 7);
          startDate = weekAgo.toISOString().split('T')[0];
          break;
        case '30days':
          const monthAgo = new Date(now);
          monthAgo.setDate(now.getDate() - 30);
          startDate = monthAgo.toISOString().split('T')[0];
          break;
        case '90days':
          const ninetyDaysAgo = new Date(now);
          ninetyDaysAgo.setDate(now.getDate() - 90);
          startDate = ninetyDaysAgo.toISOString().split('T')[0];
          break;
        case 'year':
          const yearAgo = new Date(now);
          yearAgo.setFullYear(now.getFullYear() - 1);
          startDate = yearAgo.toISOString().split('T')[0];
          break;
        default:
          startDate = '';
      }

      // 1. Charger les statistiques de dashboard (sans filtre de période)
      const dashboard = await getDashboardStats();
      setDashboardStats(dashboard);
      
      // Calculer les totaux à partir des stats de dashboard
      setTotalSalesCount(dashboard.monthly_sales);
      setTotalRevenue(dashboard.monthly_revenue);

      // 2. Charger les statistiques de performance pour la période sélectionnée
      const performance = await getPerformanceStats(startDate, new Date().toISOString().split('T')[0]);
      setPerformanceStats(performance);

      // 3. Charger les statistiques quotidiennes
      const days = timeRange === '7days' ? 7 : timeRange === '30days' ? 30 : 90;
      const dailyStatsData = await getDailySales(days);
      setDailyStats(dailyStatsData);

      // 4. Charger les statistiques mensuelles
      const monthlyStatsData = await getMonthlySales(new Date().getFullYear());
      setMonthlyStats(monthlyStatsData);

      // 5. Charger les statistiques de paiement
      const paymentStatsData = await getPaymentMethodsStats();
      setPaymentStats(paymentStatsData);

      // 6. Charger les meilleurs clients
      const topCustomersData = await getTopCustomers(10);
      setTopCustomers(topCustomersData);

      // 7. Charger les statistiques des produits vendus
      const productStatsData = await getProductsStats();
      setProductStats(productStatsData.slice(0, 10));

      // 8. Charger les statistiques des catégories
      const categoryStatsData = await getCategoriesStats();
      setCategoryStats(categoryStatsData.slice(0, 8));

      // 9. Charger les données des produits en stock
      await loadProductsData();

    } catch (error) {
      console.error('Erreur chargement stats:', error);
      showNotification('error', '❌ Erreur lors du chargement des statistiques');
    } finally {
      setLoading(false);
    }
  }, [timeRange]);

  // Charger les données produits
  const loadProductsData = async () => {
    try {
      const products = await getAllProducts();
      const lowStockProducts = await getLowStockProducts(10);
      const outOfStockProducts = await getOutOfStockProducts();
      
      processProductsData(products, lowStockProducts, outOfStockProducts);
    } catch (error) {
      console.error('Erreur chargement produits:', error);
    }
  };

  // Traiter les données produits
  const processProductsData = (products, lowStockProducts, outOfStockProducts) => {
    let totalStockValue = 0;
    let lowStockCount = 0;
    const categoryStatsMap = {};

    products.forEach(product => {
      const productValue = (product.quantity || 0) * (product.price || 0);
      totalStockValue += productValue;

      if (product.quantity && product.quantity < 10) {
        lowStockCount++;
      }

      const category = product.category || 'Non catégorisé';
      if (!categoryStatsMap[category]) {
        categoryStatsMap[category] = {
          count: 0,
          totalValue: 0,
          totalStock: 0,
          avgPrice: 0,
          products: []
        };
      }
      categoryStatsMap[category].count++;
      categoryStatsMap[category].totalValue += productValue;
      categoryStatsMap[category].totalStock += product.quantity || 0;
      categoryStatsMap[category].products.push(product);
    });

    const categoryData = Object.entries(categoryStatsMap).map(([name, stats]) => ({
      name: name.length > 10 ? name.substring(0, 10) + '...' : name,
      fullName: name,
      produits: stats.count,
      valeur: parseFloat(stats.totalValue.toFixed(2)),
      stock: stats.totalStock,
      prixMoyen: stats.count > 0 ? parseFloat((stats.totalValue / stats.count).toFixed(2)) : 0
    }));

    const topProducts = [...products]
      .sort((a, b) => ((b.quantity || 0) * (b.price || 0)) - ((a.quantity || 0) * (a.price || 0)))
      .slice(0, 10)
      .map(p => ({
        id: p.id,
        name: p.name.length > 15 ? p.name.substring(0, 15) + '...' : p.name,
        fullName: p.name,
        sku: p.sku || 'N/A',
        valeur: parseFloat(((p.quantity || 0) * (p.price || 0)).toFixed(2)),
        quantité: p.quantity || 0,
        prix: p.price || 0,
        category: p.category || 'Non catégorisé',
        min_stock: 10
      }));

    const allLowStock = [...lowStockProducts, ...outOfStockProducts];
    const lowStockList = allLowStock
      .slice(0, 10)
      .map(p => ({
        id: p.id,
        name: p.name,
        sku: p.sku || 'N/A',
        category: p.category || 'Non catégorisé',
        quantity: p.quantity || 0,
        price: p.price || 0,
        min_stock: 10,
        stockValue: (p.quantity || 0) * (p.price || 0)
      }));

    setProductsData({
      totalProducts: products.length,
      totalStock: products.reduce((sum, p) => sum + (p.quantity || 0), 0),
      totalValue: parseFloat(totalStockValue.toFixed(2)),
      lowStockProducts: lowStockCount,
      categories: categoryData.sort((a, b) => b.valeur - a.valeur),
      topProducts: topProducts,
      lowStockList: lowStockList.sort((a, b) => a.quantity - b.quantity),
      outOfStock: outOfStockProducts || []
    });
  };

  useEffect(() => {
    loadAllStats();
  }, [loadAllStats]);

  // Fonctions utilitaires
  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return isMobile ? date.toLocaleDateString('fr-FR', { month: 'short', day: 'numeric' }) : 
             date.toLocaleDateString('fr-FR');
    } catch {
      return dateString;
    }
  };

  const formatPaymentMethod = (method) => {
    const methods = {
      'cash': 'Espèces',
      'card': 'Carte bancaire',
      'check': 'Chèque',
      'transfer': 'Virement',
      'mobile': 'Mobile'
    };
    return methods[method] || method.charAt(0).toUpperCase() + method.slice(1);
  };

  // Fonctions pour les graphiques
  const getSalesTrendData = () => {
    return dailyStats.slice(-(isMobile ? 7 : 15));
  };

  const getTopProductsData = () => {
    return productsData.topProducts.slice(0, isMobile ? 5 : 8);
  };

  const getCategoryData = () => {
    return productsData.categories.slice(0, isMobile ? 5 : 8);
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg z-50">
          <p className="font-semibold text-gray-900 mb-2">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {
                entry.name.includes('€') || 
                entry.dataKey === 'revenue' || 
                entry.dataKey === 'valeur' || 
                entry.dataKey === 'prixMoyen' ||
                entry.dataKey === 'panierMoyen' ||
                entry.dataKey === 'total_revenue' ||
                entry.dataKey === 'discount_amount' ||
                entry.dataKey === 'total_amount'
                  ? formatCurrency(entry.value)
                  : entry.dataKey === 'promotion_usage' ||
                    entry.dataKey === 'percentage'
                  ? `${entry.value.toFixed(1)}%`
                  : entry.value.toLocaleString()
              }
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Calculer le total des ventes pour la période sélectionnée
  const getPeriodSalesCount = () => {
    if (timeRange === '7days') return dailyStats.reduce((sum, day) => sum + day.sales_count, 0);
    if (timeRange === '30days') return dailyStats.reduce((sum, day) => sum + day.sales_count, 0);
    if (timeRange === '90days') return dailyStats.reduce((sum, day) => sum + day.sales_count, 0);
    return dashboardStats.monthly_sales; // Pour 'year' ou période plus longue
  };

  const getPeriodRevenue = () => {
    if (timeRange === '7days') return dailyStats.reduce((sum, day) => sum + day.total_revenue, 0);
    if (timeRange === '30days') return dailyStats.reduce((sum, day) => sum + day.total_revenue, 0);
    if (timeRange === '90days') return dailyStats.reduce((sum, day) => sum + day.total_revenue, 0);
    return dashboardStats.monthly_revenue; // Pour 'year' ou période plus longue
  };

  // Composant pour l'onglet Ventes
  const SalesTab = () => {
    const periodSalesCount = getPeriodSalesCount();
    const periodRevenue = getPeriodRevenue();
    
    return (
      <div className="space-y-4 md:space-y-6">
        {/* Cartes de statistiques */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {/* Carte Revenus */}
          <div className="bg-white p-4 md:p-6 rounded-xl border shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3 md:mb-4">
              <div className="p-2 md:p-3 bg-blue-50 rounded-lg">
                <DollarSign className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
              </div>
              <div className="flex items-center space-x-1 md:space-x-2">
                {performanceStats.total_discounts > 0 && (
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                    -{formatCurrency(performanceStats.total_discounts)}
                  </span>
                )}
                <span className="text-xs md:text-sm font-medium text-gray-500">
                  {periodSalesCount} ventes
                </span>
              </div>
            </div>
            <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-1 truncate">
              {formatCurrency(periodRevenue)}
            </h3>
            <p className="text-gray-500 text-sm md:text-base">Revenu net</p>
            <div className="mt-3 pt-3 border-t border-gray-100">
              <div className="flex justify-between text-xs md:text-sm">
                <span className="text-gray-500">Brut:</span>
                <span>{formatCurrency(periodRevenue + performanceStats.total_discounts)}</span>
              </div>
              {performanceStats.total_discounts > 0 && (
                <div className="flex justify-between text-xs md:text-sm text-green-600 mt-1">
                  <span>Remises:</span>
                  <span>-{formatCurrency(performanceStats.total_discounts)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Carte Transactions */}
          <div className="bg-white p-4 md:p-6 rounded-xl border shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3 md:mb-4">
              <div className="p-2 md:p-3 bg-green-50 rounded-lg">
                <ShoppingCart className="w-5 h-5 md:w-6 md:h-6 text-green-600" />
              </div>
              <div className="flex items-center space-x-1 md:space-x-2">
                <span className="text-xs md:text-sm font-medium text-gray-500 truncate">
                  {timeRange === '7days' ? '7 jours' : 
                   timeRange === '30days' ? '30 jours' : 
                   timeRange === '90days' ? '90 jours' : 'Année'}
                </span>
              </div>
            </div>
            <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-1">
              {periodSalesCount}
            </h3>
            <p className="text-gray-500 text-sm md:text-base">Transactions réussies</p>
            <div className="mt-3 pt-3 border-t border-gray-100">
              <div className="flex justify-between text-xs md:text-sm text-gray-500">
                <span>Panier moyen:</span>
                <span className="font-medium truncate">
                  {periodSalesCount > 0 ? formatCurrency(periodRevenue / periodSalesCount) : formatCurrency(0)}
                </span>
              </div>
              {dashboardStats.today_sales > 0 && (
                <div className="flex justify-between text-xs md:text-sm text-gray-500 mt-1">
                  <span>Aujourdhui:</span>
                  <span className="font-medium">{dashboardStats.today_sales} ventes</span>
                </div>
              )}
            </div>
          </div>

          {/* Carte Clients */}
          <div className="bg-white p-4 md:p-6 rounded-xl border shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3 md:mb-4">
              <div className="p-2 md:p-3 bg-purple-50 rounded-lg">
                <Users className="w-5 h-5 md:w-6 md:h-6 text-purple-600" />
              </div>
              <div className="flex items-center space-x-1 md:space-x-2">
                <span className="text-xs md:text-sm font-medium text-purple-600 truncate">
                  {performanceStats.unique_customers} client{performanceStats.unique_customers !== 1 ? 's' : ''}
                </span>
              </div>
            </div>
            <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-1">
              {performanceStats.unique_customers.toLocaleString()}
            </h3>
            <p className="text-gray-500 text-sm md:text-base">Clients uniques</p>
            <div className="mt-3 pt-3 border-t border-gray-100">
              <div className="flex justify-between text-xs md:text-sm text-gray-500">
                <span>Fidélisation:</span>
                <span className="font-medium">78%</span>
              </div>
              <div className="flex justify-between text-xs md:text-sm text-gray-500 mt-1">
                <span>Retour client:</span>
                <span className="font-medium">42%</span>
              </div>
            </div>
          </div>

          {/* Carte Performances */}
          <div className="bg-white p-4 md:p-6 rounded-xl border shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3 md:mb-4">
              <div className="p-2 md:p-3 bg-amber-50 rounded-lg">
                <TrendingUp className="w-5 h-5 md:w-6 md:h-6 text-amber-600" />
              </div>
              <div className="flex items-center space-x-1 md:space-x-2">
                <span className="text-xs md:text-sm font-medium text-amber-700 truncate">
                  Promotions: {performanceStats.promotion_usage.toFixed(1)}%
                </span>
              </div>
            </div>
            <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-1 truncate">
              {periodSalesCount > 0 ? formatCurrency(periodRevenue / periodSalesCount) : formatCurrency(0)}
            </h3>
            <p className="text-gray-500 text-sm md:text-base">Panier moyen</p>
            <div className="mt-3 pt-3 border-t border-gray-100">
              <div className="flex justify-between text-xs md:text-sm text-gray-500">
                <span>Utilisation promo:</span>
                <span className="font-medium">{performanceStats.promotion_usage.toFixed(1)}%</span>
              </div>
              <div className="flex justify-between text-xs md:text-sm text-gray-500 mt-1">
                <span>Remises totales:</span>
                <span className="font-medium truncate">{formatCurrency(performanceStats.total_discounts)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Graphiques */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          {/* Évolution des ventes quotidiennes */}
          <div className="bg-white p-4 md:p-6 rounded-xl border shadow-sm">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 md:mb-6 gap-2">
              <h3 className="text-base md:text-lg font-semibold text-gray-900 truncate">
                <TrendingUp className="w-4 h-4 md:w-5 md:h-5 inline mr-2 text-blue-600" />
                Évolution des ventes ({timeRange === '7days' ? '7' : timeRange === '30days' ? '15' : '30'} derniers jours)
              </h3>
              <select 
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="text-sm border rounded-lg px-3 py-1 w-full sm:w-auto"
              >
                <option value="7days">7 jours</option>
                <option value="30days">30 jours</option>
                <option value="90days">90 jours</option>
                <option value="year">Année</option>
              </select>
            </div>
            <div className="h-64 md:h-80">
              {getSalesTrendData().length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={getSalesTrendData()}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="date" fontSize={isMobile ? 10 : 12} />
                    <YAxis fontSize={isMobile ? 10 : 12} />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" fontSize={isMobile ? 10 : 12} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ fontSize: isMobile ? '10px' : '12px' }} />
                    <Area 
                      yAxisId="left"
                      type="monotone" 
                      dataKey="total_revenue" 
                      stroke="#3B82F6" 
                      fill="#93C5FD" 
                      fillOpacity={0.6}
                      name="Revenus nets"
                    />
                    <Line 
                      yAxisId="right"
                      type="monotone" 
                      dataKey="discount_amount" 
                      stroke="#EF4444" 
                      name="Remises"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-gray-500 p-4">
                  <BarChart2 className="w-8 h-8 md:w-12 md:h-12 mb-2 md:mb-3 text-gray-300" />
                  <p className="text-sm md:text-base text-center">Aucune donnée de vente disponible</p>
                  <p className="text-xs md:text-sm text-center">Les ventes apparaîtront ici</p>
                </div>
              )}
            </div>
          </div>

          {/* Méthodes de paiement */}
          <div className="bg-white p-4 md:p-6 rounded-xl border shadow-sm">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 md:mb-6 gap-2">
              <h3 className="text-base md:text-lg font-semibold text-gray-900 truncate">
                <CreditCard className="w-4 h-4 md:w-5 md:h-5 inline mr-2 text-yellow-600" />
                Méthodes de paiement
              </h3>
              <span className="text-xs md:text-sm text-gray-500">
                {paymentStats?.length || 0} méthodes
              </span>
            </div>
            <div className="h-64 md:h-80">
              {paymentStats && paymentStats.length > 0 ? (
                <div className="h-full flex flex-col">
                  <div className="flex-1">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={paymentStats}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ payment_method, total_amount }) => 
                            `${formatPaymentMethod(payment_method)}: ${formatCurrency(total_amount)}`
                          }
                          outerRadius={isMobile ? 60 : 80}
                          fill="#8884d8"
                          dataKey="total_amount"
                        >
                          {paymentStats.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'][index % 6]} />
                          ))}
                        </Pie>
                        <Tooltip 
                          formatter={(value) => [formatCurrency(value), 'Revenus']}
                        />
                        <Legend wrapperStyle={{ fontSize: isMobile ? '10px' : '12px' }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-3">
                    {paymentStats.slice(0, 4).map((method, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                        <div className="flex items-center truncate">
                          <div 
                            className="w-3 h-3 rounded-full mr-2 flex-shrink-0"
                            style={{ backgroundColor: ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'][index % 4] }}
                          ></div>
                          <div className="truncate">
                            <div className="text-xs md:text-sm font-medium truncate">{formatPaymentMethod(method.payment_method)}</div>
                            <div className="text-xs text-gray-500">
                              {method.count} transaction{method.count > 1 ? 's' : ''}
                            </div>
                          </div>
                        </div>
                        <div className="text-right ml-2">
                          <div className="font-medium text-xs md:text-sm truncate">{formatCurrency(method.total_amount)}</div>
                          <div className="text-xs text-gray-500">
                            {periodRevenue > 0 ? 
                              `${((method.total_amount / periodRevenue) * 100).toFixed(1)}%` : 
                              '0%'}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-gray-500 p-4">
                  <CreditCard className="w-8 h-8 md:w-12 md:h-12 mb-2 md:mb-3 text-gray-300" />
                  <p className="text-sm md:text-base text-center">Aucune donnée de paiement</p>
                  <p className="text-xs md:text-sm text-center">Les méthodes apparaîtront après les ventes</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Meilleurs clients */}
        <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
          <div className="p-4 md:p-6 border-b">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <h3 className="text-base md:text-lg font-semibold text-gray-900 truncate">
                <Users className="w-4 h-4 md:w-5 md:h-5 inline mr-2 text-green-600" />
                Top clients
              </h3>
              <button className="text-xs md:text-sm text-purple-600 hover:text-purple-700 flex items-center self-start sm:self-auto">
                Voir tout <ChevronRight className="w-3 h-3 md:w-4 md:h-4 ml-1" />
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            {topCustomers && topCustomers.length > 0 ? (
              <table className="w-full min-w-[600px]">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Client
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Achats
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Total dépensé
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Dernier achat
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Valeur moyenne
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {topCustomers.slice(0, 8).map((customer, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="font-medium text-gray-900 truncate max-w-[120px]">
                          {customer.customer_name || 'Client anonyme'}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                          {customer.purchase_count || 0}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-bold text-gray-900 truncate">
                        {formatCurrency(customer.total_spent || 0)}
                      </td>
                      <td className="px-4 py-3 text-xs md:text-sm text-gray-600">
                        {formatDate(customer.last_purchase)}
                      </td>
                      <td className="px-4 py-3 truncate">
                        {customer.purchase_count > 0 ? 
                          formatCurrency((customer.total_spent || 0) / customer.purchase_count) : 
                          formatCurrency(0)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="px-4 md:px-6 py-8 md:py-12 text-center text-gray-500">
                <Users className="w-8 h-8 md:w-12 md:h-12 mx-auto mb-2 md:mb-3 text-gray-300" />
                <p className="text-sm md:text-base">Aucune donnée client disponible</p>
                <p className="text-xs md:text-sm">Les clients apparaîtront après les ventes</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Composant pour l'onglet Produits
  const ProductsTab = () => (
    <div className="space-y-4 md:space-y-6">
      {/* Cartes de statistiques des produits */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <div className="bg-white p-4 md:p-6 rounded-xl border shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3 md:mb-4">
            <div className="p-2 md:p-3 bg-green-50 rounded-lg">
              <Package className="w-5 h-5 md:w-6 md:h-6 text-green-600" />
            </div>
            <span className="text-xs md:text-sm font-medium text-gray-500">
              Stock
            </span>
          </div>
          <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-1">
            {productsData.totalProducts.toLocaleString()}
          </h3>
          <p className="text-gray-500 text-sm md:text-base">Produits en stock</p>
          <div className="mt-3 pt-3 border-t border-gray-100 text-xs md:text-sm text-gray-500">
            <Layers className="w-3 h-3 md:w-4 md:h-4 inline mr-1" />
            {productsData.totalStock} unités totales
          </div>
        </div>

        <div className="bg-white p-4 md:p-6 rounded-xl border shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3 md:mb-4">
            <div className="p-2 md:p-3 bg-blue-50 rounded-lg">
              <DollarSign className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
            </div>
            <span className="text-xs md:text-sm font-medium text-blue-600 truncate">
              {formatCurrency(productsData.totalValue / 1000)}K
            </span>
          </div>
          <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-1 truncate">
            {formatCurrency(productsData.totalValue)}
          </h3>
          <p className="text-gray-500 text-sm md:text-base">Total inventaire</p>
          <div className="mt-3 pt-3 border-t border-gray-100 text-xs md:text-sm text-gray-500 truncate">
            Valeur moyenne: {formatCurrency(productsData.totalProducts > 0 ? productsData.totalValue / productsData.totalProducts : 0)}
          </div>
        </div>

        <div className="bg-white p-4 md:p-6 rounded-xl border shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3 md:mb-4">
            <div className="p-2 md:p-3 bg-red-50 rounded-lg">
              <AlertCircle className="w-5 h-5 md:w-6 md:h-6 text-red-600" />
            </div>
            <span className={`text-xs md:text-sm font-medium ${
              productsData.lowStockProducts > 0 ? 'text-red-600' : 'text-green-600'
            }`}>
              {productsData.lowStockProducts || 0} faible{productsData.lowStockProducts !== 1 ? 's' : ''}
            </span>
          </div>
          <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-1">
            {productsData.totalProducts?.toLocaleString() || 0}
          </h3>
          <p className="text-gray-500 text-sm md:text-base">Produits en stock</p>
          <div className="mt-3 pt-3 border-t border-gray-100 text-xs md:text-sm text-gray-500">
            <AlertCircle className="w-3 h-3 md:w-4 md:h-4 inline mr-1" />
            Seuil: &lt; 10 unités
          </div>
        </div>

        <div className="bg-white p-4 md:p-6 rounded-xl border shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3 md:mb-4">
            <div className="p-2 md:p-3 bg-purple-50 rounded-lg">
              <Layers className="w-5 h-5 md:w-6 md:h-6 text-purple-600" />
            </div>
            <span className="text-xs md:text-sm font-medium text-gray-500">
              {productsData.categories?.length || 0}
            </span>
          </div>
          <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-1">
            {productsData.categories?.length || 0}
          </h3>
          <p className="text-gray-500 text-sm md:text-base">Catégories</p>
          <div className="mt-3 pt-3 border-t border-gray-100 text-xs md:text-sm text-gray-500">
            <BarChart2 className="w-3 h-3 md:w-4 md:h-4 inline mr-1" />
            Diversité des produits
          </div>
        </div>
      </div>

      {/* Graphiques des produits */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Top produits par valeur */}
        <div className="bg-white p-4 md:p-6 rounded-xl border shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 md:mb-6 gap-2">
            <h3 className="text-base md:text-lg font-semibold text-gray-900 truncate">
              <Package className="w-4 h-4 md:w-5 md:h-5 inline mr-2 text-green-600" />
              Top produits (valeur du stock)
            </h3>
            <button className="text-xs md:text-sm text-purple-600 hover:text-purple-700 self-start sm:self-auto">
              Voir top 20
            </button>
          </div>
          <div className="h-64 md:h-80">
            {getTopProductsData().length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={getTopProductsData()}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="name" 
                    angle={isMobile ? -45 : 0} 
                    textAnchor={isMobile ? "end" : "middle"} 
                    height={isMobile ? 80 : 60} 
                    fontSize={isMobile ? 10 : 12}
                  />
                  <YAxis fontSize={isMobile ? 10 : 12} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ fontSize: isMobile ? '10px' : '12px' }} />
                  <Bar dataKey="valeur" name="Valeur (€)" fill="#10B981" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="quantité" name="Quantité" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-gray-500 p-4">
                <Package className="w-8 h-8 md:w-12 md:h-12 mb-2 md:mb-3 text-gray-300" />
                <p className="text-sm md:text-base text-center">Aucun produit en stock</p>
                <p className="text-xs md:text-sm text-center">Ajoutez des produits pour voir les statistiques</p>
              </div>
            )}
          </div>
        </div>

        {/* Stock par catégorie */}
        <div className="bg-white p-4 md:p-6 rounded-xl border shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 md:mb-6 gap-2">
            <h3 className="text-base md:text-lg font-semibold text-gray-900 truncate">
              <BarChart2 className="w-4 h-4 md:w-5 md:h-5 inline mr-2 text-purple-600" />
              Stock par catégorie
            </h3>
            <div className="flex space-x-2 self-start sm:self-auto">
              <button className="px-2 py-1 text-xs rounded bg-purple-100 text-purple-600">
                Quantité
              </button>
              <button className="px-2 py-1 text-xs rounded bg-gray-100">
                Valeur
              </button>
            </div>
          </div>
          <div className="h-64 md:h-80">
            {getCategoryData().length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={getCategoryData()}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" fontSize={isMobile ? 10 : 12} />
                  <YAxis fontSize={isMobile ? 10 : 12} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ fontSize: isMobile ? '10px' : '12px' }} />
                  <Bar dataKey="stock" name="Stock total" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-gray-500 p-4">
                <Layers className="w-8 h-8 md:w-12 md:h-12 mb-2 md:mb-3 text-gray-300" />
                <p className="text-sm md:text-base text-center">Aucune catégorie définie</p>
                <p className="text-xs md:text-sm text-center">Catégorisez vos produits pour voir les statistiques</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tableau des produits à faible stock */}
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <div className="p-4 md:p-6 border-b">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex-1">
              <h3 className="text-base md:text-lg font-semibold text-gray-900 flex items-center">
                <AlertCircle className="w-4 h-4 md:w-5 md:h-5 inline mr-2 text-red-600" />
                Produits à réapprovisionner
              </h3>
              <p className="text-xs md:text-sm text-gray-500 mt-1">
                Produits avec un stock inférieur à 10 unités
              </p>
            </div>
            <div className="flex items-center space-x-2 self-start sm:self-auto">
              <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs md:text-sm font-medium whitespace-nowrap">
                {productsData.lowStockProducts || 0} produit{productsData.lowStockProducts !== 1 ? 's' : ''}
              </span>
              <button className="text-xs md:text-sm text-purple-600 hover:text-purple-700 flex items-center">
                Commander <ChevronRight className="w-3 h-3 md:w-4 md:h-4 ml-1" />
              </button>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          {productsData.lowStockList && productsData.lowStockList.length > 0 ? (
            <table className="w-full min-w-[600px]">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Produit
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Catégorie
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Stock actuel
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Prix unitaire
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Valeur stock
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Statut
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {productsData.lowStockList.slice(0, 10).map((product, index) => (
                  <tr key={product.id || index} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900 truncate max-w-[100px] md:max-w-[150px]">{product.name}</div>
                      <div className="text-xs text-gray-500">SKU: {product.sku || 'N/A'}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 text-xs bg-gray-100 rounded-full whitespace-nowrap">
                        {product.category || 'Non catégorisé'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center">
                        <div className="w-16 md:w-24 bg-gray-200 rounded-full h-2 mr-2 md:mr-3">
                          <div 
                            className={`h-2 rounded-full ${
                              product.quantity < 3 ? 'bg-red-500' : 
                              product.quantity < 5 ? 'bg-yellow-500' : 'bg-orange-500'
                            }`}
                            style={{ width: `${(product.quantity / 10) * 100}%` }}
                          ></div>
                        </div>
                        <span className={`font-medium text-xs md:text-sm ${
                          product.quantity < 3 ? 'text-red-600' : 
                          product.quantity < 5 ? 'text-yellow-600' : 'text-orange-600'
                        }`}>
                          {product.quantity}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs md:text-sm">
                      {formatCurrency(product.price || 0)}
                    </td>
                    <td className="px-4 py-3 font-medium text-xs md:text-sm truncate">
                      {formatCurrency(product.stockValue || 0)}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 text-xs rounded-full whitespace-nowrap ${
                        product.quantity === 0 
                          ? 'bg-red-100 text-red-800'
                          : product.quantity < 3 
                          ? 'bg-red-100 text-red-800'
                          : product.quantity < 5
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-orange-100 text-orange-800'
                      }`}>
                        {product.quantity === 0 ? 'RUPTURE' :
                         product.quantity < 3 ? 'CRITIQUE' : 
                         product.quantity < 5 ? 'FAIBLE' : 'MOYEN'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="px-4 md:px-6 py-8 md:py-12 text-center text-gray-500">
              <Package className="w-8 h-8 md:w-12 md:h-12 mx-auto mb-2 md:mb-3 text-gray-300" />
              <p className="text-sm md:text-base">Aucun produit à faible stock</p>
              <p className="text-xs md:text-sm">Tous les produits ont un stock suffisant</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // Composant pour l'onglet Revenus
  const RevenueTab = () => {
    const periodSalesCount = getPeriodSalesCount();
    const periodRevenue = getPeriodRevenue();
    
    return (
      <div className="space-y-4 md:space-y-6">
        {/* Cartes de statistiques des revenus */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <div className="bg-white p-4 md:p-6 rounded-xl border shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3 md:mb-4">
              <div className="p-2 md:p-3 bg-green-50 rounded-lg">
                <DollarSign className="w-5 h-5 md:w-6 md:h-6 text-green-600" />
              </div>
              <span className={`text-xs md:text-sm font-medium ${
                dashboardStats.monthly_revenue > dashboardStats.today_revenue * 30 ? 'text-green-600' : 'text-red-600'
              }`}>
                <TrendingUp className="w-3 h-3 md:w-4 md:h-4 inline mr-1" />
                Mois
              </span>
            </div>
            <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-1 truncate">
              {formatCurrency(dashboardStats.monthly_revenue)}
            </h3>
            <p className="text-gray-500 text-sm md:text-base">Revenus mensuels</p>
            <div className="mt-3 pt-3 border-t border-gray-100 text-xs md:text-sm text-gray-500">
              <div className="flex justify-between">
                <span>Aujourd'hui:</span>
                <span className="truncate">{formatCurrency(dashboardStats.today_revenue)}</span>
              </div>
              <div className="flex justify-between text-green-600 mt-1">
                <span>Ventes aujourd'hui:</span>
                <span>{dashboardStats.today_sales}</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 md:p-6 rounded-xl border shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3 md:mb-4">
              <div className="p-2 md:p-3 bg-blue-50 rounded-lg">
                <ShoppingBag className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
              </div>
              <span className="text-xs md:text-sm font-medium text-blue-600 truncate">
                Période: {timeRange}
              </span>
            </div>
            <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-1 truncate">
              {periodSalesCount > 0 ? formatCurrency(periodRevenue / periodSalesCount) : formatCurrency(0)}
            </h3>
            <p className="text-gray-500 text-sm md:text-base">Ticket moyen</p>
            <div className="mt-3 pt-3 border-t border-gray-100 text-xs md:text-sm text-gray-500">
              <div className="flex justify-between">
                <span>Ventes:</span>
                <span>{periodSalesCount}</span>
              </div>
              <div className="flex justify-between text-green-600 mt-1">
                <span>Total:</span>
                <span className="truncate">{formatCurrency(periodRevenue)}</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 md:p-6 rounded-xl border shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3 md:mb-4">
              <div className="p-2 md:p-3 bg-purple-50 rounded-lg">
                <Calendar className="w-5 h-5 md:w-6 md:h-6 text-purple-600" />
              </div>
              <span className="text-xs md:text-sm font-medium text-gray-500">
                Ce mois
              </span>
            </div>
            <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-1 truncate">
              {formatCurrency(dashboardStats.monthly_revenue)}
            </h3>
            <p className="text-gray-500 text-sm md:text-base">Revenus mensuels</p>
            <div className="mt-3 pt-3 border-t border-gray-100 text-xs md:text-sm text-gray-500">
              <div className="flex justify-between">
                <span>Ventes:</span>
                <span>{dashboardStats.monthly_sales}</span>
              </div>
              <div className="flex justify-between text-green-600 mt-1">
                <span>Moyenne/jour:</span>
                <span className="truncate">{formatCurrency(dashboardStats.monthly_sales > 0 ? dashboardStats.monthly_revenue / dashboardStats.monthly_sales : 0)}</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 md:p-6 rounded-xl border shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3 md:mb-4">
              <div className="p-2 md:p-3 bg-amber-50 rounded-lg">
                <Tag className="w-5 h-5 md:w-6 md:h-6 text-amber-600" />
              </div>
              <span className="text-xs md:text-sm font-medium text-amber-600 truncate">
                Remises: {performanceStats.promotion_usage.toFixed(1)}%
              </span>
            </div>
            <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-1 truncate">
              {formatCurrency(performanceStats.total_discounts || 0)}
            </h3>
            <p className="text-gray-500 text-sm md:text-base">Total remises</p>
            <div className="mt-3 pt-3 border-t border-gray-100 text-xs md:text-sm text-gray-500">
              <div className="flex justify-between">
                <span>Efficacité:</span>
                <span>{performanceStats.promotion_usage.toFixed(1)}%</span>
              </div>
              <div className="flex justify-between text-gray-500 mt-1">
                <span>% du revenu:</span>
                <span>{periodRevenue > 0 ? ((performanceStats.total_discounts / periodRevenue) * 100).toFixed(1) : '0'}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Graphiques des revenus */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          {/* Évolution des revenus mensuels */}
          <div className="bg-white p-4 md:p-6 rounded-xl border shadow-sm">
            <div className="flex items-center justify-between mb-4 md:mb-6">
              <h3 className="text-base md:text-lg font-semibold text-gray-900 truncate">
                <TrendingUp className="w-4 h-4 md:w-5 md:h-5 inline mr-2 text-blue-600" />
                Évolution des revenus ({new Date().getFullYear()})
              </h3>
            </div>
            <div className="h-64 md:h-80">
              {monthlyStats && monthlyStats.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyStats}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" fontSize={isMobile ? 10 : 12} />
                    <YAxis fontSize={isMobile ? 10 : 12} />
                    <Tooltip 
                      formatter={(value) => [formatCurrency(value), 'Revenus']}
                    />
                    <Legend wrapperStyle={{ fontSize: isMobile ? '10px' : '12px' }} />
                    <Line 
                      type="monotone" 
                      dataKey="total_revenue" 
                      stroke="#3B82F6" 
                      name="Revenus nets"
                      strokeWidth={3}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-gray-500 p-4">
                  <BarChart2 className="w-8 h-8 md:w-12 md:h-12 mb-2 md:mb-3 text-gray-300" />
                  <p className="text-sm md:text-base text-center">Aucune donnée de revenus disponible</p>
                  <p className="text-xs md:text-sm text-center">Les revenus apparaîtront ici</p>
                </div>
              )}
            </div>
          </div>

          {/* Performances quotidiennes */}
          <div className="bg-white p-4 md:p-6 rounded-xl border shadow-sm">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 md:mb-6 gap-2">
              <h3 className="text-base md:text-lg font-semibold text-gray-900 truncate">
                <Activity className="w-4 h-4 md:w-5 md:h-5 inline mr-2 text-green-600" />
                Performances quotidiennes
              </h3>
              <select 
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="text-sm border rounded-lg px-3 py-1 w-full sm:w-auto"
              >
                <option value="7days">7 jours</option>
                <option value="30days">30 jours</option>
                <option value="90days">90 jours</option>
                <option value="year">Année</option>
              </select>
            </div>
            <div className="h-64 md:h-80">
              {dailyStats && dailyStats.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dailyStats.slice(0, 14)}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="date" fontSize={isMobile ? 10 : 12} />
                    <YAxis fontSize={isMobile ? 10 : 12} />
                    <Tooltip 
                      formatter={(value, name) => {
                        if (name === 'total_revenue') {
                          return [formatCurrency(value), 'Revenus'];
                        }
                        return [value, name === 'sales_count' ? 'Ventes' : name];
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: isMobile ? '10px' : '12px' }} />
                    <Bar 
                      dataKey="total_revenue" 
                      name="Revenus" 
                      fill="#10B981" 
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar 
                      dataKey="sales_count" 
                      name="Ventes" 
                      fill="#3B82F6" 
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-gray-500 p-4">
                  <Activity className="w-8 h-8 md:w-12 md:h-12 mb-2 md:mb-3 text-gray-300" />
                  <p className="text-sm md:text-base text-center">Aucune donnée de performances</p>
                  <p className="text-xs md:text-sm text-center">Les performances apparaîtront après les ventes</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {notification && (
        <Notification
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}

      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b">
        <div className="px-4 md:px-6 py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-50 rounded-lg">
                <BarChart3 className="w-5 h-5 md:w-6 md:h-6 text-purple-600" />
              </div>
              <div>
                <h1 className="text-lg md:text-xl font-bold text-gray-900">Rapports & Statistiques</h1>
                <div className="flex flex-wrap items-center gap-2 text-xs md:text-sm text-gray-500">
                  <span>Analyse avancée avec remises et promotions</span>
                  <span className="hidden sm:inline w-1 h-1 bg-gray-300 rounded-full"></span>
                  <span className="sm:inline">{dashboardStats.monthly_sales} ventes ce mois</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 self-start sm:self-auto">
              <button
                onClick={() => loadAllStats()}
                className="flex items-center space-x-2 px-3 py-2 md:px-4 md:py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors w-full sm:w-auto justify-center"
              >
                <RefreshCw className="w-4 h-4" />
                <span className="text-sm">Actualiser</span>
              </button>
            </div>
          </div>
        </div>

        {/* Filtres */}
        <div className="px-4 md:px-6 py-3 border-t bg-gray-50">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 md:w-5 md:h-5 text-gray-500 flex-shrink-0" />
              <div className="flex flex-wrap gap-1 md:gap-2">
                {['7days', '30days', '90days', 'year'].map((p) => {
                  const labels = {
                    '7days': '7 jours',
                    '30days': '30 jours',
                    '90days': '90 jours',
                    'year': 'Année'
                  };
                  return (
                    <button
                      key={p}
                      onClick={() => setTimeRange(p)}
                      className={`flex items-center space-x-1 px-2 py-1 md:px-3 md:py-1.5 text-xs md:text-sm rounded-lg transition-colors whitespace-nowrap ${
                        timeRange === p
                          ? 'bg-purple-600 text-white'
                          : 'bg-white text-gray-600 hover:bg-gray-100 border'
                      }`}
                    >
                      <span>{labels[p]}</span>
                    </button>
                  );
                })}
              </div>
            </div>
            
            <button
              onClick={loadAllStats}
              disabled={loading}
              className="flex items-center space-x-2 px-3 py-1.5 bg-white border rounded-lg hover:bg-gray-50 disabled:opacity-50 w-full sm:w-auto justify-center mt-2 sm:mt-0"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span className="text-sm">Actualiser</span>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="px-4 md:px-6 border-t overflow-x-auto">
          <div className="flex space-x-1 min-w-max">
            <button
              onClick={() => setActiveTab('sales')}
              className={`px-3 py-2 md:px-4 md:py-3 text-xs md:text-sm font-medium border-b-2 transition-colors flex items-center whitespace-nowrap ${
                activeTab === 'sales'
                  ? 'border-purple-600 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <ShoppingCart className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
              Ventes
              <span className="ml-1 md:ml-2 px-1.5 py-0.5 bg-purple-100 text-purple-600 text-xs rounded-full">
                {dashboardStats.monthly_sales}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('products')}
              className={`px-3 py-2 md:px-4 md:py-3 text-xs md:text-sm font-medium border-b-2 transition-colors flex items-center whitespace-nowrap ${
                activeTab === 'products'
                  ? 'border-purple-600 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Package className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
              Produits
              <span className="ml-1 md:ml-2 px-1.5 py-0.5 bg-green-100 text-green-600 text-xs rounded-full">
                {productsData.totalProducts}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('revenue')}
              className={`px-3 py-2 md:px-4 md:py-3 text-xs md:text-sm font-medium border-b-2 transition-colors flex items-center whitespace-nowrap ${
                activeTab === 'revenue'
                  ? 'border-purple-600 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <DollarSign className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
              Revenus
              <span className="ml-1 md:ml-2 px-1.5 py-0.5 bg-blue-100 text-blue-600 text-xs rounded-full truncate max-w-[80px]">
                {formatCurrency(dashboardStats.monthly_revenue).replace('€', '').trim()}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="flex-1 overflow-auto p-4 md:p-6">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 md:h-12 md:w-12 border-b-2 border-purple-600 mx-auto mb-3 md:mb-4"></div>
              <p className="text-sm md:text-base text-gray-600">Chargement des statistiques...</p>
            </div>
          </div>
        ) : (
          <>
            {activeTab === 'sales' && <SalesTab />}
            {activeTab === 'products' && <ProductsTab />}
            {activeTab === 'revenue' && <RevenueTab />}
          </>
        )}
      </div>

      {/* Footer */}
      <div className="border-t bg-white px-4 md:px-6 py-3 md:py-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs md:text-sm text-gray-500">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <span>Dernière mise à jour: {new Date().toLocaleString('fr-FR')}</span>
            {performanceStats.total_discounts > 0 && (
              <span className="text-green-600 hidden sm:inline">
                Remises totales: {formatCurrency(performanceStats.total_discounts)}
              </span>
            )}
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <span>{dashboardStats.monthly_sales} ventes ce mois</span>
            <span className="text-green-600">
              Revenu: {formatCurrency(dashboardStats.monthly_revenue)}
            </span>
            <button
              onClick={() => window.print()}
              className="text-purple-600 hover:text-purple-700 flex items-center self-start sm:self-auto"
            >
              <Download className="w-3 h-3 md:w-4 md:h-4 mr-1" />
              Imprimer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}