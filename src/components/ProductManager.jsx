
// 'use client';

// import { useState, useEffect } from 'react';
// import { supabase } from '@/lib/supabase';
// import ProductTable from './ProductTable';
// import AddProductForm from './AddProductForm';
// import { 
//   Search, 
//   Filter, 
//   Plus, 
//   ArrowLeft,
//   Package,
//   ChevronDown,
//   X,
//   Loader2,
//   AlertCircle,
//   Eye,
//   EyeOff,
//   Power
// } from 'lucide-react';

// export default function ProductManager() {
//   const [view, setView] = useState('list'); // 'list' ou 'add'
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [categories, setCategories] = useState([]);
//   const [suppliers, setSuppliers] = useState([]);
//   const [filters, setFilters] = useState({
//     search: '',
//     category: '',
//     supplier: '',
//     lowStock: false,
//     status: 'all' // 'all', 'active', 'inactive'
//   });
//   const [showMobileFilters, setShowMobileFilters] = useState(false);

//   // Charger les catégories
//   const loadCategories = async () => {
//     try {
//       const { data, error } = await supabase
//         .from('categories')
//         .select('id, name')
//         .order('name');
      
//       if (!error && data) {
//         setCategories(data);
//       }
//     } catch (error) {
//       console.error('Erreur chargement catégories:', error);
//     }
//   };

//   // Charger les fournisseurs
//   const loadSuppliers = async () => {
//     try {
//       const { data, error } = await supabase
//         .from('suppliers')
//         .select('id, name')
//         .eq('is_active', true)
//         .order('name');
      
//       if (!error && data) {
//         setSuppliers(data);
//       }
//     } catch (error) {
//       console.error('Erreur chargement fournisseurs:', error);
//     }
//   };

//   const loadProducts = async () => {
//     setLoading(true);
    
//     let query = supabase
//       .from('products')
//       .select(`
//         *,
//         category:categories(id, name),
//         supplier:suppliers(id, name),
//         stock:stock(quantity, minimum_threshold)
//       `)
//       .order('created_at', { ascending: false });

//     // Filtre par catégorie
//     if (filters.category) {
//       query = query.eq('category_id', filters.category);
//     }

//     // Filtre par fournisseur
//     if (filters.supplier) {
//       query = query.eq('supplier_id', filters.supplier);
//     }

//     // Filtre par statut
//     if (filters.status === 'active') {
//       query = query.eq('is_active', true);
//     } else if (filters.status === 'inactive') {
//       query = query.eq('is_active', false);
//     }

//     const { data, error } = await query;

//     if (!error && data) {
//       let filteredData = data;
      
//       // Filtre stock faible
//       if (filters.lowStock) {
//         filteredData = filteredData.filter(product => 
//           product.stock?.[0]?.quantity <= product.stock?.[0]?.minimum_threshold
//         );
//       }
      
//       // Filtre recherche
//       if (filters.search) {
//         const searchLower = filters.search.toLowerCase();
//         filteredData = filteredData.filter(product => 
//           product.name.toLowerCase().includes(searchLower) ||
//           product.sku.toLowerCase().includes(searchLower) ||
//           product.description?.toLowerCase().includes(searchLower) ||
//           product.supplier?.name?.toLowerCase().includes(searchLower)
//         );
//       }
      
//       setProducts(filteredData);
//     }
    
//     setLoading(false);
//   };

//   useEffect(() => {
//     loadCategories();
//     loadSuppliers();
//     loadProducts();
//   }, [filters]);

//   const handleDelete = async (productId, imagePath) => {
//     if (!confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) return;

//     try {
//       if (imagePath) {
//         await supabase.storage
//           .from('product-images')
//           .remove([imagePath]);
//       }

//       const { error } = await supabase
//         .from('products')
//         .delete()
//         .eq('id', productId);

//       if (error) throw error;
      
//       alert('Produit supprimé avec succès');
//       loadProducts();
//     } catch (error) {
//       console.error('Erreur suppression:', error);
//       alert('Erreur lors de la suppression');
//     }
//   };

//   const updateStock = async (productId, newQuantity) => {
//     const { error } = await supabase
//       .from('stock')
//       .update({ 
//         quantity: newQuantity,
//         last_restocked: new Date().toISOString()
//       })
//       .eq('product_id', productId);

//     if (!error) {
//       loadProducts();
//     }
//   };

//   const handleToggleActive = async (productId, isActive) => {
//     try {
//       const { error } = await supabase
//         .from('products')
//         .update({ is_active: isActive })
//         .eq('id', productId);

//       if (error) throw error;
      
//       loadProducts();
//       alert(`Produit ${isActive ? 'activé' : 'désactivé'} avec succès`);
//     } catch (error) {
//       console.error('Erreur changement statut:', error);
//       alert('Erreur lors du changement de statut');
//     }
//   };

//   const handleResetFilters = () => {
//     setFilters({
//       search: '',
//       category: '',
//       supplier: '',
//       lowStock: false,
//       status: 'all'
//     });
//   };

//   // Calculer les statistiques
//   const totalProducts = products.length;
//   const activeProducts = products.filter(p => p.is_active).length;
//   const inactiveProducts = products.filter(p => !p.is_active).length;
//   const lowStockCount = products.filter(p => 
//     p.stock?.[0]?.quantity <= p.stock?.[0]?.minimum_threshold && p.is_active
//   ).length;
//   const activeFilters = Object.values(filters).filter(v => 
//     v !== '' && v !== false && v !== 'all'
//   ).length;

//   return (
//     <div className="p-4 sm:p-6">
//       {/* Header */}
//       <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
//         <div>
//           <h1 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center">
//             <Package className="w-6 h-6 sm:w-7 sm:h-7 mr-3 text-gray-700" />
//             Gestion des Produits
//           </h1>
//           <div className="flex flex-wrap gap-3 mt-2">
//             <div className="flex items-center space-x-1 text-sm">
//               <span className="text-gray-500">Total:</span>
//               <span className="font-medium">{totalProducts}</span>
//             </div>
//             <div className="flex items-center space-x-1 text-sm">
//               <span className="text-green-600">
//                 <Eye className="w-3 h-3 inline mr-1" />
//                 Actifs:
//               </span>
//               <span className="font-medium">{activeProducts}</span>
//             </div>
//             <div className="flex items-center space-x-1 text-sm">
//               <span className="text-gray-500">
//                 <EyeOff className="w-3 h-3 inline mr-1" />
//                 Inactifs:
//               </span>
//               <span className="font-medium">{inactiveProducts}</span>
//             </div>
//             {lowStockCount > 0 && (
//               <div className="flex items-center space-x-1 text-sm">
//                 <span className="text-red-600">
//                   <AlertCircle className="w-3 h-3 inline mr-1" />
//                   Stock faible:
//                 </span>
//                 <span className="font-medium">{lowStockCount}</span>
//               </div>
//             )}
//           </div>
//         </div>
        
//         <button
//           onClick={() => setView(view === 'list' ? 'add' : 'list')}
//           className="flex items-center justify-center space-x-2 px-4 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition text-sm w-full sm:w-auto"
//         >
//           {view === 'list' ? (
//             <>
//               <Plus className="w-4 h-4" />
//               <span>Ajouter un produit</span>
//             </>
//           ) : (
//             <>
//               <ArrowLeft className="w-4 h-4" />
//               <span>Liste des produits</span>
//             </>
//           )}
//         </button>
//       </div>

//       {view === 'list' ? (
//         <>
//           {/* Bloc unifié: Recherche, filtres et stats */}
//           <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
//             {/* Barre de recherche et filtres */}
//             <div className="flex flex-col lg:flex-row gap-4">
//               {/* Recherche */}
//               <div className="flex-1">
//                 <div className="relative">
//                   <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
//                   <input
//                     type="text"
//                     placeholder="Rechercher produit, SKU, fournisseur..."
//                     value={filters.search}
//                     onChange={(e) => setFilters({...filters, search: e.target.value})}
//                     className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-gray-900 focus:border-gray-900 transition text-sm"
//                   />
//                   {filters.search && (
//                     <button
//                       onClick={() => setFilters({...filters, search: ''})}
//                       className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
//                     >
//                       <X className="w-4 h-4" />
//                     </button>
//                   )}
//                 </div>
//               </div>

//               {/* Bouton filtres mobile */}
//               <div className="lg:hidden">
//                 <button
//                   onClick={() => setShowMobileFilters(!showMobileFilters)}
//                   className="flex items-center justify-center space-x-2 w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm"
//                 >
//                   <Filter className="w-4 h-4" />
//                   <span>Filtres {activeFilters > 0 && `(${activeFilters})`}</span>
//                   <ChevronDown className={`w-4 h-4 transition-transform ${showMobileFilters ? 'rotate-180' : ''}`} />
//                 </button>
//               </div>

//               {/* Filtres desktop */}
//               <div className="hidden lg:flex flex-wrap gap-2">
//                 {/* Filtre statut */}
//                 <select
//                   value={filters.status}
//                   onChange={(e) => setFilters({...filters, status: e.target.value})}
//                   className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-gray-900 focus:border-gray-900 bg-white text-sm min-w-[140px]"
//                 >
//                   <option value="all">Tous les statuts</option>
//                   <option value="active">Actifs seulement</option>
//                   <option value="inactive">Inactifs seulement</option>
//                 </select>

//                 {/* Filtre catégorie */}
//                 <select
//                   value={filters.category}
//                   onChange={(e) => setFilters({...filters, category: e.target.value})}
//                   className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-gray-900 focus:border-gray-900 bg-white text-sm min-w-[160px]"
//                 >
//                   <option value="">Toutes catégories</option>
//                   {categories.map(category => (
//                     <option key={category.id} value={category.id}>
//                       {category.name}
//                     </option>
//                   ))}
//                 </select>

//                 {/* Filtre fournisseur */}
//                 <select
//                   value={filters.supplier}
//                   onChange={(e) => setFilters({...filters, supplier: e.target.value})}
//                   className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-gray-900 focus:border-gray-900 bg-white text-sm min-w-[160px]"
//                 >
//                   <option value="">Tous fournisseurs</option>
//                   {suppliers.map(supplier => (
//                     <option key={supplier.id} value={supplier.id}>
//                       {supplier.name}
//                     </option>
//                   ))}
//                 </select>
                
//                 {/* Filtre stock faible */}
//                 <div className="flex items-center px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
//                   <label className="flex items-center space-x-2 cursor-pointer">
//                     <input
//                       type="checkbox"
//                       checked={filters.lowStock}
//                       onChange={(e) => setFilters({...filters, lowStock: e.target.checked})}
//                       className="rounded border-gray-300 text-gray-900 focus:ring-gray-900"
//                     />
//                     <span className="text-sm text-gray-700">Stock faible</span>
//                   </label>
//                 </div>
                
//                 {/* Bouton réinitialiser */}
//                 {activeFilters > 0 && (
//                   <button
//                     onClick={handleResetFilters}
//                     className="px-3 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm"
//                   >
//                     Réinitialiser
//                   </button>
//                 )}
//               </div>
//             </div>

//             {/* Stats */}
//             <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-gray-200">
//               <div className="text-center p-2">
//                 <div className="text-lg font-bold text-gray-900">{totalProducts}</div>
//                 <div className="text-xs text-gray-500">Total</div>
//               </div>
//               <div className="text-center p-2">
//                 <div className="text-lg font-bold text-green-600">{activeProducts}</div>
//                 <div className="text-xs text-gray-500">Actifs</div>
//               </div>
//               <div className="text-center p-2">
//                 <div className="text-lg font-bold text-gray-500">{inactiveProducts}</div>
//                 <div className="text-xs text-gray-500">Inactifs</div>
//               </div>
//               <div className="text-center p-2">
//                 <div className="text-lg font-bold text-red-600">{lowStockCount}</div>
//                 <div className="text-xs text-gray-500">Stock faible</div>
//               </div>
//             </div>

//             {/* Filtres mobile (dropdown) */}
//             {showMobileFilters && (
//               <div className="lg:hidden mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
//                 <div className="space-y-4">
//                   {/* Filtre statut mobile */}
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Statut
//                     </label>
//                     <select
//                       value={filters.status}
//                       onChange={(e) => setFilters({...filters, status: e.target.value})}
//                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-gray-900 focus:border-gray-900 bg-white text-sm"
//                     >
//                       <option value="all">Tous les statuts</option>
//                       <option value="active">Actifs seulement</option>
//                       <option value="inactive">Inactifs seulement</option>
//                     </select>
//                   </div>

//                   {/* Filtre catégorie mobile */}
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Catégorie
//                     </label>
//                     <select
//                       value={filters.category}
//                       onChange={(e) => setFilters({...filters, category: e.target.value})}
//                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-gray-900 focus:border-gray-900 bg-white text-sm"
//                     >
//                       <option value="">Toutes catégories</option>
//                       {categories.map(category => (
//                         <option key={category.id} value={category.id}>
//                           {category.name}
//                         </option>
//                       ))}
//                     </select>
//                   </div>

//                   {/* Filtre fournisseur mobile */}
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Fournisseur
//                     </label>
//                     <select
//                       value={filters.supplier}
//                       onChange={(e) => setFilters({...filters, supplier: e.target.value})}
//                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-gray-900 focus:border-gray-900 bg-white text-sm"
//                     >
//                       <option value="">Tous fournisseurs</option>
//                       {suppliers.map(supplier => (
//                         <option key={supplier.id} value={supplier.id}>
//                           {supplier.name}
//                         </option>
//                       ))}
//                     </select>
//                   </div>
                  
//                   {/* Filtre stock faible mobile */}
//                   <div>
//                     <label className="flex items-center space-x-3">
//                       <input
//                         type="checkbox"
//                         checked={filters.lowStock}
//                         onChange={(e) => setFilters({...filters, lowStock: e.target.checked})}
//                         className="rounded border-gray-300 text-gray-900 focus:ring-gray-900"
//                       />
//                       <span className="text-sm text-gray-700">Afficher seulement le stock faible</span>
//                     </label>
//                   </div>
                  
//                   {/* Boutons actions mobile */}
//                   <div className="pt-2 border-t border-gray-200">
//                     <div className="flex space-x-2">
//                       <button
//                         onClick={handleResetFilters}
//                         className="flex-1 px-3 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm"
//                       >
//                         Réinitialiser
//                       </button>
//                       <button
//                         onClick={() => setShowMobileFilters(false)}
//                         className="flex-1 px-3 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition text-sm"
//                       >
//                         Appliquer
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Tableau des produits */}
//           {loading ? (
//             <div className="bg-white rounded-lg border border-gray-200 p-8">
//               <div className="flex flex-col items-center justify-center space-y-4">
//                 <Loader2 className="w-8 h-8 animate-spin text-gray-600" />
//                 <div className="text-gray-500">Chargement des produits...</div>
//               </div>
//             </div>
//           ) : products.length > 0 ? (
//             <ProductTable
//               products={products}
//               onDelete={handleDelete}
//               onUpdateStock={updateStock}
//               onToggleActive={handleToggleActive}
//             />
//           ) : (
//             <div className="bg-white rounded-lg border border-gray-200 p-8">
//               <div className="text-center">
//                 <Package className="w-12 h-12 text-gray-400 mx-auto mb-3" />
//                 <h3 className="text-lg font-medium text-gray-900 mb-1">
//                   Aucun produit trouvé
//                 </h3>
//                 <p className="text-gray-500 text-sm mb-4">
//                   {activeFilters > 0 
//                     ? "Aucun produit ne correspond à vos filtres actuels"
//                     : "Commencez par ajouter votre premier produit"
//                   }
//                 </p>
//                 {activeFilters > 0 && (
//                   <button
//                     onClick={handleResetFilters}
//                     className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition text-sm"
//                   >
//                     Réinitialiser les filtres
//                   </button>
//                 )}
//               </div>
//             </div>
//           )}
//         </>
//       ) : (
//         <AddProductForm 
//           onSuccess={() => {
//             setView('list');
//             loadProducts();
//           }}
//           categories={categories}
//           suppliers={suppliers}
//         />
//       )}
//     </div>
//   );
// }
'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import ProductTable from './ProductTable';
import AddProductForm from './AddProductForm';
import { 
  Search, 
  Filter, 
  Plus, 
  ArrowLeft,
  Package,
  ChevronDown,
  X,
  Loader2,
  AlertCircle,
  Eye,
  EyeOff,
  Power
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function ProductManager() {
  const [view, setView] = useState('list'); // 'list' ou 'add'
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    supplier: '',
    lowStock: false,
    status: 'all' // 'all', 'active', 'inactive'
  });
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const { t, language } = useLanguage();

  // Charger les catégories
  const loadCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('id, name')
        .order('name');
      
      if (!error && data) {
        setCategories(data);
      }
    } catch (error) {
      console.error(language === 'fr' ? 'Erreur chargement catégories:' : 'Error loading categories:', error);
    }
  };

  // Charger les fournisseurs
  const loadSuppliers = async () => {
    try {
      const { data, error } = await supabase
        .from('suppliers')
        .select('id, name')
        .eq('is_active', true)
        .order('name');
      
      if (!error && data) {
        setSuppliers(data);
      }
    } catch (error) {
      console.error(language === 'fr' ? 'Erreur chargement fournisseurs:' : 'Error loading suppliers:', error);
    }
  };

  const loadProducts = async () => {
    setLoading(true);
    
    let query = supabase
      .from('products')
      .select(`
        *,
        category:categories(id, name),
        supplier:suppliers(id, name),
        stock:stock(quantity, minimum_threshold)
      `)
      .order('created_at', { ascending: false });

    // Filtre par catégorie
    if (filters.category) {
      query = query.eq('category_id', filters.category);
    }

    // Filtre par fournisseur
    if (filters.supplier) {
      query = query.eq('supplier_id', filters.supplier);
    }

    // Filtre par statut
    if (filters.status === 'active') {
      query = query.eq('is_active', true);
    } else if (filters.status === 'inactive') {
      query = query.eq('is_active', false);
    }

    const { data, error } = await query;

    if (!error && data) {
      let filteredData = data;
      
      // Filtre stock faible
      if (filters.lowStock) {
        filteredData = filteredData.filter(product => 
          product.stock?.[0]?.quantity <= product.stock?.[0]?.minimum_threshold
        );
      }
      
      // Filtre recherche
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        filteredData = filteredData.filter(product => 
          product.name.toLowerCase().includes(searchLower) ||
          product.sku.toLowerCase().includes(searchLower) ||
          product.description?.toLowerCase().includes(searchLower) ||
          product.supplier?.name?.toLowerCase().includes(searchLower)
        );
      }
      
      setProducts(filteredData);
    }
    
    setLoading(false);
  };

  useEffect(() => {
    loadCategories();
    loadSuppliers();
    loadProducts();
  }, [filters]);

  const handleDelete = async (productId, imagePath) => {
    const confirmMessage = language === 'fr' 
      ? 'Êtes-vous sûr de vouloir supprimer ce produit ?' 
      : 'Are you sure you want to delete this product?';
    
    if (!confirm(confirmMessage)) return;

    try {
      if (imagePath) {
        await supabase.storage
          .from('product-images')
          .remove([imagePath]);
      }

      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);

      if (error) throw error;
      
      alert(language === 'fr' ? 'Produit supprimé avec succès' : 'Product deleted successfully');
      loadProducts();
    } catch (error) {
      console.error(language === 'fr' ? 'Erreur suppression:' : 'Error deleting:', error);
      alert(language === 'fr' ? 'Erreur lors de la suppression' : 'Error during deletion');
    }
  };

  const updateStock = async (productId, newQuantity) => {
    const { error } = await supabase
      .from('stock')
      .update({ 
        quantity: newQuantity,
        last_restocked: new Date().toISOString()
      })
      .eq('product_id', productId);

    if (!error) {
      loadProducts();
    }
  };

  const handleToggleActive = async (productId, isActive) => {
    try {
      const { error } = await supabase
        .from('products')
        .update({ is_active: isActive })
        .eq('id', productId);

      if (error) throw error;
      
      loadProducts();
      const message = language === 'fr'
        ? `Produit ${isActive ? 'activé' : 'désactivé'} avec succès`
        : `Product ${isActive ? 'activated' : 'deactivated'} successfully`;
      alert(message);
    } catch (error) {
      console.error(language === 'fr' ? 'Erreur changement statut:' : 'Error changing status:', error);
      alert(language === 'fr' ? 'Erreur lors du changement de statut' : 'Error changing status');
    }
  };

  const handleResetFilters = () => {
    setFilters({
      search: '',
      category: '',
      supplier: '',
      lowStock: false,
      status: 'all'
    });
  };

  // Calculer les statistiques
  const totalProducts = products.length;
  const activeProducts = products.filter(p => p.is_active).length;
  const inactiveProducts = products.filter(p => !p.is_active).length;
  const lowStockCount = products.filter(p => 
    p.stock?.[0]?.quantity <= p.stock?.[0]?.minimum_threshold && p.is_active
  ).length;
  const activeFilters = Object.values(filters).filter(v => 
    v !== '' && v !== false && v !== 'all'
  ).length;

  return (
    <div className="p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center">
            <Package className="w-6 h-6 sm:w-7 sm:h-7 mr-3 text-gray-700" />
            {t('productsManagement')}
          </h1>
          <div className="flex flex-wrap gap-3 mt-2">
            <div className="flex items-center space-x-1 text-sm">
              <span className="text-gray-500">{t('total')}:</span>
              <span className="font-medium">{totalProducts}</span>
            </div>
            <div className="flex items-center space-x-1 text-sm">
              <span className="text-green-600">
                <Eye className="w-3 h-3 inline mr-1" />
                {t('active')}:
              </span>
              <span className="font-medium">{activeProducts}</span>
            </div>
            <div className="flex items-center space-x-1 text-sm">
              <span className="text-gray-500">
                <EyeOff className="w-3 h-3 inline mr-1" />
                {t('inactive')}:
              </span>
              <span className="font-medium">{inactiveProducts}</span>
            </div>
            {lowStockCount > 0 && (
              <div className="flex items-center space-x-1 text-sm">
                <span className="text-red-600">
                  <AlertCircle className="w-3 h-3 inline mr-1" />
                  {t('lowStock')}:
                </span>
                <span className="font-medium">{lowStockCount}</span>
              </div>
            )}
          </div>
        </div>
        
        <button
          onClick={() => setView(view === 'list' ? 'add' : 'list')}
          className="flex items-center justify-center space-x-2 px-4 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition text-sm w-full sm:w-auto"
        >
          {view === 'list' ? (
            <>
              <Plus className="w-4 h-4" />
              <span>{t('addProduct')}</span>
            </>
          ) : (
            <>
              <ArrowLeft className="w-4 h-4" />
              <span>{t('productList')}</span>
            </>
          )}
        </button>
      </div>

      {view === 'list' ? (
        <>
          {/* Bloc unifié: Recherche, filtres et stats */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
            {/* Barre de recherche et filtres */}
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Recherche */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder={t('searchPlaceholder')}
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
                {/* Filtre statut */}
                <select
                  value={filters.status}
                  onChange={(e) => setFilters({...filters, status: e.target.value})}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-gray-900 focus:border-gray-900 bg-white text-sm min-w-[140px]"
                >
                  <option value="all">{t('allStatuses')}</option>
                  <option value="active">{t('activeOnly')}</option>
                  <option value="inactive">{t('inactiveOnly')}</option>
                </select>

                {/* Filtre catégorie */}
                <select
                  value={filters.category}
                  onChange={(e) => setFilters({...filters, category: e.target.value})}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-gray-900 focus:border-gray-900 bg-white text-sm min-w-[160px]"
                >
                  <option value="">{t('allCategories')}</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>

                {/* Filtre fournisseur */}
                <select
                  value={filters.supplier}
                  onChange={(e) => setFilters({...filters, supplier: e.target.value})}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-gray-900 focus:border-gray-900 bg-white text-sm min-w-[160px]"
                >
                  <option value="">{t('allSuppliers')}</option>
                  {suppliers.map(supplier => (
                    <option key={supplier.id} value={supplier.id}>
                      {supplier.name}
                    </option>
                  ))}
                </select>
                
                {/* Filtre stock faible */}
                <div className="flex items-center px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.lowStock}
                      onChange={(e) => setFilters({...filters, lowStock: e.target.checked})}
                      className="rounded border-gray-300 text-gray-900 focus:ring-gray-900"
                    />
                    <span className="text-sm text-gray-700">{t('lowStockOnly')}</span>
                  </label>
                </div>
                
                {/* Bouton réinitialiser */}
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

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-gray-200">
              <div className="text-center p-2">
                <div className="text-lg font-bold text-gray-900">{totalProducts}</div>
                <div className="text-xs text-gray-500">{t('total')}</div>
              </div>
              <div className="text-center p-2">
                <div className="text-lg font-bold text-green-600">{activeProducts}</div>
                <div className="text-xs text-gray-500">{t('active')}</div>
              </div>
              <div className="text-center p-2">
                <div className="text-lg font-bold text-gray-500">{inactiveProducts}</div>
                <div className="text-xs text-gray-500">{t('inactive')}</div>
              </div>
              <div className="text-center p-2">
                <div className="text-lg font-bold text-red-600">{lowStockCount}</div>
                <div className="text-xs text-gray-500">{t('lowStock')}</div>
              </div>
            </div>

            {/* Filtres mobile (dropdown) */}
            {showMobileFilters && (
              <div className="lg:hidden mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="space-y-4">
                  {/* Filtre statut mobile */}
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
                      <option value="active">{t('activeOnly')}</option>
                      <option value="inactive">{t('inactiveOnly')}</option>
                    </select>
                  </div>

                  {/* Filtre catégorie mobile */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('category')}
                    </label>
                    <select
                      value={filters.category}
                      onChange={(e) => setFilters({...filters, category: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-gray-900 focus:border-gray-900 bg-white text-sm"
                    >
                      <option value="">{t('allCategories')}</option>
                      {categories.map(category => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Filtre fournisseur mobile */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('supplier')}
                    </label>
                    <select
                      value={filters.supplier}
                      onChange={(e) => setFilters({...filters, supplier: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-gray-900 focus:border-gray-900 bg-white text-sm"
                    >
                      <option value="">{t('allSuppliers')}</option>
                      {suppliers.map(supplier => (
                        <option key={supplier.id} value={supplier.id}>
                          {supplier.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  {/* Filtre stock faible mobile */}
                  <div>
                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={filters.lowStock}
                        onChange={(e) => setFilters({...filters, lowStock: e.target.checked})}
                        className="rounded border-gray-300 text-gray-900 focus:ring-gray-900"
                      />
                      <span className="text-sm text-gray-700">{t('showLowStockOnly')}</span>
                    </label>
                  </div>
                  
                  {/* Boutons actions mobile */}
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

          {/* Tableau des produits */}
          {loading ? (
            <div className="bg-white rounded-lg border border-gray-200 p-8">
              <div className="flex flex-col items-center justify-center space-y-4">
                <Loader2 className="w-8 h-8 animate-spin text-gray-600" />
                <div className="text-gray-500">{t('loadingProducts')}</div>
              </div>
            </div>
          ) : products.length > 0 ? (
            <ProductTable
              products={products}
              onDelete={handleDelete}
              onUpdateStock={updateStock}
              onToggleActive={handleToggleActive}
            />
          ) : (
            <div className="bg-white rounded-lg border border-gray-200 p-8">
              <div className="text-center">
                <Package className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <h3 className="text-lg font-medium text-gray-900 mb-1">
                  {t('noProductsFound')}
                </h3>
                <p className="text-gray-500 text-sm mb-4">
                  {activeFilters > 0 
                    ? t('noProductsMatchFilters')
                    : t('addFirstProduct')
                  }
                </p>
                {activeFilters > 0 && (
                  <button
                    onClick={handleResetFilters}
                    className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition text-sm"
                  >
                    {t('resetFilters')}
                  </button>
                )}
              </div>
            </div>
          )}
        </>
      ) : (
        <AddProductForm 
          onSuccess={() => {
            setView('list');
            loadProducts();
          }}
          categories={categories}
          suppliers={suppliers}
        />
      )}
    </div>
  );
}