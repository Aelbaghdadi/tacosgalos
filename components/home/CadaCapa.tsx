"use client";

import { useState } from "react";
import { Onda } from "@/components/ui/Onda";
import { cn } from "@/lib/utils";

/**
 * CADA CAPA CUENTA — titular grande con los ingredientes flotando alrededor.
 *
 * Los seis recortes salen de data/options.ts y de lo que de verdad lleva un
 * french tacos. SIN VEGETALES: aquí no hay lechuga ni tomate, que es lo que
 * diferencia un french tacos de un kebab o una hamburguesa.
 *
 * Mientras no existan los .webp, cada hueco pinta su marco de posición con el
 * nombre y el nombre de archivo que le toca. Esa es la composición provisional
 * para fijar sitio, tamaño y giro antes de generar nada.
 *
 * El reveal es CSS puro (.tg-sube). Si no hay soporte, si el usuario pide
 * menos movimiento o si falla algo, el contenido se ve igual: nunca se queda
 * en blanco. Ver la nota larga en globals.css.
 */

type Ingrediente = {
  id: string;
  nombre: string;
  /** De dónde sale en la carta, para no inventarnos ingredientes. */
  origen: string;
  pos: string;
  ancho: string;
  giro: number;
  /** false = se oculta en móvil, para que no tape el titular. */
  enMovil: boolean;
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
  },
  {
    id: "pollo",
    nombre: "Pollo",
    origen: "options.meat · pollo",
    pos: "right-[-3%] top-[0%] sm:right-[5%] sm:top-[5%]",
    ancho: "w-[28%] sm:w-[21%] lg:w-[16%]",
    giro: 13,
    enMovil: true,
  },
  {
    id: "patatas",
    nombre: "Patatas fritas",
    origen: "options.extras · patatas_extra",
    pos: "left-[-4%] bottom-0 sm:left-[7%] sm:bottom-[8%]",
    ancho: "w-[27%] sm:w-[22%] lg:w-[17%]",
    giro: 9,
    enMovil: true,
  },
  {
    id: "queso",
    nombre: "Doble fundido",
    origen: "options.cheese · doble",
    pos: "right-[-4%] bottom-0 sm:right-[4%] sm:bottom-[6%]",
    ancho: "w-[27%] sm:w-[22%] lg:w-[17%]",
    giro: -11,
    enMovil: true,
  },
  {
    id: "algerienne",
    nombre: "Algerienne",
    origen: "options.sauces · algerienne",
    pos: "left-[36%] top-[-3%]",
    ancho: "w-[20%] sm:w-[13%] lg:w-[11%]",
    giro: -22,
    enMovil: false,
  },
  {
    id: "harissa",
    nombre: "Harissa",
    origen: "options.sauces · harissa",
    pos: "right-[33%] bottom-[-3%]",
    ancho: "w-[20%] sm:w-[13%] lg:w-[11%]",
    giro: 18,
    enMovil: false,
  },
];

function Recorte({ ing }: { ing: Ingrediente }) {
  const [falla, setFalla] = useState(false);
  const src = "/ingredientes/" + ing.id + ".webp?v=1";

  /**
   * onError NO basta. El HTML llega del servidor, el navegador pide la imagen
   * y la falla ANTES de que React hidrate y enganche el manejador, así que el
   * evento se pierde y se queda un <img> roto de 143x36. Al montar hay que
   * preguntarle a la imagen si ya venía rota.
   */
  const comprobar = (el: HTMLImageElement | null) => {
    if (el && el.complete && el.naturalWidth === 0) setFalla(true);
  };

  return (
    /*
      Dos capas a propósito: la de fuera anima (tg-sube acaba en
      `transform: none`) y la de dentro guarda el giro. Si se juntan, la
      animación le borra la rotación al recorte.
    */
    <div
      aria-hidden
      className={cn(
        "absolute z-0 tg-sube tg-sube--tarde",
        ing.pos,
        ing.ancho,
        !ing.enMovil && "hidden sm:block"
      )}
    >
      <div style={{ transform: "rotate(" + ing.giro + "deg)" }}>
      {falla ? (
        // Marco provisional: enseña sitio, tamaño y giro sin imagen.
        <div className="aspect-square rounded-galos border-[3px] border-dashed border-galos-red/45 bg-galos-red/[0.04] flex flex-col items-center justify-center text-center px-2 py-3">
          <span className="font-anton uppercase text-galos-red/70 text-[11px] sm:text-sm leading-tight">
            {ing.nombre}
          </span>
          <span className="mt-1 text-[8px] sm:text-[10px] font-bold text-galos-red/40 break-all leading-tight">
            {ing.id}.webp
          </span>
          <span className="mt-1 text-[8px] sm:text-[10px] font-bold text-galos-red/40">
            {ing.giro > 0 ? "+" : ""}
            {ing.giro}°
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
          className="block w-full h-auto select-none pointer-events-none [-webkit-touch-callout:none] drop-shadow-[0_14px_18px_rgba(0,0,0,.22)]"
        />
      )}
      </div>
    </div>
  );
}

export function CadaCapa() {
  return (
    <section
      id="capas"
      className="relative bg-galos-cream overflow-x-clip pt-16 pb-20 sm:pt-24 sm:pb-28"
    >
      <Onda color="#FFF8F0" />

      <div className="container mx-auto px-4">
        {/* El contenedor de la composición: el titular manda y los recortes
            orbitan. min-h para que haya sitio arriba y abajo en móvil. */}
        <div className="relative mx-auto max-w-4xl min-h-[500px] sm:min-h-[520px] lg:min-h-[560px] flex flex-col items-center justify-center">
          {INGREDIENTES.map((ing) => (
            <Recorte key={ing.id} ing={ing} />
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
