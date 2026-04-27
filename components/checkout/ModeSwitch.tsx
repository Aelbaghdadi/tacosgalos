"use client";

import { useCartStore } from "@/store/cartStore";
import { cn } from "@/lib/utils";

/**
 * Mode switch reutilizable (delivery / pickup).
 */
export function ModeSwitch({ inverted = false }: { inverted?: boolean }) {
  const type = useCartStore((s) => s.type);
  const setType = useCartStore((s) => s.setType);

  return (
    <div
      role="tablist"
      className={cn(
        "inline-flex border-2 rounded-full p-1 gap-1",
        inverted ? "bg-black/35 border-white/40" : "bg-white border-galos-black"
      )}
    >
      {(["delivery", "pickup"] as const).map((m) => (
        <button
          key={m}
          role="tab"
          aria-selected={type === m}
          onClick={() => setType(m)}
          className={cn(
            "px-4 py-2 rounded-full font-black uppercase text-xs tracking-wide transition-colors",
            type === m
              ? "bg-galos-red text-white"
              : inverted
              ? "text-white/75 hover:text-white"
              : "text-galos-black hover:bg-galos-red-soft"
          )}
        >
          {m === "delivery" ? "🛵 Delivery" : "🏃 Recogida"}
        </button>
      ))}
    </div>
  );
}
