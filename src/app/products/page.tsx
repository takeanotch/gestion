// 'use client';

// import React, { useState, useEffect, useCallback } from 'react';
// import { useRouter } from 'next/navigation';
// import { 
//   Package, Plus, Filter, Search, X, BarChart3, List, 
//   Download, RefreshCw, ChevronDown, Calendar 
// } from 'lucide-react';
// import ProductList from '@/components/ProductList';
// import Notification from '@/components/Notification';
// import { getAllProducts, getProductsStats, getUniqueCategories, searchProducts, Product } from '@/lib/products';

// export default function ProductsPage() {
//   const router = useRouter();
//   const [products, setProducts] = useState<Product[]>([]);
//   const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
//   const [showForm, setShowForm] = useState(false);
//   const [search, setSearch] = useState('');
//   const [categoryFilter, setCategoryFilter] = useState('all');
//   const [loading, setLoading] = useState(true);
//   const [activeTab, setActiveTab] = useState('all');
//   const [notification, setNotification] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);
//   const [showSearchBar, setShowSearchBar] = useState(true);
//   const [stats, setStats] = useState<{
//     total: number;
//     low_stock: number;
//     out_of_stock: number;
//     total_value: number;
//     categories: { category: string; count: number }[];
//     suppliers: { supplier: string; count: number }[];
//   }>({
//     total: 0,
//     low_stock: 0,
//     out_of_stock: 0,
//     total_value: 0,
//     categories: [],
//     suppliers: []
//   });
//   const [categories, setCategories] = useState<string[]>(['all']);

//   const loadProducts = useCallback(async () => {
//     console.log('🔄 Chargement produits...');
//     setLoading(true);
    
//     try {
//       const [productsData, statsData, categoriesData] = await Promise.all([
//         getAllProducts(),
//         getProductsStats(),
//         getUniqueCategories()
//       ]);
      
//       console.log(`📦 ${productsData.length} produits chargés`);
//       setProducts(productsData);
//       setFilteredProducts(productsData);
//       setStats(statsData);
//       setCategories(['all', ...categoriesData]);
      
//     } catch (error) {
//       console.error('❌ Erreur chargement produits:', error);
//       showNotification('error', '❌ Erreur lors du chargement des produits');
//     }
    
//     setLoading(false);
//   }, []);

//   useEffect(() => {
//     console.log('🔍 Initialisation Dashboard');
//     loadProducts();
//   }, [loadProducts]);

//   useEffect(() => {
//     let filtered = products;

//     // Filtrer par recherche
//     if (search) {
//       const searchLower = search.toLowerCase();
//       filtered = filtered.filter(product => 
//         product.name?.toLowerCase().includes(searchLower) ||
//         product.sku?.toLowerCase().includes(searchLower) ||
//         product.supplier?.toLowerCase().includes(searchLower) ||
//         product.barcode?.toLowerCase().includes(searchLower) ||
//         false
//       );
//     }

//     // Filtrer par catégorie
//     if (categoryFilter !== 'all') {
//       filtered = filtered.filter(product => product.category === categoryFilter);
//     }

//     setFilteredProducts(filtered);
//   }, [products, search, categoryFilter]);

//   const handleDeleteProduct = async (id: string) => {
//     if (window.confirm('Êtes-vous sûr de vouloir supprimer ce produit?')) {
//       try {
//         const { deleteProduct } = await import('@/lib/products');
//         const result = await deleteProduct(id);
        
//         if (result.success) {
//           showNotification('success', '✅ Produit supprimé avec succès!');
//           loadProducts();
//         } else {
//           showNotification('error', `❌ ${result.error || 'Échec de la suppression'}`);
//         }
//       } catch (error) {
//         console.error('Erreur:', error);
//         showNotification('error', '❌ Erreur lors de la suppression');
//       }
//     }
//   };

//   const showNotification = (type: 'success' | 'error' | 'info', message: string) => {
//     setNotification({ type, message });
//     setTimeout(() => setNotification(null), 3000);
//   };

//   const handleExportJSON = () => {
//     try {
//       const data = {
//         exportDate: new Date().toISOString(),
//         totalProducts: filteredProducts.length,
//         products: filteredProducts.map(product => ({
//           id: product.id,
//           name: product.name,
//           sku: product.sku,
//           barcode: product.barcode,
//           category: product.category,
//           supplier: product.supplier,
//           quantity: product.quantity,
//           price: product.price,
//           created_at: product.created_at,
//           updated_at: product.updated_at
//         }))
//       };
      
//       const jsonString = JSON.stringify(data, null, 2);
//       const blob = new Blob([jsonString], { type: 'application/json;charset=utf-8' });
//       const url = URL.createObjectURL(blob);
//       const link = document.createElement('a');
//       link.href = url;
//       link.setAttribute('download', `produits_${new Date().toISOString().split('T')[0]}.json`);
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//       URL.revokeObjectURL(url);
      
//       showNotification('success', `✅ Export JSON terminé (${filteredProducts.length} produits)`);
      
//     } catch (error) {
//       console.error('Erreur export:', error);
//       showNotification('error', '❌ Erreur lors de l\'export');
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {notification && (
//         <Notification
//           type={notification.type}
//           message={notification.message}
//           onClose={() => setNotification(null)}
//         />
//       )}

//       {/* Header fixe */}
//       <div className="sticky top-0 z-10 bg-white border-b shadow-sm">
//         <div className="px-6 py-4">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center space-x-3">
//               <div className="p-2 bg-blue-50 rounded-lg">
//                 <Package className="w-6 h-6 text-blue-600" />
//               </div>
//               <div>
//                 <h1 className="text-2xl font-bold text-gray-900">Produits</h1>
//                 <div className="flex items-center space-x-4 text-sm text-gray-500">
//                   <span>{stats.total} produits</span>
//                   <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
//                   <span>Valeur totale: {stats.total_value.toFixed(2)}€</span>
//                   <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
//                   <span className={stats.low_stock > 0 ? 'text-yellow-600' : ''}>
//                     {stats.low_stock} faible stock
//                   </span>
//                   <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
//                   <span className={stats.out_of_stock > 0 ? 'text-red-600' : ''}>
//                     {stats.out_of_stock} rupture
//                   </span>
//                 </div>
//               </div>
//             </div>
            
//             {/* <div className="flex items-center space-x-3">
//               <button
//                 onClick={() => setShowSearchBar(!showSearchBar)}
//                 className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm transition-colors ${
//                   showSearchBar 
//                     ? 'bg-blue-600 text-white' 
//                     : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
//                 }`}
//               >
//                 <List className="w-4 h-4" />
//                 <span className="hidden sm:inline">Recherche & Filtres</span>
//               </button>
              
//               <button
//                 onClick={() => router.push('/products/add')}
//                 className="flex items-center space-x-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//               >
//                 <Plus className="w-4 h-4" />
//                 <span className='lg:block hidden text-sm'>
//                   Ajouter un produit
//                 </span>
//                 <span className='lg:hidden text-sm block'>
//                   Ajouter
//                 </span>  
//               </button>
//             </div> */}
//           </div>
//         </div>

//         {/* Onglets */}
//         <div className="px-6 border-t hidden bg-white">
//           <div className="flex space-x-1 overflow-x-">
//             {categories.map(category => (
//               <button
//                 key={category}
//                 onClick={() => {
//                   setActiveTab(category);
//                   setCategoryFilter(category === 'all' ? 'all' : category);
//                 }}
//                 className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
//                   activeTab === category
//                     ? 'border-blue-600 text-blue-600'
//                     : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
//                 }`}
//               >
//                 {category === 'all' ? 'Tous' : category}
//                 {category !== 'all' && (
//                   <span className="ml-2 px-2 py-0.5 text-xs bg-gray-100 rounded-full">
//                     {products.filter(p => p.category === category).length}
//                   </span>
//                 )}
//               </button>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* Barre de recherche et filtres - Conditionnelle */}
//       {showSearchBar && (
//         <div className="py-4 px-6 overflow-hidden hide bg-gray-50 border-b">
//           <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
//             <div className="flex-1">
//               <div className="relative">
//                 <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
//                 <input
//                   type="text"
//                   placeholder="Rechercher par nom, SKU, fournisseur ou code-barres..."
//                   value={search}
//                   onChange={(e) => setSearch(e.target.value)}
//                   className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                 />
//                 {search && (
//                   <button
//                     onClick={() => setSearch('')}
//                     className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
//                   >
//                     <X className="w-4 h-4" />
//                   </button>
//                 )}
//               </div>
//             </div>
            
//             <div className="flex items-center space-x-3">
//               <div className="flex items-center space-x-2">
//                 <Filter className="w-5 h-5 text-gray-500" />
//                 <select
//                   value={categoryFilter}
//                   onChange={(e) => {
//                     setCategoryFilter(e.target.value);
//                     setActiveTab(e.target.value === 'all' ? 'all' : e.target.value);
//                   }}
//                   className="px-3 py-2.5 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                 >
//                   <option value="all">Toutes catégories</option>
//                   {categories
//                     .filter(cat => cat !== 'all')
//                     .map(category => (
//                       <option key={category} value={category}>
//                         {category}
//                       </option>
//                     ))}
//                 </select>
//               </div>
              
//               <button
//                 onClick={loadProducts}
//                 className="p-2.5 border border-gray-300 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-50 transition-colors"
//                 title="Actualiser"
//               >
//                 <RefreshCw className="w-5 h-5" />
//               </button>
              
//               <button
//                 onClick={handleExportJSON}
//                 className="flex items-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-colors shadow-md hover:shadow-lg"
//                 title="Exporter en JSON"
//               >
//                 <Download className="w-4 h-4" />
//                 <span className="text-sm font-medium hidden md:inline">Exporter JSON</span>
//                 <span className="text-sm font-medium md:hidden">JSON</span>
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Liste des produits */}
//       <div className="flex-1 bg-white">
//         <div className="px-6 py-4">
//           {loading ? (
//             <div className="flex items-center justify-center py-12">
//               <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
//               <p className="ml-3 text-gray-600">Chargement des produits...</p>
//             </div>
//           ) : filteredProducts.length === 0 ? (
//             <div className="py-12 text-center">
//               <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
//               <h3 className="text-lg font-semibold text-gray-700 mb-2">Aucun produit trouvé</h3>
//               <p className="text-gray-500 mb-4">
//                 {search ? 'Essayez un autre terme de recherche' : 'Commencez par ajouter un produit'}
//               </p>
//               {!search && (
//                 <button
//                   onClick={() => router.push('/products/add')}
//                   className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//                 >
//                   <Plus className="w-4 h-4 inline mr-2" />
//                   Ajouter un produit
//                 </button>
//               )}
//             </div>
//           ) : (
//             <>
//               <div className="mb-4 flex items-center justify-between">
//                 <div className="text-sm text-gray-600">
//                   {filteredProducts.length} produit{filteredProducts.length > 1 ? 's' : ''} trouvé{filteredProducts.length > 1 ? 's' : ''}
//                   {search && ` pour "${search}"`}
//                   {categoryFilter !== 'all' && ` dans "${categoryFilter}"`}
//                 </div>
//                 {!showSearchBar && (
//                   <button
//                     onClick={handleExportJSON}
//                     className="flex items-center space-x-2 px-3 py-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-sm rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-colors"
//                     title="Exporter en JSON"
//                   >
//                     <Download className="w-3 h-3" />
//                     <span>Exporter JSON</span>
//                   </button>
//                 )}
//               </div>

//               <ProductList
//                 products={filteredProducts}
//                 onDelete={handleDeleteProduct}
//               />
//             </>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }
'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Package, Plus, Filter, Search, X, 
  Download, RefreshCw 
} from 'lucide-react';
import ProductList from '@/components/ProductList';
import Notification from '@/components/Notification';
import { 
  getAllProducts, 
  getProductsStats, 
  getUniqueCategories, 
  deleteProduct,
  type Product 
} from '@/lib/products';

export default function ProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [notification, setNotification] = useState<{ 
    type: 'success' | 'error' | 'info'; 
    message: string 
  } | null>(null);
  const [showSearchBar, setShowSearchBar] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    low_stock: 0,
    out_of_stock: 0,
    total_value: 0,
    categories: [] as { category: string; count: number }[],
    suppliers: [] as { supplier: string; count: number }[]
  });
  const [categories, setCategories] = useState<string[]>(['all']);

  // Charger les produits
  const loadProducts = useCallback(async () => {
    console.log('🔄 Chargement produits...');
    setLoading(true);
    
    try {
      const [productsData, statsData, categoriesData] = await Promise.all([
        getAllProducts(),
        getProductsStats(),
        getUniqueCategories()
      ]);
      
      console.log(`📦 ${productsData.length} produits chargés`);
      setProducts(productsData);
      setStats(statsData);
      setCategories(['all', ...categoriesData]);
      
    } catch (error) {
      console.error('❌ Erreur chargement produits:', error);
      showNotification('error', '❌ Erreur lors du chargement des produits');
    }
    
    setLoading(false);
  }, []);

  // Initialisation
  useEffect(() => {
    console.log('🔍 Initialisation Dashboard');
    loadProducts();
  }, [loadProducts]);

  // Filtrer les produits
  const filteredProductsMemo = useMemo(() => {
    let filtered = products;

    // Filtrer par recherche
    if (search.trim()) {
      const searchLower = search.toLowerCase().trim();
      filtered = filtered.filter(product => 
        product.name?.toLowerCase().includes(searchLower) ||
        product.sku?.toLowerCase().includes(searchLower) ||
        product.supplier?.toLowerCase().includes(searchLower) ||
        product.barcode?.toLowerCase().includes(searchLower)
      );
    }

    // Filtrer par catégorie
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(product => product.category === categoryFilter);
    }

    return filtered;
  }, [products, search, categoryFilter]);

  // Mettre à jour les produits filtrés
  useEffect(() => {
    setFilteredProducts(filteredProductsMemo);
  }, [filteredProductsMemo]);

  // Supprimer un produit
  const handleDeleteProduct = async (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce produit?')) {
      try {
        const result = await deleteProduct(id);
        
        if (result.success) {
          showNotification('success', '✅ Produit supprimé avec succès!');
          loadProducts();
        } else {
          showNotification('error', `❌ ${result.error || 'Échec de la suppression'}`);
        }
      } catch (error) {
        console.error('Erreur:', error);
        showNotification('error', '❌ Erreur lors de la suppression');
      }
    }
  };

  // Afficher une notification
  const showNotification = (type: 'success' | 'error' | 'info', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  // Exporter en JSON
  const handleExportJSON = () => {
    try {
      const data = {
        exportDate: new Date().toISOString(),
        totalProducts: filteredProducts.length,
        products: filteredProducts.map(product => ({
          id: product.id,
          name: product.name,
          sku: product.sku,
          barcode: product.barcode,
          category: product.category,
          supplier: product.supplier,
          quantity: product.quantity,
          price: product.price,
          created_at: product.created_at,
          updated_at: product.updated_at
        }))
      };
      
      const jsonString = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `produits_${new Date().toISOString().split('T')[0]}.json`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      showNotification('success', `✅ Export JSON terminé (${filteredProducts.length} produits)`);
      
    } catch (error) {
      console.error('Erreur export:', error);
      showNotification('error', '❌ Erreur lors de l\'export');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Notification */}
      {notification && (
        <Notification
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}

      {/* Header fixe */}
      <header className="sticky top-0 z-10 bg-white border-b shadow-sm">
        <div className="px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Produits</h1>
                <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
                  <span>{stats.total} produits</span>
                  <span className="hidden sm:inline">•</span>
                  <span>Valeur totale: {stats.total_value.toFixed(2)}€</span>
                  <span className="hidden sm:inline">•</span>
                  <span className={stats.low_stock > 0 ? 'text-yellow-600' : ''}>
                    {stats.low_stock} faible stock
                  </span>
                  <span className="hidden sm:inline">•</span>
                  <span className={stats.out_of_stock > 0 ? 'text-red-600' : ''}>
                    {stats.out_of_stock} rupture
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowSearchBar(!showSearchBar)}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm transition-colors bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
              >
                <Filter className="w-4 h-4" />
                <span className="hidden sm:inline">Filtres</span>
              </button>
              
              <button
                onClick={() => router.push('/products/add')}
                className="flex items-center space-x-2 px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                <Plus className="w-4 h-4" />
                <span className='hidden sm:inline'>Ajouter un produit</span>
                <span className='sm:hidden'>Ajouter</span>
              </button>
            </div>
          </div>
        </div>

        {/* Onglets de catégories - Version mobile scrollable */}
        <div className="px-4 sm:px-6 border-t bg-white overflow-x-auto">
          <div className="flex space-x-1 min-w-max py-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => {
                  setActiveTab(category);
                  setCategoryFilter(category === 'all' ? 'all' : category);
                }}
                className={`px-3 py-2 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === category
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {category === 'all' ? 'Tous' : category}
                {category !== 'all' && (
                  <span className="ml-1 px-1.5 py-0.5 text-xs bg-gray-100 rounded-full">
                    {products.filter(p => p.category === category).length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Barre de recherche et filtres */}
      {showSearchBar && (
        <div className="py-4 px-4 sm:px-6 bg-gray-50 border-b">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher par nom, SKU, fournisseur..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
                {search && (
                  <button
                    onClick={() => setSearch('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
            
            <div className="flex items-center flex-wrap gap-2">
              <div className="flex items-center space-x-2">
                <select
                  value={categoryFilter}
                  onChange={(e) => {
                    setCategoryFilter(e.target.value);
                    setActiveTab(e.target.value === 'all' ? 'all' : e.target.value);
                  }}
                  className="px-3 py-2.5 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                >
                  <option value="all">Toutes catégories</option>
                  {categories
                    .filter(cat => cat !== 'all')
                    .map(category => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                </select>
              </div>
              
              <button
                onClick={loadProducts}
                className="p-2.5 border border-gray-300 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-50 transition-colors"
                title="Actualiser"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
              
              <button
                onClick={handleExportJSON}
                className="flex items-center space-x-2 px-3 sm:px-4 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-colors shadow-md hover:shadow-lg text-sm"
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Exporter JSON</span>
                <span className="sm:hidden">JSON</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Liste des produits */}
      <main className="bg-white">
        <div className="px-4 sm:px-6 py-4">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="ml-3 text-gray-600">Chargement des produits...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="py-12 text-center">
              <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Aucun produit trouvé</h3>
              <p className="text-gray-500 mb-4">
                {search ? 'Essayez un autre terme de recherche' : 'Commencez par ajouter un produit'}
              </p>
              {!search && (
                <button
                  onClick={() => router.push('/products/add')}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  <Plus className="w-4 h-4 inline mr-2" />
                  Ajouter un produit
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="text-sm text-gray-600">
                  {filteredProducts.length} produit{filteredProducts.length > 1 ? 's' : ''} trouvé{filteredProducts.length > 1 ? 's' : ''}
                  {search && ` pour "${search}"`}
                  {categoryFilter !== 'all' && ` dans "${categoryFilter}"`}
                </div>
                {!showSearchBar && (
                  <button
                    onClick={handleExportJSON}
                    className="flex items-center justify-center space-x-2 px-3 py-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-sm rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-colors w-full sm:w-auto"
                  >
                    <Download className="w-3 h-3" />
                    <span>Exporter JSON</span>
                  </button>
                )}
              </div>

              <ProductList
                products={filteredProducts}
                onDelete={handleDeleteProduct}
              />
            </>
          )}
        </div>
      </main>
    </div>
  );
}