"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface LocationState {
  storeId: string | null;
  setStoreId: (id: string | null) => void;
}

/**
 * Local seleccionado por el usuario. Persistente entre sesiones —
 * cuando vuelve a la web, no le pedimos otra vez "elige tu local".
 */
export const useLocationStore = create<LocationState>()(
  persist(
    (set) => ({
      storeId: null,
      setStoreId: (storeId) => set({ storeId }),
    }),
    {
      name: "tg:location",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
