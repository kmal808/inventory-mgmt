import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { toast } from 'react-hot-toast'
import type { Database } from '../lib/database.types'

type InventoryItem = Database['public']['Tables']['inventory_items']['Row']
type NewInventoryItem = Omit<InventoryItem, 'id' | 'created_at'>

export function useInventoryItems(containerListId: string) {
  const [loading, setLoading] = useState(false)

  async function addItem(item: Omit<NewInventoryItem, 'container_list_id'>) {
    setLoading(true)
    try {
      const { data: userData, error: userError } = await supabase.auth.getUser()
      if (userError) throw userError

      // Verify list ownership before adding item
      const { data: listData, error: listError } = await supabase
        .from('container_lists')
        .select('id')
        .eq('id', containerListId)
        .eq('user_id', userData.user.id)
        .single()

      if (listError || !listData) {
        throw new Error('You do not have permission to modify this list')
      }

      const { error } = await supabase
        .from('inventory_items')
        .insert([{ ...item, container_list_id: containerListId }])

      if (error) throw error
      toast.success('Item added successfully')

      // Return the updated items for the container
      const { data: updatedItems, error: fetchError } = await supabase
        .from('inventory_items')
        .select('*')
        .eq('container_list_id', containerListId)
        .order('created_at', { ascending: true })

      if (fetchError) throw fetchError
      return updatedItems
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to add item'
      console.error('Add item error:', err)
      toast.error(message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  async function updateItem(id: string, updates: Partial<NewInventoryItem>) {
    setLoading(true)
    try {
      const { data: userData, error: userError } = await supabase.auth.getUser()
      if (userError) throw userError

      const { error } = await supabase
        .from('inventory_items')
        .update(updates)
        .eq('id', id)
        .eq('container_list_id', containerListId)

      if (error) throw error
      toast.success('Item updated successfully')
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to update item'
      console.error('Update item error:', err)
      toast.error(message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  async function deleteItem(id: string) {
    setLoading(true)
    try {
      const { data: userData, error: userError } = await supabase.auth.getUser()
      if (userError) throw userError

      const { error } = await supabase
        .from('inventory_items')
        .delete()
        .eq('id', id)
        .eq('container_list_id', containerListId)

      if (error) throw error
      toast.success('Item deleted successfully')
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to delete item'
      console.error('Delete item error:', err)
      toast.error(message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return {
    loading,
    addItem,
    updateItem,
    deleteItem,
  }
}
