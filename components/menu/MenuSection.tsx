"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { CategoryTabs } from "./CategoryTabs";
import { ProductCard } from "./ProductCard";
import { CATEGORIES, PRODUCTS } from "@/data/products";
import { ENTRADA } from "@/components/motion/patrones";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Diagonal, Puente } from "@/components/ui/transiciones";
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
    <section id="carta" className="relative pt-28 pb-24 bg-galos-red text-white">
      {/* Salto de color fuerte —blanco a rojo—, asi que corte en angulo y no
          curva: el contraste ya es un acontecimiento por si solo. */}
      <Diagonal color="#E30613" />

      {/*
        EL PUENTE. El sello arranca arriba, sobre el blanco de "Como funciona",
        y baja hasta quedarse dentro del rojo de la carta. Es el unico elemento
        de la pagina que pertenece a dos secciones a la vez: cierra los cinco
        pasos y abre la carta con el mismo gesto.
      */}
      <Puente className="right-[5%] sm:right-[8%] lg:right-[11%]" giro={-8}>
        <span
          className="flex items-center justify-center text-center
                     w-[96px] h-[96px] sm:w-[124px] sm:h-[124px]
                     rounded-full bg-galos-gold text-galos-black
                     border-[3px] border-galos-black shadow-hard
                     font-anton uppercase leading-[0.9] tracking-tight
                     text-[15px] sm:text-[19px] px-2"
        >
          Tu turno
        </span>
      </Puente>

      <div className="container mx-auto px-4 relative z-10">
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
          Cambiar de categoría tiene que sentirse instantáneo.

          Antes iba con `mode="wait"`: la rejilla saliente se animaba entera
          (0,16 s) ANTES de que empezara la entrante, y encima esta escalonaba
          9 tarjetas a 45 ms. Medido: 353 ms desde el clic hasta ver la carta
          nueva, con un hueco vacío por el medio. Para un filtro eso no es una
          transición, es una espera.

          Con `popLayout` la saliente sale del flujo y se desvanece mientras la
          entrante YA ocupa su sitio — que era lo que `wait` protegía: que la
          página no pegue un salto de altura. El escalonado baja a 20 ms, así
          que las nueve tarjetas acaban de entrar antes de que la saliente
          termine de irse.
        */}
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div
            key={active}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6"
            initial={quieto ? false : "oculto"}
            animate="visible"
            exit={quieto ? undefined : "sale"}
            variants={{
              oculto: {},
              visible: { transition: { staggerChildren: 0.02 } },
              sale: { opacity: 0, y: -8, transition: { duration: 0.12 } },
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
                          transition: ENTRADA,
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
