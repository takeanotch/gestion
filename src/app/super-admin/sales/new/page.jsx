
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
//   Loader2
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
  
//   // SECTION 3: Totaux
//   const [subTotal, setSubTotal] = useState(0)
//   const [vatAmount, setVatAmount] = useState(0)
//   const [total, setTotal] = useState(0)
//   const [vatRate, setVatRate] = useState(20)

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
//     loadVatRate()
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

//   // Calculer les totaux
//   useEffect(() => {
//     const sub = cart.reduce((sum, item) => sum + item.total_price, 0)
//     const vat = (sub * vatRate) / 100
//     const totalAmount = sub + vat
    
//     setSubTotal(sub)
//     setVatAmount(vat)
//     setTotal(totalAmount)
//   }, [cart, vatRate])

//   const loadVatRate = async () => {
//     const { data } = await supabase
//       .from('sale_config')
//       .select('vat_amount')
//       .single()
//     if (data) setVatRate(data.vat_amount)
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
//         stock: stock
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
//       currency: 'CDF',
//       minimumFractionDigits: 0
//     }).format(amount || 0)
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

//       // 2. Créer la vente
//       const { data: sale, error: saleError } = await supabase
//         .from('sale')
//         .insert({
//           customer_id: clientId,
//           user_id: currentUser.id,
//           status: 'completed',
//           payment_status: 'paid',
//           vat_amount: vatAmount,
//           subtotal: subTotal,
//           total: total,
//           payment_method: paymentMethod,
//           discount: 0
//         })
//         .select()
//         .single()

//       if (saleError) throw saleError

//       // 3. Ajouter items
//       const saleItems = cart.map(item => ({
//         sale_id: sale.id,
//         product_id: item.product_id,
//         quantity: item.quantity,
//         unit_price: item.unit_price,
//         total_price: item.total_price
//       }))

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

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
//           {/* SECTION 1: Recherche produit + Client + Paiement */}
//           <div className="lg:col-span-2 space-y-4">
//             {/* Section Recherche Produit */}
//             <div className="bg-white rounded-lg border border-gray-200 p-4">
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
//                             {formatCurrency(product.retail_price)}
//                           </div>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* Section Client */}
//             <div className="bg-white rounded-lg border border-gray-200 p-4">
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

//             {/* Section Paiement */}
//             <div className="bg-white rounded-lg border border-gray-200 p-4">
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
//           <div className="space-y-4">
//             <div className="bg-white rounded-lg border border-gray-200 p-4">
//               <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
//                 <ShoppingCart className="w-5 h-5 mr-2 text-blue-600" />
//                 Panier
//               </h2>
              
//               {cart.length === 0 ? (
//                 <div className="text-center py-8">
//                   <ShoppingCart className="h-12 w-12 text-gray-300 mx-auto mb-3" />
//                   <p className="text-gray-500">Panier vide</p>
//                 </div>
//               ) : (
//                 <div className="space-y-3 max-h-[400px] overflow-y-auto">
//                   {cart.map((item) => (
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
//                         <div className="flex items-center space-x-2">
//                           <button
//                             onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
//                             className="p-1 hover:bg-gray-100 rounded"
//                           >
//                             <Minus className="h-3 w-3" />
//                           </button>
//                           <span className="font-medium">{item.quantity}</span>
//                           <button
//                             onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
//                             className="p-1 hover:bg-gray-100 rounded"
//                           >
//                             <Plus className="h-3 w-3" />
//                           </button>
//                         </div>
//                         <div className="font-semibold">
//                           {formatCurrency(item.total_price)}
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>

//             {/* SECTION 3: Totaux */}
//             <div className="bg-white rounded-lg border border-gray-200 p-4">
//               <h2 className="text-lg font-semibold text-gray-900 mb-4">Récapitulatif</h2>
              
//               <div className="space-y-2 mb-4">
//                 <div className="flex justify-between">
//                   <span>Sous-total:</span>
//                   <span className="font-medium">{formatCurrency(subTotal)}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span>TVA ({vatRate}%):</span>
//                   <span className="font-medium">{formatCurrency(vatAmount)}</span>
//                 </div>
//                 <div className="border-t pt-2">
//                   <div className="flex justify-between font-bold text-lg">
//                     <span>Total:</span>
//                     <span className="text-blue-600">{formatCurrency(total)}</span>
//                   </div>
//                 </div>
//               </div>
              
//               <div className="space-y-3">
//                 <div className="flex justify-between text-sm">
//                   <span className="text-gray-600">Articles:</span>
//                   <span>{cart.reduce((sum, item) => sum + item.quantity, 0)}</span>
//                 </div>
//                 <div className="flex justify-between text-sm">
//                   <span className="text-gray-600">Produits:</span>
//                   <span>{cart.length}</span>
//                 </div>
                
//                 <button
//                   onClick={handleCompleteSale}
//                   disabled={loading || cart.length === 0}
//                   className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center"
//                 >
//                   {loading ? (
//                     <>
//                       <Loader2 className="h-5 w-5 mr-2 animate-spin" />
//                       En cours...
//                     </>
//                   ) : (
//                     <>
//                       <Check className="h-5 w-5 mr-2" />
//                       Finaliser Vente
//                     </>
//                   )}
//                 </button>
//               </div>
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
  Loader2
} from 'lucide-react'

export default function NouvelleVentePage() {
  const router = useRouter()
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(false)
  
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
  
  // SECTION 3: Totaux
  const [subTotal, setSubTotal] = useState(0)
  const [vatAmount, setVatAmount] = useState(0)
  const [total, setTotal] = useState(0)
  const [vatRate, setVatRate] = useState(20)

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
    loadVatRate()
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

  // Calculer les totaux
  useEffect(() => {
    const sub = cart.reduce((sum, item) => sum + item.total_price, 0)
    const vat = (sub * vatRate) / 100
    const totalAmount = sub + vat
    
    setSubTotal(sub)
    setVatAmount(vat)
    setTotal(totalAmount)
  }, [cart, vatRate])

  const loadVatRate = async () => {
    const { data } = await supabase
      .from('sale_config')
      .select('vat_amount')
      .single()
    if (data) setVatRate(data.vat_amount)
  }

  const loadProducts = async () => {
    const { data } = await supabase
      .from('products')
      .select(`
        *,
        stock:stock(quantity)
      `)
      .eq('is_active', true)
      .gt('stock.quantity', 0)
    
    if (data) setProducts(data)
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
        stock: stock
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

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'CDF',
      minimumFractionDigits: 0
    }).format(amount || 0)
  }

  const handleCompleteSale = async () => {
    if (cart.length === 0) {
      alert('Le panier est vide')
      return
    }

    if (!phoneNumber) {
      alert('Veuillez entrer un numéro de téléphone')
      return
    }

    if (!clientName) {
      alert('Veuillez entrer le nom du client')
      return
    }

    setLoading(true)

    try {
      // 1. Créer ou récupérer client
      let clientId = selectedClient?.id
      
      if (!clientId) {
        const { data: existingClient } = await supabase
          .from('client')
          .select('id')
          .eq('phone', phoneNumber)
          .single()

        if (existingClient) {
          clientId = existingClient.id
        } else {
          const clientNumber = `CLI-${Date.now().toString().slice(-6)}`
          const { data: newClient, error } = await supabase
            .from('client')
            .insert({
              client_number: clientNumber,
              name: clientName,
              phone: phoneNumber
            })
            .select()
            .single()

          if (error) throw error
          clientId = newClient.id
        }
      }

      // 2. Créer la vente
      const { data: sale, error: saleError } = await supabase
        .from('sale')
        .insert({
          customer_id: clientId,
          user_id: currentUser.id,
          status: 'completed',
          payment_status: 'paid',
          vat_amount: vatAmount,
          subtotal: subTotal,
          total: total,
          payment_method: paymentMethod,
          discount: 0
        })
        .select()
        .single()

      if (saleError) throw saleError

      // 3. Ajouter items
      const saleItems = cart.map(item => ({
        sale_id: sale.id,
        product_id: item.product_id,
        quantity: item.quantity,
        unit_price: item.unit_price,
        total_price: item.total_price
      }))

      const { error: itemsError } = await supabase
        .from('sale_item')
        .insert(saleItems)

      if (itemsError) throw itemsError

      // 4. Mettre à jour stocks
      for (const item of cart) {
        await supabase
          .from('stock')
          .update({ quantity: item.stock - item.quantity })
          .eq('product_id', item.product_id)
      }

      alert('Vente enregistrée!')
      router.push(`/ventes/${sale.id}`)

    } catch (error) {
      console.error('Erreur:', error)
      alert('Erreur: ' + error.message)
    } finally {
      setLoading(false)
    }
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
          
          <div className="w-20"></div> {/* Espaceur */}
        </div>

        {/* Conteneur principal avec 3 sections horizontales */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          
          {/* SECTION 1: Recherche + Client + Paiement */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
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
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
                    {filteredProducts.map(product => (
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
                          <div className="font-medium text-gray-900">
                            {product.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            SKU: {product.sku} • Stock: {product.stock?.[0]?.quantity || 0}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">
                            {formatCurrency(product.retail_price)}
                          </div>
                        </div>
                      </div>
                    ))}
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
                      : 'border-gray-200'
                  }`}
                >
                  <Wallet className="h-6 w-6 mb-2 text-gray-600" />
                  <span>Espèces</span>
                </button>
                
                <button
                  onClick={() => setPaymentMethod('card')}
                  className={`p-3 rounded-lg border-2 flex flex-col items-center ${
                    paymentMethod === 'card'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200'
                  }`}
                >
                  <CreditCard className="h-6 w-6 mb-2 text-gray-600" />
                  <span>Carte</span>
                </button>
                
                <button
                  onClick={() => setPaymentMethod('mobile')}
                  className={`p-3 rounded-lg border-2 flex flex-col items-center ${
                    paymentMethod === 'mobile'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200'
                  }`}
                >
                  <Smartphone className="h-6 w-6 mb-2 text-gray-600" />
                  <span>Mobile</span>
                </button>
              </div>
            </div>
          </div>

          {/* SECTION 2: Panier */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <ShoppingCart className="w-5 h-5 mr-2 text-blue-600" />
              Panier ({cart.length})
            </h2>
            
            {cart.length === 0 ? (
              <div className="text-center py-8">
                <ShoppingCart className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">Panier vide</p>
                <p className="text-sm text-gray-400 mt-1">Recherchez des produits pour les ajouter</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                {cart.map((item) => (
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
                          <div className="text-xs text-gray-500">Stock: {item.stock}</div>
                        </div>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.product_id)}
                        className="p-1 text-gray-400 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                          className="p-1 hover:bg-gray-100 rounded"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="font-medium min-w-[30px] text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                          className="p-1 hover:bg-gray-100 rounded"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-500">
                          {formatCurrency(item.unit_price)} × {item.quantity}
                        </div>
                        <div className="font-semibold">
                          {formatCurrency(item.total_price)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* SECTION 3: Récapitulatif */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Récapitulatif</h2>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Sous-total:</span>
                <span className="font-medium">{formatCurrency(subTotal)}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">TVA ({vatRate}%):</span>
                <span className="font-medium">{formatCurrency(vatAmount)}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Mode de paiement:</span>
                <span className="font-medium capitalize">{paymentMethod}</span>
              </div>
              <div className="pt-2">
                <div className="flex justify-between font-bold text-lg">
                  <span>Total à payer:</span>
                  <span className="text-blue-600">{formatCurrency(total)}</span>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 p-3 rounded-lg mb-6">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Articles dans le panier:</span>
                <span className="font-medium">{cart.reduce((sum, item) => sum + item.quantity, 0)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Produits différents:</span>
                <span className="font-medium">{cart.length}</span>
              </div>
            </div>
            
            <button
              onClick={handleCompleteSale}
              disabled={loading || cart.length === 0 || !phoneNumber || !clientName}
              className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  En cours...
                </>
              ) : (
                <>
                  <Check className="h-5 w-5 mr-2" />
                  Finaliser Vente
                </>
              )}
            </button>
            
            {cart.length > 0 && (!phoneNumber || !clientName) && (
              <p className="text-sm text-red-600 mt-3 text-center">
                Veuillez compléter les informations client
              </p>
            )}
            
            <div className="mt-4 text-center">
              <button
                onClick={() => router.push('/ventes')}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Annuler et retourner aux ventes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}