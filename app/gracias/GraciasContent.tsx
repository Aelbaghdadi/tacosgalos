"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { StickerTitle, Hl } from "@/components/ui/StickerTitle";
import { OrderStatusTimeline } from "@/components/checkout/OrderStatusTimeline";
import { useOrderStore } from "@/store/orderStore";
import { api } from "@/lib/mockApi";
import { STORES } from "@/data/stores";
import { formatPrice } from "@/lib/utils";
import type { Order } from "@/types";

export function GraciasContent() {
  const params = useSearchParams();
  const orderId = params.get("order");
  const lastOrder = useOrderStore((s) => s.lastOrder);
  const [order, setOrder] = useState<Order | null>(lastOrder ?? null);

  // Si entran a /gracias?order=ID directamente, recuperamos el pedido
  useEffect(() => {
    if (!orderId || (order && order.id === orderId)) return;
    api.getOrder(orderId).then((o) => o && setOrder(o));
  }, [orderId, order]);

  if (!order) {
    return (
      <section className="pt-page bg-galos-red text-white min-h-screen">
        <div className="container mx-auto px-4 py-16 text-center">
          <Image
            src="/images/mascots/mascot-empty-bag.png"
            alt="Sin pedido"
            width={220}
            height={260}
            className="mx-auto h-auto w-[200px] drop-shadow-[0_20px_20px_rgba(0,0,0,0.4)]"
          />
          <StickerTitle as="h1" className="mt-4"><Hl>NO HAY PEDIDO</Hl></StickerTitle>
          <p className="mt-4 text-lg">Parece que has llegado aquí sin pedir nada.</p>
          <Button href="/carta" variant="white" size="xl" className="mt-6">Ver carta</Button>
        </div>
      </section>
    );
  }

  const store = STORES.find((s) => s.id === order.storeId);
  const eta =
    order.type === "pickup"
      ? `Listo para recoger en ~${store?.pickupEtaMinutes ?? 8} min`
      : `Llegará en ~${store?.deliveryEtaMinutes ?? 30} min`;

  return (
    <>
      <section className="bg-galos-red text-white pt-page pb-16 relative overflow-hidden">
        <div className="container mx-auto px-4 grid lg:grid-cols-[1.5fr_1fr] gap-8 items-center">
          <div>
            <span className="inline-block bg-galos-gold text-galos-black font-black uppercase tracking-wider text-[11px] px-3.5 py-1.5 rounded-full mb-4 shadow-[0_4px_0_rgba(0,0,0,0.15)]">
              ¡Pedido recibido!
            </span>
            <StickerTitle as="h1">
              <Hl>PEDIDO #{order.id.split("-").pop()}</Hl>
            </StickerTitle>
            <p className="mt-3 text-lg max-w-xl">
              <strong className="text-white">{eta}</strong>
              <span className="text-red-100"> · {store?.city}</span>
            </p>
            <p className="mt-2 text-sm text-red-100">
              Menos apps. Más taco. Más promo.
            </p>
          </div>

          <div className="flex justify-center lg:justify-end">
            <Image
              src="/images/mascots/mascot-celebration-bag.png"
              alt="¡Pedido recibido!"
              width={320}
              height={400}
              priority
              className="w-auto h-auto max-h-[360px] drop-shadow-[0_25px_25px_rgba(0,0,0,0.4)] animate-floaty"
            />
          </div>
        </div>

        <div className="container mx-auto px-4 mt-10">
          <OrderStatusTimeline status={order.status} type={order.type} autoAdvance />
        </div>
      </section>

      <section className="py-16 bg-galos-cream">
        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-6 max-w-4xl">
          <Card className="p-6" hover={false}>
            <h3 className="font-anton text-xl uppercase mb-3">Resumen</h3>
            <p className="text-sm text-neutral-500 font-bold mb-3 uppercase tracking-wide">
              {order.type === "delivery" ? "Delivery" : "Recogida"} · {store?.address}
            </p>
            <ul className="divide-y divide-dashed divide-neutral-300">
              {order.items.map((l) => (
                <li key={l.lineId} className="py-2 flex justify-between text-sm">
                  <span><strong className="text-galos-red">{l.qty}×</strong> {l.name}</span>
                  <span className="font-black">{formatPrice(l.unitPrice * l.qty)}</span>
                </li>
              ))}
            </ul>
            <div className="mt-3 pt-3 border-t border-neutral-300 flex justify-between font-anton text-xl uppercase">
              <span>Total</span>
              <span>{formatPrice(order.totals.total)}</span>
            </div>
          </Card>

          <Card className="p-6 flex flex-col gap-3" hover={false}>
            <h3 className="font-anton text-xl uppercase">¿Y ahora qué?</h3>
            <p className="text-sm text-neutral-700">
              Te avisamos en cada estado. Si tienes Galos Club, ya has sumado puntos.
            </p>
            <Button href="/carta" variant="primary" size="md">
              Repetir pedido / Pedir otro Galos
            </Button>
            <Button href="https://www.instagram.com/" external variant="dark" size="md">
              Síguenos en Instagram
            </Button>
            <p className="text-xs text-neutral-500 mt-2">
              ¿Algún problema? Llámanos al local o escríbenos a hola@tacosgalos.com.
            </p>
          </Card>
        </div>
      </section>
    </>
  );
}
