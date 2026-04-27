import Image from "next/image";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Hl } from "@/components/ui/StickerTitle";

const STORIES = Array.from({ length: 8 }, (_, i) => `/images/story-${i}.jpeg`);

export function InstagramGrid() {
  return (
    <section className="py-24 bg-galos-cream">
      <div className="container mx-auto px-4">
        <SectionHeading
          eyebrow="@tacosgalos"
          eyebrowVariant="dark"
          title={<>SÍGUENOS QUE <Hl variant="dark">NO NOS SIGUES</Hl></>}
        />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5">
          {STORIES.map((src, i) => (
            <a
              key={src}
              href="https://www.instagram.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="relative aspect-[9/16] rounded-galos-sm overflow-hidden border-[3px] border-galos-black shadow-[0_6px_0_#0F0F0F] transition-transform hover:-translate-y-1 hover:scale-[1.02]"
            >
              <Image
                src={src}
                alt={`Story Tacos Galos ${i + 1}`}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover"
              />
              <span className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/50 pointer-events-none" />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
