'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { getUserById, checkAuth } from '@/lib/auth'
import { supabase } from '@/lib/supabase'
import { 
  Camera, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Store, 
  Calendar, 
  LogOut, 
  Save, 
  Edit,
  X,
  Shield,
  CheckCircle,
  Loader2
} from 'lucide-react'

export default function ProfilePage() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState({})
  const [uploading, setUploading] = useState(false)
  const [previewImage, setPreviewImage] = useState(null)
  const fileInputRef = useRef(null)
  const router = useRouter()

  useEffect(() => {
    const currentUser = checkAuth()
    if (!currentUser) {
      router.push('/auth/login')
      return
    }
    
    fetchUserData(currentUser.id)
  }, [])

  const fetchUserData = async (userId) => {
    try {
      const userData = await getUserById(userId)
      
      if (!userData) {
        console.error('Données utilisateur non trouvées')
        setLoading(false)
        return
      }
      
      setUser(userData)
      setFormData({
        full_name: userData.full_name || '',
        email: userData.email || '',
        phone: userData.phone || '',
        address: userData.address || '',
        shop_name: userData.shop_name || ''
      })
      
      // Récupérer l'URL de l'image de profil si elle existe
      if (userData.profile_image) {
        const { data } = supabase.storage
          .from('avatars')
          .getPublicUrl(userData.profile_image)
        setPreviewImage(data.publicUrl + '?t=' + new Date().getTime())
      }
    } catch (error) {
      console.error('Erreur récupération profil:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleImageChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file || !user) return

    // Vérifier la taille du fichier (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('La taille du fichier ne doit pas dépasser 5MB')
      return
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      alert('Type de fichier non supporté. Utilisez JPEG, PNG, GIF ou WebP.')
      return
    }

    // Créer un aperçu
    const reader = new FileReader()
    reader.onload = (e) => setPreviewImage(e.target.result)
    reader.readAsDataURL(file)

    try {
      setUploading(true)
      
      const fileExt = file.name.split('.').pop()
      const fileName = `${user.id}-${Date.now()}.${fileExt}`
      const filePath = `${fileName}`

      // Supprimer l'ancienne image si elle existe
      if (user.profile_image) {
        await supabase.storage
          .from('avatars')
          .remove([user.profile_image])
      }

      // Uploader la nouvelle image
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        })

      if (uploadError) throw uploadError

      // Mettre à jour le chemin de l'image dans la base de données
      const { error: updateError } = await supabase
        .from('users')
        .update({ profile_image: filePath })
        .eq('id', user.id)

      if (updateError) throw updateError

      // Mettre à jour les données locales
      const updatedUser = { ...user, profile_image: filePath }
      setUser(updatedUser)
      localStorage.setItem('user_data', JSON.stringify(updatedUser))

      // Rafraîchir l'URL de l'image
      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath)
      setPreviewImage(data.publicUrl + '?t=' + new Date().getTime())

      alert('Photo de profil mise à jour avec succès!')
    } catch (error) {
      console.error('Erreur upload image:', error)
      alert('Erreur lors du téléchargement de l\'image')
    } finally {
      setUploading(false)
    }
  }

  const removeProfileImage = async () => {
    if (!user?.profile_image) return

    try {
      setUploading(true)
      
      await supabase.storage
        .from('avatars')
        .remove([user.profile_image])

      await supabase
        .from('users')
        .update({ profile_image: null })
        .eq('id', user.id)

      const updatedUser = { ...user, profile_image: null }
      setUser(updatedUser)
      localStorage.setItem('user_data', JSON.stringify(updatedUser))
      
      setPreviewImage(null)
      alert('Photo de profil supprimée avec succès!')
    } catch (error) {
      console.error('Erreur suppression image:', error)
      alert('Erreur lors de la suppression de l\'image')
    } finally {
      setUploading(false)
    }
  }

  const handleSave = async () => {
    try {
      const { error } = await supabase
        .from('users')
        .update(formData)
        .eq('id', user.id)

      if (error) throw error

      const updatedUser = { ...user, ...formData }
      setUser(updatedUser)
      setEditing(false)
      localStorage.setItem('user_data', JSON.stringify(updatedUser))
      
      alert('Profil mis à jour avec succès!')
    } catch (error) {
      console.error('Erreur mise à jour profil:', error)
      alert('Erreur lors de la mise à jour du profil')
    }
  }

  const handleLogout = async () => {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user_data')
    router.push('/auth/login')
  }

  const getRoleColor = (role) => {
    switch (role) {
      case 'super-admin': return 'bg-purple-100 text-purple-800'
      case 'admin': return 'bg-blue-100 text-blue-800'
      default: return 'bg-green-100 text-green-800'
    }
  }

  const getRoleText = (role) => {
    switch (role) {
      case 'super-admin': return 'Super Admin'
      case 'admin': return 'Administrateur'
      default: return 'Vendeur'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin text-gray-600" />
          <div className="text-gray-500">Chargement du profil...</div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <User className="w-12 h-12 text-gray-400 mx-auto" />
          <div className="text-gray-700">Utilisateur non trouvé</div>
          <button
            onClick={() => router.push('/auth/login')}
            className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition"
          >
            Retour à la connexion
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Mon Profil</h1>
            <p className="text-gray-500 mt-1">Gérez vos informations personnelles</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => setEditing(!editing)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition ${
                editing 
                  ? 'bg-gray-50 text-gray-700 border-gray-300 hover:bg-gray-100' 
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              {editing ? (
                <>
                  <X className="w-4 h-4" />
                  <span className="hidden sm:inline">Annuler</span>
                </>
              ) : (
                <>
                  <Edit className="w-4 h-4" />
                  <span className="hidden sm:inline">Modifier</span>
                </>
              )}
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Déconnexion</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Colonne gauche - Photo et informations */}
          <div className="lg:col-span-1">
            {/* Photo de profil */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="relative">
                <div className="w-32 h-32 mx-auto rounded-full overflow-hidden border-2 border-gray-200">
                  {previewImage ? (
                    <img
                      src={previewImage}
                      alt="Photo de profil"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                      <User className="w-12 h-12 text-gray-400" />
                    </div>
                  )}
                </div>
                
                {/* Boutons photo */}
                <div className="flex justify-center space-x-3 mt-6">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    accept="image/jpeg,image/png,image/gif,image/webp"
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="flex items-center space-x-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg hover:bg-gray-800 transition disabled:opacity-50"
                  >
                    {uploading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Camera className="w-4 h-4" />
                    )}
                    <span>Changer</span>
                  </button>
                  {previewImage && (
                    <button
                      onClick={removeProfileImage}
                      disabled={uploading}
                      className="flex items-center space-x-2 px-3 py-2 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200 transition disabled:opacity-50"
                    >
                      <X className="w-4 h-4" />
                      <span>Supprimer</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Rôle et statut */}
              <div className="mt-8 space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Shield className="w-5 h-5 text-gray-500" />
                      <span className="font-medium text-gray-900">Rôle</span>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRoleColor(user.role)}`}>
                      {getRoleText(user.role)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Statut</span>
                    <div className="flex items-center space-x-2">
                      {user.is_active ? (
                        <>
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span className="text-sm text-green-700">Actif</span>
                        </>
                      ) : (
                        <span className="text-sm text-red-700">Inactif</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Informations de compte */}
                <div className="border-t border-gray-200 pt-6 space-y-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                    <span>Membre depuis {new Date(user.created_at).toLocaleDateString('fr-FR')}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                    <span>
                      Dernière connexion: {user.last_login 
                        ? new Date(user.last_login).toLocaleString('fr-FR')
                        : 'Jamais'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Colonne principale - Informations du profil */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">
                Informations personnelles
              </h2>
              
              <div className="space-y-6">
                {/* Grid des informations */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Nom complet */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nom complet
                    </label>
                    {editing ? (
                      <input
                        type="text"
                        name="full_name"
                        value={formData.full_name || ''}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-gray-900 focus:border-gray-900 transition text-sm"
                        placeholder="Votre nom complet"
                      />
                    ) : (
                      <div className="text-gray-900 font-medium">{user.full_name}</div>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <div className="flex items-center text-gray-600">
                      <Mail className="w-4 h-4 mr-2 text-gray-400" />
                      {user.email}
                    </div>
                  </div>

                  {/* Téléphone */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Téléphone
                    </label>
                    {editing ? (
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone || ''}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-gray-900 focus:border-gray-900 transition text-sm"
                        placeholder="+33 1 23 45 67 89"
                      />
                    ) : (
                      <div className="flex items-center text-gray-600">
                        <Phone className="w-4 h-4 mr-2 text-gray-400" />
                        {user.phone || 'Non renseigné'}
                      </div>
                    )}
                  </div>

                  {/* Nom du magasin */}
                  {user.role === 'vendor' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nom du magasin
                      </label>
                      {editing ? (
                        <input
                          type="text"
                          name="shop_name"
                          value={formData.shop_name || ''}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-gray-900 focus:border-gray-900 transition text-sm"
                          placeholder="Nom de votre magasin"
                        />
                      ) : (
                        <div className="flex items-center text-gray-900">
                          <Store className="w-4 h-4 mr-2 text-gray-400" />
                          {user.shop_name || 'Non renseigné'}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Adresse */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Adresse
                  </label>
                  {editing ? (
                    <textarea
                      name="address"
                      value={formData.address || ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-gray-900 focus:border-gray-900 transition text-sm"
                      rows="3"
                      placeholder="Votre adresse complète"
                    />
                  ) : (
                    <div className="flex text-gray-600">
                      <MapPin className="w-4 h-4 mr-2 mt-0.5 text-gray-400 flex-shrink-0" />
                      <div>{user.address || 'Non renseignée'}</div>
                    </div>
                  )}
                </div>

                {/* Bouton d'enregistrement */}
                {editing && (
                  <div className="pt-6 border-t border-gray-200">
                    <button
                      onClick={handleSave}
                      className="flex items-center justify-center space-x-2 px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition w-full sm:w-auto"
                    >
                      <Save className="w-4 h-4" />
                      <span>Enregistrer les modifications</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}