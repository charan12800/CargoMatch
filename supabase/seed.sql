-- ==============================================================================
-- CARGOMATCH SEED DATA (Supabase Compatible)
-- Automatically seeds auth.users, profiles, vehicles, trips, requests & bookings
-- ==============================================================================

-- 1. Insert into auth.users first to satisfy foreign key constraints
INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    email_change,
    email_change_token_new,
    recovery_token
)
VALUES 
    ('00000000-0000-0000-0000-000000000000', '11111111-1111-1111-1111-111111111111', 'authenticated', 'authenticated', 'rajesh.verma@cargomatch.in', '$2a$10$abcdefghijklmnopqrstuv', NOW(), '{"provider":"email","providers":["email"]}'::jsonb, '{"full_name":"Rajesh Kumar Verma","role":"driver","phone":"+91 98490 12345"}'::jsonb, NOW(), NOW(), '', '', '', ''),
    ('00000000-0000-0000-0000-000000000000', '22222222-2222-2222-2222-222222222222', 'authenticated', 'authenticated', 'suresh.reddy@cargomatch.in', '$2a$10$abcdefghijklmnopqrstuv', NOW(), '{"provider":"email","providers":["email"]}'::jsonb, '{"full_name":"Suresh Reddy","role":"driver","phone":"+91 98850 54321"}'::jsonb, NOW(), NOW(), '', '', '', ''),
    ('00000000-0000-0000-0000-000000000000', '33333333-3333-3333-3333-333333333333', 'authenticated', 'authenticated', 'm.imran@cargomatch.in', '$2a$10$abcdefghijklmnopqrstuv', NOW(), '{"provider":"email","providers":["email"]}'::jsonb, '{"full_name":"Mohammad Imran","role":"driver","phone":"+91 97001 98765"}'::jsonb, NOW(), NOW(), '', '', '', ''),
    ('00000000-0000-0000-0000-000000000000', '44444444-4444-4444-4444-444444444444', 'authenticated', 'authenticated', 'anil.kulkarni@cargomatch.in', '$2a$10$abcdefghijklmnopqrstuv', NOW(), '{"provider":"email","providers":["email"]}'::jsonb, '{"full_name":"Anil Rao Kulkarni","role":"driver","phone":"+91 99123 45678"}'::jsonb, NOW(), NOW(), '', '', '', ''),
    ('00000000-0000-0000-0000-000000000000', '55555555-5555-5555-5555-555555555555', 'authenticated', 'authenticated', 'pooja@techhub.in', '$2a$10$abcdefghijklmnopqrstuv', NOW(), '{"provider":"email","providers":["email"]}'::jsonb, '{"full_name":"Pooja Sundaram (TechHub Solutions)","role":"customer","phone":"+91 94401 22334"}'::jsonb, NOW(), NOW(), '', '', '', ''),
    ('00000000-0000-0000-0000-000000000000', '66666666-6666-6666-6666-666666666666', 'authenticated', 'authenticated', 'vikram.mehta@apex.com', '$2a$10$abcdefghijklmnopqrstuv', NOW(), '{"provider":"email","providers":["email"]}'::jsonb, '{"full_name":"Vikram Mehta (Apex Hardware)","role":"customer","phone":"+91 98220 88990"}'::jsonb, NOW(), NOW(), '', '', '', '')
ON CONFLICT (id) DO NOTHING;

-- 2. Upsert Driver & Customer Profiles with ratings and images
INSERT INTO public.profiles (id, full_name, email, phone, role, profile_image, rating, total_deliveries)
VALUES 
    ('11111111-1111-1111-1111-111111111111', 'Rajesh Kumar Verma', 'rajesh.verma@cargomatch.in', '+91 98490 12345', 'driver', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80', 4.9, 128),
    ('22222222-2222-2222-2222-222222222222', 'Suresh Reddy', 'suresh.reddy@cargomatch.in', '+91 98850 54321', 'driver', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80', 4.8, 94),
    ('33333333-3333-3333-3333-333333333333', 'Mohammad Imran', 'm.imran@cargomatch.in', '+91 97001 98765', 'driver', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80', 4.7, 62),
    ('44444444-4444-4444-4444-444444444444', 'Anil Rao Kulkarni', 'anil.kulkarni@cargomatch.in', '+91 99123 45678', 'driver', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80', 4.95, 215),
    ('55555555-5555-5555-5555-555555555555', 'Pooja Sundaram (TechHub Solutions)', 'pooja@techhub.in', '+91 94401 22334', 'customer', NULL, 4.9, 18),
    ('66666666-6666-6666-6666-666666666666', 'Vikram Mehta (Apex Hardware)', 'vikram.mehta@apex.com', '+91 98220 88990', 'customer', NULL, 5.0, 34)
ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    email = EXCLUDED.email,
    phone = EXCLUDED.phone,
    role = EXCLUDED.role,
    profile_image = EXCLUDED.profile_image,
    rating = EXCLUDED.rating,
    total_deliveries = EXCLUDED.total_deliveries;

-- 3. Insert Vehicles
INSERT INTO public.vehicles (id, driver_id, vehicle_type, body_type, registration_number, total_capacity, length_ft, width_ft, height_ft)
VALUES 
    ('a1111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'Tata Ace', 'Closed Container', 'TS 09 UA 4421', 750, 7.0, 4.5, 4.5),
    ('a2222222-2222-2222-2222-222222222222', '22222222-2222-2222-2222-222222222222', 'Mahindra Bolero Maxi Truck', 'Open Body', 'KA 01 MG 8912', 1250, 8.5, 5.2, 5.0),
    ('a3333333-3333-3333-3333-333333333333', '33333333-3333-3333-3333-333333333333', 'Pickup 8ft', 'Open Body', 'AP 16 TX 3319', 1000, 8.0, 5.0, 4.8),
    ('a4444444-4444-4444-4444-444444444444', '44444444-4444-4444-4444-444444444444', 'Mini Van Express', 'Closed Container', 'TS 07 HK 9022', 600, 6.5, 4.2, 4.0)
ON CONFLICT (id) DO NOTHING;

-- 4. Insert Trips
INSERT INTO public.trips (id, driver_id, vehicle_id, source, destination, departure_time, estimated_arrival, total_capacity, available_capacity, price, is_return_trip, status, notes)
VALUES 
    ('b1111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'a1111111-1111-1111-1111-111111111111', 'Hyderabad', 'Bengaluru', NOW() + INTERVAL '1 day 2 hours', NOW() + INTERVAL '1 day 12 hours', 750, 450, 1200.00, true, 'ACTIVE', 'Returning from delivery in Hyderabad. 450 kg clean closed container space available.'),
    ('b2222222-2222-2222-2222-222222222222', '22222222-2222-2222-2222-222222222222', 'a2222222-2222-2222-2222-222222222222', 'Hyderabad', 'Vijayawada', NOW() + INTERVAL '1 day 14 hours', NOW() + INTERVAL '1 day 20 hours', 1250, 800, 950.00, false, 'SCHEDULED', 'Open body Bolero Maxi Truck. Heavy machinery, construction & hardware items accepted.'),
    ('b3333333-3333-3333-3333-333333333333', '33333333-3333-3333-3333-333333333333', 'a3333333-3333-3333-3333-333333333333', 'Hyderabad', 'Chennai', NOW() + INTERVAL '2 days 1 hour', NOW() + INTERVAL '2 days 15 hours', 1000, 550, 1800.00, true, 'SCHEDULED', 'Empty return trip. Open body pickup with weather cover tarp.'),
    ('b4444444-4444-4444-4444-444444444444', '44444444-4444-4444-4444-444444444444', 'a4444444-4444-4444-4444-444444444444', 'Hyderabad', 'Mumbai', NOW() + INTERVAL '3 days', NOW() + INTERVAL '3 days 16 hours', 600, 350, 2400.00, false, 'SCHEDULED', 'Express mini van route. Weather-sealed closed container, padded interior.')
ON CONFLICT (id) DO NOTHING;

-- 5. Insert Delivery Requests
INSERT INTO public.delivery_requests (id, customer_id, source, destination, pickup_address, pickup_address_details, delivery_address, delivery_address_details, cargo_name, category, weight, length, width, height, quantity, fragile, special_instructions, pickup_date, delivery_date, status)
VALUES 
    ('c1111111-1111-1111-1111-111111111111', '55555555-5555-5555-5555-555555555555', 'Hyderabad', 'Bengaluru', 'Flat 402, Building A, Madhapur, Hyderabad, Telangana - 500081', '{"flat_building": "Flat 402, Building A", "street_area": "Hitec City Phase 2, Madhapur", "city": "Hyderabad", "state": "Telangana", "pincode": "500081"}'::jsonb, 'Plot 7B, Koramangala Industrial Area, Bengaluru, Karnataka - 560034', '{"flat_building": "Plot 7B", "street_area": "7th Block, Koramangala Industrial Area", "city": "Bengaluru", "state": "Karnataka", "pincode": "560034"}'::jsonb, '5 kg Electronics Components (Sensors & PCBs)', 'Electronics & Appliances', 5.0, 30.0, 25.0, 20.0, 2, true, 'Handle with care. Anti-static packaging included.', CURRENT_DATE + 1, CURRENT_DATE + 2, 'BOOKED')
ON CONFLICT (id) DO NOTHING;

-- 6. Insert Bookings
INSERT INTO public.bookings (id, customer_id, driver_id, trip_id, request_id, price, match_score, status, otp, otp_verified, booked_at)
VALUES 
    ('d1111111-1111-1111-1111-111111111111', '55555555-5555-5555-5555-555555555555', '11111111-1111-1111-1111-111111111111', 'b1111111-1111-1111-1111-111111111111', 'c1111111-1111-1111-1111-111111111111', 1200.00, 98, 'IN_TRANSIT', '4829', false, NOW() - INTERVAL '3 hours')
ON CONFLICT (id) DO NOTHING;

-- 7. Insert Notifications
INSERT INTO public.notifications (user_id, title, message, read, type)
VALUES 
    ('55555555-5555-5555-5555-555555555555', 'Cargo In Transit', 'Rajesh Kumar Verma has picked up your 5 kg Electronics cargo and is en route to Bengaluru.', false, 'status_update'),
    ('11111111-1111-1111-1111-111111111111', 'New Cargo Request Accepted', 'You accepted booking #BK-9901 (5 kg Electronics) for ₹1,200.', true, 'booking')
ON CONFLICT DO NOTHING;
