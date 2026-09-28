import type { OrderLineItem, OrderTotals, OrderType, Promo } from "@/types";

/**
 * Tarifas mockeadas. En producción vendrán por local desde Supabase
 * (campo `delivery_fee` por zona o por tramo de distancia).
 */
const FLAT_DELIVERY_FEE = 1.99;
const FREE_DELIVERY_THRESHOLD = 25;

/** Calcula el precio unitario de una línea sumando deltas de opciones. */
export function calcUnitPrice(
  basePrice: number,
  options: OrderLineItem["options"]
): number {
  if (!options) return basePrice;
  const sumDeltas = Object.values(options)
    .flat()
    .filter(Boolean)
    .reduce((acc, v) => acc + (v?.delta ?? 0), 0);
  return basePrice + sumDeltas;
}

/** Subtotal del carrito (líneas × cantidades). */
export function calcSubtotal(items: OrderLineItem[]): number {
  return items.reduce((acc, l) => acc + l.unitPrice * l.qty, 0);
}

/**
 * Calcula descuento de una promo aplicada al subtotal.
 * Tipos soportados: percent / fixed. info / free_item se manejan aparte.
 */
export function calcDiscount(subtotal: number, promo: Promo | null): number {
  if (!promo || !promo.active) return 0;
  if (promo.minOrder && subtotal < promo.minOrder) return 0;
  if (promo.type === "percent" && promo.percent) {
    return +(subtotal * (promo.percent / 100)).toFixed(2);
  }
  // Ojo: antes era `&& promo.amount`, y 0 es falsy. Una promo "fixed" con
  // amount 0 se daba por aplicada y descontaba 0 € en silencio.
  if (promo.type === "fixed" && typeof promo.amount === "number" && promo.amount > 0) {
    return Math.min(subtotal, promo.amount);
  }
  return 0;
}

/** Tarifa de delivery según subtotal. Gratis a partir de umbral. */
export function calcDeliveryFee(subtotal: number, type: OrderType): number {
  if (type !== "delivery") return 0;
  if (subtotal >= FREE_DELIVERY_THRESHOLD) return 0;
  return FLAT_DELIVERY_FEE;
}

/** Genera el bloque de totales completo. */
export function calcTotals(
  items: OrderLineItem[],
  type: OrderType,
  promo: Promo | null
): OrderTotals {
  const subtotal = +calcSubtotal(items).toFixed(2);
  const discount = calcDiscount(subtotal, promo);
  // El umbral de envío gratis se mide sobre el subtotal SIN descontar.
  // Antes se medía sobre el subtotal ya rebajado, así que en un carrito de
  // 26 € aplicar el -10% resucitaba los 1,99 € de envío y el descuento
  // efectivo se quedaba en 0,61 €. La franja 25-27,77 € es justo el ticket
  // de dos personas, y delivery es el modo por defecto del carrito.
  const deliveryFee = calcDeliveryFee(subtotal, type);
  const total = +(subtotal - discount + deliveryFee).toFixed(2);
  return { subtotal, discount, deliveryFee, total };
}
