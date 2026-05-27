import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp, Candidate } from "@/store/app-store";
import { supabase } from "@/integrations/supabase/client";
import { useShell } from "@/components/app/AppShell";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sparkles, Loader2, Wallet, ShieldCheck, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { ListaCandidatos } from "@/components/app/ListaCandidatos";

type Input =
  | { kind: "cpf"; cpf: string }
  | { kind: "form"; nome: string; nascimento: string; cidade: string; nomeMae: string };

export default function NovaConsulta() {
  const { user } = useApp();
  const { saldo, refreshSaldo } = useShell();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [cpf, setCpf] = useState("");
  const [form, setForm] = useState({ nome: "", nascimento: "", cidade: "", nomeMae: "" });
  const [candidates, setCandidates] = useState<Candidate[] | null>(null);
  const [inputData, setInputData] = useState<any | null>(null);

  // Redirect to histórico if user already has consultas (per spec)
  useEffect(() => {
    let cancelled = false;
    if (!user) return;
    const params = new URLSearchParams(window.location.search);
    if (params.get("redirected") === "1") return;
    supabase
      .from("queries")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .then(({ count }) => {
        if (cancelled) return;
        if ((count ?? 0) > 0 && window.history.length <= 2) {
          navigate("/app/historico", { replace: true });
        }
      });
    return () => {
      cancelled = true;
    };
  }, [user, navigate]);

  const semCreditos = saldo <= 0;

  const submitCpf = async () => {
    if (!cpf.trim() || cpf.replace(/\D/g, "").length < 11) {
toast.error("Informe um CPF válido (11 dígitos).", { duration: 60000 });
      return;
    }
    await executar({ kind: "cpf", cpf });
  };

  const submitForm = async () => {
    if (!form.nome || !form.nascimento || !form.cidade || !form.nomeMae) {
toast.error("Preencha todos os campos para a consulta.", { duration: 60000 });
      return;
    }
    await executar({ kind: "form", ...form });
  };

  const executar = async (input: Input) => {
    if (!user) return;
    if (semCreditos) {
toast.error("Você não tem créditos suficientes.", { duration: 60000 });
      navigate("/app/creditos");
      return;
    }
    setLoading(true);
    try {
      let webhookUrl = "";
      let body: Record<string, unknown> = {};

      if (input.kind === "cpf") {
        webhookUrl = "https://n8n-n8n.apuc7z.easypanel.host/webhook/38268654-af8f-4f43-ab66-3f9f4f445516";
        body = {
          user_id: user.id,
          user_email: user.email,
          cpf: input.cpf,
          data_consulta: new Date().toISOString(),
        };
      } else {
        webhookUrl = "https://n8n-n8n.apuc7z.easypanel.host/webhook/e07a6089-16c0-4068-a65f-dceecb5bc371";
        body = {
          user_id: user.id,
          user_email: user.email,
          nome: input.nome,
          nascimento: input.nascimento,
          cidade: input.cidade,
          nomeMae: input.nomeMae,
        };
      }

      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData?.error || "Erro ao processar a consulta.");
      }

      const responseData = await response.json();
      console.log("responseData", responseData);

      if (responseData?.candidates) {
        console.log("candidates found");
        setCandidates(responseData.candidates);
        setInputData(responseData.input_data);
        return;
      }

      await refreshSaldo();
      toast.success("Consulta enviada. Em instantes seu relatório estará pronto.");

      const { data, error } = await supabase
        .from("queries")
        .select("id")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (error || !data) {
        navigate("/app/historico");
      } else {
        navigate(`/app/consulta/${data.id}`);
      }
    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
toast.error(error.message, { duration: 60000 });
      } else {
toast.error("Não conseguimos registrar a consulta. Tente novamente.", { duration: 60000 });
      }
    } finally {
      setLoading(false);
    }
  };

  console.log("candidates state", candidates);
  const handleSelectCandidate = async (candidate: Candidate) => {
    if (!user) return;
    setLoading(true);
    try {
      const webhookUrl = "https://n8n-n8n.apuc7z.easypanel.host/webhook/bdb72ad8-80bf-4a50-85f4-7e63d49aa057";
      const body = {
        input_data: inputData,
        selected_candidate: candidate,
      };

      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData?.error || "Erro ao processar a consulta.");
      }

      await refreshSaldo();
      toast.success("Consulta enviada. Em instantes seu relatório estará pronto.");

      const { data, error } = await supabase
        .from("queries")
        .select("id")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (error || !data) {
        navigate("/app/historico");
      } else {
        navigate(`/app/consulta/${data.id}`);
      }
    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
toast.error(error.message, { duration: 60000 });
      } else {
toast.error("Não conseguimos registrar a consulta. Tente novamente.", { duration: 60000 });
      }
    } finally {
      setLoading(false);
    }
  };

  if (candidates) {
    return <ListaCandidatos candidates={candidates} onSelect={handleSelectCandidate} />;
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8 animate-fade-in-up">
      <header>
        <p className="text-sm text-muted-foreground">Olá, {user?.nome} 💗</p>
        <h1 className="mt-1 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          Vamos consultar tudo no detalhe?
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
              {loading && (
                <p className="pt-4 text-center text-sm text-muted-foreground">
                  Por favor, não feche esta janela. A consulta demora em média de 1 a 2 minutos.
                  <br />
                  Após a conclusão, todas as consultas ficam disponíveis na área de Histórico.
                  <br />
                  Fique tranquila, o crédito só é consumido em caso de sucesso na consulta.
                </p>
              )}
            </div>
          </TabsContent>

          <TabsContent value="dados" className="p-6 sm:p-8">
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FieldRow label="Nome completo" full>
                  <Input
                    value={form.nome}
                    onChange={(e) => setForm({ ...form, nome: e.target.value })}
                    placeholder="Nome completo da pessoa"
                    className="h-12 rounded-2xl text-base"
                  />
                </FieldRow>
                <FieldRow label="Data de nascimento">
                  <Input
                    value={form.nascimento}
                    onChange={(e) => setForm({ ...form, nascimento: e.target.value })}
                    placeholder="00/00/0000"
                    className="h-12 rounded-2xl text-base"
                  />
                </FieldRow>
                <FieldRow label="Cidade">
                  <Input
                    value={form.cidade}
                    onChange={(e) => setForm({ ...form, cidade: e.target.value })}
                    placeholder="Cidade de nascimento"
                    className="h-12 rounded-2xl text-base"
                  />
                </FieldRow>
                <FieldRow label="Nome da mãe" full>
                  <Input
                    value={form.nomeMae}
                    onChange={(e) => setForm({ ...form, nomeMae: e.target.value })}
                    placeholder="Nome completo da mãe"
                    className="h-12 rounded-2xl text-base"
                  />
                </FieldRow>
              </div>
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
}: { label: string; children: import("react").ReactNode; full?: boolean }) {
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
          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Enviando consulta...
        </>
      ) : (
        <>
          <Sparkles className="mr-2 h-4 w-4" /> Fazer consulta · 1 crédito
        </>
      )}
    </Button>
  );
}
