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

  throw new Error(`[supabase] Failed to ${operation} ${entityName}: ${error.message}`)
}
