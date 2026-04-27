import type {
  CustomerData,
  Order,
  OrderLineItem,
  OrderStatus,
  OrderTotals,
  OrderType,
  PaymentMethod,
} from "@/types";
import { uid } from "./utils";

/**
 * Factoría de pedidos. Modela el payload que `mockApi.createOrder`
 * (y mañana `POST /api/orders` → Supabase) recibirá.
 */
export interface CreateOrderInput {
  storeId: string;
  type: OrderType;
  items: OrderLineItem[];
  customer: CustomerData;
  totals: OrderTotals;
  paymentMethod: PaymentMethod;
  promoCode?: string;
}

export function buildPendingOrder(input: CreateOrderInput): Order {
  const id = `TG-${Date.now().toString(36).toUpperCase()}-${uid().toUpperCase()}`;
  return {
    id,
    storeId: input.storeId,
    type: input.type,
    status: "pending",
    items: input.items,
    customer: input.customer,
    totals: input.totals,
    paymentMethod: input.paymentMethod,
    paymentStatus: input.paymentMethod === "cash" ? "pending" : "pending",
    promoCode: input.promoCode,
    createdAt: new Date().toISOString(),
  };
}

/**
 * Estados visibles al cliente en /gracias.
 * Se mapean a porcentaje de progreso para la timeline.
 */
export const CUSTOMER_STATUS_FLOW: OrderStatus[] = [
  "accepted",
  "preparing",
  "ready",
  "out_for_delivery",
  "delivered",
];

export function getStatusLabel(status: OrderStatus, type: OrderType): string {
  switch (status) {
    case "pending": return "Pago pendiente";
    case "accepted": return "Pedido recibido";
    case "preparing": return "Cocina en marcha";
    case "ready": return type === "pickup" ? "Listo para recoger" : "Listo, esperando rider";
    case "out_for_delivery": return "En reparto";
    case "delivered": return type === "pickup" ? "Recogido" : "Entregado";
    case "cancelled": return "Cancelado";
  }
}
