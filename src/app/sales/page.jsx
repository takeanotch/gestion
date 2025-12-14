'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ShoppingCart, Plus, Filter, Search, X, 
  Download, RefreshCw, List, BarChart3,
  TrendingUp, Users, Package, CreditCard,
  Calendar, Eye, Trash2, ChevronLeft, ChevronRight,
  ArrowDownRight
} from 'lucide-react';
import SaleForm from '@/components/SaleForm';
import Notification from '@/components/Notification';
import SaleDetailsModal from '@/components/SaleDetailsModal';
import ReturnForm from '@/components/ReturnForm';
import { 
  getSales, getSalesStats, exportSalesCSV, cancelSale, 
  generateSaleNumber 
} from '@/lib/sales';

export default function SalesPage() {
  const router = useRouter();
  const [sales, setSales] = useState([]);
  const [showSaleForm, setShowSaleForm] = useState(false);
  const [showReturnForm, setShowReturnForm] = useState(false);
  const [selectedSale, setSelectedSale] = useState(null);
  const [selectedSaleForReturn, setSelectedSaleForReturn] = useState(null);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingStats, setLoadingStats] = useState(true);
  const [activePeriod, setActivePeriod] = useState('today');
  const [stats, setStats] = useState({
    total_sales: 0,
    total_revenue: 0,
    total_discounts: 0,
    average_sale: 0,
    unique_customers: 0,
    total_items: 0,
    total_quantity: 0
  });
  const [notification, setNotification] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    total_pages: 1
  });
  const [filters, setFilters] = useState({
    status: 'completed',
    startDate: '',
    endDate: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [showStats, setShowStats] = useState(true);
  const [showSearchBar, setShowSearchBar] = useState(true);

  const loadSales = useCallback(async () => {
    setLoading(true);
    try {
      let startDate = '';
      let endDate = '';
      const now = new Date();
      
      switch(activePeriod) {
        case 'today':
          startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
          endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59).toISOString();
          break;
        case 'yesterday':
          const yesterday = new Date(now);
          yesterday.setDate(now.getDate() - 1);
          startDate = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate()).toISOString();
          endDate = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate(), 23, 59, 59).toISOString();
          break;
        case 'week':
          const weekAgo = new Date(now);
          weekAgo.setDate(now.getDate() - 7);
          startDate = weekAgo.toISOString();
          endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59).toISOString();
          break;
        case 'month':
          const monthAgo = new Date(now);
          monthAgo.setDate(now.getDate() - 30);
          startDate = monthAgo.toISOString();
          endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59).toISOString();
          break;
        case 'year':
          const yearAgo = new Date(now);
          yearAgo.setFullYear(now.getFullYear() - 1);
          startDate = yearAgo.toISOString();
          endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59).toISOString();
          break;
      }

      const result = await getSales(
        pagination.page,
        pagination.limit,
        {
          ...filters,
          startDate: filters.startDate || (activePeriod !== 'all' ? startDate : undefined),
          endDate: filters.endDate || (activePeriod !== 'all' ? endDate : undefined),
          search: search.trim() || undefined
        }
      );
      
      setSales(result.sales);
      setPagination({
        page: result.pagination.page,
        limit: result.pagination.limit,
        total: result.pagination.total,
        total_pages: result.pagination.total_pages
      });
      
    } catch (error) {
      console.error('Erreur chargement ventes:', error);
      showNotification('error', '❌ Erreur lors du chargement des ventes');
    }
    setLoading(false);
  }, [pagination.page, pagination.limit, filters, search, activePeriod]);

  const loadStats = useCallback(async () => {
    setLoadingStats(true);
    try {
      const statsData = await getSalesStats(activePeriod);
      setStats(statsData);
    } catch (error) {
      console.error('Erreur chargement stats:', error);
      showNotification('error', '❌ Erreur lors du chargement des statistiques');
    }
    setLoadingStats(false);
  }, [activePeriod]);

  useEffect(() => {
    loadSales();
  }, [loadSales]);

  useEffect(() => {
    if (showStats) {
      loadStats();
    }
  }, [loadStats, showStats]);

  const handleCreateSale = async (saleData) => {
    try {
      const { createSale } = await import('@/lib/sales');
      const result = await createSale(saleData);
      
      if (result.success) {
        showNotification('success', '✅ Vente enregistrée avec succès!');
        setShowSaleForm(false);
        await loadSales();
        if (showStats) await loadStats();
      } else {
        showNotification('error', `❌ ${result.error || 'Échec de l\'enregistrement'}`);
      }
    } catch (error) {
      console.error('Erreur création vente:', error);
      showNotification('error', '❌ Erreur lors de la création de la vente');
    }
  };

  const handleCancelSale = async (saleId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir annuler cette vente? Cette action est irréversible.')) {
      return;
    }

    try {
      const result = await cancelSale(saleId);
      if (result.success) {
        showNotification('success', '✅ Vente annulée avec succès!');
        await loadSales();
        if (showStats) await loadStats();
      } else {
        showNotification('error', `❌ ${result.error || 'Échec de l\'annulation'}`);
      }
    } catch (error) {
      console.error('Erreur annulation vente:', error);
      showNotification('error', '❌ Erreur lors de l\'annulation de la vente');
    }
  };

  const handleCreateReturn = async (returnData) => {
    try {
      console.log('Création retour:', returnData);
      showNotification('success', '✅ Retour enregistré avec succès!');
      setShowReturnForm(false);
      setSelectedSaleForReturn(null);
      await loadSales();
      if (showStats) await loadStats();
    } catch (error) {
      console.error('Erreur création retour:', error);
      showNotification('error', '❌ Erreur lors de la création du retour');
    }
  };

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleResetFilters = () => {
    setFilters({
      status: 'completed',
      startDate: '',
      endDate: ''
    });
    setSearch('');
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.total_pages) {
      setPagination(prev => ({ ...prev, page: newPage }));
    }
  };

  const handleExport = async () => {
    try {
      const csvData = await exportSalesCSV(filters);
      
      if (csvData) {
        const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `ventes_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        showNotification('success', '✅ Export CSV terminé!');
      } else {
        showNotification('info', 'ℹ️ Aucune donnée à exporter');
      }
    } catch (error) {
      console.error('Erreur export:', error);
      showNotification('error', '❌ Erreur lors de l\'export');
    }
  };

  const periods = [
    { id: 'today', label: 'Aujourd\'hui' },
    { id: 'yesterday', label: 'Hier' },
    { id: 'week', label: '7 derniers jours' },
    { id: 'month', label: '30 derniers jours' },
    { id: 'year', label: 'Année' },
    { id: 'all', label: 'Tout' }
  ];

  const paymentMethodLabels = {
    cash: 'Espèces',
    card: 'Carte',
    check: 'Chèque',
    transfer: 'Virement',
    mobile: 'Mobile'
  };

  const statusColors = {
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
    refunded: 'bg-yellow-100 text-yellow-800',
    pending: 'bg-blue-100 text-blue-800'
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const statusLabels = {
    completed: 'Complété',
    cancelled: 'Annulé',
    refunded: 'Remboursé',
    pending: 'En attente'
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {notification && (
        <Notification
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}

      <div className="sticky top-0 z-20 bg-white border-b shadow-sm">
        <div className="px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center space-x-3">
              <div className="p-1.5 sm:p-2 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg sm:rounded-xl">
                <ShoppingCart className="w-5 h-5 sm:w-7 sm:h-7 text-green-600" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Ventes</h1>
                <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-500">
                  <span>{pagination.total} ventes</span>
                  <span className="hidden sm:inline w-1 h-1 bg-gray-300 rounded-full"></span>
                  <span className="font-semibold text-green-600">
                    {formatCurrency(stats.total_revenue)}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 sm:space-x-3">
              <button
                onClick={() => setShowSaleForm(true)}
                className="flex items-center space-x-1.5 sm:space-x-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all shadow-md hover:shadow-lg text-sm sm:text-base"
              >
                <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="font-medium">Nouvelle vente</span>
              </button>
            </div>
          </div>
        </div>

        <div className="px-4 sm:px-6 py-2 border-t bg-gray-50">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center space-x-2">
              <span className="text-xs sm:text-sm text-gray-600">Affichage:</span>
              <div className="flex flex-wrap gap-1">
                <button
                  onClick={() => setShowStats(!showStats)}
                  className={`flex items-center space-x-1 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs sm:text-sm transition-colors ${
                    showStats 
                      ? 'bg-green-600 text-white' 
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <BarChart3 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">Statistiques</span>
                  <span className="sm:hidden">Stats</span>
                </button>
                <button
                  onClick={() => setShowSearchBar(!showSearchBar)}
                  className={`flex items-center space-x-1 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs sm:text-sm transition-colors ${
                    showSearchBar 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <List className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">Recherche</span>
                  <span className="sm:hidden">Recherche</span>
                </button>
              </div>
            </div>
            
            <div className="text-xs sm:text-sm text-gray-500">
              Période: <span className="font-semibold">{periods.find(p => p.id === activePeriod)?.label}</span>
            </div>
          </div>
        </div>

        {showStats && (
          <div className="px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-gray-50 to-white border-t">
            {loadingStats ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="bg-white p-3 sm:p-4 rounded-lg sm:rounded-xl border animate-pulse">
                    <div className="h-3 sm:h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                    <div className="h-6 sm:h-8 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
                <div className="bg-white p-3 sm:p-4 rounded-lg sm:rounded-xl border shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs sm:text-sm text-gray-500">Ventes</div>
                      <div className="text-xl sm:text-2xl font-bold">{stats.total_sales}</div>
                    </div>
                    <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-green-500" />
                  </div>
                  <div className="mt-1 sm:mt-2 text-xs text-gray-500">
                    <span className="truncate">Période: {periods.find(p => p.id === activePeriod)?.label}</span>
                  </div>
                </div>
                
                <div className="bg-white p-3 sm:p-4 rounded-lg sm:rounded-xl border shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs sm:text-sm text-gray-500">Chiffre daffaires</div>
                      <div className="text-xl sm:text-2xl font-bold text-green-600">
                        {formatCurrency(stats.total_revenue)}
                      </div>
                    </div>
                    <CreditCard className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500" />
                  </div>
                  {stats.total_discounts > 0 && (
                    <div className="mt-1 sm:mt-2 text-xs text-gray-500">
                      Remises: {formatCurrency(stats.total_discounts)}
                    </div>
                  )}
                </div>
                
                <div className="bg-white p-3 sm:p-4 rounded-lg sm:rounded-xl border shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs sm:text-sm text-gray-500">Panier moyen</div>
                      <div className="text-xl sm:text-2xl font-bold">
                        {formatCurrency(stats.average_sale)}
                      </div>
                    </div>
                    <Users className="w-6 h-6 sm:w-8 sm:h-8 text-purple-500" />
                  </div>
                  <div className="mt-1 sm:mt-2 text-xs text-gray-500">
                    {stats.unique_customers} clients
                  </div>
                </div>
                
                <div className="bg-white p-3 sm:p-4 rounded-lg sm:rounded-xl border shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs sm:text-sm text-gray-500">Articles vendus</div>
                      <div className="text-xl sm:text-2xl font-bold">{stats.total_items}</div>
                    </div>
                    <Package className="w-6 h-6 sm:w-8 sm:h-8 text-orange-500" />
                  </div>
                  <div className="mt-1 sm:mt-2 text-xs text-gray-500">
                    {stats.total_quantity} unités
                  </div>
                </div>
                
                <div className="bg-white p-3 sm:p-4 rounded-lg sm:rounded-xl border shadow-sm">
                  <div>
                    <div className="text-xs sm:text-sm text-gray-500 mb-1">Période</div>
                    <select
                      value={activePeriod}
                      onChange={(e) => {
                        setActivePeriod(e.target.value);
                        setPagination(prev => ({ ...prev, page: 1 }));
                      }}
                      className="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-sm border rounded-lg bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    >
                      {periods.map(period => (
                        <option key={period.id} value={period.id}>
                          {period.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {showSearchBar && (
          <div className="px-4 sm:px-6 py-3 sm:py-4 border-t bg-white">
            <div className="flex flex-col gap-3">
              <div className="flex-1">
                <form onSubmit={handleSearch} className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Rechercher par numéro, client, produit..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-9 sm:pl-10 pr-8 sm:pr-10 py-2 sm:py-2.5 text-sm sm:text-base bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                  {search && (
                    <button
                      type="button"
                      onClick={() => setSearch('')}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </button>
                  )}
                </form>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`flex items-center space-x-1.5 px-3 sm:px-4 py-1.5 sm:py-2.5 border rounded-lg transition-colors text-sm ${
                      showFilters 
                        ? 'bg-green-50 border-green-500 text-green-700' 
                        : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Filter className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline">Filtres</span>
                    {(filters.status !== 'completed' || filters.startDate || filters.endDate) && (
                      <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full"></span>
                    )}
                  </button>
                  
                  <button
                    onClick={loadSales}
                    className="p-2 sm:p-2.5 border border-gray-300 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-50 transition-colors"
                    title="Actualiser"
                  >
                    <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                  
                  <button
                    onClick={handleExport}
                    className="p-2 sm:p-2.5 border border-gray-300 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-50 transition-colors"
                    title="Exporter"
                  >
                    <Download className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </div>
              </div>

              {showFilters && (
                <div className="mt-3 p-3 sm:p-4 bg-gray-50 rounded-lg border">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                        Statut
                      </label>
                      <select
                        value={filters.status}
                        onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                        className="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-sm border rounded-lg"
                      >
                        <option value="">Tous</option>
                        <option value="completed">Complétées</option>
                        <option value="cancelled">Annulées</option>
                        <option value="refunded">Remboursées</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                        Date début
                      </label>
                      <input
                        type="date"
                        value={filters.startDate}
                        onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                        className="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-sm border rounded-lg"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                        Date fin
                      </label>
                      <input
                        type="date"
                        value={filters.endDate}
                        onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                        className="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-sm border rounded-lg"
                      />
                    </div>
                    
                    <div className="flex flex-col sm:flex-row sm:items-end space-y-2 sm:space-y-0 sm:space-x-2">
                      <button
                        onClick={() => {
                          setPagination(prev => ({ ...prev, page: 1 }));
                          loadSales();
                        }}
                        className="flex-1 px-3 sm:px-4 py-1.5 sm:py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm sm:text-base"
                      >
                        Appliquer
                      </button>
                      <button
                        onClick={handleResetFilters}
                        className="px-3 sm:px-4 py-1.5 sm:py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm sm:text-base"
                      >
                        Réinitialiser
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="flex-1">
        <div className="px-2 sm:px-4 lg:px-6 py-3 sm:py-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-8 sm:py-12">
              <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-green-600 mb-3 sm:mb-4"></div>
              <p className="text-sm sm:text-base text-gray-600">Chargement des ventes...</p>
            </div>
          ) : sales.length === 0 ? (
            <div className="py-8 sm:py-12 text-center bg-white rounded-lg sm:rounded-xl border shadow-sm">
              <ShoppingCart className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-3 sm:mb-4" />
              <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-1.5 sm:mb-2">
                {pagination.total === 0 ? 'Aucune vente enregistrée' : 'Aucune vente ne correspond aux filtres'}
              </h3>
              <p className="text-sm text-gray-500 mb-4 sm:mb-6 max-w-md mx-auto px-2">
                {pagination.total === 0 
                  ? 'Commencez par enregistrer une vente' 
                  : 'Ajustez vos filtres de recherche'}
              </p>
              <button
                onClick={() => setShowSaleForm(true)}
                className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-colors shadow-md text-sm sm:text-base"
              >
                <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 inline mr-1.5 sm:mr-2" />
                Nouvelle vente
              </button>
            </div>
          ) : (
            <>
              <div className="hidden lg:block bg-white rounded-xl border shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Numéro
                        </th>
                        <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Client
                        </th>
                        <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Montant
                        </th>
                        <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Paiement
                        </th>
                        <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Statut
                        </th>
                        <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {sales.map((sale) => (
                        <tr key={sale.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                            <div className="flex flex-col">
                              <span className="text-sm font-medium text-gray-900">
                                {sale.sale_number || `#${sale.id}`}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {formatDate(sale.sale_date)}
                            </div>
                            <div className="text-xs text-gray-500">
                              {formatTime(sale.sale_date)}
                            </div>
                          </td>
                          <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {sale.customer_name || 'Non spécifié'}
                            </div>
                            {sale.customer_phone && (
                              <div className="text-xs text-gray-500">
                                {sale.customer_phone}
                              </div>
                            )}
                          </td>
                          <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                            <div className="flex flex-col">
                              <span className="text-sm font-semibold text-green-600">
                                {formatCurrency(sale.total_amount)}
                              </span>
                              {sale.discount_amount > 0 && (
                                <span className="text-xs text-gray-500 line-through">
                                  {formatCurrency(sale.subtotal_amount || sale.total_amount)}
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              sale.payment_method === 'cash' 
                                ? 'bg-yellow-100 text-yellow-800'
                                : sale.payment_method === 'card'
                                ? 'bg-blue-100 text-blue-800'
                                : sale.payment_method === 'mobile'
                                ? 'bg-purple-100 text-purple-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {paymentMethodLabels[sale.payment_method] || sale.payment_method}
                            </span>
                          </td>
                          <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                              statusColors[sale.status || 'completed'] || 'bg-gray-100 text-gray-800'
                            }`}>
                              {statusLabels[sale.status || 'completed'] || sale.status || 'Complété'}
                            </span>
                          </td>
                          <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex items-center space-x-1.5">
                              <button
                                onClick={() => {
                                  const { getSaleById } = require('@/lib/sales');
                                  getSaleById(sale.id).then((details) => {
                                    setSelectedSale(details);
                                  });
                                }}
                                className="p-1.5 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded transition-colors"
                                title="Voir détails"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              
                              {sale.status === 'completed' && (
                                <button
                                  onClick={() => {
                                    setSelectedSaleForReturn(sale);
                                    setShowReturnForm(true);
                                  }}
                                  className="p-1.5 text-purple-600 hover:text-purple-900 hover:bg-purple-50 rounded transition-colors"
                                  title="Retour marchandise"
                                >
                                  <ArrowDownRight className="w-4 h-4" />
                                </button>
                              )}
                              
                              {sale.status === 'completed' && (
                                <button
                                  onClick={() => handleCancelSale(sale.id)}
                                  className="p-1.5 text-red-600 hover:text-red-900 hover:bg-red-50 rounded transition-colors"
                                  title="Annuler vente"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="lg:hidden space-y-3">
                {sales.map((sale) => (
                  <div key={sale.id} className="bg-white rounded-lg border shadow-sm p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-gray-900">
                            {sale.sale_number || `#${sale.id}`}
                          </span>
                          <span className={`px-2 py-0.5 text-xs rounded-full ${
                            statusColors[sale.status || 'completed'] || 'bg-gray-100 text-gray-800'
                          }`}>
                            {statusLabels[sale.status || 'completed'] || sale.status || 'Complété'}
                          </span>
                        </div>
                        <div className="text-sm text-gray-500">
                          {formatDate(sale.sale_date)} à {formatTime(sale.sale_date)}
                        </div>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        sale.payment_method === 'cash' 
                          ? 'bg-yellow-100 text-yellow-800'
                          : sale.payment_method === 'card'
                          ? 'bg-blue-100 text-blue-800'
                          : sale.payment_method === 'mobile'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {paymentMethodLabels[sale.payment_method] || sale.payment_method}
                      </span>
                    </div>
                    
                    <div className="mb-3">
                      <div className="font-medium text-gray-900">
                        {sale.customer_name || 'Non spécifié'}
                      </div>
                      {sale.customer_phone && (
                        <div className="text-sm text-gray-500">
                          {sale.customer_phone}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-bold text-lg text-green-600">
                          {formatCurrency(sale.total_amount)}
                        </div>
                        {sale.discount_amount > 0 && (
                          <div className="text-sm text-gray-500 line-through">
                            {formatCurrency(sale.subtotal_amount || sale.total_amount)}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => {
                            const { getSaleById } = require('@/lib/sales');
                            getSaleById(sale.id).then((details) => {
                              setSelectedSale(details);
                            });
                          }}
                          className="p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Voir détails"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        
                        {sale.status === 'completed' && (
                          <button
                            onClick={() => {
                              setSelectedSaleForReturn(sale);
                              setShowReturnForm(true);
                            }}
                            className="p-2 text-purple-600 hover:text-purple-900 hover:bg-purple-50 rounded-lg transition-colors"
                            title="Retour marchandise"
                          >
                            <ArrowDownRight className="w-4 h-4" />
                          </button>
                        )}
                        
                        {sale.status === 'completed' && (
                          <button
                            onClick={() => handleCancelSale(sale.id)}
                            className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-lg transition-colors"
                            title="Annuler vente"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {pagination.total_pages > 1 && (
                <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0">
                  <div className="text-xs sm:text-sm text-gray-700">
                    Affichage de <span className="font-medium">{(pagination.page - 1) * pagination.limit + 1}</span> à{' '}
                    <span className="font-medium">
                      {Math.min(pagination.page * pagination.limit, pagination.total)}
                    </span>{' '}
                    sur <span className="font-medium">{pagination.total}</span> résultats
                  </div>
                  
                  <div className="flex items-center justify-between sm:justify-end space-x-1 sm:space-x-2">
                    <button
                      onClick={() => handlePageChange(pagination.page - 1)}
                      disabled={pagination.page === 1}
                      className={`p-1.5 sm:p-2 border rounded-lg text-sm ${
                        pagination.page === 1
                          ? 'text-gray-400 cursor-not-allowed'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                    
                    <div className="flex items-center space-x-1">
                      {(() => {
                        const pages = [];
                        const maxVisible = window.innerWidth < 640 ? 3 : 5;
                        const start = Math.max(1, pagination.page - Math.floor(maxVisible / 2));
                        const end = Math.min(pagination.total_pages, start + maxVisible - 1);
                        
                        for (let i = start; i <= end; i++) {
                          pages.push(
                            <button
                              key={i}
                              onClick={() => handlePageChange(i)}
                              className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs sm:text-sm ${
                                pagination.page === i
                                  ? 'bg-green-600 text-white'
                                  : 'border text-gray-700 hover:bg-gray-50'
                              }`}
                            >
                              {i}
                            </button>
                          );
                        }
                        return pages;
                      })()}
                    </div>
                    
                    <button
                      onClick={() => handlePageChange(pagination.page + 1)}
                      disabled={pagination.page === pagination.total_pages}
                      className={`p-1.5 sm:p-2 border rounded-lg text-sm ${
                        pagination.page === pagination.total_pages
                          ? 'text-gray-400 cursor-not-allowed'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {showSaleForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-white rounded-lg sm:rounded-xl lg:rounded-2xl shadow-xl sm:shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-auto">
            <SaleForm
              onSubmit={handleCreateSale}
              onClose={() => setShowSaleForm(false)}
            />
          </div>
        </div>
      )}

      {showReturnForm && selectedSaleForReturn && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-white rounded-lg sm:rounded-xl lg:rounded-2xl shadow-xl sm:shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-auto">
            <ReturnForm
              sale={selectedSaleForReturn}
              onSubmit={handleCreateReturn}
              onClose={() => {
                setShowReturnForm(false);
                setSelectedSaleForReturn(null);
              }}
            />
          </div>
        </div>
      )}

      {selectedSale && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-white max-h-[80vh] overflow-auto rounded-lg sm:rounded-xl lg:rounded-2xl shadow-xl sm:shadow-2xl w-full max-w-6xl">
            <SaleDetailsModal
              sale={selectedSale}
              onClose={() => setSelectedSale(null)}
              onReturn={() => {
                setSelectedSaleForReturn(selectedSale);
                setSelectedSale(null);
                setShowReturnForm(true);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}