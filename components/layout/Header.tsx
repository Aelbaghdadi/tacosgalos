"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { useCartCount } from "@/store/cartStore";
import { useUIStore } from "@/store/uiStore";
import { NAV_ITEMS } from "@/data/navigation";
import { cn } from "@/lib/utils";

/**
 * Header móvil tipo "barra de navegación real":
 *   [logo] [EMPEZAR PEDIDO ── pill rojo flex-1] [🛍 icon] [☰ icon]
 *
 * Sin iconos circulares con bordes; el carrito y el burger son iconos limpios
 * que heredan color del padre y cambian a rojo en hover. La acción comercial
 * está claramente protagonizada por el CTA central rojo.
 */
export function Header() {
  const count = useCartCount();
  const openCart = useUIStore((s) => s.openCart);
  const [navOpen, setNavOpen] = useState(false);

  return (
    <header className="fixed top-0 md:top-[44px] inset-x-0 z-[100] h-[64px] md:h-[76px] bg-white/95 backdrop-blur border-b-[3px] border-galos-black">
      <div className="container mx-auto px-3 md:px-4 h-full flex items-center justify-between gap-2 md:gap-4">
        {/* LOGO */}
        <Link href="/" aria-label="Tacos Galos · Inicio" className="flex-shrink-0">
          <Image
            src="/images/logo.jpg"
            alt="Tacos Galos"
            width={56}
            height={56}
            className="w-10 h-10 md:w-14 md:h-14 rounded-full border-2 border-galos-black object-cover"
            priority
          />
        </Link>

        {/* MOBILE CTA — protagonista, ocupa el espacio central */}
        <Link
          href="/carta"
          className="md:hidden flex-1 max-w-[260px] inline-flex items-center justify-center gap-1.5
                     bg-galos-red text-white font-anton uppercase tracking-wider text-[14px]
                     h-10 px-3 rounded-full border-2 border-galos-black
                     shadow-[0_3px_0_0_#0F0F0F]
                     active:translate-y-[2px] active:shadow-[0_1px_0_0_#0F0F0F]
                     hover:bg-galos-red-dark transition-all whitespace-nowrap"
        >
          Empezar pedido
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>

        {/* DESKTOP NAV */}
        <nav
          className={cn(
            "md:flex md:items-center md:gap-6",
            navOpen
              ? "flex flex-col absolute top-full left-0 right-0 bg-white border-b-[3px] border-galos-black px-6 py-5 gap-4 shadow-hard"
              : "hidden"
          )}
        >
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setNavOpen(false)}
              className="font-extrabold uppercase text-[13px] tracking-wide relative py-1 group"
            >
              {item.label}
              <span className="absolute inset-x-0 bottom-0 h-0.5 bg-galos-red origin-left scale-x-0 group-hover:scale-x-100 transition-transform" />
            </Link>
          ))}
        </nav>

        {/* RIGHT — cart + (desktop CTA) + burger */}
        <div className="flex items-center gap-0.5 md:gap-2 flex-shrink-0">
          {/*
            Carrito:
            - Mobile: icono limpio sin fondo, hereda color (negro → rojo en hover)
            - Desktop: pill con icono + label "Mi pedido"
          */}
          <button
            onClick={openCart}
            aria-label={`Ver carrito${count > 0 ? ` (${count})` : ""}`}
            className="relative inline-flex items-center justify-center
                       w-10 h-10 text-galos-black hover:text-galos-red transition-colors
                       md:w-auto md:h-auto md:gap-2 md:pl-3 md:pr-4 md:py-2 md:rounded-full
                       md:bg-galos-black md:text-white md:hover:bg-galos-red
                       md:text-xs md:font-black md:uppercase md:tracking-wide"
          >
            <ShoppingBagIcon className="w-6 h-6 md:w-4 md:h-4" />
            <span className="hidden md:inline">Mi pedido</span>
            {count > 0 && (
              <span
                className="absolute top-0.5 right-0.5 md:static md:ml-1
                           bg-galos-red md:bg-galos-red text-white
                           min-w-[18px] h-[18px] px-1 inline-flex items-center justify-center
                           rounded-full text-[10px] font-black
                           border-2 border-white md:border-0"
              >
                {count}
              </span>
            )}
          </button>

          {/* Desktop "Pedir ahora" */}
          <Button href="/carta" variant="primary" size="sm" className="hidden md:inline-flex">
            Pedir ahora
          </Button>

          {/*
            Burger: icono limpio sin fondo, animado a X.
            Hereda color → consistente con el carrito.
          */}
          <button
            onClick={() => setNavOpen((v) => !v)}
            aria-label={navOpen ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={navOpen}
            className="md:hidden inline-flex flex-col items-center justify-center gap-[5px]
                       w-10 h-10 text-galos-black hover:text-galos-red transition-colors"
          >
            <span
              className={cn(
                "block w-6 h-[2.5px] bg-current rounded transition-transform duration-200",
                navOpen && "translate-y-[7.5px] rotate-45"
              )}
            />
            <span
              className={cn(
                "block w-6 h-[2.5px] bg-current rounded transition-opacity duration-200",
                navOpen && "opacity-0"
              )}
            />
            <span
              className={cn(
                "block w-6 h-[2.5px] bg-current rounded transition-transform duration-200",
                navOpen && "-translate-y-[7.5px] -rotate-45"
              )}
            />
          </button>
        </div>
      </div>
    </header>
  );
}

/* ── Iconos SVG inline (estilo Lucide) ─────────────────────────── */

function ShoppingBagIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  );
}

function ArrowRight({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={3}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}
