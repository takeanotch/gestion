
// 'use client'

// import { useState, useEffect, useRef } from 'react'
// import { useRouter } from 'next/navigation'
// import { supabase } from '@/lib/supabase'
// import { checkAuth } from '@/lib/auth'
// import { useLanguage } from '@/contexts/LanguageContext'
// import { 
//   Search, 
//   X, 
//   Plus, 
//   Minus, 
//   Trash2,
//   ShoppingCart,
//   Package,
//   CreditCard,
//   Smartphone,
//   Wallet,
//   User,
//   Phone,
//   Check,
//   ArrowLeft,
//   Loader2,
//   Globe,
//   AlertCircle
// } from 'lucide-react'

// export default function NouvelleVentePage() {
//   const router = useRouter()
//   const [currentUser, setCurrentUser] = useState(null)
//   const [loading, setLoading] = useState(false)
//   const [error, setError] = useState('')
//   const { t, language } = useLanguage()
  
//   // SECTION 1: Recherche produit
//   const [searchQuery, setSearchQuery] = useState('')
//   const [products, setProducts] = useState([])
//   const [filteredProducts, setFilteredProducts] = useState([])
//   const [showProductSuggestions, setShowProductSuggestions] = useState(false)
//   const productRef = useRef(null)
  
//   // SECTION 1: Gestion client
//   const [phoneNumber, setPhoneNumber] = useState('')
//   const [clientName, setClientName] = useState('')
//   const [existingClients, setExistingClients] = useState([])
//   const [showClientSuggestions, setShowClientSuggestions] = useState(false)
//   const [selectedClient, setSelectedClient] = useState(null)
//   const clientRef = useRef(null)
  
//   // SECTION 1: Méthode de paiement
//   const [paymentMethod, setPaymentMethod] = useState('cash')
  
//   // SECTION 2: Panier
//   const [cart, setCart] = useState([])
  
//   // SECTION 3: Totaux et configurations
//   const [subTotal, setSubTotal] = useState(0)
//   const [vatAmount, setVatAmount] = useState(0)
//   const [total, setTotal] = useState(0)
//   const [saleCurrency, setSaleCurrency] = useState('CDF')
//   const [saleConfig, setSaleConfig] = useState({
//     id: null,
//     vat_amount: 20.00,
//     currency: 'CDF',
//     currency_rate: 1.0,
//     base_currency: 'USD',
//     created_at: null,
//     updated_at: null
//   })

//   // Fermer les suggestions en cliquant à l'extérieur
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (productRef.current && !productRef.current.contains(event.target)) {
//         setShowProductSuggestions(false)
//       }
//       if (clientRef.current && !clientRef.current.contains(event.target)) {
//         setShowClientSuggestions(false)
//       }
//     }

//     document.addEventListener('mousedown', handleClickOutside)
//     return () => document.removeEventListener('mousedown', handleClickOutside)
//   }, [])

//   // Initialisation
//   useEffect(() => {
//     const user = checkAuth()
//     if (!user) {
//       router.push('/auth/login')
//       return
//     }
//     setCurrentUser(user)
//     loadSaleConfig()
//     loadProducts()
//   }, [])

//   // Recherche clients par téléphone
//   useEffect(() => {
//     const searchClients = async () => {
//       if (phoneNumber.length >= 2) {
//         const { data } = await supabase
//           .from('client')
//           .select('*')
//           .ilike('phone', `%${phoneNumber}%`)
//           .limit(5)
//         if (data) setExistingClients(data)
//       } else {
//         setExistingClients([])
//       }
//     }

//     const timer = setTimeout(() => {
//       if (phoneNumber) searchClients()
//     }, 300)

//     return () => clearTimeout(timer)
//   }, [phoneNumber])

//   // Filtrer produits
//   useEffect(() => {
//     if (!searchQuery) {
//       setFilteredProducts([])
//       return
//     }

//     const query = searchQuery.toLowerCase()
//     const filtered = products
//       .filter(product => 
//         product.name.toLowerCase().includes(query) ||
//         product.sku.toLowerCase().includes(query)
//       )
//       .slice(0, 5)
    
//     setFilteredProducts(filtered)
//   }, [searchQuery, products])

//   // Calculer les totaux avec conversion
//   useEffect(() => {
//     let subTotalInSaleCurrency = 0
    
//     cart.forEach(item => {
//       // Convertir le prix total vers la devise de vente
//       const itemTotalInSaleCurrency = convertPrice(item.total_price, item.product_currency, saleCurrency)
//       subTotalInSaleCurrency += itemTotalInSaleCurrency
//     })
    
//     const vat = (subTotalInSaleCurrency * saleConfig.vat_amount) / 100
//     const totalAmount = subTotalInSaleCurrency + vat
    
//     setSubTotal(subTotalInSaleCurrency)
//     setVatAmount(vat)
//     setTotal(totalAmount)
//   }, [cart, saleCurrency, saleConfig])

//   const loadSaleConfig = async () => {
//     try {
//       const { data, error } = await supabase
//         .from('sale_config')
//         .select('*')
//         .order('created_at', { ascending: false })
//         .limit(1)
//         .single()
      
//       if (error) throw error
      
//       if (data) {
//         setSaleConfig(data)
//         setSaleCurrency(data.currency || 'CDF')
//       }
//     } catch (error) {
//       console.error(language === 'fr' ? 'Erreur chargement config:' : 'Error loading config:', error)
//       setError(language === 'fr' ? 'Erreur lors du chargement de la configuration' : 'Error loading configuration')
//     }
//   }

//   const loadProducts = async () => {
//     try {
//       const { data, error } = await supabase
//         .from('products')
//         .select(`
//           *,
//           stock:stock(quantity)
//         `)
//         .eq('is_active', true)
//         .gt('stock.quantity', 0)
      
//       if (error) throw error
//       if (data) setProducts(data)
//     } catch (error) {
//       console.error(language === 'fr' ? 'Erreur chargement produits:' : 'Error loading products:', error)
//       setError(language === 'fr' ? 'Erreur lors du chargement des produits' : 'Error loading products')
//     }
//   }

//   const convertPrice = (price, fromCurrency, toCurrency) => {
//     if (fromCurrency === toCurrency) return price
    
//     if (fromCurrency === 'USD' && toCurrency === 'CDF') {
//       return price * saleConfig.currency_rate
//     }
    
//     if (fromCurrency === 'CDF' && toCurrency === 'USD') {
//       return price / saleConfig.currency_rate
//     }
    
//     return price
//   }

//   const addToCart = (product) => {
//     const existingItem = cart.find(item => item.product_id === product.id)
//     const stock = product.stock?.[0]?.quantity || 0
    
//     if (existingItem) {
//       if (existingItem.quantity >= stock) {
//         alert(language === 'fr' ? 'Stock insuffisant' : 'Insufficient stock')
//         return
//       }
      
//       setCart(cart.map(item =>
//         item.product_id === product.id
//           ? { 
//               ...item, 
//               quantity: item.quantity + 1,
//               total_price: (item.quantity + 1) * item.unit_price
//             }
//           : item
//       ))
//     } else {
//       if (stock < 1) {
//         alert(language === 'fr' ? 'Stock insuffisant' : 'Insufficient stock')
//         return
//       }
      
//       const cartItem = {
//         product_id: product.id,
//         product_name: product.name,
//         sku: product.sku,
//         image_url: product.image_url,
//         quantity: 1,
//         unit_price: product.retail_price,
//         total_price: product.retail_price,
//         unit_type: product.unit_type,
//         stock: stock,
//         product_currency: product.currency || 'CDF',
//         product_retail_price: product.retail_price
//       }
//       setCart([...cart, cartItem])
//     }
    
//     setSearchQuery('')
//     setShowProductSuggestions(false)
//   }

//   const updateQuantity = (productId, newQuantity) => {
//     if (newQuantity < 1) {
//       removeFromCart(productId)
//       return
//     }

//     const item = cart.find(item => item.product_id === productId)
//     if (item && newQuantity > item.stock) {
//       alert(language === 'fr' ? 'Stock insuffisant' : 'Insufficient stock')
//       return
//     }

//     setCart(cart.map(item =>
//       item.product_id === productId
//         ? { 
//             ...item, 
//             quantity: newQuantity,
//             total_price: newQuantity * item.unit_price
//           }
//         : item
//     ))
//   }

//   const removeFromCart = (productId) => {
//     setCart(cart.filter(item => item.product_id !== productId))
//   }

//   const selectClient = (client) => {
//     setSelectedClient(client)
//     setPhoneNumber(client.phone)
//     setClientName(client.name)
//     setShowClientSuggestions(false)
//   }

//   const formatCurrency = (amount, currency = saleCurrency) => {
//     const formatted = new Intl.NumberFormat(language === 'fr' ? 'fr-FR' : 'en-US', {
//       minimumFractionDigits: currency === 'CDF' ? 0 : 2,
//       maximumFractionDigits: currency === 'CDF' ? 0 : 2
//     }).format(amount || 0)
    
//     return `${getCurrencySymbol(currency)} ${formatted}`
//   }

//   const getCurrencySymbol = (currency) => {
//     return currency === 'USD' ? '$' : 'FC'
//   }

//   const getCurrencyName = (currency) => {
//     if (currency === 'USD') {
//       return language === 'fr' ? 'Dollar US' : 'US Dollar'
//     } else {
//       return language === 'fr' ? 'Franc Congolais' : 'Congolese Franc'
//     }
//   }

//   const getPaymentMethodName = (method) => {
//     switch (method) {
//       case 'cash':
//         return language === 'fr' ? 'Espèces' : 'Cash'
//       case 'card':
//         return language === 'fr' ? 'Carte bancaire' : 'Card'
//       case 'mobile':
//         return language === 'fr' ? 'Paiement mobile' : 'Mobile Payment'
//       default:
//         return method
//     }
//   }

//   const handleCompleteSale = async () => {
//     if (cart.length === 0) {
//       setError(language === 'fr' ? 'Le panier est vide' : 'Cart is empty')
//       return
//     }

//     if (!phoneNumber) {
//       setError(language === 'fr' ? 'Veuillez entrer un numéro de téléphone' : 'Please enter a phone number')
//       return
//     }

//     if (!clientName) {
//       setError(language === 'fr' ? 'Veuillez entrer le nom du client' : 'Please enter client name')
//       return
//     }

//     setLoading(true)
//     setError('')

//     try {
//       // 1. Créer ou récupérer client
//       let clientId = selectedClient?.id
      
//       if (!clientId) {
//         const { data: existingClient, error: clientError } = await supabase
//           .from('client')
//           .select('id')
//           .eq('phone', phoneNumber)
//           .single()

//         if (clientError && clientError.code !== 'PGRST116') {
//           throw clientError
//         }

//         if (existingClient) {
//           clientId = existingClient.id
//         } else {
//           const clientNumber = `CLI-${Date.now().toString().slice(-6)}`
//           const { data: newClient, error: createError } = await supabase
//             .from('client')
//             .insert({
//               client_number: clientNumber,
//               name: clientName,
//               phone: phoneNumber
//             })
//             .select()
//             .single()

//           if (createError) throw createError
//           clientId = newClient.id
//         }
//       }

//       // Calculer les totaux finaux pour la vente dans la devise de vente
//       let finalSubtotal = 0
      
//       // Convertir tous les prix vers la devise de vente
//       cart.forEach(item => {
//         const itemTotalInSaleCurrency = convertPrice(item.total_price, item.product_currency, saleCurrency)
//         finalSubtotal += itemTotalInSaleCurrency
//       })
      
//       const finalVat = (finalSubtotal * saleConfig.vat_amount) / 100
//       const finalTotal = finalSubtotal + finalVat

//       // 2. Créer la vente AVEC LE TAUX DE CHANGE ACTUEL
//       const { data: sale, error: saleError } = await supabase
//         .from('sale')
//         .insert({
//           customer_id: clientId,
//           user_id: currentUser.id,
//           status: 'completed',
//           payment_status: 'paid',
//           vat_amount: finalVat,
//           subtotal: finalSubtotal,
//           total: finalTotal,
//           payment_method: paymentMethod,
//           discount: 0,
//           currency: saleCurrency,
//           currency_rate: saleConfig.currency_rate
//         })
//         .select()
//         .single()

//       if (saleError) throw saleError

//       // 3. Ajouter items de vente AVEC original_currency
//       const saleItems = cart.map(item => {
//         const unitPriceInSaleCurrency = convertPrice(item.unit_price, item.product_currency, saleCurrency)
//         const totalPriceInSaleCurrency = convertPrice(item.total_price, item.product_currency, saleCurrency)
        
//         return {
//           sale_id: sale.id,
//           product_id: item.product_id,
//           quantity: item.quantity,
//           unit_price: unitPriceInSaleCurrency,
//           total_price: totalPriceInSaleCurrency,
//           original_currency: item.product_currency
//         }
//       })

//       const { error: itemsError } = await supabase
//         .from('sale_item')
//         .insert(saleItems)

//       if (itemsError) throw itemsError

//       // 4. Mettre à jour stocks
//       for (const item of cart) {
//         const { error: stockError } = await supabase
//           .from('stock')
//           .update({ 
//             quantity: item.stock - item.quantity,
//             updated_at: new Date().toISOString()
//           })
//           .eq('product_id', item.product_id)

//         if (stockError) throw stockError
//       }

//       // 5. Rediriger vers le ticket de vente
//       router.push(`/ventes/${sale.id}`)

//     } catch (error) {
//       console.error(language === 'fr' ? 'Erreur lors de la vente:' : 'Error during sale:', error)
//       setError((language === 'fr' ? 'Erreur lors de la création de la vente: ' : 'Error creating sale: ') + error.message)
//     } finally {
//       setLoading(false)
//     }
//   }

//   const clearCart = () => {
//     setCart([])
//     setSubTotal(0)
//     setVatAmount(0)
//     setTotal(0)
//   }

//   if (!currentUser) return null

//   return (
//     <div className="min-h-screen bg-gray-50 p-4">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="mb-6 flex items-center justify-between">
//           <button
//             onClick={() => router.push('/ventes')}
//             className="flex items-center text-gray-600 hover:text-gray-900"
//           >
//             <ArrowLeft className="w-5 h-5 mr-2" />
//             {t('back')}
//           </button>
          
//           <div className="text-center">
//             <h1 className="text-2xl font-bold text-gray-900">{t('newSale')}</h1>
//             <p className="text-gray-600">{t('salesperson')}: {currentUser.full_name}</p>
//           </div>
          
//           <div className="w-20"></div>
//         </div>

//         {/* Message d'erreur */}
//         {error && (
//           <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
//             <div className="flex items-center">
//               <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
//               <span className="text-red-700">{error}</span>
//             </div>
//           </div>
//         )}

//         {/* Conteneur principal */}
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          
//           {/* SECTION 1: Devise + Recherche + Client + Paiement */}
//           <div className="bg-white rounded-lg border border-gray-200 p-4">
//             {/* Sélection Devise */}
//             <div className="mb-6">
//               <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
//                 <Globe className="w-5 h-5 mr-2 text-blue-600" />
//                 {t('saleCurrency')}
//               </h2>
              
//               <div className="grid grid-cols-2 gap-3">
//                 <button
//                   onClick={() => setSaleCurrency('CDF')}
//                   className={`p-3 rounded-lg border-2 flex flex-col items-center ${
//                     saleCurrency === 'CDF'
//                       ? 'border-blue-500 bg-blue-50'
//                       : 'border-gray-200 hover:border-gray-300'
//                   }`}
//                 >
//                   <div className="text-lg font-bold mb-1">FC</div>
//                   <span>{getCurrencyName('CDF')}</span>
//                   {saleCurrency === 'CDF' && (
//                     <div className="mt-2 text-xs text-blue-600">
//                       <Check className="h-4 w-4 inline" /> {t('selected')}
//                     </div>
//                   )}
//                 </button>
                
//                 <button
//                   onClick={() => setSaleCurrency('USD')}
//                   className={`p-3 rounded-lg border-2 flex flex-col items-center ${
//                     saleCurrency === 'USD'
//                       ? 'border-blue-500 bg-blue-50'
//                       : 'border-gray-200 hover:border-gray-300'
//                   }`}
//                 >
//                   <div className="text-lg font-bold mb-1">$</div>
//                   <span>{getCurrencyName('USD')}</span>
//                   {saleCurrency === 'USD' && (
//                     <div className="mt-2 text-xs text-blue-600">
//                       <Check className="h-4 w-4 inline" /> {t('selected')}
//                     </div>
//                   )}
//                 </button>
//               </div>
              
//               <div className="mt-3 p-3 bg-gray-50 rounded-lg">
//                 <div className="grid grid-cols-2 gap-2 text-sm">
//                   <div className="text-gray-600">{t('currentRate')}:</div>
//                   <div className="font-medium">1 USD = {saleConfig.currency_rate?.toLocaleString(language === 'fr' ? 'fr-FR' : 'en-US') || '1.000'} CDF</div>
//                   <div className="text-gray-600">{t('vatApplied')}:</div>
//                   <div className="font-medium">{saleConfig.vat_amount || 20}%</div>
//                   <div className="text-gray-600">{t('defaultCurrency')}:</div>
//                   <div className="font-medium">{saleConfig.currency || 'CDF'}</div>
//                 </div>
//               </div>
//             </div>

//             {/* Recherche Produit */}
//             <div className="mb-6">
//               <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
//                 <Search className="w-5 h-5 mr-2 text-blue-600" />
//                 {t('searchProduct')}
//               </h2>
              
//               <div className="relative" ref={productRef}>
//                 <input
//                   type="text"
//                   value={searchQuery}
//                   onChange={(e) => {
//                     setSearchQuery(e.target.value)
//                     setShowProductSuggestions(true)
//                   }}
//                   onFocus={() => setShowProductSuggestions(true)}
//                   placeholder={t('productSearchPlaceholder')}
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                 />
                
//                 {showProductSuggestions && filteredProducts.length > 0 && (
//                   <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-80 overflow-y-auto">
//                     {filteredProducts.map(product => {
//                       const displayPrice = convertPrice(product.retail_price, product.currency || 'CDF', saleCurrency)
                      
//                       return (
//                         <div
//                           key={product.id}
//                           onClick={() => addToCart(product)}
//                           className="flex items-center p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100"
//                         >
//                           <div className="flex-shrink-0 h-10 w-10 mr-3">
//                             {product.image_url ? (
//                               <img
//                                 src={product.image_url}
//                                 alt={product.name}
//                                 className="h-10 w-10 rounded object-cover"
//                               />
//                             ) : (
//                               <div className="h-10 w-10 rounded bg-gray-100 flex items-center justify-center">
//                                 <Package className="h-5 w-5 text-gray-400" />
//                               </div>
//                             )}
//                           </div>
//                           <div className="flex-1">
//                             <div className="font-medium text-gray-900 truncate">
//                               {product.name}
//                             </div>
//                             <div className="text-xs text-gray-500">
//                               {t('sku')}: {product.sku} • {t('stock')}: {product.stock?.[0]?.quantity || 0}
//                             </div>
//                             <div className="text-xs text-gray-500 mt-1">
//                               {t('currency')}: {getCurrencyName(product.currency || 'CDF')}
//                             </div>
//                           </div>
//                           <div className="text-right">
//                             <div className="font-semibold">
//                               {formatCurrency(displayPrice, saleCurrency)}
//                             </div>
//                             <div className="text-xs text-gray-500">
//                               {t('original')}: {formatCurrency(product.retail_price, product.currency || 'CDF')}
//                             </div>
//                           </div>
//                         </div>
//                       )
//                     })}
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* Informations Client */}
//             <div className="mb-6">
//               <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
//                 <User className="w-5 h-5 mr-2 text-blue-600" />
//                 {t('clientInformation')}
//               </h2>
              
//               <div className="space-y-4">
//                 {/* Téléphone */}
//                 <div className="relative" ref={clientRef}>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     {t('phone')} *
//                   </label>
//                   <div className="flex">
//                     <div className="flex-shrink-0 flex items-center px-3 border border-r-0 border-gray-300 rounded-l-lg bg-gray-50">
//                       <Phone className="h-5 w-5 text-gray-400" />
//                     </div>
//                     <input
//                       type="tel"
//                       value={phoneNumber}
//                       onChange={(e) => {
//                         setPhoneNumber(e.target.value)
//                         setSelectedClient(null)
//                       }}
//                       onFocus={() => setShowClientSuggestions(true)}
//                       placeholder={t('phonePlaceholder')}
//                       className="flex-1 px-3 py-2 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                     />
//                   </div>
                  
//                   {showClientSuggestions && existingClients.length > 0 && (
//                     <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
//                       {existingClients.map(client => (
//                         <div
//                           key={client.id}
//                           onClick={() => selectClient(client)}
//                           className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100"
//                         >
//                           <div className="font-medium">{client.name}</div>
//                           <div className="text-sm text-gray-500">{client.phone}</div>
//                         </div>
//                       ))}
//                     </div>
//                   )}
//                 </div>

//                 {/* Nom */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     {t('fullName')} *
//                   </label>
//                   <div className="flex">
//                     <div className="flex-shrink-0 flex items-center px-3 border border-r-0 border-gray-300 rounded-l-lg bg-gray-50">
//                       <User className="h-5 w-5 text-gray-400" />
//                     </div>
//                     <input
//                       type="text"
//                       value={clientName}
//                       onChange={(e) => setClientName(e.target.value)}
//                       placeholder={t('clientNamePlaceholder')}
//                       className="flex-1 px-3 py-2 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                     />
//                   </div>
//                 </div>

//                 {/* Client sélectionné */}
//                 {selectedClient && (
//                   <div className="p-3 bg-green-50 rounded-lg border border-green-200">
//                     <div className="flex items-center justify-between">
//                       <div>
//                         <div className="font-medium text-green-900">
//                           {selectedClient.name}
//                         </div>
//                         <div className="text-sm text-green-700">
//                           {selectedClient.phone}
//                         </div>
//                       </div>
//                       <button
//                         onClick={() => {
//                           setSelectedClient(null)
//                           setPhoneNumber('')
//                           setClientName('')
//                         }}
//                         className="p-1 text-green-600 hover:text-green-800"
//                       >
//                         <X className="h-4 w-4" />
//                       </button>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* Mode de Paiement */}
//             <div>
//               <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
//                 <CreditCard className="w-5 h-5 mr-2 text-blue-600" />
//                 {t('paymentMethod')}
//               </h2>
              
//               <div className="grid grid-cols-3 gap-3">
//                 <button
//                   onClick={() => setPaymentMethod('cash')}
//                   className={`p-3 rounded-lg border-2 flex flex-col items-center ${
//                     paymentMethod === 'cash'
//                       ? 'border-blue-500 bg-blue-50'
//                       : 'border-gray-200 hover:border-gray-300'
//                   }`}
//                 >
//                   <Wallet className="h-6 w-6 mb-2 text-gray-600" />
//                   <span>{getPaymentMethodName('cash')}</span>
//                   {paymentMethod === 'cash' && (
//                     <Check className="h-4 w-4 mt-1 text-blue-500" />
//                   )}
//                 </button>
                
//                 <button
//                   onClick={() => setPaymentMethod('card')}
//                   className={`p-3 rounded-lg border-2 flex flex-col items-center ${
//                     paymentMethod === 'card'
//                       ? 'border-blue-500 bg-blue-50'
//                       : 'border-gray-200 hover:border-gray-300'
//                   }`}
//                 >
//                   <CreditCard className="h-6 w-6 mb-2 text-gray-600" />
//                   <span>{getPaymentMethodName('card')}</span>
//                   {paymentMethod === 'card' && (
//                     <Check className="h-4 w-4 mt-1 text-blue-500" />
//                   )}
//                 </button>
                
//                 <button
//                   onClick={() => setPaymentMethod('mobile')}
//                   className={`p-3 rounded-lg border-2 flex flex-col items-center ${
//                     paymentMethod === 'mobile'
//                       ? 'border-blue-500 bg-blue-50'
//                       : 'border-gray-200 hover:border-gray-300'
//                   }`}
//                 >
//                   <Smartphone className="h-6 w-6 mb-2 text-gray-600" />
//                   <span>{getPaymentMethodName('mobile')}</span>
//                   {paymentMethod === 'mobile' && (
//                     <Check className="h-4 w-4 mt-1 text-blue-500" />
//                   )}
//                 </button>
//               </div>
//             </div>
//           </div>

//           {/* SECTION 2: Panier */}
//           <div className="bg-white rounded-lg border border-gray-200 p-4">
//             <div className="flex items-center justify-between mb-4">
//               <h2 className="text-lg font-semibold text-gray-900 flex items-center">
//                 <ShoppingCart className="w-5 h-5 mr-2 text-blue-600" />
//                 {t('cart')} ({cart.length})
//               </h2>
              
//               {cart.length > 0 && (
//                 <button
//                   onClick={clearCart}
//                   className="text-sm text-red-600 hover:text-red-800 flex items-center"
//                 >
//                   <Trash2 className="h-4 w-4 mr-1" />
//                   {t('clearCart')}
//                 </button>
//               )}
//             </div>
            
//             {cart.length === 0 ? (
//               <div className="text-center py-8">
//                 <ShoppingCart className="h-12 w-12 text-gray-300 mx-auto mb-3" />
//                 <p className="text-gray-500">{t('emptyCart')}</p>
//                 <p className="text-sm text-gray-400 mt-1">{t('searchProductsToAdd')}</p>
//               </div>
//             ) : (
//               <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
//                 {cart.map((item) => {
//                   const displayUnitPrice = convertPrice(item.unit_price, item.product_currency, saleCurrency)
//                   const displayTotalPrice = convertPrice(item.total_price, item.product_currency, saleCurrency)
                  
//                   return (
//                     <div key={item.product_id} className="p-3 border border-gray-200 rounded-lg">
//                       <div className="flex items-start justify-between mb-2">
//                         <div className="flex items-start">
//                           {item.image_url ? (
//                             <img
//                               src={item.image_url}
//                               alt={item.product_name}
//                               className="h-10 w-10 rounded object-cover mr-3"
//                             />
//                           ) : (
//                             <div className="h-10 w-10 rounded bg-gray-100 flex items-center justify-center mr-3">
//                               <Package className="h-5 w-5 text-gray-400" />
//                             </div>
//                           )}
//                           <div>
//                             <div className="font-medium">{item.product_name}</div>
//                             <div className="text-xs text-gray-500">{t('sku')}: {item.sku}</div>
//                             <div className="text-xs text-gray-500">
//                               {t('stock')}: {item.stock} • {t('currency')}: {item.product_currency}
//                             </div>
//                           </div>
//                         </div>
//                         <button
//                           onClick={() => removeFromCart(item.product_id)}
//                           className="p-1 text-gray-400 hover:text-red-600"
//                         >
//                           <Trash2 className="h-4 w-4" />
//                         </button>
//                       </div>
                      
//                       <div className="flex items-center justify-between mt-3">
//                         <div className="flex items-center space-x-3">
//                           <button
//                             onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
//                             className="p-1 hover:bg-gray-100 rounded border border-gray-300"
//                           >
//                             <Minus className="h-3 w-3" />
//                           </button>
//                           <span className="font-medium min-w-[30px] text-center">{item.quantity}</span>
//                           <button
//                             onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
//                             className="p-1 hover:bg-gray-100 rounded border border-gray-300"
//                           >
//                             <Plus className="h-3 w-3" />
//                           </button>
//                         </div>
//                         <div className="text-right">
//                           <div className="text-sm text-gray-500">
//                             {formatCurrency(displayUnitPrice, saleCurrency)} × {item.quantity}
//                           </div>
//                           <div className="font-semibold">
//                             {formatCurrency(displayTotalPrice, saleCurrency)}
//                           </div>
//                           {item.product_currency !== saleCurrency && (
//                             <div className="text-xs text-gray-400">
//                               ({formatCurrency(item.total_price, item.product_currency)})
//                             </div>
//                           )}
//                         </div>
//                       </div>
//                     </div>
//                   )
//                 })}
//               </div>
//             )}
//           </div>

//           {/* SECTION 3: Récapitulatif */}
//           <div className="bg-white rounded-lg border border-gray-200 p-4">
//             <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('summary')}</h2>
            
//             <div className="space-y-4 mb-6">
//               <div className="flex justify-between py-2 border-b">
//                 <span className="text-gray-600">{t('saleCurrency')}:</span>
//                 <span className="font-medium">
//                   {getCurrencyName(saleCurrency)} ({saleCurrency})
//                 </span>
//               </div>
              
//               <div className="flex justify-between py-2 border-b">
//                 <span className="text-gray-600">{t('subtotal')}:</span>
//                 <span className="font-medium">{formatCurrency(subTotal)}</span>
//               </div>
              
//               <div className="flex justify-between py-2 border-b">
//                 <span className="text-gray-600">{t('vat')} ({saleConfig.vat_amount}%):</span>
//                 <span className="font-medium">{formatCurrency(vatAmount)}</span>
//               </div>
              
//               <div className="flex justify-between py-2 border-b">
//                 <span className="text-gray-600">{t('paymentMethod')}:</span>
//                 <span className="font-medium">{getPaymentMethodName(paymentMethod)}</span>
//               </div>
              
//               <div className="pt-2">
//                 <div className="flex justify-between font-bold text-lg">
//                   <span>{t('totalToPay')}:</span>
//                   <span className="text-blue-600">{formatCurrency(total)}</span>
//                 </div>
//               </div>
//             </div>
            
//             <div className="bg-gray-50 p-3 rounded-lg mb-6">
//               <div className="grid grid-cols-2 gap-2 text-sm">
//                 <div className="text-gray-600">{t('itemsInCart')}:</div>
//                 <div className="font-medium text-right">{cart.reduce((sum, item) => sum + item.quantity, 0)}</div>
                
//                 <div className="text-gray-600">{t('differentProducts')}:</div>
//                 <div className="font-medium text-right">{cart.length}</div>
                
//                 <div className="text-gray-600">{t('currenciesInCart')}:</div>
//                 <div className="font-medium text-right">
//                   {[...new Set(cart.map(item => item.product_currency))].join(', ')}
//                 </div>
                
//                 <div className="text-gray-600">{t('exchangeRate')}:</div>
//                 <div className="font-medium text-right">
//                   1 USD = {saleConfig.currency_rate?.toLocaleString(language === 'fr' ? 'fr-FR' : 'en-US') || '1.000'} CDF
//                 </div>
//               </div>
//             </div>
            
//             <button
//               onClick={handleCompleteSale}
//               disabled={loading || cart.length === 0 || !phoneNumber || !clientName}
//               className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors mb-3"
//             >
//               {loading ? (
//                 <>
//                   <Loader2 className="h-5 w-5 mr-2 animate-spin" />
//                   {t('processing')}...
//                 </>
//               ) : (
//                 <>
//                   <Check className="h-5 w-5 mr-2" />
//                   {t('completeSale')} ({formatCurrency(total)})
//                 </>
//               )}
//             </button>
            
//             <div className="grid grid-cols-2 gap-3">
//               <button
//                 onClick={() => router.push('/ventes')}
//                 className="py-2 text-gray-600 hover:text-gray-900 text-sm"
//               >
//                 {t('cancel')}
//               </button>
              
//               <button
//                 onClick={clearCart}
//                 disabled={cart.length === 0}
//                 className="py-2 text-red-600 hover:text-red-800 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 {t('clearCart')}
//               </button>
//             </div>
            
//             {cart.length > 0 && (!phoneNumber || !clientName) && (
//               <p className="text-sm text-red-600 mt-3 text-center">
//                 {t('completeClientInfo')}
//               </p>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }
import { redirect } from 'next/navigation';

export default function HomePage() {
  redirect('/super-admin/sales');
}