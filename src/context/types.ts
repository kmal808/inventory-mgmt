import type { Session } from '@supabase/supabase-js';

export interface SupabaseContextType {
  session: Session | null;
  loading: boolean;
}