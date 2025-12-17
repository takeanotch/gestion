
// // 'use client'

// // import { useState, useEffect } from 'react'
// // import { supabase } from '@/lib/supabase'
// // import { 
// //   Settings, 
// //   Save, 
// //   RotateCcw, 
// //   Percent, 
// //   DollarSign, 
// //   Euro, 
// //   Globe, 
// //   RefreshCw,
// //   AlertCircle,
// //   CheckCircle,
// //   Loader2
// // } from 'lucide-react'

// // export default function SalesConfigPage() {
// //   const [loading, setLoading] = useState(false)
// //   const [saving, setSaving] = useState(false)
// //   const [config, setConfig] = useState({
// //     id: '',
// //     vat_amount: 20.00,
// //     currency: 'EUR',
// //     currency_rate: 1.0,
// //     base_currency: 'USD'
// //   })
// //   const [message, setMessage] = useState({ type: '', text: '' })

// //   const currencies = [
// //     { code: 'CDF', name: 'Franc Congolais', symbol: 'FC' },
// //     { code: 'USD', name: 'Dollar US', symbol: '$' },
// //     { code: 'EUR', name: 'Euro', symbol: '€' },
// //     { code: 'XAF', name: 'Franc CFA', symbol: 'FCFA' },
// //     { code: 'XOF', name: 'Franc CFA Ouest', symbol: 'FCFA' },
// //     { code: 'CUSTOM', name: 'Autre devise', symbol: '?' }
// //   ]

// //   const baseCurrencies = [
// //     { code: 'USD', name: 'Dollar US' },
// //     { code: 'EUR', name: 'Euro' },
// //     { code: 'CDF', name: 'Franc Congolais' }
// //   ]

// //   useEffect(() => {
// //     fetchConfig()
// //   }, [])

// //   const fetchConfig = async () => {
// //     try {
// //       setLoading(true)
// //       const { data, error } = await supabase
// //         .from('sale_config')
// //         .select('*')
// //         .order('created_at', { ascending: false })
// //         .limit(1)
// //         .single()

// //       if (error && error.code !== 'PGRST116') {
// //         throw error
// //       }

// //       if (data) {
// //         setConfig(data)
// //       }
// //     } catch (error) {
// //       setMessage({ type: 'error', text: 'Erreur chargement configuration' })
// //     } finally {
// //       setLoading(false)
// //     }
// //   }

// //   const handleChange = (e) => {
// //     const { name, value } = e.target
// //     setConfig(prev => ({
// //       ...prev,
// //       [name]: name === 'vat_amount' || name === 'currency_rate' ? parseFloat(value) : value
// //     }))
// //   }

// //   const handleSave = async (e) => {
// //     e.preventDefault()
    
// //     if (config.vat_amount < 0 || config.vat_amount > 100) {
// //       setMessage({ type: 'error', text: 'TVA doit être entre 0 et 100%' })
// //       return
// //     }

// //     if (config.currency_rate <= 0) {
// //       setMessage({ type: 'error', text: 'Taux de change doit être positif' })
// //       return
// //     }

// //     try {
// //       setSaving(true)
// //       setMessage({ type: '', text: '' })

// //       const configData = {
// //         ...config,
// //         updated_at: new Date().toISOString()
// //       }

// //       let result

// //       if (config.id) {
// //         result = await supabase
// //           .from('sale_config')
// //           .update(configData)
// //           .eq('id', config.id)
// //           .select()
// //           .single()
// //       } else {
// //         result = await supabase
// //           .from('sale_config')
// //           .insert([configData])
// //           .select()
// //           .single()
// //       }

// //       if (result.error) throw result.error

// //       setConfig(result.data)
// //       setMessage({ type: 'success', text: 'Configuration sauvegardée' })
      
// //     } catch (error) {
// //       setMessage({ type: 'error', text: 'Erreur sauvegarde' })
// //     } finally {
// //       setSaving(false)
// //     }
// //   }

// //   const handleReset = () => {
// //     setConfig({
// //       id: '',
// //       vat_amount: 20.00,
// //       currency: 'EUR',
// //       currency_rate: 1.0,
// //       base_currency: 'USD'
// //     })
// //     setMessage({ type: '', text: '' })
// //   }

// //   const getCurrencyIcon = (code) => {
// //     switch(code) {
// //       case 'USD': return <DollarSign className="w-4 h-4" />
// //       case 'EUR': return <Euro className="w-4 h-4" />
// //       case 'CDF': return <Globe className="w-4 h-4" />
// //       default: return <Globe className="w-4 h-4" />
// //     }
// //   }

// //   if (loading) {
// //     return (
// //       <div className="min-h-screen flex items-center justify-center">
// //         <div className="text-center">
// //           <Loader2 className="w-8 h-8 animate-spin mx-auto text-gray-400" />
// //           <p className="mt-2 text-gray-500">Chargement...</p>
// //         </div>
// //       </div>
// //     )
// //   }

// //   return (
// //     <div className="min-h-screen bg-gray-50">
// //       <div className="max-w-7xl mx-auto p-4 md:p-6">
// //         {/* Header */}
// //         {/* <div className="mb-6">
// //           <div className="flex items-center gap-3 mb-2">
// //             <Settings className="w-8 h-8 text-gray-700" />
// //             <h1 className="text-2xl font-bold text-gray-900">Configuration Ventes</h1>
// //           </div>
// //           <p className="text-gray-600">
// //             Gestion des paramètres de TVA et devises
// //           </p>
// //         </div> */}

// //         {/* Message Alert */}
// //         {message.text && (
// //           <div className={`mb-6 p-4 rounded-lg ${
// //             message.type === 'error' 
// //               ? 'bg-red-50 border-l-4 border-red-500 text-red-700'
// //               : 'bg-green-50 border-l-4 border-green-500 text-green-700'
// //           }`}>
// //             <div className="flex items-center gap-2">
// //               {message.type === 'error' ? (
// //                 <AlertCircle className="w-5 h-5" />
// //               ) : (
// //                 <CheckCircle className="w-5 h-5" />
// //               )}
// //               <span>{message.text}</span>
// //             </div>
// //           </div>
// //         )}

// //         {/* Main Content - Two Columns */}
// //         <div className="flex flex-col lg:flex-row gap-6 mb-6">
// //           {/* Config Section 1: TVA */}
// //           <div className="flex-1 bg-white rounded-xl shadow-md border border-gray-200">
// //             <div className="px-5 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-blue-25">
// //               <div className="flex items-center gap-3">
// //                 <div className="p-2 bg-blue-100 rounded-lg">
// //                   <Percent className="w-5 h-5 text-blue-600" />
// //                 </div>
// //                 <div>
// //                   <h2 className="text-lg font-semibold text-gray-900">Paramètres TVA</h2>
// //                   <p className="text-sm text-gray-600">Configurer le taux de Taxe sur la Valeur Ajoutée</p>
// //                 </div>
// //               </div>
// //             </div>
            
// //             <div className="p-5">
// //               <div className="space-y-4">
// //                 <div>
// //                   <label className="block text-sm font-medium text-gray-700 mb-2">
// //                     Taux de TVA (%)
// //                   </label>
// //                   <div className="relative">
// //                     <input
// //                       type="number"
// //                       name="vat_amount"
// //                       value={config.vat_amount}
// //                       onChange={handleChange}
// //                       min="0"
// //                       max="100"
// //                       step="0.01"
// //                       className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
// //                       placeholder="0.00"
// //                     />
// //                     <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">
// //                       <Percent className="w-5 h-5" />
// //                     </div>
// //                   </div>
// //                   <p className="text-xs text-gray-500 mt-2">
// //                     Valeur entre 0% et 100%
// //                   </p>
// //                 </div>

// //                 {/* Preview TVA */}
// //                 <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-blue-25 rounded-lg border border-blue-100">
// //                   <h3 className="text-sm font-medium text-blue-800 mb-2">Aperçu TVA</h3>
// //                   <div className="flex items-center justify-between">
// //                     <div className="flex items-center gap-3">
// //                       <div className="p-2 bg-white rounded-lg shadow-sm">
// //                         <Percent className="w-5 h-5 text-blue-600" />
// //                       </div>
// //                       <div>
// //                         <p className="text-sm font-medium text-gray-700">Taux actuel</p>
// //                         <p className="text-xs text-gray-500">Appliquer sur toutes les ventes</p>
// //                       </div>
// //                     </div>
// //                     <div className="text-right">
// //                       <p className="text-2xl font-bold text-blue-700">{config.vat_amount}%</p>
// //                       <p className="text-xs text-blue-600">TVA standard</p>
// //                     </div>
// //                   </div>
// //                 </div>

// //                 {/* Info Box */}
// //                 <div className="mt-4 p-3 bg-gray-50 rounded-lg">
// //                   <div className="flex items-start gap-2">
// //                     <AlertCircle className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
// //                     <p className="text-xs text-gray-600">
// //                       Le taux de TVA sera appliqué automatiquement à tous les nouveaux documents de vente.
// //                     </p>
// //                   </div>
// //                 </div>
// //               </div>
// //             </div>
// //           </div>

// //           {/* Config Section 2: Devises */}
// //           <div className="flex-1 bg-white rounded-xl shadow-md border border-gray-200">
// //             <div className="px-5 py-4 border-b border-gray-200 bg-gradient-to-r from-green-50 to-green-25">
// //               <div className="flex items-center gap-3">
// //                 <div className="p-2 bg-green-100 rounded-lg">
// //                   <Globe className="w-5 h-5 text-green-600" />
// //                 </div>
// //                 <div>
// //                   <h2 className="text-lg font-semibold text-gray-900">Paramètres Devises</h2>
// //                   <p className="text-sm text-gray-600">Configurer les devises et taux de change</p>
// //                 </div>
// //               </div>
// //             </div>
            
// //             <div className="p-5">
// //               <div className="space-y-6">
// //                 {/* Devise principale */}
// //                 <div>
// //                   <label className="block text-sm font-medium text-gray-700 mb-3">
// //                     Devise principale
// //                   </label>
// //                   <div className="space-y-3">
// //                     <select
// //                       name="currency"
// //                       value={config.currency}
// //                       onChange={handleChange}
// //                       className="w-full py-3 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
// //                     >
// //                       {currencies.map(curr => (
// //                         <option key={curr.code} value={curr.code}>
// //                           {curr.code} - {curr.name}
// //                         </option>
// //                       ))}
// //                     </select>
                    
// //                     <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-green-25 rounded-lg border border-green-100">
// //                       <div className="flex items-center gap-3">
// //                         <div className="p-2 bg-white rounded-lg shadow-sm">
// //                           {getCurrencyIcon(config.currency)}
// //                         </div>
// //                         <div>
// //                           <p className="text-sm font-medium text-gray-900">{config.currency}</p>
// //                           <p className="text-xs text-gray-600">
// //                             {currencies.find(c => c.code === config.currency)?.name}
// //                           </p>
// //                         </div>
// //                       </div>
// //                       <div className="text-right">
// //                         <p className="text-lg font-bold text-green-700">
// //                           {currencies.find(c => c.code === config.currency)?.symbol}
// //                         </p>
// //                         <p className="text-xs text-green-600">Symbole</p>
// //                       </div>
// //                     </div>
// //                   </div>
// //                 </div>

// //                 {/* Taux de change */}
// //                 <div>
// //                   <label className="block text-sm font-medium text-gray-700 mb-3">
// //                     Taux de change
// //                   </label>
// //                   <div className="bg-gradient-to-r from-gray-50 to-gray-25 p-4 rounded-lg border border-gray-200">
// //                     <div className="space-y-4">
// //                       <div className="flex flex-col sm:flex-row items-center gap-4">
// //                         <div className="flex items-center gap-3 bg-white px-4 py-3 rounded-lg border flex-1 min-w-0">
// //                           <span className="text-lg font-bold text-gray-900">1</span>
// //                           <select
// //                             name="base_currency"
// //                             value={config.base_currency}
// //                             onChange={handleChange}
// //                             className="flex-1 py-2 px-3 border-none bg-transparent focus:ring-0 min-w-0"
// //                           >
// //                             {baseCurrencies.map(curr => (
// //                               <option key={curr.code} value={curr.code}>
// //                                 {curr.code} - {curr.name}
// //                               </option>
// //                             ))}
// //                           </select>
// //                         </div>
                        
// //                         <div className="text-2xl text-gray-400 flex-shrink-0">=</div>
                        
// //                         <div className="flex items-center gap-3 bg-white px-4 py-3 rounded-lg border flex-1 min-w-0">
// //                           <input
// //                             type="number"
// //                             name="currency_rate"
// //                             value={config.currency_rate}
// //                             onChange={handleChange}
// //                             min="0"
// //                             step="0.0001"
// //                             className="flex-1 py-2 px-3 border-none bg-transparent focus:ring-0 text-lg min-w-0"
// //                             placeholder="0.00"
// //                           />
// //                           <span className="text-gray-600 font-medium flex-shrink-0">{config.currency}</span>
// //                         </div>
// //                       </div>
                      
// //                       <div className="text-center p-3 bg-white rounded-lg border">
                     
// //                         <p className="text- font-bold text-green-700 mt-1">
// //                           1 {config.base_currency} = {config.currency_rate} {config.currency}
// //                         </p>
// //                       </div>
// //                     </div>
// //                   </div>
// //                 </div>

               
// //               </div>
// //             </div>
// //           </div>
// //         </div>

// //         {/* Actions Footer */}
// //         <div className="bg-white rounded-xl shadow-md border border-gray-200">
// //           <div className="px-6 py-4">
// //             <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
// //               <div className="flex items-center gap-2 text-sm text-gray-500">
// //                 <AlertCircle className="w-4 h-4" />
// //                 <span>Les modifications prennent effet immédiatement sur toutes les nouvelles ventes</span>
// //               </div>
              
// //               <div className="flex flex-wrap gap-3">
// //                 <button
// //                   type="button"
// //                   onClick={handleReset}
// //                   className="inline-flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition border border-gray-300"
// //                 >
// //                   <RotateCcw className="w-4 h-4" />
// //                   Réinitialiser
// //                 </button>

// //                 <button
// //                   type="button"
// //                   onClick={fetchConfig}
// //                   className="inline-flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition border border-gray-300"
// //                 >
// //                   <RefreshCw className="w-4 h-4" />
// //                   Actualiser
// //                 </button>

// //                 <button
// //                   type="button"
// //                   onClick={handleSave}
// //                   disabled={saving}
// //                   className="inline-flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-medium rounded-lg hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-sm"
// //                 >
// //                   {saving ? (
// //                     <>
// //                       <Loader2 className="w-4 h-4 animate-spin" />
// //                       Enregistrement...
// //                     </>
// //                   ) : (
// //                     <>
// //                       <Save className="w-4 h-4" />
// //                       Enregistrer la configuration
// //                     </>
// //                   )}
// //                 </button>
// //               </div>
// //             </div>
            
// //             {config.id && (
// //               <div className="mt-4 pt-4 border-t border-gray-100 text-center">
// //                 <p className="text-xs text-gray-400">
// //                   Configuration ID: {config.id.substring(0, 8)}... • 
// //                   Dernière mise à jour: {new Date().toLocaleDateString()}
// //                 </p>
// //               </div>
// //             )}
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   )
// // }
// 'use client'

// import { useState } from 'react'
// import CategoryManager from '@/components/CategoryManager'
// import SupplierManager from '@/components/SupplierManager'
// import SalesConfigTab from '@/components/SalesConfigTab'

// export default function SalesConfigPage() {
//   const [activeTab, setActiveTab] = useState('config')

//   const tabs = [
//     { id: 'config', label: 'Configuration Ventes', component: <SalesConfigTab /> },
//     { id: 'categories', label: 'Gestion Catégories', component: <CategoryManager /> },
//     { id: 'suppliers', label: 'Gestion Fournisseurs', component: <SupplierManager /> }
//   ]

//   const renderTabContent = () => {
//     switch (activeTab) {
//       case 'config':
//         return <SalesConfigTab />
//       case 'categories':
//         return <CategoryManager />
//       case 'suppliers':
//         return <SupplierManager />
//       default:
//         return <SalesConfigTab />
//     }
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="max-w-7xl mx-auto p-4 md:p-6">
//         {/* Header */}
//         <div className="mb-6">
//           <h1 className="text-2xl font-bold text-gray-900">Paramètres Ventes</h1>
//           <p className="text-gray-600 mt-1">
//             Gérez la configuration des ventes, catégories et fournisseurs
//           </p>
//         </div>

//         {/* Tabs simples */}
//         <div className="w-full">
//           <div className="border-b border-gray-200">
//             <div className="flex">
//               {tabs.map((tab) => (
//                 <button
//                   key={tab.id}
//                   onClick={() => setActiveTab(tab.id)}
//                   className={`
//                     px-4 py-3 text-sm font-medium transition-colors relative
//                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:z-10
//                     ${activeTab === tab.id 
//                       ? 'text-blue-600 border-b-2 border-blue-600' 
//                       : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
//                     }
//                   `}
//                 >
//                   {tab.label}
//                 </button>
//               ))}
//             </div>
//           </div>

//           {/* Contenu */}
//           <div className="mt-6 transition-opacity duration-300">
//             {renderTabContent()}
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }


// 'use client'

// import { useState, useEffect, useRef } from 'react'
// import CategoryManager from '@/components/CategoryManager'
// import SupplierManager from '@/components/SupplierManager'
// import SalesConfigTab from '@/components/SalesConfigTab'

// export default function SalesConfigPage() {
//   const [activeTab, setActiveTab] = useState('config')
//   const [indicatorStyle, setIndicatorStyle] = useState({})
//   const tabRefs = useRef({})

//   const tabs = [
//     { id: 'config', label: 'Configuration Ventes', component: <SalesConfigTab /> },
//     { id: 'categories', label: 'Gestion Catégories', component: <CategoryManager /> },
//     { id: 'suppliers', label: 'Gestion Fournisseurs', component: <SupplierManager /> }
//   ]

//   // Mettre à jour la position de l'indicateur quand l'onglet change
//   useEffect(() => {
//     if (tabRefs.current[activeTab]) {
//       const activeElement = tabRefs.current[activeTab]
//       const { offsetLeft, offsetWidth } = activeElement
      
//       setIndicatorStyle({
//         left: `${offsetLeft}px`,
//         width: `${offsetWidth}px`,
//         opacity: 1
//       })
//     }
//   }, [activeTab])

//   const activeComponent = tabs.find(tab => tab.id === activeTab)?.component

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="max-w-7xl mx-auto p-4 md:p-6">
//         {/* Header */}
//         <div className="mb-6">
//           <h1 className="text-2xl font-bold text-gray-900">Paramètres Ventes</h1>
//           <p className="text-gray-600 mt-1">
//             Gérez la configuration des ventes, catégories et fournisseurs
//           </p>
//         </div>

//         {/* Tabs personnalisés avec indicateur animé */}
//         <div className="w-full">
//           <div className="relative border-b border-gray-200">
//             <div className="flex space-x-8">
//               {tabs.map((tab) => (
//                 <button
//                   key={tab.id}
//                   ref={el => tabRefs.current[tab.id] = el}
//                   onClick={() => setActiveTab(tab.id)}
//                   className={`
//                     px-1 py-4 text-base font-medium transition-all duration-300
//                     focus:outline-none 
//                     relative z-10
//                     ${activeTab === tab.id 
//                       ? 'text-blue-600 font-semibold' 
//                       : 'text-gray-500 hover:text-gray-700'
//                     }
//                   `}
//                 >
//                   {tab.label}
//                 </button>
//               ))}
//             </div>
            
//             {/* Indicateur animé */}
//             <div 
//               className="absolute bottom-0 h-0.5 outline-none bg-blue-600 transition-all duration-300 ease-out rounded-t-full"
//               style={indicatorStyle}
//             />
//           </div>

//           {/* Contenu avec transition */}
//           <div className="mt-6">
//             <div 
//               key={activeTab}
//               className="animate-fade-in"
//               style={{ animationDuration: '0.3s' }}
//             >
//               {activeComponent}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }
'use client'

import { useState, useEffect, useRef } from 'react'
import CategoryManager from '@/components/CategoryManager'
import SupplierManager from '@/components/SupplierManager'
import SalesConfigTab from '@/components/SalesConfigTab'
import { useLanguage } from '@/contexts/LanguageContext'

export default function SalesConfigPage() {
  const [activeTab, setActiveTab] = useState('config')
  const [indicatorStyle, setIndicatorStyle] = useState({})
  const tabRefs = useRef({})
  const { t } = useLanguage()

  const tabs = [
    { id: 'config', label: t('salesConfig'), component: <SalesConfigTab /> },
    { id: 'categories', label: t('categoryManagement'), component: <CategoryManager /> },
    { id: 'suppliers', label: t('supplierManagement'), component: <SupplierManager /> }
  ]

  // Mettre à jour la position de l'indicateur quand l'onglet change
  useEffect(() => {
    if (tabRefs.current[activeTab]) {
      const activeElement = tabRefs.current[activeTab]
      const { offsetLeft, offsetWidth } = activeElement
      
      setIndicatorStyle({
        left: `${offsetLeft}px`,
        width: `${offsetWidth}px`,
        opacity: 1
      })
    }
  }, [activeTab])

  const activeComponent = tabs.find(tab => tab.id === activeTab)?.component

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-4 md:p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">{t('salesSettings')}</h1>
          <p className="text-gray-600 mt-1">
            {t('manageSalesConfig')}
          </p>
        </div>

        {/* Tabs personnalisés avec indicateur animé */}
        <div className="w-full">
          <div className="relative border-b border-gray-200">
            <div className="flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  ref={el => tabRefs.current[tab.id] = el}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    px-1 py-4 text-base font-medium transition-all duration-300
                    focus:outline-none 
                    relative z-10
                    ${activeTab === tab.id 
                      ? 'text-blue-600 font-semibold' 
                      : 'text-gray-500 hover:text-gray-700'
                    }
                  `}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            
            {/* Indicateur animé */}
            <div 
              className="absolute bottom-0 h-0.5 outline-none bg-blue-600 transition-all duration-300 ease-out rounded-t-full"
              style={indicatorStyle}
            />
          </div>

          {/* Contenu avec transition */}
          <div className="mt-6">
            <div 
              key={activeTab}
              className="animate-fade-in"
              style={{ animationDuration: '0.3s' }}
            >
              {activeComponent}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}