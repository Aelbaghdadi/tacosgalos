"use client";

import { formatPrice } from "@/lib/utils";
import { formatLineOptions } from "@/lib/cart";
import { useCartStore } from "@/store/cartStore";
import type { OrderLineItem } from "@/types";

export function CartItem({ item }: { item: OrderLineItem }) {
  const setQty = useCartStore((s) => s.setQty);
  const remove = useCartStore((s) => s.remove);
  const optsLabel = formatLineOptions(item);

  return (
    <div className="grid grid-cols-[1fr_auto] gap-3 py-3.5 border-b border-dashed border-neutral-300">
      <div>
        <div className="font-anton text-lg uppercase tracking-wide leading-snug">
          {item.name}
        </div>
        {optsLabel && (
          <div className="text-xs text-neutral-500 mt-0.5">{optsLabel}</div>
        )}
        <div className="font-black text-galos-red mt-1">
          {formatPrice(item.unitPrice * item.qty)}
        </div>
        <div className="inline-flex items-center gap-2 bg-neutral-100 rounded-full px-1.5 py-1 mt-1.5 w-fit">
          <button
            onClick={() => setQty(item.lineId, item.qty - 1)}
            className="w-7 h-7 rounded-full bg-white border-2 border-galos-black font-black"
            aria-label="Disminuir"
          >
            −
          </button>
          <span className="font-black min-w-[18px] text-center">{item.qty}</span>
          <button
            onClick={() => setQty(item.lineId, item.qty + 1)}
            className="w-7 h-7 rounded-full bg-white border-2 border-galos-black font-black"
            aria-label="Aumentar"
          >
            +
          </button>
        </div>
      </div>
      <button
        onClick={() => remove(item.lineId)}
        className="self-start text-neutral-500 text-xs underline hover:text-galos-red"
      >
        Quitar
      </button>
    </div>
  );
}
