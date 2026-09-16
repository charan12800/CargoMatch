import React, { useState } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { NotificationsDropdown } from '../components/layout/NotificationsDropdown';
import { 
  Truck, 
  Package, 
  LayoutDashboard, 
  PlusCircle, 
  MapPin, 
  Banknote, 
  LogOut, 
  Menu, 
  X, 
  Sparkles, 
  ArrowLeftRight,
  ShieldCheck
} from 'lucide-react';
import { BackendStatusBadge } from '../components/common/BackendStatusBadge';
import { Button } from '../components/common/Button';

export const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, userRole, switchRole } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const customerNavItems = [
    { name: 'Dashboard', path: '/customer', icon: <LayoutDashboard className="w-5 h-5" /> },
    { name: 'Send Cargo', path: '/customer/send-cargo', icon: <PlusCircle className="w-5 h-5 text-blue-600" /> },
    { name: 'My Bookings', path: '/customer/bookings', icon: <Package className="w-5 h-5" /> },
    { name: 'Track Delivery', path: '/customer/track', icon: <MapPin className="w-5 h-5 text-amber-600" /> },
  ];

  const driverNavItems = [
    { name: 'Dashboard', path: '/driver', icon: <LayoutDashboard className="w-5 h-5" /> },
    { name: 'Post Trip', path: '/driver/post-trip', icon: <PlusCircle className="w-5 h-5 text-emerald-600" /> },
    { name: 'Delivery Requests', path: '/driver/requests', icon: <Package className="w-5 h-5" /> },
    { name: 'My Trips', path: '/driver/trips', icon: <Truck className="w-5 h-5" /> },
    { name: 'Earnings', path: '/driver/earnings', icon: <Banknote className="w-5 h-5 text-emerald-600" /> },
  ];

  const navItems = userRole === 'customer' ? customerNavItems : driverNavItems;

  const handleRoleToggle = () => {
    const nextRole = userRole === 'customer' ? 'driver' : 'customer';
    switchRole(nextRole);
    navigate(nextRole === 'customer' ? '/customer' : '/driver');
  };

  return (
    <div className="min-h-screen bg-slate-100/70 flex flex-col">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-subtle">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Left: Mobile Toggle & Brand */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm">
                <Truck className="w-5 h-5" />
              </div>
              <span className="text-xl font-black text-slate-900 hidden sm:inline-block">
                Cargo<span className="text-blue-600">Match</span>
              </span>
            </Link>

            {/* Portal Badge */}
            <div className="hidden sm:flex items-center gap-2 pl-3 border-l border-slate-200">
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                userRole === 'customer'
                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                  : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              }`}>
                {userRole === 'customer' ? '👤 Customer Portal' : '🚛 Driver & Fleet Portal'}
              </span>
            </div>
          </div>

          {/* Right: Backend Status, Role Switcher, Notifications & Profile */}
          <div className="flex items-center gap-3">
            <BackendStatusBadge />

            <Button
              variant="outline"
              size="sm"
              onClick={handleRoleToggle}
              leftIcon={<ArrowLeftRight className="w-3.5 h-3.5" />}
              className="text-xs font-bold border-slate-300"
            >
              <span className="hidden md:inline">Switch to </span>
              {userRole === 'customer' ? 'Driver View' : 'Customer View'}
            </Button>

            <NotificationsDropdown />

            {/* Profile Avatar */}
            <div className="flex items-center gap-2.5 pl-2">
              <div className="w-9 h-9 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center border-2 border-white shadow-sm">
                {currentUser.full_name.charAt(0)}
              </div>
              <div className="hidden lg:block text-left">
                <p className="text-xs font-bold text-slate-900 leading-tight">
                  {currentUser.full_name}
                </p>
                <p className="text-[10px] text-slate-500 capitalize">
                  {currentUser.role}
                </p>
              </div>
            </div>

            <Link
              to="/"
              className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              title="Return to Home"
            >
              <LogOut className="w-4 h-4" />
            </Link>
          </div>

        </div>
      </header>

      {/* Main App Body with Sidebar & Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full flex-grow flex gap-6">
        
        {/* Desktop Sidebar Navigation */}
        <aside className="hidden lg:block w-64 shrink-0 space-y-6">
          <nav className="bg-white rounded-2xl border border-slate-200/80 shadow-card p-3 space-y-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? userRole === 'customer'
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'bg-emerald-600 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <span className={isActive ? 'text-white' : ''}>{item.icon}</span>
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </nav>

          <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-card space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-blue-400">
              <Sparkles className="w-4 h-4" />
              <span>CargoMatch Advantage</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {userRole === 'customer'
                ? 'Save up to 40% by booking vehicles already heading your way.'
                : 'Turn empty return miles into guaranteed earnings.'}
            </p>
            <div className="pt-2 border-t border-slate-700/80 flex items-center justify-between text-[11px] text-slate-400">
              <span>Security</span>
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> OTP Protected
              </span>
            </div>
          </div>
        </aside>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex">
            <div className="w-72 bg-white h-full p-6 shadow-2xl flex flex-col justify-between animate-in slide-in-from-left duration-200">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                      <Truck className="w-4 h-4" />
                    </div>
                    <span className="font-black text-slate-900">CargoMatch</span>
                  </div>
                  <button onClick={() => setMobileMenuOpen(false)} className="p-1 rounded-lg text-slate-500">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <nav className="space-y-1">
                  {navItems.map((item) => (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold ${
                        location.pathname === item.path
                          ? 'bg-blue-600 text-white'
                          : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {item.icon}
                      <span>{item.name}</span>
                    </NavLink>
                  ))}
                </nav>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    handleRoleToggle();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-xs font-bold"
                >
                  Switch to {userRole === 'customer' ? 'Driver Portal' : 'Customer Portal'}
                </Button>
              </div>
            </div>
            <div className="flex-1" onClick={() => setMobileMenuOpen(false)} />
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 min-w-0">
          {children}
        </main>

      </div>
    </div>
  );
};
