import { supabase } from '@/lib/supabase'
import { throwIfSupabaseError } from '@/services/core/errors'

/** Fetch board tile layout for one board. */
export const fetchBoardLayout = async (boardId) => {
  if (!boardId) {
    throw new Error('[supabase] Failed to fetch board_layouts: missing board id')
  }

  const { data, error } = await supabase
    .from('board_layouts')
    .select('position, tileId:tile_id')
    .eq('board_id', boardId)
    .order('position', { ascending: true })

  throwIfSupabaseError(error, 'board_layouts')
  return data ?? []
}

export const createBoardLayout = async ({ boardId, layout }) => {
  if (!boardId) {
    throw new Error('[supabase] Failed to create board_layouts: missing board id')
  }

  if (!Array.isArray(layout) || layout.length !== 29) {
    throw new Error('[supabase] Failed to create board_layouts: layout must contain exactly 29 tiles')
  }

  const rows = (layout ?? []).map((tile) => ({
    board_id: boardId,
    tile_id: tile.tileId,
    position: tile.position,
  }))

  const { data, error } = await supabase
    .from('board_layouts')
    .insert(rows)
    .select('*')

  throwIfSupabaseError(error, 'board_layouts', 'create')
  return data ?? []
}
