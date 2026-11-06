import React, { useState, useMemo } from 'react';
import { 
  Calendar, 
  ChevronRight, 
  ArrowUpRight, 
  Package, 
  Layers, 
  AlertTriangle, 
  LogOut 
} from 'lucide-react';
import { useCafe } from '../context/CafeContext';

interface AdminDashboardProps {
  onNavigate: (tab: string, param?: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate }) => {
  const { orders, inventory, unreadAlertsCount, logout } = useCafe();

  const [dateRange, setDateRange] = useState<'today' | '7days' | '30days'>('today');

  // Compute metrics based on date range and orders
  const metrics = useMemo(() => {
    const multiplier = dateRange === 'today' ? 1 : dateRange === '7days' ? 6.8 : 26.5;
    const baseOrders = 342;
    const liveOrdersCount = orders.length - 5;
    const totalOrders = Math.round((baseOrders + Math.max(0, liveOrdersCount)) * (dateRange === 'today' ? 1 : multiplier));
    
    const baseRev = 18920;
    const liveRev = orders.slice(0, Math.max(0, liveOrdersCount)).reduce((sum, o) => sum + o.totalAmount, 0);
    const totalRev = Math.round((baseRev + liveRev) * (dateRange === 'today' ? 1 : multiplier));
    
    const aov = Math.round(totalRev / Math.max(1, totalOrders));
    const lowStockCount = inventory.filter(i => i.currentStock <= i.reorderPoint).length;

    return {
      totalOrders,
      totalRev,
      aov,
      lowStockCount
    };
  }, [orders, inventory, dateRange]);

  // SVG Chart points for 8AM - 8PM
  const trendPoints = [
    { hour: '8 AM', orders: 18, x: 20, y: 150 },
    { hour: '10 AM', orders: 42, x: 100, y: 110 },
    { hour: '12 PM', orders: 58, x: 180, y: 70 },
    { hour: '2 PM', orders: 62, x: 260, y: 55 },
    { hour: '4 PM', orders: 48, x: 340, y: 95 },
    { hour: '6 PM', orders: 36, x: 420, y: 125 },
    { hour: '8 PM', orders: 22, x: 500, y: 145 }
  ];

  const svgPathD = "M 20 150 C 60 140, 70 115, 100 110 C 140 100, 150 75, 180 70 C 210 65, 230 55, 260 55 C 290 55, 320 90, 340 95 C 370 100, 400 120, 420 125 C 450 130, 480 140, 500 145";
  const svgFillD = `${svgPathD} L 500 190 L 20 190 Z`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* 1. Header & Navigation Shortcuts */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-slate-900">
              Cafeteria Management Hub
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-sky-50 text-sky-700 font-bold border border-sky-200">
              Admin Console
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Operational governance, revenue velocity, inventory reorder recommendations, and menu catalog
          </p>
        </div>

        {/* Date Filter & Quick Page Links */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 bg-white px-3 py-2 rounded-xl border border-slate-200 text-xs shadow-xs">
            <Calendar className="w-3.5 h-3.5 text-sky-600" />
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value as any)}
              className="bg-transparent text-slate-800 font-semibold focus:outline-none cursor-pointer"
            >
              <option value="today">Today (24 Oct)</option>
              <option value="7days">Last 7 Days</option>
              <option value="30days">Last 30 Days</option>
            </select>
          </div>

          <button
            onClick={() => onNavigate('inventory')}
            className="px-3 py-2 rounded-xl bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 border border-slate-200 shadow-xs flex items-center gap-1.5"
          >
            <Package className="w-3.5 h-3.5 text-sky-600" />
            <span>Inventory</span>
          </button>

          <button
            onClick={() => onNavigate('menu_mgmt')}
            className="px-3 py-2 rounded-xl bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 border border-slate-200 shadow-xs flex items-center gap-1.5"
          >
            <Layers className="w-3.5 h-3.5 text-sky-600" />
            <span>Menu Catalog</span>
          </button>

          <button
            onClick={() => onNavigate('alerts')}
            className="px-3 py-2 rounded-xl bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 border border-slate-200 shadow-xs flex items-center gap-1.5 relative"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
            <span>Alerts</span>
            {unreadAlertsCount > 0 && (
              <span className="w-2 h-2 rounded-full bg-rose-500 ml-1" />
            )}
          </button>

          <button
            onClick={() => {
              logout();
              onNavigate('admin_login');
            }}
            className="px-3 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-1.5 transition-colors"
            title="Log out of Admin Console"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* 2. Top 4 KPI Cards matching Reference Screen 10 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        
        {/* Total Orders */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm relative overflow-hidden group">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="uppercase font-bold tracking-wider">Total Orders</span>
            <span className="text-emerald-700 font-bold flex items-center gap-0.5">
              <ArrowUpRight className="w-3.5 h-3.5" /> 12%
            </span>
          </div>
          <p className="text-3xl font-serif-luxury font-bold text-slate-900 mt-2">
            {metrics.totalOrders.toLocaleString()}
          </p>
          <p className="text-[11px] text-slate-400 mt-1">
            +38 vs previous comparable period
          </p>
        </div>

        {/* Total Revenue */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm relative overflow-hidden group">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="uppercase font-bold tracking-wider">Total Revenue</span>
            <span className="text-emerald-700 font-bold flex items-center gap-0.5">
              <ArrowUpRight className="w-3.5 h-3.5" /> 8%
            </span>
          </div>
          <p className="text-3xl font-serif-luxury font-bold text-sky-700 mt-2">
            ₹{metrics.totalRev.toLocaleString()}
          </p>
          <p className="text-[11px] text-slate-400 mt-1">
            Gross sales processed through cafeteria counter
          </p>
        </div>

        {/* Average Order Value */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm relative overflow-hidden group">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="uppercase font-bold tracking-wider">Avg. Order Value</span>
            <span className="text-emerald-700 font-bold flex items-center gap-0.5">
              <ArrowUpRight className="w-3.5 h-3.5" /> 5%
            </span>
          </div>
          <p className="text-3xl font-serif-luxury font-bold text-slate-900 mt-2">
            ₹{metrics.aov}
          </p>
          <p className="text-[11px] text-slate-400 mt-1">
            Boosted by combo add-ons and beverages
          </p>
        </div>

        {/* Low Stock Items */}
        <div className="bg-white rounded-3xl p-6 border border-amber-200 shadow-sm relative overflow-hidden group">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="uppercase font-bold tracking-wider text-amber-800">Low Stock SKUs</span>
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-3xl font-serif-luxury font-bold text-amber-700 mt-2">
            {metrics.lowStockCount}
          </p>
          <button
            onClick={() => onNavigate('alerts')}
            className="text-[11px] font-bold text-sky-600 hover:underline mt-1 block"
          >
            View Inventory Alerts →
          </button>
        </div>

      </div>

      {/* 3. Middle Row: Order Trends Area Chart + Category Donut Chart matching Screen 10 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left (2 Spans): Order Trends Chart with Peak Marker matching Reference Screen 10 */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="font-serif-luxury text-xl font-bold text-slate-900">
                Order Trends
              </h2>
              <p className="text-xs text-slate-500">
                Hourly dining room and counter volume
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="px-2.5 py-1 rounded-lg bg-sky-50 border border-sky-200 text-sky-700 font-semibold">
                Peak: 62 orders at 2:00 PM
              </span>
            </div>
          </div>

          {/* Responsive SVG Area Chart */}
          <div className="relative w-full h-56 pt-4">
            <svg viewBox="0 0 520 200" className="w-full h-full overflow-visible">
              <defs>
                <linearGradient id="areaGradientLight" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0284C7" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#0284C7" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              <line x1="20" y1="50" x2="500" y2="50" stroke="#E2E8F0" strokeDasharray="4 4" />
              <line x1="20" y1="100" x2="500" y2="100" stroke="#E2E8F0" strokeDasharray="4 4" />
              <line x1="20" y1="150" x2="500" y2="150" stroke="#E2E8F0" strokeDasharray="4 4" />

              {/* Filled Area */}
              <path d={svgFillD} fill="url(#areaGradientLight)" />

              {/* Stroke line */}
              <path d={svgPathD} fill="none" stroke="#0284C7" strokeWidth="3" />

              {/* Data points */}
              {trendPoints.map((pt, i) => (
                <g key={i}>
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r={i === 3 ? 6 : 4}
                    fill={i === 3 ? '#0284C7' : '#0EA5E9'}
                    stroke="#FFFFFF"
                    strokeWidth="2"
                  />
                  {/* Peak label indicator */}
                  {i === 3 && (
                    <g transform={`translate(${pt.x - 55}, ${pt.y - 32})`}>
                      <rect width="110" height="24" rx="6" fill="#0F172A" />
                      <text x="55" y="16" fill="#FFFFFF" fontSize="10" fontWeight="bold" textAnchor="middle">
                        Peak: 62 orders 2:00 PM
                      </text>
                    </g>
                  )}
                  {/* X Axis label */}
                  <text x={pt.x} y="185" fill="#64748B" fontSize="10" textAnchor="middle">
                    {pt.hour}
                  </text>
                </g>
              ))}
            </svg>
          </div>

          <div className="flex justify-between items-center text-xs text-slate-500 pt-2 border-t border-slate-100">
            <span>Lunch peak covers 12:30 PM - 2:30 PM</span>
            <span className="text-sky-700 font-medium">Evening snack rush starts at 4:30 PM</span>
          </div>
        </div>

        {/* Right (1 Span): Category Distribution Donut Chart matching Screen 10 */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
          <div className="pb-3 border-b border-slate-100">
            <h2 className="font-serif-luxury text-xl font-bold text-slate-900">
              Category Distribution
            </h2>
            <p className="text-xs text-slate-500">
              Share of total cafeteria orders
            </p>
          </div>

          {/* SVG Donut Chart with segmented circles */}
          <div className="flex flex-col sm:flex-row items-center justify-around gap-6 my-auto">
            <div className="relative w-36 h-36 shrink-0">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                {/* 35% South Indian */}
                <circle cx="50" cy="50" r="38" fill="none" stroke="#0284C7" strokeWidth="16"
                  strokeDasharray="83.5 238.7" strokeDashoffset="0" />
                {/* 22% Snacks */}
                <circle cx="50" cy="50" r="38" fill="none" stroke="#0D9488" strokeWidth="16"
                  strokeDasharray="52.5 238.7" strokeDashoffset="-83.5" />
                {/* 18% Beverages */}
                <circle cx="50" cy="50" r="38" fill="none" stroke="#38BDF8" strokeWidth="16"
                  strokeDasharray="43 238.7" strokeDashoffset="-136" />
                {/* 15% North Indian */}
                <circle cx="50" cy="50" r="38" fill="none" stroke="#10B981" strokeWidth="16"
                  strokeDasharray="35.8 238.7" strokeDashoffset="-179" />
                {/* 10% Desserts */}
                <circle cx="50" cy="50" r="38" fill="none" stroke="#F43F5E" strokeWidth="16"
                  strokeDasharray="24 238.7" strokeDashoffset="-214.8" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-lg font-bold text-slate-900">100%</span>
                <span className="text-[9px] uppercase tracking-wider text-sky-700 font-semibold">Demand</span>
              </div>
            </div>

            {/* Legend matching Screen 10 */}
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#0284C7]" />
                <span className="text-slate-700">South Indian</span>
                <span className="font-bold text-slate-900 ml-auto">35%</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#0D9488]" />
                <span className="text-slate-700">Snacks</span>
                <span className="font-bold text-slate-900 ml-auto">22%</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#38BDF8]" />
                <span className="text-slate-700">Beverages</span>
                <span className="font-bold text-slate-900 ml-auto">18%</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#10B981]" />
                <span className="text-slate-700">North Indian</span>
                <span className="font-bold text-slate-900 ml-auto">15%</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#F43F5E]" />
                <span className="text-slate-700">Desserts</span>
                <span className="font-bold text-slate-900 ml-auto">10%</span>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500">
            South Indian and Hot Snacks constitute over 57% of daily cafeteria transactions.
          </div>
        </div>

      </div>

      {/* 4. Bottom Row: Top Selling Items matching Reference Screen 10 */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h2 className="font-serif-luxury text-xl font-bold text-slate-900">
              Top Selling Items
            </h2>
            <p className="text-xs text-slate-500">
              Ranked by transaction volume today
            </p>
          </div>
          <button
            onClick={() => onNavigate('menu_mgmt')}
            className="text-xs font-bold text-sky-600 hover:text-sky-800 flex items-center gap-1"
          >
            <span>Manage All Items</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* 3 cards matching Screen 10 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Item 1: Masala Dosa */}
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200 shadow-xs">
            <div className="w-8 h-8 rounded-full bg-sky-600 text-white font-bold text-sm flex items-center justify-center shrink-0">
              1
            </div>
            <img
              src="https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=200&q=80"
              alt="Masala Dosa"
              className="w-14 h-14 rounded-xl object-cover shrink-0 border border-slate-200"
            />
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-slate-900 text-sm truncate">Masala Dosa</h4>
              <p className="text-xs text-sky-700 font-semibold mt-0.5">86 orders today</p>
              <p className="text-[11px] text-slate-500">Revenue: ₹5,160</p>
            </div>
          </div>

          {/* Item 2: Filter Coffee */}
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200 shadow-xs">
            <div className="w-8 h-8 rounded-full bg-white text-sky-700 font-bold text-sm flex items-center justify-center shrink-0 border border-slate-200">
              2
            </div>
            <img
              src="https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=200&q=80"
              alt="Filter Coffee"
              className="w-14 h-14 rounded-xl object-cover shrink-0 border border-slate-200"
            />
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-slate-900 text-sm truncate">Filter Coffee</h4>
              <p className="text-xs text-sky-700 font-semibold mt-0.5">64 orders today</p>
              <p className="text-[11px] text-slate-500">Revenue: ₹1,600</p>
            </div>
          </div>

          {/* Item 3: Veg Sandwich */}
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200 shadow-xs">
            <div className="w-8 h-8 rounded-full bg-white text-sky-700 font-bold text-sm flex items-center justify-center shrink-0 border border-slate-200">
              3
            </div>
            <img
              src="https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=200&q=80"
              alt="Veg Sandwich"
              className="w-14 h-14 rounded-xl object-cover shrink-0 border border-slate-200"
            />
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-slate-900 text-sm truncate">Veg Sandwich</h4>
              <p className="text-xs text-sky-700 font-semibold mt-0.5">52 orders today</p>
              <p className="text-[11px] text-slate-500">Revenue: ₹2,600</p>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};
