import type {
  OrderLineItem,
  Product,
  ProductOptionGroupId,
  ProductOptionValue,
} from "@/types";
import { calcUnitPrice } from "./pricing";
import { uid } from "./utils";

/**
 * Construye una línea de carrito a partir de un producto y su selección
 * de opciones. Centraliza la lógica para que stores/checkout/api compartan
 * el mismo modelo.
 */
export function buildLineItem(
  product: Product,
  options: Partial<Record<ProductOptionGroupId, ProductOptionValue[]>> | undefined,
  qty: number
): OrderLineItem {
  const unitPrice = calcUnitPrice(product.basePrice, options);
  return {
    lineId: uid(),
    productId: product.id,
    name: product.name,
    basePrice: product.basePrice,
    qty: Math.max(1, qty),
    options,
    unitPrice,
  };
}

/** Formatea las opciones de una línea como texto plano para resúmenes. */
export function formatLineOptions(item: OrderLineItem): string {
  if (!item.options) return "";
  return Object.values(item.options)
    .flat()
    .filter(Boolean)
    .map((v) => v!.label)
    .join(" · ");
}
