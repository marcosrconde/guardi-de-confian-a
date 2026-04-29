import { ConsultaResultado, RiskLevel } from "@/store/app-store";

const nomes = ["Rafael Almeida Souza", "Carlos Henrique Lima", "Pedro Martins Rocha", "Lucas Ferreira Dias"];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function gerarConsultaMock(input: {
  cpf?: string;
  nome?: string;
  nascimento?: string;
  cidade?: string;
  nomeMae?: string;
}): ConsultaResultado {
  const seed = (input.cpf || input.nome || "").length;
  const riscoIdx = seed % 3;
  const risco: RiskLevel = (["baixo", "medio", "alto"] as const)[riscoIdx];

  const baseProcessos = [
    {
      numero: "0023456-12.2021.8.26.0100",
      area: "Criminal",
      classe: "Violência doméstica (Lei Maria da Penha)",
      status: "ativo" as const,
      resumo: "Medida protetiva de urgência registrada. Caso em andamento.",
      alerta: true,
      data: "2021-08-14",
    },
    {
      numero: "0011223-44.2019.8.26.0224",
      area: "Cível",
      classe: "Ação de divórcio litigioso",
      status: "arquivado" as const,
      resumo: "Processo concluído sem ocorrências adicionais.",
      data: "2019-03-02",
    },
    {
      numero: "0099887-33.2023.8.26.0050",
      area: "Criminal",
      classe: "Lesão corporal",
      status: "ativo" as const,
      resumo: "Inquérito em fase inicial, sem sentença.",
      alerta: true,
      data: "2023-11-09",
    },
    {
      numero: "0077665-21.2018.8.26.0011",
      area: "Trabalhista",
      classe: "Reclamação trabalhista",
      status: "arquivado" as const,
      resumo: "Resolvido em audiência de conciliação.",
      data: "2018-06-21",
    },
  ];

  const processos =
    risco === "alto"
      ? baseProcessos
      : risco === "medio"
      ? [baseProcessos[1], baseProcessos[2]]
      : [baseProcessos[3]];

  const destaquesMap: Record<RiskLevel, string[]> = {
    alto: [
      "Há registro de medida protetiva relacionada a violência doméstica.",
      "Existem processos criminais ativos envolvendo agressão.",
      "Recomendamos cautela e, se necessário, busque apoio especializado.",
    ],
    medio: [
      "Há registro criminal em andamento que merece atenção.",
      "Recomendamos conhecer o contexto antes de avançar na relação.",
    ],
    baixo: [
      "Nenhum registro criminal relevante foi encontrado.",
      "Apenas processos de natureza cível ou trabalhista, sem alertas.",
    ],
  };

  const resumoMap: Record<RiskLevel, string> = {
    alto: "Identificamos sinais importantes que merecem sua atenção.",
    medio: "Encontramos pontos relevantes que vale a pena conhecer com calma.",
    baixo: "Nada preocupante foi identificado nos registros disponíveis.",
  };

  return {
    id: crypto.randomUUID(),
    criadoEm: new Date().toISOString(),
    alvo: {
      nome: input.nome || pick(nomes),
      cpf: input.cpf,
      nascimento: input.nascimento,
      cidade: input.cidade,
      nomeMae: input.nomeMae,
    },
    risco,
    resumo: resumoMap[risco],
    processos,
    destaques: destaquesMap[risco],
  };
}
