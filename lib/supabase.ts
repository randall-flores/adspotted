import { createClient } from "@supabase/supabase-js";

export type Ad = {
  id: string;
  brand_name: string;
  product_name: string;
  category: string;
  image_url: string;
  brand_url: string;
  date_spotted: string;
  created_at: string;
};

export const CATEGORIES = [
  "Fashion",
  "Beauty",
  "Fitness",
  "Home",
  "Food & Drink",
  "Tech",
  "Wellness",
] as const;

// The URL and anon key are public by design (the anon key ships to every
// browser and is limited by row level security). Secrets never go here.
export const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ??
  "https://acfrkjuvtcnoybppjumd.supabase.co";

export const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  "sb_publishable_w-awi1SwHF7mdSPhshnRsw_qGysnCu8";

// One client per browser tab so the auth session persists across pages.
// On the server each call gets a fresh client (no session needed there).
let browserClient: ReturnType<typeof createClient> | null = null;

export function supabaseBrowser() {
  if (typeof window === "undefined") {
    return createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }
  if (!browserClient) {
    browserClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }
  return browserClient;
}
