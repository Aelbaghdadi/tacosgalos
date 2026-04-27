"use client";

import Image from "next/image";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { useCartStore } from "@/store/cartStore";
import { useUIStore } from "@/store/uiStore";
import { formatPrice } from "@/lib/utils";
import type { Product, ProductBadge } from "@/types";

const BADGE_LABELS: Record<ProductBadge, { label: string; variant: "halal" | "new" | "top" | "spicy" | "promo" }> = {
  halal: { label: "Halal", variant: "halal" },
  new: { label: "Nuevo", variant: "new" },
  top: { label: "Top", variant: "top" },
  spicy: { label: "🌶 Picante", variant: "spicy" },
  promo: { label: "Promo", variant: "promo" },
  vegan: { label: "Vegan", variant: "halal" },
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

  return (
    <Card className="flex flex-col relative overflow-hidden">
      {/* Imagen del producto con badges flotantes */}
      <div className="relative aspect-[4/3] w-full bg-galos-cream border-b-[3px] border-galos-black">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover"
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
        <h3 className="font-anton text-xl sm:text-2xl uppercase tracking-wide leading-tight mb-2">
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
  );
}
