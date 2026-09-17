import React, { useState, useEffect } from 'react';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { PaymentMethod, PaymentStatus, PriceBreakdown, Trip } from '../../types';
import { formatINR } from '../../lib/utils';
import {
  X,
  CreditCard,
  QrCode,
  Smartphone,
  Building2,
  Wallet,
  Truck,
  ShieldCheck,
  CheckCircle2,
  Loader2,
  Lock,
  ArrowRight,
  TrendingDown,
  Sparkles,
  RefreshCw,
  FileText,
  Download,
  AlertCircle
} from 'lucide-react';

export interface PaymentGatewayModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingAmount: number;
  priceBreakdown?: PriceBreakdown;
  tripDetails: Trip;
  cargoDetails: {
    name: string;
    weight: number;
    pickupCity?: string;
    destinationCity?: string;
  };
  onPaymentSuccess: (paymentData: {
    payment_status: PaymentStatus;
    payment_method: PaymentMethod;
    transaction_id: string;
    paid_at: string;
  }) => void;
}

type PaymentTab = 'UPI' | 'CARD' | 'NETBANKING' | 'WALLET' | 'COD';
type CheckoutStage = 'SELECT' | 'PROCESSING' | 'SUCCESS';

export const PaymentGatewayModal: React.FC<PaymentGatewayModalProps> = ({
  isOpen,
  onClose,
  bookingAmount,
  priceBreakdown,
  tripDetails,
  cargoDetails,
  onPaymentSuccess,
}) => {
  const [activeTab, setActiveTab] = useState<PaymentTab>('UPI');
  const [checkoutStage, setCheckoutStage] = useState<CheckoutStage>('SELECT');
  const [transactionId, setTransactionId] = useState<string>('');

  // UPI State
  const [selectedUpiApp, setSelectedUpiApp] = useState<'gpay' | 'phonepe' | 'paytm' | 'qr' | 'id'>('gpay');
  const [upiId, setUpiId] = useState('techhub.pooja@okhdfcbank');
  const [qrTimer, setQrTimer] = useState(299);

  // Card State
  const [cardNumber, setCardNumber] = useState('4532 8901 2345 8812');
  const [cardHolder, setCardHolder] = useState('POOJA SUNDARAM');
  const [cardExpiry, setCardExpiry] = useState('08/28');
  const [cardCvv, setCardCvv] = useState('482');
  const [saveCard, setSaveCard] = useState(true);

  // NetBanking State
  const [selectedBank, setSelectedBank] = useState('HDFC');

  // Reset state on open
  useEffect(() => {
    if (isOpen) {
      setCheckoutStage('SELECT');
      setActiveTab('UPI');
      setQrTimer(299);
      setTransactionId(`TXN-IND-${Math.floor(100000 + Math.random() * 900000)}`);
    }
  }, [isOpen]);

  // QR Timer countdown
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isOpen && activeTab === 'UPI' && selectedUpiApp === 'qr' && qrTimer > 0) {
      interval = setInterval(() => {
        setQrTimer((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isOpen, activeTab, selectedUpiApp, qrTimer]);

  if (!isOpen) return null;

  const formatCardNumber = (val: string) => {
    const raw = val.replace(/\D/g, '').substring(0, 16);
    return raw.replace(/(\d{4})/g, '$1 ').trim();
  };

  const handleProcessPayment = () => {
    setCheckoutStage('PROCESSING');

    // Simulate real bank gateway handshake (1.8s)
    setTimeout(() => {
      const generatedTxn = `TXN-${activeTab}-${Math.floor(10000000 + Math.random() * 90000000)}`;
      setTransactionId(generatedTxn);
      setCheckoutStage('SUCCESS');
    }, 1800);
  };

  const handleCompleteAndRedirect = () => {
    const methodMap: Record<PaymentTab, PaymentMethod> = {
      UPI: 'UPI',
      CARD: 'CARD',
      NETBANKING: 'NETBANKING',
      WALLET: 'WALLET',
      COD: 'COD',
    };

    onPaymentSuccess({
      payment_status: activeTab === 'COD' ? 'PENDING' : 'PAID',
      payment_method: methodMap[activeTab],
      transaction_id: transactionId,
      paid_at: new Date().toISOString(),
    });
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-2xl w-full overflow-hidden max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between shrink-0 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 font-black shadow-md">
              <Lock className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">CargoMatch Secure Checkout</h3>
                <span className="text-[10px] uppercase font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                  256-bit SSL
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Payment for {cargoDetails.pickupCity || tripDetails.source} → {cargoDetails.destinationCity || tripDetails.destination}
              </p>
            </div>
          </div>

          {checkoutStage !== 'PROCESSING' && (
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* STAGE: SUCCESS */}
        {checkoutStage === 'SUCCESS' && (
          <div className="p-8 space-y-6 text-center overflow-y-auto">
            <div className="w-20 h-20 rounded-full bg-emerald-100 border-4 border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto animate-in zoom-in-75 duration-300">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                Payment Authorized Successfully
              </span>
              <h2 className="text-2xl font-black text-slate-900">
                {activeTab === 'COD' ? 'Booking Confirmed (Pay on Handover)' : 'Payment Received!'}
              </h2>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Your cargo capacity is confirmed. A live tracking link and handover OTP have been generated.
              </p>
            </div>

            {/* Receipt Summary Card */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 text-left text-xs space-y-3 max-w-md mx-auto">
              <div className="flex justify-between pb-2 border-b border-slate-200">
                <span className="text-slate-500">Transaction Reference:</span>
                <span className="font-mono font-bold text-slate-900">{transactionId}</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-slate-200">
                <span className="text-slate-500">Amount Paid:</span>
                <span className="font-black text-slate-900 text-sm">{formatINR(bookingAmount)}</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-slate-200">
                <span className="text-slate-500">Payment Mode:</span>
                <span className="font-semibold text-blue-600">{activeTab}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Assigned Driver:</span>
                <span className="font-bold text-slate-800">{tripDetails.driver?.full_name || 'Rajesh Kumar'}</span>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <Button
                variant="primary"
                size="lg"
                onClick={handleCompleteAndRedirect}
                rightIcon={<ArrowRight className="w-4 h-4" />}
                className="flex-1 font-bold shadow-md"
              >
                Go to Live Shipment Tracking
              </Button>
            </div>
          </div>
        )}

        {/* STAGE: PROCESSING */}
        {checkoutStage === 'PROCESSING' && (
          <div className="p-12 space-y-6 text-center my-auto">
            <div className="w-16 h-16 rounded-full bg-blue-50 border-4 border-blue-200 text-blue-600 flex items-center justify-center mx-auto animate-spin">
              <Loader2 className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-bold text-slate-900">Contacting Payment Gateway...</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Authorizing {formatINR(bookingAmount)} via {activeTab}. Please do not refresh or close this window.
              </p>
            </div>

            <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Bank-grade 256-bit encryption verified</span>
            </div>
          </div>
        )}

        {/* STAGE: SELECTION (Main Gateway View) */}
        {checkoutStage === 'SELECT' && (
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
            
            {/* Amount & Route Banner */}
            <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                  Total Payable Amount
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl sm:text-3xl font-black text-white">
                    {formatINR(bookingAmount)}
                  </span>
                  {priceBreakdown?.isReturnTrip && (
                    <span className="text-xs font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/40">
                      ~38% Return Discount Saved
                    </span>
                  )}
                </div>
              </div>

              <div className="text-right sm:border-l sm:border-slate-700 sm:pl-4">
                <span className="text-[10px] uppercase font-semibold text-slate-400 block">Route & Cargo</span>
                <span className="text-xs font-bold text-slate-200">
                  {cargoDetails.weight} kg • {tripDetails.source} → {tripDetails.destination}
                </span>
              </div>
            </div>

            {/* Payment Method Selector Tabs */}
            <div className="grid grid-cols-5 gap-1.5 p-1 bg-slate-100 rounded-2xl border border-slate-200">
              <button
                type="button"
                onClick={() => setActiveTab('UPI')}
                className={`py-2 px-1 rounded-xl text-xs font-bold transition-all flex flex-col items-center gap-1 ${
                  activeTab === 'UPI'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <QrCode className="w-4 h-4" />
                <span className="text-[11px]">UPI</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('CARD')}
                className={`py-2 px-1 rounded-xl text-xs font-bold transition-all flex flex-col items-center gap-1 ${
                  activeTab === 'CARD'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <CreditCard className="w-4 h-4" />
                <span className="text-[11px]">Card</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('NETBANKING')}
                className={`py-2 px-1 rounded-xl text-xs font-bold transition-all flex flex-col items-center gap-1 ${
                  activeTab === 'NETBANKING'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Building2 className="w-4 h-4" />
                <span className="text-[11px] truncate">NetBanking</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('WALLET')}
                className={`py-2 px-1 rounded-xl text-xs font-bold transition-all flex flex-col items-center gap-1 ${
                  activeTab === 'WALLET'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Wallet className="w-4 h-4" />
                <span className="text-[11px]">Wallet</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('COD')}
                className={`py-2 px-1 rounded-xl text-xs font-bold transition-all flex flex-col items-center gap-1 ${
                  activeTab === 'COD'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Truck className="w-4 h-4" />
                <span className="text-[11px] truncate">Handover</span>
              </button>
            </div>

            {/* TAB 1: UPI PAYMENT */}
            {activeTab === 'UPI' && (
              <div className="space-y-4">
                <div className="grid grid-cols-4 gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedUpiApp('gpay')}
                    className={`p-3 rounded-xl border text-center transition-all ${
                      selectedUpiApp === 'gpay'
                        ? 'border-blue-600 bg-blue-50/60 ring-2 ring-blue-600/20'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <span className="text-xs font-bold block text-slate-800">Google Pay</span>
                    <span className="text-[9px] text-slate-500">Instant</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedUpiApp('phonepe')}
                    className={`p-3 rounded-xl border text-center transition-all ${
                      selectedUpiApp === 'phonepe'
                        ? 'border-purple-600 bg-purple-50/60 ring-2 ring-purple-600/20'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <span className="text-xs font-bold block text-slate-800">PhonePe</span>
                    <span className="text-[9px] text-slate-500">UPI Fast</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedUpiApp('paytm')}
                    className={`p-3 rounded-xl border text-center transition-all ${
                      selectedUpiApp === 'paytm'
                        ? 'border-sky-600 bg-sky-50/60 ring-2 ring-sky-600/20'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <span className="text-xs font-bold block text-slate-800">Paytm UPI</span>
                    <span className="text-[9px] text-slate-500">Direct</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedUpiApp('qr')}
                    className={`p-3 rounded-xl border text-center transition-all ${
                      selectedUpiApp === 'qr'
                        ? 'border-emerald-600 bg-emerald-50/60 ring-2 ring-emerald-600/20'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <span className="text-xs font-bold block text-slate-800">Show QR</span>
                    <span className="text-[9px] text-slate-500">Any App</span>
                  </button>
                </div>

                {selectedUpiApp === 'qr' ? (
                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-3">
                    <div className="w-40 h-40 mx-auto bg-white p-2.5 rounded-2xl border-2 border-slate-300 shadow-sm flex flex-col items-center justify-center relative">
                      {/* Realistic simulated QR code visual */}
                      <div className="w-full h-full bg-slate-900 rounded-lg p-2 flex flex-col justify-between text-white text-[8px] font-mono select-none overflow-hidden relative">
                        <div className="flex justify-between items-center">
                          <div className="w-8 h-8 bg-white rounded flex items-center justify-center text-slate-950 font-black text-xs">■</div>
                          <div className="w-8 h-8 bg-white rounded flex items-center justify-center text-slate-950 font-black text-xs">■</div>
                        </div>
                        <div className="text-center font-bold tracking-widest text-emerald-400 py-2">
                          CARGOMATCH UPI
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="w-8 h-8 bg-white rounded flex items-center justify-center text-slate-950 font-black text-xs">■</div>
                          <span className="text-[9px] text-slate-300 font-bold">{formatINR(bookingAmount)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-slate-800">
                        Scan with GPay, PhonePe, Paytm, or BHIM
                      </p>
                      <span className="text-[11px] text-amber-700 font-mono bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200 inline-block">
                        QR Code expires in {formatTimer(qrTimer)}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 block">
                      Enter UPI ID / VPA
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        placeholder="e.g. mobile@upi or username@okhdfcbank"
                        className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-blue-600 outline-none pr-20 shadow-sm"
                      />
                      <span className="absolute right-3 top-2.5 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        ✓ Verified
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-500">
                      A payment request will be triggered on your selected UPI app.
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: DEBIT / CREDIT CARD */}
            {activeTab === 'CARD' && (
              <div className="space-y-4">
                {/* Virtual Card Preview */}
                <div className="bg-gradient-to-tr from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-5 shadow-lg border border-slate-800 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-black tracking-wider uppercase text-slate-300">CargoMatch Pay</span>
                    <span className="text-xs font-black italic bg-white/20 px-2.5 py-0.5 rounded-md text-white">VISA / RuPay</span>
                  </div>
                  <div className="font-mono text-base sm:text-lg tracking-widest font-bold">
                    {cardNumber || '•••• •••• •••• ••••'}
                  </div>
                  <div className="flex justify-between items-end text-[10px] uppercase">
                    <div>
                      <span className="text-slate-400 block text-[8px]">Card Holder</span>
                      <span className="font-bold text-slate-200">{cardHolder || 'YOUR NAME'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[8px]">Expires</span>
                      <span className="font-bold text-slate-200">{cardExpiry || 'MM/YY'}</span>
                    </div>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Card Number</label>
                    <input
                      type="text"
                      maxLength={19}
                      value={cardNumber}
                      onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                      placeholder="1234 5678 9012 3456"
                      className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs font-mono font-bold text-slate-900 focus:ring-2 focus:ring-blue-600 outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Valid Thru</label>
                      <input
                        type="text"
                        maxLength={5}
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        placeholder="MM/YY"
                        className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-blue-600 outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">CVV</label>
                      <input
                        type="password"
                        maxLength={4}
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        placeholder="•••"
                        className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-blue-600 outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="checkbox"
                      id="save-card-check"
                      checked={saveCard}
                      onChange={(e) => setSaveCard(e.target.checked)}
                      className="w-3.5 h-3.5 text-blue-600 rounded"
                    />
                    <label htmlFor="save-card-check" className="text-[11px] text-slate-600 cursor-pointer">
                      Save card securely according to RBI Tokenization norms
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: NETBANKING */}
            {activeTab === 'NETBANKING' && (
              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-700 block">Select Primary Bank</label>
                <div className="grid grid-cols-3 gap-2.5">
                  {['HDFC', 'ICICI', 'SBI', 'Axis Bank', 'Kotak', 'PNB'].map((bank) => (
                    <button
                      key={bank}
                      type="button"
                      onClick={() => setSelectedBank(bank)}
                      className={`p-3 rounded-xl border text-xs font-bold transition-all text-center ${
                        selectedBank === bank
                          ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-sm ring-1 ring-blue-600/30'
                          : 'border-slate-200 text-slate-800 hover:border-slate-300 bg-white'
                      }`}
                    >
                      {bank}
                    </button>
                  ))}
                </div>
                <div className="pt-2">
                  <select
                    className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-blue-600 outline-none"
                    value={selectedBank}
                    onChange={(e) => setSelectedBank(e.target.value)}
                  >
                    <option value="HDFC">HDFC Bank</option>
                    <option value="ICICI">ICICI Bank</option>
                    <option value="SBI">State Bank of India</option>
                    <option value="Axis Bank">Axis Bank</option>
                    <option value="Kotak">Kotak Mahindra Bank</option>
                    <option value="Bank of Baroda">Bank of Baroda</option>
                    <option value="Canara Bank">Canara Bank</option>
                    <option value="IndusInd Bank">IndusInd Bank</option>
                  </select>
                </div>
              </div>
            )}

            {/* TAB 4: WALLET */}
            {activeTab === 'WALLET' && (
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center">
                      <Wallet className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">CargoMatch Corporate Credit</h4>
                      <p className="text-[10px] text-slate-500">Instant 1-click debit</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-semibold text-slate-500 block">Available Balance</span>
                    <span className="text-base font-black text-emerald-700">₹5,000.00</span>
                  </div>
                </div>
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>5% instant cashback (₹{Math.round(bookingAmount * 0.05)}) will be credited post-delivery.</span>
                </div>
              </div>
            )}

            {/* TAB 5: COD / HANDOVER */}
            {activeTab === 'COD' && (
              <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-3">
                <div className="flex items-center gap-2.5">
                  <Truck className="w-5 h-5 text-amber-700" />
                  <h4 className="text-xs font-bold text-amber-950">Pay at Physical Handover</h4>
                </div>
                <p className="text-xs text-amber-900 leading-relaxed">
                  Reserve capacity now. You can pay cash or scan the driver&apos;s direct UPI QR upon item pickup or delivery verification.
                </p>
                <div className="text-[11px] font-semibold text-amber-800 bg-white/70 p-2.5 rounded-xl border border-amber-200 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-amber-700" />
                  <span>4-digit OTP will authenticate physical delivery completion.</span>
                </div>
              </div>
            )}

            {/* Itemized Price Breakdown Accordion */}
            {priceBreakdown && (
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                <span className="font-bold text-slate-800 block uppercase tracking-wider text-[10px]">
                  Transparent Rate Breakdown ({priceBreakdown.distanceKm} km • {priceBreakdown.weightKg} kg)
                </span>
                <div className="flex justify-between text-slate-600">
                  <span>Base Pickup & Insurance Fee:</span>
                  <span>{formatINR(priceBreakdown.baseBookingFee)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Distance Rate ({priceBreakdown.distanceKm} km @ ₹{priceBreakdown.ratePerKm}/km):</span>
                  <span>{formatINR(priceBreakdown.distanceCharge)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Cargo Weight Rate ({priceBreakdown.weightKg} kg):</span>
                  <span>{formatINR(priceBreakdown.weightCharge)}</span>
                </div>
                {priceBreakdown.isReturnTrip && (
                  <div className="flex justify-between text-emerald-700 font-bold">
                    <span className="flex items-center gap-1">
                      <TrendingDown className="w-3.5 h-3.5" /> Empty-Return Discount (38% Off):
                    </span>
                    <span>-{formatINR(priceBreakdown.returnTripDiscountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-600">
                  <span>GST (5% GTA):</span>
                  <span>{formatINR(priceBreakdown.gstAmount)}</span>
                </div>
                <div className="pt-2 border-t border-slate-200 flex justify-between font-bold text-slate-900 text-sm">
                  <span>Total Amount Payable:</span>
                  <span className="text-blue-600 font-black">{formatINR(bookingAmount)}</span>
                </div>
              </div>
            )}

          </div>
        )}

        {/* Footer CTAs */}
        {checkoutStage === 'SELECT' && (
          <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50 flex items-center justify-between gap-3 shrink-0">
            <div className="hidden sm:flex items-center gap-2 text-[11px] text-slate-500">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>100% Buyer Protection & Refund Guarantee</span>
            </div>

            <div className="flex gap-2.5 w-full sm:w-auto">
              <Button
                type="button"
                variant="outline"
                size="md"
                onClick={onClose}
                className="flex-1 sm:flex-initial"
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="primary"
                size="md"
                onClick={handleProcessPayment}
                rightIcon={<ArrowRight className="w-4 h-4" />}
                className="flex-1 sm:flex-initial font-bold shadow-md"
              >
                {activeTab === 'COD' ? 'Confirm & Reserve Space' : `Pay ${formatINR(bookingAmount)}`}
              </Button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
