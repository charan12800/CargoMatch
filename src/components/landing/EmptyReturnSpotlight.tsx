import React from 'react';
import { Button } from '../common/Button';
import { useNavigate } from 'react-router-dom';
import { 
  RotateCcw, 
  XCircle, 
  CheckCircle2, 
  ArrowRight, 
  Truck, 
  Sparkles 
} from 'lucide-react';

export const EmptyReturnSpotlight: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section id="empty-returns" className="py-20 lg:py-28 bg-slate-900 text-white relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-bold uppercase tracking-wider">
            <RotateCcw className="w-4 h-4 text-amber-400" />
            Game-Changing Feature: Return Trip Monetization
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
            "Your vehicle is returning empty?{' '}
            <span className="text-amber-400">Let it carry cargo instead."</span>
          </h2>
          <p className="text-base sm:text-lg text-slate-300">
            Every day, thousands of commercial trucks, vans, and pickups drive back to their base with zero payload. CargoMatch turns wasted return miles into high-margin profit.
          </p>
        </div>

        {/* Side-by-Side Comparison Box */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-14">
          
          {/* Traditional Way */}
          <div className="rounded-2xl bg-slate-950/80 border border-red-500/30 p-6 sm:p-8 relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-red-950/80 border border-red-800/60 text-red-400 text-xs font-bold flex items-center gap-1.5">
              <XCircle className="w-3.5 h-3.5" />
              Traditional Empty Return (Deadhead)
            </div>

            <div className="space-y-4">
              <div className="p-3 w-fit rounded-xl bg-red-950/50 border border-red-800/40 text-red-400">
                <Truck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">
                Zero Revenue, Full Expenses
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                You complete a delivery from Bengaluru to Hyderabad. On the way back, your truck bed is completely empty.
              </p>

              <div className="space-y-3 pt-4 border-t border-slate-800 text-xs sm:text-sm text-slate-300">
                <div className="flex items-center gap-2.5 text-red-300">
                  <XCircle className="w-4 h-4 shrink-0 text-red-500" />
                  <span><strong>Fuel Cost:</strong> 100% borne out of pocket (~₹6,500)</span>
                </div>
                <div className="flex items-center gap-2.5 text-red-300">
                  <XCircle className="w-4 h-4 shrink-0 text-red-500" />
                  <span><strong>Highway Tolls:</strong> Unrecovered expense (~₹1,200)</span>
                </div>
                <div className="flex items-center gap-2.5 text-red-300">
                  <XCircle className="w-4 h-4 shrink-0 text-red-500" />
                  <span><strong>Driver Time:</strong> 10+ hours driving with ₹0 added revenue</span>
                </div>
              </div>
            </div>

            <div className="mt-8 p-4 rounded-xl bg-red-950/40 border border-red-900/50 flex items-center justify-between text-xs">
              <span className="text-red-400 font-medium">Net Return Trip Outcome:</span>
              <span className="text-red-300 font-bold font-mono text-sm">-₹7,700 Loss on Return</span>
            </div>
          </div>

          {/* The CargoMatch Solution */}
          <div className="rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950/60 border border-amber-500/50 p-6 sm:p-8 relative overflow-hidden shadow-glow flex flex-col justify-between">
            <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              CargoMatch Return Trip Match
            </div>

            <div className="space-y-4">
              <div className="p-3 w-fit rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-400">
                <RotateCcw className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">
                Monetize Unused Return Space
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Toggle "Empty Return Trip" when leaving your drop-off. CargoMatch fills your available payload with verified packages headed back to your base.
              </p>

              <div className="space-y-3 pt-4 border-t border-slate-800 text-xs sm:text-sm text-slate-200">
                <div className="flex items-center gap-2.5 text-emerald-400">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                  <span><strong>Fuel & Tolls Covered:</strong> 100% paid by matched cargo</span>
                </div>
                <div className="flex items-center gap-2.5 text-emerald-400">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                  <span><strong>Extra Net Earnings:</strong> +₹4,500 to ₹12,000 per return leg</span>
                </div>
                <div className="flex items-center gap-2.5 text-emerald-400">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                  <span><strong>Customer Discount:</strong> Sender saves up to 40% on shipping</span>
                </div>
              </div>
            </div>

            <div className="mt-8 p-4 rounded-xl bg-emerald-950/50 border border-emerald-500/40 flex items-center justify-between text-xs">
              <span className="text-emerald-400 font-medium">Net Return Trip Outcome:</span>
              <span className="text-emerald-300 font-bold font-mono text-sm">+₹5,800 Extra Profit</span>
            </div>
          </div>

        </div>

        {/* Action Button */}
        <div className="mt-12 text-center">
          <Button
            variant="amber"
            size="lg"
            onClick={() => navigate('/auth?role=driver')}
            leftIcon={<RotateCcw className="w-5 h-5" />}
            rightIcon={<ArrowRight className="w-4 h-4" />}
            className="shadow-xl font-bold text-slate-950"
          >
            Post Your Return Trip & Start Earning
          </Button>
        </div>

      </div>
    </section>
  );
};
