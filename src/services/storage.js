import { supabase } from '@/lib/supabase'

const CATEGORY_ICONS_BUCKET = 'category-icons'

export const getCategoryIconPublicUrl = (iconPath) => {
  if (typeof iconPath !== 'string' || !iconPath.includes('/')) {
    return null
  }

  const normalizedPath = iconPath.replace(/^\/+/, '')
  return supabase.storage.from(CATEGORY_ICONS_BUCKET).getPublicUrl(normalizedPath).data.publicUrl
}
