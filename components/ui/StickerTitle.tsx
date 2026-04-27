import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Título tipo sticker — la firma tipográfica de la marca.
 * Replica el efecto "ENCUÉNTRANOS EN GLÒRIES" / "MARINA" de las stories oficiales:
 * texto rojo con outline blanco grueso + sombra dura.
 *
 * El highlight (`<Hl>`) se usa para resaltar palabras dentro del título.
 */
export function StickerTitle({
  children,
  className,
  as: Tag = "h2",
}: {
  children: ReactNode;
  className?: string;
  as?: "h1" | "h2" | "h3";
}) {
  return (
    <Tag
      className={cn(
        "font-anton uppercase tracking-wide leading-[0.95]",
        Tag === "h1" ? "text-5xl sm:text-7xl lg:text-8xl" : "text-3xl sm:text-5xl lg:text-6xl",
        className
      )}
    >
      {children}
    </Tag>
  );
}

export function Hl({
  children,
  variant = "light",
}: {
  children: ReactNode;
  variant?: "light" | "dark";
}) {
  // El estilo sticker se aplica por clase utilitaria global (definida en globals.css)
  // porque combina text-stroke + multi-shadow que no son trivialmente Tailwind.
  return (
    <span className={cn("tg-sticker", variant === "dark" && "tg-sticker--dark")}>
      {children}
    </span>
  );
}
