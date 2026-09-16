import { supabase, isSupabaseConfigured } from '../supabase';
import { Profile, UserRole } from '../../types';
import { MOCK_CUSTOMERS, MOCK_DRIVERS } from '../mockData';

export interface SignUpParams {
  email: string;
  password?: string;
  fullName: string;
  role: UserRole;
  phone?: string;
}

export interface SignInParams {
  email: string;
  password?: string;
}

/**
 * Sign up a new user with Supabase Auth and initialize profile
 */
export const signUpUser = async (params: SignUpParams): Promise<{ profile: Profile | null; error: string | null }> => {
  if (!isSupabaseConfigured()) {
    // Local demo mode: create mock profile
    const newProfile: Profile = {
      id: `usr-${Date.now()}`,
      full_name: params.fullName,
      email: params.email,
      phone: params.phone,
      role: params.role,
      rating: 5.0,
      total_deliveries: 0,
      created_at: new Date().toISOString(),
    };
    return { profile: newProfile, error: null };
  }

  try {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: params.email,
      password: params.password || 'TemporaryPassword123!',
      options: {
        data: {
          full_name: params.fullName,
          role: params.role,
          phone: params.phone || '',
        },
      },
    });

    if (authError) {
      return { profile: null, error: authError.message };
    }

    if (!authData.user) {
      return { profile: null, error: 'User registration failed. Please try again.' };
    }

    // Check or insert profile record
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authData.user.id)
      .single();

    if (profileError || !profileData) {
      // If trigger hasn't finished, upsert manually
      const { data: inserted, error: upsertError } = await supabase
        .from('profiles')
        .upsert({
          id: authData.user.id,
          full_name: params.fullName,
          email: params.email,
          phone: params.phone || null,
          role: params.role,
          rating: 5.0,
          total_deliveries: 0,
        })
        .select()
        .single();

      if (upsertError) {
        return {
          profile: {
            id: authData.user.id,
            full_name: params.fullName,
            email: params.email,
            phone: params.phone,
            role: params.role,
            rating: 5.0,
            total_deliveries: 0,
            created_at: new Date().toISOString(),
          },
          error: null,
        };
      }

      return { profile: inserted as Profile, error: null };
    }

    return { profile: profileData as Profile, error: null };
  } catch (err: any) {
    return { profile: null, error: err.message || 'An unexpected error occurred during sign up.' };
  }
};

/**
 * Sign in existing user with email and password
 */
export const signInUser = async (params: SignInParams): Promise<{ profile: Profile | null; error: string | null }> => {
  if (!isSupabaseConfigured()) {
    // Local demo mode fallback
    const allUsers = [...MOCK_CUSTOMERS, ...MOCK_DRIVERS];
    const found = allUsers.find((u) => u.email.toLowerCase() === params.email.toLowerCase()) || {
      id: `usr-${Date.now()}`,
      full_name: params.email.split('@')[0],
      email: params.email,
      role: 'customer' as UserRole,
      rating: 5.0,
      total_deliveries: 0,
      created_at: new Date().toISOString(),
    };
    return { profile: found, error: null };
  }

  try {
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: params.email,
      password: params.password || '',
    });

    if (authError) {
      return { profile: null, error: authError.message };
    }

    if (!authData.user) {
      return { profile: null, error: 'Sign in failed.' };
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authData.user.id)
      .single();

    if (profileError || !profile) {
      // Fallback profile if record missing
      const fallback: Profile = {
        id: authData.user.id,
        email: authData.user.email || params.email,
        full_name: authData.user.user_metadata?.full_name || params.email.split('@')[0],
        role: (authData.user.user_metadata?.role as UserRole) || 'customer',
        phone: authData.user.user_metadata?.phone,
        rating: 5.0,
        total_deliveries: 0,
        created_at: authData.user.created_at,
      };
      return { profile: fallback, error: null };
    }

    return { profile: profile as Profile, error: null };
  } catch (err: any) {
    return { profile: null, error: err.message || 'An unexpected error occurred during sign in.' };
  }
};

/**
 * Sign out current user
 */
export const signOutUser = async (): Promise<{ error: string | null }> => {
  if (!isSupabaseConfigured()) {
    return { error: null };
  }

  try {
    const { error } = await supabase.auth.signOut();
    return { error: error ? error.message : null };
  } catch (err: any) {
    return { error: err.message || 'Error signing out.' };
  }
};

/**
 * Get current authenticated profile
 */
export const getCurrentProfile = async (): Promise<Profile | null> => {
  if (!isSupabaseConfigured()) return null;

  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return null;

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single();

    if (profile) return profile as Profile;

    return {
      id: session.user.id,
      email: session.user.email || '',
      full_name: session.user.user_metadata?.full_name || 'CargoMatch User',
      role: (session.user.user_metadata?.role as UserRole) || 'customer',
      phone: session.user.user_metadata?.phone,
      rating: 5.0,
      total_deliveries: 0,
      created_at: session.user.created_at,
    };
  } catch {
    return null;
  }
};
