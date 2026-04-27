"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { useCartStore } from "@/store/cartStore";
import { useLocationStore } from "@/store/locationStore";
import { useUIStore } from "@/store/uiStore";
import { STORES } from "@/data/stores";
import { cn } from "@/lib/utils";

export function Hero() {
  const router = useRouter();
  const type = useCartStore((s) => s.type);
  const setType = useCartStore((s) => s.setType);
  const openLocator = useUIStore((s) => s.openLocator);
  const storeId = useLocationStore((s) => s.storeId);
  const store = STORES.find((s) => s.id === storeId);

  /**
   * Si el usuario pulsa "Empezar pedido" sin local, abrimos el locator y dejamos
   * un flag. Cuando aparece storeId, redirigimos a /carta automáticamente.
   * Esto consolida la decisión de local en un solo flujo.
   */
  const [pendingStart, setPendingStart] = useState(false);
  useEffect(() => {
    if (pendingStart && storeId) {
      setPendingStart(false);
      router.push("/carta");
    }
  }, [pendingStart, storeId, router]);

  const handleStart = () => {
    if (storeId) {
      router.push("/carta");
    } else {
      setPendingStart(true);
      openLocator();
    }
  };

  return (
    <section
      id="inicio"
      className="relative bg-galos-red text-white overflow-hidden pt-[80px] md:pt-[160px] pb-[180px] sm:pb-[220px] lg:pb-16"
    >
      {/* Fondo radial + textura waffle */}
      <div aria-hidden className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,255,255,.12),transparent_50%),radial-gradient(circle_at_10%_90%,rgba(0,0,0,.25),transparent_50%)]" />
        <div
          className="absolute inset-0 opacity-60"
          style={{
            backgroundImage:
              "linear-gradient(135deg, rgba(255,255,255,.05) 25%, transparent 25%), linear-gradient(225deg, rgba(255,255,255,.05) 25%, transparent 25%)",
            backgroundSize: "30px 30px",
          }}
        />
      </div>

      {/* Banda inferior degradada — transición rojo → marquesina negra */}
      <div
        aria-hidden
        className="lg:hidden absolute inset-x-0 bottom-0 h-12 z-[4] pointer-events-none
                   bg-gradient-to-b from-transparent via-galos-red-deep/30 to-galos-red-deep/60"
      />

      {/* Mascota móvil — esquina inferior derecha, decorativa */}
      <div className="lg:hidden absolute right-3 bottom-4 sm:right-4 sm:bottom-5 z-[5] pointer-events-none">
        <Image
          src="/images/mascots/mascot-delivery-scooter.png"
          alt=""
          width={520}
          height={620}
          priority
          className="w-auto h-[210px] sm:h-[250px] drop-shadow-[0_14px_18px_rgba(0,0,0,0.45)] animate-floaty"
        />
      </div>

      <span
        className="lg:hidden absolute bottom-[225px] sm:bottom-[265px] right-6 sm:right-8 z-[6]
                   bg-galos-gold text-galos-black rounded-full px-3.5 py-1.5
                   font-anton text-sm tracking-wide border-[3px] border-galos-black
                   shadow-hard rotate-[8deg] pointer-events-none"
      >
        -10% OFF
      </span>

      <span
        className="lg:hidden absolute bottom-14 sm:bottom-16 left-3 sm:left-4 z-[6]
                   bg-white text-galos-red rounded-full px-3.5 py-1.5
                   font-anton text-sm tracking-wide border-[3px] border-galos-black
                   shadow-hard -rotate-6 pointer-events-none"
      >
        PIDE DIRECTO
      </span>

      <div className="container mx-auto px-4 relative z-10 grid lg:grid-cols-[1.1fr_1fr] gap-8 lg:gap-10 items-center">
        <div className="text-center lg:text-left flex flex-col items-center lg:items-start">
          <span className="inline-block bg-white text-galos-red font-black uppercase tracking-wider text-[11px] px-3.5 py-1.5 rounded-full mb-4 shadow-[0_4px_0_rgba(0,0,0,0.15)]">
            El taco francés que está reventando Barcelona
          </span>

          <h1 className="font-anton uppercase tracking-wide leading-[0.92] text-[64px] sm:text-7xl lg:text-8xl">
            <span className="tg-sticker block">TU TACO.</span>
            <span className="tg-sticker block mt-1">TUS REGLAS.</span>
          </h1>

          <p className="mt-5 text-base sm:text-lg max-w-xl text-red-100 leading-relaxed">
            Crujiente por fuera. Fundido por dentro.{" "}
            <strong className="text-white">
              Pide directo, recoge rápido y desbloquea promos exclusivas.
            </strong>
          </p>

          {/* Selector delivery / recogida */}
          <div
            className="mt-5 inline-flex bg-black/35 border-2 border-white/40 rounded-full p-1 gap-1"
            role="tablist"
          >
            <ModeBtn active={type === "delivery"} onClick={() => setType("delivery")}>
              Delivery
            </ModeBtn>
            <ModeBtn active={type === "pickup"} onClick={() => setType("pickup")}>
              Recogida <span className="opacity-80 text-[11px] ml-1">· 8 min</span>
            </ModeBtn>
          </div>

          {/* CTA principal — abre locator si no hay local, navega si sí */}
          <div className="mt-6 w-full flex flex-col items-center lg:items-start gap-3">
            <Button
              onClick={handleStart}
              size="xl"
              className="w-full sm:w-auto bg-galos-gold text-galos-black border-galos-black hover:bg-white hover:text-galos-red text-lg sm:text-base px-8 py-5"
            >
              Empezar pedido →
            </Button>

            {/*
              Mini pill de local — dos zonas en una sola pieza:
              [Pin · Pidiendo en X]  [Cambiar local]
              Click en cualquier zona abre el locator. Una sola acción.
            */}
            <button
              onClick={openLocator}
              aria-label={store ? `Cambiar local. Actual: ${store.city}` : "Elegir local"}
              className="group inline-flex items-stretch overflow-hidden
                         bg-black/30 hover:bg-black/40
                         border-2 border-white/25 hover:border-white/50
                         rounded-full transition-colors text-[12px] sm:text-[13px]"
            >
              <span className="inline-flex items-center gap-1.5 pl-3 pr-2.5 py-1.5 font-bold text-white/85">
                <PinIcon className="w-3.5 h-3.5 text-galos-gold flex-shrink-0" />
                {store ? (
                  <>
                    <span className="text-white/60">Pidiendo en</span>
                    <span className="text-white">{store.city}</span>
                  </>
                ) : (
                  <span>Sin local seleccionado</span>
                )}
              </span>
              <span
                className="inline-flex items-center px-3 py-1.5
                           border-l-2 border-white/20 group-hover:border-white/40
                           font-black uppercase tracking-wider text-[11px]
                           text-galos-gold group-hover:text-galos-black
                           bg-transparent group-hover:bg-galos-gold transition-colors"
              >
                {store ? "Cambiar" : "Elegir local"}
              </span>
            </button>
          </div>

          <ul className="mt-7 flex gap-2 flex-wrap justify-center lg:justify-start">
            <li><Badge variant="halal">100% Halal</Badge></li>
            <li><Badge variant="ghost">Sin comisiones extra</Badge></li>
            <li><Badge variant="ghost">-10% 1er pedido</Badge></li>
            <li className="hidden lg:inline-flex"><Badge variant="ghost">11 locales</Badge></li>
          </ul>
        </div>

        {/* Mascota desktop */}
        <div className="hidden lg:flex relative w-full items-end justify-center min-h-[520px]">
          <Image
            src="/images/mascots/mascot-delivery-scooter.png"
            alt="Mascota Tacos Galos en scooter de delivery"
            width={520}
            height={620}
            priority
            className="w-auto h-auto max-h-[560px] animate-floaty drop-shadow-[0_30px_25px_rgba(0,0,0,0.45)]"
          />
          <span className="absolute top-2 left-2 bg-white text-galos-red rounded-full px-5 py-3 font-anton text-xl tracking-wide border-[3px] border-galos-black shadow-hard -rotate-6">
            PIDE DIRECTO
          </span>
          <span className="absolute bottom-6 right-[-10px] bg-galos-gold text-galos-black rounded-full px-5 py-3 font-anton text-xl tracking-wide border-[3px] border-galos-black shadow-hard rotate-[10deg]">
            -10% OFF
          </span>
        </div>
      </div>
    </section>
  );
}

function ModeBtn({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      role="tab"
      aria-selected={active}
      className={cn(
        "px-5 py-2.5 rounded-full font-black uppercase text-[13px] tracking-wide transition-colors",
        active ? "bg-white text-galos-red" : "text-white/75 hover:text-white"
      )}
    >
      {children}
    </button>
  );
}

function PinIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0116 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}
