import { createSupabaseServerClient } from "./supabase-server";

export type UserRole = "user" | "admin" | "super_admin";

export interface UserProfile {
  id: string;
  email: string;
  role: UserRole;
  subscription_tier: "free" | "starter" | "pro" | "enterprise";
  stripe_customer_id?: string;
  created_at: string;
  updated_at?: string;
}

export interface DiscountCode {
  id: string;
  code: string;
  type: "percentage" | "fixed";
  value: number;
  max_uses: number | null;
  uses: number;
  expires_at: string | null;
  is_active: boolean;
  created_at: string;
  created_by: string;
}

export async function isUserSuperAdmin(userId: string): Promise<boolean> {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("user_profiles")
    .select("role")
    .eq("id", userId)
    .single();

  if (error || !data) {
    return false;
  }

  return data.role === "super_admin";
}

export async function getUserProfile(
  userId: string,
): Promise<UserProfile | null> {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error || !data) {
    return null;
  }

  return data as UserProfile;
}

export async function getAllUsers(): Promise<UserProfile[]> {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("user_profiles")
    .select("*")
    .order("created_at", { ascending: false });

  if (error || !data) {
    return [];
  }

  return data as UserProfile[];
}

export async function getDiscountCodes(): Promise<DiscountCode[]> {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("discount_codes")
    .select("*")
    .order("created_at", { ascending: false });

  if (error || !data) {
    return [];
  }

  return data as DiscountCode[];
}

export async function getAdminStats() {
  const supabase = await createSupabaseServerClient();

  // Get total signups
  const { count: totalSignups } = await supabase
    .from("user_profiles")
    .select("*", { count: "exact", head: true });

  // Get active members (with paid subscription)
  const { count: activeMembers } = await supabase
    .from("user_profiles")
    .select("*", { count: "exact", head: true })
    .neq("subscription_tier", "free");

  // Get subscription breakdown
  const { data: subscriptionData } = await supabase
    .from("user_profiles")
    .select("subscription_tier");

  const subscriptionBreakdown = {
    free: 0,
    starter: 0,
    pro: 0,
    enterprise: 0,
  };

  subscriptionData?.forEach((user) => {
    const tier = user.subscription_tier as keyof typeof subscriptionBreakdown;
    if (tier in subscriptionBreakdown) {
      subscriptionBreakdown[tier]++;
    }
  });

  // Calculate ARR (Annual Recurring Revenue)
  const pricing = {
    free: 0,
    starter: 19,
    pro: 49,
    enterprise: 149,
  };

  const monthlyRevenue =
    subscriptionBreakdown.starter * pricing.starter +
    subscriptionBreakdown.pro * pricing.pro +
    subscriptionBreakdown.enterprise * pricing.enterprise;

  const arr = monthlyRevenue * 12;

  // Get recent signups
  const { data: recentSignups } = await supabase
    .from("user_profiles")
    .select("id, email, subscription_tier, created_at")
    .order("created_at", { ascending: false })
    .limit(10);

  return {
    totalSignups: totalSignups || 0,
    activeMembers: activeMembers || 0,
    arr,
    monthlyRevenue,
    subscriptionBreakdown,
    recentSignups: recentSignups || [],
  };
}
