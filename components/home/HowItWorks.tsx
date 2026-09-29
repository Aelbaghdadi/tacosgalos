"use client";

import { useEffect, useRef } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  type MotionValue,
} from "motion/react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Hl } from "@/components/ui/StickerTitle";
import { cn } from "@/lib/utils";

const STEPS = [
  { n: 1, title: "Pides directo", desc: "En la web. Sin apps de intermediarios." },
  { n: 2, title: "Eliges tu local", desc: "Tu local más cercano se prepara para tu pedido." },
  { n: 3, title: "Cocina lo recibe", desc: "Pasa al KDS al instante. Sale en 8 min." },
  { n: 4, title: "Recoges o te lo llevamos", desc: "Pickup rápido o delivery directo." },
  // Antes: "Ganas promos y puntos · Galos Club: cada pedido suma."
  // No hay sistema de puntos ni programa aprobado por la marca.
  { n: 5, title: "Ganas promos", desc: "Ofertas que solo existen en la web." },
];

/**
 * "Del antojo al bocado" — la narrativa horizontal.
 *
 * Son cinco pasos EN ORDEN, así que la lectura natural es una línea, no una
 * rejilla: en escritorio la sección se queda pegada y los pasos avanzan de
 * derecha a izquierda mientras se baja. El scroll sigue siendo vertical y
 * normal; lo único que hace la sección es traducir ese recorrido a avance
 * horizontal. Nada de secuestrar la rueda.
 *
 * En móvil NO hay nada de esto: es un carrusel táctil con `snap`, que es como
 * se navega una fila en un teléfono. El mismo DOM sirve para las dos cosas —
 * cambia el CSS y, en escritorio, un transform.
 *
 * Con `prefers-reduced-motion` desaparecen la altura extra y el pegado: quedan
 * los cinco pasos en una fila que se recorre con el dedo o la barra.
 */
export function HowItWorks() {
  const quieto = !!useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const pista = useRef<HTMLUListElement>(null);
  const ventana = useRef<HTMLDivElement>(null);

  /* Un solo MotionValue con la X ya calculada. Ni estado ni render por
     fotograma: el listener escribe y Motion pinta. */
  const x = useMotionValue(0);

  useEffect(() => {
    if (quieto) return;
    let pendiente = 0;
    const medir = () => {
      pendiente = 0;
      const caja = ref.current;
      const fila = pista.current;
      const marco = ventana.current;
      if (!caja || !fila || !marco) return;

      /*
        Si el contenedor no es más alto que la ventana es que estamos en móvil:
        ahí no hay pegado ni recorrido que repartir, y la fila se mueve sola con
        el dedo. Devolver 0 desactiva el efecto sin necesidad de matchMedia.
      */
      const r = caja.getBoundingClientRect();
      const recorrido = r.height - window.innerHeight;
      if (recorrido <= 0) {
        x.set(0);
        return;
      }

      const avance = Math.min(1, Math.max(0, -r.top / recorrido));
      const sobra = Math.max(0, fila.scrollWidth - marco.clientWidth);
      x.set(-avance * sobra);
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
  }, [x, quieto]);

  return (
    <section className="relative bg-white">
      {/*
        La altura extra es el recorrido de scroll que se traduce en avance
        horizontal, y va en PIXELES, no en `vh`.

        Con `250vh` la duración dependía del alto de la ventana: en un portátil
        de 768 px había que bajar 1,14 px por cada píxel que avanzaba la fila, y
        en un monitor de 1200 px, 1,83 — un 60 % más lenta la misma sección, que
        en pantalla grande se siente pesada. Con un extra fijo, la fila avanza
        al mismo ritmo en cualquier pantalla.
      */}
      <div ref={ref} className={cn("relative", !quieto && "lg:h-[calc(100vh+1100px)]")}>
        <div
          className={cn(
            "py-20 lg:pb-32",
            !quieto &&
              /* El `pt` es la altura de la cabecera fija: sin el, centrar en
                 `h-screen` centra en una ventana que en realidad empieza 120 px
                 mas abajo, y la fila queda alta con un vacio debajo. */
              "lg:sticky lg:top-0 lg:h-screen lg:flex lg:flex-col lg:justify-center lg:py-0 lg:pt-[120px]"
          )}
        >
          <div className="container mx-auto px-4">
            <SectionHeading
              eyebrow="Cómo funciona"
              title={<>DEL ANTOJO AL <Hl>BOCADO</Hl></>}
              subtitle="5 pasos. Sin apps de por medio."
            />
          </div>

          {/*
            La ventana. En escritorio recorta y la fila se mueve por dentro; por
            debajo de lg es un carrusel táctil con snap y sin transform.
            `pl` con el ancho del contenedor alinea el primer paso con el
            titular en vez de pegarlo al borde.
          */}
          <div
            ref={ventana}
            className={cn(
              "mt-2 overflow-x-auto lg:overflow-hidden",
              "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
              "snap-x snap-mandatory lg:snap-none"
            )}
          >
            <motion.ul
              ref={pista}
              className="flex gap-4 lg:gap-6 w-max pt-6 pb-4 px-4
                         lg:pl-[max(1rem,calc((100vw-1280px)/2+1rem))] lg:pr-[9vw]"
              style={quieto ? undefined : { x }}
            >
              {STEPS.map((s) => (
                <li
                  key={s.n}
                  className="snap-center lg:snap-align-none shrink-0
                             w-[78vw] sm:w-[52vw] md:w-[38vw] lg:w-[360px] xl:w-[420px] 2xl:w-[460px]
                             bg-galos-cream border-[3px] border-galos-black rounded-galos shadow-hard p-6 relative"
                >
                  <div className="absolute -top-4 -left-2 bg-galos-red text-white border-[3px] border-galos-black rounded-full w-12 h-12 flex items-center justify-center font-anton text-2xl shadow-hard-sm">
                    {s.n}
                  </div>
                  <h3 className="font-anton text-xl uppercase tracking-wide mt-4 mb-1.5">
                    {s.title}
                  </h3>
                  <p className="text-sm text-neutral-700 font-semibold">{s.desc}</p>
                </li>
              ))}
            </motion.ul>
          </div>

          {/* Pista de progreso: en escritorio dice cuánto queda de la fila; en
              móvil sobra, porque la barra de scroll táctil ya lo cuenta. */}
          {!quieto && (
            <div aria-hidden className="hidden lg:block container mx-auto px-4 mt-8">
              <div className="h-1.5 w-48 rounded-full bg-galos-black/10 overflow-hidden">
                <Barra x={x} pista={pista} ventana={ventana} />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

/** Barra de avance derivada de la misma X, sin un segundo listener. */
function Barra({
  x,
  pista,
  ventana,
}: {
  x: MotionValue<number>;
  pista: React.RefObject<HTMLUListElement>;
  ventana: React.RefObject<HTMLDivElement>;
}) {
  const escala = useMotionValue(0);
  useEffect(() => {
    const parar = x.on("change", (v) => {
      const sobra = Math.max(
        1,
        (pista.current?.scrollWidth ?? 0) - (ventana.current?.clientWidth ?? 0)
      );
      escala.set(Math.min(1, Math.max(0, -v / sobra)));
    });
    return parar;
  }, [x, escala, pista, ventana]);

  return <motion.div className="h-full bg-galos-red origin-left" style={{ scaleX: escala }} />;
}
