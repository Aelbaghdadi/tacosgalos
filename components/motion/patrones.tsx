"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import type { ReactNode } from "react";

/**
 * Los CUATRO patrones de entrada de toda la web.
 *
 * La regla: no hay una animación por componente. Hay cuatro, y cada sección
 * elige la que le toca. Así el ritmo es reconocible en lugar de ruidoso.
 *
 *   sube     — lo normal. Sube unos píxeles y aparece.
 *   cortina  — se descubre de abajo arriba con clip-path. Para titulares.
 *   escala   — entra desde un poco más pequeño. Para tarjetas e imágenes.
 *   ladea    — entra con un grado y medio de giro. Para pegatinas y sellos.
 *
 * Todo se anima con transform y opacity, nunca con width/height, y todo
 * respeta `prefers-reduced-motion`: con movimiento reducido el contenido
 * aparece sin más, no desaparece.
 */

export type Patron = "sube" | "cortina" | "escala" | "ladea";

/* ────────────────────────────────────────────────────────────────────
   LAS CUATRO CLASES DE MOVIMIENTO

   Había trece muelles distintos repartidos por los componentes, casi todos
   entre 420 y 500 de rigidez con amortiguaciones puestas a ojo. Eso no es un
   sistema: es el mismo muelle con ruido. Y cuando todo rebota parecido, nada
   destaca.

   A partir de aquí solo hay cuatro clases, y cada animación declara a cuál
   pertenece:

     ENTRADA   — algo aparece. Llega con autoridad y se para; casi no rebota.
     SUAVE     — algo cambia de estado. Sin muelle, por duración: los cambios
                 de estado no deben tener personalidad, deben ser rápidos.
     MICRO     — respuesta al dedo o al cursor. Rígido y corto: por debajo de
                 120 ms se lee como "responde", no como "se anima".
     AMBIENTE  — movimiento continuo de fondo. Blando y lento, nunca se para.

   Y una quinta, deliberadamente aparte:

     REBOTE    — el único rebote de verdad de toda la web. Se usa UNA vez, en
                 el contador del carrito, porque ahí el rebote no es adorno:
                 es el acuse de recibo de que el producto entró.
   ──────────────────────────────────────────────────────────────────── */
export const ENTRADA = { type: "spring" as const, stiffness: 420, damping: 34, mass: 0.7 };
export const SUAVE = { duration: 0.42, ease: [0.22, 0.8, 0.3, 1] as const };
export const MICRO = { type: "spring" as const, stiffness: 520, damping: 30, mass: 0.5 };
export const AMBIENTE = { type: "spring" as const, stiffness: 46, damping: 18, mass: 0.7 };
export const REBOTE = { type: "spring" as const, stiffness: 620, damping: 16 };

const MUELLE = ENTRADA;

const VARIANTES: Record<Patron, Variants> = {
  sube: {
    oculto: { opacity: 0, y: 22 },
    visible: { opacity: 1, y: 0, transition: SUAVE },
  },
  cortina: {
    oculto: { opacity: 0, y: 14, clipPath: "inset(0 0 100% 0)" },
    visible: {
      opacity: 1,
      y: 0,
      clipPath: "inset(0 0 -10% 0)",
      transition: { ...SUAVE, duration: 0.55 },
    },
  },
  escala: {
    oculto: { opacity: 0, scale: 0.94, y: 12 },
    visible: { opacity: 1, scale: 1, y: 0, transition: MUELLE },
  },
  ladea: {
    oculto: { opacity: 0, scale: 0.8, rotate: -6 },
    visible: { opacity: 1, scale: 1, rotate: 0, transition: MUELLE },
  },
};

/** Estados neutros para movimiento reducido: nada se mueve, todo se ve. */
const QUIETO: Variants = { oculto: { opacity: 1 }, visible: { opacity: 1 } };

export function Revela({
  children,
  patron = "sube",
  retraso = 0,
  className,
  as = "div",
}: {
  children: ReactNode;
  patron?: Patron;
  retraso?: number;
  className?: string;
  as?: "div" | "span" | "li" | "section";
}) {
  const quieto = useReducedMotion();
  const Etiqueta = motion[as];
  return (
    <Etiqueta
      className={className}
      variants={quieto ? QUIETO : VARIANTES[patron]}
      initial="oculto"
      whileInView="visible"
      viewport={{ once: true, margin: "-12% 0px -8% 0px" }}
      transition={{ delay: quieto ? 0 : retraso }}
    >
      {children}
    </Etiqueta>
  );
}

/**
 * Contenedor que escalona a sus hijos. Los hijos deben ser <Hijo> (o
 * cualquier motion.* que declare las variantes `oculto`/`visible`), porque
 * el escalonado se propaga por el árbol de variantes, no por retardos
 * calculados a mano.
 */
export function Escalonado({
  children,
  paso = 0.07,
  retraso = 0,
  className,
  as = "div",
}: {
  children: ReactNode;
  paso?: number;
  retraso?: number;
  className?: string;
  as?: "div" | "ul" | "section";
}) {
  const quieto = useReducedMotion();
  const Etiqueta = motion[as];
  return (
    <Etiqueta
      className={className}
      initial="oculto"
      whileInView="visible"
      viewport={{ once: true, margin: "-12% 0px -8% 0px" }}
      variants={{
        visible: {
          transition: quieto
            ? {}
            : { staggerChildren: paso, delayChildren: retraso },
        },
      }}
    >
      {children}
    </Etiqueta>
  );
}

export function Hijo({
  children,
  patron = "sube",
  className,
  as = "div",
}: {
  children: ReactNode;
  patron?: Patron;
  className?: string;
  as?: "div" | "span" | "li" | "article";
}) {
  const quieto = useReducedMotion();
  const Etiqueta = motion[as];
  return (
    <Etiqueta className={className} variants={quieto ? QUIETO : VARIANTES[patron]}>
      {children}
    </Etiqueta>
  );
}
