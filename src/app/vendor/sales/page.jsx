// // 'use client'

// // import { useState, useEffect } from 'react'
// // import { useRouter } from 'next/navigation'
// // import { supabase } from '@/lib/supabase'
// // import { checkAuth } from '@/lib/auth'
// // import { useLanguage } from '@/contexts/LanguageContext'
// // import { 
// //   ShoppingBag, 
// //   Eye,
// //   Printer,
// //   User,
// //   CheckCircle,
// //   XCircle,
// //   AlertCircle,
// //   Clock,
// //   Loader2,
// //   DollarSign,
// //   Calendar,
// //   TrendingUp
// // } from 'lucide-react'
// // import NouvelleVentePage from '../../super-admin/sales/new/page'

// // export default function VendorListSale() {
// //   const router = useRouter()
// //   const { t } = useLanguage()
  
// //   const [ventes, setVentes] = useState([])
// //   const [loading, setLoading] = useState(true)
// //   const [saleConfig, setSaleConfig] = useState({
// //     vat_amount: 20.00,
// //     currency_rate: 2300.00,
// //     base_currency: 'USD'
// //   })
// //   const [stats, setStats] = useState({
// //     totalVentes: 0,
// //     totalMontantCDF: 0,
// //     totalMontantUSD: 0,
// //     ventesCDF: 0,
// //     ventesUSD: 0
// //   })
// //   const [currentUser, setCurrentUser] = useState(null)

// //   useEffect(() => {
// //     const user = checkAuth()
// //     if (!user) {
// //       router.push('/auth/login')
// //       return
// //     }
// //     setCurrentUser(user)
// //   }, [])

// //   useEffect(() => {
// //     if (currentUser) {
// //       loadSaleConfig()
// //       loadVentes()
// //     }
// //   }, [currentUser])

// //   const loadSaleConfig = async () => {
// //     try {
// //       const { data, error } = await supabase
// //         .from('sale_config')
// //         .select('*')
// //         .order('created_at', { ascending: false })
// //         .limit(1)
// //         .single()
      
// //       if (data) {
// //         setSaleConfig(data)
// //       }
// //     } catch (error) {
// //       console.error(t('configLoadError'), error)
// //     }
// //   }

// //   const loadVentes = async () => {
// //     if (!currentUser) return
    
// //     setLoading(true)
    
// //     try {
// //       // Date d'aujourd'hui
// //       const today = new Date()
// //       today.setHours(0, 0, 0, 0)
// //       const tomorrow = new Date(today)
// //       tomorrow.setDate(tomorrow.getDate() + 1)

// //       let query = supabase
// //         .from('sale')
// //         .select(`
// //           *,
// //           client:client(name, phone)
// //         `)
// //         .eq('user_id', currentUser.id) // Filtrer par vendeur connecté
// //         .gte('date_time', today.toISOString())
// //         .lt('date_time', tomorrow.toISOString())
// //         .order('date_time', { ascending: false })

// //       const { data, error } = await query

// //       if (error) {
// //         console.error(t('supabaseError'), error)
// //         setVentes([])
// //       } else if (data) {
// //         setVentes(data)
// //         calculateStats(data)
// //       }
      
// //     } catch (error) {
// //       console.error(t('loadError'), error)
// //     } finally {
// //       setLoading(false)
// //     }
// //   }

// //   const calculateStats = (sales) => {
// //     let totalVentes = 0
// //     let totalMontantCDF = 0
// //     let totalMontantUSD = 0
// //     let ventesCDF = 0
// //     let ventesUSD = 0

// //     if (sales) {
// //       totalVentes = sales.length
      
// //       sales.forEach(sale => {
// //         const montant = sale.total || 0
        
// //         if (sale.currency === 'USD') {
// //           ventesUSD += 1
// //           totalMontantUSD += montant
          
// //           // Convertir USD vers CDF
// //           const tauxVente = sale.currency_rate || saleConfig.currency_rate || 1
// //           const montantCDF = montant * tauxVente
// //           totalMontantCDF += montantCDF
// //         } else {
// //           ventesCDF += 1
// //           totalMontantCDF += montant
// //         }
// //       })
// //     }

// //     setStats({
// //       totalVentes,
// //       totalMontantCDF: Math.round(totalMontantCDF),
// //       totalMontantUSD: Math.round(totalMontantUSD * 100) / 100,
// //       ventesCDF,
// //       ventesUSD
// //     })
// //   }

// //   const formatCurrency = (amount, currency = 'CDF') => {
// //     const formatted = new Intl.NumberFormat('fr-FR', {
// //       minimumFractionDigits: currency === 'CDF' ? 0 : 2,
// //       maximumFractionDigits: currency === 'CDF' ? 0 : 2
// //     }).format(amount || 0)
    
// //     return `${getCurrencySymbol(currency)} ${formatted}`
// //   }

// //   const getCurrencySymbol = (currency) => {
// //     return currency === 'USD' ? '$' : 'FC'
// //   }

// //   const getStatusConfig = (status) => {
// //     const configs = {
// //       completed: { 
// //         color: 'bg-green-100 text-green-800', 
// //         icon: CheckCircle, 
// //         label: t('completed') 
// //       },
// //       cancelled: { 
// //         color: 'bg-red-100 text-red-800', 
// //         icon: XCircle, 
// //         label: t('cancelled') 
// //       },
// //       refunded: { 
// //         color: 'bg-yellow-100 text-yellow-800', 
// //         icon: AlertCircle, 
// //         label: t('refunded') 
// //       }
// //     }
// //     return configs[status] || { 
// //       color: 'bg-gray-100 text-gray-800', 
// //       icon: Clock, 
// //       label: t('pending') 
// //     }
// //   }

// //   const getPaymentMethodIcon = (method) => {
// //     const icons = {
// //       cash: '💰',
// //       card: '💳',
// //       mobile: '📱'
// //     }
// //     return icons[method] || '💸'
// //   }

// //   const getPaymentMethodLabel = (method) => {
// //     const labels = {
// //       cash: t('cash'),
// //       card: t('card'),
// //       mobile: t('mobile')
// //     }
// //     return labels[method] || method
// //   }

// //   const getCurrencyBadge = (currency) => {
// //     return currency === 'USD' 
// //       ? <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
// //           <DollarSign className="w-3 h-3 mr-1" />
// //           USD
// //         </span>
// //       : <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">
// //           FC
// //         </span>
// //   }

// //   const handlePrintReceipt = (saleId) => {
// //     console.log(t('printReceiptFor'), saleId)
// //   }

// //   const handleRefresh = () => {
// //     loadVentes()
// //   }

// //   if (!currentUser) return null

// //   return (
// //     <div className="p-4">
// //       {/* Header */}
// //       <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
// //         <div>
// //           <h1 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center">
// //             <ShoppingBag className="w-6 h-6 sm:w-7 sm:h-7 mr-3 text-gray-700" />
// //             {t('mySalesToday')}
// //           </h1>
// //           <div className="flex items-center space-x-2 mt-2">
// //             <Calendar className="w-4 h-4 text-gray-400" />
// //             <span className="text-sm text-gray-600">
// //               {new Date().toLocaleDateString('fr-FR', {
// //                 weekday: 'long',
// //                 day: 'numeric',
// //                 month: 'long',
// //                 year: 'numeric'
// //               })}
// //             </span>
// //           </div>
// //         </div>
        
// //         <div className="flex items-center space-x-2">
// //           <button
// //             onClick={handleRefresh}
// //             className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm"
// //           >
// //             {t('refresh')}
// //           </button>
// //           <button
// //             onClick={() => router.push('/sales/new')}
// //             className="flex items-center justify-center space-x-2 px-4 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition text-sm"
// //           >
// //             <TrendingUp className="w-4 h-4" />
// //             <span>{t('newSale')}</span>
// //           </button>
// //         </div>
// //       </div>

// //       {/* Stats */}
// //       <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
// //         <div className="bg-white rounded-lg border border-gray-200 p-4">
// //           <div className="flex items-center justify-between">
// //             <div>
// //               <div className="text-2xl font-bold text-gray-900">{stats.totalVentes}</div>
// //               <div className="text-sm text-gray-500">{t('totalSales')}</div>
// //             </div>
// //             <ShoppingBag className="w-8 h-8 text-blue-500" />
// //           </div>
// //           <div className="flex justify-between mt-2 text-xs">
// //             <span className="text-green-600">{stats.ventesCDF} FC</span>
// //             <span className="text-blue-600">{stats.ventesUSD} $</span>
// //           </div>
// //         </div>
        
// //         <div className="bg-white rounded-lg border border-gray-200 p-4">
// //           <div className="flex items-center justify-between">
// //             <div>
// //               <div className="text-2xl font-bold text-green-600">{formatCurrency(stats.totalMontantCDF)}</div>
// //               <div className="text-sm text-gray-500">{t('totalInFrancs')}</div>
// //             </div>
// //             <span className="text-lg">FC</span>
// //           </div>
// //           <div className="mt-2 text-xs text-gray-500">
// //             {stats.ventesCDF} {t('sale')}{stats.ventesCDF !== 1 ? 's' : ''}
// //           </div>
// //         </div>
        
// //         <div className="bg-white rounded-lg border border-gray-200 p-4">
// //           <div className="flex items-center justify-between">
// //             <div>
// //               <div className="text-2xl font-bold text-blue-600">$ {stats.totalMontantUSD?.toFixed(2) || '0.00'}</div>
// //               <div className="text-sm text-gray-500">{t('totalInDollars')}</div>
// //             </div>
// //             <DollarSign className="w-6 h-6 text-blue-400" />
// //           </div>
// //           <div className="mt-2 text-xs text-gray-500">
// //             {stats.ventesUSD} {t('sale')}{stats.ventesUSD !== 1 ? 's' : ''}
// //           </div>
// //         </div>
        
// //         <div className="bg-white rounded-lg border border-gray-200 p-4">
// //           <div className="flex items-center justify-between">
// //             <div>
// //               <div className="text-lg font-bold text-purple-600">
// //                 1$ = {saleConfig.currency_rate?.toLocaleString('fr-FR') || '2,300'} FC
// //               </div>
// //               <div className="text-sm text-gray-500">{t('currentRate')}</div>
// //             </div>
// //             <TrendingUp className="w-6 h-6 text-purple-400" />
// //           </div>
// //           <div className="mt-2 text-xs text-gray-400">
// //             {t('rateUsedForConversions')}
// //           </div>
// //         </div>
// //       </div>

// //       {/* Tableau des ventes */}
// //       {loading ? (
// //         <div className="bg-white rounded-lg border border-gray-200 p-8">
// //           <div className="flex flex-col items-center justify-center space-y-4">
// //             <Loader2 className="w-8 h-8 animate-spin text-gray-600" />
// //             <div className="text-gray-500">{t('loadingSales')}</div>
// //           </div>
// //         </div>
// //       ) : ventes.length > 0 ? (
// //         <div className="overflow-x-auto bg-white rounded-lg border border-gray-200">
// //           {/* Vue desktop */}
// //           <div className="hidden md:block">
// //             <table className="min-w-full divide-y divide-gray-200">
// //               <thead className="bg-gray-50">
// //                 <tr>
// //                   <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// //                     {t('invoice')}
// //                   </th>
// //                   <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// //                     {t('client')}
// //                   </th>
// //                   <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// //                     {t('time')}
// //                   </th>
// //                   <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// //                     {t('amount')}
// //                   </th>
// //                   <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// //                     {t('currency')}
// //                   </th>
// //                   <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// //                     {t('payment')}
// //                   </th>
// //                   <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// //                     {t('status')}
// //                   </th>
// //                   <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// //                     {t('actions')}
// //                   </th>
// //                 </tr>
// //               </thead>
// //               <tbody className="divide-y divide-gray-200">
// //                 {ventes.map((vente) => {
// //                   const statusConfig = getStatusConfig(vente.status)
// //                   const Icon = statusConfig.icon
                  
// //                   let montantConverti = null
// //                   let deviseConvertie = ''
                  
// //                   if (vente.currency === 'USD' && vente.currency_rate) {
// //                     montantConverti = vente.total * vente.currency_rate
// //                     deviseConvertie = 'CDF'
// //                   } else if (vente.currency === 'CDF' && vente.currency_rate) {
// //                     montantConverti = vente.total / vente.currency_rate
// //                     deviseConvertie = 'USD'
// //                   }
                  
// //                   return (
// //                     <tr key={vente.id} className="hover:bg-gray-50 transition">
// //                       {/* Facture */}
// //                       <td className="px-4 py-3">
// //                         <div className="font-mono font-semibold text-sm text-gray-900">
// //                           {vente.sale_number}
// //                         </div>
// //                       </td>

// //                       {/* Client */}
// //                       <td className="px-4 py-3">
// //                         <div className="flex items-center space-x-2">
// //                           <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
// //                             <User className="h-4 w-4 text-gray-600" />
// //                           </div>
// //                           <div>
// //                             <div className="font-medium text-sm text-gray-900">
// //                               {vente.client?.name || t('unspecifiedClient')}
// //                             </div>
// //                             <div className="text-xs text-gray-500">
// //                               {vente.client?.phone || t('noPhone')}
// //                             </div>
// //                           </div>
// //                         </div>
// //                       </td>

// //                       {/* Heure */}
// //                       <td className="px-4 py-3 whitespace-nowrap">
// //                         <div className="text-sm text-gray-900">
// //                           {new Date(vente.date_time).toLocaleTimeString('fr-FR', {
// //                             hour: '2-digit',
// //                             minute: '2-digit'
// //                           })}
// //                         </div>
// //                         <div className="text-xs text-gray-500">
// //                           {new Date(vente.date_time).toLocaleDateString('fr-FR', {
// //                             day: '2-digit',
// //                             month: '2-digit'
// //                           })}
// //                         </div>
// //                       </td>

// //                       {/* Montant */}
// //                       <td className="px-4 py-3 whitespace-nowrap">
// //                         <div className="font-semibold text-gray-900">
// //                           {formatCurrency(vente.total, vente.currency)}
// //                         </div>
// //                         {montantConverti && (
// //                           <div className="text-xs text-gray-500">
// //                             ≈ {formatCurrency(montantConverti, deviseConvertie)}
// //                           </div>
// //                         )}
// //                       </td>

// //                       {/* Devise */}
// //                       <td className="px-4 py-3 whitespace-nowrap">
// //                         {getCurrencyBadge(vente.currency)}
// //                       </td>

// //                       {/* Paiement */}
// //                       <td className="px-4 py-3 whitespace-nowrap">
// //                         <div className="flex items-center space-x-2">
// //                           <span className="text-lg">{getPaymentMethodIcon(vente.payment_method)}</span>
// //                           <span className="text-sm capitalize">
// //                             {getPaymentMethodLabel(vente.payment_method)}
// //                           </span>
// //                         </div>
// //                       </td>

// //                       {/* Statut */}
// //                       <td className="px-4 py-3 whitespace-nowrap">
// //                         <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig.color}`}>
// //                           <Icon className="w-3 h-3 mr-1" />
// //                           {statusConfig.label}
// //                         </div>
// //                       </td>

// //                       {/* Actions */}
// //                       <td className="px-4 py-3 whitespace-nowrap">
// //                         <div className="flex items-center space-x-1">
// //                           <button
// //                             onClick={() => router.push(`/sales/${vente.id}`)}
// //                             className="p-1.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition"
// //                             title={t('viewDetails')}
// //                           >
// //                             <Eye className="w-4 h-4" />
// //                           </button>
// //                           <button
// //                             onClick={() => handlePrintReceipt(vente.id)}
// //                             className="p-1.5 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded transition"
// //                             title={t('print')}
// //                           >
// //                             <Printer className="w-4 h-4" />
// //                           </button>
// //                         </div>
// //                       </td>
// //                     </tr>
// //                   )
// //                 })}
// //               </tbody>
// //             </table>
// //           </div>

// //           {/* Vue mobile */}
// //           <div className="md:hidden divide-y divide-gray-200">
// //             {ventes.map((vente) => {
// //               const statusConfig = getStatusConfig(vente.status)
// //               const Icon = statusConfig.icon
              
// //               let montantConverti = null
// //               let deviseConvertie = ''
              
// //               if (vente.currency === 'USD' && vente.currency_rate) {
// //                 montantConverti = vente.total * vente.currency_rate
// //                 deviseConvertie = 'CDF'
// //               } else if (vente.currency === 'CDF' && vente.currency_rate) {
// //                 montantConverti = vente.total / vente.currency_rate
// //                 deviseConvertie = 'USD'
// //               }
              
// //               return (
// //                 <div key={vente.id} className="p-4 hover:bg-gray-50 transition">
// //                   <div className="flex items-start justify-between mb-2">
// //                     <div className="flex-1">
// //                       <div className="flex items-center justify-between mb-1">
// //                         <div className="font-mono font-semibold text-gray-900">
// //                           {vente.sale_number}
// //                         </div>
// //                         <div className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${statusConfig.color}`}>
// //                           <Icon className="w-3 h-3 mr-1" />
// //                           {statusConfig.label}
// //                         </div>
// //                       </div>
// //                       <div className="flex items-center space-x-2 text-sm text-gray-600">
// //                         <User className="h-3 w-3" />
// //                         <span>{vente.client?.name || t('unspecifiedClient')}</span>
// //                         <div className="ml-auto">
// //                           {getCurrencyBadge(vente.currency)}
// //                         </div>
// //                       </div>
// //                     </div>
// //                   </div>
                  
// //                   <div className="grid grid-cols-2 gap-4 mt-3">
// //                     <div>
// //                       <div className="text-xs text-gray-500">{t('time')}</div>
// //                       <div className="text-sm font-medium">
// //                         {new Date(vente.date_time).toLocaleTimeString('fr-FR', {
// //                           hour: '2-digit',
// //                           minute: '2-digit'
// //                         })}
// //                       </div>
// //                     </div>
// //                     <div>
// //                       <div className="text-xs text-gray-500">{t('amount')}</div>
// //                       <div className="text-sm font-semibold text-gray-900">
// //                         {formatCurrency(vente.total, vente.currency)}
// //                       </div>
// //                       {montantConverti && (
// //                         <div className="text-xs text-gray-500">
// //                           ≈ {formatCurrency(montantConverti, deviseConvertie)}
// //                         </div>
// //                       )}
// //                     </div>
// //                   </div>
                  
// //                   <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-200">
// //                     <div className="flex items-center space-x-2">
// //                       <span className="text-lg">{getPaymentMethodIcon(vente.payment_method)}</span>
// //                       <span className="text-sm capitalize">
// //                         {getPaymentMethodLabel(vente.payment_method)}
// //                       </span>
// //                     </div>
// //                     <div className="flex items-center space-x-1">
// //                       <button
// //                         onClick={() => router.push(`/sales/${vente.id}`)}
// //                         className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
// //                         title={t('viewDetails')}
// //                       >
// //                         <Eye className="w-4 h-4" />
// //                       </button>
// //                       <button
// //                         onClick={() => handlePrintReceipt(vente.id)}
// //                         className="p-1.5 text-green-600 hover:bg-green-50 rounded"
// //                         title={t('print')}
// //                       >
// //                         <Printer className="w-4 h-4" />
// //                       </button>
// //                     </div>
// //                   </div>
// //                 </div>
// //               )
// //             })}
// //           </div>
// //         </div>
// //       ) : (
// //         <div className="bg-white rounded-lg border border-gray-200 p-8">
// //                             <NouvelleVentePage/>

// //           <div className="text-center">
// //             <ShoppingBag className="w-12 h-12 text-gray-400 mx-auto mb-3" />
// //             <h3 className="text-lg font-medium text-gray-900 mb-1">
// //               {t('noSalesToday')}
// //             </h3>
// //             <p className="text-gray-500 text-sm mb-4">
// //               {t('startWithFirstSaleToday')}
// //             </p>
// //             <button
// //               onClick={() => router.push('/sales/new')}
// //               className="inline-flex items-center px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition text-sm"
// //             >
// //               <TrendingUp className="w-4 h-4 mr-2" />
// //               {t('newSale')}
// //             </button>
// //           </div>
// //         </div>
// //       )}
// //     </div>
// //   )
// // }


// 'use client'

// import { useState, useEffect } from 'react'
// import { useRouter } from 'next/navigation'
// import { supabase } from '@/lib/supabase'
// import { checkAuth } from '@/lib/auth'
// import { useLanguage } from '@/contexts/LanguageContext'
// import NouvelleVenteComponent from '@/components/NouvelleVenteComponent'
// import CategoryManager from '@/components/CategoryManager'
// import { 
//   ShoppingBag, 
//   Eye,
//   Printer,
//   User,
//   CheckCircle,
//   XCircle,
//   AlertCircle,
//   Clock,
//   Loader2,
//   DollarSign,
//   Calendar,
//   TrendingUp,
//   RefreshCw,
//   Package,
//   CreditCard,
//   Smartphone,
//   Wallet,
//   Phone,
//   Check,
//   ArrowLeft,
//   Search,
//   X,
//   Plus,
//   Minus,
//   Trash2,
//   Globe,
//   ShoppingCart,
//   BarChart3,
//   Users
// } from 'lucide-react'

// export default function VentesDashboard() {
//   const router = useRouter()
//   const [currentUser, setCurrentUser] = useState(null)
//   const [activeTab, setActiveTab] = useState('newSale')
//   const [loadingStats, setLoadingStats] = useState(true)
//   const [loadingSales, setLoadingSales] = useState(true)
//   const { t, language } = useLanguage()
  
//   // Configuration vente
//   const [saleConfig, setSaleConfig] = useState({
//     vat_amount: 20.00,
//     currency_rate: 2300.00,
//     base_currency: 'USD',
//     currency: 'CDF'
//   })
  
//   // Statistiques du jour pour l'utilisateur connecté
//   const [stats, setStats] = useState({
//     totalVentes: 0,
//     totalMontantCDF: 0,
//     totalMontantUSD: 0,
//     ventesCDF: 0,
//     ventesUSD: 0,
//     averageTransaction: 0
//   })
  
//   // Ventes du jour pour l'utilisateur connecté
//   const [todaysSales, setTodaysSales] = useState([])

//   // Initialisation
//   useEffect(() => {
//     const user = checkAuth()
//     if (!user) {
//       router.push('/auth/login')
//       return
//     }
//     setCurrentUser(user)
//     loadSaleConfig()
//   }, [])

//   // Charger les données quand l'utilisateur est disponible
//   useEffect(() => {
//     if (currentUser) {
//       loadDailyStats()
//       loadTodaysSales()
//     }
//   }, [currentUser])

//   // Charger la configuration
//   const loadSaleConfig = async () => {
//     try {
//       const { data, error } = await supabase
//         .from('sale_config')
//         .select('*')
//         .order('created_at', { ascending: false })
//         .limit(1)
//         .single()
      
//       if (error) return
      
//       if (data) {
//         setSaleConfig(data)
//       }
//     } catch (error) {
//       console.error('Erreur chargement config:', error)
//     }
//   }

//   // Charger les statistiques du jour pour l'utilisateur connecté
//   const loadDailyStats = async () => {
//     if (!currentUser) return
    
//     try {
//       setLoadingStats(true)
      
//       // Date d'aujourd'hui
//       const today = new Date()
//       today.setHours(0, 0, 0, 0)
//       const tomorrow = new Date(today)
//       tomorrow.setDate(tomorrow.getDate() + 1)

//       // Récupérer toutes les ventes du jour pour l'utilisateur
//       const { data: sales, error } = await supabase
//         .from('sale')
//         .select('*')
//         .eq('user_id', currentUser.id)
//         .eq('status', 'completed')
//         .gte('date_time', today.toISOString())
//         .lt('date_time', tomorrow.toISOString())

//       if (error) throw error

//       // Calculer les statistiques
//       let totalVentes = 0
//       let totalMontantCDF = 0
//       let totalMontantUSD = 0
//       let ventesCDF = 0
//       let ventesUSD = 0
//       let totalTransactions = 0

//       if (sales) {
//         totalVentes = sales.length
        
//         sales.forEach(sale => {
//           const montant = sale.total || 0
//           totalTransactions += montant
          
//           if (sale.currency === 'USD') {
//             ventesUSD += 1
//             totalMontantUSD += montant
            
//             // Convertir USD vers CDF
//             const tauxVente = sale.currency_rate || saleConfig.currency_rate || 2300
//             const montantCDF = montant * tauxVente
//             totalMontantCDF += montantCDF
//           } else {
//             ventesCDF += 1
//             totalMontantCDF += montant
//           }
//         })
//       }

//       const averageTransaction = totalVentes > 0 ? totalTransactions / totalVentes : 0

//       setStats({
//         totalVentes,
//         totalMontantCDF: Math.round(totalMontantCDF),
//         totalMontantUSD: Math.round(totalMontantUSD * 100) / 100,
//         ventesCDF,
//         ventesUSD,
//         averageTransaction: Math.round(averageTransaction)
//       })

//     } catch (error) {
//       console.error('Erreur chargement stats:', error)
//     } finally {
//       setLoadingStats(false)
//     }
//   }

//   // Charger les ventes du jour pour l'utilisateur connecté
//   const loadTodaysSales = async () => {
//     if (!currentUser) return
    
//     try {
//       setLoadingSales(true)
      
//       const today = new Date()
//       today.setHours(0, 0, 0, 0)
//       const tomorrow = new Date(today)
//       tomorrow.setDate(tomorrow.getDate() + 1)

//       const { data: sales, error } = await supabase
//         .from('sale')
//         .select(`
//           *,
//           client:customer_id(name, phone)
//         `)
//         .eq('user_id', currentUser.id)
//         .gte('date_time', today.toISOString())
//         .lt('date_time', tomorrow.toISOString())
//         .order('date_time', { ascending: false })

//       if (error) throw error

//       setTodaysSales(sales || [])

//     } catch (error) {
//       console.error('Erreur chargement ventes:', error)
//       setTodaysSales([])
//     } finally {
//       setLoadingSales(false)
//     }
//   }

//   // Fonction appelée après une vente réussie
//   const handleSaleCompleted = () => {
//     loadDailyStats()
//     loadTodaysSales()
//   }

//   // Fonctions utilitaires
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
//         label: 'Complétée' 
//       },
//       cancelled: { 
//         color: 'bg-red-100 text-red-800', 
//         icon: XCircle, 
//         label: 'Annulée' 
//       },
//       refunded: { 
//         color: 'bg-yellow-100 text-yellow-800', 
//         icon: AlertCircle, 
//         label: 'Remboursée' 
//       }
//     }
//     return configs[status] || { 
//       color: 'bg-gray-100 text-gray-800', 
//       icon: Clock, 
//       label: 'En attente' 
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
//       cash: 'Espèces',
//       card: 'Carte',
//       mobile: 'Mobile'
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

//   const handlePrintReceipt = (saleId) => {
//     console.log('Impression reçu pour:', saleId)
//   }

//   const handleRefresh = () => {
//     loadDailyStats()
//     loadTodaysSales()
//   }

//   if (!currentUser) return null

//   return (
//     <div className="min-h-screen bg-gray-50 p-4">
//       <div className="max-w-7xl mx-auto">
//         {/* Header avec Tabs */}
//         <div className="mb-6 flex items-center justify-between">
//           <div>
//             <h1 className="text-2xl font-bold text-gray-900">Tableau de bord des ventes</h1>
//             <p className="text-gray-600">Bienvenue, {currentUser.full_name}!</p>
//           </div>
          
//           {/* Tabs Navigation - Top Right */}
//           <div className="flex items-center space-x-4">
//             {/* Bouton de rafraîchissement */}
//             <button
//               onClick={handleRefresh}
//               className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
//               title="Rafraîchir les statistiques"
//             >
//               <RefreshCw className={`h-5 w-5 ${loadingStats ? 'animate-spin' : ''}`} />
//             </button>
            
//             {/* Tabs */}
//             <div className="flex border border-gray-200 rounded-lg overflow-hidden bg-white">
//               <button
//                 onClick={() => setActiveTab('newSale')}
//                 className={`px-4 py-2 text-sm font-medium transition-colors ${
//                   activeTab === 'newSale'
//                     ? 'bg-blue-600 text-white'
//                     : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
//                 }`}
//               >
//                 Nouvelle vente
//               </button>
//               <button
//                 onClick={() => setActiveTab('todaySales')}
//                 className={`px-4 py-2 text-sm font-medium transition-colors ${
//                   activeTab === 'todaySales'
//                     ? 'bg-blue-600 text-white'
//                     : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
//                 }`}
//               >
//                 Ventes du jour
//               </button>
//               <button
//                 onClick={() => setActiveTab('categories')}
//                 className={`px-4 py-2 text-sm font-medium transition-colors ${
//                   activeTab === 'categories'
//                     ? 'bg-blue-600 text-white'
//                     : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
//                 }`}
//               >
//                 Catégories
//               </button>
//             </div>
//           </div>
//         </div>

      

//         {/* Contenu des Tabs */}
//         <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
//           {/* Tab Content */}
//           <div className="p-4">
            
//             {/* Tab 1: Nouvelle Vente */}
//             {activeTab === 'newSale' && (
//               <NouvelleVenteComponent onSaleCompleted={handleSaleCompleted} />
//             )}

//             {/* Tab 2: Ventes du Jour */}
//             {activeTab === 'todaySales' && (
//               <div>
//                 <div className="flex items-center justify-between mb-6">
//                   <h2 className="text-lg font-semibold text-gray-900">
//                     Ventes du jour ({todaysSales.length})
//                   </h2>
//                   <button
//                     onClick={handleRefresh}
//                     disabled={loadingSales}
//                     className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm flex items-center"
//                   >
//                     <RefreshCw className={`w-4 h-4 mr-2 ${loadingSales ? 'animate-spin' : ''}`} />
//                     Rafraîchir
//                   </button>
//                 </div>
                
//                 {loadingSales ? (
//                   <div className="bg-white rounded-lg border border-gray-200 p-8">
//                     <div className="flex flex-col items-center justify-center space-y-4">
//                       <Loader2 className="w-8 h-8 animate-spin text-gray-600" />
//                       <div className="text-gray-500">Chargement des ventes...</div>
//                     </div>
//                   </div>
//                 ) : todaysSales.length > 0 ? (
//                   <div className="overflow-x-auto bg-white rounded-lg border border-gray-200">
//                     {/* Vue desktop */}
//                     <div className="hidden md:block">
//                       <table className="min-w-full divide-y divide-gray-200">
//                         <thead className="bg-gray-50">
//                           <tr>
//                             <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                               Facture
//                             </th>
//                             <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                               Client
//                             </th>
//                             <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                               Heure
//                             </th>
//                             <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                               Montant
//                             </th>
//                             <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                               Devise
//                             </th>
//                             <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                               Paiement
//                             </th>
//                             <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                               Statut
//                             </th>
//                             <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                               Actions
//                             </th>
//                           </tr>
//                         </thead>
//                         <tbody className="divide-y divide-gray-200">
//                           {todaysSales.map((vente) => {
//                             const statusConfig = getStatusConfig(vente.status)
//                             const Icon = statusConfig.icon
                            
//                             let montantConverti = null
//                             let deviseConvertie = ''
                            
//                             if (vente.currency === 'USD' && vente.currency_rate) {
//                               montantConverti = vente.total * vente.currency_rate
//                               deviseConvertie = 'CDF'
//                             } else if (vente.currency === 'CDF' && vente.currency_rate) {
//                               montantConverti = vente.total / vente.currency_rate
//                               deviseConvertie = 'USD'
//                             }
                            
//                             return (
//                               <tr key={vente.id} className="hover:bg-gray-50 transition">
//                                 {/* Facture */}
//                                 <td className="px-4 py-3">
//                                   <div className="font-mono font-semibold text-sm text-gray-900">
//                                     {vente.sale_number || `SALE-${vente.id}`}
//                                   </div>
//                                 </td>

//                                 {/* Client */}
//                                 <td className="px-4 py-3">
//                                   <div className="flex items-center space-x-2">
//                                     <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
//                                       <User className="h-4 w-4 text-gray-600" />
//                                     </div>
//                                     <div>
//                                       <div className="font-medium text-sm text-gray-900">
//                                         {vente.client?.name || 'Client non spécifié'}
//                                       </div>
//                                       <div className="text-xs text-gray-500">
//                                         {vente.client?.phone || 'Pas de téléphone'}
//                                       </div>
//                                     </div>
//                                   </div>
//                                 </td>

//                                 {/* Heure */}
//                                 <td className="px-4 py-3 whitespace-nowrap">
//                                   <div className="text-sm text-gray-900">
//                                     {new Date(vente.date_time).toLocaleTimeString('fr-FR', {
//                                       hour: '2-digit',
//                                       minute: '2-digit'
//                                     })}
//                                   </div>
//                                   <div className="text-xs text-gray-500">
//                                     {new Date(vente.date_time).toLocaleDateString('fr-FR', {
//                                       day: '2-digit',
//                                       month: '2-digit'
//                                     })}
//                                   </div>
//                                 </td>

//                                 {/* Montant */}
//                                 <td className="px-4 py-3 whitespace-nowrap">
//                                   <div className="font-semibold text-gray-900">
//                                     {formatCurrency(vente.total, vente.currency)}
//                                   </div>
//                                   {montantConverti && (
//                                     <div className="text-xs text-gray-500">
//                                       ≈ {formatCurrency(montantConverti, deviseConvertie)}
//                                     </div>
//                                   )}
//                                 </td>

//                                 {/* Devise */}
//                                 <td className="px-4 py-3 whitespace-nowrap">
//                                   {getCurrencyBadge(vente.currency)}
//                                 </td>

//                                 {/* Paiement */}
//                                 <td className="px-4 py-3 whitespace-nowrap">
//                                   <div className="flex items-center space-x-2">
//                                     <span className="text-lg">{getPaymentMethodIcon(vente.payment_method)}</span>
//                                     <span className="text-sm capitalize">
//                                       {getPaymentMethodLabel(vente.payment_method)}
//                                     </span>
//                                   </div>
//                                 </td>

//                                 {/* Statut */}
//                                 <td className="px-4 py-3 whitespace-nowrap">
//                                   <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig.color}`}>
//                                     <Icon className="w-3 h-3 mr-1" />
//                                     {statusConfig.label}
//                                   </div>
//                                 </td>

//                                 {/* Actions */}
//                                 <td className="px-4 py-3 whitespace-nowrap">
//                                   <div className="flex items-center space-x-1">
//                                     <button
//                                       onClick={() => router.push(`/ventes/${vente.id}`)}
//                                       className="p-1.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition"
//                                       title="Voir détails"
//                                     >
//                                       <Eye className="w-4 h-4" />
//                                     </button>
//                                     <button
//                                       onClick={() => handlePrintReceipt(vente.id)}
//                                       className="p-1.5 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded transition"
//                                       title="Imprimer"
//                                     >
//                                       <Printer className="w-4 h-4" />
//                                     </button>
//                                   </div>
//                                 </td>
//                               </tr>
//                             )
//                           })}
//                         </tbody>
//                       </table>
//                     </div>

//                     {/* Vue mobile */}
//                     <div className="md:hidden divide-y divide-gray-200">
//                       {todaysSales.map((vente) => {
//                         const statusConfig = getStatusConfig(vente.status)
//                         const Icon = statusConfig.icon
                        
//                         let montantConverti = null
//                         let deviseConvertie = ''
                        
//                         if (vente.currency === 'USD' && vente.currency_rate) {
//                           montantConverti = vente.total * vente.currency_rate
//                           deviseConvertie = 'CDF'
//                         } else if (vente.currency === 'CDF' && vente.currency_rate) {
//                           montantConverti = vente.total / vente.currency_rate
//                           deviseConvertie = 'USD'
//                         }
                        
//                         return (
//                           <div key={vente.id} className="p-4 hover:bg-gray-50 transition">
//                             <div className="flex items-start justify-between mb-2">
//                               <div className="flex-1">
//                                 <div className="flex items-center justify-between mb-1">
//                                   <div className="font-mono font-semibold text-gray-900">
//                                     {vente.sale_number || `SALE-${vente.id}`}
//                                   </div>
//                                   <div className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${statusConfig.color}`}>
//                                     <Icon className="w-3 h-3 mr-1" />
//                                     {statusConfig.label}
//                                   </div>
//                                 </div>
//                                 <div className="flex items-center space-x-2 text-sm text-gray-600">
//                                   <User className="h-3 w-3" />
//                                   <span>{vente.client?.name || 'Client non spécifié'}</span>
//                                   <div className="ml-auto">
//                                     {getCurrencyBadge(vente.currency)}
//                                   </div>
//                                 </div>
//                               </div>
//                             </div>
                            
//                             <div className="grid grid-cols-2 gap-4 mt-3">
//                               <div>
//                                 <div className="text-xs text-gray-500">Heure</div>
//                                 <div className="text-sm font-medium">
//                                   {new Date(vente.date_time).toLocaleTimeString('fr-FR', {
//                                     hour: '2-digit',
//                                     minute: '2-digit'
//                                   })}
//                                 </div>
//                               </div>
//                               <div>
//                                 <div className="text-xs text-gray-500">Montant</div>
//                                 <div className="text-sm font-semibold text-gray-900">
//                                   {formatCurrency(vente.total, vente.currency)}
//                                 </div>
//                                 {montantConverti && (
//                                   <div className="text-xs text-gray-500">
//                                     ≈ {formatCurrency(montantConverti, deviseConvertie)}
//                                   </div>
//                                 )}
//                               </div>
//                             </div>
                            
//                             <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-200">
//                               <div className="flex items-center space-x-2">
//                                 <span className="text-lg">{getPaymentMethodIcon(vente.payment_method)}</span>
//                                 <span className="text-sm capitalize">
//                                   {getPaymentMethodLabel(vente.payment_method)}
//                                 </span>
//                               </div>
//                               <div className="flex items-center space-x-1">
//                                 <button
//                                   onClick={() => router.push(`/ventes/${vente.id}`)}
//                                   className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
//                                   title="Voir détails"
//                                 >
//                                   <Eye className="w-4 h-4" />
//                                 </button>
//                                 <button
//                                   onClick={() => handlePrintReceipt(vente.id)}
//                                   className="p-1.5 text-green-600 hover:bg-green-50 rounded"
//                                   title="Imprimer"
//                                 >
//                                   <Printer className="w-4 h-4" />
//                                 </button>
//                               </div>
//                             </div>
//                           </div>
//                         )
//                       })}
//                     </div>
//                   </div>
//                 ) : (
//                   <div className="bg-white rounded-lg border border-gray-200 p-8">
//                     <div className="text-center">
//                       <ShoppingBag className="w-12 h-12 text-gray-400 mx-auto mb-3" />
//                       <h3 className="text-lg font-medium text-gray-900 mb-1">
//                         Aucune vente aujourd'hui
//                       </h3>
//                       <p className="text-gray-500 text-sm mb-4">
//                         Commencez par effectuer votre première vente de la journée
//                       </p>
//                       <button
//                         onClick={() => setActiveTab('newSale')}
//                         className="inline-flex items-center px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition text-sm"
//                       >
//                         <TrendingUp className="w-4 h-4 mr-2" />
//                         Nouvelle vente
//                       </button>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             )}

//             {/* Tab 3: Gestion des Catégories */}
//             {activeTab === 'categories' && (
//               <CategoryManager />
//             )}
//           </div>
          
//         </div>
//           {/* Statistiques des ventes du jour */}
//         <div className="mb-6 hidde">
//           <div className="flex items-center justify-between mb-4">
//             <h2 className="text-lg font-semibold text-gray-900 flex items-center">
//               <Calendar className="w-5 h-5 mr-2 text-blue-600" />
//               Statistiques du jour
//             </h2>
//             <span className="text-sm text-gray-500">
//               {new Date().toLocaleDateString('fr-FR', {
//                 weekday: 'long',
//                 year: 'numeric',
//                 month: 'long',
//                 day: 'numeric'
//               })}
//             </span>
//           </div>
          
//           <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
//             {/* Total des ventes */}
//             <div className="bg-white rounded-lg border border-gray-200 p-4">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm text-gray-500">Total des ventes</p>
//                   <p className="text-2xl font-bold text-gray-900 mt-1">
//                     {loadingStats ? '...' : stats.totalVentes}
//                   </p>
//                 </div>
//                 <div className="p-3 bg-blue-50 rounded-full">
//                   <ShoppingBag className="h-6 w-6 text-blue-600" />
//                 </div>
//               </div>
//               <div className="mt-2 text-xs text-gray-500 flex justify-between">
//                 <span className="text-green-600">{stats.ventesCDF} FC</span>
//                 <span className="text-blue-600">{stats.ventesUSD} $</span>
//               </div>
//             </div>

//             {/* Chiffre d'affaires en FC */}
//             <div className="bg-white rounded-lg border border-gray-200 p-4">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm text-gray-500">Total en Francs</p>
//                   <p className="text-2xl font-bold text-green-600 mt-1">
//                     {loadingStats ? '...' : formatCurrency(stats.totalMontantCDF, 'CDF')}
//                   </p>
//                 </div>
//                 <div className="p-3 bg-green-50 rounded-full">
//                   <span className="text-lg font-bold text-green-600">FC</span>
//                 </div>
//               </div>
//               <div className="mt-2 text-xs text-gray-500">
//                 {stats.ventesCDF} vente{stats.ventesCDF !== 1 ? 's' : ''}
//               </div>
//             </div>

//             {/* Chiffre d'affaires en USD */}
//             <div className="bg-white rounded-lg border border-gray-200 p-4">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm text-gray-500">Total en Dollars</p>
//                   <p className="text-2xl font-bold text-blue-600 mt-1">
//                     {loadingStats ? '...' : `$${stats.totalMontantUSD?.toFixed(2) || '0.00'}`}
//                   </p>
//                 </div>
//                 <div className="p-3 bg-blue-50 rounded-full">
//                   <DollarSign className="h-6 w-6 text-blue-600" />
//                 </div>
//               </div>
//               <div className="mt-2 text-xs text-gray-500">
//                 {stats.ventesUSD} vente{stats.ventesUSD !== 1 ? 's' : ''}
//               </div>
//             </div>

//             {/* Moyenne transaction */}
//             <div className="bg-white rounded-lg border border-gray-200 p-4">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm text-gray-500">Moyenne transaction</p>
//                   <p className="text-2xl font-bold text-gray-900 mt-1">
//                     {loadingStats ? '...' : formatCurrency(stats.averageTransaction, 'CDF')}
//                   </p>
//                 </div>
//                 <div className="p-3 bg-purple-50 rounded-full">
//                   <BarChart3 className="h-6 w-6 text-purple-600" />
//                 </div>
//               </div>
//               <div className="mt-2 text-xs text-gray-500">
//                 Par transaction
//               </div>
//             </div>

//             {/* Taux de change */}
//             <div className="bg-white rounded-lg border border-gray-200 p-4">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm text-gray-500">Taux de change</p>
//                   <p className="text-lg font-bold text-purple-600 mt-1">
//                     1$ = {saleConfig.currency_rate?.toLocaleString('fr-FR') || '2,300'} FC
//                   </p>
//                 </div>
//                 <div className="p-3 bg-orange-50 rounded-full">
//                   <TrendingUp className="h-6 w-6 text-orange-600" />
//                 </div>
//               </div>
//               <div className="mt-2 text-xs text-gray-500">
//                 Taux utilisé pour conversions
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { checkAuth } from '@/lib/auth'
import { useLanguage } from '@/contexts/LanguageContext'
import NouvelleVenteComponent from '@/components/NouvelleVenteComponent'
import CategoryManager from '@/components/CategoryManager'
import { 
  ShoppingBag, 
  Eye,
  Printer,
  User,
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock,
  Loader2,
  DollarSign,
  Calendar,
  TrendingUp,
  RefreshCw,
  ShoppingCart,
  BarChart3,
  Users
} from 'lucide-react'
import Link from 'next/link'

export default function VentesDashboard() {
  const router = useRouter()
  const [currentUser, setCurrentUser] = useState(null)
  const [activeTab, setActiveTab] = useState('newSale')
  const [loadingStats, setLoadingStats] = useState(true)
  const [loadingSales, setLoadingSales] = useState(true)
  const { t, language } = useLanguage()
  
  // Configuration vente
  const [saleConfig, setSaleConfig] = useState({
    vat_amount: 20.00,
    currency_rate: 2300.00,
    base_currency: 'USD',
    currency: 'CDF'
  })
  
  // Statistiques du jour pour l'utilisateur connecté
  const [stats, setStats] = useState({
    totalVentes: 0,
    totalMontantCDF: 0,
    totalMontantUSD: 0,
    ventesCDF: 0,
    ventesUSD: 0,
    averageTransaction: 0
  })
  
  // Ventes du jour pour l'utilisateur connecté
  const [todaysSales, setTodaysSales] = useState([])

  // Initialisation
  useEffect(() => {
    const user = checkAuth()
    if (!user) {
      router.push('/auth/login')
      return
    }
    setCurrentUser(user)
    loadSaleConfig()
  }, [])

  // Charger les données quand l'utilisateur est disponible
  useEffect(() => {
    if (currentUser) {
      loadDailyStats()
      loadTodaysSales()
    }
  }, [currentUser])

  // Charger la configuration
  const loadSaleConfig = async () => {
    try {
      const { data, error } = await supabase
        .from('sale_config')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .single()
      
      if (error) return
      
      if (data) {
        setSaleConfig(data)
      }
    } catch (error) {
      console.error('Erreur chargement config:', error)
    }
  }

  // Charger les statistiques du jour pour l'utilisateur connecté
  const loadDailyStats = async () => {
    if (!currentUser) return
    
    try {
      setLoadingStats(true)
      
      // Date d'aujourd'hui
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const tomorrow = new Date(today)
      tomorrow.setDate(tomorrow.getDate() + 1)

      // Récupérer toutes les ventes du jour pour l'utilisateur
      const { data: sales, error } = await supabase
        .from('sale')
        .select('*')
        .eq('user_id', currentUser.id)
        .eq('status', 'completed')
        .gte('date_time', today.toISOString())
        .lt('date_time', tomorrow.toISOString())

      if (error) throw error

      // Calculer les statistiques
      let totalVentes = 0
      let totalMontantCDF = 0
      let totalMontantUSD = 0
      let ventesCDF = 0
      let ventesUSD = 0
      let totalTransactions = 0

      if (sales) {
        totalVentes = sales.length
        
        sales.forEach(sale => {
          const montant = sale.total || 0
          totalTransactions += montant
          
          if (sale.currency === 'USD') {
            ventesUSD += 1
            totalMontantUSD += montant
          } else {
            ventesCDF += 1
            totalMontantCDF += montant
          }
        })
      }

      const averageTransaction = totalVentes > 0 ? totalTransactions / totalVentes : 0

      setStats({
        totalVentes,
        totalMontantCDF: Math.round(totalMontantCDF),
        totalMontantUSD: Math.round(totalMontantUSD * 100) / 100,
        ventesCDF,
        ventesUSD,
        averageTransaction: Math.round(averageTransaction)
      })

    } catch (error) {
      console.error('Erreur chargement stats:', error)
    } finally {
      setLoadingStats(false)
    }
  }

  // Charger les ventes du jour pour l'utilisateur connecté
  const loadTodaysSales = async () => {
    if (!currentUser) return
    
    try {
      setLoadingSales(true)
      
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const tomorrow = new Date(today)
      tomorrow.setDate(tomorrow.getDate() + 1)

      const { data: sales, error } = await supabase
        .from('sale')
        .select(`
          *,
          client:customer_id(name, phone)
        `)
        .eq('user_id', currentUser.id)
        .gte('date_time', today.toISOString())
        .lt('date_time', tomorrow.toISOString())
        .order('date_time', { ascending: false })

      if (error) throw error

      setTodaysSales(sales || [])

    } catch (error) {
      console.error('Erreur chargement ventes:', error)
      setTodaysSales([])
    } finally {
      setLoadingSales(false)
    }
  }

  // Fonction appelée après une vente réussie
  const handleSaleCompleted = () => {
    loadDailyStats()
    loadTodaysSales()
  }

  // Fonctions utilitaires
  const formatCurrency = (amount, currency = 'CDF') => {
    const formatted = new Intl.NumberFormat('fr-FR', {
      minimumFractionDigits: currency === 'USD' ? 2 : 0,
      maximumFractionDigits: currency === 'USD' ? 2 : 0
    }).format(amount || 0)
    
    return currency === 'USD' ? `$${formatted}` : `${formatted} FC`
  }

  const getCurrencySymbol = (currency) => {
    return currency === 'USD' ? '$' : 'FC'
  }

  const getStatusConfig = (status) => {
    const configs = {
      completed: { 
        color: 'bg-green-100 text-green-800', 
        icon: CheckCircle, 
        label: 'Complétée' 
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
          CDF
        </span>
  }

  const handlePrintReceipt = (saleId) => {
    console.log('Impression reçu pour:', saleId)
  }

  const handleRefresh = () => {
    loadDailyStats()
    loadTodaysSales()
  }

  if (!currentUser) return null

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header avec Tabs */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <Link href='/vendor/mouvement'>
            <span className='bg-red-500 text-white p-2.5 rounded-2xl mb-3'>Creer une sortie</span>
            </Link>
            <p className="text-gray-600">Bienvenue, {currentUser.full_name}!</p>
          </div>
          
          {/* Tabs Navigation - Top Right */}
          <div className="flex items-center space-x-4">
            {/* Bouton de rafraîchissement */}
            <button
              onClick={handleRefresh}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              title="Rafraîchir les statistiques"
            >
              <RefreshCw className={`h-5 w-5 ${loadingStats ? 'animate-spin' : ''}`} />
            </button>
            
            {/* Tabs */}
            <div className="flex border border-gray-200 rounded-lg overflow-hidden bg-white">
              <button
                onClick={() => setActiveTab('newSale')}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  activeTab === 'newSale'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                Nouvelle vente
              </button>
              <button
                onClick={() => setActiveTab('todaySales')}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  activeTab === 'todaySales'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                Ventes du jour
              </button>
              <button
                onClick={() => setActiveTab('categories')}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  activeTab === 'categories'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                Catégories
              </button>
            </div>
          </div>
        </div>

        {/* Statistiques des ventes du jour */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-blue-600" />
              Statistiques du jour
            </h2>
            <span className="text-sm text-gray-500">
              {new Date().toLocaleDateString('fr-FR', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {/* Total des ventes */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total des ventes</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {loadingStats ? '...' : stats.totalVentes}
                  </p>
                </div>
                <div className="p-3 bg-blue-50 rounded-full">
                  <ShoppingBag className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <div className="mt-2 text-xs text-gray-500 flex justify-between">
                <span className="text-green-600">{stats.ventesCDF} FC</span>
                <span className="text-blue-600">{stats.ventesUSD} $</span>
              </div>
            </div>

            {/* Chiffre d'affaires en FC */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total en Francs</p>
                  <p className="text-2xl font-bold text-green-600 mt-1">
                    {loadingStats ? '...' : formatCurrency(stats.totalMontantCDF, 'CDF')}
                  </p>
                </div>
                <div className="p-3 bg-green-50 rounded-full">
                  <span className="text-lg font-bold text-green-600">FC</span>
                </div>
              </div>
              <div className="mt-2 text-xs text-gray-500">
                {stats.ventesCDF} vente{stats.ventesCDF !== 1 ? 's' : ''}
              </div>
            </div>

            {/* Chiffre d'affaires en USD */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total en Dollars</p>
                  <p className="text-2xl font-bold text-blue-600 mt-1">
                    {loadingStats ? '...' : `$${stats.totalMontantUSD?.toFixed(2) || '0.00'}`}
                  </p>
                </div>
                <div className="p-3 bg-blue-50 rounded-full">
                  <DollarSign className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <div className="mt-2 text-xs text-gray-500">
                {stats.ventesUSD} vente{stats.ventesUSD !== 1 ? 's' : ''}
              </div>
            </div>

            {/* Moyenne transaction */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Moyenne transaction</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {loadingStats ? '...' : formatCurrency(stats.averageTransaction, 'CDF')}
                  </p>
                </div>
                <div className="p-3 bg-purple-50 rounded-full">
                  <BarChart3 className="h-6 w-6 text-purple-600" />
                </div>
              </div>
              <div className="mt-2 text-xs text-gray-500">
                Par transaction
              </div>
            </div>

            {/* Taux de change */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Taux de change</p>
                  <p className="text-lg font-bold text-purple-600 mt-1">
                    1$ = {saleConfig.currency_rate?.toLocaleString('fr-FR') || '2,300'} FC
                  </p>
                </div>
                <div className="p-3 bg-orange-50 rounded-full">
                  <TrendingUp className="h-6 w-6 text-orange-600" />
                </div>
              </div>
              <div className="mt-2 text-xs text-gray-500">
                Pour référence seulement
              </div>
            </div>
          </div>
        </div>

        {/* Contenu des Tabs */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          {/* Tab Content */}
          <div className="p-4">
            
            {/* Tab 1: Nouvelle Vente */}
            {activeTab === 'newSale' && (
              <NouvelleVenteComponent onSaleCompleted={handleSaleCompleted} />
            )}

            {/* Tab 2: Ventes du Jour */}
            {activeTab === 'todaySales' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Ventes du jour ({todaysSales.length})
                  </h2>
                  <button
                    onClick={handleRefresh}
                    disabled={loadingSales}
                    className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm flex items-center"
                  >
                    <RefreshCw className={`w-4 h-4 mr-2 ${loadingSales ? 'animate-spin' : ''}`} />
                    Rafraîchir
                  </button>
                </div>
                
                {loadingSales ? (
                  <div className="bg-white rounded-lg border border-gray-200 p-8">
                    <div className="flex flex-col items-center justify-center space-y-4">
                      <Loader2 className="w-8 h-8 animate-spin text-gray-600" />
                      <div className="text-gray-500">Chargement des ventes...</div>
                    </div>
                  </div>
                ) : todaysSales.length > 0 ? (
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
                              Client
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Heure
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Montant
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
                          {todaysSales.map((vente) => {
                            const statusConfig = getStatusConfig(vente.status)
                            const Icon = statusConfig.icon
                            
                            return (
                              <tr key={vente.id} className="hover:bg-gray-50 transition">
                                {/* Facture */}
                                <td className="px-4 py-3">
                                  <div className="font-mono font-semibold text-sm text-gray-900">
                                    {vente.sale_number || `SALE-${vente.id}`}
                                  </div>
                                </td>

                                {/* Client */}
                                <td className="px-4 py-3">
                                  <div className="flex items-center space-x-2">
                                    <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                                      <User className="h-4 w-4 text-gray-600" />
                                    </div>
                                    <div>
                                      <div className="font-medium text-sm text-gray-900">
                                        {vente.client?.name || 'Client non spécifié'}
                                      </div>
                                      <div className="text-xs text-gray-500">
                                        {vente.client?.phone || 'Pas de téléphone'}
                                      </div>
                                    </div>
                                  </div>
                                </td>

                                {/* Heure */}
                                <td className="px-4 py-3 whitespace-nowrap">
                                  <div className="text-sm text-gray-900">
                                    {new Date(vente.date_time).toLocaleTimeString('fr-FR', {
                                      hour: '2-digit',
                                      minute: '2-digit'
                                    })}
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    {new Date(vente.date_time).toLocaleDateString('fr-FR', {
                                      day: '2-digit',
                                      month: '2-digit'
                                    })}
                                  </div>
                                </td>

                                {/* Montant - AFFICHAGE DIRECT SANS CONVERSION */}
                                <td className="px-4 py-3 whitespace-nowrap">
                                  <div className="font-semibold text-gray-900">
                                    {formatCurrency(vente.total, vente.currency)}
                                  </div>
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
                                      onClick={() => router.push(`/ventes/${vente.id}`)}
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
                      {todaysSales.map((vente) => {
                        const statusConfig = getStatusConfig(vente.status)
                        const Icon = statusConfig.icon
                        
                        return (
                          <div key={vente.id} className="p-4 hover:bg-gray-50 transition">
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex-1">
                                <div className="flex items-center justify-between mb-1">
                                  <div className="font-mono font-semibold text-gray-900">
                                    {vente.sale_number || `SALE-${vente.id}`}
                                  </div>
                                  <div className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${statusConfig.color}`}>
                                    <Icon className="w-3 h-3 mr-1" />
                                    {statusConfig.label}
                                  </div>
                                </div>
                                <div className="flex items-center space-x-2 text-sm text-gray-600">
                                  <User className="h-3 w-3" />
                                  <span>{vente.client?.name || 'Client non spécifié'}</span>
                                  <div className="ml-auto">
                                    {getCurrencyBadge(vente.currency)}
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4 mt-3">
                              <div>
                                <div className="text-xs text-gray-500">Heure</div>
                                <div className="text-sm font-medium">
                                  {new Date(vente.date_time).toLocaleTimeString('fr-FR', {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </div>
                              </div>
                              <div>
                                <div className="text-xs text-gray-500">Montant</div>
                                <div className="text-sm font-semibold text-gray-900">
                                  {formatCurrency(vente.total, vente.currency)}
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-200">
                              <div className="flex items-center space-x-2">
                                <span className="text-lg">{getPaymentMethodIcon(vente.payment_method)}</span>
                                <span className="text-sm capitalize">
                                  {getPaymentMethodLabel(vente.payment_method)}
                                </span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <button
                                  onClick={() => router.push(`/ventes/${vente.id}`)}
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
                        Aucune vente aujourd'hui
                      </h3>
                      <p className="text-gray-500 text-sm mb-4">
                        Commencez par effectuer votre première vente de la journée
                      </p>
                      <button
                        onClick={() => setActiveTab('newSale')}
                        className="inline-flex items-center px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition text-sm"
                      >
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Nouvelle vente
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Tab 3: Gestion des Catégories */}
            {activeTab === 'categories' && (
              <CategoryManager />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}