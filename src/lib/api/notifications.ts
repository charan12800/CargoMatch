import { supabase, isSupabaseConfigured } from '../supabase';
import { AppNotification } from '../../types';
import { MOCK_NOTIFICATIONS } from '../mockData';

/**
 * Fetch notifications for a user
 */
export const fetchNotifications = async (userId: string): Promise<{ data: AppNotification[]; error: string | null }> => {
  if (!isSupabaseConfigured()) {
    return { data: MOCK_NOTIFICATIONS, error: null };
  }

  try {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      return { data: MOCK_NOTIFICATIONS, error: error.message };
    }

    return { data: (data as AppNotification[]) || [], error: null };
  } catch (err: any) {
    return { data: MOCK_NOTIFICATIONS, error: err.message };
  }
};

/**
 * Create a new notification
 */
export const createNotification = async (
  notification: Omit<AppNotification, 'id' | 'created_at' | 'read'>
): Promise<{ data: AppNotification | null; error: string | null }> => {
  if (!isSupabaseConfigured()) {
    const fallback: AppNotification = {
      ...notification,
      id: `notif-${Date.now()}`,
      read: false,
      created_at: new Date().toISOString(),
    };
    return { data: fallback, error: null };
  }

  try {
    const { data, error } = await supabase
      .from('notifications')
      .insert({
        user_id: notification.user_id,
        title: notification.title,
        message: notification.message,
        type: notification.type || 'system',
        read: false,
      })
      .select()
      .single();

    if (error) return { data: null, error: error.message };
    return { data: data as AppNotification, error: null };
  } catch (err: any) {
    return { data: null, error: err.message };
  }
};

/**
 * Mark a single notification as read
 */
export const markNotificationAsRead = async (id: string): Promise<{ success: boolean; error: string | null }> => {
  if (!isSupabaseConfigured()) return { success: true, error: null };

  try {
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', id);

    if (error) return { success: false, error: error.message };
    return { success: true, error: null };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
};

/**
 * Mark all notifications as read for a user
 */
export const markAllNotificationsAsRead = async (userId: string): Promise<{ success: boolean; error: string | null }> => {
  if (!isSupabaseConfigured()) return { success: true, error: null };

  try {
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('user_id', userId);

    if (error) return { success: false, error: error.message };
    return { success: true, error: null };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
};

/**
 * Realtime subscription to notifications table
 */
export const subscribeToNotifications = (userId: string, onUpdate: () => void) => {
  if (!isSupabaseConfigured()) return () => {};

  const channel = supabase
    .channel(`notifications-${userId}`)
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'notifications', filter: `user_id=eq.${userId}` },
      () => {
        onUpdate();
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
};
