import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Check, Loader2, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { useApp } from "@/store/app-store";
import { CheckoutButton } from "./CheckoutButton";

interface Pacote {
  id: string;
  name: string;
  description: string | null;
  credits: number;
  price_brl: number;
  checkout_url: string;
}

export default function PacotesCreditos() {
  const { user } = useApp();
  const [pacotes, setPacotes] = useState<Pacote[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("credit_packages")
      .select("*")
      .eq("is_active", true)
      .order("credits", { ascending: true })
      .then((res) => {
        if (res.data) setPacotes(res.data as any);
        setLoading(false);
      });
  }, []);

  const popularIdx = Math.min(1, pacotes.length - 1);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
      {pacotes.map((p, i) => {
        const popular = i === popularIdx;
        const precoFmt = p.price_brl.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
        const unit = (p.price_brl / p.credits).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
        return (
<div
            key={p.id}
              className={cn(
                "relative flex flex-col overflow-hidden border-border/60 p-7 transition-smooth hover:-translate-y-1 hover:shadow-elegant rounded-2xl",
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

              <CheckoutButton pacote={p} popular={popular} />
            </div>
        );
      })}
    </div>
  );
}
