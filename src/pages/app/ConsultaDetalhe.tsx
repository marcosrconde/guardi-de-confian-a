import { Link, useParams } from "react-router-dom";
import { useApp } from "@/store/app-store";
import { RelatorioConsulta } from "@/components/app/RelatorioConsulta";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function ConsultaDetalhe() {
  const { id } = useParams();
  const { consultas } = useApp();
  const consulta = consultas.find((c) => c.id === id);

  if (!consulta) {
    return (
      <div className="mx-auto max-w-md text-center">
        <h1 className="font-display text-2xl font-semibold">Relatório não encontrado</h1>
        <Button asChild className="mt-4 rounded-full">
          <Link to="/app/historico">Ver histórico</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <Button asChild variant="ghost" size="sm">
        <Link to="/app/historico"><ArrowLeft className="mr-2 h-4 w-4" /> Voltar ao histórico</Link>
      </Button>
      <RelatorioConsulta consulta={consulta} />
    </div>
  );
}
