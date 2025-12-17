// // // 'use client'

// // // import { useState, useEffect } from 'react'
// // // import { useRouter } from 'next/navigation'
// // // import { supabase } from '@/lib/supabase'
// // // import { checkAuth } from '@/lib/auth'
// // // import Image from 'next/image'
// // // import {
// // //   Search,
// // //   Filter,
// // //   UserPlus,
// // //   Edit,
// // //   Trash2,
// // //   MoreVertical,
// // //   User,
// // //   Mail,
// // //   Phone,
// // //   Shield,
// // //   CheckCircle,
// // //   XCircle,
// // //   ChevronLeft,
// // //   ChevronRight,
// // //   Loader2,
// // //   Users,
// // //   Calendar,
// // //   Eye
// // // } from 'lucide-react'

// // // export default function UsersManagementPage() {
// // //   const [users, setUsers] = useState([])
// // //   const [loading, setLoading] = useState(true)
// // //   const [searchTerm, setSearchTerm] = useState('')
// // //   const [roleFilter, setRoleFilter] = useState('all')
// // //   const [statusFilter, setStatusFilter] = useState('all')
// // //   const [currentPage, setCurrentPage] = useState(1)
// // //   const [itemsPerPage] = useState(10)
// // //   const [selectedUser, setSelectedUser] = useState(null)
// // //   const [showDeleteModal, setShowDeleteModal] = useState(false)
// // //   const [actionLoading, setActionLoading] = useState(false)
// // //   const router = useRouter()

// // //   useEffect(() => {
// // //     checkPermissions()
// // //     fetchUsers()
// // //   }, [])

// // //   const checkPermissions = () => {
// // //     const currentUser = checkAuth()
// // //     if (!currentUser || (currentUser.role !== 'super-admin' && currentUser.role !== 'admin')) {
// // //       router.push('/dashboard')
// // //     }
// // //   }

// // //   const fetchUsers = async () => {
// // //     try {
// // //       const { data, error } = await supabase
// // //         .from('users')
// // //         .select('*')
// // //         .order('created_at', { ascending: false })

// // //       if (error) throw error
// // //       setUsers(data || [])
// // //     } catch (error) {
// // //       console.error('Erreur récupération utilisateurs:', error)
// // //     } finally {
// // //       setLoading(false)
// // //     }
// // //   }

// // //   const filteredUsers = users.filter(user => {
// // //     const matchesSearch = 
// // //       user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
// // //       user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
// // //       user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
// // //       user.phone?.toLowerCase().includes(searchTerm.toLowerCase())

// // //     const matchesRole = roleFilter === 'all' || user.role === roleFilter
// // //     const matchesStatus = statusFilter === 'all' || 
// // //       (statusFilter === 'active' && user.is_active) ||
// // //       (statusFilter === 'inactive' && !user.is_active)

// // //     return matchesSearch && matchesRole && matchesStatus
// // //   })

// // //   const paginatedUsers = filteredUsers.slice(
// // //     (currentPage - 1) * itemsPerPage,
// // //     currentPage * itemsPerPage
// // //   )

// // //   const totalPages = Math.ceil(filteredUsers.length / itemsPerPage)

// // //   const handleDeleteUser = async () => {
// // //     if (!selectedUser) return

// // //     try {
// // //       setActionLoading(true)
      
// // //       // Supprimer la photo de profil si elle existe
// // //       if (selectedUser.profile_image) {
// // //         await supabase.storage
// // //           .from('avatars')
// // //           .remove([selectedUser.profile_image])
// // //       }

// // //       // Supprimer l'utilisateur
// // //       const { error } = await supabase
// // //         .from('users')
// // //         .delete()
// // //         .eq('id', selectedUser.id)

// // //       if (error) throw error

// // //       // Mettre à jour la liste
// // //       setUsers(users.filter(u => u.id !== selectedUser.id))
// // //       setShowDeleteModal(false)
// // //       setSelectedUser(null)
      
// // //     } catch (error) {
// // //       console.error('Erreur suppression utilisateur:', error)
// // //       alert('Erreur lors de la suppression')
// // //     } finally {
// // //       setActionLoading(false)
// // //     }
// // //   }

// // //   const toggleUserStatus = async (user) => {
// // //     try {
// // //       const { error } = await supabase
// // //         .from('users')
// // //         .update({ is_active: !user.is_active })
// // //         .eq('id', user.id)

// // //       if (error) throw error

// // //       // Mettre à jour localement
// // //       setUsers(users.map(u => 
// // //         u.id === user.id ? { ...u, is_active: !u.is_active } : u
// // //       ))
      
// // //     } catch (error) {
// // //       console.error('Erreur changement statut:', error)
// // //       alert('Erreur lors du changement de statut')
// // //     }
// // //   }

// // //   const getRoleColor = (role) => {
// // //     switch (role) {
// // //       case 'super-admin': return 'bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800'
// // //       case 'admin': return 'bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-800'
// // //       default: return 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800'
// // //     }
// // //   }

// // //   const getRoleIcon = (role) => {
// // //     switch (role) {
// // //       case 'super-admin': return '👑'
// // //       case 'admin': return '🛡️'
// // //       default: return '👤'
// // //     }
// // //   }

// // //   const formatDate = (date) => {
// // //     return new Date(date).toLocaleDateString('fr-FR', {
// // //       day: '2-digit',
// // //       month: '2-digit',
// // //       year: 'numeric'
// // //     })
// // //   }

// // //   if (loading) {
// // //     return (
// // //       <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
// // //         <div className="flex flex-col items-center space-y-4">
// // //           <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
// // //           <div className="text-gray-600">Chargement des utilisateurs...</div>
// // //         </div>
// // //       </div>
// // //     )
// // //   }

// // //   return (
// // //     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6 lg:p-8">
// // //       <div className="max-w-7xl mx-auto">
// // //         {/* Header */}
// // //         <div className="mb-8">
// // //           <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
// // //             <div>
// // //               <h1 className="text-3xl font-bold text-gray-900 flex items-center">
// // //                 <Users className="w-8 h-8 mr-3 text-blue-600" />
// // //                 Gestion des Utilisateurs
// // //               </h1>
// // //               <p className="text-gray-600 mt-2">
// // //                 {filteredUsers.length} utilisateur{filteredUsers.length !== 1 ? 's' : ''} trouvé{filteredUsers.length !== 1 ? 's' : ''}
// // //               </p>
// // //             </div>
            
// // //             <button
// // //               onClick={() => router.push('/users/create')}
// // //               className="inline-flex items-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition shadow-sm"
// // //             >
// // //               <UserPlus className="w-4 h-4" />
// // //               <span>Nouvel utilisateur</span>
// // //             </button>
// // //           </div>
// // //         </div>

// // //         {/* Filtres et recherche */}
// // //         <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
// // //           <div className="flex flex-col lg:flex-row gap-4">
// // //             {/* Barre de recherche */}
// // //             <div className="flex-1">
// // //               <div className="relative">
// // //                 <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
// // //                 <input
// // //                   type="text"
// // //                   placeholder="Rechercher par nom, email ou téléphone..."
// // //                   value={searchTerm}
// // //                   onChange={(e) => setSearchTerm(e.target.value)}
// // //                   className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
// // //                 />
// // //               </div>
// // //             </div>

// // //             {/* Filtres */}
// // //             <div className="flex flex-wrap gap-3">
// // //               <select
// // //                 value={roleFilter}
// // //                 onChange={(e) => setRoleFilter(e.target.value)}
// // //                 className="px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
// // //               >
// // //                 <option value="all">Tous les rôles</option>
// // //                 <option value="super-admin">Super Admin</option>
// // //                 <option value="admin">Administrateur</option>
// // //                 <option value="vendor">Vendeur</option>
// // //               </select>

// // //               <select
// // //                 value={statusFilter}
// // //                 onChange={(e) => setStatusFilter(e.target.value)}
// // //                 className="px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
// // //               >
// // //                 <option value="all">Tous les statuts</option>
// // //                 <option value="active">Actif</option>
// // //                 <option value="inactive">Inactif</option>
// // //               </select>

// // //               <button
// // //                 onClick={() => {
// // //                   setSearchTerm('')
// // //                   setRoleFilter('all')
// // //                   setStatusFilter('all')
// // //                 }}
// // //                 className="px-4 py-2.5 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
// // //               >
// // //                 Réinitialiser
// // //               </button>
// // //             </div>
// // //           </div>
// // //         </div>

// // //         {/* Tableau des utilisateurs */}
// // //         <div className="bg-white rounded-xl shadow-sm overflow-hidden">
// // //           <div className="overflow-x-auto">
// // //             <table className="min-w-full divide-y divide-gray-200">
// // //               <thead className="bg-gray-50">
// // //                 <tr>
// // //                   <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// // //                     Utilisateur
// // //                   </th>
// // //                   <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// // //                     Rôle
// // //                   </th>
// // //                   <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// // //                     Contact
// // //                   </th>
// // //                   <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// // //                     Statut
// // //                   </th>
// // //                   <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// // //                     Date d&apos;inscription
// // //                   </th>
// // //                   <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// // //                     Actions
// // //                   </th>
// // //                 </tr>
// // //               </thead>
// // //               <tbody className="bg-white divide-y divide-gray-200">
// // //                 {paginatedUsers.length === 0 ? (
// // //                   <tr>
// // //                     <td colSpan="6" className="px-6 py-12 text-center">
// // //                       <div className="flex flex-col items-center justify-center space-y-3">
// // //                         <User className="w-12 h-12 text-gray-400" />
// // //                         <div className="text-gray-500">Aucun utilisateur trouvé</div>
// // //                       </div>
// // //                     </td>
// // //                   </tr>
// // //                 ) : (
// // //                   paginatedUsers.map((user) => (
// // //                     <tr key={user.id} className="hover:bg-gray-50 transition">
// // //                       <td className="px-6 py-4">
// // //                         <div className="flex items-center">
// // //                           <div className="flex-shrink-0 h-10 w-10">
// // //                             {user.profile_image ? (
// // //                               <div className="relative h-10 w-10 rounded-full overflow-hidden">
// // //                                 <Image
// // //                                   src={`${supabase.storage.from('avatars').getPublicUrl(user.profile_image).data.publicUrl}?t=${Date.now()}`}
// // //                                   alt={user.full_name}
// // //                                   fill
// // //                                   className="object-cover"
// // //                                   unoptimized
// // //                                 />
// // //                               </div>
// // //                             ) : (
// // //                               <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-100 to-blue-200 flex items-center justify-center">
// // //                                 <User className="w-5 h-5 text-blue-600" />
// // //                               </div>
// // //                             )}
// // //                           </div>
// // //                           <div className="ml-4">
// // //                             <div className="text-sm font-medium text-gray-900">
// // //                               {user.full_name}
// // //                             </div>
// // //                             <div className="text-sm text-gray-500">
// // //                               @{user.username}
// // //                             </div>
// // //                           </div>
// // //                         </div>
// // //                       </td>
// // //                       <td className="px-6 py-4">
// // //                         <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
// // //                           <span className="mr-1.5">{getRoleIcon(user.role)}</span>
// // //                           {user.role === 'super-admin' ? 'Super Admin' :
// // //                            user.role === 'admin' ? 'Administrateur' : 'Vendeur'}
// // //                         </span>
// // //                         {user.shop_name && (
// // //                           <div className="text-xs text-gray-500 mt-1">
// // //                             {user.shop_name}
// // //                           </div>
// // //                         )}
// // //                       </td>
// // //                       <td className="px-6 py-4">
// // //                         <div className="text-sm text-gray-900 flex items-center">
// // //                           <Mail className="w-4 h-4 mr-2 text-gray-400" />
// // //                           {user.email}
// // //                         </div>
// // //                         {user.phone && (
// // //                           <div className="text-sm text-gray-500 flex items-center mt-1">
// // //                             <Phone className="w-4 h-4 mr-2" />
// // //                             {user.phone}
// // //                           </div>
// // //                         )}
// // //                       </td>
// // //                       <td className="px-6 py-4">
// // //                         <button
// // //                           onClick={() => toggleUserStatus(user)}
// // //                           className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium transition ${
// // //                             user.is_active
// // //                               ? 'bg-green-100 text-green-800 hover:bg-green-200'
// // //                               : 'bg-red-100 text-red-800 hover:bg-red-200'
// // //                           }`}
// // //                         >
// // //                           {user.is_active ? (
// // //                             <>
// // //                               <CheckCircle className="w-3 h-3 mr-1.5" />
// // //                               Actif
// // //                             </>
// // //                           ) : (
// // //                             <>
// // //                               <XCircle className="w-3 h-3 mr-1.5" />
// // //                               Inactif
// // //                             </>
// // //                           )}
// // //                         </button>
// // //                       </td>
// // //                       <td className="px-6 py-4 text-sm text-gray-500">
// // //                         <div className="flex items-center">
// // //                           <Calendar className="w-4 h-4 mr-2 text-gray-400" />
// // //                           {formatDate(user.created_at)}
// // //                         </div>
// // //                         {user.last_login && (
// // //                           <div className="text-xs text-gray-400 mt-1">
// // //                             Dernière connexion: {formatDate(user.last_login)}
// // //                           </div>
// // //                         )}
// // //                       </td>
// // //                       <td className="px-6 py-4 text-sm font-medium">
// // //                         <div className="flex items-center space-x-2">
// // //                           <button
// // //                             onClick={() => router.push(`/users/${user.id}`)}
// // //                             className="p-1.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition"
// // //                             title="Voir le profil"
// // //                           >
// // //                             <Eye className="w-4 h-4" />
// // //                           </button>
// // //                           <button
// // //                             onClick={() => router.push(`/users/edit/${user.id}`)}
// // //                             className="p-1.5 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded transition"
// // //                             title="Modifier"
// // //                           >
// // //                             <Edit className="w-4 h-4" />
// // //                           </button>
// // //                           <button
// // //                             onClick={() => {
// // //                               setSelectedUser(user)
// // //                               setShowDeleteModal(true)
// // //                             }}
// // //                             className="p-1.5 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded transition"
// // //                             title="Supprimer"
// // //                           >
// // //                             <Trash2 className="w-4 h-4" />
// // //                           </button>
// // //                         </div>
// // //                       </td>
// // //                     </tr>
// // //                   ))
// // //                 )}
// // //               </tbody>
// // //             </table>
// // //           </div>

// // //           {/* Pagination */}
// // //           {totalPages > 1 && (
// // //             <div className="px-6 py-4 border-t border-gray-200">
// // //               <div className="flex items-center justify-between">
// // //                 <div className="text-sm text-gray-700">
// // //                   Page {currentPage} sur {totalPages}
// // //                 </div>
// // //                 <div className="flex items-center space-x-2">
// // //                   <button
// // //                     onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
// // //                     disabled={currentPage === 1}
// // //                     className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
// // //                   >
// // //                     <ChevronLeft className="w-4 h-4" />
// // //                   </button>
                  
// // //                   {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
// // //                     let pageNum
// // //                     if (totalPages <= 5) {
// // //                       pageNum = i + 1
// // //                     } else if (currentPage <= 3) {
// // //                       pageNum = i + 1
// // //                     } else if (currentPage >= totalPages - 2) {
// // //                       pageNum = totalPages - 4 + i
// // //                     } else {
// // //                       pageNum = currentPage - 2 + i
// // //                     }
                    
// // //                     return (
// // //                       <button
// // //                         key={pageNum}
// // //                         onClick={() => setCurrentPage(pageNum)}
// // //                         className={`w-8 h-8 flex items-center justify-center rounded-lg transition ${
// // //                           currentPage === pageNum
// // //                             ? 'bg-blue-600 text-white'
// // //                             : 'text-gray-700 hover:bg-gray-100'
// // //                         }`}
// // //                       >
// // //                         {pageNum}
// // //                       </button>
// // //                     )
// // //                   })}
                  
// // //                   <button
// // //                     onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
// // //                     disabled={currentPage === totalPages}
// // //                     className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
// // //                   >
// // //                     <ChevronRight className="w-4 h-4" />
// // //                   </button>
// // //                 </div>
// // //               </div>
// // //             </div>
// // //           )}
// // //         </div>

// // //         {/* Statistiques */}
// // //         <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
// // //           <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-4">
// // //             <div className="text-sm text-blue-800 font-medium">Total Utilisateurs</div>
// // //             <div className="text-2xl font-bold text-blue-900 mt-1">{users.length}</div>
// // //           </div>
          
// // //           <div className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-xl p-4">
// // //             <div className="text-sm text-green-800 font-medium">Utilisateurs Actifs</div>
// // //             <div className="text-2xl font-bold text-green-900 mt-1">
// // //               {users.filter(u => u.is_active).length}
// // //             </div>
// // //           </div>
          
// // //           <div className="bg-gradient-to-r from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-4">
// // //             <div className="text-sm text-purple-800 font-medium">Vendeurs</div>
// // //             <div className="text-2xl font-bold text-purple-900 mt-1">
// // //               {users.filter(u => u.role === 'vendor').length}
// // //             </div>
// // //           </div>
// // //         </div>
// // //       </div>

// // //       {/* Modal de confirmation de suppression */}
// // //       {showDeleteModal && selectedUser && (
// // //         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
// // //           <div className="bg-white rounded-2xl max-w-md w-full p-6">
// // //             <div className="text-center">
// // //               <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
// // //                 <Trash2 className="h-6 w-6 text-red-600" />
// // //               </div>
// // //               <h3 className="text-lg font-semibold text-gray-900 mb-2">
// // //                 Confirmer la suppression
// // //               </h3>
// // //               <p className="text-gray-600 mb-6">
// // //                 Êtes-vous sûr de vouloir supprimer l&apos;utilisateur{' '}
// // //                 <span className="font-semibold">{selectedUser.full_name}</span> ?
// // //                 Cette action est irréversible.
// // //               </p>
// // //               <div className="flex justify-center space-x-3">
// // //                 <button
// // //                   onClick={() => {
// // //                     setShowDeleteModal(false)
// // //                     setSelectedUser(null)
// // //                   }}
// // //                   className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
// // //                   disabled={actionLoading}
// // //                 >
// // //                   Annuler
// // //                 </button>
// // //                 <button
// // //                   onClick={handleDeleteUser}
// // //                   disabled={actionLoading}
// // //                   className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50 flex items-center space-x-2"
// // //                 >
// // //                   {actionLoading && <Loader2 className="w-4 h-4 animate-spin" />}
// // //                   <span>Supprimer</span>
// // //                 </button>
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
// // import { useRouter } from 'next/navigation'
// // import { supabase } from '@/lib/supabase'
// // import { checkAuth } from '@/lib/auth'
// // import Image from 'next/image'
// // import {
// //   Search,
// //   Filter,
// //   UserPlus,
// //   Edit,
// //   Trash2,
// //   MoreVertical,
// //   User,
// //   Mail,
// //   Phone,
// //   Shield,
// //   CheckCircle,
// //   XCircle,
// //   ChevronLeft,
// //   ChevronRight,
// //   Loader2,
// //   Users,
// //   Calendar,
// //   Eye,
// //   MapPin,
// //   Store,
// //   Globe,
// //   Key,
// //   AlertCircle,
// //   Save,
// //   X,
// //   Camera
// // } from 'lucide-react'

// // export default function UsersManagementPage() {
// //   const [users, setUsers] = useState([])
// //   const [loading, setLoading] = useState(true)
// //   const [searchTerm, setSearchTerm] = useState('')
// //   const [roleFilter, setRoleFilter] = useState('all')
// //   const [statusFilter, setStatusFilter] = useState('all')
// //   const [currentPage, setCurrentPage] = useState(1)
// //   const [itemsPerPage] = useState(10)
// //   const [selectedUser, setSelectedUser] = useState(null)
// //   const [editingUser, setEditingUser] = useState(null)
// //   const [editFormData, setEditFormData] = useState({})
// //   const [showDeleteModal, setShowDeleteModal] = useState(false)
// //   const [showViewModal, setShowViewModal] = useState(false)
// //   const [showEditModal, setShowEditModal] = useState(false)
// //   const [actionLoading, setActionLoading] = useState(false)
// //   const [editLoading, setEditLoading] = useState(false)
// //   const router = useRouter()

// //   useEffect(() => {
// //     checkPermissions()
// //     fetchUsers()
// //   }, [])

// //   const checkPermissions = () => {
// //     const currentUser = checkAuth()
// //     if (!currentUser || (currentUser.role !== 'super-admin' && currentUser.role !== 'admin')) {
// //       router.push('/dashboard')
// //     }
// //   }

// //   const fetchUsers = async () => {
// //     try {
// //       const { data, error } = await supabase
// //         .from('users')
// //         .select('*')
// //         .order('created_at', { ascending: false })

// //       if (error) throw error
// //       setUsers(data || [])
// //     } catch (error) {
// //       console.error('Erreur récupération utilisateurs:', error)
// //     } finally {
// //       setLoading(false)
// //     }
// //   }

// //   const handleViewUser = (user) => {
// //     setSelectedUser(user)
// //     setShowViewModal(true)
// //   }

// //   const handleEditUser = (user) => {
// //     setEditingUser(user)
// //     setEditFormData({
// //       full_name: user.full_name || '',
// //       email: user.email || '',
// //       phone: user.phone || '',
// //       address: user.address || '',
// //       shop_name: user.shop_name || '',
// //       role: user.role || 'vendor',
// //       is_active: user.is_active
// //     })
// //     setShowEditModal(true)
// //   }

// //   const handleUpdateUser = async () => {
// //     if (!editingUser) return

// //     try {
// //       setEditLoading(true)
      
// //       const { error } = await supabase
// //         .from('users')
// //         .update({
// //           full_name: editFormData.full_name,
// //           phone: editFormData.phone,
// //           address: editFormData.address,
// //           shop_name: editFormData.shop_name,
// //           role: editFormData.role,
// //           is_active: editFormData.is_active,
// //           updated_at: new Date().toISOString()
// //         })
// //         .eq('id', editingUser.id)

// //       if (error) throw error

// //       // Mettre à jour localement
// //       setUsers(users.map(u => 
// //         u.id === editingUser.id ? { ...u, ...editFormData } : u
// //       ))

// //       setShowEditModal(false)
// //       setEditingUser(null)
      
// //       alert('Utilisateur mis à jour avec succès!')
// //     } catch (error) {
// //       console.error('Erreur mise à jour utilisateur:', error)
// //       alert('Erreur lors de la mise à jour')
// //     } finally {
// //       setEditLoading(false)
// //     }
// //   }

// //   const filteredUsers = users.filter(user => {
// //     const matchesSearch = 
// //       user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
// //       user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
// //       user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
// //       user.phone?.toLowerCase().includes(searchTerm.toLowerCase())

// //     const matchesRole = roleFilter === 'all' || user.role === roleFilter
// //     const matchesStatus = statusFilter === 'all' || 
// //       (statusFilter === 'active' && user.is_active) ||
// //       (statusFilter === 'inactive' && !user.is_active)

// //     return matchesSearch && matchesRole && matchesStatus
// //   })

// //   const paginatedUsers = filteredUsers.slice(
// //     (currentPage - 1) * itemsPerPage,
// //     currentPage * itemsPerPage
// //   )

// //   const totalPages = Math.ceil(filteredUsers.length / itemsPerPage)

// //   const handleDeleteUser = async () => {
// //     if (!selectedUser) return

// //     try {
// //       setActionLoading(true)
      
// //       // Supprimer la photo de profil si elle existe
// //       if (selectedUser.profile_image) {
// //         await supabase.storage
// //           .from('avatars')
// //           .remove([selectedUser.profile_image])
// //       }

// //       // Supprimer l'utilisateur
// //       const { error } = await supabase
// //         .from('users')
// //         .delete()
// //         .eq('id', selectedUser.id)

// //       if (error) throw error

// //       // Mettre à jour la liste
// //       setUsers(users.filter(u => u.id !== selectedUser.id))
// //       setShowDeleteModal(false)
// //       setSelectedUser(null)
      
// //     } catch (error) {
// //       console.error('Erreur suppression utilisateur:', error)
// //       alert('Erreur lors de la suppression')
// //     } finally {
// //       setActionLoading(false)
// //     }
// //   }

// //   const toggleUserStatus = async (user) => {
// //     try {
// //       const { error } = await supabase
// //         .from('users')
// //         .update({ is_active: !user.is_active })
// //         .eq('id', user.id)

// //       if (error) throw error

// //       // Mettre à jour localement
// //       setUsers(users.map(u => 
// //         u.id === user.id ? { ...u, is_active: !u.is_active } : u
// //       ))
      
// //     } catch (error) {
// //       console.error('Erreur changement statut:', error)
// //       alert('Erreur lors du changement de statut')
// //     }
// //   }

// //   const getRoleColor = (role) => {
// //     switch (role) {
// //       case 'super-admin': return 'bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800'
// //       case 'admin': return 'bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-800'
// //       default: return 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800'
// //     }
// //   }

// //   const getRoleIcon = (role) => {
// //     switch (role) {
// //       case 'super-admin': return '👑'
// //       case 'admin': return '🛡️'
// //       default: return '👤'
// //     }
// //   }

// //   const formatDate = (date) => {
// //     return new Date(date).toLocaleDateString('fr-FR', {
// //       day: '2-digit',
// //       month: '2-digit',
// //       year: 'numeric',
// //       hour: '2-digit',
// //       minute: '2-digit'
// //     })
// //   }

// //   if (loading) {
// //     return (
// //       <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
// //         <div className="flex flex-col items-center space-y-4">
// //           <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
// //           <div className="text-gray-600">Chargement des utilisateurs...</div>
// //         </div>
// //       </div>
// //     )
// //   }

// //   return (
// //     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6 lg:p-8">
// //       <div className="max-w-7xl mx-auto">
// //         {/* Header */}
// //         <div className="mb-8">
// //           <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
// //             <div>
// //               <h1 className="text-3xl font-bold text-gray-900 flex items-center">
// //                 <Users className="w-8 h-8 mr-3 text-blue-600" />
// //                 Gestion des Utilisateurs
// //               </h1>
// //               <p className="text-gray-600 mt-2">
// //                 {filteredUsers.length} utilisateur{filteredUsers.length !== 1 ? 's' : ''} trouvé{filteredUsers.length !== 1 ? 's' : ''}
// //               </p>
// //             </div>
            
// //             <button
// //               onClick={() => router.push('/super-admin/auth/register')}
// //               className="inline-flex items-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition shadow-sm"
// //             >
// //               <UserPlus className="w-4 h-4" />
// //               <span>Nouvel utilisateur</span>
// //             </button>
// //           </div>
// //         </div>

// //         {/* Filtres et recherche */}
// //         <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
// //           <div className="flex flex-col lg:flex-row gap-4">
// //             {/* Barre de recherche */}
// //             <div className="flex-1">
// //               <div className="relative">
// //                 <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
// //                 <input
// //                   type="text"
// //                   placeholder="Rechercher par nom, email ou téléphone..."
// //                   value={searchTerm}
// //                   onChange={(e) => setSearchTerm(e.target.value)}
// //                   className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
// //                 />
// //               </div>
// //             </div>

// //             {/* Filtres */}
// //             <div className="flex flex-wrap gap-3">
// //               <select
// //                 value={roleFilter}
// //                 onChange={(e) => setRoleFilter(e.target.value)}
// //                 className="px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
// //               >
// //                 <option value="all">Tous les rôles</option>
// //                 <option value="super-admin">Super Admin</option>
// //                 <option value="admin">Administrateur</option>
// //                 <option value="vendor">Vendeur</option>
// //               </select>

// //               <select
// //                 value={statusFilter}
// //                 onChange={(e) => setStatusFilter(e.target.value)}
// //                 className="px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
// //               >
// //                 <option value="all">Tous les statuts</option>
// //                 <option value="active">Actif</option>
// //                 <option value="inactive">Inactif</option>
// //               </select>

// //               <button
// //                 onClick={() => {
// //                   setSearchTerm('')
// //                   setRoleFilter('all')
// //                   setStatusFilter('all')
// //                 }}
// //                 className="px-4 py-2.5 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
// //               >
// //                 Réinitialiser
// //               </button>
// //             </div>
// //           </div>
// //         </div>

// //         {/* Tableau des utilisateurs */}
// //         <div className="bg-white rounded-xl shadow-sm overflow-hidden">
// //           <div className="overflow-x-auto">
// //             <table className="min-w-full divide-y divide-gray-200">
// //               <thead className="bg-gray-50">
// //                 <tr>
// //                   <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// //                     Utilisateur
// //                   </th>
// //                   <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// //                     Rôle
// //                   </th>
// //                   <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// //                     Contact
// //                   </th>
// //                   <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// //                     Statut
// //                   </th>
// //                   <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// //                     Date d&apos;inscription
// //                   </th>
// //                   <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// //                     Actions
// //                   </th>
// //                 </tr>
// //               </thead>
// //               <tbody className="bg-white divide-y divide-gray-200">
// //                 {paginatedUsers.length === 0 ? (
// //                   <tr>
// //                     <td colSpan="6" className="px-6 py-12 text-center">
// //                       <div className="flex flex-col items-center justify-center space-y-3">
// //                         <User className="w-12 h-12 text-gray-400" />
// //                         <div className="text-gray-500">Aucun utilisateur trouvé</div>
// //                       </div>
// //                     </td>
// //                   </tr>
// //                 ) : (
// //                   paginatedUsers.map((user) => (
// //                     <tr key={user.id} className="hover:bg-gray-50 transition">
// //                       <td className="px-6 py-4">
// //                         <div className="flex items-center">
// //                           <div className="flex-shrink-0 h-10 w-10">
// //                             {user.profile_image ? (
// //                               <div className="relative h-10 w-10 rounded-full overflow-hidden">
// //                                 <Image
// //                                   src={`${supabase.storage.from('avatars').getPublicUrl(user.profile_image).data.publicUrl}?t=${Date.now()}`}
// //                                   alt={user.full_name}
// //                                   fill
// //                                   className="object-cover"
// //                                   unoptimized
// //                                 />
// //                               </div>
// //                             ) : (
// //                               <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-100 to-blue-200 flex items-center justify-center">
// //                                 <User className="w-5 h-5 text-blue-600" />
// //                               </div>
// //                             )}
// //                           </div>
// //                           <div className="ml-4">
// //                             <div className="text-sm font-medium text-gray-900">
// //                               {user.full_name}
// //                             </div>
// //                             <div className="text-sm text-gray-500">
// //                               @{user.username}
// //                             </div>
// //                           </div>
// //                         </div>
// //                       </td>
// //                       <td className="px-6 py-4">
// //                         <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
// //                           <span className="mr-1.5">{getRoleIcon(user.role)}</span>
// //                           {user.role === 'super-admin' ? 'Super Admin' :
// //                            user.role === 'admin' ? 'Administrateur' : 'Vendeur'}
// //                         </span>
// //                         {user.shop_name && (
// //                           <div className="text-xs text-gray-500 mt-1">
// //                             {user.shop_name}
// //                           </div>
// //                         )}
// //                       </td>
// //                       <td className="px-6 py-4">
// //                         <div className="text-sm text-gray-900 flex items-center">
// //                           <Mail className="w-4 h-4 mr-2 text-gray-400" />
// //                           {user.email}
// //                         </div>
// //                         {user.phone && (
// //                           <div className="text-sm text-gray-500 flex items-center mt-1">
// //                             <Phone className="w-4 h-4 mr-2" />
// //                             {user.phone}
// //                           </div>
// //                         )}
// //                       </td>
// //                       <td className="px-6 py-4">
// //                         <button
// //                           onClick={() => toggleUserStatus(user)}
// //                           className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium transition ${
// //                             user.is_active
// //                               ? 'bg-green-100 text-green-800 hover:bg-green-200'
// //                               : 'bg-red-100 text-red-800 hover:bg-red-200'
// //                           }`}
// //                         >
// //                           {user.is_active ? (
// //                             <>
// //                               <CheckCircle className="w-3 h-3 mr-1.5" />
// //                               Actif
// //                             </>
// //                           ) : (
// //                             <>
// //                               <XCircle className="w-3 h-3 mr-1.5" />
// //                               Inactif
// //                             </>
// //                           )}
// //                         </button>
// //                       </td>
// //                       <td className="px-6 py-4 text-sm text-gray-500">
// //                         <div className="flex items-center">
// //                           <Calendar className="w-4 h-4 mr-2 text-gray-400" />
// //                           {formatDate(user.created_at)}
// //                         </div>
// //                         {user.last_login && (
// //                           <div className="text-xs text-gray-400 mt-1">
// //                             Dernière connexion: {formatDate(user.last_login)}
// //                           </div>
// //                         )}
// //                       </td>
// //                       <td className="px-6 py-4 text-sm font-medium">
// //                         <div className="flex items-center space-x-2">
// //                           <button
// //                             onClick={() => handleViewUser(user)}
// //                             className="p-1.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition"
// //                             title="Voir détails"
// //                           >
// //                             <Eye className="w-4 h-4" />
// //                           </button>
// //                           <button
// //                             onClick={() => handleEditUser(user)}
// //                             className="p-1.5 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded transition"
// //                             title="Modifier"
// //                           >
// //                             <Edit className="w-4 h-4" />
// //                           </button>
// //                           <button
// //                             onClick={() => {
// //                               setSelectedUser(user)
// //                               setShowDeleteModal(true)
// //                             }}
// //                             className="p-1.5 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded transition"
// //                             title="Supprimer"
// //                           >
// //                             <Trash2 className="w-4 h-4" />
// //                           </button>
// //                         </div>
// //                       </td>
// //                     </tr>
// //                   ))
// //                 )}
// //               </tbody>
// //             </table>
// //           </div>

// //           {/* Pagination */}
// //           {totalPages > 1 && (
// //             <div className="px-6 py-4 border-t border-gray-200">
// //               <div className="flex items-center justify-between">
// //                 <div className="text-sm text-gray-700">
// //                   Page {currentPage} sur {totalPages}
// //                 </div>
// //                 <div className="flex items-center space-x-2">
// //                   <button
// //                     onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
// //                     disabled={currentPage === 1}
// //                     className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
// //                   >
// //                     <ChevronLeft className="w-4 h-4" />
// //                   </button>
                  
// //                   {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
// //                     let pageNum
// //                     if (totalPages <= 5) {
// //                       pageNum = i + 1
// //                     } else if (currentPage <= 3) {
// //                       pageNum = i + 1
// //                     } else if (currentPage >= totalPages - 2) {
// //                       pageNum = totalPages - 4 + i
// //                     } else {
// //                       pageNum = currentPage - 2 + i
// //                     }
                    
// //                     return (
// //                       <button
// //                         key={pageNum}
// //                         onClick={() => setCurrentPage(pageNum)}
// //                         className={`w-8 h-8 flex items-center justify-center rounded-lg transition ${
// //                           currentPage === pageNum
// //                             ? 'bg-blue-600 text-white'
// //                             : 'text-gray-700 hover:bg-gray-100'
// //                         }`}
// //                       >
// //                         {pageNum}
// //                       </button>
// //                     )
// //                   })}
                  
// //                   <button
// //                     onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
// //                     disabled={currentPage === totalPages}
// //                     className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
// //                   >
// //                     <ChevronRight className="w-4 h-4" />
// //                   </button>
// //                 </div>
// //               </div>
// //             </div>
// //           )}
// //         </div>

// //         {/* Statistiques */}
// //         <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
// //           <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-4">
// //             <div className="text-sm text-blue-800 font-medium">Total Utilisateurs</div>
// //             <div className="text-2xl font-bold text-blue-900 mt-1">{users.length}</div>
// //           </div>
          
// //           <div className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-xl p-4">
// //             <div className="text-sm text-green-800 font-medium">Utilisateurs Actifs</div>
// //             <div className="text-2xl font-bold text-green-900 mt-1">
// //               {users.filter(u => u.is_active).length}
// //             </div>
// //           </div>
          
// //           <div className="bg-gradient-to-r from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-4">
// //             <div className="text-sm text-purple-800 font-medium">Vendeurs</div>
// //             <div className="text-2xl font-bold text-purple-900 mt-1">
// //               {users.filter(u => u.role === 'vendor').length}
// //             </div>
// //           </div>
// //         </div>
// //       </div>

// //       {/* Modal de visualisation utilisateur */}
// //       {showViewModal && selectedUser && (
// //         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
// //           <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
// //             {/* Header */}
// //             <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
// //               <h3 className="text-lg font-semibold text-gray-900">Détails de l&apos;utilisateur</h3>
// //               <button
// //                 onClick={() => {
// //                   setShowViewModal(false)
// //                   setSelectedUser(null)
// //                 }}
// //                 className="p-1 hover:bg-gray-100 rounded-lg transition"
// //               >
// //                 <X className="w-5 h-5" />
// //               </button>
// //             </div>

// //             {/* Contenu */}
// //             <div className="p-6">
// //               {/* En-tête avec photo et nom */}
// //               <div className="flex items-start space-x-4 mb-6">
// //                 <div className="relative h-20 w-20 rounded-full overflow-hidden bg-gradient-to-r from-blue-100 to-blue-200">
// //                   {selectedUser.profile_image ? (
// //                     <Image
// //                       src={`${supabase.storage.from('avatars').getPublicUrl(selectedUser.profile_image).data.publicUrl}?t=${Date.now()}`}
// //                       alt={selectedUser.full_name}
// //                       fill
// //                       className="object-cover"
// //                       unoptimized
// //                     />
// //                   ) : (
// //                     <div className="w-full h-full flex items-center justify-center">
// //                       <User className="w-10 h-10 text-blue-600" />
// //                     </div>
// //                   )}
// //                 </div>
// //                 <div>
// //                   <h2 className="text-xl font-bold text-gray-900">{selectedUser.full_name}</h2>
// //                   <div className="flex items-center space-x-3 mt-2">
// //                     <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRoleColor(selectedUser.role)}`}>
// //                       {getRoleIcon(selectedUser.role)} {selectedUser.role === 'super-admin' ? 'Super Admin' :
// //                      selectedUser.role === 'admin' ? 'Administrateur' : 'Vendeur'}
// //                     </span>
// //                     <span className={`px-3 py-1 rounded-full text-sm font-medium ${
// //                       selectedUser.is_active
// //                         ? 'bg-green-100 text-green-800'
// //                         : 'bg-red-100 text-red-800'
// //                     }`}>
// //                       {selectedUser.is_active ? 'Actif' : 'Inactif'}
// //                     </span>
// //                   </div>
// //                 </div>
// //               </div>

// //               {/* Informations détaillées */}
// //               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
// //                 {/* Informations personnelles */}
// //                 <div className="space-y-4">
// //                   <h4 className="font-medium text-gray-900 flex items-center">
// //                     <User className="w-4 h-4 mr-2" />
// //                     Informations personnelles
// //                   </h4>
// //                   <div className="space-y-3">
// //                     <div>
// //                       <div className="text-sm text-gray-500">Nom d&apos;utilisateur</div>
// //                       <div className="font-medium">@{selectedUser.username}</div>
// //                     </div>
// //                     <div>
// //                       <div className="text-sm text-gray-500">Email</div>
// //                       <div className="font-medium flex items-center">
// //                         <Mail className="w-4 h-4 mr-2 text-gray-400" />
// //                         {selectedUser.email}
// //                       </div>
// //                     </div>
// //                     <div>
// //                       <div className="text-sm text-gray-500">Téléphone</div>
// //                       <div className="font-medium flex items-center">
// //                         <Phone className="w-4 h-4 mr-2 text-gray-400" />
// //                         {selectedUser.phone || 'Non renseigné'}
// //                       </div>
// //                     </div>
// //                   </div>
// //                 </div>

// //                 {/* Informations complémentaires */}
// //                 <div className="space-y-4">
// //                   <h4 className="font-medium text-gray-900 flex items-center">
// //                     <Globe className="w-4 h-4 mr-2" />
// //                     Informations complémentaires
// //                   </h4>
// //                   <div className="space-y-3">
// //                     {selectedUser.shop_name && (
// //                       <div>
// //                         <div className="text-sm text-gray-500">Nom du magasin</div>
// //                         <div className="font-medium flex items-center">
// //                           <Store className="w-4 h-4 mr-2 text-gray-400" />
// //                           {selectedUser.shop_name}
// //                         </div>
// //                       </div>
// //                     )}
// //                     {selectedUser.address && (
// //                       <div>
// //                         <div className="text-sm text-gray-500">Adresse</div>
// //                         <div className="font-medium flex items-start">
// //                           <MapPin className="w-4 h-4 mr-2 text-gray-400 mt-0.5" />
// //                           {selectedUser.address}
// //                         </div>
// //                       </div>
// //                     )}
// //                   </div>
// //                 </div>
// //               </div>

// //               {/* Dates */}
// //               <div className="mt-6 pt-6 border-t border-gray-200">
// //                 <h4 className="font-medium text-gray-900 mb-3">Dates importantes</h4>
// //                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// //                   <div>
// //                     <div className="text-sm text-gray-500">Date d&apos;inscription</div>
// //                     <div className="font-medium">{formatDate(selectedUser.created_at)}</div>
// //                   </div>
// //                   <div>
// //                     <div className="text-sm text-gray-500">Dernière mise à jour</div>
// //                     <div className="font-medium">{formatDate(selectedUser.updated_at)}</div>
// //                   </div>
// //                   {selectedUser.last_login && (
// //                     <div>
// //                       <div className="text-sm text-gray-500">Dernière connexion</div>
// //                       <div className="font-medium">{formatDate(selectedUser.last_login)}</div>
// //                     </div>
// //                   )}
// //                 </div>
// //               </div>

// //               {/* Actions */}
// //               <div className="mt-6 pt-6 border-t border-gray-200 flex justify-end space-x-3">
// //                 <button
// //                   onClick={() => {
// //                     setShowViewModal(false)
// //                     handleEditUser(selectedUser)
// //                   }}
// //                   className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
// //                 >
// //                   Modifier
// //                 </button>
// //                 <button
// //                   onClick={() => setShowViewModal(false)}
// //                   className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
// //                 >
// //                   Fermer
// //                 </button>
// //               </div>
// //             </div>
// //           </div>
// //         </div>
// //       )}

// //       {/* Modal de modification utilisateur */}
// //       {showEditModal && editingUser && (
// //         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
// //           <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
// //             {/* Header */}
// //             <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
// //               <h3 className="text-lg font-semibold text-gray-900">Modifier l&apos;utilisateur</h3>
// //               <button
// //                 onClick={() => {
// //                   setShowEditModal(false)
// //                   setEditingUser(null)
// //                 }}
// //                 className="p-1 hover:bg-gray-100 rounded-lg transition"
// //               >
// //                 <X className="w-5 h-5" />
// //               </button>
// //             </div>

// //             {/* Formulaire */}
// //             <div className="p-6">
// //               <form onSubmit={(e) => { e.preventDefault(); handleUpdateUser(); }}>
// //                 <div className="space-y-6">
// //                   {/* Informations de base */}
// //                   <div>
// //                     <h4 className="font-medium text-gray-900 mb-4">Informations de base</h4>
// //                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// //                       <div>
// //                         <label className="block text-sm font-medium text-gray-700 mb-1">
// //                           Nom complet *
// //                         </label>
// //                         <input
// //                           type="text"
// //                           value={editFormData.full_name}
// //                           onChange={(e) => setEditFormData({...editFormData, full_name: e.target.value})}
// //                           className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
// //                           required
// //                         />
// //                       </div>
// //                       <div>
// //                         <label className="block text-sm font-medium text-gray-700 mb-1">
// //                           Email
// //                         </label>
// //                         <input
// //                           type="email"
// //                           value={editingUser.email}
// //                           className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
// //                           disabled
// //                         />
// //                         <p className="text-xs text-gray-500 mt-1">L&apos;email ne peut pas être modifié</p>
// //                       </div>
// //                     </div>
// //                   </div>

// //                   {/* Contact */}
// //                   <div>
// //                     <h4 className="font-medium text-gray-900 mb-4">Contact</h4>
// //                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// //                       <div>
// //                         <label className="block text-sm font-medium text-gray-700 mb-1">
// //                           Téléphone
// //                         </label>
// //                         <input
// //                           type="tel"
// //                           value={editFormData.phone}
// //                           onChange={(e) => setEditFormData({...editFormData, phone: e.target.value})}
// //                           className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
// //                           placeholder="+33 1 23 45 67 89"
// //                         />
// //                       </div>
// //                       {editFormData.role === 'vendor' && (
// //                         <div>
// //                           <label className="block text-sm font-medium text-gray-700 mb-1">
// //                             Nom du magasin
// //                           </label>
// //                           <input
// //                             type="text"
// //                             value={editFormData.shop_name}
// //                             onChange={(e) => setEditFormData({...editFormData, shop_name: e.target.value})}
// //                             className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
// //                             placeholder="Nom du magasin"
// //                           />
// //                         </div>
// //                       )}
// //                     </div>
// //                   </div>

// //                   {/* Adresse */}
// //                   <div>
// //                     <label className="block text-sm font-medium text-gray-700 mb-1">
// //                       Adresse
// //                     </label>
// //                     <textarea
// //                       value={editFormData.address}
// //                       onChange={(e) => setEditFormData({...editFormData, address: e.target.value})}
// //                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
// //                       rows="3"
// //                       placeholder="Adresse complète"
// //                     />
// //                   </div>

// //                   {/* Rôle et statut */}
// //                   <div>
// //                     <h4 className="font-medium text-gray-900 mb-4">Configuration</h4>
// //                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// //                       <div>
// //                         <label className="block text-sm font-medium text-gray-700 mb-1">
// //                           Rôle
// //                         </label>
// //                         <select
// //                           value={editFormData.role}
// //                           onChange={(e) => setEditFormData({...editFormData, role: e.target.value})}
// //                           className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
// //                         >
// //                           <option value="vendor">Vendeur</option>
// //                           <option value="admin">Administrateur</option>
// //                           <option value="super-admin">Super Administrateur</option>
// //                         </select>
// //                       </div>
// //                       <div>
// //                         <label className="block text-sm font-medium text-gray-700 mb-1">
// //                           Statut
// //                         </label>
// //                         <div className="flex items-center space-x-4">
// //                           <label className="flex items-center">
// //                             <input
// //                               type="radio"
// //                               checked={editFormData.is_active}
// //                               onChange={() => setEditFormData({...editFormData, is_active: true})}
// //                               className="mr-2"
// //                             />
// //                             <span className="text-sm">Actif</span>
// //                           </label>
// //                           <label className="flex items-center">
// //                             <input
// //                               type="radio"
// //                               checked={!editFormData.is_active}
// //                               onChange={() => setEditFormData({...editFormData, is_active: false})}
// //                               className="mr-2"
// //                             />
// //                             <span className="text-sm">Inactif</span>
// //                           </label>
// //                         </div>
// //                       </div>
// //                     </div>
// //                   </div>

// //                   {/* Actions */}
// //                   <div className="pt-6 border-t border-gray-200 flex justify-end space-x-3">
// //                     <button
// //                       type="button"
// //                       onClick={() => {
// //                         setShowEditModal(false)
// //                         setEditingUser(null)
// //                       }}
// //                       className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
// //                       disabled={editLoading}
// //                     >
// //                       Annuler
// //                     </button>
// //                     <button
// //                       type="submit"
// //                       disabled={editLoading}
// //                       className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 flex items-center space-x-2"
// //                     >
// //                       {editLoading ? (
// //                         <Loader2 className="w-4 h-4 animate-spin" />
// //                       ) : (
// //                         <Save className="w-4 h-4" />
// //                       )}
// //                       <span>Enregistrer</span>
// //                     </button>
// //                   </div>
// //                 </div>
// //               </form>
// //             </div>
// //           </div>
// //         </div>
// //       )}

// //       {/* Modal de confirmation de suppression */}
// //       {showDeleteModal && selectedUser && (
// //         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
// //           <div className="bg-white rounded-2xl max-w-md w-full p-6">
// //             <div className="text-center">
// //               <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
// //                 <Trash2 className="h-6 w-6 text-red-600" />
// //               </div>
// //               <h3 className="text-lg font-semibold text-gray-900 mb-2">
// //                 Confirmer la suppression
// //               </h3>
// //               <p className="text-gray-600 mb-6">
// //                 Êtes-vous sûr de vouloir supprimer l&apos;utilisateur{' '}
// //                 <span className="font-semibold">{selectedUser.full_name}</span> ?
// //                 Cette action est irréversible.
// //               </p>
// //               <div className="flex justify-center space-x-3">
// //                 <button
// //                   onClick={() => {
// //                     setShowDeleteModal(false)
// //                     setSelectedUser(null)
// //                   }}
// //                   className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
// //                   disabled={actionLoading}
// //                 >
// //                   Annuler
// //                 </button>
// //                 <button
// //                   onClick={handleDeleteUser}
// //                   disabled={actionLoading}
// //                   className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50 flex items-center space-x-2"
// //                 >
// //                   {actionLoading && <Loader2 className="w-4 h-4 animate-spin" />}
// //                   <span>Supprimer</span>
// //                 </button>
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
// import { checkAuth } from '@/lib/auth'
// import Image from 'next/image'
// import {
//   Search,
//   Filter,
//   UserPlus,
//   Edit,
//   Trash2,
//   User,
//   Mail,
//   Phone,
//   Shield,
//   CheckCircle,
//   XCircle,
//   ChevronLeft,
//   ChevronRight,
//   Loader2,
//   Users,
//   Calendar,
//   Eye,
//   MapPin,
//   Store,
//   Globe,
//   Save,
//   X,
//   Key,
//   Eye as EyeOpen,
//   EyeOff,
//   AlertCircle
// } from 'lucide-react'

// export default function UsersManagementPage() {
//   const [users, setUsers] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [searchTerm, setSearchTerm] = useState('')
//   const [roleFilter, setRoleFilter] = useState('all')
//   const [statusFilter, setStatusFilter] = useState('all')
//   const [currentPage, setCurrentPage] = useState(1)
//   const [itemsPerPage] = useState(10)
//   const [selectedUser, setSelectedUser] = useState(null)
//   const [editingUser, setEditingUser] = useState(null)
//   const [editFormData, setEditFormData] = useState({})
//   const [passwordData, setPasswordData] = useState({
//     newPassword: '',
//     confirmPassword: ''
//   })
//   const [showPassword, setShowPassword] = useState(false)
//   const [showDeleteModal, setShowDeleteModal] = useState(false)
//   const [showViewModal, setShowViewModal] = useState(false)
//   const [showEditModal, setShowEditModal] = useState(false)
//   const [actionLoading, setActionLoading] = useState(false)
//   const [editLoading, setEditLoading] = useState(false)
//   const [passwordError, setPasswordError] = useState('')
//   const router = useRouter()

//   useEffect(() => {
//     checkPermissions()
//     fetchUsers()
//   }, [])

//   const checkPermissions = () => {
//     const currentUser = checkAuth()
//     if (!currentUser || (currentUser.role !== 'super-admin' && currentUser.role !== 'admin')) {
//       router.push('/dashboard')
//     }
//   }

//   const fetchUsers = async () => {
//     try {
//       const { data, error } = await supabase
//         .from('users')
//         .select('*')
//         .order('created_at', { ascending: false })

//       if (error) throw error
//       setUsers(data || [])
//     } catch (error) {
//       console.error('Erreur récupération utilisateurs:', error)
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleViewUser = (user) => {
//     setSelectedUser(user)
//     setShowViewModal(true)
//   }

//   const handleEditUser = (user) => {
//     setEditingUser(user)
//     setEditFormData({
//       full_name: user.full_name || '',
//       email: user.email || '',
//       phone: user.phone || '',
//       address: user.address || '',
//       shop_name: user.shop_name || '',
//       role: user.role || 'vendor',
//       is_active: user.is_active
//     })
//     setPasswordData({
//       newPassword: '',
//       confirmPassword: ''
//     })
//     setPasswordError('')
//     setShowEditModal(true)
//   }

//   const handleUpdateUser = async () => {
//     if (!editingUser) return

//     try {
//       setEditLoading(true)
      
//       const updates = {
//         full_name: editFormData.full_name,
//         phone: editFormData.phone,
//         address: editFormData.address,
//         shop_name: editFormData.shop_name,
//         role: editFormData.role,
//         is_active: editFormData.is_active,
//         updated_at: new Date().toISOString()
//       }

//       const { error } = await supabase
//         .from('users')
//         .update(updates)
//         .eq('id', editingUser.id)

//       if (error) throw error

//       // Mettre à jour localement
//       setUsers(users.map(u => 
//         u.id === editingUser.id ? { ...u, ...updates } : u
//       ))

//       // Si le mot de passe est renseigné et validé, le changer
//       if (passwordData.newPassword && passwordData.newPassword === passwordData.confirmPassword) {
//         await handlePasswordChange()
//       }

//       setShowEditModal(false)
//       setEditingUser(null)
      
//       alert('Utilisateur mis à jour avec succès!')
//     } catch (error) {
//       console.error('Erreur mise à jour utilisateur:', error)
//       alert('Erreur lors de la mise à jour')
//     } finally {
//       setEditLoading(false)
//     }
//   }

//   const handlePasswordChange = async () => {
//     if (!editingUser) return

//     // Vérifier que les mots de passe correspondent
//     if (passwordData.newPassword !== passwordData.confirmPassword) {
//       setPasswordError('Les mots de passe ne correspondent pas')
//       return
//     }

//     // Vérifier la longueur du mot de passe
//     if (passwordData.newPassword.length < 6) {
//       setPasswordError('Le mot de passe doit contenir au moins 6 caractères')
//       return
//     }

//     try {
//       // Mettre à jour le mot de passe dans la base de données
//       // Note: Dans une application réelle, vous utiliseriez une méthode sécurisée
//       // Pour l'exemple, on met à jour directement
//       const { error } = await supabase
//         .from('users')
//         .update({ 
//           password: passwordData.newPassword,
//           updated_at: new Date().toISOString()
//         })
//         .eq('id', editingUser.id)

//       if (error) throw error

//       setPasswordData({
//         newPassword: '',
//         confirmPassword: ''
//       })
//       setPasswordError('')
      
//     } catch (error) {
//       console.error('Erreur changement mot de passe:', error)
//       setPasswordError('Erreur lors du changement de mot de passe')
//     }
//   }

//   const validatePassword = () => {
//     if (!passwordData.newPassword && !passwordData.confirmPassword) {
//       return true // Les champs sont vides, c'est OK
//     }

//     if (!passwordData.newPassword || !passwordData.confirmPassword) {
//       return false // Un seul champ rempli
//     }

//     if (passwordData.newPassword !== passwordData.confirmPassword) {
//       return false
//     }

//     if (passwordData.newPassword.length < 6) {
//       return false
//     }

//     return true
//   }

//   const filteredUsers = users.filter(user => {
//     const matchesSearch = 
//       user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       user.phone?.toLowerCase().includes(searchTerm.toLowerCase())

//     const matchesRole = roleFilter === 'all' || user.role === roleFilter
//     const matchesStatus = statusFilter === 'all' || 
//       (statusFilter === 'active' && user.is_active) ||
//       (statusFilter === 'inactive' && !user.is_active)

//     return matchesSearch && matchesRole && matchesStatus
//   })

//   const paginatedUsers = filteredUsers.slice(
//     (currentPage - 1) * itemsPerPage,
//     currentPage * itemsPerPage
//   )

//   const totalPages = Math.ceil(filteredUsers.length / itemsPerPage)

//   const handleDeleteUser = async () => {
//     if (!selectedUser) return

//     try {
//       setActionLoading(true)
      
//       // Supprimer la photo de profil si elle existe
//       if (selectedUser.profile_image) {
//         await supabase.storage
//           .from('avatars')
//           .remove([selectedUser.profile_image])
//       }

//       // Supprimer l'utilisateur
//       const { error } = await supabase
//         .from('users')
//         .delete()
//         .eq('id', selectedUser.id)

//       if (error) throw error

//       // Mettre à jour la liste
//       setUsers(users.filter(u => u.id !== selectedUser.id))
//       setShowDeleteModal(false)
//       setSelectedUser(null)
      
//     } catch (error) {
//       console.error('Erreur suppression utilisateur:', error)
//       alert('Erreur lors de la suppression')
//     } finally {
//       setActionLoading(false)
//     }
//   }

//   const toggleUserStatus = async (user) => {
//     try {
//       const { error } = await supabase
//         .from('users')
//         .update({ is_active: !user.is_active })
//         .eq('id', user.id)

//       if (error) throw error

//       // Mettre à jour localement
//       setUsers(users.map(u => 
//         u.id === user.id ? { ...u, is_active: !u.is_active } : u
//       ))
      
//     } catch (error) {
//       console.error('Erreur changement statut:', error)
//       alert('Erreur lors du changement de statut')
//     }
//   }

//   const getRoleColor = (role) => {
//     switch (role) {
//       case 'super-admin': return 'bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800'
//       case 'admin': return 'bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-800'
//       default: return 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800'
//     }
//   }

//   const getRoleIcon = (role) => {
//     switch (role) {
//       case 'super-admin': return '👑'
//       case 'admin': return '🛡️'
//       default: return '👤'
//     }
//   }

//   const formatDate = (date) => {
//     return new Date(date).toLocaleDateString('fr-FR', {
//       day: '2-digit',
//       month: '2-digit',
//       year: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     })
//   }

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
//         <div className="flex flex-col items-center space-y-4">
//           <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
//           <div className="text-gray-600">Chargement des utilisateurs...</div>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="min-h-screen  overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6 lg:p-8">
//       <div className="max-w-">
//         {/* Header */}
//         <div className="mb-8">
//           <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
//             <div>
//               <h1 className="text-3xl font-bold text-gray-900 flex items-center">
//                 <Users className="w-8 h-8 mr-3 text-blue-600" />
//                 Gestion des Utilisateurs
//               </h1>
//               <p className="text-gray-600 mt-2">
//                 {filteredUsers.length} utilisateur{filteredUsers.length !== 1 ? 's' : ''} trouvé{filteredUsers.length !== 1 ? 's' : ''}
//               </p>
//             </div>
            
//             <button
//               onClick={() => router.push('/super-admin/auth/register')}
//               className="inline-flex items-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition shadow-sm"
//             >
//               <UserPlus className="w-4 h-4" />
//               <span>Nouvel utilisateur</span>
//             </button>
//           </div>
//         </div>

//         {/* Filtres et recherche */}
//         <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
//           <div className="flex flex-col lg:flex-row gap-4">
//             <div className="flex-1">
//               <div className="relative">
//                 <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//                 <input
//                   type="text"
//                   placeholder="Rechercher par nom, email ou téléphone..."
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
//                 />
//               </div>
//             </div>
//             <div className="flex flex-wrap gap-3">
//               <select
//                 value={roleFilter}
//                 onChange={(e) => setRoleFilter(e.target.value)}
//                 className="px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
//               >
//                 <option value="all">Tous les rôles</option>
//                 <option value="super-admin">Super Admin</option>
//                 <option value="admin">Administrateur</option>
//                 <option value="vendor">Vendeur</option>
//               </select>
//               <select
//                 value={statusFilter}
//                 onChange={(e) => setStatusFilter(e.target.value)}
//                 className="px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
//               >
//                 <option value="all">Tous les statuts</option>
//                 <option value="active">Actif</option>
//                 <option value="inactive">Inactif</option>
//               </select>
//               <button
//                 onClick={() => {
//                   setSearchTerm('')
//                   setRoleFilter('all')
//                   setStatusFilter('all')
//                 }}
//                 className="px-4 py-2.5 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
//               >
//                 Réinitialiser
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Tableau des utilisateurs */}
//         <div className="bg-white rounded-xl shadow-sm overflow-hidden">
//           <div className="overflow-x-auto">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Utilisateur</th>
//                   <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rôle</th>
//                   <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
//                   <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
//                   <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date d&apos;inscription</th>
//                   <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {paginatedUsers.length === 0 ? (
//                   <tr>
//                     <td colSpan="6" className="px-6 py-12 text-center">
//                       <div className="flex flex-col items-center justify-center space-y-3">
//                         <User className="w-12 h-12 text-gray-400" />
//                         <div className="text-gray-500">Aucun utilisateur trouvé</div>
//                       </div>
//                     </td>
//                   </tr>
//                 ) : (
//                   paginatedUsers.map((user) => (
//                     <tr key={user.id} className="hover:bg-gray-50 transition">
//                       <td className="px-6 py-4">
//                         <div className="flex items-center">
//                           <div className="flex-shrink-0 h-10 w-10">
//                             {user.profile_image ? (
//                               <div className="relative h-10 w-10 rounded-full overflow-hidden">
//                                 <Image
//                                   src={`${supabase.storage.from('avatars').getPublicUrl(user.profile_image).data.publicUrl}?t=${Date.now()}`}
//                                   alt={user.full_name}
//                                   fill
//                                   className="object-cover"
//                                   unoptimized
//                                 />
//                               </div>
//                             ) : (
//                               <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-100 to-blue-200 flex items-center justify-center">
//                                 <User className="w-5 h-5 text-blue-600" />
//                               </div>
//                             )}
//                           </div>
//                           <div className="ml-4">
//                             <div className="text-sm font-medium text-gray-900">{user.full_name}</div>
//                             <div className="text-sm text-gray-500">@{user.username}</div>
//                           </div>
//                         </div>
//                       </td>
//                       <td className="px-6 py-4">
//                         <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
//                           <span className="mr-1.5">{getRoleIcon(user.role)}</span>
//                           {user.role === 'super-admin' ? 'Super Admin' : user.role === 'admin' ? 'Administrateur' : 'Vendeur'}
//                         </span>
//                         {user.shop_name && <div className="text-xs text-gray-500 mt-1">{user.shop_name}</div>}
//                       </td>
//                       <td className="px-6 py-4">
//                         <div className="text-sm text-gray-900 flex items-center">
//                           <Mail className="w-4 h-4 mr-2 text-gray-400" />
//                           {user.email}
//                         </div>
//                         {user.phone && (
//                           <div className="text-sm text-gray-500 flex items-center mt-1">
//                             <Phone className="w-4 h-4 mr-2" />
//                             {user.phone}
//                           </div>
//                         )}
//                       </td>
//                       <td className="px-6 py-4">
//                         <button
//                           onClick={() => toggleUserStatus(user)}
//                           className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium transition ${
//                             user.is_active ? 'bg-green-100 text-green-800 hover:bg-green-200' : 'bg-red-100 text-red-800 hover:bg-red-200'
//                           }`}
//                         >
//                           {user.is_active ? (
//                             <>
//                               <CheckCircle className="w-3 h-3 mr-1.5" />
//                               Actif
//                             </>
//                           ) : (
//                             <>
//                               <XCircle className="w-3 h-3 mr-1.5" />
//                               Inactif
//                             </>
//                           )}
//                         </button>
//                       </td>
//                       <td className="px-6 py-4 text-sm text-gray-500">
//                         <div className="flex items-center">
//                           <Calendar className="w-4 h-4 mr-2 text-gray-400" />
//                           {formatDate(user.created_at)}
//                         </div>
//                         {user.last_login && (
//                           <div className="text-xs text-gray-400 mt-1">
//                             Dernière connexion: {formatDate(user.last_login)}
//                           </div>
//                         )}
//                       </td>
//                       <td className="px-6 py-4 text-sm font-medium">
//                         <div className="flex items-center space-x-2">
//                           <button onClick={() => handleViewUser(user)} className="p-1.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition" title="Voir détails">
//                             <Eye className="w-4 h-4" />
//                           </button>
//                           <button onClick={() => handleEditUser(user)} className="p-1.5 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded transition" title="Modifier">
//                             <Edit className="w-4 h-4" />
//                           </button>
//                           <button onClick={() => { setSelectedUser(user); setShowDeleteModal(true); }} className="p-1.5 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded transition" title="Supprimer">
//                             <Trash2 className="w-4 h-4" />
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))
//                 )}
//               </tbody>
//             </table>
//           </div>
//           {totalPages > 1 && (
//             <div className="px-6 py-4 border-t border-gray-200">
//               <div className="flex items-center justify-between">
//                 <div className="text-sm text-gray-700">Page {currentPage} sur {totalPages}</div>
//                 <div className="flex items-center space-x-2">
//                   <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition">
//                     <ChevronLeft className="w-4 h-4" />
//                   </button>
//                   {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
//                     let pageNum
//                     if (totalPages <= 5) pageNum = i + 1
//                     else if (currentPage <= 3) pageNum = i + 1
//                     else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i
//                     else pageNum = currentPage - 2 + i
//                     return (
//                       <button key={pageNum} onClick={() => setCurrentPage(pageNum)} className={`w-8 h-8 flex items-center justify-center rounded-lg transition ${currentPage === pageNum ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}>
//                         {pageNum}
//                       </button>
//                     )
//                   })}
//                   <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition">
//                     <ChevronRight className="w-4 h-4" />
//                   </button>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>

//         <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
//           <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-4">
//             <div className="text-sm text-blue-800 font-medium">Total Utilisateurs</div>
//             <div className="text-2xl font-bold text-blue-900 mt-1">{users.length}</div>
//           </div>
//           <div className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-xl p-4">
//             <div className="text-sm text-green-800 font-medium">Utilisateurs Actifs</div>
//             <div className="text-2xl font-bold text-green-900 mt-1">{users.filter(u => u.is_active).length}</div>
//           </div>
//           <div className="bg-gradient-to-r from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-4">
//             <div className="text-sm text-purple-800 font-medium">Vendeurs</div>
//             <div className="text-2xl font-bold text-purple-900 mt-1">{users.filter(u => u.role === 'vendor').length}</div>
//           </div>
//         </div>
//       </div>

//       {/* Modal de visualisation utilisateur */}
//       {showViewModal && selectedUser && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//           <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
//             <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
//               <h3 className="text-lg font-semibold text-gray-900">Détails de l&apos;utilisateur</h3>
//               <button onClick={() => { setShowViewModal(false); setSelectedUser(null); }} className="p-1 hover:bg-gray-100 rounded-lg transition">
//                 <X className="w-5 h-5" />
//               </button>
//             </div>
//             <div className="p-6">
//               <div className="flex items-start space-x-4 mb-6">
//                 <div className="relative h-20 w-20 rounded-full overflow-hidden bg-gradient-to-r from-blue-100 to-blue-200">
//                   {selectedUser.profile_image ? (
//                     <Image
//                       src={`${supabase.storage.from('avatars').getPublicUrl(selectedUser.profile_image).data.publicUrl}?t=${Date.now()}`}
//                       alt={selectedUser.full_name}
//                       fill
//                       className="object-cover"
//                       unoptimized
//                     />
//                   ) : (
//                     <div className="w-full h-full flex items-center justify-center">
//                       <User className="w-10 h-10 text-blue-600" />
//                     </div>
//                   )}
//                 </div>
//                 <div>
//                   <h2 className="text-xl font-bold text-gray-900">{selectedUser.full_name}</h2>
//                   <div className="flex items-center space-x-3 mt-2">
//                     <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRoleColor(selectedUser.role)}`}>
//                       {getRoleIcon(selectedUser.role)} {selectedUser.role === 'super-admin' ? 'Super Admin' : selectedUser.role === 'admin' ? 'Administrateur' : 'Vendeur'}
//                     </span>
//                     <span className={`px-3 py-1 rounded-full text-sm font-medium ${selectedUser.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
//                       {selectedUser.is_active ? 'Actif' : 'Inactif'}
//                     </span>
//                   </div>
//                 </div>
//               </div>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div className="space-y-4">
//                   <h4 className="font-medium text-gray-900 flex items-center"><User className="w-4 h-4 mr-2" />Informations personnelles</h4>
//                   <div className="space-y-3">
//                     <div><div className="text-sm text-gray-500">Nom d&apos;utilisateur</div><div className="font-medium">@{selectedUser.username}</div></div>
//                     <div><div className="text-sm text-gray-500">Email</div><div className="font-medium flex items-center"><Mail className="w-4 h-4 mr-2 text-gray-400" />{selectedUser.email}</div></div>
//                     <div><div className="text-sm text-gray-500">Téléphone</div><div className="font-medium flex items-center"><Phone className="w-4 h-4 mr-2 text-gray-400" />{selectedUser.phone || 'Non renseigné'}</div></div>
//                   </div>
//                 </div>
//                 <div className="space-y-4">
//                   <h4 className="font-medium text-gray-900 flex items-center"><Globe className="w-4 h-4 mr-2" />Informations complémentaires</h4>
//                   <div className="space-y-3">
//                     {selectedUser.shop_name && <div><div className="text-sm text-gray-500">Nom du magasin</div><div className="font-medium flex items-center"><Store className="w-4 h-4 mr-2 text-gray-400" />{selectedUser.shop_name}</div></div>}
//                     {selectedUser.address && <div><div className="text-sm text-gray-500">Adresse</div><div className="font-medium flex items-start"><MapPin className="w-4 h-4 mr-2 text-gray-400 mt-0.5" />{selectedUser.address}</div></div>}
//                   </div>
//                 </div>
//               </div>
//               <div className="mt-6 pt-6 border-t border-gray-200">
//                 <h4 className="font-medium text-gray-900 mb-3">Dates importantes</h4>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div><div className="text-sm text-gray-500">Date d&apos;inscription</div><div className="font-medium">{formatDate(selectedUser.created_at)}</div></div>
//                   <div><div className="text-sm text-gray-500">Dernière mise à jour</div><div className="font-medium">{formatDate(selectedUser.updated_at)}</div></div>
//                   {selectedUser.last_login && <div><div className="text-sm text-gray-500">Dernière connexion</div><div className="font-medium">{formatDate(selectedUser.last_login)}</div></div>}
//                 </div>
//               </div>
//               <div className="mt-6 pt-6 border-t border-gray-200 flex justify-end space-x-3">
//                 <button onClick={() => { setShowViewModal(false); handleEditUser(selectedUser); }} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">Modifier</button>
//                 <button onClick={() => setShowViewModal(false)} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition">Fermer</button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Modal de modification utilisateur */}
//       {showEditModal && editingUser && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//           <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
//             <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
//               <h3 className="text-lg font-semibold text-gray-900">Modifier l&apos;utilisateur</h3>
//               <button
//                 onClick={() => {
//                   setShowEditModal(false)
//                   setEditingUser(null)
//                 }}
//                 className="p-1 hover:bg-gray-100 rounded-lg transition"
//               >
//                 <X className="w-5 h-5" />
//               </button>
//             </div>

//             <div className="p-6">
//               <form onSubmit={(e) => { e.preventDefault(); handleUpdateUser(); }}>
//                 <div className="space-y-6">
//                   {/* Informations de base */}
//                   <div>
//                     <h4 className="font-medium text-gray-900 mb-4">Informations de base</h4>
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                           Nom complet *
//                         </label>
//                         <input
//                           type="text"
//                           value={editFormData.full_name}
//                           onChange={(e) => setEditFormData({...editFormData, full_name: e.target.value})}
//                           className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                           required
//                         />
//                       </div>
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                           Email
//                         </label>
//                         <input
//                           type="email"
//                           value={editingUser.email}
//                           className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
//                           disabled
//                         />
//                         <p className="text-xs text-gray-500 mt-1">L&apos;email ne peut pas être modifié</p>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Contact */}
//                   <div>
//                     <h4 className="font-medium text-gray-900 mb-4">Contact</h4>
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                           Téléphone
//                         </label>
//                         <input
//                           type="tel"
//                           value={editFormData.phone}
//                           onChange={(e) => setEditFormData({...editFormData, phone: e.target.value})}
//                           className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                           placeholder="+33 1 23 45 67 89"
//                         />
//                       </div>
//                       {editFormData.role === 'vendor' && (
//                         <div>
//                           <label className="block text-sm font-medium text-gray-700 mb-1">
//                             Nom du magasin
//                           </label>
//                           <input
//                             type="text"
//                             value={editFormData.shop_name}
//                             onChange={(e) => setEditFormData({...editFormData, shop_name: e.target.value})}
//                             className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                             placeholder="Nom du magasin"
//                           />
//                         </div>
//                       )}
//                     </div>
//                   </div>

//                   {/* Adresse */}
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Adresse
//                     </label>
//                     <textarea
//                       value={editFormData.address}
//                       onChange={(e) => setEditFormData({...editFormData, address: e.target.value})}
//                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                       rows="3"
//                       placeholder="Adresse complète"
//                     />
//                   </div>

//                   {/* Changement de mot de passe */}
//                   <div className="border-t border-gray-200 pt-6">
//                     <h4 className="font-medium text-gray-900 mb-4 flex items-center">
//                       <Key className="w-5 h-5 mr-2 text-amber-500" />
//                       Changer le mot de passe
//                     </h4>
//                     <div className="space-y-4 bg-amber-50 p-4 rounded-lg border border-amber-200">
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                           Nouveau mot de passe
//                         </label>
//                         <div className="relative">
//                           <input
//                             type={showPassword ? "text" : "password"}
//                             value={passwordData.newPassword}
//                             onChange={(e) => {
//                               setPasswordData({...passwordData, newPassword: e.target.value})
//                               if (passwordData.confirmPassword) {
//                                 if (e.target.value !== passwordData.confirmPassword) {
//                                   setPasswordError('Les mots de passe ne correspondent pas')
//                                 } else if (e.target.value.length < 6) {
//                                   setPasswordError('Le mot de passe doit contenir au moins 6 caractères')
//                                 } else {
//                                   setPasswordError('')
//                                 }
//                               }
//                             }}
//                             className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 pr-10"
//                             placeholder="Laissez vide pour ne pas changer"
//                           />
//                           <button
//                             type="button"
//                             onClick={() => setShowPassword(!showPassword)}
//                             className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
//                           >
//                             {showPassword ? <EyeOff className="w-4 h-4" /> : <EyeOpen className="w-4 h-4" />}
//                           </button>
//                         </div>
//                       </div>
                      
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                           Confirmer le mot de passe
//                         </label>
//                         <input
//                           type={showPassword ? "text" : "password"}
//                           value={passwordData.confirmPassword}
//                           onChange={(e) => {
//                             setPasswordData({...passwordData, confirmPassword: e.target.value})
//                             if (passwordData.newPassword) {
//                               if (e.target.value !== passwordData.newPassword) {
//                                 setPasswordError('Les mots de passe ne correspondent pas')
//                               } else if (e.target.value.length < 6) {
//                                 setPasswordError('Le mot de passe doit contenir au moins 6 caractères')
//                               } else {
//                                 setPasswordError('')
//                               }
//                             }
//                           }}
//                           className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
//                           placeholder="Confirmez le nouveau mot de passe"
//                         />
//                       </div>

//                       {passwordError && (
//                         <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg">
//                           <AlertCircle className="w-4 h-4" />
//                           <span className="text-sm">{passwordError}</span>
//                         </div>
//                       )}

//                       <div className="text-xs text-amber-700">
//                         <p>⚠️ Laissez vide si vous ne souhaitez pas changer le mot de passe.</p>
//                         <p className="mt-1">Le mot de passe doit contenir au moins 6 caractères.</p>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Rôle et statut */}
//                   <div>
//                     <h4 className="font-medium text-gray-900 mb-4">Configuration</h4>
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                           Rôle
//                         </label>
//                         <select
//                           value={editFormData.role}
//                           onChange={(e) => setEditFormData({...editFormData, role: e.target.value})}
//                           className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                         >
//                           <option value="vendor">Vendeur</option>
//                           <option value="admin">Administrateur</option>
//                           <option value="super-admin">Super Administrateur</option>
//                         </select>
//                       </div>
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                           Statut
//                         </label>
//                         <div className="flex items-center space-x-4">
//                           <label className="flex items-center">
//                             <input
//                               type="radio"
//                               checked={editFormData.is_active}
//                               onChange={() => setEditFormData({...editFormData, is_active: true})}
//                               className="mr-2"
//                             />
//                             <span className="text-sm">Actif</span>
//                           </label>
//                           <label className="flex items-center">
//                             <input
//                               type="radio"
//                               checked={!editFormData.is_active}
//                               onChange={() => setEditFormData({...editFormData, is_active: false})}
//                               className="mr-2"
//                             />
//                             <span className="text-sm">Inactif</span>
//                           </label>
//                         </div>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Actions */}
//                   <div className="pt-6 border-t border-gray-200 flex justify-end space-x-3">
//                     <button
//                       type="button"
//                       onClick={() => {
//                         setShowEditModal(false)
//                         setEditingUser(null)
//                       }}
//                       className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
//                       disabled={editLoading}
//                     >
//                       Annuler
//                     </button>
//                     <button
//                       type="submit"
//                       disabled={editLoading}
//                       className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 flex items-center space-x-2"
//                     >
//                       {editLoading ? (
//                         <Loader2 className="w-4 h-4 animate-spin" />
//                       ) : (
//                         <Save className="w-4 h-4" />
//                       )}
//                       <span>Enregistrer</span>
//                     </button>
//                   </div>
//                 </div>
//               </form>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Modal de confirmation de suppression */}
//       {showDeleteModal && selectedUser && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//           <div className="bg-white rounded-2xl max-w-md w-full p-6">
//             <div className="text-center">
//               <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
//                 <Trash2 className="h-6 w-6 text-red-600" />
//               </div>
//               <h3 className="text-lg font-semibold text-gray-900 mb-2">Confirmer la suppression</h3>
//               <p className="text-gray-600 mb-6">
//                 Êtes-vous sûr de vouloir supprimer l&apos;utilisateur{' '}
//                 <span className="font-semibold">{selectedUser.full_name}</span> ?
//                 Cette action est irréversible.
//               </p>
//               <div className="flex justify-center space-x-3">
//                 <button onClick={() => { setShowDeleteModal(false); setSelectedUser(null); }} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition" disabled={actionLoading}>Annuler</button>
//                 <button onClick={handleDeleteUser} disabled={actionLoading} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50 flex items-center space-x-2">
//                   {actionLoading && <Loader2 className="w-4 h-4 animate-spin" />}
//                   <span>Supprimer</span>
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
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { checkAuth } from '@/lib/auth'
import Image from 'next/image'
import {
  Search,
  Filter,
  UserPlus,
  Edit,
  Trash2,
  User,
  Mail,
  Phone,
  Shield,
  CheckCircle,
  XCircle,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Users,
  Calendar,
  Eye,
  Store,
  Save,
  X,
  Key,
  Eye as EyeOpen,
  EyeOff,
  AlertCircle,
  MoreVertical,
  Download
} from 'lucide-react'

export default function UsersManagementPage() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [selectedUser, setSelectedUser] = useState(null)
  const [editingUser, setEditingUser] = useState(null)
  const [editFormData, setEditFormData] = useState({})
  const [passwordData, setPasswordData] = useState({
    newPassword: '',
    confirmPassword: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)
  const [editLoading, setEditLoading] = useState(false)
  const [passwordError, setPasswordError] = useState('')
  const [mobileActionMenu, setMobileActionMenu] = useState(null)
  const router = useRouter()

  useEffect(() => {
    checkPermissions()
    fetchUsers()
  }, [])

  const checkPermissions = () => {
    const currentUser = checkAuth()
    if (!currentUser || (currentUser.role !== 'super-admin' && currentUser.role !== 'admin')) {
      router.push('/dashboard')
    }
  }

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setUsers(data || [])
    } catch (error) {
      console.error('Erreur récupération utilisateurs:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleViewUser = (user) => {
    setSelectedUser(user)
    setShowViewModal(true)
  }

  const handleEditUser = (user) => {
    setEditingUser(user)
    setEditFormData({
      full_name: user.full_name || '',
      email: user.email || '',
      phone: user.phone || '',
      address: user.address || '',
      shop_name: user.shop_name || '',
      role: user.role || 'vendor',
      is_active: user.is_active
    })
    setPasswordData({
      newPassword: '',
      confirmPassword: ''
    })
    setPasswordError('')
    setShowEditModal(true)
  }

  const handleUpdateUser = async () => {
    if (!editingUser) return

    try {
      setEditLoading(true)
      
      const updates = {
        full_name: editFormData.full_name,
        phone: editFormData.phone,
        address: editFormData.address,
        shop_name: editFormData.shop_name,
        role: editFormData.role,
        is_active: editFormData.is_active,
        updated_at: new Date().toISOString()
      }

      const { error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', editingUser.id)

      if (error) throw error

      setUsers(users.map(u => 
        u.id === editingUser.id ? { ...u, ...updates } : u
      ))

      if (passwordData.newPassword && passwordData.newPassword === passwordData.confirmPassword) {
        await handlePasswordChange()
      }

      setShowEditModal(false)
      setEditingUser(null)
      
      alert('Utilisateur mis à jour avec succès!')
    } catch (error) {
      console.error('Erreur mise à jour utilisateur:', error)
      alert('Erreur lors de la mise à jour')
    } finally {
      setEditLoading(false)
    }
  }

  const handlePasswordChange = async () => {
    if (!editingUser) return

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('Les mots de passe ne correspondent pas')
      return
    }

    if (passwordData.newPassword.length < 6) {
      setPasswordError('Le mot de passe doit contenir au moins 6 caractères')
      return
    }

    try {
      const { error } = await supabase
        .from('users')
        .update({ 
          password: passwordData.newPassword,
          updated_at: new Date().toISOString()
        })
        .eq('id', editingUser.id)

      if (error) throw error

      setPasswordData({
        newPassword: '',
        confirmPassword: ''
      })
      setPasswordError('')
      
    } catch (error) {
      console.error('Erreur changement mot de passe:', error)
      setPasswordError('Erreur lors du changement de mot de passe')
    }
  }

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesRole = roleFilter === 'all' || user.role === roleFilter
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'active' && user.is_active) ||
      (statusFilter === 'inactive' && !user.is_active)

    return matchesSearch && matchesRole && matchesStatus
  })

  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage)

  const handleDeleteUser = async () => {
    if (!selectedUser) return

    try {
      setActionLoading(true)
      
      if (selectedUser.profile_image) {
        await supabase.storage
          .from('avatars')
          .remove([selectedUser.profile_image])
      }

      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', selectedUser.id)

      if (error) throw error

      setUsers(users.filter(u => u.id !== selectedUser.id))
      setShowDeleteModal(false)
      setSelectedUser(null)
      
    } catch (error) {
      console.error('Erreur suppression utilisateur:', error)
      alert('Erreur lors de la suppression')
    } finally {
      setActionLoading(false)
    }
  }

  const toggleUserStatus = async (user) => {
    try {
      const { error } = await supabase
        .from('users')
        .update({ is_active: !user.is_active })
        .eq('id', user.id)

      if (error) throw error

      setUsers(users.map(u => 
        u.id === user.id ? { ...u, is_active: !u.is_active } : u
      ))
      
    } catch (error) {
      console.error('Erreur changement statut:', error)
      alert('Erreur lors du changement de statut')
    }
  }

  const getRoleColor = (role) => {
    switch (role) {
      case 'super-admin': return 'bg-purple-100 text-purple-800'
      case 'admin': return 'bg-blue-100 text-blue-800'
      default: return 'bg-green-100 text-green-800'
    }
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin text-gray-600" />
          <div className="text-gray-500">Chargement des utilisateurs...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w">
        {/* Header */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center">
                <Users className="w-6 h-6 sm:w-7 sm:h-7 mr-3 text-gray-700" />
                Gestion des Utilisateurs
              </h1>
              <p className="text-gray-500 text-sm mt-1">
                {filteredUsers.length} utilisateur{filteredUsers.length !== 1 ? 's' : ''} trouvé{filteredUsers.length !== 1 ? 's' : ''}
              </p>
            </div>
            
            <button
              onClick={() => router.push('/super-admin/auth/register')}
              className="inline-flex items-center justify-center space-x-2 px-4 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition text-sm w-full sm:w-auto"
            >
              <UserPlus className="w-4 h-4" />
              <span>Nouvel utilisateur</span>
            </button>
          </div>
        </div>

        {/* Bloc unifié: Recherche, filtres et stats */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
          {/* Stats en ligne */}
          <div className="grid grid-cols-3 gap-4 mb-4 pb-4 border-b border-gray-200">
            <div className="text-center">
              <div className="text-lg font-bold text-gray-900">{users.length}</div>
              <div className="text-xs text-gray-500 mt-0.5">Total</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-gray-900">{users.filter(u => u.is_active).length}</div>
              <div className="text-xs text-gray-500 mt-0.5">Actifs</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-gray-900">{users.filter(u => u.role === 'vendor').length}</div>
              <div className="text-xs text-gray-500 mt-0.5">Vendeurs</div>
            </div>
          </div>

          {/* Recherche et filtres */}
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Rechercher..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-gray-900 focus:border-gray-900 transition text-sm"
                />
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="flex-1 sm:flex-none px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-gray-900 focus:border-gray-900 bg-white text-sm min-w-[140px]"
              >
                <option value="all">Tous les rôles</option>
                <option value="super-admin">Super Admin</option>
                <option value="admin">Administrateur</option>
                <option value="vendor">Vendeur</option>
              </select>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="flex-1 sm:flex-none px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-gray-900 focus:border-gray-900 bg-white text-sm min-w-[120px]"
              >
                <option value="all">Tous les statuts</option>
                <option value="active">Actif</option>
                <option value="inactive">Inactif</option>
              </select>
              <button
                onClick={() => {
                  setSearchTerm('')
                  setRoleFilter('all')
                  setStatusFilter('all')
                }}
                className="px-3 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm"
              >
                <Filter className="w-4 h-4 inline sm:hidden" />
                <span className="hidden sm:inline">Réinitialiser</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tableau des utilisateurs */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Utilisateur</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rôle</th>
                  <th scope="col" className="hidden sm:table-cell px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                  <th scope="col" className="hidden md:table-cell px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Inscription</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedUsers.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-4 py-8 text-center">
                      <div className="flex flex-col items-center justify-center space-y-3">
                        <User className="w-10 h-10 text-gray-400" />
                        <div className="text-gray-500">Aucun utilisateur trouvé</div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginatedUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50 transition">
                      <td className="px-4 py-3">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-8 w-8 sm:h-10 sm:w-10">
                            {user.profile_image ? (
                              <div className="relative h-8 w-8 sm:h-10 sm:w-10 rounded-full overflow-hidden">
                                <img
                                  src={`${supabase.storage.from('avatars').getPublicUrl(user.profile_image).data.publicUrl}?t=${Date.now()}`}
                                  alt={user.full_name}
                                  className="object-cover w-full h-full"
                                />
                              </div>
                            ) : (
                              <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-gray-100 flex items-center justify-center">
                                <User className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                              </div>
                            )}
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">{user.full_name}</div>
                            <div className="text-xs text-gray-500 truncate max-w-[120px] sm:max-w-none">@{user.username}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                          {user.role === 'super-admin' ? 'Super Admin' : user.role === 'admin' ? 'Admin' : 'Vendeur'}
                        </span>
                        {user.shop_name && (
                          <div className="text-xs text-gray-500 truncate max-w-[80px] sm:max-w-none mt-1">
                            {user.shop_name}
                          </div>
                        )}
                      </td>
                      <td className="hidden sm:table-cell px-4 py-3">
                        <div className="text-sm text-gray-900 truncate">{user.email}</div>
                        {user.phone && (
                          <div className="text-xs text-gray-500 truncate mt-0.5">
                            {user.phone}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => toggleUserStatus(user)}
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium transition ${
                            user.is_active ? 'bg-green-100 text-green-800 hover:bg-green-200' : 'bg-red-100 text-red-800 hover:bg-red-200'
                          }`}
                        >
                          {user.is_active ? (
                            <>
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Actif
                            </>
                          ) : (
                            <>
                              <XCircle className="w-3 h-3 mr-1" />
                              Inactif
                            </>
                          )}
                        </button>
                      </td>
                      <td className="hidden md:table-cell px-4 py-3">
                        <div className="text-sm text-gray-500">
                          {formatDate(user.created_at)}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center space-x-1">
                          {/* Actions pour mobile */}
                          <div className="sm:hidden relative">
                            <button
                              onClick={() => setMobileActionMenu(mobileActionMenu === user.id ? null : user.id)}
                              className="p-1 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition"
                            >
                              <MoreVertical className="w-4 h-4" />
                            </button>
                            {mobileActionMenu === user.id && (
                              <div className="absolute right-0 top-full mt-1 w-32 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                                <button
                                  onClick={() => {
                                    handleViewUser(user)
                                    setMobileActionMenu(null)
                                  }}
                                  className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                >
                                  <Eye className="w-3 h-3" />
                                  <span>Voir</span>
                                </button>
                                <button
                                  onClick={() => {
                                    handleEditUser(user)
                                    setMobileActionMenu(null)
                                  }}
                                  className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                >
                                  <Edit className="w-3 h-3" />
                                  <span>Modifier</span>
                                </button>
                                <button
                                  onClick={() => {
                                    setSelectedUser(user)
                                    setShowDeleteModal(true)
                                    setMobileActionMenu(null)
                                  }}
                                  className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                                >
                                  <Trash2 className="w-3 h-3" />
                                  <span>Supprimer</span>
                                </button>
                              </div>
                            )}
                          </div>
                          
                          {/* Actions pour desktop */}
                          <div className="hidden sm:flex items-center space-x-1">
                            <button
                              onClick={() => handleViewUser(user)}
                              className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition"
                              title="Voir détails"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleEditUser(user)}
                              className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition"
                              title="Modifier"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => { setSelectedUser(user); setShowDeleteModal(true); }}
                              className="p-1.5 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded transition"
                              title="Supprimer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-4 py-3 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="text-sm text-gray-700">
                  Page {currentPage} sur {totalPages}
                </div>
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="p-1.5 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum
                    if (totalPages <= 5) pageNum = i + 1
                    else if (currentPage <= 3) pageNum = i + 1
                    else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i
                    else pageNum = currentPage - 2 + i
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`w-8 h-8 flex items-center justify-center rounded transition text-sm ${
                          currentPage === pageNum 
                            ? 'bg-gray-900 text-white' 
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        {pageNum}
                      </button>
                    )
                  })}
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="p-1.5 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal de visualisation */}
      {showViewModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
              <h3 className="text-base font-semibold text-gray-900">Détails utilisateur</h3>
              <button
                onClick={() => { setShowViewModal(false); setSelectedUser(null); }}
                className="p-1 hover:bg-gray-100 rounded transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4">
              <div className="flex items-start space-x-3 mb-4">
                <div className="relative h-12 w-12 rounded-full overflow-hidden bg-gray-100">
                  {selectedUser.profile_image ? (
                    <img
                      src={`${supabase.storage.from('avatars').getPublicUrl(selectedUser.profile_image).data.publicUrl}?t=${Date.now()}`}
                      alt={selectedUser.full_name}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <User className="w-6 h-6 text-gray-400" />
                    </div>
                  )}
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">{selectedUser.full_name}</h2>
                  <div className="flex flex-wrap gap-2 mt-1">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getRoleColor(selectedUser.role)}`}>
                      {selectedUser.role === 'super-admin' ? 'Super Admin' : selectedUser.role === 'admin' ? 'Administrateur' : 'Vendeur'}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      selectedUser.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {selectedUser.is_active ? 'Actif' : 'Inactif'}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2 text-sm">Informations personnelles</h4>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm">
                      <Mail className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" />
                      <span className="text-gray-700">{selectedUser.email}</span>
                    </div>
                    {selectedUser.phone && (
                      <div className="flex items-center text-sm">
                        <Phone className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" />
                        <span className="text-gray-700">{selectedUser.phone}</span>
                      </div>
                    )}
                  </div>
                </div>

                {selectedUser.shop_name && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2 text-sm">Magasin</h4>
                    <div className="flex items-center text-sm">
                      <Store className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" />
                      <span className="text-gray-700">{selectedUser.shop_name}</span>
                    </div>
                  </div>
                )}

                <div className="border-t border-gray-200 pt-4">
                  <h4 className="font-medium text-gray-900 mb-2 text-sm">Dates</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div className="text-sm">
                      <div className="text-gray-500 text-xs">Inscription</div>
                      <div className="text-gray-700">{formatDate(selectedUser.created_at)}</div>
                    </div>
                    {selectedUser.last_login && (
                      <div className="text-sm">
                        <div className="text-gray-500 text-xs">Dernière connexion</div>
                        <div className="text-gray-700">{formatDate(selectedUser.last_login)}</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-200 flex justify-end space-x-2">
                <button
                  onClick={() => { setShowViewModal(false); handleEditUser(selectedUser); }}
                  className="px-3 py-1.5 bg-gray-900 text-white text-sm rounded hover:bg-gray-800 transition"
                >
                  Modifier
                </button>
                <button
                  onClick={() => setShowViewModal(false)}
                  className="px-3 py-1.5 border border-gray-300 text-gray-700 text-sm rounded hover:bg-gray-50 transition"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de modification */}
      {showEditModal && editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
              <h3 className="text-base font-semibold text-gray-900">Modifier utilisateur</h3>
              <button
                onClick={() => {
                  setShowEditModal(false)
                  setEditingUser(null)
                }}
                className="p-1 hover:bg-gray-100 rounded transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4">
              <form onSubmit={(e) => { e.preventDefault(); handleUpdateUser(); }}>
                <div className="space-y-4">
                  {/* Informations de base */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nom complet
                    </label>
                    <input
                      type="text"
                      value={editFormData.full_name}
                      onChange={(e) => setEditFormData({...editFormData, full_name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-gray-900 focus:border-gray-900 text-sm"
                      required
                    />
                  </div>

                  {/* Email (non éditable) */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={editingUser.email}
                      className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-50 text-sm"
                      disabled
                    />
                  </div>

                  {/* Téléphone */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Téléphone
                    </label>
                    <input
                      type="tel"
                      value={editFormData.phone}
                      onChange={(e) => setEditFormData({...editFormData, phone: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-gray-900 focus:border-gray-900 text-sm"
                    />
                  </div>

                  {/* Nom du magasin (si vendeur) */}
                  {editFormData.role === 'vendor' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nom du magasin
                      </label>
                      <input
                        type="text"
                        value={editFormData.shop_name}
                        onChange={(e) => setEditFormData({...editFormData, shop_name: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-gray-900 focus:border-gray-900 text-sm"
                      />
                    </div>
                  )}

                  {/* Rôle */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Rôle
                    </label>
                    <select
                      value={editFormData.role}
                      onChange={(e) => setEditFormData({...editFormData, role: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-gray-900 focus:border-gray-900 text-sm"
                    >
                      <option value="vendor">Vendeur</option>
                      <option value="admin">Administrateur</option>
                      <option value="super-admin">Super Admin</option>
                    </select>
                  </div>

                  {/* Statut */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Statut
                    </label>
                    <div className="flex space-x-4">
                      <label className="flex items-center text-sm">
                        <input
                          type="radio"
                          checked={editFormData.is_active}
                          onChange={() => setEditFormData({...editFormData, is_active: true})}
                          className="mr-2"
                        />
                        Actif
                      </label>
                      <label className="flex items-center text-sm">
                        <input
                          type="radio"
                          checked={!editFormData.is_active}
                          onChange={() => setEditFormData({...editFormData, is_active: false})}
                          className="mr-2"
                        />
                        Inactif
                      </label>
                    </div>
                  </div>

                  {/* Changement de mot de passe */}
                  <div className="border-t border-gray-200 pt-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                      <Key className="w-4 h-4 mr-2" />
                      Changer le mot de passe
                    </h4>
                    <div className="space-y-3 bg-gray-50 p-3 rounded border border-gray-200">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Nouveau mot de passe
                        </label>
                        <div className="relative">
                          <input
                            type={showPassword ? "text" : "password"}
                            value={passwordData.newPassword}
                            onChange={(e) => {
                              setPasswordData({...passwordData, newPassword: e.target.value})
                              if (passwordData.confirmPassword && e.target.value !== passwordData.confirmPassword) {
                                setPasswordError('Les mots de passe ne correspondent pas')
                              } else if (e.target.value.length < 6 && e.target.value.length > 0) {
                                setPasswordError('Le mot de passe doit contenir au moins 6 caractères')
                              } else {
                                setPasswordError('')
                              }
                            }}
                            className="w-full px-3 py-1.5 border border-gray-300 rounded focus:ring-1 focus:ring-gray-900 focus:border-gray-900 text-sm pr-10"
                            placeholder="Laissez vide pour ne pas changer"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                          >
                            {showPassword ? <EyeOff className="w-3 h-3" /> : <EyeOpen className="w-3 h-3" />}
                          </button>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Confirmer le mot de passe
                        </label>
                        <input
                          type={showPassword ? "text" : "password"}
                          value={passwordData.confirmPassword}
                          onChange={(e) => {
                            setPasswordData({...passwordData, confirmPassword: e.target.value})
                            if (passwordData.newPassword && e.target.value !== passwordData.newPassword) {
                              setPasswordError('Les mots de passe ne correspondent pas')
                            } else if (e.target.value.length < 6 && e.target.value.length > 0) {
                              setPasswordError('Le mot de passe doit contenir au moins 6 caractères')
                            } else {
                              setPasswordError('')
                            }
                          }}
                          className="w-full px-3 py-1.5 border border-gray-300 rounded focus:ring-1 focus:ring-gray-900 focus:border-gray-900 text-sm"
                          placeholder="Confirmez le mot de passe"
                        />
                      </div>

                      {passwordError && (
                        <div className="flex items-start space-x-2 text-red-600 bg-red-50 p-2 rounded text-xs">
                          <AlertCircle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                          <span>{passwordError}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-4 border-t border-gray-200 flex justify-end space-x-2">
                    <button
                      type="button"
                      onClick={() => {
                        setShowEditModal(false)
                        setEditingUser(null)
                      }}
                      className="px-3 py-1.5 border border-gray-300 text-gray-700 text-sm rounded hover:bg-gray-50 transition"
                      disabled={editLoading}
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      disabled={editLoading}
                      className="px-3 py-1.5 bg-gray-900 text-white text-sm rounded hover:bg-gray-800 transition disabled:opacity-50 flex items-center space-x-1"
                    >
                      {editLoading && <Loader2 className="w-3 h-3 animate-spin" />}
                      <span>Enregistrer</span>
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmation de suppression */}
      {showDeleteModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-sm w-full p-4">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-10 w-10 rounded-full bg-red-100 mb-3">
                <Trash2 className="h-5 w-5 text-red-600" />
              </div>
              <h3 className="text-base font-semibold text-gray-900 mb-2">Confirmer la suppression</h3>
              <p className="text-gray-600 text-sm mb-4">
                Supprimer l'utilisateur <span className="font-medium">{selectedUser.full_name}</span> ?
              </p>
              <div className="flex justify-center space-x-2">
                <button
                  onClick={() => { setShowDeleteModal(false); setSelectedUser(null); }}
                  className="px-3 py-1.5 border border-gray-300 text-gray-700 text-sm rounded hover:bg-gray-50 transition"
                  disabled={actionLoading}
                >
                  Annuler
                </button>
                <button
                  onClick={handleDeleteUser}
                  disabled={actionLoading}
                  className="px-3 py-1.5 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition disabled:opacity-50 flex items-center space-x-1"
                >
                  {actionLoading && <Loader2 className="w-3 h-3 animate-spin" />}
                  <span>Supprimer</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}