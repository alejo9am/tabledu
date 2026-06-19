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
 * It also adds `questionCount`, which sums the total of questions in that board layout,
 * and `emptyQuestionTileCount`.
 *
 * Example:
 * `{
 *   id: 'board-1',
 *   name: 'My Board',
 *   layout: [{ position: 1, name: 'Tile 1', type: 'question', icon: 'system/hourglass.png' }],
 *   questionCount: 12,
 *   emptyQuestionTileCount: 0
 * }`
 *
 * @returns {Promise<Array<object & {
 *   layout: Array<{ position: number, name: string, type: string | null, icon: string | null }>,
 *   questionCount: number,
 *   emptyQuestionTileCount: number,
 * }>>}
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
    .select('board_id, position, tile:tiles!inner(id, name, type, icon)')
    .in('board_id', boardIds)
    .order('position', { ascending: true })

  throwIfSupabaseError(layoutError, 'board_layouts')

  // Example: { "board-1": [{ position: 1, name: 'Tile 1', type: 'question', icon: 'system/hourglass.png' }] }
  const layoutsByBoardId = new Map()
  const questionTileIdsByBoardId = new Map()
  const allQuestionTileIds = new Set()
  for (const row of layoutRows ?? []) {
    const tile = row.tile ?? null
    const layoutRow = {
      position: row.position,
      tile_id: tile?.id ?? null,
      name: tile?.name ?? null,
      type: tile?.type ?? null,
      icon: tile?.icon ?? null,
    }

    if (!layoutsByBoardId.has(row.board_id)) {
      layoutsByBoardId.set(row.board_id, [])
    }

    layoutsByBoardId.get(row.board_id).push(layoutRow)

    if (tile?.type === 'question' && tile?.id) {
      allQuestionTileIds.add(tile.id)

      if (!questionTileIdsByBoardId.has(row.board_id)) {
        questionTileIdsByBoardId.set(row.board_id, new Set())
      }
      questionTileIdsByBoardId.get(row.board_id).add(tile.id)
    }
  }

  const { data: questions, error: questionsError } = allQuestionTileIds.size
    ? await supabase
      .from('questions')
      .select('tile_id')
      .in('tile_id', [...allQuestionTileIds])
    : { data: [], error: null }

  throwIfSupabaseError(questionsError, 'questions')

  const questionCountByTileId = new Map()
  for (const question of questions ?? []) {
    const currentCount = questionCountByTileId.get(question.tile_id) ?? 0
    questionCountByTileId.set(question.tile_id, currentCount + 1)
  }

  const questionCountByBoardId = new Map()
  const emptyQuestionTileCountByBoardId = new Map()
  for (const [boardId, tileIds] of questionTileIdsByBoardId.entries()) {
    let count = 0
    let emptyQuestionTileCount = 0
    for (const tileId of tileIds) {
      const tileQuestionCount = questionCountByTileId.get(tileId) ?? 0
      count += tileQuestionCount
      if (tileQuestionCount === 0) {
        emptyQuestionTileCount += 1
      }
    }
    questionCountByBoardId.set(boardId, count)
    emptyQuestionTileCountByBoardId.set(boardId, emptyQuestionTileCount)
  }

  return boards.map((board) => ({
    ...board,
    layout: layoutsByBoardId.get(board.id) ?? [],
    questionCount: questionCountByBoardId.get(board.id) ?? 0,
    emptyQuestionTileCount: emptyQuestionTileCountByBoardId.get(board.id) ?? 0,
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

/** Delete one board by id for the authenticated user. */
export const deleteBoardById = async ({ boardId }) => {
  if (!boardId) {
    throw new Error('[supabase] Failed to delete board: missing board id')
  }

  const { error } = await supabase
    .from('boards')
    .delete()
    .eq('id', boardId)

  if (error) {
    throwIfSupabaseError(error, 'boards', 'delete')
  }
}
