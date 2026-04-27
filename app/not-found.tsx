import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { StickerTitle, Hl } from "@/components/ui/StickerTitle";

export default function NotFound() {
  return (
    <section className="pt-page bg-galos-red text-white min-h-screen flex items-center">
      <div className="container mx-auto px-4 text-center py-20">
        <Image
          src="/images/mascots/mascot-peace.png"
          alt="Mascota Tacos Galos"
          width={260}
          height={340}
          priority
          className="mx-auto w-auto h-auto max-h-[300px] drop-shadow-[0_25px_25px_rgba(0,0,0,0.5)] mb-4"
        />
        <StickerTitle as="h1">
          <Hl>404</Hl>
        </StickerTitle>
        <p className="mt-4 text-lg">Esta página se ha fundido como nuestro queso.</p>
        <Button href="/" variant="white" size="xl" className="mt-6">
          Volver al inicio
        </Button>
      </div>
    </section>
  );
}
