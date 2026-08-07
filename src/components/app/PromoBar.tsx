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
    <div className="border-b border-primary/40 bg-primary text-primary-foreground">
      <div className="container flex items-center justify-between gap-4 py-2 text-sm">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary-foreground" />
          <span>
            Agosto/2026: preços promocionais — {name}
            {endLabel ? ` · válido até ${endLabel}` : null}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/precos" className="rounded-full bg-primary-foreground px-3 py-1 text-xs font-semibold text-primary hover:bg-primary-foreground/90">
            Ver preços
          </Link>
          <button
            aria-label="Fechar aviso promocional"
            className="rounded-full p-1 hover:bg-primary-foreground/10"
            onClick={() => {
              localStorage.setItem(storageKey, "1");
              setDismissed(true);
            }}
          >
            <X className="h-4 w-4 text-primary-foreground" />
          </button>
        </div>
      </div>
    </div>
  );
}
