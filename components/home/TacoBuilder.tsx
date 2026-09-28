"use client";

import { useEffect, useRef, useState } from "react";
import { OPTION_GROUPS } from "@/data/options";
import { formatPrice, cn } from "@/lib/utils";

/**
 * MONTA TU GALOS — sección fija con el scroll como línea de tiempo.
 *
 * No es una animación de entrada. La sección se queda clavada y el scroll
 * AVANZA DENTRO de ella: el taco crece, entran los ingredientes y el precio
 * sube. Subes la rueda y va hacia atrás. El usuario controla la reproducción.
 *
 * Sin librerías: contenedor alto + sticky + listener limitado por rAF.
 *
 * Nombres y recargos salen de data/options.ts, así que el precio que se ve
 * subir no es decorativo.
 */

const { size, meat, cheese, sauces } = OPTION_GROUPS;

/** Precio del Tacos M, verificado contra las cartas de Glovo. */
const BASE = 9.9;

/**
 * Los 4 estados del taco.
 *
 * Cada uno es una imagen COMPLETA con alfa, no una capa suelta de ingrediente:
 * así el cross-fade disimula los pocos píxeles de desalineo que siempre quedan
 * entre generaciones, cosa que un apilado de capas no perdonaría.
 *
 * Se generan encadenando 3 ediciones sobre el estado 0 — ver
 * docs/prompts-taco-secuencia.md. Mientras los archivos no existan se dibuja
 * el taco vectorial de más abajo y la web sigue funcionando igual.
 */
/**
 * El ?v= no es decorativo: public/.htaccess sirve los .webp con
 * `max-age=31536000, immutable`, así que sin cambiar la URL un iPhone que ya
 * haya visto la demo seguiría con los assets viejos. Súbelo al regenerarlos.
 */
const ESTADOS = [
  { src: "/taco/estado-0-base.webp?v=1" },
  { src: "/taco/estado-1-carne.webp?v=1" },
  { src: "/taco/estado-2-queso.webp?v=1" },
  { src: "/taco/estado-3-salsa.webp?v=1" },
] as const;

const ETAPAS = [
  { id: "size", titulo: "EL TAMAÑO", grupo: size },
  { id: "meat", titulo: "LA CARNE", grupo: meat },
  { id: "cheese", titulo: "EL QUESO", grupo: cheese },
  { id: "sauces", titulo: "LAS SALSAS", grupo: sauces },
] as const;

const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));

export function TacoBuilder() {
  const ref = useRef<HTMLElement>(null);
  const escenario = useRef<HTMLDivElement>(null);
  const [progreso, setProgreso] = useState(0);
  const [quieto, setQuieto] = useState(false);
  const [fotos, setFotos] = useState<"cargando" | "listas" | "fallan">("cargando");

  /**
   * Precarga en baja prioridad: son 4 archivos de <60 KB y la sección está muy
   * por debajo del fold, así que no deben competir con el vídeo del hero.
   * decode() es lo que evita el parpadeo en el primer scrub — el atributo
   * decoding="async" no hace nada aquí.
   */
  useEffect(() => {
    let vivo = true;
    Promise.all(
      ESTADOS.map((e) => {
        const img = new Image();
        (img as HTMLImageElement & { fetchPriority?: string }).fetchPriority = "low";
        img.src = e.src;
        return img.decode();
      })
    )
      .then(() => {
        if (vivo) setFotos("listas");
      })
      .catch(() => {
        if (vivo) setFotos("fallan");
      });
    return () => {
      vivo = false;
    };
  }, []);

  useEffect(() => {
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      setQuieto(true);
      setProgreso(1);
      return;
    }

    let pendiente = 0;
    const medir = () => {
      pendiente = 0;
      const nodo = ref.current;
      if (!nodo) return;
      const r = nodo.getBoundingClientRect();
      /**
       * Medimos el escenario en vez de usar window.innerHeight. El carril mide
       * 340vh (viewport grande, barra plegada) y el escenario 100svh, pero
       * innerHeight es el viewport dinámico: en iOS cambia al plegarse la barra
       * de Safari y el denominador saltaba justo al empezar a scrollear.
       */
      const alto = escenario.current?.offsetHeight ?? window.innerHeight;
      const recorrido = r.height - alto;
      if (recorrido <= 0) {
        setProgreso(1);
        return;
      }
      setProgreso(clamp(-r.top / recorrido, 0, 1));
    };
    const alScroll = () => {
      if (pendiente) return;
      pendiente = requestAnimationFrame(medir);
    };

    medir();
    window.addEventListener("scroll", alScroll, { passive: true });
    window.addEventListener("resize", alScroll);
    return () => {
      if (pendiente) cancelAnimationFrame(pendiente);
      window.removeEventListener("scroll", alScroll);
      window.removeEventListener("resize", alScroll);
    };
  }, []);

  const bruto = progreso * ETAPAS.length;
  const etapaIdx = clamp(Math.floor(bruto), 0, ETAPAS.length - 1);
  const dentro = quieto ? 1 : clamp(bruto - etapaIdx, 0, 1);
  const etapa = ETAPAS[etapaIdx];

  /**
   * Índice que "escanea" un grupo de selección única mientras dura su etapa.
   * Antes se iban encendiendo TODOS los chips a la vez, y size/meat/cheese son
   * `selection: "single"`: enseñar seis carnes marcadas a la vez contradice el
   * propio modelo de datos. Ahora se enciende exactamente uno.
   */
  const escaneo = (n: number, etapaPropia: number) => {
    if (quieto) return n - 1;
    if (etapaIdx < etapaPropia) return 0;
    if (etapaIdx > etapaPropia) return n - 1;
    return clamp(Math.floor(dentro * n), 0, n - 1);
  };

  const tamIdx = escaneo(size.values.length, 0);
  const carneIdx = escaneo(meat.values.length, 1);
  const quesoIdx = escaneo(cheese.values.length, 2);

  const elegidoTam = size.values[tamIdx];
  const elegidaCarne = etapaIdx >= 1 ? meat.values[carneIdx] : null;
  const elegidoQueso = etapaIdx >= 2 ? cheese.values[quesoIdx] : null;

  /**
   * Como el escaneo empieza siempre por la opción de +0,00 €, el precio ya no
   * pega un salto seco al entrar en la etapa mientras el ingrediente todavía
   * es invisible: sube a medida que el escaneo avanza y la capa se funde.
   */
  const precio =
    BASE + (elegidoTam?.delta ?? 0) + (elegidaCarne?.delta ?? 0) + (elegidoQueso?.delta ?? 0);

  /** El tamaño M->XXL es escala CSS, no imágenes distintas. */
  const escala = quieto ? 1 : 0.55 + clamp(bruto, 0, 1) * 0.45;

  /** Las salsas sí son multi, pero con tope: data/options.ts dice max 3. */
  const topeSalsas = sauces.max ?? sauces.values.length;
  const salsasEntradas = quieto
    ? topeSalsas
    : clamp(Math.ceil(dentro * topeSalsas), 0, topeSalsas);

  const chipActivo = (i: number) => {
    if (etapa.id === "sauces") return i < salsasEntradas;
    if (etapa.id === "size") return i === tamIdx;
    if (etapa.id === "meat") return i === carneIdx;
    return i === quesoIdx;
  };

  /** El estado 0 siempre está; cada siguiente entra durante su propia etapa. */
  const opacidadDe = (i: number) => {
    if (i === 0) return 1;
    return quieto ? 1 : clamp(bruto - i, 0, 1);
  };

  return (
    /**
     * Con prefers-reduced-motion no basta con congelar la animación: si el
     * carril siguiera midiendo 340vh quedarían ~2,4 pantallas de scroll muerto
     * con la imagen quieta. Ahí la sección pasa a ser una sección normal.
     */
    <section
      ref={ref}
      id="crea"
      className={cn("relative bg-galos-red", quieto ? "py-20" : "h-[340vh]")}
    >
      <div
        ref={escenario}
        className={cn(
          "overflow-hidden flex flex-col items-center justify-center px-4",
          // El header es fixed (64px en móvil; 44+76=120 en escritorio). Sin
          // reservarlo se comía el borde superior de la cabecera de etapa.
          "pt-[64px] md:pt-[120px] pb-6",
          quieto ? "min-h-[70svh]" : "sticky top-0 h-[100svh]"
        )}
      >
        <div aria-hidden className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(255,255,255,.12),transparent_55%),radial-gradient(circle_at_10%_95%,rgba(0,0,0,.4),transparent_55%)]" />
          <div
            className="absolute inset-0 opacity-40"
            style={{
              backgroundImage:
                "linear-gradient(135deg, rgba(255,255,255,.05) 25%, transparent 25%), linear-gradient(225deg, rgba(255,255,255,.05) 25%, transparent 25%)",
              backgroundSize: "34px 34px",
            }}
          />
        </div>

        <div className="relative z-10 flex items-center gap-3 mb-1">
          <span className="font-anton text-galos-gold text-lg sm:text-xl tabular-nums">
            0{etapaIdx + 1}
          </span>
          <span className="h-px w-8 bg-white/40" />
          <h2 className="font-anton uppercase text-white text-2xl sm:text-4xl tracking-wide">
            {etapa.titulo}
          </h2>
        </div>
        <p className="relative z-10 text-white/70 font-semibold text-sm mb-5">
          Monta tu Galos sin soltar la rueda
        </p>

        {/*
          flex-1 en vez de una altura en svh: el taco se queda con el espacio
          que sobre, sea cual sea el viewport. Calibrar un porcentaje de svh
          era frágil (el svh real de Safari no es el alto de pantalla) y en
          horizontal el overflow-hidden acababa recortando el precio.
          El tope de 400px mantiene la caja dentro del max-w-xs: 400*0.8 = 320.
        */}
        <div className="relative z-10 flex-1 min-h-0 flex items-center justify-center w-full max-w-sm py-2">
          {/*
            El badge de tamaño va DENTRO del contenedor escalado y se
            contra-escala, para que siga pegado a la esquina del taco cuando es
            pequeño en vez de quedarse flotando en el borde de la caja.

            La sombra va AQUÍ y no en cada <img>: con una sombra por capa se
            apilaban las cuatro y el negro pasaba de 45% a 91% según avanzaba
            el scrub, además de cuatro desenfoques por fotograma.
          */}
          <div
            role="img"
            /**
             * La descripción va aquí y no en un alt por capa: antes el alt
             * describía el taco COMPLETO mientras en pantalla había uno vacío.
             */
            aria-label={
              "Tacos Galos " +
              (elegidoTam?.label ?? "") +
              (elegidaCarne ? " con " + elegidaCarne.label : " sin relleno") +
              (elegidoQueso ? ", " + elegidoQueso.label : "") +
              (etapaIdx >= 3 ? " y salsa" : "")
            }
            /*
              Cuadrado, no 4:5. La secuencia se monta sobre la tortilla
              REDONDA abierta —que es como se hace de verdad un french tacos—,
              y un círculo en un marco vertical deja dos franjas muertas.
              El tope de 360px lo mantiene dentro del max-w-sm (384px).
            */
            className="relative h-full max-h-[360px] aspect-square"
            style={{ transform: "scale(" + escala + ")" }}
          >
            {/*
              La sombra envuelve SOLO las capas del taco. Si se pone en cada
              <img> se apilan las cuatro (el negro sube de 45% a 91% durante el
              scrub y son 4 desenfoques por fotograma); si se pone en el padre,
              se la come también el badge, que ya tiene su shadow-hard-sm.
            */}
            <div className="absolute inset-0 drop-shadow-[0_18px_22px_rgba(0,0,0,.45)]">
            {fotos === "listas" ? (
              ESTADOS.map((e, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={e.src}
                  src={e.src}
                  alt=""
                  aria-hidden
                  draggable={false}
                  /**
                   * pointer-events-none + touch-callout: parar el scrub con el
                   * dedo encima del taco es justo la interacción que pedimos, y
                   * en iOS eso abre el menú "Guardar imagen".
                   */
                  className="absolute inset-0 h-full w-full object-contain select-none pointer-events-none [-webkit-touch-callout:none]"
                  style={{ opacity: opacidadDe(i) }}
                />
              ))
            ) : (
              <svg
                viewBox="0 0 120 190"
                aria-hidden
                className="absolute inset-0 h-full w-full"
              >
                <rect x="4" y="4" width="112" height="182" rx="14" fill="#F3D9A4" stroke="#0F0F0F" strokeWidth="5" />
                {[0, 1, 2, 3, 4].map((i) => (
                  <path
                    key={i}
                    d={"M8 " + (34 + i * 32) + " L112 " + (14 + i * 32)}
                    stroke="#C99A0A"
                    strokeWidth="3"
                    opacity={0.55}
                  />
                ))}
                {etapaIdx >= 1 && (
                  <rect x="18" y="118" width="84" height="26" rx="8" fill="#8B3A14" opacity={etapaIdx === 1 ? dentro : 1} />
                )}
                {etapaIdx >= 2 && (
                  <rect x="18" y="92" width="84" height="22" rx="8" fill="#F5C518" opacity={etapaIdx === 2 ? dentro : 1} />
                )}
                {etapaIdx >= 3 && (
                  <rect x="18" y="70" width="84" height="18" rx="7" fill="#E30613" opacity={dentro} />
                )}
              </svg>
            )}
            </div>

            {/*
              Contra-escala CAPADA a 1,25. Con 1/escala pura, al principio el
              badge se ampliaba 1,82x sobre un taco al 55% y se comía media
              imagen; capándola encoge con el taco pero sigue legible.
            */}
            <span
              aria-hidden
              className="absolute -top-2 -right-2 bg-galos-gold text-galos-black font-anton text-xl sm:text-2xl px-3 py-1 rounded-full border-[3px] border-galos-black shadow-hard-sm select-none"
              style={{
                transform: "scale(" + Math.min(1 / escala, 1.25) + ")",
                transformOrigin: "top right",
              }}
            >
              {elegidoTam?.label}
            </span>
          </div>
        </div>

        {/*
          Altura FIJA, no min-h: las salsas son 7 chips y ocupan una fila más
          que el resto, así que al cambiar de etapa la lista crecía y empujaba
          al taco y al título arriba y abajo. content-start evita que las filas
          se recoloquen al centro cuando sobra sitio.
        */}
        <ul className="relative z-10 mt-4 flex flex-wrap content-start items-start justify-center gap-2 max-w-xl h-[76px] sm:h-[72px] overflow-hidden">
          {etapa.grupo.values.map((v, i) => (
            <li
              key={v.id}
              className={cn(
                "px-3.5 py-1.5 rounded-full border-2 font-black uppercase text-[11px] sm:text-xs tracking-wide transition-all duration-200",
                chipActivo(i)
                  ? "border-white bg-white text-galos-red"
                  : // Antes white/40 sobre rojo: ~1,2:1 de contraste, o sea
                    // ilegible en vez de atenuado.
                    "border-white/40 text-white/75"
              )}
            >
              {v.label}
              {v.delta > 0 && <span className="ml-1.5 opacity-70">+{formatPrice(v.delta)}</span>}
            </li>
          ))}
        </ul>

        <div className="relative z-10 mt-5 flex items-baseline gap-2">
          <span className="text-white/60 font-black uppercase text-[11px] tracking-widest">
            Tu Galos
          </span>
          <span className="font-anton text-galos-gold text-4xl sm:text-5xl tabular-nums">
            {formatPrice(precio)}
          </span>
        </div>

        {/* Sin scrub que medir, una barra clavada al 100% solo confunde. */}
        {!quieto && (
          <div
            aria-hidden
            className="relative z-10 mt-5 w-40 h-1.5 rounded-full bg-white/20 overflow-hidden shrink-0"
          >
            <div className="h-full bg-galos-gold" style={{ width: progreso * 100 + "%" }} />
          </div>
        )}
      </div>
    </section>
  );
}
