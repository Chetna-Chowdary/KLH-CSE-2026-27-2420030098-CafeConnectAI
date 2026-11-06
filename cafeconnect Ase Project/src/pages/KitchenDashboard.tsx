import React, { useState, useMemo } from 'react';
import { 
  ChefHat, 
  Clock, 
  Pause, 
  Play, 
  LogOut, 
  AlertTriangle 
} from 'lucide-react';
import { useCafe } from '../context/CafeContext';
import { KitchenStationId, Order, OrderStatus } from '../types';

interface KitchenDashboardProps {
  onNavigate: (tab: string, param?: string) => void;
}

export const KitchenDashboard: React.FC<KitchenDashboardProps> = ({ onNavigate }) => {
  const { 
    orders, 
    stations, 
    updateOrderStatus, 
    flagOrderDelay, 
    toggleStationPause, 
    logout,
    currentSimulatedTime 
  } = useCafe();

  const [activeTab, setActiveTab] = useState<'all' | 'placed' | 'preparing' | 'ready' | 'completed'>('all');
  const [stationFilter, setStationFilter] = useState<string>('all');
  const [delayModalOrder, setDelayModalOrder] = useState<Order | null>(null);
  const [delayReason, setDelayReason] = useState('Dosa griddle heating batch');

  // Counts for top cards matching Reference Screen 9
  const newOrdersCount = orders.filter(o => o.status === 'placed').length;
  const preparingCount = orders.filter(o => o.status === 'preparing' || o.status === 'accepted').length;
  const readyCount = orders.filter(o => o.status === 'ready').length;
  const completedCount = orders.filter(o => o.status === 'completed').length;

  // Filter orders
  const filteredOrders = useMemo(() => {
    let result = [...orders];

    if (activeTab === 'placed') {
      result = result.filter(o => o.status === 'placed');
    } else if (activeTab === 'preparing') {
      result = result.filter(o => o.status === 'preparing' || o.status === 'accepted');
    } else if (activeTab === 'ready') {
      result = result.filter(o => o.status === 'ready');
    } else if (activeTab === 'completed') {
      result = result.filter(o => o.status === 'completed');
    } else {
      result = result.filter(o => o.status !== 'completed' && o.status !== 'cancelled');
    }

    if (stationFilter !== 'all') {
      result = result.filter(o => o.items.some(i => i.stationId === stationFilter));
    }

    return result;
  }, [orders, activeTab, stationFilter]);

  const handleAction = (order: Order) => {
    if (order.status === 'placed') {
      updateOrderStatus(order.id, 'accepted', 'Order accepted by Kitchen Staff');
    } else if (order.status === 'accepted') {
      updateOrderStatus(order.id, 'preparing', 'Preparation started at station');
    } else if (order.status === 'preparing') {
      updateOrderStatus(order.id, 'ready', 'Plated and ready for pickup');
    } else if (order.status === 'ready') {
      updateOrderStatus(order.id, 'completed', 'Order collected by student');
    }
  };

  const getActionButtonLabel = (status: OrderStatus) => {
    switch (status) {
      case 'placed': return 'Accept';
      case 'accepted': return 'Start Prep';
      case 'preparing': return 'Mark Ready';
      case 'ready': return 'Complete';
      default: return 'Completed';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* 1. Top Metrics Bar matching Reference Screen 9 */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-serif-luxury text-2xl font-bold text-slate-900">
              Kitchen Operations Hub
            </span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-sky-50 text-sky-700 font-bold border border-sky-200">
              Live Queue Authoritative
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Logged in as Chef Ramesh Kumar • Real-time dispatch and station load
          </p>
        </div>

        {/* Live Metrics Pills */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="px-3.5 py-2 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 flex items-center gap-2">
            <span className="text-base font-bold">{newOrdersCount}</span>
            <span className="text-xs font-semibold">New Orders</span>
          </div>

          <div className="px-3.5 py-2 rounded-2xl bg-sky-50 border border-sky-200 text-sky-800 flex items-center gap-2">
            <span className="text-base font-bold">{preparingCount}</span>
            <span className="text-xs font-semibold">Preparing</span>
          </div>

          <div className="px-3.5 py-2 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-2">
            <span className="text-base font-bold">{readyCount}</span>
            <span className="text-xs font-semibold">Ready for Pickup</span>
          </div>

          <div className="px-3.5 py-2 rounded-2xl bg-white border border-slate-200 text-slate-800 flex items-center gap-2 shadow-xs">
            <span className="text-base font-bold text-sky-700">{completedCount + 18}</span>
            <span className="text-xs font-semibold text-slate-600">Completed Today</span>
          </div>

          <div className="px-3.5 py-2 rounded-2xl bg-slate-100 border border-slate-200 text-xs font-mono text-slate-700 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-sky-600" />
            <span>{currentSimulatedTime} Mon, 24 Oct</span>
          </div>

          <button
            onClick={() => {
              logout();
              onNavigate('kitchen_login');
            }}
            className="px-3 py-2 rounded-2xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            title="Log out of Kitchen Portal"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* 2. Main Grid: Queue Table (Left) + Station Load (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left Column (3 spans): Live Orders Queue */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Station Filter Tabs matching Screen 9 */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-2 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto scrollbar-none">
              {[
                { id: 'all', label: 'All Orders', count: orders.filter(o => o.status !== 'completed' && o.status !== 'cancelled').length },
                { id: 'dosa_breakfast', label: 'Dosa Station', count: orders.filter(o => o.items.some(i => i.stationId === 'dosa_breakfast') && o.status !== 'completed').length },
                { id: 'beverages', label: 'Beverages', count: orders.filter(o => o.items.some(i => i.stationId === 'beverages') && o.status !== 'completed').length },
                { id: 'snacks_frying', label: 'Snacks', count: orders.filter(o => o.items.some(i => i.stationId === 'snacks_frying') && o.status !== 'completed').length },
                { id: 'packaged_pickup', label: 'Packaged Pick', count: orders.filter(o => o.items.some(i => i.stationId === 'packaged_pickup') && o.status !== 'completed').length }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setStationFilter(tab.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                    stationFilter === tab.id
                      ? 'bg-sky-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    stationFilter === tab.id ? 'bg-sky-700 text-white' : 'bg-slate-100 text-slate-700'
                  }`}>
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>

            {/* Quick Status Sub-Filter */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs self-end sm:self-auto">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-2.5 py-1 rounded-lg font-semibold ${activeTab === 'all' ? 'bg-sky-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
              >
                Active
              </button>
              <button
                onClick={() => setActiveTab('ready')}
                className={`px-2.5 py-1 rounded-lg font-semibold ${activeTab === 'ready' ? 'bg-sky-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
              >
                Ready
              </button>
              <button
                onClick={() => setActiveTab('completed')}
                className={`px-2.5 py-1 rounded-lg font-semibold ${activeTab === 'completed' ? 'bg-sky-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
              >
                History
              </button>
            </div>
          </div>

          {/* Table Container matching Reference Screen 9 */}
          <div className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-[11px] uppercase font-bold tracking-wider text-slate-700">
                    <th className="py-3.5 px-4"># Order</th>
                    <th className="py-3.5 px-4">Items & Details</th>
                    <th className="py-3.5 px-4">Time Placed</th>
                    <th className="py-3.5 px-4">Wait Time</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs text-slate-800">
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-12 text-slate-400">
                        No active orders in this queue. Kitchen is clear!
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((order) => {
                      const isReady = order.status === 'ready';
                      const isPreparing = order.status === 'preparing' || order.status === 'accepted';
                      const isNew = order.status === 'placed';

                      return (
                        <tr key={order.id} className="hover:bg-slate-50/80 transition-colors">
                          {/* Order ID & Pickup */}
                          <td className="py-4 px-4 font-mono font-bold text-slate-900">
                            <div>#{order.id}</div>
                            <span className="text-[10px] text-sky-700 font-semibold">Pickup: {order.pickupNumber}</span>
                          </td>

                          {/* Items */}
                          <td className="py-4 px-4">
                            <div className="font-semibold text-slate-900">
                              {order.items.map(i => `${i.name} x${i.quantity}`).join(', ')}
                            </div>
                            <div className="text-[11px] text-slate-500 mt-0.5">
                              Customer: {order.customerName} ({order.rollNumber})
                            </div>
                            {order.specialInstructions && (
                              <div className="text-[10px] text-amber-700 italic mt-0.5">
                                Note: {order.specialInstructions}
                              </div>
                            )}
                          </td>

                          {/* Time */}
                          <td className="py-4 px-4 font-mono text-slate-500">
                            {order.createdAt}
                          </td>

                          {/* Wait Time */}
                          <td className="py-4 px-4">
                            <span className="font-bold text-sky-700">
                              {order.estimatedReadyMinutes.min} – {order.estimatedReadyMinutes.max} mins
                            </span>
                            {order.isDelayed && (
                              <span className="block text-[10px] text-amber-600 font-semibold">
                                Delayed
                              </span>
                            )}
                          </td>

                          {/* Status Badge matching Screen 9 */}
                          <td className="py-4 px-4">
                            <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border inline-block ${
                              isNew
                                ? 'bg-amber-50 text-amber-700 border-amber-200'
                                : isPreparing
                                ? 'bg-sky-50 text-sky-700 border-sky-200'
                                : isReady
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : 'bg-slate-100 text-slate-600 border-slate-200'
                            }`}>
                              {order.status === 'placed' ? 'New Order' : order.status}
                            </span>
                          </td>

                          {/* Action Buttons matching Screen 9 */}
                          <td className="py-4 px-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              {order.status !== 'completed' && order.status !== 'cancelled' && (
                                <>
                                  <button
                                    onClick={() => handleAction(order)}
                                    className={`px-3 py-1.5 rounded-xl font-bold text-xs shadow-xs transition-all active:scale-95 ${
                                      isNew 
                                        ? 'bg-sky-600 hover:bg-sky-700 text-white' 
                                        : isPreparing 
                                        ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                                        : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                                    }`}
                                  >
                                    {getActionButtonLabel(order.status)}
                                  </button>

                                  <button
                                    onClick={() => setDelayModalOrder(order)}
                                    className="p-1.5 rounded-xl bg-slate-100 hover:bg-amber-50 text-amber-700 border border-slate-200"
                                    title="Flag Delay on Order"
                                  >
                                    <AlertTriangle className="w-3.5 h-3.5" />
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* Right Column (1 span): Station Load Panel matching Reference Screen 9 */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-serif-luxury text-lg font-bold text-slate-900 flex items-center gap-2">
                <ChefHat className="w-5 h-5 text-sky-600" />
                <span>Station Load</span>
              </h3>
              <span className="text-[10px] text-emerald-700 font-mono font-bold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">LIVE SYNC</span>
            </div>

            <div className="space-y-5">
              {(Object.keys(stations) as KitchenStationId[]).map(sId => {
                const s = stations[sId];
                const isOverloaded = s.currentWorkloadPercent > 80;

                return (
                  <div key={s.id} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-900 text-xs">{s.name}</span>
                      <span className={`font-mono text-xs font-bold ${
                        isOverloaded ? 'text-rose-600' : 'text-sky-700'
                      }`}>
                        {s.currentWorkloadPercent}%
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-500 ${
                          s.isPaused 
                            ? 'bg-slate-400' 
                            : isOverloaded 
                            ? 'bg-rose-500' 
                            : 'bg-sky-500'
                        }`}
                        style={{ width: `${s.currentWorkloadPercent}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                      <span>{s.inQueueCount} in queue (~{s.inQueueCount * s.avgPreparationMinutes} mins)</span>
                      
                      {/* Pause / Resume Station Control */}
                      <button
                        onClick={() => toggleStationPause(s.id)}
                        className={`p-1 rounded-md border flex items-center gap-1 text-[10px] ${
                          s.isPaused 
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-300' 
                            : 'bg-white text-slate-700 border-slate-200 hover:border-sky-300'
                        }`}
                        title={s.isPaused ? 'Resume Station' : 'Pause Station'}
                      >
                        {s.isPaused ? (
                          <>
                            <Play className="w-3 h-3 text-emerald-600" />
                            <span>Resume</span>
                          </>
                        ) : (
                          <>
                            <Pause className="w-3 h-3 text-amber-600" />
                            <span>Pause</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-2 text-[11px] text-slate-400 leading-relaxed border-t border-slate-100">
              * Station workload recalculates instantly across active tickets to prevent student queue bottlenecks.
            </div>
          </div>
        </div>

      </div>

      {/* Delay Advisory Modal */}
      {delayModalOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full border border-slate-200 shadow-xl space-y-4">
            <h3 className="font-serif-luxury text-lg font-bold text-slate-900 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              <span>Broadcast Prep Delay</span>
            </h3>
            <p className="text-xs text-slate-600">
              Order #{delayModalOrder.id} will be updated with an additional 8–10 minute buffer and the customer will see an advisory notice.
            </p>
            <div>
              <label className="block text-[11px] uppercase font-bold text-slate-700 mb-1">
                Delay Reason
              </label>
              <select
                value={delayReason}
                onChange={(e) => setDelayReason(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs"
              >
                <option value="Dosa griddle heating batch">Dosa griddle heating batch</option>
                <option value="Ingredient restock in progress">Ingredient restock in progress</option>
                <option value="Peak lunchtime rush on fryers">Peak lunchtime rush on fryers</option>
                <option value="Order customized with extra items">Order customized with extra items</option>
              </select>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setDelayModalOrder(null)}
                className="flex-1 py-2 rounded-xl bg-slate-100 text-xs font-semibold text-slate-700 hover:bg-slate-200"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  flagOrderDelay(delayModalOrder.id, delayReason);
                  setDelayModalOrder(null);
                }}
                className="flex-1 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-xs font-bold text-white shadow-xs"
              >
                Notify Student
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
