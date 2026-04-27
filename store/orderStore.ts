"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Order } from "@/types";

interface OrderState {
  /** Último pedido del cliente, para mostrar en /gracias y tracker. */
  lastOrder: Order | null;
  setLastOrder: (order: Order | null) => void;
  updateStatus: (status: Order["status"]) => void;
}

export const useOrderStore = create<OrderState>()(
  persist(
    (set, get) => ({
      lastOrder: null,
      setLastOrder: (order) => set({ lastOrder: order }),
      updateStatus: (status) => {
        const o = get().lastOrder;
        if (!o) return;
        set({ lastOrder: { ...o, status } });
      },
    }),
    {
      name: "tg:order",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
