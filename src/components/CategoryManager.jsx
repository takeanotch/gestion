'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Search, 
  Folder,
  Loader2,
  AlertCircle,
  CheckCircle,
  X,
  Save
} from 'lucide-react'

export default function CategoryManager() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [search, setSearch] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [newCategory, setNewCategory] = useState('')
  const [editName, setEditName] = useState('')
  const [message, setMessage] = useState({ type: '', text: '' })

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name', { ascending: true })

      if (error) throw error
      setCategories(data || [])
    } catch (error) {
      setMessage({ type: 'error', text: 'Erreur chargement catégories' })
    } finally {
      setLoading(false)
    }
  }

  const handleAddCategory = async (e) => {
    e.preventDefault()
    
    if (!newCategory.trim()) {
      setMessage({ type: 'error', text: 'Le nom est requis' })
      return
    }

    // Vérifier si la catégorie existe déjà
    if (categories.some(cat => cat.name.toLowerCase() === newCategory.toLowerCase().trim())) {
      setMessage({ type: 'error', text: 'Cette catégorie existe déjà' })
      return
    }

    try {
      setSaving(true)
      const { data, error } = await supabase
        .from('categories')
        .insert([{ name: newCategory.trim() }])
        .select()
        .single()

      if (error) throw error
      
      setMessage({ type: 'success', text: 'Catégorie ajoutée' })
      setNewCategory('')
      fetchCategories()
    } catch (error) {
      setMessage({ type: 'error', text: 'Erreur ajout catégorie' })
    } finally {
      setSaving(false)
    }
  }

  const handleStartEdit = (category) => {
    setEditingId(category.id)
    setEditName(category.name)
  }

  const handleSaveEdit = async (id) => {
    if (!editName.trim()) {
      setMessage({ type: 'error', text: 'Le nom ne peut pas être vide' })
      return
    }

    // Vérifier si le nom existe déjà (sauf pour la catégorie actuelle)
    if (categories.some(cat => 
      cat.id !== id && 
      cat.name.toLowerCase() === editName.toLowerCase().trim()
    )) {
      setMessage({ type: 'error', text: 'Cette catégorie existe déjà' })
      return
    }

    try {
      setSaving(true)
      const { error } = await supabase
        .from('categories')
        .update({ name: editName.trim() })
        .eq('id', id)

      if (error) throw error
      
      setMessage({ type: 'success', text: 'Catégorie modifiée' })
      setEditingId(null)
      setEditName('')
      fetchCategories()
    } catch (error) {
      setMessage({ type: 'error', text: 'Erreur modification' })
    } finally {
      setSaving(false)
    }
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditName('')
  }

  const handleDelete = async (id) => {
    if (!confirm('Supprimer cette catégorie ? Les produits liés seront conservés.')) return
    
    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id)

      if (error) throw error
      
      setMessage({ type: 'success', text: 'Catégorie supprimée' })
      fetchCategories()
    } catch (error) {
      setMessage({ type: 'error', text: 'Erreur suppression' })
    }
  }

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Message */}
      {message.text && (
        <div className={`p-3 rounded-lg ${
          message.type === 'error' 
            ? 'bg-red-50 text-red-700 border border-red-200'
            : 'bg-green-50 text-green-700 border border-green-200'
        }`}>
          <div className="flex items-center gap-2">
            {message.type === 'error' ? (
              <AlertCircle className="w-4 h-4" />
            ) : (
              <CheckCircle className="w-4 h-4" />
            )}
            <span className="text-sm">{message.text}</span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form Section */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Nouvelle Catégorie
            </h2>
          </div>
          
          <form onSubmit={handleAddCategory} className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nom de la catégorie *
              </label>
              <div className="relative">
                <Folder className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ex: Électronique, Vêtements, etc."
                  required
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 w-full justify-center"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Ajout en cours...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    Ajouter la catégorie
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* List Section */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              Catégories ({categories.length})
            </h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher..."
                className="pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            </div>
          </div>

          <div className="divide-y divide-gray-200 max-h-[500px] overflow-y-auto">
            {filteredCategories.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                Aucune catégorie trouvée
              </div>
            ) : (
              filteredCategories.map((category) => (
                <div key={category.id} className="p-4 hover:bg-gray-50">
                  {editingId === category.id ? (
                    // Mode édition
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="relative flex-1">
                          <Folder className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                          <input
                            type="text"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="w-full pl-10 pr-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            autoFocus
                          />
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleSaveEdit(category.id)}
                          disabled={saving}
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50"
                        >
                          <Save className="w-3 h-3" />
                          Enregistrer
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="px-3 py-1.5 text-sm text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                        >
                          Annuler
                        </button>
                      </div>
                    </div>
                  ) : (
                    // Mode affichage
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <Folder className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">{category.name}</h3>
                          <p className="text-xs text-gray-500">
                            Créé le {new Date(category.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleStartEdit(category)}
                          className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Modifier"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(category.id)}
                          className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Supprimer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Info Footer */}
          {categories.length > 0 && (
            <div className="px-6 py-3 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>
                  {filteredCategories.length} catégorie{filteredCategories.length !== 1 ? 's' : ''} trouvée{filteredCategories.length !== 1 ? 's' : ''}
                </span>
                <span className="flex items-center gap-1">
                  <Folder className="w-3 h-3" />
                  Total: {categories.length}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-medium text-blue-900">Information</h4>
            <p className="text-sm text-blue-700 mt-1">
              La suppression d'une catégorie ne supprime pas les produits associés. 
              Les produits conserveront leur catégorie existante dans la base de données.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}