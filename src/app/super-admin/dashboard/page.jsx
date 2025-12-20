
// 'use client';

// import { useState, useEffect } from 'react';
// import { supabase } from '@/lib/supabase'
// import Link from 'next/link';
// import { ArrowLeft } from 'lucide-react';

// export default function UsersSalesAnalytics() {
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [dateRange, setDateRange] = useState('all');
//   const [customStart, setCustomStart] = useState('');
//   const [customEnd, setCustomEnd] = useState('');
//   const [searchQuery, setSearchQuery] = useState('');
//   const [showFilters, setShowFilters] = useState(true);
//   const [overallStats, setOverallStats] = useState({
//     totalSalesCDF: 0,
//     totalRevenueCDF: 0,
//     totalBalanceCDF: 0,
//     totalUsers: 0
//   });

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

//   const getProfileImageUrl = (profileImagePath) => {
//     if (!profileImagePath) return null;
//     const { data } = supabase.storage
//       .from('avatars')
//       .getPublicUrl(profileImagePath);
//     return data.publicUrl + '?t=' + new Date().getTime();
//   };

//   const fetchData = async () => {
//     try {
//       setLoading(true);

//       let startDate = null;
//       let endDate = null;
      
//       if (dateRange !== 'all') {
//         const range = getDateRange(dateRange);
//         startDate = range.startDate;
//         endDate = range.endDate;
//       } else if (customStart && customEnd) {
//         startDate = new Date(customStart);
//         startDate.setHours(0, 0, 0, 0);
//         endDate = new Date(customEnd);
//         endDate.setHours(23, 59, 59, 999);
//       }

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

//       const usersWithFinancialData = await Promise.all(
//         vendors.map(async (vendor) => {
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

//           let expensesQuery = supabase
//             .from('cash_outflow')
//             .select('id, amount, currency, date')
//             .eq('user_id', vendor.id)
//             .eq('status', 'completed');

//           if (startDate && endDate) {
//             const startDateStr = startDate.toISOString().split('T')[0];
//             const endDateStr = endDate.toISOString().split('T')[0];
//             expensesQuery = expensesQuery
//               .gte('date', startDateStr)
//               .lte('date', endDateStr);
//           }

//           const { data: expenses, error: expensesError } = await expensesQuery;
//           if (expensesError) throw expensesError;

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
//             revenue_cdf: Math.round(revenueCDF),
//             revenue_usd: Math.round(revenueUSD),
//             balance_cdf: Math.round(balanceCDF),
//             balance_usd: Math.round(balanceUSD),
//           };
//         })
//       );

//       const sortedUsers = usersWithFinancialData.sort((a, b) => b.revenue_cdf - a.revenue_cdf);

//       const totalSalesCDF = sortedUsers.reduce((sum, user) => sum + user.total_sales_cdf, 0);
//       const totalRevenueCDF = sortedUsers.reduce((sum, user) => sum + user.revenue_cdf, 0);
//       const totalBalanceCDF = sortedUsers.reduce((sum, user) => sum + user.balance_cdf, 0);

//       setUsers(sortedUsers);
//       setOverallStats({
//         totalSalesCDF,
//         totalRevenueCDF,
//         totalBalanceCDF,
//         totalUsers: sortedUsers.length
//       });

//     } catch (error) {
//       console.error('Erreur lors de la récupération des données:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, [dateRange]);

//   const handleSearch = (e) => {
//     e.preventDefault();
//     fetchData();
//   };

//   const handleCustomDateFilter = () => {
//     if (customStart && customEnd) {
//       setDateRange('all');
//       fetchData();
//     }
//   };

//   const resetFilters = () => {
//     setDateRange('all');
//     setCustomStart('');
//     setCustomEnd('');
//     setSearchQuery('');
//     fetchData();
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

//   const formatDate = (date) => {
//     if (!date) return 'N/A';
//     return new Date(date).toLocaleDateString('fr-FR', {
//       day: '2-digit',
//       month: '2-digit',
//       year: 'numeric'
//     });
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 p-4 md:p-6">
//       {/* Header */}
//       <div className="flex items-center justify-between mb-6">
//         <div>
//           <h1 className="text-xl font-semibold text-gray-900">Vendeurs</h1>
//           <p className="text-sm text-gray-500 mt-1">Performance et analyse</p>
//         </div>
//         <button
//           onClick={() => setShowFilters(!showFilters)}
//           className="px-3 py-1.5 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
//         >
//           {showFilters ? 'Cacher filtres' : 'Afficher filtres'}
//         </button>
//       </div>

//       {/* Stats et Filtres */}
//       {showFilters && (
//         <>
//           {/* Stats minimalistes */}
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
//             <div className="bg-white p-3 rounded-lg border border-gray-200">
//               <p className="text-xs text-gray-500">Ventes</p>
//               <p className="text-sm font-semibold text-gray-900 mt-1">
//                 {formatCurrency(overallStats.totalSalesCDF)}
//               </p>
//             </div>
//             <div className="bg-white p-3 rounded-lg border border-gray-200">
//               <p className="text-xs text-gray-500">Recette</p>
//               <p className="text-sm font-semibold text-blue-600 mt-1">
//                 {formatCurrency(overallStats.totalRevenueCDF)}
//               </p>
//             </div>
//             <div className="bg-white p-3 rounded-lg border border-gray-200">
//               <p className="text-xs text-gray-500">Solde</p>
//               <p className="text-sm font-semibold text-green-600 mt-1">
//                 {formatCurrency(overallStats.totalBalanceCDF)}
//               </p>
//             </div>
//             <div className="bg-white p-3 rounded-lg border border-gray-200">
//               <p className="text-xs text-gray-500">Vendeurs</p>
//               <p className="text-sm font-semibold text-gray-900 mt-1">
//                 {overallStats.totalUsers}
//               </p>
//             </div>
//           </div>

//           {/* Filtres minimalistes */}
//           <div className="bg-white p-4 rounded-lg border border-gray-200 mb-6">
//             {/* Barre de recherche */}
//             <div className="mb-4">
//               <input
//                 type="text"
//                 placeholder="Rechercher un vendeur..."
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 onKeyPress={(e) => e.key === 'Enter' && handleSearch(e)}
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
//                       setDateRange(period);
//                       setCustomStart('');
//                       setCustomEnd('');
//                     }}
//                     className={`px-2 py-1 text-xs rounded border ${
//                       dateRange === period
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
//                   value={customStart}
//                   onChange={(e) => setCustomStart(e.target.value)}
//                   className="px-2 py-1 text-xs border border-gray-300 rounded"
//                 />
//                 <span className="text-xs text-gray-500">à</span>
//                 <input
//                   type="date"
//                   value={customEnd}
//                   onChange={(e) => setCustomEnd(e.target.value)}
//                   className="px-2 py-1 text-xs border border-gray-300 rounded"
//                 />
//                 <button
//                   onClick={handleCustomDateFilter}
//                   disabled={!customStart || !customEnd}
//                   className={`px-2 py-1 text-xs rounded ${
//                     !customStart || !customEnd
//                       ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
//                       : 'bg-blue-600 text-white hover:bg-blue-700'
//                   }`}
//                 >
//                   OK
//                 </button>
//                 <button
//                   onClick={resetFilters}
//                   className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
//                 >
//                   Reset
//                 </button>
//               </div>
//             </div>
//           </div>
//         </>
//       )}

//       {/* Liste des vendeurs */}
//       <div>
//         <div className="mb-4">
//           <h2 className="text-sm font-medium text-gray-700">
//             {loading ? 'Chargement...' : `${users.length} vendeur(s)`}
//           </h2>
//         </div>

//         {loading ? (
//           <div className="flex justify-center py-12">
//             <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
//           </div>
//         ) : users.length === 0 ? (
//           <div className="text-center py-8">
//             <p className="text-sm text-gray-500">Aucun vendeur trouvé</p>
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
//             {users.map((user) => (
//               <div key={user.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors">
//                 {/* Header de la carte */}
//                 <div className="flex items-start space-x-3 mb-4">
//                   {/* Avatar */}
//                   <div className="flex-shrink-0">
//                     <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
//                       {user.profile_image_url ? (
//                         <img
//                           src={user.profile_image_url}
//                           alt={user.full_name}
//                           className="w-full h-full object-cover"
//                           onError={(e) => {
//                             e.target.style.display = 'none';
//                           }}
//                         />
//                       ) : (
//                         <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
//                         </svg>
//                       )}
//                     </div>
//                   </div>

//                   {/* Informations */}
//                   <div className="flex-1 min-w-0">
//                     <h3 className="text-sm font-semibold text-gray-900 truncate">{user.full_name}</h3>
//                     {user.shop_name && (
//                       <p className="text-xs text-gray-500 mt-1 truncate">{user.shop_name}</p>
//                     )}
//                     <div className="flex items-center space-x-2 mt-2">
//                       <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-700 rounded">
//                         {user.sales_count} ventes
//                       </span>
//                       {user.expenses_count > 0 && (
//                         <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-700 rounded">
//                           {user.expenses_count} dép.
//                         </span>
//                       )}
//                     </div>
//                   </div>
//                 </div>

//                 {/* Stats minimales */}
//                 <div className="space-y-3">
//                   {/* Ventes et Recette */}
//                   <div className="grid grid-cols-2 gap-2">
//                     <div>
//                       <p className="text-xs text-gray-500 mb-1">Ventes</p>
//                       <p className="text-sm font-medium text-gray-900">
//                         {formatCurrency(user.total_sales_cdf)}
//                       </p>
//                     </div>
//                     <div>
//                       <p className="text-xs text-gray-500 mb-1">Recette</p>
//                       <p className="text-sm font-medium text-blue-600">
//                         {formatCurrency(user.revenue_cdf)}
//                       </p>
//                     </div>
//                   </div>

//                   {/* Dépenses et Solde */}
//                   <div className="grid grid-cols-2 gap-2">
//                     <div>
//                       <p className="text-xs text-gray-500 mb-1">Dépenses</p>
//                       <p className="text-sm font-medium text-red-600">
//                         {formatCurrency(user.total_expenses_cdf)}
//                       </p>
//                     </div>
//                     <div>
//                       <p className="text-xs text-gray-500 mb-1">Solde</p>
//                       <p className={`text-sm font-medium ${
//                         user.balance_cdf >= 0 ? 'text-green-600' : 'text-red-600'
//                       }`}>
//                         {formatCurrency(user.balance_cdf)}
//                       </p>
//                     </div>
//                   </div>
//                 </div>
// <div className="flex space-x-2 mt-3 pt-3 border-t border-gray-100">
//   <Link
//     href={`/super-admin/dashboard/ventes?userId=${user.id}&dateRange=${dateRange}&startDate=${customStart || ''}&endDate=${customEnd || ''}`}
//     className="flex-1 text-center px-2 py-1 text-xs  hover:underline text-blue-600 rounded transition-colors"
//   >
//     Voir ventes
//     <ArrowLeft className='flex-1 w-4 inline-flex'/>
//   </Link>
//   <Link
//     href={`/super-admin/dashboard/depenses?userId=${user.id}&dateRange=${dateRange}&startDate=${customStart || ''}&endDate=${customEnd || ''}`}
//     className="flex-1 text-center px-2 py-1 text-xs  hover:underline text-red-600 rounded  transition-colors"
//   >
//     Voir dépenses
//         <ArrowLeft className='flex-1 w-4 inline-flex'/>

//   </Link> 
// </div>
//                 {/* Informations supplémentaires */}
//                 <div className="pt-3 mt-3 border-t border-gray-100">
//                   <div className="flex items-center justify-between text-xs text-gray-500">
//                     <div className="flex items-center space-x-1">
//                       <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
//                       </svg>
//                       <span>Dernière vente:</span>
//                     </div>
//                     <span className="font-medium">
//                       {user.last_sale ? formatDate(user.last_sale) : 'N/A'}
//                     </span>
//                   </div>
                  
//                   {user.phone && (
//                     <div className="flex items-center justify-between text-xs text-gray-500 mt-1">
//                       <div className="flex items-center space-x-1">
//                         <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
//                         </svg>
//                         <span>Tél:</span>
//                       </div>
//                       <span className="font-medium">{user.phone}</span>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>

//       {/* Footer minimaliste */}
//       {!loading && users.length > 0 && (
//         <div className="mt-6 pt-4 border-t border-gray-200">
//           <p className="text-xs text-gray-500 text-center">
//             Mis à jour à {new Date().toLocaleTimeString('fr-FR', { 
//               hour: '2-digit', 
//               minute: '2-digit' 
//             })}
//           </p>
//         </div>
//       )}
//     </div>
//   );
// }
'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase'
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function UsersSalesAnalytics() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('all');
  const [customStart, setCustomStart] = useState('');
  const [customEnd, setCustomEnd] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(true);
  const [overallStats, setOverallStats] = useState({
    totalSalesCDF: 0,
    totalSalesUSD: 0,
    totalRevenueCDF: 0,
    totalRevenueUSD: 0,
    totalExpensesCDF: 0,
    totalExpensesUSD: 0,
    totalBalanceCDF: 0,
    totalBalanceUSD: 0,
    totalUsers: 0
  });

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

  const getProfileImageUrl = (profileImagePath) => {
    if (!profileImagePath) return null;
    const { data } = supabase.storage
      .from('avatars')
      .getPublicUrl(profileImagePath);
    return data.publicUrl + '?t=' + new Date().getTime();
  };

  const fetchData = async () => {
    try {
      setLoading(true);

      let startDate = null;
      let endDate = null;
      
      if (dateRange !== 'all') {
        const range = getDateRange(dateRange);
        startDate = range.startDate;
        endDate = range.endDate;
      } else if (customStart && customEnd) {
        startDate = new Date(customStart);
        startDate.setHours(0, 0, 0, 0);
        endDate = new Date(customEnd);
        endDate.setHours(23, 59, 59, 999);
      }

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

      const usersWithFinancialData = await Promise.all(
        vendors.map(async (vendor) => {
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

          let expensesQuery = supabase
            .from('cash_outflow')
            .select('id, amount, currency, date')
            .eq('user_id', vendor.id)
            .eq('status', 'completed');

          if (startDate && endDate) {
            const startDateStr = startDate.toISOString().split('T')[0];
            const endDateStr = endDate.toISOString().split('T')[0];
            expensesQuery = expensesQuery
              .gte('date', startDateStr)
              .lte('date', endDateStr);
          }

          const { data: expenses, error: expensesError } = await expensesQuery;
          if (expensesError) throw expensesError;

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
            revenue_cdf: Math.round(revenueCDF),
            revenue_usd: Math.round(revenueUSD),
            balance_cdf: Math.round(balanceCDF),
            balance_usd: Math.round(balanceUSD),
          };
        })
      );

      const sortedUsers = usersWithFinancialData.sort((a, b) => b.revenue_cdf - a.revenue_cdf);

      const totalSalesCDF = sortedUsers.reduce((sum, user) => sum + user.total_sales_cdf, 0);
      const totalSalesUSD = sortedUsers.reduce((sum, user) => sum + user.total_sales_usd, 0);
      const totalRevenueCDF = sortedUsers.reduce((sum, user) => sum + user.revenue_cdf, 0);
      const totalRevenueUSD = sortedUsers.reduce((sum, user) => sum + user.revenue_usd, 0);
      const totalExpensesCDF = sortedUsers.reduce((sum, user) => sum + user.total_expenses_cdf, 0);
      const totalExpensesUSD = sortedUsers.reduce((sum, user) => sum + user.total_expenses_usd, 0);
      const totalBalanceCDF = sortedUsers.reduce((sum, user) => sum + user.balance_cdf, 0);
      const totalBalanceUSD = sortedUsers.reduce((sum, user) => sum + user.balance_usd, 0);

      setUsers(sortedUsers);
      setOverallStats({
        totalSalesCDF,
        totalSalesUSD,
        totalRevenueCDF,
        totalRevenueUSD,
        totalExpensesCDF,
        totalExpensesUSD,
        totalBalanceCDF,
        totalBalanceUSD,
        totalUsers: sortedUsers.length
      });

    } catch (error) {
      console.error('Erreur lors de la récupération des données:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [dateRange]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchData();
  };

  const handleCustomDateFilter = () => {
    if (customStart && customEnd) {
      setDateRange('all');
      fetchData();
    }
  };

  const resetFilters = () => {
    setDateRange('all');
    setCustomStart('');
    setCustomEnd('');
    setSearchQuery('');
    fetchData();
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

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Vendeurs</h1>
          <p className="text-sm text-gray-500 mt-1">Performance et analyse</p>
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="px-3 py-1.5 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          {showFilters ? 'Cacher filtres' : 'Afficher filtres'}
        </button>
      </div>

      {/* Stats et Filtres */}
      {showFilters && (
        <>
          {/* Stats minimalistes - Ajout des stats USD */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
            <div className="bg-white p-3 rounded-lg border border-gray-200">
              <p className="text-xs text-gray-500">Ventes</p>
              <p className="text-sm font-semibold text-gray-900 mt-1">
                {formatCurrency(overallStats.totalSalesCDF)}
              </p>
              {overallStats.totalSalesUSD > 0 && (
                <p className="text-xs text-gray-500 mt-1">
                  {formatCurrency(overallStats.totalSalesUSD, 'USD')}
                </p>
              )}
            </div>
            <div className="bg-white p-3 rounded-lg border border-gray-200">
              <p className="text-xs text-gray-500">Recette</p>
              <p className="text-sm font-semibold text-blue-600 mt-1">
                {formatCurrency(overallStats.totalRevenueCDF)}
              </p>
              {overallStats.totalRevenueUSD > 0 && (
                <p className="text-xs text-blue-500 mt-1">
                  {formatCurrency(overallStats.totalRevenueUSD, 'USD')}
                </p>
              )}
            </div>
            <div className="bg-white p-3 rounded-lg border border-gray-200">
              <p className="text-xs text-gray-500">Dépenses</p>
              <p className="text-sm font-semibold text-red-600 mt-1">
                {formatCurrency(overallStats.totalExpensesCDF)}
              </p>
              {overallStats.totalExpensesUSD > 0 && (
                <p className="text-xs text-red-500 mt-1">
                  {formatCurrency(overallStats.totalExpensesUSD, 'USD')}
                </p>
              )}
            </div>
            <div className="bg-white p-3 rounded-lg border border-gray-200">
              <p className="text-xs text-gray-500">Solde</p>
              <p className={`text-sm font-semibold ${
                overallStats.totalBalanceCDF >= 0 ? 'text-green-600' : 'text-red-600'
              } mt-1`}>
                {formatCurrency(overallStats.totalBalanceCDF)}
              </p>
              {overallStats.totalBalanceUSD !== 0 && (
                <p className={`text-xs ${
                  overallStats.totalBalanceUSD >= 0 ? 'text-green-500' : 'text-red-500'
                } mt-1`}>
                  {formatCurrency(overallStats.totalBalanceUSD, 'USD')}
                </p>
              )}
            </div>
            <div className="bg-white p-3 rounded-lg border border-gray-200">
              <p className="text-xs text-gray-500">Vendeurs</p>
              <p className="text-sm font-semibold text-gray-900 mt-1">
                {overallStats.totalUsers}
              </p>
            </div>
          </div>

          {/* Filtres minimalistes */}
          <div className="bg-white p-4 rounded-lg border border-gray-200 mb-6">
            {/* Barre de recherche */}
            <div className="mb-4">
              <input
                type="text"
                placeholder="Rechercher un vendeur..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch(e)}
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
                      setDateRange(period);
                      setCustomStart('');
                      setCustomEnd('');
                    }}
                    className={`px-2 py-1 text-xs rounded border ${
                      dateRange === period
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
                  value={customStart}
                  onChange={(e) => setCustomStart(e.target.value)}
                  className="px-2 py-1 text-xs border border-gray-300 rounded"
                />
                <span className="text-xs text-gray-500">à</span>
                <input
                  type="date"
                  value={customEnd}
                  onChange={(e) => setCustomEnd(e.target.value)}
                  className="px-2 py-1 text-xs border border-gray-300 rounded"
                />
                <button
                  onClick={handleCustomDateFilter}
                  disabled={!customStart || !customEnd}
                  className={`px-2 py-1 text-xs rounded ${
                    !customStart || !customEnd
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  OK
                </button>
                <button
                  onClick={resetFilters}
                  className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Liste des vendeurs */}
      <div>
        <div className="mb-4">
          <h2 className="text-sm font-medium text-gray-700">
            {loading ? 'Chargement...' : `${users.length} vendeur(s)`}
          </h2>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-sm text-gray-500">Aucun vendeur trouvé</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {users.map((user) => (
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
                        {user.sales_count} ventes
                      </span>
                      {user.expenses_count > 0 && (
                        <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-700 rounded">
                          {user.expenses_count} dép.
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Stats minimales - Ajout des montants USD */}
                <div className="space-y-3">
                  {/* Ventes et Recette */}
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Ventes</p>
                      <p className="text-sm font-medium text-gray-900">
                        {formatCurrency(user.total_sales_cdf)}
                      </p>
                      {user.total_sales_usd > 0 && (
                        <p className="text-xs text-gray-500">
                          {formatCurrency(user.total_sales_usd, 'USD')}
                        </p>
                      )}
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Recette</p>
                      <p className="text-sm font-medium text-blue-600">
                        {formatCurrency(user.revenue_cdf)}
                      </p>
                      {user.revenue_usd > 0 && (
                        <p className="text-xs text-blue-500">
                          {formatCurrency(user.revenue_usd, 'USD')}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Dépenses et Solde */}
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Dépenses</p>
                      <p className="text-sm font-medium text-red-600">
                        {formatCurrency(user.total_expenses_cdf)}
                      </p>
                      {user.total_expenses_usd > 0 && (
                        <p className="text-xs text-red-500">
                          {formatCurrency(user.total_expenses_usd, 'USD')}
                        </p>
                      )}
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Solde</p>
                      <p className={`text-sm font-medium ${
                        user.balance_cdf >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {formatCurrency(user.balance_cdf)}
                      </p>
                      {user.balance_usd !== 0 && (
                        <p className={`text-xs ${
                          user.balance_usd >= 0 ? 'text-green-500' : 'text-red-500'
                        }`}>
                          {formatCurrency(Math.abs(user.balance_usd), 'USD')}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex space-x-2 mt-3 pt-3 border-t border-gray-100">
                  <Link
                    href={`/super-admin/dashboard/ventes?userId=${user.id}&dateRange=${dateRange}&startDate=${customStart || ''}&endDate=${customEnd || ''}`}
                    className="flex-1 text-center px-2 py-1 text-xs hover:underline text-blue-600 rounded transition-colors"
                  >
                    Voir ventes
                    <ArrowLeft className='flex-1 w-4 inline-flex'/>
                  </Link>
                  <Link
                    href={`/super-admin/dashboard/depenses?userId=${user.id}&dateRange=${dateRange}&startDate=${customStart || ''}&endDate=${customEnd || ''}`}
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

      {/* Footer minimaliste */}
      {!loading && users.length > 0 && (
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
}