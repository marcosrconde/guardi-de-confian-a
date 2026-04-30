import type { ConsultaResultado, RiskLevel, ProcessoItem } from "@/store/app-store";

interface QueryRow {
  id: string;
  email: string;
  query_type: "cpf" | "form";
  input_data: any;
  status: "pending" | "processing" | "completed" | "error";
  output_data: any;
  risk_level: "low" | "medium" | "high" | "unknown" | null;
  created_at: string;
  completed_at: string | null;
}

const riskMap: Record<string, RiskLevel> = {
  low: "baixo",
  medium: "medio",
  high: "alto",
  unknown: "baixo",
};

export function mapQueryToConsulta(row: QueryRow): ConsultaResultado {
  const input = (row.input_data ?? {}) as Record<string, any>;
  const output = (row.output_data ?? {}) as Record<string, any>;

  const risco: RiskLevel = riskMap[row.risk_level ?? "unknown"] ?? "baixo";

  const processos: ProcessoItem[] = Array.isArray(output.processos)
    ? output.processos
    : [];

  const destaques: string[] = Array.isArray(output.destaques)
    ? output.destaques
    : output.resumo
    ? [String(output.resumo)]
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
    resumo: output.resumo || (row.status === "completed" ? "Consulta concluída." : "Consulta em processamento."),
    processos,
    destaques,
  };
}
