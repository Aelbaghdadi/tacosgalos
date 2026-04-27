import type { ProductOptionValue, ProductOptionGroupId } from "./product";

export type OrderType = "delivery" | "pickup";

/**
 * Estados estándar de un pedido. Coinciden 1:1 con la futura
 * tabla `orders.status` en Supabase y con los webhooks de cocina/KDS.
 */
export type OrderStatus =
  | "pending"      // Creado en el front, sin pagar
  | "accepted"     // Pago confirmado, esperando aceptación de cocina
  | "preparing"    // Cocina lo está preparando
  | "ready"        // Listo para recoger / handoff a rider
  | "out_for_delivery"
  | "delivered"
  | "cancelled";

export type PaymentMethod = "card" | "bizum" | "cash";
export type PaymentStatus = "pending" | "paid" | "refunded" | "failed";

/** Una línea del carrito o del pedido. */
export interface OrderLineItem {
  lineId: string;
  productId: string;
  name: string;
  basePrice: number;
  qty: number;
  /** Selección de opciones organizadas por grupo. */
  options?: Partial<Record<ProductOptionGroupId, ProductOptionValue[]>>;
  /** Snapshot del precio unitario con opciones (para no recalcular). */
  unitPrice: number;
}

export interface OrderTotals {
  subtotal: number;
  discount: number;
  deliveryFee: number;
  total: number;
}

export interface CustomerData {
  name: string;
  phone: string;
  email?: string;
  address?: string;
  city?: string;
  notes?: string;
}

export interface Order {
  id: string;
  storeId: string;
  type: OrderType;
  status: OrderStatus;
  items: OrderLineItem[];
  customer: CustomerData;
  totals: OrderTotals;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  promoCode?: string;
  createdAt: string;
  estimatedReadyAt?: string;
}
