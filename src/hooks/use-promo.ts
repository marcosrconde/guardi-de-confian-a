import { useMemo } from "react";

function parseDate(value?: string): Date | null {
  if (!value) return null;
  const d = new Date(value);
  return isNaN(d.getTime()) ? null : d;
}

export function usePromo() {
  const name = import.meta.env.VITE_PROMO_NAME || "Preços promocionais";
  const startStr = import.meta.env.VITE_PROMO_START;
  const endStr = import.meta.env.VITE_PROMO_END;

  const { isActive, start, end } = useMemo(() => {
    const now = new Date();
    const start = parseDate(startStr) || null;
    const end = parseDate(endStr) || null;
    const afterStart = !start || now >= start;
    const beforeEnd = !end || now <= end;
    return { isActive: afterStart && beforeEnd, start, end };
  }, [startStr, endStr]);

  const endLabel = useMemo(() => {
    if (!end) return null;
    try {
      return end.toLocaleDateString("pt-BR", { timeZone: "America/Sao_Paulo" });
    } catch {
      return end.toLocaleDateString("pt-BR");
    }
  }, [end]);

  return { isActive, name, start, end, endLabel };
}
