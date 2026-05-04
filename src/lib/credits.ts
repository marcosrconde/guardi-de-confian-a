import { supabase } from "@/integrations/supabase/client";

/**
 * Calcula o saldo de créditos da usuária a partir do banco.
 * saldo = soma das transações - número de consultas registradas
 *
 * Em produção, esse cálculo será exposto pelo n8n via endpoint próprio,
 * mas enquanto isso usamos o banco diretamente (apenas leitura, autorizada por RLS).
 */
export async function getSaldoCreditos(userId: string): Promise<number> {
  const [txRes, qRes] = await Promise.all([
    supabase.from("credit_transactions").select("amount").eq("user_id", userId),
    supabase.from("queries").select("id", { count: "exact", head: true }).eq("user_id", userId),
  ]);

  if (txRes.error) {
    console.error("Error fetching credit transactions:", txRes.error);
    return 0;
  }

  const total = (txRes.data ?? []).reduce((acc, t) => acc + (t.amount ?? 0), 0);
  const used = qRes.count ?? 0;
  return total - used;
}
