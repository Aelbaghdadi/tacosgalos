"use client";

import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useLocationStore } from "@/store/locationStore";
import { useUIStore } from "@/store/uiStore";
import { cn } from "@/lib/utils";
import type { Store } from "@/types";

export function StoreCard({ store }: { store: Store }) {
  const setStoreId = useLocationStore((s) => s.setStoreId);
  const showToast = useUIStore((s) => s.showToast);
  const isComing = store.status === "coming_soon";

  const select = () => {
    setStoreId(store.id);
    showToast(`Local seleccionado: ${store.city}`);
  };

  return (
    <Card className={cn("p-6 flex flex-col gap-2.5", isComing && "bg-galos-cream")}>
      <h3 className="font-anton text-2xl uppercase tracking-wide text-galos-red">
        {store.city.includes("/") ? store.city : store.name.replace("Tacos Galos · ", "")}
      </h3>
      <p className="text-xs font-extrabold uppercase tracking-wide flex items-center gap-1.5">
        📍 Local Tacos Galos
      </p>
      <p className="text-neutral-700 font-bold flex-1 text-sm">{store.address}</p>

      {!isComing && (
        <div className="flex flex-wrap gap-1.5">
          {store.services.includes("pickup") && (
            <span className="bg-emerald-100 border border-galos-black px-2.5 py-0.5 rounded-full text-[11px] font-extrabold uppercase">
              Recogida {store.pickupEtaMinutes} min
            </span>
          )}
          {store.services.includes("delivery") && (
            <span className="bg-blue-100 border border-galos-black px-2.5 py-0.5 rounded-full text-[11px] font-extrabold uppercase">
              Delivery
            </span>
          )}
        </div>
      )}

      <div className="flex gap-2 flex-wrap mt-1">
        {isComing ? (
          <span className="font-anton text-galos-black uppercase">Próxima apertura</span>
        ) : (
          <>
            <Button onClick={select} variant="primary" size="sm" className="flex-1">
              Pedir aquí
            </Button>
            <Link
              href={`/locales/${store.slug}`}
              className="flex-1 text-center bg-galos-black text-white px-4 py-2 rounded-full text-xs font-black uppercase tracking-wide border-2 border-galos-black"
            >
              Ver local
            </Link>
          </>
        )}
      </div>
    </Card>
  );
}
