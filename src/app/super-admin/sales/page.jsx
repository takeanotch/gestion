

// 'use client'

// import { useState, useEffect } from 'react'
// import { useRouter } from 'next/navigation'
// import { supabase } from '@/lib/supabase'
// import { 
//   ShoppingBag, 
//   Search, 
//   Filter, 
//   Plus,
//   Calendar,
//   User,
//   CreditCard,
//   Eye,
//   Printer,
//   Download,
//   ChevronDown,
//   X,
//   Loader2,
//   CheckCircle,
//   XCircle,
//   AlertCircle,
//   ArrowLeft,
//   Clock
// } from 'lucide-react'

// export default function VentesPage() {
//   const router = useRouter()
//   const [ventes, setVentes] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [filters, setFilters] = useState({
//     search: '',
//     status: 'all',
//     dateRange: 'today'
//   })
//   const [showMobileFilters, setShowMobileFilters] = useState(false)
//   const [stats, setStats] = useState({
//     totalVentes: 0,
//     totalMontant: 0,
//     ventesAujourdhui: 0,
//     montantAujourdhui: 0
//   })

//   useEffect(() => {
//     loadVentes()
//     loadStats()
//   }, [filters])

//   const loadVentes = async () => {
//     setLoading(true)
    
//     let query = supabase
//       .from('sale')
//       .select(`
//         *,
//         client:client(name, phone),
//         user:users(full_name)
//       `)
//       .order('created_at', { ascending: false })

//     if (filters.dateRange === 'today') {
//       const today = new Date()
//       today.setHours(0, 0, 0, 0)
//       query = query.gte('created_at', today.toISOString())
//     } else if (filters.dateRange === 'yesterday') {
//       const yesterday = new Date()
//       yesterday.setDate(yesterday.getDate() - 1)
//       yesterday.setHours(0, 0, 0, 0)
//       const today = new Date()
//       today.setHours(0, 0, 0, 0)
//       query = query.gte('created_at', yesterday.toISOString())
//         .lt('created_at', today.toISOString())
//     } else if (filters.dateRange === 'thisMonth') {
//       const firstDay = new Date()
//       firstDay.setDate(1)
//       firstDay.setHours(0, 0, 0, 0)
//       query = query.gte('created_at', firstDay.toISOString())
//     }

//     if (filters.status !== 'all') {
//       query = query.eq('status', filters.status)
//     }

//     if (filters.search) {
//       query = query.or(`sale_number.ilike.%${filters.search}%,client.name.ilike.%${filters.search}%`)
//     }

//     const { data, error } = await query

//     if (!error && data) {
//       setVentes(data)
//     }
    
//     setLoading(false)
//   }

//   const loadStats = async () => {
//     try {
//       // Total des ventes
//       const { count: totalCount } = await supabase
//         .from('sale')
//         .select('*', { count: 'exact', head: true })
      
//       // Total montant
//       const { data: totalAmountData } = await supabase
//         .from('sale')
//         .select('total')

//       const totalAmount = totalAmountData?.reduce((sum, sale) => sum + (sale.total || 0), 0) || 0

//       // Ventes aujourd'hui
//       const today = new Date()
//       today.setHours(0, 0, 0, 0)
      
//       const { count: todayCount } = await supabase
//         .from('sale')
//         .select('*', { count: 'exact', head: true })
//         .gte('created_at', today.toISOString())

//       // Montant aujourd'hui
//       const { data: todayAmountData } = await supabase
//         .from('sale')
//         .select('total')
//         .gte('created_at', today.toISOString())

//       const todayAmount = todayAmountData?.reduce((sum, sale) => sum + (sale.total || 0), 0) || 0

//       setStats({
//         totalVentes: totalCount || 0,
//         totalMontant: totalAmount,
//         ventesAujourdhui: todayCount || 0,
//         montantAujourdhui: todayAmount
//       })
//     } catch (error) {
//       console.error('Erreur chargement stats:', error)
//     }
//   }

//   const formatCurrency = (amount) => {
//     return new Intl.NumberFormat('fr-FR', {
//       style: 'currency',
//       currency: 'CDF'
//     }).format(amount || 0)
//   }

//   const formatDate = (dateString) => {
//     const date = new Date(dateString)
//     return date.toLocaleDateString('fr-FR', {
//       day: '2-digit',
//       month: '2-digit',
//       year: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     })
//   }

//   const getStatusConfig = (status) => {
//     const configs = {
//       completed: { color: 'bg-green-100 text-green-800', icon: CheckCircle, label: 'Complété' },
//       cancelled: { color: 'bg-red-100 text-red-800', icon: XCircle, label: 'Annulé' },
//       refunded: { color: 'bg-yellow-100 text-yellow-800', icon: AlertCircle, label: 'Remboursé' }
//     }
//     return configs[status] || { color: 'bg-gray-100 text-gray-800', icon: Clock, label: 'En attente' }
//   }

//   const getPaymentMethodIcon = (method) => {
//     const icons = {
//       cash: '💰',
//       card: '💳',
//       mobile: '📱'
//     }
//     return icons[method] || '💸'
//   }

//   const handleResetFilters = () => {
//     setFilters({
//       search: '',
//       status: 'all',
//       dateRange: 'today'
//     })
//   }

//   const activeFilters = Object.values(filters).filter(v => 
//     v !== '' && v !== false && v !== 'all'
//   ).length

//   const handlePrintReceipt = (saleId) => {
//     console.log('Impression reçu pour:', saleId)
//     // Implémenter l'impression
//   }

//   return (
//     <div className="p-4 sm:p-6">
//       {/* Header */}
//       <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
//         <div>
//           <h1 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center">
//             <ShoppingBag className="w-6 h-6 sm:w-7 sm:h-7 mr-3 text-gray-700" />
//             Ventes
//           </h1>
//           <div className="flex flex-wrap gap-3 mt-2">
//             <div className="flex items-center space-x-1 text-sm">
//               <span className="text-gray-500">Total:</span>
//               <span className="font-medium">{stats.totalVentes}</span>
//             </div>
//             <div className="flex items-center space-x-1 text-sm">
//               <span className="text-blue-600">Aujourd'hui:</span>
//               <span className="font-medium">{stats.ventesAujourdhui}</span>
//             </div>
//             <div className="flex items-center space-x-1 text-sm">
//               <span className="text-green-600">CA:</span>
//               <span className="font-medium">{formatCurrency(stats.montantAujourdhui)}</span>
//             </div>
//           </div>
//         </div>
        
//         <button
//           onClick={() => router.push('/super-admin/sales/new')}
//           className="flex items-center justify-center space-x-2 px-4 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition text-sm w-full sm:w-auto"
//         >
//           <Plus className="w-4 h-4" />
//           <span>Nouvelle vente</span>
//         </button>
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
//                 placeholder="Rechercher par N° facture, client..."
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
//               <span>Filtres {activeFilters > 0 && `(${activeFilters})`}</span>
//               <ChevronDown className={`w-4 h-4 transition-transform ${showMobileFilters ? 'rotate-180' : ''}`} />
//             </button>
//           </div>

//           {/* Filtres desktop */}
//           <div className="hidden lg:flex flex-wrap gap-2">
//             {/* Filtre date */}
//             <select
//               value={filters.dateRange}
//               onChange={(e) => setFilters({...filters, dateRange: e.target.value})}
//               className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-gray-900 focus:border-gray-900 bg-white text-sm min-w-[140px]"
//             >
//               <option value="all">Toutes dates</option>
//               <option value="today">Aujourd'hui</option>
//               <option value="yesterday">Hier</option>
//               <option value="thisMonth">Ce mois</option>
//             </select>

//             {/* Filtre statut */}
//             <select
//               value={filters.status}
//               onChange={(e) => setFilters({...filters, status: e.target.value})}
//               className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-gray-900 focus:border-gray-900 bg-white text-sm min-w-[140px]"
//             >
//               <option value="all">Tous statuts</option>
//               <option value="completed">Complétées</option>
//               <option value="cancelled">Annulées</option>
//               <option value="refunded">Remboursées</option>
//             </select>
            
//             {/* Bouton réinitialiser */}
//             {activeFilters > 0 && (
//               <button
//                 onClick={handleResetFilters}
//                 className="px-3 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm"
//               >
//                 Réinitialiser
//               </button>
//             )}
//           </div>
//         </div>

//         {/* Stats */}
//         <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-gray-200">
//           <div className="text-center p-2">
//             <div className="text-lg font-bold text-gray-900">{stats.totalVentes}</div>
//             <div className="text-xs text-gray-500">Total ventes</div>
//           </div>
//           <div className="text-center p-2">
//             <div className="text-lg font-bold text-green-600">{formatCurrency(stats.totalMontant)}</div>
//             <div className="text-xs text-gray-500">Chiffre total</div>
//           </div>
//           <div className="text-center p-2">
//             <div className="text-lg font-bold text-blue-600">{stats.ventesAujourdhui}</div>
//             <div className="text-xs text-gray-500">Aujourd'hui</div>
//           </div>
//           <div className="text-center p-2">
//             <div className="text-lg font-bold text-purple-600">{formatCurrency(stats.montantAujourdhui)}</div>
//             <div className="text-xs text-gray-500">CA aujourd'hui</div>
//           </div>
//         </div>

//         {/* Filtres mobile (dropdown) */}
//         {showMobileFilters && (
//           <div className="lg:hidden mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
//             <div className="space-y-4">
//               {/* Filtre date mobile */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Période
//                 </label>
//                 <select
//                   value={filters.dateRange}
//                   onChange={(e) => setFilters({...filters, dateRange: e.target.value})}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-gray-900 focus:border-gray-900 bg-white text-sm"
//                 >
//                   <option value="all">Toutes dates</option>
//                   <option value="today">Aujourd'hui</option>
//                   <option value="yesterday">Hier</option>
//                   <option value="thisMonth">Ce mois</option>
//                 </select>
//               </div>

//               {/* Filtre statut mobile */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Statut
//                 </label>
//                 <select
//                   value={filters.status}
//                   onChange={(e) => setFilters({...filters, status: e.target.value})}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-gray-900 focus:border-gray-900 bg-white text-sm"
//                 >
//                   <option value="all">Tous statuts</option>
//                   <option value="completed">Complétées</option>
//                   <option value="cancelled">Annulées</option>
//                   <option value="refunded">Remboursées</option>
//                 </select>
//               </div>
              
//               {/* Boutons actions mobile */}
//               <div className="pt-2 border-t border-gray-200">
//                 <div className="flex space-x-2">
//                   <button
//                     onClick={handleResetFilters}
//                     className="flex-1 px-3 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm"
//                   >
//                     Réinitialiser
//                   </button>
//                   <button
//                     onClick={() => setShowMobileFilters(false)}
//                     className="flex-1 px-3 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition text-sm"
//                   >
//                     Appliquer
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
//             <div className="text-gray-500">Chargement des ventes...</div>
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
//                     Facture
//                   </th>
//                   <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Client
//                   </th>
//                   <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Date
//                   </th>
//                   <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Montant
//                   </th>
//                   <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Paiement
//                   </th>
//                   <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Statut
//                   </th>
//                   <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Actions
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-gray-200">
//                 {ventes.map((vente) => {
//                   const statusConfig = getStatusConfig(vente.status)
//                   const Icon = statusConfig.icon
                  
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
//                               {vente.client?.name || 'Client non spécifié'}
//                             </div>
//                             <div className="text-xs text-gray-500">
//                               {vente.client?.phone || 'Pas de téléphone'}
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
//                           {formatCurrency(vente.total)}
//                         </div>
//                       </td>

//                       {/* Paiement */}
//                       <td className="px-4 py-3 whitespace-nowrap">
//                         <div className="flex items-center space-x-2">
//                           <span className="text-lg">{getPaymentMethodIcon(vente.payment_method)}</span>
//                           <span className="text-sm capitalize">{vente.payment_method}</span>
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
//                             onClick={() => router.push(`/ventes/${vente.id}`)}
//                             className="p-1.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition"
//                             title="Voir détails"
//                           >
//                             <Eye className="w-4 h-4" />
//                           </button>
//                           <button
//                             onClick={() => handlePrintReceipt(vente.id)}
//                             className="p-1.5 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded transition"
//                             title="Imprimer"
//                           >
//                             <Printer className="w-4 h-4" />
//                           </button>
//                           <button
//                             className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition"
//                             title="Télécharger"
//                           >
//                             <Download className="w-4 h-4" />
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
//                         <span>{vente.client?.name || 'Client non spécifié'}</span>
//                       </div>
//                     </div>
//                   </div>
                  
//                   <div className="grid grid-cols-2 gap-4 mt-3">
//                     <div>
//                       <div className="text-xs text-gray-500">Date</div>
//                       <div className="text-sm font-medium">
//                         {new Date(vente.created_at).toLocaleDateString('fr-FR')}
//                       </div>
//                     </div>
//                     <div>
//                       <div className="text-xs text-gray-500">Montant</div>
//                       <div className="text-sm font-semibold text-gray-900">
//                         {formatCurrency(vente.total)}
//                       </div>
//                     </div>
//                   </div>
                  
//                   <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-200">
//                     <div className="flex items-center space-x-2">
//                       <span className="text-lg">{getPaymentMethodIcon(vente.payment_method)}</span>
//                       <span className="text-sm capitalize">{vente.payment_method}</span>
//                     </div>
//                     <div className="flex items-center space-x-1">
//                       <button
//                         onClick={() => router.push(`/ventes/${vente.id}`)}
//                         className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
//                       >
//                         <Eye className="w-4 h-4" />
//                       </button>
//                       <button
//                         onClick={() => handlePrintReceipt(vente.id)}
//                         className="p-1.5 text-green-600 hover:bg-green-50 rounded"
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
//               Aucune vente trouvée
//             </h3>
//             <p className="text-gray-500 text-sm mb-4">
//               {activeFilters > 0
//                 ? "Aucune vente ne correspond à vos filtres"
//                 : "Commencez par effectuer votre première vente"
//               }
//             </p>
//             <button
//               onClick={() => router.push('/super-admin/sales/new')}
//               className="inline-flex items-center px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition text-sm"
//             >
//               <Plus className="w-4 h-4 mr-2" />
//               Nouvelle vente
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }
// app/ventes/page.js - Version corrigée
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
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
  ChevronDown
} from 'lucide-react'

export default function VentesPage() {
  const router = useRouter()
  const [ventes, setVentes] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    dateRange: 'all'
  })
  const [showMobileFilters, setShowMobileFilters] = useState(false)
  const [stats, setStats] = useState({
    totalVentes: 0,
    totalMontant: 0,
    ventesAujourdhui: 0,
    montantAujourdhui: 0
  })

  useEffect(() => {
    loadVentes()
    loadStats()
  }, [filters])

  const loadVentes = async () => {
    setLoading(true)
    
    try {
      console.log('Chargement des ventes...')
      
      // ESSAYER CETTE REQUÊTE - Sans la jointure 'users'
      let query = supabase
        .from('sale')
        .select(`
          *,
          client:client(name, phone)
        `)
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

      if (filters.search) {
        // Recherche simple sur le numéro de vente uniquement
        query = query.ilike('sale_number', `%${filters.search}%`)
      }

      const { data, error } = await query

      console.log('Résultat de la requête ventes:', { data, error })

      if (error) {
        console.error('Erreur Supabase:', error)
        
        // ESSAYER UNE REQUÊTE ENCORE PLUS SIMPLE
        console.log('Tentative avec requête simple...')
        const simpleQuery = supabase
          .from('sale')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(50) // Limiter pour tester
        
        const { data: simpleData, error: simpleError } = await simpleQuery
        
        if (simpleError) {
          console.error('Erreur même avec requête simple:', simpleError)
          alert('Erreur de chargement: ' + simpleError.message)
          setVentes([])
        } else {
          console.log('Données récupérées (simple):', simpleData)
          
          // Pour chaque vente, charger le client séparément
          const ventesAvecDetails = await Promise.all(
            simpleData.map(async (vente) => {
              let client = null
              let userInfo = null
              
              // Charger le client
              if (vente.customer_id) {
                const { data: clientData } = await supabase
                  .from('client')
                  .select('name, phone')
                  .eq('id', vente.customer_id)
                  .single()
                client = clientData
              }
              
              // Charger l'utilisateur (vendeur)
              if (vente.user_id) {
                const { data: userData } = await supabase
                  .from('users')
                  .select('full_name')
                  .eq('id', vente.user_id)
                  .single()
                userInfo = userData
              }
              
              return {
                ...vente,
                client,
                user: userInfo
              }
            })
          )
          
          console.log('Ventes avec détails:', ventesAvecDetails)
          setVentes(ventesAvecDetails)
        }
      } else if (data) {
        console.log('Ventes chargées avec jointure client:', data.length)
        
        // Pour chaque vente, charger l'utilisateur séparément
        const ventesAvecUsers = await Promise.all(
          data.map(async (vente) => {
            let userInfo = null
            
            if (vente.user_id) {
              const { data: userData } = await supabase
                .from('users')
                .select('full_name')
                .eq('id', vente.user_id)
                .single()
              userInfo = userData
            }
            
            return {
              ...vente,
              user: userInfo
            }
          })
        )
        
        setVentes(ventesAvecUsers)
      }
      
    } catch (error) {
      console.error('Erreur lors du chargement:', error)
      alert('Erreur: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const loadStats = async () => {
    try {
      console.log('Chargement des statistiques...')
      
      // Total des ventes
      const { count: totalCount } = await supabase
        .from('sale')
        .select('*', { count: 'exact', head: true })
      
      // Total montant
      const { data: totalAmountData } = await supabase
        .from('sale')
        .select('total')

      const totalAmount = totalAmountData?.reduce((sum, sale) => sum + (sale.total || 0), 0) || 0

      // Ventes aujourd'hui
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      
      const { count: todayCount } = await supabase
        .from('sale')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', today.toISOString())

      // Montant aujourd'hui
      const { data: todayAmountData } = await supabase
        .from('sale')
        .select('total')
        .gte('created_at', today.toISOString())

      const todayAmount = todayAmountData?.reduce((sum, sale) => sum + (sale.total || 0), 0) || 0

      setStats({
        totalVentes: totalCount || 0,
        totalMontant: totalAmount,
        ventesAujourdhui: todayCount || 0,
        montantAujourdhui: todayAmount
      })
    } catch (error) {
      console.error('Erreur chargement stats:', error)
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'CDF',
      minimumFractionDigits: 0
    }).format(amount || 0)
  }

  const getStatusConfig = (status) => {
    const configs = {
      completed: { color: 'bg-green-100 text-green-800', icon: CheckCircle, label: 'Complété' },
      cancelled: { color: 'bg-red-100 text-red-800', icon: XCircle, label: 'Annulé' },
      refunded: { color: 'bg-yellow-100 text-yellow-800', icon: AlertCircle, label: 'Remboursé' }
    }
    return configs[status] || { color: 'bg-gray-100 text-gray-800', icon: Clock, label: 'En attente' }
  }

  const getPaymentMethodIcon = (method) => {
    const icons = {
      cash: '💰',
      card: '💳',
      mobile: '📱'
    }
    return icons[method] || '💸'
  }

  const handleResetFilters = () => {
    setFilters({
      search: '',
      status: 'all',
      dateRange: 'all'
    })
  }

  const activeFilters = Object.values(filters).filter(v => 
    v !== '' && v !== false && v !== 'all'
  ).length

  const handlePrintReceipt = (saleId) => {
    console.log('Impression reçu pour:', saleId)
  }

  const handleRefresh = () => {
    loadVentes()
    loadStats()
  }

  // Afficher un message de débogage
  if (ventes.length === 0 && !loading) {
    console.log('Aucune vente à afficher. Vérifiez la base de données.')
  }

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
              <span className="text-green-600">CA:</span>
              <span className="font-medium">{formatCurrency(stats.montantAujourdhui)}</span>
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
            className="flex items-center justify-center space-x-2 px-4 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition text-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Nouvelle vente</span>
          </button>
        </div>
      </div>

      {/* Bloc unifié: Recherche et filtres */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Recherche */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Rechercher par N° facture..."
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
              <span>Filtres {activeFilters > 0 && `(${activeFilters})`}</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${showMobileFilters ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {/* Filtres desktop */}
          <div className="hidden lg:flex flex-wrap gap-2">
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

            <select
              value={filters.status}
              onChange={(e) => setFilters({...filters, status: e.target.value})}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-gray-900 focus:border-gray-900 bg-white text-sm"
            >
              <option value="all">Tous statuts</option>
              <option value="completed">Complétées</option>
              <option value="cancelled">Annulées</option>
              <option value="refunded">Remboursées</option>
            </select>
            
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
          </div>
          <div className="text-center p-2">
            <div className="text-lg font-bold text-green-600">{formatCurrency(stats.totalMontant)}</div>
            <div className="text-xs text-gray-500">Chiffre total</div>
          </div>
          <div className="text-center p-2">
            <div className="text-lg font-bold text-blue-600">{stats.ventesAujourdhui}</div>
            <div className="text-xs text-gray-500">Aujourd'hui</div>
          </div>
          <div className="text-center p-2">
            <div className="text-lg font-bold text-purple-600">{formatCurrency(stats.montantAujourdhui)}</div>
            <div className="text-xs text-gray-500">CA aujourd'hui</div>
          </div>
        </div>

        {/* Filtres mobile */}
        {showMobileFilters && (
          <div className="lg:hidden mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="space-y-4">
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
                  <option value="completed">Complétées</option>
                  <option value="cancelled">Annulées</option>
                  <option value="refunded">Remboursées</option>
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
                    Client
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Montant
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
                  
                  return (
                    <tr key={vente.id} className="hover:bg-gray-50 transition">
                      <td className="px-4 py-3">
                        <div className="font-mono font-semibold text-sm text-blue-600">
                          {vente.sale_number || 'N/A'}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center space-x-2">
                          <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                            <User className="h-4 w-4 text-gray-600" />
                          </div>
                          <div>
                            <div className="font-medium text-sm text-gray-900">
                              {vente.client?.name || 'Non spécifié'}
                            </div>
                            <div className="text-xs text-gray-500">
                              {vente.client?.phone || '-'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {vente.created_at ? new Date(vente.created_at).toLocaleDateString('fr-FR') : 'N/A'}
                        </div>
                        <div className="text-xs text-gray-500">
                          {vente.created_at ? new Date(vente.created_at).toLocaleTimeString('fr-FR') : ''}
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="font-semibold text-gray-900">
                          {formatCurrency(vente.total)}
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">{getPaymentMethodIcon(vente.payment_method)}</span>
                          <span className="text-sm capitalize">{vente.payment_method || 'N/A'}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig.color}`}>
                          <Icon className="w-3 h-3 mr-1" />
                          {statusConfig.label}
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center space-x-1">
                          <button
                            onClick={() => router.push(`/ventes/${vente.id}`)}
                            className="p-1.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handlePrintReceipt(vente.id)}
                            className="p-1.5 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded transition"
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
              
              return (
                <div key={vente.id} className="p-4 hover:bg-gray-50 transition">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="font-mono font-semibold text-blue-600">
                        {vente.sale_number || 'N/A'}
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600 mt-1">
                        <User className="h-3 w-3" />
                        <span>{vente.client?.name || 'Non spécifié'}</span>
                      </div>
                    </div>
                    <div className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${statusConfig.color}`}>
                      <Icon className="w-3 h-3 mr-1" />
                      {statusConfig.label}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mt-3">
                    <div>
                      <div className="text-xs text-gray-500">Date</div>
                      <div className="text-sm font-medium">
                        {vente.created_at ? new Date(vente.created_at).toLocaleDateString('fr-FR') : 'N/A'}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Montant</div>
                      <div className="text-sm font-semibold text-gray-900">
                        {formatCurrency(vente.total)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-200">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{getPaymentMethodIcon(vente.payment_method)}</span>
                      <span className="text-sm capitalize">{vente.payment_method || 'N/A'}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => router.push(`/ventes/${vente.id}`)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                      >
                        <Eye className="w-4 h-4" />
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
                ? "Aucune vente ne correspond à vos filtres"
                : "Commencez par effectuer votre première vente"
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