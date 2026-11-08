
import { createClient } from "@supabase/supabase-js";

// Read our Supabase configuration from Vite
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check that our environment variables exist
if (!supabaseUrl || !supabaseKey) {
  throw new Error("Missing Supabase configuration.");
}

// Create a reusable Supabase client
export const supabase = createClient(
  supabaseUrl,
  supabaseKey
);
