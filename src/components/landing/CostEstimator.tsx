import React, { useState, useMemo } from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { useNavigate } from 'react-router-dom';
import { 
  Calculator, 
  TrendingDown, 
  Truck, 
  ArrowRight, 
  MapPin,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { formatINR } from '../../lib/utils';
import { calculateCargoPrice, getRouteDistance } from '../../lib/pricing';

export const CostEstimator: React.FC = () => {
  const navigate = useNavigate();
  const [source, setSource] = useState('Hyderabad');
  const [destination, setDestination] = useState('Bengaluru');
  const [weight, setWeight] = useState(25);
  const [isReturnTrip, setIsReturnTrip] = useState(true);
  const [isFragile, setIsFragile] = useState(false);

  const distanceKm = useMemo(() => getRouteDistance(source, destination), [source, destination]);

  const calculation = useMemo(() => {
    const priceData = calculateCargoPrice({
      distanceKm,
      source,
      destination,
      weightKg: weight,
      isReturnTrip,
      isFragile,
    });

    return {
      distanceKm: priceData.distanceKm,
      traditionalCost: priceData.traditionalCourierPrice,
      sharedCost: priceData.finalPrice,
      savings: priceData.totalSavingsAmount,
      savingsPct: priceData.savingsPercentage,
      returnTripDiscount: priceData.returnTripDiscountAmount,
      availableVehicles: weight <= 50 ? 8 : weight <= 200 ? 5 : 3,
    };
  }, [distanceKm, source, destination, weight, isReturnTrip, isFragile]);

  return (
    <section id="calculator" className="py-20 lg:py-28 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold uppercase tracking-wider">
            <Calculator className="w-4 h-4 text-emerald-600" />
            Instant Savings Calculator
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            See How Much You Save With Shared Capacity
          </h2>
          <p className="text-base sm:text-lg text-slate-600">
            Compare CargoMatch against traditional standalone logistics couriers and see instant cost reductions.
          </p>
        </div>

        <div className="max-w-4xl mx-auto mt-14">
          <Card className="p-6 sm:p-10 border-slate-200 shadow-elevated bg-slate-50/50">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              
              {/* Left Form controls with Manual City Inputs */}
              <div className="md:col-span-6 space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wide block mb-1.5 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-blue-600" /> Origin City
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Hyderabad"
                      value={source}
                      onChange={(e) => setSource(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-blue-600 outline-none shadow-sm"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wide block mb-1.5 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-emerald-600" /> Destination City
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Bengaluru"
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-blue-600 outline-none shadow-sm"
                    />
                  </div>
                </div>

                {/* Weight slider */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                      Cargo Weight
                    </label>
                    <span className="text-sm font-black text-blue-600 font-mono bg-blue-50 px-2.5 py-0.5 rounded-lg border border-blue-200">
                      {weight} kg
                    </span>
                  </div>
                  <input
                    type="range"
                    min={2}
                    max={400}
                    step={1}
                    value={weight}
                    onChange={(e) => setWeight(Number(e.target.value))}
                    className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                  <div className="flex justify-between text-[10px] text-slate-600 font-semibold">
                    <span>2 kg (Parcel)</span>
                    <span>50 kg (Cartons)</span>
                    <span>200 kg (Pallet)</span>
                    <span>400 kg (Half Truck)</span>
                  </div>
                </div>

                {/* Trip Type Toggle (Return vs Standard) */}
                <div className="p-3 bg-white rounded-xl border border-slate-200/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5 cursor-pointer">
                      <RotateCcw className="w-3.5 h-3.5 text-amber-600" /> Match Empty Return Trip (38% Off)
                    </label>
                    <input
                      type="checkbox"
                      id="return-trip-calc-toggle"
                      checked={isReturnTrip}
                      onChange={(e) => setIsReturnTrip(e.target.checked)}
                      className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 border-slate-300 cursor-pointer"
                    />
                  </div>
                  <p className="text-[10px] text-slate-500">
                    {isReturnTrip
                      ? 'Monetizes deadhead return vehicles at maximum discount.'
                      : 'Standard one-way shared capacity pricing.'}
                  </p>
                </div>

                {/* Fragile checkbox */}
                <div className="flex items-center gap-2.5 pt-1">
                  <input
                    type="checkbox"
                    id="fragile-check-calc"
                    checked={isFragile}
                    onChange={(e) => setIsFragile(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300 cursor-pointer"
                  />
                  <label htmlFor="fragile-check-calc" className="text-xs font-medium text-slate-700 cursor-pointer">
                    Fragile / Precision cargo (Requires Closed Container)
                  </label>
                </div>
              </div>

              {/* Right: Real-time Price Comparison */}
              <div className="md:col-span-6 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                      Route Pricing
                    </span>
                    <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                      {calculation.distanceKm} km
                    </span>
                  </div>
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 flex items-center gap-1">
                    <TrendingDown className="w-3.5 h-3.5" /> Save {calculation.savingsPct}%
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-600 pb-2 border-b border-slate-100">
                    <span>Traditional Standalone Courier:</span>
                    <span className="font-semibold text-slate-600 line-through">
                      {formatINR(calculation.traditionalCost)}
                    </span>
                  </div>

                  <div className="flex items-baseline justify-between pt-1">
                    <div>
                      <span className="text-xs font-bold text-blue-600 uppercase tracking-wide block">
                        {isReturnTrip ? 'CargoMatch Return Rate' : 'CargoMatch Shared Rate'}
                      </span>
                      <span className="text-2xl sm:text-3xl font-black text-slate-900">
                        {formatINR(calculation.sharedCost)}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-emerald-800 font-bold block">
                        You Save {formatINR(calculation.savings)}
                      </span>
                      <span className="text-[10px] text-slate-600">per shipment</span>
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs flex items-center justify-between">
                  <div className="flex items-center gap-2 text-slate-700">
                    <Truck className="w-4 h-4 text-emerald-600" />
                    <span><strong>{calculation.availableVehicles} vehicles</strong> available on this route</span>
                  </div>
                  <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                    Ready to Book
                  </span>
                </div>

                <Button
                  variant="primary"
                  size="md"
                  onClick={() =>
                    navigate(
                      `/auth?role=customer&source=${encodeURIComponent(source.trim())}&destination=${encodeURIComponent(
                        destination.trim()
                      )}&weight=${weight}`
                    )
                  }
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                  className="w-full shadow-md font-bold"
                >
                  Book This Rate Now
                </Button>
              </div>

            </div>
          </Card>
        </div>

      </div>
    </section>
  );
};
