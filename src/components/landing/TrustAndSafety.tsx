import React from 'react';
import { Card } from '../common/Card';
import { 
  ShieldCheck, 
  KeyRound, 
  Star, 
  FileCheck, 
  Clock, 
  PhoneCall,
  CheckCircle2,
  Lock
} from 'lucide-react';

export const TrustAndSafety: React.FC = () => {
  const safetyFeatures = [
    {
      icon: <FileCheck className="w-6 h-6 text-blue-600" />,
      title: 'Rigorous Driver & Vehicle Vetting',
      description: 'Every driver undergoes digital ID verification, commercial Driving License validation, and Vehicle Registration (RC) checks before accepting cargo.',
      points: ['Valid DL & commercial vehicle RC', 'Background & identity verification', 'Vehicle dimension checks'],
    },
    {
      icon: <KeyRound className="w-6 h-6 text-emerald-600" />,
      title: 'Encrypted OTP Delivery Handshake',
      description: 'Zero stolen or disputed packages. A unique single-use 4-digit OTP is issued to the recipient. Driver cannot complete booking without verifying the OTP.',
      points: ['Direct recipient verification', 'Immediate proof-of-delivery timestamp', 'Escrow payment safety'],
    },
    {
      icon: <Star className="w-6 h-6 text-amber-500" />,
      title: 'Transparent Community Ratings',
      description: 'Both shippers and drivers build verified reputation scores based on punctuality, cargo care, and communication for full transparency.',
      points: ['100% verified booking reviews', 'Driver punctuality score', 'Public profile badges'],
    },
    {
      icon: <Clock className="w-6 h-6 text-purple-600" />,
      title: 'Real-Time Milestone Updates',
      description: 'Instant notification triggers for every transit stage: Booking Accepted → Cargo Picked Up → In Transit → Out for Delivery → Delivered.',
      points: ['Live Supabase Realtime sync', 'SMS & in-app alerts', 'Transparent corridor tracking'],
    },
  ];

  return (
    <section id="trust-safety" className="py-20 lg:py-28 bg-slate-900 text-white relative overflow-hidden">
      {/* Subtle Glow */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-emerald-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-bold uppercase tracking-wider">
            <Lock className="w-3.5 h-3.5" />
            Enterprise-Grade Trust & Safety
          </div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
            Built On Security, Verified At Every Kilometer
          </h2>
          <p className="text-base sm:text-lg text-slate-300">
            Logistics requires unconditional trust. CargMatch protects every sender and vehicle operator with end-to-end verification.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-14">
          {safetyFeatures.map((feat, idx) => (
            <div
              key={idx}
              className="rounded-2xl bg-slate-950/70 border border-slate-800 p-6 sm:p-8 hover:border-slate-700 transition-all space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-blue-400">
                  {feat.icon}
                </div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Protocol {idx + 1}
                </span>
              </div>

              <h3 className="text-xl font-bold text-white">
                {feat.title}
              </h3>

              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                {feat.description}
              </p>

              <div className="pt-4 border-t border-slate-800/80 space-y-2">
                {feat.points.map((pt, pIdx) => (
                  <div key={pIdx} className="flex items-center gap-2 text-xs text-slate-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>{pt}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Support hotline */}
        <div className="mt-12 p-5 rounded-2xl bg-blue-950/40 border border-blue-800/50 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-600 text-white shrink-0">
              <PhoneCall className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">24/7 Dedicated Logistics Helpline</p>
              <p className="text-xs text-slate-400">Direct support for shippers and drivers during transit</p>
            </div>
          </div>
          <span className="text-xs font-mono font-bold bg-blue-900/60 px-3 py-1.5 rounded-lg border border-blue-700/60 text-blue-200">
            Emergency Transit Assistance: +91 (040) 8000-CARG
          </span>
        </div>

      </div>
    </section>
  );
};
