export type ItemType = 'window' | 'door' | 'entry door' | 'security door';

export interface InventoryItem {
  id: string;
  customerName: string;
  jobNumber: string;
  manufacturerOrderNumber: string;
  quantity: number;
  itemType: ItemType;
}

export interface ContainerList {
  id: string;
  date: string;
  items: InventoryItem[];
}