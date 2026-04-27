"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useCartStore, useCartTotals } from "@/store/cartStore";
import { useUIStore } from "@/store/uiStore";
import { useLocationStore } from "@/store/locationStore";
import { STORES } from "@/data/stores";
import { formatPrice, cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { CartItem } from "./CartItem";

/**
 * Drawer del carrito. Desktop: panel lateral derecho. Móvil: bottom-sheet.
 */
export function CartDrawer() {
  const open = useUIStore((s) => s.cartOpen);
  const closeCart = useUIStore((s) => s.closeCart);
  const openLocator = useUIStore((s) => s.openLocator);
  const showToast = useUIStore((s) => s.showToast);

  const items = useCartStore((s) => s.items);
  const type = useCartStore((s) => s.type);
  const promo = useCartStore((s) => s.promo);
  const totals = useCartTotals();
  const storeId = useLocationStore((s) => s.storeId);
  const store = STORES.find((s) => s.id === storeId);

  const router = useRouter();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeCart();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, closeCart]);

  const goCheckout = () => {
    if (items.length === 0) return showToast("Tu carrito está vacío");
    if (!storeId) {
      showToast("Elige un local primero");
      closeCart();
      openLocator();
      return;
    }
    closeCart();
    router.push("/checkout");
  };

  return (
    <aside aria-hidden={!open} className={cn("fixed inset-0 z-[200]", open ? "pointer-events-auto" : "pointer-events-none")}>
      <div
        className={cn("absolute inset-0 bg-black/55 transition-opacity duration-200", open ? "opacity-100" : "opacity-0")}
        onClick={closeCart}
      />
      <div
        role="dialog"
        aria-label="Tu pedido"
        className={cn(
          "absolute bg-white flex flex-col transition-transform duration-300 border-galos-black",
          // Desktop: lateral derecho
          "md:top-0 md:right-0 md:h-full md:w-[440px] md:border-l-[3px]",
          // Móvil: bottom sheet
          "max-md:bottom-0 max-md:left-0 max-md:right-0 max-md:max-h-[90vh] max-md:rounded-t-[22px] max-md:border-t-[3px]",
          open
            ? "md:translate-x-0 max-md:translate-y-0"
            : "md:translate-x-full max-md:translate-y-full"
        )}
      >
        <header className="flex items-center justify-between px-5 py-4 border-b-[3px] border-galos-black">
          <h3 className="font-anton text-2xl uppercase tracking-wide">Tu pedido</h3>
          <button
            onClick={closeCart}
            className="w-9 h-9 rounded-full bg-galos-black text-white text-2xl"
            aria-label="Cerrar"
          >
            ×
          </button>
        </header>

        <div className="px-5 py-3.5 bg-galos-red-soft text-xs font-black uppercase tracking-wide text-neutral-700 border-b border-neutral-300 flex gap-2">
          <strong className="text-galos-red">{type === "delivery" ? "Delivery" : "Recogida"}</strong>
          <span>·</span>
          <span>{store ? store.city : "Elige tu local"}</span>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {items.length === 0 ? (
            <div className="text-center py-6 text-neutral-500">
              <Image
                src="/images/mascots/mascot-empty-bag.png"
                alt="Mascota Tacos Galos con bolsa vacía"
                width={200}
                height={240}
                className="mx-auto h-auto w-[180px] drop-shadow-[0_10px_15px_rgba(0,0,0,0.2)]"
              />
              <h4 className="font-anton text-2xl uppercase text-galos-black mt-3 mb-2">Aún no hay nada</h4>
              <p className="px-4">Añade tu primer Galos y desbloquea -10% en tu 1er pedido.</p>
              <Button href="/carta" onClick={closeCart} variant="primary" size="md" className="mt-5">
                Ver carta
              </Button>
            </div>
          ) : (
            items.map((item) => <CartItem key={item.lineId} item={item} />)
          )}
        </div>

        {items.length > 0 && (
          <footer className="border-t-[3px] border-galos-black px-5 py-4 pb-[calc(1rem+env(safe-area-inset-bottom))]">
            <Row label="Subtotal" value={formatPrice(totals.subtotal)} />
            {totals.discount > 0 && (
              <Row label={`Descuento (${promo?.code})`} value={`-${formatPrice(totals.discount)}`} green />
            )}
            {totals.deliveryFee > 0 && (
              <Row label="Envío" value={formatPrice(totals.deliveryFee)} />
            )}
            <div className="flex items-center justify-between font-anton text-xl uppercase tracking-wide mt-2">
              <span>Total</span>
              <span>{formatPrice(totals.total)}</span>
            </div>
            <Button onClick={goCheckout} variant="primary" size="xl" className="w-full mt-3">
              Ir al checkout
            </Button>
            <p className="text-center text-[11px] text-neutral-500 mt-2">
              Pedido directo. Sin comisiones de plataforma.
            </p>
          </footer>
        )}
      </div>
    </aside>
  );
}

function Row({ label, value, green = false }: { label: string; value: string; green?: boolean }) {
  return (
    <div className={cn("flex justify-between text-sm font-bold mb-1.5", green ? "text-emerald-600" : "text-neutral-700")}>
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}
