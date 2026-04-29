import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type RiskLevel = "baixo" | "medio" | "alto";

export interface ProcessoItem {
  numero: string;
  area: string;
  classe: string;
  status: "ativo" | "arquivado";
  resumo: string;
  alerta?: boolean;
  data: string;
}

export interface ConsultaResultado {
  id: string;
  criadoEm: string;
  alvo: {
    nome: string;
    cpf?: string;
    nascimento?: string;
    cidade?: string;
    nomeMae?: string;
  };
  risco: RiskLevel;
  resumo: string;
  processos: ProcessoItem[];
  destaques: string[];
}

export interface User {
  id: string;
  nome: string;
  email: string;
}

interface AppState {
  user: User | null;
  creditos: number;
  consultas: ConsultaResultado[];
  signIn: (email: string, nome?: string) => void;
  signOut: () => void;
  addCreditos: (n: number) => void;
  consumirCredito: () => boolean;
  registrarConsulta: (c: ConsultaResultado) => void;
}

const STORAGE_KEY = "amparo:state:v1";
const Ctx = createContext<AppState | null>(null);

interface Persisted {
  user: User | null;
  creditos: number;
  consultas: ConsultaResultado[];
}

const loadInitial = (): Persisted => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { user: null, creditos: 0, consultas: [] };
};

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<Persisted>(() => loadInitial());

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const value: AppState = {
    user: state.user,
    creditos: state.creditos,
    consultas: state.consultas,
    signIn: (email, nome) =>
      setState((s) => ({
        ...s,
        user: {
          id: crypto.randomUUID(),
          email,
          nome: nome ?? email.split("@")[0],
        },
        creditos: s.creditos === 0 && s.consultas.length === 0 ? 1 : s.creditos,
      })),
    signOut: () => setState({ user: null, creditos: 0, consultas: [] }),
    addCreditos: (n) => setState((s) => ({ ...s, creditos: s.creditos + n })),
    consumirCredito: () => {
      let ok = false;
      setState((s) => {
        if (s.creditos <= 0) return s;
        ok = true;
        return { ...s, creditos: s.creditos - 1 };
      });
      return ok;
    },
    registrarConsulta: (c) =>
      setState((s) => ({ ...s, consultas: [c, ...s.consultas] })),
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useApp() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useApp deve ser usado dentro de AppProvider");
  return ctx;
}
