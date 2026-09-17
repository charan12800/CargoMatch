import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { CapacityMeter } from '../../components/common/CapacityMeter';
import { BookingConfirmationModal } from '../../components/modals/BookingConfirmationModal';
import { PaymentGatewayModal } from '../../components/modals/PaymentGatewayModal';
import { rankMatches } from '../../lib/matching';
import { getRouteDistance } from '../../lib/pricing';
import { ALL_CARGO_CATEGORIES } from '../../lib/mockData';
import { MatchScoreResult, CargoCategory, StructuredAddress, PaymentMethod, PaymentStatus } from '../../types';
import { formatINR } from '../../lib/utils';
import { 
  MapPin, 
  Package, 
  Calendar, 
  Sparkles, 
  ArrowRight, 
  ArrowLeft, 
  Truck, 
  CheckCircle2, 
  Star, 
  Info, 
  Search,
  Check,
  TrendingDown,
  ShieldCheck,
  Building,
  Home,
  CreditCard
} from 'lucide-react';

export const SendCargoPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { trips, createDeliveryRequest, createBooking } = useApp();

  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);

  // Step 1: Manual City & Structured Address Inputs
  const [source, setSource] = useState(searchParams.get('source') || 'Hyderabad');
  const [destination, setDestination] = useState(searchParams.get('dest') || searchParams.get('destination') || 'Bengaluru');

  const [pickupDetails, setPickupDetails] = useState<StructuredAddress>({
    flat_building: 'Flat 402, Building A, Hitec Heights',
    street_area: 'Phase 2, Madhapur',
    city: searchParams.get('source') || 'Hyderabad',
    state: 'Telangana',
    pincode: '500081',
  });

  const [deliveryDetails, setDeliveryDetails] = useState<StructuredAddress>({
    flat_building: 'Plot 7B, Horizon Logistics Hub',
    street_area: '7th Block, Koramangala Industrial Area',
    city: searchParams.get('dest') || searchParams.get('destination') || 'Bengaluru',
    state: 'Karnataka',
    pincode: '560034',
  });

  // Step 2: Cargo Details with Searchable Categories
  const [cargoName, setCargoName] = useState('5 kg Precision Sensors & Electronic Modules');
  const [categorySearch, setCategorySearch] = useState('');
  const [category, setCategory] = useState<CargoCategory>('Electronics & Appliances');
  const [weight, setWeight] = useState<number>(Number(searchParams.get('weight')) || 5);
  const [length, setLength] = useState<number>(30);
  const [width, setWidth] = useState<number>(25);
  const [height, setHeight] = useState<number>(20);
  const [quantity, setQuantity] = useState<number>(1);
  const [fragile, setFragile] = useState<boolean>(true);
  const [specialInstructions, setSpecialInstructions] = useState('Keep in upright position. Anti-static padding included.');

  // Step 3: Schedule
  const [pickupDate, setPickupDate] = useState(new Date().toISOString().split('T')[0]);
  const [deliveryDate, setDeliveryDate] = useState(new Date(Date.now() + 86400000).toISOString().split('T')[0]);
  const [flexibleSchedule, setFlexibleSchedule] = useState(true);

  // Step 4: Matches & Payment
  const [rankedMatches, setRankedMatches] = useState<MatchScoreResult[]>([]);
  const [selectedMatch, setSelectedMatch] = useState<MatchScoreResult | null>(null);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [activeReasonIndex, setActiveReasonIndex] = useState<number | null>(null);

  // Filter categories dynamically with search query
  const filteredCategories = useMemo(() => {
    if (!categorySearch.trim()) return ALL_CARGO_CATEGORIES;
    return ALL_CARGO_CATEGORIES.filter((cat) =>
      cat.toLowerCase().includes(categorySearch.toLowerCase().trim())
    );
  }, [categorySearch]);

  // Sync city inputs with address objects
  const handleSourceChange = (val: string) => {
    setSource(val);
    setPickupDetails((prev) => ({ ...prev, city: val }));
  };

  const handleDestinationChange = (val: string) => {
    setDestination(val);
    setDeliveryDetails((prev) => ({ ...prev, city: val }));
  };

  // Calculate Matches on Step 4
  useEffect(() => {
    if (currentStep === 4) {
      const results = rankMatches(trips, {
        source: source.trim() || 'Hyderabad',
        destination: destination.trim() || 'Bengaluru',
        weight,
        pickup_date: pickupDate,
        delivery_date: deliveryDate,
        category,
        fragile,
      });
      setRankedMatches(results);
    }
  }, [currentStep, trips, source, destination, weight, pickupDate, deliveryDate, category, fragile]);

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep < 4) {
      setCurrentStep((prev) => (prev + 1) as 1 | 2 | 3 | 4);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as 1 | 2 | 3 | 4);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSelectMatch = (match: MatchScoreResult) => {
    setSelectedMatch(match);
    setIsConfirmationModalOpen(true);
  };

  const handleProceedToPayment = () => {
    setIsConfirmationModalOpen(false);
    setIsPaymentModalOpen(true);
  };

  const fullPickupAddress = `${pickupDetails.flat_building}, ${pickupDetails.street_area}, ${pickupDetails.city}, ${pickupDetails.state} - ${pickupDetails.pincode}`;
  const fullDeliveryAddress = `${deliveryDetails.flat_building}, ${deliveryDetails.street_area}, ${deliveryDetails.city}, ${deliveryDetails.state} - ${deliveryDetails.pincode}`;

  const handlePaymentSuccess = async (paymentData: {
    payment_status: PaymentStatus;
    payment_method: PaymentMethod;
    transaction_id: string;
    paid_at: string;
  }) => {
    if (!selectedMatch) return;

    const createdReq = await createDeliveryRequest({
      source: source.trim(),
      destination: destination.trim(),
      pickup_address: fullPickupAddress,
      pickup_address_details: pickupDetails,
      delivery_address: fullDeliveryAddress,
      delivery_address_details: deliveryDetails,
      cargo_name: cargoName,
      category,
      weight,
      length,
      width,
      height,
      quantity,
      fragile,
      special_instructions: specialInstructions,
      pickup_date: pickupDate,
      delivery_date: deliveryDate,
    });

    const booking = await createBooking(selectedMatch.trip.id, createdReq.id, {
      name: cargoName,
      weight,
      price: selectedMatch.estimated_price,
      matchScore: selectedMatch.match_score,
      tripDetails: selectedMatch.trip,
      payment_status: paymentData.payment_status,
      payment_method: paymentData.payment_method,
      transaction_id: paymentData.transaction_id,
      paid_at: paymentData.paid_at,
    });

    setIsPaymentModalOpen(false);
    navigate(`/customer/track?id=${booking.id}`);
  };

  const steps = [
    { num: 1, label: 'Route & Addresses', icon: <MapPin className="w-4 h-4" /> },
    { num: 2, label: 'Cargo & Category', icon: <Package className="w-4 h-4" /> },
    { num: 3, label: 'Schedule', icon: <Calendar className="w-4 h-4" /> },
    { num: 4, label: 'AI Matches', icon: <Sparkles className="w-4 h-4" /> },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-200">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Send Cargo — Capacity Matcher
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Specify origin, destination, and package specs to match vehicles already travelling that route.
          </p>
        </div>

        <Badge variant="info" size="md">
          <Sparkles className="w-3.5 h-3.5" /> AI Scoring Active
        </Badge>
      </div>

      {/* Step Progress Stepper */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
        <div className="grid grid-cols-4 gap-2 sm:gap-4">
          {steps.map((s) => {
            const isCompleted = currentStep > s.num;
            const isCurrent = currentStep === s.num;
            return (
              <div
                key={s.num}
                className={`flex items-center gap-2 sm:gap-3 p-2 rounded-xl transition-all ${
                  isCurrent
                    ? 'bg-blue-50 text-blue-700 font-bold border border-blue-200'
                    : isCompleted
                    ? 'text-emerald-700 font-semibold'
                    : 'text-slate-400 font-medium'
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
                    isCurrent
                      ? 'bg-blue-600 text-white'
                      : isCompleted
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {isCompleted ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : s.num}
                </div>
                <span className="text-xs truncate hidden sm:inline">{s.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* STEP 1: MANUAL ROUTE & STRUCTURED ADDRESS INPUTS */}
      {currentStep === 1 && (
        <form onSubmit={handleNext}>
          <Card className="p-6 sm:p-8 border-slate-200 shadow-sm space-y-8">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-lg font-bold text-slate-900">Step 1 — Origin & Destination Route</h2>
              <p className="text-xs text-slate-500">Enter your origin city, destination city, and detailed door-to-door addresses.</p>
            </div>

            {/* Manual City Inputs (No dropdown bar) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-slate-50/80 p-5 rounded-2xl border border-slate-200/80">
              <div>
                <label className="text-xs font-bold text-slate-800 uppercase tracking-wide block mb-1.5 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-blue-600" /> Pickup City (Enter Manually)
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Hyderabad, Pune, Vijayawada, Delhi"
                  value={source}
                  onChange={(e) => handleSourceChange(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-blue-600 outline-none shadow-sm"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-800 uppercase tracking-wide block mb-1.5 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-emerald-600" /> Destination City (Enter Manually)
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bengaluru, Mumbai, Chennai, Kolkata"
                  value={destination}
                  onChange={(e) => handleDestinationChange(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-blue-600 outline-none shadow-sm"
                />
              </div>
            </div>

            {/* Separate Structured Address Inputs for Pickup */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
                <Building className="w-4 h-4 text-blue-600" />
                <span>Pickup Address Details ({source || 'Origin'})</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Flat / House / Building / Floor No.
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Flat 402, Building A"
                    value={pickupDetails.flat_building}
                    onChange={(e) => setPickupDetails({ ...pickupDetails, flat_building: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Street / Area / Landmark / Colony
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Hitec City Phase 2, Madhapur"
                    value={pickupDetails.street_area}
                    onChange={(e) => setPickupDetails({ ...pickupDetails, street_area: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    required
                    value={pickupDetails.city}
                    onChange={(e) => setPickupDetails({ ...pickupDetails, city: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      State
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Telangana"
                      value={pickupDetails.state}
                      onChange={(e) => setPickupDetails({ ...pickupDetails, state: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      PIN Code
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 500081"
                      value={pickupDetails.pincode}
                      onChange={(e) => setPickupDetails({ ...pickupDetails, pincode: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Separate Structured Address Inputs for Delivery */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
                <Home className="w-4 h-4 text-emerald-600" />
                <span>Delivery Address Details ({destination || 'Destination'})</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Flat / House / Building / Floor No.
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Plot 7B, Warehouse 3"
                    value={deliveryDetails.flat_building}
                    onChange={(e) => setDeliveryDetails({ ...deliveryDetails, flat_building: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Street / Area / Landmark / Industrial Zone
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 7th Block, Koramangala Industrial Area"
                    value={deliveryDetails.street_area}
                    onChange={(e) => setDeliveryDetails({ ...deliveryDetails, street_area: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    required
                    value={deliveryDetails.city}
                    onChange={(e) => setDeliveryDetails({ ...deliveryDetails, city: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      State
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Karnataka"
                      value={deliveryDetails.state}
                      onChange={(e) => setDeliveryDetails({ ...deliveryDetails, state: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      PIN Code
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 560034"
                      value={deliveryDetails.pincode}
                      onChange={(e) => setDeliveryDetails({ ...deliveryDetails, pincode: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <Button
                type="submit"
                variant="primary"
                size="md"
                rightIcon={<ArrowRight className="w-4 h-4" />}
                className="font-bold shadow-md"
              >
                Continue to Cargo Details
              </Button>
            </div>
          </Card>
        </form>
      )}

      {/* STEP 2: EXPANDED CARGO CATEGORIES WITH SEARCH */}
      {currentStep === 2 && (
        <form onSubmit={handleNext}>
          <Card className="p-6 sm:p-8 border-slate-200 shadow-sm space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-lg font-bold text-slate-900">Step 2 — Package & Cargo Information</h2>
              <p className="text-xs text-slate-500">Search cargo categories and specify weight & dimension metrics.</p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide block mb-1.5">
                  Cargo Description / Item Name
                </label>
                <input
                  type="text"
                  required
                  value={cargoName}
                  onChange={(e) => setCargoName(e.target.value)}
                  placeholder="e.g. 5 kg Precision Sensors & Electronic Modules"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none"
                />
              </div>

              {/* Searchable Cargo Categories */}
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <label className="text-xs font-bold text-slate-800 uppercase tracking-wide block">
                    Select Cargo Category ({ALL_CARGO_CATEGORIES.length} Categories)
                  </label>
                  <span className="text-xs text-blue-600 font-bold bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100">
                    Selected: {category}
                  </span>
                </div>

                {/* Category Search Input */}
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search category (e.g. Auto, Solar, Textiles, Chemicals, Food)..."
                    value={categorySearch}
                    onChange={(e) => setCategorySearch(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none"
                  />
                  {categorySearch && (
                    <button
                      type="button"
                      onClick={() => setCategorySearch('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 hover:text-slate-700"
                    >
                      Clear
                    </button>
                  )}
                </div>

                {/* Filtered Category Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-56 overflow-y-auto p-1 border border-slate-100 rounded-xl">
                  {filteredCategories.length === 0 ? (
                    <div className="col-span-3 text-center py-4 text-xs text-slate-400">
                      No categories found for "{categorySearch}". Please try another search term.
                    </div>
                  ) : (
                    filteredCategories.map((cat) => {
                      const isSelected = category === cat;
                      return (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => setCategory(cat)}
                          className={`p-3 rounded-xl text-left text-xs transition-all flex items-start justify-between gap-1.5 cursor-pointer border ${
                            isSelected
                              ? 'bg-blue-600 text-white font-bold border-blue-600 shadow-sm ring-2 ring-blue-600/20'
                              : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                          }`}
                        >
                          <span className="leading-snug">{cat}</span>
                          {isSelected && <Check className="w-4 h-4 text-white shrink-0 mt-0.5" />}
                        </button>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Weight and Dimensions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wide block mb-1.5">
                    Total Weight (kg)
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    max={10000}
                    value={weight}
                    onChange={(e) => setWeight(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wide block mb-1.5">
                    Package Quantity
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none"
                  />
                </div>

                <div className="sm:col-span-2 space-y-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wide block">
                    Package Dimensions (Length × Width × Height in cm)
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    <input
                      type="number"
                      placeholder="Length (cm)"
                      value={length}
                      onChange={(e) => setLength(Number(e.target.value))}
                      className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-center"
                    />
                    <input
                      type="number"
                      placeholder="Width (cm)"
                      value={width}
                      onChange={(e) => setWidth(Number(e.target.value))}
                      className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-center"
                    />
                    <input
                      type="number"
                      placeholder="Height (cm)"
                      value={height}
                      onChange={(e) => setHeight(Number(e.target.value))}
                      className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-center"
                    />
                  </div>
                </div>

                {/* Fragile & Instructions */}
                <div className="sm:col-span-2 space-y-3 pt-2">
                  <div className="flex items-center gap-2.5">
                    <input
                      type="checkbox"
                      id="fragile-check"
                      checked={fragile}
                      onChange={(e) => setFragile(e.target.checked)}
                      className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
                    />
                    <label htmlFor="fragile-check" className="text-xs font-bold text-slate-800 cursor-pointer">
                      Fragile / High-Value Cargo (Prefers Closed Container body)
                    </label>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wide block mb-1">
                      Special Handling Instructions
                    </label>
                    <textarea
                      rows={2}
                      value={specialInstructions}
                      onChange={(e) => setSpecialInstructions(e.target.value)}
                      placeholder="e.g. Keep upright, weather-proof packing required"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <Button
                type="button"
                variant="outline"
                size="md"
                onClick={handlePrev}
                leftIcon={<ArrowLeft className="w-4 h-4" />}
              >
                Back to Route
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="md"
                rightIcon={<ArrowRight className="w-4 h-4" />}
                className="font-bold shadow-md"
              >
                Continue to Schedule
              </Button>
            </div>
          </Card>
        </form>
      )}

      {/* STEP 3: SCHEDULE (Maximum Budget removed as requested) */}
      {currentStep === 3 && (
        <form onSubmit={handleNext}>
          <Card className="p-6 sm:p-8 border-slate-200 shadow-sm space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-lg font-bold text-slate-900">Step 3 — Schedule & Timing</h2>
              <p className="text-xs text-slate-500">Specify your desired pickup date and delivery deadline.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide block mb-1.5">
                  Desired Pickup Date
                </label>
                <input
                  type="date"
                  required
                  value={pickupDate}
                  onChange={(e) => setPickupDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide block mb-1.5">
                  Target Delivery Deadline
                </label>
                <input
                  type="date"
                  required
                  value={deliveryDate}
                  onChange={(e) => setDeliveryDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none"
                />
              </div>

              <div className="sm:col-span-2 flex items-center gap-2.5 pt-2">
                <input
                  type="checkbox"
                  id="flex-check"
                  checked={flexibleSchedule}
                  onChange={(e) => setFlexibleSchedule(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
                />
                <label htmlFor="flex-check" className="text-xs font-bold text-slate-800 cursor-pointer">
                  Schedule flexible by ±24 hours (Enables return trip discounts up to 40% OFF)
                </label>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <Button
                type="button"
                variant="outline"
                size="md"
                onClick={handlePrev}
                leftIcon={<ArrowLeft className="w-4 h-4" />}
              >
                Back to Cargo
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="md"
                leftIcon={<Sparkles className="w-4 h-4" />}
                rightIcon={<ArrowRight className="w-4 h-4" />}
                className="font-bold shadow-md"
              >
                Run AI Match Engine
              </Button>
            </div>
          </Card>
        </form>
      )}

      {/* STEP 4: AI RANKED MATCHES (Matching exact user route & showing Open/Closed Body) */}
      {currentStep === 4 && (
        <div className="space-y-6">
          <div className="bg-slate-900 text-white rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-elevated">
            <div>
              <div className="flex items-center gap-2 text-blue-400 text-xs font-bold uppercase tracking-wider mb-1">
                <Sparkles className="w-4 h-4" />
                Matching Vehicles Found
              </div>
              <h2 className="text-xl font-bold">
                {rankedMatches.length} Verified Vehicles Available for {source} → {destination}
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Vehicles travelling your route, configured with Open Body and Closed Container options.
              </p>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentStep(1)}
              className="text-white border-slate-700 hover:bg-slate-800 text-xs whitespace-nowrap"
            >
              Modify Route & Addresses
            </Button>
          </div>

          {/* Matches List */}
          <div className="space-y-4">
            {rankedMatches.map((match, idx) => {
              const { trip, match_score, best_match, estimated_price, reasons, factors } = match;
              const isReasonOpen = activeReasonIndex === idx;
              const bodyType = trip.vehicle?.body_type || 'Closed Container';

              return (
                <Card
                  key={trip.id}
                  className={`border transition-all overflow-hidden ${
                    best_match
                      ? 'border-blue-500 shadow-elevated ring-1 ring-blue-500/20'
                      : 'border-slate-200 hover:border-slate-300 shadow-sm'
                  }`}
                >
                  {/* Best Match Header */}
                  {best_match && (
                    <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white px-5 py-1.5 text-xs font-bold flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5" /> Best Recommended Match
                      </span>
                      <span className="uppercase tracking-wider text-[10px]">Ranked #1</span>
                    </div>
                  )}

                  <div className="p-6 space-y-5">
                    
                    {/* Top Row: Driver info, Open/Closed Body badge, Match Score */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-3.5">
                        <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 font-bold">
                          <Truck className="w-6 h-6" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="text-base font-bold text-slate-900">
                              {trip.driver?.full_name || 'Rajesh Kumar'}
                            </h3>
                            <span className="flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                              <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                              {trip.driver?.rating || 4.9}
                            </span>
                            
                            {/* Explicit Open Body / Closed Body Badge */}
                            <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                              bodyType === 'Closed Container'
                                ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                                : 'bg-amber-50 text-amber-800 border-amber-200'
                            }`}>
                              📦 {bodyType}
                            </span>

                            {trip.is_return_trip && (
                              <Badge variant="warning" size="sm">Return Trip</Badge>
                            )}
                          </div>
                          <p className="text-xs text-slate-500 mt-0.5">
                            Vehicle: <strong>{trip.vehicle?.vehicle_type} ({bodyType})</strong> • Reg: {trip.vehicle?.registration_number}
                          </p>
                        </div>
                      </div>

                      {/* Score Badge */}
                      <div className="flex items-center sm:flex-col items-end gap-1">
                        <Badge variant="match" size="md">
                          <Sparkles className="w-3.5 h-3.5" />
                          {match_score}% Match
                        </Badge>
                        <span className="text-[10px] text-slate-400 font-medium hidden sm:inline">
                          Transparent weighted score
                        </span>
                      </div>
                    </div>

                    {/* Route and Time Details (reflects manual user route) */}
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-700">
                      <div>
                        <span className="text-[10px] text-slate-400 font-semibold uppercase block">Route Corridor</span>
                        <span className="font-bold text-slate-900 flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-blue-600" /> {trip.source} → {trip.destination}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 font-semibold uppercase block">Departure</span>
                        <span className="font-bold text-slate-900">{trip.departure_time}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 font-semibold uppercase block">Est. Arrival</span>
                        <span className="font-bold text-slate-900">{trip.estimated_arrival}</span>
                      </div>
                    </div>

                    {/* Capacity Visualizer */}
                    <div className="space-y-1.5">
                      <CapacityMeter
                        totalCapacity={trip.total_capacity}
                        availableCapacity={trip.available_capacity}
                        matchedCargoWeight={weight}
                      />
                    </div>

                    {/* Why this match accordion toggle */}
                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={() => setActiveReasonIndex(isReasonOpen ? null : idx)}
                        className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
                      >
                        <Info className="w-3.5 h-3.5" />
                        {isReasonOpen ? 'Hide scoring breakdown' : 'Why this match? View transparent breakdown'}
                      </button>

                      {isReasonOpen && (
                        <div className="mt-3 p-4 rounded-xl bg-blue-50/60 border border-blue-100 space-y-3 text-xs animate-in fade-in">
                          <div className="space-y-1">
                            <span className="font-bold text-blue-900 block">Scoring Factor Breakdown:</span>
                            {factors.map((f, fIdx) => (
                              <div key={fIdx} className="flex items-center justify-between text-[11px] text-slate-600">
                                <span>{f.name} ({f.weight}% weight)</span>
                                <span className="font-bold text-slate-900">{f.score}/100</span>
                              </div>
                            ))}
                          </div>

                          <div className="pt-2 border-t border-blue-200/60 space-y-1">
                            <span className="font-bold text-blue-900 block">Match Highlights:</span>
                            {reasons.map((r, rIdx) => (
                              <div key={rIdx} className="flex items-start gap-1.5 text-slate-700">
                                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                                <span>{r}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Price & Action Row */}
                    <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-emerald-800 block">
                          {trip.is_return_trip ? 'Empty-Return Space Rate' : 'Standard Shared Capacity Rate'} ({weight} kg • {bodyType})
                        </span>
                        <div className="flex items-baseline gap-2">
                          <span className="text-2xl font-black text-slate-900">
                            {formatINR(estimated_price)}
                          </span>
                          <span className="text-xs text-slate-400 line-through">
                            {formatINR(match.price_breakdown?.traditionalCourierPrice || Math.round(estimated_price * 1.6))}
                          </span>
                          <span className="text-xs font-bold text-emerald-600 flex items-center">
                            <TrendingDown className="w-3 h-3 mr-0.5" />
                            {match.price_breakdown?.savingsPercentage || (trip.is_return_trip ? 42 : 35)}% saved
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="primary"
                          size="md"
                          onClick={() => handleSelectMatch(match)}
                          rightIcon={<CreditCard className="w-4 h-4" />}
                          className="font-bold shadow-md whitespace-nowrap"
                        >
                          Book & Pay
                        </Button>
                      </div>
                    </div>

                  </div>
                </Card>
              );
            })}
          </div>

        </div>
      )}

      {/* 1. Booking Confirmation / Summary Modal */}
      <BookingConfirmationModal
        isOpen={isConfirmationModalOpen}
        onClose={() => setIsConfirmationModalOpen(false)}
        matchResult={selectedMatch}
        cargoDetails={{
          name: cargoName,
          category,
          weight,
          dimensions: `${length}x${width}x${height} cm`,
          fragile,
          pickupAddress: fullPickupAddress,
          deliveryAddress: fullDeliveryAddress,
        }}
        onConfirm={handleProceedToPayment}
      />

      {/* 2. Indian Payment Gateway Modal */}
      {selectedMatch && (
        <PaymentGatewayModal
          isOpen={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          bookingAmount={selectedMatch.estimated_price}
          priceBreakdown={selectedMatch.price_breakdown}
          tripDetails={selectedMatch.trip}
          cargoDetails={{
            name: cargoName,
            weight,
            pickupCity: source,
            destinationCity: destination,
          }}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}

    </div>
  );
};

