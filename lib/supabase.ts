import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const key = process.env.SUPABASE_ANON_KEY!;

// Server-side client (used only in API routes - key never sent to browser)
export const supabase = createClient(url, key);
