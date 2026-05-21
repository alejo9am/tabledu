import { supabase } from '@/lib/supabase'
import { getAuthenticatedUserId } from '@/services/core/auth'
import { throwIfSupabaseError } from '@/services/core/errors'

export const fetchUserCategories = async (userId) => {
  if (!userId) {
    throw new Error('[supabase] Failed to fetch user categories: missing user id')
  }

  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('user_id', userId)
    .order('name', { ascending: true })

  throwIfSupabaseError(error, 'categories')
  return data ?? []
}

export const createCategory = async ({ category }) => {
  const userId = await getAuthenticatedUserId()

  const { data, error } = await supabase
    .from('categories')
    .insert({
      name: category.name,
      type: category.type ?? 'question',
      icon: category.icon ?? '',
      description: category.description ?? '',
      user_id: userId,
    })
    .select('*')
    .maybeSingle()

  throwIfSupabaseError(error, 'categories')
  return data
}

export const upsertCategory = async ({ category }) => {
  const userId = await getAuthenticatedUserId()

  if (!category?.id) {
    return createCategory({ category })
  }

  const { data, error } = await supabase
    .from('categories')
    .update({
      name: category.name,
      type: category.type ?? 'question',
      icon: category.icon ?? '',
      description: category.description ?? '',
    })
    .eq('id', category.id)
    .eq('user_id', userId)
    .select('*')
    .maybeSingle()

  throwIfSupabaseError(error, 'categories')
  return data
}

/**
 * Fetches unique categories used by a board.
 * @param {string} boardId - Target board id.
 * @returns {Promise<Array<object>>} Array of category records from `categories`.
 * @throws {Error} If `boardId` is missing or Supabase returns an error.
 */
export const fetchBoardCategories = async (boardId) => {
  if (!boardId) {
    throw new Error('[supabase] Failed to fetch board categories: missing board id')
  }

  const { data, error } = await supabase
    .from('board_category')
    .select('category:categories!inner(*)')
    .eq('board_id', boardId)

  throwIfSupabaseError(error, 'board_category')

  const seenCategoryIds = new Set()
  return (data ?? [])
    .map((item) => item.category)
    .filter((category) => category && !seenCategoryIds.has(category.id) && seenCategoryIds.add(category.id))
}
