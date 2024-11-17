import { useState, useEffect } from 'react'
import { Session } from '@supabase/supabase-js'
import { toast } from 'react-hot-toast'
import { supabase } from '../lib/supabase'
import { SupabaseContext } from './supabaseContext'

export function SupabaseProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()
        setSession(session)
        setLoading(false)

        const {
          data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
          setSession(session)
          setLoading(false)
        })

        return () => subscription.unsubscribe()
      } catch (error) {
        console.error('Supabase initialization error:', error)
        toast.error('Failed to initialize authentication')
        setLoading(false)
      }
    }

    initializeAuth()
  }, [])

  return (
    <SupabaseContext.Provider value={{ session, loading }}>
      {children}
    </SupabaseContext.Provider>
  )
}
