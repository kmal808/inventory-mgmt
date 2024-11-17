import React from 'react'
import { FileText, Package, Trash2, Loader2 } from 'lucide-react'
import { ContainerListWithItems } from '../hooks/useContainerLists'

interface SidebarProps {
  containerLists: ContainerListWithItems[]
  selectedListId: string | null
  onSelectList: (id: string) => void
  onDeleteList: (id: string) => void
  loading: boolean
}

export default function Sidebar({
  containerLists,
  selectedListId,
  onSelectList,
  onDeleteList,
  loading,
}: SidebarProps) {
  return (
    <div className='w-80 bg-gray-800 text-white h-screen overflow-hidden flex flex-col'>
      <div className='p-4 flex items-center gap-2 border-b border-gray-700'>
        <Package className='w-6 h-6' />
        <h2 className='text-xl font-semibold'>Container Lists</h2>
      </div>

      <div className='flex-1 overflow-y-auto p-2'>
        {loading ? (
          <div className='flex justify-center py-4'>
            <Loader2 className='w-6 h-6 animate-spin text-gray-400' />
          </div>
        ) : containerLists.length === 0 ? (
          <p className='text-center py-4 text-gray-400'>No lists yet</p>
        ) : (
          containerLists.map((list) => (
            <div
              key={list.id}
              className={`group relative mb-1 rounded-lg transition-colors ${
                selectedListId === list.id ? 'bg-gray-700' : 'hover:bg-gray-700'
              }`}>
              <button
                onClick={() => onSelectList(list.id)}
                className='w-full text-left p-3 pr-12'>
                <div className='font-medium'>{list.name}</div>
                <div className='text-sm text-gray-400 mt-1'>
                  Created: {new Date(list.created_at).toLocaleDateString()}
                </div>
                <div className='text-sm text-gray-400'>
                  {list.items.length}{' '}
                  {list.items.length === 1 ? 'item' : 'items'}
                </div>
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onDeleteList(list.id)
                }}
                className='absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity'
                title='Delete list'>
                <Trash2 className='w-4 h-4' />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
