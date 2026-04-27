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
 */
export function OrderStatusTimeline({ status, type, autoAdvance = false, onChange }: Props) {
  const [current, setCurrent] = useState<OrderStatus>(status);

  useEffect(() => setCurrent(status), [status]);

  useEffect(() => {
    if (!autoAdvance) return;
    const flow: OrderStatus[] =
      type === "delivery"
        ? ["accepted", "preparing", "ready", "out_for_delivery", "delivered"]
        : ["accepted", "preparing", "ready", "delivered"];
    const idx = flow.indexOf(current);
    if (idx === -1 || idx === flow.length - 1) return;
    const t = setTimeout(() => {
      const next = flow[idx + 1];
      setCurrent(next);
      onChange?.(next);
    }, 5000);
    return () => clearTimeout(t);
  }, [current, autoAdvance, type, onChange]);

  const steps =
    type === "delivery"
      ? [
          { id: "accepted", label: "Recibido" },
          { id: "preparing", label: "Preparando" },
          { id: "out_for_delivery", label: "En reparto" },
          { id: "delivered", label: "Entregado" },
        ]
      : [
          { id: "accepted", label: "Recibido" },
          { id: "preparing", label: "Preparando" },
          { id: "ready", label: "Listo para recoger" },
          { id: "delivered", label: "Recogido" },
        ];

  const idx = steps.findIndex((s) => s.id === current);

  return (
    <div>
      <ol className="grid grid-cols-2 sm:grid-cols-4 gap-3">
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
          style={{ width: `${((idx + 1) / steps.length) * 100}%` }}
        />
      </div>
    </div>
  );
}
