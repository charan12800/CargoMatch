import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { RatingModal } from '../../components/modals/RatingModal';
import { Booking, BookingStatus } from '../../types';
import { formatINR, formatDateTime } from '../../lib/utils';
import { 
  Package, 
  MapPin, 
  Truck, 
  KeyRound, 
  Star, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  Sparkles,
  AlertCircle
} from 'lucide-react';

export const MyBookingsPage: React.FC = () => {
  const { currentUser, bookings, submitRating } = useApp();
  const navigate = useNavigate();

  const [filter, setFilter] = useState<'ALL' | 'ACTIVE' | 'DELIVERED'>('ALL');
  const [selectedBookingForRating, setSelectedBookingForRating] = useState<Booking | null>(null);
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);

  const userBookings = bookings.filter((b) => b.customer_id === currentUser.id);

  const filteredBookings = userBookings.filter((b) => {
    if (filter === 'ACTIVE') return b.status !== 'DELIVERED' && b.status !== 'CANCELLED';
    if (filter === 'DELIVERED') return b.status === 'DELIVERED';
    return true;
  });

  const getStatusBadge = (status: BookingStatus) => {
    switch (status) {
      case 'DELIVERED':
        return <Badge variant="success">✓ Delivered</Badge>;
      case 'IN_TRANSIT':
        return <Badge variant="info">In Transit</Badge>;
      case 'OUT_FOR_DELIVERY':
        return <Badge variant="purple">Out For Delivery</Badge>;
      case 'PICKED_UP':
        return <Badge variant="info">Cargo Picked Up</Badge>;
      case 'ACCEPTED':
        return <Badge variant="warning">Driver Accepted</Badge>;
      case 'PENDING':
        return <Badge variant="default">Pending Driver</Badge>;
      default:
        return <Badge variant="default">{status}</Badge>;
    }
  };

  const handleOpenRating = (booking: Booking) => {
    setSelectedBookingForRating(booking);
    setIsRatingModalOpen(true);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            My Cargo Bookings
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage your shared-capacity shipments, active OTPs, and delivery statuses.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => navigate('/customer/send-cargo')}
          leftIcon={<Package className="w-4 h-4" />}
          className="font-bold shadow-sm"
        >
          Book New Space
        </Button>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex items-center gap-2 p-1.5 bg-slate-200/70 rounded-xl w-fit">
        <button
          onClick={() => setFilter('ALL')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            filter === 'ALL' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          All ({userBookings.length})
        </button>
        <button
          onClick={() => setFilter('ACTIVE')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            filter === 'ACTIVE' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Active Deliveries ({userBookings.filter((b) => b.status !== 'DELIVERED' && b.status !== 'CANCELLED').length})
        </button>
        <button
          onClick={() => setFilter('DELIVERED')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            filter === 'DELIVERED' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Delivered ({userBookings.filter((b) => b.status === 'DELIVERED').length})
        </button>
      </div>

      {/* Bookings List */}
      <div className="space-y-4">
        {filteredBookings.length === 0 ? (
          <Card className="p-12 text-center border-slate-200 shadow-sm space-y-3">
            <Package className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-800">No bookings found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              You don't have any bookings matching this filter. Start by matching your cargo with an available vehicle.
            </p>
            <Button
              variant="primary"
              size="md"
              onClick={() => navigate('/customer/send-cargo')}
              className="mt-2"
            >
              Send Cargo Now
            </Button>
          </Card>
        ) : (
          filteredBookings.map((b) => (
            <Card key={b.id} className="border-slate-200 shadow-sm hover:shadow-card transition-all overflow-hidden">
              <div className="p-6 space-y-5">
                
                {/* Top Row: Status, ID & OTP */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-100 text-blue-600 font-bold">
                      <Package className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-base">
                          {b.request?.cargo_name || 'Electronics Components'}
                        </span>
                        {getStatusBadge(b.status)}
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Booking ID: <strong className="font-mono text-slate-700">#{b.id}</strong> • Booked {formatDateTime(b.booked_at)}
                      </p>
                    </div>
                  </div>

                  {/* OTP Badge for Customer */}
                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-2 text-right">
                      <div className="flex items-center gap-1.5 text-[10px] font-bold text-amber-800 uppercase tracking-wider">
                        <KeyRound className="w-3.5 h-3.5" /> Delivery Handover OTP
                      </div>
                      <span className="text-xl font-black font-mono tracking-widest text-amber-950">
                        {b.otp}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Middle details: Route, Vehicle, Price */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-700">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Highway Corridor</span>
                    <p className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-blue-600" />
                      {b.trip?.source} → {b.trip?.destination}
                    </p>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Driver & Vehicle</span>
                    <p className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                      <Truck className="w-4 h-4 text-emerald-600" />
                      {b.driver?.full_name || 'Rajesh Verma'} ({b.trip?.vehicle?.vehicle_type || 'Tata Ace'})
                    </p>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Rate & Match Score</span>
                    <div className="flex items-center justify-between">
                      <span className="font-black text-slate-900 text-base">{formatINR(b.price)}</span>
                      <Badge variant="match" size="sm">{b.match_score}% Match</Badge>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <span className="text-xs text-slate-500">
                    {b.status === 'DELIVERED'
                      ? '✓ Delivered and verified with secure OTP.'
                      : 'Share the 4-digit OTP with the driver upon physical handover.'}
                  </span>

                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    {b.status === 'DELIVERED' ? (
                      <Button
                        variant="amber"
                        size="sm"
                        onClick={() => handleOpenRating(b)}
                        leftIcon={<Star className="w-4 h-4 text-slate-950" />}
                        className="font-bold text-slate-950 w-full sm:w-auto"
                      >
                        Rate Driver
                      </Button>
                    ) : (
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => navigate(`/customer/track?id=${b.id}`)}
                        leftIcon={<MapPin className="w-4 h-4" />}
                        rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                        className="font-bold w-full sm:w-auto"
                      >
                        Track Milestone Progress
                      </Button>
                    )}
                  </div>
                </div>

              </div>
            </Card>
          ))
        )}
      </div>

      {/* Rating Modal */}
      <RatingModal
        isOpen={isRatingModalOpen}
        onClose={() => setIsRatingModalOpen(false)}
        booking={selectedBookingForRating}
        onSubmit={submitRating}
      />

    </div>
  );
};
