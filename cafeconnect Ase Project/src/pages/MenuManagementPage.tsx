import React, { useState } from 'react';
import { 
  Plus, 
  Search 
} from 'lucide-react';
import { useCafe } from '../context/CafeContext';
import { CATEGORIES } from '../services/mockData';
import { CategoryId, KitchenStationId, MenuItem } from '../types';

export const MenuManagementPage: React.FC = () => {
  const { menuItems, updateMenuItem, addMenuItem, toggleItemAvailability } = useCafe();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  // Form fields
  const [formName, setFormName] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formCategory, setFormCategory] = useState<CategoryId>('south_indian');
  const [formPrice, setFormPrice] = useState(50);
  const [formPrepMinutes, setFormPrepMinutes] = useState(6);
  const [formStationId, setFormStationId] = useState<KitchenStationId>('dosa_breakfast');
  const [formImageUrl, setFormImageUrl] = useState('');
  const [formIsAvailable, setFormIsAvailable] = useState(true);

  const filteredItems = menuItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const handleEditClick = (item: MenuItem) => {
    setEditingItem(item);
    setFormName(item.name);
    setFormDesc(item.description);
    setFormCategory(item.category);
    setFormPrice(item.price);
    setFormPrepMinutes(item.basePrepMinutes);
    setFormStationId(item.stationId);
    setFormImageUrl(item.imageUrl);
    setFormIsAvailable(item.isAvailable);
    setIsAddingNew(false);
  };

  const handleAddNewClick = () => {
    setEditingItem(null);
    setFormName('');
    setFormDesc('');
    setFormCategory('south_indian');
    setFormPrice(60);
    setFormPrepMinutes(6);
    setFormStationId('dosa_breakfast');
    setFormImageUrl('https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80');
    setFormIsAvailable(true);
    setIsAddingNew(true);
  };

  const handleSaveSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isAddingNew) {
      const newItem: MenuItem = {
        id: `item_custom_${Date.now()}`,
        name: formName,
        description: formDesc,
        category: formCategory,
        price: Number(formPrice),
        imageUrl: formImageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80',
        isAvailable: formIsAvailable,
        basePrepMinutes: Number(formPrepMinutes),
        stationId: formStationId,
        dietaryTags: ['veg'],
        rating: 5.0,
        reviewCount: 1,
        isActive: true
      };
      addMenuItem(newItem);
    } else if (editingItem) {
      const updated: MenuItem = {
        ...editingItem,
        name: formName,
        description: formDesc,
        category: formCategory,
        price: Number(formPrice),
        imageUrl: formImageUrl,
        isAvailable: formIsAvailable,
        basePrepMinutes: Number(formPrepMinutes),
        stationId: formStationId
      };
      updateMenuItem(updated);
    }

    setEditingItem(null);
    setIsAddingNew(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-slate-900">
              Menu Administration
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-sky-50 text-sky-700 font-bold border border-sky-200">
              {menuItems.length} Products
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure cafeteria menu prices, prep durations, station routing, and availability
          </p>
        </div>

        <button
          onClick={handleAddNewClick}
          className="px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs flex items-center gap-2 shadow-sm active:scale-95 transition-transform"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Food Item</span>
        </button>
      </div>

      {/* 2. Search & Categories */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-4 top-3.5 w-4 h-4 text-sky-600" />
          <input
            type="text"
            placeholder="Search products by title or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 text-xs shadow-xs"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto scrollbar-none pb-1">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all whitespace-nowrap shadow-xs ${
              selectedCategory === 'all'
                ? 'bg-sky-600 text-white border-sky-600'
                : 'bg-white text-slate-700 border-slate-200 hover:border-sky-300'
            }`}
          >
            All Categories
          </button>

          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all whitespace-nowrap shadow-xs ${
                selectedCategory === cat.id
                  ? 'bg-sky-600 text-white border-sky-600'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-sky-300'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Items Table */}
      <div className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-[11px] uppercase font-bold tracking-wider text-slate-700">
                <th className="py-3.5 px-4">Item</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Price</th>
                <th className="py-3.5 px-4">Base Prep Time</th>
                <th className="py-3.5 px-4">Station Routing</th>
                <th className="py-3.5 px-4">Availability</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-800">
              {filteredItems.map(item => (
                <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-10 h-10 rounded-lg object-cover shrink-0 border border-slate-200"
                      />
                      <div>
                        <div className="font-bold text-slate-900">{item.name}</div>
                        <div className="text-[10px] text-slate-500 line-clamp-1">{item.description}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 capitalize text-slate-700">
                  {(item.category || 'Unknown').replaceAll('_', ' ')}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-900 text-sm">
                    ₹{item.price}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-sky-700">
                    {item.basePrepMinutes} mins
                  </td>
                  <td className="py-3.5 px-4 capitalize text-slate-600">
                   {(item.stationId || 'Unknown').replaceAll('_', ' ')}
                  </td>
                  <td className="py-3.5 px-4">
                    <button
                      onClick={() => toggleItemAvailability(item.id)}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold border transition-colors ${
                        item.isAvailable
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-rose-50 text-rose-700 border-rose-200'
                      }`}
                    >
                      {item.isAvailable ? 'In Stock / Live' : 'Sold Out / Paused'}
                    </button>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => handleEditClick(item)}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-sky-50 hover:text-sky-700 text-slate-700 border border-slate-200 font-semibold text-xs transition-colors"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit / Add Modal */}
      {(editingItem || isAddingNew) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-slate-200 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="font-serif-luxury text-xl font-bold text-slate-900">
              {isAddingNew ? 'Add New Product to Menu' : `Edit Product: ${editingItem?.name}`}
            </h3>

            <form onSubmit={handleSaveSubmit} className="space-y-4">
              <div>
                <label className="block text-xs uppercase font-bold text-slate-700 mb-1">
                  Product Name
                </label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs font-semibold focus:bg-white focus:outline-none focus:border-sky-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs uppercase font-bold text-slate-700 mb-1">
                  Description
                </label>
                <textarea
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  rows={2}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:bg-white focus:outline-none focus:border-sky-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase font-bold text-slate-700 mb-1">
                    Price (INR ₹)
                  </label>
                  <input
                    type="number"
                    min="5"
                    step="5"
                    value={formPrice}
                    onChange={(e) => setFormPrice(Number(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 font-mono font-bold text-sm focus:bg-white focus:outline-none focus:border-sky-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase font-bold text-slate-700 mb-1">
                    Base Prep (Minutes)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="60"
                    value={formPrepMinutes}
                    onChange={(e) => setFormPrepMinutes(Number(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 font-mono font-bold text-sm focus:bg-white focus:outline-none focus:border-sky-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase font-bold text-slate-700 mb-1">
                    Category
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:bg-white focus:outline-none focus:border-sky-500"
                  >
                    {CATEGORIES.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs uppercase font-bold text-slate-700 mb-1">
                    Kitchen Station
                  </label>
                  <select
                    value={formStationId}
                    onChange={(e) => setFormStationId(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:bg-white focus:outline-none focus:border-sky-500"
                  >
                    <option value="dosa_breakfast">Dosa & Breakfast</option>
                    <option value="hot_meals">Hot Meals & Rolls</option>
                    <option value="snacks_frying">Snacks & Frying</option>
                    <option value="beverages">Beverages & Coffee</option>
                    <option value="packaged_pickup">Packaged Quick Pick</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase font-bold text-slate-700 mb-1">
                  Image URL
                </label>
                <input
                  type="text"
                  value={formImageUrl}
                  onChange={(e) => setFormImageUrl(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:bg-white focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  id="avail"
                  checked={formIsAvailable}
                  onChange={(e) => setFormIsAvailable(e.target.checked)}
                  className="w-4 h-4 accent-sky-600"
                />
                <label htmlFor="avail" className="text-xs text-slate-800 font-semibold cursor-pointer">
                  Product Available for Ordering
                </label>
              </div>

              <div className="flex gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => { setEditingItem(null); setIsAddingNew(false); }}
                  className="flex-1 py-3 rounded-xl bg-slate-100 text-xs font-semibold text-slate-700 hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold shadow-xs"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
