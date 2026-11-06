import React, { useState } from 'react';
import { 
  Coffee, 
  ShoppingBag, 
  Clock, 
  ChefHat, 
  ShieldCheck, 
  User, 
  Menu as MenuIcon, 
  X, 
  Package, 
  Bell
} from 'lucide-react';
import { useCafe } from '../context/CafeContext';

interface HeaderProps {
  currentTab: string;
  onNavigate: (tab: string, param?: string) => void;
  onOpenLogin: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentTab, onNavigate, onOpenLogin }) => {
  const { 
    currentUser, 
    cartItemCount, 
    cartTotal, 
    activeOrder, 
    unreadAlertsCount,
    logout 
  } = useCafe();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 text-slate-800 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Brand matching reference */}
          <div 
            onClick={() => onNavigate('landing')} 
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#0284C7] via-[#0EA5E9] to-[#0D9488] flex items-center justify-center shadow-md shadow-sky-500/20 group-hover:scale-105 transition-transform">
              <Coffee className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif-luxury text-2xl font-bold tracking-tight text-slate-900 group-hover:text-sky-600 transition-colors">
                  Cafe Connect
                </span>
                <span className="text-[10px] tracking-widest uppercase px-2 py-0.5 rounded-full bg-sky-50 text-sky-700 font-bold border border-sky-200 hidden sm:inline-block">
                  Campus Luxury
                </span>
              </div>
              <p className="text-[11px] text-slate-500 tracking-wider">Campus Food, Elevated</p>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            <button
              onClick={() => onNavigate('landing')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                currentTab === 'landing' 
                  ? 'text-sky-700 bg-sky-50 border border-sky-200 font-semibold shadow-xs' 
                  : 'text-slate-600 hover:text-sky-700 hover:bg-slate-100'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => onNavigate('menu')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                currentTab === 'menu' || currentTab === 'category'
                  ? 'text-sky-700 bg-sky-50 border border-sky-200 font-semibold shadow-xs' 
                  : 'text-slate-600 hover:text-sky-700 hover:bg-slate-100'
              }`}
            >
              Explore Menu
            </button>
            <button
              onClick={() => onNavigate('packaged_snacks')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
                currentTab === 'packaged_snacks' 
                  ? 'text-sky-700 bg-sky-50 border border-sky-200 font-semibold shadow-xs' 
                  : 'text-slate-600 hover:text-sky-700 hover:bg-slate-100'
              }`}
            >
              <Package className="w-4 h-4 text-sky-600" />
              Packaged Snacks
            </button>
            <button
              onClick={() => onNavigate('tracking')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
                currentTab === 'tracking' 
                  ? 'text-sky-700 bg-sky-50 border border-sky-200 font-semibold shadow-xs' 
                  : 'text-slate-600 hover:text-sky-700 hover:bg-slate-100'
              }`}
            >
              <Clock className="w-4 h-4 text-sky-600" />
              Track Order
              {activeOrder && activeOrder.status !== 'completed' && activeOrder.status !== 'cancelled' && (
                <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse ml-0.5" />
              )}
            </button>
            <button
              onClick={() => onNavigate('history')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                currentTab === 'history' 
                  ? 'text-sky-700 bg-sky-50 border border-sky-200 font-semibold shadow-xs' 
                  : 'text-slate-600 hover:text-sky-700 hover:bg-slate-100'
              }`}
            >
              My Orders
            </button>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">

            {/* Quick Switch / Portal Shortcuts */}
            <div className="hidden lg:flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button
                onClick={() => onNavigate(currentUser.role === 'kitchen' || currentUser.role === 'admin' ? 'kitchen' : 'kitchen_login')}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  currentTab === 'kitchen' || currentTab === 'kitchen_login'
                    ? 'bg-sky-600 text-white shadow-xs font-bold' 
                    : 'text-slate-600 hover:text-sky-700 hover:bg-slate-200/60'
                }`}
                title="Kitchen Staff Portal"
              >
                <ChefHat className="w-3.5 h-3.5" />
                {currentUser.role === 'kitchen' ? 'Kitchen Live' : 'Kitchen Login'}
              </button>
              <button
                onClick={() => onNavigate(currentUser.role === 'admin' ? 'admin' : 'admin_login')}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  currentTab === 'admin' || currentTab === 'admin_login'
                    ? 'bg-sky-600 text-white shadow-xs font-bold' 
                    : 'text-slate-600 hover:text-sky-700 hover:bg-slate-200/60'
                }`}
                title="Admin Portal"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                {currentUser.role === 'admin' ? 'Admin Live' : 'Admin Login'}
              </button>
            </div>

            {/* Alerts Center shortcut (shows red pill if unread alerts) */}
            <button
              onClick={() => onNavigate('alerts')}
              className="relative p-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 transition-colors shadow-xs"
              title="Operational Alerts"
            >
              <Bell className="w-4 h-4 text-sky-600" />
              {unreadAlertsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-500 text-white font-bold text-[10px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-xs">
                  {unreadAlertsCount}
                </span>
              )}
            </button>

            {/* Cart Trigger */}
            <button
              onClick={() => onNavigate('cart')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all border ${
                currentTab === 'cart'
                  ? 'bg-sky-600 text-white border-sky-600 font-bold shadow-md shadow-sky-500/20'
                  : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200 font-medium shadow-xs'
              }`}
            >
              <div className="relative">
                <ShoppingBag className={`w-4 h-4 ${currentTab === 'cart' ? 'text-white' : 'text-sky-600'}`} />
                {cartItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-gradient-to-r from-sky-500 to-blue-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                    {cartItemCount}
                  </span>
                )}
              </div>
              <span className="text-sm font-semibold hidden sm:inline">
                ₹{cartTotal}
              </span>
            </button>

            {/* User Profile / Login */}
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-2 rounded-xl bg-white border border-slate-200 hover:border-sky-300 transition-colors shadow-xs"
              >
                <div className="w-7 h-7 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-xs">
                  {currentUser.name.charAt(0)}
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-xs font-semibold leading-tight text-slate-800 line-clamp-1">{currentUser.name}</p>
                  <p className="text-[10px] uppercase font-bold text-sky-600 leading-tight">{currentUser.role}</p>
                </div>
              </button>

              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 text-sm">
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="font-semibold text-slate-900">{currentUser.name}</p>
                    <p className="text-xs text-sky-600 capitalize font-medium">{currentUser.role} Account</p>
                    {currentUser.rollNumber && (
                      <p className="text-[11px] text-slate-500">Roll: {currentUser.rollNumber}</p>
                    )}
                  </div>
                  
                  <button
                    onClick={() => {
                      onNavigate('kitchen_login');
                      setProfileDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2.5 hover:bg-slate-50 flex items-center gap-2.5 text-slate-800 transition-colors"
                  >
                    <ChefHat className="w-4 h-4 text-sky-600" />
                    <div>
                      <div className="font-semibold text-xs text-slate-900">Kitchen Staff Login</div>
                      <div className="text-[10px] text-slate-500">Order queue & prep lines</div>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      onNavigate('admin_login');
                      setProfileDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2.5 hover:bg-slate-50 flex items-center gap-2.5 text-slate-800 transition-colors"
                  >
                    <ShieldCheck className="w-4 h-4 text-sky-600" />
                    <div>
                      <div className="font-semibold text-xs text-slate-900">Administrator Login</div>
                      <div className="text-[10px] text-slate-500">Inventory, pricing & analytics</div>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      onOpenLogin();
                      setProfileDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2.5 hover:bg-slate-50 flex items-center gap-2.5 text-slate-800 transition-colors"
                  >
                    <User className="w-4 h-4 text-sky-600" />
                    <div>
                      <div className="font-semibold text-xs text-slate-900">Student Guest Profile</div>
                      <div className="text-[10px] text-slate-500">Update name or roll number</div>
                    </div>
                  </button>

                  <div className="border-t border-slate-100 my-1" />

                  <button
                    onClick={() => {
                      logout();
                      setProfileDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-rose-50 text-rose-600 flex items-center gap-2 text-xs transition-colors"
                  >
                    Reset to Student Guest
                  </button>
                </div>
              )}
            </div>

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl bg-white text-slate-700 border border-slate-200"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
            </button>

          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 space-y-2">
          <button
            onClick={() => { onNavigate('landing'); setMobileMenuOpen(false); }}
            className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100"
          >
            Home
          </button>
          <button
            onClick={() => { onNavigate('menu'); setMobileMenuOpen(false); }}
            className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100"
          >
            Explore Menu
          </button>
          <button
            onClick={() => { onNavigate('packaged_snacks'); setMobileMenuOpen(false); }}
            className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100"
          >
            Packaged Snacks Store
          </button>
          <button
            onClick={() => { onNavigate('tracking'); setMobileMenuOpen(false); }}
            className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100"
          >
            Track Active Order
          </button>
          <button
            onClick={() => { onNavigate('history'); setMobileMenuOpen(false); }}
            className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100"
          >
            Order History
          </button>
          <div className="pt-2 border-t border-slate-200 flex gap-2">
            <button
              onClick={() => { onNavigate(currentUser.role === 'kitchen' ? 'kitchen' : 'kitchen_login'); setMobileMenuOpen(false); }}
              className="flex-1 py-2 rounded-xl bg-sky-50 text-xs font-bold text-sky-700 flex items-center justify-center gap-1 border border-sky-200"
            >
              <ChefHat className="w-4 h-4" /> {currentUser.role === 'kitchen' ? 'Kitchen Live' : 'Kitchen Login'}
            </button>
            <button
              onClick={() => { onNavigate(currentUser.role === 'admin' ? 'admin' : 'admin_login'); setMobileMenuOpen(false); }}
              className="flex-1 py-2 rounded-xl bg-sky-50 text-xs font-bold text-sky-700 flex items-center justify-center gap-1 border border-sky-200"
            >
              <ShieldCheck className="w-4 h-4" /> {currentUser.role === 'admin' ? 'Admin Live' : 'Admin Login'}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
