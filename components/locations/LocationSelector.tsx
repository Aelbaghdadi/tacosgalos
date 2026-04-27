"use client";

import { Modal } from "@/components/ui/Modal";
import { STORES } from "@/data/stores";
import { useLocationStore } from "@/store/locationStore";
import { useUIStore } from "@/store/uiStore";
import { cn } from "@/lib/utils";

/**
 * Modal global de selección rápida de local. Disparable desde:
 * - TopBar (chip de local)
 * - Hero (botón "Elegir local")
 * - Drawer del carrito (si intenta checkout sin local)
 */
export function LocationSelector() {
  const open = useUIStore((s) => s.locatorOpen);
  const close = useUIStore((s) => s.closeLocator);
  const showToast = useUIStore((s) => s.showToast);
  const storeId = useLocationStore((s) => s.storeId);
  const setStoreId = useLocationStore((s) => s.setStoreId);

  const select = (id: string, name: string) => {
    setStoreId(id);
    showToast(`Local: ${name}`);
    close();
  };

  return (
    <Modal open={open} onClose={close} size="lg" ariaLabel="Selecciona tu local">
      <h3 className="font-anton text-2xl sm:text-3xl uppercase tracking-wide pr-12 mb-1">
        Elige tu local
      </h3>
      <p className="text-neutral-700 font-semibold mb-5">
        Esto define disponibilidad, tiempos y promociones.
      </p>

      <div className="grid gap-2.5">
        {STORES.map((s) => (
          <button
            key={s.id}
            onClick={() => s.status !== "coming_soon" && select(s.id, s.city)}
            disabled={s.status === "coming_soon"}
            className={cn(
              "flex items-center justify-between gap-3 px-4 py-3.5 border-2 rounded-xl text-left transition-colors",
              s.status === "coming_soon" && "opacity-60 cursor-not-allowed bg-neutral-100",
              storeId === s.id
                ? "bg-galos-red text-white border-galos-red"
                : "bg-white text-galos-black border-galos-black hover:bg-galos-red-soft"
            )}
          >
            <div className="min-w-0">
              <h5 className="font-anton text-lg uppercase truncate">{s.city}</h5>
              <small className="text-xs opacity-90 block truncate">{s.address}</small>
            </div>
            <small className="text-[11px] flex-shrink-0 text-right">
              {s.status === "coming_soon"
                ? "Próximamente"
                : (
                  <>
                    {s.services.includes("pickup") && <>🏃 {s.pickupEtaMinutes} min<br /></>}
                    {s.services.includes("delivery") && <>🛵 ~{s.deliveryEtaMinutes} min</>}
                  </>
                )}
            </small>
          </button>
        ))}
      </div>
    </Modal>
  );
}
