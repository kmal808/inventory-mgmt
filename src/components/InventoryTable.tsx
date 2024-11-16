import React from 'react';
import { Trash2, Edit } from 'lucide-react';
import type { Database } from '../lib/database.types';

type InventoryItem = Database['public']['Tables']['inventory_items']['Row'];

interface InventoryTableProps {
  items: InventoryItem[];
  onDeleteItem: (id: string) => void;
  onEditItem: (id: string) => void;
}

export default function InventoryTable({ items, onDeleteItem, onEditItem }: InventoryTableProps) {
  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Customer Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Job Number
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Manufacturer Order #
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Quantity
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Item Type
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {items.map((item) => (
            <tr key={item.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">{item.customer_name}</td>
              <td className="px-6 py-4 whitespace-nowrap">{item.job_number}</td>
              <td className="px-6 py-4 whitespace-nowrap">{item.manufacturer_order_number}</td>
              <td className="px-6 py-4 whitespace-nowrap">{item.quantity}</td>
              <td className="px-6 py-4 whitespace-nowrap capitalize">{item.item_type}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex gap-2">
                  <button
                    onClick={() => onEditItem(item.id)}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDeleteItem(item.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}