import React from 'react';
import { Clock, Plus, Check, Star, AlertCircle } from 'lucide-react';
import { MenuItem } from '../types';
import { useCafe } from '../context/CafeContext';
import { QueueEstimationService } from '../services/queueEstimationService';

interface ProductCardProps {
  item: MenuItem;
  onSelect: (item: MenuItem) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ item, onSelect }) => {
  const { stations, orders, cart, addToCart } = useCafe();

  // Calculate live estimate for this item
  const waitEst = QueueEstimationService.estimateItemWait(item, 1, stations, orders);

  // Check if item is already in cart
  const cartEntries = cart.filter(ci => ci.menuItem.id === item.id);
  const totalInCart = cartEntries.reduce((sum, ci) => sum + ci.quantity, 0);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!item.isAvailable || waitEst.isStationPaused) return;

    // If item has complex mandatory customizations (like dosa add-ons), open modal
    if (item.availableAddOns && item.availableAddOns.length > 0) {
      onSelect(item);
    } else {
      addToCart(item, 1);
    }
  };

  return (
    <div
      onClick={() => onSelect(item)}
      className={`group relative bg-white rounded-2xl overflow-hidden border border-slate-200 hover:border-sky-300 hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col ${
        !item.isAvailable ? 'opacity-70 grayscale-[40%]' : ''
      }`}
    >
      {/* Top Image Container */}
      <div className="relative h-44 w-full overflow-hidden bg-slate-100">
        <img
          src={item.imageUrl}
          alt={item.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60" />

        {/* Veg badge */}
        <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md p-1.5 rounded-lg border border-emerald-500/40 flex items-center justify-center shadow-xs">
          <div className="w-3.5 h-3.5 border border-emerald-600 flex items-center justify-center p-0.5">
            <div className="w-2 h-2 rounded-full bg-emerald-600" />
          </div>
        </div>

        {/* Bestseller / Chef's Special Badge */}
        {item.isBestseller && (
          <span className="absolute top-3 right-3 text-[10px] font-bold uppercase tracking-wider bg-sky-600 text-white px-2 py-0.5 rounded-md shadow-xs">
            Bestseller
          </span>
        )}
        {item.isChefsSpecial && !item.isBestseller && (
          <span className="absolute top-3 right-3 text-[10px] font-bold uppercase tracking-wider bg-teal-600 text-white px-2 py-0.5 rounded-md shadow-xs">
            Chef's Special
          </span>
        )}

        {/* Rating overlay */}
        <div className="absolute bottom-2 left-3 flex items-center gap-1 text-[11px] font-semibold text-slate-900 bg-white/95 backdrop-blur-sm px-2 py-0.5 rounded-md border border-slate-200 shadow-xs">
          <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
          <span>{item.rating}</span>
          <span className="text-slate-500">({item.reviewCount})</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-semibold text-base text-slate-900 group-hover:text-sky-600 transition-colors line-clamp-1">
            {item.name}
          </h3>
          <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
            {item.description}
          </p>
        </div>

        {/* Pricing, Wait Time & Actions */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
          <div>
            <div className="text-lg font-bold text-slate-900 tracking-tight">
              ₹{item.price}
            </div>

            {/* Live estimated prep time */}
            <div className="flex items-center gap-1 text-xs text-sky-700 font-medium mt-0.5">
              <Clock className="w-3.5 h-3.5 text-sky-600" />
              <span>
                {waitEst.isStationPaused 
                  ? 'Station Paused' 
                  : `${waitEst.minMinutes} – ${waitEst.maxMinutes} mins`}
              </span>
            </div>
          </div>

          {/* Add to Cart button */}
          <div>
            {!item.isAvailable ? (
              <span className="text-[11px] font-bold uppercase text-rose-700 bg-rose-50 px-2.5 py-1.5 rounded-xl border border-rose-200 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> Sold Out
              </span>
            ) : totalInCart > 0 ? (
              <button
                onClick={handleQuickAdd}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-700 hover:bg-sky-800 text-white text-xs font-bold shadow-xs transition-all"
              >
                <Check className="w-3.5 h-3.5" />
                <span>{totalInCart} in Cart</span>
              </button>
            ) : (
              <button
                onClick={handleQuickAdd}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold shadow-xs transition-transform active:scale-95 shadow-sky-600/20"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
