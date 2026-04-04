import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY
const CATEGORY_ICONS_BUCKET = 'category-icons'

if (!supabaseUrl) {
  console.error('[supabase] Missing configuration variable: VITE_SUPABASE_URL (client/.env).')
}

if (!supabaseKey) {
  console.error('[supabase] Missing configuration variable: VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY (client/.env).')
}

export const supabase = createClient(supabaseUrl ?? '', supabaseKey ?? '')

const throwIfSupabaseError = (error, entityName) => {
  if (error) {
    throw new Error(`[supabase] Failed to fetch ${entityName}: ${error.message}`)
  }
}

export const fetchFirstBoard = async () => {
  const { data, error } = await supabase
    .from('boards')
    .select('*')
    .order('id', { ascending: true })
    .limit(1)
    .maybeSingle()

  throwIfSupabaseError(error, 'boards')
  return data
}

export const fetchCategories = async () => {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('id', { ascending: true })

  throwIfSupabaseError(error, 'categories')
  return data ?? []
}

export const fetchBoardCategory = async () => {
  const { data, error } = await supabase
    .from('board_category')
    .select('*')
    .order('position', { ascending: true })

  throwIfSupabaseError(error, 'board_category')
  return data ?? []
}

export const fetchQuestions = async () => {
  const { data, error } = await supabase
    .from('questions')
    .select('*')
    .order('id', { ascending: true })

  throwIfSupabaseError(error, 'questions')
  return data ?? []
}

export const getCategoryIconPublicUrl = (iconPath) => {
  if (typeof iconPath !== 'string' || !iconPath.includes('/')) {
    return null
  }

  const normalizedPath = iconPath.replace(/^\/+/, '')
  return supabase.storage.from(CATEGORY_ICONS_BUCKET).getPublicUrl(normalizedPath).data.publicUrl
}