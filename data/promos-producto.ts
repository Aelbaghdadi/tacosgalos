/**
 * Creatividades promocionales reconstruidas (grupo C).
 *
 * Las 10 piezas originales eran imágenes de 320×320 con el titular HORNEADO
 * dentro: texto borroso, imposible de traducir, invisible para el buscador y
 * en una tipografía de grafiti que no es la de la web.
 *
 * Aquí solo vive lo que cambia de una pieza a otra. El diseño está en
 * components/promo/PromoCard.tsx y no se repite diez veces.
 *
 * La clave es el `id` del producto en data/products.ts. Un producto sin
 * entrada aquí sigue mostrando su `imageUrl` de siempre — así conviven las 10
 * reconstruidas con `taco_el_infierno` y `sides_el_wrapito`, que no se tocan.
 */

export type VariantePromo = "pizarra" | "estallido";

export type PromoProducto = {
  variante: VariantePromo;
  /**
   * Anulacion del titular. Por defecto se usa el NOMBRE del producto, que es
   * la unica fuente de verdad: la tarjeta ya lo imprime debajo en un <h3>, y
   * dos grafias del mismo producto en la misma tarjeta cantan. Las
   * creatividades originales decian "El Tartiflete" y "El Vegano" mientras
   * data/products.ts dice "El Tartiflette" y "El Vegan"; gana el producto.
   */
  titulo?: string;
  /** Recorte del producto con alfa. Lo único que es imagen. */
  asset: string;
  /** Solo en "estallido": el par de colores de los rayos, medido del original. */
  rayoA?: string;
  rayoB?: string;
};

export const PROMOS_PRODUCTO: Record<string, PromoProducto> = {
  // ── Pizarra · fondo de ladrillo oscuro, titular rojo ──────────────
  p_crispy: {
    variante: "pizarra",
    asset: "/promo/taco-crispy.webp",
  },
  p_delicioso: {
    variante: "pizarra",
    asset: "/promo/taco-delicioso.webp",
  },
  p_oriental: {
    variante: "pizarra",
    asset: "/promo/taco-oriental.webp",
  },
  p_seductor: {
    variante: "pizarra",
    asset: "/promo/taco-seductor.webp",
  },
  p_tartiflette: {
    variante: "pizarra",
    asset: "/promo/taco-tartiflette.webp",
  },
  p_vegan: {
    variante: "pizarra",
    asset: "/promo/taco-vegan.webp",
  },

  // ── Estallido · rayos de cómic, un par de colores por producto ────
  // Los colores salen de muestrear los originales, no de inventarlos.
  p_bowl_gourmet: {
    variante: "estallido",
    asset: "/promo/bowl-gourmet.webp",
    rayoA: "#D8A860",
    rayoB: "#C09060",
  },
  p_bowl_spicy: {
    variante: "estallido",
    asset: "/promo/bowl-spicy.webp",
    rayoA: "#F06060",
    rayoB: "#D84848",
  },
  p_bowl_veggie: {
    variante: "estallido",
    asset: "/promo/bowl-veggie.webp",
    rayoA: "#60D860",
    rayoB: "#60D878",
  },
  p_bowl_zidane: {
    variante: "estallido",
    asset: "/promo/bowl-zidane.webp",
    rayoA: "#48A8C0",
    rayoB: "#187890",
  },
};

export function promoDe(productId: string): PromoProducto | undefined {
  return PROMOS_PRODUCTO[productId];
}
