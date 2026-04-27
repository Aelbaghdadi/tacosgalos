import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { StickerTitle } from "./StickerTitle";

interface Props {
  eyebrow?: string;
  eyebrowVariant?: "light" | "dark";
  title: ReactNode;
  subtitle?: string;
  align?: "center" | "left";
  inverted?: boolean; // sobre fondo oscuro
  className?: string;
}

export function SectionHeading({
  eyebrow,
  eyebrowVariant = "light",
  title,
  subtitle,
  align = "center",
  inverted = false,
  className,
}: Props) {
  return (
    <header
      className={cn(
        "max-w-3xl mb-12",
        align === "center" ? "mx-auto text-center" : "mr-auto text-left",
        className
      )}
    >
      {eyebrow && (
        <span
          className={cn(
            "inline-block font-black uppercase tracking-wider text-[11px] px-3.5 py-1.5 rounded-full mb-4",
            "shadow-[0_4px_0_rgba(0,0,0,0.15)]",
            eyebrowVariant === "dark" ? "bg-galos-black text-white" : "bg-white text-galos-red"
          )}
        >
          {eyebrow}
        </span>
      )}
      <StickerTitle className={cn(inverted && "text-white")}>{title}</StickerTitle>
      {subtitle && (
        <p
          className={cn(
            "mt-3 text-base sm:text-lg font-semibold",
            inverted ? "text-red-100" : "text-neutral-600"
          )}
        >
          {subtitle}
        </p>
      )}
    </header>
  );
}
