"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  useMotionValueEvent,
  useReducedMotion,
  type MotionValue,
} from "motion/react";
import { OPTION_GROUPS } from "@/data/options";
import { formatPrice, cn } from "@/lib/utils";

/**
 * MONTA TU GALOS — el taco se construye de verdad.
 *
 * El scroll es la línea de tiempo: la sección se queda clavada y los
 * ingredientes CAEN sobre la tortilla uno a uno, con rebote, giro y sombra
 * que crece al aterrizar. Subes la rueda y vuelven a salir volando.
 *
 * Antes esto fundía cuatro composiciones ya montadas; ahora la tortilla es la
 * base y pollo, patatas, queso y salsa son capas sueltas con alfa que se
 * animan por separado. Por eso se lee como una construcción y no como un
 * pase de diapositivas.
 *
 * RENDIMIENTO: cada capa se mueve con MotionValues encadenados a
 * `useScroll`, así que el movimiento no pasa por React — cero renders por
 * fotograma, solo transform y opacity. El estado de React (etapa, precio,
 * chips) se actualiza únicamente cuando cambia de verdad, no 60 veces por
 * segundo.
 */

const { size, meat, cheese, sauces } = OPTION_GROUPS;

/** Precio del Tacos M, verificado contra las cartas de Glovo. */
const BASE = 9.9;

const ETAPAS = [
  { id: "size", titulo: "EL TAMAÑO", grupo: size },
  { id: "meat", titulo: "LA CARNE", grupo: meat },
  { id: "cheese", titulo: "EL QUESO", grupo: cheese },
  { id: "sauces", titulo: "LAS SALSAS", grupo: sauces },
] as const;

/**
 * Las capas que caen, en orden. Cada una tiene su ventana dentro del
 * progreso total (0..1) y su desvío lateral, para que no aterricen todas en
 * el mismo punto y el montón parezca real.
 */
const CAPAS = [
  { src: "/ingredientes/pollo.webp", desde: 0.26, hasta: 0.46, x: "-4%", y: "4%", ancho: "62%", giro: -9 },
  { src: "/ingredientes/patatas.webp", desde: 0.34, hasta: 0.54, x: "7%", y: "9%", ancho: "58%", giro: 7 },
  { src: "/ingredientes/queso.webp", desde: 0.52, hasta: 0.72, x: "-1%", y: "1%", ancho: "60%", giro: -5 },
  { src: "/ingredientes/algerienne.webp", desde: 0.76, hasta: 0.95, x: "2%", y: "-2%", ancho: "44%", giro: 10 },
] as const;

const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));

/** Una capa de ingrediente cayendo. Todo su movimiento vive fuera de React. */
function Capa({
  capa,
  progreso,
  quieto,
}: {
  capa: (typeof CAPAS)[number];
  progreso: MotionValue<number>;
  quieto: boolean;
}) {
  const { desde, hasta } = capa;
  const t = (f: number) => desde + (hasta - desde) * f;

  /*
    El aterrizaje: cae desde arriba, se pasa de frenada, rebota y se asienta.
    Ese "pasarse y volver" es lo que separa una caída física de un deslizamiento.
  */
  const y = useTransform(progreso, [desde, t(0.62), t(0.8), hasta], ["-150%", "6%", "-2%", "0%"]);
  const giro = useTransform(progreso, [desde, t(0.62), hasta], [capa.giro * 2.4, capa.giro * -0.3, 0]);
  const escala = useTransform(progreso, [desde, t(0.62), t(0.82), hasta], [1.1, 0.97, 1.02, 1]);
  const opacidad = useTransform(progreso, [desde, t(0.22), hasta], [0, 1, 1]);
  /* La sombra se abre cuando el ingrediente toca: da el golpe. */
  const sombraEsc = useTransform(progreso, [desde, t(0.6), t(0.78), hasta], [0.5, 1.12, 0.94, 1]);
  const sombraOp = useTransform(progreso, [desde, t(0.55), hasta], [0, 0.42, 0.34]);

  if (quieto) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={capa.src}
        alt=""
        aria-hidden
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 select-none"
        style={{ width: capa.ancho, marginLeft: capa.x, marginTop: capa.y }}
      />
    );
  }

  return (
    /*
      El centrado va en el ENVOLTORIO y el movimiento en la imagen. Si se
      mezclan, `translateY: "-50%"` y el `y` animado son el mismo componente
      de transform: gana el estatico y se pierden caida, giro y escala.
    */
    <div
      aria-hidden
      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
      style={{ width: capa.ancho, marginLeft: capa.x, marginTop: capa.y }}
    >
      <motion.div
        className="absolute left-1/2 -translate-x-1/2 top-[62%] w-[86%] rounded-[50%] bg-black blur-md"
        style={{ height: "18%", scale: sombraEsc, opacity: sombraOp }}
      />
      <motion.img
        src={capa.src}
        alt=""
        draggable={false}
        className="relative block w-full select-none will-change-transform"
        style={{ y, rotate: giro, scale: escala, opacity: opacidad }}
      />
    </div>
  );
}

export function TacoBuilder() {
  const ref = useRef<HTMLElement>(null);
  const quieto = !!useReducedMotion();

  /*
    El progreso se mide EN VIVO con getBoundingClientRect, no con useScroll.
    useScroll mide la seccion al montar, y en esta pagina las imagenes de
    arriba cargan despues y la desplazan: el progreso se quedaba desfasado
    y los ingredientes caian fuera de su etapa.
    Se escribe en un MotionValue, asi que sigue sin haber un render por
    fotograma: solo transform y opacity.
  */
  const scrollYProgress = useMotionValue(0);
  useEffect(() => {
    if (quieto) return;
    let pendiente = 0;
    const medir = () => {
      pendiente = 0;
      const nodo = ref.current;
      if (!nodo) return;
      const r = nodo.getBoundingClientRect();
      const recorrido = r.height - window.innerHeight;
      scrollYProgress.set(recorrido <= 0 ? 1 : clamp(-r.top / recorrido, 0, 1));
    };
    const alScroll = () => {
      if (!pendiente) pendiente = requestAnimationFrame(medir);
    };
    medir();
    window.addEventListener("scroll", alScroll, { passive: true });
    window.addEventListener("resize", alScroll);
    return () => {
      if (pendiente) cancelAnimationFrame(pendiente);
      window.removeEventListener("scroll", alScroll);
      window.removeEventListener("resize", alScroll);
    };
  }, [scrollYProgress, quieto]);

  /* La tortilla crece de M a XXL durante la primera etapa. */
  const escalaTortilla = useTransform(scrollYProgress, [0, 0.25], [0.58, 1]);

  /*
    Lo único que necesita React: etapa, índices de opción y precio. Se
    recalculan solo cuando CAMBIAN, no en cada fotograma.
  */
  const [v, setV] = useState({ etapa: 0, tam: 0, carne: 0, queso: 0, salsas: 0, p: 0 });

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    const bruto = p * ETAPAS.length;
    const etapa = clamp(Math.floor(bruto), 0, ETAPAS.length - 1);
    const dentro = clamp(bruto - etapa, 0, 1);
    const escan = (n: number, propia: number) =>
      etapa < propia ? 0 : etapa > propia ? n - 1 : clamp(Math.floor(dentro * n), 0, n - 1);
    const next = {
      etapa,
      tam: escan(size.values.length, 0),
      carne: escan(meat.values.length, 1),
      queso: escan(cheese.values.length, 2),
      salsas: clamp(Math.ceil(dentro * (sauces.max ?? 3)), 0, sauces.max ?? 3),
      p: Math.round(p * 100),
    };
    setV((prev) =>
      prev.etapa === next.etapa &&
      prev.tam === next.tam &&
      prev.carne === next.carne &&
      prev.queso === next.queso &&
      prev.salsas === next.salsas &&
      prev.p === next.p
        ? prev
        : next
    );
  });

  const etapaIdx = quieto ? ETAPAS.length - 1 : v.etapa;
  const etapa = ETAPAS[etapaIdx];
  const elegidoTam = size.values[quieto ? size.values.length - 1 : v.tam];
  const elegidaCarne = etapaIdx >= 1 ? meat.values[quieto ? meat.values.length - 1 : v.carne] : null;
  const elegidoQueso = etapaIdx >= 2 ? cheese.values[quieto ? cheese.values.length - 1 : v.queso] : null;
  const precio =
    BASE + (elegidoTam?.delta ?? 0) + (elegidaCarne?.delta ?? 0) + (elegidoQueso?.delta ?? 0);

  const chipActivo = (i: number) => {
    if (quieto) return i === etapa.grupo.values.length - 1;
    if (etapa.id === "sauces") return i < v.salsas;
    if (etapa.id === "size") return i === v.tam;
    if (etapa.id === "meat") return i === v.carne;
    return i === v.queso;
  };

  return (
    <section
      ref={ref}
      id="crea"
      className={cn("relative bg-galos-red", quieto ? "py-20" : "h-[340vh]")}
    >
      <div
        className={cn(
          "overflow-hidden flex flex-col items-center justify-center px-4",
          /* El `pb` crece con la onda que la seccion de promos monta encima:
             sin este aire, la curva cortaba el precio del taco. */
          "pt-[64px] md:pt-[120px] pb-12 sm:pb-20 lg:pb-28",
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

        <div className="relative z-10 flex-1 min-h-0 flex items-center justify-center w-full max-w-sm py-2">
          <motion.div
            role="img"
            aria-label={
              "Tacos Galos " +
              (elegidoTam?.label ?? "") +
              (elegidaCarne ? " con " + elegidaCarne.label : " sin relleno") +
              (elegidoQueso ? ", " + elegidoQueso.label : "") +
              (etapaIdx >= 3 ? " y salsa" : "")
            }
            className="relative h-full max-h-[360px] aspect-square will-change-transform"
            style={quieto ? undefined : { scale: escalaTortilla }}
          >
            {/* Sombra de la tortilla sobre el fondo */}
            <div
              aria-hidden
              className="absolute left-1/2 bottom-[4%] h-[9%] w-[74%] -translate-x-1/2 rounded-[50%] bg-black/45 blur-lg"
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/taco/estado-0-base.webp"
              alt=""
              aria-hidden
              draggable={false}
              className="absolute inset-0 h-full w-full select-none object-contain drop-shadow-[0_18px_22px_rgba(0,0,0,.45)]"
            />
            {CAPAS.map((c) => (
              <Capa key={c.src} capa={c} progreso={scrollYProgress} quieto={quieto} />
            ))}
          </motion.div>

          <motion.span
            aria-hidden
            key={elegidoTam?.id}
            initial={quieto ? false : { scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 500, damping: 22 }}
            className="absolute right-2 top-2 bg-galos-gold text-galos-black font-anton text-xl sm:text-2xl px-3 py-1 rounded-full border-[3px] border-galos-black shadow-hard-sm select-none"
          >
            {elegidoTam?.label}
          </motion.span>
        </div>

        <ul className="relative z-10 mt-4 flex flex-wrap content-start items-start justify-center gap-2 max-w-xl h-[76px] sm:h-[72px] overflow-hidden">
          {etapa.grupo.values.map((val, i) => {
            const on = chipActivo(i);
            return (
              <motion.li
                key={val.id}
                animate={quieto ? undefined : { scale: on ? 1.06 : 1 }}
                transition={{ type: "spring", stiffness: 480, damping: 26 }}
                className={cn(
                  "px-3.5 py-1.5 rounded-full border-2 font-black uppercase text-[11px] sm:text-xs tracking-wide transition-colors duration-200",
                  on ? "border-white bg-white text-galos-red" : "border-white/40 text-white/75"
                )}
              >
                {val.label}
                {val.delta > 0 && (
                  <span className="ml-1.5 opacity-70">+{formatPrice(val.delta)}</span>
                )}
              </motion.li>
            );
          })}
        </ul>

        <div className="relative z-10 mt-5 flex items-baseline gap-2">
          <span className="text-white/60 font-black uppercase text-[11px] tracking-widest">
            Tu Galos
          </span>
          <span className="font-anton text-galos-gold text-4xl sm:text-5xl tabular-nums">
            {formatPrice(precio)}
          </span>
        </div>

        {!quieto && (
          <div
            aria-hidden
            className="relative z-10 mt-5 w-40 h-1.5 rounded-full bg-white/20 overflow-hidden shrink-0"
          >
            <motion.div
              className="h-full bg-galos-gold origin-left"
              style={{ scaleX: scrollYProgress }}
            />
          </div>
        )}
      </div>
    </section>
  );
}
