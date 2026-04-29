import { ConsultaResultado } from "@/store/app-store";
import { RiskBadge } from "./RiskBadge";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { AlertTriangle, FileText, Calendar, User2, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

export function RelatorioConsulta({ consulta }: { consulta: ConsultaResultado }) {
  const { alvo, processos, destaques, resumo, risco, criadoEm } = consulta;
  return (
    <div className="space-y-6 animate-fade-in-up">
      <Card className="overflow-hidden border-border/60 shadow-elegant">
        <div className="bg-primary-gradient p-6 text-primary-foreground sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] opacity-80">Pessoa consultada</p>
              <h2 className="font-display text-2xl font-semibold sm:text-3xl">{alvo.nome}</h2>
              <p className="mt-2 max-w-xl text-sm opacity-90">{resumo}</p>
            </div>
            <RiskBadge level={risco} className="bg-background/95 backdrop-blur" />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-x-8 gap-y-3 p-6 text-sm sm:grid-cols-2 sm:p-8">
          {alvo.cpf && <Info icon={User2} label="CPF" value={alvo.cpf} />}
          {alvo.nascimento && <Info icon={Calendar} label="Nascimento" value={alvo.nascimento} />}
          {alvo.cidade && <Info icon={MapPin} label="Cidade" value={alvo.cidade} />}
          {alvo.nomeMae && <Info icon={User2} label="Nome da mãe" value={alvo.nomeMae} />}
          <Info
            icon={Calendar}
            label="Consulta realizada em"
            value={new Date(criadoEm).toLocaleString("pt-BR")}
          />
        </div>
      </Card>

      <Card className="border-border/60 p-6 sm:p-8">
        <h3 className="font-display text-lg font-semibold">O que você precisa saber</h3>
        <ul className="mt-4 space-y-3">
          {destaques.map((d, i) => (
            <li key={i} className="flex items-start gap-3 text-sm leading-relaxed">
              <span
                className={cn(
                  "mt-1 h-2 w-2 shrink-0 rounded-full",
                  risco === "alto"
                    ? "bg-destructive"
                    : risco === "medio"
                    ? "bg-warning"
                    : "bg-success"
                )}
              />
              <span className="text-foreground/80">{d}</span>
            </li>
          ))}
        </ul>
      </Card>

      <Card className="border-border/60 p-6 sm:p-8">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-lg font-semibold">Processos encontrados</h3>
          <span className="text-sm text-muted-foreground">
            {processos.length} {processos.length === 1 ? "registro" : "registros"}
          </span>
        </div>
        <Separator className="my-5" />
        {processos.length === 0 ? (
          <p className="text-sm text-muted-foreground">Nenhum processo encontrado.</p>
        ) : (
          <ul className="space-y-4">
            {processos.map((p) => (
              <li
                key={p.numero}
                className={cn(
                  "rounded-2xl border p-4 transition-smooth hover:shadow-soft sm:p-5",
                  p.alerta
                    ? "border-destructive/30 bg-destructive/5"
                    : "border-border bg-secondary/40"
                )}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div
                      className={cn(
                        "mt-0.5 flex h-9 w-9 items-center justify-center rounded-full",
                        p.alerta ? "bg-destructive/15 text-destructive" : "bg-primary-soft text-primary"
                      )}
                    >
                      {p.alerta ? <AlertTriangle className="h-4 w-4" /> : <FileText className="h-4 w-4" />}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{p.classe}</p>
                      <p className="text-xs text-muted-foreground">
                        {p.area} · {new Date(p.data).toLocaleDateString("pt-BR")} ·{" "}
                        <span className="font-mono">{p.numero}</span>
                      </p>
                    </div>
                  </div>
                  <span
                    className={cn(
                      "rounded-full px-2.5 py-0.5 text-xs font-medium capitalize",
                      p.status === "ativo"
                        ? "bg-warning/15 text-warning"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    {p.status}
                  </span>
                </div>
                <p className="mt-3 text-sm text-foreground/75">{p.resumo}</p>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <p className="text-center text-xs text-muted-foreground">
        Estas informações são fornecidas para sua segurança e devem ser interpretadas com cautela.
        Em caso de dúvida, busque orientação profissional ou apoio especializado (Ligue 180).
      </p>
    </div>
  );
}

function Info({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof User2;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <Icon className="h-4 w-4 text-primary" />
      <div>
        <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
        <p className="font-medium text-foreground">{value}</p>
      </div>
    </div>
  );
}
