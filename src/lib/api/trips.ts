import { supabase, isSupabaseConfigured } from '../supabase';
import { Trip } from '../../types';
import { MOCK_TRIPS } from '../mockData';

/**
 * Fetch all active trips with linked driver and vehicle profiles
 */
export const fetchTrips = async (): Promise<{ data: Trip[]; error: string | null }> => {
  if (!isSupabaseConfigured()) {
    return { data: MOCK_TRIPS, error: null };
  }

  try {
    const { data, error } = await supabase
      .from('trips')
      .select(`
        *,
        driver:profiles!driver_id(*),
        vehicle:vehicles!vehicle_id(*)
      `)
      .order('departure_time', { ascending: true });

    if (error) {
      console.warn('Error fetching trips from Supabase, using mock fallback:', error.message);
      return { data: MOCK_TRIPS, error: error.message };
    }

    return { data: (data as Trip[]) || [], error: null };
  } catch (err: any) {
    return { data: MOCK_TRIPS, error: err.message };
  }
};

/**
 * Create a new trip in Supabase
 */
export const createTrip = async (
  tripData: Omit<Trip, 'id' | 'created_at' | 'status'> & { id?: string; status?: Trip['status'] }
): Promise<{ data: Trip | null; error: string | null }> => {
  if (!isSupabaseConfigured()) {
    const fallbackTrip: Trip = {
      ...tripData,
      id: tripData.id || `trip-${Date.now()}`,
      status: tripData.status || 'ACTIVE',
      created_at: new Date().toISOString(),
    };
    return { data: fallbackTrip, error: null };
  }

  try {
    const payload = {
      driver_id: tripData.driver_id,
      vehicle_id: tripData.vehicle_id || null,
      source: tripData.source,
      destination: tripData.destination,
      departure_time: tripData.departure_time,
      estimated_arrival: tripData.estimated_arrival,
      total_capacity: tripData.total_capacity,
      available_capacity: tripData.available_capacity,
      price: tripData.price,
      is_return_trip: tripData.is_return_trip,
      status: tripData.status || 'ACTIVE',
      notes: tripData.notes || null,
    };

    const { data, error } = await supabase
      .from('trips')
      .insert(payload)
      .select(`
        *,
        driver:profiles!driver_id(*),
        vehicle:vehicles!vehicle_id(*)
      `)
      .single();

    if (error) {
      return { data: null, error: error.message };
    }

    return { data: data as Trip, error: null };
  } catch (err: any) {
    return { data: null, error: err.message };
  }
};

/**
 * Update trip status or capacity
 */
export const updateTrip = async (
  tripId: string,
  updates: Partial<Trip>
): Promise<{ data: Trip | null; error: string | null }> => {
  if (!isSupabaseConfigured()) {
    return { data: null, error: null };
  }

  try {
    const { data, error } = await supabase
      .from('trips')
      .update(updates)
      .eq('id', tripId)
      .select()
      .single();

    if (error) return { data: null, error: error.message };
    return { data: data as Trip, error: null };
  } catch (err: any) {
    return { data: null, error: err.message };
  }
};

/**
 * Realtime subscription to trips table
 */
export const subscribeToTrips = (onUpdate: () => void) => {
  if (!isSupabaseConfigured()) return () => {};

  const channel = supabase
    .channel('trips-realtime')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'trips' }, () => {
      onUpdate();
    })
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
};
