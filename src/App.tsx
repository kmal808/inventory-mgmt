import React, { useState } from 'react'
import { Download, FileText, Plus, Loader2 } from 'lucide-react'
import { toast } from 'react-hot-toast'
import Sidebar from './components/Sidebar'
import InventoryForm from './components/InventoryForm'
import InventoryTable from './components/InventoryTable'
import CreateContainerForm from './components/CreateContainerForm'
import Auth from './components/Auth'
import { useSupabase } from './context'
import { useContainerLists } from './hooks/useContainerLists'
import { useInventoryItems } from './hooks/useInventoryItems'
import { exportToPDF, exportToCSV } from './utils/export'

export default function App() {
  const { session, loading: authLoading } = useSupabase()
  const {
    lists,
    loading: listsLoading,
    error: listsError,
    createList,
    deleteList,
  } = useContainerLists()
  const [selectedListId, setSelectedListId] = useState<string | null>(null)

  const selectedList = lists.find((list) => list.id === selectedListId)
  const { addItem, deleteItem } = useInventoryItems(selectedListId || '')

  if (authLoading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <Loader2 className='w-8 h-8 animate-spin text-purple-600' />
      </div>
    )
  }

  if (!session) {
    return <Auth />
  }

  if (listsError) {
    toast.error(listsError)
  }

  const handleCreateList = async (containerNumber: string) => {
    try {
      const newList = await createList(containerNumber)
      if (newList) {
        setSelectedListId(newList.id)
      }
    } catch (error) {
      // Error is handled by the hook
    }
  }

  const handleDeleteList = async (id: string) => {
    if (
      window.confirm('Are you sure you want to delete this container list?')
    ) {
      try {
        await deleteList(id)
        if (selectedListId === id) {
          setSelectedListId(null)
        }
      } catch (error) {
        // Error is handled by the hook
      }
    }
  }

  const handleAddItem = async (item: any) => {
    if (!selectedListId) {
      toast.error('Please create or select a container list first')
      return
    }
    await addItem(item)
  }

  return (
    <div className='flex h-screen bg-gray-100'>
      <Sidebar
        containerLists={lists}
        selectedListId={selectedListId}
        onSelectList={setSelectedListId}
        onDeleteList={handleDeleteList}
        loading={listsLoading}
      />

      <div className='flex-1 overflow-auto p-8'>
        <div className='max-w-7xl mx-auto'>
          <div className='flex justify-between items-center mb-8'>
            <h1 className='text-3xl font-bold text-gray-900'>
              Warehouse Inventory Management
            </h1>
            {selectedList && (
              <div className='flex gap-4'>
                <button
                  onClick={() => exportToPDF(selectedList)}
                  className='flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700'>
                  <FileText className='w-4 h-4' />
                  Export PDF
                </button>
                <button
                  onClick={() => exportToCSV(selectedList)}
                  className='flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700'>
                  <Download className='w-4 h-4' />
                  Export CSV
                </button>
              </div>
            )}
          </div>

          {selectedListId ? (
            <div className='space-y-8'>
              <div className='bg-white p-6 rounded-lg shadow-md mb-8'>
                <h2 className='text-2xl font-bold text-gray-900 mb-2'>
                  {selectedList?.name}
                </h2>
                <p className='text-sm text-gray-500'>
                  Created on{' '}
                  {new Date(
                    selectedList?.created_at || ''
                  ).toLocaleDateString()}
                </p>
              </div>

              <InventoryForm onAddItem={handleAddItem} />

              {selectedList && (
                <InventoryTable
                  items={selectedList.items}
                  onDeleteItem={deleteItem}
                  onEditItem={() =>
                    toast.error('Edit functionality coming soon')
                  }
                />
              )}
            </div>
          ) : (
            <CreateContainerForm onCreateList={handleCreateList} />
          )}
        </div>
      </div>
    </div>
  )
}
