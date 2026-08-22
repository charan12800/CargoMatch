import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { CapacityMeter } from '../../components/common/CapacityMeter';
import { 
  Package, 
  Truck, 
  MapPin, 
  TrendingDown, 
  Sparkles, 
  ArrowRight, 
  Clock, 
  KeyRound, 
  CheckCircle2, 
  Plus
} from 'lucide-react';
import { formatINR } from '../../lib/utils';

export const CustomerDashboard: React.FC = () => {
  const { currentUser, bookings, trips } = useApp();
  const navigate = useNavigate();

  const userBookings = bookings.filter((b) => b.customer_id === currentUser.id);
  const activeBookings = userBookings.filter((b) => b.status !== 'DELIVERED' && b.status !== 'CANCELLED');
  const deliveredBookings = userBookings.filter((b) => b.status === 'DELIVERED');

  const totalSpent = userBookings.reduce((sum, b) => sum + b.price, 0);
  const estimatedSavings = Math.round(totalSpent * 0.4);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 rounded-3xl p-6 sm:p-8 text-white shadow-elevated relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-sm text-xs font-bold uppercase tracking-wider text-blue-100">
              <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
              CargoMatch Customer Portal
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Welcome back, {currentUser.full_name.split(' ')[0]}! 👋
            </h1>
            <p className="text-xs sm:text-sm text-blue-100 leading-relaxed">
              Match your cargo with vehicles already travelling your highway corridors. Pay only for the payload space you use.
            </p>
          </div>

          <Button
            variant="emerald"
            size="lg"
            onClick={() => navigate('/customer/send-cargo')}
            leftIcon={<Plus className="w-5 h-5" />}
            rightIcon={<ArrowRight className="w-4 h-4" />}
            className="shadow-xl font-bold whitespace-nowrap self-start md:self-auto"
          >
            Send Cargo Now
          </Button>
        </div>
      </div>

      {/* KPI Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card className="p-4 sm:p-5 border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Deliveries</span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
            {activeBookings.length}
          </p>
          <span className="text-[11px] text-slate-500 block mt-1">In transit on highways</span>
        </Card>

        <Card className="p-4 sm:p-5 border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Completed</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
            {deliveredBookings.length}
          </p>
          <span className="text-[11px] text-emerald-600 font-semibold block mt-1">100% OTP Verified</span>
        </Card>

        <Card className="p-4 sm:p-5 border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Estimated Savings</span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <TrendingDown className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
            {formatINR(estimatedSavings || 800)}
          </p>
          <span className="text-[11px] text-amber-700 font-semibold block mt-1">~40% vs Standalone</span>
        </Card>

        <Card className="p-4 sm:p-5 border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Corridor Trips</span>
            <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
              <Truck className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
            {trips.length}
          </p>
          <span className="text-[11px] text-purple-700 font-semibold block mt-1">Open for capacity matching</span>
        </Card>
      </div>

      {/* Active Deliveries Section */}
      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Active Deliveries & Shipments</CardTitle>
            <p className="text-xs text-slate-500 mt-0.5">Real-time status updates and delivery OTPs</p>
          </div>
          <Link
            to="/customer/bookings"
            className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
          >
            View All ({userBookings.length}) <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </CardHeader>

        <CardContent className="p-0 divide-y divide-slate-100">
          {activeBookings.length === 0 ? (
            <div className="p-8 text-center space-y-3">
              <Package className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="text-sm font-semibold text-slate-700">No active shipments right now</p>
              <p className="text-xs text-slate-500">Need to transport goods? Find vehicles on your route.</p>
              <Button
                variant="primary"
                size="sm"
                onClick={() => navigate('/customer/send-cargo')}
                className="mt-2"
              >
                Send Cargo Now
              </Button>
            </div>
          ) : (
            activeBookings.map((b) => (
              <div key={b.id} className="p-5 sm:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:bg-slate-50/70 transition-colors">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-slate-900 text-sm">
                      {b.request?.cargo_name || 'Cargo Package'} ({b.request?.weight || 5} kg)
                    </span>
                    <Badge variant={b.status === 'IN_TRANSIT' ? 'info' : 'warning'} size="sm">
                      {b.status.replace(/_/g, ' ')}
                    </Badge>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-slate-700">
                      {b.trip?.vehicle?.body_type || 'Closed Container'}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-slate-600 flex-wrap">
                    <span className="flex items-center gap-1 font-semibold text-slate-800">
                      <MapPin className="w-3.5 h-3.5 text-blue-600" />
                      {b.trip?.source} → {b.trip?.destination}
                    </span>
                    <span>•</span>
                    <span>Driver: {b.driver?.full_name || 'Rajesh Verma'}</span>
                    <span>•</span>
                    <span>Rate: {formatINR(b.price)}</span>
                  </div>
                </div>

                {/* OTP and Action button */}
                <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-3 md:pt-0">
                  <div className="bg-amber-50 border border-amber-200 rounded-xl px-3 py-1.5 text-center">
                    <span className="text-[10px] uppercase font-bold text-amber-800 block">Delivery OTP</span>
                    <span className="text-base font-black font-mono tracking-widest text-amber-900">
                      {b.otp}
                    </span>
                  </div>

                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => navigate(`/customer/track?id=${b.id}`)}
                    leftIcon={<MapPin className="w-3.5 h-3.5" />}
                  >
                    Track Live
                  </Button>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Recommended Available Vehicle Trips with Open/Closed Body badges */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Recommended Vehicle Capacity on Active Routes
            </h2>
            <p className="text-xs text-slate-500">Vehicles departing soon with Open Body & Closed Container options</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/customer/send-cargo')}
            className="text-xs font-semibold"
          >
            Search All Routes
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {trips.slice(0, 3).map((trip) => (
            <Card key={trip.id} className="p-5 border-slate-200 hover:shadow-card transition-all flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-bold text-sm text-slate-900">
                    <MapPin className="w-3.5 h-3.5 text-blue-600" />
                    <span>{trip.source} → {trip.destination}</span>
                  </div>
                  {trip.is_return_trip && (
                    <Badge variant="warning" size="sm">Return Trip</Badge>
                  )}
                </div>

                <div className="text-xs text-slate-600 space-y-1">
                  <p>
                    <strong>Vehicle:</strong> {trip.vehicle?.vehicle_type || 'Tata Ace'}{' '}
                    <span className="font-bold text-indigo-700">({trip.vehicle?.body_type || 'Closed Container'})</span>
                  </p>
                  <p><strong>Departure:</strong> {trip.departure_time}</p>
                </div>

                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <CapacityMeter
                    totalCapacity={trip.total_capacity}
                    availableCapacity={trip.available_capacity}
                    showLabels={false}
                  />
                  <div className="flex justify-between text-[11px] font-semibold mt-1.5">
                    <span className="text-emerald-700">{trip.available_capacity} kg space free</span>
                    <span className="text-slate-500">of {trip.total_capacity} kg</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">Est. Base Rate</span>
                  <span className="font-bold text-slate-900 text-sm">{formatINR(trip.price)}</span>
                </div>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => navigate(`/customer/send-cargo?source=${encodeURIComponent(trip.source)}&dest=${encodeURIComponent(trip.destination)}`)}
                  rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                >
                  Book Space
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

    </div>
  );
};
