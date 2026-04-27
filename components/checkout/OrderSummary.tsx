"use client";

import { Card } from "@/components/ui/Card";
import { useCartStore, useCartTotals } from "@/store/cartStore";
import { useLocationStore } from "@/store/locationStore";
import { STORES } from "@/data/stores";
import { formatPrice } from "@/lib/utils";
import { formatLineOptions } from "@/lib/cart";

export function OrderSummary() {
  const items = useCartStore((s) => s.items);
  const totals = useCartTotals();
  const promo = useCartStore((s) => s.promo);
  const type = useCartStore((s) => s.type);
  const storeId = useLocationStore((s) => s.storeId);
  const store = STORES.find((s) => s.id === storeId);

  return (
    <Card className="p-5 lg:sticky lg:top-32" hover={false}>
      <h3 className="font-anton text-xl uppercase mb-2">Tu pedido</h3>
      <p className="text-xs font-bold text-neutral-500 uppercase tracking-wide mb-3">
        {type === "delivery" ? "Delivery" : "Recogida"} · {store?.city ?? "Sin local"}
      </p>

      <ul className="divide-y divide-dashed divide-neutral-300">
        {items.map((l) => {
          const opts = formatLineOptions(l);
          return (
            <li key={l.lineId} className="py-2 grid grid-cols-[auto_1fr_auto] gap-2 text-sm">
              <span className="font-black text-galos-red">{l.qty}×</span>
              <span>
                <span className="font-bold">{l.name}</span>
                {opts && <span className="block text-xs text-neutral-500">{opts}</span>}
              </span>
              <span className="font-black">{formatPrice(l.unitPrice * l.qty)}</span>
            </li>
          );
        })}
      </ul>

      <div className="mt-3 space-y-1 text-sm font-bold text-neutral-700">
        <Row label="Subtotal" value={formatPrice(totals.subtotal)} />
        {totals.discount > 0 && (
          <Row label={`Descuento ${promo?.code ?? ""}`} value={`-${formatPrice(totals.discount)}`} green />
        )}
        {totals.deliveryFee > 0 && <Row label="Envío" value={formatPrice(totals.deliveryFee)} />}
      </div>
      <div className="flex justify-between font-anton text-xl uppercase tracking-wide mt-2 pt-2 border-t border-neutral-300">
        <span>Total</span>
        <span>{formatPrice(totals.total)}</span>
      </div>
    </Card>
  );
}

function Row({ label, value, green = false }: { label: string; value: string; green?: boolean }) {
  return (
    <div className={`flex justify-between ${green ? "text-emerald-600" : ""}`}>
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}
