import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { BackendStatusBadge } from '../components/common/BackendStatusBadge';
import { MOCK_CUSTOMERS, MOCK_DRIVERS } from '../lib/mockData';
import { signInUser, signUpUser } from '../lib/api/auth';
import { isSupabaseConfigured } from '../lib/supabase';
import { 
  Truck, 
  Package, 
  ArrowRight, 
  ArrowLeft,
  AlertCircle,
  Loader2,
  CheckCircle2,
  Zap
} from 'lucide-react';
import { UserRole, Profile } from '../types';

export const AuthPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { loginAs, isLiveBackend } = useApp();
  
  const initialRole = (searchParams.get('role') as UserRole) || 'customer';
  const [role, setRole] = useState<UserRole>(initialRole);
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

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

  const handleQuickDemoLogin = (profile: Profile) => {
    loginAs(profile);
    if (profile.role === 'customer') {
      if (sourceParam && destParam) {
        navigate(`/customer/send-cargo?source=${encodeURIComponent(sourceParam)}&dest=${encodeURIComponent(destParam)}&weight=${weightParam}`);
      } else {
        navigate('/customer');
      }
    } else {
      navigate('/driver');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsLoading(true);

    try {
      if (isLogin) {
        const { profile, error } = await signInUser({
          email: email.trim(),
          password: password,
        });

        if (error) {
          setErrorMessage(error);
          setIsLoading(false);
          return;
        }

        if (profile) {
          loginAs(profile);
          if (profile.role === 'driver' || role === 'driver') {
            navigate('/driver');
          } else {
            if (sourceParam && destParam) {
              navigate(`/customer/send-cargo?source=${encodeURIComponent(sourceParam)}&dest=${encodeURIComponent(destParam)}&weight=${weightParam}`);
            } else {
              navigate('/customer');
            }
          }
        }
      } else {
        // Sign up
        const { profile, error } = await signUpUser({
          email: email.trim(),
          password: password,
          fullName: fullName.trim(),
          role: role,
          phone: phone.trim(),
        });

        if (error) {
          setErrorMessage(error);
          setIsLoading(false);
          return;
        }

        if (profile) {
          loginAs(profile);
          setSuccessMessage('Account created successfully! Redirecting...');
          setTimeout(() => {
            if (role === 'driver') {
              navigate('/driver');
            } else {
              if (sourceParam && destParam) {
                navigate(`/customer/send-cargo?source=${encodeURIComponent(sourceParam)}&dest=${encodeURIComponent(destParam)}&weight=${weightParam}`);
              } else {
                navigate('/customer');
              }
            }
          }, 800);
        }
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'An unexpected authentication error occurred.');
    } finally {
      setIsLoading(false);
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

        <div className="flex items-center gap-3">
          <BackendStatusBadge />
          <Link
            to="/"
            className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
        </div>
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
                ? 'Select your account type and credentials to proceed'
                : 'Join the shared-capacity logistics platform'}
            </p>
          </div>

          {/* Feedback Alerts */}
          {errorMessage && (
            <div className="mb-4 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold">Authentication Notice</p>
                <p className="opacity-90">{errorMessage}</p>
              </div>
            </div>
          )}

          {successMessage && (
            <div className="mb-4 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

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
              disabled={isLoading}
              className="w-full font-bold shadow-md cursor-pointer"
              rightIcon={isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
            >
              {isLoading
                ? 'Authenticating...'
                : isLogin
                ? `Sign In as ${role === 'customer' ? 'Customer' : 'Driver'}`
                : `Create ${role === 'customer' ? 'Customer' : 'Driver'} Account`}
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

          {/* Quick Demo Login Preset Buttons */}
          <div className="mt-6 pt-4 border-t border-slate-100">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 text-center mb-2.5 flex items-center justify-center gap-1">
              <Zap className="w-3.5 h-3.5 text-amber-500" /> Instant Demo Shortcuts:
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemoLogin(MOCK_CUSTOMERS[0])}
                className="p-2 text-left bg-blue-50 hover:bg-blue-100/80 border border-blue-200/80 rounded-xl transition-colors cursor-pointer"
              >
                <div className="text-[11px] font-bold text-blue-900">👤 Customer Demo</div>
                <div className="text-[10px] text-blue-700 truncate">{MOCK_CUSTOMERS[0].full_name}</div>
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoLogin(MOCK_DRIVERS[0])}
                className="p-2 text-left bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200/80 rounded-xl transition-colors cursor-pointer"
              >
                <div className="text-[11px] font-bold text-emerald-900">🚛 Driver Demo</div>
                <div className="text-[10px] text-emerald-700 truncate">{MOCK_DRIVERS[0].full_name}</div>
              </button>
            </div>
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
