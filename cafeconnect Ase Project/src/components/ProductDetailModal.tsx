import React, { useState } from 'react';
import { 
  X, 
  Clock, 
  Star, 
  Plus, 
  Minus, 
  Heart, 
  Check, 
  Utensils, 
  AlertTriangle, 
  Sparkles, 
  ArrowLeft 
} from 'lucide-react';
import { AddOn, MenuItem, ProductVariant } from '../types';
import { useCafe } from '../context/CafeContext';
import { QueueEstimationService } from '../services/queueEstimationService';

interface ProductDetailModalProps {
  item: MenuItem | null;
  onClose: () => void;
  onOpenCart: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ 
  item, 
  onClose
}) => {
  if (!item) return null;

  const { stations, orders, addToCart } = useCafe();
  const [quantity, setQuantity] = useState(1);
  const [selectedChutney, setSelectedChutney] = useState<string>(
    item.customizationOptions?.chutneys?.[0] || 'Coconut Chutney'
  );
  const [selectedSpice, setSelectedSpice] = useState<string>(
    item.customizationOptions?.spiceLevels?.[0] || 'Standard'
  );
  const [selectedAddOns, setSelectedAddOns] = useState<AddOn[]>([]);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(
    item.variants?.[0]
  );
  const [isFavorited, setIsFavorited] = useState(false);
  const [addedSuccess, setAddedSuccess] = useState(false);

  // Compute live queue estimate
  const waitEst = QueueEstimationService.estimateItemWait(item, quantity, stations, orders);
  const station = stations[item.stationId];
  const workloadPercent = station?.currentWorkloadPercent || 40;

  // Calculate dynamic price
  let currentUnitPrice = item.price;
  if (selectedVariant) {
    currentUnitPrice += selectedVariant.priceDelta;
  }
  selectedAddOns.forEach(addon => {
    currentUnitPrice += addon.price;
  });
  const totalPrice = currentUnitPrice * quantity;

  const toggleAddOn = (addon: AddOn) => {
    if (selectedAddOns.some(a => a.id === addon.id)) {
      setSelectedAddOns(prev => prev.filter(a => a.id !== addon.id));
    } else {
      setSelectedAddOns(prev => [...prev, addon]);
    }
  };

  const handleAddToCart = () => {
    if (!item.isAvailable || waitEst.isStationPaused) return;

    addToCart(item, quantity, {
      chutney: selectedChutney,
      spiceLevel: selectedSpice,
      selectedAddOns,
      selectedVariant
    });

    setAddedSuccess(true);
    setTimeout(() => {
      setAddedSuccess(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto bg-white text-slate-900 rounded-3xl border border-slate-200 shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header navigation controls */}
        <div className="sticky top-0 z-20 flex items-center justify-between p-4 sm:p-6 bg-white/95 backdrop-blur-md border-b border-slate-100">
          <button
            onClick={onClose}
            className="flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-sky-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Menu</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsFavorited(!isFavorited)}
              className={`p-2.5 rounded-full border transition-colors ${
                isFavorited 
                  ? 'bg-rose-50 border-rose-200 text-rose-500' 
                  : 'bg-slate-100 border-slate-200 text-slate-500 hover:text-slate-800'
              }`}
            >
              <Heart className={`w-4 h-4 ${isFavorited ? 'fill-rose-500' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2.5 rounded-full bg-slate-100 border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-200 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 sm:p-8">
          
          {/* Left Column: Image & Station Load card */}
          <div className="space-y-4">
            <div className="relative rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 h-64 sm:h-80 shadow-xs">
              <img
                src={item.imageUrl}
                alt={item.name}
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60" />

              {/* Veg Indicator */}
              <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md p-1.5 rounded-lg border border-emerald-500/40 shadow-xs">
                <div className="w-4 h-4 border border-emerald-600 flex items-center justify-center p-0.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                </div>
              </div>

              {/* Station Tag */}
              <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-200 text-xs shadow-xs">
                <Utensils className="w-3.5 h-3.5 text-sky-600" />
                <span className="font-semibold text-slate-800">{station?.name || 'Kitchen Prep Station'}</span>
              </div>
            </div>

            {/* Live Kitchen Status / Estimated Wait Time Box */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold uppercase tracking-wider text-sky-700 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-sky-600" /> Live Kitchen Station Load
                </span>
                <span className="text-slate-500">
                  {waitEst.ordersAhead} order(s) ahead
                </span>
              </div>

              {/* Progress workload bar */}
              <div>
                <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden border border-slate-300">
                  <div 
                    className={`h-full transition-all duration-500 ${
                      workloadPercent > 80 
                        ? 'bg-rose-500' 
                        : workloadPercent > 50 
                        ? 'bg-sky-500' 
                        : 'bg-emerald-500'
                    }`}
                    style={{ width: `${Math.min(100, workloadPercent)}%` }}
                  />
                </div>
                <div className="flex justify-between items-center text-[11px] text-slate-500 mt-1.5">
                  <span>{workloadPercent > 75 ? 'Heavy' : workloadPercent > 40 ? 'Moderate' : 'Optimal'} Workload</span>
                  <span className="font-bold text-slate-800">{workloadPercent}% capacity</span>
                </div>
              </div>

              {/* Estimated Wait Highlight */}
              <div className="flex items-center gap-3 pt-2 border-t border-slate-200">
                <div className="p-2.5 rounded-xl bg-sky-50 text-sky-700 border border-sky-200">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-slate-500">Estimated Prep Time</div>
                  <div className="text-lg font-bold text-slate-900">
                    {waitEst.isStationPaused ? (
                      <span className="text-rose-600 text-sm flex items-center gap-1">
                        <AlertTriangle className="w-4 h-4" /> Line Paused (High Backlog)
                      </span>
                    ) : (
                      `${waitEst.minMinutes} – ${waitEst.maxMinutes} mins`
                    )}
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Title, Ratings, Variants, Customizations & CTA */}
          <div className="flex flex-col justify-between space-y-6">
            
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 border border-slate-200 capitalize">
                    {item.category.replace('_', ' ')}
                  </span>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    <span>{item.rating}</span>
                    <span className="text-slate-500">({item.reviewCount} reviews)</span>
                  </div>
                </div>

                <h2 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-slate-900 mt-2">
                  {item.name}
                </h2>
                <div className="text-2xl font-bold text-sky-700 mt-1">
                  ₹{currentUnitPrice}
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Vegetarian
                </span>
                {item.isChefsSpecial && (
                  <span className="text-xs font-semibold px-3 py-1 rounded-full bg-teal-50 text-teal-700 border border-teal-200">
                    Chef's Special
                  </span>
                )}
                {item.isBestseller && (
                  <span className="text-xs font-semibold px-3 py-1 rounded-full bg-sky-50 text-sky-700 border border-sky-200">
                    Campus Bestseller
                  </span>
                )}
              </div>

              <p className="text-sm text-slate-600 leading-relaxed">
                {item.description}
              </p>

              {/* Variants */}
              {item.variants && item.variants.length > 0 && (
                <div className="space-y-2 pt-2">
                  <label className="text-xs uppercase font-bold tracking-wider text-slate-700">
                    Select Variant / Flavour
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {item.variants.map(variant => (
                      <button
                        key={variant.id}
                        onClick={() => setSelectedVariant(variant)}
                        className={`p-3 rounded-xl text-left border text-xs font-semibold transition-all ${
                          selectedVariant?.id === variant.id
                            ? 'bg-sky-600 text-white border-sky-600 font-bold shadow-xs'
                            : 'bg-slate-50 text-slate-800 border-slate-200 hover:border-sky-300'
                        }`}
                      >
                        <div className="font-bold">{variant.name}</div>
                        {variant.priceDelta > 0 && (
                          <div className={selectedVariant?.id === variant.id ? 'text-sky-100' : 'text-slate-500'}>+ ₹{variant.priceDelta}</div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Customization Options (Chutney) */}
              {item.customizationOptions?.chutneys && (
                <div className="space-y-2 pt-2">
                  <label className="text-xs uppercase font-bold tracking-wider text-slate-700">
                    Chutney Preference (Included)
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {item.customizationOptions.chutneys.map(chutney => (
                      <button
                        key={chutney}
                        onClick={() => setSelectedChutney(chutney)}
                        className={`p-2.5 rounded-xl text-center text-xs font-semibold border transition-all ${
                          selectedChutney === chutney
                            ? 'bg-sky-600 text-white border-sky-600 font-bold shadow-xs'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {chutney}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Spice or Sweetness Level */}
              {item.customizationOptions?.spiceLevels && (
                <div className="space-y-2 pt-2">
                  <label className="text-xs uppercase font-bold tracking-wider text-slate-700">
                    Spice / Sweetness Preference
                  </label>
                  <div className="flex gap-2">
                    {item.customizationOptions.spiceLevels.map(lvl => (
                      <button
                        key={lvl}
                        onClick={() => setSelectedSpice(lvl)}
                        className={`flex-1 p-2 rounded-xl text-center text-xs font-semibold border transition-all ${
                          selectedSpice === lvl
                            ? 'bg-sky-600 text-white border-sky-600 font-bold shadow-xs'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {lvl}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Add-ons */}
              {item.availableAddOns && item.availableAddOns.length > 0 && (
                <div className="space-y-2 pt-2">
                  <label className="text-xs uppercase font-bold tracking-wider text-slate-700">
                    Extra Add-ons (Optional)
                  </label>
                  <div className="space-y-2">
                    {item.availableAddOns.map(addon => {
                      const isSelected = selectedAddOns.some(a => a.id === addon.id);
                      return (
                        <div
                          key={addon.id}
                          onClick={() => toggleAddOn(addon)}
                          className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                            isSelected
                              ? 'bg-sky-50 border-sky-400 text-slate-900 shadow-xs'
                              : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-sky-300'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-5 h-5 rounded-md flex items-center justify-center border ${
                              isSelected ? 'bg-sky-600 border-sky-600 text-white' : 'border-slate-300 bg-white'
                            }`}>
                              {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                            </div>
                            <span className="text-sm font-medium">{addon.name}</span>
                          </div>
                          <span className="text-xs font-bold text-sky-700">
                            + ₹{addon.price}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

            </div>

            {/* Bottom Sticky Action Bar */}
            <div className="pt-6 border-t border-slate-200 flex items-center gap-4">
              
              {/* Stepper */}
              <div className="flex items-center bg-slate-100 border border-slate-200 rounded-2xl p-1">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 text-sky-600 hover:text-sky-800 transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-9 text-center font-bold text-base text-slate-900">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2 text-sky-600 hover:text-sky-800 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Add to Cart CTA */}
              <button
                disabled={!item.isAvailable || waitEst.isStationPaused}
                onClick={handleAddToCart}
                className={`flex-1 py-4 px-6 rounded-2xl font-bold text-sm tracking-wide flex items-center justify-center gap-2 shadow-md transition-all ${
                  !item.isAvailable || waitEst.isStationPaused
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-200'
                    : addedSuccess
                    ? 'bg-emerald-600 text-white'
                    : 'bg-sky-600 hover:bg-sky-700 text-white active:scale-[0.98] shadow-sky-600/25'
                }`}
              >
                {addedSuccess ? (
                  <>
                    <Check className="w-5 h-5" />
                    <span>Added to Cart!</span>
                  </>
                ) : !item.isAvailable ? (
                  <span>Currently Unavailable</span>
                ) : (
                  <>
                    <span>Add to Cart</span>
                    <span>•</span>
                    <span>₹{totalPrice}</span>
                  </>
                )}
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
