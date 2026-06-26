
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Gift } from "lucide-react";

interface GiftModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  checkoutUrl: string;
}

export function GiftModal({ open, onOpenChange, checkoutUrl }: GiftModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary-soft">
            <Gift className="h-8 w-8 text-primary" />
          </div>
          <DialogTitle className="text-center text-2xl font-bold">Você ganhou um presente! 🎁</DialogTitle>
          <DialogDescription className="text-center">
            Por ter cadastrado seu primeiro contato na Rede de Confiança, você ganhou um desconto especial para fazer sua primeira consulta.
            <br />
            <strong>Aproveite, esta é uma oferta única e não aparecerá novamente!</strong>
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p className="text-center text-lg">
            De <span className="line-through">R$30,00</span> por apenas <span className="font-bold text-primary">R$5,00</span>
          </p>
        </div>
        <DialogFooter>
          <Button asChild size="lg" className="w-full rounded-full">
            <a href={checkoutUrl} target="_blank" rel="noopener noreferrer">
              Fazer minha primeira consulta
            </a>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
