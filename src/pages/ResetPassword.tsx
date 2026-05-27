import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Lock, ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { LogoLockup } from "@/components/app/Logo";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [senha, setSenha] = useState("");
  const [confirma, setConfirma] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [hasSession, setHasSession] = useState(false);

  useEffect(() => {
    // Recovery link sets a session via the auth listener
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY" || session) {
        setHasSession(true);
      }
    });
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setHasSession(true);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (senha.length < 8) {
toast.error("A senha precisa ter pelo menos 8 caracteres.", { duration: 60000 });
      return;
    }
    if (senha !== confirma) {
toast.error("As senhas não coincidem.", { duration: 60000 });
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.auth.updateUser({ password: senha });
    setSubmitting(false);
    if (error) {
toast.error(error.message, { duration: 60000 });
      return;
    }
    toast.success("Senha atualizada. Você já está conectada.");
    navigate("/app");
  };

  return (
    <div className="min-h-screen bg-warm">
      <div className="container py-6">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/auth"><ArrowLeft className="mr-2 h-4 w-4" /> Voltar para o login</Link>
        </Button>
      </div>

      <div className="container flex flex-col items-center justify-center pb-12">
        <Link to="/" className="mb-6">
          <LogoLockup size="md" />
        </Link>

        <Card className="w-full max-w-md border-border/60 p-8 shadow-elegant animate-fade-in-up">
          <h1 className="font-display text-2xl font-semibold">Definir nova senha</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {hasSession
              ? "Escolha uma senha forte para proteger sua conta."
              : "Aguardando validação do link de recuperação..."}
          </p>

          <form onSubmit={submit} className="mt-6 space-y-4">
            <Field id="senha" label="Nova senha" value={senha} onChange={setSenha} />
            <Field id="confirma" label="Confirmar nova senha" value={confirma} onChange={setConfirma} />

            <Button
              type="submit"
              disabled={submitting || !hasSession}
              className="mt-2 w-full rounded-full shadow-soft"
              size="lg"
            >
              {submitting ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Atualizando...</>
              ) : (
                "Salvar nova senha"
              )}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}

function Field({ id, label, value, onChange }: { id: string; label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-sm">{label}</Label>
      <div className="relative">
        <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          id={id}
          type="password"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="••••••••"
          className="h-12 rounded-2xl border-border/70 bg-background pl-10"
        />
      </div>
    </div>
  );
}
