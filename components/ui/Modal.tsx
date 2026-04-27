"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface Props {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  size?: "md" | "lg";
  ariaLabel?: string;
}

export function Modal({ open, onClose, children, size = "md", ariaLabel }: Props) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.classList.add("overflow-hidden");
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.classList.remove("overflow-hidden");
    };
  }, [open, onClose]);

  return (
    <div
      aria-hidden={!open}
      className={cn(
        "fixed inset-0 z-[250] transition-opacity",
        open ? "pointer-events-auto" : "pointer-events-none opacity-0"
      )}
    >
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div
        ref={panelRef}
        role="dialog"
        aria-label={ariaLabel}
        className={cn(
          "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2",
          "bg-white rounded-galos border-[3px] border-galos-black shadow-hard p-7",
          "w-[calc(100%-2rem)] max-h-[calc(100vh-3rem)] overflow-y-auto",
          size === "md" ? "max-w-[520px]" : "max-w-[720px]",
          "transition-transform duration-200",
          open ? "scale-100 opacity-100" : "scale-95 opacity-0"
        )}
      >
        <button
          onClick={onClose}
          aria-label="Cerrar"
          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-galos-black text-white text-2xl flex items-center justify-center"
        >
          ×
        </button>
        {children}
      </div>
    </div>
  );
}
