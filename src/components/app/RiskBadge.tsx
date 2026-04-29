import { cn } from "@/lib/utils";
import { RiskLevel } from "@/store/app-store";
import { ShieldCheck, ShieldAlert, AlertTriangle } from "lucide-react";

const map = {
  baixo: {
    label: "Risco baixo",
    icon: ShieldCheck,
    classes: "bg-success/10 text-success border-success/30",
  },
  medio: {
    label: "Atenção",
    icon: ShieldAlert,
    classes: "bg-warning/10 text-warning border-warning/30",
  },
  alto: {
    label: "Cuidado",
    icon: AlertTriangle,
    classes: "bg-destructive/10 text-destructive border-destructive/30",
  },
} as const;

export function RiskBadge({ level, className }: { level: RiskLevel; className?: string }) {
  const cfg = map[level];
  const Icon = cfg.icon;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold",
        cfg.classes,
        className
      )}
    >
      <Icon className="h-3.5 w-3.5" />
      {cfg.label}
    </span>
  );
}
