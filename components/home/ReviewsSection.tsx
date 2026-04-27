import { SectionHeading } from "@/components/ui/SectionHeading";
import { Hl } from "@/components/ui/StickerTitle";
import { REVIEWS } from "@/data/reviews";
import { Card } from "@/components/ui/Card";

export function ReviewsSection() {
  return (
    <section className="py-24 bg-galos-red text-white">
      <div className="container mx-auto px-4">
        <SectionHeading
          eyebrow="Lo que dicen"
          inverted
          title={<>4.7 <Hl>★</Hl> EN GOOGLE</>}
          subtitle="+3.200 reseñas en nuestros locales · datos mock pendientes de Google Places API"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {REVIEWS.map((r) => (
            <Card key={r.id} className="p-6 text-galos-black">
              <div className="text-galos-gold text-xl tracking-widest mb-2">
                {"★".repeat(r.rating)}
                {"☆".repeat(5 - r.rating)}
              </div>
              <p className="font-bold text-base leading-relaxed mb-3">“{r.text}”</p>
              <p className="text-galos-red text-xs font-black uppercase tracking-wider">
                {r.author} · {r.storeName}
              </p>
              <p className="text-neutral-500 text-xs font-bold">vía {r.source}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
