import { Suspense } from "react";
import { PanelContent } from "./PanelContent";

/**
 * Panel KDS mock. NO se indexa.
 * Demuestra a Tacos Galos cómo se vería la cocina recibiendo pedidos.
 */
export const metadata = {
  title: "Panel cocina · Tacos Galos",
  description: "Mockup KDS para gestión de pedidos.",
  robots: { index: false, follow: false },
};

export default function PanelPage() {
  return (
    <Suspense fallback={null}>
      <PanelContent />
    </Suspense>
  );
}
