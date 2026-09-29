"use client";

import { SectionHeading } from "@/components/ui/SectionHeading";
import { Onda } from "@/components/ui/Onda";
import { Hl } from "@/components/ui/StickerTitle";
import { PROMOS } from "@/data/promos";
import { useCartStore } from "@/store/cartStore";
import { useUIStore } from "@/store/uiStore";
import { api } from "@/lib/mockApi";
import { cn } from "@/lib/utils";
import type { Promo } from "@/types";
import { useRouter } from "next/navigation";

const variantClass: Record<Promo["variant"], string> = {
  red: "bg-galos-red text-white",
  gold: "bg-galos-gold text-galos-black",
  dark: "bg-galos-black text-white",
};

const ctaClass: Record<Promo["variant"], string> = {
  red: "bg-white text-galos-red",
  gold: "bg-galos-black text-white",
  dark: "bg-galos-gold text-galos-black",
};

/** Cuánto descuenta realmente una promo. 0 = no es un cupón de carrito. */
function descuentoDe(p: Promo): number {
  if (p.type === "percent") return p.percent ?? 0;
  if (p.type === "fixed") return p.amount ?? 0;
  return 0;
}

export function PromoSection() {
  const setPromo = useCartStore((s) => s.setPromo);
  const showToast = useUIStore((s) => s.showToast);
  const openCart = useUIStore((s) => s.openCart);
  const router = useRouter();

  const apply = async (p: Promo) => {
    const destino = p.ctaHref ?? "/carta";

    if (!p.code) {
      router.push(destino);
      return;
    }

    const valid = await api.validateCoupon(p.code);
    if (!valid) {
      showToast("Cupón no válido");
      return;
    }

    /**
     * Blindaje: si el cupón no descuenta nada, NO lo aplicamos.
     * Antes se llamaba a setPromo igualmente, se decía "✔ cupón listo en
     * checkout" y el total no se movía — y encima setPromo sobrescribía el
     * GALOS10 que sí funcionaba, así que el usuario perdía su descuento real.
     */
    if (descuentoDe(valid) <= 0) {
      showToast(`${valid.title} se disfruta en el local`);
      router.push(destino);
      return;
    }

    setPromo(valid);
    showToast(`✔ ${valid.code} aplicado · -${valid.percent}%`);
    openCart();
  };

  return (
    <section id="promos" className="relative pt-16 pb-24 bg-galos-cream">
      {/* Se sale del rojo del constructor por una curva blanda: el taco ya esta
          hecho y la pagina baja las revoluciones antes de las promos. */}
      <Onda color="#FFF8F0" invertida />
      <div className="container mx-auto px-4">
        <SectionHeading
          eyebrow="Promos en directo"
          title={<>OFERTAS QUE <Hl>VUELAN</Hl></>}
          subtitle="Solo en el canal directo. Limitadas."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {PROMOS.filter((p) => p.active).map((p) => (
            <article
              key={p.id}
              className={cn(
                "relative border-[3px] border-galos-black rounded-galos shadow-hard p-7 min-h-[240px] flex flex-col gap-2 transition-transform hover:-translate-y-1.5 overflow-hidden",
                variantClass[p.variant]
              )}
            >
              {p.countdownLabel && (
                <span className="absolute top-3 right-3 bg-black/35 text-white px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide">
                  ⏳ {p.countdownLabel}
                </span>
              )}
              <h3 className="font-anton text-3xl sm:text-4xl uppercase leading-none tracking-wide">
                {p.title}
              </h3>
              {/* Sin `opacity`: al 90 % el texto no llegaba al contraste minimo
                  sobre el rojo ni sobre el dorado de las tarjetas. */}
              <p className="text-sm font-bold flex-1">{p.description}</p>
              {p.code && (
                <span className="self-start font-anton text-base sm:text-lg tracking-[2px] px-3 py-1.5 border-2 border-current border-dashed rounded-md uppercase">
                  {p.code}
                </span>
              )}
              <button
                onClick={() => apply(p)}
                className={cn(
                  "self-start mt-auto px-5 py-2.5 rounded-full font-black uppercase text-xs border-2 border-galos-black tracking-wide",
                  ctaClass[p.variant]
                )}
              >
                {p.cta}
              </button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
