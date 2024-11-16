import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { Session } from '@supabase/supabase-js'
import { toast } from 'react-hot-toast'

interface SupabaseContextType {
	session: Session | null
	loading: boolean
}

const SupabaseContext = createContext<SupabaseContextType>({
	session: null,
	loading: true,
})

export function SupabaseProvider({ children }: { children: React.ReactNode }) {
	const [session, setSession] = useState<Session | null>(null)
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		try {
			supabase.auth.getSession().then(({ data: { session } }) => {
				setSession(session)
				setLoading(false)
			})

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
	}, [])

	return (
		<SupabaseContext.Provider value={{ session, loading }}>
			{children}
		</SupabaseContext.Provider>
	)
}

export const useSupabase = () => useContext(SupabaseContext)
