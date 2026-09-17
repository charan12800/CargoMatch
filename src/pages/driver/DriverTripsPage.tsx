import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { CapacityMeter } from '../../components/common/CapacityMeter';
import { formatINR } from '../../lib/utils';
import { getRouteDistance } from '../../lib/pricing';
import { 
  Truck, 
  MapPin, 
  RotateCcw, 
  Plus, 
  ArrowRight,
  Package,
  Layers,
  Sparkles,
  Calendar,
  CheckCircle2,
  Clock
} from 'lucide-react';

export const DriverTripsPage: React.FC = () => {
  const { currentUser, trips, bookings } = useApp();
  const navigate = useNavigate();

  const [filter, setFilter] = useState<'ALL' | 'ACTIVE' | 'SCHEDULED'>('ALL');

  const driverTrips = trips.filter((t) => t.driver_id === currentUser.id);

  const filteredTrips = driverTrips.filter((t) => {
    if (filter === 'ACTIVE') return t.status === 'ACTIVE';
    if (filter === 'SCHEDULED') return t.status === 'SCHEDULED';
    return true;
  });

  const totalCapacitySum = driverTrips.reduce((sum, t) => sum + t.total_capacity, 0);
  const availableCapacitySum = driverTrips.reduce((sum, t) => sum + t.available_capacity, 0);
  const activeTripsCount = driverTrips.filter((t) => t.status === 'ACTIVE').length;
  const returnTripsCount = driverTrips.filter((t) => t.is_return_trip).length;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              My Active & Scheduled Trips
            </h1>
            <Badge variant="success" size="md">
              <Truck className="w-3.5 h-3.5" /> {activeTripsCount} Active Runs
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage your intercity highway routes, available vehicle payload space, and return trip monetization.
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

      {/* Metrics Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="p-4 border-slate-200 shadow-sm bg-gradient-to-br from-white to-slate-50">
          <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
            Total Posted Trips
          </span>
          <span className="text-2xl font-black text-slate-900 mt-1 block">
            {driverTrips.length}
          </span>
          <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1 mt-0.5">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> {activeTripsCount} live on route
          </span>
        </Card>

        <Card className="p-4 border-slate-200 shadow-sm bg-gradient-to-br from-white to-amber-50/40">
          <span className="text-[10px] uppercase font-bold text-amber-800 block tracking-wider">
            Empty Return Runs
          </span>
          <span className="text-2xl font-black text-amber-950 mt-1 block">
            {returnTripsCount}
          </span>
          <span className="text-[11px] text-amber-700 font-semibold flex items-center gap-1 mt-0.5">
            <RotateCcw className="w-3 h-3 text-amber-600" /> 38% discounted
          </span>
        </Card>

        <Card className="p-4 border-slate-200 shadow-sm bg-gradient-to-br from-white to-blue-50/40">
          <span className="text-[10px] uppercase font-bold text-blue-800 block tracking-wider">
            Available Free Space
          </span>
          <span className="text-2xl font-black text-blue-950 mt-1 block">
            {availableCapacitySum} kg
          </span>
          <span className="text-[11px] text-blue-700 font-semibold block mt-0.5">
            of {totalCapacitySum} kg capacity
          </span>
        </Card>

        <Card className="p-4 border-slate-200 shadow-sm bg-gradient-to-br from-white to-purple-50/40">
          <span className="text-[10px] uppercase font-bold text-purple-800 block tracking-wider">
            Vehicle Assigned
          </span>
          <span className="text-lg font-black text-purple-950 mt-1 block truncate">
            {driverTrips[0]?.vehicle?.vehicle_type || 'Tata Ace'}
          </span>
          <span className="text-[11px] text-purple-700 font-mono font-semibold block mt-0.5">
            {driverTrips[0]?.vehicle?.registration_number || 'TS 09 UA 4421'}
          </span>
        </Card>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 p-1.5 bg-slate-200/70 rounded-xl w-fit">
        <button
          onClick={() => setFilter('ALL')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            filter === 'ALL' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          All Trips ({driverTrips.length})
        </button>
        <button
          onClick={() => setFilter('ACTIVE')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            filter === 'ACTIVE' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Active Runs ({activeTripsCount})
        </button>
        <button
          onClick={() => setFilter('SCHEDULED')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            filter === 'SCHEDULED' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Scheduled ({driverTrips.filter((t) => t.status === 'SCHEDULED').length})
        </button>
      </div>

      {/* Trips Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredTrips.map((trip) => {
          const tripBookings = bookings.filter((b) => b.trip_id === trip.id);
          const distanceKm = getRouteDistance(trip.source, trip.destination);
          const bodyType = trip.vehicle?.body_type || 'Closed Container';

          return (
            <Card
              key={trip.id}
              className={`border transition-all overflow-hidden flex flex-col justify-between ${
                trip.status === 'ACTIVE'
                  ? 'border-emerald-300 shadow-md ring-1 ring-emerald-500/20'
                  : 'border-slate-200 hover:border-slate-300 shadow-sm'
              }`}
            >
              <div className="p-6 space-y-5">
                
                {/* Top Row: Origin -> Dest, Distance, Body Type & Return Badge */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Corridor ({distanceKm} km)
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        trip.status === 'ACTIVE'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {trip.status === 'ACTIVE' ? '● Live Active' : '⏱ Scheduled'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 font-black text-slate-900 text-lg mt-1">
                      <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{trip.source} → {trip.destination}</span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1">
                    <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                      bodyType === 'Closed Container'
                        ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                        : 'bg-amber-50 text-amber-800 border-amber-200'
                    }`}>
                      📦 {bodyType}
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
                    <span className="font-bold text-slate-900">{trip.vehicle?.vehicle_type || 'Tata Ace'}</span>
                  </div>
                </div>

                {/* Capacity Meter */}
                <div className="space-y-1.5 pt-1">
                  <CapacityMeter
                    totalCapacity={trip.total_capacity}
                    availableCapacity={trip.available_capacity}
                  />
                </div>

                {/* Notes if available */}
                {trip.notes && (
                  <p className="text-xs text-slate-600 bg-slate-50/80 p-2.5 rounded-xl border border-slate-100 italic">
                    "{trip.notes}"
                  </p>
                )}

                {/* Base price & active bookings count */}
                <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100">
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase">Base Route Rate</span>
                    <span className="font-black text-slate-900 text-base">{formatINR(trip.price)}</span>
                  </div>

                  <div className="text-right">
                    <span className="text-slate-500 block text-[10px] uppercase">Assigned Cargo</span>
                    <span className="font-bold text-blue-600 flex items-center gap-1">
                      <Package className="w-3.5 h-3.5" />
                      {tripBookings.length} Cargo Bookings
                    </span>
                  </div>
                </div>

              </div>

              <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/driver/requests')}
                  rightIcon={<Package className="w-3.5 h-3.5" />}
                  className="text-xs font-bold flex-1"
                >
                  Manage Requests ({tripBookings.length})
                </Button>

                <Button
                  variant="emerald"
                  size="sm"
                  onClick={() => navigate('/driver')}
                  rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                  className="text-xs font-bold flex-1"
                >
                  Go to Live Board
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

    </div>
  );
};
