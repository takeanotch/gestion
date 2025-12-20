// 'use client'

// import { useState, useEffect } from 'react'
// import { supabase } from '@/lib/supabase'
// import { checkAuth } from '@/lib/auth'
// import {
//   Plus,
//   Trash2,
//   DollarSign,
//   ArrowDownRight,
//   ArrowUpRight,
//   Wallet,
//   Calendar,
//   RefreshCw,
//   Loader2,
//   AlertCircle,
//   X,
//   AlertTriangle
// } from 'lucide-react'

// export default function UserOutflowDashboard() {
//   const [user, setUser] = useState(null)
//   const [loading, setLoading] = useState(true)
//   const [outflows, setOutflows] = useState([])
//   const [showOutflowModal, setShowOutflowModal] = useState(false)
//   const [todayStats, setTodayStats] = useState({
//     totalReceiptCDF: 0,
//     totalReceiptUSD: 0,
//     totalOutflowCDF: 0,
//     totalOutflowUSD: 0,
//     netBalanceCDF: 0,
//     netBalanceUSD: 0
//   })
//   const [newOutflow, setNewOutflow] = useState({
//     amount: '',
//     currency: 'CDF',
//     reason: '',
//     category: 'Divers'
//   })
//   const [saleConfig, setSaleConfig] = useState({
//     vat_amount: 20.00,
//     currency_rate: 2300.00,
//     base_currency: 'USD'
//   })
//   const [error, setError] = useState('')
//   const [debugInfo, setDebugInfo] = useState('')

//   // Catégories de dépenses
//   const categories = [
//     { value: 'Transport', label: 'Transport', color: '#8884d8' },
//     { value: 'Fournitures', label: 'Fournitures', color: '#82ca9d' },
//     { value: 'Salaires', label: 'Salaires', color: '#ffc658' },
//     { value: 'Loyer', label: 'Loyer', color: '#ff8042' },
//     { value: 'Électricité', label: 'Électricité', color: '#0088fe' },
//     { value: 'Internet', label: 'Internet', color: '#00c49f' },
//     { value: 'Marketing', label: 'Marketing', color: '#ffbb28' },
//     { value: 'Divers', label: 'Divers', color: '#ff6b6b' }
//   ]

//   useEffect(() => {
//     const init = async () => {
//       setLoading(true)
//       setError('')
//       setDebugInfo('Initialisation...')
      
//       try {
//         const currentUser = checkAuth()
//         console.log('User from checkAuth:', currentUser)
        
//         if (!currentUser) {
//           setError('Aucun utilisateur connecté')
//           setDebugInfo('checkAuth a retourné null')
//           setLoading(false)
//           return
//         }
        
//         setUser(currentUser)
//         setDebugInfo(`Utilisateur trouvé: ${currentUser.id} - ${currentUser.email}`)
        
//         await Promise.all([
//           loadSaleConfig(),
//           loadTodayStats(currentUser.id),
//           loadTodayOutflows(currentUser.id)
//         ])
        
//         setDebugInfo('Initialisation terminée avec succès')
//       } catch (err) {
//         console.error('Erreur lors de l\'initialisation:', err)
//         setError(`Erreur d'initialisation: ${err.message}`)
//         setDebugInfo(`Erreur catch: ${err.toString()}`)
//       } finally {
//         setLoading(false)
//       }
//     }
    
//     init()
//   }, [])

//   const loadSaleConfig = async () => {
//     try {
//       console.log('Chargement de sale_config...')
//       const { data, error: configError } = await supabase
//         .from('sale_config')
//         .select('*')
//         .order('created_at', { ascending: false })
//         .limit(1)
//         .single()
      
//       if (configError) {
//         console.error('Erreur sale_config:', configError)
//         setDebugInfo(`Erreur sale_config: ${configError.message}`)
//         return
//       }
      
//       console.log('sale_config chargé:', data)
//       if (data) {
//         setSaleConfig(data)
//         setDebugInfo(prev => prev + ` | sale_config: ${JSON.stringify(data)}`)
//       }
//     } catch (err) {
//       console.error('Exception loadSaleConfig:', err)
//       setDebugInfo(prev => prev + ` | Exception sale_config: ${err.message}`)
//     }
//   }

//   const loadTodayStats = async (userId) => {
//     try {
//       const today = new Date().toISOString().split('T')[0]
//       console.log(`Chargement stats pour ${userId} le ${today}`)
      
//       // Récupérer le rapport journalier de l'utilisateur
//       const { data: report, error: reportError } = await supabase
//         .from('daily_user_financial_report')
//         .select('*')
//         .eq('report_date', today)
//         .eq('user_id', userId)
//         .single()
      
//       if (reportError && reportError.code !== 'PGRST116') {
//         console.error('Erreur rapport:', reportError)
//         setDebugInfo(prev => prev + ` | Erreur rapport: ${reportError.message}`)
//       }
      
//       if (report) {
//         console.log('Rapport trouvé:', report)
//         setTodayStats({
//           totalReceiptCDF: report.total_receipt_cdf || 0,
//           totalReceiptUSD: report.total_receipt_usd || 0,
//           totalOutflowCDF: report.total_outflow_cdf || 0,
//           totalOutflowUSD: report.total_outflow_usd || 0,
//           netBalanceCDF: report.balance_cdf || 0,
//           netBalanceUSD: report.balance_usd || 0
//         })
//         setDebugInfo(prev => prev + ` | Rapport chargé: ${JSON.stringify(report)}`)
//       } else {
//         console.log('Pas de rapport, calcul manuel...')
//         await calculateTodayStats(userId)
//       }
//     } catch (err) {
//       console.error('Exception loadTodayStats:', err)
//       setDebugInfo(prev => prev + ` | Exception stats: ${err.message}`)
//       await calculateTodayStats(userId)
//     }
//   }

//   const calculateTodayStats = async (userId) => {
//     try {
//       const today = new Date().toISOString().split('T')[0]
//       console.log(`Calcul manuel stats pour ${userId} le ${today}`)
      
//       // Recettes du jour (ventes)
//       const { data: salesData, error: salesError } = await supabase
//         .from('sale')
//         .select('total, currency, currency_rate')
//         .eq('user_id', userId)
//         .eq('status', 'completed')
//         .eq('payment_status', 'paid')
//         .gte('created_at', `${today}T00:00:00`)
//         .lte('created_at', `${today}T23:59:59`)
      
//       if (salesError) {
//         console.error('Erreur ventes:', salesError)
//         setDebugInfo(prev => prev + ` | Erreur ventes: ${salesError.message}`)
//       }
      
//       // Dépenses du jour (sorties)
//       const { data: outflowsData, error: outflowsError } = await supabase
//         .from('cash_outflow')
//         .select('amount, currency, currency_rate')
//         .eq('user_id', userId)
//         .eq('date', today)
//         .eq('status', 'completed')
      
//       if (outflowsError) {
//         console.error('Erreur sorties:', outflowsError)
//         setDebugInfo(prev => prev + ` | Erreur sorties: ${outflowsError.message}`)
//       }
      
//       console.log('Ventes trouvées:', salesData?.length || 0)
//       console.log('Sorties trouvées:', outflowsData?.length || 0)
      
//       let totalReceiptCDF = 0
//       let totalReceiptUSD = 0
//       let totalOutflowCDF = 0
//       let totalOutflowUSD = 0
      
//       if (salesData) {
//         salesData.forEach(sale => {
//           const montant = sale.total || 0
          
//           if (sale.currency === 'USD') {
//             totalReceiptUSD += montant
//             const tauxVente = sale.currency_rate || saleConfig.currency_rate || 1
//             const montantCDF = montant * tauxVente
//             totalReceiptCDF += montantCDF
//           } else {
//             totalReceiptCDF += montant
//           }
//         })
//       }
      
//       if (outflowsData) {
//         outflowsData.forEach(outflow => {
//           const montant = outflow.amount || 0
          
//           if (outflow.currency === 'USD') {
//             totalOutflowUSD += montant
//             const tauxOutflow = outflow.currency_rate || saleConfig.currency_rate || 1
//             const montantCDF = montant * tauxOutflow
//             totalOutflowCDF += montantCDF
//           } else {
//             totalOutflowCDF += montant
//           }
//         })
//       }
      
//       const netBalanceCDF = totalReceiptCDF - totalOutflowCDF
//       const netBalanceUSD = totalReceiptUSD - totalOutflowUSD
      
//       console.log('Stats calculées:', {
//         totalReceiptCDF, totalReceiptUSD,
//         totalOutflowCDF, totalOutflowUSD,
//         netBalanceCDF, netBalanceUSD
//       })
      
//       setTodayStats({
//         totalReceiptCDF: Math.round(totalReceiptCDF),
//         totalReceiptUSD: Math.round(totalReceiptUSD * 100) / 100,
//         totalOutflowCDF: Math.round(totalOutflowCDF),
//         totalOutflowUSD: Math.round(totalOutflowUSD * 100) / 100,
//         netBalanceCDF: Math.round(netBalanceCDF),
//         netBalanceUSD: Math.round(netBalanceUSD * 100) / 100
//       })
      
//       setDebugInfo(prev => prev + ` | Stats calculées: R=${totalReceiptCDF}, D=${totalOutflowCDF}`)
//     } catch (err) {
//       console.error('Exception calculateTodayStats:', err)
//       setDebugInfo(prev => prev + ` | Exception calculate: ${err.message}`)
//     }
//   }

//   const loadTodayOutflows = async (userId) => {
//     try {
//       const today = new Date().toISOString().split('T')[0]
//       console.log(`Chargement sorties pour ${userId} le ${today}`)
      
//       const { data, error: outflowsError } = await supabase
//         .from('cash_outflow')
//         .select('*')
//         .eq('user_id', userId)
//         .eq('date', today)
//         .eq('status', 'completed')
//         .order('created_at', { ascending: false })
      
//       if (outflowsError) {
//         console.error('Erreur chargement sorties:', outflowsError)
//         setDebugInfo(prev => prev + ` | Erreur load outflows: ${outflowsError.message}`)
//         return
//       }
      
//       console.log('Sorties chargées:', data?.length || 0)
//       setOutflows(data || [])
//       setDebugInfo(prev => prev + ` | Outflows chargées: ${data?.length || 0}`)
//     } catch (err) {
//       console.error('Exception loadTodayOutflows:', err)
//       setDebugInfo(prev => prev + ` | Exception load outflows: ${err.message}`)
//     }
//   }

//   const handleCreateOutflow = async () => {
//     console.log('handleCreateOutflow appelé')
//     console.log('Nouvelle sortie:', newOutflow)
    
//     if (!newOutflow.amount || parseFloat(newOutflow.amount) <= 0) {
//       setError('Veuillez entrer un montant valide')
//       setDebugInfo('Montant invalide ou vide')
//       return
//     }

//     if (!newOutflow.reason.trim()) {
//       setError('Veuillez entrer un motif')
//       setDebugInfo('Motif vide')
//       return
//     }

//     if (!user) {
//       setError('Session expirée, veuillez vous reconnecter')
//       setDebugInfo('User est null')
//       return
//     }

//     setError('')
//     setDebugInfo(`Création sortie pour user ${user.id}`)

//     try {
//       const outflowData = {
//         amount: parseFloat(newOutflow.amount),
//         currency: newOutflow.currency,
//         currency_rate: newOutflow.currency === 'USD' ? saleConfig.currency_rate : 1.0,
//         reason: newOutflow.reason.trim(),
//         category: newOutflow.category,
//         user_id: user.id,
//         date: new Date().toISOString().split('T')[0]
//       }

//       console.log('Données à insérer:', outflowData)

//       const { data, error: insertError } = await supabase
//         .from('cash_outflow')
//         .insert([outflowData])
//         .select()

//       if (insertError) {
//         console.error('Erreur Supabase insert:', insertError)
//         setError(`Erreur Supabase: ${insertError.message}`)
//         setDebugInfo(`Erreur insert: ${JSON.stringify(insertError)}`)
//         return
//       }

//       console.log('Sortie créée avec succès:', data)

//       setNewOutflow({
//         amount: '',
//         currency: 'CDF',
//         reason: '',
//         category: 'Divers'
//       })
      
//       setShowOutflowModal(false)
      
//       // Recharger les données
//       await loadTodayStats(user.id)
//       await loadTodayOutflows(user.id)
      
//       setDebugInfo('Sortie créée avec succès')
      
//     } catch (err) {
//       console.error('Exception handleCreateOutflow:', err)
//       setError(`Erreur lors de l'enregistrement: ${err.message}`)
//       setDebugInfo(`Exception: ${err.toString()}`)
//     }
//   }

//   const handleDeleteOutflow = async (outflowId) => {
//     if (!confirm('Voulez-vous vraiment supprimer cette sortie ?')) {
//       return
//     }

//     try {
//       console.log(`Suppression sortie ${outflowId} pour user ${user.id}`)
      
//       const { error: deleteError } = await supabase
//         .from('cash_outflow')
//         .update({ status: 'cancelled' })
//         .eq('id', outflowId)
//         .eq('user_id', user.id)

//       if (deleteError) {
//         console.error('Erreur suppression:', deleteError)
//         setError(`Erreur suppression: ${deleteError.message}`)
//         setDebugInfo(`Erreur delete: ${JSON.stringify(deleteError)}`)
//         return
//       }

//       // Recharger les données
//       await loadTodayStats(user.id)
//       await loadTodayOutflows(user.id)
      
//       console.log('Sortie annulée avec succès')
//       setDebugInfo('Sortie annulée avec succès')
      
//     } catch (err) {
//       console.error('Exception handleDeleteOutflow:', err)
//       setError(`Erreur lors de l'annulation: ${err.message}`)
//       setDebugInfo(`Exception delete: ${err.toString()}`)
//     }
//   }

//   const formatCurrency = (amount, currency = 'CDF') => {
//     const formatted = new Intl.NumberFormat('fr-FR', {
//       minimumFractionDigits: currency === 'CDF' ? 0 : 2,
//       maximumFractionDigits: currency === 'CDF' ? 0 : 2
//     }).format(amount || 0)
    
//     return `${currency === 'USD' ? '$' : 'FC'} ${formatted}`
//   }

//   const getCategoryColor = (category) => {
//     const cat = categories.find(c => c.value === category)
//     return cat ? cat.color : '#6b7280'
//   }

//   const handleRefresh = async () => {
//     if (!user) return
    
//     setLoading(true)
//     setError('')
//     setDebugInfo('Rafraîchissement...')
    
//     await Promise.all([
//       loadTodayStats(user.id),
//       loadTodayOutflows(user.id)
//     ])
    
//     setLoading(false)
//     setDebugInfo(prev => prev + ' | Rafraîchi')
//   }

//   if (loading) {
//     return (
//       <div className="flex flex-col items-center justify-center h-screen p-4">
//         <Loader2 className="w-8 h-8 animate-spin text-gray-600 mx-auto mb-4" />
//         <p className="text-gray-500">Chargement...</p>
//         {debugInfo && (
//           <div className="mt-4 p-3 bg-gray-100 rounded text-xs text-gray-600 max-w-lg">
//             Debug: {debugInfo}
//           </div>
//         )}
//       </div>
//     )
//   }

//   if (!user) {
//     return (
//       <div className="p-4">
//         <div className="bg-red-50 border border-red-200 rounded-lg p-4">
//           <div className="flex items-center">
//             <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
//             <span className="text-red-700">
//               Session expirée, veuillez vous reconnecter
//             </span>
//           </div>
//         </div>
//         {debugInfo && (
//           <div className="mt-4 p-3 bg-gray-100 rounded text-xs text-gray-600">
//             Debug: {debugInfo}
//           </div>
//         )}
//       </div>
//     )
//   }

//   return (
//     <div className="p-4 sm:p-6">
//       {/* Debug Info - Toujours visible */}
//       <div className="mb-4">
//         <div className="flex items-center justify-between">
//           <h2 className="text-sm font-medium text-gray-700 flex items-center">
//             <AlertTriangle className="w-4 h-4 mr-2 text-yellow-500" />
//             Info Debug
//           </h2>
//           <button
//             onClick={() => setDebugInfo('')}
//             className="text-xs text-gray-500 hover:text-gray-700"
//           >
//             Effacer
//           </button>
//         </div>
//         {debugInfo && (
//           <div className="mt-2 p-3 bg-gray-100 rounded text-xs text-gray-600 font-mono whitespace-pre-wrap break-all">
//             {debugInfo}
//           </div>
//         )}
//       </div>

//       {/* Header */}
//       <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
//         <div>
//           <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
//             Tableau de bord journalier
//           </h1>
//           <p className="text-gray-500 text-sm mt-1">
//             Aujourd'hui • <span className="font-medium">{user.full_name || user.email}</span>
//           </p>
//         </div>
        
//         <div className="flex items-center space-x-2">
//           <button
//             onClick={handleRefresh}
//             disabled={loading}
//             className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm disabled:opacity-50"
//           >
//             <RefreshCw className="w-4 h-4" />
//             <span>Actualiser</span>
//           </button>
//           <button
//             onClick={() => setShowOutflowModal(true)}
//             className="flex items-center space-x-2 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm"
//           >
//             <ArrowDownRight className="w-4 h-4" />
//             <span>Nouvelle sortie</span>
//           </button>
//         </div>
//       </div>

//       {/* Messages d'erreur */}
//       {error && (
//         <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
//           <div className="flex items-center">
//             <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
//             <span className="text-red-700">{error}</span>
//           </div>
//         </div>
//       )}

//       {/* Cartes de statistiques */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
//         {/* Recette */}
//         <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg p-4">
//           <div className="flex items-center justify-between mb-4">
//             <div className="text-green-800">
//               <ArrowUpRight className="w-6 h-6" />
//             </div>
//             <div className="text-xs font-medium text-green-800 bg-green-200 px-2 py-1 rounded">
//               Recette du jour
//             </div>
//           </div>
//           <div className="space-y-2">
//             <div className="text-lg font-bold text-green-900">
//               {formatCurrency(todayStats.totalReceiptCDF)}
//             </div>
//             <div className="text-sm text-green-700 flex items-center">
//               <DollarSign className="w-3 h-3 mr-1" />
//               <span>{todayStats.totalReceiptUSD.toFixed(2)} USD</span>
//             </div>
//           </div>
//         </div>

//         {/* Dépense */}
//         <div className="bg-gradient-to-br from-red-50 to-red-100 border border-red-200 rounded-lg p-4">
//           <div className="flex items-center justify-between mb-4">
//             <div className="text-red-800">
//               <ArrowDownRight className="w-6 h-6" />
//             </div>
//             <div className="text-xs font-medium text-red-800 bg-red-200 px-2 py-1 rounded">
//               Dépense du jour
//             </div>
//           </div>
//           <div className="space-y-2">
//             <div className="text-lg font-bold text-red-900">
//               {formatCurrency(todayStats.totalOutflowCDF)}
//             </div>
//             <div className="text-sm text-red-700 flex items-center">
//               <DollarSign className="w-3 h-3 mr-1" />
//               <span>{todayStats.totalOutflowUSD.toFixed(2)} USD</span>
//             </div>
//           </div>
//         </div>

//         {/* Solde net */}
//         <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-4">
//           <div className="flex items-center justify-between mb-4">
//             <div className="text-blue-800">
//               <Wallet className="w-6 h-6" />
//             </div>
//             <div className="text-xs font-medium text-blue-800 bg-blue-200 px-2 py-1 rounded">
//               Solde net
//             </div>
//           </div>
//           <div className="space-y-2">
//             <div className={`text-lg font-bold ${todayStats.netBalanceCDF >= 0 ? 'text-blue-900' : 'text-red-900'}`}>
//               {formatCurrency(todayStats.netBalanceCDF)}
//             </div>
//             <div className={`text-sm flex items-center ${todayStats.netBalanceUSD >= 0 ? 'text-blue-700' : 'text-red-700'}`}>
//               <DollarSign className="w-3 h-3 mr-1" />
//               <span>{todayStats.netBalanceUSD.toFixed(2)} USD</span>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Liste des sorties du jour */}
//       <div className="bg-white rounded-lg border border-gray-200 mb-6">
//         <div className="p-4 border-b border-gray-200">
//           <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
//             <h3 className="text-lg font-semibold text-gray-900 flex items-center">
//               <ArrowDownRight className="w-5 h-5 mr-2 text-red-600" />
//               Sorties d'aujourd'hui
//             </h3>
//             <div className="flex items-center space-x-2 text-sm text-gray-500">
//               <Calendar className="w-4 h-4" />
//               <span>{new Date().toLocaleDateString('fr-FR', {
//                 weekday: 'long',
//                 year: 'numeric',
//                 month: 'long',
//                 day: 'numeric'
//               })}</span>
//             </div>
//           </div>
//         </div>
        
//         {outflows.length > 0 ? (
//           <div className="overflow-x-auto">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
//                     N° Sortie
//                   </th>
//                   <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
//                     Catégorie
//                   </th>
//                   <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
//                     Motif
//                   </th>
//                   <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
//                     Montant
//                   </th>
//                   <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
//                     Heure
//                   </th>
//                   <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
//                     Actions
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-gray-200">
//                 {outflows.map((outflow) => (
//                   <tr key={outflow.id} className="hover:bg-gray-50">
//                     <td className="px-4 py-3 whitespace-nowrap">
//                       <div className="font-mono text-sm text-gray-900">
//                         {outflow.outflow_number || 'N/A'}
//                       </div>
//                     </td>
//                     <td className="px-4 py-3">
//                       <span
//                         className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
//                         style={{ 
//                           backgroundColor: `${getCategoryColor(outflow.category)}20`,
//                           color: getCategoryColor(outflow.category)
//                         }}
//                       >
//                         {outflow.category}
//                       </span>
//                     </td>
//                     <td className="px-4 py-3">
//                       <div className="text-sm text-gray-900 max-w-xs truncate">
//                         {outflow.reason}
//                       </div>
//                     </td>
//                     <td className="px-4 py-3">
//                       <div className={`text-sm font-semibold ${outflow.currency === 'USD' ? 'text-blue-600' : 'text-red-600'}`}>
//                         {formatCurrency(outflow.amount, outflow.currency)}
//                       </div>
//                       {outflow.currency === 'USD' && outflow.currency_rate && (
//                         <div className="text-xs text-gray-500">
//                           ≈ {formatCurrency(outflow.amount * outflow.currency_rate, 'CDF')}
//                         </div>
//                       )}
//                     </td>
//                     <td className="px-4 py-3 whitespace-nowrap">
//                       <div className="text-sm text-gray-500">
//                         {new Date(outflow.created_at).toLocaleTimeString('fr-FR', {
//                           hour: '2-digit',
//                           minute: '2-digit'
//                         })}
//                       </div>
//                     </td>
//                     <td className="px-4 py-3 whitespace-nowrap">
//                       <button
//                         onClick={() => handleDeleteOutflow(outflow.id)}
//                         className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
//                         title="Supprimer"
//                       >
//                         <Trash2 className="w-4 h-4" />
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         ) : (
//           <div className="p-8 text-center">
//             <ArrowDownRight className="w-12 h-12 text-gray-400 mx-auto mb-3" />
//             <h4 className="text-gray-900 font-medium mb-1">
//               Aucune sortie aujourd'hui
//             </h4>
//             <p className="text-gray-500 text-sm mb-4">
//               Enregistrez votre première sortie de caisse
//             </p>
//             <button
//               onClick={() => setShowOutflowModal(true)}
//               className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm"
//             >
//               <ArrowDownRight className="w-4 h-4 mr-2" />
//               Nouvelle sortie
//             </button>
//           </div>
//         )}
//       </div>

//       {/* Modal pour nouvelle sortie */}
//       {showOutflowModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//           <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
//             <div className="p-6">
//               <div className="flex items-center justify-between mb-4">
//                 <h3 className="text-lg font-semibold text-gray-900">
//                   Nouvelle sortie de caisse
//                 </h3>
//                 <button
//                   onClick={() => setShowOutflowModal(false)}
//                   className="p-1 hover:bg-gray-100 rounded"
//                 >
//                   <X className="w-5 h-5" />
//                 </button>
//               </div>
              
//               <div className="space-y-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Montant *
//                   </label>
//                   <div className="flex gap-2">
//                     <input
//                       type="number"
//                       step="0.01"
//                       min="0.01"
//                       value={newOutflow.amount}
//                       onChange={(e) => setNewOutflow({...newOutflow, amount: e.target.value})}
//                       className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-red-600 focus:border-red-600 text-sm"
//                       placeholder="0.00"
//                     />
//                     <select
//                       value={newOutflow.currency}
//                       onChange={(e) => setNewOutflow({...newOutflow, currency: e.target.value})}
//                       className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-red-600 focus:border-red-600 bg-white text-sm"
//                     >
//                       <option value="CDF">CDF</option>
//                       <option value="USD">USD</option>
//                     </select>
//                   </div>
//                   {newOutflow.currency === 'USD' && (
//                     <p className="text-xs text-gray-500 mt-1">
//                       Taux: 1$ = {saleConfig.currency_rate?.toLocaleString('fr-FR') || '2,300'} FC
//                     </p>
//                   )}
//                 </div>
                
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Catégorie
//                   </label>
//                   <select
//                     value={newOutflow.category}
//                     onChange={(e) => setNewOutflow({...newOutflow, category: e.target.value})}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-red-600 focus:border-red-600 bg-white text-sm"
//                   >
//                     {categories.map(cat => (
//                       <option key={cat.value} value={cat.value}>
//                         {cat.label}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
                
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Motif *
//                   </label>
//                   <textarea
//                     value={newOutflow.reason}
//                     onChange={(e) => setNewOutflow({...newOutflow, reason: e.target.value})}
//                     rows="3"
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-red-600 focus:border-red-600 text-sm"
//                     placeholder="Décrivez le motif de cette sortie..."
//                   />
//                 </div>
                
//                 <div className="pt-4 border-t border-gray-200">
//                   <div className="flex space-x-3">
//                     <button
//                       onClick={() => setShowOutflowModal(false)}
//                       className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm"
//                     >
//                       Annuler
//                     </button>
//                     <button
//                       onClick={handleCreateOutflow}
//                       className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm"
//                     >
//                       Enregistrer
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }
'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { checkAuth } from '@/lib/auth'
import {
  Plus,
  Trash2,
  DollarSign,
  ArrowDownRight,
  ArrowUpRight,
  Wallet,
  Calendar,
  RefreshCw,
  Loader2,
  AlertCircle,
  X,
  AlertTriangle
} from 'lucide-react'

export default function UserOutflowDashboard() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [outflows, setOutflows] = useState([])
  const [showOutflowModal, setShowOutflowModal] = useState(false)
  const [todayStats, setTodayStats] = useState({
    totalReceiptCDF: 0,
    totalReceiptUSD: 0,
    totalOutflowCDF: 0,
    totalOutflowUSD: 0,
    netBalanceCDF: 0,
    netBalanceUSD: 0
  })
  const [newOutflow, setNewOutflow] = useState({
    amount: '',
    currency: 'CDF',
    reason: '',
    category: 'Divers'
  })
  const [saleConfig, setSaleConfig] = useState({
    vat_amount: 20.00,
    currency_rate: 2300.00,
    base_currency: 'USD'
  })
  const [error, setError] = useState('')
  const [debugInfo, setDebugInfo] = useState('')

  // Catégories de dépenses
  const categories = [
    { value: 'Transport', label: 'Transport', color: '#8884d8' },
    { value: 'Fournitures', label: 'Fournitures', color: '#82ca9d' },
    { value: 'Salaires', label: 'Salaires', color: '#ffc658' },
    { value: 'Loyer', label: 'Loyer', color: '#ff8042' },
    { value: 'Électricité', label: 'Électricité', color: '#0088fe' },
    { value: 'Internet', label: 'Internet', color: '#00c49f' },
    { value: 'Marketing', label: 'Marketing', color: '#ffbb28' },
    { value: 'Divers', label: 'Divers', color: '#ff6b6b' }
  ]

  useEffect(() => {
    const init = async () => {
      setLoading(true)
      setError('')
      setDebugInfo('Initialisation...')
      
      try {
        const currentUser = checkAuth()
        console.log('User from checkAuth:', currentUser)
        
        if (!currentUser) {
          setError('Aucun utilisateur connecté')
          setDebugInfo('checkAuth a retourné null')
          setLoading(false)
          return
        }
        
        setUser(currentUser)
        setDebugInfo(`Utilisateur trouvé: ${currentUser.id} - ${currentUser.email}`)
        
        await Promise.all([
          loadSaleConfig(),
          loadTodayStats(currentUser.id),
          loadTodayOutflows(currentUser.id)
        ])
        
        setDebugInfo('Initialisation terminée avec succès')
      } catch (err) {
        console.error('Erreur lors de l\'initialisation:', err)
        setError(`Erreur d'initialisation: ${err.message}`)
        setDebugInfo(`Erreur catch: ${err.toString()}`)
      } finally {
        setLoading(false)
      }
    }
    
    init()
  }, [])

  const loadSaleConfig = async () => {
    try {
      console.log('Chargement de sale_config...')
      const { data, error: configError } = await supabase
        .from('sale_config')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .single()
      
      if (configError) {
        console.error('Erreur sale_config:', configError)
        setDebugInfo(`Erreur sale_config: ${configError.message}`)
        return
      }
      
      console.log('sale_config chargé:', data)
      if (data) {
        setSaleConfig(data)
        setDebugInfo(prev => prev + ` | sale_config: ${JSON.stringify(data)}`)
      }
    } catch (err) {
      console.error('Exception loadSaleConfig:', err)
      setDebugInfo(prev => prev + ` | Exception sale_config: ${err.message}`)
    }
  }

  const loadTodayStats = async (userId) => {
    try {
      const today = new Date().toISOString().split('T')[0]
      console.log(`Chargement stats pour ${userId} le ${today}`)
      
      // Récupérer le rapport journalier de l'utilisateur
      const { data: report, error: reportError } = await supabase
        .from('daily_user_financial_report')
        .select('*')
        .eq('report_date', today)
        .eq('user_id', userId)
        .single()
      
      if (reportError && reportError.code !== 'PGRST116') {
        console.error('Erreur rapport:', reportError)
        setDebugInfo(prev => prev + ` | Erreur rapport: ${reportError.message}`)
      }
      
      if (report) {
        console.log('Rapport trouvé:', report)
        setTodayStats({
          totalReceiptCDF: report.total_receipt_cdf || 0,
          totalReceiptUSD: report.total_receipt_usd || 0,
          totalOutflowCDF: report.total_outflow_cdf || 0,
          totalOutflowUSD: report.total_outflow_usd || 0,
          netBalanceCDF: report.balance_cdf || 0,
          netBalanceUSD: report.balance_usd || 0
        })
        setDebugInfo(prev => prev + ` | Rapport chargé: ${JSON.stringify(report)}`)
      } else {
        console.log('Pas de rapport, calcul manuel...')
        await calculateTodayStats(userId)
      }
    } catch (err) {
      console.error('Exception loadTodayStats:', err)
      setDebugInfo(prev => prev + ` | Exception stats: ${err.message}`)
      await calculateTodayStats(userId)
    }
  }

  const calculateTodayStats = async (userId) => {
    try {
      const today = new Date().toISOString().split('T')[0]
      console.log(`Calcul manuel stats pour ${userId} le ${today}`)
      
      // Recettes du jour (ventes)
      const { data: salesData, error: salesError } = await supabase
        .from('sale')
        .select('total, currency, currency_rate')
        .eq('user_id', userId)
        .eq('status', 'completed')
        .eq('payment_status', 'paid')
        .gte('created_at', `${today}T00:00:00`)
        .lte('created_at', `${today}T23:59:59`)
      
      if (salesError) {
        console.error('Erreur ventes:', salesError)
        setDebugInfo(prev => prev + ` | Erreur ventes: ${salesError.message}`)
      }
      
      // Dépenses du jour (sorties)
      const { data: outflowsData, error: outflowsError } = await supabase
        .from('cash_outflow')
        .select('amount, currency, currency_rate')
        .eq('user_id', userId)
        .eq('date', today)
        .eq('status', 'completed')
      
      if (outflowsError) {
        console.error('Erreur sorties:', outflowsError)
        setDebugInfo(prev => prev + ` | Erreur sorties: ${outflowsError.message}`)
      }
      
      console.log('Ventes trouvées:', salesData?.length || 0)
      console.log('Sorties trouvées:', outflowsData?.length || 0)
      
      let totalReceiptCDF = 0
      let totalReceiptUSD = 0
      let totalOutflowCDF = 0
      let totalOutflowUSD = 0
      
      if (salesData) {
        salesData.forEach(sale => {
          const montant = sale.total || 0
          
          if (sale.currency === 'USD') {
            totalReceiptUSD += montant
          } else {
            totalReceiptCDF += montant
          }
        })
      }
      
      if (outflowsData) {
        outflowsData.forEach(outflow => {
          const montant = outflow.amount || 0
          
          if (outflow.currency === 'USD') {
            totalOutflowUSD += montant
          } else {
            totalOutflowCDF += montant
          }
        })
      }
      
      const netBalanceCDF = totalReceiptCDF - totalOutflowCDF
      const netBalanceUSD = totalReceiptUSD - totalOutflowUSD
      
      console.log('Stats calculées:', {
        totalReceiptCDF, totalReceiptUSD,
        totalOutflowCDF, totalOutflowUSD,
        netBalanceCDF, netBalanceUSD
      })
      
      setTodayStats({
        totalReceiptCDF: Math.round(totalReceiptCDF),
        totalReceiptUSD: parseFloat(totalReceiptUSD.toFixed(2)),
        totalOutflowCDF: Math.round(totalOutflowCDF),
        totalOutflowUSD: parseFloat(totalOutflowUSD.toFixed(2)),
        netBalanceCDF: Math.round(netBalanceCDF),
        netBalanceUSD: parseFloat(netBalanceUSD.toFixed(2))
      })
      
      setDebugInfo(prev => prev + ` | Stats calculées: R(CDF)=${totalReceiptCDF}, R(USD)=${totalReceiptUSD}, D(CDF)=${totalOutflowCDF}, D(USD)=${totalOutflowUSD}`)
    } catch (err) {
      console.error('Exception calculateTodayStats:', err)
      setDebugInfo(prev => prev + ` | Exception calculate: ${err.message}`)
    }
  }

  const loadTodayOutflows = async (userId) => {
    try {
      const today = new Date().toISOString().split('T')[0]
      console.log(`Chargement sorties pour ${userId} le ${today}`)
      
      const { data, error: outflowsError } = await supabase
        .from('cash_outflow')
        .select('*')
        .eq('user_id', userId)
        .eq('date', today)
        .eq('status', 'completed')
        .order('created_at', { ascending: false })
      
      if (outflowsError) {
        console.error('Erreur chargement sorties:', outflowsError)
        setDebugInfo(prev => prev + ` | Erreur load outflows: ${outflowsError.message}`)
        return
      }
      
      console.log('Sorties chargées:', data?.length || 0)
      setOutflows(data || [])
      setDebugInfo(prev => prev + ` | Outflows chargées: ${data?.length || 0}`)
    } catch (err) {
      console.error('Exception loadTodayOutflows:', err)
      setDebugInfo(prev => prev + ` | Exception load outflows: ${err.message}`)
    }
  }

  const handleCreateOutflow = async () => {
    console.log('handleCreateOutflow appelé')
    console.log('Nouvelle sortie:', newOutflow)
    
    if (!newOutflow.amount || parseFloat(newOutflow.amount) <= 0) {
      setError('Veuillez entrer un montant valide')
      setDebugInfo('Montant invalide ou vide')
      return
    }

    if (!newOutflow.reason.trim()) {
      setError('Veuillez entrer un motif')
      setDebugInfo('Motif vide')
      return
    }

    if (!user) {
      setError('Session expirée, veuillez vous reconnecter')
      setDebugInfo('User est null')
      return
    }

    setError('')
    setDebugInfo(`Création sortie pour user ${user.id}`)

    try {
      const outflowData = {
        amount: parseFloat(newOutflow.amount),
        currency: newOutflow.currency,
        currency_rate: newOutflow.currency === 'USD' ? saleConfig.currency_rate : 1.0,
        reason: newOutflow.reason.trim(),
        category: newOutflow.category,
        user_id: user.id,
        date: new Date().toISOString().split('T')[0]
      }

      console.log('Données à insérer:', outflowData)

      const { data, error: insertError } = await supabase
        .from('cash_outflow')
        .insert([outflowData])
        .select()

      if (insertError) {
        console.error('Erreur Supabase insert:', insertError)
        setError(`Erreur Supabase: ${insertError.message}`)
        setDebugInfo(`Erreur insert: ${JSON.stringify(insertError)}`)
        return
      }

      console.log('Sortie créée avec succès:', data)

      setNewOutflow({
        amount: '',
        currency: 'CDF',
        reason: '',
        category: 'Divers'
      })
      
      setShowOutflowModal(false)
      
      // Recharger les données
      await loadTodayStats(user.id)
      await loadTodayOutflows(user.id)
      
      setDebugInfo('Sortie créée avec succès')
      
    } catch (err) {
      console.error('Exception handleCreateOutflow:', err)
      setError(`Erreur lors de l'enregistrement: ${err.message}`)
      setDebugInfo(`Exception: ${err.toString()}`)
    }
  }

  const handleDeleteOutflow = async (outflowId) => {
    if (!confirm('Voulez-vous vraiment supprimer cette sortie ?')) {
      return
    }

    try {
      console.log(`Suppression sortie ${outflowId} pour user ${user.id}`)
      
      const { error: deleteError } = await supabase
        .from('cash_outflow')
        .update({ status: 'cancelled' })
        .eq('id', outflowId)
        .eq('user_id', user.id)

      if (deleteError) {
        console.error('Erreur suppression:', deleteError)
        setError(`Erreur suppression: ${deleteError.message}`)
        setDebugInfo(`Erreur delete: ${JSON.stringify(deleteError)}`)
        return
      }

      // Recharger les données
      await loadTodayStats(user.id)
      await loadTodayOutflows(user.id)
      
      console.log('Sortie annulée avec succès')
      setDebugInfo('Sortie annulée avec succès')
      
    } catch (err) {
      console.error('Exception handleDeleteOutflow:', err)
      setError(`Erreur lors de l'annulation: ${err.message}`)
      setDebugInfo(`Exception delete: ${err.toString()}`)
    }
  }

  const formatCurrency = (amount, currency = 'CDF') => {
    const formatted = new Intl.NumberFormat('fr-FR', {
      minimumFractionDigits: currency === 'CDF' ? 0 : 2,
      maximumFractionDigits: currency === 'CDF' ? 0 : 2
    }).format(amount || 0)
    
    return `${currency === 'USD' ? '$' : 'FC'} ${formatted}`
  }

  const getCategoryColor = (category) => {
    const cat = categories.find(c => c.value === category)
    return cat ? cat.color : '#6b7280'
  }

  const handleRefresh = async () => {
    if (!user) return
    
    setLoading(true)
    setError('')
    setDebugInfo('Rafraîchissement...')
    
    await Promise.all([
      loadTodayStats(user.id),
      loadTodayOutflows(user.id)
    ])
    
    setLoading(false)
    setDebugInfo(prev => prev + ' | Rafraîchi')
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen p-4">
        <Loader2 className="w-8 h-8 animate-spin text-gray-600 mx-auto mb-4" />
        <p className="text-gray-500">Chargement...</p>
        {debugInfo && (
          <div className="mt-4 p-3 bg-gray-100 rounded text-xs text-gray-600 max-w-lg">
            Debug: {debugInfo}
          </div>
        )}
      </div>
    )
  }

  if (!user) {
    return (
      <div className="p-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
            <span className="text-red-700">
              Session expirée, veuillez vous reconnecter
            </span>
          </div>
        </div>
        {debugInfo && (
          <div className="mt-4 p-3 bg-gray-100 rounded text-xs text-gray-600">
            Debug: {debugInfo}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-6">
      {/* Debug Info - Toujours visible */}
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium text-gray-700 flex items-center">
            <AlertTriangle className="w-4 h-4 mr-2 text-yellow-500" />
            Info Debug
          </h2>
          <button
            onClick={() => setDebugInfo('')}
            className="text-xs text-gray-500 hover:text-gray-700"
          >
            Effacer
          </button>
        </div>
        {debugInfo && (
          <div className="mt-2 p-3 bg-gray-100 rounded text-xs text-gray-600 font-mono whitespace-pre-wrap break-all">
            {debugInfo}
          </div>
        )}
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
            Tableau de bord journalier
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Aujourd'hui • <span className="font-medium">{user.full_name || user.email}</span>
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm disabled:opacity-50"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Actualiser</span>
          </button>
          <button
            onClick={() => setShowOutflowModal(true)}
            className="flex items-center space-x-2 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm"
          >
            <ArrowDownRight className="w-4 h-4" />
            <span>Nouvelle sortie</span>
          </button>
        </div>
      </div>

      {/* Messages d'erreur */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
            <span className="text-red-700">{error}</span>
          </div>
        </div>
      )}

      {/* Cartes de statistiques CORRIGÉES */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Recette */}
        <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="text-green-800">
              <ArrowUpRight className="w-6 h-6" />
            </div>
            <div className="text-xs font-medium text-green-800 bg-green-200 px-2 py-1 rounded">
              Recette du jour
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-lg font-bold text-green-900">
              {formatCurrency(todayStats.totalReceiptCDF)}
              <span className="text-sm font-normal ml-2 text-green-700">
                (CDF)
              </span>
            </div>
            <div className="text-sm text-green-700 flex items-center">
              <DollarSign className="w-3 h-3 mr-1" />
              <span>{todayStats.totalReceiptUSD.toFixed(2)} USD</span>
            </div>
          </div>
        </div>

        {/* Dépense - CORRIGÉ */}
        <div className="bg-gradient-to-br from-red-50 to-red-100 border border-red-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="text-red-800">
              <ArrowDownRight className="w-6 h-6" />
            </div>
            <div className="text-xs font-medium text-red-800 bg-red-200 px-2 py-1 rounded">
              Dépense du jour
            </div>
          </div>
          <div className="space-y-2">
            {/* Afficher UNIQUEMENT les dépenses CDF ici */}
            <div className="text-lg font-bold text-red-900">
              {formatCurrency(todayStats.totalOutflowCDF)}
              <span className="text-sm font-normal ml-2 text-red-700">
                (CDF uniquement)
              </span>
            </div>
            <div className="text-sm text-red-700 flex items-center">
              <DollarSign className="w-3 h-3 mr-1" />
              <span>{todayStats.totalOutflowUSD.toFixed(2)} USD</span>
              <span className="text-xs text-red-600 ml-2">
                (USD uniquement)
              </span>
            </div>
            {/* Optionnel: Montrer l'équivalent total si besoin */}
            <div className="text-xs text-red-600 pt-1 border-t border-red-200">
              Équivalent total: ≈ {formatCurrency(
                todayStats.totalOutflowCDF + (todayStats.totalOutflowUSD * saleConfig.currency_rate)
              )}
            </div>
          </div>
        </div>

        {/* Solde net - CORRIGÉ */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="text-blue-800">
              <Wallet className="w-6 h-6" />
            </div>
            <div className="text-xs font-medium text-blue-800 bg-blue-200 px-2 py-1 rounded">
              Solde net
            </div>
          </div>
          <div className="space-y-2">
            {/* Solde net CDF (seulement CDF) */}
            <div className={`text-lg font-bold ${todayStats.netBalanceCDF >= 0 ? 'text-blue-900' : 'text-red-900'}`}>
              {formatCurrency(todayStats.netBalanceCDF)}
              <span className="text-sm font-normal ml-2">
                (CDF)
              </span>
            </div>
            {/* Solde net USD (seulement USD) */}
            <div className={`text-sm flex items-center ${todayStats.netBalanceUSD >= 0 ? 'text-blue-700' : 'text-red-700'}`}>
              <DollarSign className="w-3 h-3 mr-1" />
              <span>{todayStats.netBalanceUSD.toFixed(2)} USD</span>
            </div>
            {/* Optionnel: Solde net global converti */}
            <div className="text-xs text-blue-600 pt-1 border-t border-blue-200">
              Solde global: ≈ {formatCurrency(
                todayStats.netBalanceCDF + (todayStats.netBalanceUSD * saleConfig.currency_rate)
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Liste des sorties du jour */}
      <div className="bg-white rounded-lg border border-gray-200 mb-6">
        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <ArrowDownRight className="w-5 h-5 mr-2 text-red-600" />
              Sorties d'aujourd'hui
            </h3>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Calendar className="w-4 h-4" />
              <span>{new Date().toLocaleDateString('fr-FR', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}</span>
            </div>
          </div>
        </div>
        
        {outflows.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    N° Sortie
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Catégorie
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Motif
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Montant
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Heure
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {outflows.map((outflow) => (
                  <tr key={outflow.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="font-mono text-sm text-gray-900">
                        {outflow.outflow_number || 'N/A'}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                        style={{ 
                          backgroundColor: `${getCategoryColor(outflow.category)}20`,
                          color: getCategoryColor(outflow.category)
                        }}
                      >
                        {outflow.category}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm text-gray-900 max-w-xs truncate">
                        {outflow.reason}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className={`text-sm font-semibold ${outflow.currency === 'USD' ? 'text-blue-600' : 'text-red-600'}`}>
                        {formatCurrency(outflow.amount, outflow.currency)}
                      </div>
                      {outflow.currency === 'USD' && outflow.currency_rate && (
                        <div className="text-xs text-gray-500">
                          ≈ {formatCurrency(outflow.amount * outflow.currency_rate, 'CDF')}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {new Date(outflow.created_at).toLocaleTimeString('fr-FR', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <button
                        onClick={() => handleDeleteOutflow(outflow.id)}
                        className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
                        title="Supprimer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center">
            <ArrowDownRight className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <h4 className="text-gray-900 font-medium mb-1">
              Aucune sortie aujourd'hui
            </h4>
            <p className="text-gray-500 text-sm mb-4">
              Enregistrez votre première sortie de caisse
            </p>
            <button
              onClick={() => setShowOutflowModal(true)}
              className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm"
            >
              <ArrowDownRight className="w-4 h-4 mr-2" />
              Nouvelle sortie
            </button>
          </div>
        )}
      </div>

      {/* Modal pour nouvelle sortie */}
      {showOutflowModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Nouvelle sortie de caisse
                </h3>
                <button
                  onClick={() => setShowOutflowModal(false)}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Montant *
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      step="0.01"
                      min="0.01"
                      value={newOutflow.amount}
                      onChange={(e) => setNewOutflow({...newOutflow, amount: e.target.value})}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-red-600 focus:border-red-600 text-sm"
                      placeholder="0.00"
                    />
                    <select
                      value={newOutflow.currency}
                      onChange={(e) => setNewOutflow({...newOutflow, currency: e.target.value})}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-red-600 focus:border-red-600 bg-white text-sm"
                    >
                      <option value="CDF">CDF</option>
                      <option value="USD">USD</option>
                    </select>
                  </div>
                  {newOutflow.currency === 'USD' && (
                    <p className="text-xs text-gray-500 mt-1">
                      Taux: 1$ = {saleConfig.currency_rate?.toLocaleString('fr-FR') || '2,300'} FC
                    </p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Catégorie
                  </label>
                  <select
                    value={newOutflow.category}
                    onChange={(e) => setNewOutflow({...newOutflow, category: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-red-600 focus:border-red-600 bg-white text-sm"
                  >
                    {categories.map(cat => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Motif *
                  </label>
                  <textarea
                    value={newOutflow.reason}
                    onChange={(e) => setNewOutflow({...newOutflow, reason: e.target.value})}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-red-600 focus:border-red-600 text-sm"
                    placeholder="Décrivez le motif de cette sortie..."
                  />
                </div>
                
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex space-x-3">
                    <button
                      onClick={() => setShowOutflowModal(false)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm"
                    >
                      Annuler
                    </button>
                    <button
                      onClick={handleCreateOutflow}
                      className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm"
                    >
                      Enregistrer
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}