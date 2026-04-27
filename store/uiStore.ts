"use client";

import { create } from "zustand";
import type { Product } from "@/types";

/**
 * Estado UI efímero (no se persiste). Drawers, modales abiertos,
 * producto en modal de personalización, toasts.
 */
interface UIState {
  cartOpen: boolean;
  locatorOpen: boolean;
  productInModal: Product | null;
  toast: string | null;

  openCart: () => void;
  closeCart: () => void;
  openLocator: () => void;
  closeLocator: () => void;
  openProduct: (p: Product) => void;
  closeProduct: () => void;
  showToast: (msg: string) => void;
  clearToast: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  cartOpen: false,
  locatorOpen: false,
  productInModal: null,
  toast: null,
  openCart: () => set({ cartOpen: true }),
  closeCart: () => set({ cartOpen: false }),
  openLocator: () => set({ locatorOpen: true }),
  closeLocator: () => set({ locatorOpen: false }),
  openProduct: (productInModal) => set({ productInModal }),
  closeProduct: () => set({ productInModal: null }),
  showToast: (toast) => {
    set({ toast });
    setTimeout(() => set((s) => (s.toast === toast ? { toast: null } : s)), 2400);
  },
  clearToast: () => set({ toast: null }),
}));
