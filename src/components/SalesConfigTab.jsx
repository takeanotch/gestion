'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Percent, Globe, Save, AlertCircle, Loader2 } from 'lucide-react'

export default function SalesConfigTab() {
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [config, setConfig] = useState({
    id: '',
    vat_amount: 20.00,
    currency: 'CDF',
    currency_rate: 1.0,
    base_currency: 'USD'
  })
  const [message, setMessage] = useState({ type: '', text: '' })

  const currencies = [
    { code: 'CDF', name: 'Franc Congolais', symbol: 'FC' },
    { code: 'USD', name: 'Dollar US', symbol: '$' },
    { code: 'EUR', name: 'Euro', symbol: '€' }
  ]

  useEffect(() => {
    fetchConfig()
  }, [])

  const fetchConfig = async () => {
    try {
      setLoading(true)
      const { data } = await supabase
        .from('sale_config')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      if (data) setConfig(data)
    } catch (error) {
      setMessage({ type: 'error', text: 'Erreur chargement configuration' })
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setConfig(prev => ({
      ...prev,
      [name]: name === 'vat_amount' || name === 'currency_rate' ? parseFloat(value) : value
    }))
  }

  const handleSave = async (e) => {
    e.preventDefault()
    
    if (config.vat_amount < 0 || config.vat_amount > 100) {
      setMessage({ type: 'error', text: 'TVA doit être entre 0 et 100%' })
      return
    }

    try {
      setSaving(true)
      const configData = { ...config, updated_at: new Date().toISOString() }

      let result
      if (config.id) {
        result = await supabase
          .from('sale_config')
          .update(configData)
          .eq('id', config.id)
          .select()
          .single()
      } else {
        result = await supabase
          .from('sale_config')
          .insert([configData])
          .select()
          .single()
      }

      if (result.error) throw result.error
      setConfig(result.data)
      setMessage({ type: 'success', text: 'Configuration sauvegardée' })
    } catch (error) {
      setMessage({ type: 'error', text: 'Erreur sauvegarde' })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Paramètres Ventes</h2>
        <p className="text-sm text-gray-600">Gestion TVA et devises</p>
      </div>

      {/* Message */}
      {message.text && (
        <div className={`m-4 p-3 rounded-lg ${
          message.type === 'error' 
            ? 'bg-red-50 text-red-700 border border-red-200'
            : 'bg-green-50 text-green-700 border border-green-200'
        }`}>
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm">{message.text}</span>
          </div>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSave} className="p-6 space-y-6">
        {/* TVA Section */}

        {/* Currency Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Taux de TVA (%)
          </label>
          <div className="relative max-w-xs">
            <input
              type="number"
              name="vat_amount"
              value={config.vat_amount}
              onChange={handleChange}
              min="0"
              max="100"
              step="0.01"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <Percent className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
          </div>
        </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Devise principale
            </label>
            <select
              name="currency"
              value={config.currency}
              onChange={handleChange}
              className="w-full py-2 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {currencies.map(curr => (
                <option key={curr.code} value={curr.code}>
                  {curr.code} - {curr.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Taux de change (1 USD = ?)
            </label>
            <div className="relative">
              <input
                type="number"
                name="currency_rate"
                value={config.currency_rate}
                onChange={handleChange}
                min="0"
                step="0.0001"
                className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500">
                {config.currency}
              </span>
            </div>
          </div>
        </div>

        {/* Rate Display */}
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <div className="flex items-center gap-3">
            <Globe className="w-5 h-5 text-blue-600" />
            <div>
              <p className="text-sm font-medium text-gray-700">Taux actuel</p>
              <p className="text-lg font-bold text-blue-700">
                1 USD = {config.currency_rate} {config.currency}
              </p>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="pt-4 border-t border-gray-200">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Enregistrement...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Enregistrer
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}