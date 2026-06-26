
import { Card, CardContent } from "@/components/ui/card";
import { Gift } from "lucide-react";
import { Link } from "react-router-dom";

export function GiftAlert() {
  return (
    <Card className="mb-8 bg-primary-soft border-primary/20">
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/20">
            <Gift className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-primary">Um presente para você!</h3>
            <p className="text-foreground/80">
              Cadastre seu primeiro contato na Rede de Confiança e ganhe um desconto de R$25 para sua primeira consulta.{" "}
              <Link to="/app/rede-de-confianca" className="font-bold underline hover:text-primary">
                Cadastrar agora
              </Link>
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
