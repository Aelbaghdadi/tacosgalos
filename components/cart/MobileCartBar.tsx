"use client";

import { useCartCount, useCartTotals } from "@/store/cartStore";
import { useUIStore } from "@/store/uiStore";
import { formatPrice } from "@/lib/utils";

/**
 * Sticky cart bar — solo móvil. Aparece cuando hay items.
 */
export function MobileCartBar() {
  const count = useCartCount();
  const totals = useCartTotals();
  const openCart = useUIStore((s) => s.openCart);

  if (count === 0) return null;

  return (
    <div className="md:hidden fixed left-3 right-3 bottom-3 z-[95] pb-[env(safe-area-inset-bottom)]">
      <button
        onClick={openCart}
        className="w-full bg-galos-red text-white border-[3px] border-galos-black rounded-full px-5 py-3.5 grid grid-cols-[auto_1fr_auto] items-center gap-3 font-black uppercase tracking-wide text-sm shadow-[0_10px_24px_rgba(227,6,19,0.55)] animate-slide-up"
      >
        <span className="w-8 h-8 rounded-full bg-galos-gold text-galos-black inline-flex items-center justify-center text-sm">
          {count}
        </span>
        <span>Ver mi pedido</span>
        <span className="bg-black/30 px-3 py-1 rounded-full text-xs">
          {formatPrice(totals.total)}
        </span>
      </button>
    </div>
  );
}
