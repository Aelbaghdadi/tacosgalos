import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Card base de Tacos Galos: borde negro grueso + sombra hard + radius galos.
 * Es el átomo visual que se repite por toda la web.
 */
export function Card({
  children,
  className,
  hover = true,
}: {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}) {
  return (
    <div
      className={cn(
        "bg-white border-[3px] border-galos-black rounded-galos shadow-hard",
        hover && "transition-transform hover:-translate-y-1.5",
        className
      )}
    >
      {children}
    </div>
  );
}
