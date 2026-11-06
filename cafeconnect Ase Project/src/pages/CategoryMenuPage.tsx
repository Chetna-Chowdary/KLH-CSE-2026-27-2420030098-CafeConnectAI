import React, { useState, useMemo } from 'react';
import { 
  ChevronRight, 
  SlidersHorizontal, 
  Soup
} from 'lucide-react';
import { useCafe } from '../context/CafeContext';

import { MenuItem } from '../types';
import { ProductCard } from '../components/ProductCard';

interface CategoryMenuPageProps {
  categoryId: string;
  onNavigate: (tab: string, param?: string) => void;
  onSelectProduct: (item: MenuItem) => void;
}


export const CategoryMenuPage: React.FC<CategoryMenuPageProps> = ({
  categoryId,
  onNavigate,
  onSelectProduct
}) => {
  
const { menuItems, categories } = useCafe();
const currentCategory = categories.find(c => c.id === categoryId) || categories[0];

  const [subFilter, setSubFilter] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'default' | 'price_asc' | 'price_desc' | 'prep_time'>('default');

  // Sub-categories available for this category
  const subCategories = useMemo(() => {
    if (categoryId === 'south_indian') {
      return ['All', 'Dosa', 'Idli', 'Vada', 'Uttapam', 'Others'];
    }
    const items = menuItems.filter(i => i.category === categoryId);
    const set = new Set<string>();
    items.forEach(i => {
      if (i.subCategory) set.add(i.subCategory);
    });
    return ['All', ...Array.from(set)];
  }, [categoryId, menuItems]);

  const categoryItems = useMemo(() => {
    let items = menuItems.filter(i => i.category === categoryId && i.isActive);

    if (subFilter !== 'All') {
      if (subFilter === 'Others') {
        items = items.filter(i => !['Dosa', 'Idli', 'Vada', 'Uttapam'].includes(i.subCategory || ''));
      } else {
        items = items.filter(i => i.subCategory === subFilter || i.name.toLowerCase().includes(subFilter.toLowerCase()));
      }
    }

    if (sortBy === 'price_asc') {
      items.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price_desc') {
      items.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'prep_time') {
      items.sort((a, b) => a.basePrepMinutes - b.basePrepMinutes);
    }

    return items;
  }, [menuItems, categoryId, subFilter, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* 1. Breadcrumbs */}
      <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
        <button 
          onClick={() => onNavigate('menu')} 
          className="hover:text-sky-600 transition-colors"
        >
          Explore
        </button>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-sky-700">{currentCategory.name}</span>
      </div>

      {/* 2. Category Header Banner matching Reference Screen 3 */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-sky-50 via-white to-teal-50 border border-sky-200 min-h-[200px] flex items-center justify-between p-6 sm:p-10 shadow-sm">
        <div className="relative z-10 max-w-xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/95 text-sky-700 text-xs font-semibold border border-sky-200 shadow-xs">
            <Soup className="w-3.5 h-3.5" />
            <span>Campus Traditional Kitchen</span>
          </div>
          <h1 className="font-serif-luxury text-3xl sm:text-5xl font-bold text-slate-900 tracking-tight">
            {currentCategory.name}
          </h1>
          <p className="text-sm sm:text-base text-slate-600 font-light">
            {currentCategory.description}
          </p>
        </div>

        {/* Background photo illustration overlay */}
        <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-30 sm:opacity-50 pointer-events-none overflow-hidden">
          <img
            src={currentCategory.imageUrl}
            alt={currentCategory.name}
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/70 to-transparent" />
        </div>
      </div>

      {/* 3. Sub-Filters & Sort matching Reference Screen 3 */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
        
        {/* Sub-category tabs */}
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 scrollbar-none">
          {subCategories.map(tab => (
            <button
              key={tab}
              onClick={() => setSubFilter(tab)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border whitespace-nowrap shadow-xs ${
                subFilter === tab
                  ? 'bg-sky-600 text-white border-sky-600'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-sky-300'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <span className="text-xs text-slate-500">Sort by:</span>
          <div className="flex items-center gap-1.5 bg-white px-3.5 py-2 rounded-xl border border-slate-300 text-xs shadow-xs">
            <SlidersHorizontal className="w-3.5 h-3.5 text-sky-600" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent text-slate-800 font-semibold focus:outline-none cursor-pointer"
            >
              <option value="default">Recommended</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="prep_time">Fastest Prep</option>
            </select>
          </div>
        </div>

      </div>

      {/* 4. Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categoryItems.map(item => (
          <ProductCard
            key={item.id}
            item={item}
            onSelect={onSelectProduct}
          />
        ))}
      </div>

    </div>
  );
};
