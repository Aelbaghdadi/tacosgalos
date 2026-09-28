import { Suspense } from "react";
import { RetoPanel } from "./RetoPanel";

/**
 * Panel del reto. NO se indexa — es la pantalla interna de la marca.
 */
export const metadata = {
  title: "Panel reto · Tacos Galos",
  description: "Marcador del reto y generador de creatividades.",
  robots: { index: false, follow: false },
};

export default function RetoPage() {
  return (
    <Suspense fallback={null}>
      <RetoPanel />
    </Suspense>
  );
}
