/**
 * Promoción / cupón. Mapeable a `promos` + `coupons` en Supabase.
 */
export type PromoChannel = "web" | "direct" | "in_store" | "all";
export type PromoVariant = "red" | "gold" | "dark";
export type PromoType =
  | "percent"      // % descuento sobre subtotal
  | "free_item"    // ítem gratis
  | "fixed"        // x€ de descuento
  | "info";        // Solo informativa, sin cupón

export interface Promo {
  id: string;
  title: string;
  description: string;
  variant: PromoVariant;
  type: PromoType;
  /** Código que el usuario introduce o que se aplica con un click. */
  code?: string;
  /** Para type="percent": 10 = 10% descuento. */
  percent?: number;
  /** Para type="fixed": valor en € a descontar. */
  amount?: number;
  /** Solo aplicable si pides directo en la web (clave del informe). */
  channel: PromoChannel;
  active: boolean;
  expiresAt?: string;
  countdownLabel?: string;
  /** CTA del botón. */
  cta: string;
  /** Pedido mínimo para aplicar. */
  minOrder?: number;
  /** Si aplica solo a ciertos locales (vacío = todos). */
  storeIds?: string[];
}
