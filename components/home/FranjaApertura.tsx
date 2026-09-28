"use client";

import { useState } from "react";
import { AvisoModal, type ModoAviso } from "@/components/home/AvisoModal";

/**
 * Franja de próxima apertura. Urgencia permanente en la primera pantalla,
 * y las dos capturas que de verdad valen dinero:
 *
 *   · AVÍSAME  → teléfonos de la gente que va a hacer cola.
 *   · TENGO UN LOCAL → en un reto de 60 días el cuello de botella no es
 *     la demanda, es encontrar locales.
 *
 * Es presentacional a propósito: el componente padre (Marcador) posee el
 * gate de montaje, así que aquí no hay riesgo de desajuste de hidratación.
 */
export function FranjaApertura({
  ciudad,
  faltan,
}: {
  /** Próxima apertura. Si no hay ninguna pendiente, llega sin definir. */
  ciudad?: string;
  faltan?: number;
}) {
  const [modo, setModo] = useState<ModoAviso>(null);

  return (
    <>
      <div className="mt-5 flex flex-wrap items-center gap-2.5">
        {/*
          ⚠️ La píldora de apertura depende de que haya una pendiente, pero
          "¿Tienes un local?" NO: se muestra siempre. Si se atan las dos, en
          cuanto se abre el último local pendiente desaparecen de golpe las
          dos únicas capturas de contacto de todo el sitio — y eso es
          exactamente lo que pasa al pulsar "Abrir Manresa" en la demo.
        */}
        {ciudad && (
        <button
          onClick={() => setModo("aviso")}
          className="group inline-flex items-stretch overflow-hidden rounded-full
                     bg-galos-black border-2 border-galos-gold/50 hover:border-galos-gold
                     transition-colors text-left"
        >
          <span className="inline-flex items-center gap-2 pl-3.5 pr-3 py-2">
            <span className="w-2 h-2 rounded-full bg-galos-gold animate-pulse-scale flex-shrink-0" />
            <span className="text-[11px] sm:text-xs font-black uppercase tracking-wider text-white">
              Apertura {ciudad}
            </span>
            <span className="text-[11px] sm:text-xs font-bold text-galos-gold tabular-nums">
              {faltan == null
                ? "Muy pronto"
                : faltan === 0
                  ? "¡HOY!"
                  : `${faltan} ${faltan === 1 ? "día" : "días"}`}
            </span>
          </span>
          <span
            className="inline-flex items-center px-3.5 py-2 border-l-2 border-galos-gold/40
                       bg-galos-gold text-galos-black font-black uppercase
                       tracking-wider text-[11px] group-hover:bg-white transition-colors"
          >
            Avísame
          </span>
        </button>
        )}

        <button
          onClick={() => setModo("local")}
          className="text-[11px] sm:text-xs font-black uppercase tracking-wider
                     text-white/70 hover:text-white underline underline-offset-4
                     decoration-white/30 hover:decoration-white transition-colors px-1 py-2"
        >
          ¿Tienes un local?
        </button>
      </div>

      <AvisoModal modo={modo} onClose={() => setModo(null)} ciudad={ciudad} />
    </>
  );
}
