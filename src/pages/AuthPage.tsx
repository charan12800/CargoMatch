import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { MOCK_CUSTOMERS, MOCK_DRIVERS } from '../lib/mockData';
import { 
  Truck, 
  Package, 
  ArrowRight, 
  ArrowLeft
} from 'lucide-react';
import { UserRole } from '../types';

export const AuthPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { loginAs } = useApp();
  
  const initialRole = (searchParams.get('role') as UserRole) || 'customer';
  const [role, setRole] = useState<UserRole>(initialRole);
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');

  // Transfer any route params from search
  const sourceParam = searchParams.get('source') || '';
  const destParam = searchParams.get('dest') || searchParams.get('destination') || '';
  const weightParam = searchParams.get('weight') || '';

  useEffect(() => {
    const r = searchParams.get('role');
    if (r === 'driver' || r === 'customer') {
      setRole(r);
    }
  }, [searchParams]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (role === 'customer') {
      loginAs({
        ...MOCK_CUSTOMERS[0],
        full_name: fullName || MOCK_CUSTOMERS[0].full_name,
        email: email || MOCK_CUSTOMERS[0].email,
      });
      if (sourceParam && destParam) {
        navigate(`/customer/send-cargo?source=${encodeURIComponent(sourceParam)}&dest=${encodeURIComponent(destParam)}&weight=${weightParam}`);
      } else {
        navigate('/customer');
      }
    } else {
      loginAs({
        ...MOCK_DRIVERS[0],
        full_name: fullName || MOCK_DRIVERS[0].full_name,
        email: email || MOCK_DRIVERS[0].email,
      });
      navigate('/driver');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      {/* Top Bar */}
      <div className="p-4 sm:p-6 max-w-7xl mx-auto w-full flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm">
            <Truck className="w-5 h-5" />
          </div>
          <span className="text-xl font-black text-slate-900">
            Cargo<span className="text-blue-600">Match</span>
          </span>
        </Link>

        <Link
          to="/"
          className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
      </div>

      {/* Main Container */}
      <div className="max-w-md w-full mx-auto px-4 py-8">
        <Card className="p-6 sm:p-8 border-slate-200 shadow-elevated bg-white">
          {/* Header */}
          <div className="text-center space-y-2 mb-6">
            <h1 className="text-2xl font-black text-slate-900">
              {isLogin ? 'Sign In to CargoMatch' : 'Create Your Account'}
            </h1>
            <p className="text-xs text-slate-500">
              {isLogin
                ? 'Select your account type to proceed'
                : 'Join the shared-capacity logistics platform'}
            </p>
          </div>

          {/* Role Selection Switcher */}
          <div className="space-y-2 mb-6">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
              I want to:
            </label>
            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl">
              <button
                type="button"
                onClick={() => setRole('customer')}
                className={`py-2.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  role === 'customer'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Package className="w-4 h-4" />
                Send Cargo
              </button>
              <button
                type="button"
                onClick={() => setRole('driver')}
                className={`py-2.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  role === 'driver'
                    ? 'bg-white text-emerald-600 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Truck className="w-4 h-4" />
                Drive & Earn
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    {role === 'customer' ? 'Full Name / Business Name' : 'Driver Full Name'}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={role === 'customer' ? 'e.g. Pooja Sundaram' : 'e.g. Rajesh Kumar'}
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98490 12345"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none"
                  />
                </div>
              </>
            )}

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Email Address</label>
              <input
                type="email"
                required
                placeholder={role === 'customer' ? 'pooja@techhub.in' : 'rajesh.verma@cargomatch.in'}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-700">Password</label>
                {isLogin && (
                  <button type="button" className="text-[11px] text-blue-600 hover:underline">
                    Forgot password?
                  </button>
                )}
              </div>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none"
              />
            </div>

            {sourceParam && destParam && (
              <div className="p-3 rounded-lg bg-blue-50 border border-blue-100 text-xs text-blue-800">
                <strong>Saved Route:</strong> {sourceParam} → {destParam} ({weightParam || '5'} kg)
              </div>
            )}

            <Button
              type="submit"
              variant={role === 'driver' ? 'emerald' : 'primary'}
              size="md"
              className="w-full font-bold shadow-md"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              {isLogin ? `Sign In as ${role === 'customer' ? 'Customer' : 'Driver'}` : `Create ${role === 'customer' ? 'Customer' : 'Driver'} Account`}
            </Button>
          </form>

          {/* Switch Login / Signup */}
          <div className="mt-6 pt-4 border-t border-slate-100 text-center text-xs text-slate-600">
            {isLogin ? (
              <p>
                Don't have an account?{' '}
                <button
                  onClick={() => setIsLogin(false)}
                  className="font-bold text-blue-600 hover:underline cursor-pointer"
                >
                  Sign up here
                </button>
              </p>
            ) : (
              <p>
                Already registered?{' '}
                <button
                  onClick={() => setIsLogin(true)}
                  className="font-bold text-blue-600 hover:underline cursor-pointer"
                >
                  Sign in here
                </button>
              </p>
            )}
          </div>
        </Card>
      </div>

      {/* Footer info */}
      <div className="p-4 text-center text-xs text-slate-400">
        © {new Date().getFullYear()} CargoMatch Technologies Private Limited. All rights reserved.
      </div>
    </div>
  );
};
