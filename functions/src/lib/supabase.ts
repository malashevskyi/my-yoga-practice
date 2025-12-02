import { createClient } from "@supabase/supabase-js";
import { defineSecret } from "firebase-functions/params";

export const SUPABASE_URL = defineSecret("SUPABASE_URL");
export const SUPABASE_SERVICE_ROLE_KEY = defineSecret(
  "SUPABASE_SERVICE_ROLE_KEY",
);

export function getSupabaseClient() {
  return createClient(SUPABASE_URL.value(), SUPABASE_SERVICE_ROLE_KEY.value(), {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
