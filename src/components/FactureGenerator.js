
// // 'use client'

// // import { useState, useEffect } from 'react'
// // import { Download, Loader2 } from 'lucide-react'
// // import jsPDF from 'jspdf'
// // import { useShop } from '@/hooks/useShop'

// // export default function FactureGenerator({ saleData, onDownloadComplete }) {
// //   const [generating, setGenerating] = useState(false)
// //   const { shop, loading: shopLoading } = useShop()
// //   const [logoUrl, setLogoUrl] = useState(null)

// //   // Charger le logo
// //   useEffect(() => {
// //     if (shop?.shop_icon) {
// //       setLogoUrl(shop.shop_icon)
// //     }
// //   }, [shop])

// //   // Formater la date et l'heure correctement
// //   const formatDateTime = (dateString) => {
// //     if (!dateString) {
// //       const now = new Date()
// //       return now.toLocaleString('fr-FR', {
// //         day: '2-digit',
// //         month: '2-digit',
// //         year: 'numeric',
// //         hour: '2-digit',
// //         minute: '2-digit'
// //       })
// //     }
    
// //     const date = new Date(dateString)
// //     return date.toLocaleString('fr-FR', {
// //       day: '2-digit',
// //       month: '2-digit',
// //       year: 'numeric',
// //       hour: '2-digit',
// //       minute: '2-digit'
// //     })
// //   }

// //   // Formater la devise proprement
// //   const formatCurrency = (amount, currency = shop?.currency || 'CDF') => {
// //     if (!amount) amount = 0
    
// //     // Format sans séparateur de milliers
// //     const formatted = Math.round(amount).toString()
    
// //     if (currency === 'CDF') {
// //       return `${formatted} FC`
// //     }
    
// //     return `$${formatted}`
// //   }

// //   // Obtenir le nom de la méthode de paiement
// //   const getPaymentMethodName = (method) => {
// //     switch (method) {
// //       case 'cash':
// //         return 'Espèces'
// //       case 'card':
// //         return 'Carte'
// //       case 'mobile':
// //         return 'Mobile'
// //       default:
// //         return method
// //     }
// //   }

// //   // Fonction pour charger une image en base64
// //   const loadImageAsBase64 = async (url) => {
// //     try {
// //       const response = await fetch(url)
// //       const blob = await response.blob()
// //       return new Promise((resolve, reject) => {
// //         const reader = new FileReader()
// //         reader.onloadend = () => resolve(reader.result)
// //         reader.onerror = reject
// //         reader.readAsDataURL(blob)
// //       })
// //     } catch (error) {
// //       console.error('Erreur chargement logo:', error)
// //       return null
// //     }
// //   }

// //   // Fonction pour dessiner une ligne de séparation FINE
// //   const drawLine = (pdf, y, startX = 3, endX = 77) => {
// //     pdf.setLineWidth(0.1) // Réduit de 0.5 à 0.1 (beaucoup plus fin)
// //     pdf.line(startX, y, endX, y)
// //   }

// //   // Générer le PDF
// //   const generatePDF = async () => {
// //     if (!saleData) {
// //       console.error('Aucune donnée de vente fournie')
// //       return
// //     }

// //     setGenerating(true)

// //     try {
// //       // Récupérer les données
// //       const saleNumber = saleData.sale_number || `FACT-${Date.now()}`
// //       const saleDate = saleData.date_time || new Date().toISOString()
// //       const clientInfo = saleData.clientInfo || {}
// //       const items = saleData.items || []
// //       const subtotal = saleData.subtotal || 0
// //       const vat = saleData.vat_amount || 0
// //       const vatRate = saleData.vat_rate || 16
// //       const total = saleData.total || 0
// //       const currency = saleData.currency || 'CDF'
// //       const paymentMethod = saleData.payment_method || 'cash'

// //       // Créer le PDF avec largeur de 80mm pour thermal printer
// //       const pdf = new jsPDF({
// //         orientation: 'portrait',
// //         unit: 'mm',
// //         format: [80, 150] // Largeur: 80mm
// //       })

// //       // Variables de position et marges
// //       let yPos = 5
// //       const lineHeight = 4
// //       const smallLineHeight = 3.5
// //       const pageWidth = 80
      
// //       // MARGES AUGMENTÉES
// //       const leftMargin = 3
// //       const rightMargin = 3
      
// //       // Positions X pour les colonnes (AUGMENTÉES)
// //       const colQtyX = leftMargin
// //       const colProductX = leftMargin + 10  // Augmenté de 8 à 10
// //       const colTotalX = pageWidth - rightMargin - 10  // Marge à droite pour les totaux

// //       // Définir la police Courier
// //       pdf.setFont('courier')
// //       pdf.setFontSize(9)

// //       // === EN-TÊTE AVEC LOGO ===
// //       if (logoUrl) {
// //         try {
// //           const logoData = await loadImageAsBase64(logoUrl)
// //           if (logoData) {
// //             // Logo centré
// //             pdf.addImage(logoData, 'PNG', 32.5, yPos, 15, 15)
// //             yPos += 17
// //           }
// //         } catch (error) {
// //           console.error('Erreur chargement logo:', error)
// //         }
// //       }

// //       // Nom du shop centré
// //       pdf.setFontSize(10)
// //       pdf.setFont('courier', 'bold')
// //       pdf.text(shop?.shop_name || 'ErrorShop', pageWidth / 2, yPos, { align: 'center' })
// //       yPos += smallLineHeight

// //       // Téléphone centré
// //       pdf.setFontSize(8)
// //       pdf.setFont('courier', 'normal')
// //       pdf.text(`Tel: ${shop?.phone || '+233333'}`, pageWidth / 2, yPos, { align: 'center' })
// //       yPos += lineHeight + 1

// //       // === LIGNE DE SÉPARATION FINE ===
// //       drawLine(pdf, yPos)
// //       yPos += 3.5

// //       // === TITRE FACTURE ===
// //       pdf.setFontSize(11)
// //       pdf.setFont('courier', 'bold')
// //       pdf.text('FACTURE', pageWidth / 2, yPos, { align: 'center' })
// //       yPos += lineHeight + 1

// //       // === NUMÉRO ET DATE ===
// //       pdf.setFontSize(8)
// //       pdf.setFont('courier', 'normal')
// //       pdf.text(`N°: ${saleNumber}`, leftMargin, yPos)
// //       yPos += smallLineHeight
      
// //       pdf.text(`Date: ${formatDateTime(saleDate)}`, leftMargin, yPos)
// //       yPos += lineHeight + 1

// //       // === INFORMATIONS CLIENT ===
// //       if (clientInfo.name || clientInfo.phone) {
// //         pdf.setFont('courier', 'bold')
// //         pdf.setFontSize(9)
// //         pdf.text('CLIENT', leftMargin, yPos)
// //         yPos += smallLineHeight

// //         pdf.setFont('courier', 'normal')
// //         pdf.setFontSize(8)
// //         if (clientInfo.name) {
// //           pdf.text(`Nom: ${clientInfo.name}`, leftMargin, yPos)
// //           yPos += smallLineHeight
// //         }

// //         if (clientInfo.phone) {
// //           pdf.text(`Tel: ${clientInfo.phone}`, leftMargin, yPos)
// //           yPos += smallLineHeight
// //         }
        
// //         yPos += 1.5
// //       }

// //       // === LIGNE DE SÉPARATION FINE ===
// //       drawLine(pdf, yPos)
// //       yPos += 3

// //       // === EN-TÊTE DU TABLEAU ===
// //       pdf.setFontSize(8)
// //       pdf.setFont('courier', 'bold')
      
// //       pdf.text('Qty', colQtyX, yPos)
// //       pdf.text('Produit', colProductX, yPos)
// //       pdf.text('Total', colTotalX, yPos, { align: 'right' })
// //       yPos += smallLineHeight

// //       // Ligne sous les en-têtes
// //       drawLine(pdf, yPos)
// //       yPos += 3

// //       // === ARTICLES ===
// //       pdf.setFont('courier', 'normal')
// //       items.forEach((item) => {
// //         const quantity = item.quantity || 1
// //         const productName = item.name || 'Produit'
        
// //         // Tronquer le nom si trop long (AUGMENTÉ pour utiliser l'espace)
// //         let displayName = productName
// //         const maxNameLength = 30  // Augmenté de 22 à 30
// //         if (displayName.length > maxNameLength) {
// //           displayName = displayName.substring(0, maxNameLength - 3) + '...'
// //         }

// //         // Ajouter les données avec plus d'espace
// //         pdf.text(`${quantity}`, colQtyX, yPos)
// //         pdf.text(displayName, colProductX, yPos)
// //         pdf.text(formatCurrency(item.total || 0, currency), colTotalX, yPos, { align: 'right' })
        
// //         yPos += smallLineHeight

// //         // Vérifier si on dépasse la page
// //         if (yPos > 285) {
// //           pdf.addPage()
// //           yPos = 10
// //           pdf.setFont('courier')
// //           pdf.setFontSize(8)
// //         }
// //       })

// //       // === LIGNE DE SÉPARATION FINE ===
// //       yPos += 0.5
// //       drawLine(pdf, yPos)
// //       yPos += 2

// //       // === TOTAUX ===
// //       // Sous-total
// //       pdf.setFont('courier', 'normal')
// //       pdf.setFontSize(8)
// //       pdf.text('SOUS-TOTAL:', leftMargin, yPos)
// //       pdf.text(formatCurrency(subtotal, currency), colTotalX, yPos, { align: 'right' })
// //       yPos += smallLineHeight

// //       // TVA
// //       pdf.text(`TVA (${vatRate}%):`, leftMargin, yPos)
// //       pdf.text(formatCurrency(vat, currency), colTotalX, yPos, { align: 'right' })
// //       yPos += smallLineHeight

// //       // Ligne de séparation avant total
// //       pdf.setLineWidth(0.2)
// //       drawLine(pdf, yPos)
// //       pdf.setLineWidth(0.1)
// //       yPos += 3

// //       // TOTAL
// //       pdf.setFont('courier', 'bold')
// //       pdf.setFontSize(9)
// //       pdf.text('TOTAL:', leftMargin, yPos)
// //       pdf.text(formatCurrency(total, currency), colTotalX, yPos, { align: 'right' })
// //       yPos += lineHeight + 1.5

// //       // === MODE DE PAIEMENT ===
// //       pdf.setFont('courier', 'normal')
// //       pdf.setFontSize(8)
// //       pdf.text(`Paiement: ${getPaymentMethodName(paymentMethod)}`, pageWidth / 2, yPos, { align: 'center' })
// //       yPos += lineHeight + 2

// //       // === MESSAGE ===
// //       pdf.setFontSize(9)
// //       pdf.text('Merci pour votre visite!', pageWidth / 2, yPos, { align: 'center' })
// //       yPos += smallLineHeight

// //       // Message du shop
// //       if (shop?.invoice_message) {
// //         pdf.setFontSize(8)
// //         pdf.text(shop.invoice_message, pageWidth / 2, yPos, { align: 'center' })
// //         yPos += smallLineHeight
// //       }

// //       // Contact
// //       pdf.setFontSize(7)
// //       pdf.text(`Contact: ${shop?.phone || '+2439906644057'}`, pageWidth / 2, yPos, { align: 'center' })

// //       // === SAUVEGARDE ===
// //       pdf.save(`Facture_${saleNumber}.pdf`)

// //       // Callback
// //       if (onDownloadComplete) {
// //         onDownloadComplete()
// //       }

// //     } catch (error) {
// //       console.error('Erreur génération PDF:', error)
// //       alert('Erreur lors de la génération du PDF')
// //     } finally {
// //       setGenerating(false)
// //     }
// //   }

// //   if (!saleData) {
// //     return null
// //   }

// //   // Retourne uniquement le bouton
// //   return (
// //     <button
// //       onClick={generatePDF}
// //       disabled={generating || shopLoading}
// //       className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
// //     >
// //       {generating ? (
// //         <>
// //           <Loader2 className="h-5 w-5 mr-2 animate-spin" />
// //           Génération...
// //         </>
// //       ) : (
// //         <>
// //           <Download className="h-5 w-5 mr-2" />
// //           Télécharger Facture
// //         </>
// //       )}
// //     </button>
// //   )
// // }


// 'use client'

// import { useState, useEffect } from 'react'
// import { Download, Loader2, Printer } from 'lucide-react'
// import jsPDF from 'jspdf'
// import { useShop } from '@/hooks/useShop'
// import { jsPrintManager } from '@/lib/jsprintmanager-singleton'

// const PRINTER_STORAGE_KEY = 'selected-printer'

// export default function FactureGenerator({ saleData, onDownloadComplete }) {
//   const [generating, setGenerating] = useState(false)
//   const [printing, setPrinting] = useState(false)
//   const [printStatus, setPrintStatus] = useState('')
//   const { shop, loading: shopLoading } = useShop()
//   const [logoUrl, setLogoUrl] = useState(null)
//   const [selectedPrinter, setSelectedPrinter] = useState('')
//   const [isPrintConnected, setIsPrintConnected] = useState(false)

//   // Charger le logo
//   useEffect(() => {
//     if (shop?.shop_icon) {
//       setLogoUrl(shop.shop_icon)
//     }
//   }, [shop])

//   // Charger l'imprimante sélectionnée
//   useEffect(() => {
//     if (typeof window !== 'undefined') {
//       const savedPrinter = localStorage.getItem(PRINTER_STORAGE_KEY)
//       if (savedPrinter) {
//         setSelectedPrinter(savedPrinter)
//       }
//     }
//   }, [])

//   // Vérifier la connexion à l'imprimante
//   useEffect(() => {
//     const checkPrintConnection = () => {
//       setIsPrintConnected(jsPrintManager.isConnected())
//     }

//     // Vérifier initialement
//     checkPrintConnection()

//     // Ajouter un écouteur pour les changements de statut
//     const cleanupListener = jsPrintManager.addStatusListener((connected) => {
//       setIsPrintConnected(connected)
//     })

//     return () => {
//       if (cleanupListener) cleanupListener()
//     }
//   }, [])

//   // Formater la date et l'heure correctement
//   const formatDateTime = (dateString) => {
//     if (!dateString) {
//       const now = new Date()
//       return now.toLocaleString('fr-FR', {
//         day: '2-digit',
//         month: '2-digit',
//         year: 'numeric',
//         hour: '2-digit',
//         minute: '2-digit'
//       })
//     }
    
//     const date = new Date(dateString)
//     return date.toLocaleString('fr-FR', {
//       day: '2-digit',
//       month: '2-digit',
//       year: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     })
//   }

//   // Formater la devise proprement
//   const formatCurrency = (amount, currency = shop?.currency || 'CDF') => {
//     if (!amount) amount = 0
    
//     // Format sans séparateur de milliers
//     const formatted = Math.round(amount).toString()
    
//     if (currency === 'CDF') {
//       return `${formatted} FC`
//     }
    
//     return `$${formatted}`
//   }

//   // Obtenir le nom de la méthode de paiement
//   const getPaymentMethodName = (method) => {
//     switch (method) {
//       case 'cash':
//         return 'Espèces'
//       case 'card':
//         return 'Carte'
//       case 'mobile':
//         return 'Mobile'
//       default:
//         return method
//     }
//   }

//   // Fonction pour charger une image en base64
//   const loadImageAsBase64 = async (url) => {
//     try {
//       const response = await fetch(url)
//       const blob = await response.blob()
//       return new Promise((resolve, reject) => {
//         const reader = new FileReader()
//         reader.onloadend = () => resolve(reader.result)
//         reader.onerror = reject
//         reader.readAsDataURL(blob)
//       })
//     } catch (error) {
//       console.error('Erreur chargement logo:', error)
//       return null
//     }
//   }

//   // Fonction pour dessiner une ligne de séparation FINE
//   const drawLine = (pdf, y, startX = 3, endX = 77) => {
//     pdf.setLineWidth(0.1) // Réduit de 0.5 à 0.1 (beaucoup plus fin)
//     pdf.line(startX, y, endX, y)
//   }

//   // Fonction pour créer le contenu texte de la facture (pour impression)
//   const createInvoiceText = () => {
//     if (!saleData) return ''

//     const saleNumber = saleData.sale_number || `FACT-${Date.now()}`
//     const saleDate = saleData.date_time || new Date().toISOString()
//     const clientInfo = saleData.clientInfo || {}
//     const items = saleData.items || []
//     const subtotal = saleData.subtotal || 0
//     const vat = saleData.vat_amount || 0
//     const vatRate = saleData.vat_rate || 16
//     const total = saleData.total || 0
//     const currency = saleData.currency || 'CDF'
//     const paymentMethod = saleData.payment_method || 'cash'

//     let text = ''
    
//     // === EN-TÊTE ===
//     text += `\x1B\x40`; // Initialiser l'imprimante
//     text += `\x1B\x61\x01`; // Centrer le texte
//     text += `${shop?.shop_name || 'ErrorShop'}\n`
//     text += `Tel: ${shop?.phone || '+233333'}\n`
//     text += `\x1B\x61\x00`; // Alignement à gauche
    
//     text += '='.repeat(48) + '\n\n'
    
//     // === TITRE FACTURE ===
//     text += `\x1B\x21\x10`; // Police en gras
//     text += 'FACTURE\n\n'
//     text += `\x1B\x21\x00`; // Police normale
    
//     // === NUMÉRO ET DATE ===
//     text += `N°: ${saleNumber}\n`
//     text += `Date: ${formatDateTime(saleDate)}\n\n`
    
//     // === INFORMATIONS CLIENT ===
//     if (clientInfo.name || clientInfo.phone) {
//       text += `\x1B\x21\x08`; // Police en gras
//       text += 'CLIENT\n'
//       text += `\x1B\x21\x00`; // Police normale
//       if (clientInfo.name) {
//         text += `Nom: ${clientInfo.name}\n`
//       }
//       if (clientInfo.phone) {
//         text += `Tel: ${clientInfo.phone}\n`
//       }
//       text += '\n'
//     }
    
//     // === LIGNE DE SÉPARATION ===
//     text += '-'.repeat(48) + '\n\n'
    
//     // === EN-TÊTE DU TABLEAU ===
//     text += `\x1B\x21\x08`; // Police en gras
//     text += 'Qty  Produit'.padEnd(40) + 'Total\n'
//     text += `\x1B\x21\x00`; // Police normale
//     text += '-'.repeat(48) + '\n'
    
//     // === ARTICLES ===
//     items.forEach((item) => {
//       const quantity = item.quantity || 1
//       const productName = item.name || 'Produit'
      
//       // Tronquer le nom si trop long
//       let displayName = productName
//       const maxNameLength = 30
//       if (displayName.length > maxNameLength) {
//         displayName = displayName.substring(0, maxNameLength - 3) + '...'
//       }
      
//       // Formatage des colonnes
//       const qtyCol = quantity.toString().padEnd(4)
//       const nameCol = displayName.padEnd(35)
//       const totalCol = formatCurrency(item.total || 0, currency).padStart(12)
      
//       text += `${qtyCol}${nameCol}${totalCol}\n`
//     })
    
//     // === LIGNE DE SÉPARATION ===
//     text += '-'.repeat(48) + '\n\n'
    
//     // === TOTAUX ===
//     text += 'SOUS-TOTAL:'.padEnd(40) + formatCurrency(subtotal, currency).padStart(12) + '\n'
//     text += `TVA (${vatRate}%):`.padEnd(40) + formatCurrency(vat, currency).padStart(12) + '\n'
//     text += '='.repeat(48) + '\n'
//     text += `\x1B\x21\x10`; // Police en gras
//     text += 'TOTAL:'.padEnd(40) + formatCurrency(total, currency).padStart(12) + '\n\n'
//     text += `\x1B\x21\x00`; // Police normale
    
//     // === MODE DE PAIEMENT ===
//     text += `Paiement: ${getPaymentMethodName(paymentMethod)}\n\n`
    
//     // === MESSAGE ===
//     text += 'Merci pour votre visite!\n\n'
    
//     if (shop?.invoice_message) {
//       text += `${shop.invoice_message}\n\n`
//     }
    
//     text += `Contact: ${shop?.phone || '+2439906644057'}\n`
//     text += '='.repeat(48) + '\n'
//     text += `\n\n\n\n\n` // Espace pour couper
    
//     return text
//   }

//   // Fonction pour créer le contenu PDF (pour téléchargement)
//   const createPDFContent = async () => {
//     if (!saleData) {
//       throw new Error('Aucune donnée de vente fournie')
//     }

//     // Récupérer les données
//     const saleNumber = saleData.sale_number || `FACT-${Date.now()}`
//     const saleDate = saleData.date_time || new Date().toISOString()
//     const clientInfo = saleData.clientInfo || {}
//     const items = saleData.items || []
//     const subtotal = saleData.subtotal || 0
//     const vat = saleData.vat_amount || 0
//     const vatRate = saleData.vat_rate || 16
//     const total = saleData.total || 0
//     const currency = saleData.currency || 'CDF'
//     const paymentMethod = saleData.payment_method || 'cash'

//     // Créer le PDF avec largeur de 80mm pour thermal printer
//     const pdf = new jsPDF({
//       orientation: 'portrait',
//       unit: 'mm',
//       format: [80, 297] // Hauteur augmentée pour contenir tout le contenu
//     })

//     // Variables de position et marges
//     let yPos = 5
//     const lineHeight = 4
//     const smallLineHeight = 3.5
//     const pageWidth = 80
    
//     // MARGES AUGMENTÉES
//     const leftMargin = 3
//     const rightMargin = 3
    
//     // Positions X pour les colonnes (AUGMENTÉES)
//     const colQtyX = leftMargin
//     const colProductX = leftMargin + 10  // Augmenté de 8 à 10
//     const colTotalX = pageWidth - rightMargin - 10  // Marge à droite pour les totaux

//     // Définir la police Courier
//     pdf.setFont('courier')
//     pdf.setFontSize(9)

//     // === EN-TÊTE AVEC LOGO ===
//     if (logoUrl) {
//       try {
//         const logoData = await loadImageAsBase64(logoUrl)
//         if (logoData) {
//           // Logo centré
//           pdf.addImage(logoData, 'PNG', 32.5, yPos, 15, 15)
//           yPos += 17
//         }
//       } catch (error) {
//         console.error('Erreur chargement logo:', error)
//       }
//     }

//     // Nom du shop centré
//     pdf.setFontSize(10)
//     pdf.setFont('courier', 'bold')
//     pdf.text(shop?.shop_name || 'ErrorShop', pageWidth / 2, yPos, { align: 'center' })
//     yPos += smallLineHeight

//     // Téléphone centré
//     pdf.setFontSize(8)
//     pdf.setFont('courier', 'normal')
//     pdf.text(`Tel: ${shop?.phone || '+233333'}`, pageWidth / 2, yPos, { align: 'center' })
//     yPos += lineHeight + 1

//     // === LIGNE DE SÉPARATION FINE ===
//     drawLine(pdf, yPos)
//     yPos += 3.5

//     // === TITRE FACTURE ===
//     pdf.setFontSize(11)
//     pdf.setFont('courier', 'bold')
//     pdf.text('FACTURE', pageWidth / 2, yPos, { align: 'center' })
//     yPos += lineHeight + 1

//     // === NUMÉRO ET DATE ===
//     pdf.setFontSize(8)
//     pdf.setFont('courier', 'normal')
//     pdf.text(`N°: ${saleNumber}`, leftMargin, yPos)
//     yPos += smallLineHeight
    
//     pdf.text(`Date: ${formatDateTime(saleDate)}`, leftMargin, yPos)
//     yPos += lineHeight + 1

//     // === INFORMATIONS CLIENT ===
//     if (clientInfo.name || clientInfo.phone) {
//       pdf.setFont('courier', 'bold')
//       pdf.setFontSize(9)
//       pdf.text('CLIENT', leftMargin, yPos)
//       yPos += smallLineHeight

//       pdf.setFont('courier', 'normal')
//       pdf.setFontSize(8)
//       if (clientInfo.name) {
//         pdf.text(`Nom: ${clientInfo.name}`, leftMargin, yPos)
//         yPos += smallLineHeight
//       }

//       if (clientInfo.phone) {
//         pdf.text(`Tel: ${clientInfo.phone}`, leftMargin, yPos)
//         yPos += smallLineHeight
//       }
      
//       yPos += 1.5
//     }

//     // === LIGNE DE SÉPARATION FINE ===
//     drawLine(pdf, yPos)
//     yPos += 3

//     // === EN-TÊTE DU TABLEAU ===
//     pdf.setFontSize(8)
//     pdf.setFont('courier', 'bold')
    
//     pdf.text('Qty', colQtyX, yPos)
//     pdf.text('Produit', colProductX, yPos)
//     pdf.text('Total', colTotalX, yPos, { align: 'right' })
//     yPos += smallLineHeight

//     // Ligne sous les en-têtes
//     drawLine(pdf, yPos)
//     yPos += 3

//     // === ARTICLES ===
//     pdf.setFont('courier', 'normal')
//     items.forEach((item) => {
//       const quantity = item.quantity || 1
//       const productName = item.name || 'Produit'
      
//       // Tronquer le nom si trop long (AUGMENTÉ pour utiliser l'espace)
//       let displayName = productName
//       const maxNameLength = 30  // Augmenté de 22 à 30
//       if (displayName.length > maxNameLength) {
//         displayName = displayName.substring(0, maxNameLength - 3) + '...'
//       }

//       // Ajouter les données avec plus d'espace
//       pdf.text(`${quantity}`, colQtyX, yPos)
//       pdf.text(displayName, colProductX, yPos)
//       pdf.text(formatCurrency(item.total || 0, currency), colTotalX, yPos, { align: 'right' })
      
//       yPos += smallLineHeight

//       // Vérifier si on dépasse la page
//       if (yPos > 285) {
//         pdf.addPage()
//         yPos = 10
//         pdf.setFont('courier')
//         pdf.setFontSize(8)
//       }
//     })

//     // === LIGNE DE SÉPARATION FINE ===
//     yPos += 0.5
//     drawLine(pdf, yPos)
//     yPos += 2

//     // === TOTAUX ===
//     // Sous-total
//     pdf.setFont('courier', 'normal')
//     pdf.setFontSize(8)
//     pdf.text('SOUS-TOTAL:', leftMargin, yPos)
//     pdf.text(formatCurrency(subtotal, currency), colTotalX, yPos, { align: 'right' })
//     yPos += smallLineHeight

//     // TVA
//     pdf.text(`TVA (${vatRate}%):`, leftMargin, yPos)
//     pdf.text(formatCurrency(vat, currency), colTotalX, yPos, { align: 'right' })
//     yPos += smallLineHeight

//     // Ligne de séparation avant total
//     pdf.setLineWidth(0.2)
//     drawLine(pdf, yPos)
//     pdf.setLineWidth(0.1)
//     yPos += 3

//     // TOTAL
//     pdf.setFont('courier', 'bold')
//     pdf.setFontSize(9)
//     pdf.text('TOTAL:', leftMargin, yPos)
//     pdf.text(formatCurrency(total, currency), colTotalX, yPos, { align: 'right' })
//     yPos += lineHeight + 1.5

//     // === MODE DE PAIEMENT ===
//     pdf.setFont('courier', 'normal')
//     pdf.setFontSize(8)
//     pdf.text(`Paiement: ${getPaymentMethodName(paymentMethod)}`, pageWidth / 2, yPos, { align: 'center' })
//     yPos += lineHeight + 2

//     // === MESSAGE ===
//     pdf.setFontSize(9)
//     pdf.text('Merci pour votre visite!', pageWidth / 2, yPos, { align: 'center' })
//     yPos += smallLineHeight

//     // Message du shop
//     if (shop?.invoice_message) {
//       pdf.setFontSize(8)
//       pdf.text(shop.invoice_message, pageWidth / 2, yPos, { align: 'center' })
//       yPos += smallLineHeight
//     }

//     // Contact
//     pdf.setFontSize(7)
//     pdf.text(`Contact: ${shop?.phone || '+2439906644057'}`, pageWidth / 2, yPos, { align: 'center' })

//     return {
//       pdf,
//       saleNumber
//     }
//   }

//   // Générer et télécharger le PDF
//   const generatePDF = async () => {
//     if (!saleData) {
//       console.error('Aucune donnée de vente fournie')
//       return
//     }

//     setGenerating(true)
//     setPrintStatus('')

//     try {
//       const { pdf, saleNumber } = await createPDFContent()
      
//       // Télécharger le PDF
//       pdf.save(`Facture_${saleNumber}.pdf`)

//       // Callback
//       if (onDownloadComplete) {
//         onDownloadComplete()
//       }

//     } catch (error) {
//       console.error('Erreur génération PDF:', error)
//       alert('Erreur lors de la génération du PDF')
//     } finally {
//       setGenerating(false)
//     }
//   }

//   // Imprimer la facture directement (version texte)
//   const printInvoice = async () => {
//     if (!saleData) {
//       alert('Aucune donnée de vente à imprimer')
//       return
//     }

//     if (!selectedPrinter) {
//       alert('Veuillez sélectionner une imprimante dans la page de gestion des imprimantes')
//       return
//     }

//     if (!isPrintConnected) {
//       alert('Impossible de se connecter au service d\'impression. Vérifiez que JSPrintManager est lancé.')
//       return
//     }

//     setPrinting(true)
//     setPrintStatus('Préparation de l\'impression...')

//     try {
//       // 1. Initialiser JSPrintManager si pas encore fait
//       if (!jsPrintManager.isConnected()) {
//         setPrintStatus('Connexion au service d\'impression...')
//         try {
//           await jsPrintManager.initialize()
//           // Attendre un peu pour la connexion
//           await new Promise(resolve => setTimeout(resolve, 1000))
//         } catch (error) {
//           throw new Error('Service d\'impression non disponible')
//         }
//       }

//       if (!jsPrintManager.isConnected()) {
//         throw new Error('Non connecté au service d\'impression')
//       }

//       // 2. Créer le texte de la facture
//       setPrintStatus('Création du contenu...')
//       const invoiceText = createInvoiceText()

//       console.log('Texte à imprimer:', invoiceText)

//       // 3. Obtenir l'instance et imprimer le texte
//       setPrintStatus('Envoi vers l\'imprimante...')
//       const instance = jsPrintManager.getInstance()
//       const { ClientPrintJob, InstalledPrinter, PrintFileTXT } = instance
      
//       const cpj = new ClientPrintJob()
//       cpj.clientPrinter = new InstalledPrinter(selectedPrinter)

//       // Créer un blob avec le texte
//       const textBlob = new Blob([invoiceText], { type: 'text/plain;charset=utf-8' })
      
//       // Convertir le blob en ArrayBuffer pour l'impression
//       const arrayBuffer = await textBlob.arrayBuffer()
      
//       // Utiliser DIRECTEMENT le contenu texte - NE PAS créer d'URL
//       const printFile = new PrintFileTXT(
//         arrayBuffer, // Passer le contenu directement
//         'facture.txt',
//         1 // Nombre de copies
//         // Pas besoin de spécifier FileSourceType quand on passe directement le contenu
//       )
      
//       cpj.files.push(printFile)

//       // Gérer l'impression
//       await new Promise((resolve, reject) => {
//         cpj.onFinished = () => {
//           console.log('Impression texte terminée avec succès')
//           resolve()
//         };

//         cpj.onError = (error) => {
//           console.error('Erreur d\'impression texte:', error)
//           reject(new Error(`Échec de l'impression: ${error.message || 'Erreur inconnue'}`))
//         };

//         cpj.sendToClient();
//       });

//       setPrintStatus('Facture imprimée avec succès!')
//       setTimeout(() => setPrintStatus(''), 3000)

//     } catch (error) {
//       console.error('Erreur impression:', error)
//       setPrintStatus(`Erreur: ${error.message}`)
//       setTimeout(() => setPrintStatus(''), 5000)
//       alert(`Erreur d'impression: ${error.message}`)
//     } finally {
//       setPrinting(false)
//     }
//   }

//   // Fonction pour imprimer et télécharger
//   const handlePrintAndDownload = async () => {
//     try {
//       // D'abord imprimer
//       await printInvoice()
//       // Attendre un peu puis télécharger
//       await new Promise(resolve => setTimeout(resolve, 500))
//       await generatePDF()
//     } catch (error) {
//       console.error('Erreur:', error)
//       // En cas d'erreur d'impression, on peut toujours télécharger
//       try {
//         await generatePDF()
//       } catch (downloadError) {
//         console.error('Erreur téléchargement:', downloadError)
//       }
//     }
//   }

//   if (!saleData) {
//     return null
//   }

//   return (
//     <div className="flex flex-col sm:flex-row gap-2">
//       {/* Bouton Télécharger */}
//       <button
//         onClick={generatePDF}
//         disabled={generating || shopLoading}
//         className="flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-1 min-w-[120px]"
//       >
//         {generating ? (
//           <>
//             <Loader2 className="h-5 w-5 mr-2 animate-spin" />
//             Génération...
//           </>
//         ) : (
//           <>
//             <Download className="h-5 w-5 mr-2" />
//             Télécharger
//           </>
//         )}
//       </button>

//       {/* Bouton Imprimer */}
//       <button
//         onClick={printInvoice}
//         disabled={printing || shopLoading || !selectedPrinter || !isPrintConnected}
//         className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-1 min-w-[120px]"
//         title={!selectedPrinter ? "Sélectionnez une imprimante d'abord" : !isPrintConnected ? "JSPrintManager non connecté" : ""}
//       >
//         {printing ? (
//           <>
//             <Loader2 className="h-5 w-5 mr-2 animate-spin" />
//             Impression...
//           </>
//         ) : (
//           <>
//             <Printer className="h-5 w-5 mr-2" />
//             Imprimer
//           </>
//         )}
//       </button>

//       {/* Bouton Imprimer et Télécharger */}
//       <button
//         onClick={handlePrintAndDownload}
//         disabled={generating || printing || shopLoading || !selectedPrinter || !isPrintConnected}
//         className="flex items-center justify-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-1 min-w-[120px]"
//         title={!selectedPrinter ? "Sélectionnez une imprimante d'abord" : !isPrintConnected ? "JSPrintManager non connecté" : ""}
//       >
//         {generating || printing ? (
//           <>
//             <Loader2 className="h-5 w-5 mr-2 animate-spin" />
//             Traitement...
//           </>
//         ) : (
//           <>
//             <Printer className="h-5 w-5 mr-2" />
//             Imprimer & Tél.
//           </>
//         )}
//       </button>

//       {/* Statut de l'impression */}
//       {printStatus && (
//         <div className="mt-2 text-sm text-center w-full">
//           <p className={`px-3 py-1 rounded-lg ${
//             printStatus.includes('Erreur') 
//               ? 'bg-red-100 text-red-700' 
//               : 'bg-blue-100 text-blue-700'
//           }`}>
//             {printStatus}
//           </p>
//           {selectedPrinter && !printStatus.includes('Erreur') && (
//             <p className="text-xs text-gray-500 mt-1">
//               Imprimante: <span className="font-medium">{selectedPrinter}</span>
//             </p>
//           )}
//         </div>
//       )}

//       {/* Information sur l'imprimante */}
//       {!selectedPrinter && !printing && (
//         <div className="mt-2 w-full">
//           <p className="text-xs text-amber-600 text-center">
//             ⚠️ Sélectionnez d'abord une imprimante dans la page de gestion des imprimantes
//           </p>
//         </div>
//       )}

//       {selectedPrinter && !isPrintConnected && !printing && (
//         <div className="mt-2 w-full">
//           <div className="text-xs text-amber-600 text-center space-y-1">
//             <p>⚠️ JSPrintManager non connecté</p>
//             <p className="text-xs">
//               <a 
//                 href="https://neodynamic.com/downloads/jspm" 
//                 target="_blank" 
//                 rel="noopener noreferrer"
//                 className="text-blue-600 hover:underline"
//               >
//                 Télécharger l'application
//               </a>
//               , lancez-la puis rafraîchissez la page
//             </p>
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }
'use client'

import { useState, useEffect } from 'react'
import { Download, Loader2, Printer } from 'lucide-react'
import jsPDF from 'jspdf'
import { useShop } from '@/hooks/useShop'
import { jsPrintManager } from '@/lib/jsprintmanager-singleton'

const PRINTER_STORAGE_KEY = 'selected-printer'

export default function FactureGenerator({ saleData, onDownloadComplete }) {
  const [generating, setGenerating] = useState(false)
  const [printing, setPrinting] = useState(false)
  const [printStatus, setPrintStatus] = useState('')
  const { shop, loading: shopLoading } = useShop()
  const [logoUrl, setLogoUrl] = useState(null)
  const [selectedPrinter, setSelectedPrinter] = useState('')
  const [isPrintConnected, setIsPrintConnected] = useState(false)
  const [pdfBlobUrl, setPdfBlobUrl] = useState(null)

  // Charger le logo
  useEffect(() => {
    if (shop?.shop_icon) {
      setLogoUrl(shop.shop_icon)
    }
  }, [shop])

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

    // Vérifier initialement
    checkPrintConnection()

    // Ajouter un écouteur pour les changements de statut
    const cleanupListener = jsPrintManager.addStatusListener((connected) => {
      setIsPrintConnected(connected)
    })

    return () => {
      if (cleanupListener) cleanupListener()
      // Nettoyer l'URL blob lors du démontage
      if (pdfBlobUrl) {
        URL.revokeObjectURL(pdfBlobUrl)
      }
    }
  }, [])

  // Nettoyer l'URL blob quand elle change
  useEffect(() => {
    return () => {
      if (pdfBlobUrl) {
        URL.revokeObjectURL(pdfBlobUrl)
      }
    }
  }, [pdfBlobUrl])

  // Formater la date et l'heure correctement
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

  // Formater la devise proprement
  const formatCurrency = (amount, currency = shop?.currency || 'CDF') => {
    if (!amount) amount = 0
    
    // Format sans séparateur de milliers
    const formatted = Math.round(amount).toString()
    
    if (currency === 'CDF') {
      return `${formatted} FC`
    }
    
    return `$${formatted}`
  }

  // Obtenir le nom de la méthode de paiement
  const getPaymentMethodName = (method) => {
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

  // Fonction pour charger une image en base64
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

  // Fonction pour dessiner une ligne de séparation FINE
  const drawLine = (pdf, y, startX = 3, endX = 77) => {
    pdf.setLineWidth(0.1) // Réduit de 0.5 à 0.1 (beaucoup plus fin)
    pdf.line(startX, y, endX, y)
  }

  // Fonction pour créer le PDF et retourner un blob URL
  const createPDF = async () => {
    if (!saleData) {
      throw new Error('Aucune donnée de vente fournie')
    }

    // Récupérer les données
    const saleNumber = saleData.sale_number || `FACT-${Date.now()}`
    const saleDate = saleData.date_time || new Date().toISOString()
    const clientInfo = saleData.clientInfo || {}
    const items = saleData.items || []
    const subtotal = saleData.subtotal || 0
    const vat = saleData.vat_amount || 0
    const vatRate = saleData.vat_rate || 16
    const total = saleData.total || 0
    const currency = saleData.currency || 'CDF'
    const paymentMethod = saleData.payment_method || 'cash'

    // Créer le PDF avec largeur de 80mm pour thermal printer
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: [80, 297] // Hauteur augmentée pour contenir tout le contenu
    })

    // Variables de position et marges
    let yPos = 5
    const lineHeight = 4
    const smallLineHeight = 3.5
    const pageWidth = 80
    
    // MARGES AUGMENTÉES
    const leftMargin = 3
    const rightMargin = 3
    
    // Positions X pour les colonnes (AUGMENTÉES)
    const colQtyX = leftMargin
    const colProductX = leftMargin + 10  // Augmenté de 8 à 10
    const colTotalX = pageWidth - rightMargin - 10  // Marge à droite pour les totaux

    // Définir la police Courier
    pdf.setFont('courier')
    pdf.setFontSize(9)

    // === EN-TÊTE AVEC LOGO ===
    if (logoUrl) {
      try {
        const logoData = await loadImageAsBase64(logoUrl)
        if (logoData) {
          // Logo centré
          pdf.addImage(logoData, 'PNG', 32.5, yPos, 15, 15)
          yPos += 17
        }
      } catch (error) {
        console.error('Erreur chargement logo:', error)
      }
    }

    // Nom du shop centré
    pdf.setFontSize(10)
    pdf.setFont('courier', 'bold')
    pdf.text(shop?.shop_name || 'ErrorShop', pageWidth / 2, yPos, { align: 'center' })
    yPos += smallLineHeight

    // Téléphone centré
    pdf.setFontSize(8)
    pdf.setFont('courier', 'normal')
    pdf.text(`Tel: ${shop?.phone || '+233333'}`, pageWidth / 2, yPos, { align: 'center' })
    yPos += lineHeight + 1

    // === LIGNE DE SÉPARATION FINE ===
    drawLine(pdf, yPos)
    yPos += 3.5

    // === TITRE FACTURE ===
    pdf.setFontSize(11)
    pdf.setFont('courier', 'bold')
    pdf.text('FACTURE', pageWidth / 2, yPos, { align: 'center' })
    yPos += lineHeight + 1

    // === NUMÉRO ET DATE ===
    pdf.setFontSize(8)
    pdf.setFont('courier', 'normal')
    pdf.text(`N°: ${saleNumber}`, leftMargin, yPos)
    yPos += smallLineHeight
    
    pdf.text(`Date: ${formatDateTime(saleDate)}`, leftMargin, yPos)
    yPos += lineHeight + 1

    // === INFORMATIONS CLIENT ===
    if (clientInfo.name || clientInfo.phone) {
      pdf.setFont('courier', 'bold')
      pdf.setFontSize(9)
      pdf.text('CLIENT', leftMargin, yPos)
      yPos += smallLineHeight

      pdf.setFont('courier', 'normal')
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

    // === LIGNE DE SÉPARATION FINE ===
    drawLine(pdf, yPos)
    yPos += 3

    // === EN-TÊTE DU TABLEAU ===
    pdf.setFontSize(8)
    pdf.setFont('courier', 'bold')
    
    pdf.text('Qty', colQtyX, yPos)
    pdf.text('Produit', colProductX, yPos)
    pdf.text('Total', colTotalX, yPos, { align: 'right' })
    yPos += smallLineHeight

    // Ligne sous les en-têtes
    drawLine(pdf, yPos)
    yPos += 3

    // === ARTICLES ===
    pdf.setFont('courier', 'normal')
    items.forEach((item) => {
      const quantity = item.quantity || 1
      const productName = item.name || 'Produit'
      
      // Tronquer le nom si trop long (AUGMENTÉ pour utiliser l'espace)
      let displayName = productName
      const maxNameLength = 30  // Augmenté de 22 à 30
      if (displayName.length > maxNameLength) {
        displayName = displayName.substring(0, maxNameLength - 3) + '...'
      }

      // Ajouter les données avec plus d'espace
      pdf.text(`${quantity}`, colQtyX, yPos)
      pdf.text(displayName, colProductX, yPos)
      pdf.text(formatCurrency(item.total || 0, currency), colTotalX, yPos, { align: 'right' })
      
      yPos += smallLineHeight

      // Vérifier si on dépasse la page
      if (yPos > 285) {
        pdf.addPage()
        yPos = 10
        pdf.setFont('courier')
        pdf.setFontSize(8)
      }
    })

    // === LIGNE DE SÉPARATION FINE ===
    yPos += 0.5
    drawLine(pdf, yPos)
    yPos += 2

    // === TOTAUX ===
    // Sous-total
    pdf.setFont('courier', 'normal')
    pdf.setFontSize(8)
    pdf.text('SOUS-TOTAL:', leftMargin, yPos)
    pdf.text(formatCurrency(subtotal, currency), colTotalX, yPos, { align: 'right' })
    yPos += smallLineHeight

    // TVA
    pdf.text(`TVA (${vatRate}%):`, leftMargin, yPos)
    pdf.text(formatCurrency(vat, currency), colTotalX, yPos, { align: 'right' })
    yPos += smallLineHeight

    // Ligne de séparation avant total
    pdf.setLineWidth(0.2)
    drawLine(pdf, yPos)
    pdf.setLineWidth(0.1)
    yPos += 3

    // TOTAL
    pdf.setFont('courier', 'bold')
    pdf.setFontSize(9)
    pdf.text('TOTAL:', leftMargin, yPos)
    pdf.text(formatCurrency(total, currency), colTotalX, yPos, { align: 'right' })
    yPos += lineHeight + 1.5

    // === MODE DE PAIEMENT ===
    pdf.setFont('courier', 'normal')
    pdf.setFontSize(8)
    pdf.text(`Paiement: ${getPaymentMethodName(paymentMethod)}`, pageWidth / 2, yPos, { align: 'center' })
    yPos += lineHeight + 2

    // === MESSAGE ===
    pdf.setFontSize(9)
    pdf.text('Merci pour votre visite!', pageWidth / 2, yPos, { align: 'center' })
    yPos += smallLineHeight

    // Message du shop
    if (shop?.invoice_message) {
      pdf.setFontSize(8)
      pdf.text(shop.invoice_message, pageWidth / 2, yPos, { align: 'center' })
      yPos += smallLineHeight
    }

    // Contact
    pdf.setFontSize(7)
    pdf.text(`Contact: ${shop?.phone || '+2439906644057'}`, pageWidth / 2, yPos, { align: 'center' })

    // Générer le PDF et créer un blob URL
    const pdfBlob = pdf.output('blob')
    const blobUrl = URL.createObjectURL(pdfBlob)
    
    // Nettoyer l'ancienne URL blob
    if (pdfBlobUrl) {
      URL.revokeObjectURL(pdfBlobUrl)
    }
    
    setPdfBlobUrl(blobUrl)

    return {
      pdf,
      blobUrl,
      saleNumber
    }
  }

  // Générer et télécharger le PDF
  const generatePDF = async () => {
    if (!saleData) {
      console.error('Aucune donnée de vente fournie')
      return
    }

    setGenerating(true)
    setPrintStatus('')

    try {
      const { pdf, saleNumber } = await createPDF()
      
      // Télécharger le PDF
      pdf.save(`Facture_${saleNumber}.pdf`)

      // Callback
      if (onDownloadComplete) {
        onDownloadComplete()
      }

    } catch (error) {
      console.error('Erreur génération PDF:', error)
      alert('Erreur lors de la génération du PDF')
    } finally {
      setGenerating(false)
    }
  }

  // Imprimer le PDF via JSPrintManager (version corrigée)
  const printInvoice = async () => {
    if (!saleData) {
      alert('Aucune donnée de vente à imprimer')
      return
    }

    if (!selectedPrinter) {
      alert('Veuillez sélectionner une imprimante dans la page de gestion des imprimantes')
      return
    }

    if (!isPrintConnected) {
      alert('Impossible de se connecter au service d\'impression. Vérifiez que JSPrintManager est lancé.')
      return
    }

    setPrinting(true)
    setPrintStatus('Préparation de l\'impression...')

    try {
      // 1. Initialiser JSPrintManager si pas encore fait
      if (!jsPrintManager.isConnected()) {
        setPrintStatus('Connexion au service d\'impression...')
        try {
          await jsPrintManager.initialize()
          // Attendre un peu pour la connexion
          await new Promise(resolve => setTimeout(resolve, 1000))
        } catch (error) {
          throw new Error('Service d\'impression non disponible')
        }
      }

      if (!jsPrintManager.isConnected()) {
        throw new Error('Non connecté au service d\'impression')
      }

      // 2. Créer le PDF et obtenir l'URL blob
      setPrintStatus('Génération du PDF...')
      const { blobUrl } = await createPDF()
      
      if (!blobUrl) {
        throw new Error('Impossible de générer le PDF')
      }

      // 3. Obtenir l'instance JSPrintManager
      const instance = jsPrintManager.getInstance()
      const { ClientPrintJob, InstalledPrinter, PrintFilePDF, FileSourceType } = instance
      
      // 4. Créer un job d'impression
      const cpj = new ClientPrintJob()
      cpj.clientPrinter = new InstalledPrinter(selectedPrinter)

      // 5. IMPORTANT: Utiliser PrintFilePDF AVEC UNE URL comme dans l'exemple
      // Le premier paramètre doit être une string (URL), pas un ArrayBuffer
      const printFile = new PrintFilePDF(
        blobUrl,                // filePath (URL string)
        FileSourceType.URL,     // fileSourceType
        'facture.pdf',          // fileName
        1                       // copies
      )
      
      cpj.files.push(printFile)

      // 6. Gérer l'impression
      await new Promise((resolve, reject) => {
        cpj.onFinished = () => {
          console.log('Impression PDF terminée avec succès')
          resolve()
        }

        cpj.onError = (error) => {
          console.error('Erreur d\'impression PDF:', error)
          reject(new Error(`Échec de l'impression: ${error.message || 'Erreur inconnue'}`))
        }

        cpj.sendToClient()
      })

      setPrintStatus('Facture imprimée avec succès!')
      setTimeout(() => setPrintStatus(''), 3000)

    } catch (error) {
      console.error('Erreur impression:', error)
      setPrintStatus(`Erreur: ${error.message}`)
      setTimeout(() => setPrintStatus(''), 5000)
      alert(`Erreur d'impression: ${error.message}`)
    } finally {
      setPrinting(false)
    }
  }

  // Version alternative pour vérifier si PrintFilePDF existe
  const printInvoiceAlternative = async () => {
    if (!saleData || !selectedPrinter || !isPrintConnected) {
      alert('Configuration requise manquante')
      return
    }

    setPrinting(true)
    setPrintStatus('Préparation...')

    try {
      // 1. Vérifier la connexion
      if (!jsPrintManager.isConnected()) {
        await jsPrintManager.initialize()
        await new Promise(resolve => setTimeout(resolve, 1000))
      }

      if (!jsPrintManager.isConnected()) {
        throw new Error('Non connecté au service d\'impression')
      }

      // 2. Créer le PDF
      const { blobUrl } = await createPDF()
      
      // 3. Obtenir l'instance
      const instance = jsPrintManager.getInstance()
      const { ClientPrintJob, InstalledPrinter } = instance
      
      // Vérifier si PrintFilePDF existe
      if (!instance.PrintFilePDF) {
        throw new Error('PrintFilePDF n\'est pas disponible dans cette version de JSPrintManager')
      }
      
      const { PrintFilePDF, FileSourceType } = instance

      // 4. Essayer avec PrintFile standard si PrintFilePDF ne fonctionne pas
      let printFile
      
      try {
        // Essayer PrintFilePDF d'abord
        printFile = new PrintFilePDF(
          blobUrl,
          FileSourceType.URL,
          'facture.pdf',
          1
        )
      } catch (pdfError) {
        console.warn('PrintFilePDF échoué, essai avec PrintFile standard:', pdfError)
        
        // Fallback: utiliser PrintFile standard
        if (instance.PrintFile) {
          printFile = new instance.PrintFile(
            blobUrl,
            FileSourceType.URL,
            'facture.pdf',
            1
          )
        } else {
          throw new Error('Aucune méthode d\'impression PDF disponible')
        }
      }

      // 5. Créer et envoyer le job
      const cpj = new ClientPrintJob()
      cpj.clientPrinter = new InstalledPrinter(selectedPrinter)
      cpj.files.push(printFile)

      await new Promise((resolve, reject) => {
        cpj.onFinished = resolve
        cpj.onError = reject
        cpj.sendToClient()
      })

      setPrintStatus('Impression réussie!')
      setTimeout(() => setPrintStatus(''), 3000)

    } catch (error) {
      console.error('Erreur:', error)
      setPrintStatus(`Erreur: ${error.message}`)
      alert(`Erreur d'impression: ${error.message}`)
    } finally {
      setPrinting(false)
    }
  }

  // Fonction pour imprimer et télécharger
  const handlePrintAndDownload = async () => {
    // D'abord télécharger
    await generatePDF()
    
    // Ensuite imprimer si tout est configuré
    if (selectedPrinter && isPrintConnected) {
      await new Promise(resolve => setTimeout(resolve, 500))
      await printInvoiceAlternative()
    }
  }

  if (!saleData) {
    return null
  }

  return (
    <div className="flex flex-col sm:flex-row gap-2">
      {/* Bouton Télécharger */}
      <button
        onClick={generatePDF}
        disabled={generating || shopLoading}
        className="flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-1 min-w-[120px]"
      >
        {generating ? (
          <>
            <Loader2 className="h-5 w-5 mr-2 animate-spin" />
            Génération...
          </>
        ) : (
          <>
            <Download className="h-5 w-5 mr-2" />
            Télécharger
          </>
        )}
      </button>

      {/* Bouton Imprimer */}
      <button
        onClick={printInvoiceAlternative}
        disabled={printing || shopLoading || !selectedPrinter || !isPrintConnected}
        className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-1 min-w-[120px]"
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
            Imprimer
          </>
        )}
      </button>

      {/* Bouton Imprimer et Télécharger */}
      <button
        onClick={handlePrintAndDownload}
        disabled={generating || printing || shopLoading}
        className="flex items-center justify-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-1 min-w-[120px]"
      >
        {generating || printing ? (
          <>
            <Loader2 className="h-5 w-5 mr-2 animate-spin" />
            Traitement...
          </>
        ) : (
          <>
            <Printer className="h-5 w-5 mr-2" />
            Imprimer & Tél.
          </>
        )}
      </button>

      {/* Statut de l'impression */}
      {printStatus && (
        <div className="mt-2 text-sm text-center w-full">
          <p className={`px-3 py-1 rounded-lg ${
            printStatus.includes('Erreur') 
              ? 'bg-red-100 text-red-700' 
              : 'bg-blue-100 text-blue-700'
          }`}>
            {printStatus}
          </p>
          {selectedPrinter && !printStatus.includes('Erreur') && (
            <p className="text-xs text-gray-500 mt-1">
              Imprimante: <span className="font-medium">{selectedPrinter}</span>
            </p>
          )}
        </div>
      )}

      {/* Information sur l'imprimante */}
      {!selectedPrinter && !printing && (
        <div className="mt-2 w-full">
          <p className="text-xs text-amber-600 text-center">
            ⚠️ Sélectionnez d'abord une imprimante dans la page de gestion des imprimantes
          </p>
        </div>
      )}

      {selectedPrinter && !isPrintConnected && !printing && (
        <div className="mt-2 w-full">
          <div className="text-xs text-amber-600 text-center space-y-1">
            <p>⚠️ JSPrintManager non connecté</p>
            <p className="text-xs">
              <a 
                href="https://neodynamic.com/downloads/jspm" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Télécharger l'application
              </a>
              , lancez-la puis rafraîchissez la page
            </p>
          </div>
        </div>
      )}
    </div>
  )
}