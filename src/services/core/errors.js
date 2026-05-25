// Common PostgreSQL/Supabase error codes used in this mapper:
// - 23505: unique_violation
// - 23503: foreign_key_violation
// - 23514: check_violation
// - 23502: not_null_violation
// - 42501: insufficient_privilege (often RLS/policy denial)

/**
 * Translate a Supabase/Postgres error into a user-facing Error and throw it.
 * If `error` is falsy, this function is a no-op.
 */
export const throwIfSupabaseError = (error, entityName, operation = 'fetch') => {
  if (!error) return

  if (entityName === 'tiles') {
    if ((operation === 'create' || operation === 'update') && error.code === '23505') {
      throw new Error('You already have a question tile with this name. Choose a different name.')
    }

    if (operation === 'delete' && error.code === '23503') {
      throw new Error('Remove this tile from your boards before deleting it.')
    }
  }

  if (entityName === 'boards') {
    if (operation === 'create' && error.code === '23505') {
      throw new Error('You already have a board with this name. Choose a different name.')
    }
  }

  if (entityName === 'teams') {
    if ((operation === 'create' || operation === 'update') && error.code === '23505') {
      throw new Error('Team names must be unique in this game. Rename repeated teams and try again.')
    }

    if ((operation === 'create' || operation === 'update') && error.code === '23514') {
      throw new Error('Team color is invalid.')
    }
  }

  if (entityName === 'board_layouts') {
    if (operation === 'create' && error.code === '23514') {
      throw new Error('Board layout contains invalid tile positions.')
    }

    if (operation === 'create' && error.code === '23505') {
      throw new Error('Board layout has duplicated positions. Regenerate the layout and try again.')
    }
  }

  if (['create', 'update', 'delete'].includes(operation) && error.code === '42501') {
    throw new Error("You don't have permission for this action. Try refreshing your session.")
  }

  // 23502 = not_null_violation (a required DB column was null/missing)
  if (['create', 'update'].includes(operation) && error.code === '23502') {
    throw new Error('Some required data is missing. Review the form and try again.')
  }

  throw new Error(`[supabase] Failed to ${operation} ${entityName}: ${error.message}`)
}
