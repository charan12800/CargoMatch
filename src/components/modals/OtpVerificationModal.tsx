import React, { useState } from 'react';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { KeyRound, CheckCircle2, AlertCircle, X, ShieldCheck, Banknote } from 'lucide-react';
import { Booking } from '../../types';
import { formatINR } from '../../lib/utils';

interface OtpVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: Booking | null;
  onVerify: (bookingId: string, otp: string) => { success: boolean; message: string };
}

export const OtpVerificationModal: React.FC<OtpVerificationModalProps> = ({
  isOpen,
  onClose,
  booking,
  onVerify,
}) => {
  const [otpValues, setOtpValues] = useState(['', '', '', '']);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !booking) return null;

  const handleInputChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otpValues];
    newOtp[index] = value.slice(-1);
    setOtpValues(newOtp);
    setErrorMsg(null);

    // Auto-focus next input
    if (value && index < 3) {
      const nextInput = document.getElementById(`otp-digit-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpValues[index] && index > 0) {
      const prevInput = document.getElementById(`otp-digit-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    const fullOtp = otpValues.join('');

    if (fullOtp.length !== 4) {
      setErrorMsg('Please enter all 4 digits of the delivery OTP.');
      return;
    }

    setIsSubmitting(true);
    const result = onVerify(booking.id, fullOtp);
    setIsSubmitting(false);

    if (result.success) {
      setSuccessMsg(result.message);
      setTimeout(() => {
        setSuccessMsg(null);
        setOtpValues(['', '', '', '']);
        onClose();
      }, 1500);
    } else {
      setErrorMsg(result.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full overflow-hidden">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-600/30 border border-blue-500/40 text-blue-400">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold">Verify Delivery Handover</h3>
              <p className="text-xs text-slate-400">Booking #{booking.id}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleVerify} className="p-6 space-y-6">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2 text-xs">
            <div className="flex items-center justify-between text-slate-600">
              <span>Customer / Recipient:</span>
              <span className="font-bold text-slate-900">{booking.customer?.full_name || 'Customer'}</span>
            </div>
            <div className="flex items-center justify-between text-slate-600">
              <span>Cargo Item:</span>
              <span className="font-bold text-slate-900">{booking.request?.cargo_name || 'Cargo Package'}</span>
            </div>
            <div className="flex items-center justify-between text-slate-600">
              <span>Earnings Payout:</span>
              <span className="font-bold text-emerald-600 text-sm">{formatINR(booking.price)}</span>
            </div>
          </div>

          {/* OTP Digit Boxes */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block text-center">
              Ask the recipient for their 4-digit Delivery OTP
            </label>

            <div className="flex items-center justify-center gap-3">
              {otpValues.map((digit, idx) => (
                <input
                  key={idx}
                  id={`otp-digit-${idx}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleInputChange(idx, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(idx, e)}
                  autoFocus={idx === 0}
                  className="w-14 h-14 text-2xl font-black text-center text-slate-900 bg-slate-50 border-2 border-slate-300 rounded-xl focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-100 outline-none transition-all font-mono"
                />
              ))}
            </div>

            <p className="text-[11px] text-slate-500 text-center">
              The customer received this OTP on their tracking page and SMS.
            </p>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Success Message */}
          {successMsg && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span className="font-semibold">{successMsg}</span>
            </div>
          )}

          {/* Action buttons */}
          <div className="pt-2 flex gap-3">
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
              type="submit"
              variant="emerald"
              size="md"
              isLoading={isSubmitting}
              leftIcon={<ShieldCheck className="w-4 h-4" />}
              className="flex-1 font-bold shadow-md"
            >
              Confirm Delivery
            </Button>
          </div>
        </form>

      </div>
    </div>
  );
};
