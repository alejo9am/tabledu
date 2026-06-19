import { supabase } from '@/lib/supabase'
import { throwIfSupabaseError } from '@/services/core/errors'

/** Fetch all playing games for current authenticated user (RLS-scoped). */
export const fetchGames = async () => {
  const { data, error } = await supabase
    .from('games')
    .select('*, board:boards(name)')
    .eq('status', 'playing')
    .order('updated_at', { ascending: false })

  throwIfSupabaseError(error, 'games')
  return data ?? []
}

/** Fetch one game by id. */
export const fetchGameById = async (gameId) => {
  if (!gameId) {
    throw new Error('[supabase] Failed to fetch game: missing game id')
  }

  const { data, error } = await supabase
    .from('games')
    .select('*')
    .eq('id', gameId)
    .maybeSingle()

  throwIfSupabaseError(error, 'games')
  return data
}

/** Fetch only playing games for one board. */
export const fetchPlayingGamesByBoardId = async (boardId) => {
  if (!boardId) {
    throw new Error('[supabase] Failed to fetch games: missing board id')
  }

  const { data, error } = await supabase
    .from('games')
    .select('*')
    .eq('board_id', boardId)
    .eq('status', 'playing')
    .order('updated_at', { ascending: false })

  throwIfSupabaseError(error, 'games')
  return data ?? []
}

/** Update one game by id. */
export const updateGameById = async ({ gameId, updates }) => {
  if (!gameId) {
    throw new Error('[supabase] Failed to update game: missing game id')
  }

  const { data, error } = await supabase
    .from('games')
    .update(updates)
    .eq('id', gameId)
    .select('*')
    .maybeSingle()

  throwIfSupabaseError(error, 'games', 'update')
  return data
}

/** Delete one game by id for the authenticated user. */
export const deleteGameById = async ({ gameId }) => {
  if (!gameId) {
    throw new Error('[supabase] Failed to delete game: missing game id')
  }

  const { error } = await supabase
    .from('games')
    .delete()
    .eq('id', gameId)

  throwIfSupabaseError(error, 'games', 'delete')
}

/** Create one game for a board and user. */
export const createGame = async ({ boardId, userId, status = 'lobby' }) => {
  if (!boardId) {
    throw new Error('[supabase] Failed to create game: missing board id')
  }
  if (!userId) {
    throw new Error('[supabase] Failed to create game: missing authenticated user id')
  }

  let attempts = 0
  let lastError = null

  while (attempts < 5) {
    // Generate a 6-char lowercase alphanumeric pin using base-36 conversion.
    const pin = Math.random().toString(36).slice(2, 8)
    const { data, error } = await supabase
      .from('games')
      .insert({
        pin,
        status,
        board_id: boardId,
        user_id: userId,
        current_team_id: null,
      })
      .select('*')
      .maybeSingle()

    if (!error) {
      return data
    }

    lastError = error
    attempts += 1
  }

  throwIfSupabaseError(lastError, 'games', 'create')
  return null
}
