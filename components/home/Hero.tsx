"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  useReducedMotion,
  type MotionValue,
} from "motion/react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Marcador } from "@/components/home/Marcador";
import { useCartStore } from "@/store/cartStore";
import { useLocationStore } from "@/store/locationStore";
import { useUIStore } from "@/store/uiStore";
import { STORES } from "@/data/stores";
import { ENTRADA, MICRO, AMBIENTE } from "@/components/motion/patrones";
import { cn } from "@/lib/utils";

/**
 * Entrada del hero, escalonada con muelle.
 *
 * El escalón es corto a propósito: el <h1> es casi seguro el elemento LCP y
 * arrancar oculto retrasa su pintado, así que el titular entra de los primeros
 * y la cadena entera acaba en menos de 0,9 s. Nada de entradas de tres
 * segundos.
 */
const MUELLE = ENTRADA;

const CONTENEDOR = {
  oculto: {},
  visible: { transition: { staggerChildren: 0.06, delayChildren: 0.04 } },
};
/** Sube con un punto de pasada: el overshoot es lo que le da vida. */
const PIEZA = {
  oculto: { opacity: 0, y: 26 },
  visible: { opacity: 1, y: 0, transition: MUELLE },
};
/** Para las pegatinas, que ya vienen giradas: entran solo con escala. */
const PEGATINA = {
  oculto: { opacity: 0, scale: 0.6 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: ENTRADA,
  },
};
const QUIETO = { oculto: { opacity: 1 }, visible: { opacity: 1 } };

/* ────────────────────────────────────────────────────────────────────
   Los recortes de comida que entran por los bordes.

   No repiten la composición de "Cada capa cuenta": allí orbitan enteros
   alrededor del titular, aquí son piezas grandes que asoman desde fuera del
   encuadre y de las que se ve solo un trozo. Son de escaparate, no de bodegón.

   Casi todas viven a la derecha o abajo, y eso es geometría, no capricho: la
   columna de texto se pega al borde izquierdo en cuanto la ventana baja de
   ~1300 px, así que un recorte a la izquierda se comería el titular. La
   tortilla solo aparece en 2xl, donde por fin hay margen.
   ──────────────────────────────────────────────────────────────────── */
type Pieza = {
  id: string;
  /** Sitio y tamaño. Los porcentajes negativos son el sangrado buscado. */
  pos: string;
  /** Flotación ambiental: mucho más lenta que la entrada. */
  dur: number;
  amp: number;
  giro: number;
  vaiven: number;
  retraso: number;
  /** 1 = primer plano. Manda en cursor, escala y sombra. */
  prof: number;
  /** A dónde se va al hacer scroll: se separan hacia afuera. */
  fuga: { x: number; y: number };
  /** false = se sustituye por un pixel transparente en móvil y no se descarga. */
  enMovil: boolean;
  /** Desde qué ancho se descarga. Tiene que coincidir con el breakpoint de
      `pos`, o el navegador se baja un recorte que nunca va a enseñar. */
  desde?: string;
};

const PIEZAS: Pieza[] = [
  {
    id: "queso",
    /* En movil solo asoman queso y patatas, y asoman DE VERDAD: antes
       eran astillas de 38 px que se leian como un recorte accidental. La
       pieza es mas grande y entra por el hueco que queda entre el marcador
       y el titular, a la derecha. */
    pos: "right-[-25%] top-[26%] w-[41%] sm:right-[-8%] sm:top-[-6%] sm:w-[26%]",
    dur: 7.4,
    amp: 8,
    giro: -8,
    vaiven: 2.2,
    retraso: 0,
    prof: 1,
    fuga: { x: 34, y: -60 },
    enMovil: true,
  },
  {
    id: "pollo",
    pos: "hidden sm:block right-[-7%] bottom-[-16%] w-[22%]",
    dur: 9.1,
    amp: 6,
    giro: 11,
    vaiven: 1.4,
    retraso: 1.6,
    prof: 0.88,
    fuga: { x: 26, y: 34 },
    enMovil: false,
    desde: "(min-width: 640px)",
  },
  {
    id: "patatas",
    /* La que se queda atrás al salir: baja mientras el resto sube. */
    /* En movil las patatas entran por el borde INFERIOR, no por el
       lateral: a 430 px los badges arrancan en x=29 y no queda margen
       izquierdo. Debajo de ellos si hay banda libre, y el desplazamiento va
       en pixeles porque el alto del hero cambia con el envolvido del texto
       —en porcentaje, lo que encaja a 400 se comia los badges a 430. */
    pos: "left-[-10%] bottom-[-84px] w-[50%] sm:left-[6%] sm:bottom-[-22%] sm:w-[19%]",
    dur: 8.2,
    amp: 10,
    giro: 7,
    vaiven: 2.8,
    retraso: 0.8,
    prof: 0.95,
    fuga: { x: -18, y: 96 },
    enMovil: true,
  },
  {
    id: "tortilla",
    pos: "hidden 2xl:block left-[-9%] top-[26%] w-[15%]",
    dur: 10.4,
    amp: 5,
    giro: -13,
    vaiven: 1.8,
    retraso: 2.4,
    prof: 0.68,
    fuga: { x: -30, y: -26 },
    enMovil: false,
    desde: "(min-width: 1536px)",
  },
];

/** Pixel transparente: el móvil no descarga los recortes que no va a enseñar. */
const NADA =
  "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";

function Recorte({
  pieza,
  progreso,
  raton,
  quieto,
}: {
  pieza: Pieza;
  progreso: MotionValue<number>;
  raton: { x: MotionValue<number>; y: MotionValue<number> };
  quieto: boolean;
}) {
  /*
    Reacción al cursor. NO es perseguirlo: el ratón va de -1 a 1 de lado a lado
    del hero y la pieza recorre como mucho 14 px, así que el gesto se lee como
    profundidad y no como un objeto que te sigue. Lo de cerca se mueve más que
    lo de lejos, igual que al mirar por la ventanilla de un tren.
  */
  const alcance = 14 * pieza.prof;
  const ratonX = useTransform(raton.x, [-1, 1], [-alcance, alcance]);
  const ratonY = useTransform(raton.y, [-1, 1], [-alcance * 0.62, alcance * 0.62]);

  const fugaX = useTransform(progreso, [0, 1], [0, pieza.fuga.x]);
  const fugaY = useTransform(progreso, [0, 1], [0, pieza.fuga.y]);

  /* Cursor y scroll comparten componente de transform, así que se suman aquí
     en lugar de pelearse por el mismo nodo. */
  const x = useTransform([ratonX, fugaX], ([a, b]: number[]) => a + b);
  const y = useTransform([ratonY, fugaY], ([a, b]: number[]) => a + b);

  const src = "/ingredientes/" + pieza.id + ".webp?v=1";

  return (
    <div aria-hidden className={cn("pointer-events-none absolute z-[2]", pieza.pos)}>
      <motion.div style={quieto ? undefined : { x, y }}>
        <motion.div
          className="will-change-transform"
          animate={quieto ? undefined : { y: [-pieza.amp, pieza.amp, -pieza.amp] }}
          transition={{
            duration: pieza.dur,
            ease: "easeInOut",
            repeat: Infinity,
            delay: pieza.retraso,
          }}
        >
          <motion.div
            className="will-change-transform"
            style={{ rotate: pieza.giro, scale: 0.72 + pieza.prof * 0.28 }}
            animate={
              quieto
                ? undefined
                : {
                    rotate: [
                      pieza.giro - pieza.vaiven,
                      pieza.giro + pieza.vaiven,
                      pieza.giro - pieza.vaiven,
                    ],
                  }
            }
            transition={{
              duration: pieza.dur * 1.31,
              ease: "easeInOut",
              repeat: Infinity,
              delay: pieza.retraso * 0.6,
            }}
          >
            <picture>
              {/* Sin esto, `hidden sm:block` esconde el recorte pero el
                  navegador se lo descarga igual: 50 KB de móvil tirados. */}
              {!pieza.enMovil && <source media={pieza.desde} srcSet={src} />}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={pieza.enMovil ? src : NADA}
                alt=""
                draggable={false}
                decoding="async"
                /* Decoracion: nunca debe competir con la fuente ni con el
                   titular. Medido que no perjudica al LCP — el recorte que
                   Lighthouse marca como LCP en movil tarda 0 ms en cargar; lo
                   que retrasa el pintado son 4,1 s de hilo principal. */
                fetchPriority="low"
                className="block w-full h-auto select-none"
                style={{
                  filter: `drop-shadow(0 ${16 * pieza.prof}px ${20 / pieza.prof}px rgba(0,0,0,${
                    0.3 * pieza.prof
                  }))`,
                }}
              />
            </picture>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}

export function Hero() {
  const router = useRouter();
  const quieto = !!useReducedMotion();
  const ref = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  /*
    Coreografía de salida. El hero no se apaga: se va. Cada bloque sube a su
    propia velocidad, de arriba abajo, de modo que el marcador abandona la
    escena mucho antes que el botón. El CTA es el que menos se mueve a
    propósito: sigue ahí, legible, hasta que la sección casi ha salido.
  */
  const yMarcador = useTransform(scrollYProgress, [0, 1], [0, -164]);
  const yTitular = useTransform(scrollYProgress, [0, 1], [0, -84]);
  const xLinea1 = useTransform(scrollYProgress, [0, 1], [0, -18]);
  const xLinea2 = useTransform(scrollYProgress, [0, 1], [0, 14]);
  const yTexto = useTransform(scrollYProgress, [0, 1], [0, -56]);
  const ySelector = useTransform(scrollYProgress, [0, 1], [0, -38]);
  const yCta = useTransform(scrollYProgress, [0, 1], [0, -14]);
  const yBadges = useTransform(scrollYProgress, [0, 1], [0, -26]);
  /* Las dos pegatinas salen a velocidades muy distintas: la de arriba se va
     pronto y la del descuento se queda rezagada. Esa es la intención de la
     transición hacia la sección siguiente. */
  const yPegaA = useTransform(scrollYProgress, [0, 1], [0, -186]);
  const yPegaB = useTransform(scrollYProgress, [0, 1], [0, -34]);
  const yAdorno = useTransform(scrollYProgress, [0, 1], [0, -72]);

  /*
    Puntero normalizado a [-1, 1] sobre el hero. Se escribe en MotionValues, no
    en estado: ni un render de React por movimiento del ratón. El muelle es
    blando y lento a propósito — el objetivo es que la escena respire detrás del
    cursor, no que reaccione al milímetro.
  */
  const punteroX = useMotionValue(0);
  const punteroY = useMotionValue(0);
  const muelleRaton = AMBIENTE;
  const raton = {
    x: useSpring(punteroX, muelleRaton),
    y: useSpring(punteroY, muelleRaton),
  };

  useEffect(() => {
    if (quieto) return;
    /* Sin cursor fino no hay nada que seguir: en táctil ni se engancha. */
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const nodo = ref.current;
    if (!nodo) return;

    /* La caja se cachea y se refresca al hacer scroll o redimensionar. Leerla
       en cada pointermove obligaría al navegador a recalcular el layout justo
       mientras Motion está escribiendo transforms. */
    let caja = nodo.getBoundingClientRect();
    const remedir = () => {
      caja = nodo.getBoundingClientRect();
    };
    const mover = (e: PointerEvent) => {
      if (caja.width === 0 || caja.height === 0) return;
      punteroX.set(((e.clientX - caja.left) / caja.width) * 2 - 1);
      punteroY.set(((e.clientY - caja.top) / caja.height) * 2 - 1);
    };
    const soltar = () => {
      punteroX.set(0);
      punteroY.set(0);
    };

    window.addEventListener("pointermove", mover, { passive: true });
    window.addEventListener("pointerleave", soltar);
    window.addEventListener("scroll", remedir, { passive: true });
    window.addEventListener("resize", remedir);
    return () => {
      window.removeEventListener("pointermove", mover);
      window.removeEventListener("pointerleave", soltar);
      window.removeEventListener("scroll", remedir);
      window.removeEventListener("resize", remedir);
    };
  }, [quieto, punteroX, punteroY]);

  const type = useCartStore((s) => s.type);
  const setType = useCartStore((s) => s.setType);
  const openLocator = useUIStore((s) => s.openLocator);
  const storeId = useLocationStore((s) => s.storeId);
  const store = STORES.find((s) => s.id === storeId);

  /**
   * Si el usuario pulsa "Empezar pedido" sin local, abrimos el locator y dejamos
   * un flag. Cuando aparece storeId, redirigimos a /carta automáticamente.
   */
  const [pendingStart, setPendingStart] = useState(false);
  useEffect(() => {
    if (pendingStart && storeId) {
      setPendingStart(false);
      router.push("/carta");
    }
  }, [pendingStart, storeId, router]);

  const handleStart = () => {
    if (storeId) {
      router.push("/carta");
    } else {
      setPendingStart(true);
      openLocator();
    }
  };

  return (
    <section
      ref={ref}
      id="inicio"
      className="relative bg-galos-red text-white overflow-hidden pt-[80px] md:pt-[132px] pb-24 sm:pb-14 lg:pb-20"
    >
      {/* ── FONDO ────────────────────────────────────────────────────────
          Todo CSS, cero bytes de imagen. El orden importa: trama, resplandor
          detrás del titular, adornos gigantes, y por último la viñeta, que es
          la que hunde los bordes y hace que el blanco del titular pese. */}
      <div aria-hidden className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,255,255,.12),transparent_50%),radial-gradient(circle_at_10%_90%,rgba(0,0,0,.25),transparent_50%)]" />
        <div
          className="absolute inset-0 opacity-60"
          style={{
            backgroundImage:
              "linear-gradient(135deg, rgba(255,255,255,.05) 25%, transparent 25%), linear-gradient(225deg, rgba(255,255,255,.05) 25%, transparent 25%)",
            backgroundSize: "30px 30px",
          }}
        />

        {/* Resplandor detrás del titular. Sigue a la columna de texto, no al
            centro de la pantalla: en escritorio el titular está a la izquierda. */}
        <div className="absolute left-1/2 lg:left-[30%] top-[52%] lg:top-[48%] -translate-x-1/2 -translate-y-1/2 w-[120%] lg:w-[70%] aspect-[2/1] bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,.17),rgba(255,255,255,.05)_45%,transparent_70%)]" />

        {/* Dos adornos y ni uno más. Aro enorme a la derecha y lettering de
            marca abajo, los dos casi invisibles y con su propio parallax. */}
        <motion.div
          className="absolute -right-[16vw] -top-[18vw] w-[62vw] h-[62vw] rounded-full border-[3px] border-white/[0.07]"
          style={quieto ? undefined : { y: yAdorno }}
        />
        <motion.span
          className="absolute left-1/2 -translate-x-1/2 bottom-[-6%] font-anton uppercase tracking-tighter leading-none text-[26vw] text-white/[0.045] select-none whitespace-nowrap"
          style={quieto ? undefined : { y: yAdorno }}
        >
          Galos
        </motion.span>

        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_42%,transparent_38%,rgba(0,0,0,.42)_100%)]" />
      </div>

      {/* ── RECORTES DE COMIDA ──────────────────────────────────────────── */}
      {PIEZAS.map((p) => (
        <Recorte key={p.id} pieza={p} progreso={scrollYProgress} raton={raton} quieto={quieto} />
      ))}

      {/* ── CONTENIDO ───────────────────────────────────────────────────── */}
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          className="max-w-2xl xl:max-w-3xl text-center lg:text-left flex flex-col items-center lg:items-start"
          variants={CONTENEDOR}
          initial="oculto"
          animate="visible"
        >
          {/* ── EL MARCADOR ── lo primero que se ve y lo primero que se va */}
          <motion.div
            className="w-full text-left"
            variants={quieto ? QUIETO : PIEZA}
            style={quieto ? undefined : { y: yMarcador }}
          >
            <Marcador />
          </motion.div>

          <motion.div
            className="w-full h-px bg-white/20 my-5 origin-left"
            variants={
              quieto
                ? QUIETO
                : {
                    oculto: { scaleX: 0, opacity: 0 },
                    visible: { scaleX: 1, opacity: 1, transition: MUELLE },
                  }
            }
            style={quieto ? undefined : { y: yTitular }}
          />

          {/* ── TITULAR CINÉTICO ──
              Tres nodos por línea, y cada uno hace una cosa: el de fuera es el
              desplazamiento de scroll, el de en medio la máscara, el de dentro
              el golpe de entrada. Si se juntaran, el último transform escrito
              se comería a los otros. */}
          <h1 className="font-anton uppercase tracking-wide leading-[0.92] text-[46px] sm:text-6xl lg:text-[80px] xl:text-[96px]">
            <motion.span
              className="block"
              style={quieto ? undefined : { y: yTitular, x: xLinea1 }}
            >
              {/* Una sale desde la izquierda y la otra desde la derecha: el
                  recorrido es corto y rápido, lo justo para que las dos líneas
                  no entren clonadas. Acaban perfectamente alineadas. */}
              <span
                className="tg-golpe block"
                style={{ "--tg-dx": "-30px", "--tg-d": "0.04s" } as React.CSSProperties}
              >
                <span className="tg-sticker block">TU TACO.</span>
              </span>
            </motion.span>

            <motion.span
              className="block mt-1"
              style={quieto ? undefined : { y: yTitular, x: xLinea2 }}
            >
              <span
                className="tg-golpe block"
                style={{ "--tg-dx": "26px", "--tg-d": "0.13s" } as React.CSSProperties}
              >
                <span className="tg-sticker block">TUS REGLAS.</span>
              </span>
            </motion.span>
          </h1>

          <motion.p
            className="mt-4 text-base sm:text-lg max-w-xl text-white leading-relaxed"
            variants={quieto ? QUIETO : PIEZA}
            style={quieto ? undefined : { y: yTexto }}
          >
            Crujiente por fuera. Fundido por dentro.{" "}
            <strong className="text-white">
              Pide directo, recoge rápido y desbloquea promos exclusivas.
            </strong>
          </motion.p>

          {/* Selector delivery / recogida */}
          <motion.div
            className="mt-5 inline-flex bg-black/35 border-2 border-white/40 rounded-full p-1 gap-1"
            variants={quieto ? QUIETO : PIEZA}
            style={quieto ? undefined : { y: ySelector }}
            role="tablist"
          >
            <ModeBtn active={type === "delivery"} onClick={() => setType("delivery")}>
              Delivery
            </ModeBtn>
            <ModeBtn active={type === "pickup"} onClick={() => setType("pickup")}>
              Recogida <span className="opacity-80 text-[11px] ml-1">· 8 min</span>
            </ModeBtn>
          </motion.div>

          {/* CTA principal — abre locator si no hay local, navega si sí */}
          <motion.div
            className="mt-6 w-full flex flex-col items-center lg:items-start gap-3"
            variants={quieto ? QUIETO : PIEZA}
            style={quieto ? undefined : { y: yCta }}
          >
            <Iman quieto={quieto}>
              <Button
                onClick={handleStart}
                size="xl"
                className="group w-full sm:w-auto bg-galos-gold text-galos-black border-galos-black
                           hover:bg-white hover:text-galos-red hover:shadow-hard-lg
                           text-lg sm:text-base px-8 py-5"
              >
                Empezar pedido
                <span className="inline-block transition-transform duration-200 group-hover:translate-x-1.5">
                  →
                </span>
              </Button>
            </Iman>

            <button
              onClick={openLocator}
              /* Sin `aria-label`: el texto visible ("Pidiendo en Mataró ·
                 Cambiar") ya es mejor nombre que cualquiera que inventemos, y
                 uno distinto rompe la correspondencia que pide la WCAG 2.5.3. */
              className="group inline-flex items-stretch overflow-hidden
                         bg-black/30 hover:bg-black/40
                         border-2 border-white/25 hover:border-white/50
                         rounded-full transition-colors text-[12px] sm:text-[13px]"
            >
              <span className="inline-flex items-center gap-1.5 pl-3 pr-2.5 py-1.5 font-bold text-white/85">
                <PinIcon className="w-3.5 h-3.5 text-galos-gold flex-shrink-0" />
                {store ? (
                  <>
                    <span className="text-white/60">Pidiendo en</span>
                    <span className="text-white">{store.city}</span>
                  </>
                ) : (
                  <span>Sin local seleccionado</span>
                )}
              </span>
              <span
                className="inline-flex items-center px-3 py-1.5
                           border-l-2 border-white/20 group-hover:border-white/40
                           font-black uppercase tracking-wider text-[11px]
                           text-galos-gold group-hover:text-galos-black
                           bg-transparent group-hover:bg-galos-gold transition-colors"
              >
                {store ? "Cambiar" : "Elegir local"}
              </span>
            </button>
          </motion.div>

          {/* Los badges entran uno detras de otro, no en bloque. */}
          <motion.ul
            className="mt-7 flex gap-2 flex-wrap justify-center lg:justify-start"
            variants={quieto ? QUIETO : { visible: { transition: { staggerChildren: 0.06 } } }}
            style={quieto ? undefined : { y: yBadges }}
          >
            <motion.li variants={quieto ? QUIETO : PEGATINA}>
              <Badge variant="halal">100% Halal</Badge>
            </motion.li>
            <motion.li variants={quieto ? QUIETO : PEGATINA}>
              <Badge variant="ghost">Sin comisiones extra</Badge>
            </motion.li>
            <motion.li variants={quieto ? QUIETO : PEGATINA}>
              <Badge variant="ghost">-10% 1er pedido</Badge>
            </motion.li>
          </motion.ul>
        </motion.div>
      </div>

      {/*
        Pegatinas. Se mueven con el cursor como los recortes pero a la mitad de
        alcance: están "más pegadas" al plano del texto, y esa diferencia de
        recorrido es lo que las integra en la composición en vez de dejarlas
        flotando encima.
      */}
      {/* Baja a la altura del CTA y se acerca a la columna: la pegatina habla
          de PEDIR, así que tiene que leerse junto al botón y no suelta en el
          aire a la altura del titular. */}
      <PegatinaFlotante
        className="hidden lg:block left-[31%] xl:left-[35%] top-[66%]"
        y={yPegaA}
        raton={raton}
        quieto={quieto}
        retraso={0.42}
        dur={5.2}
        amplitud={9}
        giro={-6}
        vaiven={2.2}
        prof={0.5}
      >
        <span className="block bg-white text-galos-red rounded-full px-5 py-3 font-anton text-xl tracking-wide border-[3px] border-galos-black shadow-hard">
          PIDE DIRECTO
        </span>
      </PegatinaFlotante>

      <PegatinaFlotante
        className="hidden lg:block right-[17%] xl:right-[21%] bottom-[20%]"
        y={yPegaB}
        raton={raton}
        quieto={quieto}
        retraso={0.54}
        dur={4.3}
        amplitud={11}
        giro={10}
        vaiven={-2.6}
        prof={0.32}
      >
        <span className="block bg-galos-gold text-galos-black rounded-full px-5 py-3 font-anton text-xl tracking-wide border-[3px] border-galos-black shadow-hard">
          -10% OFF
        </span>
      </PegatinaFlotante>
    </section>
  );
}

/**
 * Magnetismo del CTA.
 *
 * El área sensible es el padding del envoltorio, no la ventana entera: el botón
 * solo se inclina hacia el cursor cuando ya estás encima o a un dedo de él, y
 * como mucho 4 px. Al salir, el muelle lo devuelve a su sitio. Un botón que
 * cruza media pantalla persiguiendo el ratón es un juguete, no un CTA.
 */
function Iman({ children, quieto }: { children: React.ReactNode; quieto: boolean }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const muelle = MICRO;
  const sx = useSpring(x, muelle);
  const sy = useSpring(y, muelle);
  const TOPE = 4;

  const mover = (e: React.PointerEvent<HTMLDivElement>) => {
    if (quieto || e.pointerType !== "mouse") return;
    const c = e.currentTarget.getBoundingClientRect();
    const dx = (e.clientX - (c.left + c.width / 2)) / (c.width / 2);
    const dy = (e.clientY - (c.top + c.height / 2)) / (c.height / 2);
    x.set(Math.max(-1, Math.min(1, dx)) * TOPE);
    y.set(Math.max(-1, Math.min(1, dy)) * TOPE);
  };
  const soltar = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <div className="p-4 -m-4 w-full sm:w-auto" onPointerMove={mover} onPointerLeave={soltar}>
      <motion.div
        className="w-full sm:w-auto"
        style={quieto ? undefined : { x: sx, y: sy }}
        whileTap={quieto ? undefined : { scale: 0.97 }}
        transition={MICRO}
      >
        {children}
      </motion.div>
    </div>
  );
}

/** Pegatina: entra con rebote, flota, se mueve con el cursor y con el scroll. */
function PegatinaFlotante({
  children,
  className,
  y,
  raton,
  quieto,
  retraso,
  dur,
  amplitud,
  giro,
  vaiven,
  prof,
}: {
  children: React.ReactNode;
  className?: string;
  y: MotionValue<number>;
  raton: { x: MotionValue<number>; y: MotionValue<number> };
  quieto: boolean;
  retraso: number;
  dur: number;
  amplitud: number;
  giro: number;
  vaiven: number;
  prof: number;
}) {
  const alcance = 14 * prof;
  const ratonX = useTransform(raton.x, [-1, 1], [-alcance, alcance]);
  const ratonY = useTransform(raton.y, [-1, 1], [-alcance * 0.6, alcance * 0.6]);
  const total = useTransform([ratonY, y], ([a, b]: number[]) => a + b);

  return (
    /* Cuatro capas a propósito: scroll+cursor fuera, flotación en medio, giro
       dentro. Si compartieran nodo, el último transform se comería a los
       anteriores. */
    <motion.div
      aria-hidden
      className={cn("pointer-events-none absolute z-[5]", className)}
      style={quieto ? undefined : { x: ratonX, y: total }}
      initial={quieto ? false : { opacity: 0, scale: 0.6 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ ...ENTRADA, delay: retraso }}
    >
      <motion.div
        className="will-change-transform"
        animate={quieto ? undefined : { y: [-amplitud, amplitud, -amplitud] }}
        transition={{ duration: dur, ease: "easeInOut", repeat: Infinity, delay: retraso }}
      >
        <motion.div
          style={{ rotate: giro }}
          animate={quieto ? undefined : { rotate: [giro - vaiven, giro + vaiven, giro - vaiven] }}
          transition={{ duration: dur * 1.35, ease: "easeInOut", repeat: Infinity }}
        >
          {children}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

function ModeBtn({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      role="tab"
      aria-selected={active}
      className={cn(
        "px-5 py-2.5 rounded-full font-black uppercase text-[13px] tracking-wide transition-colors",
        active ? "bg-white text-galos-red" : "text-white/75 hover:text-white"
      )}
    >
      {children}
    </button>
  );
}

function PinIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0116 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}
