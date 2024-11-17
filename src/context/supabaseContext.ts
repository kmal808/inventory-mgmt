import { createContext } from 'react'
import type { SupabaseContextType } from './types'

export const SupabaseContext = createContext<SupabaseContextType>({
  session: null,
  loading: true,
})
