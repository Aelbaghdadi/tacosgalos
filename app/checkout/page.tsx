import { CheckoutForm } from "@/components/checkout/CheckoutForm";
import { OrderSummary } from "@/components/checkout/OrderSummary";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Hl } from "@/components/ui/StickerTitle";

/**
 * /checkout — página propia (no modal). Mejor conversión móvil + analytics
 * + futuro server-side pricing antes de Stripe Checkout.
 *
 * NOINDEX: no debe aparecer en Google.
 */
export const metadata = {
  title: "Checkout · Tacos Galos",
  description: "Confirma tu pedido directo de Tacos Galos.",
  robots: { index: false, follow: false },
};

export default function CheckoutPage() {
  return (
    <>
      <div className="pt-page bg-galos-red" />
      <section className="py-12 bg-galos-cream min-h-[70vh]">
        <div className="container mx-auto px-4">
          <SectionHeading
            eyebrow="Casi listo"
            eyebrowVariant="dark"
            align="left"
            title={<>FINALIZA TU <Hl variant="dark">PEDIDO</Hl></>}
            subtitle="Pedido directo. Sin comisiones de plataforma."
          />
          <div className="grid lg:grid-cols-[1.4fr_1fr] gap-6">
            <CheckoutForm />
            <OrderSummary />
          </div>
        </div>
      </section>
    </>
  );
}
