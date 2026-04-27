"use client";

import { useMemo } from "react";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type {
  OrderLineItem,
  OrderType,
  Product,
  ProductOptionGroupId,
  ProductOptionValue,
  Promo,
} from "@/types";
import { buildLineItem } from "@/lib/cart";
import { calcTotals } from "@/lib/pricing";

interface CartState {
  items: OrderLineItem[];
  type: OrderType;
  promo: Promo | null;
  // ---- actions ----
  addProduct: (product: Product, options?: Partial<Record<ProductOptionGroupId, ProductOptionValue[]>>, qty?: number) => void;
  setQty: (lineId: string, qty: number) => void;
  remove: (lineId: string) => void;
  clear: () => void;
  setType: (type: OrderType) => void;
  setPromo: (promo: Promo | null) => void;
}

/**
 * Carrito persistente. Sobrevive a refresh y a navegación entre páginas.
 * Estado mínimo: items + type + promo aplicado.
 * El total se calcula en cada render con `totals()` para evitar desincronización.
 */
export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      type: "delivery",
      promo: null,

      addProduct: (product, options, qty = 1) => {
        const line = buildLineItem(product, options, qty);
        set({ items: [...get().items, line] });
      },

      setQty: (lineId, qty) => {
        set({
          items: get().items.map((l) =>
            l.lineId === lineId ? { ...l, qty: Math.max(1, qty) } : l
          ),
        });
      },

      remove: (lineId) => {
        set({ items: get().items.filter((l) => l.lineId !== lineId) });
      },

      clear: () => set({ items: [], promo: null }),

      setType: (type) => set({ type }),

      setPromo: (promo) => set({ promo }),
    }),
    {
      name: "tg:cart",
      storage: createJSONStorage(() => localStorage),
      // Solo persiste el carrito y modo. La promo la valida cada sesión.
      partialize: (s) => ({ items: s.items, type: s.type }),
    }
  )
);

/**
 * Hook memoizado para totales. Evita re-renders por objeto nuevo en cada render.
 * Importante: usar este hook desde componentes en lugar de `useCartStore(s => s.totals())`.
 */
export function useCartTotals() {
  const items = useCartStore((s) => s.items);
  const type = useCartStore((s) => s.type);
  const promo = useCartStore((s) => s.promo);
  return useMemo(() => calcTotals(items, type, promo), [items, type, promo]);
}

/** Contador de unidades en el carrito. Number primitivo → seguro con `===`. */
export function useCartCount() {
  return useCartStore((s) => s.items.reduce((acc, l) => acc + l.qty, 0));
}
