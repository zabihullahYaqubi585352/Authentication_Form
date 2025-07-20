import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SAPUBASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SAPUBASE_ANON_KEY;

const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
export default supabaseClient;
