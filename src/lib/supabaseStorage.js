// lib/supabaseStorage.js
import { supabase } from './supabase'

export async function uploadProfileImage(userId, file) {
  try {
    const fileExt = file.name.split('.').pop()
    const fileName = `${userId}-${Date.now()}.${fileExt}`
    const filePath = `profiles/${fileName}`

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true
      })

    if (uploadError) throw uploadError

    const { data: { publicUrl } } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath)

    return publicUrl
  } catch (error) {
    console.error('Erreur upload image:', error)
    throw error
  }
}

export async function deleteProfileImage(imageUrl) {
  try {
    const fileName = imageUrl.split('/').pop()
    const { error } = await supabase.storage
      .from('avatars')
      .remove([`profiles/${fileName}`])

    if (error) throw error
    return true
  } catch (error) {
    console.error('Erreur suppression image:', error)
    throw error
  }
}