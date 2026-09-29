"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
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
  const capaRef = useRef<HTMLDivElement>(null);

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

  /**
   * Portal a <body>. Sin él, el modal queda atrapado en el contexto de
   * apilamiento que crea el `z-10` del Hero, y el header fijo (z-[100]) se
   * pinta ENCIMA del velo negro: el modal de AVÍSAME — el primer elemento
   * interactivo del hero — salía por debajo de la cabecera.
   * `montado` evita tocar `document` durante el render en servidor.
   */
  const [montado, setMontado] = useState(false);
  useEffect(() => setMontado(true), []);

  /*
    `aria-hidden` saca el diálogo cerrado del árbol de accesibilidad, pero NO
    del orden de tabulación: con el teclado se seguía entrando dentro. Medido:
    los cuatro diálogos de la web estaban siempre en el DOM y sus controles
    respondían a `focus()` con el modal cerrado — solo el localizador son 12
    botones invisibles por los que había que pasar tabulando.

    `inert` es lo que corresponde: desactiva foco, clic y lectura de todo el
    subárbol, y se quita al abrir. Va por atributo y no por prop porque React
    18 no conoce `inert` y lo tiraría con un aviso.
  */
  useEffect(() => {
    const capa = capaRef.current;
    if (!capa) return;
    if (open) capa.removeAttribute("inert");
    else capa.setAttribute("inert", "");
  }, [open, montado]);

  if (!montado) return null;

  return createPortal(
    <div
      ref={capaRef}
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
    </div>,
    document.body
  );
}
