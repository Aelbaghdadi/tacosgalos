import { cn } from "@/lib/utils";

/**
 * Separador de onda entre secciones.
 *
 * Se coloca DENTRO de la sección de destino y se sube con -translate-y-full,
 * pintado del color de esa misma sección. Así la onda muerde la sección de
 * arriba sin que haya que tocarla, y cada sección se sigue bastando sola.
 *
 * Requisitos en el padre: `relative` y sin `overflow-hidden`, o se recorta.
 */
export function Onda({
  color,
  className,
  invertida = false,
}: {
  /** Color del relleno. Es el color de FONDO de la sección que la contiene. */
  color: string;
  className?: string;
  /** Espeja la curva, para que dos ondas seguidas no se vean calcadas. */
  invertida?: boolean;
}) {
  return (
    <div
      aria-hidden
      className={cn(
        "absolute top-0 left-0 w-full -translate-y-full leading-[0] pointer-events-none",
        className
      )}
    >
      <svg
        viewBox="0 0 1440 90"
        preserveAspectRatio="none"
        className={cn("block w-full h-[38px] sm:h-[64px] lg:h-[90px]", invertida && "-scale-x-100")}
      >
        <path
          d="M0,90 L0,44 C180,4 340,74 560,58 C760,44 900,0 1120,18 C1270,30 1360,58 1440,52 L1440,90 Z"
          fill={color}
        />
      </svg>
    </div>
  );
}
