import type { ConsultaResultado, RiskLevel, ProcessoInteresse, ProcessoOutro } from "@/store/app-store";

interface QueryRow {
  id: string;
  email: string;
  query_type: "cpf" | "form";
  input_data: any;
  status: "pendente" | "processando" | "concluído" | "erro";
  output_data: any;
  risk_level: "Baixo" | "Médio" | "Alto" | "Desconhecido" | null;
  created_at: string;
  completed_at: string | null;
}

const riskMap: Record<string, RiskLevel> = {
  Baixo: "baixo",
  Médio: "medio",
  Alto: "alto",
  Desconhecido: "baixo",
  low: "baixo",
  medium: "medio",
  high: "alto",
  unknown: "baixo",
};

export function mapQueryToConsulta(row: QueryRow): ConsultaResultado {
  const input = (row.input_data ?? {}) as Record<string, any>;
  const output = (row.output_data ?? {}) as Record<string, any>;

  const risco: RiskLevel = riskMap[row.risk_level ?? "Desconhecido"] ?? "baixo";

  const processos_interesse: ProcessoInteresse[] = Array.isArray(output.processos_interesse)
    ? output.processos_interesse
    : [];

  const processos_outros: ProcessoOutro[] = Array.isArray(output.processos_outros)
    ? output.processos_outros
    : [];

  return {
    id: row.id,
    criadoEm: row.created_at,
    alvo: {
      nome: output.nome || input.nome || (input.cpf ? `CPF ${input.cpf}` : "Pessoa consultada"),
      cpf: input.cpf,
      nascimento: input.nascimento,
      cidade: input.cidade,
      nomeMae: input.nomeMae,
    },
    risco,
    resumo: output.resumo || (row.status === "concluído" ? "Consulta concluída." : "Consulta em processamento."),
    processos_interesse,
    processos_outros,
  };
}
