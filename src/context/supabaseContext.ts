import { createContext } from 'react';
import type { Session } from '@supabase/supabase-js';

interface SupabaseContextType {
  session: Session | null;
  loading: boolean;
}

export const SupabaseContext = createContext<SupabaseContextType>({
  session: null,
  loading: true,
});