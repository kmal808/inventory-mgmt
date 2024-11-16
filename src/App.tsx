import React, { useState } from 'react';
import { Download, FileText, Plus, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import Sidebar from './components/Sidebar';
import InventoryForm from './components/InventoryForm';
import InventoryTable from './components/InventoryTable';
import Auth from './components/Auth';
import { useSupabase } from './context';
import { useContainerLists } from './hooks/useContainerLists';
import { useContainerList } from './hooks/useContainerList';
import { useInventoryItems } from './hooks/useInventoryItems';
import { exportToPDF, exportToCSV } from './utils/export';

export default function App() {
  const { session, loading: authLoading } = useSupabase();
  const { lists, loading: listsLoading, error: listsError } = useContainerLists();
  const { createList } = useContainerList();
  const [selectedListId, setSelectedListId] = useState<string | null>(null);
  
  const selectedList = lists.find(list => list.id === selectedListId);
  const { addItem, deleteItem } = useInventoryItems(selectedListId || '');

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    );
  }

  if (!session) {
    return <Auth />;
  }

  if (listsError) {
    toast.error(listsError);
  }

  const handleCreateList = async () => {
    try {
      const newList = await createList();
      if (newList) {
        setSelectedListId(newList.id);
      }
    } catch (error) {
      // Error is handled by the hook
    }
  };

  const handleAddItem = async (item: any) => {
    if (!selectedListId) {
      toast.error('Please create or select a container list first');
      return;
    }
    await addItem(item);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar
        containerLists={lists}
        selectedListId={selectedListId}
        onSelectList={setSelectedListId}
        onCreateList={handleCreateList}
        loading={listsLoading}
      />
      
      <div className="flex-1 overflow-auto p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Warehouse Inventory Management
            </h1>
            <div className="flex gap-4">
              {selectedList && (
                <>
                  <button
                    onClick={() => exportToPDF(selectedList)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    <FileText className="w-4 h-4" />
                    Export PDF
                  </button>
                  <button
                    onClick={() => exportToCSV(selectedList)}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                  >
                    <Download className="w-4 h-4" />
                    Export CSV
                  </button>
                </>
              )}
              <button
                onClick={handleCreateList}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
              >
                <Plus className="w-4 h-4" />
                New List
              </button>
            </div>
          </div>

          {selectedListId ? (
            <div className="space-y-8">
              <InventoryForm onAddItem={handleAddItem} />
              {selectedList && selectedList.items.length > 0 && (
                <InventoryTable
                  items={selectedList.items}
                  onDeleteItem={deleteItem}
                  onEditItem={() => toast.error('Edit functionality coming soon')}
                />
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <h2 className="text-xl text-gray-600">
                Select a container list from the sidebar or create a new one to get started
              </h2>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}