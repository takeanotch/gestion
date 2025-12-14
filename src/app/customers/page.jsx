'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Plus, Search, Filter, Edit, Trash2, Download, 
  RefreshCw, X, ChevronLeft, ChevronRight,
  Mail, Phone, ShoppingBag, Award, Users,
  UserCheck, TrendingUp, Calendar, Building
} from 'lucide-react';
import Notification from '@/components/Notification';
import {
  getCustomers,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  searchCustomers,
  exportCustomersCSV,
  getCustomersStats,
  generateCustomerNumber
} from '@/lib/customers';

export default function CustomersPage() {
  const router = useRouter();
  
  // États principaux
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [showCustomerForm, setShowCustomerForm] = useState(false);
  
  // Notification
  const [notification, setNotification] = useState(null);

  // Stats
  const [stats, setStats] = useState({
    total_customers: 0,
    active_customers: 0,
    average_purchases: 0,
    total_loyalty_points: 0,
    total_spent: 0,
    new_customers_month: 0
  });

  // Filtres
  const [filters, setFilters] = useState({
    search: '',
    min_purchases: undefined,
    min_total_spent: undefined,
    has_loyalty_points: false
  });

  // Pagination
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    total_pages: 1
  });

  // Formulaire
  const [formData, setFormData] = useState({
    customer_number: generateCustomerNumber(),
    name: '',
    phone: '',
    email: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  // Charger les données
  const loadCustomers = useCallback(async () => {
    console.log('🔄 Chargement clients...');
    setLoading(true);
    
    try {
      const [customersData, statsData] = await Promise.all([
        getCustomers(pagination.page, pagination.limit, filters),
        getCustomersStats()
      ]);
      
      console.log(`👥 ${customersData.customers.length} clients chargés`);
      setCustomers(customersData.customers);
      setFilteredCustomers(customersData.customers);
      setPagination(customersData.pagination);
      setStats(statsData);
      
    } catch (error) {
      console.error('❌ Erreur chargement clients:', error);
      showNotification('error', '❌ Erreur lors du chargement des clients');
    }
    
    setLoading(false);
  }, [pagination.page, pagination.limit, filters]);

  // Initialisation
  useEffect(() => {
    console.log('🔍 Initialisation Dashboard Clients');
    loadCustomers();
  }, [loadCustomers]);

  // Recherche en temps réel
  useEffect(() => {
    if (search.trim()) {
      const searchLower = search.toLowerCase().trim();
      const filtered = customers.filter(customer => 
        customer.name?.toLowerCase().includes(searchLower) ||
        customer.customer_number?.toLowerCase().includes(searchLower) ||
        customer.phone?.toLowerCase().includes(searchLower) ||
        customer.email?.toLowerCase().includes(searchLower)
      );
      setFilteredCustomers(filtered);
    } else {
      setFilteredCustomers(customers);
    }
  }, [search, customers]);

  // Afficher notification
  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  // Gestion des filtres
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const applyFilters = () => {
    setPagination(prev => ({ ...prev, page: 1 }));
    loadCustomers();
    setShowFilters(false);
  };

  const resetFilters = () => {
    setFilters({
      search: '',
      min_purchases: undefined,
      min_total_spent: undefined,
      has_loyalty_points: false
    });
    setPagination(prev => ({ ...prev, page: 1 }));
    loadCustomers();
  };

  // Gestion du formulaire
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.name.trim()) {
      errors.name = 'Le nom est obligatoire';
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Email invalide';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCreateCustomer = async () => {
    if (!validateForm()) return;

    try {
      const result = await createCustomer({
        customer_number: formData.customer_number,
        name: formData.name,
        phone: formData.phone || undefined,
        email: formData.email || undefined,
        loyalty_points: formData.loyalty_points || 0
      });

      if (result.success) {
        showNotification('success', '✅ Client créé avec succès');
        setShowCustomerForm(false);
        resetForm();
        loadCustomers();
      } else {
        showNotification('error', result.error || '❌ Erreur lors de la création');
      }
    } catch (error) {
      showNotification('error', '❌ Erreur lors de la création du client');
    }
  };

  const handleUpdateCustomer = async () => {
    if (!validateForm() || !selectedCustomer?.id) return;

    try {
      const result = await updateCustomer(selectedCustomer.id, {
        customer_number: formData.customer_number,
        name: formData.name,
        phone: formData.phone || undefined,
        email: formData.email || undefined,
        loyalty_points: formData.loyalty_points
      });

      if (result.success) {
        showNotification('success', '✅ Client mis à jour avec succès');
        setShowCustomerForm(false);
        resetForm();
        loadCustomers();
      } else {
        showNotification('error', result.error || '❌ Erreur lors de la mise à jour');
      }
    } catch (error) {
      showNotification('error', '❌ Erreur lors de la mise à jour du client');
    }
  };

  const handleDeleteCustomer = async (customerId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce client ?')) return;

    try {
      const result = await deleteCustomer(customerId);
      if (result.success) {
        showNotification('success', '✅ Client supprimé avec succès');
        loadCustomers();
      } else {
        showNotification('error', result.error || '❌ Erreur lors de la suppression');
      }
    } catch (error) {
      showNotification('error', '❌ Erreur lors de la suppression du client');
    }
  };

  const resetForm = () => {
    setFormData({
      customer_number: generateCustomerNumber(),
      name: '',
      phone: '',
      email: ''
    });
    setFormErrors({});
    setSelectedCustomer(null);
  };

  const openEditForm = (customer) => {
    setSelectedCustomer(customer);
    setFormData({
      id: customer.id,
      customer_number: customer.customer_number,
      name: customer.name,
      phone: customer.phone || '',
      email: customer.email || '',
      loyalty_points: customer.loyalty_points
    });
    setShowCustomerForm(true);
  };

  const openCreateForm = () => {
    resetForm();
    setShowCustomerForm(true);
  };

  // Export CSV
  const handleExportCSV = async () => {
    try {
      const csvContent = await exportCustomersCSV(filters);
      if (!csvContent) {
        showNotification('error', '❌ Aucune donnée à exporter');
        return;
      }

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `clients_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      showNotification('success', `✅ Export CSV réussi (${filteredCustomers.length} clients)`);
    } catch (error) {
      showNotification('error', '❌ Erreur lors de l\'export CSV');
    }
  };

  // Pagination
  const goToPage = (page) => {
    setPagination(prev => ({ ...prev, page }));
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
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Clients</h1>
                <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
                  <span>{stats.total_customers} clients</span>
                  <span className="hidden sm:inline">•</span>
                  <span>Actifs: {stats.active_customers}</span>
                  <span className="hidden sm:inline">•</span>
                  <span>{stats.total_loyalty_points} points fidélité</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm transition-colors bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
              >
                <Filter className="w-4 h-4" />
                <span className="hidden sm:inline">Filtres</span>
              </button>
              
              <button
                onClick={openCreateForm}
                className="flex items-center space-x-2 px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                <Plus className="w-4 h-4" />
                <span className='hidden sm:inline'>Nouveau client</span>
                <span className='sm:hidden'>Ajouter</span>
              </button>
            </div>
          </div>
        </div>

        {/* Onglets simplifiés */}
        <div className="px-4 sm:px-6 border-t bg-white overflow-x-auto">
          <div className="flex space-x-1 min-w-max py-2">
            {['all', 'active', 'loyalty'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-2 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === tab
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab === 'all' ? 'Tous' : 
                 tab === 'active' ? 'Actifs' : 
                 'Fidélité'}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Cartes de statistiques (plus petites) */}
      <div className="px-4 sm:px-6 py-4">
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          <div className="bg-white p-4 rounded-xl shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">Total Clients</p>
                <p className="text-lg sm:text-xl font-bold text-gray-900">{stats.total_customers}</p>
              </div>
              <Users className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">Clients Actifs</p>
                <p className="text-lg sm:text-xl font-bold text-gray-900">{stats.active_customers}</p>
              </div>
              <UserCheck className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">Moyenne Achat</p>
                <p className="text-lg sm:text-xl font-bold text-gray-900">
                  {stats.average_purchases.toFixed(1)}
                </p>
              </div>
              <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500" />
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">Points Fidélité</p>
                <p className="text-lg sm:text-xl font-bold text-gray-900">{stats.total_loyalty_points}</p>
              </div>
              <Award className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />
            </div>
          </div>
        </div>

        {/* Barre de recherche et filtres */}
        {showFilters && (
          <div className="mb-6 bg-white rounded-xl shadow-sm border p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Achats minimum
                </label>
                <input
                  type="number"
                  value={filters.min_purchases || ''}
                  onChange={(e) => handleFilterChange('min_purchases', e.target.value ? parseInt(e.target.value) : undefined)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  placeholder="0"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Total dépensé minimum
                </label>
                <input
                  type="number"
                  value={filters.min_total_spent || ''}
                  onChange={(e) => handleFilterChange('min_total_spent', e.target.value ? parseFloat(e.target.value) : undefined)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  placeholder="0"
                  min="0"
                  step="0.01"
                />
              </div>

              <div className="flex items-center space-x-3">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.has_loyalty_points || false}
                    onChange={(e) => handleFilterChange('has_loyalty_points', e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Avec points fidélité</span>
                </label>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={resetFilters}
                    className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Réinitialiser
                  </button>
                  <button
                    onClick={applyFilters}
                    className="px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Appliquer
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Barre de recherche principale */}
        <div className="bg-white rounded-xl shadow-sm border mb-6 p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher par nom, téléphone, email, numéro..."
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
              <button
                onClick={loadCustomers}
                className="p-2.5 border border-gray-300 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-50 transition-colors"
                title="Actualiser"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
              
              <button
                onClick={handleExportCSV}
                className="flex items-center space-x-2 px-3 sm:px-4 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-colors shadow-md hover:shadow-lg text-sm"
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Exporter CSV</span>
                <span className="sm:hidden">CSV</span>
              </button>
            </div>
          </div>
        </div>

        {/* Liste des clients */}
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    Client
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    Contact
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    Statistiques
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    Dernier achat
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-4 sm:px-6 py-12 text-center">
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        <p className="ml-3 text-gray-600">Chargement des clients...</p>
                      </div>
                    </td>
                  </tr>
                ) : filteredCustomers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 sm:px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center text-gray-500">
                        <Users className="w-12 h-12 mb-3 text-gray-300" />
                        <h3 className="text-lg font-semibold text-gray-700 mb-2">Aucun client trouvé</h3>
                        <p className="text-gray-500 mb-4">
                          {search ? 'Essayez un autre terme de recherche' : 'Commencez par ajouter un client'}
                        </p>
                        {!search && (
                          <button
                            onClick={openCreateForm}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                          >
                            <Plus className="w-4 h-4 inline mr-2" />
                            Ajouter un client
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredCustomers.map((customer) => (
                    <tr key={customer.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 sm:px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <span className="text-blue-600 font-bold">
                              {customer.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 text-sm sm:text-base">{customer.name}</p>
                            <p className="text-xs text-gray-500">{customer.customer_number}</p>
                            {customer.loyalty_points && customer.loyalty_points > 0 && (
                              <div className="flex items-center gap-1 mt-1">
                                <Award className="w-3 h-3 text-yellow-500" />
                                <span className="text-xs text-yellow-600 font-medium">
                                  {customer.loyalty_points} pts
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-4">
                        <div className="space-y-1">
                          {customer.phone && (
                            <div className="flex items-center gap-2">
                              <Phone className="w-3 h-3 text-gray-400" />
                              <span className="text-xs sm:text-sm text-gray-700">{customer.phone}</span>
                            </div>
                          )}
                          {customer.email && (
                            <div className="flex items-center gap-2">
                              <Mail className="w-3 h-3 text-gray-400" />
                              <span className="text-xs sm:text-sm text-gray-700 truncate max-w-[150px]">
                                {customer.email}
                              </span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <ShoppingBag className="w-3 h-3 text-gray-400" />
                            <span className="text-xs sm:text-sm">
                              {customer.purchase_count || 0} achats
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <TrendingUp className="w-3 h-3 text-gray-400" />
                            <span className="text-xs sm:text-sm font-medium">
                              {customer.total_spent?.toFixed(2) || '0.00'} €
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-4">
                        {customer.last_purchase_date ? (
                          <div className="flex items-center gap-2">
                            <Calendar className="w-3 h-3 text-gray-400" />
                            <span className="text-xs sm:text-sm text-gray-700">
                              {new Date(customer.last_purchase_date).toLocaleDateString('fr-FR')}
                            </span>
                          </div>
                        ) : (
                          <span className="text-xs sm:text-sm text-gray-500">Jamais acheté</span>
                        )}
                      </td>
                      <td className="px-4 sm:px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => openEditForm(customer)}
                            className="inline-flex items-center px-3 py-1.5 text-sm text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-md transition-colors"
                            title="Modifier"
                          >
                            <Edit className="w-4 h-4 mr-1" />
                            <span className="hidden sm:inline">Modifier</span>
                          </button>
                          <button
                            onClick={() => customer.id && handleDeleteCustomer(customer.id)}
                            className="inline-flex items-center px-3 py-1.5 text-sm text-red-600 hover:text-red-900 hover:bg-red-50 rounded-md transition-colors"
                            title="Supprimer"
                          >
                            <Trash2 className="w-4 h-4 mr-1" />
                            <span className="hidden sm:inline">Supprimer</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination.total_pages > 1 && (
            <div className="px-4 sm:px-6 py-4 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="text-sm text-gray-700">
                  Affichage de <span className="font-medium">{filteredCustomers.length}</span> sur{' '}
                  <span className="font-medium">{pagination.total}</span> clients
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => goToPage(pagination.page - 1)}
                    disabled={pagination.page === 1}
                    className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  
                  <span className="text-sm text-gray-700">
                    Page {pagination.page} sur {pagination.total_pages}
                  </span>
                  
                  <button
                    onClick={() => goToPage(pagination.page + 1)}
                    disabled={pagination.page === pagination.total_pages}
                    className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modale du formulaire client */}
      {showCustomerForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  {selectedCustomer ? 'Modifier le client' : 'Nouveau client'}
                </h2>
                <button
                  onClick={() => setShowCustomerForm(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Numéro client *
                  </label>
                  <input
                    type="text"
                    name="customer_number"
                    value={formData.customer_number}
                    onChange={handleFormChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm ${
                      formErrors.customer_number ? 'border-red-300' : 'border-gray-300'
                    }`}
                    required
                  />
                  {formErrors.customer_number && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.customer_number}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nom complet *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleFormChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm ${
                      formErrors.name ? 'border-red-300' : 'border-gray-300'
                    }`}
                    required
                  />
                  {formErrors.name && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleFormChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm ${
                      formErrors.email ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {formErrors.email && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>
                  )}
                </div>

                {selectedCustomer && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Points de fidélité
                    </label>
                    <input
                      type="number"
                      name="loyalty_points"
                      value={formData.loyalty_points || 0}
                      onChange={handleFormChange}
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    />
                  </div>
                )}

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowCustomerForm(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={selectedCustomer ? handleUpdateCustomer : handleCreateCustomer}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                  >
                    {selectedCustomer ? 'Mettre à jour' : 'Créer le client'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}