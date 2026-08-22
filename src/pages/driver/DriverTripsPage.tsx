import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { CapacityMeter } from '../../components/common/CapacityMeter';
import { formatINR } from '../../lib/utils';
import { 
  Truck, 
  MapPin, 
  RotateCcw, 
  Plus, 
  ArrowRight
} from 'lucide-react';

export const DriverTripsPage: React.FC = () => {
  const { currentUser, trips } = useApp();
  const navigate = useNavigate();

  const driverTrips = trips.filter((t) => t.driver_id === currentUser.id);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            My Posted Trips & Routes
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage your scheduled trips, vehicle body specifications, and available payload capacity.
          </p>
        </div>

        <Button
          variant="emerald"
          size="sm"
          onClick={() => navigate('/driver/post-trip')}
          leftIcon={<Plus className="w-4 h-4" />}
          className="font-bold shadow-sm"
        >
          Post New Trip
        </Button>
      </div>

      {/* Trips Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {driverTrips.map((trip) => (
          <Card key={trip.id} className="border-slate-200 shadow-sm hover:shadow-card transition-all overflow-hidden flex flex-col justify-between">
            <div className="p-6 space-y-5">
              
              {/* Top Row: Origin -> Dest, Body Type & Return Badge */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Highway Route
                  </span>
                  <div className="flex items-center gap-2 font-black text-slate-900 text-lg mt-0.5">
                    <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{trip.source} → {trip.destination}</span>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1">
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-slate-700">
                    {trip.vehicle?.body_type || 'Closed Container'}
                  </span>
                  {trip.is_return_trip && (
                    <Badge variant="warning" size="sm">
                      <RotateCcw className="w-3 h-3 mr-1" /> Return Trip
                    </Badge>
                  )}
                </div>
              </div>

              {/* Vehicle & Schedule Details */}
              <div className="grid grid-cols-2 gap-3 text-xs text-slate-700">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Departure</span>
                  <span className="font-bold text-slate-900">{trip.departure_time}</span>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Vehicle</span>
                  <span className="font-bold text-slate-900">{trip.vehicle?.vehicle_type}</span>
                </div>
              </div>

              {/* Capacity Meter */}
              <div className="space-y-1.5 pt-1">
                <CapacityMeter
                  totalCapacity={trip.total_capacity}
                  availableCapacity={trip.available_capacity}
                />
              </div>

              {/* Base price */}
              <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100">
                <span className="text-slate-500">Base Route Price:</span>
                <span className="font-black text-slate-900 text-sm">{formatINR(trip.price)}</span>
              </div>

            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500">
                Status: <strong className="text-slate-900">{trip.status}</strong>
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/driver/requests')}
                rightIcon={<ArrowRight className="w-3 h-3" />}
                className="text-xs font-bold"
              >
                View Matches
              </Button>
            </div>
          </Card>
        ))}
      </div>

    </div>
  );
};
