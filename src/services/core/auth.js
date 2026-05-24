import { supabase } from '@/lib/supabase'
import { throwIfSupabaseError } from '@/services/core/errors'

/** Return the authenticated Supabase user id or throw if missing. */
export const getAuthenticatedUserId = async () => {
  const { data, error } = await supabase.auth.getUser()
  throwIfSupabaseError(error, 'auth')

  const userId = data?.user?.id
  if (!userId) {
    throw new Error('[supabase] Missing authenticated user id')
  }

  return userId
}
