import React, { useState } from 'react';
import { 
  ArrowUpRight, 
  CheckCircle2 
} from 'lucide-react';

export const DetailedAnalyticsPage: React.FC = () => {
  const [range, setRange] = useState<'today' | '7d' | '30d'>('today');

  const hourlyData = [
    { hour: '8 AM', orders: 18, rev: 1080 },
    { hour: '9 AM', orders: 28, rev: 1680 },
    { hour: '10 AM', orders: 42, rev: 2520 },
    { hour: '11 AM', orders: 35, rev: 2100 },
    { hour: '12 PM', orders: 58, rev: 3480 },
    { hour: '1 PM', orders: 54, rev: 3240 },
    { hour: '2 PM', orders: 62, rev: 3720 },
    { hour: '3 PM', orders: 26, rev: 1560 },
    { hour: '4 PM', orders: 48, rev: 2880 },
    { hour: '5 PM', orders: 44, rev: 2640 },
    { hour: '6 PM', orders: 36, rev: 2160 },
    { hour: '7 PM', orders: 30, rev: 1800 },
    { hour: '8 PM', orders: 22, rev: 1320 }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* 1. Header & Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-slate-900">
              Operations & Sales Analytics
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-sky-50 text-sky-700 font-bold border border-sky-200">
              Executive Reporting
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time throughput metrics, gross sales velocity, preparation delay rates, and station efficiency
          </p>
        </div>

        {/* Range Selector */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-2xl border border-slate-200 text-xs">
          {(['today', '7d', '30d'] as const).map(t => (
            <button
              key={t}
              onClick={() => setRange(t)}
              className={`px-3.5 py-1.5 rounded-xl font-bold capitalize transition-all ${
                range === t ? 'bg-sky-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t === 'today' ? 'Today' : t === '7d' ? 'Last 7 Days' : 'Last 30 Days'}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Highlight Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Gross Sales</span>
          <p className="text-3xl font-serif-luxury font-bold text-sky-700 mt-2">₹18,920</p>
          <p className="text-[11px] text-emerald-700 mt-1 flex items-center gap-1 font-semibold">
            <ArrowUpRight className="w-3.5 h-3.5" /> +8.4% vs last Monday
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Avg. Prep Duration</span>
          <p className="text-3xl font-serif-luxury font-bold text-slate-900 mt-2">7.4 mins</p>
          <p className="text-[11px] text-emerald-700 mt-1 flex items-center gap-1 font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5" /> 94% within predicted wait
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Order Fulfillment Rate</span>
          <p className="text-3xl font-serif-luxury font-bold text-emerald-700 mt-2">98.2%</p>
          <p className="text-[11px] text-slate-500 mt-1">
            Cancellation rate maintained under 1.8%
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Peak Kitchen Tickets</span>
          <p className="text-3xl font-serif-luxury font-bold text-amber-700 mt-2">62 / hr</p>
          <p className="text-[11px] text-amber-700/80 mt-1">
            Observed at 2:00 PM lunch surge
          </p>
        </div>
      </div>

      {/* 3. Hourly Bar Breakdown */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h2 className="font-serif-luxury text-xl font-bold text-slate-900">
              Hourly Order Volume & Station Velocity
            </h2>
            <p className="text-xs text-slate-500">
              Orders placed per hour across cafeteria operational windows
            </p>
          </div>
          <span className="text-xs font-mono text-sky-700 bg-sky-50 px-3 py-1 rounded-lg border border-sky-200 font-semibold">
            Peak Capacity: 75/hr
          </span>
        </div>

        {/* Visual Bar Graph */}
        <div className="grid grid-cols-13 gap-2 items-end h-56 pt-6">
          {hourlyData.map((d, i) => {
            const heightPercent = Math.round((d.orders / 65) * 100);
            const isPeak = d.orders >= 58;

            return (
              <div key={i} className="flex flex-col items-center gap-2 h-full justify-end group">
                <div className="text-[10px] font-bold text-slate-600 group-hover:text-sky-700 transition-colors">
                  {d.orders}
                </div>
                <div 
                  className={`w-full rounded-t-xl transition-all duration-500 group-hover:scale-y-105 ${
                    isPeak 
                      ? 'bg-gradient-to-t from-sky-600 to-sky-500' 
                      : 'bg-gradient-to-t from-teal-600 to-teal-400'
                  }`}
                  style={{ height: `${heightPercent}%` }}
                />
                <span className="text-[9px] text-slate-500 whitespace-nowrap -rotate-45 origin-left mt-2">
                  {d.hour}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Efficiency Benchmarks */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Station Efficiency Breakdown */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-900 text-base">Station Processing Velocity</h3>
          <div className="space-y-3 text-xs">
            <div>
              <div className="flex justify-between text-slate-700 mb-1">
                <span>Dosa & Breakfast Line</span>
                <span className="font-bold text-slate-900">6.2 mins avg / ticket</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                <div className="h-full bg-sky-600" style={{ width: '85%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-slate-700 mb-1">
                <span>Hot Meals & Rolls Line</span>
                <span className="font-bold text-slate-900">8.1 mins avg / ticket</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                <div className="h-full bg-teal-600" style={{ width: '70%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-slate-700 mb-1">
                <span>Beverages & Filter Coffee Line</span>
                <span className="font-bold text-slate-900">2.8 mins avg / ticket</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                <div className="h-full bg-sky-500" style={{ width: '92%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-slate-700 mb-1">
                <span>Packaged Goods Fast Handoff</span>
                <span className="font-bold text-slate-900">1.1 mins avg / ticket</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                <div className="h-full bg-emerald-600" style={{ width: '98%' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Popular Payment Methods */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-900 text-base">Settlement Methods</h3>
          <div className="space-y-3 text-xs">
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-900">Pay at Counter (Cash/Card/UPI)</p>
                <p className="text-[11px] text-slate-500">Physical collection desk</p>
              </div>
              <div className="text-right">
                <span className="font-bold text-lg text-sky-700">68%</span>
                <p className="text-[10px] text-slate-500">232 orders</p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-900">Dynamic UPI QR Scan</p>
                <p className="text-[11px] text-slate-500">Instant digital checkout</p>
              </div>
              <div className="text-right">
                <span className="font-bold text-lg text-emerald-700">32%</span>
                <p className="text-[10px] text-slate-500">110 orders</p>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
