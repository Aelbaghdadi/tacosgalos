/**
 * Cinta marquesina viral. Repite items para loop continuo.
 */
const ITEMS = [
  "MENOS APPS · MÁS TACO · MÁS PROMO",
  "DEL LOCAL A TUS MANOS, SIN VUELTAS",
  "100% HALAL · 100% GALOS",
  "MENÚ LOCO 9,90€",
  "MEGABOX VIRAL",
  "RECOGIDA EN 8 MIN",
  "NUEVO · TOKYO KENTHAKY",
];

export function Marquee() {
  return (
    <div
      aria-hidden
      className="relative bg-galos-black text-white border-y-[3px] border-white py-3 overflow-hidden font-anton text-xl tracking-widest uppercase"
    >
      <div className="inline-flex gap-10 whitespace-nowrap animate-marquee pl-[100%]">
        {[...ITEMS, ...ITEMS, ...ITEMS].map((item, i) => (
          <span key={i} className="inline-block">
            · {item}
          </span>
        ))}
      </div>
    </div>
  );
}
