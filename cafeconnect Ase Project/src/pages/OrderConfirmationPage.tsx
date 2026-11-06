import React, { useEffect } from 'react';
import { Check, Clock, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Order } from '../types';

interface OrderConfirmationPageProps {
  order: Order;
  onTrackOrder: (orderId: string) => void;
  onContinueBrowsing: () => void;
}

export const OrderConfirmationPage: React.FC<OrderConfirmationPageProps> = ({
  order,
  onTrackOrder,
  onContinueBrowsing
}) => {
  useEffect(() => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#0284C7', '#0EA5E9', '#10B981', '#0F172A']
      });
    } catch (e) {
      // ignore
    }
  }, []);

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="relative w-full max-w-lg bg-white rounded-3xl border border-slate-200 shadow-xl p-8 sm:p-12 text-center space-y-8 overflow-hidden">
        
        {/* Subtle decorative glow */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-sky-100 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-teal-100 rounded-full blur-3xl pointer-events-none" />

        {/* Big Checkmark Circle matching Reference Screen 7 */}
        <div className="relative mx-auto w-24 h-24 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/25">
          <div className="w-20 h-20 rounded-full border-2 border-white/40 flex items-center justify-center">
            <Check className="w-12 h-12 text-white stroke-[3]" />
          </div>
        </div>

        {/* Headline */}
        <div className="space-y-2">
          <h1 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
            Order Placed Successfully!
          </h1>
          <p className="text-sm font-semibold text-sky-700">
            Order ID: #{order.id} • Pickup: {order.pickupNumber}
          </p>
          <p className="text-xs text-slate-500 max-w-xs mx-auto">
            Your kitchen order has been registered and dispatched to the prep station.
          </p>
        </div>

        {/* Estimated Ready Time Box matching Reference Screen 7 */}
        <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-center gap-2 text-sky-700 text-xs font-bold uppercase tracking-wider">
            <Clock className="w-4 h-4" />
            <span>Estimated Ready Time</span>
          </div>
          <p className="text-3xl font-bold text-slate-900 font-serif-luxury">
            {order.estimatedReadyMinutes.min} – {order.estimatedReadyMinutes.max} minutes
          </p>
          <p className="text-xs text-slate-500">
            Expected ready around <span className="text-sky-700 font-semibold">{order.estimatedReadyTime}</span>
          </p>
        </div>

        {/* CTA Buttons matching Reference Screen 7 */}
        <div className="space-y-3 pt-2">
          <button
            onClick={() => onTrackOrder(order.id)}
            className="w-full py-4 px-6 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-base shadow-md shadow-sky-600/20 flex items-center justify-center gap-2 transition-transform active:scale-95"
          >
            <span>Track Your Order</span>
            <ArrowRight className="w-5 h-5" />
          </button>

          <button
            onClick={onContinueBrowsing}
            className="w-full py-3 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
          >
            Continue Browsing
          </button>
        </div>

      </div>
    </div>
  );
};
