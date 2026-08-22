-- ==============================================================================
-- CARGMATCH POSTGRESQL SCHEMA (Supabase)
-- AI-Powered Shared-Capacity Logistics Marketplace
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES TABLE
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    role TEXT NOT NULL CHECK (role IN ('customer', 'driver', 'admin')),
    profile_image TEXT,
    rating NUMERIC(3, 2) DEFAULT 5.0,
    total_deliveries INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. VEHICLES TABLE
CREATE TABLE IF NOT EXISTS vehicles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    driver_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    vehicle_type TEXT NOT NULL,
    registration_number TEXT NOT NULL UNIQUE,
    total_capacity INTEGER NOT NULL, -- in kg
    length_ft NUMERIC(4, 1),
    width_ft NUMERIC(4, 1),
    height_ft NUMERIC(4, 1),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. TRIPS TABLE
CREATE TABLE IF NOT EXISTS trips (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    driver_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    vehicle_id UUID REFERENCES vehicles(id) ON DELETE SET NULL,
    source TEXT NOT NULL,
    destination TEXT NOT NULL,
    intermediate_stops TEXT[] DEFAULT '{}',
    departure_time TIMESTAMP WITH TIME ZONE NOT NULL,
    estimated_arrival TIMESTAMP WITH TIME ZONE NOT NULL,
    total_capacity INTEGER NOT NULL, -- in kg
    available_capacity INTEGER NOT NULL, -- in kg
    price NUMERIC(10, 2) NOT NULL,
    is_return_trip BOOLEAN DEFAULT false NOT NULL,
    status TEXT DEFAULT 'SCHEDULED' CHECK (status IN ('SCHEDULED', 'ACTIVE', 'COMPLETED', 'CANCELLED')),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. DELIVERY REQUESTS TABLE
CREATE TABLE IF NOT EXISTS delivery_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    source TEXT NOT NULL,
    destination TEXT NOT NULL,
    pickup_address TEXT NOT NULL,
    delivery_address TEXT NOT NULL,
    cargo_name TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('Electronics', 'Textiles & Garments', 'Automotive Parts', 'Commercial Goods', 'Perishables', 'Documents', 'Other')),
    weight NUMERIC(8, 2) NOT NULL, -- in kg
    length NUMERIC(6, 1), -- in cm
    width NUMERIC(6, 1), -- in cm
    height NUMERIC(6, 1), -- in cm
    quantity INTEGER DEFAULT 1 NOT NULL,
    fragile BOOLEAN DEFAULT false NOT NULL,
    special_instructions TEXT,
    pickup_date DATE NOT NULL,
    delivery_date DATE NOT NULL,
    budget_max NUMERIC(10, 2),
    status TEXT DEFAULT 'OPEN' CHECK (status IN ('OPEN', 'MATCHED', 'BOOKED', 'DELIVERED', 'CANCELLED')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. BOOKINGS TABLE
CREATE TABLE IF NOT EXISTS bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    driver_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    trip_id UUID REFERENCES trips(id) ON DELETE CASCADE NOT NULL,
    request_id UUID REFERENCES delivery_requests(id) ON DELETE SET NULL,
    price NUMERIC(10, 2) NOT NULL,
    match_score INTEGER NOT NULL,
    status TEXT DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'ACCEPTED', 'PICKED_UP', 'IN_TRANSIT', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED')),
    otp TEXT NOT NULL,
    otp_verified BOOLEAN DEFAULT false NOT NULL,
    booked_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    delivered_at TIMESTAMP WITH TIME ZONE
);

-- 6. RATINGS TABLE
CREATE TABLE IF NOT EXISTS ratings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE NOT NULL,
    customer_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    driver_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
    review TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    read BOOLEAN DEFAULT false NOT NULL,
    type TEXT DEFAULT 'system',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE delivery_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Profiles: Public read, self update
CREATE POLICY "Profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update their own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Vehicles: Public read, driver manage
CREATE POLICY "Vehicles are viewable by everyone" ON vehicles FOR SELECT USING (true);
CREATE POLICY "Drivers can manage their own vehicles" ON vehicles FOR ALL USING (auth.uid() = driver_id);

-- Trips: Public read, driver manage
CREATE POLICY "Trips are viewable by everyone" ON trips FOR SELECT USING (true);
CREATE POLICY "Drivers can manage their own trips" ON trips FOR ALL USING (auth.uid() = driver_id);

-- Delivery Requests: Customer manage, drivers view
CREATE POLICY "Customers can manage their own requests" ON delivery_requests FOR ALL USING (auth.uid() = customer_id);
CREATE POLICY "Drivers can view open requests" ON delivery_requests FOR SELECT USING (true);

-- Bookings: Customers and drivers involved can view/update
CREATE POLICY "Users can view their own bookings" ON bookings FOR SELECT 
USING (auth.uid() = customer_id OR auth.uid() = driver_id);
CREATE POLICY "Customers can create bookings" ON bookings FOR INSERT WITH CHECK (auth.uid() = customer_id);
CREATE POLICY "Drivers and customers can update their bookings" ON bookings FOR UPDATE 
USING (auth.uid() = customer_id OR auth.uid() = driver_id);

-- Notifications: Users can view and manage their own notifications
CREATE POLICY "Users can view their notifications" ON notifications FOR ALL USING (auth.uid() = user_id);

-- Ratings: Public read, customers insert for completed bookings
CREATE POLICY "Ratings are viewable by everyone" ON ratings FOR SELECT USING (true);
CREATE POLICY "Customers can create ratings" ON ratings FOR INSERT WITH CHECK (auth.uid() = customer_id);
