"use client";

import { useState } from "react";
import { CategoryTabs } from "./CategoryTabs";
import { ProductCard } from "./ProductCard";
import { CATEGORIES, PRODUCTS } from "@/data/products";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Hl } from "@/components/ui/StickerTitle";
import type { ProductCategoryId } from "@/types";

interface Props {
  initialCategory?: ProductCategoryId;
  showHeading?: boolean;
}

export function MenuSection({ initialCategory = "tacos_jefe", showHeading = true }: Props) {
  const [active, setActive] = useState<ProductCategoryId>(initialCategory);
  const products = PRODUCTS.filter((p) => p.category === active && p.available);

  return (
    <section id="carta" className="py-24 bg-galos-red text-white">
      <div className="container mx-auto px-4">
        {showHeading && (
          <SectionHeading
            eyebrow="La carta"
            inverted
            title={<>ELIGE, FUNDE Y <Hl>DISFRUTA</Hl></>}
            subtitle="Tu antojo está a un click."
          />
        )}

        <CategoryTabs categories={CATEGORIES} active={active} onChange={setActive} />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
