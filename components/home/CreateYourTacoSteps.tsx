import Image from "next/image";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Hl } from "@/components/ui/StickerTitle";

const STEPS = [
  { n: "01", title: "Elige tamaño", desc: "M, L, XL o el bestial XXL." },
  { n: "02", title: "Elige carne", desc: "Pollo, ternera, kebab, nuggets… 100% halal." },
  { n: "03", title: "Elige queso", desc: "Cheddar, mozzarella, raclette o doble fundido." },
  { n: "04", title: "Salsas", desc: "Algerienne, Brazil, Samurái, BBQ… combina hasta 3." },
];

export function CreateYourTacoSteps() {
  return (
    <section id="crea" className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <SectionHeading
          eyebrow="Personalización"
          eyebrowVariant="dark"
          title={<>CREA TU TACO EN <Hl variant="dark">4 PASOS</Hl></>}
          subtitle="Crea tu taco. Elige tu salsa. Rompe el hambre."
        />

        <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {STEPS.map((s) => (
            <li
              key={s.n}
              className="bg-galos-cream border-[3px] border-galos-black rounded-galos shadow-hard p-7 transition-transform hover:-translate-y-1.5"
            >
              <div className="tg-step-num font-anton text-5xl text-galos-red leading-none mb-3">
                {s.n}
              </div>
              <h3 className="font-anton text-2xl uppercase tracking-wide mb-1.5">{s.title}</h3>
              <p className="text-neutral-700 font-semibold text-sm">{s.desc}</p>
            </li>
          ))}
        </ol>

        <div className="max-w-md mx-auto mt-12 flex justify-center">
          <Image
            src="/images/mascots/mascot-chef-taco.png"
            alt="Mascota Tacos Galos chef preparando un taco con todos los ingredientes"
            width={460}
            height={520}
            className="w-auto h-auto max-h-[420px] drop-shadow-[0_20px_20px_rgba(0,0,0,0.25)]"
          />
        </div>
      </div>
    </section>
  );
}
