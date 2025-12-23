
// 'use client';

// import { useState, useEffect, useMemo } from 'react';
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
//   Download,
//   Activity,
//   Target,
//   Award,
//   TrendingDown,
//   Wallet,
//   Clock,
//   Percent,
//   User
// } from 'lucide-react';

// // Import Recharts
// import {
//   LineChart,
//   Line,
//   BarChart,
//   Bar,
//   PieChart,
//   Pie,
//   Cell,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
//   AreaChart,
//   Area,
//   RadarChart,
//   Radar,
//   PolarGrid,
//   PolarAngleAxis,
//   PolarRadiusAxis,
//   ComposedChart,
//   Scatter,
//   Sector
// } from 'recharts';

// export default function UsersSalesAnalytics() {
//   const [activeTab, setActiveTab] = useState('overview');
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [dateRange, setDateRange] = useState('week'); // Par défaut: semaine
//   const [customStart, setCustomStart] = useState('');
//   const [customEnd, setCustomEnd] = useState('');
//   const [searchQuery, setSearchQuery] = useState('');
//   const [selectedUser, setSelectedUser] = useState('all');
//   const [showFilters, setShowFilters] = useState(false);
  
//   // États pour les données
//   const [dailyData, setDailyData] = useState([]);
//   const [weeklyData, setWeeklyData] = useState([]);
//   const [monthlyData, setMonthlyData] = useState([]);
//   const [hourlyData, setHourlyData] = useState([]);
//   const [categoryData, setCategoryData] = useState([]);
//   const [userComparison, setUserComparison] = useState([]);
//   const [performanceMetrics, setPerformanceMetrics] = useState({});
  
//   // Couleurs
//   const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];
  
//   // Calculer la période
//   const getDateRange = (period) => {
//     const now = new Date();
//     let startDate = new Date();
//     let endDate = new Date();
    
//     switch (period) {
//       case 'today':
//         startDate.setHours(0, 0, 0, 0);
//         break;
//       case 'yesterday':
//         startDate.setDate(now.getDate() - 1);
//         startDate.setHours(0, 0, 0, 0);
//         endDate = new Date(startDate);
//         endDate.setHours(23, 59, 59, 999);
//         break;
//       case 'week':
//         startDate.setDate(now.getDate() - 7);
//         startDate.setHours(0, 0, 0, 0);
//         break;
//       case 'month':
//         startDate.setMonth(now.getMonth() - 1);
//         startDate.setHours(0, 0, 0, 0);
//         break;
//       case 'quarter':
//         startDate.setMonth(now.getMonth() - 3);
//         startDate.setHours(0, 0, 0, 0);
//         break;
//       case 'year':
//         startDate.setFullYear(now.getFullYear() - 1);
//         startDate.setHours(0, 0, 0, 0);
//         break;
//       default:
//         startDate = new Date('2023-01-01');
//     }
    
//     return { startDate, endDate };
//   };

//   // Récupérer les données de base
//   const fetchData = async () => {
//     try {
//       setLoading(true);
      
//       const { startDate, endDate } = getDateRange(dateRange);
      
//       // 1. Récupérer les vendeurs
//       let usersQuery = supabase
//         .from('users')
//         .select('*')
//         .eq('role', 'vendor')
//         .eq('is_active', true);

//       if (searchQuery) {
//         usersQuery = usersQuery.or(`full_name.ilike.%${searchQuery}%,shop_name.ilike.%${searchQuery}%`);
//       }

//       const { data: vendors, error: vendorsError } = await usersQuery;
//       if (vendorsError) throw vendorsError;

//       // 2. Récupérer les données financières pour chaque vendeur
//       const usersWithStats = await Promise.all(
//         vendors.map(async (vendor) => {
//           // Ventes du vendeur
//           let salesQuery = supabase
//             .from('sale')
//             .select('*, sale_item(*), client(name)')
//             .eq('user_id', vendor.id)
//             .eq('status', 'completed')
//             .gte('created_at', startDate.toISOString())
//             .lte('created_at', endDate.toISOString());

//           const { data: sales, error: salesError } = await salesQuery;
//           if (salesError) throw salesError;

//           // Dépenses du vendeur
//           let expensesQuery = supabase
//             .from('cash_outflow')
//             .select('*')
//             .eq('user_id', vendor.id)
//             .eq('status', 'completed')
//             .gte('date', startDate.toISOString().split('T')[0])
//             .lte('date', endDate.toISOString().split('T')[0]);

//           const { data: expenses, error: expensesError } = await expensesQuery;
//           if (expensesError) throw expensesError;

//           // Calculer les totaux
//           const salesTotalCDF = sales?.filter(s => s.currency === 'CDF').reduce((sum, s) => sum + (s.total || 0), 0) || 0;
//           const salesTotalUSD = sales?.filter(s => s.currency === 'USD').reduce((sum, s) => sum + (s.total || 0), 0) || 0;
//           const expensesTotalCDF = expenses?.filter(e => e.currency === 'CDF').reduce((sum, e) => sum + (e.amount || 0), 0) || 0;
//           const expensesTotalUSD = expenses?.filter(e => e.currency === 'USD').reduce((sum, e) => sum + (e.amount || 0), 0) || 0;

//           return {
//             ...vendor,
//             sales_count: sales?.length || 0,
//             sales_total_cdf: Math.round(salesTotalCDF),
//             sales_total_usd: Math.round(salesTotalUSD),
//             expenses_count: expenses?.length || 0,
//             expenses_total_cdf: Math.round(expensesTotalCDF),
//             expenses_total_usd: Math.round(expensesTotalUSD),
//             revenue_cdf: Math.round(salesTotalCDF - expensesTotalCDF),
//             revenue_usd: Math.round(salesTotalUSD - expensesTotalUSD),
//             last_sale: sales && sales.length > 0 ? 
//               sales.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))[0].created_at : null
//           };
//         })
//       );

//       setUsers(usersWithStats);

//       // 3. Préparer les données pour les graphiques
//       await prepareChartData(usersWithStats, startDate, endDate);

//     } catch (error) {
//       console.error('Erreur:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Préparer les données des graphiques
//   const prepareChartData = async (users, startDate, endDate) => {
//     try {
//       // 1. Données pour graphique d'évolution journalière (7 derniers jours)
//       const weekAgo = new Date();
//       weekAgo.setDate(weekAgo.getDate() - 7);
      
//       const { data: recentSales } = await supabase
//         .from('sale')
//         .select('created_at, total, currency')
//         .gte('created_at', weekAgo.toISOString())
//         .lte('created_at', endDate.toISOString())
//         .eq('status', 'completed')
//         .order('created_at');

//       // Grouper par jour
//       const dailySales = {};
//       recentSales?.forEach(sale => {
//         const date = new Date(sale.created_at).toLocaleDateString('fr-FR', { 
//           month: 'short', 
//           day: 'numeric' 
//         });
//         if (!dailySales[date]) {
//           dailySales[date] = { sales: 0, count: 0 };
//         }
//         dailySales[date].sales += sale.total || 0;
//         dailySales[date].count += 1;
//       });

//       const evolutionData = Object.entries(dailySales).map(([date, data]) => ({
//         date,
//         sales: Math.round(data.sales),
//         transactions: data.count,
//         avg: Math.round(data.sales / Math.max(data.count, 1))
//       })).slice(-7); // 7 derniers jours

//       setDailyData(evolutionData);

//       // 2. Données de performance hebdomadaire (4 dernières semaines)
//       const monthAgo = new Date();
//       monthAgo.setDate(monthAgo.getDate() - 30);
      
//       const { data: monthlySales } = await supabase
//         .from('sale')
//         .select('created_at, total, currency')
//         .gte('created_at', monthAgo.toISOString())
//         .lte('created_at', endDate.toISOString())
//         .eq('status', 'completed');

//       // Grouper par semaine
//       const weeklySales = {};
//       monthlySales?.forEach(sale => {
//         const date = new Date(sale.created_at);
//         const weekStart = new Date(date);
//         weekStart.setDate(date.getDate() - date.getDay());
//         const weekKey = `S${Math.floor(date.getDate() / 7) + 1}`;
        
//         if (!weeklySales[weekKey]) {
//           weeklySales[weekKey] = { sales: 0, count: 0 };
//         }
//         weeklySales[weekKey].sales += sale.total || 0;
//         weeklySales[weekKey].count += 1;
//       });

//       const weeklyChartData = Object.entries(weeklySales).map(([week, data]) => ({
//         week,
//         sales: Math.round(data.sales),
//         transactions: data.count,
//         avg: Math.round(data.sales / Math.max(data.count, 1))
//       }));

//       setWeeklyData(weeklyChartData);

//       // 3. Données mensuelles (6 derniers mois)
//       const sixMonthsAgo = new Date();
//       sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
      
//       const { data: monthlySalesData } = await supabase
//         .from('sale')
//         .select('created_at, total, currency')
//         .gte('created_at', sixMonthsAgo.toISOString())
//         .lte('created_at', endDate.toISOString())
//         .eq('status', 'completed');

//       // Grouper par mois
//       const monthlyChart = {};
//       monthlySalesData?.forEach(sale => {
//         const date = new Date(sale.created_at);
//         const monthKey = date.toLocaleDateString('fr-FR', { month: 'short' });
        
//         if (!monthlyChart[monthKey]) {
//           monthlyChart[monthKey] = { sales: 0, count: 0 };
//         }
//         monthlyChart[monthKey].sales += sale.total || 0;
//         monthlyChart[monthKey].count += 1;
//       });

//       const monthlyChartData = Object.entries(monthlyChart).map(([month, data]) => ({
//         month,
//         sales: Math.round(data.sales),
//         transactions: data.count
//       }));

//       setMonthlyData(monthlyChartData);

//       // 4. Données horaires
//       const { data: timedSales } = await supabase
//         .from('sale')
//         .select('created_at')
//         .gte('created_at', startDate.toISOString())
//         .lte('created_at', endDate.toISOString())
//         .eq('status', 'completed');

//       const hours = Array.from({ length: 24 }, (_, i) => ({ hour: i, sales: 0 }));
//       timedSales?.forEach(sale => {
//         const hour = new Date(sale.created_at).getHours();
//         hours[hour].sales += 1;
//       });

//       setHourlyData(hours);

//       // 5. Données de comparaison entre vendeurs (avec noms de vendeurs)
//       const comparisonData = users.map(user => ({
//         id: user.id,
//         name: user.full_name || `Vendeur ${user.id.slice(0,4)}`,
//         sales: user.sales_total_cdf,
//         expenses: user.expenses_total_cdf,
//         revenue: user.revenue_cdf,
//         efficiency: user.sales_total_cdf > 0 ? 
//           Math.round((user.revenue_cdf / user.sales_total_cdf) * 100) : 0,
//         transactions: user.sales_count
//       })).sort((a, b) => b.sales - a.sales);

//       setUserComparison(comparisonData);

//       // 6. Données par catégorie de dépenses
//       const { data: expenses } = await supabase
//         .from('cash_outflow')
//         .select('amount, category')
//         .gte('date', startDate.toISOString().split('T')[0])
//         .lte('date', endDate.toISOString().split('T')[0])
//         .eq('status', 'completed');

//       const categories = {};
//       expenses?.forEach(exp => {
//         const category = exp.category || 'Divers';
//         categories[category] = (categories[category] || 0) + (exp.amount || 0);
//       });

//       const categoryChartData = Object.entries(categories)
//         .map(([name, value]) => ({
//           name: name.length > 10 ? name.substring(0, 10) + '...' : name,
//           value: Math.round(value),
//           fullName: name
//         }))
//         .sort((a, b) => b.value - a.value);

//       setCategoryData(categoryChartData);

//       // 7. Calculer les métriques de performance
//       const totalSalesCDF = users.reduce((sum, u) => sum + u.sales_total_cdf, 0);
//       const totalExpensesCDF = users.reduce((sum, u) => sum + u.expenses_total_cdf, 0);
//       const totalRevenueCDF = users.reduce((sum, u) => sum + u.revenue_cdf, 0);
//       const totalTransactions = users.reduce((sum, u) => sum + u.sales_count, 0);
//       const avgTransactionValue = totalTransactions > 0 ? totalSalesCDF / totalTransactions : 0;
      
//       // Taux de croissance (comparaison avec la période précédente)
//       const prevStart = new Date(startDate);
//       const prevEnd = new Date(startDate);
//       const diffDays = Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24));
//       prevStart.setDate(prevStart.getDate() - diffDays);
      
//       const { data: prevSales } = await supabase
//         .from('sale')
//         .select('total, currency')
//         .gte('created_at', prevStart.toISOString())
//         .lte('created_at', prevEnd.toISOString())
//         .eq('status', 'completed');

//       const prevTotalCDF = prevSales?.filter(s => s.currency === 'CDF').reduce((sum, s) => sum + (s.total || 0), 0) || 0;
//       const growthRate = prevTotalCDF > 0 ? ((totalSalesCDF - prevTotalCDF) / prevTotalCDF) * 100 : 0;

//       // Vendeur le plus performant
//       const topPerformer = [...users].sort((a, b) => b.sales_total_cdf - a.sales_total_cdf)[0];
      
//       // Heure de pointe
//       const peakHour = hours.reduce((max, hour) => hour.sales > max.sales ? hour : hours[0]);

//       setPerformanceMetrics({
//         totalSalesCDF,
//         totalExpensesCDF,
//         totalRevenueCDF,
//         totalTransactions,
//         avgTransactionValue: Math.round(avgTransactionValue),
//         growthRate: Math.round(growthRate),
//         topPerformer: topPerformer ? {
//           id: topPerformer.id,
//           name: topPerformer.full_name || `Vendeur ${topPerformer.id.slice(0,4)}`,
//           sales: topPerformer.sales_total_cdf,
//           efficiency: topPerformer.sales_total_cdf > 0 ? 
//             Math.round((topPerformer.revenue_cdf / topPerformer.sales_total_cdf) * 100) : 0
//         } : null,
//         peakHour: peakHour.hour,
//         bestDay: evolutionData.length > 0 ? 
//           evolutionData.reduce((max, day) => day.sales > max.sales ? day : evolutionData[0]) : null
//       });

//     } catch (error) {
//       console.error('Erreur préparation données:', error);
//     }
//   };

//   // Charger les données
//   useEffect(() => {
//     fetchData();
//   }, [dateRange, selectedUser]);

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
//     setDateRange('week');
//     setCustomStart('');
//     setCustomEnd('');
//     setSearchQuery('');
//     setSelectedUser('all');
//     fetchData();
//   };

//   const formatCurrency = (amount, currency = 'CDF') => {
//     if (!amount) return '0';
//     if (currency === 'USD') {
//       return new Intl.NumberFormat('en-US', {
//         style: 'currency',
//         currency: 'USD',
//         minimumFractionDigits: 0,
//       }).format(amount);
//     }
//     return new Intl.NumberFormat('fr-FR', {
//       minimumFractionDigits: 0,
//     }).format(amount) + ' FC';
//   };

//   const formatNumber = (num) => {
//     if (!num) return '0';
//     return new Intl.NumberFormat('fr-FR').format(Math.round(num));
//   };

//   // Formatage des noms de vendeurs
//   const formatVendorName = (vendor) => {
//     if (!vendor) return 'N/A';
//     return vendor.full_name || `Vendeur ${vendor.id?.slice(0,4)}`;
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 p-">
//       {/* Header compact */}
//       <div className="mb-6">
//         <div className="flex items-center justify-between mb-4">
          
//           <div className="flex items-center gap-2">
//             <button
//               onClick={() => setShowFilters(!showFilters)}
//               className="flex items-center gap-2 px-3 py-1.5 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
//             >
//               <Filter className="w-4 h-4" />
//               Filtres
//             </button>
//           </div>
//         </div>

//         {/* Filtres minimaux */}
//         {showFilters && (
//           <div className="bg-white p-4 rounded-lg border border-gray-200 mb-4">
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
//               <input
//                 type="text"
//                 placeholder="Rechercher vendeur..."
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 onKeyPress={(e) => e.key === 'Enter' && handleSearch(e)}
//                 className="px-3 py-2 text-sm border border-gray-300 rounded-lg"
//               />
              
//               <select
//                 value={selectedUser}
//                 onChange={(e) => setSelectedUser(e.target.value)}
//                 className="px-3 py-2 text-sm border border-gray-300 rounded-lg"
//               >
//                 <option value="all">Tous les vendeurs</option>
//                 {users.map(user => (
//                   <option key={user.id} value={user.id}>
//                     {formatVendorName(user)}
//                   </option>
//                 ))}
//               </select>
              
//               <select
//                 value={dateRange}
//                 onChange={(e) => setDateRange(e.target.value)}
//                 className="px-3 py-2 text-sm border border-gray-300 rounded-lg"
//               >
//                 <option value="today">Aujourd'hui</option>
//                 <option value="yesterday">Hier</option>
//                 <option value="week">7 jours</option>
//                 <option value="month">30 jours</option>
//                 <option value="quarter">Trimestre</option>
//                 <option value="year">Année</option>
//                 <option value="all">Toute période</option>
//               </select>
//             </div>
            
//             <div className="flex justify-between items-center">
//               <div className="text-xs text-gray-500">
//                 {users.length} vendeur(s) trouvé(s)
//               </div>
//               <button
//                 onClick={resetFilters}
//                 className="px-3 py-1.5 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
//               >
//                 Réinitialiser
//               </button>
//             </div>
//           </div>
//         )}

       
//       </div>

//       {/* Onglets */}
//       <div className="mb-6">
//         <div className="border-b border-gray-200">
//           <nav className="-mb-px flex space-x-6 overflow-x-auto">
//             {[
//               { id: 'overview', label: 'Vue d\'ensemble', icon: Activity },
//               { id: 'evolution', label: 'Évolution', icon: TrendingUp },
//               { id: 'performance', label: 'Performance', icon: Target },
//               { id: 'comparison', label: 'Comparaison', icon: Users },
//               { id: 'categories', label: 'Dépenses', icon: PieChartIcon },
//             ].map((tab) => (
//               <button
//                 key={tab.id}
//                 onClick={() => setActiveTab(tab.id)}
//                 className={`
//                   py-2 px-1 whitespace-nowrap border-b-2 text-sm font-medium flex items-center gap-2
//                   ${activeTab === tab.id
//                     ? 'border-blue-500 text-blue-600'
//                     : 'border-transparent text-gray-500 hover:text-gray-700'
//                   }
//                 `}
//               >
//                 <tab.icon className="w-4 h-4" />
//                 {tab.label}
//               </button>
//             ))}
//           </nav>
//         </div>
//       </div>

//       {/* Contenu */}
//       <div className="space-y-6">
//         {loading ? (
//           <div className="flex justify-center py-12">
//             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
//           </div>
//         ) : (
//           <>
//             {/* Vue d'ensemble */}
//             {activeTab === 'overview' && (
//               <div className="space-y-4">
//                 {/* Top vendeurs avec noms */}
//                 <div className="bg-white p-4 rounded-lg border border-gray-200">
//                   <div className="flex items-center justify-between mb-4">
//                     <h3 className="text-sm font-semibold text-gray-900">Top 5 Vendeurs</h3>
//                     <span className="text-xs text-gray-500">Par chiffre d'affaires</span>
//                   </div>
//                   <div className="h-48">
//                     <ResponsiveContainer width="100%" height="100%">
//                       <BarChart
//                         data={userComparison.slice(0, 5)}
//                         margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
//                       >
//                         <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" />
//                         <XAxis 
//                           dataKey="name" 
//                           tick={{ fontSize: 9 }}
//                           angle={-45}
//                           textAnchor="end"
//                           height={50}
//                         />
//                         <YAxis 
//                           tick={{ fontSize: 10 }}
//                           tickFormatter={(value) => formatNumber(value)}
//                           width={40}
//                         />
//                         <Tooltip 
//                           formatter={(value) => [formatCurrency(value), 'Montant']}
//                           labelStyle={{ fontSize: 10 }}
//                         />
//                         <Bar 
//                           dataKey="sales" 
//                           name="Ventes"
//                           fill="#3b82f6"
//                           radius={[2, 2, 0, 0]}
//                         />
//                         <Bar 
//                           dataKey="revenue" 
//                           name="Bénéfice"
//                           fill="#10b981"
//                           radius={[2, 2, 0, 0]}
//                         />
//                       </BarChart>
//                     </ResponsiveContainer>
//                   </div>
//                 </div>

//                 {/* Graphiques secondaires */}
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   {/* Évolution hebdomadaire */}
//                   <div className="bg-white p-4 rounded-lg border border-gray-200">
//                     <div className="flex items-center justify-between mb-4">
//                       <h3 className="text-sm font-semibold text-gray-900">Performance Hebdo</h3>
//                       <span className="text-xs text-gray-500">4 semaines</span>
//                     </div>
//                     <div className="h-40">
//                       <ResponsiveContainer width="100%" height="100%">
//                         <LineChart
//                           data={weeklyData}
//                           margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
//                         >
//                           <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" />
//                           <XAxis 
//                             dataKey="week" 
//                             tick={{ fontSize: 10 }}
//                           />
//                           <YAxis 
//                             tick={{ fontSize: 10 }}
//                             tickFormatter={(value) => formatNumber(value)}
//                             width={30}
//                           />
//                           <Tooltip 
//                             formatter={(value) => [formatCurrency(value), 'Ventes']}
//                             labelStyle={{ fontSize: 10 }}
//                           />
//                           <Line 
//                             type="monotone" 
//                             dataKey="sales" 
//                             name="Ventes"
//                             stroke="#8b5cf6"
//                             strokeWidth={2}
//                             dot={{ r: 3 }}
//                           />
//                         </LineChart>
//                       </ResponsiveContainer>
//                     </div>
//                   </div>

//                   {/* Performance horaire */}
//                   <div className="bg-white p-4 rounded-lg border border-gray-200">
//                     <div className="flex items-center justify-between mb-4">
//                       <h3 className="text-sm font-semibold text-gray-900">Heures de pointe</h3>
//                       <span className="text-xs text-gray-500">Distribution horaire</span>
//                     </div>
//                     <div className="h-40">
//                       <ResponsiveContainer width="100%" height="100%">
//                         <AreaChart
//                           data={hourlyData}
//                           margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
//                         >
//                           <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" />
//                           <XAxis 
//                             dataKey="hour" 
//                             tick={{ fontSize: 9 }}
//                             tickFormatter={(value) => `${value}h`}
//                           />
//                           <YAxis 
//                             tick={{ fontSize: 9 }}
//                             width={25}
//                           />
//                           <Tooltip 
//                             formatter={(value) => [value, 'Transactions']}
//                             labelStyle={{ fontSize: 10 }}
//                           />
//                           <Area 
//                             type="monotone" 
//                             dataKey="sales" 
//                             name="Transactions"
//                             stroke="#f59e0b"
//                             fill="#fef3c7"
//                             fillOpacity={0.6}
//                           />
//                         </AreaChart>
//                       </ResponsiveContainer>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Statistiques clés */}
//                 <div className="bg-white p-4 rounded-lg border border-gray-200">
//                   <h3 className="text-sm font-semibold text-gray-900 mb-4">Indicateurs clés</h3>
//                   <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//                     <div className="text-center">
//                       <div className="text-xl font-bold text-blue-600">
//                         {performanceMetrics.topPerformer?.name?.split(' ')[0] || 'N/A'}
//                       </div>
//                       <p className="text-xs text-gray-500 mt-1">Top vendeur</p>
//                     </div>
                    
//                     <div className="text-center">
//                       <div className="text-xl font-bold text-green-600">
//                         {performanceMetrics.totalSalesCDF > 0 ? 
//                           Math.round((performanceMetrics.totalRevenueCDF / performanceMetrics.totalSalesCDF) * 100) : 0}%
//                       </div>
//                       <p className="text-xs text-gray-500 mt-1">Marge bénéficiaire</p>
//                     </div>
                    
//                     <div className="text-center">
//                       <div className="text-xl font-bold text-purple-600">
//                         {performanceMetrics.peakHour}h
//                       </div>
//                       <p className="text-xs text-gray-500 mt-1">Heure de pointe</p>
//                     </div>
                    
//                     <div className="text-center">
//                       <div className="text-xl font-bold text-orange-600">
//                         {performanceMetrics.bestDay?.date || 'N/A'}
//                       </div>
//                       <p className="text-xs text-gray-500 mt-1">Meilleur jour</p>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* Évolution */}
//             {activeTab === 'evolution' && (
//               <div className="space-y-4">
//                 {/* Évolution mensuelle */}
//                 <div className="bg-white p-4 rounded-lg border border-gray-200">
//                   <div className="flex items-center justify-between mb-4">
//                     <h3 className="text-sm font-semibold text-gray-900">Évolution Mensuelle</h3>
//                     <span className="text-xs text-gray-500">6 derniers mois</span>
//                   </div>
//                   <div className="h-64">
//                     <ResponsiveContainer width="100%" height="100%">
//                       <ComposedChart
//                         data={monthlyData}
//                         margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
//                       >
//                         <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" />
//                         <XAxis 
//                           dataKey="month" 
//                           tick={{ fontSize: 10 }}
//                         />
//                         <YAxis 
//                           tick={{ fontSize: 10 }}
//                           yAxisId="left"
//                           tickFormatter={(value) => formatNumber(value)}
//                           width={40}
//                         />
//                         <Tooltip 
//                           formatter={(value, name) => {
//                             if (name === 'sales') return [formatCurrency(value), 'Ventes'];
//                             if (name === 'transactions') return [value, 'Transactions'];
//                           }}
//                           labelStyle={{ fontSize: 10 }}
//                         />
//                         <Bar 
//                           yAxisId="left"
//                           dataKey="sales" 
//                           name="Ventes"
//                           fill="#3b82f6"
//                           radius={[2, 2, 0, 0]}
//                         />
//                         <Line 
//                           yAxisId="left"
//                           type="monotone" 
//                           dataKey="transactions" 
//                           name="Transactions"
//                           stroke="#10b981"
//                           strokeWidth={2}
//                         />
//                       </ComposedChart>
//                     </ResponsiveContainer>
//                   </div>
//                 </div>

//                 {/* Évolution hebdomadaire détaillée */}
//                 <div className="bg-white p-4 rounded-lg border border-gray-200">
//                   <h3 className="text-sm font-semibold text-gray-900 mb-4">Détails Hebdomadaires</h3>
//                   <div className="h-48">
//                     <ResponsiveContainer width="100%" height="100%">
//                       <AreaChart
//                         data={weeklyData}
//                         margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
//                       >
//                         <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" />
//                         <XAxis 
//                           dataKey="week" 
//                           tick={{ fontSize: 10 }}
//                         />
//                         <YAxis 
//                           tick={{ fontSize: 10 }}
//                           tickFormatter={(value) => formatNumber(value)}
//                           width={40}
//                         />
//                         <Tooltip 
//                           formatter={(value, name) => {
//                             if (name === 'sales') return [formatCurrency(value), 'Ventes'];
//                             if (name === 'avg') return [formatCurrency(value), 'Moyenne/tx'];
//                           }}
//                           labelStyle={{ fontSize: 10 }}
//                         />
//                         <Area 
//                           type="monotone" 
//                           dataKey="sales" 
//                           name="Ventes"
//                           stroke="#8b5cf6"
//                           fill="#e0e7ff"
//                           fillOpacity={0.6}
//                         />
//                         <Line 
//                           type="monotone" 
//                           dataKey="avg" 
//                           name="Moyenne/transaction"
//                           stroke="#f59e0b"
//                           strokeWidth={2}
//                           dot={false}
//                         />
//                       </AreaChart>
//                     </ResponsiveContainer>
//                   </div>
//                 </div>

//                 {/* Tendance journalière */}
//                 <div className="bg-white p-4 rounded-lg border border-gray-200">
//                   <div className="flex items-center justify-between mb-4">
//                     <h3 className="text-sm font-semibold text-gray-900">Tendance Journalière</h3>
//                     <span className="text-xs text-gray-500">7 derniers jours</span>
//                   </div>
//                   <div className="h-40">
//                     <ResponsiveContainer width="100%" height="100%">
//                       <LineChart
//                         data={dailyData}
//                         margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
//                       >
//                         <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" />
//                         <XAxis 
//                           dataKey="date" 
//                           tick={{ fontSize: 9 }}
//                         />
//                         <YAxis 
//                           tick={{ fontSize: 9 }}
//                           tickFormatter={(value) => formatNumber(value)}
//                           width={30}
//                         />
//                         <Tooltip 
//                           formatter={(value) => [formatCurrency(value), 'Ventes']}
//                           labelStyle={{ fontSize: 10 }}
//                         />
//                         <Line 
//                           type="monotone" 
//                           dataKey="sales" 
//                           name="Ventes"
//                           stroke="#ef4444"
//                           strokeWidth={2}
//                           dot={{ r: 3 }}
//                           activeDot={{ r: 5 }}
//                         />
//                       </LineChart>
//                     </ResponsiveContainer>
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* Performance */}
//             {activeTab === 'performance' && (
//               <div className="space-y-4">
//                 {/* Performance horaire détaillée */}
//                 <div className="bg-white p-4 rounded-lg border border-gray-200">
//                   <div className="flex items-center justify-between mb-4">
//                     <h3 className="text-sm font-semibold text-gray-900">Performance Horaire</h3>
//                     <span className="text-xs text-gray-500">Répartition par heure</span>
//                   </div>
//                   <div className="h-64">
//                     <ResponsiveContainer width="100%" height="100%">
//                       <BarChart
//                         data={hourlyData}
//                         margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
//                       >
//                         <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" />
//                         <XAxis 
//                           dataKey="hour" 
//                           tick={{ fontSize: 9 }}
//                           tickFormatter={(value) => `${value}h`}
//                         />
//                         <YAxis 
//                           tick={{ fontSize: 9 }}
//                           width={25}
//                         />
//                         <Tooltip 
//                           formatter={(value) => [value, 'Transactions']}
//                           labelStyle={{ fontSize: 10 }}
//                         />
//                         <Bar 
//                           dataKey="sales" 
//                           name="Transactions"
//                           fill="#f59e0b"
//                           radius={[2, 2, 0, 0]}
//                         />
//                       </BarChart>
//                     </ResponsiveContainer>
//                   </div>
//                 </div>

//                 {/* Performance par semaine */}
//                 <div className="bg-white p-4 rounded-lg border border-gray-200">
//                   <h3 className="text-sm font-semibold text-gray-900 mb-4">Performance Hebdomadaire</h3>
//                   <div className="h-48">
//                     <ResponsiveContainer width="100%" height="100%">
//                       <ComposedChart
//                         data={weeklyData}
//                         margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
//                       >
//                         <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" />
//                         <XAxis 
//                           dataKey="week" 
//                           tick={{ fontSize: 10 }}
//                         />
//                         <YAxis 
//                           tick={{ fontSize: 10 }}
//                           yAxisId="left"
//                           tickFormatter={(value) => formatNumber(value)}
//                           width={40}
//                         />
//                         <YAxis 
//                           yAxisId="right"
//                           orientation="right"
//                           tick={{ fontSize: 10 }}
//                           width={30}
//                         />
//                         <Tooltip 
//                           formatter={(value, name) => {
//                             if (name === 'sales') return [formatCurrency(value), 'Ventes'];
//                             if (name === 'transactions') return [value, 'Transactions'];
//                             if (name === 'avg') return [formatCurrency(value), 'Moyenne'];
//                           }}
//                           labelStyle={{ fontSize: 10 }}
//                         />
//                         <Bar 
//                           yAxisId="left"
//                           dataKey="sales" 
//                           name="Ventes"
//                           fill="#3b82f6"
//                           radius={[2, 2, 0, 0]}
//                         />
//                         <Line 
//                           yAxisId="right"
//                           type="monotone" 
//                           dataKey="transactions" 
//                           name="Transactions"
//                           stroke="#10b981"
//                           strokeWidth={2}
//                         />
//                       </ComposedChart>
//                     </ResponsiveContainer>
//                   </div>
//                 </div>

//                 {/* Métriques avancées */}
//                 <div className="bg-white p-4 rounded-lg border border-gray-200">
//                   <h3 className="text-sm font-semibold text-gray-900 mb-4">Métriques de Performance</h3>
//                   <div className="space-y-3">
//                     {[
//                       {
//                         label: 'Taux de croissance',
//                         value: `${performanceMetrics.growthRate >= 0 ? '+' : ''}${performanceMetrics.growthRate || 0}%`,
//                         desc: 'vs période précédente',
//                         icon: performanceMetrics.growthRate >= 0 ? TrendingUp : TrendingDown,
//                         color: performanceMetrics.growthRate >= 0 ? 'text-green-600' : 'text-red-600',
//                         bg: performanceMetrics.growthRate >= 0 ? 'bg-green-50' : 'bg-red-50'
//                       },
//                       {
//                         label: 'Marge bénéficiaire',
//                         value: `${performanceMetrics.totalSalesCDF > 0 ? 
//                           Math.round((performanceMetrics.totalRevenueCDF / performanceMetrics.totalSalesCDF) * 100) : 0}%`,
//                         desc: 'Bénéfice net / CA',
//                         icon: Percent,
//                         color: 'text-blue-600',
//                         bg: 'bg-blue-50'
//                       },
//                       {
//                         label: 'Productivité moyenne',
//                         value: formatCurrency(performanceMetrics.avgTransactionValue),
//                         desc: 'CA par transaction',
//                         icon: TrendingUp,
//                         color: 'text-purple-600',
//                         bg: 'bg-purple-50'
//                       },
//                       {
//                         label: 'Heure de pointe',
//                         value: `${performanceMetrics.peakHour}h`,
//                         desc: 'Heure la plus active',
//                         icon: Clock,
//                         color: 'text-orange-600',
//                         bg: 'bg-orange-50'
//                       }
//                     ].map((metric, index) => (
//                       <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
//                         <div className="flex items-center gap-3">
//                           <div className={`p-2 rounded-lg ${metric.bg}`}>
//                             <metric.icon className={`w-4 h-4 ${metric.color}`} />
//                           </div>
//                           <div>
//                             <p className="text-sm font-medium text-gray-900">{metric.label}</p>
//                             <p className="text-xs text-gray-500">{metric.desc}</p>
//                           </div>
//                         </div>
//                         <div className="text-lg font-semibold text-gray-900">{metric.value}</div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* Comparaison */}
//             {activeTab === 'comparison' && (
//               <div className="space-y-4">
//                 {/* Comparaison des vendeurs avec dépenses et revenus */}
//                 <div className="bg-white p-4 rounded-lg border border-gray-200">
//                   <div className="flex items-center justify-between mb-4">
//                     <h3 className="text-sm font-semibold text-gray-900">Comparaison Vendeurs</h3>
//                     <span className="text-xs text-gray-500">Dépenses vs Revenus</span>
//                   </div>
//                   <div className="h-64">
//                     <ResponsiveContainer width="100%" height="100%">
//                       <BarChart
//                         data={userComparison.slice(0, 8)}
//                         margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
//                       >
//                         <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" />
//                         <XAxis 
//                           dataKey="name" 
//                           tick={{ fontSize: 9 }}
//                           angle={-45}
//                           textAnchor="end"
//                           height={60}
//                         />
//                         <YAxis 
//                           tick={{ fontSize: 10 }}
//                           tickFormatter={(value) => formatNumber(value)}
//                           width={40}
//                         />
//                         <Tooltip 
//                           formatter={(value, name) => {
//                             if (name === 'revenue') return [formatCurrency(value), 'Revenu'];
//                             if (name === 'expenses') return [formatCurrency(value), 'Dépenses'];
//                           }}
//                           labelStyle={{ fontSize: 10 }}
//                         />
//                         <Bar 
//                           dataKey="revenue" 
//                           name="Revenu"
//                           fill="#10b981"
//                           radius={[2, 2, 0, 0]}
//                         />
//                         <Bar 
//                           dataKey="expenses" 
//                           name="Dépenses"
//                           fill="#ef4444"
//                           radius={[2, 2, 0, 0]}
//                         />
//                       </BarChart>
//                     </ResponsiveContainer>
//                   </div>
//                 </div>

//                 {/* Efficacité des vendeurs */}
//                 <div className="bg-white p-4 rounded-lg border border-gray-200">
//                   <h3 className="text-sm font-semibold text-gray-900 mb-4">Efficacité par Vendeur</h3>
//                   <div className="h-48">
//                     <ResponsiveContainer width="100%" height="100%">
//                       <RadarChart
//                         cx="50%"
//                         cy="50%"
//                         outerRadius="70%"
//                         data={userComparison.slice(0, 6)}
//                       >
//                         <PolarGrid stroke="#f0f0f0" />
//                         <PolarAngleAxis 
//                           dataKey="name" 
//                           tick={{ fontSize: 8 }}
//                         />
//                         <PolarRadiusAxis 
//                           angle={30} 
//                           domain={[0, 'auto']}
//                           tick={{ fontSize: 8 }}
//                         />
//                         <Radar
//                           name="Efficacité"
//                           dataKey="efficiency"
//                           stroke="#8b5cf6"
//                           fill="#8b5cf6"
//                           fillOpacity={0.3}
//                         />
//                         <Tooltip 
//                           formatter={(value) => [`${value}%`, 'Score']}
//                           labelStyle={{ fontSize: 10 }}
//                         />
//                       </RadarChart>
//                     </ResponsiveContainer>
//                   </div>
//                 </div>

//                 {/* Tableau de comparaison */}
//                 <div className="bg-white p-4 rounded-lg border border-gray-200">
//                   <h3 className="text-sm font-semibold text-gray-900 mb-4">Détails par Vendeur</h3>
//                   <div className="overflow-x-auto">
//                     <table className="w-full text-sm">
//                       <thead>
//                         <tr className="border-b border-gray-200">
//                           <th className="text-left py-2 font-medium text-gray-500">Vendeur</th>
//                           <th className="text-right py-2 font-medium text-gray-500">Ventes</th>
//                           <th className="text-right py-2 font-medium text-gray-500">Dépenses</th>
//                           <th className="text-right py-2 font-medium text-gray-500">Revenu</th>
//                           <th className="text-right py-2 font-medium text-gray-500">Efficacité</th>
//                         </tr>
//                       </thead>
//                       <tbody>
//                         {userComparison.slice(0, 10).map((vendor) => (
//                           <tr key={vendor.id} className="border-b border-gray-100 hover:bg-gray-50">
//                             <td className="py-2 text-gray-900">
//                               <div className="flex items-center gap-2">
//                                 <User className="w-4 h-4 text-gray-400" />
//                                 {vendor.name}
//                               </div>
//                             </td>
//                             <td className="text-right py-2 font-medium">
//                               {formatCurrency(vendor.sales)}
//                             </td>
//                             <td className="text-right py-2 text-red-600">
//                               {formatCurrency(vendor.expenses)}
//                             </td>
//                             <td className="text-right py-2 text-green-600 font-medium">
//                               {formatCurrency(vendor.revenue)}
//                             </td>
//                             <td className="text-right py-2">
//                               <span className={`px-2 py-1 rounded text-xs ${
//                                 vendor.efficiency >= 30 ? 'bg-green-100 text-green-800' :
//                                 vendor.efficiency >= 20 ? 'bg-yellow-100 text-yellow-800' :
//                                 'bg-red-100 text-red-800'
//                               }`}>
//                                 {vendor.efficiency}%
//                               </span>
//                             </td>
//                           </tr>
//                         ))}
//                       </tbody>
//                     </table>
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* Catégories de dépenses */}
//             {activeTab === 'categories' && (
//               <div className="space-y-4">
//                 {/* Doughnut des dépenses */}
//                 <div className="bg-white p-4 rounded-lg border border-gray-200">
//                   <div className="flex items-center justify-between mb-4">
//                     <h3 className="text-sm font-semibold text-gray-900">Répartition des Dépenses</h3>
//                     <span className="text-xs text-gray-500">Par catégorie</span>
//                   </div>
//                   <div className="h-64">
//                     <ResponsiveContainer width="100%" height="100%">
//                       <PieChart>
//                         <Pie
//                           data={categoryData}
//                           cx="50%"
//                           cy="50%"
//                           innerRadius={60}
//                           outerRadius={80}
//                           paddingAngle={2}
//                           dataKey="value"
//                           nameKey="name"
//                         >
//                           {categoryData.map((entry, index) => (
//                             <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                           ))}
//                         </Pie>
//                         <Tooltip 
//                           formatter={(value, name, props) => [
//                             formatCurrency(value), 
//                             props.payload.fullName || name
//                           ]}
//                           labelStyle={{ fontSize: 10 }}
//                         />
//                         <Legend 
//                           layout="vertical"
//                           verticalAlign="middle"
//                           align="right"
//                           wrapperStyle={{ fontSize: '9px' }}
//                         />
//                       </PieChart>
//                     </ResponsiveContainer>
//                   </div>
//                 </div>

//                 {/* Détails des catégories */}
//                 <div className="bg-white p-4 rounded-lg border border-gray-200">
//                   <h3 className="text-sm font-semibold text-gray-900 mb-4">Détails par Catégorie</h3>
//                   <div className="space-y-2">
//                     {categoryData.map((category, index) => (
//                       <div key={index} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
//                         <div className="flex items-center gap-3">
//                           <div 
//                             className="w-3 h-3 rounded-full"
//                             style={{ backgroundColor: COLORS[index % COLORS.length] }}
//                           />
//                           <span className="text-sm text-gray-900">{category.fullName}</span>
//                         </div>
//                         <div className="text-sm font-semibold text-gray-900">
//                           {formatCurrency(category.value)}
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             )}
//           </>
//         )}
//       </div>

//       {/* Footer */}
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

import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  Activity, 
  TrendingUp, 
  Users, 
  Filter,
  Download,
  Calendar,
  X
} from 'lucide-react';

// Import Recharts
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
  ComposedChart,
  Scatter,
  Sector
} from 'recharts';

export default function UsersSalesAnalytics() {
  const [activeTab, setActiveTab] = useState('performance');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('week');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [datePicker, setDatePicker] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  
  // États pour les données
  const [dailyData, setDailyData] = useState([]);
  const [weeklyData, setWeeklyData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [hourlyData, setHourlyData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [userComparison, setUserComparison] = useState([]);
  const [salesExpensesData, setSalesExpensesData] = useState([]);
  
  // Couleurs
  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#f97316', '#8b5cf6'];
  
  // Calculer la période
  const getDateRange = (period) => {
    const now = new Date();
    let start = new Date();
    let end = new Date();
    
    switch (period) {
      case 'today':
        start.setHours(0, 0, 0, 0);
        break;
      case 'yesterday':
        start.setDate(now.getDate() - 1);
        start.setHours(0, 0, 0, 0);
        end = new Date(start);
        end.setHours(23, 59, 59, 999);
        break;
      case 'week':
        start.setDate(now.getDate() - 7);
        start.setHours(0, 0, 0, 0);
        break;
      case 'month':
        start.setMonth(now.getMonth() - 1);
        start.setHours(0, 0, 0, 0);
        break;
      case 'quarter':
        start.setMonth(now.getMonth() - 3);
        start.setHours(0, 0, 0, 0);
        break;
      case 'year':
        start.setFullYear(now.getFullYear() - 1);
        start.setHours(0, 0, 0, 0);
        break;
      default:
        if (datePicker && startDate && endDate) {
          start = new Date(startDate);
          end = new Date(endDate);
        } else {
          start = new Date('2023-01-01');
        }
    }
    
    return { start, end };
  };

  // Récupérer les données
  const fetchData = async () => {
    try {
      setLoading(true);
      
      const { start, end } = getDateRange(dateRange);
      
      // Récupérer les vendeurs
      let usersQuery = supabase
        .from('users')
        .select('*')
        .eq('role', 'vendor')
        .eq('is_active', true);

      if (searchQuery) {
        usersQuery = usersQuery.or(`full_name.ilike.%${searchQuery}%,shop_name.ilike.%${searchQuery}%`);
      }

      const { data: vendors, error: vendorsError } = await usersQuery;
      if (vendorsError) throw vendorsError;

      // Préparer les données pour les graphiques
      await prepareChartData(vendors, start, end);

    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  // Préparer les données des graphiques
  const prepareChartData = async (vendors, startDate, endDate) => {
    try {
      // 1. Données quotidiennes pour Area Chart
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      
      const { data: dailySales } = await supabase
        .from('sale')
        .select('created_at, total, currency, status')
        .gte('created_at', weekAgo.toISOString())
        .lte('created_at', endDate.toISOString())
        .eq('status', 'completed')
        .eq('payment_status', 'paid')
        .order('created_at');

      // 2. Données des sorties pour le même période
      const { data: dailyExpenses } = await supabase
        .from('cash_outflow')
        .select('date, amount, currency')
        .gte('date', weekAgo.toISOString().split('T')[0])
        .lte('date', endDate.toISOString().split('T')[0])
        .eq('status', 'completed');

      // Grouper par jour pour Composed Chart
      const dailyMap = {};
      
      dailySales?.forEach(sale => {
        const date = new Date(sale.created_at).toLocaleDateString('fr-FR', { 
          weekday: 'short',
          day: 'numeric',
          month: 'short'
        });
        if (!dailyMap[date]) {
          dailyMap[date] = { 
            date,
            sales: 0, 
            expenses: 0,
            revenue: 0,
            transactions: 1
          };
        }
        dailyMap[date].sales += sale.total || 0;
        dailyMap[date].transactions += 1;
      });

      dailyExpenses?.forEach(expense => {
        const date = new Date(expense.date).toLocaleDateString('fr-FR', { 
          weekday: 'short',
          day: 'numeric',
          month: 'short'
        });
        if (!dailyMap[date]) {
          dailyMap[date] = { 
            date,
            sales: 0, 
            expenses: 0,
            revenue: 0,
            transactions: 0
          };
        }
        dailyMap[date].expenses += expense.amount || 0;
      });

      // Calculer le revenue pour chaque jour
      Object.keys(dailyMap).forEach(date => {
        dailyMap[date].revenue = Math.max(0, dailyMap[date].sales - dailyMap[date].expenses);
      });

      const formattedDailyData = Object.values(dailyMap)
        .map(item => ({
          ...item,
          sales: Math.round(item.sales),
          expenses: Math.round(item.expenses),
          revenue: Math.round(item.revenue)
        }))
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .slice(-7);

      setDailyData(formattedDailyData);

      // 3. Données hebdomadaires pour Line Chart avec padding
      const monthAgo = new Date();
      monthAgo.setDate(monthAgo.getDate() - 30);
      
      const { data: weeklySales } = await supabase
        .from('sale')
        .select('created_at, total')
        .gte('created_at', monthAgo.toISOString())
        .lte('created_at', endDate.toISOString())
        .eq('status', 'completed')
        .eq('payment_status', 'paid');

      // Grouper par semaine
      const weeklyMap = {};
      weeklySales?.forEach(sale => {
        const date = new Date(sale.created_at);
        const weekNum = Math.floor(date.getDate() / 7) + 1;
        const weekLabel = `Semaine ${weekNum} (${date.toLocaleDateString('fr-FR', { month: 'short' })})`;
        
        if (!weeklyMap[weekLabel]) {
          weeklyMap[weekLabel] = { 
            week: weekLabel,
            sales: 0,
            avg: 0,
            count: 0
          };
        }
        weeklyMap[weekLabel].sales += sale.total || 0;
        weeklyMap[weekLabel].count += 1;
      });

      // Calculer la moyenne
      Object.keys(weeklyMap).forEach(week => {
        weeklyMap[week].avg = Math.round(weeklyMap[week].sales / Math.max(weeklyMap[week].count, 1));
      });

      const weeklyChartData = Object.values(weeklyMap)
        .map(item => ({
          ...item,
          sales: Math.round(item.sales)
        }))
        .sort((a, b) => a.week.localeCompare(b.week));

      setWeeklyData(weeklyChartData);

      // 4. Données mensuelles pour Simple Area Chart
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
      
      const { data: monthlySales } = await supabase
        .from('sale')
        .select('created_at, total, currency')
        .gte('created_at', sixMonthsAgo.toISOString())
        .lte('created_at', endDate.toISOString())
        .eq('status', 'completed')
        .eq('payment_status', 'paid');

      const { data: monthlyExpenses } = await supabase
        .from('cash_outflow')
        .select('date, amount, currency')
        .gte('date', sixMonthsAgo.toISOString().split('T')[0])
        .lte('date', endDate.toISOString().split('T')[0])
        .eq('status', 'completed');

      const monthlyMap = {};
      monthlySales?.forEach(sale => {
        const date = new Date(sale.created_at);
        const monthKey = date.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
        
        if (!monthlyMap[monthKey]) {
          monthlyMap[monthKey] = { 
            month: monthKey,
            sales: 0,
            expenses: 0
          };
        }
        monthlyMap[monthKey].sales += sale.total || 0;
      });

      monthlyExpenses?.forEach(expense => {
        const date = new Date(expense.date);
        const monthKey = date.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
        
        if (!monthlyMap[monthKey]) {
          monthlyMap[monthKey] = { 
            month: monthKey,
            sales: 0,
            expenses: 0
          };
        }
        monthlyMap[monthKey].expenses += expense.amount || 0;
      });

      const monthlyChartData = Object.values(monthlyMap)
        .map(item => ({
          month: item.month.split(' ')[0], // Juste le mois
          sales: Math.round(item.sales),
          expenses: Math.round(item.expenses),
          revenue: Math.round(item.sales - item.expenses)
        }))
        .sort((a, b) => new Date(a.month + ' 2024') - new Date(b.month + ' 2024'))
        .slice(-6);

      setMonthlyData(monthlyChartData);

      // 5. Données horaires pour Simple Area Chart
      const { data: hourlySales } = await supabase
        .from('sale')
        .select('created_at')
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString())
        .eq('status', 'completed')
        .eq('payment_status', 'paid');

      const hours = Array.from({ length: 24 }, (_, i) => ({ 
        hour: i, 
        label: `${i}h`,
        transactions: 0 
      }));
      
      hourlySales?.forEach(sale => {
        const hour = new Date(sale.created_at).getHours();
        hours[hour].transactions += 1;
      });

      setHourlyData(hours);

      // 6. Données de catégories pour Doughnut Chart
      const { data: categories } = await supabase
        .from('cash_outflow')
        .select('category, amount')
        .gte('date', startDate.toISOString().split('T')[0])
        .lte('date', endDate.toISOString().split('T')[0])
        .eq('status', 'completed');

      const categoryMap = {};
      categories?.forEach(item => {
        const category = item.category || 'Divers';
        categoryMap[category] = (categoryMap[category] || 0) + (item.amount || 0);
      });

      const formattedCategoryData = Object.entries(categoryMap)
        .map(([name, value]) => ({
          name: name.length > 15 ? name.substring(0, 12) + '...' : name,
          value: Math.round(value),
          fullName: name
        }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 6);

      setCategoryData(formattedCategoryData);

      // 7. Données de comparaison des vendeurs pour Same Data Composed Chart
      const vendorsWithStats = await Promise.all(
        vendors.map(async (vendor) => {
          const { data: vendorSales } = await supabase
            .from('sale')
            .select('total, currency')
            .eq('user_id', vendor.id)
            .gte('created_at', startDate.toISOString())
            .lte('created_at', endDate.toISOString())
            .eq('status', 'completed')
            .eq('payment_status', 'paid');

          const { data: vendorExpenses } = await supabase
            .from('cash_outflow')
            .select('amount, currency')
            .eq('user_id', vendor.id)
            .gte('date', startDate.toISOString().split('T')[0])
            .lte('date', endDate.toISOString().split('T')[0])
            .eq('status', 'completed');

          const salesTotal = vendorSales?.reduce((sum, s) => sum + (s.total || 0), 0) || 0;
          const expensesTotal = vendorExpenses?.reduce((sum, e) => sum + (e.amount || 0), 0) || 0;

          return {
            id: vendor.id,
            name: vendor.full_name || vendor.shop_name || `Vendeur ${vendor.id.slice(0, 4)}`,
            sales: Math.round(salesTotal),
            expenses: Math.round(expensesTotal),
            revenue: Math.round(salesTotal - expensesTotal),
            efficiency: salesTotal > 0 ? Math.round(((salesTotal - expensesTotal) / salesTotal) * 100) : 0
          };
        })
      );

      const sortedVendors = vendorsWithStats.sort((a, b) => b.sales - a.sales).slice(0, 6);
      setUserComparison(sortedVendors);

      // 8. Données ventes vs dépenses pour Composed Chart With Axis Labels
      const salesExpensesByDate = [];
      const currentDate = new Date(startDate);
      const endDateObj = new Date(endDate);
      
      while (currentDate <= endDateObj) {
        const dateStr = currentDate.toLocaleDateString('fr-FR', { 
          day: 'numeric',
          month: 'short'
        });
        
        const daySales = dailySales?.filter(s => {
          const saleDate = new Date(s.created_at);
          return saleDate.toDateString() === currentDate.toDateString();
        }).reduce((sum, s) => sum + (s.total || 0), 0) || 0;
        
        const dayExpenses = dailyExpenses?.filter(e => {
          const expenseDate = new Date(e.date);
          return expenseDate.toDateString() === currentDate.toDateString();
        }).reduce((sum, e) => sum + (e.amount || 0), 0) || 0;
        
        salesExpensesByDate.push({
          date: dateStr,
          sales: Math.round(daySales),
          expenses: Math.round(dayExpenses),
          revenue: Math.round(daySales - dayExpenses)
        });
        
        currentDate.setDate(currentDate.getDate() + 1);
      }
      
      setSalesExpensesData(salesExpensesByDate.slice(-14)); // 2 dernières semaines

    } catch (error) {
      console.error('Erreur préparation données:', error);
    }
  };

  // Charger les données
  useEffect(() => {
    fetchData();
  }, [dateRange, selectedUser]);



  const formatCurrency = (amount, currency = 'CDF') => {
    if (!amount && amount !== 0) return '0';
    const num = typeof amount === 'number' ? amount : parseFloat(amount);
    if (isNaN(num)) return '0';
    
    if (currency === 'USD') {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(num);
    }
    return new Intl.NumberFormat('fr-FR', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num) + ' FC';
  };

  const formatNumber = (num) => {
    if (!num && num !== 0) return '0';
    return new Intl.NumberFormat('fr-FR').format(Math.round(num));
  };



  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6">
     

      {/* Onglets */}
      <div className="mb-8">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-1">
            {[
              { id: 'performance', label: 'Performance', icon: Activity },
              { id: 'comparison', label: 'Comparaison', icon: Users },
              { id: 'trends', label: 'Tendances', icon: TrendingUp },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center gap-2 px-6 py-3 text-sm font-medium rounded-t-lg transition-all
                  ${activeTab === tab.id
                    ? 'bg-white text-blue-600 border-t border-l border-r border-gray-200 shadow-sm -mb-px'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }
                `}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Contenu des graphiques */}
      <div className="space-y-8">
        {loading ? (
          <div className="flex justify-center items-center py-32">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Chargement des données...</p>
            </div>
          </div>
        ) : (
          <>
            {/* PERFORMANCE */}
            {activeTab === 'performance' && (
              <div className="space-y-8">
                {/* 1. Composed Chart With Axis Labels - Ventes vs Dépenses */}
                <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Ventes vs Dépenses Journalières</h3>
                      <p className="text-sm text-gray-600 mt-1">Comparaison sur 14 jours</p>
                    </div>
                    <div className="flex items-center gap-4 mt-2 sm:mt-0">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                        <span className="text-xs text-gray-600">Ventes</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <span className="text-xs text-gray-600">Dépenses</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        <span className="text-xs text-gray-600">Revenu net</span>
                      </div>
                    </div>
                  </div>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <ComposedChart
                        data={salesExpensesData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                        <XAxis 
                          dataKey="date" 
                          tick={{ fontSize: 12 }}
                          axisLine={false}
                          tickLine={false}
                          padding={{ left: 10, right: 10 }}
                        />
                        <YAxis 
                          tick={{ fontSize: 12 }}
                          tickFormatter={(value) => formatNumber(value)}
                          axisLine={false}
                          tickLine={false}
                          label={{ 
                            value: 'Montant (FC)', 
                            angle: -90, 
                            position: 'insideLeft',
                            offset: 10,
                            style: { fontSize: 12 }
                          }}
                        />
                        <Tooltip 
                          formatter={(value, name) => {
                            const labels = {
                              'sales': 'Ventes',
                              'expenses': 'Dépenses',
                              'revenue': 'Revenu net'
                            };
                            return [formatCurrency(value), labels[name] || name];
                          }}
                          contentStyle={{ 
                            borderRadius: '8px', 
                            border: '1px solid #e5e7eb',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                            fontSize: '12px'
                          }}
                        />
                        <Legend 
                          wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }}
                        />
                        <Bar 
                          dataKey="sales" 
                          name="Ventes"
                          fill="#3b82f6"
                          radius={[4, 4, 0, 0]}
                          barSize={20}
                        />
                        <Bar 
                          dataKey="expenses" 
                          name="Dépenses"
                          fill="#ef4444"
                          radius={[4, 4, 0, 0]}
                          barSize={20}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="revenue" 
                          name="Revenu net"
                          stroke="#10b981"
                          strokeWidth={3}
                          dot={{ r: 4, strokeWidth: 2, fill: 'white' }}
                          activeDot={{ r: 6, strokeWidth: 2, fill: '#10b981' }}
                        />
                      </ComposedChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* 2. Simple Area Chart - Tendances mensuelles */}
                <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-8">Évolution Mensuelle des Ventes</h3>
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={monthlyData}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                      >
                        <defs>
                          <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" />
                        <XAxis 
                          dataKey="month" 
                          tick={{ fontSize: 12 }}
                          axisLine={false}
                          tickLine={false}
                        />
                        <YAxis 
                          tick={{ fontSize: 12 }}
                          tickFormatter={(value) => formatNumber(value)}
                          axisLine={false}
                          tickLine={false}
                        />
                        <Tooltip 
                          formatter={(value) => [formatCurrency(value), 'Ventes']}
                          contentStyle={{ 
                            borderRadius: '8px', 
                            border: '1px solid #e5e7eb',
                            fontSize: '12px'
                          }}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="sales" 
                          name="Ventes"
                          stroke="#3b82f6"
                          strokeWidth={3}
                          fillOpacity={1}
                          fill="url(#colorSales)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* 3. Line Chart With X Axis Padding - Performance hebdomadaire */}
                <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-8">Performance Hebdomadaire</h3>
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={weeklyData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" />
                        <XAxis 
                          dataKey="week" 
                          tick={{ fontSize: 11 }}
                          padding={{ left: 20, right: 20 }}
                          axisLine={false}
                          tickLine={false}
                        />
                        <YAxis 
                          tick={{ fontSize: 12 }}
                          tickFormatter={(value) => formatNumber(value)}
                          axisLine={false}
                          tickLine={false}
                        />
                        <Tooltip 
                          formatter={(value, name) => {
                            const labels = {
                              'sales': 'Ventes totales',
                              'avg': 'Moyenne par transaction'
                            };
                            return [formatCurrency(value), labels[name] || name];
                          }}
                          contentStyle={{ 
                            borderRadius: '8px', 
                            border: '1px solid #e5e7eb',
                            fontSize: '12px'
                          }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="sales" 
                          name="Ventes totales"
                          stroke="#8b5cf6"
                          strokeWidth={3}
                          dot={{ r: 4, strokeWidth: 2, fill: 'white' }}
                          activeDot={{ r: 6, strokeWidth: 2, fill: '#8b5cf6' }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="avg" 
                          name="Moyenne par transaction"
                          stroke="#f59e0b"
                          strokeWidth={2}
                          strokeDasharray="5 5"
                          dot={{ r: 3 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            )}

            {/* COMPARAISON */}
            {activeTab === 'comparison' && (
              <div className="space-y-8">
                {/* 1. Same Data Composed Chart - Comparaison vendeurs */}
                <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Comparaison des Vendeurs</h3>
                      <p className="text-sm text-gray-600 mt-1">Ventes, Dépenses et Revenus</p>
                    </div>
                    <div className="flex items-center gap-4 mt-2 sm:mt-0">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                        <span className="text-xs text-gray-600">Ventes</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <span className="text-xs text-gray-600">Dépenses</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        <span className="text-xs text-gray-600">Revenus</span>
                      </div>
                    </div>
                  </div>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <ComposedChart
                        data={userComparison}
                        margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis 
                          dataKey="name" 
                          tick={{ fontSize: 11 }}
                          angle={-45}
                          textAnchor="end"
                          height={80}
                          interval={0}
                        />
                        <YAxis 
                          tick={{ fontSize: 12 }}
                          tickFormatter={(value) => formatNumber(value)}
                          label={{ 
                            value: 'Montant (FC)', 
                            angle: -90, 
                            position: 'insideLeft',
                            offset: 10,
                            style: { fontSize: 12 }
                          }}
                        />
                        <Tooltip 
                          formatter={(value, name) => {
                            const labels = {
                              'sales': 'Ventes',
                              'expenses': 'Dépenses',
                              'revenue': 'Revenu net'
                            };
                            return [formatCurrency(value), labels[name] || name];
                          }}
                          contentStyle={{ 
                            borderRadius: '8px', 
                            border: '1px solid #e5e7eb',
                            fontSize: '12px'
                          }}
                        />
                        <Bar 
                          dataKey="sales" 
                          name="Ventes"
                          fill="#3b82f6"
                          radius={[4, 4, 0, 0]}
                          barSize={30}
                        />
                        <Bar 
                          dataKey="expenses" 
                          name="Dépenses"
                          fill="#ef4444"
                          radius={[4, 4, 0, 0]}
                          barSize={30}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="revenue" 
                          name="Revenu net"
                          stroke="#10b981"
                          strokeWidth={3}
                          dot={{ r: 4, strokeWidth: 2, fill: 'white' }}
                        />
                      </ComposedChart>
                    </ResponsiveContainer>
                  </div>
                </div>

               <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
  <div className="bg-white border border-gray-200 shadow-lg p-6">
    <h3 className="text-lg font-semibold text-gray-900 mb-8">Répartition des Dépenses</h3>
    <div className="h-96">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={categoryData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={2}
            dataKey="value"
            nameKey="name"
            labelLine={false}
          >
            {categoryData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={COLORS[index % COLORS.length]}
                stroke="#fff"
                strokeWidth={1}
              />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value) => formatCurrency(value)}
            contentStyle={{ 
              borderRadius: '4px', 
              border: '1px solid #e5e7eb',
              fontSize: '12px'
            }}
          />
          <Legend 
            layout="vertical"
            verticalAlign="middle"
            align="right"
            wrapperStyle={{ fontSize: '11px' }}
            formatter={(value, entry) => (
              <span className="text-gray-700">{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  </div>

  <div className="bg-white border border-gray-200 shadow-lg p-6">
    <h3 className="text-lg font-semibold text-gray-900 mb-8">Activité Horaire</h3>
    <div className="h-96">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={hourlyData}
          margin={{ top: 10, right: 30, left: 20, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorTransactions" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" />
          <XAxis 
            dataKey="hour" 
            tick={{ fontSize: 11 }}
            tickFormatter={(value) => `${value}h`}
            axisLine={false}
            tickLine={false}
          />
          <YAxis 
            tick={{ fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip 
            formatter={(value) => [`${value} transactions`, 'Volume']}
            labelFormatter={(label) => `Heure : ${label}h`}
            contentStyle={{ 
              borderRadius: '4px', 
              border: '1px solid #e5e7eb',
              fontSize: '12px'
            }}
          />
          <Legend 
            verticalAlign="top"
            height={36}
            wrapperStyle={{ fontSize: '12px' }}
            formatter={(value) => (
              <span className="text-gray-700">{value}</span>
            )}
          />
          <Area 
            type="monotone" 
            dataKey="transactions" 
            name="Transactions"
            stroke="#f59e0b"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorTransactions)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  </div>
</div>
              </div>
            )}

            {/* TENDANCES */}
            {activeTab === 'trends' && (
              <div className="space-y-8">
                {/* 1. Simple Area Chart - Tendances quotidiennes */}
                <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Tendances Journalières</h3>
                      <p className="text-sm text-gray-600 mt-1">7 derniers jours</p>
                    </div>
                  </div>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={dailyData}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                      >
                        <defs>
                          <linearGradient id="colorDailySales" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                          </linearGradient>
                          <linearGradient id="colorDailyExpenses" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" />
                        <XAxis 
                          dataKey="date" 
                          tick={{ fontSize: 12 }}
                          axisLine={false}
                          tickLine={false}
                        />
                        <YAxis 
                          tick={{ fontSize: 12 }}
                          tickFormatter={(value) => formatNumber(value)}
                          axisLine={false}
                          tickLine={false}
                        />
                        <Tooltip 
                          formatter={(value, name) => {
                            const labels = {
                              'sales': 'Ventes',
                              'expenses': 'Dépenses',
                              'revenue': 'Revenu net'
                            };
                            return [formatCurrency(value), labels[name] || name];
                          }}
                          contentStyle={{ 
                            borderRadius: '8px', 
                            border: '1px solid #e5e7eb',
                            fontSize: '12px'
                          }}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="sales" 
                          name="Ventes"
                          stroke="#8b5cf6"
                          strokeWidth={2}
                          fillOpacity={0.6}
                          fill="url(#colorDailySales)"
                        />
                        <Area 
                          type="monotone" 
                          dataKey="expenses" 
                          name="Dépenses"
                          stroke="#ef4444"
                          strokeWidth={2}
                          fillOpacity={0.4}
                          fill="url(#colorDailyExpenses)"
                        />
                        <Line 
                          type="monotone" 
                          dataKey="revenue" 
                          name="Revenu net"
                          stroke="#10b981"
                          strokeWidth={3}
                          dot={{ r: 4, strokeWidth: 2, fill: 'white' }}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* 2. Grid de petits graphiques */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Efficacité des vendeurs */}
                  <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-8">Efficacité des Vendeurs</h3>
                    <div className="h-72">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={userComparison.map(v => ({ 
                            ...v, 
                            efficiency: Math.max(0, v.efficiency) 
                          }))}
                          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={true} vertical={false} />
                          <XAxis 
                            dataKey="name" 
                            tick={{ fontSize: 11 }}
                            angle={-45}
                            textAnchor="end"
                            height={60}
                          />
                          <YAxis 
                            tick={{ fontSize: 12 }}
                            tickFormatter={(value) => `${value}%`}
                            domain={[0, 100]}
                            axisLine={false}
                            tickLine={false}
                          />
                          <Tooltip 
                            formatter={(value) => [`${value}%`, 'Efficacité']}
                            contentStyle={{ 
                              borderRadius: '8px', 
                              border: '1px solid #e5e7eb',
                              fontSize: '12px'
                            }}
                          />
                          <Bar 
                            dataKey="efficiency" 
                            name="Efficacité (%)"
                            fill="#06b6d4"
                            radius={[4, 4, 0, 0]}
                            barSize={25}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Transactions par heure */}
                  <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-8">Distribution Horaire</h3>
                    <div className="h-72">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={hourlyData}
                          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={true} vertical={false} />
                          <XAxis 
                            dataKey="hour" 
                            tick={{ fontSize: 11 }}
                            tickFormatter={(value) => `${value}h`}
                            axisLine={false}
                            tickLine={false}
                          />
                          <YAxis 
                            tick={{ fontSize: 12 }}
                            axisLine={false}
                            tickLine={false}
                          />
                          <Tooltip 
                            formatter={(value) => [`${value} transactions`, 'Volume']}
                            labelFormatter={(label) => `Heure : ${label}h`}
                            contentStyle={{ 
                              borderRadius: '8px', 
                              border: '1px solid #e5e7eb',
                              fontSize: '12px'
                            }}
                          />
                          <Bar 
                            dataKey="transactions" 
                            name="Transactions"
                            fill="#f97316"
                            radius={[4, 4, 0, 0]}
                            barSize={15}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Footer */}
      <div className="mt-12 pt-8 border-t border-gray-200">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-sm text-gray-500">
            Dernière mise à jour: {new Date().toLocaleTimeString('fr-FR', { 
              hour: '2-digit', 
              minute: '2-digit',
              second: '2-digit'
            })}
          </div>
          <div className="text-sm text-gray-500">
            {users.length} vendeur{users.length !== 1 ? 's' : ''} analysé{users.length !== 1 ? 's' : ''}
          </div>
        </div>
      </div>
    </div>
  );
}