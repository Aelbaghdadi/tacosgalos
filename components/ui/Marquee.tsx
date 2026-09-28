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
      {/* Se para al pasar el ratón: WCAG 2.2.2 exige un mecanismo de pausa
          para cualquier movimiento automático de más de 5 segundos. */}
      <div className="inline-flex gap-10 whitespace-nowrap animate-marquee pl-[100%] hover:[animation-play-state:paused]">
        {[...ITEMS, ...ITEMS, ...ITEMS].map((item, i) => (
          <span key={i} className="inline-block">
            · {item}
          </span>
        ))}
      </div>
    </div>
  );
}
