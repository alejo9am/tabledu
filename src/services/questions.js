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
  const tileIds = layoutRows
    .map((tile) => tile.category_id)
    .filter(Boolean)
  const uniqueTileIds = [...new Set(tileIds)]
  if (!uniqueTileIds.length) {
    return []
  }

  const { data, error } = await supabase
    .from('questions')
    .select('*')
    .in('category_id', uniqueTileIds)
    .order('id', { ascending: true })

  throwIfSupabaseError(error, 'questions')
  return data ?? []
}

export const fetchQuestionCountsByTileIds = async (tileIds) => {
  if (!(tileIds ?? []).length) {
    return {}
  }

  const { data, error } = await supabase
    .from('questions')
    .select('category_id')
    .in('category_id', tileIds ?? [])

  throwIfSupabaseError(error, 'questions')

  const countsByTileId = {}
  for (const question of data ?? []) {
    const tileId = question.category_id
    countsByTileId[tileId] = (countsByTileId[tileId] ?? 0) + 1
  }

  return countsByTileId
}
