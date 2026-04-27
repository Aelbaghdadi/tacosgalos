/**
 * ============================================================
 *  CAPA DE DATOS — MOCK API
 * ============================================================
 *
 *  Esta es la frontera entre la app y el backend.
 *  HOY: lee de los arrays en /data y simula latencia.
 *  MAÑANA: cada función se sustituye por una llamada a Supabase
 *  (o PocketBase) sin cambiar nada en componentes/stores.
 *
 *  Plan de migración:
 *
 *    import { createClient } from "@supabase/supabase-js";
 *    const supabase = createClient(URL, ANON_KEY);
 *
 *    export const api = {
 *      getProducts: () => supabase.from("products").select("*").then(...)
 *      ...
 *    };
 *
 *  Las firmas de función son las que usará el adapter real.
 * ============================================================
 */
import { CATEGORIES, PRODUCTS } from "@/data/products";
import { STORES } from "@/data/stores";
import { PROMOS } from "@/data/promos";
import { REVIEWS } from "@/data/reviews";
import { FAQS } from "@/data/faqs";
import { OPTION_GROUPS } from "@/data/options";
import { sleep } from "./utils";
import { buildPendingOrder, type CreateOrderInput } from "./order";
import type { Order, Promo, Store } from "@/types";

const LATENCY = 200; // ms — simula red

export const api = {
  // ==================== CATALOG ====================
  async getCategories() {
    await sleep(LATENCY);
    return CATEGORIES;
  },
  async getProducts() {
    await sleep(LATENCY);
    return PRODUCTS;
  },
  async getProductBySlug(slug: string) {
    await sleep(LATENCY);
    return PRODUCTS.find((p) => p.slug === slug) ?? null;
  },
  async getOptionGroups() {
    await sleep(LATENCY);
    return OPTION_GROUPS;
  },

  // ==================== STORES ====================
  async getStores(): Promise<Store[]> {
    await sleep(LATENCY);
    return STORES;
  },
  async getStoreBySlug(slug: string): Promise<Store | null> {
    await sleep(LATENCY);
    return STORES.find((s) => s.slug === slug) ?? null;
  },
  /** Stub geolocalización: devuelve los más cercanos al usuario. */
  async getNearestStores(_lat: number, _lng: number) {
    await sleep(LATENCY);
    return STORES.slice(0, 3);
  },

  // ==================== PROMOS / COUPONS ====================
  async getPromos() {
    await sleep(LATENCY);
    return PROMOS.filter((p) => p.active);
  },
  /**
   * Validar cupón. En producción → POST /api/coupons/validate
   * para evitar manipulación cliente.
   */
  async validateCoupon(code: string): Promise<Promo | null> {
    await sleep(LATENCY);
    return PROMOS.find((p) => p.active && p.code?.toUpperCase() === code.toUpperCase()) ?? null;
  },

  // ==================== REVIEWS / FAQS ====================
  async getReviews() {
    await sleep(LATENCY);
    return REVIEWS;
  },
  async getFaqs() {
    await sleep(LATENCY);
    return FAQS;
  },

  // ==================== ORDERS ====================
  /**
   * Crea un pedido en estado `pending`.
   * En producción:
   *   1. POST /api/orders (Supabase función edge / RLS).
   *   2. Devuelve order.id.
   *   3. Cliente lanza Stripe/Redsys con order.id.
   *   4. Webhook de pago → orders.payment_status = 'paid' → status='accepted'.
   *   5. KDS recibe via Realtime/WebSocket.
   */
  async createOrder(input: CreateOrderInput): Promise<Order> {
    await sleep(LATENCY);
    const order = buildPendingOrder(input);
    // Persistir en localStorage para mock /panel y /gracias
    if (typeof window !== "undefined") {
      const list = JSON.parse(localStorage.getItem("tg:orders") ?? "[]");
      list.push(order);
      localStorage.setItem("tg:orders", JSON.stringify(list));
    }
    return order;
  },
  async getOrder(id: string): Promise<Order | null> {
    await sleep(LATENCY);
    if (typeof window === "undefined") return null;
    const list: Order[] = JSON.parse(localStorage.getItem("tg:orders") ?? "[]");
    return list.find((o) => o.id === id) ?? null;
  },
  async listOrders(): Promise<Order[]> {
    await sleep(LATENCY);
    if (typeof window === "undefined") return [];
    return JSON.parse(localStorage.getItem("tg:orders") ?? "[]");
  },
  async updateOrderStatus(id: string, status: Order["status"]): Promise<Order | null> {
    await sleep(LATENCY);
    if (typeof window === "undefined") return null;
    const list: Order[] = JSON.parse(localStorage.getItem("tg:orders") ?? "[]");
    const idx = list.findIndex((o) => o.id === id);
    if (idx === -1) return null;
    list[idx] = { ...list[idx], status };
    localStorage.setItem("tg:orders", JSON.stringify(list));
    return list[idx];
  },
};

/** Tipo público del adapter para inyección/tests futuros. */
export type Api = typeof api;
