import { createClient, SupabaseClient } from "@supabase/supabase-js";

let _supabase: SupabaseClient | undefined;

export function getSupabase(): SupabaseClient {
  if (!_supabase) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://placeholder.supabase.co";
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "placeholder-key";
    _supabase = createClient(supabaseUrl, supabaseAnonKey);
  }
  return _supabase;
}

// Backwards-compatibility alias for API routes that use supabase.auth
export const supabase = {
  get auth() { return getSupabase().auth; },
};
