import jsPDF from 'jspdf';
import type { ContainerListWithItems } from '../hooks/useContainerLists';

export const exportToPDF = (containerList: ContainerListWithItems) => {
  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(16);
  doc.text(`Container Inventory - ${new Date(containerList.created_at).toLocaleDateString()}`, 20, 20);
  
  // Add table headers
  const headers = ['Customer', 'Job #', 'Order #', 'Qty', 'Type'];
  let y = 40;
  
  doc.setFontSize(12);
  doc.text(headers.join('   '), 20, y);
  
  // Add items
  containerList.items.forEach((item) => {
    y += 10;
    if (y > 280) {
      doc.addPage();
      y = 20;
    }
    
    const row = [
      item.customer_name,
      item.job_number,
      item.manufacturer_order_number,
      item.quantity.toString(),
      item.item_type,
    ];
    
    doc.text(row.join('   '), 20, y);
  });
  
  doc.save(`container-inventory-${containerList.created_at}.pdf`);
};

export const exportToCSV = (containerList: ContainerListWithItems) => {
  const headers = ['Customer Name', 'Job Number', 'Manufacturer Order #', 'Quantity', 'Item Type'];
  const rows = containerList.items.map((item) => [
    item.customer_name,
    item.job_number,
    item.manufacturer_order_number,
    item.quantity,
    item.item_type,
  ]);
  
  const csvContent = [
    headers.join(','),
    ...rows.map((row) => row.join(',')),
  ].join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `container-inventory-${containerList.created_at}.csv`;
  link.click();
};