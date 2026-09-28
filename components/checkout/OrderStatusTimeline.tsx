"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import type { OrderStatus, OrderType } from "@/types";

interface Props {
  status: OrderStatus;
  type: OrderType;
  /** Si true, simula avance automático cada N segundos (demo). */
  autoAdvance?: boolean;
  onChange?: (status: OrderStatus) => void;
}

/**
 * Timeline de estado del pedido. Backend real lo actualizará por WebSocket
 * (Supabase Realtime) o polling a /api/orders/:id.
 *
 * ⚠️ BUG CORREGIDO: `flow` de delivery incluía "ready" pero `steps` no, así
 * que al llegar el avance automático a ese estado `findIndex` devolvía -1,
 * los cuatro pasos caían a gris y la barra de progreso se calculaba al 0%.
 * Cronología real en /gracias: t=0 "Recibido", t=5s "Preparando",
 * t=10s LA PANTALLA ENTERA APAGADA, t=15s "En reparto".
 * Era el único fallo que se disparaba solo, sin tocar nada, delante del
 * cliente. Ahora los dos arrays tienen exactamente los mismos estados.
 */
export function OrderStatusTimeline({ status, type, autoAdvance = false, onChange }: Props) {
  const [current, setCurrent] = useState<OrderStatus>(status);

  useEffect(() => setCurrent(status), [status]);

  const steps =
    type === "delivery"
      ? [
          { id: "accepted", label: "Recibido" },
          { id: "preparing", label: "Preparando" },
          { id: "ready", label: "Listo, esperando rider" },
          { id: "out_for_delivery", label: "En reparto" },
          { id: "delivered", label: "Entregado" },
        ]
      : [
          { id: "accepted", label: "Recibido" },
          { id: "preparing", label: "Preparando" },
          { id: "ready", label: "Listo para recoger" },
          { id: "delivered", label: "Recogido" },
        ];

  useEffect(() => {
    if (!autoAdvance) return;
    // El flujo sale de los mismos pasos que se pintan: no pueden divergir.
    const flow = steps.map((s) => s.id as OrderStatus);
    const idx = flow.indexOf(current);
    if (idx === -1 || idx === flow.length - 1) return;
    const t = setTimeout(() => {
      const next = flow[idx + 1];
      setCurrent(next);
      onChange?.(next);
      // 5 s por paso hacía que /gracias llegara a "Entregado" en 20 segundos
      // mientras dos líneas más arriba promete "~30 min" y el panel de cocina
      // sigue con la comanda en "Nuevos". Se contradecía sola delante del
      // cliente.
    }, 14000);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current, autoAdvance, type, onChange]);

  const idx = steps.findIndex((s) => s.id === current);

  return (
    <div>
      <ol
        className={cn(
          // Con 5 pasos y grid-cols-2 en móvil, el quinto quedaba huérfano
          // ocupando media fila. Una sola columna hasta 420px y luego dos.
          "grid grid-cols-1 min-[420px]:grid-cols-2 gap-3",
          steps.length === 5 ? "sm:grid-cols-5" : "sm:grid-cols-4"
        )}
      >
        {steps.map((s, i) => {
          const done = i < idx;
          const active = i === idx;
          return (
            <li
              key={s.id}
              className={cn(
                "flex flex-col items-center text-center font-anton uppercase text-sm tracking-wide rounded-galos border-2 p-4",
                done && "bg-galos-gold/15 border-galos-gold text-galos-black",
                active && "bg-galos-red/20 border-galos-red text-white",
                !done && !active && "bg-white/5 border-white/20 text-white/70"
              )}
            >
              <span
                className={cn(
                  "w-9 h-9 rounded-full inline-flex items-center justify-center mb-1.5 text-base",
                  done && "bg-galos-gold text-galos-black",
                  active && "bg-galos-red text-white animate-pulse-scale",
                  !done && !active && "bg-white/10 text-white"
                )}
              >
                {i + 1}
              </span>
              {s.label}
            </li>
          );
        })}
      </ol>

      <div className="mt-5 max-w-3xl mx-auto h-2 bg-white/10 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-galos-gold to-galos-red transition-[width] duration-700"
          style={{ width: `${(Math.max(idx, 0) + 1) * (100 / steps.length)}%` }}
        />
      </div>
    </div>
  );
}
