import { supabase } from '@/lib/supabase'
import { getAuthenticatedUserId } from '@/services/core/auth'
import { throwIfSupabaseError } from '@/services/core/errors'

/** Fetch one board by id (RLS-scoped read). */
export const fetchBoardById = async (boardId) => {
  if (!boardId) {
    throw new Error('[supabase] Failed to fetch board: missing board id')
  }

  const { data, error } = await supabase
    .from('boards')
    .select('*')
    .eq('id', boardId)
    .maybeSingle()

  throwIfSupabaseError(error, 'boards')
  return data
}

/**
 * Fetch all boards visible to the authenticated user.
 *
 * Returns each board row enriched with a `layout` array shaped like:
 * `{ position, name, type, icon }`.
 *
 * Example:
 * `{
 *   id: 'board-1',
 *   name: 'My Board',
 *   layout: [{ position: 1, name: 'Tile 1', type: 'question', icon: 'system/hourglass.png' }]
 * }`
 *
 * @returns {Promise<Array<object & { layout: Array<{ position: number, name: string, type: string | null, icon: string | null }> }>>}
 */
export const fetchBoards = async () => {
  const { data: boards, error: boardsError } = await supabase
    .from('boards')
    .select('*')
    .order('updated_at', { ascending: false })

  throwIfSupabaseError(boardsError, 'boards')

  if (!boards?.length) {
    return []
  }

  const boardIds = boards.map((board) => board.id)
  // Load the full board layout in one query and join the tile metadata we need for cards.
  const { data: layoutRows, error: layoutError } = await supabase
    .from('board_layouts')
    .select('board_id, position, tile:tiles!inner(name, type, icon)')
    .in('board_id', boardIds)
    .order('position', { ascending: true })

  throwIfSupabaseError(layoutError, 'board_layouts')

  // Example: { "board-1": [{ position: 1, name: 'Tile 1', type: 'question', icon: 'system/hourglass.png' }] }
  const layoutsByBoardId = new Map()
  for (const row of layoutRows ?? []) {
    const tile = row.tile ?? null
    // The list view only needs the tile name, type and icon.
    const layoutRow = {
      position: row.position,
      name: tile?.name ?? null,
      type: tile?.type ?? null,
      icon: tile?.icon ?? null,
    }

    if (!layoutsByBoardId.has(row.board_id)) {
      layoutsByBoardId.set(row.board_id, [])
    }

    layoutsByBoardId.get(row.board_id).push(layoutRow)
  }

  return boards.map((board) => ({
    ...board,
    layout: layoutsByBoardId.get(board.id) ?? [],
  }))
}

/** Create one board with scoring settings for the authenticated user. */
export const createBoard = async ({ board }) => {
  const userId = await getAuthenticatedUserId()

  const { data, error } = await supabase
    .from('boards')
    .insert({
      name: board.name,
      description: board.description,
      score_correct: board.scoreCorrect,
      score_incorrect: board.scoreIncorrect,
      score_attack: board.scoreAttack,
      score_challenge_winner: board.scoreChallengeWinner,
      score_challenge_loser: board.scoreChallengeLoser,
      score_challenge_draw_defender: board.scoreChallengeDrawDefender,
      score_challenge_draw_attacker: board.scoreChallengeDrawAttacker,
      user_id: userId,
    })
    .select('*')
    .maybeSingle()

  throwIfSupabaseError(error, 'boards', 'create')
  return data
}

/** Update one board by id. */
export const updateBoardById = async ({ boardId, updates }) => {
  if (!boardId) {
    throw new Error('[supabase] Failed to update board: missing board id')
  }

  const { data, error } = await supabase
    .from('boards')
    .update(updates)
    .eq('id', boardId)
    .select('*')
    .maybeSingle()

  throwIfSupabaseError(error, 'boards', 'update')
  return data
}
