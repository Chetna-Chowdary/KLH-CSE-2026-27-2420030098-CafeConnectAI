import React, { useState } from 'react';
import { 
  Trash2, 
  Clock, 
  Plus, 
  Minus, 
  ArrowRight, 
  ShoppingBag, 
  ChevronDown, 
  ChevronUp,
  ArrowLeft
} from 'lucide-react';
import { useCafe } from '../context/CafeContext';

interface CartPageProps {
  onNavigate: (tab: string, param?: string) => void;
  onProceedCheckout: () => void;
}

export const CartPage: React.FC<CartPageProps> = ({ onNavigate, onProceedCheckout }) => {
  const { 
    cart, 
    cartTotal, 
    cartItemCount, 
    cartWaitEstimate, 
    updateCartQuantity, 
    removeFromCart, 
    clearCart 
  } = useCafe();

  const [cartNotes, setCartNotes] = useState('');
  const [detailsExpanded, setDetailsExpanded] = useState(false);

  if (cart.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center mx-auto text-sky-600">
          <ShoppingBag className="w-10 h-10 opacity-70" />
        </div>
        <div className="space-y-2">
          <h2 className="font-serif-luxury text-3xl font-bold text-slate-900">Your Cart is Empty</h2>
          <p className="text-sm text-slate-500 max-w-sm mx-auto">
            Explore our freshly prepared South Indian dosas, burgers, steaming filter coffee, or packaged snacks.
          </p>
        </div>
        <button
          onClick={() => onNavigate('menu')}
          className="px-8 py-3.5 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-sm shadow-md shadow-sky-600/20 transition-transform active:scale-95 inline-flex items-center gap-2"
        >
          <span>Explore Menu</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      
      {/* 1. Header with Cart count & Clear Cart */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div>
          <button
            onClick={() => onNavigate('menu')}
            className="flex items-center gap-1.5 text-xs font-semibold text-sky-600 hover:text-sky-800 mb-1 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Continue Ordering</span>
          </button>
          <h1 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-slate-900">
            Your Cart <span className="text-sky-700 font-sans text-xl">({cartItemCount} items)</span>
          </h1>
        </div>

        <button
          onClick={clearCart}
          className="text-xs font-semibold text-rose-600 hover:text-rose-700 hover:underline transition-colors"
        >
          Clear Cart
        </button>
      </div>

      {/* 2. Item Rows matching Reference Screen 5 */}
      <div className="space-y-4">
        {cart.map((cartItem) => {
          const item = cartItem.menuItem;
          return (
            <div
              key={cartItem.id}
              className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              {/* Product Info & Thumb */}
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover bg-slate-100 border border-slate-200 shrink-0"
                />
                <div>
                  <h3 className="font-semibold text-base text-slate-900">
                    {item.name}
                  </h3>
                  <p className="text-sm font-bold text-sky-700">
                    ₹{item.price}
                  </p>

                  {/* Customizations summary */}
                  {cartItem.customization && (
                    <div className="text-[11px] text-slate-500 mt-1 space-y-0.5">
                      {cartItem.customization.chutney && (
                        <p>• {cartItem.customization.chutney}</p>
                      )}
                      {cartItem.customization.selectedAddOns.map(a => (
                        <p key={a.id}>• + {a.name} (₹{a.price})</p>
                      ))}
                      {cartItem.customization.selectedVariant && (
                        <p>• {cartItem.customization.selectedVariant.name}</p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Controls: Stepper, Item Wait, Total, Trash */}
              <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-6 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                
                {/* Stepper */}
                <div className="flex items-center bg-slate-100 border border-slate-200 rounded-xl p-1">
                  <button
                    onClick={() => updateCartQuantity(cartItem.id, cartItem.quantity - 1)}
                    className="p-1.5 text-sky-600 hover:text-sky-800 transition-colors"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-8 text-center font-bold text-sm text-slate-900">
                    {cartItem.quantity}
                  </span>
                  <button
                    onClick={() => updateCartQuantity(cartItem.id, cartItem.quantity + 1)}
                    className="p-1.5 text-sky-600 hover:text-sky-800 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Item Live Wait Time Box matching Reference Screen 5 */}
                <div className="bg-slate-50 px-3 py-2 rounded-xl border border-slate-200 text-right min-w-[130px]">
                  <div className="flex items-center justify-end gap-1.5 text-xs font-bold text-sky-700">
                    <Clock className="w-3.5 h-3.5 text-amber-500" />
                    <span>{cartItem.estimatedWaitMinutes.min} – {cartItem.estimatedWaitMinutes.max} mins</span>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    {cartItem.ordersAhead} {cartItem.ordersAhead === 1 ? 'order' : 'orders'} before yours
                  </p>
                </div>

                {/* Item Total Price */}
                <div className="text-right min-w-[60px]">
                  <span className="font-bold text-slate-900 text-base">
                    ₹{cartItem.itemTotalPrice}
                  </span>
                </div>

                {/* Remove button */}
                <button
                  onClick={() => removeFromCart(cartItem.id)}
                  className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition-colors"
                  title="Remove item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

              </div>
            </div>
          );
        })}
      </div>

      {/* 3. Total Estimated Wait Time Card (Matching Screen 5) */}
      <div className="bg-gradient-to-r from-sky-50 via-white to-blue-50 rounded-2xl p-5 border border-sky-200 shadow-sm flex flex-col sm:flex-row items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center shrink-0">
          <Clock className="w-6 h-6" />
        </div>
        <div className="flex-1 text-center sm:text-left">
          <p className="text-xs uppercase font-bold tracking-wider text-sky-700">
            Your Total Estimated Wait Time
          </p>
          <p className="text-xl sm:text-2xl font-bold text-slate-900 mt-0.5">
            {cartWaitEstimate.minMinutes} – {cartWaitEstimate.maxMinutes} minutes
          </p>
          <p className="text-xs text-slate-600 mt-1">
            Based on current live kitchen queue at {cartWaitEstimate.dominantStationName || 'Cafeteria Stations'}. Parallel preparation across independent counters.
          </p>
        </div>
        <div className="bg-white px-4 py-2.5 rounded-xl border border-slate-200 text-center shrink-0 shadow-xs">
          <p className="text-[11px] text-slate-500">Expected Ready Around</p>
          <p className="text-sm font-bold text-sky-700">{cartWaitEstimate.expectedReadyTime}</p>
        </div>
      </div>

      {/* 4. Special Instructions Note Input */}
      <div>
        <label className="block text-xs uppercase font-bold tracking-wider text-slate-700 mb-2">
          Add a note (optional)
        </label>
        <input
          type="text"
          placeholder="e.g. less spicy chutney, no sugar in coffee, without onion..."
          value={cartNotes}
          onChange={(e) => setCartNotes(e.target.value)}
          className="w-full px-4 py-3 rounded-2xl bg-white border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 text-sm shadow-xs"
        />
      </div>

      {/* 5. Bottom Checkout Bar (Total & Proceed) */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-500">Total:</span>
            <span className="text-3xl font-serif-luxury font-bold text-slate-900">
              ₹{cartTotal}
            </span>
            <button
              onClick={() => setDetailsExpanded(!detailsExpanded)}
              className="text-xs text-sky-600 flex items-center gap-0.5 ml-2 hover:underline"
            >
              <span>{detailsExpanded ? 'Hide breakdown' : 'View details'}</span>
              {detailsExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Inclusive of all taxes & packaging. Pay at counter or online.
          </p>

          {/* Breakdown dropdown */}
          {detailsExpanded && (
            <div className="mt-4 pt-4 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Items Subtotal:</span>
                <span className="font-semibold text-slate-800">₹{cartTotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Cafeteria GST (Included):</span>
                <span>₹0</span>
              </div>
              <div className="flex justify-between">
                <span>Pickup Fee:</span>
                <span className="text-emerald-700 font-bold">FREE</span>
              </div>
            </div>
          )}
        </div>

        <button
          onClick={onProceedCheckout}
          className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-base shadow-md shadow-sky-600/20 flex items-center justify-center gap-3 transition-transform active:scale-95"
        >
          <span>Proceed to Checkout</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>

    </div>
  );
};
