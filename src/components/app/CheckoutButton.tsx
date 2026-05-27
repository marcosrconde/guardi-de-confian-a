import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { getCheckoutUrl } from "@/lib/checkout";
import { useApp } from "@/store/app-store";
import { cn } from "@/lib/utils";
import { Sparkles } from "lucide-react";
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

export function CheckoutButton({ pacote, popular }: { pacote: any, popular: boolean }) {
  const { user } = useApp();
  const [checkoutUrl, setCheckoutUrl] = useState(pacote.checkout_url);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCheckoutUrl = async () => {
      const url = await getCheckoutUrl(pacote, user);
      setCheckoutUrl(url);
      setLoading(false);
    };
    fetchCheckoutUrl();
  }, [pacote, user]);

  return (
    <AlertDialog>
        <AlertDialogTrigger asChild>
            <Button
                className={cn("mt-7 w-full rounded-full", popular && "shadow-elegant")}
                variant={popular ? "default" : "outline"}
                size="lg"
                disabled={loading}
            >
                <Sparkles className="mr-2 h-4 w-4" />
                Comprar agora
            </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
            <AlertDialogHeader>
            <AlertDialogTitle>Atenção</AlertDialogTitle>
            <AlertDialogDescription>
                Para que os créditos sejam adicionados à sua conta, é essencial que o e-mail utilizado no checkout seja o mesmo do seu cadastro em nossa plataforma.
            </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction asChild>
                <a href={checkoutUrl} target="_blank" rel="noopener noreferrer">
                Continuar
                </a>
            </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
  );
}