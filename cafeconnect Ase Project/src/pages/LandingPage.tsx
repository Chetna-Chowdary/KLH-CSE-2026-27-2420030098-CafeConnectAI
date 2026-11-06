import React from 'react';
import { 
  ArrowRight, 
  Zap, 
  Clock, 
  ShieldCheck, 
  Sparkles, 
  Utensils, 
  ChevronRight
} from 'lucide-react';
import { useCafe } from '../context/CafeContext';

import { ProductCard } from '../components/ProductCard';
import { MenuItem } from '../types';

interface LandingPageProps {
  onNavigate: (tab: string, param?: string) => void;
  onSelectProduct: (item: MenuItem) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate, onSelectProduct }) => {
const { menuItems, categories } = useCafe();

  // Bestsellers & quick highlights
  const bestsellers = menuItems.filter(item => item.isBestseller).slice(0, 6);
  const under50Items = menuItems.filter(item => item.price <= 50).slice(0, 4);

  return (
    <div className="space-y-16 pb-16">
      
      {/* 1. HERO SECTION matching reference Screen 1 in clean light theme */}
      <section className="relative min-h-[560px] lg:min-h-[620px] rounded-3xl overflow-hidden mx-4 sm:mx-6 lg:mx-8 mt-4 border border-slate-200 shadow-xl flex flex-col justify-between p-6 sm:p-12 lg:p-16 bg-white">
        
        {/* Background photo & overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1600&q=85"
            alt="Cafe Connect interior"
            className="w-full h-full object-cover object-center filter contrast-[1.05] brightness-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/85 to-white/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
        </div>

        {/* Top Badges / Tagline */}
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/95 border border-sky-200 text-xs text-sky-700 font-bold shadow-xs backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-sky-600" />
            <span>Campus Dining Reimagined • Live Kitchen Queues</span>
          </div>
        </div>

        {/* Main Hero Content (Good Food. Brighter Days.) */}
        <div className="relative z-10 max-w-2xl space-y-6 my-auto pt-8">
          <h1 className="font-serif-luxury text-4xl sm:text-6xl lg:text-7xl font-bold text-slate-900 tracking-tight leading-[1.08]">
            Good Food.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 via-teal-600 to-blue-700">
              Brighter Days.
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-600 font-normal leading-relaxed">
            Your Campus Café, Just a Click Away. Freshly prepared meals, snacks and beverages. 
            Order, relax, and pick up when it's ready.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={() => onNavigate('menu')}
              className="px-8 py-4 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-base shadow-lg shadow-sky-600/25 flex items-center gap-2 transition-transform active:scale-95 group"
            >
              <span>Order Now</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => onNavigate('category', 'south_indian')}
              className="px-6 py-4 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 font-semibold text-base border border-slate-300 shadow-xs backdrop-blur-md transition-colors"
            >
              Explore South Indian Menu
            </button>
          </div>
        </div>

        {/* Feature Strip matching Reference Screen 1 bottom bar */}
        <div className="relative z-10 grid grid-cols-2 lg:grid-cols-4 gap-3 pt-8 mt-6 border-t border-slate-200">
          <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-sky-50 flex items-center justify-center text-sky-600 shrink-0">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">Quick Ordering</p>
              <p className="text-[11px] text-slate-500">Order in 30 seconds</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-sky-50 flex items-center justify-center text-sky-600 shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">Live Wait Time</p>
              <p className="text-[11px] text-sky-700 font-semibold">Real-time station queue</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-sky-50 flex items-center justify-center text-sky-600 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">No Repeated Login</p>
              <p className="text-[11px] text-slate-500">Seamless guest session</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-sky-50 flex items-center justify-center text-sky-600 shrink-0">
              <Utensils className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">Fresh & Hygienic</p>
              <p className="text-[11px] text-slate-500">Cooked to fresh order</p>
            </div>
          </div>
        </div>

      </section>

      {/* 2. POPULAR CATEGORIES matching reference Screen 2 */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-xs uppercase font-bold tracking-widest text-sky-600">Categories</span>
            <h2 className="font-serif-luxury text-3xl font-bold text-slate-900 mt-1">
              Popular Categories
            </h2>
          </div>
          <button
            onClick={() => onNavigate('menu')}
            className="text-xs font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1 transition-colors"
          >
            <span>View All Categories</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
       {categories.slice(0, 10).map((cat) => (
            <div
              key={cat.id}
              onClick={() => {
                if (cat.id === 'packaged_snacks') {
                  onNavigate('packaged_snacks');
                } else {
                  onNavigate('category', cat.id);
                }
              }}
              className="group cursor-pointer bg-white rounded-2xl p-4 border border-slate-200 hover:border-sky-300 transition-all duration-300 hover:shadow-md flex flex-col items-center text-center shadow-xs"
            >
              <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-slate-100 group-hover:border-sky-400 transition-colors mb-3 bg-slate-50 shadow-xs">
                <img
                  src={cat.imageUrl}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <h3 className="text-sm font-semibold text-slate-900 group-hover:text-sky-600 transition-colors line-clamp-1">
                {cat.name}
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5">
                {cat.itemCount} items
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. PROMOTIONAL HERO BANNER (Craving Something Delicious?) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-sky-50 via-white to-teal-50 border border-sky-200 p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-8 shadow-sm">
          <div className="space-y-4 max-w-lg">
            <span className="text-xs uppercase font-bold tracking-widest text-sky-600">
              Campus Special Deal
            </span>
            <h2 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-slate-900">
              Craving Something Delicious?
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Fresh Bites. Great Vibes. Campus Style. Upgrade your study session with our curated Super Combos at unbeatable student rates.
            </p>
            <button
              onClick={() => onNavigate('category', 'combos')}
              className="px-6 py-3 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs uppercase tracking-wider shadow-md shadow-sky-600/20 flex items-center gap-2 transition-transform active:scale-95"
            >
              <span>Explore Combos</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="relative w-full md:w-80 h-52 rounded-2xl overflow-hidden shadow-lg border border-slate-200 shrink-0">
            <img
              src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80"
              alt="Delicious burger combo"
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-sky-700 shadow-xs">
              Save up to ₹25 on Combos
            </div>
          </div>
        </div>
      </section>

      {/* 4. BESTSELLER ITEMS GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-xs uppercase font-bold tracking-widest text-sky-600">Student Favorites</span>
            <h2 className="font-serif-luxury text-3xl font-bold text-slate-900 mt-1">
              Campus Bestsellers
            </h2>
          </div>
          <button
            onClick={() => onNavigate('menu')}
            className="text-xs font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1 transition-colors"
          >
            <span>See Full Menu</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {bestsellers.map(item => (
            <ProductCard
              key={item.id}
              item={item}
              onSelect={onSelectProduct}
            />
          ))}
        </div>
      </section>

      {/* 5. BUDGET BITES UNDER ₹50 */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-100/80 rounded-3xl p-8 border border-slate-200">
          <div className="flex items-center justify-between mb-6">
            <div>
              <span className="text-xs uppercase font-bold tracking-widest text-teal-700">Pocket Friendly</span>
              <h2 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
                Pocket Friendly Bites (Under ₹50)
              </h2>
            </div>
            <button
              onClick={() => onNavigate('menu')}
              className="text-xs font-bold text-sky-600 hover:text-sky-800"
            >
              Filter Under ₹50 →
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {under50Items.map(item => (
              <ProductCard
                key={item.id}
                item={item}
                onSelect={onSelectProduct}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 6. HOW PICKUP WORKS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-xs uppercase font-bold tracking-widest text-sky-600">Effortless Experience</span>
          <h2 className="font-serif-luxury text-3xl font-bold text-slate-900 mt-1">
            How Pickup Works
          </h2>
          <p className="text-xs text-slate-500 mt-2">
            No crowds, no shouting order numbers, zero guess work.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 text-center space-y-3 shadow-xs">
            <div className="w-12 h-12 rounded-full bg-sky-50 text-sky-600 font-bold text-lg flex items-center justify-center mx-auto border border-sky-200">
              1
            </div>
            <h3 className="font-bold text-slate-900 text-base">Browse & See Live Wait Time</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Before placing your order, check realistic wait times calculated based on the active station workload.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 text-center space-y-3 shadow-xs">
            <div className="w-12 h-12 rounded-full bg-sky-50 text-sky-600 font-bold text-lg flex items-center justify-center mx-auto border border-sky-200">
              2
            </div>
            <h3 className="font-bold text-slate-900 text-base">Instant Order Confirmation</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Receive your unique Pickup Number (e.g. #P-47) and follow your order's journey from kitchen griddle to counter.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 text-center space-y-3 shadow-xs">
            <div className="w-12 h-12 rounded-full bg-sky-50 text-sky-600 font-bold text-lg flex items-center justify-center mx-auto border border-sky-200">
              3
            </div>
            <h3 className="font-bold text-slate-900 text-base">Pickup When Ready</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Walk up to the Cafe Connect counter right when your order status shows "Ready for Pickup". Zero waiting in line!
            </p>
          </div>
        </div>
      </section>

    </div>
  );
};
