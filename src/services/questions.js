import { supabase } from '@/lib/supabase'
import { throwIfSupabaseError } from '@/services/core/errors'

/** Fetch questions available for one board. */
export const fetchQuestionsByBoardId = async (boardId) => {
  if (!boardId) {
    throw new Error('[supabase] Failed to fetch questions: missing board id')
  }

  const { data: boardLayout, error: boardLayoutError } = await supabase
    .from('board_category')
    .select('category_id')
    .eq('board_id', boardId)

  throwIfSupabaseError(boardLayoutError, 'board_category')

  const layoutRows = boardLayout ?? []
  const categoryIds = layoutRows
    .map((tile) => tile.category_id)
    .filter(Boolean)
  const uniqueCategoryIds = [...new Set(categoryIds)]
  if (!uniqueCategoryIds.length) {
    return []
  }

  const { data, error } = await supabase
    .from('questions')
    .select('*')
    .in('category_id', uniqueCategoryIds)
    .order('id', { ascending: true })

  throwIfSupabaseError(error, 'questions')
  return data ?? []
}

export const fetchQuestionCountsByCategoryIds = async (categoryIds) => {
  if (!(categoryIds ?? []).length) {
    return {}
  }

  const { data, error } = await supabase
    .from('questions')
    .select('category_id')
    .in('category_id', categoryIds ?? [])

  throwIfSupabaseError(error, 'questions')

  const countsByCategoryId = {}
  for (const question of data ?? []) {
    const categoryId = question.category_id
    countsByCategoryId[categoryId] = (countsByCategoryId[categoryId] ?? 0) + 1
  }

  return countsByCategoryId
}
