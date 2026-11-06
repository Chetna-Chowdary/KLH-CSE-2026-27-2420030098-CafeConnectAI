import React from 'react';
import { 
  ArrowRight, 
  RotateCcw
} from 'lucide-react';
import { useCafe } from '../context/CafeContext';
import { Order } from '../types';

interface OrderHistoryPageProps {
  onNavigate: (tab: string, param?: string) => void;
  onTrackOrder: (orderId: string) => void;
}

export const OrderHistoryPage: React.FC<OrderHistoryPageProps> = ({
  onNavigate,
  onTrackOrder
}) => {
  const { orders, addToCart, menuItems } = useCafe();

  const handleReorder = (order: Order) => {
    order.items.forEach(orderItem => {
      const item = menuItems.find(m => m.id === orderItem.menuItemId);
      if (item && item.isAvailable) {
        addToCart(item, orderItem.quantity, orderItem.customization);
      }
    });
    onNavigate('cart');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* 1. Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-slate-900">
              Order History & Receipts
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-sky-50 text-sky-700 font-bold border border-sky-200">
              {orders.length} Past Orders
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Persisted session receipts with one-click reordering and pickup verification
          </p>
        </div>

        <button
          onClick={() => onNavigate('menu')}
          className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-xs transition-transform active:scale-95"
        >
          New Order
        </button>
      </div>

      {/* 2. Orders list */}
      <div className="space-y-4">
        {orders.map((order) => {
          const isCompleted = order.status === 'completed';
          const isCancelled = order.status === 'cancelled';

          return (
            <div
              key={order.id}
              className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4 hover:border-sky-300 transition-colors"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-serif-luxury font-bold text-lg text-slate-900">
                      Order #{order.id}
                    </span>
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-100 text-sky-700 border border-slate-200 font-bold">
                      {order.pickupNumber}
                    </span>
                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${
                      isCompleted 
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : isCancelled 
                        ? 'bg-rose-50 text-rose-700 border-rose-200'
                        : 'bg-sky-50 text-sky-700 border-sky-200'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Placed at {order.createdAt} • Name: {order.customerName} ({order.rollNumber})
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-xl font-bold font-serif-luxury text-slate-900">
                    ₹{order.totalAmount}
                  </span>
                  <p className="text-[10px] text-slate-400 capitalize">
                    {order.paymentMethod.replace('_', ' ')}
                  </p>
                </div>
              </div>

              {/* Items summary */}
              <div className="space-y-1.5">
                {order.items.map(item => (
                  <div key={item.id} className="flex justify-between text-xs text-slate-600">
                    <span>
                      {item.name} <strong className="text-slate-900">×{item.quantity}</strong>
                      {item.customization?.chutney && ` (${item.customization.chutney})`}
                    </span>
                    <span className="font-mono text-slate-800">₹{item.subtotal}</span>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => onTrackOrder(order.id)}
                  className="text-xs font-bold text-sky-600 hover:text-sky-800 flex items-center gap-1"
                >
                  <span>View Live Tracker</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => handleReorder(order)}
                  className="px-4 py-1.5 rounded-xl bg-slate-100 hover:bg-sky-50 hover:text-sky-700 text-slate-700 border border-slate-200 font-bold text-xs flex items-center gap-1.5 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reorder Items</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
