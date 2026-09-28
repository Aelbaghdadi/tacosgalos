"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface LeadLocal {
  ciudad: string;
  metros: string;
  alquiler: string;
  contacto: string;
}

/**
 * Estado del reto.
 *
 * IMPORTANTE para la demo: el día NO vive aquí, se deriva de RETO.startDate
 * en data/reto.ts. Aquí solo guardamos los ajustes que el panel aplica
 * encima — y eso es exactamente lo que hoy es mock y mañana es una fila
 * en Supabase.
 *
 * Confesión honesta que hay que decir en la reunión: esto vive en el
 * navegador. Si el dueño abre un local desde su móvil, un cliente en otro
 * dispositivo NO lo ve. Y los teléfonos capturados no salen de aquí:
 * sin backend no llegan a ninguna parte.
 */
interface RetoState {
  /** Solo demo: adelanta el día sin tocar la fecha de inicio. */
  dayOffset: number;
  /** Slugs de locales marcados como abiertos desde el panel. */
  extraOpen: string[];
  /** Teléfonos capturados por AVÍSAME (mock, no sale del navegador). */
  avisos: string[];
  /** Locales ofrecidos por seguidores (mock). El cuello de botella del reto. */
  leadsLocal: LeadLocal[];

  avanzarDia: () => void;
  abrirLocal: (slug: string) => void;
  addAviso: (telefono: string) => void;
  addLeadLocal: (lead: LeadLocal) => void;
  reset: () => void;
}

export const useRetoStore = create<RetoState>()(
  persist(
    (set, get) => ({
      dayOffset: 0,
      extraOpen: [],
      avisos: [],
      leadsLocal: [],

      avanzarDia: () => set({ dayOffset: get().dayOffset + 1 }),

      abrirLocal: (slug) => {
        const actuales = get().extraOpen;
        if (actuales.includes(slug)) return;
        set({ extraOpen: [...actuales, slug] });
      },

      addAviso: (telefono) => {
        const limpio = telefono.trim();
        if (!limpio) return;
        set({ avisos: [...get().avisos, limpio] });
      },

      addLeadLocal: (lead) => {
        if (!lead.ciudad.trim() || !lead.contacto.trim()) return;
        set({ leadsLocal: [...get().leadsLocal, lead] });
      },

      reset: () =>
        set({ dayOffset: 0, extraOpen: [], avisos: [], leadsLocal: [] }),
    }),
    {
      name: "tg:reto",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
