import React from 'react';
import { Button } from '../common/Button';
import { useNavigate } from 'react-router-dom';
import { Package, Truck, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';

export const CtaBanner: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="py-20 bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-900 text-white relative overflow-hidden">
      <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-white/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -left-20 -top-20 w-80 h-80 bg-emerald-500/20 rounded-full blur-2xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
        
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-xs sm:text-sm font-bold uppercase tracking-wider text-blue-100">
          <Sparkles className="w-4 h-4 text-emerald-300" />
          Ready to Move Smarter?
        </div>

        <div className="max-w-3xl mx-auto space-y-4">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
            Stop Paying for Empty Air.{' '}
            <span className="text-emerald-300">Start Matching on CargoMatch.</span>
          </h2>

          <p className="text-base sm:text-lg text-blue-100 max-w-2xl mx-auto leading-relaxed">
            Join thousands of businesses and drivers transforming logistics efficiency across India. Zero dedicated vehicle overheads. 100% verified capacity.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto text-left pt-2">
          {/* Customer Box */}
          <div className="p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 space-y-4 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="p-2.5 rounded-xl bg-blue-500/30 w-fit text-white">
                <Package className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">I Want To Send Cargo</h3>
              <p className="text-xs text-blue-100 leading-relaxed">
                Post your package, get AI-ranked vehicle matches, and book available capacity at discounted rates.
              </p>
            </div>
            <Button
              variant="emerald"
              size="md"
              onClick={() => navigate('/auth?role=customer')}
              rightIcon={<ArrowRight className="w-4 h-4" />}
              className="w-full shadow-md font-bold mt-4"
            >
              Send Cargo
            </Button>
          </div>

          {/* Driver Box */}
          <div className="p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 space-y-4 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="p-2.5 rounded-xl bg-amber-400/30 w-fit text-amber-200">
                <Truck className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">I Have Unused Vehicle Space</h3>
              <p className="text-xs text-blue-100 leading-relaxed">
                Post your scheduled route or empty return trip to accept compatible cargo and earn extra income.
              </p>
            </div>
            <Button
              variant="secondary"
              size="md"
              onClick={() => navigate('/auth?role=driver')}
              rightIcon={<ArrowRight className="w-4 h-4" />}
              className="w-full bg-slate-950 hover:bg-black text-white shadow-md font-bold mt-4"
            >
              Earn With Vehicle
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-blue-200 pt-4 font-medium">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-300" /> Free Registration
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-300" /> Instant Match Scoring
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-300" /> 100% OTP Verification
          </span>
        </div>

      </div>
    </section>
  );
};
