import React, { useState } from 'react';
import { X, User, ChefHat, ShieldCheck, Eye, EyeOff } from 'lucide-react';
import { useCafe } from '../context/CafeContext';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessNavigate?: (tab: string) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ 
  isOpen, 
  onClose,
  onSuccessNavigate 
}) => {
  if (!isOpen) return null;

  const { loginAs } = useCafe();
  const [activeTab, setActiveTab] = useState<'student' | 'kitchen' | 'admin'>('student');
  const [name, setName] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (activeTab === 'student') {
      loginAs('student', name.trim() || 'Campus Student', rollNumber.trim() || undefined);
      onClose();
    } else if (activeTab === 'kitchen') {
      if ((username === 'kitchen' || username === 'chef') && password === 'chef123') {
        loginAs('kitchen', 'Chef Suresh Kumar');
        onClose();
        if (onSuccessNavigate) onSuccessNavigate('kitchen');
      } else {
        setError('Invalid kitchen staff credentials. Hint: kitchen / chef123');
      }
    } else if (activeTab === 'admin') {
      if (username === 'admin' && password === 'admin123') {
        loginAs('admin', 'Operations Admin');
        onClose();
        if (onSuccessNavigate) onSuccessNavigate('admin');
      } else {
        setError('Invalid administrator credentials. Hint: admin / admin123');
      }
    }
  };

  const handleQuickLogin = (role: 'student' | 'kitchen' | 'admin') => {
    if (role === 'student') {
      loginAs('student', 'Chaitanya V.', 'CS23B104');
      onClose();
    } else if (role === 'kitchen') {
      loginAs('kitchen', 'Chef Suresh Kumar');
      onClose();
      if (onSuccessNavigate) onSuccessNavigate('kitchen');
    } else if (role === 'admin') {
      loginAs('admin', 'Operations Admin');
      onClose();
      if (onSuccessNavigate) onSuccessNavigate('admin');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-md bg-white text-slate-900 rounded-3xl border border-slate-200 shadow-2xl p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 text-slate-500 hover:text-slate-800 hover:bg-slate-200 border border-slate-200 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="font-serif-luxury text-2xl font-bold text-slate-900">
            Access Portal
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Choose your role or test with demo accounts
          </p>
        </div>

        {/* Role Tabs */}
        <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-2xl border border-slate-200 mb-6">
          <button
            onClick={() => { setActiveTab('student'); setError(''); }}
            className={`py-2 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'student'
                ? 'bg-sky-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            Student
          </button>
          <button
            onClick={() => { setActiveTab('kitchen'); setError(''); setUsername('kitchen'); setPassword('chef123'); }}
            className={`py-2 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'kitchen'
                ? 'bg-sky-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ChefHat className="w-3.5 h-3.5" />
            Kitchen
          </button>
          <button
            onClick={() => { setActiveTab('admin'); setError(''); setUsername('admin'); setPassword('admin123'); }}
            className={`py-2 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'admin'
                ? 'bg-sky-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            Admin
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
              {error}
            </div>
          )}

          {activeTab === 'student' ? (
            <>
              <div>
                <label className="block text-xs uppercase font-bold tracking-wider text-slate-700 mb-1.5">
                  Name (Optional for guest order)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Chaitanya"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs uppercase font-bold tracking-wider text-slate-700 mb-1.5">
                  Roll / Student ID (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. CS23B104"
                  value={rollNumber}
                  onChange={e => setRollNumber(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 text-sm"
                />
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="block text-xs uppercase font-bold tracking-wider text-slate-700 mb-1.5">
                  {activeTab === 'kitchen' ? 'Kitchen Station ID / Username' : 'Administrator Username'}
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-xs uppercase font-bold tracking-wider text-slate-700 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 text-sm pr-11"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-700"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Demo Credentials Hint */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                <p className="font-semibold text-sky-700">Demo Credentials:</p>
                {activeTab === 'kitchen' ? (
                  <p className="text-slate-600">Username: <code className="bg-slate-200 text-slate-800 px-1 py-0.5 rounded font-mono">kitchen</code> | Password: <code className="bg-slate-200 text-slate-800 px-1 py-0.5 rounded font-mono">chef123</code></p>
                ) : (
                  <p className="text-slate-600">Username: <code className="bg-slate-200 text-slate-800 px-1 py-0.5 rounded font-mono">admin</code> | Password: <code className="bg-slate-200 text-slate-800 px-1 py-0.5 rounded font-mono">admin123</code></p>
                )}
              </div>
            </>
          )}

          <button
            type="submit"
            className="w-full py-3.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-sm shadow-md shadow-sky-600/20 transition-transform active:scale-95"
          >
            {activeTab === 'student' ? 'Continue to Cafeteria' : 'Authenticate & Enter'}
          </button>
        </form>

        {/* 1-Click Fast Switch Buttons */}
        <div className="mt-6 pt-5 border-t border-slate-200">
          <p className="text-[11px] uppercase font-bold tracking-wider text-slate-500 mb-2.5 text-center">
            One-Click Demo Switcher
          </p>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => handleQuickLogin('student')}
              className="py-2 px-2 text-[11px] font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 text-center transition-colors"
            >
              Demo Student
            </button>
            <button
              onClick={() => handleQuickLogin('kitchen')}
              className="py-2 px-2 text-[11px] font-semibold rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 text-center transition-colors"
            >
              Chef Login
            </button>
            <button
              onClick={() => handleQuickLogin('admin')}
              className="py-2 px-2 text-[11px] font-semibold rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 text-center transition-colors"
            >
              Admin Login
            </button>
          </div>

          <div className="flex items-center justify-between pt-3 text-[11px] text-slate-500">
            <button
              onClick={() => {
                onClose();
                if (onSuccessNavigate) onSuccessNavigate('kitchen_login');
              }}
              className="text-sky-600 hover:text-sky-800 font-medium hover:underline flex items-center gap-1"
            >
              <ChefHat className="w-3 h-3" />
              <span>Full Kitchen Login Page →</span>
            </button>
            <button
              onClick={() => {
                onClose();
                if (onSuccessNavigate) onSuccessNavigate('admin_login');
              }}
              className="text-sky-600 hover:text-sky-800 font-medium hover:underline flex items-center gap-1"
            >
              <ShieldCheck className="w-3 h-3" />
              <span>Full Admin Login Page →</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
