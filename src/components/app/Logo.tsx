import logo from "@/assets/jusmulher-logo.png";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  showTagline?: boolean;
  size?: "sm" | "md" | "lg";
}

const sizes = {
  sm: "h-9",
  md: "h-12",
  lg: "h-20",
};

export function Logo({ className, showTagline = false, size = "sm" }: LogoProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <img
        src={logo}
        alt="JusMulher"
        className={cn(sizes[size], "w-auto object-contain")}
        width={1408}
        height={768}
      />
      {showTagline && (
        <span className="sr-only">JusMulher — Desvende a vida pregressa do seu parceiro</span>
      )}
    </div>
  );
}

export function LogoMark({ className }: { className?: string }) {
  return (
    <img
      src={logo}
      alt="JusMulher"
      className={cn("h-9 w-9 rounded-full object-cover object-center", className)}
      style={{ objectPosition: "center 30%" }}
      width={1408}
      height={768}
    />
  );
}
