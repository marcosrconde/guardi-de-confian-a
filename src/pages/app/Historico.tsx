import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useApp } from "@/store/app-store";
import { supabase } from "@/integrations/supabase/client";
import { mapQueryToConsulta } from "@/lib/consulta-mapper";
import type { ConsultaResultado } from "@/store/app-store";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RiskBadge } from "@/components/app/RiskBadge";
import { FileSearch, Sparkles, Loader2 } from "lucide-react";

export default function Historico() {
  const { user } = useApp();
  const navigate = useNavigate();
  const [consultas, setConsultas] = useState<ConsultaResultado[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const load = async () => {
      const { data, error } = await supabase
        .from("queries")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      if (!error && data) {
        setConsultas(data.map((r) => mapQueryToConsulta(r as any)));
      }
      setLoading(false);
    };
    load();

    const channel = supabase
      .channel("queries-list")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "queries", filter: `user_id=eq.${user.id}` },
        () => load()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

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
                {c.processos_interesse.length} {c.processos_interesse.length === 1 ? "processo" : "processos"}
              </p>
              {c.resumo && <p className="mt-2 line-clamp-1 text-sm text-foreground/70">{c.resumo}</p>}
            </div>
            <Button variant="outline" className="rounded-full" onClick={() => navigate(`/app/consulta/${c.id}`)}>
              Ver relatório
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}
