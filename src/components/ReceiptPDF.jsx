'use client'

import { useRef, useState } from 'react'
import { useReactToPrint } from 'react-to-print'
import { 
  Printer, 
  Download, 
  X,
  FileText,
  Building,
  Phone,
  User,
  CreditCard,
  Calendar,
  Hash,
  Package,
  CheckCircle
} from 'lucide-react'

export default function ReceiptPDF({ sale, saleConfig, language, onClose }) {
  const receiptRef = useRef(null)
  const [printing, setPrinting] = useState(false)

  const formatCurrency = (amount, currency = sale.currency) => {
    const formatted = new Intl.NumberFormat(language === 'fr' ? 'fr-FR' : 'en-US', {
      minimumFractionDigits: currency === 'CDF' ? 0 : 2,
      maximumFractionDigits: currency === 'CDF' ? 0 : 2
    }).format(amount || 0)
    
    return `${getCurrencySymbol(currency)} ${formatted}`
  }

  const getCurrencySymbol = (currency) => {
    return currency === 'USD' ? '$' : 'FC'
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

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat(language === 'fr' ? 'fr-FR' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  const handlePrint = useReactToPrint({
    content: () => receiptRef.current,
    documentTitle: `Recu_Vente_${sale.id}`,
    onBeforeGetContent: () => {
      setPrinting(true)
      return Promise.resolve()
    },
    onAfterPrint: () => {
      setPrinting(false)
    }
  })

  const handleDownloadPDF = async () => {
    try {
      const html2pdf = (await import('html2pdf.js')).default
      
      const element = receiptRef.current
      const opt = {
        margin: 10,
        filename: `recu_vente_${sale.id}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
          scale: 2,
          useCORS: true,
          logging: false
        },
        jsPDF: { 
          unit: 'mm', 
          format: 'a4', 
          orientation: 'portrait' 
        }
      }
      
      html2pdf().set(opt).from(element).save()
    } catch (error) {
      console.error('Erreur lors de la génération du PDF:', error)
      // Fallback sur l'impression si html2pdf échoue
      handlePrint()
    }
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex justify-between items-center">
        <div className="flex space-x-3">
          <button
            onClick={handleDownloadPDF}
            disabled={printing}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center"
          >
            <Download className="h-4 w-4 mr-2" />
            Télécharger PDF
          </button>
          <button
            onClick={handlePrint}
            disabled={printing}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 flex items-center"
          >
            <Printer className="h-4 w-4 mr-2" />
            Imprimer
          </button>
        </div>
        <button
          onClick={onClose}
          className="px-4 py-2 text-gray-600 hover:text-gray-900"
        >
          Fermer
        </button>
      </div>

      {/* Reçu à imprimer/télécharger */}
      <div 
        ref={receiptRef} 
        className="bg-white p-8 max-w-4xl mx-auto border border-gray-200 shadow-lg"
        style={{
          fontFamily: "'Helvetica', 'Arial', sans-serif",
          lineHeight: 1.5
        }}
      >
        {/* En-tête du reçu */}
        <div className="text-center mb-8">
          <div className="flex justify-center items-center mb-4">
            <Building className="h-10 w-10 text-blue-600 mr-3" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">STORE MANAGEMENT</h1>
              <p className="text-gray-600">Système de gestion de stock et ventes</p>
            </div>
          </div>
          <div className="border-t border-b border-gray-300 py-3">
            <h2 className="text-2xl font-bold text-blue-600 uppercase">REÇU DE VENTE</h2>
          </div>
        </div>

        {/* Informations de la vente */}
        <div className="grid grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <FileText className="h-5 w-5 mr-2 text-blue-600" />
              Informations de la vente
            </h3>
            <div className="space-y-2">
              <div className="flex items-center">
                <Hash className="h-4 w-4 mr-2 text-gray-500" />
                <span className="font-medium">N° Vente:</span>
                <span className="ml-2 font-bold">#{sale.id}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                <span className="font-medium">Date:</span>
                <span className="ml-2">{formatDate(sale.created_at)}</span>
              </div>
              <div className="flex items-center">
                <CreditCard className="h-4 w-4 mr-2 text-gray-500" />
                <span className="font-medium">Mode de paiement:</span>
                <span className="ml-2 font-semibold">{getPaymentMethodName(sale.payment_method)}</span>
              </div>
              <div className="flex items-center">
                <Hash className="h-4 w-4 mr-2 text-gray-500" />
                <span className="font-medium">Devise:</span>
                <span className="ml-2 font-semibold">{sale.currency}</span>
              </div>
              {sale.currency_rate && sale.currency_rate !== 1 && (
                <div className="flex items-center text-sm text-gray-600">
                  <span className="font-medium">Taux de change:</span>
                  <span className="ml-2">1 USD = {sale.currency_rate.toLocaleString('fr-FR')} CDF</span>
                </div>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <User className="h-5 w-5 mr-2 text-blue-600" />
              Informations client
            </h3>
            <div className="space-y-2">
              <div className="flex items-center">
                <User className="h-4 w-4 mr-2 text-gray-500" />
                <span className="font-medium">Nom:</span>
                <span className="ml-2 font-bold">{sale.customer?.name || 'N/A'}</span>
              </div>
              <div className="flex items-center">
                <Phone className="h-4 w-4 mr-2 text-gray-500" />
                <span className="font-medium">Téléphone:</span>
                <span className="ml-2">{sale.customer?.phone || 'N/A'}</span>
              </div>
              <div className="flex items-center">
                <Hash className="h-4 w-4 mr-2 text-gray-500" />
                <span className="font-medium">N° Client:</span>
                <span className="ml-2">{sale.customer?.client_number || 'N/A'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Détails des articles */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Package className="h-5 w-5 mr-2 text-blue-600" />
            Détails des articles
          </h3>
          
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 p-3 text-left font-semibold">Produit</th>
                <th className="border border-gray-300 p-3 text-left font-semibold">SKU</th>
                <th className="border border-gray-300 p-3 text-left font-semibold">Quantité</th>
                <th className="border border-gray-300 p-3 text-left font-semibold">Prix unitaire</th>
                <th className="border border-gray-300 p-3 text-left font-semibold">Total</th>
              </tr>
            </thead>
            <tbody>
              {sale.items?.map((item, index) => (
                <tr key={item.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="border border-gray-300 p-3">
                    <div className="font-medium">{item.product?.name}</div>
                    {item.original_currency && item.original_currency !== sale.currency && (
                      <div className="text-xs text-gray-500">
                        Devise originale: {item.original_currency}
                      </div>
                    )}
                  </td>
                  <td className="border border-gray-300 p-3">{item.product?.sku}</td>
                  <td className="border border-gray-300 p-3 text-center">{item.quantity}</td>
                  <td className="border border-gray-300 p-3">{formatCurrency(item.unit_price)}</td>
                  <td className="border border-gray-300 p-3 font-semibold">
                    {formatCurrency(item.total_price)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Récapitulatif des montants */}
        <div className="mb-8">
          <div className="max-w-md ml-auto">
            <div className="space-y-2">
              <div className="flex justify-between text-lg">
                <span className="font-medium">Sous-total:</span>
                <span className="font-semibold">{formatCurrency(sale.subtotal)}</span>
              </div>
              
              <div className="flex justify-between text-lg">
                <span className="font-medium">TVA ({saleConfig.vat_amount}%):</span>
                <span className="font-semibold">{formatCurrency(sale.vat_amount)}</span>
              </div>
              
              <div className="border-t border-gray-300 pt-2 mt-2">
                <div className="flex justify-between text-xl font-bold">
                  <span>TOTAL:</span>
                  <span className="text-blue-600">{formatCurrency(sale.total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Notes et informations supplémentaires */}
        <div className="border-t border-gray-300 pt-6">
          <div className="grid grid-cols-2 gap-8">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Informations complémentaires</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Vente traitée par: {sale.user?.full_name || currentUser?.full_name || 'N/A'}</li>
                <li>• Statut: <span className="font-semibold text-green-600">PAYÉ</span></li>
                <li>• Reçu valide comme facture</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Conditions et mentions</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Les marchandises vendues ne sont ni reprises ni échangées</li>
                <li>• Paiement effectué en {sale.currency === 'USD' ? 'Dollars US' : 'Francs Congolais'}</li>
                <li>• Merci pour votre confiance!</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Pied de page */}
        <div className="mt-8 pt-6 border-t border-gray-300 text-center">
          <div className="flex items-center justify-center mb-2">
            <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
            <span className="font-semibold text-gray-700">TRANSACTION COMPLÉTÉE AVEC SUCCÈS</span>
          </div>
          <p className="text-sm text-gray-500">
            Pour toute réclamation, veuillez présenter ce reçu dans les 7 jours suivant l'achat
          </p>
          <p className="text-xs text-gray-400 mt-4">
            Reçu généré automatiquement le {new Date().toLocaleDateString()} - Store Management System v1.0
          </p>
        </div>
      </div>

      {printing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-700">Préparation de l'impression...</p>
          </div>
        </div>
      )}
    </div>
  )
}