import { supabase, isSupabaseConfigured } from '../supabase';
import { DeliveryRequest } from '../../types';
import { MOCK_REQUESTS } from '../mockData';

/**
 * Fetch all delivery requests with linked customer profiles
 */
export const fetchDeliveryRequests = async (): Promise<{ data: DeliveryRequest[]; error: string | null }> => {
  if (!isSupabaseConfigured()) {
    return { data: MOCK_REQUESTS, error: null };
  }

  try {
    const { data, error } = await supabase
      .from('delivery_requests')
      .select(`
        *,
        customer:profiles!customer_id(*)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Error fetching requests from Supabase, using mock fallback:', error.message);
      return { data: MOCK_REQUESTS, error: error.message };
    }

    return { data: (data as DeliveryRequest[]) || [], error: null };
  } catch (err: any) {
    return { data: MOCK_REQUESTS, error: err.message };
  }
};

/**
 * Create a new cargo delivery request in Supabase
 */
export const createDeliveryRequest = async (
  requestData: Omit<DeliveryRequest, 'id' | 'created_at' | 'status'> & { id?: string; status?: DeliveryRequest['status'] }
): Promise<{ data: DeliveryRequest | null; error: string | null }> => {
  if (!isSupabaseConfigured()) {
    const fallbackRequest: DeliveryRequest = {
      ...requestData,
      id: requestData.id || `req-${Date.now()}`,
      status: requestData.status || 'OPEN',
      created_at: new Date().toISOString(),
    };
    return { data: fallbackRequest, error: null };
  }

  try {
    const payload = {
      customer_id: requestData.customer_id,
      source: requestData.source,
      destination: requestData.destination,
      pickup_address: requestData.pickup_address,
      pickup_address_details: requestData.pickup_address_details || null,
      delivery_address: requestData.delivery_address,
      delivery_address_details: requestData.delivery_address_details || null,
      cargo_name: requestData.cargo_name,
      category: requestData.category,
      weight: requestData.weight,
      length: requestData.length || null,
      width: requestData.width || null,
      height: requestData.height || null,
      quantity: requestData.quantity || 1,
      fragile: Boolean(requestData.fragile),
      special_instructions: requestData.special_instructions || null,
      pickup_date: requestData.pickup_date,
      delivery_date: requestData.delivery_date,
      status: requestData.status || 'OPEN',
    };

    const { data, error } = await supabase
      .from('delivery_requests')
      .insert(payload)
      .select(`
        *,
        customer:profiles!customer_id(*)
      `)
      .single();

    if (error) {
      return { data: null, error: error.message };
    }

    return { data: data as DeliveryRequest, error: null };
  } catch (err: any) {
    return { data: null, error: err.message };
  }
};

/**
 * Update delivery request status
 */
export const updateDeliveryRequestStatus = async (
  requestId: string,
  status: DeliveryRequest['status']
): Promise<{ success: boolean; error: string | null }> => {
  if (!isSupabaseConfigured()) {
    return { success: true, error: null };
  }

  try {
    const { error } = await supabase
      .from('delivery_requests')
      .update({ status })
      .eq('id', requestId);

    if (error) return { success: false, error: error.message };
    return { success: true, error: null };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
};

/**
 * Realtime subscription to delivery_requests table
 */
export const subscribeToRequests = (onUpdate: () => void) => {
  if (!isSupabaseConfigured()) return () => {};

  const channel = supabase
    .channel('requests-realtime')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'delivery_requests' }, () => {
      onUpdate();
    })
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
};
