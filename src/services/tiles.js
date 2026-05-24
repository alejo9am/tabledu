import { supabase } from '@/lib/supabase'
import { getAuthenticatedUserId } from '@/services/core/auth'
import { throwIfSupabaseError } from '@/services/core/errors'

/** Fetch all tiles owned by the authenticated user. */
export const fetchUserTiles = async () => {
  const userId = await getAuthenticatedUserId()

  const { data, error } = await supabase
    .from('tiles')
    .select('*')
    .eq('user_id', userId)
    .order('name', { ascending: true })

  throwIfSupabaseError(error, 'tiles')
  return data ?? []
}

/**
 * Fetches only question-type tiles for the authenticated user and enriches each row
 * with `questionCount` (number of questions assigned to that tile).
 *
 * @returns {Promise<Array<object>>} Question tiles with `questionCount`.
 */
export const fetchUserQuestionTilesWithCounts = async () => {
  const userId = await getAuthenticatedUserId()

  const { data: tiles, error: tilesError } = await supabase
    .from('tiles')
    .select('*')
    .eq('user_id', userId)
    .eq('type', 'question')
    .order('name', { ascending: true })

  throwIfSupabaseError(tilesError, 'tiles')

  const questionTiles = tiles ?? []
  if (!questionTiles.length) {
    return []
  }

  const tileIds = questionTiles.map((tile) => tile.id)
  const { data: questions, error: questionsError } = await supabase
    .from('questions')
    .select('tile_id')
    .in('tile_id', tileIds)

  throwIfSupabaseError(questionsError, 'questions')

  const countsByTileId = {}
  for (const question of questions ?? []) {
    const tileId = question.tile_id
    countsByTileId[tileId] = (countsByTileId[tileId] ?? 0) + 1
  }

  return questionTiles.map((tile) => ({
    ...tile,
    questionCount: countsByTileId[tile.id] ?? 0,
  }))
}

/** Create one tile for the authenticated user. */
export const createTile = async ({ tile }) => {
  const userId = await getAuthenticatedUserId()

  const { data, error } = await supabase
    .from('tiles')
    .insert({
      name: tile.name,
      type: tile.type ?? 'question',
      icon: tile.icon ?? '',
      description: tile.description ?? '',
      user_id: userId,
    })
    .select('*')
    .maybeSingle()

  throwIfSupabaseError(error, 'tiles', 'create')
  return data
}

/** Update tile metadata for a tile owned by the authenticated user. */
export const updateTile = async ({ tile }) => {
  const userId = await getAuthenticatedUserId()

  if (!tile?.id) {
    throw new Error('[supabase] Failed to update tile: missing tile id')
  }

  const { data, error } = await supabase
    .from('tiles')
    .update({
      name: tile.name,
      type: tile.type ?? 'question',
      icon: tile.icon ?? '',
      description: tile.description ?? '',
    })
    .eq('id', tile.id)
    .eq('user_id', userId)
    .select('*')
    .maybeSingle()

  throwIfSupabaseError(error, 'tiles', 'update')
  return data
}

/** Delete one tile by id for the authenticated user. */
export const deleteTileById = async ({ tileId }) => {
  const userId = await getAuthenticatedUserId()

  if (!tileId) {
    throw new Error('[supabase] Failed to delete tile: missing tile id')
  }

  const { error } = await supabase
    .from('tiles')
    .delete()
    .eq('id', tileId)
    .eq('user_id', userId)

  if (error) {
    throwIfSupabaseError(error, 'tiles', 'delete')
  }
}

/**
 * Fetches unique tiles used by a board.
 * @param {string} boardId - Target board id.
 * @returns {Promise<Array<object>>} Array of tile records from `tiles`.
 * @throws {Error} If `boardId` is missing or Supabase returns an error.
 */
export const fetchBoardTiles = async (boardId) => {
  if (!boardId) {
    throw new Error('[supabase] Failed to fetch board tiles: missing board id')
  }

  const { data, error } = await supabase
    .from('board_layouts')
    .select('tile:tiles!inner(*)')
    .eq('board_id', boardId)

  throwIfSupabaseError(error, 'board_layouts')

  const seenTileIds = new Set()
  return (data ?? [])
    .map((item) => item.tile)
    .filter((tile) => tile && !seenTileIds.has(tile.id) && seenTileIds.add(tile.id))
}

/** Fetch a single tile by id (RLS-scoped read). */
export const fetchTileById = async ({ tileId }) => {
  if (!tileId) {
    throw new Error('[supabase] Failed to fetch tile: missing tile id')
  }

  const { data, error } = await supabase
    .from('tiles')
    .select('*')
    .eq('id', tileId)
    .maybeSingle()

  throwIfSupabaseError(error, 'tiles')
  return data
}
