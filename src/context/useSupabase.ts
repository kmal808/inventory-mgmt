import { useContext } from 'react'
import { SupabaseContext } from './supabaseContext'
import type { SupabaseContextType } from './types'

export function useSupabase(): SupabaseContextType {
  const context = useContext(SupabaseContext)
  if (!context) {
    throw new Error('useSupabase must be used within a SupabaseProvider')
  }
  return context
}
