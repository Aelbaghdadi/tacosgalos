"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  useReducedMotion,
  type MotionValue,
} from "motion/react";
import { Onda } from "@/components/ui/Onda";
import { cn } from "@/lib/utils";

/**
 * CADA CAPA CUENTA — titular grande con los ingredientes suspendidos alrededor.
 *
 * Los seis recortes salen de data/options.ts y de lo que de verdad lleva un
 * french tacos. SIN VEGETALES: aquí no hay lechuga ni tomate, que es lo que
 * diferencia un french tacos de un kebab o una hamburguesa.
 *
 * Los recortes FLOTAN, y la gracia está en que cada uno flota a su ritmo:
 * duración, recorrido, giro y retardo distintos por ingrediente. Si los seis
 * compartieran periodo el conjunto respiraría a la vez y parecería un carrusel;
 * con periodos primos entre sí las fases nunca vuelven a coincidir y el
 * movimiento se lee como orgánico. El giro además va a otra duración que el
 * vaivén vertical, así que ni siquiera cada pieza se repite a sí misma.
 *
 * El titular manda: los recortes van en z-0, el texto en z-10, y las amplitudes
 * son de pocos píxeles. Con `prefers-reduced-motion` todo queda quieto y
 * visible.
 */

type Ingrediente = {
  id: string;
  nombre: string;
  /** De dónde sale en la carta, para no inventarnos ingredientes. */
  origen: string;
  pos: string;
  ancho: string;
  /** Giro base del recorte. El vaivén oscila alrededor de este valor. */
  giro: number;
  /** false = se oculta en móvil, para que no tape el titular. */
  enMovil: boolean;

  /* ── Flotación ── todo distinto en cada uno, ese es el objetivo ── */
  /** Segundos del ciclo vertical. */
  dur: number;
  /** Píxeles de recorrido vertical a cada lado (en escritorio). */
  amplitud: number;
  /** Grados que se abre el giro a cada lado del giro base. */
  vaiven: number;
  /** Segundos de retardo del bucle: desfasa el arranque de cada pieza. */
  retraso: number;

  /* ── Convergencia ── */
  /**
   * Desplazamiento MAXIMO hacia el centro, en px de escritorio, al final del
   * recorrido de scroll. Apunta al centro de la composicion, pero la magnitud
   * NO es proporcional a la distancia: la manda la holgura con el titular.
   */
  atrae: { x: number; y: number };

  /* ── Profundidad ── */
  /** 1 = primer plano. <1 = algo más lejos: más pequeño y con menos sombra. */
  prof: number;
  /** Desenfoque en px. Solo en las salsas, y casi imperceptible. */
  desenfoque: number;
};

const INGREDIENTES: Ingrediente[] = [
  {
    id: "tortilla",
    nombre: "Tortilla de trigo",
    origen: "la base de todo Galos",
    pos: "left-[-3%] top-[2%] sm:left-[3%] sm:top-[8%]",
    ancho: "w-[30%] sm:w-[24%] lg:w-[19%]",
    giro: -14,
    enMovil: true,
    dur: 5.6,
    amplitud: 10,
    vaiven: 2.4,
    retraso: 0,
    atrae: { x: 16, y: 8 },
    prof: 1,
    desenfoque: 0,
  },
  {
    id: "pollo",
    nombre: "Pollo",
    origen: "options.meat · pollo",
    pos: "right-[-3%] top-[0%] sm:right-[5%] sm:top-[5%]",
    ancho: "w-[28%] sm:w-[21%] lg:w-[16%]",
    giro: 13,
    enMovil: true,
    dur: 4.2,
    amplitud: 14,
    vaiven: 1.6,
    retraso: 0.9,
    atrae: { x: -24, y: 10 },
    prof: 1,
    desenfoque: 0,
  },
  {
    id: "patatas",
    nombre: "Patatas fritas",
    origen: "options.extras · patatas_extra",
    pos: "left-[-4%] bottom-0 sm:left-[7%] sm:bottom-[8%]",
    ancho: "w-[27%] sm:w-[22%] lg:w-[17%]",
    giro: 9,
    enMovil: true,
    dur: 6.1,
    amplitud: 8,
    vaiven: 3,
    retraso: 0.35,
    atrae: { x: 12, y: -4 },
    prof: 1,
    desenfoque: 0,
  },
  {
    id: "queso",
    nombre: "Doble fundido",
    origen: "options.cheese · doble",
    pos: "right-[-4%] bottom-0 sm:right-[4%] sm:bottom-[6%]",
    ancho: "w-[27%] sm:w-[22%] lg:w-[17%]",
    giro: -11,
    enMovil: true,
    dur: 4.9,
    amplitud: 12,
    vaiven: 2,
    retraso: 1.4,
    atrae: { x: -16, y: -8 },
    prof: 1,
    desenfoque: 0,
  },
  {
    id: "algerienne",
    nombre: "Algerienne",
    origen: "options.sauces · algerienne",
    pos: "left-[36%] top-[-3%]",
    ancho: "w-[20%] sm:w-[13%] lg:w-[11%]",
    giro: -22,
    enMovil: false,
    dur: 3.7,
    amplitud: 7,
    vaiven: 3.6,
    retraso: 0.6,
    atrae: { x: 14, y: 30 },
    prof: 0.93,
    desenfoque: 0.5,
  },
  {
    id: "harissa",
    nombre: "Harissa",
    origen: "options.sauces · harissa",
    pos: "right-[33%] bottom-[-3%]",
    ancho: "w-[20%] sm:w-[13%] lg:w-[11%]",
    giro: 18,
    enMovil: false,
    dur: 5.3,
    amplitud: 9,
    vaiven: 2.8,
    retraso: 1.1,
    atrae: { x: -22, y: -14 },
    prof: 0.95,
    desenfoque: 0.4,
  },
];

/** En móvil el recorrido se recorta a un 62%: mismo gesto, menos aspaviento. */
const FACTOR_MOVIL = 0.62;

/**
 * Progreso de la sección al pasar por la ventana, 0 → 1, medido en vivo.
 *
 * No se usa `useScroll` a propósito: mide el objetivo al montar, y esta
 * sección va tan abajo que las imágenes de arriba terminan de cargar después
 * y la desplazan. El progreso quedaba clavado y el parallax no se movía. Con
 * `getBoundingClientRect` en cada scroll la medida no puede quedarse vieja.
 */
function useProgresoSeccion(
  ref: React.RefObject<HTMLElement>,
  activo: boolean
) {
  const progreso = useMotionValue(0.5);
  useEffect(() => {
    if (!activo) return;
    let pendiente = 0;
    const medir = () => {
      pendiente = 0;
      const nodo = ref.current;
      if (!nodo) return;
      const r = nodo.getBoundingClientRect();
      const recorrido = window.innerHeight + r.height;
      const avance = (window.innerHeight - r.top) / recorrido;
      progreso.set(Math.min(1, Math.max(0, avance)));
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
  }, [ref, progreso, activo]);
  return progreso;
}

function useEsMovil() {
  const [movil, setMovil] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 639px)");
    const leer = () => setMovil(mq.matches);
    leer();
    mq.addEventListener("change", leer);
    return () => mq.removeEventListener("change", leer);
  }, []);
  return movil;
}

function Recorte({
  ing,
  progreso,
  quieto,
  movil,
}: {
  ing: Ingrediente;
  progreso: MotionValue<number>;
  quieto: boolean;
  movil: boolean;
}) {
  const [falla, setFalla] = useState(false);
  const src = "/ingredientes/" + ing.id + ".webp?v=1";

  /*
    Deriva de scroll: dos cosas sumadas en un solo transform.

    1) Parallax. Poquísimo, 5-8 px en todo el recorrido. No es un efecto que se
       deba "ver": es lo que impide que los recortes parezcan pegados al fondo
       cuando el titular pasa por delante.

    2) Convergencia. Los ingredientes se acercan al centro de la composición
       según baja la sección, como si tiraran de ellos.

    La convergencia NO se reparte sobre [0, 1] sino sobre [0.2, 0.8]. El
    recorrido de scroll empieza con la sección entrando por abajo y acaba con
    ella saliendo por arriba, así que los extremos casi no se ven: repartir ahí
    el viaje regalaba la mitad del movimiento fuera de pantalla. Con esta banda,
    la sección llega al centro de la ventana con el 55 % hecho y termina de
    juntarse mientras todavía se está leyendo.
  */
  const f = movil ? 0.6 : 1;
  const ax = ing.atrae.x * f;
  const ay = ing.atrae.y * f;
  const r = ing.prof * (movil ? 4 : 7);

  /* Un solo nodo para las dos: `x` e `y` son componentes distintos del
     transform, así que conviven sin pisarse. Todo derivado con useTransform:
     ni un render de React por fotograma. */
  const derivaX = useTransform(progreso, [0, 0.2, 0.5, 0.8, 1], [0, 0, ax * 0.55, ax, ax]);
  const derivaY = useTransform(
    progreso,
    [0, 0.2, 0.5, 0.8, 1],
    [r, r * 0.6, ay * 0.55, ay - r * 0.6, ay - r]
  );

  const amplitud = ing.amplitud * (movil ? FACTOR_MOVIL : 1);

  /**
   * onError NO basta. El HTML llega del servidor, el navegador pide la imagen
   * y la falla ANTES de que React hidrate y enganche el manejador, así que el
   * evento se pierde y se queda un <img> roto de 143x36. Al montar hay que
   * preguntarle a la imagen si ya venía rota.
   */
  const comprobar = (el: HTMLImageElement | null) => {
    if (el && el.complete && el.naturalWidth === 0) setFalla(true);
  };

  const contenido = falla ? (
    // Marco provisional: enseña sitio, tamaño y giro sin imagen.
    <div className="aspect-square rounded-galos border-[3px] border-dashed border-galos-red/45 bg-galos-red/[0.04] flex flex-col items-center justify-center text-center px-2 py-3">
      <span className="font-anton uppercase text-galos-red/70 text-[11px] sm:text-sm leading-tight">
        {ing.nombre}
      </span>
      <span className="mt-1 text-[8px] sm:text-[10px] font-bold text-galos-red/40 break-all leading-tight">
        {ing.id}.webp
      </span>
    </div>
  ) : (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt=""
      draggable={false}
      ref={comprobar}
      onError={() => setFalla(true)}
      className="block w-full h-auto select-none pointer-events-none [-webkit-touch-callout:none]"
      style={{
        /* La sombra acompaña a la profundidad: lo que está más lejos proyecta
           más suave y más difusa, no más oscura. */
        filter:
          `drop-shadow(0 ${12 * ing.prof}px ${18 / ing.prof}px rgba(0,0,0,${0.22 * ing.prof}))` +
          (ing.desenfoque ? ` blur(${ing.desenfoque}px)` : ""),
      }}
    />
  );

  /*
    Una capa por componente de transform. La `y` de la deriva, la `y` de la
    flotación y el `rotate` son el MISMO componente: si dos de ellos viven en el
    mismo nodo, el último en escribirse se come al otro y la pieza se queda
    quieta. Por eso el árbol es: sitio → deriva (scroll) → flotación → giro.
    La deriva va por fuera del giro a propósito: si fuera dentro, el tirón hacia
    el centro saldría girado y cada pieza se iría por donde no toca.
  */
  return (
    <div
      aria-hidden
      className={cn(
        /* La aparición sigue siendo el reveal CSS del proyecto, no un
           observador: `.tg-sube` deja el recorte VISIBLE por defecto y solo
           añade la entrada donde el navegador la soporta. Con whileInView, si
           el observador no dispara (pestaña en segundo plano, salto directo al
           ancla) los ingredientes se quedaban en opacidad 0. */
        "absolute z-0 tg-sube tg-sube--tarde",
        ing.pos,
        ing.ancho,
        !ing.enMovil && "hidden sm:block"
      )}
    >
      <motion.div style={quieto ? undefined : { x: derivaX, y: derivaY }}>
        <motion.div
          className="will-change-transform"
          animate={quieto ? undefined : { y: [-amplitud, amplitud, -amplitud] }}
          transition={{
            duration: ing.dur,
            ease: "easeInOut",
            repeat: Infinity,
            delay: ing.retraso,
          }}
        >
          <motion.div
            /* El recorte lleva drop-shadow: si el nodo que gira no tiene capa
               propia, el navegador re-rasteriza el filtro en cada fotograma. */
            className="will-change-transform"
            style={{ rotate: ing.giro, scale: ing.prof }}
            animate={
              quieto
                ? undefined
                : {
                    rotate: [
                      ing.giro - ing.vaiven,
                      ing.giro + ing.vaiven,
                      ing.giro - ing.vaiven,
                    ],
                  }
            }
            /* El giro va a otro compás que el vaivén vertical (×1.37): así la
               pieza no repite el mismo dibujo nunca. */
            transition={{
              duration: ing.dur * 1.37,
              ease: "easeInOut",
              repeat: Infinity,
              delay: ing.retraso * 0.5,
            }}
          >
            {contenido}
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}

export function CadaCapa() {
  const quieto = !!useReducedMotion();
  const movil = useEsMovil();
  const ref = useRef<HTMLDivElement>(null);
  const progreso = useProgresoSeccion(ref, !quieto);

  return (
    <section
      id="capas"
      className="relative bg-galos-cream overflow-x-clip pt-16 pb-20 sm:pt-24 sm:pb-28"
    >
      <Onda color="#FFF8F0" />

      <div className="container mx-auto px-4">
        {/* El contenedor de la composición: el titular manda y los recortes
            orbitan. min-h para que haya sitio arriba y abajo en móvil. */}
        <div
          ref={ref}
          className="relative mx-auto max-w-4xl min-h-[500px] sm:min-h-[520px] lg:min-h-[560px] flex flex-col items-center justify-center"
        >
          {INGREDIENTES.map((ing) => (
            <Recorte
              key={ing.id}
              ing={ing}
              progreso={progreso}
              quieto={quieto}
              movil={movil}
            />
          ))}

          {/* Igual que los recortes: la capa que anima no puede llevar el giro. */}
          <span className="tg-sube relative z-10 inline-block">
            <span className="block bg-galos-red text-white font-anton uppercase tracking-wider text-xs sm:text-sm px-4 py-1.5 rounded-full border-[3px] border-galos-black shadow-hard-sm -rotate-2">
              Sin atajos
            </span>
          </span>

          <h2 className="tg-sube relative z-10 mt-4 font-anton uppercase text-center leading-[0.88] tracking-wide text-galos-red text-[17vw] sm:text-[13vw] lg:text-[120px]">
            <span className="block">Cada capa</span>
            <span className="block">cuenta</span>
          </h2>

          <p className="tg-sube relative z-10 mt-5 max-w-md text-center font-semibold text-neutral-700 text-sm sm:text-base">
            Tortilla a la plancha, carne, patatas dentro y queso fundido hasta
            arriba. Nada de relleno para hacer bulto.
          </p>
        </div>
      </div>
    </section>
  );
}
