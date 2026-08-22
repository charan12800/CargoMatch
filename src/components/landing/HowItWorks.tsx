import React, { useState } from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { useNavigate } from 'react-router-dom';
import { 
  Package, 
  Sparkles, 
  CheckCircle2, 
  MapPin, 
  KeyRound, 
  Truck, 
  Route, 
  BellRing, 
  Banknote, 
  ArrowRight
} from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const [activeRole, setActiveRole] = useState<'customer' | 'driver'>('customer');
  const navigate = useNavigate();

  const customerSteps = [
    {
      step: '01',
      title: 'Create Delivery Request',
      description: 'Enter your pickup and destination cities, detailed door-to-door address, package weight, category, and schedule.',
      icon: <Package className="w-6 h-6 text-blue-600" />,
      badge: 'Step 1: Input Route',
      highlight: 'Structured Addresses',
    },
    {
      step: '02',
      title: 'AI Finds Available Vehicles',
      description: 'Our engine scans active trips already travelling that corridor and calculates real compatibility scores.',
      icon: <Sparkles className="w-6 h-6 text-indigo-600" />,
      badge: 'Step 2: Transparent Match',
      highlight: '98% Route & Capacity Fit',
    },
    {
      step: '03',
      title: 'Book Unused Cargo Space',
      description: 'Choose between Open Body and Closed Container vehicles, review driver ratings, and reserve space at shared rates.',
      icon: <CheckCircle2 className="w-6 h-6 text-emerald-600" />,
      badge: 'Step 3: Instant Booking',
      highlight: 'Open / Closed Body Options',
    },
    {
      step: '04',
      title: 'Live Milestone Tracking',
      description: 'Monitor cargo pickup, highway transit status, and estimated delivery timeline in real time.',
      icon: <MapPin className="w-6 h-6 text-amber-600" />,
      badge: 'Step 4: Status Updates',
      highlight: 'Live Highway Checkpoints',
    },
    {
      step: '05',
      title: 'OTP Verified Delivery',
      description: 'Share your secure 4-digit OTP with the driver upon physical handover to confirm safe arrival.',
      icon: <KeyRound className="w-6 h-6 text-purple-600" />,
      badge: 'Step 5: Secure Handover',
      highlight: '100% Guaranteed Handshake',
    },
  ];

  const driverSteps = [
    {
      step: '01',
      title: 'Post Your Planned Trip',
      description: 'Enter your origin, destination, vehicle model, Open/Closed body type, calendar departure time, and available capacity.',
      icon: <Route className="w-6 h-6 text-emerald-600" />,
      badge: 'Step 1: Route & Body Type',
      highlight: 'E.g., Tata Ace (Closed Container)',
    },
    {
      step: '02',
      title: 'Toggle "Empty Return Trip"',
      description: 'Travelling back with empty payload? Mark it to unlock high-intent cargo requests along your return highway.',
      icon: <Truck className="w-6 h-6 text-amber-600" />,
      badge: 'Step 2: Return Monetization',
      highlight: 'Zero Deadhead Miles',
    },
    {
      step: '03',
      title: 'Receive & Accept Requests',
      description: 'Review matched cargo packages, sender details, weight requirements, and accept with 1 click.',
      icon: <BellRing className="w-6 h-6 text-blue-600" />,
      badge: 'Step 3: Demand Matching',
      highlight: 'Automatic Capacity Deduct',
    },
    {
      step: '04',
      title: 'Transport On Existing Route',
      description: 'Pick up the package at the designated stop and transport it without deviating from your existing journey.',
      icon: <CheckCircle2 className="w-6 h-6 text-indigo-600" />,
      badge: 'Step 4: Smooth Transit',
      highlight: 'Zero Route Detours',
    },
    {
      step: '05',
      title: 'Verify OTP & Earn Income',
      description: 'Enter the customer OTP at the destination to immediately verify handover and receive payout credit.',
      icon: <Banknote className="w-6 h-6 text-emerald-600" />,
      badge: 'Step 5: Instant Earning',
      highlight: 'Direct Driver Payout',
    },
  ];

  const currentSteps = activeRole === 'customer' ? customerSteps : driverSteps;

  return (
    <section id="how-it-works" className="py-20 lg:py-28 bg-slate-50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold uppercase tracking-wider">
            Clear, Transparent Workflow
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            How CargoMatch Works
          </h2>
          <p className="text-base sm:text-lg text-slate-600">
            A frictionless shared-capacity marketplace designed for shippers and drivers travelling along identical highway corridors.
          </p>

          {/* Interactive Role Switcher Tabs */}
          <div className="inline-flex p-1.5 bg-slate-200/80 rounded-2xl shadow-inner mt-4">
            <button
              onClick={() => setActiveRole('customer')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all duration-200 cursor-pointer ${
                activeRole === 'customer'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              <Package className="w-4 h-4" />
              For Customers (Senders)
            </button>
            <button
              onClick={() => setActiveRole('driver')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all duration-200 cursor-pointer ${
                activeRole === 'driver'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              <Truck className="w-4 h-4" />
              For Drivers & Vehicle Owners
            </button>
          </div>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 mt-14">
          {currentSteps.map((item, idx) => (
            <Card
              key={idx}
              className="relative flex flex-col justify-between border-slate-200/90 hover:border-blue-400/80 hover:shadow-elevated transition-all duration-200"
            >
              <div className="p-5 pb-3">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-black text-slate-300 font-mono">
                    {item.step}
                  </span>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 shadow-subtle">
                    {item.icon}
                  </div>
                </div>

                <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wide block mb-1">
                  {item.badge}
                </span>
                <h3 className="text-base font-bold text-slate-900 mb-2 leading-snug">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="p-4 pt-0 mt-auto">
                <div className="p-2 rounded-lg bg-slate-50 border border-slate-100 text-[11px] font-semibold text-slate-700 flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  <span className="truncate">{item.highlight}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Bottom CTA for Active Role */}
        <div className="mt-12 text-center">
          {activeRole === 'customer' ? (
            <Button
              variant="primary"
              size="lg"
              onClick={() => navigate('/auth?role=customer')}
              rightIcon={<ArrowRight className="w-4 h-4" />}
              className="shadow-md font-bold"
            >
              Start Sending Cargo Now
            </Button>
          ) : (
            <Button
              variant="emerald"
              size="lg"
              onClick={() => navigate('/auth?role=driver')}
              rightIcon={<ArrowRight className="w-4 h-4" />}
              className="shadow-md font-bold"
            >
              Post Your Available Vehicle Capacity
            </Button>
          )}
        </div>

      </div>
    </section>
  );
};
