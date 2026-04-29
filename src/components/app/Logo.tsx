import mark from "@/assets/jusmulher-mark.png";
import full from "@/assets/jusmulher-full.png";
import { cn } from "@/lib/utils";

export function LogoMark({ className }: { className?: string }) {
  return (
    <img
      src={mark}
      alt="JusMulher"
      className={cn("h-10 w-10 object-contain", className)}
      width={380}
      height={380}
    />
  );
}

export function LogoLockup({
  className,
  size = "md",
}: {
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  const sizes = { sm: "h-12", md: "h-16", lg: "h-28" };
  return (
    <img
      src={full}
      alt="JusMulher — Desvende a vida pregressa do seu parceiro"
      className={cn(sizes[size], "w-auto object-contain", className)}
      width={900}
      height={650}
    />
  );
}

export function LogoInline({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <LogoMark className="h-9 w-9" />
      <span className="font-display text-xl font-semibold tracking-tight">
        <span className="text-primary">Jus</span>
        <span className="text-rose">Mulher</span>
      </span>
    </div>
  );
}
