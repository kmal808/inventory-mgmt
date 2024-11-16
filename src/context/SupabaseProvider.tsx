import { useState, useEffect, createContext } from 'react';
import { toast } from 'react-hot-toast';
import { supabase } from '../lib/supabase';
import type { SupabaseContextType } from './types';

export const SupabaseContext = createContext<SupabaseContextType>({
  session: null,
  loading: true,
});

export function SupabaseProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
        setLoading(false);

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
          setSession(session);
          setLoading(false);
        });

        return () => subscription.unsubscribe();
      } catch (error) {
        console.error('Supabase initialization error:', error);
        toast.error('Failed to initialize authentication');
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  return (
    <SupabaseContext.Provider value={{ session, loading }}>
      {children}
    </SupabaseContext.Provider>
  );
}