import { supabase } from '@/lib/supabase'

const TILE_ICONS_BUCKET = 'category-icons'

export const getTileIconPublicUrl = (iconPath) => {
  if (typeof iconPath !== 'string' || !iconPath.includes('/')) {
    return null
  }

  const normalizedPath = iconPath.replace(/^\/+/, '')
  return supabase.storage.from(TILE_ICONS_BUCKET).getPublicUrl(normalizedPath).data.publicUrl
}
