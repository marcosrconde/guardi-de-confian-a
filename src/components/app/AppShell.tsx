import { ReactNode, useEffect, useState, useCallback } from "react";
import { Link, NavLink, Navigate, useLocation } from "react-router-dom";
import { useApp } from "@/store/app-store";
import { Button } from "@/components/ui/button";
import { Sparkles, History, Wallet, LogOut, Menu, Loader2, HelpCircle } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { LogoInline } from "./Logo";
import { getSaldoCreditos } from "@/lib/credits";
import { supabase } from "@/integrations/supabase/client";

const nav = [
  { to: "/app", label: "Nova consulta", icon: Sparkles, end: true },
  { to: "/app/historico", label: "Histórico", icon: History },
  { to: "/app/creditos", label: "Créditos", icon: Wallet },
  { to: "/app/faq", label: "F.A.Q", icon: HelpCircle },
];

function NavItems({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <>
      {nav.map(({ to, label, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          onClick={onNavigate}
          className={({ isActive }) =>
            cn(
              "flex items-center gap-3 rounded-full px-4 py-2.5 text-sm font-medium transition-smooth",
              isActive
                ? "bg-primary text-primary-foreground shadow-soft"
                : "text-foreground/70 hover:text-foreground hover:bg-primary-soft"
            )
          }
        >
          <Icon className="h-4 w-4" />
          {label}
        </NavLink>
      ))}
    </>
  );
}

interface ShellContext {
  refreshSaldo: () => Promise<void>;
  saldo: number;
}

export function AppShell({ children }: { children: ReactNode }) {
  const { user, loading, signOut } = useApp();
  const location = useLocation();
  const [saldo, setSaldo] = useState<number>(0);
  const [loadingSaldo, setLoadingSaldo] = useState(true);

  const refreshSaldo = useCallback(async () => {
    if (!user) return;
    setLoadingSaldo(true);
    try {
      const s = await getSaldoCreditos(user.id);
      setSaldo(s);
    } finally {
      setLoadingSaldo(false);
    }
  }, [user]);

  useEffect(() => {
    if (!user) return;
    refreshSaldo();

    // Realtime: refresh when transactions/queries change
    const channel = supabase
      .channel("creditos")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "credit_transactions", filter: `user_id=eq.${user.id}` },
        () => refreshSaldo()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, refreshSaldo]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-warm">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  const ctx: ShellContext = { refreshSaldo, saldo };

  return (
    <div className="min-h-screen bg-warm">
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-xl">
        <div className="container flex h-16 items-center justify-between gap-4">
          <Link to="/app" aria-label="JusMulher">
            <LogoInline />
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            <NavItems />
          </nav>

          <div className="flex items-center gap-2">
            <Link
              to="/app/creditos"
              className="hidden items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm shadow-soft transition-smooth hover:border-primary/40 sm:flex"
            >
              <Wallet className="h-4 w-4 text-primary" />
              {loadingSaldo ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" />
              ) : (
                <>
                  <span className="font-semibold text-foreground">{saldo}</span>
                  <span className="text-muted-foreground">{saldo === 1 ? "crédito" : "créditos"}</span>
                </>
              )}
            </Link>
            <Button variant="ghost" size="icon" onClick={() => signOut()} title="Sair">
              <LogOut className="h-4 w-4" />
            </Button>

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72">
                <div className="mt-8 flex flex-col gap-2">
                  <div className="mb-2 rounded-2xl bg-primary-soft p-4">
                    <p className="text-xs uppercase tracking-wide text-primary/80">Saldo</p>
                    <p className="font-display text-2xl font-semibold text-primary">
                      {saldo} {saldo === 1 ? "crédito" : "créditos"}
                    </p>
                  </div>
                  <NavItems />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <main className="container py-8 md:py-12">
        <ShellContextProvider value={ctx}>{children}</ShellContextProvider>
      </main>

      <footer className="container pb-10 pt-6 text-center text-xs text-muted-foreground">
        JusMulher · feito com cuidado para a sua segurança.
      </footer>
    </div>
  );
}

import { createContext, useContext } from "react";
const ShellCtx = createContext<ShellContext | null>(null);
function ShellContextProvider({ value, children }: { value: ShellContext; children: ReactNode }) {
  return <ShellCtx.Provider value={value}>{children}</ShellCtx.Provider>;
}
export function useShell() {
  const c = useContext(ShellCtx);
  if (!c) throw new Error("useShell deve ser usado dentro do AppShell");
  return c;
}
