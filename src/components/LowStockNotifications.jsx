'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import {
  AlertCircle,
  Package,
  ShoppingBag,
  TrendingDown,
  X,
  Check,
  RefreshCw,
  Filter,
  Download,
  Eye,
  Bell
} from 'lucide-react'

export default function LowStockNotifications() {
  const [lowStockProducts, setLowStockProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAll, setShowAll] = useState(false)
  const [filters, setFilters] = useState({
    category: '',
    supplier: ''
  })
  const [categories, setCategories] = useState([])
  const [suppliers, setSuppliers] = useState([])

  useEffect(() => {
    loadLowStockProducts()
    loadCategories()
    loadSuppliers()
    
    // Actualiser toutes les 5 minutes
    const interval = setInterval(loadLowStockProducts, 300000)
    
    return () => clearInterval(interval)
  }, [filters])

  const loadLowStockProducts = async () => {
    setLoading(true)
    
    try {
      let query = supabase
        .from('products')
        .select(`
          *,
          category:categories(id, name),
          supplier:suppliers(id, name),
          stock:stock(quantity, minimum_threshold, last_restocked)
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false })

      // Appliquer les filtres
      if (filters.category) {
        query = query.eq('category_id', filters.category)
      }
      
      if (filters.supplier) {
        query = query.eq('supplier_id', filters.supplier)
      }

      const { data, error } = await query

      if (!error && data) {
        // Filtrer les produits en stock faible
        const lowStock = data.filter(product => {
          const stock = product.stock?.[0]
          return stock && stock.quantity <= stock.minimum_threshold
        })
        
        // Trier par niveau de stock (plus critique en premier)
        const sortedProducts = lowStock.sort((a, b) => {
          const stockLevelA = a.stock[0].quantity / a.stock[0].minimum_threshold
          const stockLevelB = b.stock[0].quantity / b.stock[0].minimum_threshold
          return stockLevelA - stockLevelB
        })
        
        setLowStockProducts(sortedProducts)
      }
    } catch (error) {
      console.error('Erreur chargement stock faible:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('id, name')
        .order('name')
      
      if (!error && data) {
        setCategories(data)
      }
    } catch (error) {
      console.error('Erreur chargement catégories:', error)
    }
  }

  const loadSuppliers = async () => {
    try {
      const { data, error } = await supabase
        .from('suppliers')
        .select('id, name')
        .eq('is_active', true)
        .order('name')
      
      if (!error && data) {
        setSuppliers(data)
      }
    } catch (error) {
      console.error('Erreur chargement fournisseurs:', error)
    }
  }

  const handleRestock = async (productId, currentQuantity) => {
    const newQuantity = prompt(
      'Entrez la nouvelle quantité après réapprovisionnement:',
      (currentQuantity + 10).toString()
    )
    
    if (newQuantity && !isNaN(parseInt(newQuantity))) {
      try {
        const { error } = await supabase
          .from('stock')
          .update({ 
            quantity: parseInt(newQuantity),
            last_restocked: new Date().toISOString()
          })
          .eq('product_id', productId)

        if (error) throw error
        
        alert('Stock mis à jour avec succès')
        loadLowStockProducts()
      } catch (error) {
        console.error('Erreur mise à jour stock:', error)
        alert('Erreur lors de la mise à jour')
      }
    }
  }

  const exportToCSV = () => {
    const headers = ['Nom du produit', 'SKU', 'Catégorie', 'Fournisseur', 'Stock actuel', 'Seuil minimum', 'Urgence']
    
    const csvData = lowStockProducts.map(product => [
      product.name,
      product.sku,
      product.category?.name || 'Non catégorisé',
      product.supplier?.name || 'Inconnu',
      product.stock[0].quantity,
      product.stock[0].minimum_threshold,
      product.stock[0].quantity === 0 ? 'CRITIQUE' :
      product.stock[0].quantity < (product.stock[0].minimum_threshold / 2) ? 'ÉLEVÉE' : 'MOYENNE'
    ])
    
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    
    link.setAttribute('href', url)
    link.setAttribute('download', `stock_faible_${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const markAsResolved = async (productId) => {
    try {
      // Augmenter temporairement le seuil pour que le produit ne soit plus en alerte
      const { error } = await supabase
        .from('stock')
        .update({ 
          minimum_threshold: 1 // Mettre à 1 pour que le produit ne soit plus en alerte
        })
        .eq('product_id', productId)

      if (error) throw error
      
      alert('Produit marqué comme résolu')
      loadLowStockProducts()
    } catch (error) {
      console.error('Erreur marquage résolu:', error)
      alert('Erreur lors du marquage')
    }
  }

  const getStockUrgency = (quantity, threshold) => {
    if (quantity === 0) return { level: 'critical', label: 'CRITIQUE', color: 'bg-red-600' }
    if (quantity < threshold / 2) return { level: 'high', label: 'ÉLEVÉE', color: 'bg-orange-500' }
    return { level: 'medium', label: 'MOYENNE', color: 'bg-yellow-500' }
  }

  const productsToShow = showAll ? lowStockProducts : lowStockProducts.slice(0, 5)

  if (loading && lowStockProducts.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-center space-x-3">
          <RefreshCw className="w-5 h-5 animate-spin text-gray-600" />
          <span className="text-gray-600">Chargement des notifications...</span>
        </div>
      </div>
    )
  }

  if (lowStockProducts.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="text-center">
          <Package className="w-12 h-12 text-green-500 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">
            Stock optimal
          </h3>
          <p className="text-gray-500 text-sm">
            Aucun produit en stock faible. Tout est sous contrôle.
          </p>
          <button
            onClick={loadLowStockProducts}
            className="mt-4 inline-flex items-center space-x-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition text-sm"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Actualiser</span>
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                Alerte Stock Faible
              </h2>
              <p className="text-sm text-gray-600">
                {lowStockProducts.length} produit{lowStockProducts.length > 1 ? 's nécessitent' : ' nécessite'} votre attention
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={exportToCSV}
              className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Exporter</span>
            </button>
            <button
              onClick={loadLowStockProducts}
              className="flex items-center space-x-2 px-3 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition text-sm"
            >
              <RefreshCw className="w-4 h-4" />
              <span className="hidden sm:inline">Actualiser</span>
            </button>
          </div>
        </div>
        
        {/* Filtres */}
        <div className="mt-4 flex flex-wrap gap-2">
          <select
            value={filters.category}
            onChange={(e) => setFilters({...filters, category: e.target.value})}
            className="px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-gray-900 focus:border-gray-900 bg-white text-sm"
          >
            <option value="">Toutes catégories</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          
          <select
            value={filters.supplier}
            onChange={(e) => setFilters({...filters, supplier: e.target.value})}
            className="px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-gray-900 focus:border-gray-900 bg-white text-sm"
          >
            <option value="">Tous fournisseurs</option>
            {suppliers.map(supplier => (
              <option key={supplier.id} value={supplier.id}>
                {supplier.name}
              </option>
            ))}
          </select>
          
          {(filters.category || filters.supplier) && (
            <button
              onClick={() => setFilters({ category: '', supplier: '' })}
              className="px-3 py-1.5 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm"
            >
              <X className="w-4 h-4 inline mr-1" />
              Réinitialiser
            </button>
          )}
        </div>
      </div>
      
      {/* Liste des produits */}
      <div className="divide-y divide-gray-100">
        {productsToShow.map((product) => {
          const stock = product.stock[0]
          const urgency = getStockUrgency(stock.quantity, stock.minimum_threshold)
          const stockPercentage = (stock.quantity / stock.minimum_threshold) * 100
          
          return (
            <div key={product.id} className="p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className={`w-3 h-3 rounded-full ${urgency.color}`}></div>
                    <h3 className="font-medium text-gray-900 truncate">
                      {product.name}
                    </h3>
                    <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${urgency.color} text-white`}>
                      {urgency.label}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm mb-3">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <Package className="w-3 h-3 text-gray-400" />
                        <span className="text-gray-500">SKU:</span>
                        <span className="font-medium">{product.sku}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <ShoppingBag className="w-3 h-3 text-gray-400" />
                        <span className="text-gray-500">Catégorie:</span>
                        <span>{product.category?.name || 'Non catégorisé'}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <TrendingDown className="w-3 h-3 text-gray-400" />
                        <span className="text-gray-500">Fournisseur:</span>
                        <span>{product.supplier?.name || 'Inconnu'}</span>
                      </div>
                      <div className="text-gray-500">
                        Dernier réappro: {stock.last_restocked 
                          ? new Date(stock.last_restocked).toLocaleDateString('fr-FR')
                          : 'Jamais'
                        }
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500">Stock actuel:</span>
                        <span className={`font-bold ${urgency.level === 'critical' ? 'text-red-600' : urgency.level === 'high' ? 'text-orange-600' : 'text-yellow-600'}`}>
                          {stock.quantity} unités
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500">Seuil minimum:</span>
                        <span className="font-medium">{stock.minimum_threshold} unités</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Barre de progression */}
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                      <span>Niveau de stock</span>
                      <span>{stockPercentage.toFixed(0)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          stockPercentage < 25 ? 'bg-red-600' :
                          stockPercentage < 50 ? 'bg-orange-500' :
                          stockPercentage < 75 ? 'bg-yellow-500' :
                          'bg-green-500'
                        }`}
                        style={{ width: `${Math.min(stockPercentage, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
                
                <div className="ml-4 flex flex-col space-y-2">
                  <button
                    onClick={() => handleRestock(product.id, stock.quantity)}
                    className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition whitespace-nowrap"
                  >
                    Réapprovisionner
                  </button>
                  <button
                    onClick={() => markAsResolved(product.id)}
                    className="px-3 py-1.5 border border-green-600 text-green-600 text-sm rounded-lg hover:bg-green-50 transition whitespace-nowrap"
                  >
                    Marquer résolu
                  </button>
                  <a
                    href={`/super-admin/products?edit=${product.id}`}
                    className="px-3 py-1.5 border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50 transition whitespace-nowrap text-center"
                  >
                    <Eye className="w-3 h-3 inline mr-1" />
                    Détails
                  </a>
                </div>
              </div>
            </div>
          )
        })}
      </div>
      
      {/* Footer */}
      {lowStockProducts.length > 5 && (
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setShowAll(!showAll)}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              {showAll ? 'Afficher moins' : `Voir les ${lowStockProducts.length - 5} autres produits`}
            </button>
            
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Bell className="w-4 h-4" />
              <span>
                Dernière vérification: {new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}