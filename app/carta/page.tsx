import { MenuSection } from "@/components/menu/MenuSection";
import { Marquee } from "@/components/ui/Marquee";
import { CreateYourTacoSteps } from "@/components/home/CreateYourTacoSteps";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Carta · French Tacos Halal",
  description: "Toda la carta de Tacos Galos: tacos personalizables, menús, combos, sides, bebidas y postres. 100% halal. Pide directo y ahorra.",
  path: "/carta",
});

export default function CartaPage() {
  return (
    <>
      {/* Espacio bajo el TopBar+Header fijo */}
      <div className="pt-page bg-galos-red" />
      <MenuSection />
      <Marquee />
      <CreateYourTacoSteps />
    </>
  );
}
