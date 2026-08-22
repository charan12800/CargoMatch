import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../common/Button';
import { 
  Truck, 
  Package, 
  Menu, 
  X, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  RotateCcw 
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleNavClick = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <div className="relative">
                <Truck className="w-6 h-6 text-white" />
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full ring-2 ring-blue-600" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-black tracking-tight text-slate-900 flex items-center gap-1.5">
                Cargo<span className="text-blue-600">Match</span>
              </span>
              <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-500 -mt-1">
                Shared-Capacity Logistics
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-slate-600">
            <button 
              onClick={() => handleNavClick('how-it-works')}
              className="hover:text-blue-600 transition-colors cursor-pointer"
            >
              How It Works
            </button>
            <button 
              onClick={() => handleNavClick('why-cargmatch')}
              className="hover:text-blue-600 transition-colors cursor-pointer"
            >
              Why CargoMatch
            </button>
            <button 
              onClick={() => handleNavClick('empty-returns')}
              className="hover:text-blue-600 transition-colors cursor-pointer flex items-center gap-1.5 text-amber-800 font-semibold"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Empty Returns
            </button>
            <button 
              onClick={() => handleNavClick('ai-matching')}
              className="hover:text-blue-600 transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              AI Matching
            </button>
            <button 
              onClick={() => handleNavClick('calculator')}
              className="hover:text-blue-600 transition-colors cursor-pointer"
            >
              Cost Estimator
            </button>
            <button 
              onClick={() => handleNavClick('trust-safety')}
              className="hover:text-blue-600 transition-colors cursor-pointer flex items-center gap-1"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Safety
            </button>
          </nav>

          {/* Desktop Action CTAs */}
          <div className="hidden sm:flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/auth?role=driver')}
              leftIcon={<Truck className="w-4 h-4 text-emerald-600" />}
              className="border-slate-300 font-semibold"
            >
              Earn With Vehicle
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate('/auth?role=customer')}
              leftIcon={<Package className="w-4 h-4" />}
              rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
              className="shadow-sm font-semibold"
            >
              Send Cargo
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex sm:hidden items-center gap-2">
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate('/auth?role=customer')}
            >
              Send Cargo
            </Button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-slate-200 bg-white px-4 pt-3 pb-6 space-y-4 shadow-xl animate-in slide-in-from-top-2 duration-150">
          <div className="flex flex-col space-y-3 font-medium text-slate-700">
            <button
              onClick={() => handleNavClick('how-it-works')}
              className="text-left py-2 px-3 rounded-lg hover:bg-slate-50"
            >
              How It Works
            </button>
            <button
              onClick={() => handleNavClick('why-cargmatch')}
              className="text-left py-2 px-3 rounded-lg hover:bg-slate-50"
            >
              Why CargoMatch
            </button>
            <button
              onClick={() => handleNavClick('empty-returns')}
              className="text-left py-2 px-3 rounded-lg hover:bg-slate-50 text-amber-800 font-semibold flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Empty Return Trips
            </button>
            <button
              onClick={() => handleNavClick('ai-matching')}
              className="text-left py-2 px-3 rounded-lg hover:bg-slate-50 flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-blue-600" />
              AI Matching Engine
            </button>
            <button
              onClick={() => handleNavClick('calculator')}
              className="text-left py-2 px-3 rounded-lg hover:bg-slate-50"
            >
              Route & Cost Estimator
            </button>
            <button
              onClick={() => handleNavClick('trust-safety')}
              className="text-left py-2 px-3 rounded-lg hover:bg-slate-50 flex items-center gap-2"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Trust & OTP Safety
            </button>
          </div>

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2.5">
            <Button
              variant="outline"
              onClick={() => {
                setMobileMenuOpen(false);
                navigate('/auth?role=driver');
              }}
              leftIcon={<Truck className="w-4 h-4 text-emerald-600" />}
              className="w-full justify-center"
            >
              Earn With Your Vehicle
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                setMobileMenuOpen(false);
                navigate('/auth?role=customer');
              }}
              leftIcon={<Package className="w-4 h-4" />}
              className="w-full justify-center"
            >
              Send Cargo Now
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};
