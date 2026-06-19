import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY

if (!supabaseUrl) {
  console.error('[supabase] Missing configuration variable: VITE_SUPABASE_URL (.env).')
}

if (!supabaseKey) {
  console.error('[supabase] Missing configuration variable: VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY (.env).')
}

export const supabase = createClient(supabaseUrl ?? '', supabaseKey ?? '')
