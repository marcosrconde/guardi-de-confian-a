import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/store/app-store";
import { gerarConsultaMock } from "@/lib/mock-consulta";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sparkles, Loader2, Wallet, ShieldCheck, AlertCircle } from "lucide-react";
import { toast } from "sonner";

export default function NovaConsulta() {
  const { user, creditos, consumirCredito, registrarConsulta } = useApp();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [cpf, setCpf] = useState("");
  const [form, setForm] = useState({ nome: "", nascimento: "", cidade: "", nomeMae: "" });

  const semCreditos = creditos <= 0;

  const submitCpf = async () => {
    if (!cpf.trim() || cpf.replace(/\D/g, "").length < 11) {
      toast.error("Informe um CPF válido (11 dígitos).");
      return;
    }
    await executar({ cpf });
  };

  const submitForm = async () => {
    if (!form.nome || !form.nascimento || !form.cidade || !form.nomeMae) {
      toast.error("Preencha todos os campos para a consulta.");
      return;
    }
    await executar(form);
  };

  const executar = async (input: Parameters<typeof gerarConsultaMock>[0]) => {
    if (semCreditos) {
      toast.error("Você não tem créditos suficientes.");
      navigate("/app/creditos");
      return;
    }
    setLoading(true);
    try {
      // Simulação do webhook n8n — substitua por fetch real depois.
      await new Promise((r) => setTimeout(r, 1600));
      if (!consumirCredito()) {
        toast.error("Sem créditos disponíveis.");
        return;
      }
      const result = gerarConsultaMock(input);
      registrarConsulta(result);
      toast.success("Relatório pronto.");
      navigate(`/app/consulta/${result.id}`);
    } catch (e) {
      toast.error("Não conseguimos completar a consulta. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-8 animate-fade-in-up">
      <header>
        <p className="text-sm text-muted-foreground">Olá, {user?.nome} 💗</p>
        <h1 className="mt-1 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          Vamos consultar com calma?
        </h1>
        <p className="mt-2 max-w-xl text-foreground/70">
          Escolha uma das opções abaixo. Em poucos segundos, você terá um relatório
          claro sobre o histórico judicial dessa pessoa.
        </p>
      </header>

      {semCreditos && (
        <Card className="flex flex-wrap items-center justify-between gap-4 border-warning/30 bg-warning/5 p-5">
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 h-5 w-5 text-warning" />
            <div>
              <p className="font-medium">Você está sem créditos no momento.</p>
              <p className="text-sm text-muted-foreground">
                Compre um pacote para continuar fazendo consultas.
              </p>
            </div>
          </div>
          <Button asChild className="rounded-full">
            <a href="/app/creditos"><Wallet className="mr-2 h-4 w-4" /> Comprar créditos</a>
          </Button>
        </Card>
      )}

      <Card className="overflow-hidden border-border/60 shadow-soft">
        <Tabs defaultValue="cpf" className="w-full">
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
                <Label htmlFor="cpf">CPF da pessoa</Label>
                <Input
                  id="cpf"
                  inputMode="numeric"
                  value={cpf}
                  onChange={(e) => setCpf(e.target.value)}
                  placeholder="000.000.000-00"
                  className="h-12 rounded-2xl text-base"
                />
                <p className="text-xs text-muted-foreground">
                  A consulta por CPF é mais rápida e precisa.
                </p>
              </div>
              <BtnConsultar onClick={submitCpf} loading={loading} disabled={semCreditos} />
            </div>
          </TabsContent>

          <TabsContent value="dados" className="p-6 sm:p-8">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FieldRow label="Nome completo" full>
                <Input
                  value={form.nome}
                  onChange={(e) => setForm({ ...form, nome: e.target.value })}
                  placeholder="Como está no documento"
                  className="h-12 rounded-2xl"
                />
              </FieldRow>
              <FieldRow label="Data de nascimento">
                <Input
                  type="date"
                  value={form.nascimento}
                  onChange={(e) => setForm({ ...form, nascimento: e.target.value })}
                  className="h-12 rounded-2xl"
                />
              </FieldRow>
              <FieldRow label="Cidade de nascimento">
                <Input
                  value={form.cidade}
                  onChange={(e) => setForm({ ...form, cidade: e.target.value })}
                  placeholder="Ex.: São Paulo / SP"
                  className="h-12 rounded-2xl"
                />
              </FieldRow>
              <FieldRow label="Nome da mãe" full>
                <Input
                  value={form.nomeMae}
                  onChange={(e) => setForm({ ...form, nomeMae: e.target.value })}
                  placeholder="Nome completo"
                  className="h-12 rounded-2xl"
                />
              </FieldRow>
            </div>
            <div className="mt-6">
              <BtnConsultar onClick={submitForm} loading={loading} disabled={semCreditos} />
            </div>
          </TabsContent>
        </Tabs>
      </Card>

      <Card className="flex items-start gap-4 border-border/60 bg-primary-soft/40 p-5">
        <ShieldCheck className="mt-0.5 h-5 w-5 text-primary" />
        <div className="text-sm text-foreground/80">
          <p className="font-medium text-foreground">Sua consulta é privada.</p>
          A pessoa pesquisada não é notificada. Nada do que você consulta é compartilhado.
        </div>
      </Card>
    </div>
  );
}

function FieldRow({
  label, children, full,
}: { label: string; children: React.ReactNode; full?: boolean }) {
  return (
    <div className={`space-y-1.5 ${full ? "sm:col-span-2" : ""}`}>
      <Label className="text-sm">{label}</Label>
      {children}
    </div>
  );
}

function BtnConsultar({
  onClick, loading, disabled,
}: { onClick: () => void; loading: boolean; disabled: boolean }) {
  return (
    <Button
      onClick={onClick}
      disabled={loading || disabled}
      size="lg"
      className="w-full rounded-full shadow-elegant sm:w-auto"
    >
      {loading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Consultando com cuidado...
        </>
      ) : (
        <>
          <Sparkles className="mr-2 h-4 w-4" /> Fazer consulta · 1 crédito
        </>
      )}
    </Button>
  );
}
