import React from 'react';
import { Card } from '../common/Card';
import { 
  TrendingDown, 
  Truck, 
  Route, 
  Banknote, 
  ShieldCheck, 
  KeyRound, 
  Check 
} from 'lucide-react';

export const ValueProposition: React.FC = () => {
  const values = [
    {
      icon: <TrendingDown className="w-6 h-6 text-emerald-600" />,
      title: 'Lower Transportation Costs',
      description: 'Why pay full truckload rates for small or medium parcels? Pay only for the exact kilograms and cubic space you consume on an already-moving vehicle.',
      perks: ['Up to 40% cheaper than traditional couriers', 'No minimum chartered vehicle fees', 'Transparent per-kg pricing'],
      badge: 'Cost Efficiency',
    },
    {
      icon: <Truck className="w-6 h-6 text-blue-600" />,
      title: 'Better Vehicle Capacity Utilization',
      description: 'Over 45% of commercial trucks and vans run with unused payload space. CargoMatch aggregates distributed demand to maximize utilization.',
      perks: ['Monetizes idle bed space', 'Boosts driver yield per kilometer', 'Reduces carbon footprint per parcel'],
      badge: 'Capacity Optimization',
    },
    {
      icon: <Route className="w-6 h-6 text-indigo-600" />,
      title: 'Smart Highway Corridor Matching',
      description: 'Our scoring engine aligns origin, destination, and departure windows to ensure 0 detour delays and rapid direct transit.',
      perks: ['Exact corridor alignment', 'Open Body & Closed Container filters', 'Time-slot compatibility filter'],
      badge: 'Intelligent Routing',
    },
    {
      icon: <Banknote className="w-6 h-6 text-amber-600" />,
      title: 'Transparent, Upfront Pricing',
      description: 'No hidden surge pricing, toll surprises, or surprise fuel surcharges. What you see is what you pay upon booking confirmation.',
      perks: ['Instant pricing calculation', 'Return-trip discounts applied automatically', 'Direct driver payment settlement'],
      badge: 'Zero Hidden Fees',
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-purple-600" />,
      title: 'Verified Commercial Drivers',
      description: 'Every driver undergoes strict registration review, vehicle RC inspection, license verification, and peer rating assessments.',
      perks: ['Verified driving licenses & RC books', 'Historical reliability score', 'Direct phone communication'],
      badge: 'Driver Trust',
    },
    {
      icon: <KeyRound className="w-6 h-6 text-rose-600" />,
      title: 'Secure OTP Handshake Delivery',
      description: 'Packages are strictly marked delivered only when the recipient shares the dynamic 4-digit OTP directly with the driver at handover.',
      perks: ['Proof of physical handover', 'Prevents misplaced or fake deliveries', 'Timestamped milestone audit trail'],
      badge: 'Anti-Theft Security',
    },
  ];

  return (
    <section id="why-cargmatch" className="py-20 lg:py-28 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold uppercase tracking-wider">
            Built For Indian Logistics Realities
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Why Choose CargoMatch?
          </h2>
          <p className="text-base sm:text-lg text-slate-600">
            We replace empty vehicle trips and overpriced logistics with high-efficiency capacity matching.
          </p>
        </div>

        {/* 6-Grid Value Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-14">
          {values.map((v, idx) => (
            <Card
              key={idx}
              className="p-6 border-slate-200/90 hover:border-blue-300 hover:shadow-elevated transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 shadow-subtle">
                    {v.icon}
                  </div>
                  <span className="text-[11px] font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full">
                    {v.badge}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  {v.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-6">
                  {v.description}
                </p>
              </div>

              {/* Perks list */}
              <div className="pt-4 border-t border-slate-100 space-y-2">
                {v.perks.map((perk, pIdx) => (
                  <div key={pIdx} className="flex items-start gap-2 text-xs text-slate-700">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{perk}</span>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>

      </div>
    </section>
  );
};
