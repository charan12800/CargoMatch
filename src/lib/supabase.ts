import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});

/**
 * Checks if valid Supabase environment variables have been provided
 */
export const isSupabaseConfigured = (): boolean => {
  const url = import.meta.env.VITE_SUPABASE_URL;
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
  return Boolean(
    url &&
    key &&
    url.trim() !== '' &&
    key.trim() !== '' &&
    url !== 'https://placeholder.supabase.co' &&
    key !== 'placeholder-anon-key'
  );
};

/**
 * Test active database connection to Supabase
 */
export const testSupabaseConnection = async (): Promise<{ success: boolean; message: string; latencyMs?: number }> => {
  if (!isSupabaseConfigured()) {
    return {
      success: false,
      message: 'Supabase environment variables (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY) are not configured.',
    };
  }

  const start = performance.now();
  try {
    const { error } = await supabase.from('profiles').select('id').limit(1);
    const latency = Math.round(performance.now() - start);

    if (error) {
      // If table doesn't exist yet, it's connected but schema is missing
      if (error.code === '42P01') {
        return {
          success: false,
          message: 'Connected to Supabase, but tables have not been created yet. Please run supabase/schema.sql in the SQL Editor.',
        };
      }
      return {
        success: false,
        message: `Database error: ${error.message} (${error.code || 'UNKNOWN'})`,
      };
    }

    return {
      success: true,
      message: `Successfully connected to Supabase PostgreSQL database (${latency}ms latency).`,
      latencyMs: latency,
    };
  } catch (err: any) {
    return {
      success: false,
      message: err?.message || 'Network connection failed while reaching Supabase.',
    };
  }
};
