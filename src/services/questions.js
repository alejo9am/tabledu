import { supabase } from '@/lib/supabase'
import { getAuthenticatedUserId } from '@/services/core/auth'
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

/** Create a new true/false question inside a tile. */
export const createQuestion = async ({ tileId, text, answer }) => {
  const userId = await getAuthenticatedUserId()

  if (!tileId) {
    throw new Error('[supabase] Failed to create question: missing tile id')
  }

  const { data, error } = await supabase
    .from('questions')
    .insert({
      tile_id: tileId,
      text: text ?? '',
      answer: Boolean(answer),
      user_id: userId,
    })
    .select('*')
    .maybeSingle()

  throwIfSupabaseError(error, 'questions', 'create')
  return data
}

/** Patch a question row by id for the authenticated user. */
export const updateQuestionById = async ({ questionId, patch }) => {
  const userId = await getAuthenticatedUserId()

  if (!questionId) {
    throw new Error('[supabase] Failed to update question: missing question id')
  }

  const { data, error } = await supabase
    .from('questions')
    .update(patch)
    .eq('id', questionId)
    .eq('user_id', userId)
    .select('*')
    .maybeSingle()

  throwIfSupabaseError(error, 'questions', 'update')
  return data
}

/** Delete many questions by id for the authenticated user. */
export const deleteQuestionsByIds = async ({ questionIds }) => {
  const userId = await getAuthenticatedUserId()

  if (!(questionIds ?? []).length) {
    return
  }

  const { error } = await supabase
    .from('questions')
    .delete()
    .in('id', questionIds)
    .eq('user_id', userId)

  throwIfSupabaseError(error, 'questions', 'delete')
}

/** Move multiple questions to another tile in one update query. */
export const moveQuestionsToTile = async ({ questionIds, destinationTileId }) => {
  const userId = await getAuthenticatedUserId()

  if (!(questionIds ?? []).length) {
    return []
  }

  if (!destinationTileId) {
    throw new Error('[supabase] Failed to move questions: missing destination tile id')
  }

  const { data, error } = await supabase
    .from('questions')
    .update({ tile_id: destinationTileId })
    .in('id', questionIds)
    .eq('user_id', userId)
    .select('id')

  throwIfSupabaseError(error, 'questions', 'update')
  return data ?? []
}
