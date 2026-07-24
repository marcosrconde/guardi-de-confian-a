import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sparkles, Fingerprint, Zap, BadgeCheck, HandCoins, ShieldCheck, Users, AlertTriangle, HeartHandshake, Search, FileText, Shield } from "lucide-react";
import heroImg from "@/assets/hero.png";
import { useApp } from "@/store/app-store";
import LatestPosts from "@/components/app/LatestPosts";
import PublicHeader from "@/components/app/PublicHeader";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const Index = () => {
  const { user } = useApp();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [tab, setTab] = useState<"cpf" | "dados">("cpf");
  const [cpf, setCpf] = useState("");
  const [form, setForm] = useState({ nome: "", nascimento: "", cidade: "", nomeMae: "" });

  useEffect(() => {
    const ref = searchParams.get("ref");
    if (ref) {
      localStorage.setItem("affiliate_code", ref);
    }
  }, [searchParams]);

  const affiliateCode = localStorage.getItem("affiliate_code");
  const authLink = affiliateCode ? `/auth?ref=${affiliateCode}` : "/auth";
  const signupLink = affiliateCode
    ? `/auth?mode=signup&ref=${affiliateCode}`
    : "/auth?mode=signup";

  const handleSubmitCpf = () => {
    const digits = cpf.replace(/\D/g, "");
    if (!digits || digits.length !== 11) {
      toast.error("Informe um CPF válido (11 dígitos).", { duration: 60000 });
      return;
    }
    const payload = { kind: "cpf" as const, cpf };
    localStorage.setItem("prefill_consulta", JSON.stringify(payload));
    if (!user) {
      toast("Para prosseguir, faça login ou crie sua conta.");
      navigate(authLink);
      return;
    }
    navigate("/app");
  };

  const handleSubmitDados = () => {
    if (!form.nome.trim()) {
      toast.error("O campo 'Nome completo' é obrigatório.", { duration: 60000 });
      return;
    }
    if (!form.nascimento.trim() && !form.nomeMae.trim()) {
      toast.error(
        "Para realizar a pesquisa, informe ao menos 2 dados: nome completo e nome da mãe, ou nome completo e data de nascimento.",
        { duration: 60000 }
      );
      return;
    }
    const payload = { kind: "form" as const, ...form };
    localStorage.setItem("prefill_consulta", JSON.stringify(payload));
    if (!user) {
      toast("Para prosseguir, faça login ou crie sua conta.");
      navigate(authLink);
      return;
    }
    navigate("/app");
  };

  return (
    <div className="min-h-screen bg-warm">
      <PublicHeader />

      <section className="container grid gap-12 py-12 md:grid-cols-2 md:items-center md:py-20">
        <div className="animate-fade-in-up">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-primary shadow-soft">
            <Sparkles className="h-3.5 w-3.5" /> Relacionamentos seguros começam com informação
          </span>
          <h1 className="mt-5 font-display text-4xl font-semibold leading-[1.05] tracking-tight text-balance sm:text-5xl md:text-6xl">
            <span className="text-foreground/60 text-2xl sm:text-3xl font-normal block mb-2">
              Previna-se da violência contra a mulher.
            </span>
            <span className="text-primary font-bold">Antecipe-se.</span>{" "}
            <span className="text-rose-700 font-semibold">Pesquise a ficha criminal de qualquer pessoa em segundos.</span>
          </h1>
          <p className="mt-6 max-w-lg text-lg text-foreground/70 text-balance">
            Nossa IA analisa informações de processos judiciais e criminais para que você possa tomar decisões mais seguras em seus relacionamentos.
          </p>
          <p className="mt-6 max-w-lg text-lg text-foreground/70 text-balance">
            <strong>A informação é a sua maior aliada.</strong>
            <p><span className="font-semibold text-foreground/90">Não deixe para depois algo que pode te custar a vida.</span></p>
          </p>

          {/* Formulário rápido de consulta */}
          <Card className="mt-8 max-w-xl border-border/60 shadow-soft">
            <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)} className="w-full">
              <div className="border-b border-border/60 bg-secondary/40 p-2">
                <TabsList className="grid w-full grid-cols-2 bg-transparent">
                  <TabsTrigger value="cpf" className="rounded-full data-[state=active]:bg-card data-[state=active]:shadow-soft">
                    Por CPF
                  </TabsTrigger>
                  <TabsTrigger value="dados" className="rounded-full data-[state=active]:bg-card data-[state=active]:shadow-soft">
                    Por dados pessoais
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="cpf" className="p-6 sm:p-8">
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="cpf_lp">CPF da pessoa</Label>
                    <Input
                      id="cpf_lp"
                      inputMode="numeric"
                      value={cpf}
                      onChange={(e) => setCpf(e.target.value)}
                      placeholder="000.000.000-00"
                      className="h-12 rounded-2xl text-base"
                    />
                    <p className="text-xs text-muted-foreground">A consulta por CPF é mais rápida e precisa.</p>
                  </div>
                  <Button onClick={handleSubmitCpf} size="lg" className="w-full rounded-full shadow-elegant sm:w-auto">
                    <Sparkles className="mr-2 h-4 w-4" /> Iniciar consulta
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="dados" className="p-6 sm:p-8">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5 sm:col-span-2">
                      <Label>Nome completo</Label>
                      <Input
                        value={form.nome}
                        onChange={(e) => setForm({ ...form, nome: e.target.value })}
                        placeholder="Nome completo da pessoa"
                        className="h-12 rounded-2xl text-base"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Data de nascimento</Label>
                      <Input
                        value={form.nascimento}
                        onChange={(e) => {
                          const { value } = e.target;
                          let formattedValue = value.replace(/\D/g, "");
                          if (formattedValue.length > 2) {
                            formattedValue = `${formattedValue.slice(0, 2)}/${formattedValue.slice(2)}`;
                          }
                          if (formattedValue.length > 5) {
                            formattedValue = `${formattedValue.slice(0, 5)}/${formattedValue.slice(5, 9)}`;
                          }
                          setForm({ ...form, nascimento: formattedValue });
                        }}
                        placeholder="00/00/0000"
                        className="h-12 rounded-2xl text-base"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Cidade</Label>
                      <Input
                        value={form.cidade}
                        onChange={(e) => setForm({ ...form, cidade: e.target.value })}
                        placeholder="Cidade de nascimento"
                        className="h-12 rounded-2xl text-base"
                      />
                    </div>
                    <div className="space-y-1.5 sm:col-span-2">
                      <Label>Nome da mãe</Label>
                      <Input
                        value={form.nomeMae}
                        onChange={(e) => setForm({ ...form, nomeMae: e.target.value })}
                        placeholder="Nome completo da mãe"
                        className="h-12 rounded-2xl text-base"
                      />
                    </div>
                  </div>
                  <Button onClick={handleSubmitDados} size="lg" className="w-full rounded-full shadow-elegant sm:w-auto">
                    <Sparkles className="mr-2 h-4 w-4" /> Iniciar consulta
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </Card>

          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild size="lg" className="rounded-full px-7 shadow-elegant">
              <Link to={user ? "/app" : signupLink}>
                Começar consulta
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-full px-7">
              <Link to={authLink}>Já tenho conta</Link>
            </Button>
          </div>
          <p className="mt-3 text-xs text-foreground/50">
            🔒 Consulta 100% anônima e sigilosa. A pessoa consultada nunca saberá.
          </p>
          <div className="mt-10 grid grid-cols-4 gap-4 max-w-md">
            <Feature icon={Fingerprint} title="100% Anônimo" />
            <Feature icon={Zap} title="Instantâneo" />
            <Feature icon={BadgeCheck} title="Dados Oficiais" />
            <Feature icon={HandCoins} title="Grátis p/ iniciar" />
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

      <section className="bg-white py-12 md:py-20">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center mb-10">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-primary shadow-soft">
              <Sparkles className="h-3.5 w-3.5" /> Conheça a JusMulher
            </span>
            <h2 className="mt-5 font-display text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
              Assista ao vídeo e veja como funciona
            </h2>
            <p className="mt-4 text-lg text-foreground/70 text-balance">
              Entenda como a JusMulher ajuda a proteger você e quem você ama.
            </p>
          </div>
          
          <div className="aspect-video w-full max-w-3xl mx-auto rounded-3xl overflow-hidden shadow-elegant border border-border/40">
            <iframe
              className="w-full h-full"
              src="https://www.youtube.com/embed/No_n5L1KgBg?si=rm-zPdPSaB4b7TsO"
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </section>

      <section className="container py-12 md:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-primary shadow-soft">
            <Sparkles className="h-3.5 w-3.5" /> Ferramentas de Segurança Gratuitas
          </span>
          <h2 className="mt-5 font-display text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            Comece a se proteger agora com nossas ferramentas gratuitas
          </h2>
          <p className="mt-4 text-lg text-foreground/70 text-balance">
            Crie sua conta e tenha acesso imediato a recursos essenciais para sua segurança.
          </p>
        </div>

        <div className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-3xl border border-border/60 bg-card/60 p-8 shadow-soft backdrop-blur-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-soft text-primary">
              <Users className="h-6 w-6" />
            </div>
            <h3 className="mt-5 text-xl font-semibold">Rede de Confiança</h3>
            <p className="mt-2 text-foreground/70">
              Cadastre pessoas de sua confiança para serem acionadas em caso de emergência.
            </p>
          </div>
          <div className="rounded-3xl border border-border/60 bg-card/60 p-8 shadow-soft backdrop-blur-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-soft text-primary">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <h3 className="mt-5 text-xl font-semibold">Botão de Pânico</h3>
            <p className="mt-2 text-foreground/70">
              A um clique de distância, acione sua rede de confiança e compartilhe sua localização em tempo real.
            </p>
          </div>
          <div className="rounded-3xl border border-border/60 bg-card/60 p-8 shadow-soft backdrop-blur-sm md:col-span-2 lg:col-span-1">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-soft text-primary">
              <HeartHandshake className="h-6 w-6" />
            </div>
            <h3 className="mt-5 text-xl font-semibold">Apoio e Acolhimento</h3>
            <p className="mt-2 text-foreground/70">
              Oferecemos um ombro amigo e apoio para todas as mulheres em situação de vulnerabilidade.
            </p>
          </div>
        </div>
        <div className="mt-10 text-center">
          <Button asChild size="lg" className="rounded-full px-7 shadow-elegant">
            <Link to={user ? "/app" : signupLink}>
              Criar minha conta gratuita
            </Link>
          </Button>
        </div>
      </section>

      <section className="bg-white py-12 md:py-20">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-primary shadow-soft">
              <Sparkles className="h-3.5 w-3.5" /> Como Funciona
            </span>
            <h2 className="mt-5 font-display text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
              Informação e segurança em 3 passos simples
            </h2>
            <p className="mt-4 text-lg text-foreground/70 text-balance">
              Nosso processo é rápido, sigiloso e foi pensado para sua tranquilidade.
            </p>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary-soft text-primary">
                <Search className="h-8 w-8" />
              </div>
              <h3 className="mt-5 text-xl font-semibold">1. Dados Básicos</h3>
              <p className="mt-2 text-foreground/70">
                Digite o nome ou CPF de forma segura, privada e 100% confidencial.
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary-soft text-primary">
                <FileText className="h-8 w-8" />
              </div>
              <h3 className="mt-5 text-xl font-semibold">2. Varredura com IA</h3>
              <p className="mt-2 text-foreground/70">
                Nossa inteligência artificial faz uma busca minuciosa em registros públicos judiciais e criminais.
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary-soft text-primary">
                <Shield className="h-8 w-8" />
              </div>
              <h3 className="mt-5 text-xl font-semibold">3. Decisão Segura</h3>
              <p className="mt-2 text-foreground/70">
                Receba um dossiê simples e direto para tomar a melhor decisão para sua vida.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="container py-12 md:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-primary shadow-soft">
            <Sparkles className="h-3.5 w-3.5" /> Depoimentos
          </span>
          <h2 className="mt-5 font-display text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            O que nossas usuárias dizem
          </h2>
          <p className="mt-4 text-lg text-foreground/70 text-balance">
            Histórias de quem usou a JusMulher para tomar decisões mais seguras.
          </p>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-3xl border border-border/60 bg-card/60 p-8 shadow-soft backdrop-blur-sm">
            <p className="text-foreground/80">
              “Eu estava insegura sobre um novo relacionamento e a JusMulher me deu a clareza que eu precisava. Me sinto muito mais segura agora.”
            </p>
            <div className="mt-5 flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary-soft" />
              <div>
                <p className="font-semibold">Juliana M.</p>
                <p className="text-sm text-foreground/70">Usuária</p>
              </div>
            </div>
          </div>
          <div className="rounded-3xl border border-border/60 bg-card/60 p-8 shadow-soft backdrop-blur-sm">
            <p className="text-foreground/80">
              “Fácil de usar e o relatório veio super rápido. Me ajudou a evitar uma situação potencialmente perigosa. Recomendo a todas as mulheres.”
            </p>
            <div className="mt-5 flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary-soft" />
              <div>
                <p className="font-semibold">Carla S.</p>
                <p className="text-sm text-foreground/70">Usuária</p>
              </div>
            </div>
          </div>
          <div className="rounded-3xl border border-border/60 bg-card/60 p-8 shadow-soft backdrop-blur-sm md:col-span-2 lg:col-span-1">
            <p className="text-foreground/80">
              “Achei incrível ter as ferramentas de segurança gratuitas. O botão de pânico é algo que toda mulher deveria ter a disposição.”
            </p>
            <div className="mt-5 flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary-soft" />
              <div>
                <p className="font-semibold">Maria Eduarda</p>
                <p className="text-sm text-foreground/70">Usuária</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <LatestPosts />
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
