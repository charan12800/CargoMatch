import React from 'react';
import { cn } from '../../lib/utils';
import { Truck } from 'lucide-react';

interface CapacityMeterProps {
  totalCapacity: number; // in kg
  availableCapacity: number; // in kg
  matchedCargoWeight?: number; // in kg (optional)
  showLabels?: boolean;
  className?: string;
}

export const CapacityMeter: React.FC<CapacityMeterProps> = ({
  totalCapacity,
  availableCapacity,
  matchedCargoWeight = 0,
  showLabels = true,
  className,
}) => {
  const usedCapacity = Math.max(0, totalCapacity - availableCapacity);
  const usedPct = Math.round((usedCapacity / totalCapacity) * 100);
  const matchedPct = matchedCargoWeight > 0 ? Math.min(100 - usedPct, Math.round((matchedCargoWeight / totalCapacity) * 100)) : 0;
  const freePct = Math.max(0, 100 - usedPct - matchedPct);

  return (
    <div className={cn('w-full', className)}>
      {showLabels && (
        <div className="flex items-center justify-between text-xs mb-2">
          <div className="flex items-center gap-1.5 font-medium text-slate-700">
            <Truck className="w-3.5 h-3.5 text-blue-600" />
            <span>Capacity Utilization</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-emerald-700 font-semibold">{availableCapacity} kg Available</span>
            <span className="text-slate-400">/ {totalCapacity} kg Total</span>
          </div>
        </div>
      )}

      {/* Visual Capacity Bar */}
      <div className="h-3.5 w-full bg-slate-100 rounded-full overflow-hidden flex border border-slate-200/60 p-0.5 gap-0.5">
        {/* Occupied baseline capacity */}
        {usedPct > 0 && (
          <div
            style={{ width: `${usedPct}%` }}
            className="h-full bg-slate-400 rounded-l-full transition-all duration-300 relative group"
            title={`Existing cargo: ${usedCapacity} kg (${usedPct}%)`}
          />
        )}

        {/* Matched Cargo space highlighted in Electric Blue */}
        {matchedPct > 0 && (
          <div
            style={{ width: `${matchedPct}%` }}
            className="h-full bg-blue-600 transition-all duration-300 animate-pulse-subtle relative group"
            title={`Your matched cargo: ${matchedCargoWeight} kg (${matchedPct}%)`}
          />
        )}

        {/* Remaining free unused capacity in Emerald */}
        {freePct > 0 && (
          <div
            style={{ width: `${freePct}%` }}
            className="h-full bg-emerald-400/90 rounded-r-full transition-all duration-300"
            title={`Remaining open capacity: ${availableCapacity - matchedCargoWeight} kg`}
          />
        )}
      </div>

      {showLabels && (
        <div className="flex items-center gap-4 text-[11px] text-slate-700 mt-2">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-slate-400 inline-block" />
            Booked ({usedCapacity} kg)
          </span>
          {matchedCargoWeight > 0 && (
            <span className="flex items-center gap-1 font-semibold text-blue-600">
              <span className="w-2 h-2 rounded-full bg-blue-600 inline-block" />
              Your Cargo ({matchedCargoWeight} kg)
            </span>
          )}
          <span className="flex items-center gap-1 text-emerald-700 font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
            Unused Space ({availableCapacity - matchedCargoWeight} kg)
          </span>
        </div>
      )}
    </div>
  );
};
