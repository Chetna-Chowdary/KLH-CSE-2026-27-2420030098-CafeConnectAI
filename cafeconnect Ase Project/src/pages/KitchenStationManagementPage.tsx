import React, { useState } from 'react';
import { 
  ChefHat, 
  Play, 
  Pause 
} from 'lucide-react';
import { useCafe } from '../context/CafeContext';
import { KitchenStation, KitchenStationId } from '../types';

export const KitchenStationManagementPage: React.FC = () => {
  const { stations, updateStation, toggleStationPause } = useCafe();

  const [editingStationId, setEditingStationId] = useState<KitchenStationId | null>(null);
  const [capacity, setCapacity] = useState<number>(3);
  const [batchCap, setBatchCap] = useState<number>(2);
  const [workers, setWorkers] = useState<number>(2);

  const handleEditClick = (station: KitchenStation) => {
    setEditingStationId(station.id);
    setCapacity(station.activeCapacity);
    setBatchCap(station.batchCapacity);
    setWorkers(station.activeWorkers);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStationId) return;

    updateStation(editingStationId, {
      activeCapacity: capacity,
      batchCapacity: batchCap,
      activeWorkers: workers
    });

    setEditingStationId(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-slate-900">
              Kitchen Station Governance
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-sky-50 text-sky-700 font-bold border border-sky-200">
              5 Dedicated Lines
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure line throughput, active cooking slots, staff allocations, and emergency pause controls
          </p>
        </div>
      </div>

      {/* 2. Station Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {(Object.keys(stations) as KitchenStationId[]).map(stationId => {
          const s = stations[stationId];
          const isOverloaded = s.currentWorkloadPercent > 80;

          return (
            <div
              key={s.id}
              className={`bg-white rounded-3xl p-6 border shadow-sm flex flex-col justify-between space-y-6 transition-all ${
                s.isPaused 
                  ? 'border-rose-300 bg-rose-50/20' 
                  : isOverloaded 
                  ? 'border-amber-300' 
                  : 'border-slate-200'
              }`}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-sky-50 flex items-center justify-center text-sky-600">
                      <ChefHat className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-base">{s.name}</h3>
                      <p className="text-[11px] text-slate-500">{s.operatingHours}</p>
                    </div>
                  </div>

                  <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${
                    s.isPaused
                      ? 'bg-rose-50 text-rose-700 border-rose-200'
                      : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  }`}>
                    {s.isPaused ? 'Paused' : 'Active'}
                  </span>
                </div>

                {/* Workload Progress */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs text-slate-700 font-semibold">
                    <span>Workload Velocity</span>
                    <span className={isOverloaded ? 'text-rose-600' : 'text-sky-700 font-bold'}>
                      {s.currentWorkloadPercent}%
                    </span>
                  </div>
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
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase">Active Slots</span>
                    <span className="font-bold text-slate-900 text-sm">{s.activeCapacity} slots</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase">Batch Capacity</span>
                    <span className="font-bold text-slate-900 text-sm">{s.batchCapacity} orders</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase">Active Staff</span>
                    <span className="font-bold text-slate-900 text-sm">{s.activeWorkers} chefs</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase">Avg Base Prep</span>
                    <span className="font-bold text-sky-700 text-sm">{s.avgPreparationMinutes} mins</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-slate-100 flex items-center gap-3">
                <button
                  onClick={() => toggleStationPause(s.id)}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors ${
                    s.isPaused
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                      : 'bg-slate-100 hover:bg-amber-50 text-amber-700 border border-slate-200'
                  }`}
                >
                  {s.isPaused ? (
                    <>
                      <Play className="w-3.5 h-3.5" />
                      <span>Resume Line</span>
                    </>
                  ) : (
                    <>
                      <Pause className="w-3.5 h-3.5" />
                      <span>Pause Line</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => handleEditClick(s)}
                  className="px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold transition-all shadow-xs"
                >
                  Configure
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Configure Modal */}
      {editingStationId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-slate-200 shadow-2xl space-y-4">
            <h3 className="font-serif-luxury text-xl font-bold text-slate-900">
              Configure Station Capacity
            </h3>
            <p className="text-xs text-slate-500">
              Altering active slots directly scales the real-time queue algorithm for all students adding items to cart.
            </p>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs uppercase font-bold text-slate-700 mb-1">
                  Active Griddle / Preparation Slots
                </label>
                <input
                  type="number"
                  min="1"
                  max="12"
                  value={capacity}
                  onChange={(e) => setCapacity(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 font-mono font-bold focus:bg-white focus:outline-none focus:border-sky-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs uppercase font-bold text-slate-700 mb-1">
                  Batch Capacity (Concurrent Tickets)
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={batchCap}
                  onChange={(e) => setBatchCap(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 font-mono font-bold focus:bg-white focus:outline-none focus:border-sky-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs uppercase font-bold text-slate-700 mb-1">
                  Assigned Kitchen Staff Workers
                </label>
                <input
                  type="number"
                  min="1"
                  max="8"
                  value={workers}
                  onChange={(e) => setWorkers(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 font-mono font-bold focus:bg-white focus:outline-none focus:border-sky-500"
                  required
                />
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setEditingStationId(null)}
                  className="flex-1 py-3 rounded-xl bg-slate-100 text-xs font-semibold text-slate-700 hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold shadow-xs"
                >
                  Save Configuration
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
