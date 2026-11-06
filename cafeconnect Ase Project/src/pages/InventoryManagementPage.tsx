import React, { useState } from 'react';
import { 
  Package, 
  Search, 
  History, 
  HelpCircle
} from 'lucide-react';
import { useCafe } from '../context/CafeContext';
import { InventoryItem } from '../types';

export const InventoryManagementPage: React.FC = () => {
  const { inventory, stockMovements, restockItem, adjustStock } = useCafe();

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'raw_material' | 'packaged_product' | 'dairy'>('all');
  const [selectedItemForRestock, setSelectedItemForRestock] = useState<InventoryItem | null>(null);
  const [restockQty, setRestockQty] = useState<number>(20);
  const [restockReason, setRestockReason] = useState('Supplier Scheduled Delivery');

  const [selectedItemForAdjust, setSelectedItemForAdjust] = useState<InventoryItem | null>(null);
  const [adjustQtyDelta, setAdjustQtyDelta] = useState<number>(0);
  const [adjustReason, setAdjustReason] = useState('Physical Stock Audit Reconciliation');

  const [activeTab, setActiveTab] = useState<'inventory' | 'movements'>('inventory');

  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.sku && item.sku.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCat = categoryFilter === 'all' || item.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  const getStockStatus = (item: InventoryItem) => {
    if (item.currentStock <= 0) return { label: 'Out of Stock', color: 'bg-rose-50 text-rose-700 border-rose-200' };
    if (item.currentStock <= item.safetyStock) return { label: 'Critical Stock', color: 'bg-rose-50 text-rose-700 border-rose-200' };
    if (item.currentStock <= item.reorderPoint) return { label: 'Low Stock', color: 'bg-amber-50 text-amber-700 border-amber-200' };
    return { label: 'In Stock', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
  };

  const handleRestockSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItemForRestock || restockQty <= 0) return;
    restockItem(selectedItemForRestock.id, Number(restockQty), restockReason);
    setSelectedItemForRestock(null);
  };

  const handleAdjustSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItemForAdjust || adjustQtyDelta === 0) return;
    adjustStock(selectedItemForAdjust.id, Number(adjustQtyDelta), adjustReason);
    setSelectedItemForAdjust(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-slate-900">
              Inventory & Supply Chain
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-sky-50 text-sky-700 font-bold border border-sky-200">
              Auto-Reorder Engine
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time ingredient recipe consumption, packaged snacks SKU ledger, and stock movement logs
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl border border-slate-200 text-xs">
          <button
            onClick={() => setActiveTab('inventory')}
            className={`px-4 py-2 rounded-xl font-bold transition-all ${
              activeTab === 'inventory' ? 'bg-sky-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Inventory Catalog ({inventory.length})
          </button>
          <button
            onClick={() => setActiveTab('movements')}
            className={`px-4 py-2 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'movements' ? 'bg-sky-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Stock Movements ({stockMovements.length})</span>
          </button>
        </div>
      </div>

      {/* 2. Reorder Formula Banner matching Prompt Requirement 17 */}
      <div className="bg-sky-50/70 p-4 rounded-2xl border border-sky-200 text-xs flex flex-col md:flex-row items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-2.5 text-slate-800">
          <HelpCircle className="w-5 h-5 text-sky-600 shrink-0" />
          <span>
            <strong className="text-slate-900">Authoritative Baseline Formula: </strong>
            <code className="text-sky-700 bg-white border border-sky-200 px-2 py-0.5 rounded ml-1 font-mono">
              Reorder Point = (Average Daily Usage × Supplier Lead Time) + Safety Stock
            </code>
          </span>
        </div>
        <span className="text-[11px] text-slate-500">
          Evaluated dynamically on every customer checkout & stock update
        </span>
      </div>

      {activeTab === 'inventory' ? (
        <>
          {/* Filters & Search */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative w-full sm:max-w-md">
              <Search className="absolute left-4 top-3.5 w-4 h-4 text-sky-600" />
              <input
                type="text"
                placeholder="Search by ingredient or SKU (e.g. Milk, Batter, SKU-CDM)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 text-xs shadow-xs"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto scrollbar-none pb-1">
              {[
                { id: 'all', label: 'All Stock' },
                { id: 'raw_material', label: 'Raw Materials & Kitchen' },
                { id: 'packaged_product', label: 'Packaged SKUs' },
                { id: 'dairy', label: 'Dairy & Perishables' }
              ].map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setCategoryFilter(cat.id as any)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all whitespace-nowrap shadow-xs ${
                    categoryFilter === cat.id
                      ? 'bg-sky-600 text-white border-sky-600'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-sky-300'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-[11px] uppercase font-bold tracking-wider text-slate-700">
                    <th className="py-3.5 px-4">Item & SKU</th>
                    <th className="py-3.5 px-4">Category</th>
                    <th className="py-3.5 px-4">Current Stock</th>
                    <th className="py-3.5 px-4">Reorder Point</th>
                    <th className="py-3.5 px-4">Suggested Reorder</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs text-slate-800">
                  {filteredInventory.map(item => {
                    const status = getStockStatus(item);
                    return (
                      <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-4 px-4">
                          <div className="font-bold text-slate-900">{item.name}</div>
                          <div className="text-[11px] font-mono text-sky-700">
                            {item.sku || `ID: ${item.id}`}
                          </div>
                        </td>
                        <td className="py-4 px-4 capitalize text-slate-600">
                          {item.category.replace('_', ' ')}
                        </td>
                        <td className="py-4 px-4 font-mono font-bold text-base text-slate-900">
                          {item.currentStock} <span className="text-xs font-normal text-slate-500">{item.unit}</span>
                        </td>
                        <td className="py-4 px-4 font-mono text-slate-700">
                          {item.reorderPoint} {item.unit}
                          <span className="block text-[10px] text-slate-400">
                            Safety: {item.safetyStock} {item.unit}
                          </span>
                        </td>
                        <td className="py-4 px-4 font-mono text-emerald-700 font-bold">
                          +{item.suggestedReorderQuantity} {item.unit}
                          <span className="block text-[10px] text-slate-400">
                            Lead: {item.supplierLeadDays} days
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border inline-block ${status.color}`}>
                            {status.label}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => {
                                setSelectedItemForRestock(item);
                                setRestockQty(item.suggestedReorderQuantity);
                              }}
                              className="px-3 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-xs transition-transform active:scale-95"
                            >
                              Restock
                            </button>
                            <button
                              onClick={() => {
                                setSelectedItemForAdjust(item);
                                setAdjustQtyDelta(0);
                              }}
                              className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 text-xs font-medium"
                              title="Audit Adjust"
                            >
                              Adjust
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        /* Stock Movements Audit Log */
        <div className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm">
          <div className="p-4 bg-slate-50 border-b border-slate-200">
            <h3 className="font-bold text-slate-900 text-sm">Audited Inventory Movements Log</h3>
            <p className="text-xs text-slate-500">Every checkout deduction, restock PO, and physical count adjustment is preserved</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-[10px] uppercase font-bold tracking-wider text-slate-700">
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">Item Name</th>
                  <th className="py-3 px-4">Event Type</th>
                  <th className="py-3 px-4">Quantity Delta</th>
                  <th className="py-3 px-4">Balance After</th>
                  <th className="py-3 px-4">Reason / Source Reference</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-800">
                {stockMovements.map(m => (
                  <tr key={m.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-mono text-slate-500">{m.timestamp}</td>
                    <td className="py-3 px-4 font-semibold text-slate-900">{m.inventoryItemName}</td>
                    <td className="py-3 px-4 capitalize">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        m.type === 'restock' 
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                          : m.type === 'order_deduction' 
                          ? 'bg-sky-50 text-sky-700 border border-sky-200' 
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        {m.type.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono font-bold">
                      <span className={m.quantityDelta > 0 ? 'text-emerald-700' : 'text-rose-600'}>
                        {m.quantityDelta > 0 ? `+${m.quantityDelta}` : m.quantityDelta}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-900 font-semibold">{m.balanceAfter}</td>
                    <td className="py-3 px-4 text-slate-600">
                      <div>{m.reason}</div>
                      <span className="text-[10px] text-sky-700 font-mono">{m.userOrOrderId}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Restock Modal */}
      {selectedItemForRestock && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-slate-200 shadow-2xl space-y-5">
            <h3 className="font-serif-luxury text-xl font-bold text-slate-900">
              Restock {selectedItemForRestock.name}
            </h3>
            <p className="text-xs text-slate-600">
              Current stock: <strong className="text-slate-900">{selectedItemForRestock.currentStock} {selectedItemForRestock.unit}</strong>. 
              Suggested replenishment: <strong className="text-emerald-700">+{selectedItemForRestock.suggestedReorderQuantity} {selectedItemForRestock.unit}</strong>.
            </p>

            <form onSubmit={handleRestockSubmit} className="space-y-4">
              <div>
                <label className="block text-xs uppercase font-bold text-slate-700 mb-1">
                  Quantity to Add ({selectedItemForRestock.unit})
                </label>
                <input
                  type="number"
                  min="1"
                  step="any"
                  value={restockQty}
                  onChange={(e) => setRestockQty(Number(e.target.value))}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 font-mono font-bold text-base focus:bg-white focus:outline-none focus:border-sky-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs uppercase font-bold text-slate-700 mb-1">
                  Delivery Receipt / Reason
                </label>
                <input
                  type="text"
                  value={restockReason}
                  onChange={(e) => setRestockReason(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:bg-white focus:outline-none focus:border-sky-500"
                  required
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedItemForRestock(null)}
                  className="flex-1 py-3 rounded-xl bg-slate-100 text-xs font-semibold text-slate-700 hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold shadow-xs"
                >
                  Confirm Restock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Adjust Modal */}
      {selectedItemForAdjust && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-slate-200 shadow-2xl space-y-5">
            <h3 className="font-serif-luxury text-xl font-bold text-slate-900">
              Audit Stock Adjustment: {selectedItemForAdjust.name}
            </h3>
            <p className="text-xs text-slate-600">
              Current recorded balance: <strong className="text-slate-900">{selectedItemForAdjust.currentStock} {selectedItemForAdjust.unit}</strong>.
            </p>

            <form onSubmit={handleAdjustSubmit} className="space-y-4">
              <div>
                <label className="block text-xs uppercase font-bold text-slate-700 mb-1">
                  Stock Change Delta (+ or -)
                </label>
                <input
                  type="number"
                  step="any"
                  value={adjustQtyDelta}
                  onChange={(e) => setAdjustQtyDelta(Number(e.target.value))}
                  placeholder="e.g. -2 for breakage or +5 found in pantry"
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 font-mono font-bold text-base focus:bg-white focus:outline-none focus:border-sky-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs uppercase font-bold text-slate-700 mb-1">
                  Adjustment Reason
                </label>
                <input
                  type="text"
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:bg-white focus:outline-none focus:border-sky-500"
                  required
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedItemForAdjust(null)}
                  className="flex-1 py-3 rounded-xl bg-slate-100 text-xs font-semibold text-slate-700 hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-xs"
                >
                  Save Adjustment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
