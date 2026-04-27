"use client";

import { useUIStore } from "@/store/uiStore";
import { cn } from "@/lib/utils";

export function Toast() {
  const toast = useUIStore((s) => s.toast);
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "fixed left-1/2 -translate-x-1/2 bottom-24 z-[300]",
        "bg-galos-black text-white border-2 border-white rounded-full",
        "px-5 py-3 text-sm font-bold shadow-hard max-w-[calc(100%-1.5rem)] text-center",
        "transition-all",
        toast ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5 pointer-events-none"
      )}
    >
      {toast}
    </div>
  );
}
