import Image from "next/image";
import { StoreLocator } from "@/components/locations/StoreLocator";
import { StickerTitle, Hl } from "@/components/ui/StickerTitle";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Locales · Tacos Galos en Cataluña",
  description: "Encuentra tu Tacos Galos más cercano. 11 locales en Barcelona, área metropolitana y Vallès. Recogida en 8 min.",
  path: "/locales",
});

export default function LocalesPage() {
  return (
    <>
      {/* Hero con la mascota location-pin */}
      <section className="bg-galos-red text-white pt-page pb-12 relative overflow-hidden">
        <div className="container mx-auto px-4 grid lg:grid-cols-[1.5fr_1fr] gap-6 items-center">
          <div>
            <span className="inline-block bg-white text-galos-red font-black uppercase tracking-wider text-[11px] px-3.5 py-1.5 rounded-full mb-4 shadow-[0_4px_0_rgba(0,0,0,0.15)]">
              Nuestros locales
            </span>
            <StickerTitle as="h1">
              ENCUÉNTRANOS <Hl>CERCA</Hl>
            </StickerTitle>
            <p className="mt-3 text-lg max-w-xl text-red-100">
              <strong className="text-white">11 locales y subiendo.</strong> Pide en tu local más cercano y recoge en 8 min.
            </p>
          </div>
          <div className="flex justify-center lg:justify-end">
            <Image
              src="/images/mascots/mascot-location-pin.png"
              alt="Mascota Tacos Galos con pin de ubicación"
              width={320}
              height={400}
              priority
              className="w-auto h-auto max-h-[340px] drop-shadow-[0_25px_25px_rgba(0,0,0,0.45)] animate-floaty"
            />
          </div>
        </div>
      </section>

      <section className="py-16 bg-galos-cream">
        <div className="container mx-auto px-4">
          <StoreLocator />
        </div>
      </section>
    </>
  );
}
