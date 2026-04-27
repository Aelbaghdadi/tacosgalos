"use client";

import { useLocationStore } from "@/store/locationStore";
import { useUIStore } from "@/store/uiStore";
import { STORES } from "@/data/stores";

/**
 * TopBar global. Estilo premium, integrado.
 * - Izquierda: SOLO el selector de local (el modo delivery/recogida vive en el hero,
 *   no se duplica). Diseño tipo "barra de ubicación" estilo apps de delivery profesionales.
 * - Derecha: pills informativos de marca (Halal, promo del día).
 * - Sin emojis. Iconos SVG inline minimalistas.
 */
export function TopBar() {
  const storeId = useLocationStore((s) => s.storeId);
  const openLocator = useUIStore((s) => s.openLocator);
  const store = STORES.find((s) => s.id === storeId);

  return (
    <div className="hidden md:flex fixed top-0 inset-x-0 z-[101] h-[44px] bg-galos-black text-white text-xs items-center">
      <div className="container mx-auto px-4 flex items-center justify-between gap-3 w-full">
        {/* Selector de local — botón limpio, integrado, no flotante */}
        <button
          onClick={openLocator}
          className="group flex items-center gap-2 min-w-0 hover:text-galos-gold transition-colors"
          aria-label={store ? `Local actual: ${store.city}. Cambiar.` : "Elegir local"}
        >
          <PinIcon className="w-4 h-4 flex-shrink-0 text-galos-gold" />
          <span className="text-white/55 hidden sm:inline">
            {store ? "Pidiendo en" : "Local"}
          </span>
          <span className="font-bold truncate max-w-[160px] sm:max-w-[220px]">
            {store ? store.city : "Elige tu local"}
          </span>
          <ChevronIcon className="w-3 h-3 flex-shrink-0 text-white/40 group-hover:text-galos-gold transition-colors" />
        </button>

        {/* Pills informativos derecha (solo desktop) */}
        <div className="hidden md:flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 bg-white/10 border border-white/15 px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide">
            <span className="w-1.5 h-1.5 rounded-full bg-galos-gold" />
            100% Halal
          </span>
          <span className="inline-flex items-center gap-1.5 bg-galos-gold text-galos-black px-2.5 py-1 rounded-full text-[11px] font-black uppercase tracking-wide animate-pulse-scale">
            Tacos a 1€ · Jueves
          </span>
        </div>
      </div>
    </div>
  );
}

/* ── Iconos SVG minimalistas (estilo Lucide / Heroicons) ─────────────── */

function PinIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0116 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}
