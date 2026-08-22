import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { OtpVerificationModal } from '../../components/modals/OtpVerificationModal';
import { Booking } from '../../types';
import { formatINR } from '../../lib/utils';
import { 
  Package, 
  MapPin, 
  CheckCircle2, 
  KeyRound, 
  Truck
} from 'lucide-react';

export const DriverRequestsPage: React.FC = () => {
  const { currentUser, bookings, updateBookingStatus, verifyDeliveryOTP } = useApp();

  const driverBookings = bookings.filter((b) => b.driver_id === currentUser.id);
  const [selectedBookingForOtp, setSelectedBookingForOtp] = useState<Booking | null>(null);
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);

  const pendingRequests = driverBookings.filter((b) => b.status === 'PENDING');
  const activeRequests = driverBookings.filter((b) => b.status !== 'PENDING' && b.status !== 'CANCELLED');

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Delivery Requests & Assignments
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Review incoming cargo matches, accept bookings, and manage delivery handovers.
        </p>
      </div>

      {/* Pending Requests Section */}
      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Pending Cargo Match Requests</CardTitle>
            <p className="text-xs text-slate-500 mt-0.5">Shippers waiting for your capacity confirmation</p>
          </div>
          <Badge variant="warning">{pendingRequests.length} Pending</Badge>
        </CardHeader>

        <CardContent className="p-0 divide-y divide-slate-100">
          {pendingRequests.length === 0 ? (
            <div className="p-8 text-center space-y-2 text-slate-400">
              <Package className="w-10 h-10 mx-auto text-slate-300" />
              <p className="text-xs font-semibold text-slate-700">No new pending requests at this time</p>
              <p className="text-[11px] text-slate-400">New requests will appear as shippers book your posted trips.</p>
            </div>
          ) : (
            pendingRequests.map((b) => (
              <div key={b.id} className="p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-slate-900 text-sm">
                      {b.request?.cargo_name || 'Electronics Cargo'}
                    </span>
                    <Badge variant="match" size="sm">{b.match_score}% Match</Badge>
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
                    <span>Payload: <strong>{b.request?.weight || 5} kg</strong></span>
                    <span>•</span>
                    <span>Customer: {b.customer?.full_name || 'Shipper'}</span>
                  </div>

                  {b.request?.special_instructions && (
                    <p className="text-[11px] text-slate-500 italic">
                      "{b.request.special_instructions}"
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
                  <div className="text-right mr-3">
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
            ))
          )}
        </CardContent>
      </Card>

      {/* All Active & Completed Deliveries */}
      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Delivery History & Status</CardTitle>
            <p className="text-xs text-slate-500 mt-0.5">Track transit progress and verify recipient OTP</p>
          </div>
          <Badge variant="info">{activeRequests.length} Total</Badge>
        </CardHeader>

        <CardContent className="p-0 divide-y divide-slate-100">
          {activeRequests.map((b) => (
            <div key={b.id} className="p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-slate-900 text-sm">
                    {b.request?.cargo_name || 'Package Cargo'} ({b.request?.weight || 5} kg)
                  </span>
                  <Badge variant={b.status === 'DELIVERED' ? 'success' : 'info'} size="sm">
                    {b.status.replace(/_/g, ' ')}
                  </Badge>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-slate-700">
                    {b.trip?.vehicle?.body_type || 'Closed Container'}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-600">
                  <span className="font-semibold text-slate-800">
                    {b.trip?.source} → {b.trip?.destination}
                  </span>
                  <span>•</span>
                  <span>Customer: {b.customer?.full_name || 'Shipper'}</span>
                  <span>•</span>
                  <span>Payout: <strong className="text-emerald-700">{formatINR(b.price)}</strong></span>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                {b.status !== 'DELIVERED' && (
                  <Button
                    variant="emerald"
                    size="sm"
                    onClick={() => {
                      setSelectedBookingForOtp(b);
                      setIsOtpModalOpen(true);
                    }}
                    leftIcon={<KeyRound className="w-3.5 h-3.5" />}
                    className="font-bold shadow-sm"
                  >
                    Verify OTP & Deliver
                  </Button>
                )}

                {b.status === 'DELIVERED' && (
                  <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Delivered & Paid
                  </span>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

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
