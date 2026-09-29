"use client";

import { useEffect, useRef } from "react";
import { motion, useMotionValue, useTransform, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

/**
 * Frase de marca enorme cruzando por DETRÁS del contenido.
 *
 * Es texto real: un <span> con la frase, repetida las veces justas para que la
 * cinta no se quede corta al desplazarse. Va `aria-hidden` porque repite algo
 * que ya dice el subtítulo de la sección — quien use lector de pantalla no
 * necesita oírlo tres veces.
 *
 * Se usa UNA vez en toda la página. Es el plano de fondo de su sección: se
 * mueve bastante más que las tarjetas, y esa diferencia de velocidad es la
 * profundidad. Con `prefers-reduced-motion` se queda quieta y centrada.
 */
export function FraseCinetica({
  texto,
  className,
  /** Cuánto recorre, en % de su propio ancho, mientras cruza la ventana. */
  recorrido = 26,
}: {
  texto: string;
  className?: string;
  recorrido?: number;
}) {
  const quieto = !!useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const progreso = useMotionValue(0.5);

  useEffect(() => {
    if (quieto) return;
    let pendiente = 0;
    const medir = () => {
      pendiente = 0;
      const nodo = ref.current;
      const seccion = nodo?.closest("section");
      if (!seccion) return;
      const r = seccion.getBoundingClientRect();
      /* 0 = la sección asoma por abajo · 1 = acaba de salir por arriba. */
      const total = window.innerHeight + r.height;
      progreso.set(Math.min(1, Math.max(0, (window.innerHeight - r.top) / total)));
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

  const x = useTransform(progreso, [0, 1], [`${recorrido}%`, `${-recorrido}%`]);

  return (
    <div
      ref={ref}
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 z-0 overflow-hidden",
        className
      )}
    >
      <motion.div
        className="flex gap-[0.35em] w-max will-change-transform"
        style={quieto ? undefined : { x }}
      >
        {/* Tres copias: con una sola, al desplazarse dejaría hueco en un lado. */}
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="font-anton uppercase leading-none tracking-tight whitespace-nowrap
                       text-[22vw] lg:text-[16vw] text-white/[0.07] select-none"
          >
            {texto}
          </span>
        ))}
      </motion.div>
    </div>
  );
}
