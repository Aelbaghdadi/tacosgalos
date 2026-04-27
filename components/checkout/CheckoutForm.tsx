"use client";

import { useState } from "react";
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
        customer: data,
        totals,
        paymentMethod: payment,
        promoCode: promo?.code,
      });
      // En la demo: marcamos como aceptado directamente (simula pago OK)
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

          <Field label="Nombre">
            <input className="tg-input" value={data.name} onChange={onChange("name")} placeholder="Cómo te llamamos" />
          </Field>
          <div className="grid sm:grid-cols-2 gap-3">
            <Field label="Teléfono">
              <input className="tg-input" type="tel" value={data.phone} onChange={onChange("phone")} placeholder="612 345 678" />
            </Field>
            <Field label="Email (recibo)">
              <input className="tg-input" type="email" value={data.email ?? ""} onChange={onChange("email")} placeholder="tu@email.com" />
            </Field>
          </div>

          {isDelivery ? (
            <>
              <Field label="Dirección">
                <input className="tg-input" value={data.address ?? ""} onChange={onChange("address")} placeholder="Calle, número, piso" />
              </Field>
              <Field label="Ciudad / CP">
                <input className="tg-input" value={data.city ?? ""} onChange={onChange("city")} placeholder="Barcelona / 08005" />
              </Field>
            </>
          ) : (
            <p className="text-sm bg-galos-red-soft border border-galos-black rounded-lg p-3 mb-3">
              Pasarás a recoger en el local seleccionado en ~8 min.
            </p>
          )}

          <Field label="Notas (opcional)">
            <textarea
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
            Demo: el pago es simulado. En producción esto llama a Stripe Checkout / Redsys / Bizum.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-4">
            <PayBtn id="card" current={payment} setCurrent={setPayment}>💳 Tarjeta</PayBtn>
            <PayBtn id="bizum" current={payment} setCurrent={setPayment}>📱 Bizum</PayBtn>
            {!isDelivery && (
              <PayBtn id="cash" current={payment} setCurrent={setPayment}>💶 En tienda</PayBtn>
            )}
          </div>

          <p className="text-xs text-neutral-500 mb-4">
            🔒 Demo segura. No se cobra. Stripe se integrará en MVP real (sin claves en frontend).
          </p>

          <div className="flex gap-2 flex-wrap">
            <Button onClick={() => setStep(1)} variant="dark" size="md">← Atrás</Button>
            <Button
              onClick={confirm}
              variant="primary"
              size="xl"
              className="flex-1 min-w-[180px]"
              disabled={submitting}
            >
              {submitting ? "Procesando..." : "Confirmar pedido"}
            </Button>
          </div>
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

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5 mb-3">
      <label className="text-xs font-black uppercase tracking-wide text-neutral-700">{label}</label>
      {children}
    </div>
  );
}

function PayBtn({ id, current, setCurrent, children }: {
  id: PaymentMethod; current: PaymentMethod; setCurrent: (p: PaymentMethod) => void; children: React.ReactNode;
}) {
  return (
    <button
      onClick={() => setCurrent(id)}
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
