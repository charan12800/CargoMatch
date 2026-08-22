import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { CapacityMeter } from '../common/CapacityMeter';
import { 
  Truck, 
  Package, 
  ArrowRight, 
  Sparkles, 
  MapPin, 
  ShieldCheck, 
  Star, 
  CheckCircle2, 
  TrendingDown, 
  Navigation 
} from 'lucide-react';

export const HeroSection: React.FC = () => {
  const navigate = useNavigate();
  const [source, setSource] = useState('Hyderabad');
  const [destination, setDestination] = useState('Bengaluru');
  const [weight, setWeight] = useState('5');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/auth?role=customer&source=${encodeURIComponent(source.trim())}&destination=${encodeURIComponent(destination.trim())}&weight=${encodeURIComponent(weight)}`);
  };

  return (
    <section className="relative overflow-hidden pt-8 pb-20 lg:pt-14 lg:pb-28 bg-gradient-to-b from-slate-50 via-blue-50/20 to-white">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 bg-dot-pattern opacity-60 pointer-events-none" />
      <div className="absolute top-1/4 -right-40 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -left-40 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Core Value & Pitch */}
          <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
            {/* Value Tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100/80 border border-blue-200 text-blue-800 text-xs sm:text-sm font-semibold shadow-sm">
              <Sparkles className="w-4 h-4 text-blue-600 animate-pulse" />
              <span>Next-Gen Shared-Capacity Logistics</span>
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
              <span className="text-blue-700 font-medium">India's Smart Capacity Marketplace</span>
            </div>

            {/* Main Headline */}
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.1]">
                Match Cargo.{' '}
                <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 bg-clip-text text-transparent">
                  Move Smarter.
                </span>
              </h1>

              <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                CargoMatch connects your cargo with vehicles already travelling your route, helping reduce logistics costs and make unused vehicle capacity productive.
              </p>
            </div>

            {/* Core Differentiator Callout */}
            <div className="p-4 rounded-xl bg-slate-900 text-white shadow-card max-w-xl mx-auto lg:mx-0 flex items-start gap-3.5 border border-slate-800 text-left">
              <div className="p-2 rounded-lg bg-blue-600 text-white shrink-0 mt-0.5">
                <Navigation className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-blue-400">
                  The CargoMatch Difference
                </p>
                <p className="text-sm font-medium text-slate-200 mt-0.5">
                  "Don't send another vehicle. Match with one already going your way."
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Button
                variant="primary"
                size="lg"
                onClick={() => navigate('/auth?role=customer')}
                leftIcon={<Package className="w-5 h-5" />}
                rightIcon={<ArrowRight className="w-4 h-4" />}
                className="w-full sm:w-auto shadow-md"
              >
                Send Cargo
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate('/auth?role=driver')}
                leftIcon={<Truck className="w-5 h-5 text-emerald-600" />}
                className="w-full sm:w-auto border-slate-300 font-semibold text-slate-800 hover:bg-slate-50"
              >
                Earn With Your Vehicle
              </Button>
            </div>

            {/* Proof Badges */}
            <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs font-medium text-slate-600">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Up to 40% Lower Costs</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
                <span>OTP Verified Delivery</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Star className="w-4 h-4 text-amber-500 fill-amber-500 shrink-0" />
                <span>4.9/5 Verified Driver Rating</span>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Capacity Match Visualizer */}
          <div className="lg:col-span-5">
            <div className="relative">
              <div className="absolute -inset-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl blur-md opacity-25" />

              <div className="relative bg-white rounded-2xl border border-slate-200/90 shadow-elevated overflow-hidden">
                {/* Visual Card Header */}
                <div className="bg-slate-900 p-5 text-white flex items-center justify-between border-b border-slate-800">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-2.5 w-2.5 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                    </span>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
                      Live Route Match Simulation
                    </span>
                  </div>
                  <Badge variant="match" size="sm">
                    98% Match
                  </Badge>
                </div>

                {/* Simulated Match Data */}
                <div className="p-6 space-y-6">
                  {/* Route Indicator */}
                  <div className="flex items-center justify-between bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-blue-600 shrink-0" />
                      <span className="font-bold text-slate-900 text-sm">{source || 'Hyderabad'}</span>
                    </div>
                    <div className="flex flex-col items-center px-2">
                      <span className="text-[10px] uppercase font-semibold text-slate-600">Highway Run</span>
                      <div className="w-16 h-0.5 bg-blue-400 relative my-1">
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-blue-600 rotate-45" />
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span className="font-bold text-slate-900 text-sm">{destination || 'Bengaluru'}</span>
                    </div>
                  </div>

                  {/* Vehicle & Capacity Status */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-sm border border-blue-100">
                          <Truck className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-slate-900 text-sm">Tata Ace</span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                              Closed Container
                            </span>
                            <Badge variant="warning" size="sm">Return Trip</Badge>
                          </div>
                          <p className="text-xs text-slate-600">Driver: Rajesh Verma (4.9 ★ • 128 trips)</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-50/70 p-3 rounded-xl border border-slate-100">
                      <CapacityMeter 
                        totalCapacity={750} 
                        availableCapacity={450} 
                        matchedCargoWeight={Number(weight) || 5} 
                      />
                    </div>
                  </div>

                  {/* Matched Cargo & Pricing Preview */}
                  <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-4">
                    <div className="bg-blue-50/60 p-3 rounded-xl border border-blue-100/80">
                      <span className="text-[11px] text-blue-800 font-semibold block">Your Cargo Match</span>
                      <span className="text-sm font-bold text-slate-900 flex items-center gap-1.5 mt-0.5">
                        <Package className="w-3.5 h-3.5 text-blue-600" />
                        {weight} kg Electronics
                      </span>
                      <span className="text-[10px] text-emerald-700 font-medium block mt-1">
                        Departs Tomorrow, 06:30 AM
                      </span>
                    </div>

                    <div className="bg-emerald-50/60 p-3 rounded-xl border border-emerald-100/80">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] text-emerald-900 font-semibold">Shared Rate</span>
                        <span className="text-[10px] text-emerald-800 font-bold flex items-center">
                          <TrendingDown className="w-3 h-3 mr-0.5" /> 40% OFF
                        </span>
                      </div>
                      <span className="text-lg font-black text-slate-900 block mt-0.5">
                        ₹1,200 <span className="text-xs font-normal text-slate-600 line-through">₹2,000</span>
                      </span>
                      <span className="text-[10px] text-slate-600 block">vs dedicated courier</span>
                    </div>
                  </div>

                  {/* Manual Route Search Form (No dropdowns) */}
                  <form onSubmit={handleSearch} className="pt-2 space-y-3">
                    <div className="grid grid-cols-3 gap-2">
                      <div className="col-span-1">
                        <label className="text-[10px] font-bold text-slate-600 uppercase block mb-1">Pickup City</label>
                        <input
                          type="text"
                          required
                          value={source}
                          onChange={(e) => setSource(e.target.value)}
                          placeholder="e.g. Hyderabad"
                          className="w-full text-xs font-bold bg-slate-50 border border-slate-200 rounded-lg p-2 focus:ring-1 focus:ring-blue-600 outline-none"
                        />
                      </div>
                      <div className="col-span-1">
                        <label className="text-[10px] font-bold text-slate-600 uppercase block mb-1">Destination</label>
                        <input
                          type="text"
                          required
                          value={destination}
                          onChange={(e) => setDestination(e.target.value)}
                          placeholder="e.g. Bengaluru"
                          className="w-full text-xs font-bold bg-slate-50 border border-slate-200 rounded-lg p-2 focus:ring-1 focus:ring-blue-600 outline-none"
                        />
                      </div>
                      <div className="col-span-1">
                        <label className="text-[10px] font-bold text-slate-600 uppercase block mb-1">Weight (kg)</label>
                        <input
                          type="number"
                          min={1}
                          required
                          value={weight}
                          onChange={(e) => setWeight(e.target.value)}
                          className="w-full text-xs font-bold bg-slate-50 border border-slate-200 rounded-lg p-2 focus:ring-1 focus:ring-blue-600 outline-none"
                        />
                      </div>
                    </div>

                    <Button
                      type="submit"
                      variant="primary"
                      size="md"
                      className="w-full shadow-sm font-bold"
                      rightIcon={<ArrowRight className="w-4 h-4" />}
                    >
                      Find Available Vehicle Matches
                    </Button>
                  </form>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
