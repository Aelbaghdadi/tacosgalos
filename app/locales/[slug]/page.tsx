import { notFound } from "next/navigation";
import Image from "next/image";
import { STORES } from "@/data/stores";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { StickerTitle, Hl } from "@/components/ui/StickerTitle";
import { PromoSection } from "@/components/home/PromoSection";
import { FaqSection } from "@/components/home/FaqSection";
import { buildMetadata, buildStoreJsonLd } from "@/lib/seo";

const DAYS = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

/** Pre-renderiza una página estática por local. Crítico para SEO local. */
export function generateStaticParams() {
  return STORES.map((s) => ({ slug: s.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const store = STORES.find((s) => s.slug === params.slug);
  if (!store) return {};
  return buildMetadata({
    title: store.seoTitle,
    description: store.seoDescription,
    path: `/locales/${store.slug}`,
  });
}

export default function LocalPage({ params }: { params: { slug: string } }) {
  const store = STORES.find((s) => s.slug === params.slug);
  if (!store) notFound();

  const jsonLd = buildStoreJsonLd(store!);
  const isComing = store!.status === "coming_soon";

  return (
    <>
      {/* JSON-LD para Google: aparece como Restaurant en Maps + Search */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="pt-page bg-galos-red" />

      {/* Hero del local */}
      <section className="relative bg-galos-red text-white py-16">
        <div className="container mx-auto px-4">
          <span className="inline-block bg-white text-galos-red font-black uppercase tracking-wider text-[11px] px-3.5 py-1.5 rounded-full mb-4 shadow-[0_4px_0_rgba(0,0,0,0.15)]">
            Local · {store!.city}
          </span>
          <StickerTitle as="h1">
            <Hl>TACOS GALOS</Hl>
            <br />
            <Hl>{store!.city.toUpperCase()}</Hl>
          </StickerTitle>
          <p className="mt-4 text-lg max-w-xl text-red-100">
            <strong className="text-white">{store!.address}</strong>
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            {!isComing && (
              <>
                {store!.services.includes("pickup") && (
                  <Badge variant="halal">Recogida {store!.pickupEtaMinutes} min</Badge>
                )}
                {store!.services.includes("delivery") && (
                  <Badge variant="ghost">Delivery ~{store!.deliveryEtaMinutes} min</Badge>
                )}
                <Badge variant="ghost">Halal</Badge>
              </>
            )}
            {isComing && <Badge variant="new">Próxima apertura</Badge>}
          </div>

          <div className="mt-7 flex gap-3 flex-wrap">
            {!isComing && (
              <>
                <Button href="/carta" variant="white" size="xl">Pedir aquí</Button>
                <Button href={store!.googleMapsUrl} external variant="dark" size="xl" className="border-white">
                  Cómo llegar
                </Button>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Detalles del local */}
      <section className="py-16 bg-galos-cream">
        <div className="container mx-auto px-4 grid lg:grid-cols-[1fr_1fr] gap-8">
          <Card className="p-7" hover={false}>
            <h3 className="font-anton text-2xl uppercase mb-4">Horario</h3>
            <ul className="grid grid-cols-2 gap-2 text-sm font-bold">
              {store!.openingHours.map((h) => (
                <li key={h.day} className="flex justify-between border-b border-dashed border-neutral-300 py-1.5">
                  <span>{DAYS[h.day]}</span>
                  <span className="text-galos-red">{h.open} – {h.close}</span>
                </li>
              ))}
            </ul>
            {store!.phone && (
              <p className="mt-4 text-sm">
                Teléfono: <a href={`tel:${store!.phone}`} className="font-black text-galos-red">{store!.phone}</a>
              </p>
            )}
          </Card>

          <Card className="p-7" hover={false}>
            <h3 className="font-anton text-2xl uppercase mb-3">Cómo llegar</h3>
            <p className="text-neutral-700 font-semibold mb-4">{store!.address}</p>
            <div className="aspect-[16/10] bg-galos-black/5 border-2 border-dashed border-galos-black rounded-galos flex items-center justify-center text-neutral-500 text-sm">
              [ Mapa Google Maps · placeholder ]
            </div>
            <Button href={store!.googleMapsUrl} external variant="primary" size="md" className="mt-4 w-full">
              Abrir en Google Maps →
            </Button>
          </Card>
        </div>
      </section>

      <PromoSection />
      <FaqSection />
    </>
  );
}
