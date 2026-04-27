"use client";

import { useMemo, useState, useEffect } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { OPTION_GROUPS } from "@/data/options";
import { calcUnitPrice } from "@/lib/pricing";
import { formatPrice, cn } from "@/lib/utils";
import { useCartStore } from "@/store/cartStore";
import { useUIStore } from "@/store/uiStore";
import type { ProductOptionGroupId, ProductOptionValue } from "@/types";

/**
 * Modal de personalización de producto. Reactivo: el precio se recalcula
 * en cada toggle. Soporta single (radio) y multi (checkbox) con max.
 */
export function ProductModal() {
  const product = useUIStore((s) => s.productInModal);
  const closeProduct = useUIStore((s) => s.closeProduct);
  const showToast = useUIStore((s) => s.showToast);
  const addProduct = useCartStore((s) => s.addProduct);

  const [qty, setQty] = useState(1);
  const [selection, setSelection] = useState<
    Partial<Record<ProductOptionGroupId, ProductOptionValue[]>>
  >({});

  // Reset selección cuando cambia el producto
  useEffect(() => {
    if (!product) return;
    setQty(1);
    const initial: Partial<Record<ProductOptionGroupId, ProductOptionValue[]>> = {};
    product.optionGroupIds?.forEach((gid) => {
      const group = OPTION_GROUPS[gid];
      if (group.required && group.selection === "single") {
        // Pre-seleccionamos el primer valor (o el segundo para "size" → L por defecto)
        const idx = gid === "size" ? 1 : 0;
        initial[gid] = [group.values[idx]];
      } else {
        initial[gid] = [];
      }
    });
    setSelection(initial);
  }, [product]);

  const unitPrice = useMemo(
    () => (product ? calcUnitPrice(product.basePrice, selection) : 0),
    [product, selection]
  );

  // El Modal siempre se renderiza (permitiendo animación de cierre).
  // Cuando product=null, open=false y no se muestra contenido.
  if (!product) {
    return <Modal open={false} onClose={closeProduct} ariaLabel="Producto" >{null}</Modal>;
  }

  const toggle = (gid: ProductOptionGroupId, value: ProductOptionValue) => {
    const group = OPTION_GROUPS[gid];
    const current = selection[gid] ?? [];

    if (group.selection === "single") {
      setSelection({ ...selection, [gid]: [value] });
      return;
    }

    const exists = current.some((v) => v.id === value.id);
    if (exists) {
      setSelection({ ...selection, [gid]: current.filter((v) => v.id !== value.id) });
      return;
    }
    if (group.max && current.length >= group.max) {
      showToast(`Máximo ${group.max} en ${group.label.toLowerCase()}`);
      return;
    }
    setSelection({ ...selection, [gid]: [...current, value] });
  };

  const handleAdd = () => {
    addProduct(product, selection, qty);
    showToast(`✔ ${product.name} añadido`);
    closeProduct();
  };

  return (
    <Modal open={!!product} onClose={closeProduct} size="md" ariaLabel={`Personalizar ${product.name}`}>
      <h3 className="font-anton text-2xl sm:text-3xl uppercase tracking-wide pr-12 mb-1">
        {product.name}
      </h3>
      <p className="text-neutral-700 font-semibold mb-4">{product.description}</p>

      <div className="flex flex-col gap-5">
        {(product.optionGroupIds ?? []).map((gid) => {
          const group = OPTION_GROUPS[gid];
          const current = selection[gid] ?? [];
          return (
            <fieldset key={gid} className="border-t border-dashed border-neutral-300 pt-4">
              <legend className="flex items-center justify-between mb-2.5 w-full">
                <span className="font-anton text-lg uppercase">{group.label}</span>
                <small className="text-neutral-500 text-xs font-semibold">
                  {group.required ? "obligatorio" : group.max ? `elige hasta ${group.max}` : "opcional"}
                </small>
              </legend>
              <div className="grid grid-cols-2 gap-2">
                {group.values.map((v) => {
                  const selected = current.some((c) => c.id === v.id);
                  return (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => toggle(gid, v)}
                      className={cn(
                        "flex items-center justify-between px-3.5 py-3 border-2 rounded-xl font-extrabold text-sm transition-colors",
                        selected
                          ? "bg-galos-red text-white border-galos-red"
                          : "bg-white text-galos-black border-galos-black hover:bg-galos-red-soft"
                      )}
                    >
                      <span>{v.label}</span>
                      <span className="text-xs font-black">
                        {v.delta > 0 ? `+${formatPrice(v.delta)}` : "—"}
                      </span>
                    </button>
                  );
                })}
              </div>
            </fieldset>
          );
        })}
      </div>

      <div className="mt-6 flex items-center gap-3 flex-wrap">
        <div className="inline-flex items-center gap-2.5 border-2 border-galos-black rounded-full px-2 py-1">
          <button
            onClick={() => setQty(Math.max(1, qty - 1))}
            className="w-8 h-8 rounded-full bg-neutral-100 font-black text-lg"
            aria-label="Disminuir cantidad"
          >
            −
          </button>
          <span className="font-black min-w-[24px] text-center">{qty}</span>
          <button
            onClick={() => setQty(qty + 1)}
            className="w-8 h-8 rounded-full bg-neutral-100 font-black text-lg"
            aria-label="Aumentar cantidad"
          >
            +
          </button>
        </div>
        <Button onClick={handleAdd} variant="primary" size="xl" className="flex-1 min-w-[160px]">
          Añadir <span>{formatPrice(unitPrice * qty)}</span>
        </Button>
      </div>
    </Modal>
  );
}
