'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { checkAuth } from '@/lib/auth'
import { 
  ArrowLeft,
  Printer,
  Download,
  Mail,
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock,
  User,
  Phone,
  CreditCard,
  Smartphone,
  Wallet,
  Package,
  DollarSign,
  Calendar,
  FileText,
  Copy,
  Share2,
  Loader2,
  ChevronDown,
  ChevronUp,
  Edit,
  Trash2,
  RefreshCw,
  AlertTriangle
} from 'lucide-react'

export default function SaleDetailPage() {
  const router = useRouter()
  const params = useParams()
  const saleNumber = params?.sale_number
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [sale, setSale] = useState(null)
  const [saleItems, setSaleItems] = useState([])
  const [client, setClient] = useState(null)
  const [products, setProducts] = useState({})
  const [saleConfig, setSaleConfig] = useState({
    vat_amount: 20.00,
    currency_rate: 2300.00,
    base_currency: 'USD'
  })
  const [expandedItems, setExpandedItems] = useState({})
  const [showPrintOptions, setShowPrintOptions] = useState(false)
  const [showActionsMenu, setShowActionsMenu] = useState(false)
  const [statusHistory, setStatusHistory] = useState([])

  useEffect(() => {
    const user = checkAuth()
    if (!user) {
      router.push('/auth/login')
      return
    }
    setCurrentUser(user)
    
    if (!saleNumber) {
      setError('Numéro de vente invalide')
      setLoading(false)
      return
    }
    
    loadSaleConfig()
    loadSaleData()
  }, [saleNumber])

  const loadSaleConfig = async () => {
    try {
      const { data, error } = await supabase
        .from('sale_config')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .single()
      
      if (data) {
        setSaleConfig(data)
      }
    } catch (error) {
      console.error('Erreur chargement config:', error)
    }
  }

  const loadProducts = async (productIds) => {
    if (!productIds || productIds.length === 0) return {}
    
    try {
      // D'abord, essayons de voir quelle table existe
      let productsData = []
      let productsError = null
      
      // Essayez d'abord avec 'product' (singulier)
      const { data: data1, error: error1 } = await supabase
        .from('product')
        .select('id, name, sku, image_url, unit_type, currency')
        .in('id', productIds)
      
      if (!error1) {
        productsData = data1
      } else {
        // Si 'product' n'existe pas, essayez avec 'products'
        const { data: data2, error: error2 } = await supabase
          .from('products')
          .select('id, name, sku, image_url, unit_type, currency')
          .in('id', productIds)
        
        if (!error2) {
          productsData = data2
        } else {
          console.log('Aucune table de produits trouvée:', error2)
          // Pas d'erreur, on continue sans les détails des produits
          return {}
        }
      }
      
      // Transformer en objet pour un accès rapide
      const productsMap = {}
      productsData.forEach(product => {
        productsMap[product.id] = product
      })
      
      setProducts(productsMap)
      return productsMap
      
    } catch (error) {
      console.log('Erreur non critique chargement produits:', error)
      // Ne pas bloquer l'application si les produits ne chargent pas
      return {}
    }
  }

  const loadSaleData = async () => {
    if (!saleNumber) return
    
    setLoading(true)
    setError('')
    
    try {
      // 1. Charger la vente avec le client
      const { data: saleData, error: saleError } = await supabase
        .from('sale')
        .select(`
          *,
          client:client(*)
        `)
        .eq('sale_number', saleNumber)
        .single()

      if (saleError) {
        if (saleError.code === 'PGRST116') {
          throw new Error('Vente non trouvée')
        }
        throw saleError
      }
      
      if (!saleData) {
        throw new Error('Vente non trouvée')
      }

      setSale(saleData)
      setClient(saleData.client)

      // 2. Charger les items de la vente
      const { data: itemsData, error: itemsError } = await supabase
        .from('sale_item')
        .select('*')
        .eq('sale_id', saleData.id)
        .order('created_at', { ascending: true })

      if (itemsError) {
        console.error('Erreur items:', itemsError)
        throw itemsError
      }
      
      setSaleItems(itemsData || [])

      // 3. Charger les informations des produits (sans bloquer en cas d'erreur)
      if (itemsData && itemsData.length > 0) {
        const productIds = [...new Set(itemsData.map(item => item.product_id))]
        await loadProducts(productIds).catch(err => {
          console.log('Erreur non critique lors du chargement des produits:', err)
          // On continue même si les produits ne chargent pas
        })
      }

      // 4. Charger l'historique des statuts
      await loadStatusHistory(saleData.id)

    } catch (error) {
      console.error('Erreur chargement vente:', error.message || error)
      setError(`Erreur: ${error.message || 'Impossible de charger la vente'}`)
    } finally {
      setLoading(false)
    }
  }

  const loadStatusHistory = async (saleId) => {
    try {
      // Historique basique
      const history = [
        {
          id: 1,
          status: sale?.status || 'completed',
          note: sale?.status === 'completed' ? 'Vente complétée' : 
                sale?.status === 'cancelled' ? 'Vente annulée' : 
                sale?.status === 'refunded' ? 'Vente remboursée' : 'Vente créée',
          user: currentUser?.full_name || 'Système',
          created_at: sale?.created_at || new Date().toISOString()
        }
      ]
      setStatusHistory(history)
    } catch (error) {
      console.log('Erreur non critique chargement historique:', error)
    }
  }

  const getStatusConfig = (status) => {
    const configs = {
      completed: { 
        color: 'bg-green-100 text-green-800', 
        icon: CheckCircle, 
        label: 'Complété',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200'
      },
      cancelled: { 
        color: 'bg-red-100 text-red-800', 
        icon: XCircle, 
        label: 'Annulé',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200'
      },
      refunded: { 
        color: 'bg-yellow-100 text-yellow-800', 
        icon: AlertCircle, 
        label: 'Remboursé',
        bgColor: 'bg-yellow-50',
        borderColor: 'border-yellow-200'
      }
    }
    return configs[status] || { 
      color: 'bg-gray-100 text-gray-800', 
      icon: Clock, 
      label: 'En attente',
      bgColor: 'bg-gray-50',
      borderColor: 'border-gray-200'
    }
  }

  const getPaymentMethodConfig = (method) => {
    const configs = {
      cash: { icon: Wallet, label: 'Espèces', color: 'text-green-600' },
      card: { icon: CreditCard, label: 'Carte bancaire', color: 'text-blue-600' },
      mobile: { icon: Smartphone, label: 'Paiement mobile', color: 'text-purple-600' }
    }
    return configs[method] || { icon: CreditCard, label: method, color: 'text-gray-600' }
  }

  const formatCurrency = (amount, currency = 'CDF') => {
    if (amount === null || amount === undefined) return `${getCurrencySymbol(currency)} 0`
    
    const formatted = new Intl.NumberFormat('fr-FR', {
      minimumFractionDigits: currency === 'CDF' ? 0 : 2,
      maximumFractionDigits: currency === 'CDF' ? 0 : 2
    }).format(amount || 0)
    
    return `${getCurrencySymbol(currency)} ${formatted}`
  }

  const getCurrencySymbol = (currency) => {
    return currency === 'USD' ? '$' : 'FC'
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'Date inconnue'
    
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch (error) {
      return 'Date invalide'
    }
  }

  const getCurrencyBadge = (currency) => {
    return currency === 'USD' 
      ? <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
          <DollarSign className="w-4 h-4 mr-1" />
          USD
        </span>
      : <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
          FC
        </span>
  }

  const toggleItemExpand = (itemId) => {
    setExpandedItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }))
  }

  const handlePrint = (type = 'standard') => {
    console.log('Impression type:', type, 'pour la vente:', saleNumber)
    setShowPrintOptions(false)
  }

  const handleDownload = () => {
    console.log('Téléchargement facture:', saleNumber)
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Facture ${saleNumber}`,
        text: `Facture ${saleNumber} - ${client?.name || 'Client'}`,
        url: window.location.href
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert('Lien copié dans le presse-papier')
    }
  }

  const handleCopyNumber = () => {
    if (saleNumber) {
      navigator.clipboard.writeText(saleNumber)
      alert('Numéro de facture copié')
    }
  }

  const handleEdit = () => {
    console.log('Édition vente:', saleNumber)
  }

  const handleCancel = async () => {
    if (!sale || !confirm('Êtes-vous sûr de vouloir annuler cette vente ?')) return
    
    try {
      const { error } = await supabase
        .from('sale')
        .update({ 
          status: 'cancelled',
          updated_at: new Date().toISOString()
        })
        .eq('id', sale.id)

      if (error) throw error
      
      await loadSaleData()
      alert('Vente annulée avec succès')
    } catch (error) {
      console.error('Erreur annulation:', error)
      alert('Erreur lors de l\'annulation')
    }
  }

  const handleRefund = async () => {
    if (!sale || !confirm('Êtes-vous sûr de vouloir rembourser cette vente ?')) return
    
    try {
      const { error } = await supabase
        .from('sale')
        .update({ 
          status: 'refunded',
          payment_status: 'refunded',
          updated_at: new Date().toISOString()
        })
        .eq('id', sale.id)

      if (error) throw error
      
      await loadSaleData()
      alert('Vente remboursée avec succès')
    } catch (error) {
      console.error('Erreur remboursement:', error)
      alert('Erreur lors du remboursement')
    }
  }

  const handleRefresh = () => {
    loadSaleData()
  }

  const calculateItemTotalInOriginalCurrency = (item) => {
    if (!sale || !item) return 0
    
    if (sale.currency === 'CDF' && item.original_currency === 'USD') {
      return item.total_price / (sale.currency_rate || 1)
    } else if (sale.currency === 'USD' && item.original_currency === 'CDF') {
      return item.total_price * (sale.currency_rate || 1)
    }
    return item.total_price
  }

  const getProductInfo = (productId) => {
    if (products[productId]) {
      return products[productId]
    }
    
    // Si le produit n'est pas dans le cache, on retourne des valeurs par défaut
    return { 
      name: 'Produit non trouvé', 
      sku: 'N/A', 
      image_url: null,
      unit_type: 'unité',
      currency: sale?.currency || 'CDF'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-gray-600 mx-auto mb-4" />
          <p className="text-gray-600">Chargement des détails de la vente...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <button
              onClick={() => router.push('/super-admin/sales')}
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Retour aux ventes
            </button>
          </div>
          
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
            <AlertTriangle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">Erreur</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <p className="text-sm text-gray-500 mb-6">
              Numéro de vente: {saleNumber || 'Non spécifié'}
            </p>
            <div className="space-x-3">
              <button
                onClick={() => router.push('/super-admin/sales')}
                className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition"
              >
                Retour aux ventes
              </button>
              <button
                onClick={handleRefresh}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
              >
                Réessayer
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!sale) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <button
              onClick={() => router.push('/super-admin/sales')}
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Retour aux ventes
            </button>
          </div>
          
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
            <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">Vente non trouvée</h2>
            <p className="text-gray-600 mb-6">
              La vente avec le numéro "{saleNumber}" n'existe pas ou a été supprimée.
            </p>
            <button
              onClick={() => router.push('/super-admin/sales')}
              className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition"
            >
              Retour aux ventes
            </button>
          </div>
        </div>
      </div>
    )
  }

  const statusConfig = getStatusConfig(sale.status)
  const paymentConfig = getPaymentMethodConfig(sale.payment_method)
  const PaymentIcon = paymentConfig.icon

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => router.push('/super-admin/sales')}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                  Vente {saleNumber}
                </h1>
                <div className="flex items-center space-x-2 mt-1">
                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusConfig.color}`}>
                    <statusConfig.icon className="w-4 h-4 mr-1.5" />
                    {statusConfig.label}
                  </div>
                  <span className="text-sm text-gray-500">
                    {formatDate(sale.created_at)}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={handleRefresh}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition"
                title="Actualiser"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
              
              <div className="relative">
                <button
                  onClick={() => setShowActionsMenu(!showActionsMenu)}
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition"
                >
                  <span>Actions</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
                
                {showActionsMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                    <button
                      onClick={handleEdit}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Modifier
                    </button>
                    {sale.status === 'completed' && (
                      <>
                        <button
                          onClick={handleCancel}
                          className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                        >
                          <XCircle className="w-4 h-4 mr-2" />
                          Annuler la vente
                        </button>
                        <button
                          onClick={handleRefund}
                          className="flex items-center w-full px-4 py-2 text-sm text-yellow-600 hover:bg-yellow-50"
                        >
                          <AlertCircle className="w-4 h-4 mr-2" />
                          Rembourser
                        </button>
                      </>
                    )}
                    <button
                      onClick={handleCopyNumber}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copier le numéro
                    </button>
                    <button
                      onClick={handleShare}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <Share2 className="w-4 h-4 mr-2" />
                      Partager
                    </button>
                  </div>
                )}
              </div>
              
              <div className="relative">
                <button
                  onClick={() => setShowPrintOptions(!showPrintOptions)}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  <Printer className="w-5 h-5" />
                  <span>Imprimer</span>
                </button>
                
                {showPrintOptions && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                    <button
                      onClick={() => handlePrint('standard')}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      Facture standard
                    </button>
                    <button
                      onClick={() => handlePrint('simplified')}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      Facture simplifiée
                    </button>
                    <button
                      onClick={() => handlePrint('receipt')}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      Reçu de caisse
                    </button>
                    <button
                      onClick={handleDownload}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Télécharger PDF
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Colonne gauche - Informations */}
          <div className="space-y-6">
            {/* Carte Client */}
            <div className="bg-white rounded-lg border border-gray-200 p-5">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <User className="w-5 h-5 mr-2 text-blue-600" />
                Informations Client
              </h2>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Nom complet
                  </label>
                  <div className="text-lg font-medium text-gray-900">
                    {client?.name || 'Non spécifié'}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Téléphone
                  </label>
                  <div className="flex items-center text-lg text-gray-900">
                    <Phone className="w-4 h-4 mr-2 text-gray-400" />
                    {client?.phone || 'Non spécifié'}
                  </div>
                </div>
                
                {client?.client_number && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Numéro client
                    </label>
                    <div className="font-mono text-lg text-gray-900">
                      {client.client_number}
                    </div>
                  </div>
                )}
              </div>
              
              {client && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => router.push(`/super-admin/clients/${client.id}`)}
                    className="w-full px-4 py-2 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition"
                  >
                    Voir le profil client complet
                  </button>
                </div>
              )}
            </div>

            {/* Carte Paiement */}
            <div className="bg-white rounded-lg border border-gray-200 p-5">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <CreditCard className="w-5 h-5 mr-2 text-blue-600" />
                Informations Paiement
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Mode de paiement
                  </label>
                  <div className="flex items-center text-lg">
                    <PaymentIcon className={`w-5 h-5 mr-2 ${paymentConfig.color}`} />
                    <span className="font-medium">{paymentConfig.label}</span>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Statut du paiement
                  </label>
                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    sale.payment_status === 'paid' 
                      ? 'bg-green-100 text-green-800' 
                      : sale.payment_status === 'pending'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {sale.payment_status === 'paid' ? 'Payé' : 
                     sale.payment_status === 'pending' ? 'En attente' : 
                     'Partiellement payé'}
                  </div>
                </div>
              </div>
            </div>

            {/* Carte Devise */}
            <div className="bg-white rounded-lg border border-gray-200 p-5">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <DollarSign className="w-5 h-5 mr-2 text-blue-600" />
                Informations Devise
              </h2>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Devise de la vente
                  </label>
                  <div className="text-lg">
                    {getCurrencyBadge(sale.currency)}
                  </div>
                </div>
                
                {sale.currency === 'USD' && sale.currency_rate && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Taux appliqué
                    </label>
                    <div className="text-2xl font-bold text-gray-900">
                      1$ = {sale.currency_rate.toLocaleString('fr-FR')} FC
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      Ce taux est figé pour cette vente
                    </div>
                  </div>
                )}
                
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    TVA appliquée
                  </label>
                  <div className="text-lg font-medium text-gray-900">
                    {saleConfig.vat_amount}%
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Colonne centrale - Articles */}
          <div className="lg:col-span-2 space-y-6">
            {/* Carte Articles */}
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="p-5 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Package className="w-5 h-5 mr-2 text-blue-600" />
                  Articles vendus ({saleItems.length})
                </h2>
              </div>
              
              <div className="divide-y divide-gray-200">
                {saleItems.length === 0 ? (
                  <div className="p-8 text-center">
                    <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">Aucun article trouvé</p>
                  </div>
                ) : (
                  saleItems.map((item) => {
                    const isExpanded = expandedItems[item.id]
                    const itemTotalInOriginalCurrency = calculateItemTotalInOriginalCurrency(item)
                    const productInfo = getProductInfo(item.product_id)
                    
                    return (
                      <div key={item.id} className="p-5 hover:bg-gray-50 transition">
                        <div 
                          className="flex items-start justify-between cursor-pointer"
                          onClick={() => toggleItemExpand(item.id)}
                        >
                          <div className="flex items-start space-x-4">
                            <div className="flex-shrink-0">
                              {productInfo.image_url ? (
                                <img
                                  src={productInfo.image_url}
                                  alt={productInfo.name}
                                  className="h-12 w-12 rounded object-cover"
                                />
                              ) : (
                                <div className="h-12 w-12 rounded bg-gray-100 flex items-center justify-center">
                                  <Package className="h-6 w-6 text-gray-400" />
                                </div>
                              )}
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">
                                {productInfo.name}
                              </div>
                              <div className="text-sm text-gray-500 mt-1">
                                SKU: {productInfo.sku} • Qté: {item.quantity} {productInfo.unit_type}
                              </div>
                              {item.original_currency && item.original_currency !== sale.currency && (
                                <div className="text-xs text-gray-400 mt-1">
                                  Prix original: {formatCurrency(itemTotalInOriginalCurrency, item.original_currency)}
                                </div>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-4">
                            <div className="text-right">
                              <div className="font-semibold text-gray-900">
                                {formatCurrency(item.total_price, sale.currency)}
                              </div>
                              <div className="text-sm text-gray-500">
                                {formatCurrency(item.unit_price, sale.currency)} × {item.quantity}
                              </div>
                            </div>
                            <button className="text-gray-400 hover:text-gray-600">
                              {isExpanded ? (
                                <ChevronUp className="w-5 h-5" />
                              ) : (
                                <ChevronDown className="w-5 h-5" />
                              )}
                            </button>
                          </div>
                        </div>
                        
                        {isExpanded && (
                          <div className="mt-4 pt-4 border-t border-gray-200">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="text-gray-500">ID Produit:</span>
                                <div className="font-mono">{item.product_id}</div>
                              </div>
                              <div>
                                <span className="text-gray-500">Prix unitaire:</span>
                                <div>{formatCurrency(item.unit_price, sale.currency)}</div>
                              </div>
                              <div>
                                <span className="text-gray-500">Devise originale:</span>
                                <div>{getCurrencyBadge(item.original_currency)}</div>
                              </div>
                              <div>
                                <span className="text-gray-500">Total original:</span>
                                <div>{formatCurrency(itemTotalInOriginalCurrency, item.original_currency)}</div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  })
                )}
              </div>
            </div>

            {/* Carte Totaux */}
            <div className="bg-white rounded-lg border border-gray-200 p-5">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Récapitulatif financier</h2>
              
              <div className="space-y-3">
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Sous-total:</span>
                  <span className="font-medium">{formatCurrency(sale.subtotal || 0, sale.currency)}</span>
                </div>
                
                {(sale.discount || 0) > 0 && (
                  <div className="flex justify-between py-2">
                    <span className="text-gray-600">Remise:</span>
                    <span className="font-medium text-red-600">-{formatCurrency(sale.discount || 0, sale.currency)}</span>
                  </div>
                )}
                
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">TVA ({saleConfig.vat_amount}%):</span>
                  <span className="font-medium">{formatCurrency(sale.vat_amount || 0, sale.currency)}</span>
                </div>
                
                <div className="flex justify-between py-3 border-t border-gray-200">
                  <span className="text-lg font-semibold text-gray-900">Total:</span>
                  <span className="text-2xl font-bold text-blue-600">{formatCurrency(sale.total || 0, sale.currency)}</span>
                </div>
                
                {/* Conversion pour information */}
                {sale.currency === 'USD' && sale.currency_rate && (
                  <div className="pt-3 border-t border-gray-200">
                    <div className="text-sm text-gray-500">
                      Équivalent en Francs Congolais:
                    </div>
                    <div className="text-lg font-medium text-gray-900">
                      {formatCurrency((sale.total || 0) * sale.currency_rate, 'CDF')}
                    </div>
                  </div>
                )}
                
                {sale.currency === 'CDF' && sale.currency_rate && (
                  <div className="pt-3 border-t border-gray-200">
                    <div className="text-sm text-gray-500">
                      Équivalent en Dollars US:
                    </div>
                    <div className="text-lg font-medium text-gray-900">
                      {formatCurrency((sale.total || 0) / sale.currency_rate, 'USD')}
                    </div>
                  </div>
                )}
              </div>
            </div>

          
          </div>
        </div>

        {/* Actions en bas */}
        
      </div>
    </div>
  )
}