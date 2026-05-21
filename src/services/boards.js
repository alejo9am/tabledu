import { supabase } from '@/lib/supabase'
import { getAuthenticatedUserId } from '@/services/core/auth'
import { throwIfSupabaseError } from '@/services/core/errors'

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

export const fetchBoards = async () => {
  const { data, error } = await supabase
    .from('boards')
    .select('*')
    .order('updated_at', { ascending: false })

  throwIfSupabaseError(error, 'boards')
  return data ?? []
}

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

  throwIfSupabaseError(error, 'boards')
  return data
}
