import { createClient, SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "../types/supabase";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables");
}

// Public client for reading presets
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Dev client for creating presets (bypasses RLS)
const adminClient: SupabaseClient<Database> | null =
  supabaseServiceRoleKey && import.meta.env.DEV
    ? createClient<Database>(supabaseUrl, supabaseServiceRoleKey)
    : null;

// Check if we're in dev mode with admin access
export const isDevMode = !!adminClient;

// Get admin client (throws if not available)
export function getSupabaseAdmin(): SupabaseClient<Database> {
  if (!adminClient) {
    throw new Error("Admin access not available");
  }
  return adminClient;
}
