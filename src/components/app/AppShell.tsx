import { ReactNode } from "react";
import { Link, NavLink, Navigate, useLocation } from "react-router-dom";
import { useApp } from "@/store/app-store";
import { Button } from "@/components/ui/button";
import { Sparkles, History, ShieldCheck, Wallet, LogOut, Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/app", label: "Nova consulta", icon: Sparkles, end: true },
  { to: "/app/historico", label: "Histórico", icon: History },
  { to: "/app/creditos", label: "Créditos", icon: Wallet },
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

export function AppShell({ children }: { children: ReactNode }) {
  const { user, creditos, signOut } = useApp();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return (
    <div className="min-h-screen bg-warm">
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-xl">
        <div className="container flex h-16 items-center justify-between gap-4">
          <Link to="/app" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-gradient shadow-soft">
              <ShieldCheck className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-display text-xl font-semibold tracking-tight">Amparo</span>
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
              <span className="font-semibold text-foreground">{creditos}</span>
              <span className="text-muted-foreground">{creditos === 1 ? "crédito" : "créditos"}</span>
            </Link>
            <Button variant="ghost" size="icon" onClick={signOut} title="Sair">
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
                      {creditos} {creditos === 1 ? "crédito" : "créditos"}
                    </p>
                  </div>
                  <NavItems />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <main className="container py-8 md:py-12">{children}</main>

      <footer className="container pb-10 pt-6 text-center text-xs text-muted-foreground">
        Amparo · feito com cuidado para a sua segurança.
      </footer>
    </div>
  );
}
