import type { Promo } from "@/types";

/**
 * Promociones del canal directo.
 *
 * ⚠️ DOS TRAMPAS CORREGIDAS AQUÍ:
 *
 * 1) "TACOS A 1€" era type:"fixed" con amount:0. En lib/pricing.ts la
 *    comprobación era `promo.type === "fixed" && promo.amount`, y 0 es
 *    falsy, así que descontaba 0 € mientras la web decía "✔ cupón listo".
 *    Es una oferta de local los jueves, no un descuento de carrito: pasa a
 *    ser informativa y se le quita el código.
 *
 * 2) "MENÚ LOCO" era type:"info" PERO llevaba código. mockApi.validateCoupon
 *    solo mira `active && code`, así que el cupón "se aplicaba" con éxito y
 *    descontaba 0 €. Peor aún: setPromo sobrescribía el GALOS10 que sí
 *    funcionaba, así que pulsarlo te quitaba tu descuento real.
 *
 * ⚠️ GALOS CLUB: la mecánica "un Galos gratis cada 8 pedidos" es un
 * compromiso con coste por pedido que la marca NO ha aprobado, y detrás no
 * hay ni auth ni tabla de puntos. Se deja como intención, sin ratio.
 */
export const PROMOS: Promo[] = [
  {
    id: "first10",
    title: "-10% PRIMER PEDIDO",
    description: "Tu primer pedido en la web oficial con un -10%. Actívalo aquí.",
    variant: "dark",
    type: "percent",
    code: "GALOS10",
    percent: 10,
    channel: "web",
    active: true,
    cta: "Activar -10%",
    ctaHref: "/carta",
  },
  {
    id: "tacos1e",
    title: "TACOS A 1€",
    description: "Cada jueves, taco M Clásico a 1€ con cualquier menú. En local.",
    variant: "red",
    type: "info",
    channel: "in_store",
    active: true,
    countdownLabel: "Todos los jueves",
    cta: "Ver la carta",
    ctaHref: "/carta",
  },
  {
    id: "menuloco",
    title: "MENÚ LOCO 9,90€",
    description: "Burger Pollo Tasty con cheddar, salsa Tasty, patatas y bebida. Por 9,90€.",
    variant: "gold",
    type: "info",
    channel: "all",
    active: true,
    cta: "Pedirlo ya",
    ctaHref: "/carta",
  },
  {
    id: "club",
    title: "GALOS CLUB",
    description: "Promos exclusivas para quien pide directo en la web. Muy pronto.",
    variant: "red",
    type: "info",
    channel: "web",
    active: true,
    cta: "Cómo funciona",
    ctaHref: "/#directo",
  },
  {
    id: "pickup8",
    title: "RECOGIDA EN 8 MIN",
    description: "Pides aquí, lo tienes calentito en 8 min. Sin colas. Sin comisiones.",
    variant: "dark",
    type: "info",
    channel: "direct",
    active: true,
    cta: "Pedir para recoger",
    ctaHref: "/carta",
  },
  {
    id: "opening",
    title: "PROMO APERTURA",
    description: "¿Abrimos cerca de ti? Mira dónde estamos y dónde llegamos.",
    variant: "gold",
    type: "info",
    channel: "all",
    active: true,
    cta: "Ver locales",
    ctaHref: "/locales",
  },
];

export const getActivePromos = () => PROMOS.filter((p) => p.active);
