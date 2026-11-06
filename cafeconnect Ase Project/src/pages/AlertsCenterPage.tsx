import React, { useState } from 'react';
import { 
  AlertTriangle, 
  CheckCircle2, 
  Trash2, 
  ShieldAlert, 
  Info, 
  Check 
} from 'lucide-react';
import { useCafe } from '../context/CafeContext';

interface AlertsCenterPageProps {
  onNavigate: (tab: string, param?: string) => void;
}

export const AlertsCenterPage: React.FC<AlertsCenterPageProps> = ({ onNavigate }) => {
  const { alerts, acknowledgeAlert, dismissAlert } = useCafe();

  const [severityFilter, setSeverityFilter] = useState<'all' | 'critical' | 'warning' | 'info'>('all');

  const filteredAlerts = alerts.filter(a => {
    if (severityFilter === 'all') return true;
    return a.severity === severityFilter;
  });

  const getSeverityStyle = (severity: string) => {
    switch (severity) {
      case 'critical':
        return {
          bg: 'bg-rose-50 border-rose-200 text-rose-950',
          badge: 'bg-rose-100 text-rose-800 border-rose-300',
          icon: <ShieldAlert className="w-5 h-5 text-rose-600" />
        };
      case 'warning':
        return {
          bg: 'bg-amber-50 border-amber-200 text-amber-950',
          badge: 'bg-amber-100 text-amber-800 border-amber-300',
          icon: <AlertTriangle className="w-5 h-5 text-amber-600" />
        };
      default:
        return {
          bg: 'bg-sky-50 border-sky-200 text-sky-950',
          badge: 'bg-sky-100 text-sky-800 border-sky-300',
          icon: <Info className="w-5 h-5 text-sky-600" />
        };
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-slate-900">
              Operational Alerts Center
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 font-bold border border-rose-200">
              {alerts.filter(a => !a.isAcknowledged).length} Action Required
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Automated notifications for critical inventory shortages, kitchen station bottlenecks, and delays
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2">
          {['all', 'critical', 'warning'].map(sev => (
            <button
              key={sev}
              onClick={() => setSeverityFilter(sev as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all capitalize shadow-xs ${
                severityFilter === sev
                  ? 'bg-sky-600 text-white border-sky-600'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-sky-300'
              }`}
            >
              {sev}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Alerts List */}
      <div className="space-y-4">
        {filteredAlerts.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-3 shadow-sm">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
            <h3 className="font-serif-luxury text-xl font-bold text-slate-900">All Operational Systems Normal</h3>
            <p className="text-xs text-slate-500">
              No active warnings or unacknowledged issues. Cafeteria queue workloads and stock levels are healthy.
            </p>
          </div>
        ) : (
          filteredAlerts.map(alert => {
            const style = getSeverityStyle(alert.severity);

            return (
              <div
                key={alert.id}
                className={`p-5 rounded-3xl border shadow-xs transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${style.bg} ${
                  alert.isAcknowledged ? 'opacity-65' : ''
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="p-2.5 rounded-2xl bg-white border border-slate-200 shrink-0 shadow-xs">
                    {style.icon}
                  </div>
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="font-bold text-slate-900 text-base">{alert.title}</h4>
                      <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${style.badge}`}>
                        {alert.severity}
                      </span>
                      {alert.isAcknowledged && (
                        <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
                          <Check className="w-3 h-3" /> Acknowledged
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed max-w-2xl">
                      {alert.message}
                    </p>
                    <div className="pt-1 flex items-center gap-4 text-[11px] text-slate-500">
                      <span>Timestamp: <strong className="font-mono text-sky-700">{alert.timestamp}</strong></span>
                      <span>Action: <strong className="text-slate-800">{alert.suggestedAction}</strong></span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                  {!alert.isAcknowledged ? (
                    <button
                      onClick={() => acknowledgeAlert(alert.id)}
                      className="px-3.5 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold transition-all shadow-xs"
                    >
                      Acknowledge
                    </button>
                  ) : (
                    <button
                      onClick={() => dismissAlert(alert.id)}
                      className="p-2 rounded-xl bg-white text-rose-600 hover:text-rose-800 border border-rose-200 shadow-xs"
                      title="Dismiss Alert"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
