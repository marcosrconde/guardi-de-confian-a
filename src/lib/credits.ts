import { supabase } from "@/integrations/supabase/client";

/**
 * Calcula o saldo de créditos da usuária a partir do banco.
 * saldo = soma das transações - número de consultas registradas
 *
 * Em produção, esse cálculo será exposto pelo n8n via endpoint próprio,
 * mas enquanto isso usamos o banco diretamente (apenas leitura, autorizada por RLS).
 */
export async function getSaldoCreditos(userId: string): Promise<number> {
  const [{ data: tx }, { count: usedCount }] = await Promise.all([
    supabase
      .from("credit_transactions")
      .select("amount")
      .eq("user_id", userId),
    supabase
      .from("queries")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId),
  ]);

  const credited = (tx ?? []).reduce((acc, r: any) => acc + (r.amount ?? 0), 0);
  const used = usedCount ?? 0;
  return Math.max(0, credited - used);
}
