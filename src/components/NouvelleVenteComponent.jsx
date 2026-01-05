
'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { checkAuth } from '@/lib/auth'
import { useLanguage } from '@/contexts/LanguageContext'
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
  Loader2,
  Globe,
  AlertCircle,
  Printer,
  Download
} from 'lucide-react'
import { useShop } from '@/hooks/useShop'
import jsPDF from 'jspdf'
import { jsPrintManager } from '@/lib/jsprintmanager-singleton'

const PRINTER_STORAGE_KEY = 'selected-printer'

export default function NouvelleVenteComponent({ onSaleCompleted }) {
  const router = useRouter()
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(false)
  const [printing, setPrinting] = useState(false)
  const [printStatus, setPrintStatus] = useState('')
  const [error, setError] = useState('')
  const { t, language } = useLanguage()
  const { shop, loading: shopLoading } = useShop()
  
  const [searchQuery, setSearchQuery] = useState('')
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [showProductSuggestions, setShowProductSuggestions] = useState(false)
  const productRef = useRef(null)
  
  const [phoneNumber, setPhoneNumber] = useState('')
  const [clientName, setClientName] = useState('')
  const [existingClients, setExistingClients] = useState([])
  const [showClientSuggestions, setShowClientSuggestions] = useState(false)
  const [selectedClient, setSelectedClient] = useState(null)
  const clientRef = useRef(null)
  
  const [paymentMethod, setPaymentMethod] = useState('cash')
  const [cart, setCart] = useState([])
  
  const [subTotal, setSubTotal] = useState(0)
  const [vatAmount, setVatAmount] = useState(0)
  const [total, setTotal] = useState(0)
  const [saleCurrency, setSaleCurrency] = useState('CDF')
  const [saleConfig, setSaleConfig] = useState({
    id: null,
    vat_amount: 16.00,
    currency: 'CDF',
    currency_rate: 1.0,
    base_currency: 'USD',
    created_at: null,
    updated_at: null
  })
  
  // États pour la facture
  const [lastSale, setLastSale] = useState(null)
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)
  const [selectedPrinter, setSelectedPrinter] = useState('')
  const [isPrintConnected, setIsPrintConnected] = useState(false)
  const [logoUrl, setLogoUrl] = useState(null)
  const [printers, setPrinters] = useState([])

  // Gestion de l'impression - état de connexion
  const printManagerRef = useRef({
    isInitializing: false,
    hasInitialized: false,
    cleanupListener: null
  })

  useEffect(() => {
    const user = checkAuth()
    if (!user) {
      router.push('/auth/login')
      return
    }
    setCurrentUser(user)
    loadSaleConfig()
    loadProducts()
    
    // Charger l'imprimante sélectionnée
    if (typeof window !== 'undefined') {
      const savedPrinter = localStorage.getItem(PRINTER_STORAGE_KEY)
      if (savedPrinter) {
        setSelectedPrinter(savedPrinter)
      }
    }
  }, [])

  useEffect(() => {
    // Initialiser JSPrintManager
    const initPrintManager = async () => {
      if (printManagerRef.current.isInitializing || printManagerRef.current.hasInitialized) {
        return
      }

      printManagerRef.current.isInitializing = true

      try {
        await jsPrintManager.initialize()
        
        // Ajouter un écouteur pour les changements de statut de connexion
        printManagerRef.current.cleanupListener = jsPrintManager.addStatusListener((connected) => {
          setIsPrintConnected(connected)
          if (connected) {
            fetchPrinters()
          }
        })

        // Vérifier l'état actuel
        const connected = jsPrintManager.isConnected()
        setIsPrintConnected(connected)
        if (connected) {
          fetchPrinters()
        }

        printManagerRef.current.hasInitialized = true
      } catch (error) {
        console.error('Erreur initialisation JSPrintManager:', error)
      } finally {
        printManagerRef.current.isInitializing = false
      }
    }

    initPrintManager()

    // Nettoyage
    return () => {
      if (printManagerRef.current.cleanupListener) {
        printManagerRef.current.cleanupListener()
      }
    }
  }, [])

  const fetchPrinters = async () => {
    if (!jsPrintManager.isConnected()) return

    try {
      const instance = jsPrintManager.getInstance()
      const printerList = await instance.JSPrintManager.getPrinters()
      const printersArray = Array.isArray(printerList) ? printerList : []
      
      setPrinters(printersArray)
      
      // Vérifier si l'imprimante sauvegardée existe toujours
      const saved = localStorage.getItem(PRINTER_STORAGE_KEY)
      if (saved && printersArray.includes(saved) && selectedPrinter !== saved) {
        setSelectedPrinter(saved)
      } else if (printersArray.length > 0 && !selectedPrinter) {
        // Prendre la première imprimante par défaut
        setSelectedPrinter(printersArray[0])
      }
    } catch (error) {
      console.error('Erreur récupération imprimantes:', error)
    }
  }

  useEffect(() => {
    if (shop?.shop_icon) {
      setLogoUrl(shop.shop_icon)
    }
  }, [shop])

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

  useEffect(() => {
    let subTotalInSaleCurrency = 0
    
    cart.forEach(item => {
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
    const formatted = new Intl.NumberFormat(language === 'fr' ? 'fr-FR' : 'en-US', {
      minimumFractionDigits: currency === 'CDF' ? 0 : 2,
      maximumFractionDigits: currency === 'CDF' ? 0 : 2
    }).format(amount || 0)
    
    return `${getCurrencySymbol(currency)} ${formatted}`
  }

  const getCurrencySymbol = (currency) => {
    return currency === 'USD' ? '$' : 'FC'
  }

  const getCurrencyName = (currency) => {
    if (currency === 'USD') {
      return language === 'fr' ? 'Dollar US' : 'US Dollar'
    } else {
      return language === 'fr' ? 'Franc Congolais' : 'Congolese Franc'
    }
  }

  const getPaymentMethodName = (method) => {
    switch (method) {
      case 'cash':
        return language === 'fr' ? 'Espèces' : 'Cash'
      case 'card':
        return language === 'fr' ? 'Carte bancaire' : 'Card'
      case 'mobile':
        return language === 'fr' ? 'Paiement mobile' : 'Mobile Payment'
      default:
        return method
    }
  }

  const formatDateTime = (dateString) => {
    if (!dateString) {
      const now = new Date()
      return now.toLocaleString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }
    
    const date = new Date(dateString)
    return date.toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const loadImageAsBase64 = async (url) => {
    try {
      const response = await fetch(url)
      const blob = await response.blob()
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onloadend = () => resolve(reader.result)
        reader.onerror = reject
        reader.readAsDataURL(blob)
      })
    } catch (error) {
      console.error('Erreur chargement logo:', error)
      return null
    }
  }

  const drawLine = (pdf, y, startX = 5, endX = 75) => {
    pdf.setLineWidth(0.1)
    pdf.line(startX, y, endX, y)
  }

  const formatCurrencyForInvoice = (amount, currency = saleCurrency) => {
    if (!amount) amount = 0
    const formatted = Math.round(amount).toString()
    
    if (currency === 'CDF') {
      return `${formatted} FC`
    }
    
    return `$${formatted}`
  }

  const formatNumber = (num) => {
    return Math.round(num).toString()
  }

  const getPaymentMethodNameForInvoice = (method) => {
    switch (method) {
      case 'cash':
        return 'Espèces'
      case 'card':
        return 'Carte'
      case 'mobile':
        return 'Mobile'
      default:
        return method
    }
  }

  const createPDF = async (invoiceData) => {
    if (!invoiceData) {
      throw new Error('Aucune donnée de vente fournie')
    }

    const saleNumber = invoiceData.sale_number || `FACT-${Date.now()}`
    const saleDate = invoiceData.date_time || new Date().toISOString()
    const clientInfo = invoiceData.clientInfo || {}
    const items = invoiceData.items || []
    const subtotal = invoiceData.subtotal || 0
    const vat = invoiceData.vat_amount || 0
    const vatRate = invoiceData.vat_rate || 16
    const total = invoiceData.total || 0
    const currency = invoiceData.currency || 'CDF'
    const paymentMethod = invoiceData.payment_method || 'cash'

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: [80, 297]
    })

    let yPos = 5
    const lineHeight = 4
    const smallLineHeight = 3.5
    const pageWidth = 80
    
    const leftMargin = 7
    const rightMargin = 5
    
    const colQtyX = leftMargin
    const colProductX = leftMargin + 8
    const colPUX = leftMargin + 35
    const colPTX = pageWidth - rightMargin - 10

    pdf.setFont('helvetica')
    pdf.setFontSize(9)

    if (logoUrl) {
      try {
        const logoData = await loadImageAsBase64(logoUrl)
        if (logoData) {
          pdf.addImage(logoData, 'PNG', 32.5, yPos, 15, 15)
          yPos += 17
        }
      } catch (error) {
        console.error('Erreur chargement logo:', error)
      }
    }

    pdf.setFontSize(10)
    pdf.setFont('helvetica', 'bold')
    pdf.text(shop?.shop_name || 'Boutique', pageWidth / 2, yPos, { align: 'center' })
    yPos += smallLineHeight

    pdf.setFontSize(8)
    pdf.setFont('helvetica', 'normal')

    if (shop?.custom_field_1 && shop.custom_field_1 !== 'Premier text par defaut') {
      pdf.text(shop.custom_field_1, pageWidth / 2, yPos, { align: 'center' })
      yPos += smallLineHeight
    }

    if (shop?.rccm) {
      pdf.text(`RCCM: ${shop.rccm}`, pageWidth / 2, yPos, { align: 'center' })
      yPos += smallLineHeight
    }

    if (shop?.shop_address) {
      let address = shop.shop_address
      if (address.length > 40) {
        address = address.substring(0, 40) + '...'
      }
      pdf.text(address, pageWidth / 2, yPos, { align: 'center' })
      yPos += smallLineHeight
    }

    pdf.text(`Tel: ${shop?.phone || ''}`, pageWidth / 2, yPos, { align: 'center' })
    yPos += lineHeight + 1

    drawLine(pdf, yPos)
    yPos += 3.5

    pdf.setFontSize(11)
    pdf.setFont('helvetica', 'bold')
    pdf.text(`${saleNumber}`, pageWidth / 2, yPos, { align: 'center' })
    yPos += lineHeight + 1

    pdf.setFontSize(8)
    pdf.setFont('helvetica', 'normal')
    yPos += smallLineHeight    
    pdf.text(`Date: ${formatDateTime(saleDate)}`, leftMargin, yPos)
    yPos += lineHeight + 1

    if (clientInfo.name || clientInfo.phone) {
      pdf.setFont('helvetica', 'bold')
      pdf.setFontSize(9)
      pdf.text('CLIENT', leftMargin, yPos)
      yPos += smallLineHeight

      pdf.setFont('helvetica', 'normal')
      pdf.setFontSize(8)
      if (clientInfo.name) {
        pdf.text(`Nom: ${clientInfo.name}`, leftMargin, yPos)
        yPos += smallLineHeight
      }

      if (clientInfo.phone) {
        pdf.text(`Tel: ${clientInfo.phone}`, leftMargin, yPos)
        yPos += smallLineHeight
      }
      
      yPos += 1.5
    }

    drawLine(pdf, yPos)
    yPos += 3

    pdf.setFontSize(8)
    pdf.setFont('helvetica', 'bold')
    
    pdf.text('Qty', colQtyX, yPos)
    pdf.text('Produit', colProductX, yPos)
    pdf.text('PU', colPUX, yPos)
    pdf.text('PT', colPTX, yPos, { align: 'right' })
    
    yPos += smallLineHeight

    drawLine(pdf, yPos)
    yPos += 3

    pdf.setFont('helvetica', 'normal')
    pdf.setFontSize(8)
    
    items.forEach((item) => {
      const quantity = item.quantity || 1
      const productName = item.name || 'Produit'
      const unitPrice = item.unit_price || 0
      const itemTotal = item.total || 0

      let displayName = productName
      const maxNameLength = 18
      if (displayName.length > maxNameLength) {
        displayName = displayName.substring(0, maxNameLength - 3) + '...'
      }

      pdf.text(`${quantity}`, colQtyX, yPos)
      pdf.text(displayName, colProductX, yPos)
      
      const puFormatted = formatNumber(unitPrice)
      pdf.text(puFormatted, colPUX, yPos)
      
      const ptFormatted = formatNumber(itemTotal)
      pdf.text(ptFormatted, colPTX, yPos, { align: 'right' })
      
      yPos += smallLineHeight

      if (yPos > 285) {
        pdf.addPage()
        yPos = 10
        pdf.setFont('helvetica')
        pdf.setFontSize(8)
        pdf.setFont('helvetica', 'bold')
        pdf.text('Qty', colQtyX, yPos)
        pdf.text('Produit', colProductX, yPos)
        pdf.text('PU', colPUX, yPos)
        pdf.text('PT', colPTX, yPos, { align: 'right' })
        yPos += smallLineHeight
        drawLine(pdf, yPos)
        yPos += 3
        pdf.setFont('helvetica', 'normal')
      }
    })

    yPos += 0.5
    drawLine(pdf, yPos)
    yPos += 5

    pdf.setFont('helvetica', 'normal')
    pdf.setFontSize(8)
    pdf.text('SOUS-TOTAL:', leftMargin, yPos)
    pdf.text(formatCurrencyForInvoice(subtotal, currency), colPTX, yPos, { align: 'right' })
    yPos += smallLineHeight

    pdf.text(`TVA (${vatRate}%):`, leftMargin, yPos)
    pdf.text(formatCurrencyForInvoice(vat, currency), colPTX, yPos, { align: 'right' })
    yPos += smallLineHeight

    pdf.setLineWidth(0.2)
    drawLine(pdf, yPos)
    pdf.setLineWidth(0.1)
    yPos += 3

    pdf.setFont('helvetica', 'bold')
    pdf.setFontSize(9)
    pdf.text('TOTAL:', leftMargin, yPos)
    pdf.text(formatCurrencyForInvoice(total, currency), colPTX, yPos, { align: 'right' })
    yPos += lineHeight + 1.5

    pdf.setFont('helvetica', 'normal')
    pdf.setFontSize(8)
    pdf.text(`Paiement: ${getPaymentMethodNameForInvoice(paymentMethod)}`, pageWidth / 2, yPos, { align: 'center' })
    yPos += lineHeight + 2

    pdf.setFontSize(9)
    pdf.text('Merci pour votre visite!', pageWidth / 2, yPos, { align: 'center' })
    yPos += smallLineHeight

    if (shop?.invoice_message) {
      pdf.setFontSize(8)
      pdf.text(shop.invoice_message, pageWidth / 2, yPos, { align: 'center' })
      yPos += smallLineHeight
    }

    if (shop?.receipt_message && shop.receipt_message !== 'Veuillez conserver ce reçu.') {
      pdf.setFontSize(8)
      let receiptMsg = shop.receipt_message
      if (receiptMsg.length > 50) {
        receiptMsg = receiptMsg.substring(0, 50) + '...'
      }
      pdf.text(receiptMsg, pageWidth / 2, yPos, { align: 'center' })
      yPos += smallLineHeight
    }

    pdf.setFontSize(7)
    pdf.text(`Contact: ${shop?.phone || ''}`, pageWidth / 2, yPos, { align: 'center' })

    return {
      pdf,
      saleNumber
    }
  }

  const downloadPDF = async (invoiceData) => {
    try {
      const { pdf, saleNumber } = await createPDF(invoiceData)
      pdf.save(`Facture_${saleNumber}.pdf`)
      return true
    } catch (error) {
      console.error('Erreur téléchargement PDF:', error)
      return false
    }
  }

  
//   const printInvoice = async (invoiceData) => {
//   if (!selectedPrinter) {
//     throw new Error('Veuillez sélectionner une imprimante dans la page de gestion des imprimantes')
//   }

//   if (!isPrintConnected) {
//     throw new Error('Impossible de se connecter au service d\'impression. Vérifiez que JSPrintManager est lancé.')
//   }

//   setPrinting(true)
//   setPrintStatus('Génération de la facture...')

//   try {
//     // Créer le PDF
//     const { pdf } = await createPDF(invoiceData)
    
//     // Convertir le PDF en blob
//     const pdfBlob = pdf.output('blob')
//     const url = URL.createObjectURL(pdfBlob)

//     setPrintStatus('Envoi à l\'imprimante...')

//     // Obtenir l'instance JSPrintManager
//     const instance = jsPrintManager.getInstance()
//     const { ClientPrintJob, InstalledPrinter } = instance
    
//     // Créer un job d'impression
//     const job = new ClientPrintJob()
//     job.clientPrinter = new InstalledPrinter(selectedPrinter)

//     // IMPORTANT: Utiliser PrintFilePDF pour les fichiers PDF
//     // Vérifier si PrintFilePDF est disponible
//     const PrintFilePDF = instance.PrintFilePDF || instance.PrintFile
    
//     const file = new PrintFilePDF(
//       url,
//       instance.FileSourceType.URL || 0,
//       `facture_${invoiceData.sale_number || 'temp'}.pdf`,
//       1
//     )
    
//     job.files.push(file)

//     // Exécuter l'impression avec timeout
//     const printPromise = new Promise((resolve, reject) => {
//       // Timeout pour éviter l'attente infinie
//       const timeoutId = setTimeout(() => {
//         reject(new Error('Timeout: L\'impression a pris trop de temps (15s)'))
//       }, 15000) // 15 secondes

//       job.onFinished = () => {
//         clearTimeout(timeoutId)
//         URL.revokeObjectURL(url)
//         resolve()
//       }

//       job.onError = (error) => {
//         clearTimeout(timeoutId)
//         URL.revokeObjectURL(url)
//         reject(new Error(`Échec de l'impression: ${error.message || 'Erreur inconnue'}`))
//       }

//       job.sendToClient()
//     })

//     await printPromise
    
//     setPrintStatus('Facture imprimée avec succès!')
//     setTimeout(() => setPrintStatus(''), 3000)
//     return true

//   } catch (error) {
//     console.error('Erreur impression:', error)
//     setPrintStatus(`Erreur: ${error.message}`)
//     setTimeout(() => setPrintStatus(''), 5000)
//     throw error
//   } finally {
//     setPrinting(false)
//   }
// }
// MÉTHODE D'IMPRESSION AMÉLIORÉE - Basée sur PrinterSelector
const printInvoice = async (invoiceData) => {
  if (!selectedPrinter) {
    throw new Error('Veuillez sélectionner une imprimante dans la page de gestion des imprimantes')
  }

  if (!isPrintConnected) {
    throw new Error('Impossible de se connecter au service d\'impression. Vérifiez que JSPrintManager est lancé.')
  }

  setPrinting(true)
  setPrintStatus('Génération de la facture...')

  try {
    // Créer le PDF
    const { pdf } = await createPDF(invoiceData)
    
    // Convertir le PDF en blob
    const pdfBlob = pdf.output('blob')
    const url = URL.createObjectURL(pdfBlob)

    setPrintStatus('Envoi à l\'imprimante...')

    // Obtenir l'instance JSPrintManager
    const instance = jsPrintManager.getInstance()
    const { ClientPrintJob, InstalledPrinter, PrintFile, PrintFilePDF } = instance
    
    // Créer un job d'impression
    const job = new ClientPrintJob()
    job.clientPrinter = new InstalledPrinter(selectedPrinter)

    // Utiliser PrintFilePDF si disponible, sinon PrintFile
    const PrintFileToUse = PrintFilePDF || PrintFile
    
    const file = new PrintFileToUse(
      url,
      instance.FileSourceType?.URL || 0,
      `facture_${invoiceData.sale_number || 'temp'}.pdf`,
      1
    )
    
    job.files.push(file)

    // Exécuter l'impression SANS timeout initial - comme dans PrinterSelector
    await new Promise((resolve, reject) => {
      // Timeout plus long pour les factures (30 secondes au lieu de 10)
      const timeoutId = setTimeout(() => {
        reject(new Error('L\'impression a pris trop de temps. Vérifiez votre imprimante.'))
      }, 30000) // 30 secondes pour les factures

      job.onFinished = () => {
        clearTimeout(timeoutId)
        URL.revokeObjectURL(url)
        resolve()
      }

      job.onError = (error) => {
        clearTimeout(timeoutId)
        URL.revokeObjectURL(url)
        reject(error)
      }

      job.sendToClient()
    })
    
    // Succès
    setPrintStatus('Facture imprimée avec succès!')
    setTimeout(() => setPrintStatus(''), 3000)
    return true

  } catch (error) {
    console.error('Erreur impression:', error)
    
    // Messages d'erreur plus user-friendly
    let errorMessage = error.message
    if (errorMessage.includes('Timeout')) {
      errorMessage = 'L\'impression a pris trop de temps. Vérifiez que l\'imprimante est allumée et connectée.'
    } else if (errorMessage.includes('not connected') || errorMessage.includes('connect')) {
      errorMessage = 'JSPrintManager n\'est pas connecté. Lancez l\'application et rafraîchissez la page.'
    }
    
    setPrintStatus(`Erreur: ${errorMessage}`)
    setTimeout(() => setPrintStatus(''), 5000)
    throw error
  } finally {
    setPrinting(false)
  }
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

      let finalSubtotal = 0
      
      cart.forEach(item => {
        const itemTotalInSaleCurrency = convertPrice(item.total_price, item.product_currency, saleCurrency)
        finalSubtotal += itemTotalInSaleCurrency
      })
      
      const finalVat = (finalSubtotal * saleConfig.vat_amount) / 100
      const finalTotal = finalSubtotal + finalVat

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
          currency: saleCurrency,
          currency_rate: saleConfig.currency_rate
        })
        .select(`
          *,
          client:customer_id(name, phone)
        `)
        .single()

      if (saleError) throw saleError

      const saleItems = cart.map(item => {
        const unitPriceInSaleCurrency = convertPrice(item.unit_price, item.product_currency, saleCurrency)
        const totalPriceInSaleCurrency = convertPrice(item.total_price, item.product_currency, saleCurrency)
        
        return {
          sale_id: sale.id,
          product_id: item.product_id,
          quantity: item.quantity,
          unit_price: unitPriceInSaleCurrency,
          total_price: totalPriceInSaleCurrency,
          original_currency: item.product_currency
        }
      })

      const { error: itemsError } = await supabase
        .from('sale_item')
        .insert(saleItems)

      if (itemsError) throw itemsError

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

      const saleItemsWithNames = await Promise.all(
        cart.map(async (item) => {
          const { data: product } = await supabase
            .from('products')
            .select('name')
            .eq('id', item.product_id)
            .single()
          
          const unitPriceConverted = convertPrice(item.unit_price, item.product_currency, saleCurrency)
          const totalConverted = convertPrice(item.total_price, item.product_currency, saleCurrency)
          
          return {
            name: product?.name || item.product_name,
            quantity: item.quantity,
            unit_price: unitPriceConverted,
            unitPrice: unitPriceConverted,
            total: totalConverted,
            total_price: totalConverted
          }
        })
      )

      const invoiceData = {
        ...sale,
        clientInfo: {
          name: clientName,
          phone: phoneNumber
        },
        items: saleItemsWithNames,
        vat_rate: saleConfig.vat_amount,
        user_name: currentUser.name || currentUser.email || 'Vendeur',
        storeInfo: {
          name: shop?.shop_name || "Boutique",
          idNat: shop?.id_nat || "",
          rccm: shop?.rccm || "",
          address: shop?.shop_address || "",
          phone: shop?.phone || "",
          email: shop?.email || ""
        }
      }

      setLastSale(invoiceData)
      setShowSuccessMessage(true)

      // Tenter d'imprimer automatiquement
      if (selectedPrinter && isPrintConnected) {
        try {
          await printInvoice(invoiceData)
        } catch (printError) {
          console.error('Échec impression:', printError)
          // Continuer même si l'impression échoue
        }
      }

      if (onSaleCompleted) {
        onSaleCompleted()
      }

    } catch (error) {
      console.error('Erreur lors de la vente:', error)
      setError('Erreur lors de la création de la vente: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleRePrint = async () => {
    if (!lastSale) return
    
    try {
      await printInvoice(lastSale)
    } catch (error) {
      console.error('Erreur réimpression:', error)
    }
  }

  const handleDownloadInvoice = async () => {
    if (!lastSale) return
    
    try {
      await downloadPDF(lastSale)
    } catch (error) {
      console.error('Erreur téléchargement:', error)
    }
  }

  const clearCart = () => {
    setCart([])
    setSubTotal(0)
    setVatAmount(0)
    setTotal(0)
  }

  const resetForm = () => {
    clearCart()
    setPhoneNumber('')
    setClientName('')
    setSelectedClient(null)
    setSearchQuery('')
    setPaymentMethod('cash')
    setError('')
    setShowSuccessMessage(false)
    setLastSale(null)
    setPrintStatus('')
  }

  if (!currentUser) return null

  return (
    <div className="space-y-6">
      {/* Notification de vente réussie */}
      {showSuccessMessage && lastSale && (
        <div className="bg-green-50 border max-w-3xl mx-auto border-green-200 rounded-lg p-4 mb-4">
          <div className="flex flex-col space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Check className="h-6 w-6 text-green-600 mr-3" />
                <div>
                  <h3 className="font-semibold text-green-900">Vente complétée avec succès!</h3>
                  <p className="text-sm text-green-700">
                    Facture n°: {lastSale.sale_number} • Montant: {formatCurrency(lastSale.total)}
                  </p>
                  <p className="text-xs text-green-600 mt-1">
                    Client: {lastSale.clientInfo?.name} • Tél: {lastSale.clientInfo?.phone}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  resetForm()
                  router.push('/vendor/sales')
                }}
                className="px-4 py-2 text-sm text-gray-700 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Retour aux ventes
              </button>
            </div>

            {/* Actions de facture */}
            <div className="flex flex-col sm:flex-row gap-3 pt-3 border-t border-green-200">
              {/* Bouton Réimprimer */}
              <button
                onClick={handleRePrint}
                disabled={printing || !selectedPrinter || !isPrintConnected}
                className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-1"
                title={!selectedPrinter ? "Sélectionnez une imprimante d'abord" : !isPrintConnected ? "JSPrintManager non connecté" : ""}
              >
                {printing ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Impression...
                  </>
                ) : (
                  <>
                    <Printer className="h-5 w-5 mr-2" />
                    Réimprimer la facture
                  </>
                )}
              </button>

              {/* Bouton Télécharger */}
              <button
                onClick={handleDownloadInvoice}
                className="flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex-1"
              >
                <Download className="h-5 w-5 mr-2" />
                Télécharger PDF
              </button>

              {/* Bouton Nouvelle vente */}
              <button
                onClick={resetForm}
                className="flex items-center justify-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex-1"
              >
                <Plus className="h-5 w-5 mr-2" />
                Nouvelle vente
              </button>
            </div>

            {/* Information d'impression */}
            <div className="space-y-2">
              {printStatus && (
                <p className={`text-sm px-3 py-1 rounded-lg ${
                  printStatus.includes('Erreur') 
                    ? 'bg-red-100 text-red-700' 
                    : 'bg-blue-100 text-blue-700'
                }`}>
                  {printStatus}
                </p>
              )}

              {!selectedPrinter && (
                <div className="text-xs text-amber-600">
                  ⚠️ Pour imprimer automatiquement, sélectionnez d'abord une imprimante dans la page de gestion des imprimantes
                </div>
              )}

              {selectedPrinter && !isPrintConnected && (
                <div className="text-xs text-amber-600 flex items-center">
                  ⚠️ JSPrintManager non connecté. 
                  <a 
                    href="https://neodynamic.com/downloads/jspm" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline ml-1"
                  >
                    Téléchargez l'application
                  </a>
                  , lancez-la puis rafraîchissez la page
                </div>
              )}

             
            </div>
          </div>
        </div>
      )}

      {/* Formulaire de vente principal */}
      <div className="grid grid-cols-1 lg:grid-cols-7 gap-4">
        {/* SECTION 1: Devise + Recherche + Client + Paiement */}
        <div className="bg-white rounded-lg lg:col-span-2 border border-gray-200 p-4">
         

          {/* Recherche Produit */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Search className="w-5 h-5 mr-2 text-blue-600" />
              Rechercher un produit
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
                placeholder="Nom ou SKU du produit"
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
              Informations client
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
                    placeholder="Numéro de téléphone"
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
              Mode de paiement
            </h2>
            
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => setPaymentMethod('cash')}
                className={`p-3 rounded-lg text-xs border-2 flex flex-col items-center ${
                  paymentMethod === 'cash'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Wallet className="h-6 w-6 mb-2 text-gray-600" />
                <span>{getPaymentMethodName('cash')}</span>
                {paymentMethod === 'cash' && (
                  <Check className="h-4 w-4 mt-1 text-blue-500" />
                )}
              </button>
              
              <button
                onClick={() => setPaymentMethod('card')}
                className={`p-3 rounded-lg text-xs border-2 flex flex-col items-center ${
                  paymentMethod === 'card'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <CreditCard className="h-6 w-6 mb-2 text-gray-600" />
                <span>{getPaymentMethodName('card')}</span>
                {paymentMethod === 'card' && (
                  <Check className="h-4 w-4 mt-1 text-blue-500" />
                )}
              </button>
              
              <button
                onClick={() => setPaymentMethod('mobile')}
                className={`p-3 rounded-lg text-xs border-2 flex flex-col items-center ${
                  paymentMethod === 'mobile'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Smartphone className="h-6 w-6 mb-2 text-gray-600" />
                <span>{getPaymentMethodName('mobile')}</span>
                {paymentMethod === 'mobile' && (
                  <Check className="h-4 w-4 mt-1 text-blue-500" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* SECTION 2: Panier */}
        <div className="bg-white lg:col-span-3 rounded-lg border border-gray-200 p-4">
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
              <p className="text-gray-500">Votre panier est vide</p>
              <p className="text-sm text-gray-400 mt-1">Recherchez des produits à ajouter</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[600px] overflow-y-auto grid-cols-1 lg:grid-cols-2 grid gap-2 justify-center pr-2">
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
                          <div className="text-xs text-gray-500">SKU: {item.sku}</div>
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
        <div className="bg-white rounded-lg lg:col-span-2 border border-gray-200 p-4">
           {/* Sélection Devise */}
          <div className="mb-2">
            {/* <h2 className="text-sm font-semibold text-gray-900 mb-4 flex items-center">
              <Globe className="w-5 h-5 mr-2 text-blue-600" />
              Devise de vente
            </h2> */}
            
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setSaleCurrency('CDF')}
                className={`p-3  rounded-lg border-2 flex   gap-1 items-center ${
                  saleCurrency === 'CDF'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-xs font-bold mb-1">FC</div>
                {saleCurrency === 'CDF' && (
                  <Check className="h-4 w-4 mt- text-blue-500" />
                )}
              </button>
              
              <button
                onClick={() => setSaleCurrency('USD')}
                className={`p-3  rounded-lg border-2 flex   gap-1 items-center ${
                  saleCurrency === 'USD'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-xs font-bold mb-1">$</div>
                {saleCurrency === 'USD' && (
                  <Check className="h-4 w-4 mt- text-blue-500" />
                )}
              </button>
            </div>
          </div>
          {/* <h2 className="text-lg font-semibold text-gray-900 mb-4">Récapitulatif</h2> */}
          
          <div className="space-y-2 mb-6">
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
              <span className="font-medium">{getPaymentMethodName(paymentMethod)}</span>
            </div>
            
            <div className="pt-2">
              <div className="flex justify-between font-bold text-lg">
                <span>Total à payer:</span>
                <span className="text-blue-600">{formatCurrency(total)}</span>
              </div>
            </div>
          </div>
          
          <button
            onClick={handleCompleteSale}
            disabled={loading || printing || cart.length === 0 || !phoneNumber || !clientName}
            className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors mb-3"
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                Traitement...
              </>
            ) : printing ? (
              <>
                <Printer className="h-5 w-5 mr-2 animate-pulse" />
                Impression...
              </>
            ) : (
              <>
                <Check className="h-5 w-5 mr-2" />
                Finaliser la vente ({formatCurrency(total)})
              </>
            )}
          </button>
          
          <div className="bg-gray-50 p-3 rounded-lg mb-6">
            <div className="grid grid-cols-2 gap-2 text-xs">
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
                1 USD = {saleConfig.currency_rate?.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 4 }) || '1.0000'} CDF
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={resetForm}
              disabled={cart.length === 0}
              className="py-2 text-red-600 hover:text-red-800 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Annuler
            </button>
            
            <button
              onClick={clearCart}
              disabled={cart.length === 0}
              className="py-2 text-gray-600 hover:text-gray-900 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Vider le panier
            </button>
          </div>
          
          {error && (
            <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                <span className="text-sm text-red-700">{error}</span>
              </div>
            </div>
          )}
          
          {cart.length > 0 && (!phoneNumber || !clientName) && (
            <p className="text-sm text-red-600 mt-3 text-center">
              Veuillez compléter les informations client
            </p>
          )}
        </div>
      </div>
    </div>
  )
}