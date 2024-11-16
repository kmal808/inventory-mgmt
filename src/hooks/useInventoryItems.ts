import { useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/database.types';
import { toast } from 'react-hot-toast';

type InventoryItem = Database['public']['Tables']['inventory_items']['Row'];
type NewInventoryItem = Omit<InventoryItem, 'id' | 'created_at'>;

export function useInventoryItems(containerListId: string) {
  const [loading, setLoading] = useState(false);

  async function addItem(item: Omit<NewInventoryItem, 'container_list_id'>) {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('inventory_items')
        .insert([{ ...item, container_list_id: containerListId }]);

      if (error) throw error;
      toast.success('Item added successfully');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to add item');
      throw err;
    } finally {
      setLoading(false);
    }
  }

  async function updateItem(id: string, updates: Partial<NewInventoryItem>) {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('inventory_items')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
      toast.success('Item updated successfully');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to update item');
      throw err;
    } finally {
      setLoading(false);
    }
  }

  async function deleteItem(id: string) {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('inventory_items')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Item deleted successfully');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to delete item');
      throw err;
    } finally {
      setLoading(false);
    }
  }

  return {
    loading,
    addItem,
    updateItem,
    deleteItem,
  };
}