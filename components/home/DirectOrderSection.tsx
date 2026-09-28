import Image from "next/image";
import { Card } from "@/components/ui/Card";
import { StickerTitle, Hl } from "@/components/ui/StickerTitle";

const PERKS = [
  { icon: "⚡", title: "Recogida en 8 min", desc: "Pides aquí, lo recoges caliente. Sin colas, sin comisiones de intermediarios." },
  // "Aplicamos automáticamente en el checkout" era falso: el único camino que
  // aplica el cupón es pulsar la tarjeta de la sección Promos.
  { icon: "🎁", title: "-10% en tu 1er pedido", desc: "Solo en la web oficial. Actívalo en la sección de promos." },
  // Galos Club: la mecánica "un Galos gratis cada 8 pedidos" no la ha
  // aprobado la marca y no hay sistema de puntos detrás.
  { icon: "🏆", title: "Galos Club", desc: "Promos exclusivas para quien pide directo. Muy pronto." },
  // ⚠️ Antes: "Mismo precio que en local. Las apps suelen recargar hasta un 25%."
  // data/products.ts:4-6 dice por escrito que los PVP salen de Glovo, o sea
  // que HOY son precios de plataforma con comisión dentro.
  { icon: "💸", title: "Sin intermediarios", desc: "Pides directo al local, sin apps de por medio." },
];

/**
 * Sección "Pide directo y gana más" — núcleo del argumento comercial.
 */
export function DirectOrderSection() {
  return (
    <section id="directo" className="py-24 bg-galos-cream relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-[1.4fr_1fr] gap-10 items-center mb-12">
          <div>
            <span className="inline-block bg-galos-black text-white font-black uppercase tracking-wider text-[11px] px-3.5 py-1.5 rounded-full mb-4 shadow-[0_4px_0_rgba(0,0,0,0.15)]">
              Canal directo
            </span>
            <StickerTitle>
              PIDE DIRECTO Y <Hl variant="dark">GANA MÁS</Hl>
            </StickerTitle>
            <p className="mt-3 text-lg text-neutral-700 max-w-xl font-semibold">
              Menos apps. Más taco. Más promo.
            </p>
          </div>
          <div className="flex justify-center lg:justify-end">
            <Image
              src="/images/mascots/mascot-discount-bag-10.png"
              alt="Mascota Tacos Galos con bolsa -10% off"
              width={360}
              height={400}
              className="w-auto h-auto max-h-[340px] drop-shadow-[0_25px_25px_rgba(0,0,0,0.25)] animate-floaty"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {PERKS.map((p) => (
            <Card key={p.title} className="p-7">
              <div className="w-16 h-16 rounded-full bg-galos-red text-white border-[3px] border-galos-black flex items-center justify-center text-3xl">
                {p.icon}
              </div>
              <h3 className="font-anton text-2xl uppercase tracking-wide mt-4 mb-2">{p.title}</h3>
              <p className="text-neutral-700 font-semibold text-sm">{p.desc}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
