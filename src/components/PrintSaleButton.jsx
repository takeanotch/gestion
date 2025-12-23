// Créez un composant PrintSaleButton.jsx
'use client'

import { useState } from 'react'
import { Printer, Loader2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import FactureImpressions from './FactureImpressions'

export default function PrintSaleButton({ saleId, saleBasicData, compact = true }) {
  const [loadingDetails, setLoadingDetails] = useState(false)
  const [saleDetails, setSaleDetails] = useState(null)

  const loadAndPrint = async () => {
    setLoadingDetails(true)
    try {
      const { data: sale, error } = await supabase
        .from('sale')
        .select(`
          *,
          client:customer_id(name, phone),
          items:sale_item(
            quantity,
            total,
            product:product_id(name)
          )
        `)
        .eq('id', saleId)
        .single()

      if (error) throw error

      const formattedData = {
        ...sale,
        client: sale.client || {},
        items: (sale.items || []).map(item => ({
          name: item.product?.name || 'Produit',
          quantity: item.quantity,
          total: item.total
        }))
      }

      setSaleDetails(formattedData)
      
    } catch (error) {
      console.error('Erreur:', error)
      alert('Impossible de charger les détails de la vente')
    } finally {
      setLoadingDetails(false)
    }
  }

  if (loadingDetails) {
    return (
      <button className="p-1.5 text-blue-600 bg-blue-50 rounded" disabled>
        <Loader2 className="w-4 h-4 animate-spin" />
      </button>
    )
  }

  if (saleDetails) {
    return (
      <FactureImpressions 
        saleData={saleDetails}
        compact={compact}
        onPrintComplete={() => setSaleDetails(null)}
      />
    )
  }

  return (
    <button
      onClick={loadAndPrint}
      className={`p-1.5 rounded transition ${
        compact 
          ? 'text-green-600 hover:text-green-700 hover:bg-green-50'
          : 'px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg'
      }`}
      title="Imprimer la facture"
    >
      {compact ? (
        <Printer className="w-4 h-4" />
      ) : (
        <>
          <Printer className="w-4 h-4 mr-2" />
          Imprimer
        </>
      )}
    </button>
  )
}