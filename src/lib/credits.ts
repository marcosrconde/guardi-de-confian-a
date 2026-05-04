import { supabase } from "@/integrations/supabase/client";

/**
 * Calcula o saldo de créditos da usuária a partir do banco.
 * saldo = soma das transações - número de consultas registradas
 *
 * Em produção, esse cálculo será exposto pelo n8n via endpoint próprio,
 * mas enquanto isso usamos o banco diretamente (apenas leitura, autorizada por RLS).
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
    console.error("Error fetching credit balance:", error);
    return 0;
  }

  return data?.balance ?? 0;
}
