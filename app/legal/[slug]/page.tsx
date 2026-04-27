import { notFound } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { StickerTitle, Hl } from "@/components/ui/StickerTitle";
import { buildMetadata } from "@/lib/seo";

const PAGES: Record<string, { title: string; intro: string }> = {
  "aviso-legal": {
    title: "Aviso legal",
    intro: "Información legal de Tacos Galos. Razón social, NIF, domicilio y datos de contacto pendientes de confirmación con la marca.",
  },
  privacidad: {
    title: "Política de privacidad",
    intro: "Cómo tratamos tus datos. Texto completo pendiente de revisión con asesor legal.",
  },
  cookies: {
    title: "Política de cookies",
    intro: "Uso de cookies en la web de Tacos Galos. Banner CMP por integrar (Cookiebot, OneTrust o similar).",
  },
  alergenos: {
    title: "Alérgenos",
    intro: "Información de alérgenos. Productos con posibles trazas: gluten, lácteos, huevo, sésamo, soja, mostaza, frutos secos. Tabla detallada por producto pendiente.",
  },
  condiciones: {
    title: "Condiciones de pedido",
    intro: "Términos de uso del canal directo: tiempos, devoluciones, cancelaciones. Pendiente de redacción definitiva.",
  },
};

export function generateStaticParams() {
  return Object.keys(PAGES).map((slug) => ({ slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const page = PAGES[params.slug];
  if (!page) return {};
  return buildMetadata({
    title: page.title,
    description: page.intro,
    path: `/legal/${params.slug}`,
  });
}

export default function LegalPage({ params }: { params: { slug: string } }) {
  const page = PAGES[params.slug];
  if (!page) notFound();

  return (
    <>
      <div className="pt-page bg-galos-red" />
      <section className="py-16 bg-galos-cream min-h-[60vh]">
        <div className="container mx-auto px-4 max-w-3xl">
          <StickerTitle as="h1" className="mb-6">
            <Hl variant="dark">{page.title.toUpperCase()}</Hl>
          </StickerTitle>
          <Card className="p-7" hover={false}>
            <p className="text-neutral-700 font-semibold mb-4">{page.intro}</p>
            <p className="text-sm text-neutral-500 italic">
              Texto placeholder. Pendiente de redacción legal definitiva con asesor.
              Solo se muestra para que el footer tenga estructura completa.
            </p>
          </Card>
        </div>
      </section>
    </>
  );
}
