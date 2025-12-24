
// // // // 'use client'

// // // // import { useState, useEffect } from 'react'
// // // // import { Download, Loader2, Printer } from 'lucide-react'
// // // // import jsPDF from 'jspdf'
// // // // import { useShop } from '@/hooks/useShop'
// // // // import { jsPrintManager } from '@/lib/jsprintmanager-singleton'

// // // // const PRINTER_STORAGE_KEY = 'selected-printer'

// // // // export default function FactureGenerator({ saleData, onDownloadComplete }) {
// // // //   const [generating, setGenerating] = useState(false)
// // // //   const [printing, setPrinting] = useState(false)
// // // //   const [printStatus, setPrintStatus] = useState('')
// // // //   const { shop, loading: shopLoading } = useShop()
// // // //   const [logoUrl, setLogoUrl] = useState(null)
// // // //   const [selectedPrinter, setSelectedPrinter] = useState('')
// // // //   const [isPrintConnected, setIsPrintConnected] = useState(false)
// // // //   const [pdfBlobUrl, setPdfBlobUrl] = useState(null)

// // // //   // Charger le logo
// // // //   useEffect(() => {
// // // //     if (shop?.shop_icon) {
// // // //       setLogoUrl(shop.shop_icon)
// // // //     }
// // // //   }, [shop])

// // // //   // Charger l'imprimante sélectionnée
// // // //   useEffect(() => {
// // // //     if (typeof window !== 'undefined') {
// // // //       const savedPrinter = localStorage.getItem(PRINTER_STORAGE_KEY)
// // // //       if (savedPrinter) {
// // // //         setSelectedPrinter(savedPrinter)
// // // //       }
// // // //     }
// // // //   }, [])

// // // //   // Vérifier la connexion à l'imprimante
// // // //   useEffect(() => {
// // // //     const checkPrintConnection = () => {
// // // //       setIsPrintConnected(jsPrintManager.isConnected())
// // // //     }

// // // //     // Vérifier initialement
// // // //     checkPrintConnection()

// // // //     // Ajouter un écouteur pour les changements de statut
// // // //     const cleanupListener = jsPrintManager.addStatusListener((connected) => {
// // // //       setIsPrintConnected(connected)
// // // //     })

// // // //     return () => {
// // // //       if (cleanupListener) cleanupListener()
// // // //       // Nettoyer l'URL blob lors du démontage
// // // //       if (pdfBlobUrl) {
// // // //         URL.revokeObjectURL(pdfBlobUrl)
// // // //       }
// // // //     }
// // // //   }, [])

// // // //   // Nettoyer l'URL blob quand elle change
// // // //   useEffect(() => {
// // // //     return () => {
// // // //       if (pdfBlobUrl) {
// // // //         URL.revokeObjectURL(pdfBlobUrl)
// // // //       }
// // // //     }
// // // //   }, [pdfBlobUrl])

// // // //   // Formater la date et l'heure correctement
// // // //   const formatDateTime = (dateString) => {
// // // //     if (!dateString) {
// // // //       const now = new Date()
// // // //       return now.toLocaleString('fr-FR', {
// // // //         day: '2-digit',
// // // //         month: '2-digit',
// // // //         year: 'numeric',
// // // //         hour: '2-digit',
// // // //         minute: '2-digit'
// // // //       })
// // // //     }
    
// // // //     const date = new Date(dateString)
// // // //     return date.toLocaleString('fr-FR', {
// // // //       day: '2-digit',
// // // //       month: '2-digit',
// // // //       year: 'numeric',
// // // //       hour: '2-digit',
// // // //       minute: '2-digit'
// // // //     })
// // // //   }

// // // //   // Formater la devise proprement
// // // //   const formatCurrency = (amount, currency = shop?.currency || 'CDF') => {
// // // //     if (!amount) amount = 0
    
// // // //     // Format sans séparateur de milliers
// // // //     const formatted = Math.round(amount).toString()
    
// // // //     if (currency === 'CDF') {
// // // //       return `${formatted} FC`
// // // //     }
    
// // // //     return `$${formatted}`
// // // //   }

// // // //   // Obtenir le nom de la méthode de paiement
// // // //   const getPaymentMethodName = (method) => {
// // // //     switch (method) {
// // // //       case 'cash':
// // // //         return 'Espèces'
// // // //       case 'card':
// // // //         return 'Carte'
// // // //       case 'mobile':
// // // //         return 'Mobile'
// // // //       default:
// // // //         return method
// // // //     }
// // // //   }

// // // //   // Fonction pour charger une image en base64
// // // //   const loadImageAsBase64 = async (url) => {
// // // //     try {
// // // //       const response = await fetch(url)
// // // //       const blob = await response.blob()
// // // //       return new Promise((resolve, reject) => {
// // // //         const reader = new FileReader()
// // // //         reader.onloadend = () => resolve(reader.result)
// // // //         reader.onerror = reject
// // // //         reader.readAsDataURL(blob)
// // // //       })
// // // //     } catch (error) {
// // // //       console.error('Erreur chargement logo:', error)
// // // //       return null
// // // //     }
// // // //   }

// // // //   // Fonction pour dessiner une ligne de séparation FINE
// // // //   const drawLine = (pdf, y, startX = 3, endX = 77) => {
// // // //     pdf.setLineWidth(0.1) // Réduit de 0.5 à 0.1 (beaucoup plus fin)
// // // //     pdf.line(startX, y, endX, y)
// // // //   }

// // // //   // Fonction pour créer le PDF et retourner un blob URL
// // // //   const createPDF = async () => {
// // // //     if (!saleData) {
// // // //       throw new Error('Aucune donnée de vente fournie')
// // // //     }

// // // //     // Récupérer les données
// // // //     const saleNumber = saleData.sale_number || `FACT-${Date.now()}`
// // // //     const saleDate = saleData.date_time || new Date().toISOString()
// // // //     const clientInfo = saleData.clientInfo || {}
// // // //     const items = saleData.items || []
// // // //     const subtotal = saleData.subtotal || 0
// // // //     const vat = saleData.vat_amount || 0
// // // //     const vatRate = saleData.vat_rate || 16
// // // //     const total = saleData.total || 0
// // // //     const currency = saleData.currency || 'CDF'
// // // //     const paymentMethod = saleData.payment_method || 'cash'

// // // //     // Créer le PDF avec largeur de 80mm pour thermal printer
// // // //     const pdf = new jsPDF({
// // // //       orientation: 'portrait',
// // // //       unit: 'mm',
// // // //       format: [80, 297] // Hauteur augmentée pour contenir tout le contenu
// // // //     })

// // // //     // Variables de position et marges
// // // //     let yPos = 5
// // // //     const lineHeight = 4
// // // //     const smallLineHeight = 3.5
// // // //     const pageWidth = 80
    
// // // //     // MARGES AUGMENTÉES
// // // //     const leftMargin = 3
// // // //     const rightMargin = 3
    
// // // //     // Positions X pour les colonnes (AUGMENTÉES)
// // // //     const colQtyX = leftMargin
// // // //     const colProductX = leftMargin + 10  // Augmenté de 8 à 10
// // // //     const colTotalX = pageWidth - rightMargin - 10  // Marge à droite pour les totaux

// // // //     // Définir la police Courier
// // // //     pdf.setFont('courier')
// // // //     pdf.setFontSize(9)

// // // //     // === EN-TÊTE AVEC LOGO ===
// // // //     if (logoUrl) {
// // // //       try {
// // // //         const logoData = await loadImageAsBase64(logoUrl)
// // // //         if (logoData) {
// // // //           // Logo centré
// // // //           pdf.addImage(logoData, 'PNG', 32.5, yPos, 15, 15)
// // // //           yPos += 17
// // // //         }
// // // //       } catch (error) {
// // // //         console.error('Erreur chargement logo:', error)
// // // //       }
// // // //     }

// // // //     // Nom du shop centré
// // // //     pdf.setFontSize(10)
// // // //     pdf.setFont('courier', 'bold')
// // // //     pdf.text(shop?.shop_name || 'ErrorShop', pageWidth / 2, yPos, { align: 'center' })
// // // //     yPos += smallLineHeight

// // // //     // Téléphone centré
// // // //     pdf.setFontSize(8)
// // // //     pdf.setFont('courier', 'normal')
// // // //     pdf.text(`Tel: ${shop?.phone || '+233333'}`, pageWidth / 2, yPos, { align: 'center' })
// // // //     yPos += lineHeight + 1

// // // //     // === LIGNE DE SÉPARATION FINE ===
// // // //     drawLine(pdf, yPos)
// // // //     yPos += 3.5

// // // //     // === TITRE FACTURE ===
// // // //     pdf.setFontSize(11)
// // // //     pdf.setFont('courier', 'bold')
// // // //     pdf.text('FACTURE', pageWidth / 2, yPos, { align: 'center' })
// // // //     yPos += lineHeight + 1

// // // //     // === NUMÉRO ET DATE ===
// // // //     pdf.setFontSize(8)
// // // //     pdf.setFont('courier', 'normal')
// // // //     pdf.text(`N°: ${saleNumber}`, leftMargin, yPos)
// // // //     yPos += smallLineHeight
    
// // // //     pdf.text(`Date: ${formatDateTime(saleDate)}`, leftMargin, yPos)
// // // //     yPos += lineHeight + 1

// // // //     // === INFORMATIONS CLIENT ===
// // // //     if (clientInfo.name || clientInfo.phone) {
// // // //       pdf.setFont('courier', 'bold')
// // // //       pdf.setFontSize(9)
// // // //       pdf.text('CLIENT', leftMargin, yPos)
// // // //       yPos += smallLineHeight

// // // //       pdf.setFont('courier', 'normal')
// // // //       pdf.setFontSize(8)
// // // //       if (clientInfo.name) {
// // // //         pdf.text(`Nom: ${clientInfo.name}`, leftMargin, yPos)
// // // //         yPos += smallLineHeight
// // // //       }

// // // //       if (clientInfo.phone) {
// // // //         pdf.text(`Tel: ${clientInfo.phone}`, leftMargin, yPos)
// // // //         yPos += smallLineHeight
// // // //       }
      
// // // //       yPos += 1.5
// // // //     }

// // // //     // === LIGNE DE SÉPARATION FINE ===
// // // //     drawLine(pdf, yPos)
// // // //     yPos += 3

// // // //     // === EN-TÊTE DU TABLEAU ===
// // // //     pdf.setFontSize(8)
// // // //     pdf.setFont('courier', 'bold')
    
// // // //     pdf.text('Qty', colQtyX, yPos)
// // // //     pdf.text('Produit', colProductX, yPos)
// // // //     pdf.text('Total', colTotalX, yPos, { align: 'right' })
// // // //     yPos += smallLineHeight

// // // //     // Ligne sous les en-têtes
// // // //     drawLine(pdf, yPos)
// // // //     yPos += 3

// // // //     // === ARTICLES ===
// // // //     pdf.setFont('courier', 'normal')
// // // //     items.forEach((item) => {
// // // //       const quantity = item.quantity || 1
// // // //       const productName = item.name || 'Produit'
      
// // // //       // Tronquer le nom si trop long (AUGMENTÉ pour utiliser l'espace)
// // // //       let displayName = productName
// // // //       const maxNameLength = 30  // Augmenté de 22 à 30
// // // //       if (displayName.length > maxNameLength) {
// // // //         displayName = displayName.substring(0, maxNameLength - 3) + '...'
// // // //       }

// // // //       // Ajouter les données avec plus d'espace
// // // //       pdf.text(`${quantity}`, colQtyX, yPos)
// // // //       pdf.text(displayName, colProductX, yPos)
// // // //       pdf.text(formatCurrency(item.total || 0, currency), colTotalX, yPos, { align: 'right' })
      
// // // //       yPos += smallLineHeight

// // // //       // Vérifier si on dépasse la page
// // // //       if (yPos > 285) {
// // // //         pdf.addPage()
// // // //         yPos = 10
// // // //         pdf.setFont('courier')
// // // //         pdf.setFontSize(8)
// // // //       }
// // // //     })

// // // //     // === LIGNE DE SÉPARATION FINE ===
// // // //     yPos += 0.5
// // // //     drawLine(pdf, yPos)
// // // //     yPos += 2

// // // //     // === TOTAUX ===
// // // //     // Sous-total
// // // //     pdf.setFont('courier', 'normal')
// // // //     pdf.setFontSize(8)
// // // //     pdf.text('SOUS-TOTAL:', leftMargin, yPos)
// // // //     pdf.text(formatCurrency(subtotal, currency), colTotalX, yPos, { align: 'right' })
// // // //     yPos += smallLineHeight

// // // //     // TVA
// // // //     pdf.text(`TVA (${vatRate}%):`, leftMargin, yPos)
// // // //     pdf.text(formatCurrency(vat, currency), colTotalX, yPos, { align: 'right' })
// // // //     yPos += smallLineHeight

// // // //     // Ligne de séparation avant total
// // // //     pdf.setLineWidth(0.2)
// // // //     drawLine(pdf, yPos)
// // // //     pdf.setLineWidth(0.1)
// // // //     yPos += 3

// // // //     // TOTAL
// // // //     pdf.setFont('courier', 'bold')
// // // //     pdf.setFontSize(9)
// // // //     pdf.text('TOTAL:', leftMargin, yPos)
// // // //     pdf.text(formatCurrency(total, currency), colTotalX, yPos, { align: 'right' })
// // // //     yPos += lineHeight + 1.5

// // // //     // === MODE DE PAIEMENT ===
// // // //     pdf.setFont('courier', 'normal')
// // // //     pdf.setFontSize(8)
// // // //     pdf.text(`Paiement: ${getPaymentMethodName(paymentMethod)}`, pageWidth / 2, yPos, { align: 'center' })
// // // //     yPos += lineHeight + 2

// // // //     // === MESSAGE ===
// // // //     pdf.setFontSize(9)
// // // //     pdf.text('Merci pour votre visite!', pageWidth / 2, yPos, { align: 'center' })
// // // //     yPos += smallLineHeight

// // // //     // Message du shop
// // // //     if (shop?.invoice_message) {
// // // //       pdf.setFontSize(8)
// // // //       pdf.text(shop.invoice_message, pageWidth / 2, yPos, { align: 'center' })
// // // //       yPos += smallLineHeight
// // // //     }

// // // //     // Contact
// // // //     pdf.setFontSize(7)
// // // //     pdf.text(`Contact: ${shop?.phone || '+2439906644057'}`, pageWidth / 2, yPos, { align: 'center' })

// // // //     // Générer le PDF et créer un blob URL
// // // //     const pdfBlob = pdf.output('blob')
// // // //     const blobUrl = URL.createObjectURL(pdfBlob)
    
// // // //     // Nettoyer l'ancienne URL blob
// // // //     if (pdfBlobUrl) {
// // // //       URL.revokeObjectURL(pdfBlobUrl)
// // // //     }
    
// // // //     setPdfBlobUrl(blobUrl)

// // // //     return {
// // // //       pdf,
// // // //       blobUrl,
// // // //       saleNumber
// // // //     }
// // // //   }

// // // //   // Générer et télécharger le PDF
// // // //   const generatePDF = async () => {
// // // //     if (!saleData) {
// // // //       console.error('Aucune donnée de vente fournie')
// // // //       return
// // // //     }

// // // //     setGenerating(true)
// // // //     setPrintStatus('')

// // // //     try {
// // // //       const { pdf, saleNumber } = await createPDF()
      
// // // //       // Télécharger le PDF
// // // //       pdf.save(`Facture_${saleNumber}.pdf`)

// // // //       // Callback
// // // //       if (onDownloadComplete) {
// // // //         onDownloadComplete()
// // // //       }

// // // //     } catch (error) {
// // // //       console.error('Erreur génération PDF:', error)
// // // //       alert('Erreur lors de la génération du PDF')
// // // //     } finally {
// // // //       setGenerating(false)
// // // //     }
// // // //   }

// // // //   // Imprimer le PDF via JSPrintManager (version corrigée)
// // // //   const printInvoice = async () => {
// // // //     if (!saleData) {
// // // //       alert('Aucune donnée de vente à imprimer')
// // // //       return
// // // //     }

// // // //     if (!selectedPrinter) {
// // // //       alert('Veuillez sélectionner une imprimante dans la page de gestion des imprimantes')
// // // //       return
// // // //     }

// // // //     if (!isPrintConnected) {
// // // //       alert('Impossible de se connecter au service d\'impression. Vérifiez que JSPrintManager est lancé.')
// // // //       return
// // // //     }

// // // //     setPrinting(true)
// // // //     setPrintStatus('Préparation de l\'impression...')

// // // //     try {
// // // //       // 1. Initialiser JSPrintManager si pas encore fait
// // // //       if (!jsPrintManager.isConnected()) {
// // // //         setPrintStatus('Connexion au service d\'impression...')
// // // //         try {
// // // //           await jsPrintManager.initialize()
// // // //           // Attendre un peu pour la connexion
// // // //           await new Promise(resolve => setTimeout(resolve, 1000))
// // // //         } catch (error) {
// // // //           throw new Error('Service d\'impression non disponible')
// // // //         }
// // // //       }

// // // //       if (!jsPrintManager.isConnected()) {
// // // //         throw new Error('Non connecté au service d\'impression')
// // // //       }

// // // //       // 2. Créer le PDF et obtenir l'URL blob
// // // //       setPrintStatus('Génération du PDF...')
// // // //       const { blobUrl } = await createPDF()
      
// // // //       if (!blobUrl) {
// // // //         throw new Error('Impossible de générer le PDF')
// // // //       }

// // // //       // 3. Obtenir l'instance JSPrintManager
// // // //       const instance = jsPrintManager.getInstance()
// // // //       const { ClientPrintJob, InstalledPrinter, PrintFilePDF, FileSourceType } = instance
      
// // // //       // 4. Créer un job d'impression
// // // //       const cpj = new ClientPrintJob()
// // // //       cpj.clientPrinter = new InstalledPrinter(selectedPrinter)

// // // //       // 5. IMPORTANT: Utiliser PrintFilePDF AVEC UNE URL comme dans l'exemple
// // // //       // Le premier paramètre doit être une string (URL), pas un ArrayBuffer
// // // //       const printFile = new PrintFilePDF(
// // // //         blobUrl,                // filePath (URL string)
// // // //         FileSourceType.URL,     // fileSourceType
// // // //         'facture.pdf',          // fileName
// // // //         1                       // copies
// // // //       )
      
// // // //       cpj.files.push(printFile)

// // // //       // 6. Gérer l'impression
// // // //       await new Promise((resolve, reject) => {
// // // //         cpj.onFinished = () => {
// // // //           console.log('Impression PDF terminée avec succès')
// // // //           resolve()
// // // //         }

// // // //         cpj.onError = (error) => {
// // // //           console.error('Erreur d\'impression PDF:', error)
// // // //           reject(new Error(`Échec de l'impression: ${error.message || 'Erreur inconnue'}`))
// // // //         }

// // // //         cpj.sendToClient()
// // // //       })

// // // //       setPrintStatus('Facture imprimée avec succès!')
// // // //       setTimeout(() => setPrintStatus(''), 3000)

// // // //     } catch (error) {
// // // //       console.error('Erreur impression:', error)
// // // //       setPrintStatus(`Erreur: ${error.message}`)
// // // //       setTimeout(() => setPrintStatus(''), 5000)
// // // //       alert(`Erreur d'impression: ${error.message}`)
// // // //     } finally {
// // // //       setPrinting(false)
// // // //     }
// // // //   }

// // // //   // Version alternative pour vérifier si PrintFilePDF existe
// // // //   const printInvoiceAlternative = async () => {
// // // //     if (!saleData || !selectedPrinter || !isPrintConnected) {
// // // //       alert('Configuration requise manquante')
// // // //       return
// // // //     }

// // // //     setPrinting(true)
// // // //     setPrintStatus('Préparation...')

// // // //     try {
// // // //       // 1. Vérifier la connexion
// // // //       if (!jsPrintManager.isConnected()) {
// // // //         await jsPrintManager.initialize()
// // // //         await new Promise(resolve => setTimeout(resolve, 1000))
// // // //       }

// // // //       if (!jsPrintManager.isConnected()) {
// // // //         throw new Error('Non connecté au service d\'impression')
// // // //       }

// // // //       // 2. Créer le PDF
// // // //       const { blobUrl } = await createPDF()
      
// // // //       // 3. Obtenir l'instance
// // // //       const instance = jsPrintManager.getInstance()
// // // //       const { ClientPrintJob, InstalledPrinter } = instance
      
// // // //       // Vérifier si PrintFilePDF existe
// // // //       if (!instance.PrintFilePDF) {
// // // //         throw new Error('PrintFilePDF n\'est pas disponible dans cette version de JSPrintManager')
// // // //       }
      
// // // //       const { PrintFilePDF, FileSourceType } = instance

// // // //       // 4. Essayer avec PrintFile standard si PrintFilePDF ne fonctionne pas
// // // //       let printFile
      
// // // //       try {
// // // //         // Essayer PrintFilePDF d'abord
// // // //         printFile = new PrintFilePDF(
// // // //           blobUrl,
// // // //           FileSourceType.URL,
// // // //           'facture.pdf',
// // // //           1
// // // //         )
// // // //       } catch (pdfError) {
// // // //         console.warn('PrintFilePDF échoué, essai avec PrintFile standard:', pdfError)
        
// // // //         // Fallback: utiliser PrintFile standard
// // // //         if (instance.PrintFile) {
// // // //           printFile = new instance.PrintFile(
// // // //             blobUrl,
// // // //             FileSourceType.URL,
// // // //             'facture.pdf',
// // // //             1
// // // //           )
// // // //         } else {
// // // //           throw new Error('Aucune méthode d\'impression PDF disponible')
// // // //         }
// // // //       }

// // // //       // 5. Créer et envoyer le job
// // // //       const cpj = new ClientPrintJob()
// // // //       cpj.clientPrinter = new InstalledPrinter(selectedPrinter)
// // // //       cpj.files.push(printFile)

// // // //       await new Promise((resolve, reject) => {
// // // //         cpj.onFinished = resolve
// // // //         cpj.onError = reject
// // // //         cpj.sendToClient()
// // // //       })

// // // //       setPrintStatus('Impression réussie!')
// // // //       setTimeout(() => setPrintStatus(''), 3000)

// // // //     } catch (error) {
// // // //       console.error('Erreur:', error)
// // // //       setPrintStatus(`Erreur: ${error.message}`)
// // // //       alert(`Erreur d'impression: ${error.message}`)
// // // //     } finally {
// // // //       setPrinting(false)
// // // //     }
// // // //   }

// // // //   // Fonction pour imprimer et télécharger
// // // //   const handlePrintAndDownload = async () => {
// // // //     // D'abord télécharger
// // // //     await generatePDF()
    
// // // //     // Ensuite imprimer si tout est configuré
// // // //     if (selectedPrinter && isPrintConnected) {
// // // //       await new Promise(resolve => setTimeout(resolve, 500))
// // // //       await printInvoiceAlternative()
// // // //     }
// // // //   }

// // // //   if (!saleData) {
// // // //     return null
// // // //   }

// // // //   return (
// // // //     <div className="flex flex-col sm:flex-row gap-2">
// // // //       {/* Bouton Télécharger */}
// // // //       <button
// // // //         onClick={generatePDF}
// // // //         disabled={generating || shopLoading}
// // // //         className="flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-1 min-w-[120px]"
// // // //       >
// // // //         {generating ? (
// // // //           <>
// // // //             <Loader2 className="h-5 w-5 mr-2 animate-spin" />
// // // //             Génération...
// // // //           </>
// // // //         ) : (
// // // //           <>
// // // //             <Download className="h-5 w-5 mr-2" />
// // // //             Télécharger
// // // //           </>
// // // //         )}
// // // //       </button>

// // // //       {/* Bouton Imprimer */}
// // // //       <button
// // // //         onClick={printInvoiceAlternative}
// // // //         disabled={printing || shopLoading || !selectedPrinter || !isPrintConnected}
// // // //         className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-1 min-w-[120px]"
// // // //         title={!selectedPrinter ? "Sélectionnez une imprimante d'abord" : !isPrintConnected ? "JSPrintManager non connecté" : ""}
// // // //       >
// // // //         {printing ? (
// // // //           <>
// // // //             <Loader2 className="h-5 w-5 mr-2 animate-spin" />
// // // //             Impression...
// // // //           </>
// // // //         ) : (
// // // //           <>
// // // //             <Printer className="h-5 w-5 mr-2" />
// // // //             Imprimer
// // // //           </>
// // // //         )}
// // // //       </button>

// // // //       {/* Bouton Imprimer et Télécharger */}
// // // //       <button
// // // //         onClick={handlePrintAndDownload}
// // // //         disabled={generating || printing || shopLoading}
// // // //         className="flex items-center justify-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-1 min-w-[120px]"
// // // //       >
// // // //         {generating || printing ? (
// // // //           <>
// // // //             <Loader2 className="h-5 w-5 mr-2 animate-spin" />
// // // //             Traitement...
// // // //           </>
// // // //         ) : (
// // // //           <>
// // // //             <Printer className="h-5 w-5 mr-2" />
// // // //             Imprimer & Tél.
// // // //           </>
// // // //         )}
// // // //       </button>

// // // //       {/* Statut de l'impression */}
// // // //       {printStatus && (
// // // //         <div className="mt-2 text-sm text-center w-full">
// // // //           <p className={`px-3 py-1 rounded-lg ${
// // // //             printStatus.includes('Erreur') 
// // // //               ? 'bg-red-100 text-red-700' 
// // // //               : 'bg-blue-100 text-blue-700'
// // // //           }`}>
// // // //             {printStatus}
// // // //           </p>
// // // //           {selectedPrinter && !printStatus.includes('Erreur') && (
// // // //             <p className="text-xs text-gray-500 mt-1">
// // // //               Imprimante: <span className="font-medium">{selectedPrinter}</span>
// // // //             </p>
// // // //           )}
// // // //         </div>
// // // //       )}

// // // //       {/* Information sur l'imprimante */}
// // // //       {!selectedPrinter && !printing && (
// // // //         <div className="mt-2 w-full">
// // // //           <p className="text-xs text-amber-600 text-center">
// // // //             ⚠️ Sélectionnez d abord une imprimante dans la page de gestion des imprimantes
// // // //           </p>
// // // //         </div>
// // // //       )}

// // // //       {selectedPrinter && !isPrintConnected && !printing && (
// // // //         <div className="mt-2 w-full">
// // // //           <div className="text-xs text-amber-600 text-center space-y-1">
// // // //             <p>⚠️ JSPrintManager non connecté</p>
// // // //             <p className="text-xs">
// // // //               <a 
// // // //                 href="https://neodynamic.com/downloads/jspm" 
// // // //                 target="_blank" 
// // // //                 rel="noopener noreferrer"
// // // //                 className="text-blue-600 hover:underline"
// // // //               >
// // // //                 Télécharger l application
// // // //               </a>
// // // //               , lancez-la puis rafraîchissez la page
// // // //             </p>
// // // //           </div>
// // // //         </div>
// // // //       )}
// // // //     </div>
// // // //   )
// // // // }
// // // 'use client'

// // // import { useState, useEffect } from 'react'
// // // import { Download, Loader2, Printer } from 'lucide-react'
// // // import jsPDF from 'jspdf'
// // // import { useShop } from '@/hooks/useShop'
// // // import { jsPrintManager } from '@/lib/jsprintmanager-singleton'

// // // const PRINTER_STORAGE_KEY = 'selected-printer'

// // // export default function FactureGenerator({ saleData, onDownloadComplete }) {
// // //   const [generating, setGenerating] = useState(false)
// // //   const [printing, setPrinting] = useState(false)
// // //   const [printStatus, setPrintStatus] = useState('')
// // //   const { shop, loading: shopLoading } = useShop()
// // //   const [logoUrl, setLogoUrl] = useState(null)
// // //   const [selectedPrinter, setSelectedPrinter] = useState('')
// // //   const [isPrintConnected, setIsPrintConnected] = useState(false)
// // //   const [pdfBlobUrl, setPdfBlobUrl] = useState(null)

// // //   // Charger le logo
// // //   useEffect(() => {
// // //     if (shop?.shop_icon) {
// // //       setLogoUrl(shop.shop_icon)
// // //     }
// // //   }, [shop])

// // //   // Charger l'imprimante sélectionnée
// // //   useEffect(() => {
// // //     if (typeof window !== 'undefined') {
// // //       const savedPrinter = localStorage.getItem(PRINTER_STORAGE_KEY)
// // //       if (savedPrinter) {
// // //         setSelectedPrinter(savedPrinter)
// // //       }
// // //     }
// // //   }, [])

// // //   // Vérifier la connexion à l'imprimante
// // //   useEffect(() => {
// // //     const checkPrintConnection = () => {
// // //       setIsPrintConnected(jsPrintManager.isConnected())
// // //     }

// // //     // Vérifier initialement
// // //     checkPrintConnection()

// // //     // Ajouter un écouteur pour les changements de statut
// // //     const cleanupListener = jsPrintManager.addStatusListener((connected) => {
// // //       setIsPrintConnected(connected)
// // //     })

// // //     return () => {
// // //       if (cleanupListener) cleanupListener()
// // //       // Nettoyer l'URL blob lors du démontage
// // //       if (pdfBlobUrl) {
// // //         URL.revokeObjectURL(pdfBlobUrl)
// // //       }
// // //     }
// // //   }, [])

// // //   // Nettoyer l'URL blob quand elle change
// // //   useEffect(() => {
// // //     return () => {
// // //       if (pdfBlobUrl) {
// // //         URL.revokeObjectURL(pdfBlobUrl)
// // //       }
// // //     }
// // //   }, [pdfBlobUrl])

// // //   // Formater la date et l'heure correctement
// // //   const formatDateTime = (dateString) => {
// // //     if (!dateString) {
// // //       const now = new Date()
// // //       return now.toLocaleString('fr-FR', {
// // //         day: '2-digit',
// // //         month: '2-digit',
// // //         year: 'numeric',
// // //         hour: '2-digit',
// // //         minute: '2-digit'
// // //       })
// // //     }
    
// // //     const date = new Date(dateString)
// // //     return date.toLocaleString('fr-FR', {
// // //       day: '2-digit',
// // //       month: '2-digit',
// // //       year: 'numeric',
// // //       hour: '2-digit',
// // //       minute: '2-digit'
// // //     })
// // //   }

// // //   // Formater la devise proprement
// // //   const formatCurrency = (amount, currency = shop?.currency || 'CDF') => {
// // //     if (!amount) amount = 0
    
// // //     // Format sans séparateur de milliers
// // //     const formatted = Math.round(amount).toString()
    
// // //     if (currency === 'CDF') {
// // //       return `${formatted} FC`
// // //     }
    
// // //     return `$${formatted}`
// // //   }

// // //   // Obtenir le nom de la méthode de paiement
// // //   const getPaymentMethodName = (method) => {
// // //     switch (method) {
// // //       case 'cash':
// // //         return 'Espèces'
// // //       case 'card':
// // //         return 'Carte'
// // //       case 'mobile':
// // //         return 'Mobile'
// // //       default:
// // //         return method
// // //     }
// // //   }

// // //   // Fonction pour charger une image en base64
// // //   const loadImageAsBase64 = async (url) => {
// // //     try {
// // //       const response = await fetch(url)
// // //       const blob = await response.blob()
// // //       return new Promise((resolve, reject) => {
// // //         const reader = new FileReader()
// // //         reader.onloadend = () => resolve(reader.result)
// // //         reader.onerror = reject
// // //         reader.readAsDataURL(blob)
// // //       })
// // //     } catch (error) {
// // //       console.error('Erreur chargement logo:', error)
// // //       return null
// // //     }
// // //   }

// // //   // Fonction pour dessiner une ligne de séparation FINE
// // //   const drawLine = (pdf, y, startX = 3, endX = 77) => {
// // //     pdf.setLineWidth(0.1) // Réduit de 0.5 à 0.1 (beaucoup plus fin)
// // //     pdf.line(startX, y, endX, y)
// // //   }

// // //   // Fonction pour créer le PDF et retourner un blob URL
// // //   const createPDF = async () => {
// // //     if (!saleData) {
// // //       throw new Error('Aucune donnée de vente fournie')
// // //     }

// // //     // Récupérer les données
// // //     const saleNumber = saleData.sale_number || `FACT-${Date.now()}`
// // //     const saleDate = saleData.date_time || new Date().toISOString()
// // //     const clientInfo = saleData.clientInfo || {}
// // //     const items = saleData.items || []
// // //     const subtotal = saleData.subtotal || 0
// // //     const vat = saleData.vat_amount || 0
// // //     const vatRate = saleData.vat_rate || 16
// // //     const total = saleData.total || 0
// // //     const currency = saleData.currency || 'CDF'
// // //     const paymentMethod = saleData.payment_method || 'cash'

// // //     // Créer le PDF avec largeur de 80mm pour thermal printer
// // //     const pdf = new jsPDF({
// // //       orientation: 'portrait',
// // //       unit: 'mm',
// // //       format: [80, 297] // Hauteur augmentée pour contenir tout le contenu
// // //     })

// // //     // Variables de position et marges
// // //     let yPos = 5
// // //     const lineHeight = 4
// // //     const smallLineHeight = 3.5
// // //     const pageWidth = 80
    
// // //     // MARGES AUGMENTÉES
// // //     const leftMargin = 3
// // //     const rightMargin = 3
    
// // //     // Positions X pour les colonnes (AUGMENTÉES)
// // //     const colQtyX = leftMargin
// // //     const colProductX = leftMargin + 10  // Augmenté de 8 à 10
// // //     const colTotalX = pageWidth - rightMargin - 10  // Marge à droite pour les totaux

// // //     // Définir la police Courier
// // //     pdf.setFont('courier')
// // //     pdf.setFontSize(9)

// // //     // === EN-TÊTE AVEC LOGO ===
// // //     if (logoUrl) {
// // //       try {
// // //         const logoData = await loadImageAsBase64(logoUrl)
// // //         if (logoData) {
// // //           // Logo centré
// // //           pdf.addImage(logoData, 'PNG', 32.5, yPos, 15, 15)
// // //           yPos += 17
// // //         }
// // //       } catch (error) {
// // //         console.error('Erreur chargement logo:', error)
// // //       }
// // //     }

// // //     // Nom du shop centré
// // //     pdf.setFontSize(10)
// // //     pdf.setFont('courier', 'bold')
// // //     pdf.text(shop?.shop_name || 'ErrorShop', pageWidth / 2, yPos, { align: 'center' })
// // //     yPos += smallLineHeight

// // //     // === INFORMATIONS SUPPLEMENTAIRES DU SHOP ===
// // //     pdf.setFontSize(8)
// // //     pdf.setFont('courier', 'normal')

// // //     // Champ personnalisé 1
// // //     if (shop?.custom_field_1 && shop.custom_field_1 !== 'Premier text par defaut') {
// // //       pdf.text(shop.custom_field_1, pageWidth / 2, yPos, { align: 'center' })
// // //       yPos += smallLineHeight
// // //     }

// // //     // RCCM
// // //     if (shop?.rccm) {
// // //       pdf.text(`RCCM: ${shop.rccm}`, pageWidth / 2, yPos, { align: 'center' })
// // //       yPos += smallLineHeight
// // //     }

// // //     // Adresse du shop
// // //     if (shop?.shop_address) {
// // //       // Gérer les adresses longues en les tronquant
// // //       let address = shop.shop_address
// // //       if (address.length > 40) {
// // //         address = address.substring(0, 40) + '...'
// // //       }
// // //       pdf.text(address, pageWidth / 2, yPos, { align: 'center' })
// // //       yPos += smallLineHeight
// // //     }

// // //     // Téléphone centré
// // //     pdf.text(`Tel: ${shop?.phone || '+2439906644057'}`, pageWidth / 2, yPos, { align: 'center' })
// // //     yPos += lineHeight + 1

// // //     // === LIGNE DE SÉPARATION FINE ===
// // //     drawLine(pdf, yPos)
// // //     yPos += 3.5

// // //     // === TITRE FACTURE ===
// // //     pdf.setFontSize(11)
// // //     pdf.setFont('courier', 'bold')
// // //     pdf.text('FACTURE', pageWidth / 2, yPos, { align: 'center' })
// // //     yPos += lineHeight + 1

// // //     // === NUMÉRO ET DATE ===
// // //     pdf.setFontSize(8)
// // //     pdf.setFont('courier', 'normal')
// // //     pdf.text(`N°: ${saleNumber}`, leftMargin, yPos)
// // //     yPos += smallLineHeight
    
// // //     pdf.text(`Date: ${formatDateTime(saleDate)}`, leftMargin, yPos)
// // //     yPos += lineHeight + 1

// // //     // === INFORMATIONS CLIENT ===
// // //     if (clientInfo.name || clientInfo.phone) {
// // //       pdf.setFont('courier', 'bold')
// // //       pdf.setFontSize(9)
// // //       pdf.text('CLIENT', leftMargin, yPos)
// // //       yPos += smallLineHeight

// // //       pdf.setFont('courier', 'normal')
// // //       pdf.setFontSize(8)
// // //       if (clientInfo.name) {
// // //         pdf.text(`Nom: ${clientInfo.name}`, leftMargin, yPos)
// // //         yPos += smallLineHeight
// // //       }

// // //       if (clientInfo.phone) {
// // //         pdf.text(`Tel: ${clientInfo.phone}`, leftMargin, yPos)
// // //         yPos += smallLineHeight
// // //       }
      
// // //       yPos += 1.5
// // //     }

// // //     // === LIGNE DE SÉPARATION FINE ===
// // //     drawLine(pdf, yPos)
// // //     yPos += 3

// // //     // === EN-TÊTE DU TABLEAU ===
// // //     pdf.setFontSize(8)
// // //     pdf.setFont('courier', 'bold')
    
// // //     pdf.text('Qty', colQtyX, yPos)
// // //     pdf.text('Produit', colProductX, yPos)
// // //     pdf.text('Total', colTotalX, yPos, { align: 'right' })
// // //     yPos += smallLineHeight

// // //     // Ligne sous les en-têtes
// // //     drawLine(pdf, yPos)
// // //     yPos += 3

// // //     // === ARTICLES ===
// // //     pdf.setFont('courier', 'normal')
// // //     items.forEach((item) => {
// // //       const quantity = item.quantity || 1
// // //       const productName = item.name || 'Produit'
      
// // //       // Tronquer le nom si trop long (AUGMENTÉ pour utiliser l'espace)
// // //       let displayName = productName
// // //       const maxNameLength = 30  // Augmenté de 22 à 30
// // //       if (displayName.length > maxNameLength) {
// // //         displayName = displayName.substring(0, maxNameLength - 3) + '...'
// // //       }

// // //       // Ajouter les données avec plus d'espace
// // //       pdf.text(`${quantity}`, colQtyX, yPos)
// // //       pdf.text(displayName, colProductX, yPos)
// // //       pdf.text(formatCurrency(item.total || 0, currency), colTotalX, yPos, { align: 'right' })
      
// // //       yPos += smallLineHeight

// // //       // Vérifier si on dépasse la page
// // //       if (yPos > 285) {
// // //         pdf.addPage()
// // //         yPos = 10
// // //         pdf.setFont('courier')
// // //         pdf.setFontSize(8)
// // //       }
// // //     })

// // //     // === LIGNE DE SÉPARATION FINE ===
// // //     yPos += 0.5
// // //     drawLine(pdf, yPos)
// // //     yPos += 2

// // //     // === TOTAUX ===
// // //     // Sous-total
// // //     pdf.setFont('courier', 'normal')
// // //     pdf.setFontSize(8)
// // //     pdf.text('SOUS-TOTAL:', leftMargin, yPos)
// // //     pdf.text(formatCurrency(subtotal, currency), colTotalX, yPos, { align: 'right' })
// // //     yPos += smallLineHeight

// // //     // TVA
// // //     pdf.text(`TVA (${vatRate}%):`, leftMargin, yPos)
// // //     pdf.text(formatCurrency(vat, currency), colTotalX, yPos, { align: 'right' })
// // //     yPos += smallLineHeight

// // //     // Ligne de séparation avant total
// // //     pdf.setLineWidth(0.2)
// // //     drawLine(pdf, yPos)
// // //     pdf.setLineWidth(0.1)
// // //     yPos += 3

// // //     // TOTAL
// // //     pdf.setFont('courier', 'bold')
// // //     pdf.setFontSize(9)
// // //     pdf.text('TOTAL:', leftMargin, yPos)
// // //     pdf.text(formatCurrency(total, currency), colTotalX, yPos, { align: 'right' })
// // //     yPos += lineHeight + 1.5

// // //     // === MODE DE PAIEMENT ===
// // //     pdf.setFont('courier', 'normal')
// // //     pdf.setFontSize(8)
// // //     pdf.text(`Paiement: ${getPaymentMethodName(paymentMethod)}`, pageWidth / 2, yPos, { align: 'center' })
// // //     yPos += lineHeight + 2

// // //     // === MESSAGES ===
// // //     pdf.setFontSize(9)
// // //     pdf.text('Merci pour votre visite!', pageWidth / 2, yPos, { align: 'center' })
// // //     yPos += smallLineHeight

// // //     // Message du shop (invoice_message)
// // //     if (shop?.invoice_message) {
// // //       pdf.setFontSize(8)
// // //       pdf.text(shop.invoice_message, pageWidth / 2, yPos, { align: 'center' })
// // //       yPos += smallLineHeight
// // //     }

// // //     // Receipt message (receipt_message)
// // //     if (shop?.receipt_message && shop.receipt_message !== 'Veuillez conserver ce reçu.') {
// // //       pdf.setFontSize(8)
// // //       // Ajuster le texte si trop long
// // //       let receiptMsg = shop.receipt_message
// // //       if (receiptMsg.length > 50) {
// // //         receiptMsg = receiptMsg.substring(0, 50) + '...'
// // //       }
// // //       pdf.text(receiptMsg, pageWidth / 2, yPos, { align: 'center' })
// // //       yPos += smallLineHeight
// // //     }

// // //     // Contact
// // //     pdf.setFontSize(7)
// // //     pdf.text(`Contact: ${shop?.phone || '+2439906644057'}`, pageWidth / 2, yPos, { align: 'center' })

// // //     // Générer le PDF et créer un blob URL
// // //     const pdfBlob = pdf.output('blob')
// // //     const blobUrl = URL.createObjectURL(pdfBlob)
    
// // //     // Nettoyer l'ancienne URL blob
// // //     if (pdfBlobUrl) {
// // //       URL.revokeObjectURL(pdfBlobUrl)
// // //     }
    
// // //     setPdfBlobUrl(blobUrl)

// // //     return {
// // //       pdf,
// // //       blobUrl,
// // //       saleNumber
// // //     }
// // //   }

// // //   // Générer et télécharger le PDF
// // //   const generatePDF = async () => {
// // //     if (!saleData) {
// // //       console.error('Aucune donnée de vente fournie')
// // //       return
// // //     }

// // //     setGenerating(true)
// // //     setPrintStatus('')

// // //     try {
// // //       const { pdf, saleNumber } = await createPDF()
      
// // //       // Télécharger le PDF
// // //       pdf.save(`Facture_${saleNumber}.pdf`)

// // //       // Callback
// // //       if (onDownloadComplete) {
// // //         onDownloadComplete()
// // //       }

// // //     } catch (error) {
// // //       console.error('Erreur génération PDF:', error)
// // //       alert('Erreur lors de la génération du PDF')
// // //     } finally {
// // //       setGenerating(false)
// // //     }
// // //   }

// // //   // Imprimer le PDF via JSPrintManager (version corrigée)
// // //   const printInvoice = async () => {
// // //     if (!saleData) {
// // //       alert('Aucune donnée de vente à imprimer')
// // //       return
// // //     }

// // //     if (!selectedPrinter) {
// // //       alert('Veuillez sélectionner une imprimante dans la page de gestion des imprimantes')
// // //       return
// // //     }

// // //     if (!isPrintConnected) {
// // //       alert('Impossible de se connecter au service d\'impression. Vérifiez que JSPrintManager est lancé.')
// // //       return
// // //     }

// // //     setPrinting(true)
// // //     setPrintStatus('Préparation de l\'impression...')

// // //     try {
// // //       // 1. Initialiser JSPrintManager si pas encore fait
// // //       if (!jsPrintManager.isConnected()) {
// // //         setPrintStatus('Connexion au service dimpression...')
// // //         try {
// // //           await jsPrintManager.initialize()
// // //           // Attendre un peu pour la connexion
// // //           await new Promise(resolve => setTimeout(resolve, 1000))
// // //         } catch (error) {
// // //           throw new Error('Service dimpression non disponible')
// // //         }
// // //       }

// // //       if (!jsPrintManager.isConnected()) {
// // //         throw new Error('Non connecté au service dimpression')
// // //       }

// // //       // 2. Créer le PDF et obtenir l'URL blob
// // //       setPrintStatus('Génération du PDF...')
// // //       const { blobUrl } = await createPDF()
      
// // //       if (!blobUrl) {
// // //         throw new Error('Impossible de générer le PDF')
// // //       }

// // //       // 3. Obtenir l'instance JSPrintManager
// // //       const instance = jsPrintManager.getInstance()
// // //       const { ClientPrintJob, InstalledPrinter, PrintFilePDF, FileSourceType } = instance
      
// // //       // 4. Créer un job d'impression
// // //       const cpj = new ClientPrintJob()
// // //       cpj.clientPrinter = new InstalledPrinter(selectedPrinter)

// // //       // 5. IMPORTANT: Utiliser PrintFilePDF AVEC UNE URL comme dans l'exemple
// // //       // Le premier paramètre doit être une string (URL), pas un ArrayBuffer
// // //       const printFile = new PrintFilePDF(
// // //         blobUrl,                // filePath (URL string)
// // //         FileSourceType.URL,     // fileSourceType
// // //         'facture.pdf',          // fileName
// // //         1                       // copies
// // //       )
      
// // //       cpj.files.push(printFile)

// // //       // 6. Gérer l'impression
// // //       await new Promise((resolve, reject) => {
// // //         cpj.onFinished = () => {
// // //           console.log('Impression PDF terminée avec succès')
// // //           resolve()
// // //         }

// // //         cpj.onError = (error) => {
// // //           console.error('Erreur dimpression PDF:', error)
// // //           reject(new Error(`Échec de l'impression: ${error.message || 'Erreur inconnue'}`))
// // //         }

// // //         cpj.sendToClient()
// // //       })

// // //       setPrintStatus('Facture imprimée avec succès!')
// // //       setTimeout(() => setPrintStatus(''), 3000)

// // //     } catch (error) {
// // //       console.error('Erreur impression:', error)
// // //       setPrintStatus(`Erreur: ${error.message}`)
// // //       setTimeout(() => setPrintStatus(''), 5000)
// // //       alert(`Erreur d'impression: ${error.message}`)
// // //     } finally {
// // //       setPrinting(false)
// // //     }
// // //   }

// // //   // Version alternative pour vérifier si PrintFilePDF existe
// // //   const printInvoiceAlternative = async () => {
// // //     if (!saleData || !selectedPrinter || !isPrintConnected) {
// // //       alert('Configuration requise manquante')
// // //       return
// // //     }

// // //     setPrinting(true)
// // //     setPrintStatus('Préparation...')

// // //     try {
// // //       // 1. Vérifier la connexion
// // //       if (!jsPrintManager.isConnected()) {
// // //         await jsPrintManager.initialize()
// // //         await new Promise(resolve => setTimeout(resolve, 1000))
// // //       }

// // //       if (!jsPrintManager.isConnected()) {
// // //         throw new Error('Non connecté au service dimpression')
// // //       }

// // //       // 2. Créer le PDF
// // //       const { blobUrl } = await createPDF()
      
// // //       // 3. Obtenir l'instance
// // //       const instance = jsPrintManager.getInstance()
// // //       const { ClientPrintJob, InstalledPrinter } = instance
      
// // //       // Vérifier si PrintFilePDF existe
// // //       if (!instance.PrintFilePDF) {
// // //         throw new Error('PrintFilePDF nest pas disponible dans cette version de JSPrintManager')
// // //       }
      
// // //       const { PrintFilePDF, FileSourceType } = instance

// // //       // 4. Essayer avec PrintFile standard si PrintFilePDF ne fonctionne pas
// // //       let printFile
      
// // //       try {
// // //         // Essayer PrintFilePDF d'abord
// // //         printFile = new PrintFilePDF(
// // //           blobUrl,
// // //           FileSourceType.URL,
// // //           'facture.pdf',
// // //           1
// // //         )
// // //       } catch (pdfError) {
// // //         console.warn('PrintFilePDF échoué, essai avec PrintFile standard:', pdfError)
        
// // //         // Fallback: utiliser PrintFile standard
// // //         if (instance.PrintFile) {
// // //           printFile = new instance.PrintFile(
// // //             blobUrl,
// // //             FileSourceType.URL,
// // //             'facture.pdf',
// // //             1
// // //           )
// // //         } else {
// // //           throw new Error('Aucune méthode dimpression PDF disponible')
// // //         }
// // //       }

// // //       // 5. Créer et envoyer le job
// // //       const cpj = new ClientPrintJob()
// // //       cpj.clientPrinter = new InstalledPrinter(selectedPrinter)
// // //       cpj.files.push(printFile)

// // //       await new Promise((resolve, reject) => {
// // //         cpj.onFinished = resolve
// // //         cpj.onError = reject
// // //         cpj.sendToClient()
// // //       })

// // //       setPrintStatus('Impression réussie!')
// // //       setTimeout(() => setPrintStatus(''), 3000)

// // //     } catch (error) {
// // //       console.error('Erreur:', error)
// // //       setPrintStatus(`Erreur: ${error.message}`)
// // //       alert(`Erreur d'impression: ${error.message}`)
// // //     } finally {
// // //       setPrinting(false)
// // //     }
// // //   }

// // //   // Fonction pour imprimer et télécharger
// // //   const handlePrintAndDownload = async () => {
// // //     // D'abord télécharger
// // //     await generatePDF()
    
// // //     // Ensuite imprimer si tout est configuré
// // //     if (selectedPrinter && isPrintConnected) {
// // //       await new Promise(resolve => setTimeout(resolve, 500))
// // //       await printInvoiceAlternative()
// // //     }
// // //   }

// // //   if (!saleData) {
// // //     return null
// // //   }

// // //   return (
// // //     <div className="flex flex-col sm:flex-row gap-2">
// // //       {/* Bouton Télécharger */}
// // //       <button
// // //         onClick={generatePDF}
// // //         disabled={generating || shopLoading}
// // //         className="flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-1 min-w-[120px]"
// // //       >
// // //         {generating ? (
// // //           <>
// // //             <Loader2 className="h-5 w-5 mr-2 animate-spin" />
// // //             Génération...
// // //           </>
// // //         ) : (
// // //           <>
// // //             <Download className="h-5 w-5 mr-2" />
// // //             Télécharger
// // //           </>
// // //         )}
// // //       </button>

// // //       {/* Bouton Imprimer */}
// // //       <button
// // //         onClick={printInvoiceAlternative}
// // //         disabled={printing || shopLoading || !selectedPrinter || !isPrintConnected}
// // //         className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-1 min-w-[120px]"
// // //         title={!selectedPrinter ? "Sélectionnez une imprimante d'abord" : !isPrintConnected ? "JSPrintManager non connecté" : ""}
// // //       >
// // //         {printing ? (
// // //           <>
// // //             <Loader2 className="h-5 w-5 mr-2 animate-spin" />
// // //             Impression...
// // //           </>
// // //         ) : (
// // //           <>
// // //             <Printer className="h-5 w-5 mr-2" />
// // //             Imprimer
// // //           </>
// // //         )}
// // //       </button>

// // //       {/* Bouton Imprimer et Télécharger */}
// // //       <button
// // //         onClick={handlePrintAndDownload}
// // //         disabled={generating || printing || shopLoading}
// // //         className="flex items-center justify-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-1 min-w-[120px]"
// // //       >
// // //         {generating || printing ? (
// // //           <>
// // //             <Loader2 className="h-5 w-5 mr-2 animate-spin" />
// // //             Traitement...
// // //           </>
// // //         ) : (
// // //           <>
// // //             <Printer className="h-5 w-5 mr-2" />
// // //             Imprimer & Tél.
// // //           </>
// // //         )}
// // //       </button>

// // //       {/* Statut de l'impression */}
// // //       {printStatus && (
// // //         <div className="mt-2 text-sm text-center w-full">
// // //           <p className={`px-3 py-1 rounded-lg ${
// // //             printStatus.includes('Erreur') 
// // //               ? 'bg-red-100 text-red-700' 
// // //               : 'bg-blue-100 text-blue-700'
// // //           }`}>
// // //             {printStatus}
// // //           </p>
// // //           {selectedPrinter && !printStatus.includes('Erreur') && (
// // //             <p className="text-xs text-gray-500 mt-1">
// // //               Imprimante: <span className="font-medium">{selectedPrinter}</span>
// // //             </p>
// // //           )}
// // //         </div>
// // //       )}

// // //       {/* Information sur l'imprimante */}
// // //       {!selectedPrinter && !printing && (
// // //         <div className="mt-2 w-full">
// // //           <p className="text-xs text-amber-600 text-center">
// // //             ⚠️ Sélectionnez dabord une imprimante dans la page de gestion des imprimantes
// // //           </p>
// // //         </div>
// // //       )}

// // //       {selectedPrinter && !isPrintConnected && !printing && (
// // //         <div className="mt-2 w-full">
// // //           <div className="text-xs text-amber-600 text-center space-y-1">
// // //             <p>⚠️ JSPrintManager non connecté</p>
// // //             <p className="text-xs">
// // //               <a 
// // //                 href="https://neodynamic.com/downloads/jspm" 
// // //                 target="_blank" 
// // //                 rel="noopener noreferrer"
// // //                 className="text-blue-600 hover:underline"
// // //               >
// // //                 Télécharger lapplication
// // //               </a>
// // //               , lancez-la puis rafraîchissez la page
// // //             </p>
// // //           </div>
// // //         </div>
// // //       )}
// // //     </div>
// // //   )
// // // }


// // 'use client'

// // import { useState, useEffect } from 'react'
// // import { Download, Loader2, Printer } from 'lucide-react'
// // import jsPDF from 'jspdf'
// // import { useShop } from '@/hooks/useShop'
// // import { jsPrintManager } from '@/lib/jsprintmanager-singleton'

// // const PRINTER_STORAGE_KEY = 'selected-printer'

// // export default function FactureGenerator({ saleData, onDownloadComplete }) {
// //   const [generating, setGenerating] = useState(false)
// //   const [printing, setPrinting] = useState(false)
// //   const [printStatus, setPrintStatus] = useState('')
// //   const { shop, loading: shopLoading } = useShop()
// //   const [logoUrl, setLogoUrl] = useState(null)
// //   const [selectedPrinter, setSelectedPrinter] = useState('')
// //   const [isPrintConnected, setIsPrintConnected] = useState(false)
// //   const [pdfBlobUrl, setPdfBlobUrl] = useState(null)

// //   // Charger le logo
// //   useEffect(() => {
// //     if (shop?.shop_icon) {
// //       setLogoUrl(shop.shop_icon)
// //     }
// //   }, [shop])

// //   // Charger l'imprimante sélectionnée
// //   useEffect(() => {
// //     if (typeof window !== 'undefined') {
// //       const savedPrinter = localStorage.getItem(PRINTER_STORAGE_KEY)
// //       if (savedPrinter) {
// //         setSelectedPrinter(savedPrinter)
// //       }
// //     }
// //   }, [])

// //   // Vérifier la connexion à l'imprimante
// //   useEffect(() => {
// //     const checkPrintConnection = () => {
// //       setIsPrintConnected(jsPrintManager.isConnected())
// //     }

// //     // Vérifier initialement
// //     checkPrintConnection()

// //     // Ajouter un écouteur pour les changements de statut
// //     const cleanupListener = jsPrintManager.addStatusListener((connected) => {
// //       setIsPrintConnected(connected)
// //     })

// //     return () => {
// //       if (cleanupListener) cleanupListener()
// //       // Nettoyer l'URL blob lors du démontage
// //       if (pdfBlobUrl) {
// //         URL.revokeObjectURL(pdfBlobUrl)
// //       }
// //     }
// //   }, [])

// //   // Nettoyer l'URL blob quand elle change
// //   useEffect(() => {
// //     return () => {
// //       if (pdfBlobUrl) {
// //         URL.revokeObjectURL(pdfBlobUrl)
// //       }
// //     }
// //   }, [pdfBlobUrl])

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

// //   // Formater les nombres pour l'affichage (avec 0 décimales)
// //   const formatNumber = (num) => {
// //     return Math.round(num).toString()
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

// //   // Fonction pour créer le PDF et retourner un blob URL
// //   const createPDF = async () => {
// //     if (!saleData) {
// //       throw new Error('Aucune donnée de vente fournie')
// //     }

// //     // Récupérer les données
// //     const saleNumber = saleData.sale_number || `FACT-${Date.now()}`
// //     const saleDate = saleData.date_time || new Date().toISOString()
// //     const clientInfo = saleData.clientInfo || {}
// //     const items = saleData.items || []
// //     const subtotal = saleData.subtotal || 0
// //     const vat = saleData.vat_amount || 0
// //     const vatRate = saleData.vat_rate || 16
// //     const total = saleData.total || 0
// //     const currency = saleData.currency || 'CDF'
// //     const paymentMethod = saleData.payment_method || 'cash'

// //     // Créer le PDF avec largeur de 80mm pour thermal printer
// //     const pdf = new jsPDF({
// //       orientation: 'portrait',
// //       unit: 'mm',
// //       format: [80, 297] // Hauteur augmentée pour contenir tout le contenu
// //     })

// //     // Variables de position et marges
// //     let yPos = 5
// //     const lineHeight = 4
// //     const smallLineHeight = 3.5
// //     const pageWidth = 80
    
// //     // MARGES AUGMENTÉES
// //     const leftMargin = 3
// //     const rightMargin = 3
    
// //     // Positions X pour les colonnes (AJUSTÉES pour PU/PT)
// //     const colQtyX = leftMargin
// //     const colProductX = leftMargin + 8  // Espace pour Qty
// //     const colPUX = leftMargin + 35      // Position pour PU
// //     const colPTX = pageWidth - rightMargin - 10  // Position pour PT (aligné à droite)

// //     // Définir la police Courier
// //     pdf.setFont('courier')
// //     pdf.setFontSize(9)

// //     // === EN-TÊTE AVEC LOGO ===
// //     if (logoUrl) {
// //       try {
// //         const logoData = await loadImageAsBase64(logoUrl)
// //         if (logoData) {
// //           // Logo centré
// //           pdf.addImage(logoData, 'PNG', 32.5, yPos, 15, 15)
// //           yPos += 17
// //         }
// //       } catch (error) {
// //         console.error('Erreur chargement logo:', error)
// //       }
// //     }

// //     // Nom du shop centré
// //     pdf.setFontSize(10)
// //     pdf.setFont('courier', 'bold')
// //     pdf.text(shop?.shop_name || 'ErrorShop', pageWidth / 2, yPos, { align: 'center' })
// //     yPos += smallLineHeight

// //     // === INFORMATIONS SUPPLEMENTAIRES DU SHOP ===
// //     pdf.setFontSize(8)
// //     pdf.setFont('courier', 'normal')

// //     // Champ personnalisé 1
// //     if (shop?.custom_field_1 && shop.custom_field_1 !== 'Premier text par defaut') {
// //       pdf.text(shop.custom_field_1, pageWidth / 2, yPos, { align: 'center' })
// //       yPos += smallLineHeight
// //     }

// //     // RCCM
// //     if (shop?.rccm) {
// //       pdf.text(`RCCM: ${shop.rccm}`, pageWidth / 2, yPos, { align: 'center' })
// //       yPos += smallLineHeight
// //     }

// //     // Adresse du shop
// //     if (shop?.shop_address) {
// //       // Gérer les adresses longues en les tronquant
// //       let address = shop.shop_address
// //       if (address.length > 40) {
// //         address = address.substring(0, 40) + '...'
// //       }
// //       pdf.text(address, pageWidth / 2, yPos, { align: 'center' })
// //       yPos += smallLineHeight
// //     }

// //     // Téléphone centré
// //     pdf.text(`Tel: ${shop?.phone || '+2439906644057'}`, pageWidth / 2, yPos, { align: 'center' })
// //     yPos += lineHeight + 1

// //     // === LIGNE DE SÉPARATION FINE ===
// //     drawLine(pdf, yPos)
// //     yPos += 3.5

// //     // === TITRE FACTURE ===
// //     pdf.setFontSize(11)
// //     pdf.setFont('courier', 'bold')
// //     pdf.text('FACTURE', pageWidth / 2, yPos, { align: 'center' })
// //     yPos += lineHeight + 1

// //     // === NUMÉRO ET DATE ===
// //     pdf.setFontSize(8)
// //     pdf.setFont('courier', 'normal')
// //     pdf.text(`N°: ${saleNumber}`, leftMargin, yPos)
// //     yPos += smallLineHeight
    
// //     pdf.text(`Date: ${formatDateTime(saleDate)}`, leftMargin, yPos)
// //     yPos += lineHeight + 1

// //     // === INFORMATIONS CLIENT ===
// //     if (clientInfo.name || clientInfo.phone) {
// //       pdf.setFont('courier', 'bold')
// //       pdf.setFontSize(9)
// //       pdf.text('CLIENT', leftMargin, yPos)
// //       yPos += smallLineHeight

// //       pdf.setFont('courier', 'normal')
// //       pdf.setFontSize(8)
// //       if (clientInfo.name) {
// //         pdf.text(`Nom: ${clientInfo.name}`, leftMargin, yPos)
// //         yPos += smallLineHeight
// //       }

// //       if (clientInfo.phone) {
// //         pdf.text(`Tel: ${clientInfo.phone}`, leftMargin, yPos)
// //         yPos += smallLineHeight
// //       }
      
// //       yPos += 1.5
// //     }

// //     // === LIGNE DE SÉPARATION FINE ===
// //     drawLine(pdf, yPos)
// //     yPos += 3

// //     // === EN-TÊTE DU TABLEAU (AJUSTÉ POUR PU/PT) ===
// //     pdf.setFontSize(8)
// //     pdf.setFont('courier', 'bold')
    
// //     // En-têtes des colonnes
// //     pdf.text('Qty', colQtyX, yPos)
// //     pdf.text('Produit', colProductX, yPos)
// //     pdf.text('PU', colPUX, yPos)
// //     pdf.text('PT', colPTX, yPos, { align: 'right' })
    
// //     yPos += smallLineHeight

// //     // Ligne sous les en-têtes
// //     drawLine(pdf, yPos)
// //     yPos += 3

// //     // === ARTICLES ===
// //     pdf.setFont('courier', 'normal')
// //     pdf.setFontSize(8)
    
// //     items.forEach((item) => {
// //       const quantity = item.quantity || 1
// //       const productName = item.name || 'Produit'
// //       const unitPrice = item.unit_price || item.price || 0
      
// //       // Calculer PT (Prix Total) = PU (Prix Unitaire) × Qty
// //       const totalPrice = unitPrice * quantity
      
// //       // Tronquer le nom du produit si trop long
// //       let displayName = productName
// //       const maxNameLength = 18  // Réduit pour laisser de la place pour PU et PT
// //       if (displayName.length > maxNameLength) {
// //         displayName = displayName.substring(0, maxNameLength - 3) + '...'
// //       }

// //       // Afficher les données dans les colonnes
// //       pdf.text(`${quantity}`, colQtyX, yPos)
// //       pdf.text(displayName, colProductX, yPos)
// //       pdf.text(formatNumber(unitPrice), colPUX, yPos)
// //       pdf.text(formatNumber(totalPrice), colPTX, yPos, { align: 'right' })
      
// //       yPos += smallLineHeight

// //       // Vérifier si on dépasse la page
// //       if (yPos > 285) {
// //         pdf.addPage()
// //         yPos = 10
// //         pdf.setFont('courier')
// //         pdf.setFontSize(8)
// //         // Redessiner l'en-tête du tableau sur la nouvelle page
// //         pdf.setFont('courier', 'bold')
// //         pdf.text('Qty', colQtyX, yPos)
// //         pdf.text('Produit', colProductX, yPos)
// //         pdf.text('PU', colPUX, yPos)
// //         pdf.text('PT', colPTX, yPos, { align: 'right' })
// //         yPos += smallLineHeight
// //         drawLine(pdf, yPos)
// //         yPos += 3
// //         pdf.setFont('courier', 'normal')
// //       }
// //     })

// //     // === LIGNE DE SÉPARATION FINE ===
// //     yPos += 0.5
// //     drawLine(pdf, yPos)
// //     yPos += 2

// //     // === TOTAUX ===
// //     // Sous-total
// //     pdf.setFont('courier', 'normal')
// //     pdf.setFontSize(8)
// //     pdf.text('SOUS-TOTAL:', leftMargin, yPos)
// //     pdf.text(formatCurrency(subtotal, currency), colPTX, yPos, { align: 'right' })
// //     yPos += smallLineHeight

// //     // TVA
// //     pdf.text(`TVA (${vatRate}%):`, leftMargin, yPos)
// //     pdf.text(formatCurrency(vat, currency), colPTX, yPos, { align: 'right' })
// //     yPos += smallLineHeight

// //     // Ligne de séparation avant total
// //     pdf.setLineWidth(0.2)
// //     drawLine(pdf, yPos)
// //     pdf.setLineWidth(0.1)
// //     yPos += 3

// //     // TOTAL
// //     pdf.setFont('courier', 'bold')
// //     pdf.setFontSize(9)
// //     pdf.text('TOTAL:', leftMargin, yPos)
// //     pdf.text(formatCurrency(total, currency), colPTX, yPos, { align: 'right' })
// //     yPos += lineHeight + 1.5

// //     // === MODE DE PAIEMENT ===
// //     pdf.setFont('courier', 'normal')
// //     pdf.setFontSize(8)
// //     pdf.text(`Paiement: ${getPaymentMethodName(paymentMethod)}`, pageWidth / 2, yPos, { align: 'center' })
// //     yPos += lineHeight + 2

// //     // === MESSAGES ===
// //     pdf.setFontSize(9)
// //     pdf.text('Merci pour votre visite!', pageWidth / 2, yPos, { align: 'center' })
// //     yPos += smallLineHeight

// //     // Message du shop (invoice_message)
// //     if (shop?.invoice_message) {
// //       pdf.setFontSize(8)
// //       pdf.text(shop.invoice_message, pageWidth / 2, yPos, { align: 'center' })
// //       yPos += smallLineHeight
// //     }

// //     // Receipt message (receipt_message)
// //     if (shop?.receipt_message && shop.receipt_message !== 'Veuillez conserver ce reçu.') {
// //       pdf.setFontSize(8)
// //       // Ajuster le texte si trop long
// //       let receiptMsg = shop.receipt_message
// //       if (receiptMsg.length > 50) {
// //         receiptMsg = receiptMsg.substring(0, 50) + '...'
// //       }
// //       pdf.text(receiptMsg, pageWidth / 2, yPos, { align: 'center' })
// //       yPos += smallLineHeight
// //     }

// //     // Contact
// //     pdf.setFontSize(7)
// //     pdf.text(`Contact: ${shop?.phone || '+243990664057'}`, pageWidth / 2, yPos, { align: 'center' })

// //     // Générer le PDF et créer un blob URL
// //     const pdfBlob = pdf.output('blob')
// //     const blobUrl = URL.createObjectURL(pdfBlob)
    
// //     // Nettoyer l'ancienne URL blob
// //     if (pdfBlobUrl) {
// //       URL.revokeObjectURL(pdfBlobUrl)
// //     }
    
// //     setPdfBlobUrl(blobUrl)

// //     return {
// //       pdf,
// //       blobUrl,
// //       saleNumber
// //     }
// //   }

// //   // Générer et télécharger le PDF
// //   const generatePDF = async () => {
// //     if (!saleData) {
// //       console.error('Aucune donnée de vente fournie')
// //       return
// //     }

// //     setGenerating(true)
// //     setPrintStatus('')

// //     try {
// //       const { pdf, saleNumber } = await createPDF()
      
// //       // Télécharger le PDF
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

// //   // Imprimer le PDF via JSPrintManager (version corrigée)
// //   const printInvoice = async () => {
// //     if (!saleData) {
// //       alert('Aucune donnée de vente à imprimer')
// //       return
// //     }

// //     if (!selectedPrinter) {
// //       alert('Veuillez sélectionner une imprimante dans la page de gestion des imprimantes')
// //       return
// //     }

// //     if (!isPrintConnected) {
// //       alert('Impossible de se connecter au service d\'impression. Vérifiez que JSPrintManager est lancé.')
// //       return
// //     }

// //     setPrinting(true)
// //     setPrintStatus('Préparation de l\'impression...')

// //     try {
// //       // 1. Initialiser JSPrintManager si pas encore fait
// //       if (!jsPrintManager.isConnected()) {
// //         setPrintStatus('Connexion au service d\'impression...')
// //         try {
// //           await jsPrintManager.initialize()
// //           // Attendre un peu pour la connexion
// //           await new Promise(resolve => setTimeout(resolve, 1000))
// //         } catch (error) {
// //           throw new Error('Service d\'impression non disponible')
// //         }
// //       }

// //       if (!jsPrintManager.isConnected()) {
// //         throw new Error('Non connecté au service d\'impression')
// //       }

// //       // 2. Créer le PDF et obtenir l'URL blob
// //       setPrintStatus('Génération du PDF...')
// //       const { blobUrl } = await createPDF()
      
// //       if (!blobUrl) {
// //         throw new Error('Impossible de générer le PDF')
// //       }

// //       // 3. Obtenir l'instance JSPrintManager
// //       const instance = jsPrintManager.getInstance()
// //       const { ClientPrintJob, InstalledPrinter, PrintFilePDF, FileSourceType } = instance
      
// //       // 4. Créer un job d'impression
// //       const cpj = new ClientPrintJob()
// //       cpj.clientPrinter = new InstalledPrinter(selectedPrinter)

// //       // 5. IMPORTANT: Utiliser PrintFilePDF AVEC UNE URL comme dans l'exemple
// //       // Le premier paramètre doit être une string (URL), pas un ArrayBuffer
// //       const printFile = new PrintFilePDF(
// //         blobUrl,                // filePath (URL string)
// //         FileSourceType.URL,     // fileSourceType
// //         'facture.pdf',          // fileName
// //         1                       // copies
// //       )
      
// //       cpj.files.push(printFile)

// //       // 6. Gérer l'impression
// //       await new Promise((resolve, reject) => {
// //         cpj.onFinished = () => {
// //           console.log('Impression PDF terminée avec succès')
// //           resolve()
// //         }

// //         cpj.onError = (error) => {
// //           console.error('Erreur d\'impression PDF:', error)
// //           reject(new Error(`Échec de l'impression: ${error.message || 'Erreur inconnue'}`))
// //         }

// //         cpj.sendToClient()
// //       })

// //       setPrintStatus('Facture imprimée avec succès!')
// //       setTimeout(() => setPrintStatus(''), 3000)

// //     } catch (error) {
// //       console.error('Erreur impression:', error)
// //       setPrintStatus(`Erreur: ${error.message}`)
// //       setTimeout(() => setPrintStatus(''), 5000)
// //       alert(`Erreur d'impression: ${error.message}`)
// //     } finally {
// //       setPrinting(false)
// //     }
// //   }

// //   // Version alternative pour vérifier si PrintFilePDF existe
// //   const printInvoiceAlternative = async () => {
// //     if (!saleData || !selectedPrinter || !isPrintConnected) {
// //       alert('Configuration requise manquante')
// //       return
// //     }

// //     setPrinting(true)
// //     setPrintStatus('Préparation...')

// //     try {
// //       // 1. Vérifier la connexion
// //       if (!jsPrintManager.isConnected()) {
// //         await jsPrintManager.initialize()
// //         await new Promise(resolve => setTimeout(resolve, 1000))
// //       }

// //       if (!jsPrintManager.isConnected()) {
// //         throw new Error('Non connecté au service d\'impression')
// //       }

// //       // 2. Créer le PDF
// //       const { blobUrl } = await createPDF()
      
// //       // 3. Obtenir l'instance
// //       const instance = jsPrintManager.getInstance()
// //       const { ClientPrintJob, InstalledPrinter } = instance
      
// //       // Vérifier si PrintFilePDF existe
// //       if (!instance.PrintFilePDF) {
// //         throw new Error('PrintFilePDF n\'est pas disponible dans cette version de JSPrintManager')
// //       }
      
// //       const { PrintFilePDF, FileSourceType } = instance

// //       // 4. Essayer avec PrintFile standard si PrintFilePDF ne fonctionne pas
// //       let printFile
      
// //       try {
// //         // Essayer PrintFilePDF d'abord
// //         printFile = new PrintFilePDF(
// //           blobUrl,
// //           FileSourceType.URL,
// //           'facture.pdf',
// //           1
// //         )
// //       } catch (pdfError) {
// //         console.warn('PrintFilePDF échoué, essai avec PrintFile standard:', pdfError)
        
// //         // Fallback: utiliser PrintFile standard
// //         if (instance.PrintFile) {
// //           printFile = new instance.PrintFile(
// //             blobUrl,
// //             FileSourceType.URL,
// //             'facture.pdf',
// //             1
// //           )
// //         } else {
// //           throw new Error('Aucune méthode d\'impression PDF disponible')
// //         }
// //       }

// //       // 5. Créer et envoyer le job
// //       const cpj = new ClientPrintJob()
// //       cpj.clientPrinter = new InstalledPrinter(selectedPrinter)
// //       cpj.files.push(printFile)

// //       await new Promise((resolve, reject) => {
// //         cpj.onFinished = resolve
// //         cpj.onError = reject
// //         cpj.sendToClient()
// //       })

// //       setPrintStatus('Impression réussie!')
// //       setTimeout(() => setPrintStatus(''), 3000)

// //     } catch (error) {
// //       console.error('Erreur:', error)
// //       setPrintStatus(`Erreur: ${error.message}`)
// //       alert(`Erreur d'impression: ${error.message}`)
// //     } finally {
// //       setPrinting(false)
// //     }
// //   }

// //   // Fonction pour imprimer et télécharger
// //   const handlePrintAndDownload = async () => {
// //     // D'abord télécharger
// //     await generatePDF()
    
// //     // Ensuite imprimer si tout est configuré
// //     if (selectedPrinter && isPrintConnected) {
// //       await new Promise(resolve => setTimeout(resolve, 500))
// //       await printInvoiceAlternative()
// //     }
// //   }

// //   if (!saleData) {
// //     return null
// //   }

// //   return (
// //     <div className="flex flex-col sm:flex-row gap-2">
// //       {/* Bouton Télécharger */}
// //       <button
// //         onClick={generatePDF}
// //         disabled={generating || shopLoading}
// //         className="flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-1 min-w-[120px]"
// //       >
// //         {generating ? (
// //           <>
// //             <Loader2 className="h-5 w-5 mr-2 animate-spin" />
// //             Génération...
// //           </>
// //         ) : (
// //           <>
// //             <Download className="h-5 w-5 mr-2" />
// //             Télécharger
// //           </>
// //         )}
// //       </button>

// //       {/* Bouton Imprimer */}
// //       <button
// //         onClick={printInvoiceAlternative}
// //         disabled={printing || shopLoading || !selectedPrinter || !isPrintConnected}
// //         className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-1 min-w-[120px]"
// //         title={!selectedPrinter ? "Sélectionnez une imprimante d'abord" : !isPrintConnected ? "JSPrintManager non connecté" : ""}
// //       >
// //         {printing ? (
// //           <>
// //             <Loader2 className="h-5 w-5 mr-2 animate-spin" />
// //             Impression...
// //           </>
// //         ) : (
// //           <>
// //             <Printer className="h-5 w-5 mr-2" />
// //             Imprimer
// //           </>
// //         )}
// //       </button>

// //       {/* Bouton Imprimer et Télécharger */}
// //       <button
// //         onClick={handlePrintAndDownload}
// //         disabled={generating || printing || shopLoading}
// //         className="flex items-center justify-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-1 min-w-[120px]"
// //       >
// //         {generating || printing ? (
// //           <>
// //             <Loader2 className="h-5 w-5 mr-2 animate-spin" />
// //             Traitement...
// //           </>
// //         ) : (
// //           <>
// //             <Printer className="h-5 w-5 mr-2" />
// //             Imprimer & Tél.
// //           </>
// //         )}
// //       </button>

// //       {/* Statut de l'impression */}
// //       {printStatus && (
// //         <div className="mt-2 text-sm text-center w-full">
// //           <p className={`px-3 py-1 rounded-lg ${
// //             printStatus.includes('Erreur') 
// //               ? 'bg-red-100 text-red-700' 
// //               : 'bg-blue-100 text-blue-700'
// //           }`}>
// //             {printStatus}
// //           </p>
// //           {selectedPrinter && !printStatus.includes('Erreur') && (
// //             <p className="text-xs text-gray-500 mt-1">
// //               Imprimante: <span className="font-medium">{selectedPrinter}</span>
// //             </p>
// //           )}
// //         </div>
// //       )}

// //       {/* Information sur l'imprimante */}
// //       {!selectedPrinter && !printing && (
// //         <div className="mt-2 w-full">
// //           <p className="text-xs text-amber-600 text-center">
// //             ⚠️ Sélectionnez dabord une imprimante dans la page de gestion des imprimantes
// //           </p>
// //         </div>
// //       )}

// //       {selectedPrinter && !isPrintConnected && !printing && (
// //         <div className="mt-2 w-full">
// //           <div className="text-xs text-amber-600 text-center space-y-1">
// //             <p>⚠️ JSPrintManager non connecté</p>
// //             <p className="text-xs">
// //               <a 
// //                 href="https://neodynamic.com/downloads/jspm" 
// //                 target="_blank" 
// //                 rel="noopener noreferrer"
// //                 className="text-blue-600 hover:underline"
// //               >
// //                 Télécharger lapplication
// //               </a>
// //               , lancez-la puis rafraîchissez la page
// //             </p>
// //           </div>
// //         </div>
// //       )}
// //     </div>
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
//   const [pdfBlobUrl, setPdfBlobUrl] = useState(null)

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
//       // Nettoyer l'URL blob lors du démontage
//       if (pdfBlobUrl) {
//         URL.revokeObjectURL(pdfBlobUrl)
//       }
//     }
//   }, [])

//   // Nettoyer l'URL blob quand elle change
//   useEffect(() => {
//     return () => {
//       if (pdfBlobUrl) {
//         URL.revokeObjectURL(pdfBlobUrl)
//       }
//     }
//   }, [pdfBlobUrl])

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

//   // Formater les nombres pour l'affichage (avec 0 décimales)
//   const formatNumber = (num) => {
//     return Math.round(num).toString()
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

//   // Fonction pour créer le PDF et retourner un blob URL
//   const createPDF = async () => {
//     if (!saleData) {
//       throw new Error('Aucune donnée de vente fournie')
//     }

//     // DEBUG: Voir les données reçues
//     console.log('📄 Données reçues pour facture:', {
//       saleNumber: saleData.sale_number,
//       itemsCount: saleData.items?.length,
//       firstItem: saleData.items?.[0],
//       hasUnitPrice: saleData.items?.[0]?.unit_price !== undefined,
//       hasTotal: saleData.items?.[0]?.total !== undefined
//     })

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
    
//     // Positions X pour les colonnes (AJUSTÉES pour PU/PT)
//     const colQtyX = leftMargin
//     const colProductX = leftMargin + 8  // Espace pour Qty
//     const colPUX = leftMargin + 35      // Position pour PU
//     const colPTX = pageWidth - rightMargin - 10  // Position pour PT (aligné à droite)

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

//     // === INFORMATIONS SUPPLEMENTAIRES DU SHOP ===
//     pdf.setFontSize(8)
//     pdf.setFont('courier', 'normal')

//     // Champ personnalisé 1
//     if (shop?.custom_field_1 && shop.custom_field_1 !== 'Premier text par defaut') {
//       pdf.text(shop.custom_field_1, pageWidth / 2, yPos, { align: 'center' })
//       yPos += smallLineHeight
//     }

//     // RCCM
//     if (shop?.rccm) {
//       pdf.text(`RCCM: ${shop.rccm}`, pageWidth / 2, yPos, { align: 'center' })
//       yPos += smallLineHeight
//     }

//     // Adresse du shop
//     if (shop?.shop_address) {
//       // Gérer les adresses longues en les tronquant
//       let address = shop.shop_address
//       if (address.length > 40) {
//         address = address.substring(0, 40) + '...'
//       }
//       pdf.text(address, pageWidth / 2, yPos, { align: 'center' })
//       yPos += smallLineHeight
//     }

//     // Téléphone centré
//     pdf.text(`Tel: ${shop?.phone || '+2439906644057'}`, pageWidth / 2, yPos, { align: 'center' })
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

//     // === EN-TÊTE DU TABLEAU (AJUSTÉ POUR PU/PT) ===
//     pdf.setFontSize(8)
//     pdf.setFont('courier', 'bold')
    
//     // En-têtes des colonnes
//     pdf.text('Qty', colQtyX, yPos)
//     pdf.text('Produit', colProductX, yPos)
//     pdf.text('PU', colPUX, yPos)
//     pdf.text('PT', colPTX, yPos, { align: 'right' })
    
//     yPos += smallLineHeight

//     // Ligne sous les en-têtes
//     drawLine(pdf, yPos)
//     yPos += 3

//     // === ARTICLES ===
//     pdf.setFont('courier', 'normal')
//     pdf.setFontSize(8)
    
//     items.forEach((item, index) => {
//       const quantity = item.quantity || 1
//       const productName = item.name || 'Produit'
      
//       // UTILISER unit_price (que vous avez maintenant dans vos données)
//       const unitPrice = item.unit_price || 0
      
//       // UTILISER total (que vous avez maintenant dans vos données)
//       const itemTotal = item.total || 0
      
//       console.log(`📦 Article ${index + 1}:`, {
//         name: productName,
//         quantity,
//         unit_price: unitPrice,
//         total: itemTotal,
//         calculatedPT: unitPrice * quantity
//       })

//       // Tronquer le nom du produit si trop long
//       let displayName = productName
//       const maxNameLength = 18  // Réduit pour laisser de la place pour PU et PT
//       if (displayName.length > maxNameLength) {
//         displayName = displayName.substring(0, maxNameLength - 3) + '...'
//       }

//       // Afficher les données dans les colonnes
//       pdf.text(`${quantity}`, colQtyX, yPos)
//       pdf.text(displayName, colProductX, yPos)
      
//       // Afficher PU (formaté sans décimales)
//       const puFormatted = formatNumber(unitPrice)
//       pdf.text(puFormatted, colPUX, yPos)
      
//       // Afficher PT (formaté sans décimales)
//       const ptFormatted = formatNumber(itemTotal)
//       pdf.text(ptFormatted, colPTX, yPos, { align: 'right' })
      
//       yPos += smallLineHeight

//       // Vérifier si on dépasse la page
//       if (yPos > 285) {
//         pdf.addPage()
//         yPos = 10
//         pdf.setFont('courier')
//         pdf.setFontSize(8)
//         // Redessiner l'en-tête du tableau sur la nouvelle page
//         pdf.setFont('courier', 'bold')
//         pdf.text('Qty', colQtyX, yPos)
//         pdf.text('Produit', colProductX, yPos)
//         pdf.text('PU', colPUX, yPos)
//         pdf.text('PT', colPTX, yPos, { align: 'right' })
//         yPos += smallLineHeight
//         drawLine(pdf, yPos)
//         yPos += 3
//         pdf.setFont('courier', 'normal')
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
//     pdf.text(formatCurrency(subtotal, currency), colPTX, yPos, { align: 'right' })
//     yPos += smallLineHeight

//     // TVA
//     pdf.text(`TVA (${vatRate}%):`, leftMargin, yPos)
//     pdf.text(formatCurrency(vat, currency), colPTX, yPos, { align: 'right' })
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
//     pdf.text(formatCurrency(total, currency), colPTX, yPos, { align: 'right' })
//     yPos += lineHeight + 1.5

//     // === MODE DE PAIEMENT ===
//     pdf.setFont('courier', 'normal')
//     pdf.setFontSize(8)
//     pdf.text(`Paiement: ${getPaymentMethodName(paymentMethod)}`, pageWidth / 2, yPos, { align: 'center' })
//     yPos += lineHeight + 2

//     // === MESSAGES ===
//     pdf.setFontSize(9)
//     pdf.text('Merci pour votre visite!', pageWidth / 2, yPos, { align: 'center' })
//     yPos += smallLineHeight

//     // Message du shop (invoice_message)
//     if (shop?.invoice_message) {
//       pdf.setFontSize(8)
//       pdf.text(shop.invoice_message, pageWidth / 2, yPos, { align: 'center' })
//       yPos += smallLineHeight
//     }

//     // Receipt message (receipt_message)
//     if (shop?.receipt_message && shop.receipt_message !== 'Veuillez conserver ce reçu.') {
//       pdf.setFontSize(8)
//       // Ajuster le texte si trop long
//       let receiptMsg = shop.receipt_message
//       if (receiptMsg.length > 50) {
//         receiptMsg = receiptMsg.substring(0, 50) + '...'
//       }
//       pdf.text(receiptMsg, pageWidth / 2, yPos, { align: 'center' })
//       yPos += smallLineHeight
//     }

//     // Contact
//     pdf.setFontSize(7)
//     pdf.text(`Contact: ${shop?.phone || '+2439906644057'}`, pageWidth / 2, yPos, { align: 'center' })

//     // Générer le PDF et créer un blob URL
//     const pdfBlob = pdf.output('blob')
//     const blobUrl = URL.createObjectURL(pdfBlob)
    
//     // Nettoyer l'ancienne URL blob
//     if (pdfBlobUrl) {
//       URL.revokeObjectURL(pdfBlobUrl)
//     }
    
//     setPdfBlobUrl(blobUrl)

//     return {
//       pdf,
//       blobUrl,
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
//       const { pdf, saleNumber } = await createPDF()
      
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

//   // Imprimer le PDF via JSPrintManager (version corrigée)
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

//       // 2. Créer le PDF et obtenir l'URL blob
//       setPrintStatus('Génération du PDF...')
//       const { blobUrl } = await createPDF()
      
//       if (!blobUrl) {
//         throw new Error('Impossible de générer le PDF')
//       }

//       // 3. Obtenir l'instance JSPrintManager
//       const instance = jsPrintManager.getInstance()
//       const { ClientPrintJob, InstalledPrinter, PrintFilePDF, FileSourceType } = instance
      
//       // 4. Créer un job d'impression
//       const cpj = new ClientPrintJob()
//       cpj.clientPrinter = new InstalledPrinter(selectedPrinter)

//       // 5. IMPORTANT: Utiliser PrintFilePDF AVEC UNE URL comme dans l'exemple
//       // Le premier paramètre doit être une string (URL), pas un ArrayBuffer
//       const printFile = new PrintFilePDF(
//         blobUrl,                // filePath (URL string)
//         FileSourceType.URL,     // fileSourceType
//         'facture.pdf',          // fileName
//         1                       // copies
//       )
      
//       cpj.files.push(printFile)

//       // 6. Gérer l'impression
//       await new Promise((resolve, reject) => {
//         cpj.onFinished = () => {
//           console.log('Impression PDF terminée avec succès')
//           resolve()
//         }

//         cpj.onError = (error) => {
//           console.error('Erreur d\'impression PDF:', error)
//           reject(new Error(`Échec de l'impression: ${error.message || 'Erreur inconnue'}`))
//         }

//         cpj.sendToClient()
//       })

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

//   // Version alternative pour vérifier si PrintFilePDF existe
//   const printInvoiceAlternative = async () => {
//     if (!saleData || !selectedPrinter || !isPrintConnected) {
//       alert('Configuration requise manquante')
//       return
//     }

//     setPrinting(true)
//     setPrintStatus('Préparation...')

//     try {
//       // 1. Vérifier la connexion
//       if (!jsPrintManager.isConnected()) {
//         await jsPrintManager.initialize()
//         await new Promise(resolve => setTimeout(resolve, 1000))
//       }

//       if (!jsPrintManager.isConnected()) {
//         throw new Error('Non connecté au service d\'impression')
//       }

//       // 2. Créer le PDF
//       const { blobUrl } = await createPDF()
      
//       // 3. Obtenir l'instance
//       const instance = jsPrintManager.getInstance()
//       const { ClientPrintJob, InstalledPrinter } = instance
      
//       // Vérifier si PrintFilePDF existe
//       if (!instance.PrintFilePDF) {
//         throw new Error('PrintFilePDF n\'est pas disponible dans cette version de JSPrintManager')
//       }
      
//       const { PrintFilePDF, FileSourceType } = instance

//       // 4. Essayer avec PrintFile standard si PrintFilePDF ne fonctionne pas
//       let printFile
      
//       try {
//         // Essayer PrintFilePDF d'abord
//         printFile = new PrintFilePDF(
//           blobUrl,
//           FileSourceType.URL,
//           'facture.pdf',
//           1
//         )
//       } catch (pdfError) {
//         console.warn('PrintFilePDF échoué, essai avec PrintFile standard:', pdfError)
        
//         // Fallback: utiliser PrintFile standard
//         if (instance.PrintFile) {
//           printFile = new instance.PrintFile(
//             blobUrl,
//             FileSourceType.URL,
//             'facture.pdf',
//             1
//           )
//         } else {
//           throw new Error('Aucune méthode d\'impression PDF disponible')
//         }
//       }

//       // 5. Créer et envoyer le job
//       const cpj = new ClientPrintJob()
//       cpj.clientPrinter = new InstalledPrinter(selectedPrinter)
//       cpj.files.push(printFile)

//       await new Promise((resolve, reject) => {
//         cpj.onFinished = resolve
//         cpj.onError = reject
//         cpj.sendToClient()
//       })

//       setPrintStatus('Impression réussie!')
//       setTimeout(() => setPrintStatus(''), 3000)

//     } catch (error) {
//       console.error('Erreur:', error)
//       setPrintStatus(`Erreur: ${error.message}`)
//       alert(`Erreur d'impression: ${error.message}`)
//     } finally {
//       setPrinting(false)
//     }
//   }

//   // Fonction pour imprimer et télécharger
//   const handlePrintAndDownload = async () => {
//     // D'abord télécharger
//     await generatePDF()
    
//     // Ensuite imprimer si tout est configuré
//     if (selectedPrinter && isPrintConnected) {
//       await new Promise(resolve => setTimeout(resolve, 500))
//       await printInvoiceAlternative()
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
//         onClick={printInvoiceAlternative}
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
//         disabled={generating || printing || shopLoading}
//         className="flex items-center justify-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-1 min-w-[120px]"
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

  // Formater les nombres pour l'affichage (avec 0 décimales)
  const formatNumber = (num) => {
    return Math.round(num).toString()
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
  const drawLine = (pdf, y, startX = 5, endX = 75) => {
    pdf.setLineWidth(0.1)
    pdf.line(startX, y, endX, y)
  }

  // Fonction pour créer le PDF et retourner un blob URL
  const createPDF = async () => {
    if (!saleData) {
      throw new Error('Aucune donnée de vente fournie')
    }

    // DEBUG: Voir les données reçues
    console.log('📄 Données reçues pour facture:', {
      saleNumber: saleData.sale_number,
      itemsCount: saleData.items?.length,
      firstItem: saleData.items?.[0],
      hasUnitPrice: saleData.items?.[0]?.unit_price !== undefined,
      hasTotal: saleData.items?.[0]?.total !== undefined
    })

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
    
    // MARGES AUGMENTÉES - 5mm à gauche
    const leftMargin = 10
    const rightMargin = 5
    
    // Positions X pour les colonnes (AJUSTÉES pour PU/PT)
    const colQtyX = leftMargin
    const colProductX = leftMargin + 8  // Espace pour Qty
    const colPUX = leftMargin + 35      // Position pour PU
    const colPTX = pageWidth - rightMargin - 10  // Position pour PT (aligné à droite)

    // Utiliser une police monospace standard pour meilleure compatibilité
    // 'Courier' est remplacé par 'Helvetica' qui est plus lisible
    pdf.setFont('helvetica')
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
    pdf.setFont('helvetica', 'bold')
    pdf.text(shop?.shop_name || 'ErrorShop', pageWidth / 2, yPos, { align: 'center' })
    yPos += smallLineHeight

    // === INFORMATIONS SUPPLEMENTAIRES DU SHOP ===
    pdf.setFontSize(8)
    pdf.setFont('helvetica', 'normal')

    // Champ personnalisé 1
    if (shop?.custom_field_1 && shop.custom_field_1 !== 'Premier text par defaut') {
      pdf.text(shop.custom_field_1, pageWidth / 2, yPos, { align: 'center' })
      yPos += smallLineHeight
    }

    // RCCM
    if (shop?.rccm) {
      pdf.text(`RCCM: ${shop.rccm}`, pageWidth / 2, yPos, { align: 'center' })
      yPos += smallLineHeight
    }

    // Adresse du shop
    if (shop?.shop_address) {
      // Gérer les adresses longues en les tronquant
      let address = shop.shop_address
      if (address.length > 40) {
        address = address.substring(0, 40) + '...'
      }
      pdf.text(address, pageWidth / 2, yPos, { align: 'center' })
      yPos += smallLineHeight
    }

    // Téléphone centré
    pdf.text(`Tel: ${shop?.phone || '+2439906644057'}`, pageWidth / 2, yPos, { align: 'center' })
    yPos += lineHeight + 1

    // === LIGNE DE SÉPARATION FINE ===
    drawLine(pdf, yPos)
    yPos += 3.5

    // === TITRE FACTURE ===
    pdf.setFontSize(11)
    pdf.setFont('helvetica', 'bold')
    pdf.text('FACTURE', pageWidth / 2, yPos, { align: 'center' })
    yPos += lineHeight + 1

    // === NUMÉRO ET DATE ===
    pdf.setFontSize(8)
    pdf.setFont('helvetica', 'normal')
    pdf.text(`N°: ${saleNumber}`, leftMargin, yPos)
    yPos += smallLineHeight
    
    pdf.text(`Date: ${formatDateTime(saleDate)}`, leftMargin, yPos)
    yPos += lineHeight + 1

    // === INFORMATIONS CLIENT ===
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

    // === LIGNE DE SÉPARATION FINE ===
    drawLine(pdf, yPos)
    yPos += 3

    // === EN-TÊTE DU TABLEAU (AJUSTÉ POUR PU/PT) ===
    pdf.setFontSize(8)
    pdf.setFont('helvetica', 'bold')
    
    // En-têtes des colonnes
    pdf.text('Qty', colQtyX, yPos)
    pdf.text('Produit', colProductX, yPos)
    pdf.text('PU', colPUX, yPos)
    pdf.text('PT', colPTX, yPos, { align: 'right' })
    
    yPos += smallLineHeight

    // Ligne sous les en-têtes
    drawLine(pdf, yPos)
    yPos += 3

    // === ARTICLES ===
    pdf.setFont('helvetica', 'normal')
    pdf.setFontSize(8)
    
    items.forEach((item, index) => {
      const quantity = item.quantity || 1
      const productName = item.name || 'Produit'
      
      // UTILISER unit_price (que vous avez maintenant dans vos données)
      const unitPrice = item.unit_price || 0
      
      // UTILISER total (que vous avez maintenant dans vos données)
      const itemTotal = item.total || 0
      
      console.log(`📦 Article ${index + 1}:`, {
        name: productName,
        quantity,
        unit_price: unitPrice,
        total: itemTotal,
        calculatedPT: unitPrice * quantity
      })

      // Tronquer le nom du produit si trop long
      let displayName = productName
      const maxNameLength = 18  // Réduit pour laisser de la place pour PU et PT
      if (displayName.length > maxNameLength) {
        displayName = displayName.substring(0, maxNameLength - 3) + '...'
      }

      // Afficher les données dans les colonnes
      pdf.text(`${quantity}`, colQtyX, yPos)
      pdf.text(displayName, colProductX, yPos)
      
      // Afficher PU (formaté sans décimales)
      const puFormatted = formatNumber(unitPrice)
      pdf.text(puFormatted, colPUX, yPos)
      
      // Afficher PT (formaté sans décimales)
      const ptFormatted = formatNumber(itemTotal)
      pdf.text(ptFormatted, colPTX, yPos, { align: 'right' })
      
      yPos += smallLineHeight

      // Vérifier si on dépasse la page
      if (yPos > 285) {
        pdf.addPage()
        yPos = 10
        pdf.setFont('helvetica')
        pdf.setFontSize(8)
        // Redessiner l'en-tête du tableau sur la nouvelle page
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

    // === LIGNE DE SÉPARATION FINE ===
    yPos += 0.5
    drawLine(pdf, yPos)
    yPos += 5

    // === TOTAUX ===
    // Sous-total
    pdf.setFont('helvetica', 'normal')
    pdf.setFontSize(8)
    pdf.text('SOUS-TOTAL:', leftMargin, yPos)
    pdf.text(formatCurrency(subtotal, currency), colPTX, yPos, { align: 'right' })
    yPos += smallLineHeight

    // TVA
    pdf.text(`TVA (${vatRate}%):`, leftMargin, yPos)
    pdf.text(formatCurrency(vat, currency), colPTX, yPos, { align: 'right' })
    yPos += smallLineHeight

    // Ligne de séparation avant total
    pdf.setLineWidth(0.2)
    drawLine(pdf, yPos)
    pdf.setLineWidth(0.1)
    yPos += 3

    // TOTAL
    pdf.setFont('helvetica', 'bold')
    pdf.setFontSize(9)
    pdf.text('TOTAL:', leftMargin, yPos)
    pdf.text(formatCurrency(total, currency), colPTX, yPos, { align: 'right' })
    yPos += lineHeight + 1.5

    // === MODE DE PAIEMENT ===
    pdf.setFont('helvetica', 'normal')
    pdf.setFontSize(8)
    pdf.text(`Paiement: ${getPaymentMethodName(paymentMethod)}`, pageWidth / 2, yPos, { align: 'center' })
    yPos += lineHeight + 2

    // === MESSAGES ===
    pdf.setFontSize(9)
    pdf.text('Merci pour votre visite!', pageWidth / 2, yPos, { align: 'center' })
    yPos += smallLineHeight

    // Message du shop (invoice_message)
    if (shop?.invoice_message) {
      pdf.setFontSize(8)
      pdf.text(shop.invoice_message, pageWidth / 2, yPos, { align: 'center' })
      yPos += smallLineHeight
    }

    // Receipt message (receipt_message)
    if (shop?.receipt_message && shop.receipt_message !== 'Veuillez conserver ce reçu.') {
      pdf.setFontSize(8)
      // Ajuster le texte si trop long
      let receiptMsg = shop.receipt_message
      if (receiptMsg.length > 50) {
        receiptMsg = receiptMsg.substring(0, 50) + '...'
      }
      pdf.text(receiptMsg, pageWidth / 2, yPos, { align: 'center' })
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