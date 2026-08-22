import React from 'react';
import { TrendingDown, Truck, Route, ShieldCheck, Zap } from 'lucide-react';

export const MetricsBar: React.FC = () => {
  const metrics = [
    {
      icon: <TrendingDown className="w-5 h-5 text-emerald-600" />,
      value: 'Up to 40%',
      label: 'Lower Logistics Cost',
      sublabel: 'Compared to dedicated freight & courier rates',
    },
    {
      icon: <Truck className="w-5 h-5 text-blue-600" />,
      value: '68%',
      label: 'Vehicle Capacity Used',
      sublabel: 'Eliminates wasted empty payload space',
    },
    {
      icon: <Route className="w-5 h-5 text-amber-600" />,
      value: '15,000+ km',
      label: 'Return Trips Monetized',
      sublabel: 'Converting deadhead miles to driver income',
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-indigo-600" />,
      value: '100% OTP',
      label: 'Verified Delivery Handshake',
      sublabel: 'Direct handover confirmed at doorstep',
    },
  ];

  return (
    <section className="py-12 bg-white border-y border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
          {metrics.map((metric, idx) => (
            <div
              key={idx}
              className={`flex flex-col items-center sm:items-start text-center sm:text-left ${
                idx > 0 ? 'sm:pl-8 pt-6 sm:pt-0' : ''
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70 shadow-subtle">
                  {metric.icon}
                </div>
                <span className="text-3xl font-black text-slate-900 tracking-tight">
                  {metric.value}
                </span>
              </div>
              <p className="font-bold text-sm text-slate-800">{metric.label}</p>
              <p className="text-xs text-slate-500 mt-0.5">{metric.sublabel}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
