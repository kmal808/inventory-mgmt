import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/database.types';

type ContainerList = Database['public']['Tables']['container_lists']['Row'];
type InventoryItem = Database['public']['Tables']['inventory_items']['Row'];

export interface ContainerListWithItems extends ContainerList {
  items: InventoryItem[];
}

export function useContainerLists() {
  const [lists, setLists] = useState<ContainerListWithItems[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchContainerLists();
    
    const channel = supabase
      .channel('container_lists_changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'container_lists' 
      }, () => {
        fetchContainerLists();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function fetchContainerLists() {
    try {
      const { data: containerLists, error: listsError } = await supabase
        .from('container_lists')
        .select('*')
        .order('created_at', { ascending: false });

      if (listsError) throw listsError;

      const listsWithItems: ContainerListWithItems[] = [];

      for (const list of containerLists) {
        const { data: items, error: itemsError } = await supabase
          .from('inventory_items')
          .select('*')
          .eq('container_list_id', list.id)
          .order('created_at', { ascending: true });

        if (itemsError) throw itemsError;

        listsWithItems.push({
          ...list,
          items: items || [],
        });
      }

      setLists(listsWithItems);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }

  return { lists, loading, error, refetch: fetchContainerLists };
}