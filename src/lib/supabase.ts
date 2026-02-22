import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Using `any` here because the Database generic type causes inference issues
// with @supabase/supabase-js v2 when types are hand-written (not CLI-generated).
// All service functions use explicit type casts for safety.
// To generate proper types: npx supabase gen types typescript --project-id YOUR_PROJECT_ID
// biome-ignore lint: intentional any
export const supabase = createClient<any>(supabaseUrl, supabaseAnonKey);
