// // // 'use client'

// // // import { useState, useEffect } from 'react'
// // // import { supabase } from '@/lib/supabase'
// // // import { checkAuth } from '@/lib/auth'
// // // import {
// // //   Plus,
// // //   Trash2,
// // //   DollarSign,
// // //   ArrowDownRight,
// // //   ArrowUpRight,
// // //   Wallet,
// // //   Calendar,
// // //   RefreshCw,
// // //   Loader2,
// // //   AlertCircle,
// // //   X,
// // //   AlertTriangle
// // // } from 'lucide-react'

// // // export default function UserOutflowDashboard() {
// // //   const [user, setUser] = useState(null)
// // //   const [loading, setLoading] = useState(true)
// // //   const [outflows, setOutflows] = useState([])
// // //   const [showOutflowModal, setShowOutflowModal] = useState(false)
// // //   const [todayStats, setTodayStats] = useState({
// // //     totalReceiptCDF: 0,
// // //     totalReceiptUSD: 0,
// // //     totalOutflowCDF: 0,
// // //     totalOutflowUSD: 0,
// // //     netBalanceCDF: 0,
// // //     netBalanceUSD: 0
// // //   })
// // //   const [newOutflow, setNewOutflow] = useState({
// // //     amount: '',
// // //     currency: 'CDF',
// // //     reason: '',
// // //     category: 'Divers'
// // //   })
// // //   const [saleConfig, setSaleConfig] = useState({
// // //     vat_amount: 20.00,
// // //     currency_rate: 2300.00,
// // //     base_currency: 'USD'
// // //   })
// // //   const [error, setError] = useState('')
// // //   const [debugInfo, setDebugInfo] = useState('')

// // //   // Catégories de dépenses
// // //   const categories = [
// // //     { value: 'Transport', label: 'Transport', color: '#8884d8' },
// // //     { value: 'Fournitures', label: 'Fournitures', color: '#82ca9d' },
// // //     { value: 'Salaires', label: 'Salaires', color: '#ffc658' },
// // //     { value: 'Loyer', label: 'Loyer', color: '#ff8042' },
// // //     { value: 'Électricité', label: 'Électricité', color: '#0088fe' },
// // //     { value: 'Internet', label: 'Internet', color: '#00c49f' },
// // //     { value: 'Marketing', label: 'Marketing', color: '#ffbb28' },
// // //     { value: 'Divers', label: 'Divers', color: '#ff6b6b' }
// // //   ]

// // //   useEffect(() => {
// // //     const init = async () => {
// // //       setLoading(true)
// // //       setError('')
// // //       setDebugInfo('Initialisation...')
      
// // //       try {
// // //         const currentUser = checkAuth()
// // //         console.log('User from checkAuth:', currentUser)
        
// // //         if (!currentUser) {
// // //           setError('Aucun utilisateur connecté')
// // //           setDebugInfo('checkAuth a retourné null')
// // //           setLoading(false)
// // //           return
// // //         }
        
// // //         setUser(currentUser)
// // //         setDebugInfo(`Utilisateur trouvé: ${currentUser.id} - ${currentUser.email}`)
        
// // //         await Promise.all([
// // //           loadSaleConfig(),
// // //           loadTodayStats(currentUser.id),
// // //           loadTodayOutflows(currentUser.id)
// // //         ])
        
// // //         setDebugInfo('Initialisation terminée avec succès')
// // //       } catch (err) {
// // //         console.error('Erreur lors de l\'initialisation:', err)
// // //         setError(`Erreur d'initialisation: ${err.message}`)
// // //         setDebugInfo(`Erreur catch: ${err.toString()}`)
// // //       } finally {
// // //         setLoading(false)
// // //       }
// // //     }
    
// // //     init()
// // //   }, [])

// // //   const loadSaleConfig = async () => {
// // //     try {
// // //       console.log('Chargement de sale_config...')
// // //       const { data, error: configError } = await supabase
// // //         .from('sale_config')
// // //         .select('*')
// // //         .order('created_at', { ascending: false })
// // //         .limit(1)
// // //         .single()
      
// // //       if (configError) {
// // //         console.error('Erreur sale_config:', configError)
// // //         setDebugInfo(`Erreur sale_config: ${configError.message}`)
// // //         return
// // //       }
      
// // //       console.log('sale_config chargé:', data)
// // //       if (data) {
// // //         setSaleConfig(data)
// // //         setDebugInfo(prev => prev + ` | sale_config: ${JSON.stringify(data)}`)
// // //       }
// // //     } catch (err) {
// // //       console.error('Exception loadSaleConfig:', err)
// // //       setDebugInfo(prev => prev + ` | Exception sale_config: ${err.message}`)
// // //     }
// // //   }

// // //   const loadTodayStats = async (userId) => {
// // //     try {
// // //       const today = new Date().toISOString().split('T')[0]
// // //       console.log(`Chargement stats pour ${userId} le ${today}`)
      
// // //       // Récupérer le rapport journalier de l'utilisateur
// // //       const { data: report, error: reportError } = await supabase
// // //         .from('daily_user_financial_report')
// // //         .select('*')
// // //         .eq('report_date', today)
// // //         .eq('user_id', userId)
// // //         .single()
      
// // //       if (reportError && reportError.code !== 'PGRST116') {
// // //         console.error('Erreur rapport:', reportError)
// // //         setDebugInfo(prev => prev + ` | Erreur rapport: ${reportError.message}`)
// // //       }
      
// // //       if (report) {
// // //         console.log('Rapport trouvé:', report)
// // //         setTodayStats({
// // //           totalReceiptCDF: report.total_receipt_cdf || 0,
// // //           totalReceiptUSD: report.total_receipt_usd || 0,
// // //           totalOutflowCDF: report.total_outflow_cdf || 0,
// // //           totalOutflowUSD: report.total_outflow_usd || 0,
// // //           netBalanceCDF: report.balance_cdf || 0,
// // //           netBalanceUSD: report.balance_usd || 0
// // //         })
// // //         setDebugInfo(prev => prev + ` | Rapport chargé: ${JSON.stringify(report)}`)
// // //       } else {
// // //         console.log('Pas de rapport, calcul manuel...')
// // //         await calculateTodayStats(userId)
// // //       }
// // //     } catch (err) {
// // //       console.error('Exception loadTodayStats:', err)
// // //       setDebugInfo(prev => prev + ` | Exception stats: ${err.message}`)
// // //       await calculateTodayStats(userId)
// // //     }
// // //   }

// // //   const calculateTodayStats = async (userId) => {
// // //     try {
// // //       const today = new Date().toISOString().split('T')[0]
// // //       console.log(`Calcul manuel stats pour ${userId} le ${today}`)
      
// // //       // Recettes du jour (ventes)
// // //       const { data: salesData, error: salesError } = await supabase
// // //         .from('sale')
// // //         .select('total, currency, currency_rate')
// // //         .eq('user_id', userId)
// // //         .eq('status', 'completed')
// // //         .eq('payment_status', 'paid')
// // //         .gte('created_at', `${today}T00:00:00`)
// // //         .lte('created_at', `${today}T23:59:59`)
      
// // //       if (salesError) {
// // //         console.error('Erreur ventes:', salesError)
// // //         setDebugInfo(prev => prev + ` | Erreur ventes: ${salesError.message}`)
// // //       }
      
// // //       // Dépenses du jour (sorties)
// // //       const { data: outflowsData, error: outflowsError } = await supabase
// // //         .from('cash_outflow')
// // //         .select('amount, currency, currency_rate')
// // //         .eq('user_id', userId)
// // //         .eq('date', today)
// // //         .eq('status', 'completed')
      
// // //       if (outflowsError) {
// // //         console.error('Erreur sorties:', outflowsError)
// // //         setDebugInfo(prev => prev + ` | Erreur sorties: ${outflowsError.message}`)
// // //       }
      
// // //       console.log('Ventes trouvées:', salesData?.length || 0)
// // //       console.log('Sorties trouvées:', outflowsData?.length || 0)
      
// // //       let totalReceiptCDF = 0
// // //       let totalReceiptUSD = 0
// // //       let totalOutflowCDF = 0
// // //       let totalOutflowUSD = 0
      
// // //       if (salesData) {
// // //         salesData.forEach(sale => {
// // //           const montant = sale.total || 0
          
// // //           if (sale.currency === 'USD') {
// // //             totalReceiptUSD += montant
// // //             const tauxVente = sale.currency_rate || saleConfig.currency_rate || 1
// // //             const montantCDF = montant * tauxVente
// // //             totalReceiptCDF += montantCDF
// // //           } else {
// // //             totalReceiptCDF += montant
// // //           }
// // //         })
// // //       }
      
// // //       if (outflowsData) {
// // //         outflowsData.forEach(outflow => {
// // //           const montant = outflow.amount || 0
          
// // //           if (outflow.currency === 'USD') {
// // //             totalOutflowUSD += montant
// // //             const tauxOutflow = outflow.currency_rate || saleConfig.currency_rate || 1
// // //             const montantCDF = montant * tauxOutflow
// // //             totalOutflowCDF += montantCDF
// // //           } else {
// // //             totalOutflowCDF += montant
// // //           }
// // //         })
// // //       }
      
// // //       const netBalanceCDF = totalReceiptCDF - totalOutflowCDF
// // //       const netBalanceUSD = totalReceiptUSD - totalOutflowUSD
      
// // //       console.log('Stats calculées:', {
// // //         totalReceiptCDF, totalReceiptUSD,
// // //         totalOutflowCDF, totalOutflowUSD,
// // //         netBalanceCDF, netBalanceUSD
// // //       })
      
// // //       setTodayStats({
// // //         totalReceiptCDF: Math.round(totalReceiptCDF),
// // //         totalReceiptUSD: Math.round(totalReceiptUSD * 100) / 100,
// // //         totalOutflowCDF: Math.round(totalOutflowCDF),
// // //         totalOutflowUSD: Math.round(totalOutflowUSD * 100) / 100,
// // //         netBalanceCDF: Math.round(netBalanceCDF),
// // //         netBalanceUSD: Math.round(netBalanceUSD * 100) / 100
// // //       })
      
// // //       setDebugInfo(prev => prev + ` | Stats calculées: R=${totalReceiptCDF}, D=${totalOutflowCDF}`)
// // //     } catch (err) {
// // //       console.error('Exception calculateTodayStats:', err)
// // //       setDebugInfo(prev => prev + ` | Exception calculate: ${err.message}`)
// // //     }
// // //   }

// // //   const loadTodayOutflows = async (userId) => {
// // //     try {
// // //       const today = new Date().toISOString().split('T')[0]
// // //       console.log(`Chargement sorties pour ${userId} le ${today}`)
      
// // //       const { data, error: outflowsError } = await supabase
// // //         .from('cash_outflow')
// // //         .select('*')
// // //         .eq('user_id', userId)
// // //         .eq('date', today)
// // //         .eq('status', 'completed')
// // //         .order('created_at', { ascending: false })
      
// // //       if (outflowsError) {
// // //         console.error('Erreur chargement sorties:', outflowsError)
// // //         setDebugInfo(prev => prev + ` | Erreur load outflows: ${outflowsError.message}`)
// // //         return
// // //       }
      
// // //       console.log('Sorties chargées:', data?.length || 0)
// // //       setOutflows(data || [])
// // //       setDebugInfo(prev => prev + ` | Outflows chargées: ${data?.length || 0}`)
// // //     } catch (err) {
// // //       console.error('Exception loadTodayOutflows:', err)
// // //       setDebugInfo(prev => prev + ` | Exception load outflows: ${err.message}`)
// // //     }
// // //   }

// // //   const handleCreateOutflow = async () => {
// // //     console.log('handleCreateOutflow appelé')
// // //     console.log('Nouvelle sortie:', newOutflow)
    
// // //     if (!newOutflow.amount || parseFloat(newOutflow.amount) <= 0) {
// // //       setError('Veuillez entrer un montant valide')
// // //       setDebugInfo('Montant invalide ou vide')
// // //       return
// // //     }

// // //     if (!newOutflow.reason.trim()) {
// // //       setError('Veuillez entrer un motif')
// // //       setDebugInfo('Motif vide')
// // //       return
// // //     }

// // //     if (!user) {
// // //       setError('Session expirée, veuillez vous reconnecter')
// // //       setDebugInfo('User est null')
// // //       return
// // //     }

// // //     setError('')
// // //     setDebugInfo(`Création sortie pour user ${user.id}`)

// // //     try {
// // //       const outflowData = {
// // //         amount: parseFloat(newOutflow.amount),
// // //         currency: newOutflow.currency,
// // //         currency_rate: newOutflow.currency === 'USD' ? saleConfig.currency_rate : 1.0,
// // //         reason: newOutflow.reason.trim(),
// // //         category: newOutflow.category,
// // //         user_id: user.id,
// // //         date: new Date().toISOString().split('T')[0]
// // //       }

// // //       console.log('Données à insérer:', outflowData)

// // //       const { data, error: insertError } = await supabase
// // //         .from('cash_outflow')
// // //         .insert([outflowData])
// // //         .select()

// // //       if (insertError) {
// // //         console.error('Erreur Supabase insert:', insertError)
// // //         setError(`Erreur Supabase: ${insertError.message}`)
// // //         setDebugInfo(`Erreur insert: ${JSON.stringify(insertError)}`)
// // //         return
// // //       }

// // //       console.log('Sortie créée avec succès:', data)

// // //       setNewOutflow({
// // //         amount: '',
// // //         currency: 'CDF',
// // //         reason: '',
// // //         category: 'Divers'
// // //       })
      
// // //       setShowOutflowModal(false)
      
// // //       // Recharger les données
// // //       await loadTodayStats(user.id)
// // //       await loadTodayOutflows(user.id)
      
// // //       setDebugInfo('Sortie créée avec succès')
      
// // //     } catch (err) {
// // //       console.error('Exception handleCreateOutflow:', err)
// // //       setError(`Erreur lors de l'enregistrement: ${err.message}`)
// // //       setDebugInfo(`Exception: ${err.toString()}`)
// // //     }
// // //   }

// // //   const handleDeleteOutflow = async (outflowId) => {
// // //     if (!confirm('Voulez-vous vraiment supprimer cette sortie ?')) {
// // //       return
// // //     }

// // //     try {
// // //       console.log(`Suppression sortie ${outflowId} pour user ${user.id}`)
      
// // //       const { error: deleteError } = await supabase
// // //         .from('cash_outflow')
// // //         .update({ status: 'cancelled' })
// // //         .eq('id', outflowId)
// // //         .eq('user_id', user.id)

// // //       if (deleteError) {
// // //         console.error('Erreur suppression:', deleteError)
// // //         setError(`Erreur suppression: ${deleteError.message}`)
// // //         setDebugInfo(`Erreur delete: ${JSON.stringify(deleteError)}`)
// // //         return
// // //       }

// // //       // Recharger les données
// // //       await loadTodayStats(user.id)
// // //       await loadTodayOutflows(user.id)
      
// // //       console.log('Sortie annulée avec succès')
// // //       setDebugInfo('Sortie annulée avec succès')
      
// // //     } catch (err) {
// // //       console.error('Exception handleDeleteOutflow:', err)
// // //       setError(`Erreur lors de l'annulation: ${err.message}`)
// // //       setDebugInfo(`Exception delete: ${err.toString()}`)
// // //     }
// // //   }

// // //   const formatCurrency = (amount, currency = 'CDF') => {
// // //     const formatted = new Intl.NumberFormat('fr-FR', {
// // //       minimumFractionDigits: currency === 'CDF' ? 0 : 2,
// // //       maximumFractionDigits: currency === 'CDF' ? 0 : 2
// // //     }).format(amount || 0)
    
// // //     return `${currency === 'USD' ? '$' : 'FC'} ${formatted}`
// // //   }

// // //   const getCategoryColor = (category) => {
// // //     const cat = categories.find(c => c.value === category)
// // //     return cat ? cat.color : '#6b7280'
// // //   }

// // //   const handleRefresh = async () => {
// // //     if (!user) return
    
// // //     setLoading(true)
// // //     setError('')
// // //     setDebugInfo('Rafraîchissement...')
    
// // //     await Promise.all([
// // //       loadTodayStats(user.id),
// // //       loadTodayOutflows(user.id)
// // //     ])
    
// // //     setLoading(false)
// // //     setDebugInfo(prev => prev + ' | Rafraîchi')
// // //   }

// // //   if (loading) {
// // //     return (
// // //       <div className="flex flex-col items-center justify-center h-screen p-4">
// // //         <Loader2 className="w-8 h-8 animate-spin text-gray-600 mx-auto mb-4" />
// // //         <p className="text-gray-500">Chargement...</p>
// // //         {debugInfo && (
// // //           <div className="mt-4 p-3 bg-gray-100 rounded text-xs text-gray-600 max-w-lg">
// // //             Debug: {debugInfo}
// // //           </div>
// // //         )}
// // //       </div>
// // //     )
// // //   }

// // //   if (!user) {
// // //     return (
// // //       <div className="p-4">
// // //         <div className="bg-red-50 border border-red-200 rounded-lg p-4">
// // //           <div className="flex items-center">
// // //             <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
// // //             <span className="text-red-700">
// // //               Session expirée, veuillez vous reconnecter
// // //             </span>
// // //           </div>
// // //         </div>
// // //         {debugInfo && (
// // //           <div className="mt-4 p-3 bg-gray-100 rounded text-xs text-gray-600">
// // //             Debug: {debugInfo}
// // //           </div>
// // //         )}
// // //       </div>
// // //     )
// // //   }

// // //   return (
// // //     <div className="p-4 sm:p-6">
// // //       {/* Debug Info - Toujours visible */}
// // //       <div className="mb-4">
// // //         <div className="flex items-center justify-between">
// // //           <h2 className="text-sm font-medium text-gray-700 flex items-center">
// // //             <AlertTriangle className="w-4 h-4 mr-2 text-yellow-500" />
// // //             Info Debug
// // //           </h2>
// // //           <button
// // //             onClick={() => setDebugInfo('')}
// // //             className="text-xs text-gray-500 hover:text-gray-700"
// // //           >
// // //             Effacer
// // //           </button>
// // //         </div>
// // //         {debugInfo && (
// // //           <div className="mt-2 p-3 bg-gray-100 rounded text-xs text-gray-600 font-mono whitespace-pre-wrap break-all">
// // //             {debugInfo}
// // //           </div>
// // //         )}
// // //       </div>

// // //       {/* Header */}
// // //       <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
// // //         <div>
// // //           <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
// // //             Tableau de bord journalier
// // //           </h1>
// // //           <p className="text-gray-500 text-sm mt-1">
// // //             Aujourd'hui • <span className="font-medium">{user.full_name || user.email}</span>
// // //           </p>
// // //         </div>
        
// // //         <div className="flex items-center space-x-2">
// // //           <button
// // //             onClick={handleRefresh}
// // //             disabled={loading}
// // //             className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm disabled:opacity-50"
// // //           >
// // //             <RefreshCw className="w-4 h-4" />
// // //             <span>Actualiser</span>
// // //           </button>
// // //           <button
// // //             onClick={() => setShowOutflowModal(true)}
// // //             className="flex items-center space-x-2 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm"
// // //           >
// // //             <ArrowDownRight className="w-4 h-4" />
// // //             <span>Nouvelle sortie</span>
// // //           </button>
// // //         </div>
// // //       </div>

// // //       {/* Messages d'erreur */}
// // //       {error && (
// // //         <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
// // //           <div className="flex items-center">
// // //             <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
// // //             <span className="text-red-700">{error}</span>
// // //           </div>
// // //         </div>
// // //       )}

// // //       {/* Cartes de statistiques */}
// // //       <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
// // //         {/* Recette */}
// // //         <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg p-4">
// // //           <div className="flex items-center justify-between mb-4">
// // //             <div className="text-green-800">
// // //               <ArrowUpRight className="w-6 h-6" />
// // //             </div>
// // //             <div className="text-xs font-medium text-green-800 bg-green-200 px-2 py-1 rounded">
// // //               Recette du jour
// // //             </div>
// // //           </div>
// // //           <div className="space-y-2">
// // //             <div className="text-lg font-bold text-green-900">
// // //               {formatCurrency(todayStats.totalReceiptCDF)}
// // //             </div>
// // //             <div className="text-sm text-green-700 flex items-center">
// // //               <DollarSign className="w-3 h-3 mr-1" />
// // //               <span>{todayStats.totalReceiptUSD.toFixed(2)} USD</span>
// // //             </div>
// // //           </div>
// // //         </div>

// // //         {/* Dépense */}
// // //         <div className="bg-gradient-to-br from-red-50 to-red-100 border border-red-200 rounded-lg p-4">
// // //           <div className="flex items-center justify-between mb-4">
// // //             <div className="text-red-800">
// // //               <ArrowDownRight className="w-6 h-6" />
// // //             </div>
// // //             <div className="text-xs font-medium text-red-800 bg-red-200 px-2 py-1 rounded">
// // //               Dépense du jour
// // //             </div>
// // //           </div>
// // //           <div className="space-y-2">
// // //             <div className="text-lg font-bold text-red-900">
// // //               {formatCurrency(todayStats.totalOutflowCDF)}
// // //             </div>
// // //             <div className="text-sm text-red-700 flex items-center">
// // //               <DollarSign className="w-3 h-3 mr-1" />
// // //               <span>{todayStats.totalOutflowUSD.toFixed(2)} USD</span>
// // //             </div>
// // //           </div>
// // //         </div>

// // //         {/* Solde net */}
// // //         <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-4">
// // //           <div className="flex items-center justify-between mb-4">
// // //             <div className="text-blue-800">
// // //               <Wallet className="w-6 h-6" />
// // //             </div>
// // //             <div className="text-xs font-medium text-blue-800 bg-blue-200 px-2 py-1 rounded">
// // //               Solde net
// // //             </div>
// // //           </div>
// // //           <div className="space-y-2">
// // //             <div className={`text-lg font-bold ${todayStats.netBalanceCDF >= 0 ? 'text-blue-900' : 'text-red-900'}`}>
// // //               {formatCurrency(todayStats.netBalanceCDF)}
// // //             </div>
// // //             <div className={`text-sm flex items-center ${todayStats.netBalanceUSD >= 0 ? 'text-blue-700' : 'text-red-700'}`}>
// // //               <DollarSign className="w-3 h-3 mr-1" />
// // //               <span>{todayStats.netBalanceUSD.toFixed(2)} USD</span>
// // //             </div>
// // //           </div>
// // //         </div>
// // //       </div>

// // //       {/* Liste des sorties du jour */}
// // //       <div className="bg-white rounded-lg border border-gray-200 mb-6">
// // //         <div className="p-4 border-b border-gray-200">
// // //           <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
// // //             <h3 className="text-lg font-semibold text-gray-900 flex items-center">
// // //               <ArrowDownRight className="w-5 h-5 mr-2 text-red-600" />
// // //               Sorties d'aujourd'hui
// // //             </h3>
// // //             <div className="flex items-center space-x-2 text-sm text-gray-500">
// // //               <Calendar className="w-4 h-4" />
// // //               <span>{new Date().toLocaleDateString('fr-FR', {
// // //                 weekday: 'long',
// // //                 year: 'numeric',
// // //                 month: 'long',
// // //                 day: 'numeric'
// // //               })}</span>
// // //             </div>
// // //           </div>
// // //         </div>
        
// // //         {outflows.length > 0 ? (
// // //           <div className="overflow-x-auto">
// // //             <table className="min-w-full divide-y divide-gray-200">
// // //               <thead className="bg-gray-50">
// // //                 <tr>
// // //                   <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
// // //                     N° Sortie
// // //                   </th>
// // //                   <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
// // //                     Catégorie
// // //                   </th>
// // //                   <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
// // //                     Motif
// // //                   </th>
// // //                   <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
// // //                     Montant
// // //                   </th>
// // //                   <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
// // //                     Heure
// // //                   </th>
// // //                   <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
// // //                     Actions
// // //                   </th>
// // //                 </tr>
// // //               </thead>
// // //               <tbody className="divide-y divide-gray-200">
// // //                 {outflows.map((outflow) => (
// // //                   <tr key={outflow.id} className="hover:bg-gray-50">
// // //                     <td className="px-4 py-3 whitespace-nowrap">
// // //                       <div className="font-mono text-sm text-gray-900">
// // //                         {outflow.outflow_number || 'N/A'}
// // //                       </div>
// // //                     </td>
// // //                     <td className="px-4 py-3">
// // //                       <span
// // //                         className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
// // //                         style={{ 
// // //                           backgroundColor: `${getCategoryColor(outflow.category)}20`,
// // //                           color: getCategoryColor(outflow.category)
// // //                         }}
// // //                       >
// // //                         {outflow.category}
// // //                       </span>
// // //                     </td>
// // //                     <td className="px-4 py-3">
// // //                       <div className="text-sm text-gray-900 max-w-xs truncate">
// // //                         {outflow.reason}
// // //                       </div>
// // //                     </td>
// // //                     <td className="px-4 py-3">
// // //                       <div className={`text-sm font-semibold ${outflow.currency === 'USD' ? 'text-blue-600' : 'text-red-600'}`}>
// // //                         {formatCurrency(outflow.amount, outflow.currency)}
// // //                       </div>
// // //                       {outflow.currency === 'USD' && outflow.currency_rate && (
// // //                         <div className="text-xs text-gray-500">
// // //                           ≈ {formatCurrency(outflow.amount * outflow.currency_rate, 'CDF')}
// // //                         </div>
// // //                       )}
// // //                     </td>
// // //                     <td className="px-4 py-3 whitespace-nowrap">
// // //                       <div className="text-sm text-gray-500">
// // //                         {new Date(outflow.created_at).toLocaleTimeString('fr-FR', {
// // //                           hour: '2-digit',
// // //                           minute: '2-digit'
// // //                         })}
// // //                       </div>
// // //                     </td>
// // //                     <td className="px-4 py-3 whitespace-nowrap">
// // //                       <button
// // //                         onClick={() => handleDeleteOutflow(outflow.id)}
// // //                         className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
// // //                         title="Supprimer"
// // //                       >
// // //                         <Trash2 className="w-4 h-4" />
// // //                       </button>
// // //                     </td>
// // //                   </tr>
// // //                 ))}
// // //               </tbody>
// // //             </table>
// // //           </div>
// // //         ) : (
// // //           <div className="p-8 text-center">
// // //             <ArrowDownRight className="w-12 h-12 text-gray-400 mx-auto mb-3" />
// // //             <h4 className="text-gray-900 font-medium mb-1">
// // //               Aucune sortie aujourd'hui
// // //             </h4>
// // //             <p className="text-gray-500 text-sm mb-4">
// // //               Enregistrez votre première sortie de caisse
// // //             </p>
// // //             <button
// // //               onClick={() => setShowOutflowModal(true)}
// // //               className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm"
// // //             >
// // //               <ArrowDownRight className="w-4 h-4 mr-2" />
// // //               Nouvelle sortie
// // //             </button>
// // //           </div>
// // //         )}
// // //       </div>

// // //       {/* Modal pour nouvelle sortie */}
// // //       {showOutflowModal && (
// // //         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
// // //           <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
// // //             <div className="p-6">
// // //               <div className="flex items-center justify-between mb-4">
// // //                 <h3 className="text-lg font-semibold text-gray-900">
// // //                   Nouvelle sortie de caisse
// // //                 </h3>
// // //                 <button
// // //                   onClick={() => setShowOutflowModal(false)}
// // //                   className="p-1 hover:bg-gray-100 rounded"
// // //                 >
// // //                   <X className="w-5 h-5" />
// // //                 </button>
// // //               </div>
              
// // //               <div className="space-y-4">
// // //                 <div>
// // //                   <label className="block text-sm font-medium text-gray-700 mb-1">
// // //                     Montant *
// // //                   </label>
// // //                   <div className="flex gap-2">
// // //                     <input
// // //                       type="number"
// // //                       step="0.01"
// // //                       min="0.01"
// // //                       value={newOutflow.amount}
// // //                       onChange={(e) => setNewOutflow({...newOutflow, amount: e.target.value})}
// // //                       className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-red-600 focus:border-red-600 text-sm"
// // //                       placeholder="0.00"
// // //                     />
// // //                     <select
// // //                       value={newOutflow.currency}
// // //                       onChange={(e) => setNewOutflow({...newOutflow, currency: e.target.value})}
// // //                       className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-red-600 focus:border-red-600 bg-white text-sm"
// // //                     >
// // //                       <option value="CDF">CDF</option>
// // //                       <option value="USD">USD</option>
// // //                     </select>
// // //                   </div>
// // //                   {newOutflow.currency === 'USD' && (
// // //                     <p className="text-xs text-gray-500 mt-1">
// // //                       Taux: 1$ = {saleConfig.currency_rate?.toLocaleString('fr-FR') || '2,300'} FC
// // //                     </p>
// // //                   )}
// // //                 </div>
                
// // //                 <div>
// // //                   <label className="block text-sm font-medium text-gray-700 mb-1">
// // //                     Catégorie
// // //                   </label>
// // //                   <select
// // //                     value={newOutflow.category}
// // //                     onChange={(e) => setNewOutflow({...newOutflow, category: e.target.value})}
// // //                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-red-600 focus:border-red-600 bg-white text-sm"
// // //                   >
// // //                     {categories.map(cat => (
// // //                       <option key={cat.value} value={cat.value}>
// // //                         {cat.label}
// // //                       </option>
// // //                     ))}
// // //                   </select>
// // //                 </div>
                
// // //                 <div>
// // //                   <label className="block text-sm font-medium text-gray-700 mb-1">
// // //                     Motif *
// // //                   </label>
// // //                   <textarea
// // //                     value={newOutflow.reason}
// // //                     onChange={(e) => setNewOutflow({...newOutflow, reason: e.target.value})}
// // //                     rows="3"
// // //                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-red-600 focus:border-red-600 text-sm"
// // //                     placeholder="Décrivez le motif de cette sortie..."
// // //                   />
// // //                 </div>
                
// // //                 <div className="pt-4 border-t border-gray-200">
// // //                   <div className="flex space-x-3">
// // //                     <button
// // //                       onClick={() => setShowOutflowModal(false)}
// // //                       className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm"
// // //                     >
// // //                       Annuler
// // //                     </button>
// // //                     <button
// // //                       onClick={handleCreateOutflow}
// // //                       className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm"
// // //                     >
// // //                       Enregistrer
// // //                     </button>
// // //                   </div>
// // //                 </div>
// // //               </div>
// // //             </div>
// // //           </div>
// // //         </div>
// // //       )}
// // //     </div>
// // //   )
// // // }


// // 'use client'

// // import { useState, useEffect } from 'react'
// // import { supabase } from '@/lib/supabase'
// // import { checkAuth } from '@/lib/auth'
// // import {
// //   Plus,
// //   Trash2,
// //   DollarSign,
// //   ArrowDownRight,
// //   ArrowUpRight,
// //   Wallet,
// //   Calendar,
// //   RefreshCw,
// //   Loader2,
// //   AlertCircle,
// //   X,
// //   AlertTriangle
// // } from 'lucide-react'

// // export default function UserOutflowDashboard() {
// //   const [user, setUser] = useState(null)
// //   const [loading, setLoading] = useState(true)
// //   const [outflows, setOutflows] = useState([])
// //   const [showOutflowModal, setShowOutflowModal] = useState(false)
// //   const [todayStats, setTodayStats] = useState({
// //     totalReceiptCDF: 0,
// //     totalReceiptUSD: 0,
// //     totalOutflowCDF: 0,
// //     totalOutflowUSD: 0,
// //     netBalanceCDF: 0,
// //     netBalanceUSD: 0
// //   })
// //   const [newOutflow, setNewOutflow] = useState({
// //     amount: '',
// //     currency: 'CDF',
// //     reason: '',
// //     category: 'Divers'
// //   })
// //   const [saleConfig, setSaleConfig] = useState({
// //     vat_amount: 20.00,
// //     currency_rate: 2300.00,
// //     base_currency: 'USD'
// //   })
// //   const [error, setError] = useState('')
// //   const [debugInfo, setDebugInfo] = useState('')

// //   // Catégories de dépenses
// //   const categories = [
// //     { value: 'Transport', label: 'Transport', color: '#8884d8' },
// //     { value: 'Fournitures', label: 'Fournitures', color: '#82ca9d' },
// //     { value: 'Salaires', label: 'Salaires', color: '#ffc658' },
// //     { value: 'Loyer', label: 'Loyer', color: '#ff8042' },
// //     { value: 'Électricité', label: 'Électricité', color: '#0088fe' },
// //     { value: 'Internet', label: 'Internet', color: '#00c49f' },
// //     { value: 'Marketing', label: 'Marketing', color: '#ffbb28' },
// //     { value: 'Divers', label: 'Divers', color: '#ff6b6b' }
// //   ]

// //   useEffect(() => {
// //     const init = async () => {
// //       setLoading(true)
// //       setError('')
// //       setDebugInfo('Initialisation...')
      
// //       try {
// //         const currentUser = checkAuth()
// //         console.log('User from checkAuth:', currentUser)
        
// //         if (!currentUser) {
// //           setError('Aucun utilisateur connecté')
// //           setDebugInfo('checkAuth a retourné null')
// //           setLoading(false)
// //           return
// //         }
        
// //         setUser(currentUser)
// //         setDebugInfo(`Utilisateur trouvé: ${currentUser.id} - ${currentUser.email}`)
        
// //         await Promise.all([
// //           loadSaleConfig(),
// //           loadTodayStats(currentUser.id),
// //           loadTodayOutflows(currentUser.id)
// //         ])
        
// //         setDebugInfo('Initialisation terminée avec succès')
// //       } catch (err) {
// //         console.error('Erreur lors de l\'initialisation:', err)
// //         setError(`Erreur d'initialisation: ${err.message}`)
// //         setDebugInfo(`Erreur catch: ${err.toString()}`)
// //       } finally {
// //         setLoading(false)
// //       }
// //     }
    
// //     init()
// //   }, [])

// //   const loadSaleConfig = async () => {
// //     try {
// //       console.log('Chargement de sale_config...')
// //       const { data, error: configError } = await supabase
// //         .from('sale_config')
// //         .select('*')
// //         .order('created_at', { ascending: false })
// //         .limit(1)
// //         .single()
      
// //       if (configError) {
// //         console.error('Erreur sale_config:', configError)
// //         setDebugInfo(`Erreur sale_config: ${configError.message}`)
// //         return
// //       }
      
// //       console.log('sale_config chargé:', data)
// //       if (data) {
// //         setSaleConfig(data)
// //         setDebugInfo(prev => prev + ` | sale_config: ${JSON.stringify(data)}`)
// //       }
// //     } catch (err) {
// //       console.error('Exception loadSaleConfig:', err)
// //       setDebugInfo(prev => prev + ` | Exception sale_config: ${err.message}`)
// //     }
// //   }

// //   const loadTodayStats = async (userId) => {
// //     try {
// //       const today = new Date().toISOString().split('T')[0]
// //       console.log(`Chargement stats pour ${userId} le ${today}`)
      
// //       // Récupérer le rapport journalier de l'utilisateur
// //       const { data: report, error: reportError } = await supabase
// //         .from('daily_user_financial_report')
// //         .select('*')
// //         .eq('report_date', today)
// //         .eq('user_id', userId)
// //         .single()
      
// //       if (reportError && reportError.code !== 'PGRST116') {
// //         console.error('Erreur rapport:', reportError)
// //         setDebugInfo(prev => prev + ` | Erreur rapport: ${reportError.message}`)
// //       }
      
// //       if (report) {
// //         console.log('Rapport trouvé:', report)
// //         setTodayStats({
// //           totalReceiptCDF: report.total_receipt_cdf || 0,
// //           totalReceiptUSD: report.total_receipt_usd || 0,
// //           totalOutflowCDF: report.total_outflow_cdf || 0,
// //           totalOutflowUSD: report.total_outflow_usd || 0,
// //           netBalanceCDF: report.balance_cdf || 0,
// //           netBalanceUSD: report.balance_usd || 0
// //         })
// //         setDebugInfo(prev => prev + ` | Rapport chargé: ${JSON.stringify(report)}`)
// //       } else {
// //         console.log('Pas de rapport, calcul manuel...')
// //         await calculateTodayStats(userId)
// //       }
// //     } catch (err) {
// //       console.error('Exception loadTodayStats:', err)
// //       setDebugInfo(prev => prev + ` | Exception stats: ${err.message}`)
// //       await calculateTodayStats(userId)
// //     }
// //   }

// //   const calculateTodayStats = async (userId) => {
// //     try {
// //       const today = new Date().toISOString().split('T')[0]
// //       console.log(`Calcul manuel stats pour ${userId} le ${today}`)
      
// //       // Recettes du jour (ventes)
// //       const { data: salesData, error: salesError } = await supabase
// //         .from('sale')
// //         .select('total, currency, currency_rate')
// //         .eq('user_id', userId)
// //         .eq('status', 'completed')
// //         .eq('payment_status', 'paid')
// //         .gte('created_at', `${today}T00:00:00`)
// //         .lte('created_at', `${today}T23:59:59`)
      
// //       if (salesError) {
// //         console.error('Erreur ventes:', salesError)
// //         setDebugInfo(prev => prev + ` | Erreur ventes: ${salesError.message}`)
// //       }
      
// //       // Dépenses du jour (sorties)
// //       const { data: outflowsData, error: outflowsError } = await supabase
// //         .from('cash_outflow')
// //         .select('amount, currency, currency_rate')
// //         .eq('user_id', userId)
// //         .eq('date', today)
// //         .eq('status', 'completed')
      
// //       if (outflowsError) {
// //         console.error('Erreur sorties:', outflowsError)
// //         setDebugInfo(prev => prev + ` | Erreur sorties: ${outflowsError.message}`)
// //       }
      
// //       console.log('Ventes trouvées:', salesData?.length || 0)
// //       console.log('Sorties trouvées:', outflowsData?.length || 0)
      
// //       let totalReceiptCDF = 0
// //       let totalReceiptUSD = 0
// //       let totalOutflowCDF = 0
// //       let totalOutflowUSD = 0
      
// //       if (salesData) {
// //         salesData.forEach(sale => {
// //           const montant = sale.total || 0
          
// //           if (sale.currency === 'USD') {
// //             totalReceiptUSD += montant
// //           } else {
// //             totalReceiptCDF += montant
// //           }
// //         })
// //       }
      
// //       if (outflowsData) {
// //         outflowsData.forEach(outflow => {
// //           const montant = outflow.amount || 0
          
// //           if (outflow.currency === 'USD') {
// //             totalOutflowUSD += montant
// //           } else {
// //             totalOutflowCDF += montant
// //           }
// //         })
// //       }
      
// //       const netBalanceCDF = totalReceiptCDF - totalOutflowCDF
// //       const netBalanceUSD = totalReceiptUSD - totalOutflowUSD
      
// //       console.log('Stats calculées:', {
// //         totalReceiptCDF, totalReceiptUSD,
// //         totalOutflowCDF, totalOutflowUSD,
// //         netBalanceCDF, netBalanceUSD
// //       })
      
// //       setTodayStats({
// //         totalReceiptCDF: Math.round(totalReceiptCDF),
// //         totalReceiptUSD: parseFloat(totalReceiptUSD.toFixed(2)),
// //         totalOutflowCDF: Math.round(totalOutflowCDF),
// //         totalOutflowUSD: parseFloat(totalOutflowUSD.toFixed(2)),
// //         netBalanceCDF: Math.round(netBalanceCDF),
// //         netBalanceUSD: parseFloat(netBalanceUSD.toFixed(2))
// //       })
      
// //       setDebugInfo(prev => prev + ` | Stats calculées: R(CDF)=${totalReceiptCDF}, R(USD)=${totalReceiptUSD}, D(CDF)=${totalOutflowCDF}, D(USD)=${totalOutflowUSD}`)
// //     } catch (err) {
// //       console.error('Exception calculateTodayStats:', err)
// //       setDebugInfo(prev => prev + ` | Exception calculate: ${err.message}`)
// //     }
// //   }

// //   const loadTodayOutflows = async (userId) => {
// //     try {
// //       const today = new Date().toISOString().split('T')[0]
// //       console.log(`Chargement sorties pour ${userId} le ${today}`)
      
// //       const { data, error: outflowsError } = await supabase
// //         .from('cash_outflow')
// //         .select('*')
// //         .eq('user_id', userId)
// //         .eq('date', today)
// //         .eq('status', 'completed')
// //         .order('created_at', { ascending: false })
      
// //       if (outflowsError) {
// //         console.error('Erreur chargement sorties:', outflowsError)
// //         setDebugInfo(prev => prev + ` | Erreur load outflows: ${outflowsError.message}`)
// //         return
// //       }
      
// //       console.log('Sorties chargées:', data?.length || 0)
// //       setOutflows(data || [])
// //       setDebugInfo(prev => prev + ` | Outflows chargées: ${data?.length || 0}`)
// //     } catch (err) {
// //       console.error('Exception loadTodayOutflows:', err)
// //       setDebugInfo(prev => prev + ` | Exception load outflows: ${err.message}`)
// //     }
// //   }

// //   const handleCreateOutflow = async () => {
// //     console.log('handleCreateOutflow appelé')
// //     console.log('Nouvelle sortie:', newOutflow)
    
// //     if (!newOutflow.amount || parseFloat(newOutflow.amount) <= 0) {
// //       setError('Veuillez entrer un montant valide')
// //       setDebugInfo('Montant invalide ou vide')
// //       return
// //     }

// //     if (!newOutflow.reason.trim()) {
// //       setError('Veuillez entrer un motif')
// //       setDebugInfo('Motif vide')
// //       return
// //     }

// //     if (!user) {
// //       setError('Session expirée, veuillez vous reconnecter')
// //       setDebugInfo('User est null')
// //       return
// //     }

// //     setError('')
// //     setDebugInfo(`Création sortie pour user ${user.id}`)

// //     try {
// //       const outflowData = {
// //         amount: parseFloat(newOutflow.amount),
// //         currency: newOutflow.currency,
// //         currency_rate: newOutflow.currency === 'USD' ? saleConfig.currency_rate : 1.0,
// //         reason: newOutflow.reason.trim(),
// //         category: newOutflow.category,
// //         user_id: user.id,
// //         date: new Date().toISOString().split('T')[0]
// //       }

// //       console.log('Données à insérer:', outflowData)

// //       const { data, error: insertError } = await supabase
// //         .from('cash_outflow')
// //         .insert([outflowData])
// //         .select()

// //       if (insertError) {
// //         console.error('Erreur Supabase insert:', insertError)
// //         setError(`Erreur Supabase: ${insertError.message}`)
// //         setDebugInfo(`Erreur insert: ${JSON.stringify(insertError)}`)
// //         return
// //       }

// //       console.log('Sortie créée avec succès:', data)

// //       setNewOutflow({
// //         amount: '',
// //         currency: 'CDF',
// //         reason: '',
// //         category: 'Divers'
// //       })
      
// //       setShowOutflowModal(false)
      
// //       // Recharger les données
// //       await loadTodayStats(user.id)
// //       await loadTodayOutflows(user.id)
      
// //       setDebugInfo('Sortie créée avec succès')
      
// //     } catch (err) {
// //       console.error('Exception handleCreateOutflow:', err)
// //       setError(`Erreur lors de l'enregistrement: ${err.message}`)
// //       setDebugInfo(`Exception: ${err.toString()}`)
// //     }
// //   }

// //   const handleDeleteOutflow = async (outflowId) => {
// //     if (!confirm('Voulez-vous vraiment supprimer cette sortie ?')) {
// //       return
// //     }

// //     try {
// //       console.log(`Suppression sortie ${outflowId} pour user ${user.id}`)
      
// //       const { error: deleteError } = await supabase
// //         .from('cash_outflow')
// //         .update({ status: 'cancelled' })
// //         .eq('id', outflowId)
// //         .eq('user_id', user.id)

// //       if (deleteError) {
// //         console.error('Erreur suppression:', deleteError)
// //         setError(`Erreur suppression: ${deleteError.message}`)
// //         setDebugInfo(`Erreur delete: ${JSON.stringify(deleteError)}`)
// //         return
// //       }

// //       // Recharger les données
// //       await loadTodayStats(user.id)
// //       await loadTodayOutflows(user.id)
      
// //       console.log('Sortie annulée avec succès')
// //       setDebugInfo('Sortie annulée avec succès')
      
// //     } catch (err) {
// //       console.error('Exception handleDeleteOutflow:', err)
// //       setError(`Erreur lors de l'annulation: ${err.message}`)
// //       setDebugInfo(`Exception delete: ${err.toString()}`)
// //     }
// //   }

// //   const formatCurrency = (amount, currency = 'CDF') => {
// //     const formatted = new Intl.NumberFormat('fr-FR', {
// //       minimumFractionDigits: currency === 'CDF' ? 0 : 2,
// //       maximumFractionDigits: currency === 'CDF' ? 0 : 2
// //     }).format(amount || 0)
    
// //     return `${currency === 'USD' ? '$' : 'FC'} ${formatted}`
// //   }

// //   const getCategoryColor = (category) => {
// //     const cat = categories.find(c => c.value === category)
// //     return cat ? cat.color : '#6b7280'
// //   }

// //   const handleRefresh = async () => {
// //     if (!user) return
    
// //     setLoading(true)
// //     setError('')
// //     setDebugInfo('Rafraîchissement...')
    
// //     await Promise.all([
// //       loadTodayStats(user.id),
// //       loadTodayOutflows(user.id)
// //     ])
    
// //     setLoading(false)
// //     setDebugInfo(prev => prev + ' | Rafraîchi')
// //   }

// //   if (loading) {
// //     return (
// //       <div className="flex flex-col items-center justify-center h-screen p-4">
// //         <Loader2 className="w-8 h-8 animate-spin text-gray-600 mx-auto mb-4" />
// //         <p className="text-gray-500">Chargement...</p>
// //         {debugInfo && (
// //           <div className="mt-4 p-3 bg-gray-100 rounded text-xs text-gray-600 max-w-lg">
// //             Debug: {debugInfo}
// //           </div>
// //         )}
// //       </div>
// //     )
// //   }

// //   if (!user) {
// //     return (
// //       <div className="p-4">
// //         <div className="bg-red-50 border border-red-200 rounded-lg p-4">
// //           <div className="flex items-center">
// //             <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
// //             <span className="text-red-700">
// //               Session expirée, veuillez vous reconnecter
// //             </span>
// //           </div>
// //         </div>
// //         {debugInfo && (
// //           <div className="mt-4 p-3 bg-gray-100 rounded text-xs text-gray-600">
// //             Debug: {debugInfo}
// //           </div>
// //         )}
// //       </div>
// //     )
// //   }

// //   return (
// //     <div className="p-4 sm:p-6">
// //       {/* Debug Info - Toujours visible */}
// //       <div className="mb-4">
// //         <div className="flex items-center justify-between">
// //           <h2 className="text-sm font-medium text-gray-700 flex items-center">
// //             <AlertTriangle className="w-4 h-4 mr-2 text-yellow-500" />
// //             Info Debug
// //           </h2>
// //           <button
// //             onClick={() => setDebugInfo('')}
// //             className="text-xs text-gray-500 hover:text-gray-700"
// //           >
// //             Effacer
// //           </button>
// //         </div>
// //         {debugInfo && (
// //           <div className="mt-2 p-3 bg-gray-100 rounded text-xs text-gray-600 font-mono whitespace-pre-wrap break-all">
// //             {debugInfo}
// //           </div>
// //         )}
// //       </div>

// //       {/* Header */}
// //       <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
// //         <div>
// //           <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
// //             Tableau de bord journalier
// //           </h1>
// //           <p className="text-gray-500 text-sm mt-1">
// //             Aujourd'hui • <span className="font-medium">{user.full_name || user.email}</span>
// //           </p>
// //         </div>
        
// //         <div className="flex items-center space-x-2">
// //           <button
// //             onClick={handleRefresh}
// //             disabled={loading}
// //             className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm disabled:opacity-50"
// //           >
// //             <RefreshCw className="w-4 h-4" />
// //             <span>Actualiser</span>
// //           </button>
// //           <button
// //             onClick={() => setShowOutflowModal(true)}
// //             className="flex items-center space-x-2 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm"
// //           >
// //             <ArrowDownRight className="w-4 h-4" />
// //             <span>Nouvelle sortie</span>
// //           </button>
// //         </div>
// //       </div>

// //       {/* Messages d'erreur */}
// //       {error && (
// //         <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
// //           <div className="flex items-center">
// //             <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
// //             <span className="text-red-700">{error}</span>
// //           </div>
// //         </div>
// //       )}

// //       {/* Cartes de statistiques CORRIGÉES */}
// //       <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
// //         {/* Recette */}
// //         <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg p-4">
// //           <div className="flex items-center justify-between mb-4">
// //             <div className="text-green-800">
// //               <ArrowUpRight className="w-6 h-6" />
// //             </div>
// //             <div className="text-xs font-medium text-green-800 bg-green-200 px-2 py-1 rounded">
// //               Recette du jour
// //             </div>
// //           </div>
// //           <div className="space-y-2">
// //             <div className="text-lg font-bold text-green-900">
// //               {formatCurrency(todayStats.totalReceiptCDF)}
// //               <span className="text-sm font-normal ml-2 text-green-700">
// //                 (CDF)
// //               </span>
// //             </div>
// //             <div className="text-sm text-green-700 flex items-center">
// //               <DollarSign className="w-3 h-3 mr-1" />
// //               <span>{todayStats.totalReceiptUSD.toFixed(2)} USD</span>
// //             </div>
// //           </div>
// //         </div>

// //         {/* Dépense - CORRIGÉ */}
// //         <div className="bg-gradient-to-br from-red-50 to-red-100 border border-red-200 rounded-lg p-4">
// //           <div className="flex items-center justify-between mb-4">
// //             <div className="text-red-800">
// //               <ArrowDownRight className="w-6 h-6" />
// //             </div>
// //             <div className="text-xs font-medium text-red-800 bg-red-200 px-2 py-1 rounded">
// //               Dépense du jour
// //             </div>
// //           </div>
// //           <div className="space-y-2">
// //             {/* Afficher UNIQUEMENT les dépenses CDF ici */}
// //             <div className="text-lg font-bold text-red-900">
// //               {formatCurrency(todayStats.totalOutflowCDF)}
// //               <span className="text-sm font-normal ml-2 text-red-700">
// //                 (CDF uniquement)
// //               </span>
// //             </div>
// //             <div className="text-sm text-red-700 flex items-center">
// //               <DollarSign className="w-3 h-3 mr-1" />
// //               <span>{todayStats.totalOutflowUSD.toFixed(2)} USD</span>
// //               <span className="text-xs text-red-600 ml-2">
// //                 (USD uniquement)
// //               </span>
// //             </div>
// //             {/* Optionnel: Montrer l'équivalent total si besoin */}
// //             <div className="text-xs text-red-600 pt-1 border-t border-red-200">
// //               Équivalent total: ≈ {formatCurrency(
// //                 todayStats.totalOutflowCDF + (todayStats.totalOutflowUSD * saleConfig.currency_rate)
// //               )}
// //             </div>
// //           </div>
// //         </div>

// //         {/* Solde net - CORRIGÉ */}
// //         <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-4">
// //           <div className="flex items-center justify-between mb-4">
// //             <div className="text-blue-800">
// //               <Wallet className="w-6 h-6" />
// //             </div>
// //             <div className="text-xs font-medium text-blue-800 bg-blue-200 px-2 py-1 rounded">
// //               Solde net
// //             </div>
// //           </div>
// //           <div className="space-y-2">
// //             {/* Solde net CDF (seulement CDF) */}
// //             <div className={`text-lg font-bold ${todayStats.netBalanceCDF >= 0 ? 'text-blue-900' : 'text-red-900'}`}>
// //               {formatCurrency(todayStats.netBalanceCDF)}
// //               <span className="text-sm font-normal ml-2">
// //                 (CDF)
// //               </span>
// //             </div>
// //             {/* Solde net USD (seulement USD) */}
// //             <div className={`text-sm flex items-center ${todayStats.netBalanceUSD >= 0 ? 'text-blue-700' : 'text-red-700'}`}>
// //               <DollarSign className="w-3 h-3 mr-1" />
// //               <span>{todayStats.netBalanceUSD.toFixed(2)} USD</span>
// //             </div>
// //             {/* Optionnel: Solde net global converti */}
// //             <div className="text-xs text-blue-600 pt-1 border-t border-blue-200">
// //               Solde global: ≈ {formatCurrency(
// //                 todayStats.netBalanceCDF + (todayStats.netBalanceUSD * saleConfig.currency_rate)
// //               )}
// //             </div>
// //           </div>
// //         </div>
// //       </div>

// //       {/* Liste des sorties du jour */}
// //       <div className="bg-white rounded-lg border border-gray-200 mb-6">
// //         <div className="p-4 border-b border-gray-200">
// //           <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
// //             <h3 className="text-lg font-semibold text-gray-900 flex items-center">
// //               <ArrowDownRight className="w-5 h-5 mr-2 text-red-600" />
// //               Sorties d'aujourd'hui
// //             </h3>
// //             <div className="flex items-center space-x-2 text-sm text-gray-500">
// //               <Calendar className="w-4 h-4" />
// //               <span>{new Date().toLocaleDateString('fr-FR', {
// //                 weekday: 'long',
// //                 year: 'numeric',
// //                 month: 'long',
// //                 day: 'numeric'
// //               })}</span>
// //             </div>
// //           </div>
// //         </div>
        
// //         {outflows.length > 0 ? (
// //           <div className="overflow-x-auto">
// //             <table className="min-w-full divide-y divide-gray-200">
// //               <thead className="bg-gray-50">
// //                 <tr>
// //                   <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
// //                     N° Sortie
// //                   </th>
// //                   <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
// //                     Catégorie
// //                   </th>
// //                   <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
// //                     Motif
// //                   </th>
// //                   <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
// //                     Montant
// //                   </th>
// //                   <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
// //                     Heure
// //                   </th>
// //                   <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
// //                     Actions
// //                   </th>
// //                 </tr>
// //               </thead>
// //               <tbody className="divide-y divide-gray-200">
// //                 {outflows.map((outflow) => (
// //                   <tr key={outflow.id} className="hover:bg-gray-50">
// //                     <td className="px-4 py-3 whitespace-nowrap">
// //                       <div className="font-mono text-sm text-gray-900">
// //                         {outflow.outflow_number || 'N/A'}
// //                       </div>
// //                     </td>
// //                     <td className="px-4 py-3">
// //                       <span
// //                         className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
// //                         style={{ 
// //                           backgroundColor: `${getCategoryColor(outflow.category)}20`,
// //                           color: getCategoryColor(outflow.category)
// //                         }}
// //                       >
// //                         {outflow.category}
// //                       </span>
// //                     </td>
// //                     <td className="px-4 py-3">
// //                       <div className="text-sm text-gray-900 max-w-xs truncate">
// //                         {outflow.reason}
// //                       </div>
// //                     </td>
// //                     <td className="px-4 py-3">
// //                       <div className={`text-sm font-semibold ${outflow.currency === 'USD' ? 'text-blue-600' : 'text-red-600'}`}>
// //                         {formatCurrency(outflow.amount, outflow.currency)}
// //                       </div>
// //                       {outflow.currency === 'USD' && outflow.currency_rate && (
// //                         <div className="text-xs text-gray-500">
// //                           ≈ {formatCurrency(outflow.amount * outflow.currency_rate, 'CDF')}
// //                         </div>
// //                       )}
// //                     </td>
// //                     <td className="px-4 py-3 whitespace-nowrap">
// //                       <div className="text-sm text-gray-500">
// //                         {new Date(outflow.created_at).toLocaleTimeString('fr-FR', {
// //                           hour: '2-digit',
// //                           minute: '2-digit'
// //                         })}
// //                       </div>
// //                     </td>
// //                     <td className="px-4 py-3 whitespace-nowrap">
// //                       <button
// //                         onClick={() => handleDeleteOutflow(outflow.id)}
// //                         className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
// //                         title="Supprimer"
// //                       >
// //                         <Trash2 className="w-4 h-4" />
// //                       </button>
// //                     </td>
// //                   </tr>
// //                 ))}
// //               </tbody>
// //             </table>
// //           </div>
// //         ) : (
// //           <div className="p-8 text-center">
// //             <ArrowDownRight className="w-12 h-12 text-gray-400 mx-auto mb-3" />
// //             <h4 className="text-gray-900 font-medium mb-1">
// //               Aucune sortie aujourd'hui
// //             </h4>
// //             <p className="text-gray-500 text-sm mb-4">
// //               Enregistrez votre première sortie de caisse
// //             </p>
// //             <button
// //               onClick={() => setShowOutflowModal(true)}
// //               className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm"
// //             >
// //               <ArrowDownRight className="w-4 h-4 mr-2" />
// //               Nouvelle sortie
// //             </button>
// //           </div>
// //         )}
// //       </div>

// //       {/* Modal pour nouvelle sortie */}
// //       {showOutflowModal && (
// //         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
// //           <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
// //             <div className="p-6">
// //               <div className="flex items-center justify-between mb-4">
// //                 <h3 className="text-lg font-semibold text-gray-900">
// //                   Nouvelle sortie de caisse
// //                 </h3>
// //                 <button
// //                   onClick={() => setShowOutflowModal(false)}
// //                   className="p-1 hover:bg-gray-100 rounded"
// //                 >
// //                   <X className="w-5 h-5" />
// //                 </button>
// //               </div>
              
// //               <div className="space-y-4">
// //                 <div>
// //                   <label className="block text-sm font-medium text-gray-700 mb-1">
// //                     Montant *
// //                   </label>
// //                   <div className="flex gap-2">
// //                     <input
// //                       type="number"
// //                       step="0.01"
// //                       min="0.01"
// //                       value={newOutflow.amount}
// //                       onChange={(e) => setNewOutflow({...newOutflow, amount: e.target.value})}
// //                       className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-red-600 focus:border-red-600 text-sm"
// //                       placeholder="0.00"
// //                     />
// //                     <select
// //                       value={newOutflow.currency}
// //                       onChange={(e) => setNewOutflow({...newOutflow, currency: e.target.value})}
// //                       className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-red-600 focus:border-red-600 bg-white text-sm"
// //                     >
// //                       <option value="CDF">CDF</option>
// //                       <option value="USD">USD</option>
// //                     </select>
// //                   </div>
// //                   {newOutflow.currency === 'USD' && (
// //                     <p className="text-xs text-gray-500 mt-1">
// //                       Taux: 1$ = {saleConfig.currency_rate?.toLocaleString('fr-FR') || '2,300'} FC
// //                     </p>
// //                   )}
// //                 </div>
                
// //                 <div>
// //                   <label className="block text-sm font-medium text-gray-700 mb-1">
// //                     Catégorie
// //                   </label>
// //                   <select
// //                     value={newOutflow.category}
// //                     onChange={(e) => setNewOutflow({...newOutflow, category: e.target.value})}
// //                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-red-600 focus:border-red-600 bg-white text-sm"
// //                   >
// //                     {categories.map(cat => (
// //                       <option key={cat.value} value={cat.value}>
// //                         {cat.label}
// //                       </option>
// //                     ))}
// //                   </select>
// //                 </div>
                
// //                 <div>
// //                   <label className="block text-sm font-medium text-gray-700 mb-1">
// //                     Motif *
// //                   </label>
// //                   <textarea
// //                     value={newOutflow.reason}
// //                     onChange={(e) => setNewOutflow({...newOutflow, reason: e.target.value})}
// //                     rows="3"
// //                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-red-600 focus:border-red-600 text-sm"
// //                     placeholder="Décrivez le motif de cette sortie..."
// //                   />
// //                 </div>
                
// //                 <div className="pt-4 border-t border-gray-200">
// //                   <div className="flex space-x-3">
// //                     <button
// //                       onClick={() => setShowOutflowModal(false)}
// //                       className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm"
// //                     >
// //                       Annuler
// //                     </button>
// //                     <button
// //                       onClick={handleCreateOutflow}
// //                       className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm"
// //                     >
// //                       Enregistrer
// //                     </button>
// //                   </div>
// //                 </div>
// //               </div>
// //             </div>
// //           </div>
// //         </div>
// //       )}
// //     </div>
// //   )
// // }


// 'use client'

// import { useState, useEffect, useCallback } from 'react'
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
//   AlertTriangle,
//   CheckCircle,
//   Info,
//   Shield,
//   TrendingUp,
//   TrendingDown,
//   Filter
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
//   const [success, setSuccess] = useState('')
//   const [debugInfo, setDebugInfo] = useState('')
//   const [availableBalances, setAvailableBalances] = useState({
//     CDF: 0,
//     USD: 0
//   })
//   const [filterCategory, setFilterCategory] = useState('all')

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

//   // Fonction pour charger les soldes disponibles
//   const loadAvailableBalances = useCallback(async (userId) => {
//     try {
//       const { data: balances, error: balanceError } = await supabase
//         .from('daily_user_financial_report')
//         .select('closing_balance_cdf, closing_balance_usd')
//         .eq('user_id', userId)
//         .order('report_date', { ascending: false })
//         .limit(1)
//         .single()

//       if (!balanceError && balances) {
//         setAvailableBalances({
//           CDF: balances.closing_balance_cdf || 0,
//           USD: balances.closing_balance_usd || 0
//         })
//       } else {
//         // Si pas de rapport, utiliser les stats du jour
//         setAvailableBalances({
//           CDF: Math.max(0, todayStats.netBalanceCDF),
//           USD: Math.max(0, todayStats.netBalanceUSD)
//         })
//       }
//     } catch (err) {
//       console.error('Erreur chargement soldes:', err)
//     }
//   }, [todayStats])

//   // Initialisation
//   useEffect(() => {
//     const init = async () => {
//       setLoading(true)
//       setError('')
//       setSuccess('')
//       setDebugInfo('Initialisation...')
      
//       try {
//         const currentUser = checkAuth()
        
//         if (!currentUser) {
//           setError('Session expirée. Veuillez vous reconnecter.')
//           setLoading(false)
//           return
//         }
        
//         setUser(currentUser)
        
//         await Promise.all([
//           loadSaleConfig(),
//           loadTodayStats(currentUser.id),
//           loadTodayOutflows(currentUser.id)
//         ])
        
//         setDebugInfo('')
//       } catch (err) {
//         console.error('Erreur initialisation:', err)
//         setError(`Erreur: ${err.message}`)
//       } finally {
//         setLoading(false)
//       }
//     }
    
//     init()
//   }, [])

//   // Recharger les soldes quand les stats changent
//   useEffect(() => {
//     if (user) {
//       loadAvailableBalances(user.id)
//     }
//   }, [user, todayStats, loadAvailableBalances])

//   const loadSaleConfig = async () => {
//     try {
//       const { data, error: configError } = await supabase
//         .from('sale_config')
//         .select('*')
//         .order('created_at', { ascending: false })
//         .limit(1)
//         .single()
      
//       if (!configError && data) {
//         setSaleConfig(data)
//       }
//     } catch (err) {
//       console.error('Erreur config:', err)
//     }
//   }

//   const loadTodayStats = async (userId) => {
//     try {
//       const today = new Date().toISOString().split('T')[0]
      
//       // Récupérer le rapport journalier
//       const { data: report, error: reportError } = await supabase
//         .from('daily_user_financial_report')
//         .select('*')
//         .eq('report_date', today)
//         .eq('user_id', userId)
//         .single()
      
//       if (report) {
//         setTodayStats({
//           totalReceiptCDF: report.total_receipt_cdf || 0,
//           totalReceiptUSD: report.total_receipt_usd || 0,
//           totalOutflowCDF: report.total_outflow_cdf || 0,
//           totalOutflowUSD: report.total_outflow_usd || 0,
//           netBalanceCDF: report.balance_cdf || 0,
//           netBalanceUSD: report.balance_usd || 0
//         })
//       } else {
//         // Calcul manuel
//         await calculateTodayStats(userId)
//       }
//     } catch (err) {
//       console.error('Erreur stats:', err)
//       await calculateTodayStats(userId)
//     }
//   }

//   const calculateTodayStats = async (userId) => {
//     try {
//       const today = new Date().toISOString().split('T')[0]
      
//       // Ventes du jour
//       const { data: salesData } = await supabase
//         .from('sale')
//         .select('total, currency, currency_rate')
//         .eq('user_id', userId)
//         .eq('status', 'completed')
//         .eq('payment_status', 'paid')
//         .gte('created_at', `${today}T00:00:00`)
//         .lte('created_at', `${today}T23:59:59`)
      
//       // Dépenses du jour
//       const { data: outflowsData } = await supabase
//         .from('cash_outflow')
//         .select('amount, currency, currency_rate')
//         .eq('user_id', userId)
//         .eq('date', today)
//         .eq('status', 'completed')
      
//       let totalReceiptCDF = 0
//       let totalReceiptUSD = 0
//       let totalOutflowCDF = 0
//       let totalOutflowUSD = 0
      
//       if (salesData) {
//         salesData.forEach(sale => {
//           const montant = sale.total || 0
//           if (sale.currency === 'USD') {
//             totalReceiptUSD += montant
//           } else if (sale.currency === 'CDF') {
//             totalReceiptCDF += montant
//           }
//         })
//       }
      
//       if (outflowsData) {
//         outflowsData.forEach(outflow => {
//           const montant = outflow.amount || 0
//           if (outflow.currency === 'USD') {
//             totalOutflowUSD += montant
//           } else if (outflow.currency === 'CDF') {
//             totalOutflowCDF += montant
//           }
//         })
//       }
      
//       const netBalanceCDF = totalReceiptCDF - totalOutflowCDF
//       const netBalanceUSD = totalReceiptUSD - totalOutflowUSD
      
//       setTodayStats({
//         totalReceiptCDF: Math.round(totalReceiptCDF),
//         totalReceiptUSD: parseFloat(totalReceiptUSD.toFixed(2)),
//         totalOutflowCDF: Math.round(totalOutflowCDF),
//         totalOutflowUSD: parseFloat(totalOutflowUSD.toFixed(2)),
//         netBalanceCDF: Math.round(netBalanceCDF),
//         netBalanceUSD: parseFloat(netBalanceUSD.toFixed(2))
//       })
//     } catch (err) {
//       console.error('Erreur calcul:', err)
//     }
//   }

//   const loadTodayOutflows = async (userId) => {
//     try {
//       const today = new Date().toISOString().split('T')[0]
      
//       const { data, error: outflowsError } = await supabase
//         .from('cash_outflow')
//         .select('*')
//         .eq('user_id', userId)
//         .eq('date', today)
//         .eq('status', 'completed')
//         .order('created_at', { ascending: false })
      
//       if (!outflowsError && data) {
//         setOutflows(data)
//       }
//     } catch (err) {
//       console.error('Erreur sorties:', err)
//     }
//   }

//   // Filtrer les sorties par catégorie
//   const filteredOutflows = filterCategory === 'all' 
//     ? outflows 
//     : outflows.filter(outflow => outflow.category === filterCategory)

//   // Valider si le solde est suffisant
//   const validateBalance = (amount, currency) => {
//     const availableBalance = availableBalances[currency] || 0
//     if (parseFloat(amount) > availableBalance) {
//       return {
//         valid: false,
//         message: `Solde ${currency} insuffisant. Disponible: ${formatCurrency(availableBalance, currency)}`
//       }
//     }
//     return { valid: true, message: '' }
//   }

//   const handleCreateOutflow = async () => {
//     // Validation
//     if (!newOutflow.amount || parseFloat(newOutflow.amount) <= 0) {
//       setError('Veuillez entrer un montant valide')
//       return
//     }

//     if (!newOutflow.reason.trim()) {
//       setError('Veuillez entrer un motif')
//       return
//     }

//     if (!user) {
//       setError('Session expirée. Veuillez vous reconnecter.')
//       return
//     }

//     // Vérifier le solde disponible
//     const balanceCheck = validateBalance(newOutflow.amount, newOutflow.currency)
//     if (!balanceCheck.valid) {
//       setError(balanceCheck.message)
//       return
//     }

//     setError('')
//     setSuccess('')

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

//       const { data, error: insertError } = await supabase
//         .from('cash_outflow')
//         .insert([outflowData])
//         .select()

//       if (insertError) {
//         setError(`Erreur: ${insertError.message}`)
//         return
//       }

//       // Succès
//       setSuccess('Sortie enregistrée avec succès!')
//       setNewOutflow({
//         amount: '',
//         currency: 'CDF',
//         reason: '',
//         category: 'Divers'
//       })
      
//       setShowOutflowModal(false)
      
//       // Recharger les données
//       await Promise.all([
//         loadTodayStats(user.id),
//         loadTodayOutflows(user.id)
//       ])
      
//       // Effacer le message de succès après 3 secondes
//       setTimeout(() => setSuccess(''), 3000)
      
//     } catch (err) {
//       console.error('Erreur création:', err)
//       setError(`Erreur: ${err.message}`)
//     }
//   }

//   const handleDeleteOutflow = async (outflowId) => {
//     if (!confirm('Êtes-vous sûr de vouloir supprimer cette sortie ? Cette action est irréversible.')) {
//       return
//     }

//     try {
//       const { error: deleteError } = await supabase
//         .from('cash_outflow')
//         .update({ status: 'cancelled' })
//         .eq('id', outflowId)
//         .eq('user_id', user.id)

//       if (deleteError) {
//         setError(`Erreur: ${deleteError.message}`)
//         return
//       }

//       // Recharger les données
//       await Promise.all([
//         loadTodayStats(user.id),
//         loadTodayOutflows(user.id)
//       ])
      
//       setSuccess('Sortie supprimée avec succès!')
//       setTimeout(() => setSuccess(''), 3000)
      
//     } catch (err) {
//       console.error('Erreur suppression:', err)
//       setError(`Erreur: ${err.message}`)
//     }
//   }

//   const formatCurrency = (amount, currency = 'CDF') => {
//     if (!amount && amount !== 0) return '0'
    
//     const formatted = new Intl.NumberFormat('fr-FR', {
//       minimumFractionDigits: currency === 'USD' ? 2 : 0,
//       maximumFractionDigits: currency === 'USD' ? 2 : 0
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
//     setSuccess('')
    
//     await Promise.all([
//       loadTodayStats(user.id),
//       loadTodayOutflows(user.id)
//     ])
    
//     setLoading(false)
//   }

//   // Calculer les totaux par catégorie
//   const categoryTotals = categories.reduce((acc, cat) => {
//     const total = outflows
//       .filter(o => o.category === cat.value)
//       .reduce((sum, o) => sum + (o.amount || 0), 0)
//     acc[cat.value] = total
//     return acc
//   }, {})

//   if (loading) {
//     return (
//       <div className="flex flex-col items-center justify-center min-h-[400px] p-4">
//         <div className="relative">
//           <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
//           <div className="absolute inset-0 flex items-center justify-center">
//             <Wallet className="w-6 h-6 text-white" />
//           </div>
//         </div>
//         <p className="mt-4 text-gray-600 font-medium">Chargement du tableau de bord...</p>
//       </div>
//     )
//   }

//   if (!user) {
//     return (
//       <div className="p-4 sm:p-6">
//         <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
//           <div className="flex items-center">
//             <AlertCircle className="h-6 w-6 text-red-500 mr-3" />
//             <div>
//               <h3 className="text-lg font-semibold text-red-800">Session expirée</h3>
//               <p className="text-red-700">Veuillez vous reconnecter pour accéder au tableau de bord.</p>
//             </div>
//           </div>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="p-4 sm:p-6 max-w-7xl mx-auto">
//       {/* Messages d'alerte */}
//       {error && (
//         <div className="mb-6 animate-fade-in">
//           <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
//             <div className="flex items-center">
//               <AlertCircle className="h-5 w-5 text-red-500 mr-3" />
//               <div className="flex-1">
//                 <p className="text-red-800 font-medium">{error}</p>
//               </div>
//               <button onClick={() => setError('')} className="text-red-500 hover:text-red-700">
//                 <X className="w-5 h-5" />
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {success && (
//         <div className="mb-6 animate-fade-in">
//           <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg">
//             <div className="flex items-center">
//               <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
//               <div className="flex-1">
//                 <p className="text-green-800 font-medium">{success}</p>
//               </div>
//               <button onClick={() => setSuccess('')} className="text-green-500 hover:text-green-700">
//                 <X className="w-5 h-5" />
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Header */}
//       <div className="mb-8">
//         <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
//           <div>
//             <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
//               Tableau de bord financier
//             </h1>
//             <div className="flex items-center mt-2 space-x-4">
//               <div className="flex items-center text-gray-600">
//                 <Calendar className="w-4 h-4 mr-2" />
//                 <span className="text-sm font-medium">
//                   {new Date().toLocaleDateString('fr-FR', {
//                     weekday: 'long',
//                     year: 'numeric',
//                     month: 'long',
//                     day: 'numeric'
//                   })}
//                 </span>
//               </div>
//               <div className="flex items-center text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
//                 <Shield className="w-4 h-4 mr-2" />
//                 <span className="text-sm font-medium">{user.full_name || user.email}</span>
//               </div>
//             </div>
//           </div>
          
//           <div className="flex flex-col sm:flex-row gap-3">
//             <button
//               onClick={handleRefresh}
//               disabled={loading}
//               className="inline-flex items-center justify-center px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
//               Actualiser
//             </button>
//             <button
//               onClick={() => setShowOutflowModal(true)}
//               className="inline-flex items-center justify-center px-4 py-2.5 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-200 shadow-sm hover:shadow text-sm font-medium"
//             >
//               <ArrowDownRight className="w-4 h-4 mr-2" />
//               Nouvelle sortie
//             </button>
//           </div>
//         </div>

//         {/* Indicateur de solde disponible */}
//         <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4 mb-6">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center">
//               <Wallet className="w-5 h-5 text-blue-600 mr-2" />
//               <span className="text-sm font-medium text-gray-700">Soldes disponibles :</span>
//             </div>
//             <div className="flex items-center space-x-6">
//               <div className="text-center">
//                 <div className="text-lg font-bold text-gray-900">
//                   {formatCurrency(availableBalances.CDF, 'CDF')}
//                 </div>
//                 <div className="text-xs text-gray-500">CDF</div>
//               </div>
//               <div className="text-center">
//                 <div className="text-lg font-bold text-gray-900">
//                   {formatCurrency(availableBalances.USD, 'USD')}
//                 </div>
//                 <div className="text-xs text-gray-500">USD</div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Cartes de statistiques */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
//         {/* Recette CDF */}
//         <div className="bg-white border border-green-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow duration-200">
//           <div className="flex items-center justify-between mb-4">
//             <div className="p-2 bg-green-100 rounded-lg">
//               <ArrowUpRight className="w-6 h-6 text-green-600" />
//             </div>
//             <span className="text-xs font-semibold text-green-700 bg-green-100 px-3 py-1 rounded-full">
//               RECETTE CDF
//             </span>
//           </div>
//           <div className="space-y-3">
//             <div className="text-2xl font-bold text-gray-900">
//               {formatCurrency(todayStats.totalReceiptCDF, 'CDF')}
//             </div>
//             <div className="flex items-center text-sm text-gray-600">
//               <TrendingUp className="w-4 h-4 mr-1" />
//               <span>Recette totale en Francs Congolais</span>
//             </div>
//           </div>
//         </div>

//         {/* Recette USD */}
//         <div className="bg-white border border-blue-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow duration-200">
//           <div className="flex items-center justify-between mb-4">
//             <div className="p-2 bg-blue-100 rounded-lg">
//               <ArrowUpRight className="w-6 h-6 text-blue-600" />
//             </div>
//             <span className="text-xs font-semibold text-blue-700 bg-blue-100 px-3 py-1 rounded-full">
//               RECETTE USD
//             </span>
//           </div>
//           <div className="space-y-3">
//             <div className="text-2xl font-bold text-gray-900">
//               {formatCurrency(todayStats.totalReceiptUSD, 'USD')}
//             </div>
//             <div className="flex items-center text-sm text-gray-600">
//               <TrendingUp className="w-4 h-4 mr-1" />
//               <span>Recette totale en Dollars US</span>
//             </div>
//           </div>
//         </div>

//         {/* Dépenses - Cartes séparées */}
//         <div className="bg-white border border-red-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow duration-200">
//           <div className="flex items-center justify-between mb-4">
//             <div className="p-2 bg-red-100 rounded-lg">
//               <ArrowDownRight className="w-6 h-6 text-red-600" />
//             </div>
//             <span className="text-xs font-semibold text-red-700 bg-red-100 px-3 py-1 rounded-full">
//               DÉPENSES
//             </span>
//           </div>
//           <div className="space-y-4">
//             <div>
//               <div className="text-lg font-bold text-red-700 mb-1">
//                 {formatCurrency(todayStats.totalOutflowCDF, 'CDF')}
//               </div>
//               <div className="text-xs text-gray-500">Dépenses CDF</div>
//             </div>
//             <div className="border-t border-gray-100 pt-3">
//               <div className="text-lg font-bold text-blue-700 mb-1">
//                 {formatCurrency(todayStats.totalOutflowUSD, 'USD')}
//               </div>
//               <div className="text-xs text-gray-500">Dépenses USD</div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Solde net - Cartes séparées */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
//         {/* Solde net CDF */}
//         <div className={`bg-white border rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-200 ${
//           todayStats.netBalanceCDF >= 0 ? 'border-green-200' : 'border-red-200'
//         }`}>
//           <div className="flex items-center justify-between mb-4">
//             <div className={`p-2 rounded-lg ${
//               todayStats.netBalanceCDF >= 0 ? 'bg-green-100' : 'bg-red-100'
//             }`}>
//               <Wallet className={`w-6 h-6 ${
//                 todayStats.netBalanceCDF >= 0 ? 'text-green-600' : 'text-red-600'
//               }`} />
//             </div>
//             <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
//               todayStats.netBalanceCDF >= 0 
//                 ? 'text-green-700 bg-green-100' 
//                 : 'text-red-700 bg-red-100'
//             }`}>
//               SOLDE NET CDF
//             </span>
//           </div>
//           <div className="space-y-3">
//             <div className={`text-2xl font-bold ${
//               todayStats.netBalanceCDF >= 0 ? 'text-green-700' : 'text-red-700'
//             }`}>
//               {formatCurrency(todayStats.netBalanceCDF, 'CDF')}
//             </div>
//             <div className="flex items-center text-sm text-gray-600">
//               {todayStats.netBalanceCDF >= 0 ? (
//                 <>
//                   <TrendingUp className="w-4 h-4 mr-1 text-green-500" />
//                   <span>Solde positif en Francs Congolais</span>
//                 </>
//               ) : (
//                 <>
//                   <TrendingDown className="w-4 h-4 mr-1 text-red-500" />
//                   <span>Déficit en Francs Congolais</span>
//                 </>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Solde net USD */}
//         <div className={`bg-white border rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-200 ${
//           todayStats.netBalanceUSD >= 0 ? 'border-green-200' : 'border-red-200'
//         }`}>
//           <div className="flex items-center justify-between mb-4">
//             <div className={`p-2 rounded-lg ${
//               todayStats.netBalanceUSD >= 0 ? 'bg-green-100' : 'bg-red-100'
//             }`}>
//               <DollarSign className={`w-6 h-6 ${
//                 todayStats.netBalanceUSD >= 0 ? 'text-green-600' : 'text-red-600'
//               }`} />
//             </div>
//             <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
//               todayStats.netBalanceUSD >= 0 
//                 ? 'text-green-700 bg-green-100' 
//                 : 'text-red-700 bg-red-100'
//             }`}>
//               SOLDE NET USD
//             </span>
//           </div>
//           <div className="space-y-3">
//             <div className={`text-2xl font-bold ${
//               todayStats.netBalanceUSD >= 0 ? 'text-green-700' : 'text-red-700'
//             }`}>
//               {formatCurrency(todayStats.netBalanceUSD, 'USD')}
//             </div>
//             <div className="flex items-center text-sm text-gray-600">
//               {todayStats.netBalanceUSD >= 0 ? (
//                 <>
//                   <TrendingUp className="w-4 h-4 mr-1 text-green-500" />
//                   <span>Solde positif en Dollars US</span>
//                 </>
//               ) : (
//                 <>
//                   <TrendingDown className="w-4 h-4 mr-1 text-red-500" />
//                   <span>Déficit en Dollars US</span>
//                 </>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Filtres et statistiques par catégorie */}
//       <div className="mb-6">
//         <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
//           <div>
//             <h3 className="text-lg font-semibold text-gray-900 flex items-center">
//               <Filter className="w-5 h-5 mr-2 text-gray-500" />
//               Sorties par catégorie
//             </h3>
//             <p className="text-sm text-gray-500 mt-1">
//               {filteredOutflows.length} sortie{filteredOutflows.length !== 1 ? 's' : ''} aujourd'hui
//             </p>
//           </div>
          
//           <div className="flex flex-wrap gap-2">
//             <button
//               onClick={() => setFilterCategory('all')}
//               className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
//                 filterCategory === 'all'
//                   ? 'bg-blue-100 text-blue-700'
//                   : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//               }`}
//             >
//               Toutes
//             </button>
//             {categories.map(cat => (
//               <button
//                 key={cat.value}
//                 onClick={() => setFilterCategory(cat.value)}
//                 className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
//                   filterCategory === cat.value
//                     ? 'text-white'
//                     : 'hover:opacity-90'
//                 }`}
//                 style={{
//                   backgroundColor: filterCategory === cat.value ? cat.color : `${cat.color}20`,
//                   color: filterCategory === cat.value ? 'white' : cat.color
//                 }}
//               >
//                 {cat.label}
//                 <span className="ml-1 opacity-75">
//                   ({formatCurrency(categoryTotals[cat.value] || 0, 'CDF')})
//                 </span>
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* Liste des sorties */}
//         <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
//           {filteredOutflows.length > 0 ? (
//             <div className="overflow-x-auto">
//               <table className="min-w-full divide-y divide-gray-200">
//                 <thead className="bg-gray-50">
//                   <tr>
//                     <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
//                       Catégorie
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
//                       Motif
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
//                       Montant
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
//                       Heure
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
//                       Actions
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-gray-200">
//                   {filteredOutflows.map((outflow) => (
//                     <tr key={outflow.id} className="hover:bg-gray-50 transition-colors">
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="flex items-center">
//                           <div 
//                             className="w-3 h-3 rounded-full mr-3"
//                             style={{ backgroundColor: getCategoryColor(outflow.category) }}
//                           />
//                           <span className="text-sm font-medium text-gray-900">
//                             {outflow.category}
//                           </span>
//                         </div>
//                       </td>
//                       <td className="px-6 py-4">
//                         <div className="text-sm text-gray-900 max-w-md">
//                           {outflow.reason}
//                           {outflow.outflow_number && (
//                             <div className="text-xs text-gray-500 font-mono mt-1">
//                               #{outflow.outflow_number}
//                             </div>
//                           )}
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className={`text-sm font-semibold ${
//                           outflow.currency === 'USD' ? 'text-blue-600' : 'text-red-600'
//                         }`}>
//                           {formatCurrency(outflow.amount, outflow.currency)}
//                         </div>
//                         {outflow.currency === 'USD' && outflow.currency_rate && (
//                           <div className="text-xs text-gray-500 mt-1">
//                             Taux: 1$ = {outflow.currency_rate.toLocaleString('fr-FR')} FC
//                           </div>
//                         )}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="text-sm text-gray-500">
//                           {new Date(outflow.created_at).toLocaleTimeString('fr-FR', {
//                             hour: '2-digit',
//                             minute: '2-digit',
//                             second: '2-digit'
//                           })}
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <button
//                           onClick={() => handleDeleteOutflow(outflow.id)}
//                           className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
//                           title="Supprimer cette sortie"
//                         >
//                           <Trash2 className="w-4 h-4" />
//                         </button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           ) : (
//             <div className="p-12 text-center">
//               <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
//                 <ArrowDownRight className="w-8 h-8 text-gray-400" />
//               </div>
//               <h4 className="text-gray-900 font-semibold text-lg mb-2">
//                 Aucune sortie aujourd'hui
//               </h4>
//               <p className="text-gray-500 mb-6 max-w-sm mx-auto">
//                 {filterCategory === 'all' 
//                   ? "Vous n'avez enregistré aucune sortie de caisse aujourd'hui."
//                   : `Aucune sortie dans la catégorie "${categories.find(c => c.value === filterCategory)?.label || filterCategory}" aujourd'hui.`
//                 }
//               </p>
//               <button
//                 onClick={() => setShowOutflowModal(true)}
//                 className="inline-flex items-center px-5 py-2.5 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-200 font-medium"
//               >
//                 <ArrowDownRight className="w-4 h-4 mr-2" />
//                 Enregistrer une sortie
//               </button>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Résumé du jour */}
//       <div className="bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-xl p-5">
//         <div className="flex items-center mb-4">
//           <Info className="w-5 h-5 text-gray-500 mr-2" />
//           <h4 className="text-sm font-semibold text-gray-700">Résumé de la journée</h4>
//         </div>
//         <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//           <div className="text-center">
//             <div className="text-2xl font-bold text-green-700">
//               {outflows.filter(o => o.currency === 'CDF').length}
//             </div>
//             <div className="text-xs text-gray-600">Sorties CDF</div>
//           </div>
//           <div className="text-center">
//             <div className="text-2xl font-bold text-blue-700">
//               {outflows.filter(o => o.currency === 'USD').length}
//             </div>
//             <div className="text-xs text-gray-600">Sorties USD</div>
//           </div>
//           <div className="text-center">
//             <div className="text-2xl font-bold text-gray-900">
//               {categories.map(c => categoryTotals[c.value] || 0).filter(t => t > 0).length}
//             </div>
//             <div className="text-xs text-gray-600">Catégories utilisées</div>
//           </div>
//           <div className="text-center">
//             <div className="text-2xl font-bold text-gray-900">
//               {new Date().getHours()}:{new Date().getMinutes().toString().padStart(2, '0')}
//             </div>
//             <div className="text-xs text-gray-600">Dernière mise à jour</div>
//           </div>
//         </div>
//       </div>

//       {/* Modal pour nouvelle sortie */}
//       {showOutflowModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//           <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto animate-scale-in">
//             <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <h3 className="text-lg font-semibold text-gray-900">
//                     Nouvelle sortie de caisse
//                   </h3>
//                   <p className="text-sm text-gray-500 mt-1">
//                     Enregistrez une nouvelle dépense
//                   </p>
//                 </div>
//                 <button
//                   onClick={() => setShowOutflowModal(false)}
//                   className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
//                 >
//                   <X className="w-5 h-5 text-gray-500" />
//                 </button>
//               </div>
//             </div>
            
//             <div className="p-6">
//               <div className="space-y-5">
//                 {/* Montant avec validation de solde */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Montant *
//                   </label>
//                   <div className="flex gap-3">
//                     <div className="flex-1">
//                       <input
//                         type="number"
//                         step="0.01"
//                         min="0.01"
//                         value={newOutflow.amount}
//                         onChange={(e) => {
//                           setNewOutflow({...newOutflow, amount: e.target.value})
//                           setError('')
//                         }}
//                         className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-base"
//                         placeholder="0.00"
//                       />
//                     </div>
//                     <div className="w-32">
//                       <select
//                         value={newOutflow.currency}
//                         onChange={(e) => {
//                           setNewOutflow({...newOutflow, currency: e.target.value})
//                           setError('')
//                         }}
//                         className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white text-base"
//                       >
//                         <option value="CDF">CDF</option>
//                         <option value="USD">USD</option>
//                       </select>
//                     </div>
//                   </div>
                  
//                   {/* Info solde disponible */}
//                   <div className="mt-2 p-3 bg-gray-50 rounded-lg">
//                     <div className="flex items-center justify-between text-sm">
//                       <span className="text-gray-600">Solde disponible :</span>
//                       <span className={`font-semibold ${
//                         newOutflow.currency === 'CDF' ? 'text-green-600' : 'text-blue-600'
//                       }`}>
//                         {formatCurrency(availableBalances[newOutflow.currency], newOutflow.currency)}
//                       </span>
//                     </div>
//                     {newOutflow.amount && parseFloat(newOutflow.amount) > 0 && (
//                       <div className={`mt-2 text-sm ${
//                         parseFloat(newOutflow.amount) > availableBalances[newOutflow.currency]
//                           ? 'text-red-600'
//                           : 'text-green-600'
//                       }`}>
//                         {parseFloat(newOutflow.amount) > availableBalances[newOutflow.currency] ? (
//                           <span className="flex items-center">
//                             <AlertCircle className="w-4 h-4 mr-1" />
//                             Solde insuffisant
//                           </span>
//                         ) : (
//                           <span className="flex items-center">
//                             <CheckCircle className="w-4 h-4 mr-1" />
//                             Solde suffisant
//                           </span>
//                         )}
//                       </div>
//                     )}
//                   </div>
//                 </div>
                
//                 {/* Catégorie */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Catégorie
//                   </label>
//                   <div className="grid grid-cols-4 gap-2">
//                     {categories.map(cat => (
//                       <button
//                         key={cat.value}
//                         type="button"
//                         onClick={() => setNewOutflow({...newOutflow, category: cat.value})}
//                         className={`p-3 rounded-lg border transition-all ${
//                           newOutflow.category === cat.value
//                             ? 'ring-2 ring-offset-2'
//                             : 'border-gray-200 hover:border-gray-300'
//                         }`}
//                         style={{
//                           backgroundColor: newOutflow.category === cat.value ? cat.color : `${cat.color}10`,
//                           borderColor: newOutflow.category === cat.value ? cat.color : 'transparent',
//                           boxShadow: newOutflow.category === cat.value ? `0 0 0 2px ${cat.color}20` : 'none'
//                         }}
//                       >
//                         <div 
//                           className="w-6 h-6 rounded-full mx-auto mb-2"
//                           style={{ backgroundColor: cat.color }}
//                         />
//                         <span className={`text-xs font-medium ${
//                           newOutflow.category === cat.value ? 'text-white' : 'text-gray-700'
//                         }`}>
//                           {cat.label}
//                         </span>
//                       </button>
//                     ))}
//                   </div>
//                 </div>
                
//                 {/* Motif */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Motif *
//                   </label>
//                   <textarea
//                     value={newOutflow.reason}
//                     onChange={(e) => {
//                       setNewOutflow({...newOutflow, reason: e.target.value})
//                       setError('')
//                     }}
//                     rows="3"
//                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-base"
//                     placeholder="Décrivez le motif de cette sortie..."
//                   />
//                 </div>
                
//                 {/* Actions */}
//                 <div className="pt-6 border-t border-gray-200">
//                   <div className="flex space-x-3">
//                     <button
//                       onClick={() => setShowOutflowModal(false)}
//                       className="flex-1 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-base font-medium"
//                     >
//                       Annuler
//                     </button>
//                     <button
//                       onClick={handleCreateOutflow}
//                       disabled={!newOutflow.amount || !newOutflow.reason.trim() || 
//                                parseFloat(newOutflow.amount) > availableBalances[newOutflow.currency]}
//                       className="flex-1 px-4 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-base font-medium"
//                     >
//                       Enregistrer la sortie
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

import { useState, useEffect, useCallback } from 'react'
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
  CheckCircle,
  Filter,
  TrendingUp,
  TrendingDown
} from 'lucide-react'

export default function UserOutflowDashboard() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [outflows, setOutflows] = useState([])
  const [showOutflowModal, setShowOutflowModal] = useState(false)
  const [creatingOutflow, setCreatingOutflow] = useState(false)
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
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [availableBalances, setAvailableBalances] = useState({
    CDF: 0,
    USD: 0
  })
  const [filterCategory, setFilterCategory] = useState('all')

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

  const loadAvailableBalances = useCallback(async (userId) => {
    try {
      const { data: balances } = await supabase
        .from('daily_user_financial_report')
        .select('closing_balance_cdf, closing_balance_usd')
        .eq('user_id', userId)
        .order('report_date', { ascending: false })
        .limit(1)
        .single()

      if (balances) {
        setAvailableBalances({
          CDF: balances.closing_balance_cdf || 0,
          USD: balances.closing_balance_usd || 0
        })
      }
    } catch (err) {
      console.error('Erreur chargement soldes:', err)
    }
  }, [])

  useEffect(() => {
    const init = async () => {
      setLoading(true)
      
      try {
        const currentUser = checkAuth()
        
        if (!currentUser) {
          setError('Session expirée')
          setLoading(false)
          return
        }
        
        setUser(currentUser)
        
        await Promise.all([
          loadTodayStats(currentUser.id),
          loadTodayOutflows(currentUser.id)
        ])
        
      } catch (err) {
        setError(`Erreur: ${err.message}`)
      } finally {
        setLoading(false)
      }
    }
    
    init()
  }, [])

  useEffect(() => {
    if (user) {
      loadAvailableBalances(user.id)
    }
  }, [user, todayStats])

  const loadTodayStats = async (userId) => {
    try {
      const today = new Date().toISOString().split('T')[0]
      
      const { data: report } = await supabase
        .from('daily_user_financial_report')
        .select('*')
        .eq('report_date', today)
        .eq('user_id', userId)
        .single()
      
      if (report) {
        setTodayStats({
          totalReceiptCDF: report.total_receipt_cdf || 0,
          totalReceiptUSD: report.total_receipt_usd || 0,
          totalOutflowCDF: report.total_outflow_cdf || 0,
          totalOutflowUSD: report.total_outflow_usd || 0,
          netBalanceCDF: report.balance_cdf || 0,
          netBalanceUSD: report.balance_usd || 0
        })
      } else {
        await calculateTodayStats(userId)
      }
    } catch (err) {
      await calculateTodayStats(userId)
    }
  }

  const calculateTodayStats = async (userId) => {
    try {
      const today = new Date().toISOString().split('T')[0]
      
      const { data: salesData } = await supabase
        .from('sale')
        .select('total, currency, currency_rate')
        .eq('user_id', userId)
        .eq('status', 'completed')
        .eq('payment_status', 'paid')
        .gte('created_at', `${today}T00:00:00`)
        .lte('created_at', `${today}T23:59:59`)
      
      const { data: outflowsData } = await supabase
        .from('cash_outflow')
        .select('amount, currency, currency_rate')
        .eq('user_id', userId)
        .eq('date', today)
        .eq('status', 'completed')
      
      let totalReceiptCDF = 0
      let totalReceiptUSD = 0
      let totalOutflowCDF = 0
      let totalOutflowUSD = 0
      
      if (salesData) {
        salesData.forEach(sale => {
          const montant = sale.total || 0
          if (sale.currency === 'USD') {
            totalReceiptUSD += montant
          } else if (sale.currency === 'CDF') {
            totalReceiptCDF += montant
          }
        })
      }
      
      if (outflowsData) {
        outflowsData.forEach(outflow => {
          const montant = outflow.amount || 0
          if (outflow.currency === 'USD') {
            totalOutflowUSD += montant
          } else if (outflow.currency === 'CDF') {
            totalOutflowCDF += montant
          }
        })
      }
      
      setTodayStats({
        totalReceiptCDF: Math.round(totalReceiptCDF),
        totalReceiptUSD: parseFloat(totalReceiptUSD.toFixed(2)),
        totalOutflowCDF: Math.round(totalOutflowCDF),
        totalOutflowUSD: parseFloat(totalOutflowUSD.toFixed(2)),
        netBalanceCDF: Math.round(totalReceiptCDF - totalOutflowCDF),
        netBalanceUSD: parseFloat((totalReceiptUSD - totalOutflowUSD).toFixed(2))
      })
    } catch (err) {
      console.error('Erreur calcul:', err)
    }
  }

  const loadTodayOutflows = async (userId) => {
    try {
      const today = new Date().toISOString().split('T')[0]
      
      const { data } = await supabase
        .from('cash_outflow')
        .select('*')
        .eq('user_id', userId)
        .eq('date', today)
        .eq('status', 'completed')
        .order('created_at', { ascending: false })
      
      if (data) {
        setOutflows(data)
      }
    } catch (err) {
      console.error('Erreur sorties:', err)
    }
  }

  const filteredOutflows = filterCategory === 'all' 
    ? outflows 
    : outflows.filter(outflow => outflow.category === filterCategory)

  const validateBalance = (amount, currency) => {
    const availableBalance = availableBalances[currency] || 0
    if (parseFloat(amount) > availableBalance) {
      return {
        valid: false,
        message: `Solde insuffisant. Disponible: ${formatCurrency(availableBalance, currency)}`
      }
    }
    return { valid: true, message: '' }
  }

  const handleCreateOutflow = async () => {
    if (!newOutflow.amount || parseFloat(newOutflow.amount) <= 0) {
      setError('Montant invalide')
      return
    }

    if (!newOutflow.reason.trim()) {
      setError('Motif requis')
      return
    }

    if (!user) {
      setError('Session expirée')
      return
    }

    const balanceCheck = validateBalance(newOutflow.amount, newOutflow.currency)
    if (!balanceCheck.valid) {
      setError(balanceCheck.message)
      return
    }

    setError('')
    setSuccess('')
    setCreatingOutflow(true)

    try {
      const outflowData = {
        amount: parseFloat(newOutflow.amount),
        currency: newOutflow.currency,
        currency_rate: newOutflow.currency === 'USD' ? 2300 : 1.0,
        reason: newOutflow.reason.trim(),
        category: newOutflow.category,
        user_id: user.id,
        date: new Date().toISOString().split('T')[0]
      }

      const { error: insertError } = await supabase
        .from('cash_outflow')
        .insert([outflowData])

      if (insertError) throw insertError

      setSuccess('Sortie enregistrée!')
      setNewOutflow({
        amount: '',
        currency: 'CDF',
        reason: '',
        category: 'Divers'
      })
      
      setShowOutflowModal(false)
      
      await Promise.all([
        loadTodayStats(user.id),
        loadTodayOutflows(user.id)
      ])
      
      setTimeout(() => setSuccess(''), 3000)
      
    } catch (err) {
      setError(`Erreur: ${err.message}`)
    } finally {
      setCreatingOutflow(false)
    }
  }

  const handleDeleteOutflow = async (outflowId) => {
    if (!confirm('Supprimer cette sortie ?')) return

    try {
      const { error } = await supabase
        .from('cash_outflow')
        .update({ status: 'cancelled' })
        .eq('id', outflowId)
        .eq('user_id', user.id)

      if (error) throw error

      await Promise.all([
        loadTodayStats(user.id),
        loadTodayOutflows(user.id)
      ])
      
      setSuccess('Sortie supprimée!')
      setTimeout(() => setSuccess(''), 3000)
      
    } catch (err) {
      setError(`Erreur: ${err.message}`)
    }
  }

  const formatCurrency = (amount, currency = 'CDF') => {
    if (!amount && amount !== 0) return '0'
    
    const formatted = new Intl.NumberFormat('fr-FR', {
      minimumFractionDigits: currency === 'USD' ? 2 : 0,
      maximumFractionDigits: currency === 'USD' ? 2 : 0
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
    await Promise.all([
      loadTodayStats(user.id),
      loadTodayOutflows(user.id)
    ])
    setLoading(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="p-4">
        <div className="bg-red-50 border-l-4 border-red-500 p-4">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-500 mr-3" />
            <div>
              <p className="text-red-700">Session expirée. Veuillez vous reconnecter.</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 max-w-7xl mx-auto space-y-6">
      {/* Messages */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <AlertCircle className="h-4 w-4 text-red-500 mr-2" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
            <button onClick={() => setError('')} className="text-red-500">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
              <p className="text-sm text-green-700">{success}</p>
            </div>
            <button onClick={() => setSuccess('')} className="text-green-500">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Sorties de caisse</h1>
          <div className="flex items-center mt-1 space-x-3">
            <div className="flex items-center text-sm text-gray-500">
              <Calendar className="w-3 h-3 mr-1" />
              {new Date().toLocaleDateString('fr-FR')}
            </div>
            <div className="text-sm text-gray-500">
              {user.full_name || user.email}
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={handleRefresh}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => setShowOutflowModal(true)}
            className="flex items-center px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
          >
            <Plus className="w-4 h-4 mr-1" />
            Nouvelle sortie
          </button>
        </div>
      </div>

      {/* Cartes compactes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Recettes */}
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-700">Recettes</h3>
            <ArrowUpRight className="w-4 h-4 text-green-500" />
          </div>
          <div className="space-y-1">
            <div className="text-lg font-semibold text-gray-900">
              {formatCurrency(todayStats.totalReceiptCDF, 'CDF')}
            </div>
            <div className="text-sm text-gray-600">
              {formatCurrency(todayStats.totalReceiptUSD, 'USD')}
            </div>
          </div>
        </div>

        {/* Dépenses */}
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-700">Dépenses</h3>
            <ArrowDownRight className="w-4 h-4 text-red-500" />
          </div>
          <div className="space-y-1">
            <div className="text-lg font-semibold text-red-600">
              {formatCurrency(todayStats.totalOutflowCDF, 'CDF')}
            </div>
            <div className="text-sm text-blue-600">
              {formatCurrency(todayStats.totalOutflowUSD, 'USD')}
            </div>
          </div>
        </div>

        {/* Solde net */}
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-700">Solde net</h3>
            <Wallet className="w-4 h-4 text-gray-500" />
          </div>
          <div className="space-y-1">
            <div className={`text-lg font-semibold ${
              todayStats.netBalanceCDF >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {formatCurrency(todayStats.netBalanceCDF, 'CDF')}
            </div>
            <div className={`text-sm ${
              todayStats.netBalanceUSD >= 0 ? 'text-green-500' : 'text-red-500'
            }`}>
              {formatCurrency(todayStats.netBalanceUSD, 'USD')}
            </div>
          </div>
        </div>
      </div>

      {/* Soldes disponibles */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-gray-700">Soldes disponibles</h3>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-lg font-semibold text-gray-900">
              {formatCurrency(availableBalances.CDF, 'CDF')}
            </div>
            <div className="text-xs text-gray-500">CDF disponible</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-gray-900">
              {formatCurrency(availableBalances.USD, 'USD')}
            </div>
            <div className="text-xs text-gray-500">USD disponible</div>
          </div>
        </div>
      </div>

      {/* Filtres */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-gray-700 flex items-center">
            <Filter className="w-4 h-4 mr-2" />
            Sorties ({filteredOutflows.length})
          </h3>
          <div className="flex space-x-1">
            <button
              onClick={() => setFilterCategory('all')}
              className={`px-2 py-1 text-xs rounded ${
                filterCategory === 'all' 
                  ? 'bg-gray-800 text-white' 
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              Toutes
            </button>
            {categories.slice(0, 3).map(cat => (
              <button
                key={cat.value}
                onClick={() => setFilterCategory(cat.value)}
                className={`px-2 py-1 text-xs rounded ${
                  filterCategory === cat.value 
                    ? 'text-white' 
                    : 'hover:opacity-90'
                }`}
                style={{
                  backgroundColor: filterCategory === cat.value ? cat.color : `${cat.color}20`,
                  color: filterCategory === cat.value ? 'white' : cat.color
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Liste des sorties */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          {filteredOutflows.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {filteredOutflows.map((outflow) => (
                <div key={outflow.id} className="p-3 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <div 
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: getCategoryColor(outflow.category) }}
                        />
                        <span className="text-sm font-medium text-gray-900">
                          {outflow.category}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(outflow.created_at).toLocaleTimeString('fr-FR', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{outflow.reason}</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className={`text-sm font-semibold ${
                        outflow.currency === 'USD' ? 'text-blue-600' : 'text-gray-900'
                      }`}>
                        {formatCurrency(outflow.amount, outflow.currency)}
                      </span>
                      <button
                        onClick={() => handleDeleteOutflow(outflow.id)}
                        className="p-1 text-gray-400 hover:text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center">
              <ArrowDownRight className="w-8 h-8 text-gray-300 mx-auto mb-2" />
              <p className="text-gray-500 text-sm">Aucune sortie enregistrée</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal nouvelle sortie */}
      {showOutflowModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="px-4 py-3 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-gray-900">Nouvelle sortie</h3>
                <button
                  onClick={() => setShowOutflowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="p-4 space-y-4">
              {/* Montant */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Montant
                </label>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    value={newOutflow.amount}
                    onChange={(e) => setNewOutflow({...newOutflow, amount: e.target.value})}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-red-500 focus:border-red-500"
                    placeholder="0.00"
                  />
                  <select
                    value={newOutflow.currency}
                    onChange={(e) => setNewOutflow({...newOutflow, currency: e.target.value})}
                    className="px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-red-500 focus:border-red-500"
                  >
                    <option value="CDF">CDF</option>
                    <option value="USD">USD</option>
                  </select>
                </div>
                <div className="mt-1 text-xs text-gray-500">
                  Solde disponible: {formatCurrency(availableBalances[newOutflow.currency], newOutflow.currency)}
                </div>
              </div>
              
              {/* Catégorie */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Catégorie
                </label>
                <select
                  value={newOutflow.category}
                  onChange={(e) => setNewOutflow({...newOutflow, category: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-red-500 focus:border-red-500"
                >
                  {categories.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>
              
              {/* Motif */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Motif
                </label>
                <textarea
                  value={newOutflow.reason}
                  onChange={(e) => setNewOutflow({...newOutflow, reason: e.target.value})}
                  rows="2"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-red-500 focus:border-red-500"
                  placeholder="Description..."
                />
              </div>
              
              {/* Actions */}
              <div className="pt-4 border-t border-gray-200">
                <div className="flex space-x-2">
                  <button
                    onClick={() => setShowOutflowModal(false)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded hover:bg-gray-50 text-sm"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={handleCreateOutflow}
                    disabled={creatingOutflow || !newOutflow.amount || !newOutflow.reason.trim()}
                    className="flex-1 px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm flex items-center justify-center"
                  >
                    {creatingOutflow ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        En cours...
                      </>
                    ) : (
                      'Enregistrer'
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}