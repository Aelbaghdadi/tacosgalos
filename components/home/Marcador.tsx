"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { STORES } from "@/data/stores";
import {
  RETO,
  diaDelReto,
  diasParaApertura,
  retoCompletado,
  LOCALES_PENDIENTES,
} from "@/data/reto";
import { useRetoStore } from "@/store/retoStore";
import { FranjaApertura } from "@/components/home/FranjaApertura";

/**
 * Marcador del reto. Es lo primero que ve el dueño al abrir la web:
 * su propio DÍA X/60, con los números saliendo de una sola fuente.
 *
 * El día se DERIVA de la fecha de inicio, así que avanza solo y nunca
 * puede desincronizarse. Lo único que se guarda es el ajuste de demo.
 *
 * Se monta en cliente para evitar desajustes de hidratación: el HTML
 * estático no puede conocer la fecha de hoy. Reservamos la altura para
 * que no haya salto de layout.
 */
export function Marcador() {
  const [montado, setMontado] = useState(false);
  const dayOffset = useRetoStore((s) => s.dayOffset);
  const extraOpen = useRetoStore((s) => s.extraOpen);

  useEffect(() => setMontado(true), []);

  const ahora = Date.now();
  const dia = diaDelReto(ahora, dayOffset);
  const completado = retoCompletado(ahora, dayOffset);

  /**
   * Contador a prueba de doble conteo: se cuenta sobre STORES, no sumando
   * `extraOpen.length`. Así, el día que la marca confirme Manresa y pase a
   * `status: "open"` en data/stores.ts, un navegador que ya la tuviera en
   * `extraOpen` no la contará dos veces.
   */
  const locales = STORES.filter(
    (s) => s.status === "open" || extraOpen.includes(s.slug)
  ).length;

  /**
   * La próxima apertura se DERIVA de los locales que siguen pendientes.
   * Antes era una constante literal, así que al pulsar "Abrir Manresa" en el
   * panel el contador subía a 11 y la franja de debajo seguía anunciando la
   * apertura de Manresa en 3 días, en la misma pantalla.
   */
  const proxima = LOCALES_PENDIENTES.find((s) => !extraOpen.includes(s.slug));
  const faltan = diasParaApertura(ahora);

  return (
    <div className="w-full">
      {/* Etiqueta del reto */}
      <span className="inline-flex items-center gap-2 bg-galos-black text-galos-gold font-black uppercase tracking-[0.18em] text-[10px] sm:text-[11px] px-3.5 py-1.5 rounded-full border-2 border-galos-gold/40 mb-3">
        <span className="w-1.5 h-1.5 rounded-full bg-galos-gold animate-pulse-scale" />
        Reto {RETO.objetivoEuros.toLocaleString("es-ES")} € · {RETO.totalDias} días
      </span>

      {/* El número, protagonista */}
      <div className="min-h-[104px] sm:min-h-[132px] lg:min-h-[150px] flex items-end gap-3 sm:gap-4">
        {!montado ? (
          <span className="sr-only">Cargando marcador del reto</span>
        ) : completado ? (
          <h2 className="font-anton uppercase leading-[0.85] text-[52px] sm:text-7xl lg:text-8xl tg-sticker">
            RETO COMPLETADO
          </h2>
        ) : (
          <>
            <span className="font-anton uppercase text-white/75 text-xl sm:text-2xl lg:text-3xl leading-none pb-2 sm:pb-3">
              DÍA
            </span>
            <span
              className="font-anton uppercase leading-[0.82] tracking-tight tg-sticker
                         text-[76px] sm:text-[104px] lg:text-[128px]"
            >
              {dia}
            </span>
            <span className="font-anton uppercase text-white/75 text-2xl sm:text-4xl lg:text-5xl leading-none pb-1 sm:pb-2">
              /{RETO.totalDias}
            </span>
          </>
        )}
      </div>

      {/* Los tres números, de una sola fuente */}
      <dl className="mt-4 grid grid-cols-3 gap-2 sm:gap-3 max-w-lg">
        <Dato valor={montado ? String(locales) : "—"} etiqueta="Locales" destacado />
        <Dato
          valor={RETO.tacos2025.toLocaleString("es-ES")}
          etiqueta="Tacos en 2025"
        />
        <Dato valor={`+${RETO.crecimientoPct}%`} etiqueta="vs 2024" />
      </dl>

      {/*
        La franja YA NO depende de que el reto siga vivo: la próxima apertura
        existe igual el día 61, y con ella las dos únicas capturas de contacto
        de todo el sitio (AVÍSAME y "¿Tienes un local?"). Antes iban detrás de
        `!completado` y desaparecían para siempre al terminar el reto.
      */}
      {montado && (
        <FranjaApertura
          ciudad={proxima?.city}
          faltan={proxima ? faltan : undefined}
        />
      )}
    </div>
  );
}

function Dato({
  valor,
  etiqueta,
  destacado = false,
}: {
  valor: string;
  etiqueta: string;
  destacado?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex flex-col rounded-galos-sm border-2 px-2.5 py-2 sm:px-3 sm:py-2.5 backdrop-blur-[2px]",
        destacado
          ? "bg-galos-gold text-galos-black border-galos-black"
          : "bg-black/25 text-white border-white/25"
      )}
    >
      {/*
        dt = término (la etiqueta), dd = valor. Antes estaban invertidos.
        En el DOM va dt primero, como exige el spec para un <div> dentro de
        <dl>; el orden visual lo pone `order-*`, no el marcado.
      */}
      <dt
        className={cn(
          "order-2 text-[9px] sm:text-[10px] font-black uppercase tracking-wider mt-1",
          destacado ? "text-galos-black/70" : "text-white/60"
        )}
      >
        {etiqueta}
      </dt>
      <dd
        className={cn(
          "order-1 font-anton leading-none text-lg sm:text-2xl lg:text-[26px] tabular-nums",
          destacado ? "text-galos-black" : "text-white"
        )}
      >
        {valor}
      </dd>
    </div>
  );
}
