import React from 'react';
import { useApp } from '../../context/AppContext';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { formatINR } from '../../lib/utils';
import { 
  Banknote, 
  TrendingUp, 
  RotateCcw, 
  ShieldCheck, 
  CheckCircle2, 
  Truck, 
  Sparkles 
} from 'lucide-react';

export const DriverEarningsPage: React.FC = () => {
  const { currentUser, bookings } = useApp();

  const driverBookings = bookings.filter((b) => b.driver_id === currentUser.id);
  const deliveredBookings = driverBookings.filter((b) => b.status === 'DELIVERED');
  
  const totalSettled = deliveredBookings.reduce((sum, b) => sum + b.price, 0) || 5400;
  const returnTripEarnings = deliveredBookings
    .filter((b) => b.trip?.is_return_trip)
    .reduce((sum, b) => sum + b.price, 0) || 3200;

  const returnPct = Math.round((returnTripEarnings / totalSettled) * 100);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Driver Earnings & Payout Ledger
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Automated settlements verified via recipient delivery OTPs on CargoMatch.
        </p>
      </div>

      {/* Hero Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        
        {/* Total Settled */}
        <Card className="p-6 bg-gradient-to-br from-emerald-600 to-teal-700 text-white shadow-elevated border-none space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-100">
              Total Settled Earnings
            </span>
            <div className="p-2 rounded-xl bg-white/20">
              <Banknote className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-black">{formatINR(totalSettled)}</p>
          <div className="flex items-center gap-1.5 text-xs text-emerald-100 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-300" />
            <span>100% Verified Handshake Payouts</span>
          </div>
        </Card>

        {/* Return Trip Earnings */}
        <Card className="p-6 bg-gradient-to-br from-amber-500 to-amber-600 text-white shadow-elevated border-none space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-100">
              Empty Return Trip Revenue
            </span>
            <div className="p-2 rounded-xl bg-white/20">
              <RotateCcw className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-black">{formatINR(returnTripEarnings)}</p>
          <div className="flex items-center gap-1.5 text-xs text-amber-100 font-medium">
            <Sparkles className="w-4 h-4 text-white" />
            <span><strong>{returnPct}%</strong> of your income from return legs</span>
          </div>
        </Card>

        {/* Average Yield */}
        <Card className="p-6 bg-slate-900 text-white shadow-elevated border-none space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Avg. Extra Yield / Trip
            </span>
            <div className="p-2 rounded-xl bg-slate-800 text-blue-400">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-black">+₹1,450</p>
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
            <Truck className="w-4 h-4 text-emerald-400" />
            <span>Covers 100% of fuel & highway tolls</span>
          </div>
        </Card>

      </div>

      {/* Completed Settlements Table */}
      <Card className="border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle>Completed Delivery Payout History</CardTitle>
          <p className="text-xs text-slate-500 mt-0.5">Direct credits released immediately upon OTP submission</p>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Booking ID</th>
                  <th className="py-3 px-4">Route Corridor</th>
                  <th className="py-3 px-4">Cargo & Weight</th>
                  <th className="py-3 px-4">Vehicle Body</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">OTP Status</th>
                  <th className="py-3 px-4 text-right">Amount Credited</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {deliveredBookings.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-8 text-slate-400">
                      No completed payouts yet. Advance active bookings and verify OTPs to see credits here.
                    </td>
                  </tr>
                ) : (
                  deliveredBookings.map((b) => (
                    <tr key={b.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900">#{b.id}</td>
                      <td className="py-3.5 px-4 font-semibold text-slate-800">
                        {b.trip?.source} → {b.trip?.destination}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600">
                        {b.request?.cargo_name || 'Electronics'} ({b.request?.weight || 5} kg)
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                          {b.trip?.vehicle?.body_type || 'Closed Container'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600">{b.customer?.full_name || 'Customer'}</td>
                      <td className="py-3.5 px-4">
                        {b.trip?.is_return_trip ? (
                          <Badge variant="warning" size="sm">Return Trip</Badge>
                        ) : (
                          <Badge variant="info" size="sm">Outbound</Badge>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1 text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded text-[11px] border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3" /> OTP Verified
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right font-black text-slate-900 text-sm">
                        {formatINR(b.price)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

    </div>
  );
};
