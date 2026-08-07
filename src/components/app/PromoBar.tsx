import { X, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { useMemo, useState } from "react";
import { usePromo } from "@/hooks/use-promo";

export function PromoBar() {
  const { isActive, name, endLabel } = usePromo();
  const storageKey = useMemo(() => `promo_bar_dismissed_${name}`, [name]);
  const [dismissed, setDismissed] = useState(() => localStorage.getItem(storageKey) === "1");

  if (!isActive || dismissed) return null;

  return (
    <div className="border-b border-primary/20 bg-primary-soft text-foreground">
      <div className="container flex items-center justify-between gap-4 py-2 text-sm">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <span>
            Agosto/2026: preços promocionais — {name}
            {endLabel ? ` · válido até ${endLabel}` : null}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/precos" className="rounded-full border border-primary/30 px-3 py-1 text-xs font-medium hover:bg-primary/10">
            Ver preços
          </Link>
          <button
            aria-label="Fechar aviso promocional"
            className="rounded-full p-1 hover:bg-primary/10"
            onClick={() => {
              localStorage.setItem(storageKey, "1");
              setDismissed(true);
            }}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
