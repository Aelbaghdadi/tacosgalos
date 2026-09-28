"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useCartStore, useCartTotals } from "@/store/cartStore";
import { useLocationStore } from "@/store/locationStore";
import { useOrderStore } from "@/store/orderStore";
import { useUIStore } from "@/store/uiStore";
import { api } from "@/lib/mockApi";
import { cn } from "@/lib/utils";
import type { CustomerData, PaymentMethod } from "@/types";

/**
 * Checkout en página propia (no modal). Mejor para conversión móvil,
 * analytics, recuperación de carrito y SEO.
 *
 * Flujo: Datos → Pago → Confirma.
 *
 * ⚠️ CUMPLIMIENTO AÑADIDO:
 *  · El botón final decía "Confirmar pedido". El art. 98.2 del TRLGDCU exige
 *    la fórmula literal "pedido con obligación de pago" (o análoga no
 *    ambigua) y su consecuencia también es literal: "En caso contrario, el
 *    consumidor o usuario NO QUEDARÁ OBLIGADO por el contrato o pedido".
 *    Es el cambio de una línea con más impacto jurídico del repo.
 *  · No se pedía aceptar condiciones ni se informaba del tratamiento de
 *    datos, y se recogía nombre, teléfono, email y dirección igualmente.
 *  · El consentimiento de marketing va SEPARADO y NO premarcado (art. 21
 *    LSSI): no se puede colar dentro de la aceptación de condiciones.
 *
 * Pago real: en producción este componente lanzaría Stripe Checkout
 * (`/api/checkout` → returns session.url → redirect). Aquí simula.
 */
export function CheckoutForm() {
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const type = useCartStore((s) => s.type);
  const promo = useCartStore((s) => s.promo);
  const totals = useCartTotals();
  const clearCart = useCartStore((s) => s.clear);
  const storeId = useLocationStore((s) => s.storeId);
  const setLastOrder = useOrderStore((s) => s.setLastOrder);
  const showToast = useUIStore((s) => s.showToast);

  const [step, setStep] = useState<1 | 2>(1);
  const [submitting, setSubmitting] = useState(false);
  const [data, setData] = useState<CustomerData>({
    name: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    notes: "",
  });
  const [payment, setPayment] = useState<PaymentMethod>("card");
  const [aceptaCondiciones, setAceptaCondiciones] = useState(false);
  const [aceptaMarketing, setAceptaMarketing] = useState(false);

  const isDelivery = type === "delivery";

  const onChange = (k: keyof CustomerData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setData({ ...data, [k]: e.target.value });

  const validateStep1 = (): string | null => {
    if (!data.name.trim()) return "Falta tu nombre";
    if (!data.phone.trim()) return "Falta tu teléfono";
    if (isDelivery && !data.address?.trim()) return "Falta la dirección";
    return null;
  };

  const next = () => {
    const err = validateStep1();
    if (err) return showToast(err);
    setStep(2);
  };

  const confirm = async () => {
    if (!storeId) return showToast("Elige un local primero");
    if (!aceptaCondiciones) return showToast("Acepta las condiciones para continuar");
    setSubmitting(true);
    try {
      // En producción: 1) POST /api/orders → orderId
      //                 2) POST /api/checkout (Stripe) con orderId → session.url
      //                 3) router.push(session.url)
      //                 4) Webhook actualiza payment_status → status='accepted'
      const order = await api.createOrder({
        storeId,
        type,
        items,
        customer: { ...data, marketingConsent: aceptaMarketing },
        totals,
        paymentMethod: payment,
        promoCode: promo?.code,
      });
      const accepted = await api.updateOrderStatus(order.id, "accepted");
      setLastOrder(accepted ?? order);
      clearCart();
      router.push(`/gracias?order=${order.id}`);
    } catch (e) {
      showToast("No se pudo crear el pedido");
    } finally {
      setSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <Card className="p-8 text-center" hover={false}>
        <h3 className="font-anton text-2xl uppercase mb-3">Carrito vacío</h3>
        <p className="text-neutral-700 mb-5">Añade tus Galos antes de pagar.</p>
        <Button href="/carta" variant="primary">Ver carta</Button>
      </Card>
    );
  }

  return (
    <Card className="p-6" hover={false}>
      <div className="flex gap-2 mb-5">
        <Step active n={1} label="Datos" />
        <Step active={step >= 2} n={2} label="Pago" />
      </div>

      {step === 1 && (
        <>
          <h3 className="font-anton text-2xl uppercase mb-1">Tus datos</h3>
          <p className="text-neutral-700 mb-4 text-sm">
            Te contactamos solo para tu pedido. No spam.
          </p>

          <Field label="Nombre" htmlFor="co-nombre">
            <input id="co-nombre" autoComplete="name" className="tg-input" value={data.name} onChange={onChange("name")} placeholder="Cómo te llamamos" />
          </Field>
          <div className="grid sm:grid-cols-2 gap-3">
            <Field label="Teléfono" htmlFor="co-telefono">
              <input id="co-telefono" className="tg-input" type="tel" autoComplete="tel" value={data.phone} onChange={onChange("phone")} placeholder="612 345 678" />
            </Field>
            <Field label="Email (recibo)" htmlFor="co-email">
              <input id="co-email" className="tg-input" type="email" autoComplete="email" value={data.email ?? ""} onChange={onChange("email")} placeholder="tu@email.com" />
            </Field>
          </div>

          {isDelivery ? (
            <>
              <Field label="Dirección" htmlFor="co-direccion">
                <input id="co-direccion" className="tg-input" autoComplete="street-address" value={data.address ?? ""} onChange={onChange("address")} placeholder="Calle, número, piso" />
              </Field>
              <Field label="Ciudad / CP" htmlFor="co-ciudad">
                <input id="co-ciudad" className="tg-input" value={data.city ?? ""} onChange={onChange("city")} placeholder="Barcelona / 08005" />
              </Field>
            </>
          ) : (
            <p className="text-sm bg-galos-red-soft border border-galos-black rounded-lg p-3 mb-3">
              Pasarás a recoger en el local seleccionado en ~8 min.
            </p>
          )}

          <Field label="Notas (opcional)" htmlFor="co-notas">
            <textarea
              id="co-notas"
              className="tg-input min-h-[70px]"
              value={data.notes ?? ""}
              onChange={onChange("notes")}
              placeholder="Sin cebolla, doble salsa…"
            />
          </Field>

          <Button onClick={next} variant="primary" size="xl" className="w-full mt-2">
            Siguiente →
          </Button>
        </>
      )}

      {step === 2 && (
        <>
          <h3 className="font-anton text-2xl uppercase mb-1">Pago</h3>
          <p className="text-neutral-700 mb-4 text-sm">
            Elige cómo quieres pagar tu pedido.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-4">
            <PayBtn id="card" current={payment} setCurrent={setPayment}>💳 Tarjeta</PayBtn>
            <PayBtn id="bizum" current={payment} setCurrent={setPayment}>📱 Bizum</PayBtn>
            {!isDelivery && (
              <PayBtn id="cash" current={payment} setCurrent={setPayment}>💶 En tienda</PayBtn>
            )}
          </div>

          {/* Consentimientos. El de marketing va aparte y sin premarcar. */}
          <div className="flex flex-col gap-3 mb-5 border-t border-dashed border-neutral-300 pt-4">
            <label htmlFor="co-condiciones" className="flex items-start gap-2.5 cursor-pointer">
              <input
                id="co-condiciones"
                type="checkbox"
                checked={aceptaCondiciones}
                onChange={(e) => setAceptaCondiciones(e.target.checked)}
                className="mt-0.5 w-5 h-5 flex-none accent-galos-red cursor-pointer"
              />
              <span className="text-[13px] text-neutral-700 font-semibold leading-snug">
                {/*
                  target="_blank" NO es decorativo: todo el estado de este
                  formulario es useState local, así que navegar a los legales
                  y volver atrás vacía nombre, teléfono y dirección. Y están
                  pegados al checkbox obligatorio, o sea que se van a pulsar.
                */}
                He leído y acepto las{" "}
                <Link
                  href="/legal/condiciones"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline text-galos-red"
                >
                  condiciones de pedido
                </Link>{" "}
                y la{" "}
                <Link
                  href="/legal/privacidad"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline text-galos-red"
                >
                  política de privacidad
                </Link>
                .
              </span>
            </label>

            <label htmlFor="co-marketing" className="flex items-start gap-2.5 cursor-pointer">
              <input
                id="co-marketing"
                type="checkbox"
                checked={aceptaMarketing}
                onChange={(e) => setAceptaMarketing(e.target.checked)}
                className="mt-0.5 w-5 h-5 flex-none accent-galos-red cursor-pointer"
              />
              <span className="text-[13px] text-neutral-700 font-semibold leading-snug">
                Quiero recibir promos exclusivas del canal directo. Opcional.
              </span>
            </label>
          </div>

          <div className="flex gap-2 flex-wrap">
            <Button onClick={() => setStep(1)} variant="dark" size="md">← Atrás</Button>
            <Button
              onClick={confirm}
              variant="primary"
              size="xl"
              // "Pedido con obligación de pago" es la fórmula literal del
              // art. 98.2 TRLGDCU y no se puede acortar, así que el botón
              // tiene que dejarla partir en dos líneas: a 375px de ancho el
              // texto se salía de la pastilla y provocaba scroll horizontal.
              className="flex-1 min-w-0 basis-full sm:basis-0 whitespace-normal leading-tight px-4 sm:px-7"
              disabled={submitting || !aceptaCondiciones}
            >
              {/*
                Fórmula literal del art. 98.2 TRLGDCU. No cambiar por
                "Confirmar" ni "Finalizar": si el botón no es inequívoco
                sobre la obligación de pago, el pedido no vincula al cliente.
              */}
              {submitting ? "Procesando..." : "Pedido con obligación de pago"}
            </Button>
          </div>

          <p className="text-xs text-neutral-500 mt-3">
            Pago procesado en un entorno seguro. Tacos Galos no almacena los
            datos de tu tarjeta.
          </p>
        </>
      )}
    </Card>
  );
}

function Step({ active, n, label }: { active: boolean; n: number; label: string }) {
  return (
    <div className={cn(
      "flex-1 text-center px-3 py-2 rounded-full text-xs font-black uppercase tracking-wide",
      active ? "bg-galos-red text-white" : "bg-neutral-100 text-neutral-500"
    )}>
      {n} · {label}
    </div>
  );
}

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5 mb-3">
      <label htmlFor={htmlFor} className="text-xs font-black uppercase tracking-wide text-neutral-700">
        {label}
      </label>
      {children}
    </div>
  );
}

function PayBtn({ id, current, setCurrent, children }: {
  id: PaymentMethod; current: PaymentMethod; setCurrent: (p: PaymentMethod) => void; children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={() => setCurrent(id)}
      aria-pressed={current === id}
      className={cn(
        "p-3.5 border-2 rounded-xl font-black text-sm transition-colors text-center",
        current === id
          ? "bg-galos-red text-white border-galos-red"
          : "bg-white text-galos-black border-galos-black hover:bg-galos-red-soft"
      )}
    >
      {children}
    </button>
  );
}
