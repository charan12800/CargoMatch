import { supabase, isSupabaseConfigured } from '../supabase';
import { Booking, BookingStatus } from '../../types';
import { MOCK_BOOKINGS } from '../mockData';
import { generateOTP } from '../utils';

/**
 * Fetch all bookings with nested profiles, trips, and requests
 */
export const fetchBookings = async (): Promise<{ data: Booking[]; error: string | null }> => {
  if (!isSupabaseConfigured()) {
    return { data: MOCK_BOOKINGS, error: null };
  }

  try {
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        customer:profiles!customer_id(*),
        driver:profiles!driver_id(*),
        trip:trips!trip_id(
          *,
          driver:profiles!driver_id(*),
          vehicle:vehicles!vehicle_id(*)
        ),
        request:delivery_requests!request_id(*)
      `)
      .order('booked_at', { ascending: false });

    if (error) {
      console.warn('Error fetching bookings from Supabase, using mock fallback:', error.message);
      return { data: MOCK_BOOKINGS, error: error.message };
    }

    return { data: (data as Booking[]) || [], error: null };
  } catch (err: any) {
    return { data: MOCK_BOOKINGS, error: err.message };
  }
};

/**
 * Create a new booking in Supabase
 */
export const createBooking = async (
  bookingData: {
    customer_id: string;
    driver_id: string;
    trip_id: string;
    request_id?: string;
    price: number;
    match_score: number;
    otp?: string;
    payment_status?: Booking['payment_status'];
    payment_method?: Booking['payment_method'];
    transaction_id?: string;
    paid_at?: string;
  }
): Promise<{ data: Booking | null; error: string | null }> => {
  const otpCode = bookingData.otp || generateOTP();

  if (!isSupabaseConfigured()) {
    const fallbackBooking: Booking = {
      id: `bk-${Math.floor(1000 + Math.random() * 9000)}`,
      customer_id: bookingData.customer_id,
      driver_id: bookingData.driver_id,
      trip_id: bookingData.trip_id,
      request_id: bookingData.request_id,
      price: bookingData.price,
      match_score: bookingData.match_score,
      status: 'PENDING',
      otp: otpCode,
      otp_verified: false,
      payment_status: bookingData.payment_status || 'PAID',
      payment_method: bookingData.payment_method || 'UPI',
      transaction_id: bookingData.transaction_id || `TXN-UPI-${Math.floor(100000 + Math.random() * 900000)}`,
      paid_at: bookingData.paid_at || new Date().toISOString(),
      booked_at: new Date().toISOString(),
    };
    return { data: fallbackBooking, error: null };
  }

  try {
    const payload = {
      customer_id: bookingData.customer_id,
      driver_id: bookingData.driver_id,
      trip_id: bookingData.trip_id,
      request_id: bookingData.request_id || null,
      price: bookingData.price,
      match_score: bookingData.match_score,
      status: 'PENDING',
      otp: otpCode,
      otp_verified: false,
      payment_status: bookingData.payment_status || 'PAID',
      payment_method: bookingData.payment_method || 'UPI',
      transaction_id: bookingData.transaction_id || `TXN-UPI-${Math.floor(100000 + Math.random() * 900000)}`,
      paid_at: bookingData.paid_at || new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('bookings')
      .insert(payload)
      .select(`
        *,
        customer:profiles!customer_id(*),
        driver:profiles!driver_id(*),
        trip:trips!trip_id(*),
        request:delivery_requests!request_id(*)
      `)
      .single();

    if (error) {
      return { data: null, error: error.message };
    }

    return { data: data as Booking, error: null };
  } catch (err: any) {
    return { data: null, error: err.message };
  }
};

/**
 * Update booking status
 */
export const updateBookingStatus = async (
  bookingId: string,
  newStatus: BookingStatus
): Promise<{ success: boolean; error: string | null }> => {
  if (!isSupabaseConfigured()) {
    return { success: true, error: null };
  }

  try {
    const updates: any = { status: newStatus };
    if (newStatus === 'DELIVERED') {
      updates.delivered_at = new Date().toISOString();
    }

    const { error } = await supabase
      .from('bookings')
      .update(updates)
      .eq('id', bookingId);

    if (error) return { success: false, error: error.message };
    return { success: true, error: null };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
};

/**
 * Verify OTP on delivery handover
 */
export const verifyDeliveryOTP = async (
  bookingId: string,
  enteredOtp: string
): Promise<{ success: boolean; message: string }> => {
  if (!isSupabaseConfigured()) {
    return { success: true, message: 'OTP verified (Demo Mode).' };
  }

  try {
    const { data: booking, error: fetchErr } = await supabase
      .from('bookings')
      .select('otp')
      .eq('id', bookingId)
      .single();

    if (fetchErr || !booking) {
      return { success: false, message: 'Booking not found.' };
    }

    if (booking.otp.trim() !== enteredOtp.trim()) {
      return { success: false, message: 'Invalid OTP. Please check with customer.' };
    }

    const { error: updateErr } = await supabase
      .from('bookings')
      .update({
        status: 'DELIVERED',
        otp_verified: true,
        delivered_at: new Date().toISOString(),
      })
      .eq('id', bookingId);

    if (updateErr) {
      return { success: false, message: `Failed to update delivery status: ${updateErr.message}` };
    }

    return { success: true, message: 'OTP Verified successfully! Delivery marked complete.' };
  } catch (err: any) {
    return { success: false, message: err.message || 'OTP verification failed.' };
  }
};

/**
 * Realtime subscription to bookings table
 */
export const subscribeToBookings = (onUpdate: () => void) => {
  if (!isSupabaseConfigured()) return () => {};

  const channel = supabase
    .channel('bookings-realtime')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'bookings' }, () => {
      onUpdate();
    })
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
};
