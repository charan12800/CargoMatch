export type UserRole = 'customer' | 'driver' | 'admin';

export type BookingStatus =
  | 'PENDING'
  | 'ACCEPTED'
  | 'PICKED_UP'
  | 'IN_TRANSIT'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'CANCELLED';

export type TripStatus = 'SCHEDULED' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';

export type RequestStatus = 'OPEN' | 'MATCHED' | 'BOOKED' | 'DELIVERED' | 'CANCELLED';

export type VehicleBodyType = 'Open Body' | 'Closed Container';

export type CargoCategory =
  | 'Electronics & Appliances'
  | 'Textiles & Garments'
  | 'Automotive Parts & Tyres'
  | 'Industrial Machinery & Equipment'
  | 'Furniture & Home Decor'
  | 'Chemicals & Fertilizers'
  | 'Building & Construction Materials'
  | 'Pharmaceuticals & Medical Supplies'
  | 'FMCG & Packaged Foods'
  | 'Agricultural Produce & Grains'
  | 'Perishables & Dairy'
  | 'Hardware & Electricals'
  | 'Books & Stationery'
  | 'Documents & Legal Parcels'
  | 'Plastics & Rubber Goods'
  | 'Metal & Steel Fabrication'
  | 'Solar Panels & Clean Tech'
  | 'General Commercial Goods'
  | 'Other / Miscellaneous';

export interface StructuredAddress {
  flat_building: string;
  street_area: string;
  city: string;
  state: string;
  pincode: string;
}

export interface Profile {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  role: UserRole;
  profile_image?: string;
  rating: number;
  total_deliveries?: number;
  created_at: string;
}

export interface Vehicle {
  id: string;
  driver_id: string;
  vehicle_type: string; // e.g. 'Tata Ace', 'Mahindra Bolero', 'Pickup 8ft', 'Mini Van', 'Truck 14ft', 'Eicher 19ft'
  body_type: VehicleBodyType; // 'Open Body' | 'Closed Container'
  registration_number: string;
  total_capacity: number; // in kg
  length_ft?: number;
  width_ft?: number;
  height_ft?: number;
  created_at: string;
}

export interface Trip {
  id: string;
  driver_id: string;
  driver?: Profile;
  vehicle_id?: string;
  vehicle?: Vehicle;
  source: string;
  destination: string;
  departure_time: string;
  estimated_arrival: string;
  total_capacity: number; // in kg
  available_capacity: number; // in kg
  price: number; // base rate
  is_return_trip: boolean;
  status: TripStatus;
  notes?: string;
  created_at: string;
}

export interface DeliveryRequest {
  id: string;
  customer_id: string;
  customer?: Profile;
  source: string;
  destination: string;
  pickup_address: string;
  pickup_address_details?: StructuredAddress;
  delivery_address: string;
  delivery_address_details?: StructuredAddress;
  cargo_name: string;
  category: CargoCategory | string;
  weight: number; // in kg
  length?: number; // in cm
  width?: number; // in cm
  height?: number; // in cm
  quantity: number;
  fragile: boolean;
  special_instructions?: string;
  pickup_date: string;
  delivery_date: string;
  status: RequestStatus;
  created_at: string;
}

export type PaymentStatus = 'PAID' | 'PENDING' | 'REFUNDED';
export type PaymentMethod = 'UPI' | 'CARD' | 'NETBANKING' | 'WALLET' | 'COD';

export interface PriceBreakdown {
  distanceKm: number;
  weightKg: number;
  isReturnTrip: boolean;
  baseBookingFee: number;
  distanceCharge: number;
  weightCharge: number;
  capacityUtilizationDiscount: number;
  subtotalStandard: number;
  returnTripDiscountAmount: number;
  fragileHandlingFee: number;
  gstAmount: number;
  finalPrice: number;
  traditionalCourierPrice: number;
  totalSavingsAmount: number;
  savingsPercentage: number;
  ratePerKm: number;
  ratePerKg: number;
}

export interface Booking {
  id: string;
  customer_id: string;
  customer?: Profile;
  driver_id: string;
  driver?: Profile;
  trip_id: string;
  trip?: Trip;
  request_id?: string;
  request?: DeliveryRequest;
  price: number;
  match_score: number;
  status: BookingStatus;
  otp: string;
  otp_verified: boolean;
  payment_status?: PaymentStatus;
  payment_method?: PaymentMethod;
  transaction_id?: string;
  paid_at?: string;
  booked_at: string;
  delivered_at?: string;
}

export interface Rating {
  id: string;
  booking_id: string;
  customer_id: string;
  driver_id: string;
  rating: number; // 1 to 5
  review?: string;
  created_at: string;
}

export interface AppNotification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  read: boolean;
  type?: 'booking' | 'status_update' | 'trip' | 'system';
  created_at: string;
}

export interface MatchFactorBreakdown {
  name: string;
  score: number; // 0 - 100
  weight: number; // percentage
  explanation: string;
}

export interface MatchScoreResult {
  trip: Trip;
  match_score: number; // 0 - 100
  best_match: boolean;
  estimated_price: number;
  price_breakdown?: PriceBreakdown;
  factors: MatchFactorBreakdown[];
  reasons: string[];
}

