
// 'use client';

// import { useState, useEffect } from 'react';
// import { supabase } from '@/lib/supabase';
// import Link from 'next/link';
// import { 
//   ArrowLeft, 
//   TrendingUp, 
//   Users, 
//   DollarSign, 
//   ShoppingCart, 
//   CreditCard, 
//   BarChart3,
//   PieChart as PieChartIcon,
//   Calendar,
//   Filter,
//   Activity,
//   Target,
//   Wallet,
//   User,
//   Grid
// } from 'lucide-react';
// import UsersSalesAnalytics from '../mouvement/page';

// export default function CombinedUsersAnalytics() {
//   // États simplifiés
//   const [loading, setLoading] = useState(false);
//   const [allVendors, setAllVendors] = useState([]);
//   const [searchQuery, setSearchQuery] = useState('');
  
//   // États onglets
//   const [activeTab, setActiveTab] = useState('list');
//   const [analyticsView, setAnalyticsView] = useState('overview');
  
//   // États filtres Liste
//   const [listDateRange, setListDateRange] = useState('all');
//   const [listCustomStart, setListCustomStart] = useState('');
//   const [listCustomEnd, setListCustomEnd] = useState('');
//   const [showListFilters, setShowListFilters] = useState(true);
  
//   // États filtres Analytics
//   const [showAnalyticsFilters, setShowAnalyticsFilters] = useState(false);
//   const [analyticsDateRange, setAnalyticsDateRange] = useState('week');
  
//   // Stats
//   const [statsCards, setStatsCards] = useState([
//     { id: 'sales', label: 'Chiffre d\'affaires', value: 0, icon: DollarSign, color: 'text-blue-500', bg: 'bg-blue-50', currency: true },
//     { id: 'revenue', label: 'Bénéfice net', value: 0, icon: TrendingUp, color: 'text-green-500', bg: 'bg-green-50', currency: true },
//     { id: 'transactions', label: 'Transactions', value: 0, icon: ShoppingCart, color: 'text-purple-500', bg: 'bg-purple-50', currency: false },
//     { id: 'expenses', label: 'Dépenses', value: 0, icon: CreditCard, color: 'text-red-500', bg: 'bg-red-50', currency: true },
//     { id: 'balance', label: 'Solde Total', value: 0, icon: Wallet, color: 'text-orange-500', bg: 'bg-orange-50', currency: true }
//   ]);

//   // Fonctions utilitaires
//   const getProfileImageUrl = (profileImagePath) => {
//     if (!profileImagePath) return null;
//     const { data } = supabase.storage
//       .from('avatars')
//       .getPublicUrl(profileImagePath);
//     return data.publicUrl + '?t=' + new Date().getTime();
//   };

//   const formatCurrency = (amount, currency = 'CDF') => {
//     if (currency === 'USD') {
//       return new Intl.NumberFormat('en-US', {
//         style: 'currency',
//         currency: 'USD',
//         minimumFractionDigits: 0,
//         maximumFractionDigits: 0
//       }).format(amount);
//     }
//     return new Intl.NumberFormat('fr-FR', {
//       style: 'currency',
//       currency: 'CDF',
//       minimumFractionDigits: 0,
//       maximumFractionDigits: 0
//     }).format(amount).replace('CDF', 'FC');
//   };

//   const formatNumber = (num) => {
//     if (!num) return '0';
//     return new Intl.NumberFormat('fr-FR').format(Math.round(num));
//   };

//   const formatDate = (date) => {
//     if (!date) return 'N/A';
//     return new Date(date).toLocaleDateString('fr-FR', {
//       day: '2-digit',
//       month: '2-digit',
//       year: 'numeric'
//     });
//   };

//   // Fonction pour calculer la période
//   const getDateRange = (period) => {
//     const now = new Date();
//     let startDate = null;
//     let endDate = null;
    
//     switch (period) {
//       case 'today':
//         startDate = new Date(now.setHours(0, 0, 0, 0));
//         endDate = new Date(now.setHours(23, 59, 59, 999));
//         break;
//       case 'yesterday':
//         const yesterday = new Date(now);
//         yesterday.setDate(yesterday.getDate() - 1);
//         yesterday.setHours(0, 0, 0, 0);
//         startDate = new Date(yesterday);
//         endDate = new Date(yesterday);
//         endDate.setHours(23, 59, 59, 999);
//         break;
//       case 'week':
//         startDate = new Date(now.setDate(now.getDate() - 7));
//         startDate.setHours(0, 0, 0, 0);
//         endDate = new Date();
//         endDate.setHours(23, 59, 59, 999);
//         break;
//       case 'month':
//         startDate = new Date(now.setMonth(now.getMonth() - 1));
//         startDate.setHours(0, 0, 0, 0);
//         endDate = new Date();
//         endDate.setHours(23, 59, 59, 999);
//         break;
//       case 'year':
//         startDate = new Date(now.setFullYear(now.getFullYear() - 1));
//         startDate.setHours(0, 0, 0, 0);
//         endDate = new Date();
//         endDate.setHours(23, 59, 59, 999);
//         break;
//       default:
//         startDate = null;
//         endDate = null;
//     }
    
//     return { startDate, endDate };
//   };

//   // Fonction principale pour charger les données
//   const fetchVendorsData = async () => {
//     try {
//       setLoading(true);
      
//       let startDate = null;
//       let endDate = null;
      
//       // Déterminer la période
//       if (listDateRange !== 'all') {
//         const range = getDateRange(listDateRange);
//         startDate = range.startDate;
//         endDate = range.endDate;
//       } else if (listCustomStart && listCustomEnd) {
//         startDate = new Date(listCustomStart);
//         startDate.setHours(0, 0, 0, 0);
//         endDate = new Date(listCustomEnd);
//         endDate.setHours(23, 59, 59, 999);
//       }

//       // 1. Récupérer les vendeurs
//       let usersQuery = supabase
//         .from('users')
//         .select('*')
//         .eq('role', 'vendor')
//         .eq('is_active', true);

//       if (searchQuery) {
//         usersQuery = usersQuery.or(`full_name.ilike.%${searchQuery}%,email.ilike.%${searchQuery}%,shop_name.ilike.%${searchQuery}%`);
//       }

//       const { data: vendors, error: vendorsError } = await usersQuery;
//       if (vendorsError) throw vendorsError;

//       if (!vendors || vendors.length === 0) {
//         setAllVendors([]);
//         updateStatsCards(0, 0, 0, 0, 0);
//         setLoading(false);
//         return;
//       }

//       // 2. Pour chaque vendeur, récupérer les ventes et dépenses
//       const usersWithFinancialData = await Promise.all(
//         vendors.map(async (vendor) => {
//           // Ventes
//           let salesQuery = supabase
//             .from('sale')
//             .select('id, total, currency, created_at')
//             .eq('user_id', vendor.id)
//             .eq('status', 'completed');

//           if (startDate && endDate) {
//             salesQuery = salesQuery
//               .gte('created_at', startDate.toISOString())
//               .lte('created_at', endDate.toISOString());
//           }

//           const { data: sales, error: salesError } = await salesQuery;
//           if (salesError) throw salesError;

//           // Dépenses - CORRECTION ICI: Utiliser created_at au lieu de date
//           let expensesQuery = supabase
//             .from('cash_outflow')
//             .select('id, amount, currency, created_at, date')
//             .eq('user_id', vendor.id)
//             .eq('status', 'completed');

//           if (startDate && endDate) {
//             expensesQuery = expensesQuery
//               .gte('created_at', startDate.toISOString())
//               .lte('created_at', endDate.toISOString());
//           }

//           const { data: expenses, error: expensesError } = await expensesQuery;
//           if (expensesError) throw expensesError;

//           // Calculs
//           let totalSalesCDF = 0;
//           let totalSalesUSD = 0;
//           let totalExpensesCDF = 0;
//           let totalExpensesUSD = 0;

//           if (sales && sales.length > 0) {
//             sales.forEach(sale => {
//               if (sale.currency === 'USD') {
//                 totalSalesUSD += sale.total || 0;
//               } else {
//                 totalSalesCDF += sale.total || 0;
//               }
//             });
//           }

//           if (expenses && expenses.length > 0) {
//             expenses.forEach(expense => {
//               if (expense.currency === 'USD') {
//                 totalExpensesUSD += expense.amount || 0;
//               } else {
//                 totalExpensesCDF += expense.amount || 0;
//               }
//             });
//           }

//           const revenueCDF = totalSalesCDF;
//           const revenueUSD = totalSalesUSD;
//           const balanceCDF = revenueCDF - totalExpensesCDF;
//           const balanceUSD = revenueUSD - totalExpensesUSD;

//           let lastSale = null;
//           if (sales && sales.length > 0) {
//             const sortedSales = [...sales].sort((a, b) => 
//               new Date(b.created_at) - new Date(a.created_at)
//             );
//             lastSale = sortedSales[0].created_at;
//           }

//           // Trouver la dernière dépense
//           let lastExpense = null;
//           if (expenses && expenses.length > 0) {
//             const sortedExpenses = [...expenses].sort((a, b) => 
//               new Date(b.created_at) - new Date(a.created_at)
//             );
//             lastExpense = sortedExpenses[0].created_at;
//           }

//           return {
//             ...vendor,
//             profile_image_url: vendor.profile_image ? getProfileImageUrl(vendor.profile_image) : null,
//             total_sales_cdf: Math.round(totalSalesCDF),
//             total_sales_usd: Math.round(totalSalesUSD),
//             sales_count: sales?.length || 0,
//             last_sale: lastSale,
//             total_expenses_cdf: Math.round(totalExpensesCDF),
//             total_expenses_usd: Math.round(totalExpensesUSD),
//             expenses_count: expenses?.length || 0,
//             last_expense: lastExpense,
//             revenue_cdf: Math.round(revenueCDF),
//             revenue_usd: Math.round(revenueUSD),
//             balance_cdf: Math.round(balanceCDF),
//             balance_usd: Math.round(balanceUSD),
//           };
//         })
//       );

//       // Trier par revenu
//       const sortedUsers = usersWithFinancialData.sort((a, b) => b.revenue_cdf - a.revenue_cdf);

//       // Calculer les totaux
//       const totalSalesCDF = sortedUsers.reduce((sum, user) => sum + user.total_sales_cdf, 0);
//       const totalRevenueCDF = sortedUsers.reduce((sum, user) => sum + user.revenue_cdf, 0);
//       const totalExpensesCDF = sortedUsers.reduce((sum, user) => sum + user.total_expenses_cdf, 0);
//       const totalBalanceCDF = sortedUsers.reduce((sum, user) => sum + user.balance_cdf, 0);
//       const totalTransactions = sortedUsers.reduce((sum, user) => sum + user.sales_count, 0);

//       // Mettre à jour les états
//       setAllVendors(sortedUsers);
//       updateStatsCards(
//         totalSalesCDF,
//         totalRevenueCDF,
//         totalTransactions,
//         totalExpensesCDF,
//         totalBalanceCDF
//       );

//     } catch (error) {
//       console.error('Erreur lors de la récupération des données:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Mettre à jour les cards de stats
//   const updateStatsCards = (sales, revenue, transactions, expenses, balance) => {
//     setStatsCards([
//       { id: 'sales', label: 'Chiffre d\'affaires', value: sales, icon: DollarSign, color: 'text-blue-500', bg: 'bg-blue-50', currency: true },
//       { id: 'revenue', label: 'Bénéfice net', value: revenue, icon: TrendingUp, color: 'text-green-500', bg: 'bg-green-50', currency: true },
//       { id: 'transactions', label: 'Transactions', value: transactions, icon: ShoppingCart, color: 'text-purple-500', bg: 'bg-purple-50', currency: false },
//       { id: 'expenses', label: 'Dépenses', value: expenses, icon: CreditCard, color: 'text-red-500', bg: 'bg-red-50', currency: true },
//       { id: 'balance', label: 'Solde Total', value: balance, icon: Wallet, color: 'text-orange-500', bg: 'bg-orange-50', currency: true }
//     ]);
//   };

//   // Charger les données au montage et quand les filtres changent
//   useEffect(() => {
//     fetchVendorsData();
//   }, [listDateRange, listCustomStart, listCustomEnd]);

//   // Handlers
//   const handleListSearch = (e) => {
//     e.preventDefault();
//     fetchVendorsData();
//   };

//   const handleListCustomDateFilter = () => {
//     if (listCustomStart && listCustomEnd) {
//       setListDateRange('all');
//       fetchVendorsData();
//     }
//   };

//   const resetListFilters = () => {
//     setListDateRange('all');
//     setListCustomStart('');
//     setListCustomEnd('');
//     setSearchQuery('');
//     fetchVendorsData();
//   };

//   // Composant pour les cards de stats
//   const StatsCards = () => (
//     <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
//       {statsCards.map((card) => (
//         <div key={card.id} className="bg-white p-3 rounded-lg border border-gray-200">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-xs text-gray-500">{card.label}</p>
//               <p className={`text-sm font-semibold ${
//                 card.id === 'revenue' ? 'text-green-600' :
//                 card.id === 'expenses' ? 'text-red-600' :
//                 card.id === 'balance' ? (card.value >= 0 ? 'text-green-600' : 'text-red-600') :
//                 'text-gray-900'
//               }`}>
//                 {card.currency ? formatCurrency(card.value) : formatNumber(card.value)}
//               </p>
//             </div>
//             <div className={`p-2 rounded-lg ${card.bg}`}>
//               <card.icon className={`w-4 h-4 ${card.color}`} />
//             </div>
//           </div>
//         </div>
//       ))}
//     </div>
//   );

//   // Render List Tab - Version simplifiée et fonctionnelle
//   const renderListTab = () => {
//     return (
//       <div className="space-y-6">
//         {/* Cards de stats */}
//         <StatsCards />

//         {/* Filtres pour Liste */}
//         {showListFilters && (
//           <div className="bg-white p-4 rounded-lg border border-gray-200 mb-6">
//             {/* Barre de recherche */}
//             <div className="mb-4">
//               <input
//                 type="text"
//                 placeholder="Rechercher un vendeur..."
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 onKeyPress={(e) => e.key === 'Enter' && handleListSearch(e)}
//                 className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
//               />
//             </div>

//             <div className="flex flex-col md:flex-row gap-4">
//               {/* Filtres rapides */}
//               <div className="flex flex-wrap gap-2">
//                 {['today', 'yesterday', 'week', 'month', 'all'].map((period) => (
//                   <button
//                     key={period}
//                     onClick={() => {
//                       setListDateRange(period);
//                       setListCustomStart('');
//                       setListCustomEnd('');
//                     }}
//                     className={`px-2 py-1 text-xs rounded border ${
//                       listDateRange === period
//                         ? 'bg-blue-50 text-blue-600 border-blue-200'
//                         : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
//                     }`}
//                   >
//                     {period === 'today' ? "Aujourd'hui" :
//                      period === 'yesterday' ? 'Hier' :
//                      period === 'week' ? '7j' :
//                      period === 'month' ? '30j' : 'Tous'}
//                   </button>
//                 ))}
//               </div>

//               {/* Dates personnalisées */}
//               <div className="flex items-center gap-2">
//                 <input
//                   type="date"
//                   value={listCustomStart}
//                   onChange={(e) => setListCustomStart(e.target.value)}
//                   className="px-2 py-1 text-xs border border-gray-300 rounded"
//                 />
//                 <span className="text-xs text-gray-500">à</span>
//                 <input
//                   type="date"
//                   value={listCustomEnd}
//                   onChange={(e) => setListCustomEnd(e.target.value)}
//                   className="px-2 py-1 text-xs border border-gray-300 rounded"
//                 />
//                 <button
//                   onClick={handleListCustomDateFilter}
//                   disabled={!listCustomStart || !listCustomEnd}
//                   className={`px-2 py-1 text-xs rounded ${
//                     !listCustomStart || !listCustomEnd
//                       ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
//                       : 'bg-blue-600 text-white hover:bg-blue-700'
//                   }`}
//                 >
//                   OK
//                 </button>
//                 <button
//                   onClick={resetListFilters}
//                   className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
//                 >
//                   Reset
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Liste des vendeurs */}
//         <div>
//           <div className="mb-4">
//             <h2 className="text-sm font-medium text-gray-700">
//               {loading ? 'Chargement...' : `${allVendors.length} vendeur(s)`}
//             </h2>
//           </div>

//           {loading ? (
//             <div className="flex justify-center py-12">
//               <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
//             </div>
//           ) : allVendors.length === 0 ? (
//             <div className="text-center py-8">
//               <p className="text-sm text-gray-500">Aucun vendeur trouvé</p>
//             </div>
//           ) : (
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
//               {allVendors.map((user) => (
//                 <div key={user.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors">
//                   {/* Header de la carte */}
//                   <div className="flex items-start space-x-3 mb-4">
//                     {/* Avatar */}
//                     <div className="flex-shrink-0">
//                       <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
//                         {user.profile_image_url ? (
//                           <img
//                             src={user.profile_image_url}
//                             alt={user.full_name}
//                             className="w-full h-full object-cover"
//                             onError={(e) => {
//                               e.target.style.display = 'none';
//                             }}
//                           />
//                         ) : (
//                           <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
//                           </svg>
//                         )}
//                       </div>
//                     </div>

//                     {/* Informations */}
//                     <div className="flex-1 min-w-0">
//                       <h3 className="text-sm font-semibold text-gray-900 truncate">{user.full_name}</h3>
//                       {user.shop_name && (
//                         <p className="text-xs text-gray-500 mt-1 truncate">{user.shop_name}</p>
//                       )}
//                       <div className="flex items-center space-x-2 mt-2">
//                         <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-700 rounded">
//                           {user.sales_count || 0} ventes
//                         </span>
//                         {user.expenses_count > 0 && (
//                           <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-700 rounded">
//                             {user.expenses_count} dép.
//                           </span>
//                         )}
//                       </div>
//                     </div>
//                   </div>

//                   {/* Stats minimales */}
//                   <div className="space-y-3">
//                     {/* Ventes et Recette */}
//                     <div className="grid grid-cols-2 gap-2">
//                       <div>
//                         <p className="text-xs text-gray-500 mb-1">Ventes</p>
//                         <p className="text-sm font-medium text-gray-900">
//                           {formatCurrency(user.total_sales_cdf || 0)}
//                         </p>
//                         {user.total_sales_usd > 0 && (
//                           <p className="text-xs text-gray-500">
//                             {formatCurrency(user.total_sales_usd, 'USD')}
//                           </p>
//                         )}
//                       </div>
//                       <div>
//                         <p className="text-xs text-gray-500 mb-1">Recette</p>
//                         <p className="text-sm font-medium text-blue-600">
//                           {formatCurrency(user.revenue_cdf || 0)}
//                         </p>
//                         {user.revenue_usd > 0 && (
//                           <p className="text-xs text-blue-500">
//                             {formatCurrency(user.revenue_usd, 'USD')}
//                           </p>
//                         )}
//                       </div>
//                     </div>

//                     {/* Dépenses et Solde */}
//                     <div className="grid grid-cols-2 gap-2">
//                       <div>
//                         <p className="text-xs text-gray-500 mb-1">Dépenses</p>
//                         <p className="text-sm font-medium text-red-600">
//                           {formatCurrency(user.total_expenses_cdf || 0)}
//                         </p>
//                         {user.total_expenses_usd > 0 && (
//                           <p className="text-xs text-red-500">
//                             {formatCurrency(user.total_expenses_usd, 'USD')}
//                           </p>
//                         )}
//                       </div>
//                       <div>
//                         <p className="text-xs text-gray-500 mb-1">Solde</p>
//                         <p className={`text-sm font-medium ${
//                           (user.balance_cdf || 0) >= 0 ? 'text-green-600' : 'text-red-600'
//                         }`}>
//                           {formatCurrency(user.balance_cdf || 0)}
//                         </p>
//                         {user.balance_usd !== 0 && (
//                           <p className={`text-xs ${
//                             user.balance_usd >= 0 ? 'text-green-500' : 'text-red-500'
//                           }`}>
//                             {formatCurrency(Math.abs(user.balance_usd), 'USD')}
//                           </p>
//                         )}
//                       </div>
//                     </div>
//                   </div>

//                   <div className="flex space-x-2 mt-3 pt-3 border-t border-gray-100">
//                     <Link
//                       href={`/super-admin/dashboard/ventes?userId=${user.id}&dateRange=${listDateRange}&startDate=${listCustomStart || ''}&endDate=${listCustomEnd || ''}`}
//                       className="flex-1 text-center px-2 py-1 text-xs hover:underline text-blue-600 rounded transition-colors"
//                     >
//                       Voir ventes
//                       <ArrowLeft className='flex-1 w-4 inline-flex'/>
//                     </Link>
//                     <Link
//                       href={`/super-admin/dashboard/depenses?userId=${user.id}&dateRange=${listDateRange}&startDate=${listCustomStart || ''}&endDate=${listCustomEnd || ''}`}
//                       className="flex-1 text-center px-2 py-1 text-xs hover:underline text-red-600 rounded transition-colors"
//                     >
//                       Voir dépenses
//                       <ArrowLeft className='flex-1 w-4 inline-flex'/>
//                     </Link> 
//                   </div>

//                   {/* Informations supplémentaires */}
//                   <div className="pt-3 mt-3 border-t border-gray-100">
//                     <div className="flex items-center justify-between text-xs text-gray-500">
//                       <div className="flex items-center space-x-1">
//                         <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
//                         </svg>
//                         <span>Dernière vente:</span>
//                       </div>
//                       <span className="font-medium">
//                         {user.last_sale ? formatDate(user.last_sale) : 'N/A'}
//                       </span>
//                     </div>
                    
//                     {user.last_expense && (
//                       <div className="flex items-center justify-between text-xs text-gray-500 mt-1">
//                         <div className="flex items-center space-x-1">
//                           <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
//                           </svg>
//                           <span>Dernière dépense:</span>
//                         </div>
//                         <span className="font-medium">{formatDate(user.last_expense)}</span>
//                       </div>
//                     )}

//                     {user.phone && (
//                       <div className="flex items-center justify-between text-xs text-gray-500 mt-1">
//                         <div className="flex items-center space-x-1">
//                           <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
//                           </svg>
//                           <span>Tél:</span>
//                         </div>
//                         <span className="font-medium">{user.phone}</span>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>

//         {/* Footer */}
//         {!loading && allVendors.length > 0 && (
//           <div className="mt-6 pt-4 border-t border-gray-200">
//             <p className="text-xs text-gray-500 text-center">
//               Mis à jour à {new Date().toLocaleTimeString('fr-FR', { 
//                 hour: '2-digit', 
//                 minute: '2-digit' 
//               })}
//             </p>
//           </div>
//         )}
//       </div>
//     );
//   };

//   // Render Analytics Tab - Version simplifiée
//   const renderAnalyticsTab = () => {
//     return (
//       <div className="space-y-6">
//         {/* Cards de stats pour Analytics */}
//         <StatsCards />
//         <UsersSalesAnalytics/>
//         {/* Onglets Analytics internes */}
//       </div>
//     );
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 p-4">
//       {/* Header avec onglets */}
//       <div className="mb-6">
//         <div className="flex items-center justify-between mb-4">
//           <div className="flex items-center gap-3">
//             <Link 
//               href="/super-admin/dashboard"
//               className="p-2 hover:bg-gray-100 rounded-lg"
//             >
//               <ArrowLeft className="w-5 h-5 text-gray-600" />
//             </Link>
//             <div>
//               <h1 className="text-lg font-semibold text-gray-900">Analytics Vendeurs</h1>
//               <p className="text-xs text-gray-500">Performance et analyse</p>
//             </div>
//           </div>
          
//           <div className="flex items-center gap-2">
//             {/* Onglets principaux */}
//             <div className="flex bg-white border border-gray-200 rounded-lg p-1">
//               <button
//                 onClick={() => setActiveTab('list')}
//                 className={`
//                   px-3 py-1.5 text-sm font-medium rounded-md flex items-center gap-2
//                   ${activeTab === 'list' 
//                     ? 'bg-blue-50 text-blue-600' 
//                     : 'text-gray-600 hover:text-gray-900'
//                   }
//                 `}
//               >
//                 <Grid className="w-4 h-4" />
//                 Liste
//               </button>
//               <button
//                 onClick={() => setActiveTab('analytics')}
//                 className={`
//                   px-3 py-1.5 text-sm font-medium rounded-md flex items-center gap-2
//                   ${activeTab === 'analytics' 
//                     ? 'bg-blue-50 text-blue-600' 
//                     : 'text-gray-600 hover:text-gray-900'
//                   }
//                 `}
//               >
//                 <BarChart3 className="w-4 h-4" />
//                 Analytics
//               </button>
//             </div>
            
//             {/* Bouton Filtres */}
//             <button
//               onClick={() => activeTab === 'analytics' ? setShowAnalyticsFilters(!showAnalyticsFilters) : setShowListFilters(!showListFilters)}
//               className="flex items-center gap-2 px-3 py-1.5 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
//             >
//               <Filter className="w-4 h-4" />
//               Filtres
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Contenu selon l'onglet sélectionné */}
//       {activeTab === 'analytics' ? renderAnalyticsTab() : renderListTab()}

//       {/* Footer commun */}
//       <div className="mt-8 pt-6 border-t border-gray-200">
//         <div className="text-xs text-gray-500 text-center">
//           Données mises à jour: {new Date().toLocaleTimeString('fr-FR', { 
//             hour: '2-digit', 
//             minute: '2-digit' 
//           })}
//         </div>
//       </div>
//     </div>
//   );
// }

'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { 
  ArrowLeft, 
  TrendingUp, 
  Users, 
  DollarSign, 
  ShoppingCart, 
  CreditCard, 
  BarChart3,
  PieChart as PieChartIcon,
  Calendar,
  Filter,
  Activity,
  Target,
  Wallet,
  User,
  Grid
} from 'lucide-react';
import UsersSalesAnalytics from '../mouvement/page';

export default function CombinedUsersAnalytics() {
  // États simplifiés
  const [loading, setLoading] = useState(false);
  const [allVendors, setAllVendors] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  // États onglets
  const [activeTab, setActiveTab] = useState('list');
  const [analyticsView, setAnalyticsView] = useState('overview');
  
  // États filtres Liste
  const [listDateRange, setListDateRange] = useState('all');
  const [listCustomStart, setListCustomStart] = useState('');
  const [listCustomEnd, setListCustomEnd] = useState('');
  const [showListFilters, setShowListFilters] = useState(true);
  
  // États filtres Analytics
  const [showAnalyticsFilters, setShowAnalyticsFilters] = useState(false);
  const [analyticsDateRange, setAnalyticsDateRange] = useState('week');
  
  // Stats - MIS À JOUR : Ajout des données USD et suppression de bénéfice
  const [statsCards, setStatsCards] = useState([
    { 
      id: 'revenue', 
      label: 'Recette CDF', 
      value: 0, 
      valueUsd: 0, 
      icon: DollarSign, 
      color: 'text-blue-500', 
      bg: 'bg-blue-50', 
      currency: true 
    },
    { 
      id: 'revenue_usd', 
      label: 'Recette USD', 
      value: 0, 
      valueUsd: 0, 
      icon: DollarSign, 
      color: 'text-green-500', 
      bg: 'bg-green-50', 
      currency: true 
    },
    { 
      id: 'transactions', 
      label: 'Transactions', 
      value: 0, 
      icon: ShoppingCart, 
      color: 'text-purple-500', 
      bg: 'bg-purple-50', 
      currency: false 
    },
    { 
      id: 'expenses', 
      label: 'Dépenses CDF', 
      value: 0, 
      valueUsd: 0, 
      icon: CreditCard, 
      color: 'text-red-500', 
      bg: 'bg-red-50', 
      currency: true 
    },
    { 
      id: 'expenses_usd', 
      label: 'Dépenses USD', 
      value: 0, 
      valueUsd: 0, 
      icon: CreditCard, 
      color: 'text-orange-500', 
      bg: 'bg-orange-50', 
      currency: true 
    },
    { 
      id: 'balance', 
      label: 'Solde CDF', 
      value: 0, 
      valueUsd: 0, 
      icon: Wallet, 
      color: 'text-indigo-500', 
      bg: 'bg-indigo-50', 
      currency: true 
    },
    { 
      id: 'balance_usd', 
      label: 'Solde USD', 
      value: 0, 
      valueUsd: 0, 
      icon: Wallet, 
      color: 'text-pink-500', 
      bg: 'bg-pink-50', 
      currency: true 
    }
  ]);

  // Fonctions utilitaires
  const getProfileImageUrl = (profileImagePath) => {
    if (!profileImagePath) return null;
    const { data } = supabase.storage
      .from('avatars')
      .getPublicUrl(profileImagePath);
    return data.publicUrl + '?t=' + new Date().getTime();
  };

  const formatCurrency = (amount, currency = 'CDF') => {
    if (currency === 'USD') {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(amount);
    }
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'CDF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount).replace('CDF', 'FC');
  };

  const formatNumber = (num) => {
    if (!num) return '0';
    return new Intl.NumberFormat('fr-FR').format(Math.round(num));
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Fonction pour calculer la période
  const getDateRange = (period) => {
    const now = new Date();
    let startDate = null;
    let endDate = null;
    
    switch (period) {
      case 'today':
        startDate = new Date(now.setHours(0, 0, 0, 0));
        endDate = new Date(now.setHours(23, 59, 59, 999));
        break;
      case 'yesterday':
        const yesterday = new Date(now);
        yesterday.setDate(yesterday.getDate() - 1);
        yesterday.setHours(0, 0, 0, 0);
        startDate = new Date(yesterday);
        endDate = new Date(yesterday);
        endDate.setHours(23, 59, 59, 999);
        break;
      case 'week':
        startDate = new Date(now.setDate(now.getDate() - 7));
        startDate.setHours(0, 0, 0, 0);
        endDate = new Date();
        endDate.setHours(23, 59, 59, 999);
        break;
      case 'month':
        startDate = new Date(now.setMonth(now.getMonth() - 1));
        startDate.setHours(0, 0, 0, 0);
        endDate = new Date();
        endDate.setHours(23, 59, 59, 999);
        break;
      case 'year':
        startDate = new Date(now.setFullYear(now.getFullYear() - 1));
        startDate.setHours(0, 0, 0, 0);
        endDate = new Date();
        endDate.setHours(23, 59, 59, 999);
        break;
      default:
        startDate = null;
        endDate = null;
    }
    
    return { startDate, endDate };
  };

  // Fonction principale pour charger les données
  const fetchVendorsData = async () => {
    try {
      setLoading(true);
      
      let startDate = null;
      let endDate = null;
      
      // Déterminer la période
      if (listDateRange !== 'all') {
        const range = getDateRange(listDateRange);
        startDate = range.startDate;
        endDate = range.endDate;
      } else if (listCustomStart && listCustomEnd) {
        startDate = new Date(listCustomStart);
        startDate.setHours(0, 0, 0, 0);
        endDate = new Date(listCustomEnd);
        endDate.setHours(23, 59, 59, 999);
      }

      // 1. Récupérer les vendeurs
      let usersQuery = supabase
        .from('users')
        .select('*')
        .eq('role', 'vendor')
        .eq('is_active', true);

      if (searchQuery) {
        usersQuery = usersQuery.or(`full_name.ilike.%${searchQuery}%,email.ilike.%${searchQuery}%,shop_name.ilike.%${searchQuery}%`);
      }

      const { data: vendors, error: vendorsError } = await usersQuery;
      if (vendorsError) throw vendorsError;

      if (!vendors || vendors.length === 0) {
        setAllVendors([]);
        updateStatsCards(0, 0, 0, 0, 0, 0, 0, 0);
        setLoading(false);
        return;
      }

      // 2. Pour chaque vendeur, récupérer les ventes et dépenses
      const usersWithFinancialData = await Promise.all(
        vendors.map(async (vendor) => {
          // Ventes
          let salesQuery = supabase
            .from('sale')
            .select('id, total, currency, created_at')
            .eq('user_id', vendor.id)
            .eq('status', 'completed');

          if (startDate && endDate) {
            salesQuery = salesQuery
              .gte('created_at', startDate.toISOString())
              .lte('created_at', endDate.toISOString());
          }

          const { data: sales, error: salesError } = await salesQuery;
          if (salesError) throw salesError;

          // Dépenses
          let expensesQuery = supabase
            .from('cash_outflow')
            .select('id, amount, currency, created_at, date')
            .eq('user_id', vendor.id)
            .eq('status', 'completed');

          if (startDate && endDate) {
            expensesQuery = expensesQuery
              .gte('created_at', startDate.toISOString())
              .lte('created_at', endDate.toISOString());
          }

          const { data: expenses, error: expensesError } = await expensesQuery;
          if (expensesError) throw expensesError;

          // Calculs
          let totalSalesCDF = 0;
          let totalSalesUSD = 0;
          let totalExpensesCDF = 0;
          let totalExpensesUSD = 0;

          if (sales && sales.length > 0) {
            sales.forEach(sale => {
              if (sale.currency === 'USD') {
                totalSalesUSD += sale.total || 0;
              } else {
                totalSalesCDF += sale.total || 0;
              }
            });
          }

          if (expenses && expenses.length > 0) {
            expenses.forEach(expense => {
              if (expense.currency === 'USD') {
                totalExpensesUSD += expense.amount || 0;
              } else {
                totalExpensesCDF += expense.amount || 0;
              }
            });
          }

          const revenueCDF = totalSalesCDF;
          const revenueUSD = totalSalesUSD;
          const balanceCDF = revenueCDF - totalExpensesCDF;
          const balanceUSD = revenueUSD - totalExpensesUSD;

          let lastSale = null;
          if (sales && sales.length > 0) {
            const sortedSales = [...sales].sort((a, b) => 
              new Date(b.created_at) - new Date(a.created_at)
            );
            lastSale = sortedSales[0].created_at;
          }

          // Trouver la dernière dépense
          let lastExpense = null;
          if (expenses && expenses.length > 0) {
            const sortedExpenses = [...expenses].sort((a, b) => 
              new Date(b.created_at) - new Date(a.created_at)
            );
            lastExpense = sortedExpenses[0].created_at;
          }

          return {
            ...vendor,
            profile_image_url: vendor.profile_image ? getProfileImageUrl(vendor.profile_image) : null,
            total_sales_cdf: Math.round(totalSalesCDF),
            total_sales_usd: Math.round(totalSalesUSD),
            sales_count: sales?.length || 0,
            last_sale: lastSale,
            total_expenses_cdf: Math.round(totalExpensesCDF),
            total_expenses_usd: Math.round(totalExpensesUSD),
            expenses_count: expenses?.length || 0,
            last_expense: lastExpense,
            revenue_cdf: Math.round(revenueCDF),
            revenue_usd: Math.round(revenueUSD),
            balance_cdf: Math.round(balanceCDF),
            balance_usd: Math.round(balanceUSD),
          };
        })
      );

      // Trier par revenu
      const sortedUsers = usersWithFinancialData.sort((a, b) => b.revenue_cdf - a.revenue_cdf);

      // Calculer les totaux
      const totalRevenueCDF = sortedUsers.reduce((sum, user) => sum + user.revenue_cdf, 0);
      const totalRevenueUSD = sortedUsers.reduce((sum, user) => sum + user.revenue_usd, 0);
      const totalExpensesCDF = sortedUsers.reduce((sum, user) => sum + user.total_expenses_cdf, 0);
      const totalExpensesUSD = sortedUsers.reduce((sum, user) => sum + user.total_expenses_usd, 0);
      const totalBalanceCDF = sortedUsers.reduce((sum, user) => sum + user.balance_cdf, 0);
      const totalBalanceUSD = sortedUsers.reduce((sum, user) => sum + user.balance_usd, 0);
      const totalTransactions = sortedUsers.reduce((sum, user) => sum + user.sales_count, 0);

      // Mettre à jour les états
      setAllVendors(sortedUsers);
      updateStatsCards(
        totalRevenueCDF,
        totalRevenueUSD,
        totalTransactions,
        totalExpensesCDF,
        totalExpensesUSD,
        totalBalanceCDF,
        totalBalanceUSD
      );

    } catch (error) {
      console.error('Erreur lors de la récupération des données:', error);
    } finally {
      setLoading(false);
    }
  };

  // Mettre à jour les cards de stats - MIS À JOUR
  const updateStatsCards = (
    revenueCDF, 
    revenueUSD, 
    transactions, 
    expensesCDF, 
    expensesUSD, 
    balanceCDF, 
    balanceUSD
  ) => {
    setStatsCards([
      { 
        id: 'revenue', 
        label: 'Recette CDF', 
        value: revenueCDF, 
        valueUsd: revenueUSD, 
        icon: DollarSign, 
        color: 'text-blue-500', 
        bg: 'bg-blue-50', 
        currency: true 
      },
      { 
        id: 'revenue_usd', 
        label: 'Recette USD', 
        value: revenueUSD, 
        valueUsd: revenueUSD, 
        icon: DollarSign, 
        color: 'text-green-500', 
        bg: 'bg-green-50', 
        currency: true 
      },
      { 
        id: 'transactions', 
        label: 'Transactions', 
        value: transactions, 
        icon: ShoppingCart, 
        color: 'text-purple-500', 
        bg: 'bg-purple-50', 
        currency: false 
      },
      { 
        id: 'expenses', 
        label: 'Dépenses CDF', 
        value: expensesCDF, 
        valueUsd: expensesUSD, 
        icon: CreditCard, 
        color: 'text-red-500', 
        bg: 'bg-red-50', 
        currency: true 
      },
      { 
        id: 'expenses_usd', 
        label: 'Dépenses USD', 
        value: expensesUSD, 
        valueUsd: expensesUSD, 
        icon: CreditCard, 
        color: 'text-orange-500', 
        bg: 'bg-orange-50', 
        currency: true 
      },
      { 
        id: 'balance', 
        label: 'Solde CDF', 
        value: balanceCDF, 
        valueUsd: balanceUSD, 
        icon: Wallet, 
        color: 'text-indigo-500', 
        bg: 'bg-indigo-50', 
        currency: true 
      },
      { 
        id: 'balance_usd', 
        label: 'Solde USD', 
        value: balanceUSD, 
        valueUsd: balanceUSD, 
        icon: Wallet, 
        color: 'text-pink-500', 
        bg: 'bg-pink-50', 
        currency: true 
      }
    ]);
  };

  // Charger les données au montage et quand les filtres changent
  useEffect(() => {
    fetchVendorsData();
  }, [listDateRange, listCustomStart, listCustomEnd]);

  // Handlers
  const handleListSearch = (e) => {
    e.preventDefault();
    fetchVendorsData();
  };

  const handleListCustomDateFilter = () => {
    if (listCustomStart && listCustomEnd) {
      setListDateRange('all');
      fetchVendorsData();
    }
  };

  const resetListFilters = () => {
    setListDateRange('all');
    setListCustomStart('');
    setListCustomEnd('');
    setSearchQuery('');
    fetchVendorsData();
  };

  // Composant pour les cards de stats - MIS À JOUR
  const StatsCards = () => (
    <div className="grid grid-cols-2 md:grid-cols-7 gap-3 mb-6">
      {statsCards.map((card) => (
        <div key={card.id} className="bg-white p-3 rounded-lg border border-gray-200 hover:shadow-sm transition-shadow">
          <div className="flex flex-col h-full">
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="text-xs font-medium text-gray-700">{card.label}</p>
              </div>
              <div className={`p-1.5 rounded-md ${card.bg}`}>
                <card.icon className={`w-3.5 h-3.5 ${card.color}`} />
              </div>
            </div>
            
            <div className="mt-auto">
              <p className={`text-sm font-bold mb-1 ${
                card.id.includes('revenue') ? 'text-blue-600' :
                card.id.includes('expenses') ? 'text-red-600' :
                card.id.includes('balance') ? (card.value >= 0 ? 'text-green-600' : 'text-red-600') :
                'text-gray-900'
              }`}>
                {card.currency 
                  ? (card.id.includes('_usd') 
                    ? formatCurrency(card.value, 'USD')
                    : formatCurrency(card.value, 'CDF'))
                  : formatNumber(card.value)
                }
              </p>
              
              {/* Afficher la contrepartie en devise alternative pour les cartes principales */}
              {card.currency && !card.id.includes('_usd') && card.valueUsd > 0 && (
                <p className="text-xs text-gray-500">
                  {formatCurrency(card.valueUsd, 'USD')}
                </p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  // Render List Tab - Version simplifiée et fonctionnelle
  const renderListTab = () => {
    return (
      <div className="space-y-6">
        {/* Cards de stats */}
        <StatsCards />

        {/* Filtres pour Liste */}
        {showListFilters && (
          <div className="bg-white p-4 rounded-lg border border-gray-200 mb-6">
            {/* Barre de recherche */}
            <div className="mb-4">
              <input
                type="text"
                placeholder="Rechercher un vendeur..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleListSearch(e)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div className="flex flex-col md:flex-row gap-4">
              {/* Filtres rapides */}
              <div className="flex flex-wrap gap-2">
                {['today', 'yesterday', 'week', 'month', 'all'].map((period) => (
                  <button
                    key={period}
                    onClick={() => {
                      setListDateRange(period);
                      setListCustomStart('');
                      setListCustomEnd('');
                    }}
                    className={`px-2 py-1 text-xs rounded border ${
                      listDateRange === period
                        ? 'bg-blue-50 text-blue-600 border-blue-200'
                        : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    {period === 'today' ? "Aujourd'hui" :
                     period === 'yesterday' ? 'Hier' :
                     period === 'week' ? '7j' :
                     period === 'month' ? '30j' : 'Tous'}
                  </button>
                ))}
              </div>

              {/* Dates personnalisées */}
              <div className="flex items-center gap-2">
                <input
                  type="date"
                  value={listCustomStart}
                  onChange={(e) => setListCustomStart(e.target.value)}
                  className="px-2 py-1 text-xs border border-gray-300 rounded"
                />
                <span className="text-xs text-gray-500">à</span>
                <input
                  type="date"
                  value={listCustomEnd}
                  onChange={(e) => setListCustomEnd(e.target.value)}
                  className="px-2 py-1 text-xs border border-gray-300 rounded"
                />
                <button
                  onClick={handleListCustomDateFilter}
                  disabled={!listCustomStart || !listCustomEnd}
                  className={`px-2 py-1 text-xs rounded ${
                    !listCustomStart || !listCustomEnd
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  OK
                </button>
                <button
                  onClick={resetListFilters}
                  className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Liste des vendeurs */}
        <div>
          <div className="mb-4">
            <h2 className="text-sm font-medium text-gray-700">
              {loading ? 'Chargement...' : `${allVendors.length} vendeur(s)`}
            </h2>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : allVendors.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-sm text-gray-500">Aucun vendeur trouvé</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {allVendors.map((user) => (
                <div key={user.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors">
                  {/* Header de la carte */}
                  <div className="flex items-start space-x-3 mb-4">
                    {/* Avatar */}
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                        {user.profile_image_url ? (
                          <img
                            src={user.profile_image_url}
                            alt={user.full_name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.style.display = 'none';
                            }}
                          />
                        ) : (
                          <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        )}
                      </div>
                    </div>

                    {/* Informations */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-gray-900 truncate">{user.full_name}</h3>
                      {user.shop_name && (
                        <p className="text-xs text-gray-500 mt-1 truncate">{user.shop_name}</p>
                      )}
                      <div className="flex items-center space-x-2 mt-2">
                        <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-700 rounded">
                          {user.sales_count || 0} ventes
                        </span>
                        {user.expenses_count > 0 && (
                          <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-700 rounded">
                            {user.expenses_count} dép.
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Stats minimales */}
                  <div className="space-y-3">
                    {/* Recette CDF et USD */}
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Recette CDF</p>
                        <p className="text-sm font-medium text-blue-600">
                          {formatCurrency(user.revenue_cdf || 0)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Recette USD</p>
                        <p className="text-sm font-medium text-green-600">
                          {user.revenue_usd > 0 ? formatCurrency(user.revenue_usd, 'USD') : '—'}
                        </p>
                      </div>
                    </div>

                    {/* Dépenses CDF et USD */}
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Dépenses CDF</p>
                        <p className="text-sm font-medium text-red-600">
                          {formatCurrency(user.total_expenses_cdf || 0)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Dépenses USD</p>
                        <p className="text-sm font-medium text-orange-600">
                          {user.total_expenses_usd > 0 ? formatCurrency(user.total_expenses_usd, 'USD') : '—'}
                        </p>
                      </div>
                    </div>

                    {/* Solde CDF et USD */}
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Solde CDF</p>
                        <p className={`text-sm font-medium ${
                          (user.balance_cdf || 0) >= 0 ? 'text-indigo-600' : 'text-red-600'
                        }`}>
                          {formatCurrency(user.balance_cdf || 0)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Solde USD</p>
                        <p className={`text-sm font-medium ${
                          user.balance_usd >= 0 ? 'text-pink-600' : 'text-red-600'
                        }`}>
                          {user.balance_usd !== 0 ? formatCurrency(Math.abs(user.balance_usd), 'USD') : '—'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-2 mt-3 pt-3 border-t border-gray-100">
                    <Link
                      href={`/super-admin/dashboard/ventes?userId=${user.id}&dateRange=${listDateRange}&startDate=${listCustomStart || ''}&endDate=${listCustomEnd || ''}`}
                      className="flex-1 text-center px-2 py-1 text-xs hover:underline text-blue-600 rounded transition-colors"
                    >
                      Voir ventes
                      <ArrowLeft className='flex-1 w-4 inline-flex'/>
                    </Link>
                    <Link
                      href={`/super-admin/dashboard/depenses?userId=${user.id}&dateRange=${listDateRange}&startDate=${listCustomStart || ''}&endDate=${listCustomEnd || ''}`}
                      className="flex-1 text-center px-2 py-1 text-xs hover:underline text-red-600 rounded transition-colors"
                    >
                      Voir dépenses
                      <ArrowLeft className='flex-1 w-4 inline-flex'/>
                    </Link> 
                  </div>

                  {/* Informations supplémentaires */}
                  <div className="pt-3 mt-3 border-t border-gray-100">
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center space-x-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>Dernière vente:</span>
                      </div>
                      <span className="font-medium">
                        {user.last_sale ? formatDate(user.last_sale) : 'N/A'}
                      </span>
                    </div>
                    
                    {user.last_expense && (
                      <div className="flex items-center justify-between text-xs text-gray-500 mt-1">
                        <div className="flex items-center space-x-1">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                          <span>Dernière dépense:</span>
                        </div>
                        <span className="font-medium">{formatDate(user.last_expense)}</span>
                      </div>
                    )}

                    {user.phone && (
                      <div className="flex items-center justify-between text-xs text-gray-500 mt-1">
                        <div className="flex items-center space-x-1">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                          <span>Tél:</span>
                        </div>
                        <span className="font-medium">{user.phone}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {!loading && allVendors.length > 0 && (
          <div className="mt-6 pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              Mis à jour à {new Date().toLocaleTimeString('fr-FR', { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </p>
          </div>
        )}
      </div>
    );
  };

  // Render Analytics Tab - Version simplifiée
  const renderAnalyticsTab = () => {
    return (
      <div className="space-y-6">
        {/* Cards de stats pour Analytics */}
        <StatsCards />
        <UsersSalesAnalytics/>
        {/* Onglets Analytics internes */}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Header avec onglets */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Link 
              href="/super-admin/dashboard"
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </Link>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">Analytics Vendeurs</h1>
              <p className="text-xs text-gray-500">Performance et analyse</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Onglets principaux */}
            <div className="flex bg-white border border-gray-200 rounded-lg p-1">
              <button
                onClick={() => setActiveTab('list')}
                className={`
                  px-3 py-1.5 text-sm font-medium rounded-md flex items-center gap-2
                  ${activeTab === 'list' 
                    ? 'bg-blue-50 text-blue-600' 
                    : 'text-gray-600 hover:text-gray-900'
                  }
                `}
              >
                <Grid className="w-4 h-4" />
                Liste
              </button>
              <button
                onClick={() => setActiveTab('analytics')}
                className={`
                  px-3 py-1.5 text-sm font-medium rounded-md flex items-center gap-2
                  ${activeTab === 'analytics' 
                    ? 'bg-blue-50 text-blue-600' 
                    : 'text-gray-600 hover:text-gray-900'
                  }
                `}
              >
                <BarChart3 className="w-4 h-4" />
                Analytics
              </button>
            </div>
            
            {/* Bouton Filtres */}
            <button
              onClick={() => activeTab === 'analytics' ? setShowAnalyticsFilters(!showAnalyticsFilters) : setShowListFilters(!showListFilters)}
              className="flex items-center gap-2 px-3 py-1.5 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <Filter className="w-4 h-4" />
              Filtres
            </button>
          </div>
        </div>
      </div>

      {/* Contenu selon l'onglet sélectionné */}
      {activeTab === 'analytics' ? renderAnalyticsTab() : renderListTab()}

      {/* Footer commun */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <div className="text-xs text-gray-500 text-center">
          Données mises à jour: {new Date().toLocaleTimeString('fr-FR', { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </div>
      </div>
    </div>
  );
}