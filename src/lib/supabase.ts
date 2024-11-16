import { createClient } from '@supabase/supabase-js'
import type { Database } from './database.types'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
	console.error('Missing Supabase environment variables')
	throw new Error(
		'Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file'
	)
}

// Validate URL before creating client
try {
	new URL(supabaseUrl)
} catch (error) {
	console.error('Invalid Supabase URL:', error)
	throw new Error('VITE_SUPABASE_URL must be a valid URL')
}

export const supabase = createClient<Database>(supabaseUrl, supabaseKey)
