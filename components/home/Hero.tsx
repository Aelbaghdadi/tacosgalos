"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Marcador } from "@/components/home/Marcador";
import { useCartStore } from "@/store/cartStore";
import { useLocationStore } from "@/store/locationStore";
import { useUIStore } from "@/store/uiStore";
import { STORES } from "@/data/stores";
import { cn } from "@/lib/utils";

/**
 * Retardo de la entrada escalonada. El escalón es corto a propósito: el <h1>
 * es casi seguro el elemento LCP y arrancar en opacity 0 retrasa su pintado,
 * así que el titular entra de los primeros y la cadena entera acaba en <0,9s.
 */
const entra = (ms: number) => ({ "--tg-d": ms + "ms" }) as React.CSSProperties;

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
      className="relative bg-galos-red text-white overflow-hidden pt-[80px] md:pt-[160px] pb-12 lg:pb-16"
    >
      {/*
        ── CAPA 0 · VÍDEO A SANGRE (solo escritorio) ──────────────────────
        Estructura al estilo New School Tacos: el vídeo ES el fondo, no una
        tarjeta dentro del hero. Así deja de importar que su rojo no case
        exactamente con galos-red, que era el problema de encajarlo antes.

        ⚠️ PLACEHOLDER: scooter_video.mp4 son 3852×2152 y 5,0 MB para 5 s.
        Es 4K para un fondo. Sustituir por el render definitivo a 1920×1080
        y <1,5 MB, con la acción en los dos tercios DERECHOS —el tercio
        izquierdo tiene que quedar tranquilo o el DÍA XX/60 no se lee—.
        Se queda fuera del móvil a propósito: 5 MB sobre datos móviles en la
        primera pantalla no se sostiene, y 16:9 recortado a vertical pierde
        el encuadre. El móvil conserva su tarjeta de vídeo más abajo.
      */}
      <div aria-hidden className="absolute inset-0 z-0 hidden lg:block">
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="none"
          poster="/images/mascots/mascot-delivery-scooter.png"
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/videos/scooter_video.mp4" type="video/mp4" />
        </video>
      </div>

      {/*
        ── CAPA 1 · SCRIM ────────────────────────────────────────────────
        Degradado de izquierda a derecha: opaco donde vive el texto,
        transparente donde se ve el vídeo. Sin esto el marcador compite con
        la imagen y no se lee ninguno de los dos.
      */}
      <div
        aria-hidden
        className="absolute inset-0 z-[1] hidden lg:block
                   bg-gradient-to-r from-galos-red-deep via-galos-red-deep/85 to-galos-red-deep/20"
      />

      {/* Fondo radial + textura waffle — en móvil es el fondo completo, y en
          escritorio queda por debajo del vídeo como red de seguridad. */}
      <div aria-hidden className="absolute inset-0 z-0 lg:-z-10">
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

      {/* ── CAPA 2 · CONTENIDO ────────────────────────────────────────── */}
      <div className="container mx-auto px-4 relative z-10 grid lg:grid-cols-[1.1fr_1fr] gap-8 lg:gap-10 items-center">
        <div className="text-center lg:text-left flex flex-col items-center lg:items-start">
          {/* ── EL MARCADOR ── lo primero que se ve al abrir la web */}
          <div className="w-full text-left tg-entra" style={entra(0)}>
            <Marcador />
          </div>

          <div className="w-full h-px bg-white/20 my-7 tg-entra" style={entra(60)} />

          <h1 className="font-anton uppercase tracking-wide leading-[0.92] text-[44px] sm:text-6xl lg:text-7xl">
            <span className="tg-sticker block tg-entra" style={entra(110)}>TU TACO.</span>
            <span className="tg-sticker block mt-1 tg-entra" style={entra(170)}>TUS REGLAS.</span>
          </h1>

          <p
            className="mt-4 text-base sm:text-lg max-w-xl text-red-100 leading-relaxed tg-entra"
            style={entra(230)}
          >
            Crujiente por fuera. Fundido por dentro.{" "}
            <strong className="text-white">
              Pide directo, recoge rápido y desbloquea promos exclusivas.
            </strong>
          </p>

          {/* Selector delivery / recogida */}
          <div
            className="mt-5 inline-flex bg-black/35 border-2 border-white/40 rounded-full p-1 gap-1 tg-entra"
            style={entra(290)}
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
          <div
            className="mt-6 w-full flex flex-col items-center lg:items-start gap-3 tg-entra"
            style={entra(350)}
          >
            <Button
              onClick={handleStart}
              size="xl"
              className="w-full sm:w-auto bg-galos-gold text-galos-black border-galos-black hover:bg-white hover:text-galos-red text-lg sm:text-base px-8 py-5"
            >
              Empezar pedido →
            </Button>

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

          <ul
            className="mt-7 flex gap-2 flex-wrap justify-center lg:justify-start tg-entra"
            style={entra(420)}
          >
            <li><Badge variant="halal">100% Halal</Badge></li>
            <li><Badge variant="ghost">Sin comisiones extra</Badge></li>
            <li><Badge variant="ghost">-10% 1er pedido</Badge></li>
          </ul>

          {/* Mascota móvil — card limpio en el flow, debajo de los badges */}
          <div
            className="lg:hidden relative mt-8 w-full max-w-md mx-auto tg-entra"
            style={entra(490)}
          >
            <div
              className="relative rounded-galos-lg overflow-hidden border-[3px] border-galos-black shadow-hard-lg bg-galos-red-deep"
              style={{ aspectRatio: "16 / 9" }}
            >
              <video
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                poster="/images/mascots/mascot-delivery-scooter.png"
                aria-hidden
                className="block w-full h-full object-cover"
              >
                <source src="/videos/scooter_video.mp4" type="video/mp4" />
              </video>
            </div>
            <span className="absolute -top-3 left-3 z-10 bg-white text-galos-red rounded-full px-3.5 py-1.5 font-anton text-sm tracking-wide border-[3px] border-galos-black shadow-hard -rotate-6">
              PIDE DIRECTO
            </span>
            <span className="absolute -bottom-3 right-3 z-10 bg-galos-gold text-galos-black rounded-full px-3.5 py-1.5 font-anton text-sm tracking-wide border-[3px] border-galos-black shadow-hard rotate-[8deg]">
              -10% OFF
            </span>
          </div>
        </div>

        {/*
          Columna derecha en escritorio. Con el vídeo de fondo la mascota
          recortada ya no hace falta: sobraba encima de su propio vídeo.
          Se dejan solo los dos sellos, que ahora flotan sobre la imagen.
        */}
        <div className="hidden lg:flex relative w-full items-end justify-center min-h-[520px]">
          {/*
            Las pegatinas ya llevan rotate-* en la clase, así que su entrada NO
            puede usar tg-entra: la animación fija transform y se comería el
            giro. Entran solo con opacidad, sobre un wrapper aparte.
          */}
          <span
            className="absolute top-8 left-2 tg-aparece"
            style={entra(480)}
          >
            <span className="block bg-white text-galos-red rounded-full px-5 py-3 font-anton text-xl tracking-wide border-[3px] border-galos-black shadow-hard -rotate-6">
              PIDE DIRECTO
            </span>
          </span>
          <span
            className="absolute bottom-10 right-0 tg-aparece"
            style={entra(560)}
          >
            <span className="block bg-galos-gold text-galos-black rounded-full px-5 py-3 font-anton text-xl tracking-wide border-[3px] border-galos-black shadow-hard rotate-[10deg]">
              -10% OFF
            </span>
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
