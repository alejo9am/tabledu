import { supabase } from '@/lib/supabase'
import { throwIfSupabaseError } from '@/services/core/errors'

/** Fetch answer logs for one game. */
export const fetchAnswersByGameId = async (gameId) => {
  if (!gameId) {
    throw new Error('[supabase] Failed to fetch answers: missing game id')
  }

  const { data, error } = await supabase
    .from('answers')
    .select('*')
    .eq('game_id', gameId)
    .order('question_id', { ascending: true })

  throwIfSupabaseError(error, 'answers')
  return data ?? []
}

/** Create one answer. Requires answer.game_id. */
export const createAnswer = async ({ answer }) => {
  if (!answer?.game_id) {
    throw new Error('[supabase] Failed to insert answer: missing game id')
  }
  const { data, error } = await supabase
    .from('answers')
    .insert(answer)
    .select('*')
    .maybeSingle()

  throwIfSupabaseError(error, 'answers')
  return data
}
