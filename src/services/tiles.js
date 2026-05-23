import { supabase } from '@/lib/supabase'
import { getAuthenticatedUserId } from '@/services/core/auth'
import { throwIfSupabaseError } from '@/services/core/errors'

export const fetchUserTiles = async (userId) => {
  if (!userId) {
    throw new Error('[supabase] Failed to fetch user tiles: missing user id')
  }

  const { data, error } = await supabase
    .from('tiles')
    .select('*')
    .eq('user_id', userId)
    .order('name', { ascending: true })

  throwIfSupabaseError(error, 'tiles')
  return data ?? []
}

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

  throwIfSupabaseError(error, 'tiles')
  return data
}

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

  throwIfSupabaseError(error, 'tiles')
  return data
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
