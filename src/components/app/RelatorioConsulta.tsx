import { ConsultaResultado, ProcessoInteresse, ProcessoOutro } from "@/store/app-store";
import { RiskBadge } from "./RiskBadge";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { AlertTriangle, FileText, Calendar, User2, MapPin, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function RelatorioConsulta({ consulta }: { consulta: ConsultaResultado }) {
  const { alvo, processos_interesse, processos_outros, resumo, risco, criadoEm } = consulta;
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
        <div className="flex items-center justify-between">
          <h3 className="font-display text-lg font-semibold">Processos de Interesse</h3>
          <span className="text-sm text-muted-foreground">
            {processos_interesse.length} {processos_interesse.length === 1 ? "registro" : "registros"}
          </span>
        </div>
        <Separator className="my-5" />
        {processos_interesse.length === 0 ? (
          <p className="text-sm text-muted-foreground">Nenhum processo de interesse encontrado.</p>
        ) : (
          <ul className="space-y-4">
            {processos_interesse.map((p) => (
              <li
                key={p.numero_cnj}
                className="rounded-2xl border border-border bg-secondary/40 p-4 transition-smooth hover:shadow-soft sm:p-5"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-full bg-primary-soft text-primary">
                      <FileText className="h-4 w-4" />
                    </div>
                     <div>
                       <p className="font-medium text-foreground">{p.assunto_geral || "Assunto não informado"}</p>
                       <p className="text-xs text-muted-foreground">
                         {p.tribunal} · {p.data_ultima_movimentacao} ·{" "}
                         <span className="font-mono">{p.numero_cnj}</span>
                       </p>
                     </div>
                   </div>
                   {p.fase_processual &&
                     <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium capitalize text-muted-foreground">
                       {p.fase_processual}
                     </span>
                   }
                 </div>
                 <div className="mt-3 space-y-1 text-sm text-foreground/75">
                   <p><b>Polo Ativo:</b> {p.polo_ativo}</p>
                   <p><b>Polo Passivo:</b> {p.polo_passivo}</p>
                   {p.valor_causa && <p><b>Valor da Causa:</b> {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(p.valor_causa)}</p>}
                   {p.motivo_interesse && <p className="mt-2 text-xs text-muted-foreground"><b>Motivo de Interesse:</b> {p.motivo_interesse}</p>}
                 </div>
               </li>
            ))}
          </ul>
        )}
      </Card>

      <Card className="border-border/60 p-6 sm:p-8">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-lg font-semibold">Outros Processos</h3>
          <span className="text-sm text-muted-foreground">
            {processos_outros.length} {processos_outros.length === 1 ? "registro" : "registros"}
          </span>
        </div>
        <Separator className="my-5" />
        {processos_outros.length === 0 ? (
          <p className="text-sm text-muted-foreground">Nenhum outro processo encontrado.</p>
        ) : (
          <ul className="space-y-4">
            {processos_outros.map((p) => (
              <li
                key={p.numero_cnj}
                className="rounded-2xl border border-border bg-secondary/40 p-4 transition-smooth hover:shadow-soft sm:p-5"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-full bg-primary-soft text-primary">
                      <Trash2 className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{p.assunto_principal}</p>
                      <p className="text-xs text-muted-foreground">
                        {p.tribunal} · {p.data_ultima_movimentacao} ·{" "}
                        <span className="font-mono">{p.numero_cnj}</span>
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-3 space-y-1 text-sm text-foreground/75">
                  <p><b>Polo Ativo:</b> {p.polo_ativo}</p>
                  <p><b>Polo Passivo:</b> {p.polo_passivo}</p>
                  <p className="mt-2 text-xs text-muted-foreground">{p.motivo_descarte}</p>
                </div>
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
