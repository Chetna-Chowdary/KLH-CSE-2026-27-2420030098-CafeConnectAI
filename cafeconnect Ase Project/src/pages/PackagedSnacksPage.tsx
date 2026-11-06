import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Clock, 
  Plus, 
  Minus, 
  AlertCircle, 
  Zap
} from 'lucide-react';
import { useCafe } from '../context/CafeContext';
import { MenuItem } from '../types';

interface PackagedSnacksPageProps {
  onSelectProduct: (item: MenuItem) => void;
  onNavigate: (tab: string, param?: string) => void;
}

export const PackagedSnacksPage: React.FC<PackagedSnacksPageProps> = ({ 
  onSelectProduct
}) => {
  const { menuItems, inventory, cart, addToCart, updateCartQuantity } = useCafe();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeSubTab, setActiveSubTab] = useState<'all' | 'chips' | 'chocolates' | 'bakery' | 'beverages'>('all');

  // Packaged items (from packaged_snacks and cold drinks that are packaged)
  const packagedItems = useMemo(() => {
    return menuItems.filter(item => 
      item.stationId === 'packaged_pickup' || 
      item.category === 'packaged_snacks' ||
      item.id === 'item_bottled_water' ||
      item.id === 'item_soft_drink'
    );
  }, [menuItems]);

  const filteredItems = useMemo(() => {
    let items = [...packagedItems];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      items = items.filter(i => 
        i.name.toLowerCase().includes(q) || 
        i.description.toLowerCase().includes(q)
      );
    }

    if (activeSubTab === 'chips') {
      items = items.filter(i => i.name.toLowerCase().includes('lays') || i.name.toLowerCase().includes('bingo') || i.name.toLowerCase().includes('kurkure'));
    } else if (activeSubTab === 'chocolates') {
      items = items.filter(i => i.name.toLowerCase().includes('dairy milk') || i.name.toLowerCase().includes('kitkat') || i.name.toLowerCase().includes('5 star'));
    } else if (activeSubTab === 'bakery') {
      items = items.filter(i => i.name.toLowerCase().includes('cake') || i.name.toLowerCase().includes('cookies') || i.name.toLowerCase().includes('muffin') || i.name.toLowerCase().includes('donut'));
    } else if (activeSubTab === 'beverages') {
      items = items.filter(i => i.name.toLowerCase().includes('water') || i.name.toLowerCase().includes('drink') || i.name.toLowerCase().includes('can'));
    }

    return items;
  }, [packagedItems, searchQuery, activeSubTab]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* 1. Header Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-sky-50 via-white to-teal-50 border border-sky-200 p-8 sm:p-10 shadow-sm">
        <div className="max-w-2xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white text-sky-700 text-xs font-semibold border border-sky-200 shadow-xs">
            <Zap className="w-3.5 h-3.5 text-sky-600" />
            <span>Instant Handoff • 1–2 Min Pick Time</span>
          </div>
          <h1 className="font-serif-luxury text-3xl sm:text-5xl font-bold text-slate-900 tracking-tight">
            Packaged Snacks & Confectionery
          </h1>
          <p className="text-sm text-slate-600 leading-relaxed">
            Grab-and-go treats, crispy chips, chocolates, and cold beverages. All packaged goods are retrieved directly from our fast-fulfillment counter in under 2 minutes.
          </p>
        </div>

        {/* Highlight badge */}
        <div className="absolute right-6 top-8 hidden lg:flex items-center gap-3 bg-white/95 p-4 rounded-2xl border border-slate-200 text-xs shadow-xs">
          <Clock className="w-8 h-8 text-sky-600" />
          <div>
            <p className="font-bold text-slate-900">Zero Cooking Wait</p>
            <p className="text-sky-700 font-semibold">Pre-packaged & ready to pick</p>
          </div>
        </div>
      </div>

      {/* 2. Search & Sub Tabs */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-4 top-3.5 w-4 h-4 text-sky-600" />
          <input
            type="text"
            placeholder="Search packaged items (e.g. KitKat, Lays, Water)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 text-sm shadow-xs"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto scrollbar-none pb-1">
          {[
            { id: 'all', label: 'All Packaged' },
            { id: 'chips', label: 'Chips & Crisps' },
            { id: 'chocolates', label: 'Chocolates' },
            { id: 'bakery', label: 'Cookies & Cakes' },
            { id: 'beverages', label: 'Bottled Drinks' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all border whitespace-nowrap shadow-xs ${
                activeSubTab === tab.id
                  ? 'bg-sky-600 text-white border-sky-600'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-sky-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Items Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredItems.map(item => {
          // Find SKU inventory status if mapped
          const invItem = inventory.find(inv => inv.id === item.inventoryItemId);
          const currentStock = invItem ? invItem.currentStock : 25;
          const isLowStock = currentStock > 0 && currentStock <= 5;
          const isOutOfStock = currentStock <= 0 || !item.isAvailable;

          // Cart status
          const inCart = cart.find(ci => ci.menuItem.id === item.id);

          return (
            <div
              key={item.id}
              onClick={() => onSelectProduct(item)}
              className="bg-white rounded-2xl overflow-hidden border border-slate-200 hover:border-sky-300 transition-all p-4 flex flex-col justify-between group cursor-pointer shadow-xs hover:shadow-md"
            >
              <div>
                <div className="relative h-40 w-full rounded-xl overflow-hidden bg-slate-100 mb-3">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  
                  {/* Quick Pick Badge */}
                  <div className="absolute top-2 left-2 bg-white/95 backdrop-blur-md px-2 py-0.5 rounded-md border border-slate-200 text-[10px] font-bold text-sky-700 flex items-center gap-1 shadow-xs">
                    <Clock className="w-3 h-3 text-sky-600" />
                    <span>~1 min pick</span>
                  </div>

                  {invItem?.sku && (
                    <div className="absolute bottom-2 right-2 bg-white/90 backdrop-blur-md px-2 py-0.5 rounded text-[9px] font-mono text-slate-700 border border-slate-200">
                      {invItem.sku}
                    </div>
                  )}
                </div>

                <div className="space-y-1">
                  <h3 className="font-semibold text-slate-900 group-hover:text-sky-600 transition-colors text-sm line-clamp-1">
                    {item.name}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2">
                    {item.description}
                  </p>
                </div>
              </div>

              {/* Bottom Stock & Action */}
              <div className="mt-4 pt-3 border-t border-slate-100 space-y-3">
                
                {/* Stock status indicator */}
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-bold text-slate-900 text-base">₹{item.price}</span>
                  {isOutOfStock ? (
                    <span className="text-rose-600 font-bold flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> Sold Out
                    </span>
                  ) : isLowStock ? (
                    <span className="text-amber-600 font-semibold">
                      Only {currentStock} left!
                    </span>
                  ) : (
                    <span className="text-emerald-700 font-medium">In Stock</span>
                  )}
                </div>

                {/* Add to Cart Control */}
                {isOutOfStock ? (
                  <button
                    disabled
                    className="w-full py-2 rounded-xl bg-slate-100 text-slate-400 text-xs font-bold cursor-not-allowed border border-slate-200"
                  >
                    Out of Stock
                  </button>
                ) : inCart ? (
                  <div 
                    onClick={(e) => e.stopPropagation()} 
                    className="flex items-center justify-between bg-slate-100 border border-slate-200 rounded-xl p-1"
                  >
                    <button
                      onClick={() => updateCartQuantity(inCart.id, inCart.quantity - 1)}
                      className="p-1 text-sky-600 hover:text-sky-800"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="text-xs font-bold text-slate-900 px-2">
                      {inCart.quantity} in cart
                    </span>
                    <button
                      onClick={() => updateCartQuantity(inCart.id, inCart.quantity + 1)}
                      className="p-1 text-sky-600 hover:text-sky-800"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (item.variants && item.variants.length > 0) {
                        onSelectProduct(item);
                      } else {
                        addToCart(item, 1);
                      }
                    }}
                    className="w-full py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs active:scale-95 transition-transform"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Quick Add</span>
                  </button>
                )}

              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
