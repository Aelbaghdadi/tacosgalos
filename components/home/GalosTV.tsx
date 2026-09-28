"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Hl } from "@/components/ui/StickerTitle";
import { SOCIAL } from "@/data/social";

/**
 * GALOS TV — sustituye al antiguo InstagramGrid.
 *
 * Dos motivos para cambiarlo:
 *  1) Aquel grid enlazaba a `instagram.com` A SECAS, no a @tacosgalos:
 *     mandaba a la home de la red el tráfico que costó dos años construir.
 *  2) La marca es 100% vídeo vertical. Una pared de capturas estáticas no
 *     se parece a ellos; un carril de 9:16 que se mueve, sí.
 *
 * ⚠️ DEUDA DE CONTENIDO, HAY QUE RESOLVERLA CON LA MARCA:
 * Los `story-*.jpeg` son CAPTURAS DE PANTALLA de sus stories reales, con la
 * interfaz de Instagram dentro (barra de estado, botón "Seguir", "Enviar
 * mensaje"). Las recortamos por CSS para que no se vea el cromo del teléfono,
 * pero eso es un apaño de demo: hay que pedirle los creativos originales.
 * Y hay que meter Reels suyos de verdad — hoy solo hay dos vídeos en el repo.
 *
 * Los títulos salen de lo que la imagen dice DE VERDAD (cada una anuncia un
 * local concreto). Antes estaban inventados, que es justo el tipo de detalle
 * que el dueño pilla al instante porque conoce su propio contenido.
 */

type Pieza =
  | { tipo: "video"; src: string; poster: string; titulo: string }
  | { tipo: "foto"; src: string; titulo: string };

const PIEZAS: Pieza[] = [
  {
    tipo: "video",
    src: "/videos/scooter_video.mp4",
    poster: "/images/mascots/mascot-delivery-scooter.png",
    titulo: "Reparto Galos",
  },
  {
    tipo: "video",
    src: "/videos/configurador.mp4",
    poster: "/images/configurador.jpg",
    titulo: "Crea tu taco",
  },
  // Descartadas a propósito: story-1 y story-2 son tarjetas de "Preguntas
  // frecuentes", y una de ellas responde sobre FRANQUICIAS — la marca no
  // tiene programa público, así que no se anuncia desde la web.
  { tipo: "foto", src: "/images/story-5.jpeg", titulo: "El Raval" },
  { tipo: "foto", src: "/images/story-6.jpeg", titulo: "Sagrada Família" },
  { tipo: "foto", src: "/images/story-7.jpeg", titulo: "Santa Eulàlia" },
  { tipo: "foto", src: "/images/story-0.jpeg", titulo: "Marina" },
  { tipo: "foto", src: "/images/story-3.jpeg", titulo: "Santa Coloma" },
  { tipo: "foto", src: "/images/story-4.jpeg", titulo: "Mataró" },
];

export function GalosTV() {
  return (
    <section className="py-24 bg-galos-black">
      <div className="container mx-auto px-4">
        <SectionHeading
          eyebrow="Galos TV"
          inverted
          title={<>ESTO ES LO QUE <Hl>TE ESTÁS PERDIENDO</Hl></>}
          subtitle="Lo que pasa en los locales, en vertical y sin filtros."
        />
      </div>

      {/*
        `items-start` es imprescindible: sin él, align-items:stretch machaca la
        altura que debería derivar de aspect-[9/16] y las tarjetas se aplastan
        a una tira de 40px.
      */}
      <div
        className="flex items-start gap-3.5 overflow-x-auto snap-x snap-mandatory
                   px-4 pb-4 [scrollbar-width:none] [-ms-overflow-style:none]
                   [&::-webkit-scrollbar]:hidden"
      >
        {PIEZAS.map((pieza) => (
          <Tarjeta key={pieza.src} pieza={pieza} />
        ))}
      </div>

      <div className="container mx-auto px-4 mt-8 text-center">
        <a
          href={SOCIAL.instagram}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-galos-red text-white
                     border-[3px] border-white rounded-full px-6 py-3.5
                     font-black uppercase tracking-wide text-sm
                     hover:bg-white hover:text-galos-red transition-colors"
        >
          Síguenos en @tacosgalos
        </a>
      </div>
    </section>
  );
}

function Tarjeta({ pieza }: { pieza: Pieza }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;

    // Respetamos a quien pide menos movimiento.
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const observer = new IntersectionObserver(
      (entradas) => {
        for (const entrada of entradas) {
          if (entrada.isIntersecting) {
            void video.play().catch(() => {
              /* autoplay bloqueado: se queda el póster, no es un error */
            });
          } else {
            video.pause();
          }
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  return (
    <a
      href={SOCIAL.instagram}
      target="_blank"
      rel="noopener noreferrer"
      className="relative flex-none snap-center w-[62vw] max-w-[260px] sm:w-[220px]
                 aspect-[9/16] rounded-galos-sm overflow-hidden
                 border-[3px] border-white shadow-[0_6px_0_#FFFFFF33]
                 transition-transform hover:-translate-y-1"
    >
      {pieza.tipo === "video" ? (
        <video
          ref={ref}
          muted
          loop
          playsInline
          preload="metadata"
          poster={pieza.poster}
          aria-label={pieza.titulo}
          className="block w-full h-full object-cover"
        >
          <source src={pieza.src} type="video/mp4" />
        </video>
      ) : (
        /*
          Recorte del cromo de Instagram. El origen es 945×2048 y lleva ~17%
          de interfaz arriba (barra de estado + barras de progreso + cabecera)
          y ~13% abajo ("Enviar mensaje").
          El desplazamiento NO puede ir en el style del <Image>: con `fill`,
          Next lanza un error en runtime si le tocas height ("Images with
          'fill' always use height 100% - it cannot be modified"). Así que
          sobredimensionamos un contenedor y dejamos que la imagen lo llene;
          el overflow-hidden del <a> padre se encarga de recortar.
        */
        <span
          className="absolute left-0 right-0"
          style={{ top: "-17%", height: "132%" }}
        >
          <Image
            src={pieza.src}
            alt={`Story de Tacos Galos · ${pieza.titulo}`}
            fill
            sizes="(max-width: 640px) 62vw, 220px"
            className="object-cover"
          />
        </span>
      )}

      <span className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/70 pointer-events-none" />
      <span className="absolute bottom-2.5 left-3 right-3 text-white font-black uppercase text-[11px] tracking-wide drop-shadow">
        {pieza.titulo}
      </span>
    </a>
  );
}
