

'use client'

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { checkAuth } from '@/lib/auth'
import {
  Plus,
  Trash2,
  ArrowDownRight,
  ArrowUpRight,
  Wallet,
  Calendar,
  RefreshCw,
  Loader2,
  AlertCircle,
  X,
  CheckCircle,
  Filter,
  TrendingUp,
  TrendingDown,
  ShoppingCart,
  Database
} from 'lucide-react'

export default function UserOutflowDashboard() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [outflows, setOutflows] = useState([])
  const [sales, setSales] = useState([])
  const [dailySummary, setDailySummary] = useState(null)
  const [showOutflowModal, setShowOutflowModal] = useState(false)
  const [creatingOutflow, setCreatingOutflow] = useState(false)
  const [newOutflow, setNewOutflow] = useState({
    amount: '',
    currency: 'CDF',
    reason: '',
    category: 'Divers'
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [filterCategory, setFilterCategory] = useState('all')
  const [useSummaryData, setUseSummaryData] = useState(true)

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

  // Fonction pour générer le numéro de sortie
  const generateOutflowNumber = useCallback(async (userId, date) => {
    try {
      const todayDate = new Date(date).toISOString().split('T')[0];
      const formattedDate = todayDate.replace(/-/g, '');
      
      const { data: existingOutflows } = await supabase
        .from('cash_outflow')
        .select('outflow_number')
        .eq('user_id', userId)
        .eq('date', todayDate)
        .eq('status', 'completed')
        .order('created_at', { ascending: false });
      
      let maxSequence = 0;
      
      if (existingOutflows && existingOutflows.length > 0) {
        existingOutflows.forEach(outflow => {
          const match = outflow.outflow_number?.match(/SORTIE-(\d{8})-(\d{3})/);
          if (match && match[1] === formattedDate) {
            const sequence = parseInt(match[2]);
            if (sequence > maxSequence) {
              maxSequence = sequence;
            }
          }
        });
      }
      
      const newSequence = (maxSequence + 1).toString().padStart(3, '0');
      return `SORTIE-${formattedDate}-${newSequence}`;
      
    } catch (err) {
      console.error('Erreur génération numéro:', err);
      return `SORTIE-${Date.now()}`;
    }
  }, [])

  // Fonction pour appeler la fonction PostgreSQL update_daily_summary
  const callUpdateDailySummary = useCallback(async (userId, date) => {
    try {
      const targetDate = date || new Date().toISOString().split('T')[0];
      
      console.log('Mise à jour daily_summary pour:', { userId, targetDate });
      
      const { data, error } = await supabase.rpc('update_daily_summary', {
        p_user_id: userId,
        p_date: targetDate
      });
      
      if (error) {
        console.error('Erreur RPC update_daily_summary:', error);
        throw error;
      }
      
      console.log('daily_summary mis à jour avec succès');
      return data;
    } catch (err) {
      console.error('Erreur mise à jour daily_summary:', err);
      return null;
    }
  }, [])

  // Fonction pour récupérer le daily_summary
  const getDailySummary = useCallback(async (userId, date) => {
    try {
      const targetDate = date || new Date().toISOString().split('T')[0];
      
      console.log('Récupération daily_summary pour:', { userId, targetDate });
      
      const { data, error } = await supabase
        .from('daily_summary')
        .select('*')
        .eq('user_id', userId)
        .eq('report_date', targetDate)
        .single();
      
      if (error) {
        if (error.code === 'PGRST116') {
          console.log('Aucun résumé trouvé pour cette date');
          return null;
        }
        throw error;
      }
      
      console.log('daily_summary récupéré:', data);
      return data;
    } catch (err) {
      console.error('Erreur récupération daily_summary:', err);
      return null;
    }
  }, [])

  useEffect(() => {
    const init = async () => {
      setLoading(true)
      
      try {
        const currentUser = checkAuth()
        
        if (!currentUser) {
          setError('Session expirée')
          setLoading(false)
          return
        }
        
        setUser(currentUser)
        
        // Charger les données du jour
        await loadTodayData(currentUser.id)
        
      } catch (err) {
        setError(`Erreur: ${err.message}`)
      } finally {
        setLoading(false)
      }
    }
    
    init()
  }, [])

  // Fonction pour charger toutes les données du jour
  const loadTodayData = async (userId) => {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      console.log('Chargement des données pour aujourd\'hui:', today);
      
      // 1. D'abord, mettre à jour le daily_summary
      await callUpdateDailySummary(userId, today);
      
      // 2. Récupérer le daily_summary mis à jour
      const summary = await getDailySummary(userId, today);
      
      if (summary) {
        setDailySummary(summary);
        console.log('Utilisation des données de daily_summary');
      } else {
        console.log('Aucun daily_summary trouvé, calcul local');
      }
      
      // 3. Charger les détails pour l'affichage
      await Promise.all([
        loadTodaySales(userId),
        loadTodayOutflows(userId)
      ]);
      
    } catch (err) {
      console.error('Erreur chargement données:', err);
      if (userId) {
        await Promise.all([
          loadTodaySales(userId),
          loadTodayOutflows(userId)
        ]);
      }
    }
  }

  // Fonction pour charger UNIQUEMENT les ventes d'aujourd'hui
  const loadTodaySales = async (userId) => {
    try {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const tomorrow = new Date(today)
      tomorrow.setDate(tomorrow.getDate() + 1)
      
      const { data: salesData, error: salesError } = await supabase
        .from('sale')
        .select(`
          id,
          sale_number,
          total,
          currency,
          payment_method,
          payment_status,
          status,
          date_time,
          created_at
        `)
        .eq('user_id', userId)
        .eq('status', 'completed')
        .eq('payment_status', 'paid')
        .gte('date_time', today.toISOString())
        .lt('date_time', tomorrow.toISOString())
        .order('date_time', { ascending: false })
      
      if (salesError) throw salesError
      
      setSales(salesData || [])
      return salesData || []
      
    } catch (err) {
      console.error('Erreur chargement ventes:', err)
      setSales([])
      return []
    }
  }

  // Fonction pour charger UNIQUEMENT les sorties d'aujourd'hui
  const loadTodayOutflows = async (userId) => {
    try {
      const today = new Date().toISOString().split('T')[0]
      
      const { data: outflowsData, error: outflowsError } = await supabase
        .from('cash_outflow')
        .select('*')
        .eq('user_id', userId)
        .eq('date', today)
        .eq('status', 'completed')
        .order('created_at', { ascending: false })
      
      if (outflowsError) throw outflowsError
      
      setOutflows(outflowsData || [])
      return outflowsData || []
      
    } catch (err) {
      console.error('Erreur chargement sorties:', err)
      setOutflows([])
      return []
    }
  }

  // Calcul des totaux - SANS CONVERSION
  const calculateTodayTotals = useCallback(() => {
    if (useSummaryData && dailySummary) {
      // Utiliser les données de daily_summary (SANS conversion)
      const totalSalesCDF = dailySummary.total_sales_cdf || 0
      const totalSalesUSD = dailySummary.total_sales_usd || 0
      const totalOutflowsCDF = dailySummary.total_outflows_cdf || 0
      const totalOutflowsUSD = dailySummary.total_outflows_usd || 0
      
      // Calculer les soldes disponibles (séparément par devise)
      const availableCDF = Math.max(0, totalSalesCDF - totalOutflowsCDF)
      const availableUSD = Math.max(0, totalSalesUSD - totalOutflowsUSD)
      const netBalanceCDF = totalSalesCDF - totalOutflowsCDF
      const netBalanceUSD = totalSalesUSD - totalOutflowsUSD
      
      return {
        totalSalesCDF: totalSalesCDF,
        totalSalesUSD: totalSalesUSD,
        totalOutflowsCDF: totalOutflowsCDF,
        totalOutflowsUSD: totalOutflowsUSD,
        availableCDF: availableCDF,
        availableUSD: availableUSD,
        netBalanceCDF: netBalanceCDF,
        netBalanceUSD: netBalanceUSD
      }
    } else {
      // Calculer localement (SANS CONVERSION)
      let totalSalesCDF = 0
      let totalSalesUSD = 0
      let totalOutflowsCDF = 0
      let totalOutflowsUSD = 0
      
      // Calculer les ventes (garder chaque devise séparée)
      sales.forEach(sale => {
        if (sale.currency === 'CDF') {
          totalSalesCDF += sale.total || 0
        } else if (sale.currency === 'USD') {
          totalSalesUSD += sale.total || 0
        }
      })
      
      // Calculer les sorties (garder chaque devise séparée)
      outflows.forEach(outflow => {
        if (outflow.currency === 'CDF') {
          totalOutflowsCDF += outflow.amount || 0
        } else if (outflow.currency === 'USD') {
          totalOutflowsUSD += outflow.amount || 0
        }
      })
      
      const availableCDF = Math.max(0, totalSalesCDF - totalOutflowsCDF)
      const availableUSD = Math.max(0, totalSalesUSD - totalOutflowsUSD)
      const netBalanceCDF = totalSalesCDF - totalOutflowsCDF
      const netBalanceUSD = totalSalesUSD - totalOutflowsUSD
      
      return {
        totalSalesCDF: totalSalesCDF,
        totalSalesUSD: totalSalesUSD,
        totalOutflowsCDF: totalOutflowsCDF,
        totalOutflowsUSD: totalOutflowsUSD,
        availableCDF: availableCDF,
        availableUSD: availableUSD,
        netBalanceCDF: netBalanceCDF,
        netBalanceUSD: netBalanceUSD
      }
    }
  }, [dailySummary, sales, outflows, useSummaryData])

  const todayTotals = calculateTodayTotals()

  const validateBalance = (amount, currency) => {
    const available = currency === 'CDF' ? todayTotals.availableCDF : todayTotals.availableUSD
    if (parseFloat(amount) > available) {
      return {
        valid: false,
        message: `Solde insuffisant aujourd'hui. Disponible: ${formatCurrency(available, currency)}`
      }
    }
    return { valid: true, message: '' }
  }

  const handleCreateOutflow = async () => {
    if (!newOutflow.amount || parseFloat(newOutflow.amount) <= 0) {
      setError('Montant invalide')
      return
    }

    if (!newOutflow.reason.trim()) {
      setError('Motif requis')
      return
    }

    if (!user) {
      setError('Session expirée')
      return
    }

    const balanceCheck = validateBalance(newOutflow.amount, newOutflow.currency)
    if (!balanceCheck.valid) {
      setError(balanceCheck.message)
      return
    }

    setError('')
    setSuccess('')
    setCreatingOutflow(true)

    try {
      const outflowDate = new Date().toISOString().split('T')[0];
      const outflowNumber = await generateOutflowNumber(user.id, outflowDate);

      const outflowData = {
        outflow_number: outflowNumber,
        amount: parseFloat(newOutflow.amount),
        currency: newOutflow.currency,
        currency_rate: 1.0, // Plus de conversion
        reason: newOutflow.reason.trim(),
        category: newOutflow.category,
        user_id: user.id,
        date: outflowDate
      }

      const { error: insertError } = await supabase
        .from('cash_outflow')
        .insert([outflowData])

      if (insertError) {
        if (insertError.code === '23505') {
          const fallbackNumber = `SORTIE-${Date.now()}`;
          outflowData.outflow_number = fallbackNumber;
          
          const { error: retryError } = await supabase
            .from('cash_outflow')
            .insert([outflowData])
            
          if (retryError) throw retryError;
        } else {
          throw insertError;
        }
      }

      // Mettre à jour le daily_summary après création
      await callUpdateDailySummary(user.id, outflowDate);
      
      // Recharger les données
      await loadTodayData(user.id);
      
      setSuccess('Sortie enregistrée avec succès!')
      setNewOutflow({
        amount: '',
        currency: 'CDF',
        reason: '',
        category: 'Divers'
      })
      setShowOutflowModal(false)
      
      setTimeout(() => setSuccess(''), 3000)
      
    } catch (err) {
      console.error('Erreur création sortie:', err);
      setError(`Erreur: ${err.message}`)
    } finally {
      setCreatingOutflow(false)
    }
  }

  const handleDeleteOutflow = async (outflowId) => {
    if (!confirm('Êtes-vous sûr de vouloir annuler cette sortie ?')) return

    try {
      const { error } = await supabase
        .from('cash_outflow')
        .update({ status: 'cancelled' })
        .eq('id', outflowId)
        .eq('user_id', user.id)

      if (error) throw error

      // Mettre à jour le daily_summary après suppression
      await callUpdateDailySummary(user.id);
      
      // Recharger les données
      await loadTodayData(user.id);
      
      setSuccess('Sortie annulée!')
      setTimeout(() => setSuccess(''), 3000)
      
    } catch (err) {
      setError(`Erreur: ${err.message}`)
    }
  }

  const formatCurrency = (amount, currency = 'CDF') => {
    if (!amount && amount !== 0) return '0'
    
    const formatted = new Intl.NumberFormat('fr-FR', {
      minimumFractionDigits: currency === 'USD' ? 2 : 0,
      maximumFractionDigits: currency === 'USD' ? 2 : 0
    }).format(amount || 0)
    
    return `${currency === 'USD' ? '$' : 'FC'} ${formatted}`
  }

  const getCategoryColor = (category) => {
    const cat = categories.find(c => c.value === category)
    return cat ? cat.color : '#6b7280'
  }

  const handleRefresh = async () => {
    if (!user) return
    
    setLoading(true)
    try {
      await loadTodayData(user.id)
    } finally {
      setLoading(false)
    }
  }

  const toggleDataSource = async () => {
    const newState = !useSummaryData
    setUseSummaryData(newState)
    
    if (newState && user) {
      await loadTodayData(user.id)
    }
  }

  const filteredOutflows = filterCategory === 'all' 
    ? outflows 
    : outflows.filter(outflow => outflow.category === filterCategory)

  const today = new Date().toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400 mb-4" />
        <p className="text-gray-500">Chargement des données d'aujourd'hui...</p>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="p-4">
        <div className="bg-red-50 border-l-4 border-red-500 p-4">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-500 mr-3" />
            <div>
              <p className="text-red-700">Session expirée. Veuillez vous reconnecter.</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="md:p-4 p- max-w-7xl mx-auto space-y-6">
      {/* Messages */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <AlertCircle className="h-4 w-4 text-red-500 mr-2" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
            <button onClick={() => setError('')} className="text-red-500">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
              <p className="text-sm text-green-700">{success}</p>
            </div>
            <button onClick={() => setSuccess('')} className="text-green-500">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Gestion des sorties de caisse</h1>
            <div className="flex items-center mt-1 space-x-3">
              <div className="flex items-center text-sm text-gray-600">
                <Calendar className="w-3 h-3 mr-1" />
                {today}
              </div>
              <div className="text-sm text-gray-600">
                <span className="font-medium">Caissier:</span> {user.full_name || user.email}
              </div>
            </div>
          </div>
          <div className="hidden mt-2 lg:flex items-center space-x-2">
            <button
              onClick={handleRefresh}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
              title="Rafraîchir"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={() => setShowOutflowModal(true)}
              className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nouvelle sortie
            </button>
          </div> 
        </div>
          <div className="flex mt-2 lg:hidden items-center space-x-2">
            <button
              onClick={handleRefresh}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
              title="Rafraîchir"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={() => setShowOutflowModal(true)}
              className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nouvelle sortie
            </button>
          </div>
      </div>

      {/* Statistiques d'aujourd'hui */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Ventes CDF aujourd'hui */}
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-700">Ventes CDF aujourd'hui</h3>
            <ShoppingCart className="w-4 h-4 text-green-500" />
          </div>
          <div className="space-y-2">
            <div>
              <div className="text-lg font-semibold text-gray-900">
                {formatCurrency(todayTotals.totalSalesCDF, 'CDF')}
              </div>
              <div className="text-xs text-gray-500">
                {sales.filter(s => s.currency === 'CDF').length} vente{sales.filter(s => s.currency === 'CDF').length !== 1 ? 's' : ''} CDF
              </div>
            </div>
          </div>
        </div>

        {/* Ventes USD aujourd'hui */}
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-700">Ventes USD aujourd'hui</h3>
            <ShoppingCart className="w-4 h-4 text-blue-500" />
          </div>
          <div className="space-y-2">
            <div>
              <div className="text-lg font-semibold text-blue-600">
                {formatCurrency(todayTotals.totalSalesUSD, 'USD')}
              </div>
              <div className="text-xs text-gray-500">
                {sales.filter(s => s.currency === 'USD').length} vente{sales.filter(s => s.currency === 'USD').length !== 1 ? 's' : ''} USD
              </div>
            </div>
          </div>
        </div>

        {/* Sorties CDF aujourd'hui */}
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-700">Sorties CDF aujourd'hui</h3>
            <ArrowDownRight className="w-4 h-4 text-red-500" />
          </div>
          <div className="space-y-2">
            <div>
              <div className="text-lg font-semibold text-red-600">
                {formatCurrency(todayTotals.totalOutflowsCDF, 'CDF')}
              </div>
              <div className="text-xs text-gray-500">
                {outflows.filter(o => o.currency === 'CDF').length} sortie{outflows.filter(o => o.currency === 'CDF').length !== 1 ? 's' : ''} CDF
              </div>
            </div>
          </div>
        </div>

        {/* Sorties USD aujourd'hui */}
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-700">Sorties USD aujourd'hui</h3>
            <ArrowDownRight className="w-4 h-4 text-red-500" />
          </div>
          <div className="space-y-2">
            <div>
              <div className="text-lg font-semibold text-red-600">
                {formatCurrency(todayTotals.totalOutflowsUSD, 'USD')}
              </div>
              <div className="text-xs text-gray-500">
                {outflows.filter(o => o.currency === 'USD').length} sortie{outflows.filter(o => o.currency === 'USD').length !== 1 ? 's' : ''} USD
              </div>
            </div>
          </div>
        </div>

        {/* Disponible CDF */}
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-700">Disponible CDF</h3>
            <Wallet className="w-4 h-4 text-gray-500" />
          </div>
          <div className="space-y-2">
            <div>
              <div className={`text-lg font-semibold ${
                todayTotals.availableCDF >= 0 ? 'text-gray-900' : 'text-red-600'
              }`}>
                {formatCurrency(todayTotals.availableCDF, 'CDF')}
              </div>
            </div>
            <div className="text-xs text-gray-500">
              Pour nouvelles sorties CDF
            </div>
          </div>
        </div>

        {/* Disponible USD */}
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-700">Disponible USD</h3>
            <Wallet className="w-4 h-4 text-blue-500" />
          </div>
          <div className="space-y-2">
            <div>
              <div className={`text-lg font-semibold ${
                todayTotals.availableUSD >= 0 ? 'text-blue-600' : 'text-red-600'
              }`}>
                {formatCurrency(todayTotals.availableUSD, 'USD')}
              </div>
            </div>
            <div className="text-xs text-gray-500">
              Pour nouvelles sorties USD
            </div>
          </div>
        </div>

        {/* Solde net CDF */}
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-700">Solde net CDF</h3>
            {todayTotals.netBalanceCDF >= 0 ? (
              <TrendingUp className="w-4 h-4 text-green-500" />
            ) : (
              <TrendingDown className="w-4 h-4 text-red-500" />
            )}
          </div>
          <div className="space-y-2">
            <div>
              <div className={`text-lg font-semibold ${
                todayTotals.netBalanceCDF >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {formatCurrency(todayTotals.netBalanceCDF, 'CDF')}
              </div>
            </div>
            <div className="text-xs text-gray-500">
              Ventes CDF - Sorties CDF
            </div>
          </div>
        </div>

        {/* Solde net USD */}
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-700">Solde net USD</h3>
            {todayTotals.netBalanceUSD >= 0 ? (
              <TrendingUp className="w-4 h-4 text-green-500" />
            ) : (
              <TrendingDown className="w-4 h-4 text-red-500" />
            )}
          </div>
          <div className="space-y-2">
            <div>
              <div className={`text-lg font-semibold ${
                todayTotals.netBalanceUSD >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {formatCurrency(todayTotals.netBalanceUSD, 'USD')}
              </div>
            </div>
            <div className="text-xs text-gray-500">
              Ventes USD - Sorties USD
            </div>
          </div>
        </div>
      </div>

      {/* Liste des sorties d'aujourd'hui */}
      <div className="bg-white border border-gray-200 rounded-lg">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-900">Sorties de caisse - {today}</h3>
              <p className="text-sm text-gray-500 mt-1">
                {filteredOutflows.length} sortie{filteredOutflows.length !== 1 ? 's' : ''} enregistrée{filteredOutflows.length !== 1 ? 's' : ''} aujourd'hui
                {filteredOutflows.length > 0 && (
                  <>
                    {' '}({filteredOutflows.filter(o => o.currency === 'CDF').length} CDF, {filteredOutflows.filter(o => o.currency === 'USD').length} USD)
                  </>
                )}
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="text-sm text-gray-500">
                Filtrer:
              </div>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="text-sm border border-gray-300 rounded px-3 py-1.5"
              >
                <option value="all">Toutes catégories</option>
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {filteredOutflows.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {filteredOutflows.map((outflow) => (
              <div key={outflow.id} className="p-4 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: getCategoryColor(outflow.category) }}
                      />
                      <div>
                        <span className="font-medium text-gray-900">
                          {outflow.category}
                        </span>
                        <span className={`ml-2 px-2 py-0.5 text-xs rounded ${
                          outflow.currency === 'USD' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {outflow.currency}
                        </span>
                        <span className="ml-2 text-xs text-gray-500">
                          {new Date(outflow.created_at).toLocaleTimeString('fr-FR', {
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit'
                          })}
                        </span>
                      </div>
                    </div>
                    <p className="text-gray-700 mb-1">{outflow.reason}</p>
                    <div className="flex items-center space-x-2 text-xs text-gray-500">
                      <span>{outflow.outflow_number}</span>
                      <span>•</span>
                      <span>Créé le {new Date(outflow.created_at).toLocaleDateString('fr-FR')}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    <span className={`font-semibold ${
                      outflow.currency === 'USD' ? 'text-blue-600' : 'text-gray-900'
                    }`}>
                      {formatCurrency(outflow.amount, outflow.currency)}
                    </span>
                    {/* <button
                      onClick={() => handleDeleteOutflow(outflow.id)}
                      className="text-xs text-red-600 hover:text-red-700 hover:underline"
                    >
                      Annuler la sortie
                    </button> */}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full mb-4">
              <ArrowDownRight className="w-6 h-6 text-gray-400" />
            </div>
            <p className="text-gray-500">Aucune sortie enregistrée aujourd'hui</p>
            <p className="text-sm text-gray-400 mt-1">
              Les sorties seront affichées ici une fois créées
            </p>
            <button
              onClick={() => setShowOutflowModal(true)}
              className="mt-4 px-4 py-2 text-sm bg-red-600 text-white rounded hover:bg-red-700"
            >
              Créer la première sortie
            </button>
          </div>
        )}
      </div>

      {/* Modal nouvelle sortie */}
      {showOutflowModal && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="px-4 py-3 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-gray-900">Nouvelle sortie de caisse</h3>
                <button
                  onClick={() => setShowOutflowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="p-4 space-y-4">
             
              
              {/* Montant */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Montant *
                </label>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    value={newOutflow.amount}
                    onChange={(e) => setNewOutflow({...newOutflow, amount: e.target.value})}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    placeholder="0.00"
                    autoFocus
                  />
                  <select
                    value={newOutflow.currency}
                    onChange={(e) => setNewOutflow({...newOutflow, currency: e.target.value})}
                    className="px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  >
                    <option value="CDF">CDF</option>
                    <option value="USD">USD</option>
                  </select>
                </div>
                <div className="mt-2 p-2 bg-blue-50 rounded">
                  <div className="text-xs text-blue-700">
                    <div className="font-medium">Solde disponible aujourd'hui ({newOutflow.currency}):</div>
                    <div className="mt-1">
                      {formatCurrency(
                        newOutflow.currency === 'CDF' ? todayTotals.availableCDF : todayTotals.availableUSD,
                        newOutflow.currency
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Catégorie */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Catégorie
                </label>
                <select
                  value={newOutflow.category}
                  onChange={(e) => setNewOutflow({...newOutflow, category: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-red-500 focus:border-red-500"
                >
                  {categories.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>
              
              {/* Motif */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Motif *
                </label>
                <textarea
                  value={newOutflow.reason}
                  onChange={(e) => setNewOutflow({...newOutflow, reason: e.target.value})}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="Décrivez la raison de cette sortie de caisse..."
                />
                <p className="mt-1 text-xs text-gray-500">
                  Exemple: Achat de fournitures, Transport, etc.
                </p>
              </div>
              
              {/* Actions */}
              <div className="pt-4 border-t border-gray-200">
                <div className="flex space-x-2">
                  <button
                    onClick={() => setShowOutflowModal(false)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded hover:bg-gray-50 text-sm"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={handleCreateOutflow}
                    disabled={creatingOutflow || !newOutflow.amount || !newOutflow.reason.trim()}
                    className="flex-1 px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm flex items-center justify-center"
                  >
                    {creatingOutflow ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        Enregistrement...
                      </>
                    ) : (
                      'Enregistrer la sortie'
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}