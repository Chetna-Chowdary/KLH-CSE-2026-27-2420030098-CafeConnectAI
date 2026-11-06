import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Sparkles, 
  ArrowRight, 
  X,
  Coffee,
  Soup,
  Utensils,
  Sandwich,
  Flame,
  Package,
  Cake,
  GlassWater,
  SlidersHorizontal
} from 'lucide-react';
import { useCafe } from '../context/CafeContext';
import { CATEGORIES } from '../services/mockData';
import { MenuItem } from '../types';
import { ProductCard } from '../components/ProductCard';

interface ExploreMenuPageProps {
  onNavigate: (tab: string, param?: string) => void;
  onSelectProduct: (item: MenuItem) => void;
  initialCategory?: string;
}

export const ExploreMenuPage: React.FC<ExploreMenuPageProps> = ({ 
  onNavigate, 
  onSelectProduct,
  initialCategory 
}) => {
  const { menuItems } = useCafe();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || 'all');
  const [under50Only, setUnder50Only] = useState(false);
  const [sortBy, setSortBy] = useState<'popularity' | 'price_asc' | 'price_desc' | 'prep_time'>('popularity');
  const [dietaryFilter, setDietaryFilter] = useState<'all' | 'veg'>('all');

  const filteredItems = useMemo(() => {
    let result = [...menuItems].filter(item => item.isActive);

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(item => 
        item.name.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        (item.subCategory && item.subCategory.toLowerCase().includes(q))
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      result = result.filter(item => item.category === selectedCategory);
    }

    // Under 50 filter
    if (under50Only) {
      result = result.filter(item => item.price <= 50);
    }

    // Dietary filter
    if (dietaryFilter === 'veg') {
      result = result.filter(item => item.dietaryTags.includes('veg'));
    }

    // Sorting
    if (sortBy === 'price_asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price_desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'prep_time') {
      result.sort((a, b) => a.basePrepMinutes - b.basePrepMinutes);
    } else {
      // popularity default
      result.sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0));
    }

    return result;
  }, [menuItems, searchQuery, selectedCategory, under50Only, dietaryFilter, sortBy]);

  const categoryIconMap: Record<string, React.ReactNode> = {
    all: <Sparkles className="w-4 h-4" />,
    south_indian: <Soup className="w-4 h-4" />,
    meals_fastfood: <Utensils className="w-4 h-4" />,
    burgers_sandwiches: <Sandwich className="w-4 h-4" />,
    hot_snacks: <Flame className="w-4 h-4" />,
    packaged_snacks: <Package className="w-4 h-4" />,
    hot_beverages: <Coffee className="w-4 h-4" />,
    cold_drinks: <GlassWater className="w-4 h-4" />,
    desserts_bakery: <Cake className="w-4 h-4" />,
    combos: <Sparkles className="w-4 h-4" />
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* 1. Header Search Bar & Quick Stats */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:max-w-xl">
          <Search className="absolute left-4 top-3.5 w-5 h-5 text-sky-600" />
          <input
            type="text"
            placeholder="Search for food, snacks, beverages (e.g. Masala Dosa, Cold Coffee, Lays)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-10 py-3 rounded-2xl bg-white border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 text-sm shadow-xs"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-700"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Quick Filters */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end">
          <button
            onClick={() => setUnder50Only(!under50Only)}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all border shadow-xs ${
              under50Only
                ? 'bg-sky-600 text-white border-sky-600'
                : 'bg-white text-slate-700 border-slate-300 hover:border-sky-400'
            }`}
          >
            Under ₹50
          </button>
          
          <button
            onClick={() => setDietaryFilter(dietaryFilter === 'veg' ? 'all' : 'veg')}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all border flex items-center gap-1.5 shadow-xs ${
              dietaryFilter === 'veg'
                ? 'bg-emerald-600 text-white border-emerald-600'
                : 'bg-white text-slate-700 border-slate-300 hover:border-sky-400'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            Vegetarian
          </button>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-1.5 bg-white px-3 py-2 rounded-xl border border-slate-300 text-xs shadow-xs">
            <SlidersHorizontal className="w-3.5 h-3.5 text-sky-600" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent text-slate-800 font-semibold focus:outline-none cursor-pointer"
            >
              <option value="popularity">Popularity</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="prep_time">Fastest Prep Time</option>
            </select>
          </div>
        </div>
      </div>

      {/* 2. Top Promotional Banner matching Screen 2 */}
      {selectedCategory === 'all' && !searchQuery && (
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-sky-50 via-white to-teal-50 border border-sky-200 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="space-y-3 max-w-lg">
            <h2 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-slate-900">
              Craving Something Delicious?
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Fresh Bites. Great Vibes. Campus Style.
            </p>
            <button
              onClick={() => setSelectedCategory('combos')}
              className="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-md shadow-sky-600/20 flex items-center gap-1.5 transition-transform active:scale-95"
            >
              <span>Explore Combos</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-3">
            <img
              src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=300&q=80"
              alt="Burger combo"
              className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl object-cover shadow-md border border-slate-200"
            />
            <img
              src="https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=300&q=80"
              alt="Cold coffee"
              className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl object-cover shadow-md border border-slate-200 hidden sm:block"
            />
          </div>
        </div>
      )}

      {/* 3. Category Horizontal Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all border shadow-xs ${
            selectedCategory === 'all'
              ? 'bg-sky-600 text-white border-sky-600'
              : 'bg-white text-slate-700 border-slate-200 hover:border-sky-300'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>All Items ({menuItems.length})</span>
        </button>

        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => {
              if (cat.id === 'packaged_snacks') {
                onNavigate('packaged_snacks');
              } else {
                setSelectedCategory(cat.id);
              }
            }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all border shadow-xs ${
              selectedCategory === cat.id
                ? 'bg-sky-600 text-white border-sky-600'
                : 'bg-white text-slate-700 border-slate-200 hover:border-sky-300'
            }`}
          >
            {categoryIconMap[cat.id] || <Utensils className="w-3.5 h-3.5" />}
            <span>{cat.name}</span>
          </button>
        ))}
      </div>

      {/* 4. Products Grid */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <p className="text-xs uppercase font-bold tracking-wider text-slate-600">
            Showing {filteredItems.length} items
          </p>
          {selectedCategory !== 'all' && (
            <button
              onClick={() => setSelectedCategory('all')}
              className="text-xs text-sky-600 hover:text-sky-800 font-semibold"
            >
              Reset Category
            </button>
          )}
        </div>

        {filteredItems.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 max-w-md mx-auto space-y-4 shadow-sm">
            <Search className="w-12 h-12 text-slate-400 mx-auto" />
            <h3 className="font-serif-luxury text-xl font-bold text-slate-900">No products found</h3>
            <p className="text-xs text-slate-600">
              We couldn't find anything matching your search criteria. Try a different keyword or reset filters.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setUnder50Only(false);
                setDietaryFilter('all');
              }}
              className="px-5 py-2.5 rounded-xl bg-sky-600 text-white font-bold text-xs shadow-xs"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map(item => (
              <ProductCard
                key={item.id}
                item={item}
                onSelect={onSelectProduct}
              />
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
