import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl || 'https://placeholder.supabase.co', supabaseAnonKey || 'placeholder-key');

export type User = {
  id: string;
  email: string;
  subscription_tier: 'free' | 'starter' | 'pro' | 'enterprise';
  stripe_customer_id?: string;
  created_at: string;
};
