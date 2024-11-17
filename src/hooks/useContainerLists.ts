import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { toast } from 'react-hot-toast'
import type { Database } from '../lib/database.types'

type ContainerList = Database['public']['Tables']['container_lists']['Row']
type InventoryItem = Database['public']['Tables']['inventory_items']['Row']

export interface ContainerListWithItems extends ContainerList {
  items: InventoryItem[]
}

export function useContainerLists() {
  const [lists, setLists] = useState<ContainerListWithItems[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchContainerLists = async () => {
    try {
      const { data: userData, error: userError } = await supabase.auth.getUser()
      if (userError) throw userError

      const { data: containerLists, error: listsError } = await supabase
        .from('container_lists')
        .select('*')
        .eq('user_id', userData.user.id)
        .order('created_at', { ascending: false })

      if (listsError) throw listsError

      const listsWithItems: ContainerListWithItems[] = []

      for (const list of containerLists) {
        const { data: items, error: itemsError } = await supabase
          .from('inventory_items')
          .select('*')
          .eq('container_list_id', list.id)
          .order('created_at', { ascending: true })

        if (itemsError) throw itemsError

        listsWithItems.push({
          ...list,
          items: items || [],
        })
      }

      setLists(listsWithItems)
      setError(null)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An error occurred'
      console.error('Fetch lists error:', err)
      setError(message)
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  const createList = async (containerNumber: string) => {
    try {
      const { data: userData, error: userError } = await supabase.auth.getUser()
      if (userError) throw userError

      const { data, error } = await supabase
        .from('container_lists')
        .insert([
          {
            user_id: userData.user.id,
            container_number: containerNumber,
          },
        ])
        .select()
        .single()

      if (error) throw error
      toast.success('New container list created')
      await fetchContainerLists()
      return data
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to create list'
      console.error('Create list error:', err)
      toast.error(message)
      throw err
    }
  }

  const deleteList = async (id: string) => {
    try {
      const { error } = await supabase
        .from('container_lists')
        .delete()
        .eq('id', id)

      if (error) throw error
      toast.success('Container list deleted')
      await fetchContainerLists()
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to delete list'
      console.error('Delete list error:', err)
      toast.error(message)
      throw err
    }
  }

  useEffect(() => {
    fetchContainerLists()

    const channel = supabase
      .channel('container_lists_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'container_lists',
          filter: `user_id=eq.${supabase.auth
            .getUser()
            .then(({ data }) => data.user?.id)}`,
        },
        () => {
          fetchContainerLists()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  return {
    lists,
    loading,
    error,
    createList,
    deleteList,
    refetch: fetchContainerLists,
  }
}
