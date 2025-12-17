
// 'use client'

// import { useState, useEffect } from 'react'
// import { supabase } from '@/lib/supabase'
// import { 
//   Users, 
//   Search, 
//   Filter, 
//   Plus,
//   Eye,
//   ShoppingBag,
//   Phone,
//   Calendar,
//   X,
//   ChevronDown,
//   Mail,
//   MapPin,
//   User,
//   CreditCard,
//   Package,
//   DollarSign,
//   Edit,
//   Trash2,
//   MoreVertical,
//   CheckCircle,
//   XCircle,
//   Clock,
//   Loader2,
//   ChevronLeft,
//   ChevronRight
// } from 'lucide-react'

// export default function ClientsPage() {
//   const [clients, setClients] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [filters, setFilters] = useState({
//     search: '',
//     sortBy: 'recent',
//     hasPurchases: 'all',
//     status: 'all'
//   })
//   const [selectedClient, setSelectedClient] = useState(null)
//   const [clientDetails, setClientDetails] = useState(null)
//   const [clientSales, setClientSales] = useState([])
//   const [loadingDetails, setLoadingDetails] = useState(false)
//   const [showMobileFilters, setShowMobileFilters] = useState(false)
//   const [mobileActionMenu, setMobileActionMenu] = useState(null)
//   const [currentPage, setCurrentPage] = useState(1)
//   const [itemsPerPage] = useState(10)

//   useEffect(() => {
//     loadClients()
//   }, [filters])

//   const loadClients = async () => {
//     setLoading(true)
    
//     try {
//       let query = supabase
//         .from('client')
//         .select('*')

//       if (filters.search) {
//         query = query.or(`name.ilike.%${filters.search}%,client_number.ilike.%${filters.search}%,phone.ilike.%${filters.search}%`)
//       }

//       const { data: clientsData, error } = await query

//       if (error) {
//         console.error('Erreur Supabase:', error)
//         alert('Erreur de chargement: ' + error.message)
//         setClients([])
//         return
//       }

//       // Récupérer les statistiques d'achats pour tous les clients
//       const { data: allPurchases } = await supabase
//         .from('sale')
//         .select('customer_id, total, date_time, status, currency, payment_method')
//         .eq('status', 'completed')
//         .in('customer_id', clientsData.map(c => c.id))

//       // Organiser les achats par client
//       const purchasesByClient = {}
//       allPurchases?.forEach(purchase => {
//         if (!purchasesByClient[purchase.customer_id]) {
//           purchasesByClient[purchase.customer_id] = []
//         }
//         purchasesByClient[purchase.customer_id].push(purchase)
//       })

//       // Calculer les statistiques pour chaque client
//       const clientsWithStats = clientsData.map((client) => {
//         const clientPurchases = purchasesByClient[client.id] || []
//         const purchaseCount = clientPurchases.length
        
//         // Calculer les totaux par devise
//         const totalsByCurrency = {
//           CDF: 0,
//           USD: 0
//         }
        
//         clientPurchases.forEach(purchase => {
//           const currency = purchase.currency || 'CDF'
//           if (totalsByCurrency[currency] !== undefined) {
//             totalsByCurrency[currency] += purchase.total || 0
//           }
//         })
        
//         const totalSpentCDF = totalsByCurrency.CDF
//         const totalSpentUSD = totalsByCurrency.USD
        
//         const lastPurchaseDate = clientPurchases.length > 0 
//           ? clientPurchases.sort((a, b) => new Date(b.date_time) - new Date(a.date_time))[0]?.date_time
//           : null

//         // Déterminer le statut
//         let status = 'new'
//         if (purchaseCount > 0) {
//           if (lastPurchaseDate) {
//             const lastPurchase = new Date(lastPurchaseDate)
//             const now = new Date()
//             const diffDays = Math.floor((now - lastPurchase) / (1000 * 60 * 60 * 24))
            
//             if (diffDays <= 30) {
//               status = 'active'
//             } else if (diffDays <= 90) {
//               status = 'occasional'
//             } else {
//               status = 'inactive'
//             }
//           }
//         }

//         return {
//           ...client,
//           purchaseCount,
//           totalSpentCDF,
//           totalSpentUSD,
//           lastPurchaseDate,
//           status
//         }
//       })

//       // Appliquer les filtres
//       let filteredClients = [...clientsWithStats]

//       if (filters.hasPurchases === 'with') {
//         filteredClients = filteredClients.filter(client => client.purchaseCount > 0)
//       } else if (filters.hasPurchases === 'without') {
//         filteredClients = filteredClients.filter(client => client.purchaseCount === 0)
//       }

//       if (filters.status === 'active') {
//         filteredClients = filteredClients.filter(client => client.status === 'active')
//       } else if (filters.status === 'inactive') {
//         filteredClients = filteredClients.filter(client => client.status === 'inactive')
//       } else if (filters.status === 'occasional') {
//         filteredClients = filteredClients.filter(client => client.status === 'occasional')
//       } else if (filters.status === 'new') {
//         filteredClients = filteredClients.filter(client => client.status === 'new')
//       }

//       // Appliquer le tri
//       if (filters.sortBy === 'purchases') {
//         filteredClients.sort((a, b) => b.purchaseCount - a.purchaseCount)
//       } else if (filters.sortBy === 'spent') {
//         filteredClients.sort((a, b) => (b.totalSpentCDF + b.totalSpentUSD * 2000) - (a.totalSpentCDF + a.totalSpentUSD * 2000))
//       } else if (filters.sortBy === 'recent') {
//         filteredClients.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
//       } else if (filters.sortBy === 'name') {
//         filteredClients.sort((a, b) => a.name.localeCompare(b.name))
//       }

//       setClients(filteredClients)
      
//     } catch (error) {
//       console.error('Erreur lors du chargement:', error)
//       alert('Erreur: ' + error.message)
//     } finally {
//       setLoading(false)
//     }
//   }

//   const loadClientDetails = async (clientId) => {
//     if (!clientId) return
    
//     setLoadingDetails(true)
//     try {
//       const { data: clientData } = await supabase
//         .from('client')
//         .select('*')
//         .eq('id', clientId)
//         .single()

//       const { data: salesData } = await supabase
//         .from('sale')
//         .select(`
//           *,
//           sale_item(*)
//         `)
//         .eq('customer_id', clientId)
//         .order('date_time', { ascending: false })

//       const salesWithCount = salesData?.map(sale => ({
//         ...sale,
//         itemsCount: sale.sale_item?.length || 0
//       })) || []

//       setClientDetails(clientData)
//       setClientSales(salesWithCount)
      
//     } catch (error) {
//       console.error('Erreur chargement détails:', error)
//     } finally {
//       setLoadingDetails(false)
//     }
//   }

//   const handleViewClient = async (client) => {
//     setSelectedClient(client)
//     await loadClientDetails(client.id)
//   }

//   const handleCloseModal = () => {
//     setSelectedClient(null)
//     setClientDetails(null)
//     setClientSales([])
//   }

//   const formatCurrency = (amount, currency = 'CDF') => {
//     const symbols = {
//       'CDF': 'FC',
//       'USD': '$',
//       'EUR': '€'
//     }
    
//     const formattedAmount = new Intl.NumberFormat('fr-FR', {
//       minimumFractionDigits: 0,
//       maximumFractionDigits: 2
//     }).format(amount || 0)
    
//     return `${formattedAmount} ${symbols[currency] || currency}`
//   }

//   const formatDate = (dateString) => {
//     if (!dateString) return 'Jamais'
//     const date = new Date(dateString)
//     return date.toLocaleDateString('fr-FR')
//   }

//   const formatDateTime = (dateString) => {
//     if (!dateString) return 'N/A'
//     const date = new Date(dateString)
//     return `${date.toLocaleDateString('fr-FR')} ${date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`
//   }

//   const handleResetFilters = () => {
//     setFilters({
//       search: '',
//       sortBy: 'recent',
//       hasPurchases: 'all',
//       status: 'all'
//     })
//   }

//   const getStatusConfig = (status) => {
//     const configs = {
//       'active': { label: 'Actif', color: 'bg-green-100 text-green-800', icon: CheckCircle },
//       'inactive': { label: 'Inactif', color: 'bg-red-100 text-red-800', icon: XCircle },
//       'occasional': { label: 'Occasionnel', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
//       'new': { label: 'Nouveau', color: 'bg-blue-100 text-blue-800', icon: User }
//     }
//     return configs[status] || { label: 'Nouveau', color: 'bg-blue-100 text-blue-800', icon: User }
//   }

//   const getPaymentMethodIcon = (method) => {
//     const icons = {
//       'cash': '💵',
//       'card': '💳',
//       'mobile': '📱'
//     }
//     return icons[method] || '💸'
//   }

//   const getStatusSaleConfig = (status) => {
//     const configs = {
//       'completed': { color: 'bg-green-100 text-green-800', label: 'Complété' },
//       'cancelled': { color: 'bg-red-100 text-red-800', label: 'Annulé' },
//       'refunded': { color: 'bg-yellow-100 text-yellow-800', label: 'Remboursé' }
//     }
//     return configs[status] || { color: 'bg-gray-100 text-gray-800', label: 'En attente' }
//   }

//   const getPaymentStatusConfig = (status) => {
//     const configs = {
//       'paid': { color: 'bg-green-100 text-green-800', label: 'Payé' },
//       'pending': { color: 'bg-yellow-100 text-yellow-800', label: 'En attente' },
//       'partially_paid': { color: 'bg-blue-100 text-blue-800', label: 'Partiellement' }
//     }
//     return configs[status] || { color: 'bg-gray-100 text-gray-800', label: 'Non spécifié' }
//   }

//   // Pagination
//   const indexOfLastItem = currentPage * itemsPerPage
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage
//   const currentClients = clients.slice(indexOfFirstItem, indexOfLastItem)
//   const totalPages = Math.ceil(clients.length / itemsPerPage)

//   const activeFilters = Object.values(filters).filter(v => 
//     v !== '' && v !== false && v !== 'all'
//   ).length

//   const handleDeleteClient = async (clientId) => {
//     if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce client ?')) {
//       return
//     }
    
//     try {
//       // Vérifier si le client a des ventes
//       const { data: sales } = await supabase
//         .from('sale')
//         .select('id')
//         .eq('customer_id', clientId)
//         .limit(1)

//       if (sales && sales.length > 0) {
//         alert('Impossible de supprimer ce client car il a des ventes associées.')
//         return
//       }

//       const { error } = await supabase
//         .from('client')
//         .delete()
//         .eq('id', clientId)

//       if (error) throw error

//       alert('Client supprimé avec succès')
//       loadClients()
      
//     } catch (error) {
//       console.error('Erreur suppression:', error)
//       alert('Erreur lors de la suppression: ' + error.message)
//     }
//   }

//   const truncateText = (text, maxLength) => {
//     if (!text) return ''
//     return text.length > maxLength ? text.substring(0, maxLength) + '...' : text
//   }

//   return (
//     <div className="p-4 sm:p-6">
//       {/* Header */}
//       <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
//         <div>
//           <h1 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center">
//             <Users className="w-6 h-6 sm:w-7 sm:h-7 mr-3 text-gray-700" />
//             Clients
//           </h1>
//           <p className="text-gray-500 text-sm mt-1">
//             {clients.length} client{clients.length > 1 ? 's' : ''} au total
//           </p>
//         </div>
        
//         <div className="flex items-center space-x-2">
//           <button
//             onClick={loadClients}
//             className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm"
//           >
//             Actualiser
//           </button>
//           <button
//             onClick={() => {/* TODO: Implémenter ajout client */}}
//             className="flex items-center justify-center space-x-2 px-4 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition text-sm"
//           >
//             <Plus className="w-4 h-4" />
//             <span>Nouveau client</span>
//           </button>
//         </div>
//       </div>

//       {/* Barre de recherche et filtres */}
//       <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
//         <div className="flex flex-col lg:flex-row gap-4">
//           {/* Recherche */}
//           <div className="flex-1">
//             <div className="relative">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
//               <input
//                 type="text"
//                 placeholder="Rechercher par nom, téléphone ou N° client..."
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
//             <select
//               value={filters.sortBy}
//               onChange={(e) => setFilters({...filters, sortBy: e.target.value})}
//               className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-gray-900 focus:border-gray-900 bg-white text-sm"
//             >
//               <option value="recent">Plus récent</option>
//               <option value="name">Nom (A-Z)</option>
//               <option value="purchases">Plus d'achats</option>
//               <option value="spent">Plus dépensier</option>
//             </select>

//             <select
//               value={filters.hasPurchases}
//               onChange={(e) => setFilters({...filters, hasPurchases: e.target.value})}
//               className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-gray-900 focus:border-gray-900 bg-white text-sm"
//             >
//               <option value="all">Tous les clients</option>
//               <option value="with">Avec achats</option>
//               <option value="without">Sans achats</option>
//             </select>

//             <select
//               value={filters.status}
//               onChange={(e) => setFilters({...filters, status: e.target.value})}
//               className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-gray-900 focus:border-gray-900 bg-white text-sm"
//             >
//               <option value="all">Tous les statuts</option>
//               <option value="active">Actif</option>
//               <option value="inactive">Inactif</option>
//               <option value="occasional">Occasionnel</option>
//               <option value="new">Nouveau</option>
//             </select>
            
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

//         {/* Filtres mobile */}
//         {showMobileFilters && (
//           <div className="lg:hidden mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
//             <div className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Trier par
//                 </label>
//                 <select
//                   value={filters.sortBy}
//                   onChange={(e) => setFilters({...filters, sortBy: e.target.value})}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-gray-900 focus:border-gray-900 bg-white text-sm"
//                 >
//                   <option value="recent">Plus récent</option>
//                   <option value="name">Nom (A-Z)</option>
//                   <option value="purchases">Plus d'achats</option>
//                   <option value="spent">Plus dépensier</option>
//                 </select>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Filtre achats
//                 </label>
//                 <select
//                   value={filters.hasPurchases}
//                   onChange={(e) => setFilters({...filters, hasPurchases: e.target.value})}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-gray-900 focus:border-gray-900 bg-white text-sm"
//                 >
//                   <option value="all">Tous les clients</option>
//                   <option value="with">Avec achats</option>
//                   <option value="without">Sans achats</option>
//                 </select>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Statut
//                 </label>
//                 <select
//                   value={filters.status}
//                   onChange={(e) => setFilters({...filters, status: e.target.value})}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-gray-900 focus:border-gray-900 bg-white text-sm"
//                 >
//                   <option value="all">Tous les statuts</option>
//                   <option value="active">Actif</option>
//                   <option value="inactive">Inactif</option>
//                   <option value="occasional">Occasionnel</option>
//                   <option value="new">Nouveau</option>
//                 </select>
//               </div>
              
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

//       {/* Liste des clients - Vue desktop */}
//       <div className="hidden md:block overflow-x-auto bg-white rounded-lg border border-gray-200">
//         {loading ? (
//           <div className="p-8">
//             <div className="flex flex-col items-center justify-center space-y-4">
//               <Loader2 className="w-8 h-8 animate-spin text-gray-600" />
//               <div className="text-gray-500">Chargement des clients...</div>
//             </div>
//           </div>
//         ) : currentClients.length > 0 ? (
//           <>
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Client
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Téléphone
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Achats
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Total dépensé
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Dernier achat
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Statut
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Actions
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-gray-200">
//                 {currentClients.map((client) => {
//                   const statusConfig = getStatusConfig(client.status)
//                   const Icon = statusConfig.icon
                  
//                   return (
//                     <tr key={client.id} className="hover:bg-gray-50 transition">
//                       {/* Client */}
//                       <td className="px-6 py-4">
//                         <div className="flex items-center space-x-3">
//                           <div className="h-10 w-10 flex-shrink-0 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 flex items-center justify-center">
//                             <span className="text-blue-600 font-semibold text-sm">
//                               {client.name?.charAt(0).toUpperCase()}
//                             </span>
//                           </div>
//                           <div>
//                             <div className="font-medium text-gray-900">
//                               {truncateText(client.name, 20)}
//                             </div>
//                             <div className="text-xs text-gray-500">
//                               #{client.client_number}
//                             </div>
//                           </div>
//                         </div>
//                       </td>

//                       {/* Téléphone */}
//                       <td className="px-6 py-4">
//                         <div className="flex items-center space-x-2">
//                           <Phone className="w-4 h-4 text-gray-400" />
//                           <span className="text-gray-700 text-sm">
//                             {client.phone || 'Non spécifié'}
//                           </span>
//                         </div>
//                       </td>

//                       {/* Achats */}
//                       <td className="px-6 py-4">
//                         <div className="flex items-center space-x-2">
//                           <ShoppingBag className="w-4 h-4 text-gray-400" />
//                           <span className="font-medium text-gray-900">
//                             {client.purchaseCount}
//                           </span>
//                           <span className="text-sm text-gray-500">achats</span>
//                         </div>
//                       </td>

//                       {/* Total dépensé */}
//                       <td className="px-6 py-4">
//                         <div className="space-y-1">
//                           {client.totalSpentCDF > 0 && (
//                             <div className="font-medium text-gray-900">
//                               {formatCurrency(client.totalSpentCDF, 'CDF')}
//                             </div>
//                           )}
//                           {client.totalSpentUSD > 0 && (
//                             <div className="font-medium text-gray-900">
//                               {formatCurrency(client.totalSpentUSD, 'USD')}
//                             </div>
//                           )}
//                           {client.totalSpentCDF === 0 && client.totalSpentUSD === 0 && (
//                             <div className="text-sm text-gray-500">Aucun achat</div>
//                           )}
//                         </div>
//                       </td>

//                       {/* Dernier achat */}
//                       <td className="px-6 py-4">
//                         <div className="flex items-center space-x-2">
//                           <Calendar className="w-4 h-4 text-gray-400" />
//                           <span className="text-sm text-gray-700">
//                             {client.lastPurchaseDate ? formatDate(client.lastPurchaseDate) : 'Jamais'}
//                           </span>
//                         </div>
//                       </td>

//                       {/* Statut */}
//                       <td className="px-6 py-4">
//                         <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig.color}`}>
//                           <Icon className="w-3 h-3 mr-1" />
//                           {statusConfig.label}
//                         </span>
//                       </td>

//                       {/* Actions */}
//                       <td className="px-6 py-4">
//                         <div className="flex items-center space-x-2">
//                           <button
//                             onClick={() => handleViewClient(client)}
//                             className="p-1.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition"
//                             title="Voir détails"
//                           >
//                             <Eye className="w-4 h-4" />
//                           </button>
//                           <button
//                             onClick={() => {/* TODO: Implémenter édition */}}
//                             className="p-1.5 text-gray-600 hover:text-yellow-600 hover:bg-yellow-50 rounded transition"
//                             title="Éditer"
//                           >
//                             <Edit className="w-4 h-4" />
//                           </button>
//                           <button
//                             onClick={() => handleDeleteClient(client.id)}
//                             className="p-1.5 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded transition"
//                             title="Supprimer"
//                           >
//                             <Trash2 className="w-4 h-4" />
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   )
//                 })}
//               </tbody>
//             </table>

//             {/* Pagination */}
//             {totalPages > 1 && (
//               <div className="px-6 py-4 border-t border-gray-200">
//                 <div className="flex items-center justify-between">
//                   <div className="text-sm text-gray-700">
//                     Affichage de <span className="font-medium">{indexOfFirstItem + 1}</span> à{' '}
//                     <span className="font-medium">{Math.min(indexOfLastItem, clients.length)}</span> sur{' '}
//                     <span className="font-medium">{clients.length}</span> clients
//                   </div>
//                   <div className="flex items-center space-x-2">
//                     <button
//                       onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
//                       disabled={currentPage === 1}
//                       className="p-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
//                     >
//                       <ChevronLeft className="w-4 h-4" />
//                     </button>
//                     <span className="text-sm text-gray-700">
//                       Page {currentPage} sur {totalPages}
//                     </span>
//                     <button
//                       onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
//                       disabled={currentPage === totalPages}
//                       className="p-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
//                     >
//                       <ChevronRight className="w-4 h-4" />
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </>
//         ) : (
//           <div className="p-8">
//             <div className="text-center">
//               <Users className="w-12 h-12 text-gray-400 mx-auto mb-3" />
//               <h3 className="text-lg font-medium text-gray-900 mb-1">
//                 {activeFilters > 0 ? 'Aucun client trouvé' : 'Aucun client'}
//               </h3>
//               <p className="text-gray-500 text-sm mb-4">
//                 {activeFilters > 0
//                   ? "Aucun client ne correspond à vos filtres"
//                   : "Commencez par ajouter votre premier client"
//                 }
//               </p>
//               <div className="flex flex-col sm:flex-row gap-3 justify-center">
//                 <button
//                   onClick={() => {/* TODO: Implémenter ajout client */}}
//                   className="inline-flex items-center justify-center px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition text-sm"
//                 >
//                   <Plus className="w-4 h-4 mr-2" />
//                   Ajouter un client
//                 </button>
//                 {activeFilters > 0 && (
//                   <button
//                     onClick={handleResetFilters}
//                     className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition text-sm"
//                   >
//                     Réinitialiser les filtres
//                   </button>
//                 )}
//               </div>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Liste des clients - Vue mobile */}
//       <div className="md:hidden">
//         {loading ? (
//           <div className="bg-white rounded-lg border border-gray-200 p-8">
//             <div className="flex flex-col items-center justify-center space-y-4">
//               <Loader2 className="w-8 h-8 animate-spin text-gray-600" />
//               <div className="text-gray-500">Chargement des clients...</div>
//             </div>
//           </div>
//         ) : currentClients.length > 0 ? (
//           <div className="space-y-3">
//             {currentClients.map((client) => {
//               const statusConfig = getStatusConfig(client.status)
//               const Icon = statusConfig.icon
              
//               return (
//                 <div key={client.id} className="bg-white rounded-lg border border-gray-200 p-4">
//                   <div className="flex items-start justify-between">
//                     {/* Informations client */}
//                     <div className="flex-1">
//                       <div className="flex items-start space-x-3">
//                         <div className="h-10 w-10 flex-shrink-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
//                           <span className="text-white font-semibold text-sm">
//                             {client.name?.charAt(0).toUpperCase()}
//                           </span>
//                         </div>
//                         <div className="flex-1 min-w-0">
//                           <div className="flex items-center justify-between">
//                             <h3 className="font-medium text-gray-900 truncate">
//                               {truncateText(client.name, 20)}
//                             </h3>
//                             <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${statusConfig.color} ml-2`}>
//                               <Icon className="w-3 h-3 mr-1" />
//                               {statusConfig.label}
//                             </span>
//                           </div>
//                           <div className="text-xs text-gray-500 mt-0.5">
//                             #{client.client_number}
//                           </div>
//                         </div>
//                       </div>

//                       {/* Détails */}
//                       <div className="mt-4 grid grid-cols-2 gap-4">
//                         <div>
//                           <div className="text-xs text-gray-500">Téléphone</div>
//                           <div className="flex items-center space-x-1 mt-1">
//                             <Phone className="w-3 h-3 text-gray-400" />
//                             <span className="text-sm text-gray-700">
//                               {client.phone || 'Non spécifié'}
//                             </span>
//                           </div>
//                         </div>
//                         <div>
//                           <div className="text-xs text-gray-500">Achats</div>
//                           <div className="flex items-center space-x-1 mt-1">
//                             <ShoppingBag className="w-3 h-3 text-gray-400" />
//                             <span className="text-sm font-medium text-gray-900">
//                               {client.purchaseCount}
//                             </span>
//                           </div>
//                         </div>
//                       </div>

//                       {/* Total dépensé */}
//                       <div className="mt-3">
//                         <div className="text-xs text-gray-500 mb-1">Total dépensé</div>
//                         <div className="space-y-1">
//                           {client.totalSpentCDF > 0 && (
//                             <div className="font-medium text-sm text-gray-900">
//                               {formatCurrency(client.totalSpentCDF, 'CDF')}
//                             </div>
//                           )}
//                           {client.totalSpentUSD > 0 && (
//                             <div className="font-medium text-sm text-gray-900">
//                               {formatCurrency(client.totalSpentUSD, 'USD')}
//                             </div>
//                           )}
//                           {client.totalSpentCDF === 0 && client.totalSpentUSD === 0 && (
//                             <div className="text-xs text-gray-500">Aucun achat</div>
//                           )}
//                         </div>
//                       </div>

//                       {/* Dernier achat */}
//                       {client.lastPurchaseDate && (
//                         <div className="mt-3 flex items-center space-x-2">
//                           <Calendar className="w-3 h-3 text-gray-400" />
//                           <span className="text-xs text-gray-600">
//                             Dernier achat: {formatDate(client.lastPurchaseDate)}
//                           </span>
//                         </div>
//                       )}
//                     </div>

//                     {/* Actions mobile */}
//                     <div className="relative ml-2">
//                       <button
//                         onClick={() => setMobileActionMenu(mobileActionMenu === client.id ? null : client.id)}
//                         className="p-1 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition"
//                       >
//                         <MoreVertical className="w-5 h-5" />
//                       </button>
                      
//                       {mobileActionMenu === client.id && (
//                         <div className="absolute right-0 top-full mt-1 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
//                           <button
//                             onClick={() => {
//                               handleViewClient(client)
//                               setMobileActionMenu(null)
//                             }}
//                             className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
//                           >
//                             <Eye className="w-3 h-3" />
//                             <span>Voir détails</span>
//                           </button>
//                           <button
//                             onClick={() => {
//                               // TODO: Implémenter édition
//                               setMobileActionMenu(null)
//                             }}
//                             className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
//                           >
//                             <Edit className="w-3 h-3" />
//                             <span>Éditer</span>
//                           </button>
//                           <button
//                             onClick={() => {
//                               handleDeleteClient(client.id)
//                               setMobileActionMenu(null)
//                             }}
//                             className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50"
//                           >
//                             <Trash2 className="w-3 h-3" />
//                             <span>Supprimer</span>
//                           </button>
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               )
//             })}

//             {/* Pagination mobile */}
//             {totalPages > 1 && (
//               <div className="bg-white rounded-lg border border-gray-200 p-4">
//                 <div className="flex items-center justify-between">
//                   <button
//                     onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
//                     disabled={currentPage === 1}
//                     className="px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
//                   >
//                     <ChevronLeft className="w-4 h-4" />
//                   </button>
//                   <span className="text-sm text-gray-700">
//                     Page {currentPage} sur {totalPages}
//                   </span>
//                   <button
//                     onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
//                     disabled={currentPage === totalPages}
//                     className="px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
//                   >
//                     <ChevronRight className="w-4 h-4" />
//                   </button>
//                 </div>
//               </div>
//             )}
//           </div>
//         ) : (
//           <div className="bg-white rounded-lg border border-gray-200 p-8">
//             <div className="text-center">
//               <Users className="w-12 h-12 text-gray-400 mx-auto mb-3" />
//               <h3 className="text-lg font-medium text-gray-900 mb-1">
//                 {activeFilters > 0 ? 'Aucun client trouvé' : 'Aucun client'}
//               </h3>
//               <p className="text-gray-500 text-sm mb-4">
//                 {activeFilters > 0
//                   ? "Aucun client ne correspond à vos filtres"
//                   : "Commencez par ajouter votre premier client"
//                 }
//               </p>
//               <div className="flex flex-col sm:flex-row gap-3 justify-center">
//                 <button
//                   onClick={() => {/* TODO: Implémenter ajout client */}}
//                   className="inline-flex items-center justify-center px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition text-sm"
//                 >
//                   <Plus className="w-4 h-4 mr-2" />
//                   Ajouter un client
//                 </button>
//                 {activeFilters > 0 && (
//                   <button
//                     onClick={handleResetFilters}
//                     className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition text-sm"
//                   >
//                     Réinitialiser les filtres
//                   </button>
//                 )}
//               </div>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Modal Détails Client */}
//       {selectedClient && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//           <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
//             {/* Header du modal */}
//             <div className="p-6 border-b border-gray-200">
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center space-x-3">
//                   <div className="h-14 w-14 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
//                     <span className="text-white font-bold text-xl">
//                       {selectedClient.name?.charAt(0).toUpperCase()}
//                     </span>
//                   </div>
//                   <div>
//                     <h2 className="text-xl font-bold text-gray-900">
//                       {selectedClient.name}
//                     </h2>
//                     <p className="text-gray-500 text-sm">
//                       #{selectedClient.client_number}
//                     </p>
//                   </div>
//                 </div>
//                 <button
//                   onClick={handleCloseModal}
//                   className="p-2 hover:bg-gray-100 rounded-lg transition"
//                 >
//                   <X className="w-5 h-5" />
//                 </button>
//               </div>
//             </div>

//             {loadingDetails ? (
//               <div className="p-8">
//                 <div className="flex flex-col items-center justify-center space-y-4">
//                   <Loader2 className="w-8 h-8 animate-spin text-gray-600" />
//                   <div className="text-gray-500">Chargement des détails...</div>
//                 </div>
//               </div>
//             ) : (
//               <div className="overflow-y-auto max-h-[calc(90vh-200px)]">
//                 {/* Informations du client */}
//                 <div className="p-6">
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
//                     <div className="space-y-4">
//                       <h3 className="font-semibold text-gray-900 flex items-center">
//                         <User className="w-5 h-5 mr-2" />
//                         Informations personnelles
//                       </h3>
//                       <div className="space-y-3">
//                         <div className="flex items-center space-x-2">
//                           <Phone className="w-4 h-4 text-gray-400" />
//                           <span className="text-gray-700">{selectedClient.phone || 'Non spécifié'}</span>
//                         </div>
//                         <div className="flex items-center space-x-2">
//                           <Calendar className="w-4 h-4 text-gray-400" />
//                           <span className="text-gray-700">
//                             Inscrit le {formatDate(selectedClient.created_at)}
//                           </span>
//                         </div>
//                       </div>
//                     </div>
                    
//                     <div className="space-y-4">
//                       <h3 className="font-semibold text-gray-900 flex items-center">
//                         <DollarSign className="w-5 h-5 mr-2" />
//                         Statistiques d'achats
//                       </h3>
//                       <div className="grid grid-cols-2 gap-4">
//                         <div className="bg-blue-50 p-4 rounded-lg">
//                           <div className="text-center">
//                             <div className="text-2xl font-bold text-blue-600 mb-1">
//                               {selectedClient.purchaseCount}
//                             </div>
//                             <div className="text-sm text-gray-600">Total achats</div>
//                           </div>
//                         </div>
//                         <div className="bg-green-50 p-4 rounded-lg">
//                           <div className="text-center">
//                             <div className="text-2xl font-bold text-green-600 mb-1">
//                               {selectedClient.totalSpentCDF > 0 && (
//                                 <div>{formatCurrency(selectedClient.totalSpentCDF, 'CDF')}</div>
//                               )}
//                               {selectedClient.totalSpentUSD > 0 && (
//                                 <div>{formatCurrency(selectedClient.totalSpentUSD, 'USD')}</div>
//                               )}
//                               {selectedClient.totalSpentCDF === 0 && selectedClient.totalSpentUSD === 0 && (
//                                 <div className="text-sm text-gray-500">Aucun achat</div>
//                               )}
//                             </div>
//                             <div className="text-sm text-gray-600">Total dépensé</div>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Historique des ventes */}
//                   <div>
//                     <div className="flex items-center justify-between mb-4">
//                       <h3 className="font-semibold text-gray-900 flex items-center">
//                         <ShoppingBag className="w-5 h-5 mr-2" />
//                         Historique des achats
//                       </h3>
//                       <span className="text-sm text-gray-500">
//                         {clientSales.length} vente{clientSales.length > 1 ? 's' : ''}
//                       </span>
//                     </div>
                    
//                     {clientSales.length > 0 ? (
//                       <div className="space-y-3">
//                         {clientSales.map((sale) => {
//                           const statusConfig = getStatusSaleConfig(sale.status)
//                           const paymentConfig = getPaymentStatusConfig(sale.payment_status)
                          
//                           return (
//                             <div key={sale.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition">
//                               <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-2">
//                                 <div className="flex-1">
//                                   <div className="font-semibold text-gray-900">
//                                     {sale.sale_number || 'N/A'}
//                                   </div>
//                                   <div className="text-sm text-gray-500">
//                                     {formatDateTime(sale.date_time)}
//                                   </div>
//                                 </div>
//                                 <div className="flex items-center space-x-3">
//                                   <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig.color}`}>
//                                     {statusConfig.label}
//                                   </span>
//                                   <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${paymentConfig.color}`}>
//                                     {paymentConfig.label}
//                                   </span>
//                                   <span className="text-lg" title={sale.payment_method}>
//                                     {getPaymentMethodIcon(sale.payment_method)}
//                                   </span>
//                                 </div>
//                               </div>
                              
//                               <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
//                                 <div className="flex items-center space-x-4">
//                                   <div className="flex items-center space-x-2">
//                                     <Package className="w-4 h-4 text-gray-400" />
//                                     <span className="text-sm text-gray-600">
//                                       {sale.itemsCount || 0} article{sale.itemsCount > 1 ? 's' : ''}
//                                     </span>
//                                   </div>
//                                   <div className="flex items-center space-x-2">
//                                     <CreditCard className="w-4 h-4 text-gray-400" />
//                                     <span className="text-sm text-gray-600 capitalize">
//                                       {sale.payment_method || 'N/A'}
//                                     </span>
//                                   </div>
//                                   <div className="text-sm text-gray-500">
//                                     {sale.currency || 'CDF'}
//                                   </div>
//                                 </div>
//                                 <div className="font-bold text-lg text-gray-900">
//                                   {formatCurrency(sale.total, sale.currency)}
//                                 </div>
//                               </div>
//                             </div>
//                           )
//                         })}
//                       </div>
//                     ) : (
//                       <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-lg">
//                         <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-3" />
//                         <p className="text-gray-500">
//                           Aucun achat enregistré pour ce client
//                         </p>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* Footer du modal */}
//             <div className="p-6 border-t border-gray-200 bg-gray-50">
//               <div className="flex justify-end space-x-3">
//                 <button
//                   onClick={handleCloseModal}
//                   className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition"
//                 >
//                   Fermer
//                 </button>
//                 <button
//                   onClick={() => {
//                     // TODO: Implémenter édition client
//                     console.log('Éditer client:', selectedClient.id)
//                   }}
//                   className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center space-x-2"
//                 >
//                   <Edit className="w-4 h-4" />
//                   <span>Modifier</span>
//                 </button>
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
import { useLanguage } from '@/contexts/LanguageContext'
import { 
  Users, 
  Search, 
  Filter, 
  Plus,
  Eye,
  ShoppingBag,
  Phone,
  Calendar,
  X,
  ChevronDown,
  Mail,
  MapPin,
  User,
  CreditCard,
  Package,
  DollarSign,
  Edit,
  Trash2,
  MoreVertical,
  CheckCircle,
  XCircle,
  Clock,
  Loader2,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'

export default function ClientsPage() {
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    search: '',
    sortBy: 'recent',
    hasPurchases: 'all',
    status: 'all'
  })
  const [selectedClient, setSelectedClient] = useState(null)
  const [clientDetails, setClientDetails] = useState(null)
  const [clientSales, setClientSales] = useState([])
  const [loadingDetails, setLoadingDetails] = useState(false)
  const [showMobileFilters, setShowMobileFilters] = useState(false)
  const [mobileActionMenu, setMobileActionMenu] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  
  const { t, language } = useLanguage()

  useEffect(() => {
    loadClients()
  }, [filters])

  const loadClients = async () => {
    setLoading(true)
    
    try {
      let query = supabase
        .from('client')
        .select('*')

      if (filters.search) {
        query = query.or(`name.ilike.%${filters.search}%,client_number.ilike.%${filters.search}%,phone.ilike.%${filters.search}%`)
      }

      const { data: clientsData, error } = await query

      if (error) {
        console.error(language === 'fr' ? 'Erreur Supabase:' : 'Supabase Error:', error)
        alert(t('loadError') + error.message)
        setClients([])
        return
      }

      // Récupérer les statistiques d'achats pour tous les clients
      const { data: allPurchases } = await supabase
        .from('sale')
        .select('customer_id, total, date_time, status, currency, payment_method')
        .eq('status', 'completed')
        .in('customer_id', clientsData.map(c => c.id))

      // Organiser les achats par client
      const purchasesByClient = {}
      allPurchases?.forEach(purchase => {
        if (!purchasesByClient[purchase.customer_id]) {
          purchasesByClient[purchase.customer_id] = []
        }
        purchasesByClient[purchase.customer_id].push(purchase)
      })

      // Calculer les statistiques pour chaque client
      const clientsWithStats = clientsData.map((client) => {
        const clientPurchases = purchasesByClient[client.id] || []
        const purchaseCount = clientPurchases.length
        
        // Calculer les totaux par devise
        const totalsByCurrency = {
          CDF: 0,
          USD: 0
        }
        
        clientPurchases.forEach(purchase => {
          const currency = purchase.currency || 'CDF'
          if (totalsByCurrency[currency] !== undefined) {
            totalsByCurrency[currency] += purchase.total || 0
          }
        })
        
        const totalSpentCDF = totalsByCurrency.CDF
        const totalSpentUSD = totalsByCurrency.USD
        
        const lastPurchaseDate = clientPurchases.length > 0 
          ? clientPurchases.sort((a, b) => new Date(b.date_time) - new Date(a.date_time))[0]?.date_time
          : null

        // Déterminer le statut
        let status = 'new'
        if (purchaseCount > 0) {
          if (lastPurchaseDate) {
            const lastPurchase = new Date(lastPurchaseDate)
            const now = new Date()
            const diffDays = Math.floor((now - lastPurchase) / (1000 * 60 * 60 * 24))
            
            if (diffDays <= 30) {
              status = 'active'
            } else if (diffDays <= 90) {
              status = 'occasional'
            } else {
              status = 'inactive'
            }
          }
        }

        return {
          ...client,
          purchaseCount,
          totalSpentCDF,
          totalSpentUSD,
          lastPurchaseDate,
          status
        }
      })

      // Appliquer les filtres
      let filteredClients = [...clientsWithStats]

      if (filters.hasPurchases === 'with') {
        filteredClients = filteredClients.filter(client => client.purchaseCount > 0)
      } else if (filters.hasPurchases === 'without') {
        filteredClients = filteredClients.filter(client => client.purchaseCount === 0)
      }

      if (filters.status === 'active') {
        filteredClients = filteredClients.filter(client => client.status === 'active')
      } else if (filters.status === 'inactive') {
        filteredClients = filteredClients.filter(client => client.status === 'inactive')
      } else if (filters.status === 'occasional') {
        filteredClients = filteredClients.filter(client => client.status === 'occasional')
      } else if (filters.status === 'new') {
        filteredClients = filteredClients.filter(client => client.status === 'new')
      }

      // Appliquer le tri
      if (filters.sortBy === 'purchases') {
        filteredClients.sort((a, b) => b.purchaseCount - a.purchaseCount)
      } else if (filters.sortBy === 'spent') {
        filteredClients.sort((a, b) => (b.totalSpentCDF + b.totalSpentUSD * 2000) - (a.totalSpentCDF + a.totalSpentUSD * 2000))
      } else if (filters.sortBy === 'recent') {
        filteredClients.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      } else if (filters.sortBy === 'name') {
        filteredClients.sort((a, b) => a.name.localeCompare(b.name))
      }

      setClients(filteredClients)
      
    } catch (error) {
      console.error(language === 'fr' ? 'Erreur lors du chargement:' : 'Loading error:', error)
      alert(t('error') + error.message)
    } finally {
      setLoading(false)
    }
  }

  const loadClientDetails = async (clientId) => {
    if (!clientId) return
    
    setLoadingDetails(true)
    try {
      const { data: clientData } = await supabase
        .from('client')
        .select('*')
        .eq('id', clientId)
        .single()

      const { data: salesData } = await supabase
        .from('sale')
        .select(`
          *,
          sale_item(*)
        `)
        .eq('customer_id', clientId)
        .order('date_time', { ascending: false })

      const salesWithCount = salesData?.map(sale => ({
        ...sale,
        itemsCount: sale.sale_item?.length || 0
      })) || []

      setClientDetails(clientData)
      setClientSales(salesWithCount)
      
    } catch (error) {
      console.error(language === 'fr' ? 'Erreur chargement détails:' : 'Error loading details:', error)
    } finally {
      setLoadingDetails(false)
    }
  }

  const handleViewClient = async (client) => {
    setSelectedClient(client)
    await loadClientDetails(client.id)
  }

  const handleCloseModal = () => {
    setSelectedClient(null)
    setClientDetails(null)
    setClientSales([])
  }

  const formatCurrency = (amount, currency = 'CDF') => {
    const symbols = {
      'CDF': 'FC',
      'USD': '$',
      'EUR': '€'
    }
    
    const formattedAmount = new Intl.NumberFormat(language === 'fr' ? 'fr-FR' : 'en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(amount || 0)
    
    return `${formattedAmount} ${symbols[currency] || currency}`
  }

  const formatDate = (dateString) => {
    if (!dateString) return t('never')
    const date = new Date(dateString)
    return date.toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-GB')
  }

  const formatDateTime = (dateString) => {
    if (!dateString) return t('notApplicable')
    const date = new Date(dateString)
    const dateFormat = language === 'fr' ? 'fr-FR' : 'en-GB'
    return `${date.toLocaleDateString(dateFormat)} ${date.toLocaleTimeString(dateFormat, { hour: '2-digit', minute: '2-digit' })}`
  }

  const handleResetFilters = () => {
    setFilters({
      search: '',
      sortBy: 'recent',
      hasPurchases: 'all',
      status: 'all'
    })
  }

  const getStatusConfig = (status) => {
    const configs = {
      'active': { label: t('statusActive'), color: 'bg-green-100 text-green-800', icon: CheckCircle },
      'inactive': { label: t('inactive'), color: 'bg-red-100 text-red-800', icon: XCircle },
      'occasional': { label: t('occasional'), color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      'new': { label: t('new'), color: 'bg-blue-100 text-blue-800', icon: User }
    }
    return configs[status] || { label: t('new'), color: 'bg-blue-100 text-blue-800', icon: User }
  }

  const getPaymentMethodIcon = (method) => {
    const icons = {
      'cash': '💵',
      'card': '💳',
      'mobile': '📱'
    }
    return icons[method] || '💸'
  }

  const getStatusSaleConfig = (status) => {
    const configs = {
      'completed': { color: 'bg-green-100 text-green-800', label: t('completed') },
      'cancelled': { color: 'bg-red-100 text-red-800', label: t('cancelled') },
      'refunded': { color: 'bg-yellow-100 text-yellow-800', label: t('refunded') }
    }
    return configs[status] || { color: 'bg-gray-100 text-gray-800', label: t('pending') }
  }

  const getPaymentStatusConfig = (status) => {
    const configs = {
      'paid': { color: 'bg-green-100 text-green-800', label: t('paid') },
      'pending': { color: 'bg-yellow-100 text-yellow-800', label: t('pending') },
      'partially_paid': { color: 'bg-blue-100 text-blue-800', label: t('partiallyPaid') }
    }
    return configs[status] || { color: 'bg-gray-100 text-gray-800', label: t('notSpecified') }
  }

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentClients = clients.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(clients.length / itemsPerPage)

  const activeFilters = Object.values(filters).filter(v => 
    v !== '' && v !== false && v !== 'all'
  ).length

  const handleDeleteClient = async (clientId) => {
    if (!window.confirm(t('confirmDeleteClient'))) {
      return
    }
    
    try {
      // Vérifier si le client a des ventes
      const { data: sales } = await supabase
        .from('sale')
        .select('id')
        .eq('customer_id', clientId)
        .limit(1)

      if (sales && sales.length > 0) {
        alert(t('cannotDeleteClient'))
        return
      }

      const { error } = await supabase
        .from('client')
        .delete()
        .eq('id', clientId)

      if (error) throw error

      alert(t('clientDeleted'))
      loadClients()
      
    } catch (error) {
      console.error(language === 'fr' ? 'Erreur suppression:' : 'Delete error:', error)
      alert(t('deleteError') + error.message)
    }
  }

  const truncateText = (text, maxLength) => {
    if (!text) return ''
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text
  }

  return (
    <div className="p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center">
            <Users className="w-6 h-6 sm:w-7 sm:h-7 mr-3 text-gray-700" />
            {t('clients')}
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {clients.length} {t('clientsTotal')}
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={loadClients}
            className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm"
          >
            {t('refresh')}
          </button>
          <button
            onClick={() => {/* TODO: Implémenter ajout client */}}
            className="flex items-center justify-center space-x-2 px-4 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition text-sm"
          >
            <Plus className="w-4 h-4" />
            <span>{t('newClient')}</span>
          </button>
        </div>
      </div>

      {/* Barre de recherche et filtres */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Recherche */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder={t('searchClientPlaceholder')}
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
              <span>{t('filters')} {activeFilters > 0 && `(${activeFilters})`}</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${showMobileFilters ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {/* Filtres desktop */}
          <div className="hidden lg:flex flex-wrap gap-2">
            <select
              value={filters.sortBy}
              onChange={(e) => setFilters({...filters, sortBy: e.target.value})}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-gray-900 focus:border-gray-900 bg-white text-sm"
            >
              <option value="recent">{t('mostRecent')}</option>
              <option value="name">{t('nameAZ')}</option>
              <option value="purchases">{t('mostPurchases')}</option>
              <option value="spent">{t('mostSpent')}</option>
            </select>

            <select
              value={filters.hasPurchases}
              onChange={(e) => setFilters({...filters, hasPurchases: e.target.value})}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-gray-900 focus:border-gray-900 bg-white text-sm"
            >
              <option value="all">{t('allClients')}</option>
              <option value="with">{t('withPurchases')}</option>
              <option value="without">{t('withoutPurchases')}</option>
            </select>

            <select
              value={filters.status}
              onChange={(e) => setFilters({...filters, status: e.target.value})}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-gray-900 focus:border-gray-900 bg-white text-sm"
            >
              <option value="all">{t('allStatuses')}</option>
              <option value="active">{t('statusActive')}</option>
              <option value="inactive">{t('inactive')}</option>
              <option value="occasional">{t('occasional')}</option>
              <option value="new">{t('new')}</option>
            </select>
            
            {activeFilters > 0 && (
              <button
                onClick={handleResetFilters}
                className="px-3 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm"
              >
                {t('reset')}
              </button>
            )}
          </div>
        </div>

        {/* Filtres mobile */}
        {showMobileFilters && (
          <div className="lg:hidden mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('sortBy')}
                </label>
                <select
                  value={filters.sortBy}
                  onChange={(e) => setFilters({...filters, sortBy: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-gray-900 focus:border-gray-900 bg-white text-sm"
                >
                  <option value="recent">{t('mostRecent')}</option>
                  <option value="name">{t('nameAZ')}</option>
                  <option value="purchases">{t('mostPurchases')}</option>
                  <option value="spent">{t('mostSpent')}</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('purchaseFilter')}
                </label>
                <select
                  value={filters.hasPurchases}
                  onChange={(e) => setFilters({...filters, hasPurchases: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-gray-900 focus:border-gray-900 bg-white text-sm"
                >
                  <option value="all">{t('allClients')}</option>
                  <option value="with">{t('withPurchases')}</option>
                  <option value="without">{t('withoutPurchases')}</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('status')}
                </label>
                <select
                  value={filters.status}
                  onChange={(e) => setFilters({...filters, status: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-gray-900 focus:border-gray-900 bg-white text-sm"
                >
                  <option value="all">{t('allStatuses')}</option>
                  <option value="active">{t('statusActive')}</option>
                  <option value="inactive">{t('inactive')}</option>
                  <option value="occasional">{t('occasional')}</option>
                  <option value="new">{t('new')}</option>
                </select>
              </div>
              
              <div className="pt-2 border-t border-gray-200">
                <div className="flex space-x-2">
                  <button
                    onClick={handleResetFilters}
                    className="flex-1 px-3 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm"
                  >
                    {t('reset')}
                  </button>
                  <button
                    onClick={() => setShowMobileFilters(false)}
                    className="flex-1 px-3 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition text-sm"
                  >
                    {t('apply')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Liste des clients - Vue desktop */}
      <div className="hidden md:block overflow-x-auto bg-white rounded-lg border border-gray-200">
        {loading ? (
          <div className="p-8">
            <div className="flex flex-col items-center justify-center space-y-4">
              <Loader2 className="w-8 h-8 animate-spin text-gray-600" />
              <div className="text-gray-500">{t('loadingClients')}</div>
            </div>
          </div>
        ) : currentClients.length > 0 ? (
          <>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('client')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('phone')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('purchases')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('totalSpent')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('lastPurchase')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('status')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('actions')}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentClients.map((client) => {
                  const statusConfig = getStatusConfig(client.status)
                  const Icon = statusConfig.icon
                  
                  return (
                    <tr key={client.id} className="hover:bg-gray-50 transition">
                      {/* Client */}
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="h-10 w-10 flex-shrink-0 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 flex items-center justify-center">
                            <span className="text-blue-600 font-semibold text-sm">
                              {client.name?.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">
                              {truncateText(client.name, 20)}
                            </div>
                            <div className="text-xs text-gray-500">
                              #{client.client_number}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Téléphone */}
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <Phone className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-700 text-sm">
                            {client.phone || t('notSpecified')}
                          </span>
                        </div>
                      </td>

                      {/* Achats */}
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <ShoppingBag className="w-4 h-4 text-gray-400" />
                          <span className="font-medium text-gray-900">
                            {client.purchaseCount}
                          </span>
                          <span className="text-sm text-gray-500">{t('purchases')}</span>
                        </div>
                      </td>

                      {/* Total dépensé */}
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          {client.totalSpentCDF > 0 && (
                            <div className="font-medium text-sm w-max text-gray-900">
                              {formatCurrency(client.totalSpentCDF, 'CDF')}
                            </div>
                          )}
                          {client.totalSpentUSD > 0 && (
                            <div className="font-medium text-sm w-max text-gray-900">
                              {formatCurrency(client.totalSpentUSD, 'USD')}
                            </div>
                          )}
                          {client.totalSpentCDF === 0 && client.totalSpentUSD === 0 && (
                            <div className="text-sm text-gray-500">{t('noPurchases')}</div>
                          )}
                        </div>
                      </td>

                      {/* Dernier achat */}
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-700">
                            {client.lastPurchaseDate ? formatDate(client.lastPurchaseDate) : t('never')}
                          </span>
                        </div>
                      </td>

                      {/* Statut */}
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig.color}`}>
                          <Icon className="w-3 h-3 mr-1" />
                          {statusConfig.label}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleViewClient(client)}
                            className="p-1.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition"
                            title={t('viewDetails')}
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {/* TODO: Implémenter édition */}}
                            className="p-1.5 text-gray-600 hover:text-yellow-600 hover:bg-yellow-50 rounded transition"
                            title={t('edit')}
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteClient(client.id)}
                            className="p-1.5 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded transition"
                            title={t('delete')}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-6 py-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-700">
                    {t('showing')} <span className="font-medium">{indexOfFirstItem + 1}</span> {t('to')}{' '}
                    <span className="font-medium">{Math.min(indexOfLastItem, clients.length)}</span> {t('of')}{' '}
                    <span className="font-medium">{clients.length}</span> {t('clients')}
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="p-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      title={t('previous')}
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="text-sm text-gray-700">
                      {t('page')} {currentPage} {t('of')} {totalPages}
                    </span>
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="p-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      title={t('next')}
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="p-8">
            <div className="text-center">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">
                {activeFilters > 0 ? t('noClientsFound') : t('noClients')}
              </h3>
              <p className="text-gray-500 text-sm mb-4">
                {activeFilters > 0
                  ? t('noClientsMatchFilters')
                  : t('addFirstClient')
                }
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={() => {/* TODO: Implémenter ajout client */}}
                  className="inline-flex items-center justify-center px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition text-sm"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  {t('addClient')}
                </button>
                {activeFilters > 0 && (
                  <button
                    onClick={handleResetFilters}
                    className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition text-sm"
                  >
                    {t('resetFilters')}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Liste des clients - Vue mobile */}
      <div className="md:hidden">
        {loading ? (
          <div className="bg-white rounded-lg border border-gray-200 p-8">
            <div className="flex flex-col items-center justify-center space-y-4">
              <Loader2 className="w-8 h-8 animate-spin text-gray-600" />
              <div className="text-gray-500">{t('loadingClients')}</div>
            </div>
          </div>
        ) : currentClients.length > 0 ? (
          <div className="space-y-3">
            {currentClients.map((client) => {
              const statusConfig = getStatusConfig(client.status)
              const Icon = statusConfig.icon
              
              return (
                <div key={client.id} className="bg-white rounded-lg border border-gray-200 p-4">
                  <div className="flex items-start justify-between">
                    {/* Informations client */}
                    <div className="flex-1">
                      <div className="flex items-start space-x-3">
                        <div className="h-10 w-10 flex-shrink-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                          <span className="text-white font-semibold text-sm">
                            {client.name?.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h3 className="font-medium text-gray-900 truncate">
                              {truncateText(client.name, 20)}
                            </h3>
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${statusConfig.color} ml-2`}>
                              <Icon className="w-3 h-3 mr-1" />
                              {statusConfig.label}
                            </span>
                          </div>
                          <div className="text-xs text-gray-500 mt-0.5">
                            #{client.client_number}
                          </div>
                        </div>
                      </div>

                      {/* Détails */}
                      <div className="mt-4 grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-xs text-gray-500">{t('phone')}</div>
                          <div className="flex items-center space-x-1 mt-1">
                            <Phone className="w-3 h-3 text-gray-400" />
                            <span className="text-sm text-gray-700">
                              {client.phone || t('notSpecified')}
                            </span>
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500">{t('purchases')}</div>
                          <div className="flex items-center space-x-1 mt-1">
                            <ShoppingBag className="w-3 h-3 text-gray-400" />
                            <span className="text-sm font-medium text-gray-900">
                              {client.purchaseCount}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Total dépensé */}
                      <div className="mt-3">
                        <div className="text-xs text-gray-500 mb-1">{t('totalSpent')}</div>
                        <div className="space-y-1">
                          {client.totalSpentCDF > 0 && (
                            <div className="font-medium text-sm text-gray-900">
                              {formatCurrency(client.totalSpentCDF, 'CDF')}
                            </div>
                          )}
                          {client.totalSpentUSD > 0 && (
                            <div className="font-medium text-sm text-gray-900">
                              {formatCurrency(client.totalSpentUSD, 'USD')}
                            </div>
                          )}
                          {client.totalSpentCDF === 0 && client.totalSpentUSD === 0 && (
                            <div className="text-xs text-gray-500">{t('noPurchases')}</div>
                          )}
                        </div>
                      </div>

                      {/* Dernier achat */}
                      {client.lastPurchaseDate && (
                        <div className="mt-3 flex items-center space-x-2">
                          <Calendar className="w-3 h-3 text-gray-400" />
                          <span className="text-xs text-gray-600">
                            {t('lastPurchase')}: {formatDate(client.lastPurchaseDate)}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Actions mobile */}
                    <div className="relative ml-2">
                      <button
                        onClick={() => setMobileActionMenu(mobileActionMenu === client.id ? null : client.id)}
                        className="p-1 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition"
                      >
                        <MoreVertical className="w-5 h-5" />
                      </button>
                      
                      {mobileActionMenu === client.id && (
                        <div className="absolute right-0 top-full mt-1 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                          <button
                            onClick={() => {
                              handleViewClient(client)
                              setMobileActionMenu(null)
                            }}
                            className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          >
                            <Eye className="w-3 h-3" />
                            <span>{t('viewDetails')}</span>
                          </button>
                          <button
                            onClick={() => {
                              // TODO: Implémenter édition
                              setMobileActionMenu(null)
                            }}
                            className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          >
                            <Edit className="w-3 h-3" />
                            <span>{t('edit')}</span>
                          </button>
                          <button
                            onClick={() => {
                              handleDeleteClient(client.id)
                              setMobileActionMenu(null)
                            }}
                            className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>{t('delete')}</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}

            {/* Pagination mobile */}
            {totalPages > 1 && (
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-sm text-gray-700">
                    {t('page')} {currentPage} {t('of')} {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 p-8">
            <div className="text-center">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">
                {activeFilters > 0 ? t('noClientsFound') : t('noClients')}
              </h3>
              <p className="text-gray-500 text-sm mb-4">
                {activeFilters > 0
                  ? t('noClientsMatchFilters')
                  : t('addFirstClient')
                }
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={() => {/* TODO: Implémenter ajout client */}}
                  className="inline-flex items-center justify-center px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition text-sm"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  {t('addClient')}
                </button>
                {activeFilters > 0 && (
                  <button
                    onClick={handleResetFilters}
                    className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition text-sm"
                  >
                    {t('resetFilters')}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal Détails Client */}
      {selectedClient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
            {/* Header du modal */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="h-14 w-14 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                    <span className="text-white font-bold text-xl">
                      {selectedClient.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      {selectedClient.name}
                    </h2>
                    <p className="text-gray-500 text-sm">
                      #{selectedClient.client_number}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleCloseModal}
                  className="p-2 hover:bg-gray-100 rounded-lg transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {loadingDetails ? (
              <div className="p-8">
                <div className="flex flex-col items-center justify-center space-y-4">
                  <Loader2 className="w-8 h-8 animate-spin text-gray-600" />
                  <div className="text-gray-500">{t('loadingDetails')}</div>
                </div>
              </div>
            ) : (
              <div className="overflow-y-auto max-h-[calc(90vh-200px)]">
                {/* Informations du client */}
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="space-y-4">
                      <h3 className="font-semibold text-gray-900 flex items-center">
                        <User className="w-5 h-5 mr-2" />
                        {t('personalInformation')}
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <Phone className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-700">{selectedClient.phone || t('notSpecified')}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-700">
                            {t('registeredOn')} {formatDate(selectedClient.created_at)}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="font-semibold text-gray-900 flex items-center">
                        <DollarSign className="w-5 h-5 mr-2" />
                        {t('purchaseStatistics')}
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-blue-600 mb-1">
                              {selectedClient.purchaseCount}
                            </div>
                            <div className="text-sm text-gray-600">{t('totalPurchases')}</div>
                          </div>
                        </div>
                        <div className="bg-green-50 p-4 rounded-lg">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-green-600 mb-1">
                              {selectedClient.totalSpentCDF > 0 && (
                                <div>{formatCurrency(selectedClient.totalSpentCDF, 'CDF')}</div>
                              )}
                              {selectedClient.totalSpentUSD > 0 && (
                                <div>{formatCurrency(selectedClient.totalSpentUSD, 'USD')}</div>
                              )}
                              {selectedClient.totalSpentCDF === 0 && selectedClient.totalSpentUSD === 0 && (
                                <div className="text-sm text-gray-500">{t('noPurchases')}</div>
                              )}
                            </div>
                            <div className="text-sm text-gray-600">{t('totalSpent')}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Historique des ventes */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-gray-900 flex items-center">
                        <ShoppingBag className="w-5 h-5 mr-2" />
                        {t('purchaseHistory')}
                      </h3>
                      <span className="text-sm text-gray-500">
                        {clientSales.length} {t('sales')}
                      </span>
                    </div>
                    
                    {clientSales.length > 0 ? (
                      <div className="space-y-3">
                        {clientSales.map((sale) => {
                          const statusConfig = getStatusSaleConfig(sale.status)
                          const paymentConfig = getPaymentStatusConfig(sale.payment_status)
                          
                          return (
                            <div key={sale.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition">
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-2">
                                <div className="flex-1">
                                  <div className="font-semibold text-gray-900">
                                    {sale.sale_number || t('notApplicable')}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {formatDateTime(sale.date_time)}
                                  </div>
                                </div>
                                <div className="flex items-center space-x-3">
                                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig.color}`}>
                                    {statusConfig.label}
                                  </span>
                                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${paymentConfig.color}`}>
                                    {paymentConfig.label}
                                  </span>
                                  <span className="text-lg" title={sale.payment_method}>
                                    {getPaymentMethodIcon(sale.payment_method)}
                                  </span>
                                </div>
                              </div>
                              
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                <div className="flex items-center space-x-4">
                                  <div className="flex items-center space-x-2">
                                    <Package className="w-4 h-4 text-gray-400" />
                                    <span className="text-sm text-gray-600">
                                      {sale.itemsCount || 0} {t('item')}{sale.itemsCount > 1 ? 's' : ''}
                                    </span>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <CreditCard className="w-4 h-4 text-gray-400" />
                                    <span className="text-sm text-gray-600 capitalize">
                                      {sale.payment_method || t('notApplicable')}
                                    </span>
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {sale.currency || 'CDF'}
                                  </div>
                                </div>
                                <div className="font-bold text-lg text-gray-900">
                                  {formatCurrency(sale.total, sale.currency)}
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    ) : (
                      <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-lg">
                        <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500">
                          {t('noPurchaseRecorded')}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Footer du modal */}
            <div className="p-6 border-t border-gray-200 bg-gray-50">
              <div className="flex justify-end space-x-3">
                <button
                  onClick={handleCloseModal}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition"
                >
                  {t('close')}
                </button>
                <button
                  onClick={() => {
                    // TODO: Implémenter édition client
                    console.log('Éditer client:', selectedClient.id)
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center space-x-2"
                >
                  <Edit className="w-4 h-4" />
                  <span>{t('modify')}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}