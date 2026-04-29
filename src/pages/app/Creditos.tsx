import { useApp } from "@/store/app-store";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Sparkles, Wallet } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const pacotes = [
  { id: "p5", consultas: 5, preco: "R$ 49", precoUnit: "R$ 9,80", popular: false },
  { id: "p10", consultas: 10, preco: "R$ 89", precoUnit: "R$ 8,90", popular: true },
  { id: "p20", consultas: 20, preco: "R$ 159", precoUnit: "R$ 7,95", popular: false },
];

const CHECKOUT_URL = "https://checkout.exemplo.com/amparo";

export default function Creditos() {
  const { creditos, addCreditos } = useApp();

  const comprar = (qtd: number) => {
    // Em produção: window.open(`${CHECKOUT_URL}?pkg=${qtd}`, "_blank");
    addCreditos(qtd);
    toast.success(`${qtd} créditos adicionados! (simulação)`);
  };

  return (
    <div className="mx-auto max-w-5xl space-y-10 animate-fade-in-up">
      <header className="text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-primary shadow-soft">
          <Wallet className="h-3.5 w-3.5" /> Seus créditos
        </span>
        <h1 className="mt-4 font-display text-3xl font-semibold tracking-tight sm:text-5xl">
          Saldo atual: <span className="text-primary">{creditos}</span>
        </h1>
        <p className="mt-3 text-muted-foreground">
          Cada consulta usa <strong>1 crédito</strong>. Escolha o pacote ideal para você.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {pacotes.map((p) => (
          <Card
            key={p.id}
            className={cn(
              "relative flex flex-col overflow-hidden border-border/60 p-7 transition-smooth hover:-translate-y-1 hover:shadow-elegant",
              p.popular && "border-primary/40 shadow-elegant ring-1 ring-primary/20"
            )}
          >
            {p.popular && (
              <span className="absolute right-5 top-5 rounded-full bg-primary px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary-foreground">
                Mais escolhido
              </span>
            )}
            <p className="text-sm uppercase tracking-wide text-muted-foreground">Pacote</p>
            <p className="font-display text-4xl font-semibold">{p.consultas} <span className="text-base font-normal text-muted-foreground">consultas</span></p>
            <p className="mt-4 font-display text-3xl font-semibold text-primary">{p.preco}</p>
            <p className="text-xs text-muted-foreground">{p.precoUnit} por consulta</p>

            <ul className="mt-6 space-y-2 text-sm">
              {[
                "Relatórios completos",
                "Histórico salvo",
                "Sem prazo de validade",
              ].map((b) => (
                <li key={b} className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-success" /> {b}
                </li>
              ))}
            </ul>

            <Button
              onClick={() => comprar(p.consultas)}
              className={cn(
                "mt-7 w-full rounded-full",
                p.popular ? "shadow-elegant" : ""
              )}
              variant={p.popular ? "default" : "outline"}
              size="lg"
              asChild={false}
            >
              <span className="flex items-center justify-center">
                <Sparkles className="mr-2 h-4 w-4" />
                Comprar agora
              </span>
            </Button>
          </Card>
        ))}
      </div>

      <p className="text-center text-xs text-muted-foreground">
        Pagamento processado com segurança pelo nosso parceiro de checkout.
        Os créditos são liberados automaticamente após a confirmação.
      </p>
    </div>
  );
}
