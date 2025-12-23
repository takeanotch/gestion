'use client'

import { useState, useEffect } from 'react'
import { Download, Loader2, Printer, Check, X } from 'lucide-react'
import jsPDF from 'jspdf'
import { useShop } from '@/hooks/useShop'

export default function InvoiceGenerator({ saleData, onDownloadComplete }) {
  const [generating, setGenerating] = useState(false)
  const [printing, setPrinting] = useState(false)
  const [printStatus, setPrintStatus] = useState('')
  const { shop, loading: shopLoading } = useShop()
  const [pdfBlobUrl, setPdfBlobUrl] = useState(null)

  // Formater la date
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

  // Formater la devise
  const formatCurrency = (amount, currency = 'CDF') => {
    if (!amount) amount = 0
    const formatted = Math.round(amount).toString()
    return currency === 'CDF' ? `${formatted} FC` : `$${formatted}`
  }

  // Créer le PDF
  const createPDF = async () => {
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: [80, 297]
    })

    let yPos = 5
    const lineHeight = 4
    const pageWidth = 80
    const leftMargin = 3

    // En-tête
    pdf.setFont('courier', 'bold')
    pdf.setFontSize(12)
    pdf.text(shop?.shop_name || 'Boutique', pageWidth / 2, yPos, { align: 'center' })
    yPos += lineHeight

    pdf.setFont('courier', 'normal')
    pdf.setFontSize(9)
    pdf.text(`Tel: ${shop?.phone || ''}`, pageWidth / 2, yPos, { align: 'center' })
    yPos += lineHeight + 2

    // Numéro facture
    pdf.setFont('courier', 'bold')
    pdf.text(`FACTURE ${saleData.sale_number}`, leftMargin, yPos)
    yPos += lineHeight

    pdf.setFont('courier', 'normal')
    pdf.text(`Date: ${formatDateTime(saleData.date_time)}`, leftMargin, yPos)
    yPos += lineHeight

    // Client
    if (saleData.clientInfo) {
      pdf.text(`Client: ${saleData.clientInfo.name}`, leftMargin, yPos)
      yPos += lineHeight
      pdf.text(`Tel: ${saleData.clientInfo.phone}`, leftMargin, yPos)
      yPos += lineHeight + 2
    }

    // Ligne séparation
    pdf.line(leftMargin, yPos, pageWidth - leftMargin, yPos)
    yPos += 4

    // Articles
    saleData.items?.forEach(item => {
      pdf.text(`${item.quantity}x ${item.name}`, leftMargin, yPos)
      const totalX = pageWidth - leftMargin - 20
      pdf.text(formatCurrency(item.total, saleData.currency), totalX, yPos)
      yPos += lineHeight
    })

    // Ligne séparation
    pdf.line(leftMargin, yPos, pageWidth - leftMargin, yPos)
    yPos += 4

    // Totaux
    const totalX = pageWidth - leftMargin - 20
    
    pdf.text('Sous-total:', leftMargin, yPos)
    pdf.text(formatCurrency(saleData.subtotal, saleData.currency), totalX, yPos)
    yPos += lineHeight

    pdf.text(`TVA (${saleData.vat_rate}%):`, leftMargin, yPos)
    pdf.text(formatCurrency(saleData.vat_amount, saleData.currency), totalX, yPos)
    yPos += lineHeight

    pdf.setFont('courier', 'bold')
    pdf.text('TOTAL:', leftMargin, yPos)
    pdf.text(formatCurrency(saleData.total, saleData.currency), totalX, yPos)
    yPos += lineHeight + 2

    // Message
    pdf.setFont('courier', 'normal')
    pdf.setFontSize(8)
    pdf.text('Merci pour votre visite !', pageWidth / 2, yPos, { align: 'center' })
    
    // pdf.setFont('courier', 'normal')
    // pdf.setFontSize(10)
    // pdf.text('(FACTURE DRAFT)', pageWidth / 2, yPos, { align: 'center' })

    // Générer le PDF
    const pdfBlob = pdf.output('blob')
    const blobUrl = URL.createObjectURL(pdfBlob)
    setPdfBlobUrl(blobUrl)

    return { pdf, blobUrl }
  }

  const generatePDF = async () => {
    setGenerating(true)
    try {
      const { pdf } = await createPDF()
      pdf.save(`Facture_${saleData.sale_number}.pdf`)
      
      if (onDownloadComplete) {
        setTimeout(() => {
          onDownloadComplete()
        }, 1000)
      }
    } catch (error) {
      console.error('Erreur génération PDF:', error)
      alert('Erreur lors de la génération du PDF')
    } finally {
      setGenerating(false)
    }
  }

  const handlePrint = async () => {
    // Logique d'impression (à adapter selon votre système)
    setPrinting(true)
    try {
      const { pdf } = await createPDF()
      // Ouvrir dans un nouvel onglet pour impression
      const pdfUrl = pdf.output('bloburl')
      window.open(pdfUrl)
    } catch (error) {
      console.error('Erreur impression:', error)
    } finally {
      setPrinting(false)
    }
  }

  // Nettoyer
  useEffect(() => {
    return () => {
      if (pdfBlobUrl) {
        URL.revokeObjectURL(pdfBlobUrl)
      }
    }
  }, [pdfBlobUrl])

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        <button
          onClick={generatePDF}
          disabled={generating || shopLoading}
          className="flex-1 flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50"
        >
          {generating ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Download className="w-4 h-4 mr-2" />
          )}
          Télécharger
        </button>

        <button
          onClick={handlePrint}
          disabled={printing || shopLoading}
          className="flex-1 flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
        >
          {printing ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Printer className="w-4 h-4 mr-2" />
          )}
          Imprimer
        </button>
      </div>
      
      {printStatus && (
        <p className="text-sm text-center mt-2 px-3 py-1 bg-blue-100 text-blue-700 rounded">
          {printStatus}
        </p>
      )}
    </div>
  )
}