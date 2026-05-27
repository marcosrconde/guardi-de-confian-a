import { createClient } from "@supabase/supabase-js";
import { toast } from "sonner";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

let lastRequestTime = 0;
const requestCooldown = 1000; // 1 second

const withErrorHandling = (fn) => async (...args) => {
  const now = Date.now();
  if (now - lastRequestTime < requestCooldown) {
    await new Promise(resolve => setTimeout(resolve, requestCooldown - (now - lastRequestTime)));
  }
  lastRequestTime = now;

  const { error, ...result } = await fn(...args);

  if (error) {
    console.error("Supabase error:", error);
toast.error(error.message, { duration: 60000 });
    return { error, ...result };
  }

  return { error, ...result };
};

export const auth = {
  signUp: withErrorHandling(supabase.auth.signUp),
  signInWithPassword: withErrorHandling(supabase.auth.signInWithPassword),
  resetPasswordForEmail: withErrorHandling(supabase.auth.resetPasswordForEmail),
  // Add other auth methods you use here
};
