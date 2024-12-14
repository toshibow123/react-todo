import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://hxjoyhoajoxjzbajbtcb.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh4am95aG9ham94anpiYWpidGNiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM4MjkzODcsImV4cCI6MjA0OTQwNTM4N30.j702aH9WoEZLNTXzCkmNIC6EuyrrvU8Ucs3ydx6b5yY"

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);