import { createClient } from '@supabase/supabase-js'
import type { Database } from './database.types'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Validate environment variables
if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    'Missing Supabase environment variables. Please check that VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set in your .env file.'
  )
}

// Validate URL format
try {
  new URL(supabaseUrl)
} catch (error) {
  throw new Error(
    `Invalid Supabase URL: ${supabaseUrl}. Please ensure VITE_SUPABASE_URL is a valid URL in your .env file.`
  )
}

// Get the current URL for redirect
const getRedirectTo = () => {
  // Check if we're in a browser environment
  if (typeof window === 'undefined') {
    return import.meta.env.VITE_SITE_URL || ''
  }

  const isLocalhost =
    window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1'

  if (isLocalhost) {
    return `${window.location.protocol}//${window.location.host}`
  }

  return import.meta.env.VITE_SITE_URL || window.location.origin
}

// Create Supabase client
export const supabase = createClient<Database>(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
    storage: window?.localStorage,
    // The redirect URL is now passed in the signIn options instead of the client config
  },
})
