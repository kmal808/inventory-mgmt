import React from 'react';
import { FileText, Package, Plus, Loader2 } from 'lucide-react';
import { ContainerListWithItems } from '../hooks/useContainerLists';

interface SidebarProps {
  containerLists: ContainerListWithItems[];
  selectedListId: string | null;
  onSelectList: (id: string) => void;
  onCreateList: () => void;
  loading: boolean;
}

export default function Sidebar({
  containerLists,
  selectedListId,
  onSelectList,
  onCreateList,
  loading
}: SidebarProps) {
  return (
    <div className="w-64 bg-gray-800 text-white h-screen overflow-hidden flex flex-col">
      <div className="p-4 flex items-center gap-2 border-b border-gray-700">
        <Package className="w-6 h-6" />
        <h2 className="text-xl font-semibold">Container Lists</h2>
      </div>
      
      <button
        onClick={onCreateList}
        className="mx-2 mt-2 flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
      >
        <Plus className="w-4 h-4" />
        New List
      </button>

      <div className="flex-1 overflow-y-auto p-2">
        {loading ? (
          <div className="flex justify-center py-4">
            <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
          </div>
        ) : containerLists.length === 0 ? (
          <p className="text-center py-4 text-gray-400">No lists yet</p>
        ) : (
          containerLists.map((list) => (
            <button
              key={list.id}
              onClick={() => onSelectList(list.id)}
              className={`w-full text-left p-3 rounded-lg mb-1 flex items-center gap-2 hover:bg-gray-700 transition-colors ${
                selectedListId === list.id ? 'bg-gray-700' : ''
              }`}
            >
              <FileText className="w-4 h-4" />
              <div>
                <div className="font-medium">
                  {new Date(list.created_at).toLocaleDateString()}
                </div>
                <div className="text-sm text-gray-400">
                  {list.items.length} items
                </div>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}