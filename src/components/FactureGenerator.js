
// 'use client'

// import { useState, useEffect } from 'react'
// import { Download, Loader2 } from 'lucide-react'
// import jsPDF from 'jspdf'
// import { useShop } from '@/hooks/useShop'

// export default function FactureGenerator({ saleData, onDownloadComplete }) {
//   const [generating, setGenerating] = useState(false)
//   const { shop, loading: shopLoading } = useShop()
//   const [logoUrl, setLogoUrl] = useState(null)

//   // Charger le logo
//   useEffect(() => {
//     if (shop?.shop_icon) {
//       setLogoUrl(shop.shop_icon)
//     }
//   }, [shop])

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
//   const drawLine = (pdf, y) => {
//     pdf.setLineWidth(0.1) // Réduit de 0.5 à 0.1 (beaucoup plus fin)
//     pdf.line(2, y, 78, y)
//   }

//   // Fonction pour dessiner une ligne pointillée (optionnel)
//   const drawDashedLine = (pdf, y) => {
//     pdf.setLineWidth(0.1)
//     pdf.setDashPattern([1, 1]) // Pointillés
//     pdf.line(2, y, 78, y)
//     pdf.setDashPattern([]) // Réinitialiser à ligne continue
//   }

//   // Générer le PDF
//   const generatePDF = async () => {
//     if (!saleData) {
//       console.error('Aucune donnée de vente fournie')
//       return
//     }

//     setGenerating(true)

//     try {
//       // Récupérer les données
//       const saleNumber = saleData.sale_number || `FACT-${Date.now()}`
//       const saleDate = saleData.date_time || new Date().toISOString()
//       const clientInfo = saleData.clientInfo || {}
//       const items = saleData.items || []
//       const subtotal = saleData.subtotal || 0
//       const vat = saleData.vat_amount || 0
//       const vatRate = saleData.vat_rate || 16
//       const total = saleData.total || 0
//       const currency = saleData.currency || 'CDF'
//       const paymentMethod = saleData.payment_method || 'cash'

//       // Créer le PDF avec largeur de 80mm pour thermal printer
//       const pdf = new jsPDF({
//         orientation: 'portrait',
//         unit: 'mm',
//         format: [80, 297] // Largeur: 80mm
//       })

//       // Variables de position
//       let yPos = 5
//       const lineHeight = 4 // Réduit de 5 à 4
//       const smallLineHeight = 3.5 // Pour les textes plus petits
//       const pageWidth = 80

//       // Définir la police Courier
//       pdf.setFont('courier')
//       pdf.setFontSize(9) // Réduit légèrement la taille de police

//       // === EN-TÊTE AVEC LOGO ===
//       if (logoUrl) {
//         try {
//           const logoData = await loadImageAsBase64(logoUrl)
//           if (logoData) {
//             // Logo centré, 15mm de large (plus petit)
//             pdf.addImage(logoData, 'PNG', 32.5, yPos, 15, 15)
//             yPos += 17
//           }
//         } catch (error) {
//           console.error('Erreur chargement logo:', error)
//         }
//       }

//       // Nom du shop centré
//       pdf.setFontSize(10) // Réduit de 11 à 10
//       pdf.setFont('courier', 'bold')
//       pdf.text(shop?.shop_name || 'GOD ThanksHOP', pageWidth / 2, yPos, { align: 'center' })
//       yPos += smallLineHeight

//       // Téléphone centré
//       pdf.setFontSize(8) // Réduit de 9 à 8
//       pdf.setFont('courier', 'normal')
//       pdf.text(`Tel: ${shop?.phone || '+2439906644057'}`, pageWidth / 2, yPos, { align: 'center' })
//       yPos += lineHeight + 1

//       // === LIGNE DE SÉPARATION FINE ===
//       drawLine(pdf, yPos)
//       yPos += 2.5

//       // === TITRE FACTURE ===
//       pdf.setFontSize(11) // Réduit de 13 à 11
//       pdf.setFont('courier', 'bold')
//       pdf.text('FACTURE', pageWidth / 2, yPos, { align: 'center' })
//       yPos += lineHeight + 1

//       // === NUMÉRO ET DATE ===
//       pdf.setFontSize(8) // Réduit de 9 à 8
//       pdf.setFont('courier', 'normal')
//       pdf.text(`N°: ${saleNumber}`, 2, yPos)
//       yPos += smallLineHeight
      
//       pdf.text(`Date: ${formatDateTime(saleDate)}`, 2, yPos)
//       yPos += lineHeight + 1

//       // === INFORMATIONS CLIENT ===
//       if (clientInfo.name || clientInfo.phone) {
//         pdf.setFont('courier', 'bold')
//         pdf.setFontSize(9)
//         pdf.text('CLIENT', 2, yPos)
//         yPos += smallLineHeight

//         pdf.setFont('courier', 'normal')
//         pdf.setFontSize(8)
//         if (clientInfo.name) {
//           pdf.text(`Nom: ${clientInfo.name}`, 2, yPos)
//           yPos += smallLineHeight
//         }

//         if (clientInfo.phone) {
//           pdf.text(`Tel: ${clientInfo.phone}`, 2, yPos)
//           yPos += smallLineHeight
//         }
        
//         yPos += 1.5
//       }

//       // === LIGNE DE SÉPARATION FINE ===
//       drawLine(pdf, yPos)
//       yPos += 2

//       // === EN-TÊTE DU TABLEAU ===
//       pdf.setFontSize(8)
//       pdf.setFont('courier', 'bold')
//       pdf.text('Qty', 2, yPos)
//       pdf.text('Produit', 10, yPos)
//       pdf.text('Total', 78, yPos, { align: 'right' })
//       yPos += smallLineHeight

//       // Ligne sous les en-têtes (plus fine)
//       drawLine(pdf, yPos)
//       yPos += 1.5

//       // === ARTICLES ===
//       pdf.setFont('courier', 'normal')
//       items.forEach((item) => {
//         const quantity = item.quantity || 1
//         const productName = item.name || 'Produit'
        
//         // Tronquer le nom si trop long
//         let displayName = productName
//         if (displayName.length > 22) { // Augmenté à 22 caractères
//           displayName = displayName.substring(0, 19) + '...'
//         }

//         // Ajouter les données
//         pdf.text(`${quantity}`, 2, yPos)
//         pdf.text(displayName, 10, yPos)
//         pdf.text(formatCurrency(item.total || 0, currency), 78, yPos, { align: 'right' })
        
//         yPos += smallLineHeight

//         // Vérifier si on dépasse la page
//         if (yPos > 285) { // Augmenté la limite
//           pdf.addPage()
//           yPos = 10
//           pdf.setFont('courier')
//           pdf.setFontSize(8)
//         }
//       })

//       // === LIGNE DE SÉPARATION FINE ===
//       yPos += 0.5
//       drawLine(pdf, yPos)
//       yPos += 2

//       // === TOTAUX ===
//       // Sous-total
//       pdf.setFont('courier', 'normal')
//       pdf.setFontSize(8)
//       pdf.text('SOUS-TOTAL:', 2, yPos)
//       pdf.text(formatCurrency(subtotal, currency), 78, yPos, { align: 'right' })
//       yPos += smallLineHeight

//       // TVA
//       pdf.text(`TVA (${vatRate}%):`, 2, yPos)
//       pdf.text(formatCurrency(vat, currency), 78, yPos, { align: 'right' })
//       yPos += smallLineHeight

//       // Ligne de séparation avant total (un peu plus épaisse)
//       pdf.setLineWidth(0.2)
//       drawLine(pdf, yPos)
//       pdf.setLineWidth(0.1) // Remettre à fin
//       yPos += 1.5

//       // TOTAL
//       pdf.setFont('courier', 'bold')
//       pdf.setFontSize(9)
//       pdf.text('TOTAL:', 2, yPos)
//       pdf.text(formatCurrency(total, currency), 78, yPos, { align: 'right' })
//       yPos += lineHeight + 1.5

//       // === MODE DE PAIEMENT ===
//       pdf.setFont('courier', 'normal')
//       pdf.setFontSize(8)
//       pdf.text(`Paiement: ${getPaymentMethodName(paymentMethod)}`, pageWidth / 2, yPos, { align: 'center' })
//       yPos += lineHeight + 2

//       // === MESSAGE ===
//       pdf.setFontSize(9)
//       pdf.text('Merci pour votre visite!', pageWidth / 2, yPos, { align: 'center' })
//       yPos += smallLineHeight

//       // Message du shop
//       if (shop?.invoice_message) {
//         pdf.setFontSize(8)
//         pdf.text(shop.invoice_message, pageWidth / 2, yPos, { align: 'center' })
//         yPos += smallLineHeight
//       }

//       // Contact
//       pdf.setFontSize(7) // Très petit
//       pdf.text(`Contact: ${shop?.phone || '+2439906644057'}`, pageWidth / 2, yPos, { align: 'center' })

//       // === SAUVEGARDE ===
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

//   if (!saleData) {
//     return null
//   }

//   // Retourne uniquement le bouton (pas de prévisualisation)
//   return (
//     <button
//       onClick={generatePDF}
//       disabled={generating || shopLoading}
//       className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//     >
//       {generating ? (
//         <>
//           <Loader2 className="h-5 w-5 mr-2 animate-spin" />
//           Génération...
//         </>
//       ) : (
//         <>
//           <Download className="h-5 w-5 mr-2" />
//           Télécharger Facture
//         </>
//       )}
//     </button>
//   )
// }
'use client'

import { useState, useEffect } from 'react'
import { Download, Loader2 } from 'lucide-react'
import jsPDF from 'jspdf'
import { useShop } from '@/hooks/useShop'

export default function FactureGenerator({ saleData, onDownloadComplete }) {
  const [generating, setGenerating] = useState(false)
  const { shop, loading: shopLoading } = useShop()
  const [logoUrl, setLogoUrl] = useState(null)

  // Charger le logo
  useEffect(() => {
    if (shop?.shop_icon) {
      setLogoUrl(shop.shop_icon)
    }
  }, [shop])

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

  // Générer le PDF
  const generatePDF = async () => {
    if (!saleData) {
      console.error('Aucune donnée de vente fournie')
      return
    }

    setGenerating(true)

    try {
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
        format: [80, 150] // Largeur: 80mm
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

      // === SAUVEGARDE ===
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

  if (!saleData) {
    return null
  }

  // Retourne uniquement le bouton
  return (
    <button
      onClick={generatePDF}
      disabled={generating || shopLoading}
      className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {generating ? (
        <>
          <Loader2 className="h-5 w-5 mr-2 animate-spin" />
          Génération...
        </>
      ) : (
        <>
          <Download className="h-5 w-5 mr-2" />
          Télécharger Facture
        </>
      )}
    </button>
  )
}