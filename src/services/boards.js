import { supabase } from '@/lib/supabase'
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
