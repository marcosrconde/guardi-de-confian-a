import { Link } from "react-router-dom";
import { useApp } from "@/store/app-store";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RiskBadge } from "@/components/app/RiskBadge";
import { FileSearch, Sparkles } from "lucide-react";

export default function Historico() {
  const { consultas } = useApp();

  if (consultas.length === 0) {
    return (
      <div className="mx-auto max-w-2xl text-center animate-fade-in-up">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary-soft">
          <FileSearch className="h-7 w-7 text-primary" />
        </div>
        <h1 className="mt-6 font-display text-3xl font-semibold">Sem consultas por aqui</h1>
        <p className="mt-2 text-muted-foreground">
          Quando você fizer sua primeira consulta, ela aparece neste espaço para você revisitar quando quiser.
        </p>
        <Button asChild size="lg" className="mt-6 rounded-full">
          <Link to="/app"><Sparkles className="mr-2 h-4 w-4" /> Fazer primeira consulta</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6 animate-fade-in-up">
      <header>
        <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">Suas consultas</h1>
        <p className="mt-2 text-muted-foreground">
          Todos os relatórios ficam guardados aqui para você acessar com calma.
        </p>
      </header>

      <div className="space-y-3">
        {consultas.map((c) => (
          <Card
            key={c.id}
            className="flex flex-wrap items-center justify-between gap-4 border-border/60 p-5 transition-smooth hover:shadow-soft"
          >
            <div className="min-w-0">
              <div className="flex items-center gap-3">
                <h3 className="truncate font-display text-lg font-semibold">{c.alvo.nome}</h3>
                <RiskBadge level={c.risco} />
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                {new Date(c.criadoEm).toLocaleString("pt-BR")} ·{" "}
                {c.processos.length} {c.processos.length === 1 ? "processo" : "processos"}
              </p>
              <p className="mt-2 line-clamp-1 text-sm text-foreground/70">{c.resumo}</p>
            </div>
            <Button asChild variant="outline" className="rounded-full">
              <Link to={`/app/consulta/${c.id}`}>Ver relatório</Link>
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}
