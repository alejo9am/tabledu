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

/** Create the 29 persisted layout rows for one board. */
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

/** Update the 29 persisted layout rows for one board. */
export const updateBoardLayout = async ({ boardId, layout }) => {
  if (!boardId) {
    throw new Error('[supabase] Failed to update board_layouts: missing board id')
  }

  if (!Array.isArray(layout) || layout.length !== 29) {
    throw new Error('[supabase] Failed to update board_layouts: layout must contain exactly 29 tiles')
  }

  const rows = layout.map((tile) => ({
    board_id: boardId,
    tile_id: tile.tileId,
    position: tile.position,
  }))

  const { data, error } = await supabase
    .from('board_layouts')
    // board_layouts rows are keyed by (board_id, position), 
    // so saving a layout means updating each position's tile_id in place.
    .upsert(rows, { onConflict: 'board_id,position' })
    .select('*')

  throwIfSupabaseError(error, 'board_layouts', 'update')
  return data ?? []
}
