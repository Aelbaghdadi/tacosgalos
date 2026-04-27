"use client";

import type { Category, ProductCategoryId } from "@/types";
import { cn } from "@/lib/utils";

interface Props {
  categories: Category[];
  active: ProductCategoryId;
  onChange: (id: ProductCategoryId) => void;
}

export function CategoryTabs({ categories, active, onChange }: Props) {
  return (
    <div
      role="tablist"
      className="flex gap-2 overflow-x-auto pb-5 -mx-1 px-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden snap-x snap-mandatory"
    >
      {categories.map((c) => (
        <button
          key={c.id}
          role="tab"
          aria-selected={active === c.id}
          onClick={() => onChange(c.id)}
          className={cn(
            "snap-start flex-shrink-0 px-5 py-3 rounded-full border-[3px] border-galos-black font-black uppercase text-xs tracking-wide shadow-hard-sm transition-all hover:-translate-y-0.5",
            active === c.id ? "bg-galos-black text-white" : "bg-white text-galos-black"
          )}
        >
          {c.label}
        </button>
      ))}
    </div>
  );
}
