import { supabase, isSupabaseConfigured } from '../supabase';
import { Rating } from '../../types';

/**
 * Submit a customer rating and update driver rating aggregate
 */
export const submitRating = async (
  ratingData: Omit<Rating, 'id' | 'created_at'>
): Promise<{ data: Rating | null; error: string | null }> => {
  if (!isSupabaseConfigured()) {
    const fallback: Rating = {
      ...ratingData,
      id: `rat-${Date.now()}`,
      created_at: new Date().toISOString(),
    };
    return { data: fallback, error: null };
  }

  try {
    const { data, error } = await supabase
      .from('ratings')
      .insert({
        booking_id: ratingData.booking_id,
        customer_id: ratingData.customer_id,
        driver_id: ratingData.driver_id,
        rating: ratingData.rating,
        review: ratingData.review || null,
      })
      .select()
      .single();

    if (error) return { data: null, error: error.message };

    // Update driver's total deliveries and average rating
    try {
      const { data: driverRatings } = await supabase
        .from('ratings')
        .select('rating')
        .eq('driver_id', ratingData.driver_id);

      if (driverRatings && driverRatings.length > 0) {
        const avg = driverRatings.reduce((sum, r) => sum + r.rating, 0) / driverRatings.length;
        await supabase
          .from('profiles')
          .update({
            rating: Number(avg.toFixed(2)),
            total_deliveries: driverRatings.length,
          })
          .eq('id', ratingData.driver_id);
      }
    } catch (e) {
      console.warn('Could not update driver rating aggregate:', e);
    }

    return { data: data as Rating, error: null };
  } catch (err: any) {
    return { data: null, error: err.message };
  }
};

/**
 * Fetch ratings for a specific driver
 */
export const fetchDriverRatings = async (driverId: string): Promise<{ data: Rating[]; error: string | null }> => {
  if (!isSupabaseConfigured()) {
    return { data: [], error: null };
  }

  try {
    const { data, error } = await supabase
      .from('ratings')
      .select('*')
      .eq('driver_id', driverId)
      .order('created_at', { ascending: false });

    if (error) return { data: [], error: error.message };
    return { data: (data as Rating[]) || [], error: null };
  } catch (err: any) {
    return { data: [], error: err.message };
  }
};
