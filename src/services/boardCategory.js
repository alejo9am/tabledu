import { supabase } from '@/lib/supabase'
import { throwIfSupabaseError } from '@/services/core/errors'

/** Fetch board tile layout for one board. */
export const fetchBoardLayout = async (boardId) => {
  if (!boardId) {
    throw new Error('[supabase] Failed to fetch board_category: missing board id')
  }

  const { data, error } = await supabase
    .from('board_category')
    .select('*')
    .eq('board_id', boardId)
    .order('position', { ascending: true })

  throwIfSupabaseError(error, 'board_category')
  return data ?? []
}
