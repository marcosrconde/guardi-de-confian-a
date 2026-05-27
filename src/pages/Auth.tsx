import { useState, useEffect } from "react";
import { Link, Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { useApp } from "@/store/app-store";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Mail, Lock, User2, ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { LogoLockup } from "@/components/app/Logo";

export default function AuthPage() {
  let lastRequestTime = 0;
  const requestCooldown = 1000; // 1 second

  const withErrorHandling = (fn) => async (...args) => {
    const now = Date.now();
    if (now - lastRequestTime < requestCooldown) {
      await new Promise(resolve => setTimeout(resolve, requestCooldown - (now - lastRequestTime)));
    }
    lastRequestTime = now;

    const { error, ...result } = await fn(...args);

    if (error) {
      console.error("Supabase error:", error);
      return { error, data: { user: null, session: null } };
    }

    return { error, ...result };
  };

  const auth = {
    signUp: supabase.auth.signUp.bind(supabase.auth),
    signInWithPassword: withErrorHandling(supabase.auth.signInWithPassword.bind(supabase.auth)),
    resetPasswordForEmail: withErrorHandling(supabase.auth.resetPasswordForEmail.bind(supabase.auth)),
  };
  const { user, loading } = useApp();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [mode, setMode] = useState<"login" | "signup" | "reset">(
    params.get("mode") === "signup" ? "signup" : "login"
  );
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ nome: "", email: "", senha: "" });

  useEffect(() => {
    const affiliateCode = params.get("ref");
    if (affiliateCode) {
      localStorage.setItem("affiliate_code", affiliateCode);
    }
  }, [params]);

  if (!loading && user) return <Navigate to="/app" replace />;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    setSubmitting(true);
    if (mode === "reset") {
      if (!form.email) {
toast.error("Informe o e-mail.", { duration: 60000 });
        return;
      }
      setSubmitting(true);
      const { error } = await auth.resetPasswordForEmail(form.email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      setSubmitting(false);
      if (error) {
toast.error(error.message, { duration: 60000 });
        return;
      }
      toast.success("Se este e-mail existir, enviaremos instruções de recuperação.");
      setMode("login");
      return;
    }

    if (!form.email || !form.senha || (mode === "signup" && !form.nome)) {
toast.error("Por favor, preencha todos os campos.", { duration: 60000 });
      return;
    }

    setSubmitting(true);
    try {
      if (mode === "signup") {
        const affiliateCode = localStorage.getItem("affiliate_code");

        const { error } = await auth.signUp({
          email: form.email,
          password: form.senha,
          options: {
            data: {
              full_name: form.nome,
              affiliate_code: affiliateCode,
            },
          },
        });

        if (error) {
          if (error.message && error.message.toLowerCase().includes("already")) {
            toast.error("Este e--mail já está cadastrado. Tente entrar.", { duration: 60000 });
          } else {
            toast.error(error.message, { duration: 60000 });
          }
          return;
        }

        toast.success(
          "Cadastro quase concluído! Enviamos um e-mail de confirmação para você. Por favor, verifique sua caixa de entrada."
        );
        setMode("login");
      } else {
        const { error } = await auth.signInWithPassword({
          email: form.email,
          password: form.senha,
        });
        if (error) {
toast.error("E-mail ou senha incorretos.", { duration: 60000 });
          return;
        }
        toast.success("Que bom te ver de novo.");
        navigate("/app");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-warm">
      <div className="container py-6">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/"><ArrowLeft className="mr-2 h-4 w-4" /> Voltar</Link>
        </Button>
      </div>

      <div className="container flex flex-col items-center justify-center pb-12">
        <Link to="/" className="mb-6">
          <LogoLockup size="md" />
        </Link>

        <Card className="w-full max-w-md border-border/60 p-8 shadow-elegant animate-fade-in-up">
          <h1 className="font-display text-2xl font-semibold">
            {mode === "login" && "Entre na sua conta"}
            {mode === "signup" && "Crie sua conta"}
            {mode === "reset" && "Recuperar senha"}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {mode === "login" && "Continue cuidando de você."}
            {mode === "signup" && "Em poucos segundos você está pronta."}
            {mode === "reset" && "Enviaremos um link para redefinir."}
          </p>

          <form onSubmit={submit} className="mt-6 space-y-4">
            {mode === "signup" && (
              <Field
                id="nome"
                label="Como podemos te chamar?"
                icon={User2}
                value={form.nome}
                onChange={(v) => setForm({ ...form, nome: v })}
                placeholder="Seu nome completo"
              />
            )}
            <Field
              id="email"
              label="E-mail"
              icon={Mail}
              type="email"
              value={form.email}
              onChange={(v) => setForm({ ...form, email: v })}
              placeholder="voce@email.com"
            />
            {mode !== "reset" && (
              <Field
                id="senha"
                label="Senha"
                icon={Lock}
                type="password"
                value={form.senha}
                onChange={(v) => setForm({ ...form, senha: v })}
                placeholder="••••••••"
              />
            )}

            <Button type="submit" disabled={submitting} className="mt-2 w-full rounded-full shadow-soft" size="lg">
              {submitting ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Aguarde...</>
              ) : (
                <>
                  {mode === "login" && "Entrar"}
                  {mode === "signup" && "Criar minha conta"}
                  {mode === "reset" && "Enviar link de recuperação"}
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 space-y-2 text-center text-sm">
            {mode === "login" && (
              <>
                <button
                  type="button"
                  className="text-primary underline-offset-4 hover:underline"
                  onClick={() => setMode("reset")}
                >
                  Esqueci minha senha
                </button>
                <p className="text-muted-foreground">
                  Ainda não tem conta?{" "}
                  <button
                    type="button"
                    className="font-medium text-primary underline-offset-4 hover:underline"
                    onClick={() => setMode("signup")}
                  >
                    Criar conta
                  </button>
                </p>
              </>
            )}
            {mode === "signup" && (
              <p className="text-muted-foreground">
                Já tem conta?{" "}
                <button
                  type="button"
                  className="font-medium text-primary underline-offset-4 hover:underline"
                  onClick={() => setMode("login")}
                >
                  Entrar
                </button>
              </p>
            )}
            {mode === "reset" && (
              <button
                type="button"
                className="text-primary underline-offset-4 hover:underline"
                onClick={() => setMode("login")}
              >
                Voltar para o login
              </button>
            )}
          </div>
        </Card>

        <p className="mt-6 max-w-md text-center text-xs text-muted-foreground">
          Suas informações são tratadas com sigilo. Usamos os dados apenas para
          oferecer mais segurança a você.
        </p>
      </div>
    </div>
  );
}

function Field({
  id, label, icon: Icon, value, onChange, type = "text", placeholder,
}: {
  id: string; label: string; icon: typeof Mail;
  value: string; onChange: (v: string) => void;
  type?: string; placeholder?: string;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-sm">{label}</Label>
      <div className="relative">
        <Icon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="h-12 rounded-2xl border-border/70 bg-background pl-10"
        />
      </div>
    </div>
  );
}
