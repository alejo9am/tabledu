import { supabase } from '@/lib/supabase'
import { throwIfSupabaseError } from '@/services/core/errors'

/** Fetch all questions for current authenticated user (RLS-scoped). */
export const fetchQuestions = async () => {
  const { data, error } = await supabase
    .from('questions')
    .select('id')

  throwIfSupabaseError(error, 'questions')
  return data ?? []
}

/** Fetch questions available for one board. */
export const fetchQuestionsByBoardId = async (boardId) => {
  if (!boardId) {
    throw new Error('[supabase] Failed to fetch questions: missing board id')
  }

  const { data: boardLayout, error: boardLayoutError } = await supabase
    .from('board_layouts')
    .select('tile_id')
    .eq('board_id', boardId)

  throwIfSupabaseError(boardLayoutError, 'board_layouts')

  const layoutRows = boardLayout ?? []
  const tileIds = layoutRows
    .map((tile) => tile.tile_id)
    .filter(Boolean)
  const uniqueTileIds = [...new Set(tileIds)]
  if (!uniqueTileIds.length) {
    return []
  }

  const { data, error } = await supabase
    .from('questions')
    .select('*, tileId:tile_id')
    .in('tile_id', uniqueTileIds)
    .order('id', { ascending: true })

  throwIfSupabaseError(error, 'questions')
  return data ?? []
}

/** Build a `{ [tileId]: count }` map for a tile id list. */
export const fetchQuestionCountsByTileIds = async (tileIds) => {
  if (!(tileIds ?? []).length) {
    return {}
  }

  const { data, error } = await supabase
    .from('questions')
    .select('tile_id')
    .in('tile_id', tileIds ?? [])

  throwIfSupabaseError(error, 'questions')

  const countsByTileId = {}
  for (const question of data ?? []) {
    const tileId = question.tile_id
    countsByTileId[tileId] = (countsByTileId[tileId] ?? 0) + 1
  }

  return countsByTileId
}

/** Fetch all questions that belong to one tile. */
export const fetchQuestionsByTileId = async (tileId) => {
  if (!tileId) {
    throw new Error('[supabase] Failed to fetch questions: missing tile id')
  }

  const { data, error } = await supabase
    .from('questions')
    .select('*')
    .eq('tile_id', tileId)
    .order('id', { ascending: true })

  throwIfSupabaseError(error, 'questions')
  return data ?? []
}
