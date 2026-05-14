import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

const { SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY } = process.env;
const supabaseKey = SUPABASE_SERVICE_ROLE_KEY || SUPABASE_ANON_KEY;
export const hasServiceRoleKey = Boolean(SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY && /^https?:\/\//.test(SUPABASE_URL));

const hasValues = Boolean(SUPABASE_URL && supabaseKey);
const hasPlaceholders = SUPABASE_URL === "your_url_here" || supabaseKey === "your_key_here";
const hasValidUrl = hasValues && /^https?:\/\//.test(SUPABASE_URL);

export const isSupabaseConfigured = hasValues && !hasPlaceholders && hasValidUrl;

if (!isSupabaseConfigured) {
  console.warn("Supabase credentials are placeholders. Add real keys in backend/.env before running the pipeline.");
}

export const supabase = isSupabaseConfigured
  ? createClient(SUPABASE_URL, supabaseKey)
  : null;

export const supabaseAdmin = hasServiceRoleKey
  ? createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
  : null;
