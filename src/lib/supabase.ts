import { createClient } from '@supabase/supabase-js'
import type { Database } from './database.types'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    'Missing Supabase environment variables. Please check that VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set in your .env file.'
  )
}

try {
  new URL(supabaseUrl)
} catch (error) {
  throw new Error(
    `Invalid Supabase URL: ${supabaseUrl}. Please ensure VITE_SUPABASE_URL is a valid URL in your .env file.`
  )
}

export const supabase = createClient<Database>(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storage: localStorage,
    storageKey: 'warehouse-auth-token',
    flowType: 'pkce',
  },
  global: {
    headers: {
      apikey: supabaseKey,
    },
  },
})
