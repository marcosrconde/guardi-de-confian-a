import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import type { Session, User as SupaUser } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export type RiskLevel = "baixo" | "medio" | "alto";

export interface ProcessoInteresse {
  numero_cnj: string;
  tribunal: string;
  polo_ativo: string;
  polo_passivo: string;
  assunto_geral: string;
  fase_processual: string;
  data_ultima_movimentacao: string;
  valor_causa?: number;
  motivo_interesse?: string;
}

export interface ProcessoOutro {
  numero_cnj: string;
  tribunal: string;
  assunto_principal: string;
  polo_ativo: string;
  polo_passivo: string;
  data_ultima_movimentacao: string;
  motivo_descarte: string;
  valor_da_causa?: number;
}

export interface ConsultaResultado {
  id: string;
  query_type: "cpf" | "form";
  criadoEm: string;
  alvo: {
    nome: string;
    cpf?: string;
    nascimento?: string;
    cidade?: string;
    nomeMae?: string;
    idade?: string;
  };
  risco: RiskLevel;
  resumo: string;
  processos_interesse: ProcessoInteresse[];
  processos_outros: ProcessoOutro[];
}

export interface Profile {
  id: string;
  nome: string;
  email: string;
}

interface AppState {
  user: Profile | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const Ctx = createContext<AppState | null>(null);

function toProfile(u: SupaUser | null | undefined): Profile | null {
  if (!u) return null;
  const fullName =
    (u.user_metadata?.full_name as string | undefined) ||
    (u.email ? u.email.split("@")[0] : "Usuária");
  return {
    id: u.id,
    email: u.email ?? "",
    nome: fullName,
  };
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up listener FIRST
    const { data: sub } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      setUser(toProfile(newSession?.user));
    });

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setUser(toProfile(data.session?.user));
      setLoading(false);
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  const value: AppState = {
    user,
    session,
    loading,
    signOut: async () => {
      await supabase.auth.signOut();
    },
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useApp() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useApp deve ser usado dentro de AppProvider");
  return ctx;
}
