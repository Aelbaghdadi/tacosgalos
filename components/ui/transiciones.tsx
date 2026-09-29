"use client";

import { useEffect, useRef } from "react";
import { motion, useMotionValue, useTransform, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

/**
 * Los lenguajes de transición entre secciones.
 *
 * Son TRES y no uno por sección, que es lo que convierte una web en un muestrario:
 *
 *   Onda      — curva blanda. Para entrar en las secciones cálidas (cremas).
 *               Vive en `components/ui/Onda.tsx` desde antes; se reutiliza.
 *   Diagonal  — corte en ángulo. Para los saltos de color fuertes, donde el
 *               contraste ya es un acontecimiento y la curva lo suavizaría de más.
 *   Puente    — un elemento que empieza en una sección y acaba en la siguiente.
 *               Se usa UNA vez en toda la página; si se repite deja de ser un
 *               hallazgo y pasa a ser un tic.
 *
 * Las tres se montan DENTRO de la sección de destino, pintadas de su color, y se
 * suben con `-translate-y-full`. Así muerden la sección de arriba sin que haya que
 * tocarla y cada sección se sigue bastando sola.
 *
 * Requisitos en el padre: `relative` y sin `overflow-hidden`, o se recorta.
 */

/**
 * Corte diagonal. Sube de izquierda a derecha; `invertida` lo espeja para que
 * dos diagonales seguidas no se lean como un patrón.
 */
export function Diagonal({
  color,
  className,
  invertida = false,
}: {
  /** Color de FONDO de la sección que la contiene. */
  color: string;
  className?: string;
  invertida?: boolean;
}) {
  return (
    <div
      aria-hidden
      className={cn(
        /* `top-[1px]` en lugar de `top-0`: solapa un píxel con la sección de
           arriba y evita la línea de fondo que deja el redondeo subpíxel. */
        "absolute top-[1px] left-0 w-full -translate-y-full leading-[0] pointer-events-none",
        className
      )}
    >
      <svg
        viewBox="0 0 1440 80"
        preserveAspectRatio="none"
        className={cn(
          "block w-full h-[30px] sm:h-[52px] lg:h-[76px]",
          invertida && "-scale-x-100"
        )}
      >
        <path d="M0,80 L1440,0 L1440,80 Z" fill={color} />
      </svg>
    </div>
  );
}

/**
 * Elemento que cruza la costura entre dos secciones.
 *
 * Se monta en la sección de ABAJO —que al ir después en el DOM pinta por encima
 * de la de arriba— y arranca desplazado hacia fuera, así que al principio se ve
 * sobre la sección anterior. Según la costura sube por la ventana, baja hasta
 * quedarse dentro de la nueva. No es el mismo nodo en las dos secciones, pero
 * cruza de una a otra a la vista, que es lo que se quería.
 */
export function Puente({
  children,
  className,
  /** Cuánto de su propia altura asoma hacia arriba al empezar. */
  desde = -78,
  /** Dónde acaba, en % de su altura, ya dentro de la sección de destino. */
  hasta = 14,
  giro = 0,
}: {
  children: React.ReactNode;
  className?: string;
  desde?: number;
  hasta?: number;
  giro?: number;
}) {
  const quieto = !!useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const progreso = useMotionValue(0);

  useEffect(() => {
    if (quieto) return;
    let pendiente = 0;
    const medir = () => {
      pendiente = 0;
      const nodo = ref.current;
      if (!nodo) return;
      /*
        El progreso se mide contra la COSTURA (el borde superior de la sección
        de destino), no contra el elemento: el elemento se mueve, así que usarlo
        como referencia sería una pescadilla que se muerde la cola.
      */
      const seccion = nodo.closest("section") ?? nodo.parentElement;
      if (!seccion) return;
      const costura = seccion.getBoundingClientRect().top;
      const vh = window.innerHeight;
      /* De "la costura entra por abajo" a "la costura llega al 35% de alto". */
      const avance = (vh - costura) / (vh * 0.65);
      progreso.set(Math.min(1, Math.max(0, avance)));
    };
    const alScroll = () => {
      if (!pendiente) pendiente = requestAnimationFrame(medir);
    };
    medir();
    window.addEventListener("scroll", alScroll, { passive: true });
    window.addEventListener("resize", alScroll);
    return () => {
      if (pendiente) cancelAnimationFrame(pendiente);
      window.removeEventListener("scroll", alScroll);
      window.removeEventListener("resize", alScroll);
    };
  }, [progreso, quieto]);

  const y = useTransform(progreso, [0, 1], [`${desde}%`, `${hasta}%`]);
  const rotate = useTransform(progreso, [0, 1], [giro - 12, giro]);

  return (
    <div
      ref={ref}
      aria-hidden
      className={cn("pointer-events-none absolute top-0 z-20", className)}
    >
      <motion.div style={quieto ? { y: `${hasta}%`, rotate: giro } : { y, rotate }}>
        {children}
      </motion.div>
    </div>
  );
}
