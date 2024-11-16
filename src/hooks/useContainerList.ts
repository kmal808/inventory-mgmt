import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { toast } from 'react-hot-toast';

export function useContainerList() {
  const [loading, setLoading] = useState(false);

  async function createList() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('container_lists')
        .insert([{}])
        .select()
        .single();

      if (error) throw error;
      toast.success('New container list created');
      return data;
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to create list');
      throw err;
    } finally {
      setLoading(false);
    }
  }

  async function deleteList(id: string) {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('container_lists')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Container list deleted');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to delete list');
      throw err;
    } finally {
      setLoading(false);
    }
  }

  return {
    loading,
    createList,
    deleteList,
  };
}