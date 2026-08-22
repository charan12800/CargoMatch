import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { CapacityMeter } from '../../components/common/CapacityMeter';
import { OtpVerificationModal } from '../../components/modals/OtpVerificationModal';
import { Booking, BookingStatus } from '../../types';
import { formatINR } from '../../lib/utils';
import { 
  Truck, 
  Package, 
  MapPin, 
  Banknote, 
  RotateCcw, 
  CheckCircle2, 
  Clock, 
  KeyRound, 
  ArrowRight, 
  Plus,
  Star,
  Layers,
  Box
} from 'lucide-react';

export const DriverDashboard: React.FC = () => {
  const { 
    currentUser, 
    trips, 
    bookings, 
    updateBookingStatus, 
    verifyDeliveryOTP 
  } = useApp();
  const navigate = useNavigate();

  const driverTrips = trips.filter((t) => t.driver_id === currentUser.id);
  const driverBookings = bookings.filter((b) => b.driver_id === currentUser.id);
  
  const pendingBookings = driverBookings.filter((b) => b.status === 'PENDING');
  const activeDeliveries = driverBookings.filter((b) => b.status !== 'PENDING' && b.status !== 'DELIVERED' && b.status !== 'CANCELLED');
  const completedDeliveries = driverBookings.filter((b) => b.status === 'DELIVERED');

  const totalEarnings = completedDeliveries.reduce((sum, b) => sum + b.price, 0);
  const pendingEarnings = activeDeliveries.reduce((sum, b) => sum + b.price, 0);

  // OTP Modal State
  const [selectedBookingForOtp, setSelectedBookingForOtp] = useState<Booking | null>(null);
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);

  const handleOpenOtp = (booking: Booking) => {
    setSelectedBookingForOtp(booking);
    setIsOtpModalOpen(true);
  };

  const handleStatusTransition = (bookingId: string, currentStatus: BookingStatus) => {
    if (currentStatus === 'ACCEPTED') {
      updateBookingStatus(bookingId, 'PICKED_UP');
    } else if (currentStatus === 'PICKED_UP') {
      updateBookingStatus(bookingId, 'IN_TRANSIT');
    } else if (currentStatus === 'IN_TRANSIT') {
      updateBookingStatus(bookingId, 'OUT_FOR_DELIVERY');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Driver Welcome Hero */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-elevated relative overflow-hidden border border-slate-800">
        <div className="absolute right-0 top-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-xs font-bold uppercase tracking-wider text-emerald-300">
              <Truck className="w-3.5 h-3.5" />
              CargoMatch Driver & Fleet Portal
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Hello, {currentUser.full_name.split(' ')[0]}! 🚛
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Monetize every empty kilometer. Accept cargo matching your routes and collect payouts upon OTP delivery verification.
            </p>
          </div>

          <Button
            variant="emerald"
            size="lg"
            onClick={() => navigate('/driver/post-trip')}
            leftIcon={<Plus className="w-5 h-5" />}
            rightIcon={<ArrowRight className="w-4 h-4" />}
            className="shadow-xl font-bold whitespace-nowrap self-start md:self-auto"
          >
            Post New Trip
          </Button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card className="p-4 sm:p-5 border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Earnings</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <Banknote className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
            {formatINR(totalEarnings || 2400)}
          </p>
          <span className="text-[11px] text-emerald-700 font-semibold block mt-1">Paid on OTP verification</span>
        </Card>

        <Card className="p-4 sm:p-5 border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Deliveries</span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <Truck className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
            {activeDeliveries.length}
          </p>
          <span className="text-[11px] text-blue-700 font-semibold block mt-1">
            {formatINR(pendingEarnings)} in escrow
          </span>
        </Card>

        <Card className="p-4 sm:p-5 border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pending Requests</span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
            {pendingBookings.length}
          </p>
          <span className="text-[11px] text-amber-700 font-semibold block mt-1">Awaiting acceptance</span>
        </Card>

        <Card className="p-4 sm:p-5 border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Driver Rating</span>
            <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
              <Star className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
            {currentUser.rating || 4.9} ★
          </p>
          <span className="text-[11px] text-purple-700 font-semibold block mt-1">128+ verified trips</span>
        </Card>
      </div>

      {/* Pending Requests Queue (Accept / Reject) */}
      {pendingBookings.length > 0 && (
        <Card className="border-amber-300 bg-amber-50/40 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between border-amber-200">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping" />
              <CardTitle className="text-amber-950">New Cargo Requests Awaiting Your Acceptance</CardTitle>
            </div>
            <Badge variant="warning">{pendingBookings.length} Pending</Badge>
          </CardHeader>

          <CardContent className="p-0 divide-y divide-amber-200/60">
            {pendingBookings.map((b) => (
              <div key={b.id} className="p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-slate-900 text-sm">
                      {b.request?.cargo_name || 'Package Cargo'}
                    </span>
                    <Badge variant="match" size="sm">{b.match_score}% Match</Badge>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-slate-700">
                      {b.trip?.vehicle?.body_type || 'Closed Container'}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-600">
                    <span className="font-semibold text-slate-800">
                      {b.trip?.source} → {b.trip?.destination}
                    </span>
                    <span>•</span>
                    <span>Weight: <strong>{b.request?.weight || 5} kg</strong></span>
                    <span>•</span>
                    <span>Customer: {b.customer?.full_name || 'Shipper'}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
                  <div className="text-right mr-2">
                    <span className="text-[10px] text-slate-500 uppercase block">Payout</span>
                    <span className="font-black text-emerald-700 text-base">{formatINR(b.price)}</span>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateBookingStatus(b.id, 'CANCELLED')}
                    className="text-slate-600 hover:bg-slate-100"
                  >
                    Decline
                  </Button>

                  <Button
                    variant="emerald"
                    size="sm"
                    onClick={() => updateBookingStatus(b.id, 'ACCEPTED')}
                    leftIcon={<CheckCircle2 className="w-4 h-4" />}
                    className="font-bold shadow-sm"
                  >
                    Accept Cargo
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Active Cargo Deliveries */}
      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Active Cargo In Transit</CardTitle>
            <p className="text-xs text-slate-500 mt-0.5">Advance delivery milestones and enter recipient OTP to complete</p>
          </div>
          <Badge variant="info">{activeDeliveries.length} Active</Badge>
        </CardHeader>

        <CardContent className="p-0 divide-y divide-slate-100">
          {activeDeliveries.length === 0 ? (
            <div className="p-8 text-center space-y-2 text-slate-400">
              <Truck className="w-10 h-10 mx-auto text-slate-300" />
              <p className="text-xs font-semibold text-slate-700">No active cargo in transit currently</p>
            </div>
          ) : (
            activeDeliveries.map((b) => (
              <div key={b.id} className="p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:bg-slate-50/70 transition-colors">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-slate-900 text-sm">
                      {b.request?.cargo_name || 'Package Cargo'} ({b.request?.weight || 5} kg)
                    </span>
                    <Badge variant={b.status === 'OUT_FOR_DELIVERY' ? 'purple' : 'info'} size="sm">
                      {b.status.replace(/_/g, ' ')}
                    </Badge>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-slate-700">
                      {b.trip?.vehicle?.body_type || 'Closed Container'}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-slate-600">
                    <span className="font-semibold text-slate-800 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-blue-600" />
                      {b.trip?.source} → {b.trip?.destination}
                    </span>
                    <span>•</span>
                    <span>Customer: {b.customer?.full_name || 'Shipper'}</span>
                    <span>•</span>
                    <span>Earnings: <strong className="text-emerald-700">{formatINR(b.price)}</strong></span>
                  </div>
                </div>

                {/* Status action controls */}
                <div className="flex items-center gap-2.5 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-3 md:pt-0">
                  {b.status === 'ACCEPTED' && (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleStatusTransition(b.id, 'ACCEPTED')}
                      leftIcon={<Package className="w-3.5 h-3.5" />}
                    >
                      Mark Picked Up
                    </Button>
                  )}

                  {b.status === 'PICKED_UP' && (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleStatusTransition(b.id, 'PICKED_UP')}
                      leftIcon={<Truck className="w-3.5 h-3.5" />}
                    >
                      Mark In Transit
                    </Button>
                  )}

                  {b.status === 'IN_TRANSIT' && (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleStatusTransition(b.id, 'IN_TRANSIT')}
                      leftIcon={<Clock className="w-3.5 h-3.5" />}
                    >
                      Mark Out for Delivery
                    </Button>
                  )}

                  <Button
                    variant="emerald"
                    size="sm"
                    onClick={() => handleOpenOtp(b)}
                    leftIcon={<KeyRound className="w-3.5 h-3.5" />}
                    className="font-bold shadow-sm"
                  >
                    Verify OTP & Deliver
                  </Button>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Active Trips Capacity Overview */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Your Posted Trips & Vehicle Space</h2>
            <p className="text-xs text-slate-500">Live payload capacity and return trip monetization</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/driver/post-trip')}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Post Another Trip
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {driverTrips.map((trip) => (
            <Card key={trip.id} className="p-5 border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 font-bold text-sm text-slate-900">
                  <MapPin className="w-4 h-4 text-emerald-600" />
                  <span>{trip.source} → {trip.destination}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                    {trip.vehicle?.body_type || 'Closed Container'}
                  </span>
                  {trip.is_return_trip && (
                    <Badge variant="warning" size="sm">
                      <RotateCcw className="w-3 h-3 mr-1" /> Return Trip
                    </Badge>
                  )}
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
                <CapacityMeter
                  totalCapacity={trip.total_capacity}
                  availableCapacity={trip.available_capacity}
                />
              </div>

              <div className="flex items-center justify-between text-xs text-slate-600 pt-1">
                <span>Departs: <strong>{trip.departure_time}</strong></span>
                <span>Vehicle: <strong>{trip.vehicle?.vehicle_type}</strong></span>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* OTP Verification Modal */}
      <OtpVerificationModal
        isOpen={isOtpModalOpen}
        onClose={() => setIsOtpModalOpen(false)}
        booking={selectedBookingForOtp}
        onVerify={verifyDeliveryOTP}
      />

    </div>
  );
};
