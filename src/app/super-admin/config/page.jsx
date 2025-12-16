// 'use client'

// import { useState, useEffect } from 'react'
// import { useRouter } from 'next/navigation'
// import { supabase } from '@/lib/supabase'
// import { checkAuth } from '@/lib/auth'
// import { 
//   Save,
//   ArrowLeft,
//   Percent,
//   DollarSign,
//   RefreshCw,
//   Settings,
//   AlertCircle
// } from 'lucide-react'

// export default function SaleConfigPage() {
//   const router = useRouter()
//   const [currentUser, setCurrentUser] = useState(null)
//   const [loading, setLoading] = useState(false)
//   const [saving, setSaving] = useState(false)
  
//   const [config, setConfig] = useState({
//     vat_amount: 20.00,
//     currency: 'CDF',
//     currency_rate: 1.0,
//     base_currency: 'USD'
//   })
  
//   const [errors, setErrors] = useState({})

//   useEffect(() => {
//     const user = checkAuth()
//     if (!user) {
//       router.push('/auth/login')
//       return
//     }
//     setCurrentUser(user)
//     loadConfig()
//   }, [])

//   const loadConfig = async () => {
//     setLoading(true)
//     try {
//       const { data, error } = await supabase
//         .from('sale_config')
//         .select('*')
//         .order('created_at', { ascending: false })
//         .limit(1)
//         .single()
      
//       if (error && error.code !== 'PGRST116') {
//         console.error('Erreur:', error)
//       }
      
//       if (data) {
//         setConfig(data)
//       }
//     } catch (error) {
//       console.error('Erreur:', error)
//     } finally {
//       setLoading(false)
//     }
//   }

//   const validateForm = () => {
//     const newErrors = {}
    
//     if (!config.vat_amount || config.vat_amount < 0 || config.vat_amount > 100) {
//       newErrors.vat_amount = 'TVA doit être entre 0 et 100%'
//     }
    
//     if (!config.currency_rate || config.currency_rate <= 0) {
//       newErrors.currency_rate = 'Taux de change doit être positif'
//     }
    
//     if (!['CDF', 'USD'].includes(config.currency)) {
//       newErrors.currency = 'Devise invalide'
//     }
    
//     if (!['CDF', 'USD'].includes(config.base_currency)) {
//       newErrors.base_currency = 'Devise de base invalide'
//     }
    
//     setErrors(newErrors)
//     return Object.keys(newErrors).length === 0
//   }

//   const handleSubmit = async (e) => {
//     e.preventDefault()
    
//     if (!validateForm()) {
//       return
//     }
    
//     setSaving(true)
    
//     try {
//       const { data: existingConfig } = await supabase
//         .from('sale_config')
//         .select('id')
//         .order('created_at', { ascending: false })
//         .limit(1)
//         .single()
      
//       let result
      
//       if (existingConfig) {
//         // Mettre à jour
//         result = await supabase
//           .from('sale_config')
//           .update({
//             vat_amount: config.vat_amount,
//             currency: config.currency,
//             currency_rate: config.currency_rate,
//             base_currency: config.base_currency,
//             updated_at: new Date().toISOString()
//           })
//           .eq('id', existingConfig.id)
//       } else {
//         // Créer
//         result = await supabase
//           .from('sale_config')
//           .insert(config)
//       }
      
//       if (result.error) {
//         throw result.error
//       }
      
//       alert('Configuration enregistrée avec succès!')
      
//     } catch (error) {
//       console.error('Erreur:', error)
//       alert('Erreur: ' + error.message)
//     } finally {
//       setSaving(false)
//     }
//   }

//   const handleReset = () => {
//     setConfig({
//       vat_amount: 20.00,
//       currency: 'CDF',
//       currency_rate: 1.0,
//       base_currency: 'USD'
//     })
//     setErrors({})
//   }

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <RefreshCw className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-3" />
//           <p className="text-gray-600">Chargement...</p>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 p-4">
//       <div className="max-w-2xl mx-auto">
//         {/* Header */}
//         <div className="mb-8">
//           <button
//             onClick={() => router.push('/ventes')}
//             className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
//           >
//             <ArrowLeft className="w-5 h-5 mr-2" />
//             Retour aux ventes
//           </button>
          
//           <div className="flex items-center justify-between">
//             <div>
//               <h1 className="text-2xl font-bold text-gray-900 flex items-center">
//                 <Settings className="w-6 h-6 mr-3 text-blue-600" />
//                 Configuration des Ventes
//               </h1>
//               <p className="text-gray-600 mt-1">
//                 Configurez les paramètres de vente, taux de change et TVA
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* Carte de configuration */}
//         <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
//           <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
//             <h2 className="text-lg font-semibold text-gray-900">
//               Paramètres de vente
//             </h2>
//             <p className="text-sm text-gray-600">
//               Ces paramètres affectent toutes les nouvelles ventes
//             </p>
//           </div>
          
//           <form onSubmit={handleSubmit} className="p-6">
//             <div className="space-y-6">
//               {/* TVA */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-900 mb-1">
//                   <span className="flex items-center">
//                     <Percent className="w-4 h-4 mr-2" />
//                     Taux de TVA (%)
//                   </span>
//                 </label>
//                 <input
//                   type="number"
//                   min="0"
//                   max="100"
//                   step="0.01"
//                   value={config.vat_amount}
//                   onChange={(e) => setConfig({...config, vat_amount: parseFloat(e.target.value) || 0})}
//                   className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
//                     errors.vat_amount ? 'border-red-300' : 'border-gray-300'
//                   }`}
//                 />
//                 {errors.vat_amount && (
//                   <p className="mt-1 text-sm text-red-600 flex items-center">
//                     <AlertCircle className="w-4 h-4 mr-1" />
//                     {errors.vat_amount}
//                   </p>
//                 )}
//                 <p className="mt-1 text-sm text-gray-500">
//                   Pourcentage de taxe sur la valeur ajoutée
//                 </p>
//               </div>

//               {/* Devise par défaut */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-900 mb-1">
//                   Devise par défaut des ventes
//                 </label>
//                 <div className="grid grid-cols-2 gap-3">
//                   <button
//                     type="button"
//                     onClick={() => setConfig({...config, currency: 'CDF'})}
//                     className={`p-3 rounded-lg border-2 flex flex-col items-center ${
//                       config.currency === 'CDF'
//                         ? 'border-blue-500 bg-blue-50'
//                         : 'border-gray-200'
//                     }`}
//                   >
//                     <div className="text-lg font-bold mb-1">FC</div>
//                     <span>Franc Congolais</span>
//                   </button>
                  
//                   <button
//                     type="button"
//                     onClick={() => setConfig({...config, currency: 'USD'})}
//                     className={`p-3 rounded-lg border-2 flex flex-col items-center ${
//                       config.currency === 'USD'
//                         ? 'border-blue-500 bg-blue-50'
//                         : 'border-gray-200'
//                     }`}
//                   >
//                     <div className="text-lg font-bold mb-1">$</div>
//                     <span>Dollar US</span>
//                   </button>
//                 </div>
//                 {errors.currency && (
//                   <p className="mt-1 text-sm text-red-600 flex items-center">
//                     <AlertCircle className="w-4 h-4 mr-1" />
//                     {errors.currency}
//                   </p>
//                 )}
//               </div>

//               {/* Taux de change */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-900 mb-1">
//                   <span className="flex items-center">
//                     <DollarSign className="w-4 h-4 mr-2" />
//                     Taux de change (1 USD = X CDF)
//                   </span>
//                 </label>
//                 <input
//                   type="number"
//                   min="0"
//                   step="0.0001"
//                   value={config.currency_rate}
//                   onChange={(e) => setConfig({...config, currency_rate: parseFloat(e.target.value) || 0})}
//                   className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
//                     errors.currency_rate ? 'border-red-300' : 'border-gray-300'
//                   }`}
//                 />
//                 {errors.currency_rate && (
//                   <p className="mt-1 text-sm text-red-600 flex items-center">
//                     <AlertCircle className="w-4 h-4 mr-1" />
//                     {errors.currency_rate}
//                   </p>
//                 )}
//                 <p className="mt-1 text-sm text-gray-500">
//                   Taux utilisé pour convertir entre USD et CDF
//                 </p>
//               </div>

//               {/* Devise de base */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-900 mb-1">
//                   Devise de référence
//                 </label>
//                 <select
//                   value={config.base_currency}
//                   onChange={(e) => setConfig({...config, base_currency: e.target.value})}
//                   className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
//                     errors.base_currency ? 'border-red-300' : 'border-gray-300'
//                   }`}
//                 >
//                   <option value="USD">USD (Dollar US)</option>
//                   <option value="CDF">CDF (Franc Congolais)</option>
//                 </select>
//                 {errors.base_currency && (
//                   <p className="mt-1 text-sm text-red-600 flex items-center">
//                     <AlertCircle className="w-4 h-4 mr-1" />
//                     {errors.base_currency}
//                   </p>
//                 )}
//                 <p className="mt-1 text-sm text-gray-500">
//                   Devise de référence pour le taux de change
//                 </p>
//               </div>

//               {/* Résumé */}
//               <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
//                 <h3 className="font-medium text-gray-900 mb-2">Résumé</h3>
//                 <div className="space-y-1 text-sm">
//                   <div className="flex justify-between">
//                     <span className="text-gray-600">TVA:</span>
//                     <span className="font-medium">{config.vat_amount}%</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-gray-600">Devise par défaut:</span>
//                     <span className="font-medium">
//                       {config.currency === 'CDF' ? 'Franc Congolais (CDF)' : 'Dollar US (USD)'}
//                     </span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-gray-600">Taux de change:</span>
//                     <span className="font-medium">
//                       1 USD = {config.currency_rate} CDF
//                     </span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-gray-600">Devise de référence:</span>
//                     <span className="font-medium">
//                       {config.base_currency === 'USD' ? 'USD' : 'CDF'}
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Actions */}
//             <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
//               <button
//                 type="button"
//                 onClick={handleReset}
//                 className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center"
//               >
//                 <RefreshCw className="w-4 h-4 mr-2" />
//                 Réinitialiser
//               </button>
              
//               <div className="flex space-x-3">
//                 <button
//                   type="button"
//                   onClick={() => router.push('/ventes')}
//                   className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
//                 >
//                   Annuler
//                 </button>
                
//                 <button
//                   type="submit"
//                   disabled={saving}
//                   className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
//                 >
//                   {saving ? (
//                     <>
//                       <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
//                       Enregistrement...
//                     </>
//                   ) : (
//                     <>
//                       <Save className="w-4 h-4 mr-2" />
//                       Enregistrer
//                     </>
//                   )}
//                 </button>
//               </div>
//             </div>
//           </form>
//         </div>

//         {/* Note */}
//         <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
//           <div className="flex">
//             <AlertCircle className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0" />
//             <div>
//               <p className="text-sm text-blue-800">
//                 <strong>Note:</strong> Les modifications affectent toutes les nouvelles ventes. 
//                 Les ventes existantes conservent leurs paramètres d'origine.
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }
'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { 
  Settings, 
  Save, 
  RotateCcw, 
  Percent, 
  DollarSign, 
  Euro, 
  Globe, 
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Loader2
} from 'lucide-react'

export default function SalesConfigPage() {
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [config, setConfig] = useState({
    id: '',
    vat_amount: 20.00,
    currency: 'EUR',
    currency_rate: 1.0,
    base_currency: 'USD'
  })
  const [message, setMessage] = useState({ type: '', text: '' })

  const currencies = [
    { code: 'CDF', name: 'Franc Congolais', symbol: 'FC' },
    { code: 'USD', name: 'Dollar US', symbol: '$' },
    { code: 'EUR', name: 'Euro', symbol: '€' },
    { code: 'XAF', name: 'Franc CFA', symbol: 'FCFA' },
    { code: 'XOF', name: 'Franc CFA Ouest', symbol: 'FCFA' },
    { code: 'CUSTOM', name: 'Autre devise', symbol: '?' }
  ]

  const baseCurrencies = [
    { code: 'USD', name: 'Dollar US' },
    { code: 'EUR', name: 'Euro' },
    { code: 'CDF', name: 'Franc Congolais' }
  ]

  useEffect(() => {
    fetchConfig()
  }, [])

  const fetchConfig = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('sale_config')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      if (error && error.code !== 'PGRST116') {
        throw error
      }

      if (data) {
        setConfig(data)
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Erreur chargement configuration' })
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setConfig(prev => ({
      ...prev,
      [name]: name === 'vat_amount' || name === 'currency_rate' ? parseFloat(value) : value
    }))
  }

  const handleSave = async (e) => {
    e.preventDefault()
    
    if (config.vat_amount < 0 || config.vat_amount > 100) {
      setMessage({ type: 'error', text: 'TVA doit être entre 0 et 100%' })
      return
    }

    if (config.currency_rate <= 0) {
      setMessage({ type: 'error', text: 'Taux de change doit être positif' })
      return
    }

    try {
      setSaving(true)
      setMessage({ type: '', text: '' })

      const configData = {
        ...config,
        updated_at: new Date().toISOString()
      }

      let result

      if (config.id) {
        result = await supabase
          .from('sale_config')
          .update(configData)
          .eq('id', config.id)
          .select()
          .single()
      } else {
        result = await supabase
          .from('sale_config')
          .insert([configData])
          .select()
          .single()
      }

      if (result.error) throw result.error

      setConfig(result.data)
      setMessage({ type: 'success', text: 'Configuration sauvegardée' })
      
    } catch (error) {
      setMessage({ type: 'error', text: 'Erreur sauvegarde' })
    } finally {
      setSaving(false)
    }
  }

  const handleReset = () => {
    setConfig({
      id: '',
      vat_amount: 20.00,
      currency: 'EUR',
      currency_rate: 1.0,
      base_currency: 'USD'
    })
    setMessage({ type: '', text: '' })
  }

  const getCurrencyIcon = (code) => {
    switch(code) {
      case 'USD': return <DollarSign className="w-4 h-4" />
      case 'EUR': return <Euro className="w-4 h-4" />
      case 'CDF': return <Globe className="w-4 h-4" />
      default: return <Globe className="w-4 h-4" />
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-gray-400" />
          <p className="mt-2 text-gray-500">Chargement...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-4 md:p-6">
        {/* Header */}
        {/* <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <Settings className="w-8 h-8 text-gray-700" />
            <h1 className="text-2xl font-bold text-gray-900">Configuration Ventes</h1>
          </div>
          <p className="text-gray-600">
            Gestion des paramètres de TVA et devises
          </p>
        </div> */}

        {/* Message Alert */}
        {message.text && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.type === 'error' 
              ? 'bg-red-50 border-l-4 border-red-500 text-red-700'
              : 'bg-green-50 border-l-4 border-green-500 text-green-700'
          }`}>
            <div className="flex items-center gap-2">
              {message.type === 'error' ? (
                <AlertCircle className="w-5 h-5" />
              ) : (
                <CheckCircle className="w-5 h-5" />
              )}
              <span>{message.text}</span>
            </div>
          </div>
        )}

        {/* Main Content - Two Columns */}
        <div className="flex flex-col lg:flex-row gap-6 mb-6">
          {/* Config Section 1: TVA */}
          <div className="flex-1 bg-white rounded-xl shadow-md border border-gray-200">
            <div className="px-5 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-blue-25">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Percent className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Paramètres TVA</h2>
                  <p className="text-sm text-gray-600">Configurer le taux de Taxe sur la Valeur Ajoutée</p>
                </div>
              </div>
            </div>
            
            <div className="p-5">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Taux de TVA (%)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      name="vat_amount"
                      value={config.vat_amount}
                      onChange={handleChange}
                      min="0"
                      max="100"
                      step="0.01"
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                      placeholder="0.00"
                    />
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">
                      <Percent className="w-5 h-5" />
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Valeur entre 0% et 100%
                  </p>
                </div>

                {/* Preview TVA */}
                <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-blue-25 rounded-lg border border-blue-100">
                  <h3 className="text-sm font-medium text-blue-800 mb-2">Aperçu TVA</h3>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white rounded-lg shadow-sm">
                        <Percent className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">Taux actuel</p>
                        <p className="text-xs text-gray-500">Appliquer sur toutes les ventes</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-blue-700">{config.vat_amount}%</p>
                      <p className="text-xs text-blue-600">TVA standard</p>
                    </div>
                  </div>
                </div>

                {/* Info Box */}
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-gray-600">
                      Le taux de TVA sera appliqué automatiquement à tous les nouveaux documents de vente.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Config Section 2: Devises */}
          <div className="flex-1 bg-white rounded-xl shadow-md border border-gray-200">
            <div className="px-5 py-4 border-b border-gray-200 bg-gradient-to-r from-green-50 to-green-25">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Globe className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Paramètres Devises</h2>
                  <p className="text-sm text-gray-600">Configurer les devises et taux de change</p>
                </div>
              </div>
            </div>
            
            <div className="p-5">
              <div className="space-y-6">
                {/* Devise principale */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Devise principale
                  </label>
                  <div className="space-y-3">
                    <select
                      name="currency"
                      value={config.currency}
                      onChange={handleChange}
                      className="w-full py-3 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    >
                      {currencies.map(curr => (
                        <option key={curr.code} value={curr.code}>
                          {curr.code} - {curr.name}
                        </option>
                      ))}
                    </select>
                    
                    {/* <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-green-25 rounded-lg border border-green-100">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-white rounded-lg shadow-sm">
                          {getCurrencyIcon(config.currency)}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{config.currency}</p>
                          <p className="text-xs text-gray-600">
                            {currencies.find(c => c.code === config.currency)?.name}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-green-700">
                          {currencies.find(c => c.code === config.currency)?.symbol}
                        </p>
                        <p className="text-xs text-green-600">Symbole</p>
                      </div>
                    </div> */}
                  </div>
                </div>

                {/* Taux de change */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Taux de change
                  </label>
                  <div className="bg-gradient-to-r from-gray-50 to-gray-25 p-4 rounded-lg border border-gray-200">
                    <div className="space-y-4">
                      <div className="flex flex-col sm:flex-row items-center gap-4">
                        <div className="flex items-center gap-3 bg-white px-4 py-3 rounded-lg border flex-1 min-w-0">
                          <span className="text-lg font-bold text-gray-900">1</span>
                          <select
                            name="base_currency"
                            value={config.base_currency}
                            onChange={handleChange}
                            className="flex-1 py-2 px-3 border-none bg-transparent focus:ring-0 min-w-0"
                          >
                            {baseCurrencies.map(curr => (
                              <option key={curr.code} value={curr.code}>
                                {curr.code} - {curr.name}
                              </option>
                            ))}
                          </select>
                        </div>
                        
                        <div className="text-2xl text-gray-400 flex-shrink-0">=</div>
                        
                        <div className="flex items-center gap-3 bg-white px-4 py-3 rounded-lg border flex-1 min-w-0">
                          <input
                            type="number"
                            name="currency_rate"
                            value={config.currency_rate}
                            onChange={handleChange}
                            min="0"
                            step="0.0001"
                            className="flex-1 py-2 px-3 border-none bg-transparent focus:ring-0 text-lg min-w-0"
                            placeholder="0.00"
                          />
                          <span className="text-gray-600 font-medium flex-shrink-0">{config.currency}</span>
                        </div>
                      </div>
                      
                      <div className="text-center p-3 bg-white rounded-lg border">
                     
                        <p className="text- font-bold text-green-700 mt-1">
                          1 {config.base_currency} = {config.currency_rate} {config.currency}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

               
              </div>
            </div>
          </div>
        </div>

        {/* Actions Footer */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200">
          <div className="px-6 py-4">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <AlertCircle className="w-4 h-4" />
                <span>Les modifications prennent effet immédiatement sur toutes les nouvelles ventes</span>
              </div>
              
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={handleReset}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition border border-gray-300"
                >
                  <RotateCcw className="w-4 h-4" />
                  Réinitialiser
                </button>

                <button
                  type="button"
                  onClick={fetchConfig}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition border border-gray-300"
                >
                  <RefreshCw className="w-4 h-4" />
                  Actualiser
                </button>

                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-medium rounded-lg hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-sm"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Enregistrement...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Enregistrer la configuration
                    </>
                  )}
                </button>
              </div>
            </div>
            
            {config.id && (
              <div className="mt-4 pt-4 border-t border-gray-100 text-center">
                <p className="text-xs text-gray-400">
                  Configuration ID: {config.id.substring(0, 8)}... • 
                  Dernière mise à jour: {new Date().toLocaleDateString()}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}