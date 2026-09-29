import type { PromoProducto } from "@/data/promos-producto";

/**
 * Creatividades promocionales reconstruidas.
 *
 * Sustituyen a 10 imágenes de 320×320 que llevaban el titular horneado dentro.
 * Aquí SOLO el producto es un bitmap; fondo, titular, sello y decoración son
 * CSS y SVG. El texto es texto: nítido a cualquier tamaño, seleccionable,
 * traducible y en Anton, la tipografía de la marca.
 *
 * El tamaño se resuelve con CONSULTAS DE CONTENEDOR (`cqi` = 1% del ancho del
 * contenedor), no con media queries. La misma pieza se compone sola a 300px en
 * la rejilla de la carta y a 600px en una vista de detalle, sin puntos de
 * ruptura y sin que el titular se salga. Es CSS estándar, sin plugin.
 */

function Pizarra({ promo, titulo }: { promo: PromoProducto; titulo: string }) {
  return (
    <>
      {/* Pared: base #171717 con ladrillo a muy bajo contraste. Medido del original. */}
      <div
        aria-hidden
        className="absolute inset-0 bg-[#171717]"
        style={{
          backgroundImage: [
            "repeating-linear-gradient(0deg, transparent 0 6.4%, rgba(255,255,255,.035) 6.4% 7%, transparent 7% 100%)",
            "repeating-linear-gradient(90deg, transparent 0 11%, rgba(255,255,255,.028) 11% 11.6%, transparent 11.6% 100%)",
          ].join(","),
        }}
      />
      {/* Suelo: banda inferior algo más clara, #1A1A1A */}
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-[38%] bg-[#1A1A1A]"
        style={{ boxShadow: "inset 0 1px 0 rgba(255,255,255,.04)" }}
      />
      {/* Foco cenital */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(120% 70% at 50% -10%, rgba(255,255,255,.07), transparent 60%)",
        }}
      />
      {/* Viñeta: en el original el 79,9% de la esquina superior es negro puro */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(85% 70% at 50% 45%, transparent 40%, rgba(0,0,0,.72) 100%)",
        }}
      />

      {/* Titular. El rojo del original medía #EC0604 — es el rojo de marca. */}
      <h3
        className="absolute left-1/2 top-[15%] z-20 -translate-x-1/2 -rotate-2 whitespace-nowrap font-anton uppercase leading-none text-galos-red text-[9cqi]"
        style={{ textShadow: "0 0.5cqi 0 rgba(0,0,0,.55)" }}
      >
        {titulo}
      </h3>

      {/* Sombra de contacto bajo el producto */}
      <div
        aria-hidden
        className="absolute left-1/2 bottom-[5%] z-10 h-[5cqi] w-[54%] -translate-x-1/2 rounded-[50%]"
        style={{
          background: "radial-gradient(50% 50% at 50% 50%, rgba(0,0,0,.75), transparent 70%)",
          filter: "blur(1.2cqi)",
        }}
      />

      {/* Producto: el único bitmap */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={promo.asset}
        alt=""
        aria-hidden
        loading="lazy"
        decoding="async"
        draggable={false}
        /*
          Caja de alto FIJO con object-contain, no ancho libre: los seis tacos
          van de 800×366 a 800×476, así que dimensionar por ancho haría que el
          más alto invadiera el titular. Con alto fijo, el ancho se ajusta solo
          y la colisión es imposible sea cual sea la proporción.
        */
        className="absolute inset-x-[6%] bottom-[7%] z-10 h-[56%] select-none object-contain object-bottom transition-transform duration-[450ms] ease-out group-hover:-translate-y-[3%] group-hover:scale-[1.04]"
      />

      {/* Chapa de la mascota asomando por la esquina, como en el original */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/promo/chapa-mascota.webp"
        alt=""
        aria-hidden
        loading="lazy"
        draggable={false}
        className="absolute -right-[1cqi] top-[11%] z-20 w-[13cqi] rotate-[18deg] select-none opacity-90"
      />
    </>
  );
}

function SelloGlutenFree() {
  return (
    <svg
      viewBox="0 0 100 100"
      aria-hidden
      className="absolute right-[3%] top-[12%] z-20 w-[16cqi] drop-shadow-[0_0.4cqi_0.6cqi_rgba(0,0,0,.35)]"
    >
      <circle cx="50" cy="50" r="48" fill="#0F0F0F" />
      <circle cx="50" cy="50" r="42" fill="none" stroke="#FFF8F0" strokeWidth="1.6" />
      {/*
        Dos arcos separados, como el sello original: "GLUTEN" arriba y "FREE"
        abajo. Un solo textPath dando la vuelta entera dejaba el texto
        apelotonado en una caja de 22px — se veía como una mancha.
      */}
      <path id="tg-sello-sup" d="M16 50a34 34 0 0 1 68 0" fill="none" />
      <path id="tg-sello-inf" d="M18 50a32 32 0 0 0 64 0" fill="none" />
      <g
        fill="#FFF8F0"
        fontSize="15"
        letterSpacing="1.2"
        fontFamily="var(--font-anton), system-ui, sans-serif"
      >
        <text>
          <textPath href="#tg-sello-sup" startOffset="50%" textAnchor="middle">
            GLUTEN
          </textPath>
        </text>
        <text>
          <textPath href="#tg-sello-inf" startOffset="50%" textAnchor="middle">
            FREE
          </textPath>
        </text>
      </g>
      {/* Espiga */}
      <g stroke="#FFF8F0" strokeWidth="2.4" strokeLinecap="round" fill="none">
        <path d="M50 34v30" />
        <path d="M50 40c-5-2-8-5-8-8 4 0 7 2 8 4M50 40c5-2 8-5 8-8-4 0-7 2-8 4" />
        <path d="M50 49c-5-2-8-5-8-8 4 0 7 2 8 4M50 49c5-2 8-5 8-8-4 0-7 2-8 4" />
        <path d="M50 58c-5-2-8-5-8-8 4 0 7 2 8 4M50 58c5-2 8-5 8-8-4 0-7 2-8 4" />
      </g>
    </svg>
  );
}

function Estallido({ promo, titulo }: { promo: PromoProducto; titulo: string }) {
  const a = promo.rayoA ?? "#D8A860";
  const b = promo.rayoB ?? "#C09060";
  return (
    <>
      {/* Rayos de cómic: 24 sectores alternando el par de colores del original */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          backgroundImage: `repeating-conic-gradient(from 0deg at 50% 44%, ${a} 0deg 4.5deg, ${b} 4.5deg 9deg)`,
        }}
      />
      {/* Trama de puntos por encima */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          backgroundImage: "radial-gradient(rgba(0,0,0,.16) 22%, transparent 23%)",
          backgroundSize: "2.2cqi 2.2cqi",
        }}
      />
      {/* Oscurecido en los bordes para que el producto separe */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(75% 65% at 50% 52%, transparent 45%, rgba(0,0,0,.22) 100%)",
        }}
      />

      <p className="absolute left-1/2 top-[14%] z-20 -translate-x-1/2 whitespace-nowrap font-anton uppercase leading-none tracking-[0.3em] text-[3.6cqi]">
        <span className="text-white">Bowls </span>
        <span className="text-galos-red">Galos</span>
      </p>

      <h3
        className="absolute left-1/2 top-[21%] z-20 -translate-x-1/2 whitespace-nowrap font-anton uppercase leading-none text-galos-cream text-[9cqi]"
        style={{ textShadow: "0 0.5cqi 0 rgba(0,0,0,.45)" }}
      >
        {titulo}
      </h3>

      <SelloGlutenFree />

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={promo.asset}
        alt=""
        aria-hidden
        loading="lazy"
        decoding="async"
        draggable={false}
        /* Mismo criterio que la pizarra: alto fijo, el ancho se ajusta solo. */
        className="absolute inset-x-[12%] bottom-[1%] z-10 h-[62%] select-none object-contain object-bottom drop-shadow-[0_1cqi_1.2cqi_rgba(0,0,0,.3)] transition-transform duration-[450ms] ease-out group-hover:-translate-y-[3%] group-hover:scale-[1.04]"
      />
    </>
  );
}

export function PromoCard({
  promo,
  nombre,
  className,
}: {
  promo: PromoProducto;
  /** Nombre real del producto: es lo que lee el lector de pantalla. */
  nombre: string;
  className?: string;
}) {
  return (
    <div
      role="img"
      aria-label={nombre}
      className={"relative h-full w-full overflow-hidden " + (className ?? "")}
      style={{ containerType: "inline-size" }}
    >
      {promo.variante === "pizarra" ? (
        <Pizarra promo={promo} titulo={promo.titulo ?? nombre} />
      ) : (
        <Estallido promo={promo} titulo={promo.titulo ?? nombre} />
      )}
    </div>
  );
}
