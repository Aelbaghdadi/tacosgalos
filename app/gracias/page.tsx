import { Suspense } from "react";
import { GraciasContent } from "./GraciasContent";

export const metadata = {
  title: "¡Pedido confirmado!",
  description: "Tu pedido directo de Tacos Galos ha sido recibido.",
  robots: { index: false, follow: false },
};

export default function GraciasPage() {
  return (
    <Suspense fallback={null}>
      <GraciasContent />
    </Suspense>
  );
}
