import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useApp } from "@/store/app-store";
import { supabase } from "@/integrations/supabase/client";
import { mapQueryToConsulta } from "@/lib/consulta-mapper";
import type { ConsultaResultado } from "@/store/app-store";
import { RelatorioConsulta } from "@/components/app/RelatorioConsulta";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ArrowLeft, Loader2, Hourglass, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function ConsultaDetalhe() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useApp();
  const [consulta, setConsulta] = useState<ConsultaResultado | null>(null);
  const [status, setStatus] = useState<string>("pendente");
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!user || !id) return;

    const load = async () => {
      const { data, error } = await supabase
        .from("queries")
        .select("*")
        .eq("id", id)
        .eq("user_id", user.id)
        .maybeSingle();
      if (error || !data) {
        setNotFound(true);
        setLoading(false);
        return;
      }
      setStatus(data.status);
      setConsulta(mapQueryToConsulta(data as any));
      setLoading(false);
    };
    load();

    const channel = supabase
      .channel(`query-${id}`)
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "queries", filter: `id=eq.${id}` },
        (payload) => {
          const row = payload.new as any;
          setStatus(row.status);
          setConsulta(mapQueryToConsulta(row));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [id, user]);

  const excluirConsulta = async () => {
    if (!user || !id) return;

    const { error } = await supabase.from("queries").delete().eq("id", id).eq("user_id", user.id);

    if (error) {
      toast.error("Erro ao excluir a consulta. Tente novamente.");
      console.error("Error deleting consultation:", error);
    } else {
      navigate("/app/historico");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (notFound || !consulta) {
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
      <div className="flex justify-between">
        <Button asChild variant="ghost" size="sm">
          <Link to="/app/historico">
            <ArrowLeft className="mr-2 h-4 w-4" /> Voltar ao histórico
          </Link>
        </Button>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size="sm">
              <Trash2 className="mr-2 h-4 w-4" /> Excluir
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Excluir consulta</AlertDialogTitle>
              <AlertDialogDescription>
                A consulta será excluída permanentemente e não poderá ser recuperada.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={excluirConsulta}>Confirmar</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      {(status === "pendente" || status === "processando") && (
        <Card className="flex items-center gap-3 border-primary/20 bg-primary-soft/40 p-5 animate-fade-in-up">
          <Hourglass className="h-5 w-5 animate-pulse text-primary" />
          <div className="text-sm">
            <p className="font-medium">Estamos preparando seu relatório com cuidado.</p>
            <p className="text-muted-foreground">
              Isso costuma levar alguns instantes. Você pode aguardar nesta página.
            </p>
          </div>
        </Card>
      )}

      {status === "erro" && (
        <Card className="border-destructive/30 bg-destructive/5 p-5">
          <p className="font-medium text-destructive">Não foi possível concluir a consulta.</p>
          <p className="text-sm text-muted-foreground">
            Seu crédito permanece disponível. Tente novamente em alguns instantes.
          </p>
        </Card>
      )}

      {consulta && <RelatorioConsulta consulta={consulta} />}
    </div>
  );
}
