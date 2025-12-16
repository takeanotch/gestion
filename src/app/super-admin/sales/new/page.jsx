
// // 'use client'

// // import { useState, useEffect, useRef } from 'react'
// // import { useRouter } from 'next/navigation'
// // import { supabase } from '@/lib/supabase'
// // import { checkAuth } from '@/lib/auth'
// // import { 
// //   Search, 
// //   X, 
// //   Plus, 
// //   Minus, 
// //   Trash2,
// //   ShoppingCart,
// //   Package,
// //   CreditCard,
// //   Smartphone,
// //   Wallet,
// //   User,
// //   Phone,
// //   Check,
// //   ArrowLeft,
// //   Loader2
// // } from 'lucide-react'

// // export default function NouvelleVentePage() {
// //   const router = useRouter()
// //   const [currentUser, setCurrentUser] = useState(null)
// //   const [loading, setLoading] = useState(false)
  
// //   // SECTION 1: Recherche produit
// //   const [searchQuery, setSearchQuery] = useState('')
// //   const [products, setProducts] = useState([])
// //   const [filteredProducts, setFilteredProducts] = useState([])
// //   const [showProductSuggestions, setShowProductSuggestions] = useState(false)
// //   const productRef = useRef(null)
  
// //   // SECTION 1: Gestion client
// //   const [phoneNumber, setPhoneNumber] = useState('')
// //   const [clientName, setClientName] = useState('')
// //   const [existingClients, setExistingClients] = useState([])
// //   const [showClientSuggestions, setShowClientSuggestions] = useState(false)
// //   const [selectedClient, setSelectedClient] = useState(null)
// //   const clientRef = useRef(null)
  
// //   // SECTION 1: Méthode de paiement
// //   const [paymentMethod, setPaymentMethod] = useState('cash')
  
// //   // SECTION 2: Panier
// //   const [cart, setCart] = useState([])
  
// //   // SECTION 3: Totaux
// //   const [subTotal, setSubTotal] = useState(0)
// //   const [vatAmount, setVatAmount] = useState(0)
// //   const [total, setTotal] = useState(0)
// //   const [vatRate, setVatRate] = useState(20)

// //   // Fermer les suggestions en cliquant à l'extérieur
// //   useEffect(() => {
// //     const handleClickOutside = (event) => {
// //       if (productRef.current && !productRef.current.contains(event.target)) {
// //         setShowProductSuggestions(false)
// //       }
// //       if (clientRef.current && !clientRef.current.contains(event.target)) {
// //         setShowClientSuggestions(false)
// //       }
// //     }

// //     document.addEventListener('mousedown', handleClickOutside)
// //     return () => document.removeEventListener('mousedown', handleClickOutside)
// //   }, [])

// //   // Initialisation
// //   useEffect(() => {
// //     const user = checkAuth()
// //     if (!user) {
// //       router.push('/auth/login')
// //       return
// //     }
// //     setCurrentUser(user)
// //     loadVatRate()
// //     loadProducts()
// //   }, [])

// //   // Recherche clients par téléphone
// //   useEffect(() => {
// //     const searchClients = async () => {
// //       if (phoneNumber.length >= 2) {
// //         const { data } = await supabase
// //           .from('client')
// //           .select('*')
// //           .ilike('phone', `%${phoneNumber}%`)
// //           .limit(5)
// //         if (data) setExistingClients(data)
// //       } else {
// //         setExistingClients([])
// //       }
// //     }

// //     const timer = setTimeout(() => {
// //       if (phoneNumber) searchClients()
// //     }, 300)

// //     return () => clearTimeout(timer)
// //   }, [phoneNumber])

// //   // Filtrer produits
// //   useEffect(() => {
// //     if (!searchQuery) {
// //       setFilteredProducts([])
// //       return
// //     }

// //     const query = searchQuery.toLowerCase()
// //     const filtered = products
// //       .filter(product => 
// //         product.name.toLowerCase().includes(query) ||
// //         product.sku.toLowerCase().includes(query)
// //       )
// //       .slice(0, 5)
    
// //     setFilteredProducts(filtered)
// //   }, [searchQuery, products])

// //   // Calculer les totaux
// //   useEffect(() => {
// //     const sub = cart.reduce((sum, item) => sum + item.total_price, 0)
// //     const vat = (sub * vatRate) / 100
// //     const totalAmount = sub + vat
    
// //     setSubTotal(sub)
// //     setVatAmount(vat)
// //     setTotal(totalAmount)
// //   }, [cart, vatRate])

// //   const loadVatRate = async () => {
// //     const { data } = await supabase
// //       .from('sale_config')
// //       .select('vat_amount')
// //       .single()
// //     if (data) setVatRate(data.vat_amount)
// //   }

// //   const loadProducts = async () => {
// //     const { data } = await supabase
// //       .from('products')
// //       .select(`
// //         *,
// //         stock:stock(quantity)
// //       `)
// //       .eq('is_active', true)
// //       .gt('stock.quantity', 0)
    
// //     if (data) setProducts(data)
// //   }

// //   const addToCart = (product) => {
// //     const existingItem = cart.find(item => item.product_id === product.id)
// //     const stock = product.stock?.[0]?.quantity || 0
    
// //     if (existingItem) {
// //       if (existingItem.quantity >= stock) {
// //         alert('Stock insuffisant')
// //         return
// //       }
      
// //       setCart(cart.map(item =>
// //         item.product_id === product.id
// //           ? { 
// //               ...item, 
// //               quantity: item.quantity + 1,
// //               total_price: (item.quantity + 1) * item.unit_price
// //             }
// //           : item
// //       ))
// //     } else {
// //       if (stock < 1) {
// //         alert('Stock insuffisant')
// //         return
// //       }
      
// //       const cartItem = {
// //         product_id: product.id,
// //         product_name: product.name,
// //         sku: product.sku,
// //         image_url: product.image_url,
// //         quantity: 1,
// //         unit_price: product.retail_price,
// //         total_price: product.retail_price,
// //         unit_type: product.unit_type,
// //         stock: stock
// //       }
// //       setCart([...cart, cartItem])
// //     }
    
// //     setSearchQuery('')
// //     setShowProductSuggestions(false)
// //   }

// //   const updateQuantity = (productId, newQuantity) => {
// //     if (newQuantity < 1) {
// //       removeFromCart(productId)
// //       return
// //     }

// //     const item = cart.find(item => item.product_id === productId)
// //     if (item && newQuantity > item.stock) {
// //       alert('Stock insuffisant')
// //       return
// //     }

// //     setCart(cart.map(item =>
// //       item.product_id === productId
// //         ? { 
// //             ...item, 
// //             quantity: newQuantity,
// //             total_price: newQuantity * item.unit_price
// //           }
// //         : item
// //     ))
// //   }

// //   const removeFromCart = (productId) => {
// //     setCart(cart.filter(item => item.product_id !== productId))
// //   }

// //   const selectClient = (client) => {
// //     setSelectedClient(client)
// //     setPhoneNumber(client.phone)
// //     setClientName(client.name)
// //     setShowClientSuggestions(false)
// //   }

// //   const formatCurrency = (amount) => {
// //     return new Intl.NumberFormat('fr-FR', {
// //       style: 'currency',
// //       currency: 'CDF',
// //       minimumFractionDigits: 0
// //     }).format(amount || 0)
// //   }

// //   const handleCompleteSale = async () => {
// //     if (cart.length === 0) {
// //       alert('Le panier est vide')
// //       return
// //     }

// //     if (!phoneNumber) {
// //       alert('Veuillez entrer un numéro de téléphone')
// //       return
// //     }

// //     if (!clientName) {
// //       alert('Veuillez entrer le nom du client')
// //       return
// //     }

// //     setLoading(true)

// //     try {
// //       // 1. Créer ou récupérer client
// //       let clientId = selectedClient?.id
      
// //       if (!clientId) {
// //         const { data: existingClient } = await supabase
// //           .from('client')
// //           .select('id')
// //           .eq('phone', phoneNumber)
// //           .single()

// //         if (existingClient) {
// //           clientId = existingClient.id
// //         } else {
// //           const clientNumber = `CLI-${Date.now().toString().slice(-6)}`
// //           const { data: newClient, error } = await supabase
// //             .from('client')
// //             .insert({
// //               client_number: clientNumber,
// //               name: clientName,
// //               phone: phoneNumber
// //             })
// //             .select()
// //             .single()

// //           if (error) throw error
// //           clientId = newClient.id
// //         }
// //       }

// //       // 2. Créer la vente
// //       const { data: sale, error: saleError } = await supabase
// //         .from('sale')
// //         .insert({
// //           customer_id: clientId,
// //           user_id: currentUser.id,
// //           status: 'completed',
// //           payment_status: 'paid',
// //           vat_amount: vatAmount,
// //           subtotal: subTotal,
// //           total: total,
// //           payment_method: paymentMethod,
// //           discount: 0
// //         })
// //         .select()
// //         .single()

// //       if (saleError) throw saleError

// //       // 3. Ajouter items
// //       const saleItems = cart.map(item => ({
// //         sale_id: sale.id,
// //         product_id: item.product_id,
// //         quantity: item.quantity,
// //         unit_price: item.unit_price,
// //         total_price: item.total_price
// //       }))

// //       const { error: itemsError } = await supabase
// //         .from('sale_item')
// //         .insert(saleItems)

// //       if (itemsError) throw itemsError

// //       // 4. Mettre à jour stocks
// //       for (const item of cart) {
// //         await supabase
// //           .from('stock')
// //           .update({ quantity: item.stock - item.quantity })
// //           .eq('product_id', item.product_id)
// //       }

// //       alert('Vente enregistrée!')
// //       router.push(`/ventes/${sale.id}`)

// //     } catch (error) {
// //       console.error('Erreur:', error)
// //       alert('Erreur: ' + error.message)
// //     } finally {
// //       setLoading(false)
// //     }
// //   }

// //   if (!currentUser) return null

// //   return (
// //     <div className="min-h-screen bg-gray-50 p-4">
// //       <div className="max-w-7xl mx-auto">
// //         {/* Header */}
// //         <div className="mb-6 flex items-center justify-between">
// //           <button
// //             onClick={() => router.push('/ventes')}
// //             className="flex items-center text-gray-600 hover:text-gray-900"
// //           >
// //             <ArrowLeft className="w-5 h-5 mr-2" />
// //             Retour
// //           </button>
          
// //           <div className="text-center">
// //             <h1 className="text-2xl font-bold text-gray-900">Nouvelle Vente</h1>
// //             <p className="text-gray-600">Vendeur: {currentUser.full_name}</p>
// //           </div>
          
// //           <div className="w-20"></div> {/* Espaceur */}
// //         </div>

// //         {/* Conteneur principal avec 3 sections horizontales */}
// //         <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          
// //           {/* SECTION 1: Recherche + Client + Paiement */}
// //           <div className="bg-white rounded-lg border border-gray-200 p-4">
// //             {/* Recherche Produit */}
// //             <div className="mb-6">
// //               <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
// //                 <Search className="w-5 h-5 mr-2 text-blue-600" />
// //                 Rechercher Produit
// //               </h2>
              
// //               <div className="relative" ref={productRef}>
// //                 <input
// //                   type="text"
// //                   value={searchQuery}
// //                   onChange={(e) => {
// //                     setSearchQuery(e.target.value)
// //                     setShowProductSuggestions(true)
// //                   }}
// //                   onFocus={() => setShowProductSuggestions(true)}
// //                   placeholder="Nom ou SKU du produit..."
// //                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
// //                 />
                
// //                 {showProductSuggestions && filteredProducts.length > 0 && (
// //                   <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
// //                     {filteredProducts.map(product => (
// //                       <div
// //                         key={product.id}
// //                         onClick={() => addToCart(product)}
// //                         className="flex items-center p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100"
// //                       >
// //                         <div className="flex-shrink-0 h-10 w-10 mr-3">
// //                           {product.image_url ? (
// //                             <img
// //                               src={product.image_url}
// //                               alt={product.name}
// //                               className="h-10 w-10 rounded object-cover"
// //                             />
// //                           ) : (
// //                             <div className="h-10 w-10 rounded bg-gray-100 flex items-center justify-center">
// //                               <Package className="h-5 w-5 text-gray-400" />
// //                             </div>
// //                           )}
// //                         </div>
// //                         <div className="flex-1">
// //                           <div className="font-medium text-gray-900">
// //                             {product.name}
// //                           </div>
// //                           <div className="text-sm text-gray-500">
// //                             SKU: {product.sku} • Stock: {product.stock?.[0]?.quantity || 0}
// //                           </div>
// //                         </div>
// //                         <div className="text-right">
// //                           <div className="font-semibold">
// //                             {formatCurrency(product.retail_price)}
// //                           </div>
// //                         </div>
// //                       </div>
// //                     ))}
// //                   </div>
// //                 )}
// //               </div>
// //             </div>

// //             {/* Informations Client */}
// //             <div className="mb-6">
// //               <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
// //                 <User className="w-5 h-5 mr-2 text-blue-600" />
// //                 Informations Client
// //               </h2>
              
// //               <div className="space-y-4">
// //                 {/* Téléphone */}
// //                 <div className="relative" ref={clientRef}>
// //                   <label className="block text-sm font-medium text-gray-700 mb-1">
// //                     Téléphone *
// //                   </label>
// //                   <div className="flex">
// //                     <div className="flex-shrink-0 flex items-center px-3 border border-r-0 border-gray-300 rounded-l-lg bg-gray-50">
// //                       <Phone className="h-5 w-5 text-gray-400" />
// //                     </div>
// //                     <input
// //                       type="tel"
// //                       value={phoneNumber}
// //                       onChange={(e) => {
// //                         setPhoneNumber(e.target.value)
// //                         setSelectedClient(null)
// //                       }}
// //                       onFocus={() => setShowClientSuggestions(true)}
// //                       placeholder="Numéro du client"
// //                       className="flex-1 px-3 py-2 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
// //                     />
// //                   </div>
                  
// //                   {showClientSuggestions && existingClients.length > 0 && (
// //                     <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
// //                       {existingClients.map(client => (
// //                         <div
// //                           key={client.id}
// //                           onClick={() => selectClient(client)}
// //                           className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100"
// //                         >
// //                           <div className="font-medium">{client.name}</div>
// //                           <div className="text-sm text-gray-500">{client.phone}</div>
// //                         </div>
// //                       ))}
// //                     </div>
// //                   )}
// //                 </div>

// //                 {/* Nom */}
// //                 <div>
// //                   <label className="block text-sm font-medium text-gray-700 mb-1">
// //                     Nom complet *
// //                   </label>
// //                   <div className="flex">
// //                     <div className="flex-shrink-0 flex items-center px-3 border border-r-0 border-gray-300 rounded-l-lg bg-gray-50">
// //                       <User className="h-5 w-5 text-gray-400" />
// //                     </div>
// //                     <input
// //                       type="text"
// //                       value={clientName}
// //                       onChange={(e) => setClientName(e.target.value)}
// //                       placeholder="Nom du client"
// //                       className="flex-1 px-3 py-2 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
// //                     />
// //                   </div>
// //                 </div>

// //                 {/* Client sélectionné */}
// //                 {selectedClient && (
// //                   <div className="p-3 bg-green-50 rounded-lg border border-green-200">
// //                     <div className="flex items-center justify-between">
// //                       <div>
// //                         <div className="font-medium text-green-900">
// //                           {selectedClient.name}
// //                         </div>
// //                         <div className="text-sm text-green-700">
// //                           {selectedClient.phone}
// //                         </div>
// //                       </div>
// //                       <button
// //                         onClick={() => {
// //                           setSelectedClient(null)
// //                           setPhoneNumber('')
// //                           setClientName('')
// //                         }}
// //                         className="p-1 text-green-600 hover:text-green-800"
// //                       >
// //                         <X className="h-4 w-4" />
// //                       </button>
// //                     </div>
// //                   </div>
// //                 )}
// //               </div>
// //             </div>

// //             {/* Mode de Paiement */}
// //             <div>
// //               <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
// //                 <CreditCard className="w-5 h-5 mr-2 text-blue-600" />
// //                 Mode de Paiement
// //               </h2>
              
// //               <div className="grid grid-cols-3 gap-3">
// //                 <button
// //                   onClick={() => setPaymentMethod('cash')}
// //                   className={`p-3 rounded-lg border-2 flex flex-col items-center ${
// //                     paymentMethod === 'cash'
// //                       ? 'border-blue-500 bg-blue-50'
// //                       : 'border-gray-200'
// //                   }`}
// //                 >
// //                   <Wallet className="h-6 w-6 mb-2 text-gray-600" />
// //                   <span>Espèces</span>
// //                 </button>
                
// //                 <button
// //                   onClick={() => setPaymentMethod('card')}
// //                   className={`p-3 rounded-lg border-2 flex flex-col items-center ${
// //                     paymentMethod === 'card'
// //                       ? 'border-blue-500 bg-blue-50'
// //                       : 'border-gray-200'
// //                   }`}
// //                 >
// //                   <CreditCard className="h-6 w-6 mb-2 text-gray-600" />
// //                   <span>Carte</span>
// //                 </button>
                
// //                 <button
// //                   onClick={() => setPaymentMethod('mobile')}
// //                   className={`p-3 rounded-lg border-2 flex flex-col items-center ${
// //                     paymentMethod === 'mobile'
// //                       ? 'border-blue-500 bg-blue-50'
// //                       : 'border-gray-200'
// //                   }`}
// //                 >
// //                   <Smartphone className="h-6 w-6 mb-2 text-gray-600" />
// //                   <span>Mobile</span>
// //                 </button>
// //               </div>
// //             </div>
// //           </div>

// //           {/* SECTION 2: Panier */}
// //           <div className="bg-white rounded-lg border border-gray-200 p-4">
// //             <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
// //               <ShoppingCart className="w-5 h-5 mr-2 text-blue-600" />
// //               Panier ({cart.length})
// //             </h2>
            
// //             {cart.length === 0 ? (
// //               <div className="text-center py-8">
// //                 <ShoppingCart className="h-12 w-12 text-gray-300 mx-auto mb-3" />
// //                 <p className="text-gray-500">Panier vide</p>
// //                 <p className="text-sm text-gray-400 mt-1">Recherchez des produits pour les ajouter</p>
// //               </div>
// //             ) : (
// //               <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
// //                 {cart.map((item) => (
// //                   <div key={item.product_id} className="p-3 border border-gray-200 rounded-lg">
// //                     <div className="flex items-start justify-between mb-2">
// //                       <div className="flex items-start">
// //                         {item.image_url ? (
// //                           <img
// //                             src={item.image_url}
// //                             alt={item.product_name}
// //                             className="h-10 w-10 rounded object-cover mr-3"
// //                           />
// //                         ) : (
// //                           <div className="h-10 w-10 rounded bg-gray-100 flex items-center justify-center mr-3">
// //                             <Package className="h-5 w-5 text-gray-400" />
// //                           </div>
// //                         )}
// //                         <div>
// //                           <div className="font-medium">{item.product_name}</div>
// //                           <div className="text-xs text-gray-500">{item.sku}</div>
// //                           <div className="text-xs text-gray-500">Stock: {item.stock}</div>
// //                         </div>
// //                       </div>
// //                       <button
// //                         onClick={() => removeFromCart(item.product_id)}
// //                         className="p-1 text-gray-400 hover:text-red-600"
// //                       >
// //                         <Trash2 className="h-4 w-4" />
// //                       </button>
// //                     </div>
                    
// //                     <div className="flex items-center justify-between">
// //                       <div className="flex items-center space-x-3">
// //                         <button
// //                           onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
// //                           className="p-1 hover:bg-gray-100 rounded"
// //                         >
// //                           <Minus className="h-3 w-3" />
// //                         </button>
// //                         <span className="font-medium min-w-[30px] text-center">{item.quantity}</span>
// //                         <button
// //                           onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
// //                           className="p-1 hover:bg-gray-100 rounded"
// //                         >
// //                           <Plus className="h-3 w-3" />
// //                         </button>
// //                       </div>
// //                       <div className="text-right">
// //                         <div className="text-sm text-gray-500">
// //                           {formatCurrency(item.unit_price)} × {item.quantity}
// //                         </div>
// //                         <div className="font-semibold">
// //                           {formatCurrency(item.total_price)}
// //                         </div>
// //                       </div>
// //                     </div>
// //                   </div>
// //                 ))}
// //               </div>
// //             )}
// //           </div>

// //           {/* SECTION 3: Récapitulatif */}
// //           <div className="bg-white rounded-lg border border-gray-200 p-4">
// //             <h2 className="text-lg font-semibold text-gray-900 mb-4">Récapitulatif</h2>
            
// //             <div className="space-y-4 mb-6">
// //               <div className="flex justify-between py-2 border-b">
// //                 <span className="text-gray-600">Sous-total:</span>
// //                 <span className="font-medium">{formatCurrency(subTotal)}</span>
// //               </div>
// //               <div className="flex justify-between py-2 border-b">
// //                 <span className="text-gray-600">TVA ({vatRate}%):</span>
// //                 <span className="font-medium">{formatCurrency(vatAmount)}</span>
// //               </div>
// //               <div className="flex justify-between py-2 border-b">
// //                 <span className="text-gray-600">Mode de paiement:</span>
// //                 <span className="font-medium capitalize">{paymentMethod}</span>
// //               </div>
// //               <div className="pt-2">
// //                 <div className="flex justify-between font-bold text-lg">
// //                   <span>Total à payer:</span>
// //                   <span className="text-blue-600">{formatCurrency(total)}</span>
// //                 </div>
// //               </div>
// //             </div>
            
// //             <div className="bg-gray-50 p-3 rounded-lg mb-6">
// //               <div className="flex justify-between text-sm mb-1">
// //                 <span className="text-gray-600">Articles dans le panier:</span>
// //                 <span className="font-medium">{cart.reduce((sum, item) => sum + item.quantity, 0)}</span>
// //               </div>
// //               <div className="flex justify-between text-sm">
// //                 <span className="text-gray-600">Produits différents:</span>
// //                 <span className="font-medium">{cart.length}</span>
// //               </div>
// //             </div>
            
// //             <button
// //               onClick={handleCompleteSale}
// //               disabled={loading || cart.length === 0 || !phoneNumber || !clientName}
// //               className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
// //             >
// //               {loading ? (
// //                 <>
// //                   <Loader2 className="h-5 w-5 mr-2 animate-spin" />
// //                   En cours...
// //                 </>
// //               ) : (
// //                 <>
// //                   <Check className="h-5 w-5 mr-2" />
// //                   Finaliser Vente
// //                 </>
// //               )}
// //             </button>
            
// //             {cart.length > 0 && (!phoneNumber || !clientName) && (
// //               <p className="text-sm text-red-600 mt-3 text-center">
// //                 Veuillez compléter les informations client
// //               </p>
// //             )}
            
// //             <div className="mt-4 text-center">
// //               <button
// //                 onClick={() => router.push('/ventes')}
// //                 className="text-sm text-gray-500 hover:text-gray-700"
// //               >
// //                 Annuler et retourner aux ventes
// //               </button>
// //             </div>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   )
// // }


// 'use client'

// import { useState, useEffect, useRef } from 'react'
// import { useRouter } from 'next/navigation'
// import { supabase } from '@/lib/supabase'
// import { checkAuth } from '@/lib/auth'
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
//   Globe
// } from 'lucide-react'

// export default function NouvelleVentePage() {
//   const router = useRouter()
//   const [currentUser, setCurrentUser] = useState(null)
//   const [loading, setLoading] = useState(false)
  
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
//     vat_amount: 20.00,
//     currency: 'CDF',
//     currency_rate: 1.0,
//     base_currency: 'USD'
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
//       let itemTotalInSaleCurrency = 0
      
//       if (item.product_currency === saleCurrency) {
//         // Même devise : pas de conversion
//         itemTotalInSaleCurrency = item.total_price
//       } else if (item.product_currency === 'USD' && saleCurrency === 'CDF') {
//         // USD vers CDF : multiplication
//         itemTotalInSaleCurrency = item.total_price * saleConfig.currency_rate
//       } else if (item.product_currency === 'CDF' && saleCurrency === 'USD') {
//         // CDF vers USD : division
//         itemTotalInSaleCurrency = item.total_price / saleConfig.currency_rate
//       }
      
//       subTotalInSaleCurrency += itemTotalInSaleCurrency
//     })
    
//     const vat = (subTotalInSaleCurrency * saleConfig.vat_amount) / 100
//     const totalAmount = subTotalInSaleCurrency + vat
    
//     setSubTotal(subTotalInSaleCurrency)
//     setVatAmount(vat)
//     setTotal(totalAmount)
//   }, [cart, saleCurrency, saleConfig])

//   const loadSaleConfig = async () => {
//     const { data } = await supabase
//       .from('sale_config')
//       .select('*')
//       .order('created_at', { ascending: false })
//       .limit(1)
//       .single()
    
//     if (data) {
//       setSaleConfig(data)
//       setSaleCurrency(data.currency) // Utiliser la devise par défaut du config
//     }
//   }

//   const loadProducts = async () => {
//     const { data } = await supabase
//       .from('products')
//       .select(`
//         *,
//         stock:stock(quantity)
//       `)
//       .eq('is_active', true)
//       .gt('stock.quantity', 0)
    
//     if (data) setProducts(data)
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
//         alert('Stock insuffisant')
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
//         alert('Stock insuffisant')
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
//         product_currency: product.currency || 'CDF'
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
//       alert('Stock insuffisant')
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

//   const formatCurrency = (amount) => {
//     return new Intl.NumberFormat('fr-FR', {
//       style: 'currency',
//       currency: saleCurrency,
//       minimumFractionDigits: saleCurrency === 'CDF' ? 0 : 2,
//       maximumFractionDigits: saleCurrency === 'CDF' ? 0 : 2
//     }).format(amount || 0)
//   }

//   const getCurrencySymbol = (currency) => {
//     return currency === 'USD' ? '$' : 'FC'
//   }

//   const handleCompleteSale = async () => {
//     if (cart.length === 0) {
//       alert('Le panier est vide')
//       return
//     }

//     if (!phoneNumber) {
//       alert('Veuillez entrer un numéro de téléphone')
//       return
//     }

//     if (!clientName) {
//       alert('Veuillez entrer le nom du client')
//       return
//     }

//     setLoading(true)

//     try {
//       // 1. Créer ou récupérer client
//       let clientId = selectedClient?.id
      
//       if (!clientId) {
//         const { data: existingClient } = await supabase
//           .from('client')
//           .select('id')
//           .eq('phone', phoneNumber)
//           .single()

//         if (existingClient) {
//           clientId = existingClient.id
//         } else {
//           const clientNumber = `CLI-${Date.now().toString().slice(-6)}`
//           const { data: newClient, error } = await supabase
//             .from('client')
//             .insert({
//               client_number: clientNumber,
//               name: clientName,
//               phone: phoneNumber
//             })
//             .select()
//             .single()

//           if (error) throw error
//           clientId = newClient.id
//         }
//       }

//       // Calculer les totaux finaux pour la vente
//       let finalSubtotal = 0
//       let finalTotal = 0
      
//       // Convertir tous les prix vers CDF pour l'enregistrement
//       cart.forEach(item => {
//         let itemTotalInCDF = item.total_price
        
//         if (item.product_currency === 'USD') {
//           // Convertir USD vers CDF
//           itemTotalInCDF = item.total_price * saleConfig.currency_rate
//         }
        
//         finalSubtotal += itemTotalInCDF
//       })
      
//       const finalVat = (finalSubtotal * saleConfig.vat_amount) / 100
//       finalTotal = finalSubtotal + finalVat

//       // 2. Créer la vente (toujours enregistrer en CDF)
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
//           discount: 0
//         })
//         .select()
//         .single()

//       if (saleError) throw saleError

//       // 3. Ajouter items (toujours enregistrer les prix en CDF)
//       const saleItems = cart.map(item => {
//         // Convertir chaque item vers CDF pour l'enregistrement
//         let unitPriceInCDF = item.unit_price
//         let totalPriceInCDF = item.total_price
        
//         if (item.product_currency === 'USD') {
//           unitPriceInCDF = item.unit_price * saleConfig.currency_rate
//           totalPriceInCDF = item.total_price * saleConfig.currency_rate
//         }
        
//         return {
//           sale_id: sale.id,
//           product_id: item.product_id,
//           quantity: item.quantity,
//           unit_price: unitPriceInCDF,
//           total_price: totalPriceInCDF
//         }
//       })

//       const { error: itemsError } = await supabase
//         .from('sale_item')
//         .insert(saleItems)

//       if (itemsError) throw itemsError

//       // 4. Mettre à jour stocks
//       for (const item of cart) {
//         await supabase
//           .from('stock')
//           .update({ quantity: item.stock - item.quantity })
//           .eq('product_id', item.product_id)
//       }

//       alert('Vente enregistrée!')
//       router.push(`/ventes/${sale.id}`)

//     } catch (error) {
//       console.error('Erreur:', error)
//       alert('Erreur: ' + error.message)
//     } finally {
//       setLoading(false)
//     }
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
//             Retour
//           </button>
          
//           <div className="text-center">
//             <h1 className="text-2xl font-bold text-gray-900">Nouvelle Vente</h1>
//             <p className="text-gray-600">Vendeur: {currentUser.full_name}</p>
//           </div>
          
//           <div className="w-20"></div> {/* Espaceur */}
//         </div>

//         {/* Conteneur principal avec 3 sections horizontales */}
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          
//           {/* SECTION 1: Recherche + Client + Paiement */}
//           <div className="bg-white rounded-lg border border-gray-200 p-4">
//             {/* Sélection Devise */}
//             <div className="mb-6">
//               <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
//                 <Globe className="w-5 h-5 mr-2 text-blue-600" />
//                 Devise de Vente
//               </h2>
              
//               <div className="grid grid-cols-2 gap-3">
//                 <button
//                   onClick={() => setSaleCurrency('CDF')}
//                   className={`p-3 rounded-lg border-2 flex flex-col items-center ${
//                     saleCurrency === 'CDF'
//                       ? 'border-blue-500 bg-blue-50'
//                       : 'border-gray-200'
//                   }`}
//                 >
//                   <div className="text-lg font-bold mb-1">FC</div>
//                   <span>Franc Congolais</span>
//                 </button>
                
//                 <button
//                   onClick={() => setSaleCurrency('USD')}
//                   className={`p-3 rounded-lg border-2 flex flex-col items-center ${
//                     saleCurrency === 'USD'
//                       ? 'border-blue-500 bg-blue-50'
//                       : 'border-gray-200'
//                   }`}
//                 >
//                   <div className="text-lg font-bold mb-1">$</div>
//                   <span>Dollar US</span>
//                 </button>
//               </div>
              
//               <div className="mt-3 text-sm text-gray-600">
//                 <p>Taux de change: 1 USD = {saleConfig.currency_rate} CDF</p>
//                 <p>TVA: {saleConfig.vat_amount}%</p>
//               </div>
//             </div>

//             {/* Recherche Produit */}
//             <div className="mb-6">
//               <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
//                 <Search className="w-5 h-5 mr-2 text-blue-600" />
//                 Rechercher Produit
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
//                   placeholder="Nom ou SKU du produit..."
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                 />
                
//                 {showProductSuggestions && filteredProducts.length > 0 && (
//                   <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
//                     {filteredProducts.map(product => (
//                       <div
//                         key={product.id}
//                         onClick={() => addToCart(product)}
//                         className="flex items-center p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100"
//                       >
//                         <div className="flex-shrink-0 h-10 w-10 mr-3">
//                           {product.image_url ? (
//                             <img
//                               src={product.image_url}
//                               alt={product.name}
//                               className="h-10 w-10 rounded object-cover"
//                             />
//                           ) : (
//                             <div className="h-10 w-10 rounded bg-gray-100 flex items-center justify-center">
//                               <Package className="h-5 w-5 text-gray-400" />
//                             </div>
//                           )}
//                         </div>
//                         <div className="flex-1">
//                           <div className="font-medium text-gray-900">
//                             {product.name}
//                           </div>
//                           <div className="text-sm text-gray-500">
//                             SKU: {product.sku} • Stock: {product.stock?.[0]?.quantity || 0}
//                           </div>
//                         </div>
//                         <div className="text-right">
//                           <div className="font-semibold">
//                             {getCurrencySymbol(product.currency || 'CDF')} {product.retail_price.toLocaleString()}
//                           </div>
//                           <div className="text-xs text-gray-500">
//                             {product.currency || 'CDF'}
//                           </div>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* Informations Client */}
//             <div className="mb-6">
//               <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
//                 <User className="w-5 h-5 mr-2 text-blue-600" />
//                 Informations Client
//               </h2>
              
//               <div className="space-y-4">
//                 {/* Téléphone */}
//                 <div className="relative" ref={clientRef}>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Téléphone *
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
//                       placeholder="Numéro du client"
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
//                     Nom complet *
//                   </label>
//                   <div className="flex">
//                     <div className="flex-shrink-0 flex items-center px-3 border border-r-0 border-gray-300 rounded-l-lg bg-gray-50">
//                       <User className="h-5 w-5 text-gray-400" />
//                     </div>
//                     <input
//                       type="text"
//                       value={clientName}
//                       onChange={(e) => setClientName(e.target.value)}
//                       placeholder="Nom du client"
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
//                 Mode de Paiement
//               </h2>
              
//               <div className="grid grid-cols-3 gap-3">
//                 <button
//                   onClick={() => setPaymentMethod('cash')}
//                   className={`p-3 rounded-lg border-2 flex flex-col items-center ${
//                     paymentMethod === 'cash'
//                       ? 'border-blue-500 bg-blue-50'
//                       : 'border-gray-200'
//                   }`}
//                 >
//                   <Wallet className="h-6 w-6 mb-2 text-gray-600" />
//                   <span>Espèces</span>
//                 </button>
                
//                 <button
//                   onClick={() => setPaymentMethod('card')}
//                   className={`p-3 rounded-lg border-2 flex flex-col items-center ${
//                     paymentMethod === 'card'
//                       ? 'border-blue-500 bg-blue-50'
//                       : 'border-gray-200'
//                   }`}
//                 >
//                   <CreditCard className="h-6 w-6 mb-2 text-gray-600" />
//                   <span>Carte</span>
//                 </button>
                
//                 <button
//                   onClick={() => setPaymentMethod('mobile')}
//                   className={`p-3 rounded-lg border-2 flex flex-col items-center ${
//                     paymentMethod === 'mobile'
//                       ? 'border-blue-500 bg-blue-50'
//                       : 'border-gray-200'
//                   }`}
//                 >
//                   <Smartphone className="h-6 w-6 mb-2 text-gray-600" />
//                   <span>Mobile</span>
//                 </button>
//               </div>
//             </div>
//           </div>

//           {/* SECTION 2: Panier */}
//           <div className="bg-white rounded-lg border border-gray-200 p-4">
//             <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
//               <ShoppingCart className="w-5 h-5 mr-2 text-blue-600" />
//               Panier ({cart.length})
//             </h2>
            
//             {cart.length === 0 ? (
//               <div className="text-center py-8">
//                 <ShoppingCart className="h-12 w-12 text-gray-300 mx-auto mb-3" />
//                 <p className="text-gray-500">Panier vide</p>
//                 <p className="text-sm text-gray-400 mt-1">Recherchez des produits pour les ajouter</p>
//               </div>
//             ) : (
//               <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
//                 {cart.map((item) => {
//                   // Calculer le prix affiché selon la devise de vente
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
//                             <div className="text-xs text-gray-500">{item.sku}</div>
//                             <div className="text-xs text-gray-500">
//                               Stock: {item.stock} • Devise: {item.product_currency}
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
                      
//                       <div className="flex items-center justify-between">
//                         <div className="flex items-center space-x-3">
//                           <button
//                             onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
//                             className="p-1 hover:bg-gray-100 rounded"
//                           >
//                             <Minus className="h-3 w-3" />
//                           </button>
//                           <span className="font-medium min-w-[30px] text-center">{item.quantity}</span>
//                           <button
//                             onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
//                             className="p-1 hover:bg-gray-100 rounded"
//                           >
//                             <Plus className="h-3 w-3" />
//                           </button>
//                         </div>
//                         <div className="text-right">
//                           <div className="text-sm text-gray-500">
//                             {getCurrencySymbol(saleCurrency)} {displayUnitPrice.toLocaleString('fr-FR', { minimumFractionDigits: 0 })} × {item.quantity}
//                           </div>
//                           <div className="font-semibold">
//                             {getCurrencySymbol(saleCurrency)} {displayTotalPrice.toLocaleString('fr-FR', { minimumFractionDigits: 0 })}
//                           </div>
//                           {item.product_currency !== saleCurrency && (
//                             <div className="text-xs text-gray-400">
//                               ({getCurrencySymbol(item.product_currency)} {item.total_price.toLocaleString('fr-FR', { minimumFractionDigits: 0 })})
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
//             <h2 className="text-lg font-semibold text-gray-900 mb-4">Récapitulatif</h2>
            
//             <div className="space-y-4 mb-6">
//               <div className="flex justify-between py-2 border-b">
//                 <span className="text-gray-600">Devise de vente:</span>
//                 <span className="font-medium">
//                   {saleCurrency === 'CDF' ? 'Franc Congolais (CDF)' : 'Dollar US (USD)'}
//                 </span>
//               </div>
//               <div className="flex justify-between py-2 border-b">
//                 <span className="text-gray-600">Sous-total:</span>
//                 <span className="font-medium">{formatCurrency(subTotal)}</span>
//               </div>
//               <div className="flex justify-between py-2 border-b">
//                 <span className="text-gray-600">TVA ({saleConfig.vat_amount}%):</span>
//                 <span className="font-medium">{formatCurrency(vatAmount)}</span>
//               </div>
//               <div className="flex justify-between py-2 border-b">
//                 <span className="text-gray-600">Mode de paiement:</span>
//                 <span className="font-medium capitalize">{paymentMethod}</span>
//               </div>
//               <div className="pt-2">
//                 <div className="flex justify-between font-bold text-lg">
//                   <span>Total à payer:</span>
//                   <span className="text-blue-600">{formatCurrency(total)}</span>
//                 </div>
//               </div>
//             </div>
            
//             <div className="bg-gray-50 p-3 rounded-lg mb-6">
//               <div className="flex justify-between text-sm mb-1">
//                 <span className="text-gray-600">Articles dans le panier:</span>
//                 <span className="font-medium">{cart.reduce((sum, item) => sum + item.quantity, 0)}</span>
//               </div>
//               <div className="flex justify-between text-sm">
//                 <span className="text-gray-600">Produits différents:</span>
//                 <span className="font-medium">{cart.length}</span>
//               </div>
//               <div className="flex justify-between text-sm mt-1">
//                 <span className="text-gray-600">Taux de change:</span>
//                 <span className="font-medium">1 USD = {saleConfig.currency_rate} CDF</span>
//               </div>
//             </div>
            
//             <button
//               onClick={handleCompleteSale}
//               disabled={loading || cart.length === 0 || !phoneNumber || !clientName}
//               className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
//             >
//               {loading ? (
//                 <>
//                   <Loader2 className="h-5 w-5 mr-2 animate-spin" />
//                   En cours...
//                 </>
//               ) : (
//                 <>
//                   <Check className="h-5 w-5 mr-2" />
//                   Finaliser Vente
//                 </>
//               )}
//             </button>
            
//             {cart.length > 0 && (!phoneNumber || !clientName) && (
//               <p className="text-sm text-red-600 mt-3 text-center">
//                 Veuillez compléter les informations client
//               </p>
//             )}
            
//             <div className="mt-4 text-center">
//               <button
//                 onClick={() => router.push('/ventes')}
//                 className="text-sm text-gray-500 hover:text-gray-700"
//               >
//                 Annuler et retourner aux ventes
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }
'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { checkAuth } from '@/lib/auth'
import { 
  Search, 
  X, 
  Plus, 
  Minus, 
  Trash2,
  ShoppingCart,
  Package,
  CreditCard,
  Smartphone,
  Wallet,
  User,
  Phone,
  Check,
  ArrowLeft,
  Loader2,
  Globe,
  AlertCircle
} from 'lucide-react'

export default function NouvelleVentePage() {
  const router = useRouter()
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  // SECTION 1: Recherche produit
  const [searchQuery, setSearchQuery] = useState('')
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [showProductSuggestions, setShowProductSuggestions] = useState(false)
  const productRef = useRef(null)
  
  // SECTION 1: Gestion client
  const [phoneNumber, setPhoneNumber] = useState('')
  const [clientName, setClientName] = useState('')
  const [existingClients, setExistingClients] = useState([])
  const [showClientSuggestions, setShowClientSuggestions] = useState(false)
  const [selectedClient, setSelectedClient] = useState(null)
  const clientRef = useRef(null)
  
  // SECTION 1: Méthode de paiement
  const [paymentMethod, setPaymentMethod] = useState('cash')
  
  // SECTION 2: Panier
  const [cart, setCart] = useState([])
  
  // SECTION 3: Totaux et configurations
  const [subTotal, setSubTotal] = useState(0)
  const [vatAmount, setVatAmount] = useState(0)
  const [total, setTotal] = useState(0)
  const [saleCurrency, setSaleCurrency] = useState('CDF')
  const [saleConfig, setSaleConfig] = useState({
    id: null,
    vat_amount: 20.00,
    currency: 'CDF',
    currency_rate: 1.0,
    base_currency: 'USD',
    created_at: null,
    updated_at: null
  })

  // Fermer les suggestions en cliquant à l'extérieur
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (productRef.current && !productRef.current.contains(event.target)) {
        setShowProductSuggestions(false)
      }
      if (clientRef.current && !clientRef.current.contains(event.target)) {
        setShowClientSuggestions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Initialisation
  useEffect(() => {
    const user = checkAuth()
    if (!user) {
      router.push('/auth/login')
      return
    }
    setCurrentUser(user)
    loadSaleConfig()
    loadProducts()
  }, [])

  // Recherche clients par téléphone
  useEffect(() => {
    const searchClients = async () => {
      if (phoneNumber.length >= 2) {
        const { data } = await supabase
          .from('client')
          .select('*')
          .ilike('phone', `%${phoneNumber}%`)
          .limit(5)
        if (data) setExistingClients(data)
      } else {
        setExistingClients([])
      }
    }

    const timer = setTimeout(() => {
      if (phoneNumber) searchClients()
    }, 300)

    return () => clearTimeout(timer)
  }, [phoneNumber])

  // Filtrer produits
  useEffect(() => {
    if (!searchQuery) {
      setFilteredProducts([])
      return
    }

    const query = searchQuery.toLowerCase()
    const filtered = products
      .filter(product => 
        product.name.toLowerCase().includes(query) ||
        product.sku.toLowerCase().includes(query)
      )
      .slice(0, 5)
    
    setFilteredProducts(filtered)
  }, [searchQuery, products])

  // Calculer les totaux avec conversion
  useEffect(() => {
    let subTotalInSaleCurrency = 0
    
    cart.forEach(item => {
      // Convertir le prix total vers la devise de vente
      const itemTotalInSaleCurrency = convertPrice(item.total_price, item.product_currency, saleCurrency)
      subTotalInSaleCurrency += itemTotalInSaleCurrency
    })
    
    const vat = (subTotalInSaleCurrency * saleConfig.vat_amount) / 100
    const totalAmount = subTotalInSaleCurrency + vat
    
    setSubTotal(subTotalInSaleCurrency)
    setVatAmount(vat)
    setTotal(totalAmount)
  }, [cart, saleCurrency, saleConfig])

  const loadSaleConfig = async () => {
    try {
      const { data, error } = await supabase
        .from('sale_config')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .single()
      
      if (error) throw error
      
      if (data) {
        setSaleConfig(data)
        setSaleCurrency(data.currency || 'CDF')
      }
    } catch (error) {
      console.error('Erreur chargement config:', error)
      setError('Erreur lors du chargement de la configuration')
    }
  }

  const loadProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          stock:stock(quantity)
        `)
        .eq('is_active', true)
        .gt('stock.quantity', 0)
      
      if (error) throw error
      if (data) setProducts(data)
    } catch (error) {
      console.error('Erreur chargement produits:', error)
      setError('Erreur lors du chargement des produits')
    }
  }

  const convertPrice = (price, fromCurrency, toCurrency) => {
    if (fromCurrency === toCurrency) return price
    
    if (fromCurrency === 'USD' && toCurrency === 'CDF') {
      return price * saleConfig.currency_rate
    }
    
    if (fromCurrency === 'CDF' && toCurrency === 'USD') {
      return price / saleConfig.currency_rate
    }
    
    return price
  }

  const addToCart = (product) => {
    const existingItem = cart.find(item => item.product_id === product.id)
    const stock = product.stock?.[0]?.quantity || 0
    
    if (existingItem) {
      if (existingItem.quantity >= stock) {
        alert('Stock insuffisant')
        return
      }
      
      setCart(cart.map(item =>
        item.product_id === product.id
          ? { 
              ...item, 
              quantity: item.quantity + 1,
              total_price: (item.quantity + 1) * item.unit_price
            }
          : item
      ))
    } else {
      if (stock < 1) {
        alert('Stock insuffisant')
        return
      }
      
      const cartItem = {
        product_id: product.id,
        product_name: product.name,
        sku: product.sku,
        image_url: product.image_url,
        quantity: 1,
        unit_price: product.retail_price,
        total_price: product.retail_price,
        unit_type: product.unit_type,
        stock: stock,
        product_currency: product.currency || 'CDF',
        product_retail_price: product.retail_price
      }
      setCart([...cart, cartItem])
    }
    
    setSearchQuery('')
    setShowProductSuggestions(false)
  }

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(productId)
      return
    }

    const item = cart.find(item => item.product_id === productId)
    if (item && newQuantity > item.stock) {
      alert('Stock insuffisant')
      return
    }

    setCart(cart.map(item =>
      item.product_id === productId
        ? { 
            ...item, 
            quantity: newQuantity,
            total_price: newQuantity * item.unit_price
          }
        : item
    ))
  }

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.product_id !== productId))
  }

  const selectClient = (client) => {
    setSelectedClient(client)
    setPhoneNumber(client.phone)
    setClientName(client.name)
    setShowClientSuggestions(false)
  }

  const formatCurrency = (amount, currency = saleCurrency) => {
    const formatted = new Intl.NumberFormat('fr-FR', {
      minimumFractionDigits: currency === 'CDF' ? 0 : 2,
      maximumFractionDigits: currency === 'CDF' ? 0 : 2
    }).format(amount || 0)
    
    return `${getCurrencySymbol(currency)} ${formatted}`
  }

  const getCurrencySymbol = (currency) => {
    return currency === 'USD' ? '$' : 'FC'
  }

  const getCurrencyName = (currency) => {
    return currency === 'USD' ? 'Dollar US' : 'Franc Congolais'
  }

  const handleCompleteSale = async () => {
    if (cart.length === 0) {
      setError('Le panier est vide')
      return
    }

    if (!phoneNumber) {
      setError('Veuillez entrer un numéro de téléphone')
      return
    }

    if (!clientName) {
      setError('Veuillez entrer le nom du client')
      return
    }

    setLoading(true)
    setError('')

    try {
      // 1. Créer ou récupérer client
      let clientId = selectedClient?.id
      
      if (!clientId) {
        const { data: existingClient, error: clientError } = await supabase
          .from('client')
          .select('id')
          .eq('phone', phoneNumber)
          .single()

        if (clientError && clientError.code !== 'PGRST116') {
          throw clientError
        }

        if (existingClient) {
          clientId = existingClient.id
        } else {
          const clientNumber = `CLI-${Date.now().toString().slice(-6)}`
          const { data: newClient, error: createError } = await supabase
            .from('client')
            .insert({
              client_number: clientNumber,
              name: clientName,
              phone: phoneNumber
            })
            .select()
            .single()

          if (createError) throw createError
          clientId = newClient.id
        }
      }

      // Calculer les totaux finaux pour la vente dans la devise de vente
      let finalSubtotal = 0
      
      // Convertir tous les prix vers la devise de vente
      cart.forEach(item => {
        const itemTotalInSaleCurrency = convertPrice(item.total_price, item.product_currency, saleCurrency)
        finalSubtotal += itemTotalInSaleCurrency
      })
      
      const finalVat = (finalSubtotal * saleConfig.vat_amount) / 100
      const finalTotal = finalSubtotal + finalVat

      // 2. Créer la vente
      const { data: sale, error: saleError } = await supabase
        .from('sale')
        .insert({
          customer_id: clientId,
          user_id: currentUser.id,
          status: 'completed',
          payment_status: 'paid',
          vat_amount: finalVat,
          subtotal: finalSubtotal,
          total: finalTotal,
          payment_method: paymentMethod,
          discount: 0,
          currency: saleCurrency
        })
        .select()
        .single()

      if (saleError) throw saleError

      // 3. Ajouter items de vente AVEC original_currency
      const saleItems = cart.map(item => {
        // Convertir les prix vers la devise de vente pour l'enregistrement
        const unitPriceInSaleCurrency = convertPrice(item.unit_price, item.product_currency, saleCurrency)
        const totalPriceInSaleCurrency = convertPrice(item.total_price, item.product_currency, saleCurrency)
        
        return {
          sale_id: sale.id,
          product_id: item.product_id,
          quantity: item.quantity,
          unit_price: unitPriceInSaleCurrency,
          total_price: totalPriceInSaleCurrency,
          original_currency: item.product_currency // Enregistrer la devise originale
        }
      })

      const { error: itemsError } = await supabase
        .from('sale_item')
        .insert(saleItems)

      if (itemsError) throw itemsError

      // 4. Mettre à jour stocks
      for (const item of cart) {
        const { error: stockError } = await supabase
          .from('stock')
          .update({ 
            quantity: item.stock - item.quantity,
            updated_at: new Date().toISOString()
          })
          .eq('product_id', item.product_id)

        if (stockError) throw stockError
      }

      // 5. Rediriger vers le ticket de vente
      router.push(`/ventes/${sale.id}`)

    } catch (error) {
      console.error('Erreur lors de la vente:', error)
      setError('Erreur lors de la création de la vente: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const clearCart = () => {
    setCart([])
    setSubTotal(0)
    setVatAmount(0)
    setTotal(0)
  }

  if (!currentUser) return null

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={() => router.push('/ventes')}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Retour
          </button>
          
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">Nouvelle Vente</h1>
            <p className="text-gray-600">Vendeur: {currentUser.full_name}</p>
          </div>
          
          <div className="w-20"></div>
        </div>

        {/* Message d'erreur */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
              <span className="text-red-700">{error}</span>
            </div>
          </div>
        )}

        {/* Conteneur principal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          
          {/* SECTION 1: Devise + Recherche + Client + Paiement */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            {/* Sélection Devise */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Globe className="w-5 h-5 mr-2 text-blue-600" />
                Devise de Vente
              </h2>
              
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setSaleCurrency('CDF')}
                  className={`p-3 rounded-lg border-2 flex flex-col items-center ${
                    saleCurrency === 'CDF'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-lg font-bold mb-1">FC</div>
                  <span>Franc Congolais</span>
                  {saleCurrency === 'CDF' && (
                    <div className="mt-2 text-xs text-blue-600">
                      <Check className="h-4 w-4 inline" /> Sélectionné
                    </div>
                  )}
                </button>
                
                <button
                  onClick={() => setSaleCurrency('USD')}
                  className={`p-3 rounded-lg border-2 flex flex-col items-center ${
                    saleCurrency === 'USD'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-lg font-bold mb-1">$</div>
                  <span>Dollar US</span>
                  {saleCurrency === 'USD' && (
                    <div className="mt-2 text-xs text-blue-600">
                      <Check className="h-4 w-4 inline" /> Sélectionné
                    </div>
                  )}
                </button>
              </div>
              
              <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="text-gray-600">Taux actuel:</div>
                  <div className="font-medium">1 USD = {saleConfig.currency_rate?.toLocaleString('fr-FR') || '1.000'} CDF</div>
                  <div className="text-gray-600">TVA appliquée:</div>
                  <div className="font-medium">{saleConfig.vat_amount || 20}%</div>
                  <div className="text-gray-600">Devise par défaut:</div>
                  <div className="font-medium">{saleConfig.currency || 'CDF'}</div>
                </div>
              </div>
            </div>

            {/* Recherche Produit */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Search className="w-5 h-5 mr-2 text-blue-600" />
                Rechercher Produit
              </h2>
              
              <div className="relative" ref={productRef}>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value)
                    setShowProductSuggestions(true)
                  }}
                  onFocus={() => setShowProductSuggestions(true)}
                  placeholder="Nom ou SKU du produit..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                
                {showProductSuggestions && filteredProducts.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-80 overflow-y-auto">
                    {filteredProducts.map(product => {
                      const displayPrice = convertPrice(product.retail_price, product.currency || 'CDF', saleCurrency)
                      
                      return (
                        <div
                          key={product.id}
                          onClick={() => addToCart(product)}
                          className="flex items-center p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100"
                        >
                          <div className="flex-shrink-0 h-10 w-10 mr-3">
                            {product.image_url ? (
                              <img
                                src={product.image_url}
                                alt={product.name}
                                className="h-10 w-10 rounded object-cover"
                              />
                            ) : (
                              <div className="h-10 w-10 rounded bg-gray-100 flex items-center justify-center">
                                <Package className="h-5 w-5 text-gray-400" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-gray-900 truncate">
                              {product.name}
                            </div>
                            <div className="text-xs text-gray-500">
                              SKU: {product.sku} • Stock: {product.stock?.[0]?.quantity || 0}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              Devise: {getCurrencyName(product.currency || 'CDF')}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold">
                              {formatCurrency(displayPrice, saleCurrency)}
                            </div>
                            <div className="text-xs text-gray-500">
                              Original: {formatCurrency(product.retail_price, product.currency || 'CDF')}
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Informations Client */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <User className="w-5 h-5 mr-2 text-blue-600" />
                Informations Client
              </h2>
              
              <div className="space-y-4">
                {/* Téléphone */}
                <div className="relative" ref={clientRef}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Téléphone *
                  </label>
                  <div className="flex">
                    <div className="flex-shrink-0 flex items-center px-3 border border-r-0 border-gray-300 rounded-l-lg bg-gray-50">
                      <Phone className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => {
                        setPhoneNumber(e.target.value)
                        setSelectedClient(null)
                      }}
                      onFocus={() => setShowClientSuggestions(true)}
                      placeholder="Numéro du client"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  {showClientSuggestions && existingClients.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
                      {existingClients.map(client => (
                        <div
                          key={client.id}
                          onClick={() => selectClient(client)}
                          className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100"
                        >
                          <div className="font-medium">{client.name}</div>
                          <div className="text-sm text-gray-500">{client.phone}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Nom */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nom complet *
                  </label>
                  <div className="flex">
                    <div className="flex-shrink-0 flex items-center px-3 border border-r-0 border-gray-300 rounded-l-lg bg-gray-50">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      placeholder="Nom du client"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* Client sélectionné */}
                {selectedClient && (
                  <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-green-900">
                          {selectedClient.name}
                        </div>
                        <div className="text-sm text-green-700">
                          {selectedClient.phone}
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setSelectedClient(null)
                          setPhoneNumber('')
                          setClientName('')
                        }}
                        className="p-1 text-green-600 hover:text-green-800"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Mode de Paiement */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <CreditCard className="w-5 h-5 mr-2 text-blue-600" />
                Mode de Paiement
              </h2>
              
              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={() => setPaymentMethod('cash')}
                  className={`p-3 rounded-lg border-2 flex flex-col items-center ${
                    paymentMethod === 'cash'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Wallet className="h-6 w-6 mb-2 text-gray-600" />
                  <span>Espèces</span>
                  {paymentMethod === 'cash' && (
                    <Check className="h-4 w-4 mt-1 text-blue-500" />
                  )}
                </button>
                
                <button
                  onClick={() => setPaymentMethod('card')}
                  className={`p-3 rounded-lg border-2 flex flex-col items-center ${
                    paymentMethod === 'card'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <CreditCard className="h-6 w-6 mb-2 text-gray-600" />
                  <span>Carte</span>
                  {paymentMethod === 'card' && (
                    <Check className="h-4 w-4 mt-1 text-blue-500" />
                  )}
                </button>
                
                <button
                  onClick={() => setPaymentMethod('mobile')}
                  className={`p-3 rounded-lg border-2 flex flex-col items-center ${
                    paymentMethod === 'mobile'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Smartphone className="h-6 w-6 mb-2 text-gray-600" />
                  <span>Mobile</span>
                  {paymentMethod === 'mobile' && (
                    <Check className="h-4 w-4 mt-1 text-blue-500" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* SECTION 2: Panier */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <ShoppingCart className="w-5 h-5 mr-2 text-blue-600" />
                Panier ({cart.length})
              </h2>
              
              {cart.length > 0 && (
                <button
                  onClick={clearCart}
                  className="text-sm text-red-600 hover:text-red-800 flex items-center"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Vider le panier
                </button>
              )}
            </div>
            
            {cart.length === 0 ? (
              <div className="text-center py-8">
                <ShoppingCart className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">Panier vide</p>
                <p className="text-sm text-gray-400 mt-1">Recherchez des produits pour les ajouter</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                {cart.map((item) => {
                  const displayUnitPrice = convertPrice(item.unit_price, item.product_currency, saleCurrency)
                  const displayTotalPrice = convertPrice(item.total_price, item.product_currency, saleCurrency)
                  
                  return (
                    <div key={item.product_id} className="p-3 border border-gray-200 rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-start">
                          {item.image_url ? (
                            <img
                              src={item.image_url}
                              alt={item.product_name}
                              className="h-10 w-10 rounded object-cover mr-3"
                            />
                          ) : (
                            <div className="h-10 w-10 rounded bg-gray-100 flex items-center justify-center mr-3">
                              <Package className="h-5 w-5 text-gray-400" />
                            </div>
                          )}
                          <div>
                            <div className="font-medium">{item.product_name}</div>
                            <div className="text-xs text-gray-500">{item.sku}</div>
                            <div className="text-xs text-gray-500">
                              Stock: {item.stock} • Devise: {item.product_currency}
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.product_id)}
                          className="p-1 text-gray-400 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                            className="p-1 hover:bg-gray-100 rounded border border-gray-300"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="font-medium min-w-[30px] text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                            className="p-1 hover:bg-gray-100 rounded border border-gray-300"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-500">
                            {formatCurrency(displayUnitPrice, saleCurrency)} × {item.quantity}
                          </div>
                          <div className="font-semibold">
                            {formatCurrency(displayTotalPrice, saleCurrency)}
                          </div>
                          {item.product_currency !== saleCurrency && (
                            <div className="text-xs text-gray-400">
                              ({formatCurrency(item.total_price, item.product_currency)})
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* SECTION 3: Récapitulatif */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Récapitulatif</h2>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Devise de vente:</span>
                <span className="font-medium">
                  {getCurrencyName(saleCurrency)} ({saleCurrency})
                </span>
              </div>
              
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Sous-total:</span>
                <span className="font-medium">{formatCurrency(subTotal)}</span>
              </div>
              
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">TVA ({saleConfig.vat_amount}%):</span>
                <span className="font-medium">{formatCurrency(vatAmount)}</span>
              </div>
              
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Mode de paiement:</span>
                <span className="font-medium capitalize">
                  {paymentMethod === 'cash' ? 'Espèces' : 
                   paymentMethod === 'card' ? 'Carte bancaire' : 
                   'Paiement mobile'}
                </span>
              </div>
              
              <div className="pt-2">
                <div className="flex justify-between font-bold text-lg">
                  <span>Total à payer:</span>
                  <span className="text-blue-600">{formatCurrency(total)}</span>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 p-3 rounded-lg mb-6">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-gray-600">Articles dans le panier:</div>
                <div className="font-medium text-right">{cart.reduce((sum, item) => sum + item.quantity, 0)}</div>
                
                <div className="text-gray-600">Produits différents:</div>
                <div className="font-medium text-right">{cart.length}</div>
                
                <div className="text-gray-600">Devises dans le panier:</div>
                <div className="font-medium text-right">
                  {[...new Set(cart.map(item => item.product_currency))].join(', ')}
                </div>
                
                <div className="text-gray-600">Taux de change:</div>
                <div className="font-medium text-right">
                  1 USD = {saleConfig.currency_rate?.toLocaleString('fr-FR') || '1.000'} CDF
                </div>
              </div>
            </div>
            
            <button
              onClick={handleCompleteSale}
              disabled={loading || cart.length === 0 || !phoneNumber || !clientName}
              className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors mb-3"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  En cours...
                </>
              ) : (
                <>
                  <Check className="h-5 w-5 mr-2" />
                  Finaliser Vente ({formatCurrency(total)})
                </>
              )}
            </button>
            
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => router.push('/ventes')}
                className="py-2 text-gray-600 hover:text-gray-900 text-sm"
              >
                Annuler
              </button>
              
              <button
                onClick={clearCart}
                disabled={cart.length === 0}
                className="py-2 text-red-600 hover:text-red-800 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Vider le panier
              </button>
            </div>
            
            {cart.length > 0 && (!phoneNumber || !clientName) && (
              <p className="text-sm text-red-600 mt-3 text-center">
                Veuillez compléter les informations client
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}