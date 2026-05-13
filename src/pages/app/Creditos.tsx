import { useEffect, useState } from "react";
import { useApp } from "@/store/app-store";
import { useShell } from "@/components/app/AppShell";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Sparkles, Wallet, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Pacote {
  id: string;
  name: string;
  description: string | null;
  credits: number;
  price_brl: number;
  checkout_url: string;
}

interface GatewayTransaction {
  id: string;
  amount: number;
  status: string;
  created_at: string;
  transaction_type: string;
  payer: {
    name: string;
  };
}

interface CreditTransaction {
  id: string;
  transactions: GatewayTransaction[];
}

export default function Creditos() {
  const { user } = useApp();
  const { saldo } = useShell();
  const [pacotes, setPacotes] = useState<Pacote[]>([]);
  const [transacoes, setTransacoes] = useState<GatewayTransaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    Promise.all([
      supabase
        .from("credit_packages")
        .select("*")
        .eq("is_active", true)
        .order("credits", { ascending: true }),
      supabase
        .from("credit_transactions")
        .select("id, transactions")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(5),
    ]).then(([pkgRes, txRes]) => {
      if (pkgRes.data) setPacotes(pkgRes.data as any);
      if (txRes.data) {
        const allTransactions = txRes.data
          .flatMap((tx: CreditTransaction) => tx.transactions)
          .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        setTransacoes(allTransactions);
      }
      setLoading(false);
    });
  }, [user]);

  const popularIdx = Math.min(1, pacotes.length - 1);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-12 animate-fade-in-up">
      <header className="text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-primary shadow-soft">
          <Wallet className="h-3.5 w-3.5" /> Seus créditos
        </span>
        <h1 className="mt-4 font-display text-3xl font-semibold tracking-tight sm:text-5xl">
          Saldo atual: <span className="text-primary">{saldo}</span>
        </h1>
        <p className="mt-3 text-muted-foreground">
          Cada consulta usa <strong>1 crédito</strong>. Escolha o pacote ideal para você.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {pacotes.map((p, i) => {
          const popular = i === popularIdx;
          const precoFmt = p.price_brl.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
          const unit = (p.price_brl / p.credits).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
          return (
            <Card
              key={p.id}
              className={cn(
                "relative flex flex-col overflow-hidden border-border/60 p-7 transition-smooth hover:-translate-y-1 hover:shadow-elegant",
                popular && "border-primary/40 shadow-elegant ring-1 ring-primary/20"
              )}
            >
              {popular && (
                <span className="absolute right-5 top-5 rounded-full bg-primary px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary-foreground">
                  Mais escolhido
                </span>
              )}
              <p className="text-sm uppercase tracking-wide text-muted-foreground">{p.name}</p>
              <p className="font-display text-4xl font-semibold">
                {p.credits} <span className="text-base font-normal text-muted-foreground">consultas</span>
              </p>
              <p className="mt-4 font-display text-3xl font-semibold text-primary">{precoFmt}</p>
              <p className="text-xs text-muted-foreground">{unit} por consulta</p>

              <ul className="mt-6 space-y-2 text-sm">
                {[p.description ?? "Relatórios completos", "Histórico salvo", "Sem prazo de validade"].map((b) => (
                  <li key={b} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-success" /> {b}
                  </li>
                ))}
              </ul>

              <Button
                asChild
                className={cn("mt-7 w-full rounded-full", popular && "shadow-elegant")}
                variant={popular ? "default" : "outline"}
                size="lg"
              >
                <a href={p.checkout_url} target="_blank" rel="noopener noreferrer">
                  <Sparkles className="mr-2 h-4 w-4" />
                  Comprar agora
                </a>
              </Button>
            </Card>
          );
        })}
      </div>

      {transacoes.length > 0 && (
        <Card className="border-border/60 p-6 sm:p-8">
          <h2 className="font-display text-xl font-semibold">Últimas transações</h2>
          <ul className="mt-4 divide-y divide-border/60">
            {transacoes.map((t) => (
              <li key={t.id} className="flex items-center justify-between gap-4 py-3 text-sm">
                <div className="min-w-0">
                  <p className="font-medium capitalize">{t.transaction_type} - {t.status}</p>
                  <p className="text-xs text-muted-foreground">{new Date(t.created_at).toLocaleString("pt-BR")}</p>
                </div>
                <span className="font-semibold text-success">
                  {(t.amount / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                </span>
              </li>
            ))}
          </ul>
        </Card>
      )}

      <p className="text-center text-xs text-muted-foreground">
        Pagamento processado com segurança pelo nosso parceiro de checkout.
        Os créditos são liberados automaticamente após a confirmação.
      </p>
    </div>
  );
}
