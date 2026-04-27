"use client";

import { useState } from "react";
import { StoreCard } from "./StoreCard";
import { STORES } from "@/data/stores";
import type { StoreArea } from "@/types";
import { cn } from "@/lib/utils";

const FILTERS: Array<{ id: "all" | StoreArea; label: string }> = [
  { id: "all", label: "Todos" },
  { id: "bcn", label: "Barcelona" },
  { id: "metro", label: "Área metropolitana" },
  { id: "vall", label: "Vallès" },
];

export function StoreLocator() {
  const [filter, setFilter] = useState<"all" | StoreArea>("all");
  const list = filter === "all" ? STORES : STORES.filter((s) => s.area === filter);

  return (
    <>
      <div className="flex flex-wrap gap-2 justify-center mb-9">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={cn(
              "px-4 py-2.5 border-2 border-galos-black rounded-full font-black uppercase text-xs tracking-wide transition-colors",
              filter === f.id
                ? "bg-galos-black text-white"
                : "bg-white text-galos-black hover:bg-galos-red hover:text-white hover:border-galos-red"
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {list.map((s) => (
          <StoreCard key={s.id} store={s} />
        ))}
      </div>
    </>
  );
}
