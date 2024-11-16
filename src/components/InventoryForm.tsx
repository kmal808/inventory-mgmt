import React, { useState } from 'react';
import { Plus, Loader2 } from 'lucide-react';
import { Database } from '../lib/database.types';

type InventoryItem = Database['public']['Tables']['inventory_items']['Insert'];
type ItemType = 'window' | 'door' | 'entry door' | 'security door';

interface InventoryFormProps {
  onAddItem: (item: Omit<InventoryItem, 'id' | 'created_at' | 'container_list_id'>) => Promise<void>;
}

export default function InventoryForm({ onAddItem }: InventoryFormProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    customer_name: '',
    job_number: '',
    manufacturer_order_number: '',
    quantity: 1,
    item_type: 'window' as ItemType,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await onAddItem(formData);
      setFormData({
        customer_name: '',
        job_number: '',
        manufacturer_order_number: '',
        quantity: 1,
        item_type: 'window',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Customer Name
          </label>
          <input
            type="text"
            required
            value={formData.customer_name}
            onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Job Number
          </label>
          <input
            type="text"
            required
            value={formData.job_number}
            onChange={(e) => setFormData({ ...formData, job_number: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Manufacturer Order #
          </label>
          <input
            type="text"
            required
            value={formData.manufacturer_order_number}
            onChange={(e) => setFormData({ ...formData, manufacturer_order_number: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Quantity
          </label>
          <input
            type="number"
            min="1"
            required
            value={formData.quantity}
            onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Item Type
          </label>
          <select
            value={formData.item_type}
            onChange={(e) => setFormData({ ...formData, item_type: e.target.value as ItemType })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
          >
            <option value="window">Window</option>
            <option value="door">Door</option>
            <option value="entry door">Entry Door</option>
            <option value="security door">Security Door</option>
          </select>
        </div>
        
        <div className="md:col-span-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Adding Item...
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                Add Item
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}