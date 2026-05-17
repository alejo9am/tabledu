export const throwIfSupabaseError = (error, entityName) => {
  if (error) {
    throw new Error(`[supabase] Failed to fetch ${entityName}: ${error.message}`)
  }
}
