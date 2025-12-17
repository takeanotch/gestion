// // 'use client'

// // import { useState, useEffect } from 'react'
// // import { useRouter } from 'next/navigation'
// // import { supabase } from '@/lib/supabase'
// // import {
// //   BarChart,
// //   Bar,
// //   XAxis,
// //   YAxis,
// //   CartesianGrid,
// //   Tooltip,
// //   Legend,
// //   ResponsiveContainer,
// //   LineChart,
// //   Line,
// //   PieChart,
// //   Pie,
// //   Cell
// // } from 'recharts'
// // import {
// //   DollarSign,
// //   TrendingUp,
// //   TrendingDown,
// //   Wallet,
// //   Calendar,
// //   Download,
// //   Plus,
// //   Filter,
// //   Search,
// //   X,
// //   ChevronDown,
// //   Loader2,
// //   BarChart3,
// //   PieChart as PieChartIcon,
// //   LineChart as LineChartIcon,
// //   RefreshCw,
// //   Eye,
// //   Printer,
// //   FileText,
// //   ArrowUpRight,
// //   ArrowDownRight
// // } from 'lucide-react'

// // export default function RapportsFinanciersPage() {
// //   const router = useRouter()
// //   const [user, setUser] = useState(null)
// //   const [loading, setLoading] = useState(true)
// //   const [reports, setReports] = useState([])
// //   const [outflows, setOutflows] = useState([])
// //   const [showOutflowModal, setShowOutflowModal] = useState(false)
// //   const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
// //   const [stats, setStats] = useState({
// //     totalReceiptCDF: 0,
// //     totalReceiptUSD: 0,
// //     totalOutflowCDF: 0,
// //     totalOutflowUSD: 0,
// //     netBalanceCDF: 0,
// //     netBalanceUSD: 0,
// //     openingBalanceCDF: 0,
// //     closingBalanceCDF: 0
// //   })
// //   const [filters, setFilters] = useState({
// //     dateRange: 'today',
// //     startDate: new Date().toISOString().split('T')[0],
// //     endDate: new Date().toISOString().split('T')[0],
// //     category: 'all'
// //   })
// //   const [newOutflow, setNewOutflow] = useState({
// //     amount: '',
// //     currency: 'CDF',
// //     reason: '',
// //     category: 'Divers'
// //   })
// //   const [chartType, setChartType] = useState('bar')
// //   const [saleConfig, setSaleConfig] = useState({
// //     currency_rate: 2300
// //   })

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

// //   // Fonction utilitaire pour récupérer l'utilisateur
// //   const getCurrentUser = async () => {
// //     try {
// //       // Essayer d'abord depuis localStorage
// //       const userData = localStorage.getItem('user_data')
// //       if (userData) {
// //         const parsedUser = JSON.parse(userData)
// //         setUser(parsedUser)
// //         return parsedUser
// //       }
      
// //       // Sinon, essayer avec Supabase Auth
// //       const { data: { session }, error } = await supabase.auth.getSession()
// //       if (error) throw error
      
// //       if (session?.user) {
// //         setUser(session.user)
// //         localStorage.setItem('user_data', JSON.stringify(session.user))
// //         return session.user
// //       }
      
// //       return null
// //     } catch (error) {
// //       console.error('Erreur récupération utilisateur:', error)
// //       return null
// //     }
// //   }

// //   useEffect(() => {
// //     const init = async () => {
// //       setLoading(true)
      
// //       // Vérifier l'authentification
// //       const currentUser = await getCurrentUser()
// //       if (!currentUser) {
// //         router.push('/auth/login')
// //         return
// //       }
      
// //       // Charger les données
// //       await Promise.all([
// //         loadSaleConfig(),
// //         loadDailyReports(),
// //         loadOutflows(),
// //         loadDailyStats()
// //       ])
      
// //       setLoading(false)
// //     }
    
// //     init()
// //   }, [filters, selectedDate, router])

// //   const loadSaleConfig = async () => {
// //     try {
// //       const { data } = await supabase
// //         .from('sale_config')
// //         .select('*')
// //         .order('created_at', { ascending: false })
// //         .limit(1)
// //         .single()
      
// //       if (data) setSaleConfig(data)
// //     } catch (error) {
// //       console.error('Erreur chargement config:', error)
// //     }
// //   }

// //   const loadDailyReports = async () => {
// //     try {
// //       let query = supabase
// //         .from('detailed_daily_report')
// //         .select('*')
// //         .order('report_date', { ascending: false })

// //       if (filters.dateRange === 'today') {
// //         query = query.eq('report_date', new Date().toISOString().split('T')[0])
// //       } else if (filters.dateRange === 'yesterday') {
// //         const yesterday = new Date()
// //         yesterday.setDate(yesterday.getDate() - 1)
// //         query = query.eq('report_date', yesterday.toISOString().split('T')[0])
// //       } else if (filters.dateRange === 'last7days') {
// //         const endDate = new Date()
// //         const startDate = new Date()
// //         startDate.setDate(startDate.getDate() - 7)
// //         query = query.gte('report_date', startDate.toISOString().split('T')[0])
// //           .lte('report_date', endDate.toISOString().split('T')[0])
// //       } else if (filters.dateRange === 'thisMonth') {
// //         const firstDay = new Date()
// //         firstDay.setDate(1)
// //         query = query.gte('report_date', firstDay.toISOString().split('T')[0])
// //       } else if (filters.dateRange === 'custom') {
// //         query = query.gte('report_date', filters.startDate)
// //           .lte('report_date', filters.endDate)
// //       }

// //       const { data } = await query.limit(30)
// //       setReports(data || [])
// //     } catch (error) {
// //       console.error('Erreur chargement rapports:', error)
// //     }
// //   }

// //   const loadOutflows = async () => {
// //     try {
// //       const { data } = await supabase
// //         .from('cash_outflow')
// //         .select('*')
// //         .eq('date', selectedDate)
// //         .eq('status', 'completed')
// //         .order('created_at', { ascending: false })
      
// //       setOutflows(data || [])
// //     } catch (error) {
// //       console.error('Erreur chargement sorties:', error)
// //     }
// //   }

// //   const loadDailyStats = async () => {
// //     try {
// //       const { data } = await supabase
// //         .from('detailed_daily_report')
// //         .select('*')
// //         .eq('report_date', selectedDate)
// //         .single()
      
// //       if (data) {
// //         setStats({
// //           totalReceiptCDF: data.total_receipt_cdf || 0,
// //           totalReceiptUSD: data.total_receipt_usd || 0,
// //           totalOutflowCDF: data.total_outflow_cdf || 0,
// //           totalOutflowUSD: data.total_outflow_usd || 0,
// //           netBalanceCDF: data.balance_cdf || 0,
// //           netBalanceUSD: data.balance_usd || 0,
// //           openingBalanceCDF: data.opening_balance_cdf || 0,
// //           closingBalanceCDF: data.closing_balance_cdf || 0
// //         })
// //       } else {
// //         // Calculer manuellement si pas de rapport
// //         const { data: sales } = await supabase
// //           .from('sale')
// //           .select('total, currency, currency_rate')
// //           .eq('status', 'completed')
// //           .eq('payment_status', 'paid')
// //           .gte('created_at', `${selectedDate}T00:00:00`)
// //           .lte('created_at', `${selectedDate}T23:59:59`)
        
// //         const { data: outflows } = await supabase
// //           .from('cash_outflow')
// //           .select('amount, currency, currency_rate')
// //           .eq('date', selectedDate)
// //           .eq('status', 'completed')
        
// //         let totalReceiptCDF = 0
// //         let totalReceiptUSD = 0
// //         let totalOutflowCDF = 0
// //         let totalOutflowUSD = 0
        
// //         sales?.forEach(sale => {
// //           if (sale.currency === 'USD') {
// //             totalReceiptUSD += parseFloat(sale.total)
// //             totalReceiptCDF += parseFloat(sale.total) * (sale.currency_rate || saleConfig.currency_rate)
// //           } else {
// //             totalReceiptCDF += parseFloat(sale.total)
// //           }
// //         })
        
// //         outflows?.forEach(outflow => {
// //           if (outflow.currency === 'USD') {
// //             totalOutflowUSD += parseFloat(outflow.amount)
// //             totalOutflowCDF += parseFloat(outflow.amount) * (outflow.currency_rate || saleConfig.currency_rate)
// //           } else {
// //             totalOutflowCDF += parseFloat(outflow.amount)
// //           }
// //         })
        
// //         setStats({
// //           totalReceiptCDF,
// //           totalReceiptUSD,
// //           totalOutflowCDF,
// //           totalOutflowUSD,
// //           netBalanceCDF: totalReceiptCDF - totalOutflowCDF,
// //           netBalanceUSD: totalReceiptUSD - totalOutflowUSD,
// //           openingBalanceCDF: 0,
// //           closingBalanceCDF: totalReceiptCDF - totalOutflowCDF
// //         })
// //       }
// //     } catch (error) {
// //       console.error('Erreur chargement stats:', error)
// //     }
// //   }

// //   const handleCreateOutflow = async () => {
// //     if (!newOutflow.amount || !newOutflow.reason) {
// //       alert('Veuillez remplir tous les champs obligatoires')
// //       return
// //     }

// //     // Récupérer l'utilisateur actuel
// //     const currentUser = await getCurrentUser()
// //     if (!currentUser) {
// //       alert('Session expirée, veuillez vous reconnecter')
// //       router.push('/auth/login')
// //       return
// //     }

// //     try {
// //       const outflowData = {
// //         amount: parseFloat(newOutflow.amount),
// //         currency: newOutflow.currency,
// //         currency_rate: newOutflow.currency === 'USD' ? saleConfig.currency_rate : 1.0,
// //         reason: newOutflow.reason,
// //         category: newOutflow.category,
// //         user_id: currentUser.id,
// //         date: selectedDate
// //       }

// //       const { error } = await supabase
// //         .from('cash_outflow')
// //         .insert([outflowData])

// //       if (error) throw error

// //       // Réinitialiser le formulaire
// //       setNewOutflow({
// //         amount: '',
// //         currency: 'CDF',
// //         reason: '',
// //         category: 'Divers'
// //       })
      
// //       setShowOutflowModal(false)
// //       loadOutflows()
// //       loadDailyStats()
      
// //       alert('Sortie de caisse enregistrée avec succès')
// //     } catch (error) {
// //       console.error('Erreur création sortie:', error)
// //       alert('Erreur lors de l\'enregistrement de la sortie')
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

// //   // Préparer les données pour les graphiques
// //   const chartData = reports.slice(0, 7).reverse().map(report => ({
// //     date: new Date(report.report_date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }),
// //     recetteCDF: parseFloat(report.total_receipt_cdf) || 0,
// //     depenseCDF: parseFloat(report.total_outflow_cdf) || 0,
// //     soldeCDF: parseFloat(report.balance_cdf) || 0,
// //     recetteUSD: parseFloat(report.total_receipt_usd) || 0,
// //     depenseUSD: parseFloat(report.total_outflow_usd) || 0,
// //     soldeUSD: parseFloat(report.balance_usd) || 0
// //   }))

// //   const categoryData = categories.map(cat => {
// //     const total = outflows
// //       .filter(o => o.category === cat.value)
// //       .reduce((sum, o) => {
// //         const amount = o.currency === 'USD' 
// //           ? o.amount * (o.currency_rate || saleConfig.currency_rate)
// //           : o.amount
// //         return sum + parseFloat(amount)
// //       }, 0)
    
// //     return {
// //       name: cat.label,
// //       value: total,
// //       color: cat.color
// //     }
// //   }).filter(item => item.value > 0)

// //   const handleExport = async () => {
// //     try {
// //       const report = reports.find(r => r.report_date === selectedDate)
// //       if (!report) return
      
// //       const csvContent = [
// //         ['Date', 'Recette CDF', 'Recette USD', 'Dépense CDF', 'Dépense USD', 'Solde CDF', 'Solde USD'],
// //         [
// //           report.report_date,
// //           report.total_receipt_cdf,
// //           report.total_receipt_usd,
// //           report.total_outflow_cdf,
// //           report.total_outflow_usd,
// //           report.balance_cdf,
// //           report.balance_usd
// //         ]
// //       ].map(row => row.join(',')).join('\n')
      
// //       const blob = new Blob([csvContent], { type: 'text/csv' })
// //       const url = window.URL.createObjectURL(blob)
// //       const a = document.createElement('a')
// //       a.href = url
// //       a.download = `rapport-journalier-${selectedDate}.csv`
// //       a.click()
// //     } catch (error) {
// //       console.error('Erreur export:', error)
// //     }
// //   }

// //   const handlePrint = () => {
// //     window.print()
// //   }

// //   const handleRefresh = () => {
// //     loadDailyReports()
// //     loadOutflows()
// //     loadDailyStats()
// //   }

// //   if (loading) {
// //     return (
// //       <div className="flex items-center justify-center h-screen">
// //         <div className="text-center">
// //           <Loader2 className="w-8 h-8 animate-spin text-gray-600 mx-auto mb-4" />
// //           <p className="text-gray-500">Chargement des rapports...</p>
// //         </div>
// //       </div>
// //     )
// //   }

// //   return (
// //     <div className="p-4 sm:p-6">
// //       {/* Header */}
// //       <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
// //         <div>
// //           <h1 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center">
// //             <BarChart3 className="w-6 h-6 sm:w-7 sm:h-7 mr-3 text-gray-700" />
// //             Rapports Financiers Journaliers
// //           </h1>
// //           <p className="text-gray-500 text-sm mt-1">
// //             Suivi des recettes, dépenses et soldes de caisse
// //           </p>
// //         </div>
        
// //         <div className="flex items-center space-x-2">
// //           <button
// //             onClick={handleExport}
// //             className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm"
// //           >
// //             <Download className="w-4 h-4" />
// //             <span className="hidden sm:inline">Exporter</span>
// //           </button>
// //           <button
// //             onClick={handlePrint}
// //             className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm"
// //           >
// //             <Printer className="w-4 h-4" />
// //             <span className="hidden sm:inline">Imprimer</span>
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

// //       {/* Sélecteur de date */}
// //       <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
// //         <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
// //           <div>
// //             <h2 className="text-lg font-semibold text-gray-900 flex items-center">
// //               <Calendar className="w-5 h-5 mr-2" />
// //               Rapport du {new Date(selectedDate).toLocaleDateString('fr-FR', {
// //                 weekday: 'long',
// //                 year: 'numeric',
// //                 month: 'long',
// //                 day: 'numeric'
// //               })}
// //             </h2>
// //           </div>
          
// //           <div className="flex flex-wrap gap-2">
// //             <input
// //               type="date"
// //               value={selectedDate}
// //               onChange={(e) => setSelectedDate(e.target.value)}
// //               className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-gray-900 focus:border-gray-900 text-sm"
// //             />
            
// //             <select
// //               value={filters.dateRange}
// //               onChange={(e) => setFilters({...filters, dateRange: e.target.value})}
// //               className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-gray-900 focus:border-gray-900 bg-white text-sm"
// //             >
// //               <option value="today">Aujourd'hui</option>
// //               <option value="yesterday">Hier</option>
// //               <option value="last7days">7 derniers jours</option>
// //               <option value="thisMonth">Ce mois</option>
// //               <option value="custom">Période personnalisée</option>
// //             </select>
            
// //             {filters.dateRange === 'custom' && (
// //               <div className="flex gap-2">
// //                 <input
// //                   type="date"
// //                   value={filters.startDate}
// //                   onChange={(e) => setFilters({...filters, startDate: e.target.value})}
// //                   className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-gray-900 focus:border-gray-900 text-sm"
// //                 />
// //                 <span className="self-center">à</span>
// //                 <input
// //                   type="date"
// //                   value={filters.endDate}
// //                   onChange={(e) => setFilters({...filters, endDate: e.target.value})}
// //                   className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-gray-900 focus:border-gray-900 text-sm"
// //                 />
// //               </div>
// //             )}
            
// //             <button
// //               onClick={handleRefresh}
// //               className="px-3 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition text-sm flex items-center"
// //             >
// //               <RefreshCw className="w-4 h-4 mr-2" />
// //               Actualiser
// //             </button>
// //           </div>
// //         </div>
// //       </div>

// //       {/* Statistiques principales */}
// //       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
// //         {/* Recette totale */}
// //         <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg p-4">
// //           <div className="flex items-center justify-between mb-2">
// //             <div className="text-green-800">
// //               <ArrowUpRight className="w-6 h-6" />
// //             </div>
// //             <div className="text-sm font-medium text-green-800">
// //               Recette totale
// //             </div>
// //           </div>
// //           <div className="space-y-1">
// //             <div className="text-2xl font-bold text-green-900">
// //               {formatCurrency(stats.totalReceiptCDF)}
// //             </div>
// //             <div className="text-sm text-green-700">
// //               $ {stats.totalReceiptUSD.toFixed(2)}
// //             </div>
// //           </div>
// //         </div>

// //         {/* Dépenses totales */}
// //         <div className="bg-gradient-to-br from-red-50 to-red-100 border border-red-200 rounded-lg p-4">
// //           <div className="flex items-center justify-between mb-2">
// //             <div className="text-red-800">
// //               <ArrowDownRight className="w-6 h-6" />
// //             </div>
// //             <div className="text-sm font-medium text-red-800">
// //               Dépenses totales
// //             </div>
// //           </div>
// //           <div className="space-y-1">
// //             <div className="text-2xl font-bold text-red-900">
// //               {formatCurrency(stats.totalOutflowCDF)}
// //             </div>
// //             <div className="text-sm text-red-700">
// //               $ {stats.totalOutflowUSD.toFixed(2)}
// //             </div>
// //           </div>
// //         </div>

// //         {/* Solde net */}
// //         <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-4">
// //           <div className="flex items-center justify-between mb-2">
// //             <div className="text-blue-800">
// //               <Wallet className="w-6 h-6" />
// //             </div>
// //             <div className="text-sm font-medium text-blue-800">
// //               Solde net
// //             </div>
// //           </div>
// //           <div className="space-y-1">
// //             <div className={`text-2xl font-bold ${stats.netBalanceCDF >= 0 ? 'text-blue-900' : 'text-red-900'}`}>
// //               {formatCurrency(stats.netBalanceCDF)}
// //             </div>
// //             <div className={`text-sm ${stats.netBalanceUSD >= 0 ? 'text-blue-700' : 'text-red-700'}`}>
// //               $ {stats.netBalanceUSD.toFixed(2)}
// //             </div>
// //           </div>
// //         </div>

// //         {/* Solde de clôture */}
// //         <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-lg p-4">
// //           <div className="flex items-center justify-between mb-2">
// //             <div className="text-purple-800">
// //               <DollarSign className="w-6 h-6" />
// //             </div>
// //             <div className="text-sm font-medium text-purple-800">
// //               Solde de clôture
// //             </div>
// //           </div>
// //           <div className="space-y-1">
// //             <div className="text-2xl font-bold text-purple-900">
// //               {formatCurrency(stats.closingBalanceCDF)}
// //             </div>
// //             <div className="text-sm text-purple-700">
// //               Ouverture: {formatCurrency(stats.openingBalanceCDF)}
// //             </div>
// //           </div>
// //         </div>
// //       </div>

// //       {/* Graphiques */}
// //       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
// //         {/* Graphique principal */}
// //         <div className="bg-white rounded-lg border border-gray-200 p-4">
// //           <div className="flex items-center justify-between mb-4">
// //             <h3 className="text-lg font-semibold text-gray-900">
// //               Évolution sur 7 jours
// //             </h3>
// //             <div className="flex space-x-2">
// //               <button
// //                 onClick={() => setChartType('bar')}
// //                 className={`p-2 rounded ${chartType === 'bar' ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
// //               >
// //                 <BarChart3 className="w-4 h-4" />
// //               </button>
// //               <button
// //                 onClick={() => setChartType('line')}
// //                 className={`p-2 rounded ${chartType === 'line' ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
// //               >
// //                 <LineChartIcon className="w-4 h-4" />
// //               </button>
// //             </div>
// //           </div>
          
// //           <div className="h-64">
// //             <ResponsiveContainer width="100%" height="100%">
// //               {chartType === 'bar' ? (
// //                 <BarChart data={chartData}>
// //                   <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
// //                   <XAxis dataKey="date" stroke="#6b7280" fontSize={12} />
// //                   <YAxis stroke="#6b7280" fontSize={12} />
// //                   <Tooltip
// //                     formatter={(value) => [formatCurrency(value, 'CDF'), 'Montant']}
// //                     labelFormatter={(label) => `Date: ${label}`}
// //                   />
// //                   <Legend />
// //                   <Bar dataKey="recetteCDF" name="Recette CDF" fill="#10b981" />
// //                   <Bar dataKey="depenseCDF" name="Dépense CDF" fill="#ef4444" />
// //                   <Bar dataKey="soldeCDF" name="Solde CDF" fill="#3b82f6" />
// //                 </BarChart>
// //               ) : (
// //                 <LineChart data={chartData}>
// //                   <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
// //                   <XAxis dataKey="date" stroke="#6b7280" fontSize={12} />
// //                   <YAxis stroke="#6b7280" fontSize={12} />
// //                   <Tooltip
// //                     formatter={(value) => [formatCurrency(value, 'CDF'), 'Montant']}
// //                     labelFormatter={(label) => `Date: ${label}`}
// //                   />
// //                   <Legend />
// //                   <Line type="monotone" dataKey="recetteCDF" name="Recette CDF" stroke="#10b981" strokeWidth={2} />
// //                   <Line type="monotone" dataKey="depenseCDF" name="Dépense CDF" stroke="#ef4444" strokeWidth={2} />
// //                   <Line type="monotone" dataKey="soldeCDF" name="Solde CDF" stroke="#3b82f6" strokeWidth={2} />
// //                 </LineChart>
// //               )}
// //             </ResponsiveContainer>
// //           </div>
// //         </div>

// //         {/* Graphique des catégories */}
// //         <div className="bg-white rounded-lg border border-gray-200 p-4">
// //           <div className="flex items-center justify-between mb-4">
// //             <h3 className="text-lg font-semibold text-gray-900">
// //               Répartition des dépenses par catégorie
// //             </h3>
// //             <button
// //               onClick={() => setChartType('pie')}
// //               className="p-2 rounded hover:bg-gray-50"
// //             >
// //               <PieChartIcon className="w-4 h-4" />
// //             </button>
// //           </div>
          
// //           <div className="h-64">
// //             {categoryData.length > 0 ? (
// //               <ResponsiveContainer width="100%" height="100%">
// //                 <PieChart>
// //                   <Pie
// //                     data={categoryData}
// //                     cx="50%"
// //                     cy="50%"
// //                     labelLine={false}
// //                     label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
// //                     outerRadius={80}
// //                     fill="#8884d8"
// //                     dataKey="value"
// //                   >
// //                     {categoryData.map((entry, index) => (
// //                       <Cell key={`cell-${index}`} fill={entry.color} />
// //                     ))}
// //                   </Pie>
// //                   <Tooltip
// //                     formatter={(value) => [formatCurrency(value, 'CDF'), 'Montant']}
// //                   />
// //                   <Legend />
// //                 </PieChart>
// //               </ResponsiveContainer>
// //             ) : (
// //               <div className="flex items-center justify-center h-full text-gray-500">
// //                 Aucune dépense pour aujourd'hui
// //               </div>
// //             )}
// //           </div>
// //         </div>
// //       </div>

// //       {/* Liste des sorties du jour */}
// //       <div className="bg-white rounded-lg border border-gray-200 mb-6">
// //         <div className="p-4 border-b border-gray-200">
// //           <h3 className="text-lg font-semibold text-gray-900 flex items-center">
// //             <ArrowDownRight className="w-5 h-5 mr-2 text-red-600" />
// //             Sorties de caisse du jour ({outflows.length})
// //           </h3>
// //         </div>
        
// //         {loading ? (
// //           <div className="p-8 flex justify-center">
// //             <Loader2 className="w-8 h-8 animate-spin text-gray-600" />
// //           </div>
// //         ) : outflows.length > 0 ? (
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
// //                     Devise
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
// //                     <td className="px-4 py-3">
// //                       <div className="font-mono text-sm text-gray-900">
// //                         {outflow.outflow_number}
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
// //                     <td className="px-4 py-3">
// //                       <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
// //                         outflow.currency === 'USD' 
// //                           ? 'bg-blue-100 text-blue-800' 
// //                           : 'bg-green-100 text-green-800'
// //                       }`}>
// //                         {outflow.currency === 'USD' ? '$ USD' : 'FC CDF'}
// //                       </span>
// //                     </td>
// //                     <td className="px-4 py-3">
// //                       <div className="text-sm text-gray-500">
// //                         {new Date(outflow.created_at).toLocaleTimeString('fr-FR', {
// //                           hour: '2-digit',
// //                           minute: '2-digit'
// //                         })}
// //                       </div>
// //                     </td>
// //                     <td className="px-4 py-3">
// //                       <button
// //                         onClick={() => {/* Voir détails */}}
// //                         className="p-1.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded"
// //                       >
// //                         <Eye className="w-4 h-4" />
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
// //             <h4 className="text-gray-900 font-medium mb-1">Aucune sortie aujourd'hui</h4>
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
// //                     Date
// //                   </label>
// //                   <input
// //                     type="date"
// //                     value={selectedDate}
// //                     onChange={(e) => setSelectedDate(e.target.value)}
// //                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-red-600 focus:border-red-600 text-sm"
// //                   />
// //                 </div>
                
// //                 <div>
// //                   <label className="block text-sm font-medium text-gray-700 mb-1">
// //                     Montant *
// //                   </label>
// //                   <div className="flex gap-2">
// //                     <input
// //                       type="number"
// //                       step="0.01"
// //                       min="0"
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
// //                       Taux: 1$ = {saleConfig.currency_rate?.toLocaleString('fr-FR')} FC
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
// //                     Motif / Raison *
// //                   </label>
// //                   <textarea
// //                     value={newOutflow.reason}
// //                     onChange={(e) => setNewOutflow({...newOutflow, reason: e.target.value})}
// //                     rows="3"
// //                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-red-600 focus:border-red-600 text-sm"
// //                     placeholder="Décrivez la raison de cette sortie..."
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
// //                       Enregistrer la sortie
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

// import { useState, useEffect } from 'react'
// import { useRouter } from 'next/navigation'
// import { supabase } from '@/lib/supabase'
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
//   LineChart,
//   Line,
//   PieChart,
//   Pie,
//   Cell
// } from 'recharts'
// import {
//   DollarSign,
//   TrendingUp,
//   TrendingDown,
//   Wallet,
//   Calendar,
//   Download,
//   Plus,
//   Filter,
//   Search,
//   X,
//   ChevronDown,
//   Loader2,
//   BarChart3,
//   PieChart as PieChartIcon,
//   LineChart as LineChartIcon,
//   RefreshCw,
//   Eye,
//   Printer,
//   FileText,
//   ArrowUpRight,
//   ArrowDownRight
// } from 'lucide-react'

// export default function RapportsFinanciersPage() {
//   const router = useRouter()
//   const [user, setUser] = useState(null)
//   const [loading, setLoading] = useState(true)
//   const [reports, setReports] = useState([])
//   const [outflows, setOutflows] = useState([])
//   const [sales, setSales] = useState([])
//   const [showOutflowModal, setShowOutflowModal] = useState(false)
//   const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
//   const [stats, setStats] = useState({
//     totalReceiptCDF: 0,
//     totalReceiptUSD: 0,
//     totalOutflowCDF: 0,
//     totalOutflowUSD: 0,
//     netBalanceCDF: 0,
//     netBalanceUSD: 0,
//     openingBalanceCDF: 0,
//     closingBalanceCDF: 0
//   })
//   const [filters, setFilters] = useState({
//     dateRange: 'today',
//     startDate: new Date().toISOString().split('T')[0],
//     endDate: new Date().toISOString().split('T')[0],
//     category: 'all'
//   })
//   const [newOutflow, setNewOutflow] = useState({
//     amount: '',
//     currency: 'CDF',
//     reason: '',
//     category: 'Divers'
//   })
//   const [chartType, setChartType] = useState('bar')
//   const [saleConfig, setSaleConfig] = useState({
//     vat_amount: 20.00,
//     currency_rate: 2300.00,
//     base_currency: 'USD'
//   })

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

//   // Fonction utilitaire pour récupérer l'utilisateur
//   const getCurrentUser = async () => {
//     try {
//       // Essayer d'abord depuis localStorage
//       const userData = localStorage.getItem('user_data')
//       if (userData) {
//         const parsedUser = JSON.parse(userData)
//         setUser(parsedUser)
//         return parsedUser
//       }
      
//       // Sinon, essayer avec Supabase Auth
//       const { data: { session }, error } = await supabase.auth.getSession()
//       if (error) throw error
      
//       if (session?.user) {
//         setUser(session.user)
//         localStorage.setItem('user_data', JSON.stringify(session.user))
//         return session.user
//       }
      
//       return null
//     } catch (error) {
//       console.error('Erreur récupération utilisateur:', error)
//       return null
//     }
//   }

//   useEffect(() => {
//     const init = async () => {
//       setLoading(true)
      
//       // Vérifier l'authentification
//       const currentUser = await getCurrentUser()
//       if (!currentUser) {
//         router.push('/auth/login')
//         return
//       }
      
//       // Charger les données
//       await Promise.all([
//         loadSaleConfig(),
//         loadDailyReports(),
//         loadSales(),
//         loadOutflows(),
//         loadDailyStats()
//       ])
      
//       setLoading(false)
//     }
    
//     init()
//   }, [filters, selectedDate, router])

//   const loadSaleConfig = async () => {
//     try {
//       const { data } = await supabase
//         .from('sale_config')
//         .select('*')
//         .order('created_at', { ascending: false })
//         .limit(1)
//         .single()
      
//       if (data) setSaleConfig(data)
//     } catch (error) {
//       console.error('Erreur chargement config:', error)
//     }
//   }

//   const loadSales = async () => {
//     try {
//       let query = supabase
//         .from('sale')
//         .select('*')
//         .eq('status', 'completed')
//         .eq('payment_status', 'paid')

//       // Appliquer le filtre date
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
//       } else if (filters.dateRange === 'custom') {
//         query = query.gte('created_at', `${filters.startDate}T00:00:00`)
//           .lte('created_at', `${filters.endDate}T23:59:59`)
//       }

//       const { data } = await query
//       setSales(data || [])
//     } catch (error) {
//       console.error('Erreur chargement ventes:', error)
//     }
//   }

//   const loadDailyReports = async () => {
//     try {
//       let query = supabase
//         .from('daily_financial_report')
//         .select('*')
//         .order('report_date', { ascending: false })

//       if (filters.dateRange === 'today') {
//         query = query.eq('report_date', new Date().toISOString().split('T')[0])
//       } else if (filters.dateRange === 'yesterday') {
//         const yesterday = new Date()
//         yesterday.setDate(yesterday.getDate() - 1)
//         query = query.eq('report_date', yesterday.toISOString().split('T')[0])
//       } else if (filters.dateRange === 'last7days') {
//         const endDate = new Date()
//         const startDate = new Date()
//         startDate.setDate(startDate.getDate() - 7)
//         query = query.gte('report_date', startDate.toISOString().split('T')[0])
//           .lte('report_date', endDate.toISOString().split('T')[0])
//       } else if (filters.dateRange === 'thisMonth') {
//         const firstDay = new Date()
//         firstDay.setDate(1)
//         query = query.gte('report_date', firstDay.toISOString().split('T')[0])
//       } else if (filters.dateRange === 'custom') {
//         query = query.gte('report_date', filters.startDate)
//           .lte('report_date', filters.endDate)
//       }

//       const { data } = await query.limit(30)
//       setReports(data || [])
//     } catch (error) {
//       console.error('Erreur chargement rapports:', error)
//     }
//   }

//   const loadOutflows = async () => {
//     try {
//       let query = supabase
//         .from('cash_outflow')
//         .select('*')
//         .eq('status', 'completed')

//       if (filters.dateRange === 'today') {
//         query = query.eq('date', new Date().toISOString().split('T')[0])
//       } else if (filters.dateRange === 'yesterday') {
//         const yesterday = new Date()
//         yesterday.setDate(yesterday.getDate() - 1)
//         query = query.eq('date', yesterday.toISOString().split('T')[0])
//       } else if (filters.dateRange === 'last7days') {
//         const endDate = new Date()
//         const startDate = new Date()
//         startDate.setDate(startDate.getDate() - 7)
//         query = query.gte('date', startDate.toISOString().split('T')[0])
//           .lte('date', endDate.toISOString().split('T')[0])
//       } else if (filters.dateRange === 'thisMonth') {
//         const firstDay = new Date()
//         firstDay.setDate(1)
//         query = query.gte('date', firstDay.toISOString().split('T')[0])
//       } else if (filters.dateRange === 'custom') {
//         query = query.gte('date', filters.startDate)
//           .lte('date', filters.endDate)
//       }

//       const { data } = await query.order('created_at', { ascending: false })
//       setOutflows(data || [])
//     } catch (error) {
//       console.error('Erreur chargement sorties:', error)
//     }
//   }

//   const loadDailyStats = async () => {
//     try {
//       // Pour la date sélectionnée
//       const startOfDay = `${selectedDate}T00:00:00`
//       const endOfDay = `${selectedDate}T23:59:59`
      
//       // Récupérer les ventes du jour sélectionné
//       const { data: salesData } = await supabase
//         .from('sale')
//         .select('total, currency, currency_rate')
//         .eq('status', 'completed')
//         .eq('payment_status', 'paid')
//         .gte('created_at', startOfDay)
//         .lte('created_at', endOfDay)
      
//       // Récupérer les sorties du jour sélectionné
//       const { data: outflowsData } = await supabase
//         .from('cash_outflow')
//         .select('amount, currency, currency_rate')
//         .eq('date', selectedDate)
//         .eq('status', 'completed')
      
//       let totalReceiptCDF = 0
//       let totalReceiptUSD = 0
//       let totalOutflowCDF = 0
//       let totalOutflowUSD = 0
      
//       // Calculer les recettes
//       if (salesData) {
//         salesData.forEach(sale => {
//           const montant = sale.total || 0
//           const tauxVente = sale.currency_rate || saleConfig.currency_rate || 1
          
//           if (sale.currency === 'USD') {
//             // Vente en USD - convertir en CDF avec le taux de la vente
//             totalReceiptUSD += montant
//             const montantCDF = montant * tauxVente
//             totalReceiptCDF += montantCDF
//           } else {
//             // Vente en CDF
//             totalReceiptCDF += montant
//           }
//         })
//       }
      
//       // Calculer les dépenses
//       if (outflowsData) {
//         outflowsData.forEach(outflow => {
//           const montant = outflow.amount || 0
//           const tauxOutflow = outflow.currency_rate || saleConfig.currency_rate || 1
          
//           if (outflow.currency === 'USD') {
//             // Dépense en USD - convertir en CDF avec le taux
//             totalOutflowUSD += montant
//             const montantCDF = montant * tauxOutflow
//             totalOutflowCDF += montantCDF
//           } else {
//             // Dépense en CDF
//             totalOutflowCDF += montant
//           }
//         })
//       }
      
//       // Récupérer le rapport du jour précédent pour le solde d'ouverture
//       const previousDate = new Date(selectedDate)
//       previousDate.setDate(previousDate.getDate() - 1)
//       const previousDateStr = previousDate.toISOString().split('T')[0]
      
//       const { data: previousReport } = await supabase
//         .from('daily_financial_report')
//         .select('closing_balance_cdf, closing_balance_usd')
//         .eq('report_date', previousDateStr)
//         .single()
      
//       const openingBalanceCDF = previousReport?.closing_balance_cdf || 0
//       const openingBalanceUSD = previousReport?.closing_balance_usd || 0
      
//       // Calculer les soldes de clôture
//       const closingBalanceCDF = openingBalanceCDF + (totalReceiptCDF - totalOutflowCDF)
//       const closingBalanceUSD = openingBalanceUSD + (totalReceiptUSD - totalOutflowUSD)
      
//       setStats({
//         totalReceiptCDF: Math.round(totalReceiptCDF),
//         totalReceiptUSD: Math.round(totalReceiptUSD * 100) / 100,
//         totalOutflowCDF: Math.round(totalOutflowCDF),
//         totalOutflowUSD: Math.round(totalOutflowUSD * 100) / 100,
//         netBalanceCDF: Math.round(totalReceiptCDF - totalOutflowCDF),
//         netBalanceUSD: Math.round((totalReceiptUSD - totalOutflowUSD) * 100) / 100,
//         openingBalanceCDF: Math.round(openingBalanceCDF),
//         closingBalanceCDF: Math.round(closingBalanceCDF)
//       })

//     } catch (error) {
//       console.error('Erreur chargement stats:', error)
//     }
//   }

//   const handleCreateOutflow = async () => {
//     if (!newOutflow.amount || !newOutflow.reason) {
//       alert('Veuillez remplir tous les champs obligatoires')
//       return
//     }

//     // Récupérer l'utilisateur actuel
//     const currentUser = await getCurrentUser()
//     if (!currentUser) {
//       alert('Session expirée, veuillez vous reconnecter')
//       router.push('/auth/login')
//       return
//     }

//     try {
//       const outflowData = {
//         amount: parseFloat(newOutflow.amount),
//         currency: newOutflow.currency,
//         currency_rate: newOutflow.currency === 'USD' ? saleConfig.currency_rate : 1.0,
//         reason: newOutflow.reason,
//         category: newOutflow.category,
//         user_id: currentUser.id,
//         date: selectedDate
//       }

//       const { error } = await supabase
//         .from('cash_outflow')
//         .insert([outflowData])

//       if (error) throw error

//       // Réinitialiser le formulaire
//       setNewOutflow({
//         amount: '',
//         currency: 'CDF',
//         reason: '',
//         category: 'Divers'
//       })
      
//       setShowOutflowModal(false)
//       loadOutflows()
//       loadDailyStats()
//       loadDailyReports()
      
//       alert('Sortie de caisse enregistrée avec succès')
//     } catch (error) {
//       console.error('Erreur création sortie:', error)
//       alert('Erreur lors de l\'enregistrement de la sortie')
//     }
//   }

//   const formatCurrency = (amount, currency = 'CDF') => {
//     const formatted = new Intl.NumberFormat('fr-FR', {
//       minimumFractionDigits: currency === 'CDF' ? 0 : 2,
//       maximumFractionDigits: currency === 'CDF' ? 0 : 2
//     }).format(amount || 0)
    
//     return `${currency === 'USD' ? '$' : 'FC'} ${formatted}`
//   }

//   const getCurrencySymbol = (currency) => {
//     return currency === 'USD' ? '$' : 'FC'
//   }

//   const getCategoryColor = (category) => {
//     const cat = categories.find(c => c.value === category)
//     return cat ? cat.color : '#6b7280'
//   }

//   // Préparer les données pour les graphiques
//   const chartData = reports.slice(0, 7).reverse().map(report => ({
//     date: new Date(report.report_date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }),
//     recetteCDF: parseFloat(report.total_receipt_cdf) || 0,
//     depenseCDF: parseFloat(report.total_outflow_cdf) || 0,
//     soldeCDF: parseFloat(report.balance_cdf) || 0,
//     recetteUSD: parseFloat(report.total_receipt_usd) || 0,
//     depenseUSD: parseFloat(report.total_outflow_usd) || 0,
//     soldeUSD: parseFloat(report.balance_usd) || 0
//   }))

//   // Pour les données du graphique circulaire (dépenses par catégorie pour la date sélectionnée)
//   const categoryData = categories.map(cat => {
//     const total = outflows
//       .filter(o => o.date === selectedDate && o.category === cat.value)
//       .reduce((sum, o) => {
//         let amount = parseFloat(o.amount) || 0
//         if (o.currency === 'USD') {
//           const taux = o.currency_rate || saleConfig.currency_rate
//           amount = amount * taux // Convertir en CDF
//         }
//         return sum + amount
//       }, 0)
    
//     return {
//       name: cat.label,
//       value: total,
//       color: cat.color
//     }
//   }).filter(item => item.value > 0)

//   const handleExport = async () => {
//     try {
//       // Récupérer les données pour la période sélectionnée
//       const reportData = {
//         date: selectedDate,
//         recetteCDF: stats.totalReceiptCDF,
//         recetteUSD: stats.totalReceiptUSD,
//         depenseCDF: stats.totalOutflowCDF,
//         depenseUSD: stats.totalOutflowUSD,
//         soldeCDF: stats.netBalanceCDF,
//         soldeUSD: stats.netBalanceUSD,
//         ouvertureCDF: stats.openingBalanceCDF,
//         clotureCDF: stats.closingBalanceCDF
//       }
      
//       const csvContent = [
//         ['Date', 'Recette CDF', 'Recette USD', 'Dépense CDF', 'Dépense USD', 'Solde CDF', 'Solde USD', 'Ouverture CDF', 'Clôture CDF'],
//         [
//           reportData.date,
//           reportData.recetteCDF,
//           reportData.recetteUSD,
//           reportData.depenseCDF,
//           reportData.depenseUSD,
//           reportData.soldeCDF,
//           reportData.soldeUSD,
//           reportData.ouvertureCDF,
//           reportData.clotureCDF
//         ]
//       ].map(row => row.join(',')).join('\n')
      
//       const blob = new Blob([csvContent], { type: 'text/csv' })
//       const url = window.URL.createObjectURL(blob)
//       const a = document.createElement('a')
//       a.href = url
//       a.download = `rapport-journalier-${selectedDate}.csv`
//       a.click()
//     } catch (error) {
//       console.error('Erreur export:', error)
//     }
//   }

//   const handlePrint = () => {
//     window.print()
//   }

//   const handleRefresh = () => {
//     loadDailyReports()
//     loadSales()
//     loadOutflows()
//     loadDailyStats()
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

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-screen">
//         <div className="text-center">
//           <Loader2 className="w-8 h-8 animate-spin text-gray-600 mx-auto mb-4" />
//           <p className="text-gray-500">Chargement des rapports...</p>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="p-4 sm:p-6">
//       {/* Header */}
//       <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
//         <div>
//           <h1 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center">
//             <BarChart3 className="w-6 h-6 sm:w-7 sm:h-7 mr-3 text-gray-700" />
//             Rapports Financiers Journaliers
//           </h1>
//           <p className="text-gray-500 text-sm mt-1">
//             Suivi des recettes, dépenses et soldes de caisse
//           </p>
//           <div className="flex flex-wrap gap-3 mt-2">
//             <div className="flex items-center space-x-1 text-sm">
//               <span className="text-gray-500">Date:</span>
//               <span className="font-medium">
//                 {new Date(selectedDate).toLocaleDateString('fr-FR', {
//                   day: '2-digit',
//                   month: '2-digit',
//                   year: 'numeric'
//                 })}
//               </span>
//             </div>
//             <div className="flex items-center space-x-1 text-sm">
//               <DollarSign className="w-4 h-4 text-gray-500" />
//               <span className="text-gray-500">Taux: 1$ = {saleConfig.currency_rate?.toLocaleString('fr-FR') || '2,300'} FC</span>
//             </div>
//           </div>
//         </div>
        
//         <div className="flex items-center space-x-2">
//           <button
//             onClick={handleExport}
//             className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm"
//           >
//             <Download className="w-4 h-4" />
//             <span className="hidden sm:inline">Exporter</span>
//           </button>
//           <button
//             onClick={handlePrint}
//             className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm"
//           >
//             <Printer className="w-4 h-4" />
//             <span className="hidden sm:inline">Imprimer</span>
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

//       {/* Sélecteur de date et filtres */}
//       <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
//         <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
//           <div>
//             <h2 className="text-lg font-semibold text-gray-900 flex items-center">
//               <Calendar className="w-5 h-5 mr-2" />
//               Rapport du {new Date(selectedDate).toLocaleDateString('fr-FR', {
//                 weekday: 'long',
//                 year: 'numeric',
//                 month: 'long',
//                 day: 'numeric'
//               })}
//             </h2>
//           </div>
          
//           <div className="flex flex-wrap gap-2">
//             <input
//               type="date"
//               value={selectedDate}
//               onChange={(e) => setSelectedDate(e.target.value)}
//               className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-gray-900 focus:border-gray-900 text-sm"
//             />
            
//             <select
//               value={filters.dateRange}
//               onChange={(e) => setFilters({...filters, dateRange: e.target.value})}
//               className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-gray-900 focus:border-gray-900 bg-white text-sm"
//             >
//               <option value="today">Aujourd'hui</option>
//               <option value="yesterday">Hier</option>
//               <option value="last7days">7 derniers jours</option>
//               <option value="thisMonth">Ce mois</option>
//               <option value="custom">Période personnalisée</option>
//             </select>
            
//             {filters.dateRange === 'custom' && (
//               <div className="flex gap-2">
//                 <input
//                   type="date"
//                   value={filters.startDate}
//                   onChange={(e) => setFilters({...filters, startDate: e.target.value})}
//                   className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-gray-900 focus:border-gray-900 text-sm"
//                 />
//                 <span className="self-center">à</span>
//                 <input
//                   type="date"
//                   value={filters.endDate}
//                   onChange={(e) => setFilters({...filters, endDate: e.target.value})}
//                   className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-gray-900 focus:border-gray-900 text-sm"
//                 />
//               </div>
//             )}
            
//             <button
//               onClick={handleRefresh}
//               className="px-3 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition text-sm flex items-center"
//             >
//               <RefreshCw className="w-4 h-4 mr-2" />
//               Actualiser
//             </button>
//           </div>
//         </div>
        
//         {/* Stats rapides */}
//         <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4 pt-4 border-t border-gray-200">
//           <div className="text-center p-2">
//             <div className="text-lg font-bold text-green-600">{formatCurrency(stats.totalReceiptCDF)}</div>
//             <div className="text-xs text-gray-500">Recette CDF</div>
//             <div className="text-xs text-green-500">$ {stats.totalReceiptUSD.toFixed(2)}</div>
//           </div>
          
//           <div className="text-center p-2">
//             <div className="text-lg font-bold text-red-600">{formatCurrency(stats.totalOutflowCDF)}</div>
//             <div className="text-xs text-gray-500">Dépense CDF</div>
//             <div className="text-xs text-red-500">$ {stats.totalOutflowUSD.toFixed(2)}</div>
//           </div>
          
//           <div className="text-center p-2">
//             <div className={`text-lg font-bold ${stats.netBalanceCDF >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
//               {formatCurrency(stats.netBalanceCDF)}
//             </div>
//             <div className="text-xs text-gray-500">Solde net CDF</div>
//             <div className={`text-xs ${stats.netBalanceUSD >= 0 ? 'text-blue-500' : 'text-red-500'}`}>
//               $ {stats.netBalanceUSD.toFixed(2)}
//             </div>
//           </div>
          
//           <div className="text-center p-2">
//             <div className="text-lg font-bold text-purple-600">{formatCurrency(stats.closingBalanceCDF)}</div>
//             <div className="text-xs text-gray-500">Solde clôture</div>
//             <div className="text-xs text-gray-400">
//               Ouverture: {formatCurrency(stats.openingBalanceCDF)}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Graphiques */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
//         {/* Graphique principal */}
//         <div className="bg-white rounded-lg border border-gray-200 p-4">
//           <div className="flex items-center justify-between mb-4">
//             <h3 className="text-lg font-semibold text-gray-900">
//               Évolution sur 7 jours
//             </h3>
//             <div className="flex space-x-2">
//               <button
//                 onClick={() => setChartType('bar')}
//                 className={`p-2 rounded ${chartType === 'bar' ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
//               >
//                 <BarChart3 className="w-4 h-4" />
//               </button>
//               <button
//                 onClick={() => setChartType('line')}
//                 className={`p-2 rounded ${chartType === 'line' ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
//               >
//                 <LineChartIcon className="w-4 h-4" />
//               </button>
//             </div>
//           </div>
          
//           <div className="h-64">
//             <ResponsiveContainer width="100%" height="100%">
//               {chartType === 'bar' ? (
//                 <BarChart data={chartData}>
//                   <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
//                   <XAxis dataKey="date" stroke="#6b7280" fontSize={12} />
//                   <YAxis stroke="#6b7280" fontSize={12} />
//                   <Tooltip
//                     formatter={(value) => [formatCurrency(value, 'CDF'), 'Montant']}
//                     labelFormatter={(label) => `Date: ${label}`}
//                   />
//                   <Legend />
//                   <Bar dataKey="recetteCDF" name="Recette CDF" fill="#10b981" />
//                   <Bar dataKey="depenseCDF" name="Dépense CDF" fill="#ef4444" />
//                   <Bar dataKey="soldeCDF" name="Solde CDF" fill="#3b82f6" />
//                 </BarChart>
//               ) : (
//                 <LineChart data={chartData}>
//                   <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
//                   <XAxis dataKey="date" stroke="#6b7280" fontSize={12} />
//                   <YAxis stroke="#6b7280" fontSize={12} />
//                   <Tooltip
//                     formatter={(value) => [formatCurrency(value, 'CDF'), 'Montant']}
//                     labelFormatter={(label) => `Date: ${label}`}
//                   />
//                   <Legend />
//                   <Line type="monotone" dataKey="recetteCDF" name="Recette CDF" stroke="#10b981" strokeWidth={2} />
//                   <Line type="monotone" dataKey="depenseCDF" name="Dépense CDF" stroke="#ef4444" strokeWidth={2} />
//                   <Line type="monotone" dataKey="soldeCDF" name="Solde CDF" stroke="#3b82f6" strokeWidth={2} />
//                 </LineChart>
//               )}
//             </ResponsiveContainer>
//           </div>
//         </div>

//         {/* Graphique des catégories */}
//         <div className="bg-white rounded-lg border border-gray-200 p-4">
//           <div className="flex items-center justify-between mb-4">
//             <h3 className="text-lg font-semibold text-gray-900">
//               Répartition des dépenses ({selectedDate})
//             </h3>
//             <button
//               className="p-2 rounded hover:bg-gray-50"
//             >
//               <PieChartIcon className="w-4 h-4" />
//             </button>
//           </div>
          
//           <div className="h-64">
//             {categoryData.length > 0 ? (
//               <ResponsiveContainer width="100%" height="100%">
//                 <PieChart>
//                   <Pie
//                     data={categoryData}
//                     cx="50%"
//                     cy="50%"
//                     labelLine={false}
//                     label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
//                     outerRadius={80}
//                     fill="#8884d8"
//                     dataKey="value"
//                   >
//                     {categoryData.map((entry, index) => (
//                       <Cell key={`cell-${index}`} fill={entry.color} />
//                     ))}
//                   </Pie>
//                   <Tooltip
//                     formatter={(value) => [formatCurrency(value, 'CDF'), 'Montant']}
//                   />
//                   <Legend />
//                 </PieChart>
//               </ResponsiveContainer>
//             ) : (
//               <div className="flex flex-col items-center justify-center h-full text-gray-500">
//                 <PieChartIcon className="w-12 h-12 mb-2" />
//                 <p>Aucune dépense pour cette date</p>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Liste des sorties */}
//       <div className="bg-white rounded-lg border border-gray-200 mb-6">
//         <div className="p-4 border-b border-gray-200">
//           <div className="flex items-center justify-between">
//             <h3 className="text-lg font-semibold text-gray-900 flex items-center">
//               <ArrowDownRight className="w-5 h-5 mr-2 text-red-600" />
//               Sorties de caisse ({outflows.filter(o => o.date === selectedDate).length})
//             </h3>
//             <span className="text-sm text-gray-500">
//               {selectedDate}
//             </span>
//           </div>
//         </div>
        
//         {outflows.filter(o => o.date === selectedDate).length > 0 ? (
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
//                     Devise
//                   </th>
//                   <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
//                     Taux
//                   </th>
//                   <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
//                     Heure
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-gray-200">
//                 {outflows
//                   .filter(o => o.date === selectedDate)
//                   .map((outflow) => (
//                   <tr key={outflow.id} className="hover:bg-gray-50">
//                     <td className="px-4 py-3">
//                       <div className="font-mono text-sm text-gray-900">
//                         {outflow.outflow_number}
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
//                       <div className="text-sm text-gray-900">
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
//                     <td className="px-4 py-3">
//                       {getCurrencyBadge(outflow.currency)}
//                     </td>
//                     <td className="px-4 py-3">
//                       {outflow.currency === 'USD' && outflow.currency_rate && (
//                         <div className="text-xs text-gray-700">
//                           1$ = {outflow.currency_rate.toLocaleString('fr-FR')} FC
//                         </div>
//                       )}
//                     </td>
//                     <td className="px-4 py-3">
//                       <div className="text-sm text-gray-500">
//                         {new Date(outflow.created_at).toLocaleTimeString('fr-FR', {
//                           hour: '2-digit',
//                           minute: '2-digit'
//                         })}
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         ) : (
//           <div className="p-8 text-center">
//             <ArrowDownRight className="w-12 h-12 text-gray-400 mx-auto mb-3" />
//             <h4 className="text-gray-900 font-medium mb-1">Aucune sortie pour cette date</h4>
//             <p className="text-gray-500 text-sm mb-4">
//               Enregistrez une sortie de caisse
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
//                     Date
//                   </label>
//                   <input
//                     type="date"
//                     value={selectedDate}
//                     onChange={(e) => setSelectedDate(e.target.value)}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-red-600 focus:border-red-600 text-sm"
//                   />
//                 </div>
                
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Montant *
//                   </label>
//                   <div className="flex gap-2">
//                     <input
//                       type="number"
//                       step="0.01"
//                       min="0"
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
//                       Taux: 1$ = {saleConfig.currency_rate?.toLocaleString('fr-FR')} FC
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
//                     Motif / Raison *
//                   </label>
//                   <textarea
//                     value={newOutflow.reason}
//                     onChange={(e) => setNewOutflow({...newOutflow, reason: e.target.value})}
//                     rows="3"
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-red-600 focus:border-red-600 text-sm"
//                     placeholder="Décrivez la raison de cette sortie..."
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

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts'
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Wallet,
  Calendar,
  Download,
  Plus,
  Filter,
  Search,
  X,
  ChevronDown,
  Loader2,
  BarChart3,
  PieChart as PieChartIcon,
  LineChart as LineChartIcon,
  RefreshCw,
  Eye,
  Printer,
  FileText,
  ArrowUpRight,
  ArrowDownRight,
  CreditCard,
  Cash,
  Receipt
} from 'lucide-react'

export default function RapportsFinanciersPage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [reports, setReports] = useState([])
  const [outflows, setOutflows] = useState([])
  const [sales, setSales] = useState([])
  const [showOutflowModal, setShowOutflowModal] = useState(false)
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [stats, setStats] = useState({
    totalReceiptCDF: 0,
    totalReceiptUSD: 0,
    totalOutflowCDF: 0,
    totalOutflowUSD: 0,
    netBalanceCDF: 0,
    netBalanceUSD: 0,
    openingBalanceCDF: 0,
    closingBalanceCDF: 0,
    openingBalanceUSD: 0,
    closingBalanceUSD: 0
  })
  const [filters, setFilters] = useState({
    dateRange: 'today',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    category: 'all'
  })
  const [newOutflow, setNewOutflow] = useState({
    amount: '',
    currency: 'CDF',
    reason: '',
    category: 'Divers'
  })
  const [chartType, setChartType] = useState('bar')
  const [saleConfig, setSaleConfig] = useState({
    vat_amount: 20.00,
    currency_rate: 2300.00,
    base_currency: 'USD'
  })
  const [activeCurrencyTab, setActiveCurrencyTab] = useState('CDF')

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

  // Fonction utilitaire pour récupérer l'utilisateur
  const getCurrentUser = async () => {
    try {
      // Essayer d'abord depuis localStorage
      const userData = localStorage.getItem('user_data')
      if (userData) {
        const parsedUser = JSON.parse(userData)
        setUser(parsedUser)
        return parsedUser
      }
      
      // Sinon, essayer avec Supabase Auth
      const { data: { session }, error } = await supabase.auth.getSession()
      if (error) throw error
      
      if (session?.user) {
        setUser(session.user)
        localStorage.setItem('user_data', JSON.stringify(session.user))
        return session.user
      }
      
      return null
    } catch (error) {
      console.error('Erreur récupération utilisateur:', error)
      return null
    }
  }

  useEffect(() => {
    const init = async () => {
      setLoading(true)
      
      // Vérifier l'authentification
      const currentUser = await getCurrentUser()
      if (!currentUser) {
        router.push('/auth/login')
        return
      }
      
      // Charger les données
      await Promise.all([
        loadSaleConfig(),
        loadDailyReports(),
        loadSales(),
        loadOutflows(),
        loadDailyStats()
      ])
      
      setLoading(false)
    }
    
    init()
  }, [filters, selectedDate, router])

  const loadSaleConfig = async () => {
    try {
      const { data } = await supabase
        .from('sale_config')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .single()
      
      if (data) setSaleConfig(data)
    } catch (error) {
      console.error('Erreur chargement config:', error)
    }
  }

  const loadSales = async () => {
    try {
      let query = supabase
        .from('sale')
        .select('*')
        .eq('status', 'completed')
        .eq('payment_status', 'paid')

      // Appliquer le filtre date selon la période sélectionnée
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
      } else if (filters.dateRange === 'last7days') {
        const endDate = new Date()
        const startDate = new Date()
        startDate.setDate(startDate.getDate() - 7)
        startDate.setHours(0, 0, 0, 0)
        query = query.gte('created_at', startDate.toISOString())
          .lte('created_at', endDate.toISOString())
      } else if (filters.dateRange === 'thisMonth') {
        const firstDay = new Date()
        firstDay.setDate(1)
        firstDay.setHours(0, 0, 0, 0)
        query = query.gte('created_at', firstDay.toISOString())
      } else if (filters.dateRange === 'custom') {
        query = query.gte('created_at', `${filters.startDate}T00:00:00`)
          .lte('created_at', `${filters.endDate}T23:59:59`)
      }

      const { data } = await query
      setSales(data || [])
    } catch (error) {
      console.error('Erreur chargement ventes:', error)
    }
  }

  const loadDailyReports = async () => {
    try {
      let query = supabase
        .from('daily_financial_report')
        .select('*')
        .order('report_date', { ascending: false })

      if (filters.dateRange === 'today') {
        query = query.eq('report_date', new Date().toISOString().split('T')[0])
      } else if (filters.dateRange === 'yesterday') {
        const yesterday = new Date()
        yesterday.setDate(yesterday.getDate() - 1)
        query = query.eq('report_date', yesterday.toISOString().split('T')[0])
      } else if (filters.dateRange === 'last7days') {
        const endDate = new Date()
        const startDate = new Date()
        startDate.setDate(startDate.getDate() - 7)
        query = query.gte('report_date', startDate.toISOString().split('T')[0])
          .lte('report_date', endDate.toISOString().split('T')[0])
      } else if (filters.dateRange === 'thisMonth') {
        const firstDay = new Date()
        firstDay.setDate(1)
        query = query.gte('report_date', firstDay.toISOString().split('T')[0])
      } else if (filters.dateRange === 'custom') {
        query = query.gte('report_date', filters.startDate)
          .lte('report_date', filters.endDate)
      }

      const { data } = await query.limit(30)
      setReports(data || [])
    } catch (error) {
      console.error('Erreur chargement rapports:', error)
    }
  }

  const loadOutflows = async () => {
    try {
      let query = supabase
        .from('cash_outflow')
        .select('*')
        .eq('status', 'completed')

      // Appliquer le filtre date
      if (filters.dateRange === 'today') {
        query = query.eq('date', new Date().toISOString().split('T')[0])
      } else if (filters.dateRange === 'yesterday') {
        const yesterday = new Date()
        yesterday.setDate(yesterday.getDate() - 1)
        query = query.eq('date', yesterday.toISOString().split('T')[0])
      } else if (filters.dateRange === 'last7days') {
        const endDate = new Date()
        const startDate = new Date()
        startDate.setDate(startDate.getDate() - 7)
        query = query.gte('date', startDate.toISOString().split('T')[0])
          .lte('date', endDate.toISOString().split('T')[0])
      } else if (filters.dateRange === 'thisMonth') {
        const firstDay = new Date()
        firstDay.setDate(1)
        query = query.gte('date', firstDay.toISOString().split('T')[0])
      } else if (filters.dateRange === 'custom') {
        query = query.gte('date', filters.startDate)
          .lte('date', filters.endDate)
      }

      const { data } = await query.order('created_at', { ascending: false })
      setOutflows(data || [])
    } catch (error) {
      console.error('Erreur chargement sorties:', error)
    }
  }

  const loadDailyStats = async () => {
    try {
      // Déterminer la date de début et fin selon le filtre
      let startDate, endDate;
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      
      if (filters.dateRange === 'today') {
        startDate = today
        endDate = new Date(today)
        endDate.setHours(23, 59, 59, 999)
      } else if (filters.dateRange === 'yesterday') {
        startDate = new Date(today)
        startDate.setDate(startDate.getDate() - 1)
        endDate = new Date(today)
        endDate.setHours(0, 0, 0, 0)
      } else if (filters.dateRange === 'last7days') {
        startDate = new Date(today)
        startDate.setDate(startDate.getDate() - 7)
        endDate = new Date(today)
        endDate.setHours(23, 59, 59, 999)
      } else if (filters.dateRange === 'thisMonth') {
        startDate = new Date(today.getFullYear(), today.getMonth(), 1)
        endDate = new Date(today)
        endDate.setHours(23, 59, 59, 999)
      } else if (filters.dateRange === 'custom') {
        startDate = new Date(filters.startDate + 'T00:00:00')
        endDate = new Date(filters.endDate + 'T23:59:59')
      } else {
        // Par défaut: aujourd'hui
        startDate = today
        endDate = new Date(today)
        endDate.setHours(23, 59, 59, 999)
      }
      
      // Mettre à jour la date sélectionnée
      if (filters.dateRange !== 'custom') {
        setSelectedDate(startDate.toISOString().split('T')[0])
      }
      
      // Récupérer les ventes pour la période
      const { data: salesData } = await supabase
        .from('sale')
        .select('total, currency, currency_rate, created_at')
        .eq('status', 'completed')
        .eq('payment_status', 'paid')
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString())
      
      // Récupérer les sorties pour la période
      const { data: outflowsData } = await supabase
        .from('cash_outflow')
        .select('amount, currency, currency_rate, date, created_at')
        .gte('date', startDate.toISOString().split('T')[0])
        .lte('date', endDate.toISOString().split('T')[0])
        .eq('status', 'completed')
      
      let totalReceiptCDF = 0
      let totalReceiptUSD = 0
      let totalOutflowCDF = 0
      let totalOutflowUSD = 0
      
      // Calculer les recettes
      if (salesData) {
        salesData.forEach(sale => {
          const montant = sale.total || 0
          
          if (sale.currency === 'USD') {
            // Vente en USD
            totalReceiptUSD += montant
            // Conversion en CDF pour les totaux CDF
            const tauxVente = sale.currency_rate || saleConfig.currency_rate || 1
            const montantCDF = montant * tauxVente
            totalReceiptCDF += montantCDF
          } else {
            // Vente en CDF
            totalReceiptCDF += montant
          }
        })
      }
      
      // Calculer les dépenses
      if (outflowsData) {
        outflowsData.forEach(outflow => {
          const montant = outflow.amount || 0
          
          if (outflow.currency === 'USD') {
            // Dépense en USD
            totalOutflowUSD += montant
            // Conversion en CDF pour les totaux CDF
            const tauxOutflow = outflow.currency_rate || saleConfig.currency_rate || 1
            const montantCDF = montant * tauxOutflow
            totalOutflowCDF += montantCDF
          } else {
            // Dépense en CDF
            totalOutflowCDF += montant
          }
        })
      }
      
      // Récupérer le solde d'ouverture (solde de clôture du jour précédent)
      const previousDate = new Date(startDate)
      previousDate.setDate(previousDate.getDate() - 1)
      const previousDateStr = previousDate.toISOString().split('T')[0]
      
      const { data: previousReport } = await supabase
        .from('daily_financial_report')
        .select('closing_balance_cdf, closing_balance_usd')
        .eq('report_date', previousDateStr)
        .single()
      
      const openingBalanceCDF = previousReport?.closing_balance_cdf || 0
      const openingBalanceUSD = previousReport?.closing_balance_usd || 0
      
      // Calculer les soldes de clôture
      const closingBalanceCDF = openingBalanceCDF + (totalReceiptCDF - totalOutflowCDF)
      const closingBalanceUSD = openingBalanceUSD + (totalReceiptUSD - totalOutflowUSD)
      
      setStats({
        totalReceiptCDF: Math.round(totalReceiptCDF),
        totalReceiptUSD: Math.round(totalReceiptUSD * 100) / 100,
        totalOutflowCDF: Math.round(totalOutflowCDF),
        totalOutflowUSD: Math.round(totalOutflowUSD * 100) / 100,
        netBalanceCDF: Math.round(totalReceiptCDF - totalOutflowCDF),
        netBalanceUSD: Math.round((totalReceiptUSD - totalOutflowUSD) * 100) / 100,
        openingBalanceCDF: Math.round(openingBalanceCDF),
        closingBalanceCDF: Math.round(closingBalanceCDF),
        openingBalanceUSD: Math.round(openingBalanceUSD * 100) / 100,
        closingBalanceUSD: Math.round(closingBalanceUSD * 100) / 100
      })

    } catch (error) {
      console.error('Erreur chargement stats:', error)
    }
  }

  const handleCreateOutflow = async () => {
    if (!newOutflow.amount || !newOutflow.reason) {
      alert('Veuillez remplir tous les champs obligatoires')
      return
    }

    // Récupérer l'utilisateur actuel
    const currentUser = await getCurrentUser()
    if (!currentUser) {
      alert('Session expirée, veuillez vous reconnecter')
      router.push('/auth/login')
      return
    }

    try {
      const outflowData = {
        amount: parseFloat(newOutflow.amount),
        currency: newOutflow.currency,
        currency_rate: newOutflow.currency === 'USD' ? saleConfig.currency_rate : 1.0,
        reason: newOutflow.reason,
        category: newOutflow.category,
        user_id: currentUser.id,
        date: selectedDate
      }

      const { error } = await supabase
        .from('cash_outflow')
        .insert([outflowData])

      if (error) throw error

      // Réinitialiser le formulaire
      setNewOutflow({
        amount: '',
        currency: 'CDF',
        reason: '',
        category: 'Divers'
      })
      
      setShowOutflowModal(false)
      loadOutflows()
      loadDailyStats()
      loadDailyReports()
      
      alert('Sortie de caisse enregistrée avec succès')
    } catch (error) {
      console.error('Erreur création sortie:', error)
      alert('Erreur lors de l\'enregistrement de la sortie')
    }
  }

  const formatCurrency = (amount, currency = 'CDF') => {
    const formatted = new Intl.NumberFormat('fr-FR', {
      minimumFractionDigits: currency === 'CDF' ? 0 : 2,
      maximumFractionDigits: currency === 'CDF' ? 0 : 2
    }).format(amount || 0)
    
    return `${currency === 'USD' ? '$' : 'FC'} ${formatted}`
  }

  const getCurrencySymbol = (currency) => {
    return currency === 'USD' ? '$' : 'FC'
  }

  const getCategoryColor = (category) => {
    const cat = categories.find(c => c.value === category)
    return cat ? cat.color : '#6b7280'
  }

  // Préparer les données pour les graphiques (7 derniers jours)
  const chartData = reports.slice(0, 7).reverse().map(report => ({
    date: new Date(report.report_date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }),
    recetteCDF: parseFloat(report.total_receipt_cdf) || 0,
    depenseCDF: parseFloat(report.total_outflow_cdf) || 0,
    soldeCDF: parseFloat(report.balance_cdf) || 0,
    recetteUSD: parseFloat(report.total_receipt_usd) || 0,
    depenseUSD: parseFloat(report.total_outflow_usd) || 0,
    soldeUSD: parseFloat(report.balance_usd) || 0
  }))

  // Pour les données du graphique circulaire (dépenses par catégorie)
  const getCategoryData = (currency = 'CDF') => {
    const filteredOutflows = outflows.filter(o => {
      if (filters.dateRange === 'custom') {
        return o.date >= filters.startDate && o.date <= filters.endDate && o.currency === currency
      } else {
        return o.currency === currency
      }
    })
    
    const data = categories.map(cat => {
      const total = filteredOutflows
        .filter(o => o.category === cat.value)
        .reduce((sum, o) => {
          return sum + (parseFloat(o.amount) || 0)
        }, 0)
      
      return {
        name: cat.label,
        value: currency === 'CDF' ? Math.round(total) : Math.round(total * 100) / 100,
        color: cat.color
      }
    }).filter(item => item.value > 0)
    
    return data
  }

  const handleExport = async () => {
    try {
      // Récupérer les données pour la période sélectionnée
      const reportData = {
        date: selectedDate,
        recetteCDF: stats.totalReceiptCDF,
        recetteUSD: stats.totalReceiptUSD,
        depenseCDF: stats.totalOutflowCDF,
        depenseUSD: stats.totalOutflowUSD,
        soldeCDF: stats.netBalanceCDF,
        soldeUSD: stats.netBalanceUSD,
        ouvertureCDF: stats.openingBalanceCDF,
        clotureCDF: stats.closingBalanceCDF,
        ouvertureUSD: stats.openingBalanceUSD,
        clotureUSD: stats.closingBalanceUSD
      }
      
      const csvContent = [
        ['Date', 'Recette CDF', 'Recette USD', 'Dépense CDF', 'Dépense USD', 'Solde CDF', 'Solde USD', 'Ouverture CDF', 'Clôture CDF', 'Ouverture USD', 'Clôture USD'],
        [
          reportData.date,
          reportData.recetteCDF,
          reportData.recetteUSD,
          reportData.depenseCDF,
          reportData.depenseUSD,
          reportData.soldeCDF,
          reportData.soldeUSD,
          reportData.ouvertureCDF,
          reportData.clotureCDF,
          reportData.ouvertureUSD,
          reportData.clotureUSD
        ]
      ].map(row => row.join(',')).join('\n')
      
      const blob = new Blob([csvContent], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `rapport-${filters.dateRange}-${selectedDate}.csv`
      a.click()
    } catch (error) {
      console.error('Erreur export:', error)
    }
  }

  const handlePrint = () => {
    window.print()
  }

  const handleRefresh = () => {
    loadDailyReports()
    loadSales()
    loadOutflows()
    loadDailyStats()
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-gray-600 mx-auto mb-4" />
          <p className="text-gray-500">Chargement des rapports...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center">
            <BarChart3 className="w-6 h-6 sm:w-7 sm:h-7 mr-3 text-gray-700" />
            Rapports Financiers
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Suivi des recettes, dépenses et soldes de caisse
          </p>
          <div className="flex flex-wrap gap-3 mt-2">
            <div className="flex items-center space-x-1 text-sm">
              <span className="text-gray-500">Période:</span>
              <span className="font-medium">
                {filters.dateRange === 'today' ? "Aujourd'hui" : 
                 filters.dateRange === 'yesterday' ? "Hier" :
                 filters.dateRange === 'last7days' ? "7 derniers jours" :
                 filters.dateRange === 'thisMonth' ? "Ce mois" :
                 `${filters.startDate} au ${filters.endDate}`}
              </span>
            </div>
            <div className="flex items-center space-x-1 text-sm">
              <DollarSign className="w-4 h-4 text-gray-500" />
              <span className="text-gray-500">Taux: 1$ = {saleConfig.currency_rate?.toLocaleString('fr-FR') || '2,300'} FC</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={handleExport}
            className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Exporter</span>
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm"
          >
            <Printer className="w-4 h-4" />
            <span className="hidden sm:inline">Imprimer</span>
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

      {/* Sélecteur de date et filtres */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              {filters.dateRange === 'today' ? "Aujourd'hui" : 
               filters.dateRange === 'yesterday' ? "Hier" :
               filters.dateRange === 'last7days' ? "7 derniers jours" :
               filters.dateRange === 'thisMonth' ? "Ce mois" :
               `Période du ${filters.startDate} au ${filters.endDate}`}
            </h2>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <select
              value={filters.dateRange}
              onChange={(e) => setFilters({...filters, dateRange: e.target.value})}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-gray-900 focus:border-gray-900 bg-white text-sm"
            >
              <option value="today">Aujourd'hui</option>
              <option value="yesterday">Hier</option>
              <option value="last7days">7 derniers jours</option>
              <option value="thisMonth">Ce mois</option>
              <option value="custom">Période personnalisée</option>
            </select>
            
            {filters.dateRange === 'custom' && (
              <div className="flex gap-2">
                <input
                  type="date"
                  value={filters.startDate}
                  onChange={(e) => setFilters({...filters, startDate: e.target.value})}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-gray-900 focus:border-gray-900 text-sm"
                />
                <span className="self-center">à</span>
                <input
                  type="date"
                  value={filters.endDate}
                  onChange={(e) => setFilters({...filters, endDate: e.target.value})}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-gray-900 focus:border-gray-900 text-sm"
                />
              </div>
            )}
            
            <button
              onClick={handleRefresh}
              className="px-3 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition text-sm flex items-center"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Actualiser
            </button>
          </div>
        </div>
        
        {/* Stats rapides */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 pt-4 border-t border-gray-200">
          <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="text-green-800">
                <ArrowUpRight className="w-5 h-5" />
              </div>
              <div className="text-xs font-medium text-green-800">
                Recettes
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-lg font-bold text-green-900">{formatCurrency(stats.totalReceiptCDF)}</div>
              <div className="text-sm text-green-700">$ {stats.totalReceiptUSD.toFixed(2)}</div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-red-50 to-red-100 border border-red-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="text-red-800">
                <ArrowDownRight className="w-5 h-5" />
              </div>
              <div className="text-xs font-medium text-red-800">
                Dépenses
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-lg font-bold text-red-900">{formatCurrency(stats.totalOutflowCDF)}</div>
              <div className="text-sm text-red-700">$ {stats.totalOutflowUSD.toFixed(2)}</div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="text-blue-800">
                <Wallet className="w-5 h-5" />
              </div>
              <div className="text-xs font-medium text-blue-800">
                Solde net
              </div>
            </div>
            <div className="space-y-1">
              <div className={`text-lg font-bold ${stats.netBalanceCDF >= 0 ? 'text-blue-900' : 'text-red-900'}`}>
                {formatCurrency(stats.netBalanceCDF)}
              </div>
              <div className={`text-sm ${stats.netBalanceUSD >= 0 ? 'text-blue-700' : 'text-red-700'}`}>
                $ {stats.netBalanceUSD.toFixed(2)}
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="text-purple-800">
                <Receipt className="w-5 h-5" />
              </div>
              <div className="text-xs font-medium text-purple-800">
                Solde clôture
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-lg font-bold text-purple-900">{formatCurrency(stats.closingBalanceCDF)}</div>
              <div className="text-xs text-purple-700">
                $ {stats.closingBalanceUSD.toFixed(2)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Graphique principal */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Évolution sur 7 jours
            </h3>
            <div className="flex space-x-2">
              <button
                onClick={() => setChartType('bar')}
                className={`p-2 rounded ${chartType === 'bar' ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
              >
                <BarChart3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setChartType('line')}
                className={`p-2 rounded ${chartType === 'line' ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
              >
                <LineChartIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              {chartType === 'bar' ? (
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="date" stroke="#6b7280" fontSize={12} />
                  <YAxis stroke="#6b7280" fontSize={12} />
                  <Tooltip
                    formatter={(value) => [formatCurrency(value, 'CDF'), 'Montant']}
                    labelFormatter={(label) => `Date: ${label}`}
                  />
                  <Legend />
                  <Bar dataKey="recetteCDF" name="Recette CDF" fill="#10b981" />
                  <Bar dataKey="depenseCDF" name="Dépense CDF" fill="#ef4444" />
                  <Bar dataKey="soldeCDF" name="Solde CDF" fill="#3b82f6" />
                </BarChart>
              ) : (
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="date" stroke="#6b7280" fontSize={12} />
                  <YAxis stroke="#6b7280" fontSize={12} />
                  <Tooltip
                    formatter={(value) => [formatCurrency(value, 'CDF'), 'Montant']}
                    labelFormatter={(label) => `Date: ${label}`}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="recetteCDF" name="Recette CDF" stroke="#10b981" strokeWidth={2} />
                  <Line type="monotone" dataKey="depenseCDF" name="Dépense CDF" stroke="#ef4444" strokeWidth={2} />
                  <Line type="monotone" dataKey="soldeCDF" name="Solde CDF" stroke="#3b82f6" strokeWidth={2} />
                </LineChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>

        {/* Graphique des catégories - Doughnut */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Répartition des dépenses
            </h3>
            <div className="flex space-x-1">
              <button
                onClick={() => setActiveCurrencyTab('CDF')}
                className={`px-3 py-1 text-sm rounded ${activeCurrencyTab === 'CDF' ? 'bg-green-100 text-green-800' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                CDF
              </button>
              <button
                onClick={() => setActiveCurrencyTab('USD')}
                className={`px-3 py-1 text-sm rounded ${activeCurrencyTab === 'USD' ? 'bg-blue-100 text-blue-800' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                USD
              </button>
            </div>
          </div>
          
          <div className="h-64">
            {getCategoryData(activeCurrencyTab).length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={getCategoryData(activeCurrencyTab)}
                    cx="50%"
                    cy="50%"
                    innerRadius={60} // Trou au milieu pour le doughnut
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {getCategoryData(activeCurrencyTab).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => [formatCurrency(value, activeCurrencyTab), 'Montant']}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <PieChartIcon className="w-12 h-12 mb-2" />
                <p>Aucune dépense en {activeCurrencyTab} pour cette période</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Liste des sorties avec onglets USD/CDF */}
      <div className="bg-white rounded-lg border border-gray-200 mb-6">
        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <ArrowDownRight className="w-5 h-5 mr-2 text-red-600" />
              Sorties de caisse ({outflows.length})
            </h3>
            
            <div className="flex space-x-1">
              <button
                onClick={() => {
                  const cdfOutflows = outflows.filter(o => o.currency === 'CDF')
                  return cdfOutflows
                }}
                className="px-3 py-1 text-sm bg-green-100 text-green-800 rounded"
              >
                CDF: {outflows.filter(o => o.currency === 'CDF').length}
              </button>
              <button
                onClick={() => {
                  const usdOutflows = outflows.filter(o => o.currency === 'USD')
                  return usdOutflows
                }}
                className="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded"
              >
                USD: {outflows.filter(o => o.currency === 'USD').length}
              </button>
            </div>
          </div>
        </div>
        
        {/* Onglets pour CDF et USD */}
        <div className="border-b border-gray-200">
          <div className="flex">
            <button
              onClick={() => setActiveCurrencyTab('CDF')}
              className={`flex-1 py-2 text-center ${activeCurrencyTab === 'CDF' ? 'border-b-2 border-green-600 text-green-600 font-medium' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <div className="flex items-center justify-center">
                <span className="mr-2">FC</span>
                <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">
                  {outflows.filter(o => o.currency === 'CDF').length}
                </span>
              </div>
            </button>
            <button
              onClick={() => setActiveCurrencyTab('USD')}
              className={`flex-1 py-2 text-center ${activeCurrencyTab === 'USD' ? 'border-b-2 border-blue-600 text-blue-600 font-medium' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <div className="flex items-center justify-center">
                <DollarSign className="w-3 h-3 mr-2" />
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                  {outflows.filter(o => o.currency === 'USD').length}
                </span>
              </div>
            </button>
          </div>
        </div>
        
        {outflows.filter(o => o.currency === activeCurrencyTab).length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Date
                  </th>
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
                  {activeCurrencyTab === 'USD' && (
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Taux
                    </th>
                  )}
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Heure
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {outflows
                  .filter(o => o.currency === activeCurrencyTab)
                  .map((outflow) => (
                  <tr key={outflow.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(outflow.date).toLocaleDateString('fr-FR', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric'
                        })}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-mono text-sm text-gray-900">
                        {outflow.outflow_number}
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
                      <div className="text-sm text-gray-900 max-w-xs">
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
                    {activeCurrencyTab === 'USD' && outflow.currency_rate && (
                      <td className="px-4 py-3">
                        <div className="text-xs text-gray-700">
                          1$ = {outflow.currency_rate.toLocaleString('fr-FR')} FC
                        </div>
                      </td>
                    )}
                    {activeCurrencyTab === 'USD' && !outflow.currency_rate && (
                      <td className="px-4 py-3">
                        <div className="text-xs text-gray-400">-</div>
                      </td>
                    )}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {new Date(outflow.created_at).toLocaleTimeString('fr-FR', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
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
              Aucune sortie en {activeCurrencyTab} pour cette période
            </h4>
            <p className="text-gray-500 text-sm mb-4">
              Enregistrez une sortie de caisse en {activeCurrencyTab}
            </p>
            <button
              onClick={() => {
                setNewOutflow({
                  ...newOutflow,
                  currency: activeCurrencyTab
                })
                setShowOutflowModal(true)
              }}
              className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm"
            >
              <ArrowDownRight className="w-4 h-4 mr-2" />
              Nouvelle sortie en {activeCurrencyTab}
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
                    Date
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-red-600 focus:border-red-600 text-sm"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Montant *
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      step="0.01"
                      min="0"
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
                      Taux: 1$ = {saleConfig.currency_rate?.toLocaleString('fr-FR')} FC
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
                    Motif / Raison *
                  </label>
                  <textarea
                    value={newOutflow.reason}
                    onChange={(e) => setNewOutflow({...newOutflow, reason: e.target.value})}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-red-600 focus:border-red-600 text-sm"
                    placeholder="Décrivez la raison de cette sortie..."
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
                      Enregistrer la sortie
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