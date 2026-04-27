import { SectionHeading } from "@/components/ui/SectionHeading";
import { Hl } from "@/components/ui/StickerTitle";

const STEPS = [
  { n: 1, title: "Pides directo", desc: "En la web. Sin apps de intermediarios." },
  { n: 2, title: "Eliges tu local", desc: "Tu local más cercano se prepara para tu pedido." },
  { n: 3, title: "Cocina lo recibe", desc: "Pasa al KDS al instante. Sale en 8 min." },
  { n: 4, title: "Recoges o te lo llevamos", desc: "Pickup rápido o delivery directo." },
  { n: 5, title: "Ganas promos y puntos", desc: "Galos Club: cada pedido suma." },
];

export function HowItWorks() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <SectionHeading
          eyebrow="Cómo funciona"
          title={<>DEL ANTOJO AL <Hl>BOCADO</Hl></>}
          subtitle="5 pasos. Sin apps de por medio."
        />
        <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {STEPS.map((s) => (
            <li key={s.n} className="bg-galos-cream border-[3px] border-galos-black rounded-galos shadow-hard p-6 relative">
              <div className="absolute -top-4 -left-2 bg-galos-red text-white border-[3px] border-galos-black rounded-full w-12 h-12 flex items-center justify-center font-anton text-2xl shadow-hard-sm">
                {s.n}
              </div>
              <h3 className="font-anton text-xl uppercase tracking-wide mt-4 mb-1.5">{s.title}</h3>
              <p className="text-sm text-neutral-700 font-semibold">{s.desc}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
