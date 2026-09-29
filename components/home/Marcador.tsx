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
 * Marcador del reto, en tira compacta.
 *
 * Antes era un bloque de 338 px con "RETO COMPLETADO" a 96 px: se comía el
 * primer viewport entero y dejaba el titular real —"TU TACO. TUS REGLAS."—
 * pareciendo una segunda sección. El reto es CONTEXTO; el objetivo de la
 * página es que el usuario pida. Así que la misma información cabe ahora en
 * una tira de una o dos filas con una segunda línea pequeña debajo.
 *
 * No se ha quitado ni un dato: estado del reto, locales, tacos, crecimiento,
 * objetivo, días, próxima apertura y las dos capturas de contacto siguen
 * estando. Lo único que baja es la jerarquía.
 *
 * El día se DERIVA de la fecha de inicio, así que avanza solo y nunca puede
 * desincronizarse. Lo único que se guarda es el ajuste de demo. Se monta en
 * cliente para evitar desajustes de hidratación, y por eso la tira reserva su
 * ancho y su alto: sin reserva, al hidratar daría un salto de layout que
 * arrastraría al titular y al CTA.
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

  /* Antes de montar no se puede saber el día, así que la tira enseña el reto
     en seco. Es cierto siempre y ocupa lo mismo, que es lo que importa. */
  const estado = !montado
    ? `Reto ${RETO.totalDias} días`
    : completado
      ? "Reto completado"
      : `Día ${dia}/${RETO.totalDias}`;

  return (
    <div className="w-full">
      {/* ── LA TIRA ──
          En escritorio es una sola fila. En móvil el estado se queda arriba y
          las tres cifras caen a una segunda fila: dos filas como máximo. */}
      <div className="flex flex-wrap items-center gap-2">
        <span
          className="inline-flex items-center gap-2 bg-galos-black text-galos-gold
                     border-2 border-galos-gold/40 rounded-galos-sm px-3 py-2"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-galos-gold animate-pulse-scale flex-shrink-0" />
          {/* El ancho mínimo es la reserva: "Día 7/60" y "Reto completado" no
              miden lo mismo, y sin esto la tira daría un salto al hidratar. */}
          <span className="font-anton uppercase tracking-wide text-[13px] sm:text-[15px] leading-none min-w-[118px] sm:min-w-[132px]">
            {estado}
          </span>
        </span>

        <dl className="inline-flex items-stretch rounded-galos-sm border-2 border-white/20 bg-black/30 overflow-hidden">
          <Cifra valor={montado ? String(locales) : "—"} etiqueta="Locales" destacado />
          <Cifra valor={compacto(RETO.tacos2025)} etiqueta="Tacos 2025" />
          <Cifra valor={`+${RETO.crecimientoPct}%`} etiqueta="vs 2024" />
        </dl>
      </div>

      {/* ── SEGUNDA LÍNEA ──
          El objetivo del reto y la próxima apertura, en pequeño. La franja ya
          no depende de que el reto siga vivo: la próxima apertura existe igual
          el día 61, y con ella las dos únicas capturas de contacto del sitio.
          La reserva de alto va por tramos porque la línea envuelve distinto
          según el ancho: 3 filas en móvil, 2 en tableta, 1 en escritorio. Sin
          ella, al hidratar aparecía la franja y el titular pegaba un salto de
          48 px hacia abajo. */}
      <div className="mt-2 flex flex-wrap items-center gap-x-2.5 gap-y-1
                      min-h-[80px] min-[480px]:min-h-[52px] md:min-h-[32px]">
        <span className="text-[11px] font-bold uppercase tracking-wider text-white/55">
          Objetivo {RETO.objetivoEuros.toLocaleString("es-ES")} € ·{" "}
          {RETO.totalDias} días
        </span>
        {montado && (
          <FranjaApertura
            ciudad={proxima?.city}
            faltan={proxima ? faltan : undefined}
          />
        )}
      </div>
    </div>
  );
}

/** 720000 → "720K". Mismo dato, un tercio de ancho. */
function compacto(n: number) {
  if (n < 1000) return String(n);
  const miles = n / 1000;
  return `${Number.isInteger(miles) ? miles : miles.toFixed(1)}`.replace(".", ",") + "K";
}

function Cifra({
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
        "inline-flex items-baseline gap-1.5 px-2.5 sm:px-3.5 py-2",
        "border-white/15 [&:not(:first-child)]:border-l-2",
        destacado ? "bg-galos-gold text-galos-black" : "text-white"
      )}
    >
      {/*
        dt = término (la etiqueta), dd = valor. En el DOM va dt primero, como
        exige el spec para un <div> dentro de <dl>; el orden visual lo pone
        `order-*`, no el marcado.
      */}
      <dt
        className={cn(
          "order-2 text-[9px] sm:text-[10px] font-black uppercase tracking-wider",
          destacado ? "text-galos-black/70" : "text-white/55"
        )}
      >
        {etiqueta}
      </dt>
      <dd className="order-1 font-anton leading-none text-base sm:text-lg tabular-nums">
        {valor}
      </dd>
    </div>
  );
}
