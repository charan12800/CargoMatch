import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { CapacityMeter } from '../../components/common/CapacityMeter';
import { VehicleBodyType } from '../../types';
import { 
  Truck, 
  MapPin, 
  Calendar, 
  RotateCcw, 
  Sparkles, 
  ArrowRight, 
  Clock,
  Layers,
  Box
} from 'lucide-react';

export const PostTripPage: React.FC = () => {
  const { postTrip } = useApp();
  const navigate = useNavigate();

  // Manual City Inputs
  const [source, setSource] = useState('Hyderabad');
  const [destination, setDestination] = useState('Bengaluru');

  // Calendar Date & Time Inputs (replacing text "today/tomorrow")
  const defaultDeparture = new Date(Date.now() + 86400000);
  defaultDeparture.setHours(6, 30, 0, 0);
  const defaultArrival = new Date(Date.now() + 86400000);
  defaultArrival.setHours(17, 0, 0, 0);

  const formatForInput = (d: Date) => d.toISOString().slice(0, 16);

  const [departureDateTime, setDepartureDateTime] = useState(formatForInput(defaultDeparture));
  const [arrivalDateTime, setArrivalDateTime] = useState(formatForInput(defaultArrival));

  // Vehicle Type & Body Type (Open Body vs Closed Container)
  const [vehicleModel, setVehicleModel] = useState('Tata Ace');
  const [bodyType, setBodyType] = useState<VehicleBodyType>('Closed Container');
  const [registrationNumber, setRegistrationNumber] = useState('TS 09 UA 4421');
  const [totalCapacity, setTotalCapacity] = useState<number>(750);
  const [availableCapacity, setAvailableCapacity] = useState<number>(450);
  const [price, setPrice] = useState<number>(1200);

  // Return trip toggle
  const [isReturnTrip, setIsReturnTrip] = useState<boolean>(true);
  const [notes, setNotes] = useState('Returning with clean payload space. Covered and secured.');

  const handleVehicleModelChange = (model: string) => {
    setVehicleModel(model);
    if (model === 'Tata Ace') {
      setTotalCapacity(750);
      setAvailableCapacity(450);
    } else if (model === 'Mahindra Bolero Maxi Truck') {
      setTotalCapacity(1250);
      setAvailableCapacity(800);
    } else if (model === 'Pickup 8ft') {
      setTotalCapacity(1000);
      setAvailableCapacity(600);
    } else if (model === 'Mini Van Express') {
      setTotalCapacity(600);
      setAvailableCapacity(350);
    } else if (model === 'Truck 14ft') {
      setTotalCapacity(3500);
      setAvailableCapacity(2000);
    } else if (model === 'Eicher 19ft') {
      setTotalCapacity(7000);
      setAvailableCapacity(4500);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Format readable strings for display
    const depDate = new Date(departureDateTime);
    const arrDate = new Date(arrivalDateTime);
    
    const formattedDep = depDate.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });

    const formattedArr = arrDate.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });

    await postTrip({
      source: source.trim(),
      destination: destination.trim(),
      departure_time: formattedDep,
      estimated_arrival: formattedArr,
      total_capacity: totalCapacity,
      available_capacity: availableCapacity,
      price,
      is_return_trip: isReturnTrip,
      notes,
      vehicle: {
        id: `veh-${Date.now()}`,
        driver_id: 'driver-1',
        vehicle_type: `${vehicleModel}`,
        body_type: bodyType,
        registration_number: registrationNumber.toUpperCase().trim(),
        total_capacity: totalCapacity,
        created_at: new Date().toISOString(),
      },
    });

    navigate('/driver/trips');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Post Scheduled Trip & Available Space
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Specify your origin, destination, vehicle body type, and departure calendar schedule.
          </p>
        </div>

        <Badge variant="success" size="md">
          <Truck className="w-3.5 h-3.5" /> Fleet Monetization
        </Badge>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Important Empty Return Highlight Section */}
        <Card className={`p-6 border-2 transition-all ${
          isReturnTrip 
            ? 'border-amber-400 bg-amber-50/40 shadow-card' 
            : 'border-slate-200 bg-white'
        }`}>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <RotateCcw className="w-5 h-5 text-amber-600" />
                <h3 className="text-base font-bold text-slate-900">
                  Returning with unused vehicle space?
                </h3>
              </div>
              <p className="text-xs text-slate-600">
                Mark your trip as a return journey to unlock priority cargo matches and lower deadhead losses.
              </p>
            </div>

            {/* Toggle switch */}
            <div className="flex items-center gap-3 bg-white p-1 rounded-xl border border-slate-200 shadow-sm shrink-0">
              <button
                type="button"
                onClick={() => setIsReturnTrip(true)}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  isReturnTrip
                    ? 'bg-amber-500 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Yes, Return Trip
              </button>
              <button
                type="button"
                onClick={() => setIsReturnTrip(false)}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  !isReturnTrip
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                No, Outbound
              </button>
            </div>
          </div>

          {/* Motivational visual callout if Yes */}
          {isReturnTrip && (
            <div className="mt-4 p-3.5 rounded-xl bg-amber-500/15 border border-amber-400 text-xs text-amber-950 flex items-center gap-3 animate-in fade-in">
              <Sparkles className="w-5 h-5 text-amber-600 shrink-0" />
              <div>
                <p className="font-bold text-sm">
                  "Your return trip can help someone move cargo at a better price."
                </p>
                <p className="text-[11px] text-amber-900 mt-0.5">
                  Return trips receive discounted score boosts, driving higher booking demand from shippers.
                </p>
              </div>
            </div>
          )}
        </Card>

        {/* Section 1: Route & Highway Corridor (Manual inputs, intermediate stops removed) */}
        <Card className="p-6 sm:p-8 border-slate-200 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-lg font-bold text-slate-900">Route & Highway Corridor</h2>
            <p className="text-xs text-slate-500">Enter your departure city, destination city, and calendar departure/arrival schedule.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wide block mb-1.5 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-emerald-600" /> Starting City (Enter Manually)
              </label>
              <input
                type="text"
                required
                value={source}
                onChange={(e) => setSource(e.target.value)}
                placeholder="e.g. Hyderabad, Vijayawada, Pune"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-600 outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wide block mb-1.5 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-blue-600" /> Destination City (Enter Manually)
              </label>
              <input
                type="text"
                required
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="e.g. Bengaluru, Chennai, Mumbai"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-600 outline-none"
              />
            </div>

            {/* Calendar Date & Time Pickers */}
            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wide block mb-1.5 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-emerald-600" /> Departure Date & Time (Calendar)
              </label>
              <input
                type="datetime-local"
                required
                value={departureDateTime}
                onChange={(e) => setDepartureDateTime(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-600 outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wide block mb-1.5 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-blue-600" /> Estimated Arrival Date & Time (Calendar)
              </label>
              <input
                type="datetime-local"
                required
                value={arrivalDateTime}
                onChange={(e) => setArrivalDateTime(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-600 outline-none"
              />
            </div>
          </div>
        </Card>

        {/* Section 2: Vehicle, Body Type (Open / Closed Body) & Capacity */}
        <Card className="p-6 sm:p-8 border-slate-200 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-lg font-bold text-slate-900">Vehicle Specifications & Body Type</h2>
            <p className="text-xs text-slate-500">Specify whether your vehicle has an Open Body or Closed Container.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            {/* Vehicle Model */}
            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wide block mb-1.5">
                Vehicle Model
              </label>
              <select
                value={vehicleModel}
                onChange={(e) => handleVehicleModelChange(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-600 outline-none"
              >
                <option value="Tata Ace">Tata Ace (750 kg)</option>
                <option value="Mahindra Bolero Maxi Truck">Mahindra Bolero Maxi Truck (1250 kg)</option>
                <option value="Pickup 8ft">Pickup 8ft (1000 kg)</option>
                <option value="Mini Van Express">Mini Van Express (600 kg)</option>
                <option value="Truck 14ft">Truck 14ft (3.5 Tons)</option>
                <option value="Eicher 19ft">Eicher 19ft (7 Tons)</option>
              </select>
            </div>

            {/* Vehicle Body Type: Open Body vs Closed Container */}
            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wide block mb-1.5">
                Vehicle Body Type (Open Body vs Closed Container)
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setBodyType('Closed Container')}
                  className={`p-2.5 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    bodyType === 'Closed Container'
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <Box className="w-4 h-4" />
                  Closed Container
                </button>

                <button
                  type="button"
                  onClick={() => setBodyType('Open Body')}
                  className={`p-2.5 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    bodyType === 'Open Body'
                      ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <Layers className="w-4 h-4" />
                  Open Body
                </button>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wide block mb-1.5">
                Vehicle Registration Number (RC)
              </label>
              <input
                type="text"
                required
                value={registrationNumber}
                onChange={(e) => setRegistrationNumber(e.target.value)}
                placeholder="e.g. TS 09 UA 4421"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-mono font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-600 outline-none uppercase"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wide block mb-1.5">
                Total Vehicle Capacity (kg)
              </label>
              <input
                type="number"
                required
                value={totalCapacity}
                onChange={(e) => setTotalCapacity(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-600 outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wide block mb-1.5">
                Available Unused Space (kg)
              </label>
              <input
                type="number"
                required
                max={totalCapacity}
                value={availableCapacity}
                onChange={(e) => setAvailableCapacity(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-emerald-700 focus:bg-white focus:ring-2 focus:ring-emerald-600 outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wide block mb-1.5">
                Base Route Rate (₹ INR)
              </label>
              <input
                type="number"
                required
                min={1}
                max={15000}
                step={50}
                value={price}
                onChange={(e) => setPrice(Math.min(15000, Math.max(1, Number(e.target.value))))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-600 outline-none"
              />
              <p className="text-[10px] text-slate-400 mt-1">Allowed range: ₹1 – ₹15,000</p>
            </div>

            {/* Capacity Meter Live Preview */}
            <div className="sm:col-span-2 bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-2">
              <CapacityMeter
                totalCapacity={totalCapacity}
                availableCapacity={availableCapacity}
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wide block mb-1.5">
                Additional Notes / Cargo Acceptance Info
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Weather-sealed closed container, dry parcels only"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-600 outline-none"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={() => navigate('/driver')}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="emerald"
              size="md"
              leftIcon={<Truck className="w-4 h-4" />}
              rightIcon={<ArrowRight className="w-4 h-4" />}
              className="font-bold shadow-md"
            >
              Publish Trip & Open Capacity
            </Button>
          </div>
        </Card>

      </form>

    </div>
  );
};
