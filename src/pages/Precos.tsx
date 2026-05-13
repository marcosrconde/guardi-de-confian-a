import PacotesCreditos from "@/components/app/PacotesCreditos";
import PublicHeader from "@/components/app/PublicHeader";

export default function Precos() {
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
