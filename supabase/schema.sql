-- ==============================================================================
-- CARGOMATCH POSTGRESQL SCHEMA (Supabase)
-- AI-Powered Shared-Capacity Logistics Marketplace
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
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
CREATE TABLE IF NOT EXISTS public.vehicles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    driver_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    vehicle_type TEXT NOT NULL,
    body_type TEXT DEFAULT 'Closed Container' CHECK (body_type IN ('Open Body', 'Closed Container')),
    registration_number TEXT NOT NULL UNIQUE,
    total_capacity INTEGER NOT NULL, -- in kg
    length_ft NUMERIC(4, 1),
    width_ft NUMERIC(4, 1),
    height_ft NUMERIC(4, 1),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. TRIPS TABLE
CREATE TABLE IF NOT EXISTS public.trips (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    driver_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE SET NULL,
    source TEXT NOT NULL,
    destination TEXT NOT NULL,
    intermediate_stops TEXT[] DEFAULT '{}',
    departure_time TIMESTAMP WITH TIME ZONE NOT NULL,
    estimated_arrival TIMESTAMP WITH TIME ZONE NOT NULL,
    total_capacity INTEGER NOT NULL, -- in kg
    available_capacity INTEGER NOT NULL, -- in kg
    price NUMERIC(10, 2) NOT NULL,
    is_return_trip BOOLEAN DEFAULT false NOT NULL,
    status TEXT DEFAULT 'ACTIVE' CHECK (status IN ('SCHEDULED', 'ACTIVE', 'COMPLETED', 'CANCELLED')),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. DELIVERY REQUESTS TABLE
CREATE TABLE IF NOT EXISTS public.delivery_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    source TEXT NOT NULL,
    destination TEXT NOT NULL,
    pickup_address TEXT NOT NULL,
    pickup_address_details JSONB,
    delivery_address TEXT NOT NULL,
    delivery_address_details JSONB,
    cargo_name TEXT NOT NULL,
    category TEXT NOT NULL,
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
CREATE TABLE IF NOT EXISTS public.bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    driver_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    trip_id UUID REFERENCES public.trips(id) ON DELETE CASCADE NOT NULL,
    request_id UUID REFERENCES public.delivery_requests(id) ON DELETE SET NULL,
    price NUMERIC(10, 2) NOT NULL,
    match_score INTEGER NOT NULL DEFAULT 95,
    status TEXT DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'ACCEPTED', 'PICKED_UP', 'IN_TRANSIT', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED')),
    otp TEXT NOT NULL,
    otp_verified BOOLEAN DEFAULT false NOT NULL,
    payment_status TEXT DEFAULT 'PAID' CHECK (payment_status IN ('PAID', 'PENDING', 'REFUNDED')),
    payment_method TEXT DEFAULT 'UPI' CHECK (payment_method IN ('UPI', 'CARD', 'NETBANKING', 'WALLET', 'COD')),
    transaction_id TEXT,
    paid_at TIMESTAMP WITH TIME ZONE,
    booked_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    delivered_at TIMESTAMP WITH TIME ZONE
);

-- 6. RATINGS TABLE
CREATE TABLE IF NOT EXISTS public.ratings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE NOT NULL,
    customer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    driver_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
    review TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    read BOOLEAN DEFAULT false NOT NULL,
    type TEXT DEFAULT 'system',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- INDEXES FOR HIGH-PERFORMANCE SEARCH & MATCHING
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_trips_source_destination ON public.trips(source, destination);
CREATE INDEX IF NOT EXISTS idx_trips_driver_id ON public.trips(driver_id);
CREATE INDEX IF NOT EXISTS idx_trips_status ON public.trips(status);
CREATE INDEX IF NOT EXISTS idx_delivery_requests_source_dest ON public.delivery_requests(source, destination);
CREATE INDEX IF NOT EXISTS idx_delivery_requests_status ON public.delivery_requests(status);
CREATE INDEX IF NOT EXISTS idx_delivery_requests_customer_id ON public.delivery_requests(customer_id);
CREATE INDEX IF NOT EXISTS idx_bookings_customer_id ON public.bookings(customer_id);
CREATE INDEX IF NOT EXISTS idx_bookings_driver_id ON public.bookings(driver_id);
CREATE INDEX IF NOT EXISTS idx_bookings_trip_id ON public.bookings(trip_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);

-- ==============================================================================
-- AUTOMATIC PROFILE CREATION TRIGGER ON AUTH SIGNUP
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, role, phone)
    VALUES (
        new.id,
        new.email,
        COALESCE(new.raw_user_meta_data->>'full_name', 'CargoMatch User'),
        COALESCE(new.raw_user_meta_data->>'role', 'customer'),
        new.raw_user_meta_data->>'phone'
    )
    ON CONFLICT (id) DO UPDATE
    SET 
        full_name = EXCLUDED.full_name,
        role = EXCLUDED.role,
        phone = EXCLUDED.phone;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.delivery_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Profiles: Public read, owner update/insert
CREATE POLICY "Profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Vehicles: Public read, driver manage
CREATE POLICY "Vehicles are viewable by everyone" ON public.vehicles FOR SELECT USING (true);
CREATE POLICY "Drivers can manage their vehicles" ON public.vehicles FOR ALL USING (auth.uid() = driver_id);

-- Trips: Public read, driver manage
CREATE POLICY "Trips are viewable by everyone" ON public.trips FOR SELECT USING (true);
CREATE POLICY "Drivers can insert trips" ON public.trips FOR INSERT WITH CHECK (auth.uid() = driver_id);
CREATE POLICY "Drivers can update their trips" ON public.trips FOR UPDATE USING (auth.uid() = driver_id);
CREATE POLICY "Drivers can delete their trips" ON public.trips FOR DELETE USING (auth.uid() = driver_id);

-- Delivery Requests: Public read for matching, customer manage
CREATE POLICY "Requests are viewable by everyone" ON public.delivery_requests FOR SELECT USING (true);
CREATE POLICY "Customers can create requests" ON public.delivery_requests FOR INSERT WITH CHECK (auth.uid() = customer_id);
CREATE POLICY "Customers can update their requests" ON public.delivery_requests FOR UPDATE USING (auth.uid() = customer_id);
CREATE POLICY "Customers can delete their requests" ON public.delivery_requests FOR DELETE USING (auth.uid() = customer_id);

-- Bookings: Involved users can view and manage
CREATE POLICY "Users can view their bookings" ON public.bookings FOR SELECT 
USING (auth.uid() = customer_id OR auth.uid() = driver_id);
CREATE POLICY "Customers can create bookings" ON public.bookings FOR INSERT WITH CHECK (auth.uid() = customer_id);
CREATE POLICY "Users can update their bookings" ON public.bookings FOR UPDATE 
USING (auth.uid() = customer_id OR auth.uid() = driver_id);

-- Notifications: User specific
CREATE POLICY "Users can view their notifications" ON public.notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their notifications" ON public.notifications FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Service or users can insert notifications" ON public.notifications FOR INSERT WITH CHECK (true);

-- Ratings: Public read, customer insert
CREATE POLICY "Ratings are viewable by everyone" ON public.ratings FOR SELECT USING (true);
CREATE POLICY "Customers can create ratings" ON public.ratings FOR INSERT WITH CHECK (auth.uid() = customer_id);

-- ==============================================================================
-- REALTIME SUBSCRIPTIONS
-- ==============================================================================
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
        CREATE PUBLICATION supabase_realtime;
    END IF;
END $$;

ALTER PUBLICATION supabase_realtime ADD TABLE public.trips;
ALTER PUBLICATION supabase_realtime ADD TABLE public.delivery_requests;
ALTER PUBLICATION supabase_realtime ADD TABLE public.bookings;
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
