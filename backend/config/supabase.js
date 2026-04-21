import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

const { SUPABASE_URL, SUPABASE_ANON_KEY } = process.env;

const hasValues = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
const hasPlaceholders = SUPABASE_URL === "your_url_here" || SUPABASE_ANON_KEY === "your_key_here";
const hasValidUrl = hasValues && /^https?:\/\//.test(SUPABASE_URL);

export const isSupabaseConfigured = hasValues && !hasPlaceholders && hasValidUrl;

if (!isSupabaseConfigured) {
  console.warn("Supabase credentials are placeholders. Add real keys in backend/.env before running the pipeline.");
}

export const supabase = isSupabaseConfigured
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;
