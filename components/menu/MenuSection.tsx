"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
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
  const quieto = !!useReducedMotion();
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

        {/*
          Al cambiar de categoría la rejilla no parpadea: la saliente se va
          hacia arriba mientras la entrante sube desde abajo, escalonada. El
          `mode="wait"` evita que las dos se pisen y que la página pegue un
          salto de altura.
        */}
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={active}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6"
            initial={quieto ? false : "oculto"}
            animate="visible"
            exit={quieto ? undefined : "sale"}
            variants={{
              oculto: {},
              visible: { transition: { staggerChildren: 0.045 } },
              sale: { opacity: 0, y: -12, transition: { duration: 0.16 } },
            }}
          >
            {products.map((p) => (
              <motion.div
                key={p.id}
                variants={
                  quieto
                    ? { oculto: { opacity: 1 }, visible: { opacity: 1 } }
                    : {
                        oculto: { opacity: 0, y: 24, scale: 0.97 },
                        visible: {
                          opacity: 1,
                          y: 0,
                          scale: 1,
                          transition: { type: "spring", stiffness: 420, damping: 32 },
                        },
                      }
                }
              >
                <ProductCard product={p} />
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
