
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { User2, Calendar, MapPin } from "lucide-react";
import { formatCPF, maskMotherName } from "@/lib/utils";

type Candidate = {
  name: string;
  tax: string;
  motherName: string;
  birthDate: string;
  age: string;
  city: string;
  state: string;
  matchCount: number;
  matchedFields: string[];
  scores: {
    name: number;
    motherName: number;
    city: number;
    birthDate: number;
  };
};

type Props = {
  candidates: Candidate[];
  onSelect: (candidate: Candidate) => void;
};

export function ListaCandidatos({ candidates, onSelect }: Props) {
  console.log("ListaCandidatos props", { candidates, onSelect });
  return (
    <div className="space-y-6 animate-fade-in-up">
      <Card className="border-border/60 p-6 sm:p-8">
        <h3 className="font-display text-lg font-semibold">Foram encontradas as seguintes pessoas</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Selecione a pessoa que você gostaria de prosseguir com a análise.
        </p>
      </Card>

      <ul className="space-y-4">
        {candidates.map((candidate) => (
          <li
            key={candidate.tax}
            className="rounded-2xl border border-border bg-secondary/40 p-4 transition-smooth hover:shadow-soft sm:p-5"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-full bg-primary-soft text-primary">
                  <User2 className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-medium text-foreground">{candidate.name}</p>
                  <div className="grid grid-cols-1 gap-x-8 gap-y-3 p-6 text-sm sm:grid-cols-2 sm:p-8">
                    {candidate.tax && <Info icon={User2} label="CPF" value={formatCPF(candidate.tax).replace(/^\d{3}/, "***").replace(/-\d{2}$/, "-**")} />}
                    {candidate.age && <Info icon={Calendar} label="Idade" value={candidate.age} />}
                    {candidate.birthDate && <Info icon={Calendar} label="Nascimento" value={candidate.birthDate} />}
                    {candidate.city && <Info icon={MapPin} label="Cidade" value={candidate.city} />}
                    {candidate.motherName && <Info icon={User2} label="Nome da mãe" value={maskMotherName(candidate.motherName)} />}
                  </div>
                </div>
              </div>
              <Button onClick={() => onSelect(candidate)}>Selecionar</Button>
            </div>
          </li>
        ))}
      </ul>
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
