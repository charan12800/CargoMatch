import React, { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { RatingModal } from '../../components/modals/RatingModal';
import { BookingStatus } from '../../types';
import { formatINR, formatDateTime } from '../../lib/utils';
import { 
  Package, 
  MapPin, 
  Truck, 
  KeyRound, 
  CheckCircle2, 
  Phone, 
  Star, 
  ShieldCheck, 
  Navigation,
  Sparkles,
  Building,
  Home,
  Box
} from 'lucide-react';

export const TrackingPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { bookings, currentUser, submitRating } = useApp();

  const bookingId = searchParams.get('id');
  const userBookings = bookings.filter((b) => b.customer_id === currentUser.id);
  const activeBooking = bookingId 
    ? bookings.find((b) => b.id === bookingId) || userBookings[0] 
    : userBookings[0] || bookings[0];

  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);

  const stages: { status: BookingStatus; label: string; detail: string }[] = [
    { status: 'PENDING', label: 'Booking Placed', detail: 'Cargo capacity reserved with driver' },
    { status: 'ACCEPTED', label: 'Driver Accepted', detail: 'Driver confirmed cargo allocation' },
    { status: 'PICKED_UP', label: 'Cargo Picked Up', detail: 'Collected from pickup address' },
    { status: 'IN_TRANSIT', label: 'In Transit on Highway', detail: 'En route along primary corridor' },
    { status: 'OUT_FOR_DELIVERY', label: 'Out for Delivery', detail: 'Reaching destination address' },
    { status: 'DELIVERED', label: 'Delivered (OTP Verified)', detail: 'Secure physical handover complete' },
  ];

  const getStageIndex = (status?: BookingStatus) => {
    switch (status) {
      case 'PENDING': return 0;
      case 'ACCEPTED': return 1;
      case 'PICKED_UP': return 2;
      case 'IN_TRANSIT': return 3;
      case 'OUT_FOR_DELIVERY': return 4;
      case 'DELIVERED': return 5;
      default: return 0;
    }
  };

  const currentStageIdx = getStageIndex(activeBooking?.status);
  const bodyType = activeBooking?.trip?.vehicle?.body_type || 'Closed Container';

  if (!activeBooking) {
    return (
      <Card className="p-12 text-center border-slate-200 max-w-lg mx-auto space-y-4">
        <Package className="w-12 h-12 text-slate-300 mx-auto" />
        <h2 className="text-xl font-bold text-slate-900">No Active Shipments</h2>
        <p className="text-xs text-slate-500">Book unused capacity on a vehicle to start tracking.</p>
        <Button variant="primary" size="md" onClick={() => navigate('/customer/send-cargo')}>
          Send Cargo Now
        </Button>
      </Card>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Live Delivery Tracking
            </h1>
            <Badge variant={activeBooking.status === 'DELIVERED' ? 'success' : 'info'} size="md">
              {activeBooking.status.replace(/_/g, ' ')}
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Tracking ID: <strong className="font-mono text-slate-700">#{activeBooking.id}</strong> • Booked on {formatDateTime(activeBooking.booked_at)}
          </p>
        </div>

        {/* Dynamic OTP Card */}
        <div className="bg-gradient-to-br from-amber-50 to-amber-100/80 border-2 border-amber-300 rounded-2xl p-4 shadow-sm flex items-center gap-4">
          <div className="p-2.5 rounded-xl bg-amber-500 text-white shrink-0">
            <KeyRound className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-black tracking-wider text-amber-900 block">
              Your Delivery OTP
            </span>
            <span className="text-2xl font-black font-mono tracking-widest text-slate-950">
              {activeBooking.otp}
            </span>
            <span className="text-[10px] text-amber-800 font-semibold block">
              Share with driver at handover
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: Visual Map Corridor + Milestones */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Corridor Visualizer & Timeline */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Highway Route Corridor Map */}
          <Card className="border-slate-200 shadow-sm overflow-hidden">
            <div className="bg-slate-950 p-6 text-white relative overflow-hidden">
              <div className="relative z-10 space-y-6">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Navigation className="w-3.5 h-3.5" /> Highway Corridor Live Visualizer
                  </span>
                  <span className="text-slate-400 font-mono">Status: {activeBooking.status.replace(/_/g, ' ')}</span>
                </div>

                {/* Route Visualization Line */}
                <div className="py-6 px-4">
                  <div className="relative flex items-center justify-between">
                    <div className="absolute left-0 right-0 h-1.5 bg-slate-800 rounded-full" />
                    
                    <div 
                      style={{ width: `${(currentStageIdx / (stages.length - 1)) * 100}%` }}
                      className="absolute left-0 h-1.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-500 rounded-full transition-all duration-500" 
                    />

                    {/* Origin Node */}
                    <div className="relative z-10 flex flex-col items-center">
                      <div className="w-9 h-9 rounded-full bg-blue-600 border-2 border-white shadow-md flex items-center justify-center text-white">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-bold text-white mt-2">
                        {activeBooking.trip?.source || 'Origin'}
                      </span>
                      <span className="text-[10px] text-slate-400">Pickup Terminal</span>
                    </div>

                    {/* Midpoint Corridor Checkpoint */}
                    <div className="relative z-10 flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
                        currentStageIdx >= 3 
                          ? 'bg-indigo-600 border-white text-white shadow-md' 
                          : 'bg-slate-900 border-slate-700 text-slate-500'
                      }`}>
                        <Truck className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-bold text-slate-300 mt-2">
                        Highway Corridor
                      </span>
                      <span className="text-[10px] text-slate-500">In Transit</span>
                    </div>

                    {/* Destination Node */}
                    <div className="relative z-10 flex flex-col items-center">
                      <div className={`w-9 h-9 rounded-full border-2 flex items-center justify-center transition-all ${
                        currentStageIdx === 5 
                          ? 'bg-emerald-500 border-white text-white shadow-md' 
                          : 'bg-slate-900 border-slate-700 text-slate-400'
                      }`}>
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-bold text-white mt-2">
                        {activeBooking.trip?.destination || 'Destination'}
                      </span>
                      <span className="text-[10px] text-slate-400">Drop Address</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                  <span>Corridor: <strong>{activeBooking.trip?.source} ⇄ {activeBooking.trip?.destination}</strong></span>
                  <span className="text-emerald-400 font-semibold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> 100% OTP Handshake Protected
                  </span>
                </div>
              </div>
            </div>

            {/* Step-by-Step Milestone Timeline */}
            <div className="p-6">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">
                Milestone Audit Trail
              </h3>

              <div className="space-y-6 relative before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                {stages.map((stage, idx) => {
                  const isDone = idx <= currentStageIdx;
                  const isCurrent = idx === currentStageIdx;

                  return (
                    <div key={idx} className="relative flex items-start gap-4 pl-1">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-all ${
                          isCurrent
                            ? 'bg-blue-600 text-white ring-4 ring-blue-100'
                            : isDone
                            ? 'bg-emerald-500 text-white'
                            : 'bg-slate-100 border border-slate-300 text-slate-400'
                        }`}
                      >
                        {isDone ? <CheckCircle2 className="w-3.5 h-3.5" /> : idx + 1}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className={`text-xs font-bold ${isCurrent ? 'text-blue-600' : isDone ? 'text-slate-900' : 'text-slate-400'}`}>
                            {stage.label}
                          </h4>
                          {isCurrent && (
                            <span className="text-[10px] font-bold bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full border border-blue-200">
                              Current Stage
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">{stage.detail}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {activeBooking.status === 'DELIVERED' && (
                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-emerald-800 font-semibold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Delivery completed and verified with OTP.</span>
                  </div>
                  <Button
                    variant="amber"
                    size="sm"
                    onClick={() => setIsRatingModalOpen(true)}
                    leftIcon={<Star className="w-4 h-4 text-slate-950" />}
                    className="font-bold text-slate-950"
                  >
                    Rate Driver
                  </Button>
                </div>
              )}
            </div>
          </Card>

        </div>

        {/* Right Column: Driver & Package Details */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Driver Card */}
          <Card className="p-5 border-slate-200 shadow-sm space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Assigned Vehicle & Driver
            </h3>

            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white font-bold text-base flex items-center justify-center shadow-sm">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">
                  {activeBooking.driver?.full_name || 'Rajesh Kumar Verma'}
                </h4>
                <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
                  <span className="flex items-center text-amber-600 font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500 mr-0.5" />
                    {activeBooking.driver?.rating || 4.9} ★
                  </span>
                  <span>• Verified Driver</span>
                </div>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1.5 text-xs text-slate-700">
              <div className="flex justify-between">
                <span className="text-slate-500">Vehicle Type:</span>
                <span className="font-bold text-slate-900">{activeBooking.trip?.vehicle?.vehicle_type || 'Tata Ace'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Body Type:</span>
                <span className="font-bold text-indigo-700">{bodyType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Registration:</span>
                <span className="font-mono font-bold text-slate-900">{activeBooking.trip?.vehicle?.registration_number || 'TS 09 UA 4421'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Departure:</span>
                <span className="font-semibold text-slate-900">{activeBooking.trip?.departure_time}</span>
              </div>
            </div>

            <a
              href={`tel:${activeBooking.driver?.phone || '+919849012345'}`}
              className="w-full flex items-center justify-center gap-2 p-2.5 rounded-xl border border-slate-300 text-slate-800 hover:bg-slate-50 font-bold text-xs transition-colors"
            >
              <Phone className="w-4 h-4 text-emerald-600" />
              Call Driver ({activeBooking.driver?.phone || '+91 98490 12345'})
            </a>
          </Card>

          {/* Door-to-Door Addresses Card */}
          <Card className="p-5 border-slate-200 shadow-sm space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Delivery Addresses
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-2 text-slate-700">
                <Building className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-900 block">Pickup Address:</span>
                  <span className="text-slate-600">{activeBooking.request?.pickup_address || `${activeBooking.trip?.source} City Center`}</span>
                </div>
              </div>

              <div className="flex items-start gap-2 text-slate-700 pt-2 border-t border-slate-100">
                <Home className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-900 block">Destination Address:</span>
                  <span className="text-slate-600">{activeBooking.request?.delivery_address || `${activeBooking.trip?.destination} Destination Terminal`}</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Cargo Package Card */}
          <Card className="p-5 border-slate-200 shadow-sm space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Cargo Specifications
            </h3>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between pb-2 border-b border-slate-100">
                <span className="text-slate-500">Item:</span>
                <span className="font-bold text-slate-900 text-right">{activeBooking.request?.cargo_name || '5 kg Electronics Components'}</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-slate-100">
                <span className="text-slate-500">Category:</span>
                <span className="font-semibold text-slate-800">{activeBooking.request?.category || 'Electronics & Appliances'}</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-slate-100">
                <span className="text-slate-500">Weight:</span>
                <span className="font-bold text-blue-600">{activeBooking.request?.weight || 5} kg</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-slate-100">
                <span className="text-slate-500">Rate:</span>
                <span className="font-black text-slate-900">{formatINR(activeBooking.price)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Match Score:</span>
                <Badge variant="match" size="sm">{activeBooking.match_score}% Match</Badge>
              </div>
            </div>
          </Card>

          {/* Payment & Invoice Summary Card */}
          <Card className="p-5 border-slate-200 shadow-sm space-y-3 bg-gradient-to-br from-white to-slate-50">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Payment & Invoice
              </h3>
              <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                (activeBooking.payment_status || 'PAID') === 'PAID'
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-amber-50 text-amber-800 border-amber-200'
              }`}>
                {(activeBooking.payment_status || 'PAID') === 'PAID' ? '✓ Paid' : 'Pay at Handover'}
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between pb-1.5 border-b border-slate-100">
                <span className="text-slate-500">Method:</span>
                <span className="font-bold text-slate-900">{activeBooking.payment_method || 'UPI Instant'}</span>
              </div>
              <div className="flex justify-between pb-1.5 border-b border-slate-100">
                <span className="text-slate-500">Txn ID:</span>
                <span className="font-mono font-bold text-blue-600">{activeBooking.transaction_id || `TXN-UPI-${activeBooking.id.slice(-6)}`}</span>
              </div>
              <div className="flex justify-between pb-1.5 border-b border-slate-100">
                <span className="text-slate-500">Total Charged:</span>
                <span className="font-black text-slate-900 text-sm">{formatINR(activeBooking.price)}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>GST Invoice:</span>
                <span className="text-emerald-700 font-semibold">Generated (5% GTA)</span>
              </div>
            </div>
          </Card>

        </div>

      </div>

      {/* Rating Modal */}
      <RatingModal
        isOpen={isRatingModalOpen}
        onClose={() => setIsRatingModalOpen(false)}
        booking={activeBooking}
        onSubmit={submitRating}
      />

    </div>
  );
};
