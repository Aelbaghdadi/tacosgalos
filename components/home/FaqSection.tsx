"use client";

import { useState } from "react";
import Image from "next/image";
import { StickerTitle, Hl } from "@/components/ui/StickerTitle";
import { FAQS } from "@/data/faqs";
import { cn } from "@/lib/utils";

export function FaqSection({ filterStoreId }: { filterStoreId?: string }) {
  const list = filterStoreId
    ? FAQS.filter((f) => !f.storeId || f.storeId === filterStoreId)
    : FAQS;

  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <section id="faq" className="py-24 bg-galos-red text-white relative overflow-hidden">
      <div className="container mx-auto px-4 grid lg:grid-cols-[1fr_1.4fr] gap-10 items-start">
        <div className="text-center lg:text-left lg:sticky lg:top-32">
          <span className="inline-block bg-white text-galos-red font-black uppercase tracking-wider text-[11px] px-3.5 py-1.5 rounded-full mb-4 shadow-[0_4px_0_rgba(0,0,0,0.15)]">
            Preguntas frecuentes
          </span>
          <StickerTitle>
            FAQ <Hl>GALOS</Hl>
          </StickerTitle>
          <div className="mt-6 hidden lg:flex justify-center lg:justify-start">
            <Image
              src="/images/mascots/mascot-faq-question.png"
              alt="Mascota Tacos Galos pensativa"
              width={260}
              height={340}
              className="w-auto h-auto max-h-[320px] drop-shadow-[0_20px_20px_rgba(0,0,0,0.4)]"
            />
          </div>
        </div>
        <div className="flex flex-col gap-3">
          {list.map((f) => {
            const open = openId === f.id;
            return (
              <div
                key={f.id}
                className="bg-white text-galos-black border-[3px] border-galos-black rounded-galos shadow-hard overflow-hidden"
              >
                <button
                  onClick={() => setOpenId(open ? null : f.id)}
                  aria-expanded={open}
                  className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left font-anton text-lg sm:text-xl uppercase tracking-wide"
                >
                  <span>{f.q}</span>
                  <span
                    className={cn(
                      "inline-flex items-center justify-center w-8 h-8 rounded-full bg-galos-red text-white text-2xl font-black flex-shrink-0 transition-transform",
                      open && "rotate-45"
                    )}
                  >
                    +
                  </span>
                </button>
                <div
                  className={cn(
                    "px-6 overflow-hidden transition-all text-neutral-700 font-semibold",
                    open ? "max-h-[400px] py-1 pb-5" : "max-h-0"
                  )}
                >
                  <p>{f.a}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
