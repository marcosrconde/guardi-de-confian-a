import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sparkles, Fingerprint, Zap, BadgeCheck, HandCoins, ShieldCheck } from "lucide-react";
import heroImg from "@/assets/hero.png";
import { useApp } from "@/store/app-store";
import { LogoInline } from "@/components/app/Logo";

const Index = () => {
  const { user } = useApp();

  return (
    <div className="min-h-screen bg-warm">
      <header className="container flex items-center justify-between py-6">
        <Link to="/" aria-label="JusMulher">
          <LogoInline />
        </Link>
        <div className="flex items-center gap-2">
          <Button asChild variant="ghost">
            <Link to="/auth">Entrar</Link>
          </Button>
          <Button asChild className="rounded-full">
            <Link to={user ? "/app" : "/auth?mode=signup"}>Começar agora</Link>
          </Button>
        </div>
      </header>

      <section className="container grid gap-12 py-12 md:grid-cols-2 md:items-center md:py-20">
        <div className="animate-fade-in-up">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-primary shadow-soft">
            <Sparkles className="h-3.5 w-3.5" /> Para sua tranquilidade
          </span>
          <h1 className="mt-5 font-display text-4xl font-semibold leading-[1.05] tracking-tight text-balance sm:text-5xl md:text-6xl">
            Desvende a vida
            <br />
            <span className="italic"><span className="text-primary">pregressa</span> <span className="text-rose">das pessoas com quem você se relaciona</span></span>
          </h1>
          <p className="mt-6 max-w-lg text-lg text-foreground/70 text-balance">
            Consulte o histórico judicial das pessoas que entram  na sua vida (ou que já fazem parte dela...)
          </p>
          <p className="mt-6 max-w-lg text-lg text-foreground/70 text-balance">
            Informação essencial para sua segurança de forma <strong>rápida</strong> e <strong>confiável</strong>. <br /> <span className="font-semibold text-foreground/90">Porque cuidar de você é o que mais importa.</span>
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg" className="rounded-full px-7 shadow-elegant">
              <Link to={user ? "/app" : "/auth?mode=signup"}>
                Fazer minha primeira consulta
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-full px-7">
              <Link to="/auth">Já tenho conta</Link>
            </Button>
          </div>
          <div className="mt-10 grid grid-cols-4 gap-4 max-w-md">
            <Feature icon={Fingerprint} title="Sigiloso" />
            <Feature icon={Zap} title="Prático" />
            <Feature icon={BadgeCheck} title="Seguro" />
            <Feature icon={HandCoins} title="Acessível" />
          </div>
        </div>

        <div className="relative">
          <div className="absolute -inset-6 rounded-[3rem] bg-primary-soft/40 blur-2xl" />
          <div className="relative overflow-hidden rounded-[2.5rem] shadow-elegant">
            <img
              src={heroImg}
              alt="Ilustração suave em tons rosé"
              width={1536}
              height={1152}
              className="h-full w-full object-cover"
            />
            <div className="absolute bottom-6 left-6 right-6 rounded-2xl bg-background/90 p-5 backdrop-blur shadow-soft">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-success/15 text-success">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">
                    Risco baixo
                  </p>
                  <p className="text-sm font-medium">Nada preocupante encontrado.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

function Feature({ icon: Icon, title }: { icon: typeof Fingerprint; title: string }) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-2xl border border-border/60 bg-card/60 p-3 text-center backdrop-blur">
      <Icon className="h-4 w-4 text-primary" />
      <span className="text-xs font-medium">{title}</span>
    </div>
  );
}

export default Index;
