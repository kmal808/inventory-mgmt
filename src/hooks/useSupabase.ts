import { useContext } from 'react';
import { SupabaseContext } from '../context/supabaseContext';

export const useSupabase = () => {
  const context = useContext(SupabaseContext);
  if (context === undefined) {
    throw new Error('useSupabase must be used within a SupabaseProvider');
  }
  return context;
};