import { supabase } from "@/integrations/supabase/client";

/**
 * Busca o saldo de créditos da usuária a partir da última transação.
 */
export async function getSaldoCreditos(userId: string): Promise<number> {
  const { data, error } = await supabase
    .from("credit_transactions")
    .select("balance")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (error) {
    // No rows found is a valid case (new user), not a critical error
    if (error.code === "PGRST116") return 0;
    console.error("Error fetching credit balance:", error);
    return 0;
  }

  return data?.balance ?? 0;
}
