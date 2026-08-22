import React, { useState } from 'react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { 
  Sparkles, 
  Route, 
  Truck, 
  Calendar, 
  Banknote, 
  Star, 
  Layers, 
  CheckCircle2,
  ChevronRight,
  Info
} from 'lucide-react';
import { calculateMatchScore } from '../../lib/matching';
import { MOCK_TRIPS } from '../../lib/mockData';

export const AiMatchingSection: React.FC = () => {
  const [selectedFactor, setSelectedFactor] = useState<number>(0);

  const sampleMatch = calculateMatchScore(MOCK_TRIPS[0], {
    source: 'Hyderabad',
    destination: 'Bengaluru',
    weight: 5,
    pickup_date: new Date().toISOString(),
    category: 'Electronics & Appliances',
    fragile: true,
  });

  const factors = [
    {
      name: 'Route Compatibility',
      weight: '40%',
      icon: <Route className="w-5 h-5 text-blue-600" />,
      detail: 'Evaluates direct origin-destination matching and shared expressway corridors to ensure 0 detour delays.',
    },
    {
      name: 'Capacity Compatibility',
      weight: '20%',
      icon: <Truck className="w-5 h-5 text-emerald-600" />,
      detail: 'Checks vehicle payload limit (kg) and dimensions to ensure cargo fits without displacing existing commitments.',
    },
    {
      name: 'Schedule Compatibility',
      weight: '15%',
      icon: <Calendar className="w-5 h-5 text-indigo-600" />,
      detail: 'Aligns customer required pickup date with the driver\'s exact scheduled departure calendar window.',
    },
    {
      name: 'Price & Value Factor',
      weight: '10%',
      icon: <Banknote className="w-5 h-5 text-amber-600" />,
      detail: 'Scores shared rate value, applies return-trip discounts (up to 40% off), and calculates per-kg cost efficiency.',
    },
    {
      name: 'Driver Rating & History',
      weight: '10%',
      icon: <Star className="w-5 h-5 text-purple-600" />,
      detail: 'Factors in lifetime OTP delivery verification rate, customer satisfaction rating (1–5 stars), and completed trip count.',
    },
    {
      name: 'Vehicle & Body Type Suitability',
      weight: '5%',
      icon: <Layers className="w-5 h-5 text-rose-600" />,
      detail: 'Matches cargo category (e.g. Fragile electronics in Closed Container vs Bulk hardware in Open Body vehicles).',
    },
  ];

  return (
    <section id="ai-matching" className="py-20 lg:py-28 bg-slate-50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-blue-600" />
            Transparent Scoring Architecture
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            How The Smart Matching Engine Works
          </h2>
          <p className="text-base sm:text-lg text-slate-600">
            CargoMatch intelligently ranks available vehicles using a multi-factor weighted scoring model — transparent, predictable, and engineered for high reliability.
          </p>
        </div>

        {/* Two Column Engine Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mt-14">
          
          {/* Left: Factors list */}
          <div className="lg:col-span-6 space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-2 flex items-center gap-1.5">
              <Info className="w-4 h-4 text-blue-600" />
              Weighted Compatibility Factors (Total: 100%)
            </div>

            {factors.map((factor, idx) => (
              <div
                key={idx}
                onClick={() => setSelectedFactor(idx)}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                  selectedFactor === idx
                    ? 'bg-white border-blue-600 shadow-md ring-1 ring-blue-600/20'
                    : 'bg-white/80 border-slate-200/80 hover:bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 shadow-subtle shrink-0">
                    {factor.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-slate-900">{factor.name}</h3>
                      <span className="text-xs font-black text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                        {factor.weight}
                      </span>
                    </div>
                    <p className="text-xs text-slate-700 mt-1 line-clamp-2">{factor.detail}</p>
                  </div>
                </div>
                <ChevronRight className={`w-5 h-5 shrink-0 transition-transform ${selectedFactor === idx ? 'text-blue-600 translate-x-1' : 'text-slate-500'}`} />
              </div>
            ))}
          </div>

          {/* Right: Live Match Card Visualizer */}
          <div className="lg:col-span-6">
            <Card className="border-slate-200 shadow-elevated overflow-hidden bg-white">
              {/* Header */}
              <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-blue-400 block">
                    AI Match Result Demo
                  </span>
                  <p className="text-base font-bold text-white mt-0.5">
                    Tata Ace (Closed Container) • Hyderabad → Bengaluru
                  </p>
                </div>
                <div className="text-right">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-600 text-white text-xs font-black shadow-sm">
                    <Sparkles className="w-3.5 h-3.5" />
                    {sampleMatch.match_score}% Match
                  </div>
                  <span className="text-[10px] text-emerald-400 block mt-1 font-semibold">
                    ✓ Best Match Ranked #1
                  </span>
                </div>
              </div>

              {/* Factors Progress Bars */}
              <div className="p-6 space-y-5">
                <div className="space-y-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                    Scoring Breakdown
                  </span>

                  {sampleMatch.factors.map((f, i) => (
                    <div key={i} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-slate-700">{f.name} ({f.weight}%)</span>
                        <span className="font-bold text-slate-900">{f.score}/100</span>
                      </div>
                      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div
                          style={{ width: `${f.score}%` }}
                          className={`h-full rounded-full ${
                            f.score >= 90
                              ? 'bg-emerald-500'
                              : f.score >= 70
                              ? 'bg-blue-600'
                              : 'bg-amber-500'
                          }`}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* "Why This Match?" Section */}
                <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-100 space-y-2.5">
                  <span className="text-xs font-bold text-blue-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                    Why this match?
                  </span>
                  <div className="space-y-1.5">
                    {sampleMatch.reasons.map((reason, rIdx) => (
                      <div key={rIdx} className="flex items-start gap-2 text-xs text-slate-700 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                        <span>{reason}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </div>

        </div>

      </div>
    </section>
  );
};
