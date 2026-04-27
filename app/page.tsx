import { Hero } from "@/components/home/Hero";
import { Marquee } from "@/components/ui/Marquee";
import { DirectOrderSection } from "@/components/home/DirectOrderSection";
import { HowItWorks } from "@/components/home/HowItWorks";
import { MenuSection } from "@/components/menu/MenuSection";
import { CreateYourTacoSteps } from "@/components/home/CreateYourTacoSteps";
import { PromoSection } from "@/components/home/PromoSection";
import { ReviewsSection } from "@/components/home/ReviewsSection";
import { InstagramGrid } from "@/components/home/InstagramGrid";
import { FaqSection } from "@/components/home/FaqSection";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Tacos Galos · Pide directo · Tu taco, tus reglas",
  description: "El taco francés que está reventando Barcelona. 100% Halal. Pide directo en la web y desbloquea promos exclusivas.",
  path: "/",
});

export default function HomePage() {
  return (
    <>
      <Hero />
      <Marquee />
      <DirectOrderSection />
      <HowItWorks />
      <MenuSection />
      <CreateYourTacoSteps />
      <PromoSection />
      <ReviewsSection />
      <InstagramGrid />
      <FaqSection />
    </>
  );
}
