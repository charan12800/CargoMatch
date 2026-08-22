import React, { useState } from 'react';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { 
  Package, 
  Truck, 
  MapPin, 
  Calendar, 
  Sparkles, 
  CheckCircle2, 
  X, 
  ShieldCheck, 
  ArrowRight,
  TrendingDown,
  Building,
  Home,
  Box
} from 'lucide-react';
import { Trip, DeliveryRequest, MatchScoreResult } from '../../types';
import { formatINR } from '../../lib/utils';
import { CapacityMeter } from '../common/CapacityMeter';

interface BookingConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  matchResult: MatchScoreResult | null;
  cargoDetails: {
    name: string;
    category?: string;
    weight: number;
    dimensions?: string;
    fragile?: boolean;
    pickupAddress?: string;
    deliveryAddress?: string;
  };
  onConfirm: () => void;
}

export const BookingConfirmationModal: React.FC<BookingConfirmationModalProps> = ({
  isOpen,
  onClose,
  matchResult,
  cargoDetails,
  onConfirm,
}) => {
  const [isConfirming, setIsConfirming] = useState(false);

  if (!isOpen || !matchResult) return null;

  const { trip, match_score, estimated_price, reasons } = matchResult;
  const bodyType = trip.vehicle?.body_type || 'Closed Container';

  const handleConfirm = () => {
    setIsConfirming(true);
    setTimeout(() => {
      setIsConfirming(false);
      onConfirm();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-600/30 border border-blue-500/40 text-blue-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold">Confirm Capacity Booking</h3>
              <p className="text-xs text-slate-400">CargoMatch Shared Route Lock</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 space-y-5 overflow-y-auto">
          
          {/* Match Score & Body Type Bar */}
          <div className="p-3.5 rounded-xl bg-blue-50/80 border border-blue-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span className="text-xs font-bold text-blue-950">AI Compatibility Score</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="match" size="sm">{match_score}% Match</Badge>
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${
                bodyType === 'Closed Container'
                  ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                  : 'bg-amber-50 text-amber-800 border-amber-200'
              }`}>
                {bodyType}
              </span>
              {trip.is_return_trip && <Badge variant="warning" size="sm">Return Trip</Badge>}
            </div>
          </div>

          {/* Route Summary */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 font-bold text-slate-900">
                <MapPin className="w-3.5 h-3.5 text-blue-600" />
                <span>{trip.source}</span>
              </div>
              <span className="text-[10px] text-slate-500 font-semibold uppercase">Direct Run</span>
              <div className="flex items-center gap-1.5 font-bold text-slate-900">
                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                <span>{trip.destination}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200/60 grid grid-cols-2 gap-2 text-xs text-slate-600">
              <div>
                <span className="text-[10px] uppercase font-semibold text-slate-400 block">Departure</span>
                <span className="font-bold text-slate-800">{trip.departure_time}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-semibold text-slate-400 block">Vehicle & Body</span>
                <span className="font-bold text-slate-800">{trip.vehicle?.vehicle_type} ({bodyType})</span>
              </div>
            </div>
          </div>

          {/* Door-to-Door Addresses */}
          {(cargoDetails.pickupAddress || cargoDetails.deliveryAddress) && (
            <div className="p-3.5 rounded-xl border border-slate-200 space-y-2 text-xs">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                Door-to-Door Addresses
              </span>
              <div className="flex items-start gap-2 text-slate-700">
                <Building className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-slate-900">Pickup: </span>
                  <span>{cargoDetails.pickupAddress}</span>
                </div>
              </div>
              <div className="flex items-start gap-2 text-slate-700 pt-1 border-t border-slate-100">
                <Home className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-slate-900">Delivery: </span>
                  <span>{cargoDetails.deliveryAddress}</span>
                </div>
              </div>
            </div>
          )}

          {/* Cargo Summary */}
          <div className="space-y-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600 block">
              Cargo Specification
            </span>
            <div className="p-3.5 rounded-xl border border-slate-200 space-y-1.5 text-xs">
              <div className="flex justify-between font-bold text-slate-900">
                <span>{cargoDetails.name}</span>
                <span className="text-blue-600">{cargoDetails.weight} kg</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Category: {cargoDetails.category || 'General Commercial'}</span>
                {cargoDetails.dimensions && <span>{cargoDetails.dimensions}</span>}
              </div>
              {cargoDetails.fragile && (
                <span className="inline-block text-[10px] font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  ⚠️ Fragile / High-Care Handling
                </span>
              )}
            </div>
          </div>

          {/* Capacity Utilization */}
          <div className="space-y-1">
            <CapacityMeter
              totalCapacity={trip.total_capacity}
              availableCapacity={trip.available_capacity}
              matchedCargoWeight={cargoDetails.weight}
            />
          </div>

          {/* Pricing */}
          <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 space-y-2">
            <div className="flex items-center justify-between text-xs text-emerald-900">
              <span>Standard standalone courier rate:</span>
              <span className="line-through text-slate-600 font-semibold">{formatINR(Math.round(estimated_price * 1.65))}</span>
            </div>
            <div className="flex items-center justify-between pt-1 border-t border-emerald-200/60">
              <div>
                <span className="text-xs font-bold text-emerald-950 uppercase block">CargoMatch Shared Rate</span>
                <span className="text-2xl font-black text-slate-900">{formatINR(estimated_price)}</span>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-1 rounded-full flex items-center gap-1">
                  <TrendingDown className="w-3.5 h-3.5" /> 40% Cheaper
                </span>
              </div>
            </div>
          </div>

          {/* Security badge */}
          <div className="flex items-center gap-2 text-[11px] text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Dynamic 4-digit OTP will be generated immediately for safe physical handover verification.</span>
          </div>

        </div>

        {/* Footer CTAs */}
        <div className="p-5 border-t border-slate-100 bg-slate-50 flex gap-3 shrink-0">
          <Button
            type="button"
            variant="outline"
            size="md"
            onClick={onClose}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="primary"
            size="md"
            isLoading={isConfirming}
            onClick={handleConfirm}
            rightIcon={<ArrowRight className="w-4 h-4" />}
            className="flex-1 font-bold shadow-md"
          >
            Confirm & Reserve Space
          </Button>
        </div>

      </div>
    </div>
  );
};
