import type { Promo } from "@/types";

/**
 * Promociones del canal directo. La clave del negocio: las apps de delivery
 * jamás tendrán estos códigos. Esto es lo que hace que el cliente vuelva a la web.
 */
export const PROMOS: Promo[] = [
  {
    id: "first10",
    title: "-10% PRIMER PEDIDO",
    description: "Tu primer pedido en la web oficial con un -10% automático. Sin código.",
    variant: "dark",
    type: "percent",
    code: "GALOS10",
    percent: 10,
    channel: "web",
    active: true,
    cta: "Empezar pedido",
  },
  {
    id: "tacos1e",
    title: "TACOS A 1€",
    description: "Cada jueves, taco M Clásico a 1€ con cualquier menú. Solo web.",
    variant: "red",
    type: "fixed",
    code: "JUEVES1",
    amount: 0,
    channel: "web",
    active: true,
    countdownLabel: "Hasta jueves 23:59",
    cta: "Activar oferta",
    minOrder: 6.90,
  },
  {
    id: "menuloco",
    title: "MENÚ LOCO 9,90€",
    description: "Burger Pollo Tasty con cheddar, salsa Tasty, patatas y bebida. Por 9,90€.",
    variant: "gold",
    type: "info",
    code: "LOCO990",
    channel: "all",
    active: true,
    cta: "Pedirlo ya",
  },
  {
    id: "club",
    title: "GALOS CLUB",
    description: "Acumula puntos y desbloquea un Galos gratis cada 8 pedidos. Solo en web.",
    variant: "red",
    type: "info",
    channel: "web",
    active: true,
    cta: "Cómo funciona",
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
  },
  {
    id: "opening",
    title: "PROMO APERTURA",
    description: "¿Abrimos cerca de ti? Sigue Instagram para promos exclusivas de apertura.",
    variant: "gold",
    type: "info",
    channel: "all",
    active: true,
    cta: "Ver locales",
  },
];

export const getActivePromos = () => PROMOS.filter((p) => p.active);
