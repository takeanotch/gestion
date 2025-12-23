
// 'use client'

// import { useState, useEffect } from 'react'
// import { useRouter } from 'next/navigation'
// import { supabase } from '@/lib/supabase'
// import { useLanguage } from '@/contexts/LanguageContext' // Ajout de l'import
// import { 
//   ShoppingBag, 
//   Search, 
//   Filter, 
//   Plus,
//   Eye,
//   Printer,
//   User,
//   CheckCircle,
//   XCircle,
//   AlertCircle,
//   Clock,
//   Loader2,
//   X,
//   ChevronDown,
//   DollarSign
// } from 'lucide-react'

// export default function VentesPage() {
//   const router = useRouter()
//   const { t } = useLanguage() // Utilisation du hook de traduction
  
//   const [ventes, setVentes] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [saleConfig, setSaleConfig] = useState({
//     vat_amount: 20.00,
//     currency_rate: 2300.00,
//     base_currency: 'USD'
//   })
//   const [filters, setFilters] = useState({
//     search: '',
//     status: 'all',
//     dateRange: 'all',
//     currency: 'all'
//   })
//   const [showMobileFilters, setShowMobileFilters] = useState(false)
//   const [stats, setStats] = useState({
//     totalVentes: 0,
//     totalMontantCDF: 0,
//     totalMontantUSD: 0,
//     ventesAujourdhui: 0,
//     montantAujourdhuiCDF: 0,
//     montantAujourdhuiUSD: 0,
//     ventesCDF: 0,
//     ventesUSD: 0
//   })

//   useEffect(() => {
//     loadSaleConfig()
//     loadVentes()
//     loadStats()
//   }, [filters])

//   const loadSaleConfig = async () => {
//     try {
//       const { data, error } = await supabase
//         .from('sale_config')
//         .select('*')
//         .order('created_at', { ascending: false })
//         .limit(1)
//         .single()
      
//       if (data) {
//         setSaleConfig(data)
//       }
//     } catch (error) {
//       console.error(t('configLoadError'), error)
//     }
//   }

//   const loadVentes = async () => {
//     setLoading(true)
    
//     try {
//       let query = supabase
//         .from('sale')
//         .select(`
//           *,
//           client:client(name, phone)
//         `)
//         .order('created_at', { ascending: false })

//       // Appliquer les filtres
//       if (filters.dateRange === 'today') {
//         const today = new Date()
//         today.setHours(0, 0, 0, 0)
//         query = query.gte('created_at', today.toISOString())
//       } else if (filters.dateRange === 'yesterday') {
//         const yesterday = new Date()
//         yesterday.setDate(yesterday.getDate() - 1)
//         yesterday.setHours(0, 0, 0, 0)
//         const today = new Date()
//         today.setHours(0, 0, 0, 0)
//         query = query.gte('created_at', yesterday.toISOString())
//           .lt('created_at', today.toISOString())
//       } else if (filters.dateRange === 'thisMonth') {
//         const firstDay = new Date()
//         firstDay.setDate(1)
//         firstDay.setHours(0, 0, 0, 0)
//         query = query.gte('created_at', firstDay.toISOString())
//       }

//       if (filters.status !== 'all') {
//         query = query.eq('status', filters.status)
//       }

//       if (filters.currency !== 'all') {
//         query = query.eq('currency', filters.currency)
//       }

//       if (filters.search) {
//         query = query.or(`sale_number.ilike.%${filters.search}%,client.name.ilike.%${filters.search}%`)
//       }

//       const { data, error } = await query

//       if (error) {
//         console.error(t('supabaseError'), error)
//         setVentes([])
//       } else if (data) {
//         setVentes(data)
//       }
      
//     } catch (error) {
//       console.error(t('loadError'), error)
//     } finally {
//       setLoading(false)
//     }
//   }

//   const loadStats = async () => {
//     try {
//       let query = supabase
//         .from('sale')
//         .select('*')

//       if (filters.dateRange === 'today') {
//         const today = new Date()
//         today.setHours(0, 0, 0, 0)
//         query = query.gte('created_at', today.toISOString())
//       } else if (filters.dateRange === 'yesterday') {
//         const yesterday = new Date()
//         yesterday.setDate(yesterday.getDate() - 1)
//         yesterday.setHours(0, 0, 0, 0)
//         const today = new Date()
//         today.setHours(0, 0, 0, 0)
//         query = query.gte('created_at', yesterday.toISOString())
//           .lt('created_at', today.toISOString())
//       } else if (filters.dateRange === 'thisMonth') {
//         const firstDay = new Date()
//         firstDay.setDate(1)
//         firstDay.setHours(0, 0, 0, 0)
//         query = query.gte('created_at', firstDay.toISOString())
//       }

//       if (filters.currency !== 'all') {
//         query = query.eq('currency', filters.currency)
//       }

//       if (filters.search) {
//         query = query.ilike('sale_number', `%${filters.search}%`)
//       }

//       const { data: allSales } = await query

//       let totalVentes = 0
//       let totalMontantCDF = 0
//       let totalMontantUSD = 0
//       let ventesCDF = 0
//       let ventesUSD = 0
//       let ventesAujourdhui = 0
//       let montantAujourdhuiCDF = 0
//       let montantAujourdhuiUSD = 0

//       if (allSales) {
//         totalVentes = allSales.length
        
//         const today = new Date()
//         today.setHours(0, 0, 0, 0)
        
//         allSales.forEach(sale => {
//           const montant = sale.total || 0
//           const tauxVente = sale.currency_rate || saleConfig.currency_rate || 1
//           const isToday = new Date(sale.created_at) >= today
          
//           if (sale.currency === 'USD') {
//             ventesUSD += 1
//             totalMontantUSD += montant
            
//             const montantCDF = montant * tauxVente
//             totalMontantCDF += montantCDF
            
//             if (isToday) {
//               ventesAujourdhui += 1
//               montantAujourdhuiUSD += montant
//               montantAujourdhuiCDF += montantCDF
//             }
//           } else {
//             ventesCDF += 1
//             totalMontantCDF += montant
            
//             if (isToday) {
//               ventesAujourdhui += 1
//               montantAujourdhuiCDF += montant
//             }
//           }
//         })
//       }

//       setStats({
//         totalVentes,
//         totalMontantCDF: Math.round(totalMontantCDF),
//         totalMontantUSD: Math.round(totalMontantUSD * 100) / 100,
//         ventesAujourdhui,
//         montantAujourdhuiCDF: Math.round(montantAujourdhuiCDF),
//         montantAujourdhuiUSD: Math.round(montantAujourdhuiUSD * 100) / 100,
//         ventesCDF,
//         ventesUSD
//       })

//     } catch (error) {
//       console.error(t('statsLoadError'), error)
//     }
//   }

//   const formatCurrency = (amount, currency = 'CDF') => {
//     const formatted = new Intl.NumberFormat('fr-FR', {
//       minimumFractionDigits: currency === 'CDF' ? 0 : 2,
//       maximumFractionDigits: currency === 'CDF' ? 0 : 2
//     }).format(amount || 0)
    
//     return `${getCurrencySymbol(currency)} ${formatted}`
//   }

//   const getCurrencySymbol = (currency) => {
//     return currency === 'USD' ? '$' : 'FC'
//   }

//   const getStatusConfig = (status) => {
//     const configs = {
//       completed: { 
//         color: 'bg-green-100 text-green-800', 
//         icon: CheckCircle, 
//         label: t('completed') 
//       },
//       cancelled: { 
//         color: 'bg-red-100 text-red-800', 
//         icon: XCircle, 
//         label: t('cancelled') 
//       },
//       refunded: { 
//         color: 'bg-yellow-100 text-yellow-800', 
//         icon: AlertCircle, 
//         label: t('refunded') 
//       }
//     }
//     return configs[status] || { 
//       color: 'bg-gray-100 text-gray-800', 
//       icon: Clock, 
//       label: t('pending') 
//     }
//   }

//   const getPaymentMethodIcon = (method) => {
//     const icons = {
//       cash: '💰',
//       card: '💳',
//       mobile: '📱'
//     }
//     return icons[method] || '💸'
//   }

//   const getPaymentMethodLabel = (method) => {
//     const labels = {
//       cash: t('cash'),
//       card: t('card'),
//       mobile: t('mobile')
//     }
//     return labels[method] || method
//   }

//   const getCurrencyBadge = (currency) => {
//     return currency === 'USD' 
//       ? <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
//           <DollarSign className="w-3 h-3 mr-1" />
//           USD
//         </span>
//       : <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">
//           FC
//         </span>
//   }

//   const handleResetFilters = () => {
//     setFilters({
//       search: '',
//       status: 'all',
//       dateRange: 'all',
//       currency: 'all'
//     })
//   }

//   const activeFilters = Object.values(filters).filter(v => 
//     v !== '' && v !== false && v !== 'all'
//   ).length

//   const handlePrintReceipt = (saleId) => {
//     console.log(t('printReceiptFor'), saleId)
//   }

//   const handleRefresh = () => {
//     loadVentes()
//     loadStats()
//   }

//   return (
//     <div className="p-4 sm:p-6">
//       {/* Header */}
//       <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
//         <div>
//           <h1 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center">
//             <ShoppingBag className="w-6 h-6 sm:w-7 sm:h-7 mr-3 text-gray-700" />
//             {t('sales')}
//           </h1>
//           <div className="flex flex-wrap gap-3 mt-2">
//             <div className="flex items-center space-x-1 text-sm">
//               <span className="text-gray-500">{t('total')}:</span>
//               <span className="font-medium">{stats.totalVentes}</span>
//             </div>
//             <div className="flex items-center space-x-1 text-sm">
//               <span className="text-blue-600">{t('today')}:</span>
//               <span className="font-medium">{stats.ventesAujourdhui}</span>
//             </div>
//             <div className="flex items-center space-x-1 text-sm">
//               <span className="text-green-600">{t('revenue')}:</span>
//               <span className="font-medium">{formatCurrency(stats.montantAujourdhuiCDF)}</span>
//             </div>
//             <div className="flex items-center space-x-1 text-sm">
//               <DollarSign className="w-4 h-4 text-gray-500" />
//               <span className="text-gray-500">
//                 {t('currentRate')}: 1$ = {saleConfig.currency_rate?.toLocaleString('fr-FR') || '2,300'} FC
//               </span>
//             </div>
//           </div>
//         </div>
        
//         <div className="flex items-center space-x-2">
//           <button
//             onClick={handleRefresh}
//             className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm"
//           >
//             {t('refresh')}
//           </button>
      
//         </div>
//       </div>

//       {/* Bloc unifié: Recherche et filtres */}
//       <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
//         {/* Barre de recherche et filtres */}
//         <div className="flex flex-col lg:flex-row gap-4">
//           {/* Recherche */}
//           <div className="flex-1">
//             <div className="relative">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
//               <input
//                 type="text"
//                 placeholder={t('searchPlaceholder')}
//                 value={filters.search}
//                 onChange={(e) => setFilters({...filters, search: e.target.value})}
//                 className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-gray-900 focus:border-gray-900 transition text-sm"
//               />
//               {filters.search && (
//                 <button
//                   onClick={() => setFilters({...filters, search: ''})}
//                   className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
//                 >
//                   <X className="w-4 h-4" />
//                 </button>
//               )}
//             </div>
//           </div>

//           {/* Bouton filtres mobile */}
//           <div className="lg:hidden">
//             <button
//               onClick={() => setShowMobileFilters(!showMobileFilters)}
//               className="flex items-center justify-center space-x-2 w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm"
//             >
//               <Filter className="w-4 h-4" />
//               <span>
//                 {t('filters')} {activeFilters > 0 && `(${activeFilters})`}
//               </span>
//               <ChevronDown className={`w-4 h-4 transition-transform ${showMobileFilters ? 'rotate-180' : ''}`} />
//             </button>
//           </div>

//           {/* Filtres desktop */}
//           <div className="hidden lg:flex flex-wrap gap-2">
//             {/* Filtre date */}
//             <select
//               value={filters.dateRange}
//               onChange={(e) => setFilters({...filters, dateRange: e.target.value})}
//               className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-gray-900 focus:border-gray-900 bg-white text-sm"
//             >
//               <option value="all">{t('allDates')}</option>
//               <option value="today">{t('today')}</option>
//               <option value="yesterday">{t('yesterday')}</option>
//               <option value="thisMonth">{t('thisMonth')}</option>
//             </select>

//             {/* Filtre statut */}
//             <select
//               value={filters.status}
//               onChange={(e) => setFilters({...filters, status: e.target.value})}
//               className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-gray-900 focus:border-gray-900 bg-white text-sm"
//             >
//               <option value="all">{t('allStatuses')}</option>
//               <option value="completed">{t('completed')}</option>
//               <option value="cancelled">{t('cancelled')}</option>
//               <option value="refunded">{t('refunded')}</option>
//             </select>

//             {/* Filtre devise */}
//             <select
//               value={filters.currency}
//               onChange={(e) => setFilters({...filters, currency: e.target.value})}
//               className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-gray-900 focus:border-gray-900 bg-white text-sm"
//             >
//               <option value="all">{t('allCurrencies')}</option>
//               <option value="CDF">{t('cdfOnly')}</option>
//               <option value="USD">{t('usdOnly')}</option>
//             </select>
            
//             {/* Bouton réinitialiser */}
//             {activeFilters > 0 && (
//               <button
//                 onClick={handleResetFilters}
//                 className="px-3 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm"
//               >
//                 {t('reset')}
//               </button>
//             )}
//           </div>
//         </div>

//         {/* Stats avec séparation CDF/USD */}
//         <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-gray-200">
//           {/* Total ventes */}
//           <div className="text-center p-2">
//             <div className="text-lg font-bold text-gray-900">{stats.totalVentes}</div>
//             <div className="text-xs text-gray-500">{t('totalSales')}</div>
//             <div className="flex justify-center space-x-2 mt-1">
//               <span className="text-xs text-green-600">{stats.ventesCDF} FC</span>
//               <span className="text-xs text-blue-600">{stats.ventesUSD} $</span>
//             </div>
//           </div>
          
//           {/* Total montant CDF */}
//           <div className="text-center p-2">
//             <div className="text-lg font-bold text-green-600">{formatCurrency(stats.totalMontantCDF)}</div>
//             <div className="text-xs text-gray-500">{t('totalInFrancs')}</div>
//             <div className="text-xs text-gray-400 mt-1">
//               {stats.ventesCDF} {t('sale')}{stats.ventesCDF !== 1 ? 's' : ''}
//             </div>
//           </div>
          
//           {/* Total montant USD */}
//           <div className="text-center p-2">
//             <div className="text-lg font-bold text-blue-600">$ {stats.totalMontantUSD?.toFixed(2) || '0.00'}</div>
//             <div className="text-xs text-gray-500">{t('totalInDollars')}</div>
//             <div className="text-xs text-gray-400 mt-1">
//               {stats.ventesUSD} {t('sale')}{stats.ventesUSD !== 1 ? 's' : ''}
//             </div>
//           </div>
          
//           {/* CA aujourd'hui */}
//           <div className="text-center p-2">
//             <div className="text-lg font-bold text-purple-600">{formatCurrency(stats.montantAujourdhuiCDF)}</div>
//             <div className="text-xs text-gray-500">{t('todayRevenue')}</div>
//             <div className="text-xs text-gray-400 mt-1">
//               $ {stats.montantAujourdhuiUSD?.toFixed(2) || '0.00'}
//             </div>
//           </div>
//         </div>

//         {/* Filtres mobile */}
//         {showMobileFilters && (
//           <div className="lg:hidden mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
//             <div className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   {t('period')}
//                 </label>
//                 <select
//                   value={filters.dateRange}
//                   onChange={(e) => setFilters({...filters, dateRange: e.target.value})}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-gray-900 focus:border-gray-900 bg-white text-sm"
//                 >
//                   <option value="all">{t('allDates')}</option>
//                   <option value="today">{t('today')}</option>
//                   <option value="yesterday">{t('yesterday')}</option>
//                   <option value="thisMonth">{t('thisMonth')}</option>
//                 </select>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   {t('status')}
//                 </label>
//                 <select
//                   value={filters.status}
//                   onChange={(e) => setFilters({...filters, status: e.target.value})}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-gray-900 focus:border-gray-900 bg-white text-sm"
//                 >
//                   <option value="all">{t('allStatuses')}</option>
//                   <option value="completed">{t('completed')}</option>
//                   <option value="cancelled">{t('cancelled')}</option>
//                   <option value="refunded">{t('refunded')}</option>
//                 </select>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   {t('currency')}
//                 </label>
//                 <select
//                   value={filters.currency}
//                   onChange={(e) => setFilters({...filters, currency: e.target.value})}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-gray-900 focus:border-gray-900 bg-white text-sm"
//                 >
//                   <option value="all">{t('allCurrencies')}</option>
//                   <option value="CDF">{t('cdfOnly')}</option>
//                   <option value="USD">{t('usdOnly')}</option>
//                 </select>
//               </div>
              
//               <div className="pt-2 border-t border-gray-200">
//                 <div className="flex space-x-2">
//                   <button
//                     onClick={handleResetFilters}
//                     className="flex-1 px-3 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm"
//                   >
//                     {t('reset')}
//                   </button>
//                   <button
//                     onClick={() => setShowMobileFilters(false)}
//                     className="flex-1 px-3 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition text-sm"
//                   >
//                     {t('apply')}
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Tableau des ventes */}
//       {loading ? (
//         <div className="bg-white rounded-lg border border-gray-200 p-8">
//           <div className="flex flex-col items-center justify-center space-y-4">
//             <Loader2 className="w-8 h-8 animate-spin text-gray-600" />
//             <div className="text-gray-500">{t('loadingSales')}</div>
//           </div>
//         </div>
//       ) : ventes.length > 0 ? (
//         <div className="overflow-x-auto bg-white rounded-lg border border-gray-200">
//           {/* Vue desktop */}
//           <div className="hidden md:block">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     {t('invoice')}
//                   </th>
//                   <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     {t('client')}
//                   </th>
//                   <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     {t('date')}
//                   </th>
//                   <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     {t('amount')}
//                   </th>
//                   <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     {t('rate')}
//                   </th>
//                   <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     {t('currency')}
//                   </th>
//                   <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     {t('payment')}
//                   </th>
//                   <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     {t('status')}
//                   </th>
//                   <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     {t('actions')}
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-gray-200">
//                 {ventes.map((vente) => {
//                   const statusConfig = getStatusConfig(vente.status)
//                   const Icon = statusConfig.icon
                  
//                   let montantConverti = null
//                   let deviseConvertie = ''
                  
//                   if (vente.currency === 'USD' && vente.currency_rate) {
//                     montantConverti = vente.total * vente.currency_rate
//                     deviseConvertie = 'CDF'
//                   } else if (vente.currency === 'CDF' && vente.currency_rate) {
//                     montantConverti = vente.total / vente.currency_rate
//                     deviseConvertie = 'USD'
//                   }
                  
//                   return (
//                     <tr key={vente.id} className="hover:bg-gray-50 transition">
//                       {/* Facture */}
//                       <td className="px-4 py-3">
//                         <div className="font-mono font-semibold text-sm text-gray-900">
//                           {vente.sale_number}
//                         </div>
//                       </td>

//                       {/* Client */}
//                       <td className="px-4 py-3">
//                         <div className="flex items-center space-x-2">
//                           <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
//                             <User className="h-4 w-4 text-gray-600" />
//                           </div>
//                           <div>
//                             <div className="font-medium text-sm text-gray-900">
//                               {vente.client?.name || t('unspecifiedClient')}
//                             </div>
//                             <div className="text-xs text-gray-500">
//                               {vente.client?.phone || t('noPhone')}
//                             </div>
//                           </div>
//                         </div>
//                       </td>

//                       {/* Date */}
//                       <td className="px-4 py-3 whitespace-nowrap">
//                         <div className="text-sm text-gray-900">
//                           {new Date(vente.created_at).toLocaleDateString('fr-FR', {
//                             day: '2-digit',
//                             month: '2-digit',
//                             year: 'numeric'
//                           })}
//                         </div>
//                         <div className="text-xs text-gray-500">
//                           {new Date(vente.created_at).toLocaleTimeString('fr-FR', {
//                             hour: '2-digit',
//                             minute: '2-digit'
//                           })}
//                         </div>
//                       </td>

//                       {/* Montant */}
//                       <td className="px-4 py-3 whitespace-nowrap">
//                         <div className="font-semibold text-gray-900">
//                           {formatCurrency(vente.total, vente.currency)}
//                         </div>
//                         {montantConverti && (
//                           <div className="text-xs text-gray-500">
//                             ≈ {formatCurrency(montantConverti, deviseConvertie)}
//                           </div>
//                         )}
//                       </td>

//                       {/* Taux */}
//                       <td className="px-4 py-3 whitespace-nowrap">
//                         {vente.currency_rate && vente.currency === 'USD' && (
//                           <div className="text-sm">
//                             <div className="text-gray-700">
//                               1$ = {vente.currency_rate.toLocaleString('fr-FR')} FC
//                             </div>
//                           </div>
//                         )}
//                       </td>

//                       {/* Devise */}
//                       <td className="px-4 py-3 whitespace-nowrap">
//                         {getCurrencyBadge(vente.currency)}
//                       </td>

//                       {/* Paiement */}
//                       <td className="px-4 py-3 whitespace-nowrap">
//                         <div className="flex items-center space-x-2">
//                           <span className="text-lg">{getPaymentMethodIcon(vente.payment_method)}</span>
//                           <span className="text-sm capitalize">
//                             {getPaymentMethodLabel(vente.payment_method)}
//                           </span>
//                         </div>
//                       </td>

//                       {/* Statut */}
//                       <td className="px-4 py-3 whitespace-nowrap">
//                         <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig.color}`}>
//                           <Icon className="w-3 h-3 mr-1" />
//                           {statusConfig.label}
//                         </div>
//                       </td>

//                       {/* Actions */}
//                       <td className="px-4 py-3 whitespace-nowrap">
//                         <div className="flex items-center space-x-1">
//                           <button
//                             onClick={() => router.push(`/super-admin/sale/${vente.sale_number}`)}
//                             className="p-1.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition"
//                             title={t('viewDetails')}
//                           >
//                             <Eye className="w-4 h-4" />
//                           </button>
//                           <button
//                             onClick={() => handlePrintReceipt(vente.id)}
//                             className="p-1.5 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded transition"
//                             title={t('print')}
//                           >
//                             <Printer className="w-4 h-4" />
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   )
//                 })}
//               </tbody>
//             </table>
//           </div>

//           {/* Vue mobile */}
//           <div className="md:hidden divide-y divide-gray-200">
//             {ventes.map((vente) => {
//               const statusConfig = getStatusConfig(vente.status)
//               const Icon = statusConfig.icon
              
//               let montantConverti = null
//               let deviseConvertie = ''
              
//               if (vente.currency === 'USD' && vente.currency_rate) {
//                 montantConverti = vente.total * vente.currency_rate
//                 deviseConvertie = 'CDF'
//               } else if (vente.currency === 'CDF' && vente.currency_rate) {
//                 montantConverti = vente.total / vente.currency_rate
//                 deviseConvertie = 'USD'
//               }
              
//               return (
//                 <div key={vente.id} className="p-4 hover:bg-gray-50 transition">
//                   <div className="flex items-start justify-between mb-2">
//                     <div className="flex-1">
//                       <div className="flex items-center justify-between mb-1">
//                         <div className="font-mono font-semibold text-gray-900">
//                           {vente.sale_number}
//                         </div>
//                         <div className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${statusConfig.color}`}>
//                           <Icon className="w-3 h-3 mr-1" />
//                           {statusConfig.label}
//                         </div>
//                       </div>
//                       <div className="flex items-center space-x-2 text-sm text-gray-600">
//                         <User className="h-3 w-3" />
//                         <span>{vente.client?.name || t('unspecifiedClient')}</span>
//                         <div className="ml-auto">
//                           {getCurrencyBadge(vente.currency)}
//                         </div>
//                       </div>
//                     </div>
//                   </div>
                  
//                   <div className="grid grid-cols-2 gap-4 mt-3">
//                     <div>
//                       <div className="text-xs text-gray-500">{t('date')}</div>
//                       <div className="text-sm font-medium">
//                         {new Date(vente.created_at).toLocaleDateString('fr-FR')}
//                       </div>
//                     </div>
//                     <div>
//                       <div className="text-xs text-gray-500">{t('amount')}</div>
//                       <div className="text-sm font-semibold text-gray-900">
//                         {formatCurrency(vente.total, vente.currency)}
//                       </div>
//                       {montantConverti && (
//                         <div className="text-xs text-gray-500">
//                           ≈ {formatCurrency(montantConverti, deviseConvertie)}
//                         </div>
//                       )}
//                     </div>
//                   </div>
                  
//                   {/* Taux pour les ventes en USD */}
//                   {vente.currency_rate && vente.currency === 'USD' && (
//                     <div className="mt-2 pt-2 border-t border-gray-200">
//                       <div className="text-xs text-gray-500">{t('appliedRate')}:</div>
//                       <div className="text-sm font-medium">
//                         1$ = {vente.currency_rate.toLocaleString('fr-FR')} FC
//                       </div>
//                     </div>
//                   )}
                  
//                   <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-200">
//                     <div className="flex items-center space-x-2">
//                       <span className="text-lg">{getPaymentMethodIcon(vente.payment_method)}</span>
//                       <span className="text-sm capitalize">
//                         {getPaymentMethodLabel(vente.payment_method)}
//                       </span>
//                     </div>
//                     <div className="flex items-center space-x-1">
//                       <button
//                         onClick={() => router.push(`/ventes/${vente.id}`)}
//                         className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
//                         title={t('viewDetails')}
//                       >
//                         <Eye className="w-4 h-4" />
//                       </button>
//                       <button
//                         onClick={() => handlePrintReceipt(vente.id)}
//                         className="p-1.5 text-green-600 hover:bg-green-50 rounded"
//                         title={t('print')}
//                       >
//                         <Printer className="w-4 h-4" />
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               )
//             })}
//           </div>
//         </div>
//       ) : (
//         <div className="bg-white rounded-lg border border-gray-200 p-8">
//           <div className="text-center">
//             <ShoppingBag className="w-12 h-12 text-gray-400 mx-auto mb-3" />
//             <h3 className="text-lg font-medium text-gray-900 mb-1">
//               {t('noSalesFound')}
//             </h3>
//             <p className="text-gray-500 text-sm mb-4">
//               {activeFilters > 0
//                 ? t('noSalesMatchFilters')
//                 : t('startWithFirstSale')
//               }
//             </p>
//             <button
//               onClick={() => router.push('/super-admin/sales/new')}
//               className="inline-flex items-center px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition text-sm"
//             >
//               <Plus className="w-4 h-4 mr-2" />
//               {t('newSale')}
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { useLanguage } from '@/contexts/LanguageContext'
import { 
  ShoppingBag, 
  Search, 
  Filter, 
  Plus,
  Eye,
  Printer,
  User,
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock,
  Loader2,
  X,
  ChevronDown,
  DollarSign,
  Store
} from 'lucide-react'

export default function VentesPage() {
  const router = useRouter()
  const { t } = useLanguage()
  
  const [ventes, setVentes] = useState([])
  const [loading, setLoading] = useState(true)
  const [saleConfig, setSaleConfig] = useState({
    vat_amount: 20.00,
    currency_rate: 2300.00,
    base_currency: 'USD'
  })
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    dateRange: 'all',
    currency: 'all',
    userId: 'all'
  })
  const [showMobileFilters, setShowMobileFilters] = useState(false)
  const [users, setUsers] = useState([])
  const [loadingUsers, setLoadingUsers] = useState(false)
  const [vendorsMap, setVendorsMap] = useState({})
  const [stats, setStats] = useState({
    totalVentes: 0,
    totalMontantCDF: 0,
    totalMontantUSD: 0,
    ventesAujourdhui: 0,
    montantAujourdhuiCDF: 0,
    montantAujourdhuiUSD: 0,
    ventesCDF: 0,
    ventesUSD: 0
  })

  useEffect(() => {
    loadSaleConfig()
    loadUsers()
  }, [])

  useEffect(() => {
    if (users.length > 0) {
      loadVentes()
      loadStats()
    }
  }, [filters, users])

  const loadUsers = async () => {
    setLoadingUsers(true)
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id, full_name, shop_name, profile_image, phone, email, role')
        .eq('role', 'vendor')
        .eq('is_active', true)
        .order('full_name', { ascending: true })
      
      if (data) {
        setUsers(data)
        // Créer un map pour accéder rapidement aux vendeurs par ID
        const map = {}
        data.forEach(user => {
          map[user.id] = user
        })
        setVendorsMap(map)
      }
    } catch (error) {
      console.error('Erreur chargement vendeurs:', error)
    } finally {
      setLoadingUsers(false)
    }
  }

  const getProfileImageUrl = (profileImagePath) => {
    if (!profileImagePath) return null;
    const { data } = supabase.storage
      .from('avatars')
      .getPublicUrl(profileImagePath);
    return data.publicUrl;
  }

  const loadSaleConfig = async () => {
    try {
      const { data, error } = await supabase
        .from('sale_config')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .single()
      
      if (data) {
        setSaleConfig(data)
      }
    } catch (error) {
      console.error('Erreur chargement config:', error)
    }
  }

  const loadVentes = async () => {
    setLoading(true)
    
    try {
      let query = supabase
        .from('sale')
        .select('*')
        .order('created_at', { ascending: false })

      // Appliquer les filtres
      if (filters.dateRange === 'today') {
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        query = query.gte('created_at', today.toISOString())
      } else if (filters.dateRange === 'yesterday') {
        const yesterday = new Date()
        yesterday.setDate(yesterday.getDate() - 1)
        yesterday.setHours(0, 0, 0, 0)
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        query = query.gte('created_at', yesterday.toISOString())
          .lt('created_at', today.toISOString())
      } else if (filters.dateRange === 'thisMonth') {
        const firstDay = new Date()
        firstDay.setDate(1)
        firstDay.setHours(0, 0, 0, 0)
        query = query.gte('created_at', firstDay.toISOString())
      }

      if (filters.status !== 'all') {
        query = query.eq('status', filters.status)
      }

      if (filters.currency !== 'all') {
        query = query.eq('currency', filters.currency)
      }

      if (filters.userId !== 'all') {
        query = query.eq('user_id', filters.userId)
      }

      if (filters.search) {
        // Recherche dans le numéro de vente uniquement
        query = query.ilike('sale_number', `%${filters.search}%`)
      }

      const { data, error } = await query

      if (error) {
        console.error('Erreur Supabase:', error)
        setVentes([])
      } else if (data) {
        setVentes(data)
      }
      
    } catch (error) {
      console.error('Erreur chargement ventes:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadStats = async () => {
    try {
      let query = supabase
        .from('sale')
        .select('*')

      if (filters.dateRange === 'today') {
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        query = query.gte('created_at', today.toISOString())
      } else if (filters.dateRange === 'yesterday') {
        const yesterday = new Date()
        yesterday.setDate(yesterday.getDate() - 1)
        yesterday.setHours(0, 0, 0, 0)
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        query = query.gte('created_at', yesterday.toISOString())
          .lt('created_at', today.toISOString())
      } else if (filters.dateRange === 'thisMonth') {
        const firstDay = new Date()
        firstDay.setDate(1)
        firstDay.setHours(0, 0, 0, 0)
        query = query.gte('created_at', firstDay.toISOString())
      }

      if (filters.currency !== 'all') {
        query = query.eq('currency', filters.currency)
      }

      if (filters.userId !== 'all') {
        query = query.eq('user_id', filters.userId)
      }

      const { data: allSales } = await query

      let totalVentes = 0
      let totalMontantCDF = 0
      let totalMontantUSD = 0
      let ventesCDF = 0
      let ventesUSD = 0
      let ventesAujourdhui = 0
      let montantAujourdhuiCDF = 0
      let montantAujourdhuiUSD = 0

      if (allSales) {
        totalVentes = allSales.length
        
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        
        allSales.forEach(sale => {
          const montant = sale.total || 0
          const tauxVente = sale.currency_rate || saleConfig.currency_rate || 1
          const isToday = new Date(sale.created_at) >= today
          
          if (sale.currency === 'USD') {
            ventesUSD += 1
            totalMontantUSD += montant
            
            const montantCDF = montant * tauxVente
            totalMontantCDF += montantCDF
            
            if (isToday) {
              ventesAujourdhui += 1
              montantAujourdhuiUSD += montant
              montantAujourdhuiCDF += montantCDF
            }
          } else {
            ventesCDF += 1
            totalMontantCDF += montant
            
            if (isToday) {
              ventesAujourdhui += 1
              montantAujourdhuiCDF += montant
            }
          }
        })
      }

      setStats({
        totalVentes,
        totalMontantCDF: Math.round(totalMontantCDF),
        totalMontantUSD: Math.round(totalMontantUSD * 100) / 100,
        ventesAujourdhui,
        montantAujourdhuiCDF: Math.round(montantAujourdhuiCDF),
        montantAujourdhuiUSD: Math.round(montantAujourdhuiUSD * 100) / 100,
        ventesCDF,
        ventesUSD
      })

    } catch (error) {
      console.error('Erreur chargement stats:', error)
    }
  }

  const formatCurrency = (amount, currency = 'CDF') => {
    const formatted = new Intl.NumberFormat('fr-FR', {
      minimumFractionDigits: currency === 'CDF' ? 0 : 2,
      maximumFractionDigits: currency === 'CDF' ? 0 : 2
    }).format(amount || 0)
    
    return `${getCurrencySymbol(currency)} ${formatted}`
  }

  const getCurrencySymbol = (currency) => {
    return currency === 'USD' ? '$' : 'FC'
  }

  const getStatusConfig = (status) => {
    const configs = {
      completed: { 
        color: 'bg-green-100 text-green-800', 
        icon: CheckCircle, 
        label: 'Terminée' 
      },
      cancelled: { 
        color: 'bg-red-100 text-red-800', 
        icon: XCircle, 
        label: 'Annulée' 
      },
      refunded: { 
        color: 'bg-yellow-100 text-yellow-800', 
        icon: AlertCircle, 
        label: 'Remboursée' 
      }
    }
    return configs[status] || { 
      color: 'bg-gray-100 text-gray-800', 
      icon: Clock, 
      label: 'En attente' 
    }
  }

  const getPaymentMethodIcon = (method) => {
    const icons = {
      cash: '💰',
      card: '💳',
      mobile: '📱'
    }
    return icons[method] || '💸'
  }

  const getPaymentMethodLabel = (method) => {
    const labels = {
      cash: 'Espèces',
      card: 'Carte',
      mobile: 'Mobile'
    }
    return labels[method] || method
  }

  const getCurrencyBadge = (currency) => {
    return currency === 'USD' 
      ? <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
          <DollarSign className="w-3 h-3 mr-1" />
          USD
        </span>
      : <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">
          FC
        </span>
  }

  const handleResetFilters = () => {
    setFilters({
      search: '',
      status: 'all',
      dateRange: 'all',
      currency: 'all',
      userId: 'all'
    })
  }

  const activeFilters = Object.values(filters).filter(v => 
    v !== '' && v !== false && v !== 'all'
  ).length

  const handlePrintReceipt = (saleId) => {
    console.log('Imprimer reçu pour:', saleId)
  }

  const handleRefresh = () => {
    loadVentes()
    loadStats()
  }

  // Fonction pour récupérer les infos du vendeur
  const getVendorInfo = (sale) => {
    if (!sale.user_id) return null;
    
    const vendor = vendorsMap[sale.user_id];
    if (!vendor) return null;
    
    return {
      name: vendor.full_name || vendor.email || 'Vendeur inconnu',
      shopName: vendor.shop_name || 'Pas de magasin',
      profileImage: vendor.profile_image ? getProfileImageUrl(vendor.profile_image) : null,
      phone: vendor.phone || null
    };
  };

  return (
    <div className="p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center">
            <ShoppingBag className="w-6 h-6 sm:w-7 sm:h-7 mr-3 text-gray-700" />
            Ventes
          </h1>
          <div className="flex flex-wrap gap-3 mt-2">
            <div className="flex items-center space-x-1 text-sm">
              <span className="text-gray-500">Total:</span>
              <span className="font-medium">{stats.totalVentes}</span>
            </div>
            <div className="flex items-center space-x-1 text-sm">
              <span className="text-blue-600">Aujourd'hui:</span>
              <span className="font-medium">{stats.ventesAujourdhui}</span>
            </div>
            <div className="flex items-center space-x-1 text-sm">
              <span className="text-green-600">Recette:</span>
              <span className="font-medium">{formatCurrency(stats.montantAujourdhuiCDF)}</span>
            </div>
            <div className="flex items-center space-x-1 text-sm">
              <DollarSign className="w-4 h-4 text-gray-500" />
              <span className="text-gray-500">
                Taux: 1$ = {saleConfig.currency_rate?.toLocaleString('fr-FR') || '2,300'} FC
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={handleRefresh}
            className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm"
          >
            Actualiser
          </button>
          <button
            onClick={() => router.push('/super-admin/sales/new')}
            className="px-3 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition text-sm flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nouvelle vente
          </button>
        </div>
      </div>

      {/* Bloc unifié: Recherche et filtres */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
        {/* Barre de recherche et filtres */}
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Recherche */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Rechercher par numéro de vente..."
                value={filters.search}
                onChange={(e) => setFilters({...filters, search: e.target.value})}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-gray-900 focus:border-gray-900 transition text-sm"
              />
              {filters.search && (
                <button
                  onClick={() => setFilters({...filters, search: ''})}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Bouton filtres mobile */}
          <div className="lg:hidden">
            <button
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="flex items-center justify-center space-x-2 w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm"
            >
              <Filter className="w-4 h-4" />
              <span>
                Filtres {activeFilters > 0 && `(${activeFilters})`}
              </span>
              <ChevronDown className={`w-4 h-4 transition-transform ${showMobileFilters ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {/* Filtres desktop */}
          <div className="hidden lg:flex flex-wrap gap-2">
            {/* Filtre vendeur */}
            <select
              value={filters.userId}
              onChange={(e) => setFilters({...filters, userId: e.target.value})}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-gray-900 focus:border-gray-900 bg-white text-sm min-w-[150px]"
            >
              <option value="all">Tous les vendeurs</option>
              {users.map(user => (
                <option key={user.id} value={user.id}>
                  {user.full_name || user.email}
                </option>
              ))}
            </select>

            {/* Filtre date */}
            <select
              value={filters.dateRange}
              onChange={(e) => setFilters({...filters, dateRange: e.target.value})}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-gray-900 focus:border-gray-900 bg-white text-sm"
            >
              <option value="all">Toutes dates</option>
              <option value="today">Aujourd'hui</option>
              <option value="yesterday">Hier</option>
              <option value="thisMonth">Ce mois</option>
            </select>

            {/* Filtre statut */}
            <select
              value={filters.status}
              onChange={(e) => setFilters({...filters, status: e.target.value})}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-gray-900 focus:border-gray-900 bg-white text-sm"
            >
              <option value="all">Tous statuts</option>
              <option value="completed">Terminée</option>
              <option value="cancelled">Annulée</option>
              <option value="refunded">Remboursée</option>
            </select>

            {/* Filtre devise */}
            <select
              value={filters.currency}
              onChange={(e) => setFilters({...filters, currency: e.target.value})}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-gray-900 focus:border-gray-900 bg-white text-sm"
            >
              <option value="all">Toutes devises</option>
              <option value="CDF">FC seulement</option>
              <option value="USD">USD seulement</option>
            </select>
            
            {/* Bouton réinitialiser */}
            {activeFilters > 0 && (
              <button
                onClick={handleResetFilters}
                className="px-3 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm"
              >
                Réinitialiser
              </button>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-gray-200">
          <div className="text-center p-2">
            <div className="text-lg font-bold text-gray-900">{stats.totalVentes}</div>
            <div className="text-xs text-gray-500">Total ventes</div>
            <div className="flex justify-center space-x-2 mt-1">
              <span className="text-xs text-green-600">{stats.ventesCDF} FC</span>
              <span className="text-xs text-blue-600">{stats.ventesUSD} $</span>
            </div>
          </div>
          
          <div className="text-center p-2">
            <div className="text-lg font-bold text-green-600">{formatCurrency(stats.totalMontantCDF)}</div>
            <div className="text-xs text-gray-500">Total en francs</div>
            <div className="text-xs text-gray-400 mt-1">
              {stats.ventesCDF} vente{stats.ventesCDF !== 1 ? 's' : ''}
            </div>
          </div>
          
          <div className="text-center p-2">
            <div className="text-lg font-bold text-blue-600">$ {stats.totalMontantUSD?.toFixed(2) || '0.00'}</div>
            <div className="text-xs text-gray-500">Total en dollars</div>
            <div className="text-xs text-gray-400 mt-1">
              {stats.ventesUSD} vente{stats.ventesUSD !== 1 ? 's' : ''}
            </div>
          </div>
          
          <div className="text-center p-2">
            <div className="text-lg font-bold text-purple-600">{formatCurrency(stats.montantAujourdhuiCDF)}</div>
            <div className="text-xs text-gray-500">Recette aujourd'hui</div>
            <div className="text-xs text-gray-400 mt-1">
              $ {stats.montantAujourdhuiUSD?.toFixed(2) || '0.00'}
            </div>
          </div>
        </div>

        {/* Filtres mobile */}
        {showMobileFilters && (
          <div className="lg:hidden mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="space-y-4">
              {/* Filtre vendeur mobile */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vendeur
                </label>
                <select
                  value={filters.userId}
                  onChange={(e) => setFilters({...filters, userId: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-gray-900 focus:border-gray-900 bg-white text-sm"
                >
                  <option value="all">Tous les vendeurs</option>
                  {users.map(user => (
                    <option key={user.id} value={user.id}>
                      {user.full_name || user.email}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Période
                </label>
                <select
                  value={filters.dateRange}
                  onChange={(e) => setFilters({...filters, dateRange: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-gray-900 focus:border-gray-900 bg-white text-sm"
                >
                  <option value="all">Toutes dates</option>
                  <option value="today">Aujourd'hui</option>
                  <option value="yesterday">Hier</option>
                  <option value="thisMonth">Ce mois</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Statut
                </label>
                <select
                  value={filters.status}
                  onChange={(e) => setFilters({...filters, status: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-gray-900 focus:border-gray-900 bg-white text-sm"
                >
                  <option value="all">Tous statuts</option>
                  <option value="completed">Terminée</option>
                  <option value="cancelled">Annulée</option>
                  <option value="refunded">Remboursée</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Devise
                </label>
                <select
                  value={filters.currency}
                  onChange={(e) => setFilters({...filters, currency: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-gray-900 focus:border-gray-900 bg-white text-sm"
                >
                  <option value="all">Toutes devises</option>
                  <option value="CDF">FC seulement</option>
                  <option value="USD">USD seulement</option>
                </select>
              </div>
              
              <div className="pt-2 border-t border-gray-200">
                <div className="flex space-x-2">
                  <button
                    onClick={handleResetFilters}
                    className="flex-1 px-3 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm"
                  >
                    Réinitialiser
                  </button>
                  <button
                    onClick={() => setShowMobileFilters(false)}
                    className="flex-1 px-3 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition text-sm"
                  >
                    Appliquer
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Tableau des ventes */}
      {loading ? (
        <div className="bg-white rounded-lg border border-gray-200 p-8">
          <div className="flex flex-col items-center justify-center space-y-4">
            <Loader2 className="w-8 h-8 animate-spin text-gray-600" />
            <div className="text-gray-500">Chargement des ventes...</div>
          </div>
        </div>
      ) : ventes.length > 0 ? (
        <div className="overflow-x-auto bg-white rounded-lg border border-gray-200">
          {/* Vue desktop */}
          <div className="hidden md:block">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Facture
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vendeur
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Montant
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Taux
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Devise
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Paiement
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {ventes.map((vente) => {
                  const statusConfig = getStatusConfig(vente.status)
                  const Icon = statusConfig.icon
                  const vendorInfo = getVendorInfo(vente)
                  
                  let montantConverti = null
                  let deviseConvertie = ''
                  
                  if (vente.currency === 'USD' && vente.currency_rate) {
                    montantConverti = vente.total * vente.currency_rate
                    deviseConvertie = 'CDF'
                  } else if (vente.currency === 'CDF' && vente.currency_rate) {
                    montantConverti = vente.total / vente.currency_rate
                    deviseConvertie = 'USD'
                  }
                  
                  return (
                    <tr key={vente.id} className="hover:bg-gray-50 transition">
                      {/* Facture */}
                      <td className="px-4 py-3">
                        <div className="font-mono font-semibold text-sm text-gray-900">
                          {vente.sale_number}
                        </div>
                      </td>

                      {/* Vendeur */}
                      <td className="px-4 py-3">
                        <div className="flex items-center space-x-2">
                          <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                            {vendorInfo?.profileImage ? (
                              <img
                                src={vendorInfo.profileImage}
                                alt={vendorInfo.name}
                                className="h-full w-full object-cover"
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                  e.target.parentElement.innerHTML = '<Store className="h-4 w-4 text-gray-600" />';
                                }}
                              />
                            ) : (
                              <Store className="h-4 w-4 text-gray-600" />
                            )}
                          </div>
                          <div>
                            <div className="font-medium text-sm text-gray-900">
                              {vendorInfo?.name || 'Vendeur inconnu'}
                            </div>
                            <div className="text-xs text-gray-500">
                              {vendorInfo?.shopName || 'Pas de magasin'}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Date */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {new Date(vente.created_at).toLocaleDateString('fr-FR', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric'
                          })}
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(vente.created_at).toLocaleTimeString('fr-FR', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                      </td>

                      {/* Montant */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="font-semibold text-gray-900">
                          {formatCurrency(vente.total, vente.currency)}
                        </div>
                        {montantConverti && (
                          <div className="text-xs text-gray-500">
                            ≈ {formatCurrency(montantConverti, deviseConvertie)}
                          </div>
                        )}
                      </td>

                      {/* Taux */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        {vente.currency_rate && vente.currency === 'USD' && (
                          <div className="text-sm">
                            <div className="text-gray-700">
                              1$ = {vente.currency_rate.toLocaleString('fr-FR')} FC
                            </div>
                          </div>
                        )}
                      </td>

                      {/* Devise */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        {getCurrencyBadge(vente.currency)}
                      </td>

                      {/* Paiement */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">{getPaymentMethodIcon(vente.payment_method)}</span>
                          <span className="text-sm capitalize">
                            {getPaymentMethodLabel(vente.payment_method)}
                          </span>
                        </div>
                      </td>

                      {/* Statut */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig.color}`}>
                          <Icon className="w-3 h-3 mr-1" />
                          {statusConfig.label}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center space-x-1">
                          <button
                            onClick={() => router.push(`/super-admin/sale/${vente.sale_number}`)}
                            className="p-1.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition"
                            title="Voir détails"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handlePrintReceipt(vente.id)}
                            className="p-1.5 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded transition"
                            title="Imprimer"
                          >
                            <Printer className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Vue mobile */}
          <div className="md:hidden divide-y divide-gray-200">
            {ventes.map((vente) => {
              const statusConfig = getStatusConfig(vente.status)
              const Icon = statusConfig.icon
              const vendorInfo = getVendorInfo(vente)
              
              let montantConverti = null
              let deviseConvertie = ''
              
              if (vente.currency === 'USD' && vente.currency_rate) {
                montantConverti = vente.total * vente.currency_rate
                deviseConvertie = 'CDF'
              } else if (vente.currency === 'CDF' && vente.currency_rate) {
                montantConverti = vente.total / vente.currency_rate
                deviseConvertie = 'USD'
              }
              
              return (
                <div key={vente.id} className="p-4 hover:bg-gray-50 transition">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <div className="font-mono font-semibold text-gray-900">
                          {vente.sale_number}
                        </div>
                        <div className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${statusConfig.color}`}>
                          <Icon className="w-3 h-3 mr-1" />
                          {statusConfig.label}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        {/* Vendeur en mobile */}
                        <div className="flex items-center space-x-1">
                          {vendorInfo?.profileImage ? (
                            <img
                              src={vendorInfo.profileImage}
                              alt={vendorInfo.name}
                              className="w-4 h-4 rounded-full object-cover"
                              onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.parentElement.innerHTML = '<Store className="h-3 w-3 text-gray-600" />';
                              }}
                            />
                          ) : (
                            <Store className="h-3 w-3 text-gray-600" />
                          )}
                          <span className="truncate max-w-[100px]">
                            {vendorInfo?.name || 'Vendeur inconnu'}
                          </span>
                        </div>
                        <div className="ml-auto">
                          {getCurrencyBadge(vente.currency)}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mt-3">
                    <div>
                      <div className="text-xs text-gray-500">Date</div>
                      <div className="text-sm font-medium">
                        {new Date(vente.created_at).toLocaleDateString('fr-FR')}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Montant</div>
                      <div className="text-sm font-semibold text-gray-900">
                        {formatCurrency(vente.total, vente.currency)}
                      </div>
                      {montantConverti && (
                        <div className="text-xs text-gray-500">
                          ≈ {formatCurrency(montantConverti, deviseConvertie)}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Shop name */}
                  {vendorInfo?.shopName && (
                    <div className="mt-2 pt-2 border-t border-gray-200">
                      <div className="text-xs text-gray-500">Magasin:</div>
                      <div className="text-sm font-medium truncate">
                        {vendorInfo.shopName}
                      </div>
                    </div>
                  )}
                  
                  {/* Taux pour les ventes en USD */}
                  {vente.currency_rate && vente.currency === 'USD' && (
                    <div className="mt-2 pt-2 border-t border-gray-200">
                      <div className="text-xs text-gray-500">Taux appliqué:</div>
                      <div className="text-sm font-medium">
                        1$ = {vente.currency_rate.toLocaleString('fr-FR')} FC
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-200">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{getPaymentMethodIcon(vente.payment_method)}</span>
                      <span className="text-sm capitalize">
                        {getPaymentMethodLabel(vente.payment_method)}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => router.push(`/super-admin/sale/${vente.sale_number}`)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                        title="Voir détails"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handlePrintReceipt(vente.id)}
                        className="p-1.5 text-green-600 hover:bg-green-50 rounded"
                        title="Imprimer"
                      >
                        <Printer className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 p-8">
          <div className="text-center">
            <ShoppingBag className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">
              Aucune vente trouvée
            </h3>
            <p className="text-gray-500 text-sm mb-4">
              {activeFilters > 0
                ? "Aucune vente ne correspond aux filtres"
                : "Commencez par créer votre première vente"
              }
            </p>
            <button
              onClick={() => router.push('/super-admin/sales/new')}
              className="inline-flex items-center px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition text-sm"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nouvelle vente
            </button>
          </div>
        </div>
      )}
    </div>
  )
}