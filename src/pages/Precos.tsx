import PacotesCreditos from "@/components/app/PacotesCreditos";
import PublicHeader from "@/components/app/PublicHeader";
import { usePromo } from "@/hooks/use-promo";

export default function Precos() {
  const { isActive, endLabel, name } = usePromo();
  return (
    <div className="min-h-screen bg-warm">
      <PublicHeader />

      <section className="container py-12 md:py-20">
        <header className="text-center">
            <h1 className="mt-4 font-display text-3xl font-semibold tracking-tight sm:text-5xl">
            Nossos Preços
            </h1>
            <p className="mt-3 text-muted-foreground">
            Cada consulta usa <strong>1 crédito</strong>. Escolha o pacote ideal para você.
            </p>
            {isActive && (
              <div className="mt-4 flex items-center justify-center gap-2 text-sm">
                <span className="rounded-full bg-primary px-3 py-1 font-semibold text-primary-foreground">Preço promocional</span>
                <span className="text-foreground/80">
                  {name}
                  {endLabel ? ` · válido até ${endLabel}` : null}
                </span>
              </div>
            )}
        </header>
        <div className="mx-auto max-w-5xl space-y-12 animate-fade-in-up mt-8">
            <PacotesCreditos />
        </div>
        <p className="text-center text-xs text-muted-foreground mt-12">
            Pagamento processado com segurança pelo nosso parceiro de checkout.
        </p>
      </section>
    </div>
  );
}
