import React, { useState } from 'react';
import { 
  ChefHat, 
  Eye, 
  EyeOff, 
  ArrowLeft, 
  ShieldCheck, 
  AlertCircle, 
  Sparkles
} from 'lucide-react';
import { useCafe } from '../context/CafeContext';

interface KitchenLoginPageProps {
  onLoginSuccess: () => void;
  onNavigate: (tab: string, param?: string) => void;
}

export const KitchenLoginPage: React.FC<KitchenLoginPageProps> = ({ 
  onLoginSuccess, 
  onNavigate 
}) => {
  const { loginAs } = useCafe();

  const [username, setUsername] = useState('kitchen');
  const [password, setPassword] = useState('chef123');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    setTimeout(() => {
      if ((username.trim().toLowerCase() === 'kitchen' || username.trim().toLowerCase() === 'chef' || username.trim().toLowerCase() === 'kitchen@cafeconnect.edu') && password === 'chef123') {
        loginAs('kitchen', 'Chef Ramesh Kumar');
        setLoading(false);
        onLoginSuccess();
      } else {
        setLoading(false);
        setError('Invalid kitchen credentials. Use ID: "kitchen" and Password: "chef123"');
      }
    }, 400);
  };

  const handleQuickLogin = () => {
    loginAs('kitchen', 'Chef Ramesh Kumar');
    onLoginSuccess();
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="relative w-full max-w-md bg-white rounded-3xl border border-slate-200 shadow-xl p-6 sm:p-10 text-slate-900 overflow-hidden">
        
        {/* Decorative glow */}
        <div className="absolute -top-20 -left-20 w-44 h-44 bg-sky-100 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-44 h-44 bg-teal-100 rounded-full blur-3xl pointer-events-none" />

        {/* Back Link */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => onNavigate('landing')}
            className="flex items-center gap-1.5 text-xs font-semibold text-sky-600 hover:text-sky-800 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Cafeteria</span>
          </button>
          <span className="text-[10px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
            Kitchen Staff
          </span>
        </div>

        {/* Chef Badge Icon */}
        <div className="text-center space-y-3 mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-sky-500 to-sky-700 text-white flex items-center justify-center mx-auto shadow-md shadow-sky-500/20">
            <ChefHat className="w-9 h-9" />
          </div>
          <div>
            <h1 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Kitchen Staff Portal
            </h1>
            <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
              Secure station access for line chefs, preparation queue tracking, and ticket dispatch
            </p>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-5 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs uppercase font-bold tracking-wider text-slate-700 mb-1.5">
              Kitchen Station ID / Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. kitchen or chef"
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 text-sm font-medium"
              required
            />
          </div>

          <div>
            <label className="block text-xs uppercase font-bold tracking-wider text-slate-700 mb-1.5">
              Station Security Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 text-sm font-medium pr-11"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-700 transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Seeded Credentials Helper Card */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1">
            <div className="flex items-center justify-between text-sky-700 font-semibold">
              <span>Seeded Kitchen Credentials:</span>
              <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">Pre-filled</span>
            </div>
            <p className="text-slate-600">
              Username: <code className="text-slate-800 font-mono bg-slate-200 px-1.5 py-0.5 rounded">kitchen</code>
            </p>
            <p className="text-slate-600">
              Password: <code className="text-slate-800 font-mono bg-slate-200 px-1.5 py-0.5 rounded">chef123</code>
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-sm shadow-md shadow-sky-600/20 transition-transform active:scale-95 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Verifying Kitchen Line...</span>
              </>
            ) : (
              <>
                <ChefHat className="w-4 h-4" />
                <span>Log In to Kitchen Portal</span>
              </>
            )}
          </button>
        </form>

        {/* Quick One-Click Bypass */}
        <div className="mt-6 pt-5 border-t border-slate-200 text-center space-y-3">
          <button
            onClick={handleQuickLogin}
            className="w-full py-2.5 rounded-xl bg-slate-50 hover:bg-sky-50 text-sky-700 text-xs font-semibold border border-slate-200 hover:border-sky-300 transition-colors flex items-center justify-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>1-Click Demo Login as Chef Ramesh Kumar</span>
          </button>

          <div className="flex items-center justify-between text-xs text-slate-500 pt-2">
            <span>Need Admin Access?</span>
            <button
              onClick={() => onNavigate('admin_login')}
              className="text-sky-600 font-bold hover:underline flex items-center gap-1"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Go to Admin Login →</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
