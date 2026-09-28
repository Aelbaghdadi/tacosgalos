import { SectionHeading } from "@/components/ui/SectionHeading";
import { Hl } from "@/components/ui/StickerTitle";
import { REVIEWS } from "@/data/reviews";
import { Card } from "@/components/ui/Card";

/**
 * Prueba social.
 *
 * ⚠️ Esta sección publicaba "4.7 ★ EN GOOGLE" y "+3.200 reseñas en nuestros
 * locales" — cifras inventadas — y encima imprimía en la propia página
 * "datos mock pendientes de Google Places API", que el dueño lee en su web.
 * Cada tarjeta remataba con "vía Google" / "vía Tripadvisor" sobre testimonios
 * fabricados.
 *
 * Ahora: sin nota media, sin volumen de reseñas y sin atribuir a ninguna
 * plataforma. Cuando la marca dé acceso a su Google Business Profile se
 * recupera el titular con la nota REAL.
 */
export function ReviewsSection() {
  return (
    <section className="py-24 bg-galos-red text-white">
      <div className="container mx-auto px-4">
        <SectionHeading
          eyebrow="Lo que dicen"
          inverted
          title={<>LO QUE DICEN <Hl>EN LOS LOCALES</Hl></>}
          subtitle="Gente que repite. Que es la única métrica que importa."
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {REVIEWS.map((r) => (
            <Card key={r.id} className="p-6 text-galos-black">
              <div
                className="text-galos-gold text-xl tracking-widest mb-2"
                aria-label={`${r.rating} de 5 estrellas`}
              >
                <span aria-hidden>
                  {"★".repeat(r.rating)}
                  {"☆".repeat(5 - r.rating)}
                </span>
              </div>
              <p className="font-bold text-base leading-relaxed mb-3">“{r.text}”</p>
              <p className="text-galos-red text-xs font-black uppercase tracking-wider">
                {r.author} · {r.storeName}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
