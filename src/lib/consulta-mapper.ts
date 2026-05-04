import type { ConsultaResultado, RiskLevel, ProcessoInteresse, ProcessoOutro } from "@/store/app-store";

interface QueryRow {
  id: string;
  email: string;
  query_type: "cpf" | "form";
  input_data: any;
  status: "pendente" | "processando" | "concluído" | "erro";
  output_data: {
    nome_pesquisado?: string;
    cpf_pesquisado?: string;
    resumo?: string;
    risk_level?: "Baixo" | "Médio" | "Alto" | "Desconhecido";
    processos_interesse?: any[];
    processos_outros?: any[];
    [key: string]: any;
  } | null;
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

function formatCPF(cpf: string | null | undefined): string | undefined {
  if (!cpf) return undefined;
  const cleaned = cpf.replace(/\D/g, "");
  if (cleaned.length !== 11) return cpf;
  return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
}

export function mapQueryToConsulta(row: QueryRow): ConsultaResultado {
  const input = (row.input_data ?? {}) as Record<string, any>;
  const output = (row.output_data ?? {}) as Record<string, any>;

  const risco: RiskLevel = riskMap[output.risk_level ?? row.risk_level ?? "Desconhecido"] ?? "baixo";

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
      nome: output.nome_pesquisado || output.nome || input.nome || (input.cpf ? `CPF ${input.cpf}` : "Pessoa consultada"),
      cpf: formatCPF(output.cpf_pesquisado || input.cpf),
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
