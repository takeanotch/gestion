// // 'use client'

// // import { useState } from 'react'
// // import { Printer, Loader2 } from 'lucide-react'
// // import InvoiceGenerator from './InvoiceGenerator'

// // export default function InvoicePrintButton({ saleId, saleNumber, onPrintComplete, className = '' }) {
// //   const [loading, setLoading] = useState(false)
// //   const [saleData, setSaleData] = useState(null)
// //   const [showInvoiceGenerator, setShowInvoiceGenerator] = useState(false)

// //   const loadSaleData = async () => {
// //     if (!saleId) return
    
// //     setLoading(true)
// //     try {
// //       // Ici, vous devrez implémenter la fonction pour charger les données de la vente
// //       // Exemple avec Supabase :
// //       const saleData = await fetchSaleDetails(saleId)
// //       setSaleData(saleData)
// //       setShowInvoiceGenerator(true)
// //     } catch (error) {
// //       console.error('Erreur chargement vente:', error)
// //       alert('Impossible de charger les détails de la vente')
// //     } finally {
// //       setLoading(false)
// //     }
// //   }

// //   const handlePrintClick = async () => {
// //     await loadSaleData()
// //   }

// //   const handleDownloadComplete = () => {
// //     setShowInvoiceGenerator(false)
// //     setSaleData(null)
// //     if (onPrintComplete) {
// //       onPrintComplete()
// //     }
// //   }

// //   return (
// //     <>
// //       <button
// //         onClick={handlePrintClick}
// //         disabled={loading}
// //         className={`p-1.5 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded transition ${className}`}
// //         title={`Imprimer facture ${saleNumber || ''}`}
// //       >
// //         {loading ? (
// //           <Loader2 className="w-4 h-4 animate-spin" />
// //         ) : (
// //           <Printer className="w-4 h-4" />
// //         )}
// //       </button>

// //       {showInvoiceGenerator && saleData && (
// //         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
// //           <div className="bg-white rounded-lg p-4 max-w-md w-full">
// //             <div className="flex justify-between items-center mb-4">
// //               <h3 className="text-lg font-semibold">
// //                 Imprimer la facture
// //               </h3>
// //               <button
// //                 onClick={() => setShowInvoiceGenerator(false)}
// //                 className="p-1 hover:bg-gray-100 rounded"
// //               >
// //                 ✕
// //               </button>
// //             </div>
            
// //             <div className="mb-4">
// //               <p className="text-sm text-gray-600">
// //                 Facture: <span className="font-medium">{saleData.sale_number}</span>
// //               </p>
// //               <p className="text-sm text-gray-600">
// //                 Client: <span className="font-medium">{saleData.clientInfo?.name}</span>
// //               </p>
// //               <p className="text-sm text-gray-600">
// //                 Montant: <span className="font-medium">{formatCurrency(saleData.total, saleData.currency)}</span>
// //               </p>
// //             </div>

// //             <InvoiceGenerator 
// //               saleData={saleData}
// //               onDownloadComplete={handleDownloadComplete}
// //             />
// //           </div>
// //         </div>
// //       )}
// //     </>
// //   )
// // }

// // // Fonction utilitaire pour formater la devise
// // const formatCurrency = (amount, currency = 'CDF') => {
// //   const formatted = new Intl.NumberFormat('fr-FR', {
// //     minimumFractionDigits: currency === 'USD' ? 2 : 0,
// //     maximumFractionDigits: currency === 'USD' ? 2 : 0
// //   }).format(amount || 0)
  
// //   return currency === 'USD' ? `$${formatted}` : `${formatted} FC`
// // }
// 'use client'

// import { useState } from 'react'
// import { Printer, Loader2, X } from 'lucide-react'
// import InvoiceGenerator from './InvoiceGenerator'
// import { supabase } from '@/lib/supabase'

// export default function InvoicePrintButton({ 
//   saleId, 
//   saleNumber, 
//   onPrintComplete, 
//   className = '',
//   currentUser,
//   saleConfig = {
//     vat_amount: 16.00,
//     currency: 'CDF'
//   }
// }) {
//   const [loading, setLoading] = useState(false)
//   const [saleData, setSaleData] = useState(null)
//   const [showInvoiceGenerator, setShowInvoiceGenerator] = useState(false)

//   // Fonction simplifiée sans jointures
//   const fetchSaleDetails = async (saleId) => {
//     try {
//       // 1. Charger la vente principale SANS jointure
//       const { data: sale, error: saleError } = await supabase
//         .from('sale')
//         .select('*')
//         .eq('id', saleId)
//         .single()
      
//       if (saleError) throw saleError

//       // 2. Charger le client séparément
//       let clientName = 'Client non spécifié'
//       let clientPhone = ''
      
//       if (sale.customer_id) {
//         const { data: client } = await supabase
//           .from('client')
//           .select('name, phone')
//           .eq('id', sale.customer_id)
//           .single()
        
//         if (client) {
//           clientName = client.name || 'Client non spécifié'
//           clientPhone = client.phone || ''
//         }
//       }

//       // 3. Charger les items de la vente SANS jointure
//       const { data: saleItems, error: itemsError } = await supabase
//         .from('sale_item')
//         .select('*')
//         .eq('sale_id', saleId)
      
//       if (itemsError) throw itemsError

//       // 4. Charger les noms des produits séparément
//       let formattedItems = [] // ← Changé de const à let
      
//       if (saleItems && saleItems.length > 0) {
//         // Récupérer tous les IDs de produits
//         const productIds = saleItems.map(item => item.product_id).filter(Boolean)
        
//         if (productIds.length > 0) {
//           // Charger les produits en une seule requête
//           const { data: products } = await supabase
//             .from('products')
//             .select('id, name, sku')
//             .in('id', productIds)
          
//           // Créer un map pour accéder facilement aux produits
//           const productMap = {}
//           if (products) {
//             products.forEach(product => {
//               productMap[product.id] = product
//             })
//           }
          
//           // Formater les items avec les noms des produits
//           formattedItems = saleItems.map(item => {
//             const product = productMap[item.product_id]
//             return {
//               name: product?.name || `Produit #${item.product_id}`,
//               quantity: item.quantity,
//               unitPrice: item.unit_price,
//               total: item.total_price,
//               sku: product?.sku || 'N/A'
//             }
//           })
//         } else {
//           // Fallback si pas de product_ids
//           formattedItems = saleItems.map((item, index) => ({
//             name: `Produit ${index + 1}`,
//             quantity: item.quantity,
//             unitPrice: item.unit_price,
//             total: item.total_price,
//             sku: `ITEM-${item.product_id || index}`
//           }))
//         }
//       }

//       return {
//         ...sale,
//         clientInfo: {
//           name: clientName,
//           phone: clientPhone
//         },
//         items: formattedItems,
//         vat_rate: saleConfig.vat_amount,
//         user_name: currentUser?.full_name || currentUser?.email || 'Vendeur',
//         storeInfo: {
//           name: "NOM MAGASIN",
//           idNat: "1103/7",
//           rccm: "1887008/66",
//           address: "99 av. Lucas",
//           phone: "09905588934",
//           email: "sales@bigupshop.com"
//         }
//       }
//     } catch (error) {
//       console.error('Erreur fetchSaleDetails:', error)
//       throw error
//     }
//   }

//   const loadSaleData = async () => {
//     if (!saleId) {
//       console.error('saleId est requis')
//       return
//     }
    
//     setLoading(true)
//     try {
//       const saleData = await fetchSaleDetails(saleId)
//       setSaleData(saleData)
//       setShowInvoiceGenerator(true)
//     } catch (error) {
//       console.error('Erreur chargement vente:', error)
//       alert(`Erreur: ${error.message || 'Impossible de charger les détails'}`)
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handlePrintClick = async () => {
//     await loadSaleData()
//   }

//   const handleDownloadComplete = () => {
//     setShowInvoiceGenerator(false)
//     setSaleData(null)
//     if (onPrintComplete) {
//       onPrintComplete()
//     }
//   }

//   // Fonction utilitaire pour formater la devise
//   const formatCurrency = (amount, currency = 'CDF') => {
//     if (!amount) amount = 0
//     const formatted = new Intl.NumberFormat('fr-FR', {
//       minimumFractionDigits: currency === 'USD' ? 2 : 0,
//       maximumFractionDigits: currency === 'USD' ? 2 : 0
//     }).format(amount)
    
//     return currency === 'USD' ? `$${formatted}` : `${formatted} FC`
//   }

//   return (
//     <>
//       <button
//         onClick={handlePrintClick}
//         disabled={loading}
//         className={`p-1.5 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded transition ${className}`}
//         title={`Imprimer facture ${saleNumber || ''}`}
//       >
//         {loading ? (
//           <Loader2 className="w-4 h-4 animate-spin" />
//         ) : (
//           <Printer className="w-4 h-4" />
//         )}
//       </button>

//       {showInvoiceGenerator && saleData && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-lg p-4 max-w-md w-full">
//             <div className="flex justify-between items-center mb-4">
//               <h3 className="text-lg font-semibold">
//                 Imprimer la facture
//               </h3>
//               <button
//                 onClick={() => setShowInvoiceGenerator(false)}
//                 className="p-1 hover:bg-gray-100 rounded"
//               >
//                 <X className="w-5 h-5" />
//               </button>
//             </div>
            
//             <div className="mb-4 space-y-2">
//               <p className="text-sm text-gray-600">
//                 <span className="font-medium">Facture:</span> {saleData.sale_number}
//               </p>
//               <p className="text-sm text-gray-600">
//                 <span className="font-medium">Client:</span> {saleData.clientInfo?.name}
//               </p>
//               <p className="text-sm text-gray-600">
//                 <span className="font-medium">Montant:</span> {formatCurrency(saleData.total, saleData.currency)}
//               </p>
//               <p className="text-sm text-gray-600">
//                 <span className="font-medium">Date:</span> {new Date(saleData.date_time).toLocaleString('fr-FR')}
//               </p>
//             </div>

//             <InvoiceGenerator 
//               saleData={saleData}
//               onDownloadComplete={handleDownloadComplete}
//             />
//           </div>
//         </div>
//       )}
//     </>
//   )
// }
'use client'

import { useState, useEffect } from 'react'
import { Printer, Loader2, X, AlertCircle } from 'lucide-react'
import jsPDF from 'jspdf'
import { supabase } from '@/lib/supabase'
import { jsPrintManager } from '@/lib/jsprintmanager-singleton'

const PRINTER_STORAGE_KEY = 'selected-printer'

export default function InvoicePrintButton({ 
  saleId, 
  saleNumber,
  currentUser,
  className = '',
  onPrintComplete,
  shopInfo = {
    shop_name: 'NOM MAGASIN',
    shop_icon: null,
    phone: '09905588934',
    currency: 'CDF',
    invoice_message: 'Merci pour votre visite!',
    address: '99 av. Lucas',
    email: 'sales@bigupshop.com'
  }
}) {
  const [loading, setLoading] = useState(false)
  const [printing, setPrinting] = useState(false)
  const [printStatus, setPrintStatus] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [saleData, setSaleData] = useState(null)
  const [selectedPrinter, setSelectedPrinter] = useState('')
  const [isPrintConnected, setIsPrintConnected] = useState(false)
  const [pdfBlobUrl, setPdfBlobUrl] = useState(null)

  // Charger l'imprimante sélectionnée
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedPrinter = localStorage.getItem(PRINTER_STORAGE_KEY)
      if (savedPrinter) {
        setSelectedPrinter(savedPrinter)
      }
    }
  }, [])

  // Vérifier la connexion à l'imprimante
  useEffect(() => {
    const checkPrintConnection = () => {
      setIsPrintConnected(jsPrintManager.isConnected())
    }

    checkPrintConnection()

    const cleanupListener = jsPrintManager.addStatusListener((connected) => {
      setIsPrintConnected(connected)
    })

    return () => {
      if (cleanupListener) cleanupListener()
      if (pdfBlobUrl) {
        URL.revokeObjectURL(pdfBlobUrl)
      }
    }
  }, [pdfBlobUrl])

  // Formatter la devise
  const formatCurrency = (amount, currency = 'CDF') => {
    if (!amount) amount = 0
    const formatted = Math.round(amount).toString()
    return currency === 'CDF' ? `${formatted} FC` : `$${formatted}`
  }

  // Formatter la date
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

  // Charger les détails de la vente
  const loadSaleData = async () => {
    if (!saleId) return
    
    setLoading(true)
    try {
      // 1. Charger la vente
      const { data: sale, error: saleError } = await supabase
        .from('sale')
        .select('*')
        .eq('id', saleId)
        .single()
      
      if (saleError) throw saleError

      // 2. Charger le client
      let clientInfo = { name: 'Client', phone: '' }
      if (sale.customer_id) {
        const { data: client } = await supabase
          .from('client')
          .select('name, phone')
          .eq('id', sale.customer_id)
          .single()
        
        if (client) {
          clientInfo = { name: client.name, phone: client.phone }
        }
      }

      // 3. Charger les items de la vente
      const { data: saleItems, error: itemsError } = await supabase
        .from('sale_item')
        .select('*')
        .eq('sale_id', saleId)
      
      if (itemsError) throw itemsError

      // 4. Charger les noms des produits
      let formattedItems = []
      if (saleItems && saleItems.length > 0) {
        const productIds = saleItems.map(item => item.product_id).filter(Boolean)
        
        if (productIds.length > 0) {
          const { data: products } = await supabase
            .from('products')
            .select('id, name, sku')
            .in('id', productIds)
          
          const productMap = {}
          if (products) {
            products.forEach(product => {
              productMap[product.id] = product
            })
          }
          
          formattedItems = saleItems.map(item => ({
            name: productMap[item.product_id]?.name || `Produit #${item.product_id}`,
            quantity: item.quantity,
            unitPrice: item.unit_price,
            total: item.total_price,
            sku: productMap[item.product_id]?.sku || 'N/A'
          }))
        } else {
          formattedItems = saleItems.map((item, index) => ({
            name: `Produit ${index + 1}`,
            quantity: item.quantity,
            unitPrice: item.unit_price,
            total: item.total_price,
            sku: `ITEM-${item.product_id || index}`
          }))
        }
      }

      // Préparer les données pour la facture
      const preparedData = {
        ...sale,
        clientInfo,
        items: formattedItems,
        vat_rate: 16.00, // Par défaut
        user_name: currentUser?.full_name || currentUser?.email || 'Vendeur',
        storeInfo: shopInfo
      }

      setSaleData(preparedData)
      setShowModal(true)

    } catch (error) {
      console.error('Erreur chargement vente:', error)
      setPrintStatus(`Erreur: ${error.message}`)
      setTimeout(() => setPrintStatus(''), 5000)
    } finally {
      setLoading(false)
    }
  }

  // Fonction pour dessiner une ligne
  const drawLine = (pdf, y, startX = 3, endX = 77) => {
    pdf.setLineWidth(0.1)
    pdf.line(startX, y, endX, y)
  }

  // Créer le PDF
  const createPDF = async () => {
    if (!saleData) {
      throw new Error('Aucune donnée de vente')
    }

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: [80, 297]
    })

    let yPos = 5
    const lineHeight = 4
    const smallLineHeight = 3.5
    const pageWidth = 80
    const leftMargin = 3
    const rightMargin = 3
    const colQtyX = leftMargin
    const colProductX = leftMargin + 10
    const colTotalX = pageWidth - rightMargin - 10

    // Police Courier
    pdf.setFont('courier')
    pdf.setFontSize(9)

    // Logo (si disponible)
    if (shopInfo.shop_icon) {
      try {
        const response = await fetch(shopInfo.shop_icon)
        const blob = await response.blob()
        const logoData = await new Promise((resolve, reject) => {
          const reader = new FileReader()
          reader.onloadend = () => resolve(reader.result)
          reader.onerror = reject
          reader.readAsDataURL(blob)
        })
        
        if (logoData) {
          pdf.addImage(logoData, 'PNG', 32.5, yPos, 15, 15)
          yPos += 17
        }
      } catch (error) {
        console.error('Erreur chargement logo:', error)
      }
    }

    // Nom du shop
    pdf.setFontSize(10)
    pdf.setFont('courier', 'bold')
    pdf.text(shopInfo.shop_name, pageWidth / 2, yPos, { align: 'center' })
    yPos += smallLineHeight

    // Téléphone
    pdf.setFontSize(8)
    pdf.setFont('courier', 'normal')
    pdf.text(`Tel: ${shopInfo.phone}`, pageWidth / 2, yPos, { align: 'center' })
    yPos += lineHeight + 1

    // Ligne séparation
    drawLine(pdf, yPos)
    yPos += 3.5

    // Titre FACTURE
    pdf.setFontSize(11)
    pdf.setFont('courier', 'bold')
    pdf.text('FACTURE', pageWidth / 2, yPos, { align: 'center' })
    yPos += lineHeight + 1

    // Numéro et date
    pdf.setFontSize(8)
    pdf.setFont('courier', 'normal')
    pdf.text(`N°: ${saleData.sale_number}`, leftMargin, yPos)
    yPos += smallLineHeight
    
    pdf.text(`Date: ${formatDateTime(saleData.date_time)}`, leftMargin, yPos)
    yPos += lineHeight + 1

    // Informations client
    if (saleData.clientInfo.name || saleData.clientInfo.phone) {
      pdf.setFont('courier', 'bold')
      pdf.setFontSize(9)
      pdf.text('CLIENT', leftMargin, yPos)
      yPos += smallLineHeight

      pdf.setFont('courier', 'normal')
      pdf.setFontSize(8)
      if (saleData.clientInfo.name) {
        pdf.text(`Nom: ${saleData.clientInfo.name}`, leftMargin, yPos)
        yPos += smallLineHeight
      }

      if (saleData.clientInfo.phone) {
        pdf.text(`Tel: ${saleData.clientInfo.phone}`, leftMargin, yPos)
        yPos += smallLineHeight
      }
      
      yPos += 1.5
    }

    // Ligne séparation
    drawLine(pdf, yPos)
    yPos += 3

    // En-tête tableau
    pdf.setFontSize(8)
    pdf.setFont('courier', 'bold')
    pdf.text('Qty', colQtyX, yPos)
    pdf.text('Produit', colProductX, yPos)
    pdf.text('Total', colTotalX, yPos, { align: 'right' })
    yPos += smallLineHeight

    drawLine(pdf, yPos)
    yPos += 3

    // Articles
    pdf.setFont('courier', 'normal')
    saleData.items.forEach((item) => {
      const quantity = item.quantity || 1
      let displayName = item.name || 'Produit'
      const maxNameLength = 30
      
      if (displayName.length > maxNameLength) {
        displayName = displayName.substring(0, maxNameLength - 3) + '...'
      }

      pdf.text(`${quantity}`, colQtyX, yPos)
      pdf.text(displayName, colProductX, yPos)
      pdf.text(formatCurrency(item.total, saleData.currency), colTotalX, yPos, { align: 'right' })
      yPos += smallLineHeight

      if (yPos > 285) {
        pdf.addPage()
        yPos = 10
        pdf.setFont('courier')
        pdf.setFontSize(8)
      }
    })

    // Ligne séparation
    yPos += 0.5
    drawLine(pdf, yPos)
    yPos += 2

    // Totaux
    pdf.setFont('courier', 'normal')
    pdf.setFontSize(8)
    pdf.text('SOUS-TOTAL:', leftMargin, yPos)
    pdf.text(formatCurrency(saleData.subtotal, saleData.currency), colTotalX, yPos, { align: 'right' })
    yPos += smallLineHeight

    pdf.text(`TVA (${saleData.vat_rate}%):`, leftMargin, yPos)
    pdf.text(formatCurrency(saleData.vat_amount, saleData.currency), colTotalX, yPos, { align: 'right' })
    yPos += smallLineHeight

    pdf.setLineWidth(0.2)
    drawLine(pdf, yPos)
    pdf.setLineWidth(0.1)
    yPos += 3

    pdf.setFont('courier', 'bold')
    pdf.setFontSize(9)
    pdf.text('TOTAL:', leftMargin, yPos)
    pdf.text(formatCurrency(saleData.total, saleData.currency), colTotalX, yPos, { align: 'right' })
    yPos += lineHeight + 1.5

    // Mode de paiement
    pdf.setFont('courier', 'normal')
    pdf.setFontSize(8)
    pdf.text(`Paiement: ${saleData.payment_method || 'Espèces'}`, pageWidth / 2, yPos, { align: 'center' })
    yPos += lineHeight + 2

    // Message
    pdf.setFontSize(9)
    pdf.text('Merci pour votre visite!', pageWidth / 2, yPos, { align: 'center' })
    yPos += smallLineHeight

    if (shopInfo.invoice_message) {
      pdf.setFontSize(8)
      pdf.text(shopInfo.invoice_message, pageWidth / 2, yPos, { align: 'center' })
      yPos += smallLineHeight
    }

    // Contact
    pdf.setFontSize(7)
    pdf.text(`Contact: ${shopInfo.phone}`, pageWidth / 2, yPos, { align: 'center' })

    // Générer le PDF
    const pdfBlob = pdf.output('blob')
    const blobUrl = URL.createObjectURL(pdfBlob)
    
    if (pdfBlobUrl) {
      URL.revokeObjectURL(pdfBlobUrl)
    }
    
    setPdfBlobUrl(blobUrl)

    return { pdf, blobUrl }
  }

  // Télécharger le PDF
  const handleDownload = async () => {
    if (!saleData) return
    
    setPrinting(true)
    setPrintStatus('Génération du PDF...')
    
    try {
      const { pdf } = await createPDF()
      pdf.save(`Facture_${saleData.sale_number}.pdf`)
      
      setPrintStatus('PDF téléchargé avec succès!')
      setTimeout(() => {
        setPrintStatus('')
        if (onPrintComplete) onPrintComplete()
      }, 2000)
    } catch (error) {
      console.error('Erreur génération PDF:', error)
      setPrintStatus(`Erreur: ${error.message}`)
    } finally {
      setPrinting(false)
    }
  }

  // Imprimer directement
  const handlePrint = async () => {
    if (!saleData) return
    
    if (!selectedPrinter) {
      setPrintStatus('⚠️ Sélectionnez une imprimante d\'abord')
      setTimeout(() => setPrintStatus(''), 3000)
      return
    }

    if (!isPrintConnected) {
      setPrintStatus('⚠️ JSPrintManager non connecté')
      setTimeout(() => setPrintStatus(''), 3000)
      return
    }

    setPrinting(true)
    setPrintStatus('Préparation de l\'impression...')

    try {
      // Initialiser JSPrintManager si nécessaire
      if (!jsPrintManager.isConnected()) {
        await jsPrintManager.initialize()
        await new Promise(resolve => setTimeout(resolve, 1000))
      }

      if (!jsPrintManager.isConnected()) {
        throw new Error('Non connecté au service d\'impression')
      }

      // Créer le PDF
      setPrintStatus('Génération du PDF...')
      const { blobUrl } = await createPDF()
      
      if (!blobUrl) {
        throw new Error('Impossible de générer le PDF')
      }

      // Obtenir l'instance JSPrintManager
      const instance = jsPrintManager.getInstance()
      const { ClientPrintJob, InstalledPrinter } = instance
      
      // Utiliser PrintFilePDF si disponible, sinon PrintFile
      let printFile
      if (instance.PrintFilePDF) {
        const { PrintFilePDF, FileSourceType } = instance
        printFile = new PrintFilePDF(blobUrl, FileSourceType.URL, 'facture.pdf', 1)
      } else if (instance.PrintFile) {
        const { PrintFile, FileSourceType } = instance
        printFile = new PrintFile(blobUrl, FileSourceType.URL, 'facture.pdf', 1)
      } else {
        throw new Error('Aucune méthode d\'impression disponible')
      }

      // Créer le job d'impression
      const cpj = new ClientPrintJob()
      cpj.clientPrinter = new InstalledPrinter(selectedPrinter)
      cpj.files.push(printFile)

      // Envoyer à l'imprimante
      await new Promise((resolve, reject) => {
        cpj.onFinished = () => {
          console.log('Impression réussie')
          resolve()
        }
        cpj.onError = (error) => {
          reject(new Error(`Échec de l'impression: ${error.message || 'Erreur inconnue'}`))
        }
        cpj.sendToClient()
      })

      setPrintStatus('Facture imprimée avec succès!')
      setTimeout(() => {
        setPrintStatus('')
        if (onPrintComplete) onPrintComplete()
      }, 3000)

    } catch (error) {
      console.error('Erreur impression:', error)
      setPrintStatus(`Erreur: ${error.message}`)
      setTimeout(() => setPrintStatus(''), 5000)
    } finally {
      setPrinting(false)
    }
  }

  // Gérer le clic sur le bouton
  const handleButtonClick = async () => {
    if (!saleData) {
      await loadSaleData()
    } else {
      setShowModal(true)
    }
  }

  // Fermer le modal
  const closeModal = () => {
    setShowModal(false)
    if (pdfBlobUrl) {
      URL.revokeObjectURL(pdfBlobUrl)
      setPdfBlobUrl(null)
    }
  }

  return (
    <>
      {/* Bouton d'impression */}
      <button
        onClick={handleButtonClick}
        disabled={loading}
        className={`p-1.5 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded transition ${className}`}
        title={`Imprimer facture ${saleNumber || ''}`}
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Printer className="w-4 h-4" />
        )}
      </button>

      {/* Modal d'impression */}
      {showModal && saleData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-4 max-w-md w-full">
            {/* En-tête modal */}
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                Facture {saleData.sale_number}
              </h3>
              <button
                onClick={closeModal}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Détails de la facture */}
            <div className="mb-4 space-y-2 p-3 bg-gray-50 rounded">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Client:</span>
                <span className="text-sm font-medium">{saleData.clientInfo.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Date:</span>
                <span className="text-sm">{formatDateTime(saleData.date_time)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Montant:</span>
                <span className="text-sm font-semibold text-green-600">
                  {formatCurrency(saleData.total, saleData.currency)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Articles:</span>
                <span className="text-sm">{saleData.items.length} produit(s)</span>
              </div>
            </div>

            {/* Boutons d'action */}
            <div className="flex flex-col gap-2">
              <button
                onClick={handleDownload}
                disabled={printing}
                className="flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50"
              >
                {printing ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Printer className="w-4 h-4 mr-2" />
                )}
                Télécharger PDF
              </button>

              <button
                onClick={handlePrint}
                disabled={printing || !selectedPrinter || !isPrintConnected}
                className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                title={!selectedPrinter ? "Sélectionnez une imprimante" : !isPrintConnected ? "JSPrintManager non connecté" : ""}
              >
                {printing ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Printer className="w-4 h-4 mr-2" />
                )}
                Imprimer directement
              </button>

              {/* Statut */}
              {printStatus && (
                <div className="mt-2 p-2 rounded-lg text-sm text-center">
                  <p className={`${printStatus.includes('Erreur') || printStatus.includes('⚠️') 
                    ? 'bg-red-100 text-red-700' 
                    : 'bg-blue-100 text-blue-700'
                  } px-3 py-1 rounded`}>
                    {printStatus}
                  </p>
                  {selectedPrinter && printStatus.includes('succès') && (
                    <p className="text-xs text-gray-500 mt-1">
                      Imprimante: <span className="font-medium">{selectedPrinter}</span>
                    </p>
                  )}
                </div>
              )}

              {/* Avertissements */}
              {!selectedPrinter && !printing && (
                <div className="mt-2 p-2 bg-amber-50 border border-amber-200 rounded">
                  <div className="flex items-center">
                    <AlertCircle className="w-4 h-4 text-amber-600 mr-2" />
                    <p className="text-xs text-amber-700">
                      Sélectionnez une imprimante dans la page de gestion des imprimantes
                    </p>
                  </div>
                </div>
              )}

              {selectedPrinter && !isPrintConnected && !printing && (
                <div className="mt-2 p-2 bg-amber-50 border border-amber-200 rounded">
                  <div className="flex items-center">
                    <AlertCircle className="w-4 h-4 text-amber-600 mr-2" />
                    <p className="text-xs text-amber-700">
                      JSPrintManager non connecté. Lancez l'application puis rafraîchissez.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}