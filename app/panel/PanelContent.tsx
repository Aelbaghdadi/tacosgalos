"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { StickerTitle, Hl } from "@/components/ui/StickerTitle";
import { api } from "@/lib/mockApi";
import { STORES } from "@/data/stores";
import { formatPrice } from "@/lib/utils";
import { formatLineOptions } from "@/lib/cart";
import { getStatusLabel } from "@/lib/order";
import type { Order, OrderStatus } from "@/types";
import { cn } from "@/lib/utils";

/**
 * Panel KDS / cocina (mock).
 * En producción real:
 *   - Auth (Supabase) por staff del local
 *   - Realtime subscription a `orders` filtrado por store_id
 *   - Botones llaman a `updateOrderStatus` → webhook al cliente
 *   - Una mini app local Node escucha la DB y dispara impresora térmica
 */
const COLUMNS: { id: OrderStatus; label: string; color: string }[] = [
  { id: "accepted", label: "Nuevos", color: "bg-galos-gold" },
  { id: "preparing", label: "En cocina", color: "bg-galos-red text-white" },
  { id: "ready", label: "Listos", color: "bg-emerald-400" },
  { id: "delivered", label: "Entregados", color: "bg-galos-black text-white" },
];

export function PanelContent() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [tick, setTick] = useState(0);

  // Polling mock: en producción → Supabase.from('orders').on('*').subscribe()
  useEffect(() => {
    api.listOrders().then(setOrders);
    const t = setInterval(() => setTick((x) => x + 1), 5000);
    return () => clearInterval(t);
  }, [tick]);

  const advance = async (id: string, next: OrderStatus) => {
    await api.updateOrderStatus(id, next);
    api.listOrders().then(setOrders);
  };

  return (
    <>
      <div className="pt-page bg-galos-black" />
      <section className="bg-galos-black text-white py-10">
        <div className="container mx-auto px-4 flex justify-between items-end gap-4 flex-wrap">
          <div>
            <span className="inline-block bg-galos-gold text-galos-black font-black uppercase tracking-wider text-[11px] px-3.5 py-1.5 rounded-full mb-3">
              KDS · Mock
            </span>
            <StickerTitle as="h1"><Hl>PANEL COCINA</Hl></StickerTitle>
            <p className="text-sm text-neutral-400 mt-2 max-w-xl">
              Mockup operativo. En MVP real este panel recibe pedidos via Supabase Realtime
              y dispara la impresora térmica del local mediante una mini-app Node.
            </p>
          </div>
          <Button href="/checkout" variant="white" size="md">
            Generar pedido demo
          </Button>
        </div>
      </section>

      <section className="bg-neutral-900 text-white min-h-[60vh] py-8">
        <div className="container mx-auto px-4">
          {orders.length === 0 ? (
            <div className="text-center py-20 text-neutral-400">
              <p className="text-lg font-bold mb-3">Aún no hay pedidos.</p>
              <Button href="/carta" variant="primary" size="md">Crear uno demo</Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
              {COLUMNS.map((col) => {
                const list = orders.filter((o) => o.status === col.id);
                return (
                  <div key={col.id}>
                    <header className={cn("rounded-galos-sm px-4 py-2 font-anton text-lg uppercase mb-3", col.color)}>
                      {col.label} <span className="opacity-70 text-sm">({list.length})</span>
                    </header>
                    <ul className="flex flex-col gap-3">
                      {list.map((o) => (
                        <KitchenCard key={o.id} order={o} onAdvance={advance} />
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </>
  );
}

function KitchenCard({ order, onAdvance }: { order: Order; onAdvance: (id: string, s: OrderStatus) => void }) {
  const store = STORES.find((s) => s.id === order.storeId);
  const next: OrderStatus =
    order.status === "accepted" ? "preparing" :
    order.status === "preparing" ? "ready" :
    order.status === "ready" ? (order.type === "delivery" ? "out_for_delivery" : "delivered") :
    "delivered";

  return (
    <Card className="p-4 text-galos-black bg-white" hover={false}>
      <div className="flex items-center justify-between mb-2">
        <span className="font-anton text-lg">#{order.id.split("-").pop()}</span>
        <Badge variant={order.type === "delivery" ? "new" : "halal"}>
          {order.type === "delivery" ? "🛵 Delivery" : "🏃 Pickup"}
        </Badge>
      </div>
      <p className="text-xs font-bold text-neutral-500 uppercase mb-2">{store?.city}</p>
      <ul className="text-sm divide-y divide-dashed divide-neutral-200">
        {order.items.map((l) => {
          const opts = formatLineOptions(l);
          return (
            <li key={l.lineId} className="py-1.5">
              <strong className="text-galos-red">{l.qty}×</strong> {l.name}
              {opts && <div className="text-xs text-neutral-500">{opts}</div>}
            </li>
          );
        })}
      </ul>
      <div className="mt-3 flex items-center justify-between gap-2">
        <span className="text-xs font-bold text-neutral-700 uppercase">
          {getStatusLabel(order.status, order.type)}
        </span>
        {order.status !== "delivered" && (
          <Button onClick={() => onAdvance(order.id, next)} variant="primary" size="sm">
            {next === "preparing" && "Aceptar"}
            {next === "ready" && "Listo"}
            {next === "out_for_delivery" && "Reparto"}
            {next === "delivered" && "Entregar"}
          </Button>
        )}
      </div>
    </Card>
  );
}
