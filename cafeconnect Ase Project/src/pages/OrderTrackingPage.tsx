import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Clock, 
  Check, 
  AlertTriangle, 
  Bell, 
  XCircle
} from 'lucide-react';
import { useCafe } from '../context/CafeContext';
import { OrderStatus } from '../types';

interface OrderTrackingPageProps {
  orderId?: string;
  onNavigate: (tab: string, param?: string) => void;
}

export const OrderTrackingPage: React.FC<OrderTrackingPageProps> = ({ 
  orderId, 
  onNavigate 
}) => {
  const { orders, activeOrder, cancelOrder, menuItems } = useCafe();

  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('Changed mind');

  // Find target order
  const targetOrder = (orderId ? orders.find(o => o.id === orderId) : null) || activeOrder || orders[0];

  if (!targetOrder) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-serif-luxury text-2xl font-bold text-slate-900">No active order found</h2>
        <p className="text-xs text-slate-500">Place an order to track live preparation status.</p>
        <button
          onClick={() => onNavigate('menu')}
          className="px-6 py-3 rounded-xl bg-sky-600 text-white font-bold text-xs shadow-xs"
        >
          Browse Menu
        </button>
      </div>
    );
  }

  const steps: { key: OrderStatus; label: string; subtext: string }[] = [
    { key: 'placed', label: 'Order Received', subtext: targetOrder.createdAt },
    { key: 'accepted', label: 'Accepted', subtext: 'Dispatched to station' },
    { key: 'preparing', label: 'Preparing', subtext: 'In Kitchen Queue' },
    { key: 'ready', label: 'Ready for Pickup', subtext: "We'll notify you" },
    { key: 'completed', label: 'Completed', subtext: 'Collected at counter' }
  ];

  const getStepIndex = (status: OrderStatus) => {
    switch (status) {
      case 'placed': return 0;
      case 'accepted': return 1;
      case 'preparing': return 2;
      case 'ready': return 3;
      case 'completed': return 4;
      default: return 0;
    }
  };

  const currentStepIndex = getStepIndex(targetOrder.status);
  const isCancelled = targetOrder.status === 'cancelled';
  const canCancel = targetOrder.status === 'placed' || targetOrder.status === 'accepted';

  const handleConfirmCancel = () => {
    cancelOrder(targetOrder.id, cancelReason);
    setCancelModalOpen(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      
      {/* 1. Header Navigation & Order ID matching Reference Screen 8 */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <button
            onClick={() => onNavigate('menu')}
            className="flex items-center gap-1.5 text-xs font-semibold text-sky-600 hover:text-sky-800 mb-1.5 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Menu</span>
          </button>
          
          <div className="flex items-center gap-3">
            <h1 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-slate-900">
              Order #{targetOrder.id}
            </h1>
            <span className="text-xs px-2.5 py-1 rounded-lg bg-sky-50 text-sky-700 font-bold border border-sky-200 font-mono">
              Pickup: {targetOrder.pickupNumber}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Placed at {targetOrder.createdAt} • For {targetOrder.customerName} ({targetOrder.rollNumber})
          </p>
        </div>

        {/* Estimated Ready in badge */}
        {!isCancelled && targetOrder.status !== 'completed' && (
          <div className="bg-white px-4 py-2.5 rounded-2xl border border-slate-200 flex items-center gap-3 shadow-xs">
            <div className="w-9 h-9 rounded-xl bg-sky-50 flex items-center justify-center text-sky-600">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] text-slate-500">Estimated Ready in</p>
              <p className="text-sm font-bold text-sky-700">
                {targetOrder.estimatedReadyMinutes.min} – {targetOrder.estimatedReadyMinutes.max} mins
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Delay notice banner if flagged by kitchen staff */}
      {targetOrder.isDelayed && !isCancelled && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
          <div>
            <p className="font-bold text-amber-900">Preparation Advisory from Kitchen Staff</p>
            <p className="text-amber-800 mt-0.5">
              {targetOrder.delayReason || 'High volume rush at Dosa station. Preparation extended by ~8 mins.'}
            </p>
          </div>
        </div>
      )}

      {/* Cancelled notice banner */}
      {isCancelled && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-3">
          <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <div>
            <p className="font-bold text-rose-900">Order Cancelled</p>
            <p className="text-rose-700 mt-0.5">
              This order was cancelled. Any amount paid at counter is not due.
            </p>
          </div>
        </div>
      )}

      {/* 2. Order Progression Stepper matching Reference Screen 8 */}
      {!isCancelled && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
          <div className="relative flex items-center justify-between">
            
            {/* Background connection line */}
            <div className="absolute top-4 left-6 right-6 h-0.5 bg-slate-100 z-0" />
            
            {/* Active progress bar */}
            <div 
              className="absolute top-4 left-6 h-0.5 bg-gradient-to-r from-emerald-500 to-sky-600 z-0 transition-all duration-700"
              style={{ width: `${(currentStepIndex / (steps.length - 1)) * 90}%` }}
            />

            {steps.map((step, index) => {
              const isDone = index < currentStepIndex;
              const isCurrent = index === currentStepIndex;

              return (
                <div key={step.key} className="relative z-10 flex flex-col items-center text-center">
                  <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center transition-all ${
                    isDone 
                      ? 'bg-emerald-600 text-white shadow-xs' 
                      : isCurrent 
                      ? 'bg-sky-600 text-white ring-4 ring-sky-100 shadow-xs' 
                      : 'bg-white border border-slate-300 text-slate-400'
                  }`}>
                    {isDone ? (
                      <Check className="w-4 h-4 stroke-[3]" />
                    ) : isCurrent ? (
                      <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping" />
                    ) : (
                      <span className="text-xs font-bold">{index + 1}</span>
                    )}
                  </div>

                  <p className={`text-xs font-bold mt-2 ${
                    isCurrent ? 'text-sky-700 font-bold' : isDone ? 'text-slate-800' : 'text-slate-400'
                  }`}>
                    {step.label}
                  </p>
                  <p className="text-[10px] text-slate-500 hidden sm:block mt-0.5">
                    {step.subtext}
                  </p>
                </div>
              );
            })}

          </div>
        </div>
      )}

      {/* 3. Two-Column Layout: Order Items + Live Updates */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Left Column: Order Items */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100 flex items-center justify-between">
            <span>Order Items</span>
            <span className="text-xs font-semibold text-sky-700">
              Total: ₹{targetOrder.totalAmount}
            </span>
          </h2>

          <div className="space-y-3">
            {targetOrder.items.map((item) => {
              const menuItem = menuItems.find(m => m.id === item.menuItemId);
              return (
                <div 
                  key={item.id}
                  className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={menuItem?.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=200&q=80'}
                      alt={item.name}
                      className="w-12 h-12 rounded-xl object-cover border border-slate-200"
                    />
                    <div>
                      <h4 className="text-sm font-semibold text-slate-900">{item.name}</h4>
                      <p className="text-xs text-sky-700 font-medium">
                        x{item.quantity} • ₹{item.price} each
                      </p>
                      {item.customization?.chutney && (
                        <p className="text-[10px] text-slate-500">
                          {item.customization.chutney}
                        </p>
                      )}
                    </div>
                  </div>

                  <span className="font-bold text-slate-900 text-sm">
                    ₹{item.subtotal}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-between text-xs text-slate-600">
            <span>Payment Mode:</span>
            <span className="font-semibold text-slate-900 capitalize">
              {targetOrder.paymentMethod.replace('_', ' ')}
            </span>
          </div>
        </div>

        {/* Right Column: Live Updates Feed */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
          <div>
            <h2 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-sky-600" />
                Live Kitchen Updates
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </h2>

            <div className="mt-4 space-y-4">
              {targetOrder.statusHistory.map((hist, idx) => (
                <div key={idx} className="flex items-start gap-3 text-xs">
                  <div className="w-2 h-2 rounded-full bg-sky-600 mt-1.5 shrink-0" />
                  <div className="flex-1">
                    <div className="flex justify-between items-center text-slate-700">
                      <span className="font-bold text-slate-900 capitalize">{hist.status}</span>
                      <span className="font-mono text-[11px] text-sky-700">{hist.timestamp}</span>
                    </div>
                    {hist.note && (
                      <p className="text-slate-500 mt-0.5">{hist.note}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <p className="text-[11px] text-slate-400 mt-6 italic">
              * Screen updates automatically as kitchen staff accept and assemble items.
            </p>
          </div>

          {/* Cancellation Control matching Reference Screen 8 */}
          {canCancel && (
            <div className="pt-4 border-t border-slate-100">
              <button
                onClick={() => setCancelModalOpen(true)}
                className="w-full py-2.5 rounded-xl border border-rose-300 text-rose-600 hover:bg-rose-50 text-xs font-semibold transition-colors"
              >
                Cancel Order
              </button>
            </div>
          )}
        </div>

      </div>

      {/* Cancellation Confirmation Modal */}
      {cancelModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full border border-slate-200 shadow-xl space-y-4">
            <h3 className="font-serif-luxury text-lg font-bold text-slate-900">
              Cancel Order #{targetOrder.id}?
            </h3>
            <p className="text-xs text-slate-500">
              Kitchen staff have not yet plated your items. Are you sure you wish to cancel this order?
            </p>
            <div>
              <label className="block text-[11px] uppercase font-bold text-slate-700 mb-1">
                Reason for cancellation
              </label>
              <select
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs"
              >
                <option value="Changed mind">Changed mind</option>
                <option value="Long waiting time">Long waiting time</option>
                <option value="Ordered by mistake">Ordered by mistake</option>
                <option value="Leaving campus">Leaving campus</option>
              </select>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setCancelModalOpen(false)}
                className="flex-1 py-2 rounded-xl bg-slate-100 text-xs font-semibold text-slate-700 hover:bg-slate-200"
              >
                Keep Order
              </button>
              <button
                onClick={handleConfirmCancel}
                className="flex-1 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-xs font-bold text-white shadow-xs"
              >
                Confirm Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
