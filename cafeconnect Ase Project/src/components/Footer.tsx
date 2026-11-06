import React from 'react';
import { Coffee, MapPin, Clock, Database, Sparkles } from 'lucide-react';

interface FooterProps {
  onNavigate: (tab: string, param?: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-slate-100 border-t border-slate-200 text-slate-700 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-200">
          
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0284C7] via-[#0EA5E9] to-[#0D9488] flex items-center justify-center shadow-md shadow-sky-500/20">
                <Coffee className="w-5 h-5 text-white" />
              </div>
              <span className="font-serif-luxury text-2xl font-bold tracking-tight text-slate-900">
                Cafe Connect
              </span>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              Elevating the campus dining experience with freshly prepared delicacies, zero queuing anxiety, and live station queue transparency.
            </p>
            <div className="flex items-center gap-2 text-xs text-sky-700 bg-sky-50 px-3 py-1.5 rounded-lg border border-sky-200 w-fit font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-sky-600" />
              <span>Smart Queue Estimation Active</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs uppercase font-bold tracking-widest text-slate-900 mb-4">Explore Menu</h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>
                <button onClick={() => onNavigate('category', 'south_indian')} className="hover:text-sky-600 transition-colors">
                  South Indian Delicacies
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('category', 'meals_fastfood')} className="hover:text-sky-600 transition-colors">
                  Meals & Fast Food
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('category', 'burgers_sandwiches')} className="hover:text-sky-600 transition-colors">
                  Burgers & Sandwiches
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('packaged_snacks')} className="hover:text-sky-600 transition-colors">
                  Packaged Snacks & Chips
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('category', 'hot_beverages')} className="hover:text-sky-600 transition-colors">
                  Filter Coffee & Tea
                </button>
              </li>
            </ul>
          </div>

          {/* Timings & Location */}
          <div>
            <h4 className="text-xs uppercase font-bold tracking-widest text-slate-900 mb-4">Cafeteria Hours</h4>
            <div className="space-y-3 text-sm text-slate-600">
              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-sky-600 mt-0.5 shrink-0" />
                <div>
                  <p className="font-semibold text-slate-900">Mon – Sat: 7:30 AM – 10:30 PM</p>
                  <p className="text-xs text-slate-500">Sunday: 8:00 AM – 9:00 PM</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-sky-600 mt-0.5 shrink-0" />
                <div>
                  <p className="font-semibold text-slate-900">Student Center — Ground Floor</p>
                  <p className="text-xs text-slate-500">Opposite Central Library Lawn</p>
                </div>
              </div>
            </div>
          </div>

          {/* Operational Portals & SQL Notice */}
          <div>
            <h4 className="text-xs uppercase font-bold tracking-widest text-slate-900 mb-4">Staff & Governance</h4>
            <div className="space-y-2">
              <button 
                onClick={() => onNavigate('kitchen_login')}
                className="w-full text-left px-3.5 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-xs font-semibold text-slate-800 flex items-center justify-between border border-slate-200 transition-colors shadow-xs"
              >
                <span>Kitchen Staff Login</span>
                <span className="text-[10px] text-sky-600 font-bold">Station Queue →</span>
              </button>
              <button 
                onClick={() => onNavigate('admin_login')}
                className="w-full text-left px-3.5 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-xs font-semibold text-slate-800 flex items-center justify-between border border-slate-200 transition-colors shadow-xs"
              >
                <span>Administrator Login</span>
                <span className="text-[10px] text-sky-600 font-bold">Admin Console →</span>
              </button>
              <div className="p-2.5 rounded-xl bg-white border border-slate-200 text-[11px] text-slate-600 flex items-center gap-2 shadow-xs">
                <Database className="w-4 h-4 text-sky-600 shrink-0" />
                <span>MySQL 8.0+ Schema & Seeds in <code className="text-sky-700 font-semibold bg-sky-50 px-1 py-0.5 rounded">database/sql/</code></span>
              </div>
            </div>
          </div>

        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 Cafe Connect. Crafted for campus convenience & hygienic dining.</p>
          <div className="flex items-center gap-4">
            <span className="hover:text-sky-600 cursor-pointer">Dietary Standards</span>
            <span>•</span>
            <span className="hover:text-sky-600 cursor-pointer">Kitchen Hygiene Audit (A+)</span>
            <span>•</span>
            <span className="hover:text-sky-600 cursor-pointer">Student Support</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
