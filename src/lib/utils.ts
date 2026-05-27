import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCPF(cpf: string | null | undefined): string {
  if (!cpf) return "";
  const cleaned = cpf.replace(/\D/g, "");
  if (cleaned.length !== 11) return cpf;
  return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
}

export function maskMotherName(name: string | null | undefined): string {
  if (!name) return "";
  const names = name.split(" ");
  if (names.length > 1) {
    return names[0] + " " + names.slice(1).map(n => n[0]).join(". ").toUpperCase() + ".";
  }
  return name;
}
