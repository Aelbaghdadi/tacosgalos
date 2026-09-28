/**
 * Iconos de marca — SVG inline, sin librería.
 *
 * Sustituyen a los emojis (⚡ 🎁 🏆 💸) que había en DirectOrderSection. Un
 * emoji se dibuja distinto en cada sistema operativo, no hereda el color del
 * texto y no se puede alinear con precisión: tres motivos por los que delata
 * un montaje rápido.
 *
 * Trazo de 2.2 con remates redondos, a juego con los `border-[3px]` y la
 * sombra dura del resto de la web. Usan `currentColor`, así que el color lo
 * pone la clase de Tailwind del contenedor.
 *
 * Inline a propósito: no son una petición de red, son ~400 bytes de HTML.
 */

type Props = { className?: string };

const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2.2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
  focusable: false,
};

/** Velocidad — recogida en 8 min. */
export function IconoRayo({ className }: Props) {
  return (
    <svg {...base} className={className}>
      <path d="M13 2 4.5 13.2a.6.6 0 0 0 .5 1H10l-1 7.8 8.5-11.2a.6.6 0 0 0-.5-1H12l1-7.8Z" />
    </svg>
  );
}

/** Descuento — -10% en el primer pedido. */
export function IconoEtiqueta({ className }: Props) {
  return (
    <svg {...base} className={className}>
      <path d="M3 11.2V5a2 2 0 0 1 2-2h6.2a2 2 0 0 1 1.4.6l8 8a2 2 0 0 1 0 2.8l-6.2 6.2a2 2 0 0 1-2.8 0l-8-8a2 2 0 0 1-.6-1.4Z" />
      <circle cx="7.6" cy="7.6" r="1.5" />
    </svg>
  );
}

/** Fidelidad — Galos Club. */
export function IconoMedalla({ className }: Props) {
  return (
    <svg {...base} className={className}>
      <circle cx="12" cy="9" r="6" />
      <path d="M8.6 14.2 6.6 21.6 12 19.1l5.4 2.5-2-7.4" />
    </svg>
  );
}

/** Canal directo — sin intermediarios. */
export function IconoDirecto({ className }: Props) {
  return (
    <svg {...base} className={className}>
      <circle cx="4.2" cy="12" r="2.2" fill="currentColor" stroke="none" />
      <path d="M8 12h9" />
      <path d="m14 8 4 4-4 4" />
    </svg>
  );
}
