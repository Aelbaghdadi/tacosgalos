"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { PromoCard } from "@/components/promo/PromoCard";
import { promoDe } from "@/data/promos-producto";
import { fondoDeFoto } from "@/data/fondos-producto";
import { MICRO } from "@/components/motion/patrones";
import { useCartStore } from "@/store/cartStore";
import { useUIStore } from "@/store/uiStore";
import { formatPrice, cn } from "@/lib/utils";
import type { Product, ProductBadge } from "@/types";

const BADGE_LABELS: Record<ProductBadge, { label: string; variant: "halal" | "new" | "top" | "spicy" | "promo" }> = {
  halal: { label: "Halal", variant: "halal" },
  new: { label: "Nuevo", variant: "new" },
  top: { label: "Top", variant: "top" },
  spicy: { label: "🌶 Picante", variant: "spicy" },
  promo: { label: "Promo", variant: "promo" },
  vegan: { label: "Vegan", variant: "halal" },
  vegetarian: { label: "Veggie", variant: "halal" },
};

export function ProductCard({ product }: { product: Product }) {
  const addProduct = useCartStore((s) => s.addProduct);
  const openProduct = useUIStore((s) => s.openProduct);
  const showToast = useUIStore((s) => s.showToast);

  const handleAdd = () => {
    if (product.customizable) {
      openProduct(product);
    } else {
      addProduct(product);
      showToast(`✔ Añadido ${product.name}`);
    }
  };

  const promo = promoDe(product.id);
  const quieto = !!useReducedMotion();
  /* Carbon o blanco, decidido por imagen. Ver data/fondos-producto.ts. */
  const fondoFoto =
    fondoDeFoto(product.imageUrl) === "claro" ? "bg-white" : "bg-[#1A1A1A]";

  return (
    /*
      Elevacion con muelle en Motion; el producto de dentro se acerca con una
      simple transicion CSS via group-hover. No hace falta orquestar dos
      animaciones para un hover.
    */
    <motion.div
      className="group h-full"
      whileHover={quieto ? undefined : { y: -6 }}
      whileTap={quieto ? undefined : { scale: 0.97 }}
      transition={MICRO}
    >
    <Card className="flex flex-col relative overflow-hidden h-full transition-shadow duration-300 group-hover:shadow-hard-lg">
      {/* Imagen del producto con badges flotantes */}
      {/* Alto fijo en 4/3 para toda la rejilla: aunque una foto se pinte mas
          pequena, el bloque grafico mide lo mismo y la informacion de abajo
          arranca siempre a la misma altura. */}
      <div
        className={cn(
          "relative aspect-[4/3] w-full overflow-hidden border-b-[3px] border-galos-black",
          promo ? "bg-galos-cream" : product.imageUrl ? fondoFoto : "bg-galos-cream"
        )}
      >
        {promo ? (
          /* Creatividad reconstruida: el titular es texto real, no imagen.
             Ver data/promos-producto.ts. */
          <PromoCard promo={promo} nombre={product.name} />
        ) : product.imageUrl ? (
          /*
            Las 57 fotos del catalogo son de 320x320. Con `object-cover` habia
            que estirarlas hasta 1,24x para llenar la caja; con `object-contain`
            nunca se pintan por encima de su tamano nativo, asi que se ven
            limpias. Lo que hay detras es un color plano elegido por categoria
            —ver FONDO_FOTO—, no una copia borrosa de la propia foto.
          */
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-contain transition-transform duration-[450ms] ease-out group-hover:scale-[1.04]"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-6xl">🌮</div>
        )}

        {product.badges.length > 0 && (
          <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap">
            {product.badges.slice(0, 2).map((b) => {
              const meta = BADGE_LABELS[b];
              if (!meta) return null;
              return (
                <Badge key={b} variant={meta.variant}>
                  {meta.label}
                </Badge>
              );
            })}
          </div>
        )}

        {product.originalPrice && product.originalPrice > product.basePrice && (
          <div className="absolute top-3 right-3 bg-galos-red text-white font-anton text-lg px-3 py-1 rounded-full border-2 border-galos-black shadow-hard-sm">
            -{Math.round((1 - product.basePrice / product.originalPrice) * 100)}%
          </div>
        )}
      </div>

      {/* Contenido */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-anton text-xl sm:text-2xl uppercase tracking-wide leading-tight text-galos-black mb-2">
          {product.name}
        </h3>
        <p className="text-neutral-700 font-semibold text-sm flex-1 mb-4 line-clamp-3">
          {product.description}
        </p>

        <div className="flex items-center justify-between gap-3">
          <div className="flex items-baseline gap-2">
            <span className="font-anton text-2xl text-galos-red">
              {formatPrice(product.basePrice)}
            </span>
            {product.originalPrice && product.originalPrice > product.basePrice && (
              <span className="text-sm text-neutral-400 line-through font-bold">
                {formatPrice(product.originalPrice)}
              </span>
            )}
            {product.customizable && !product.originalPrice && (
              <span className="text-xs text-neutral-500 font-bold">desde</span>
            )}
          </div>
          <Button onClick={handleAdd} variant="primary" size="sm">
            + Añadir
          </Button>
        </div>
      </div>
    </Card>
    </motion.div>
  );
}
