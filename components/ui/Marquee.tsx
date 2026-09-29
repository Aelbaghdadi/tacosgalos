/**
 * Cinta marquesina viral. Repite items para loop continuo.
 *
 * El relleno inferior NO es decoración: la sección siguiente monta una onda
 * crema que sube sobre esta franja, y la curva partía las letras por la mitad
 * — parecía un fallo de recorte, no una transición. El `pb` reserva justo la
 * altura que la onda va a morder, así que la curva se come relleno negro y el
 * texto queda entero. La franja negra sigue viéndose igual de fina porque lo
 * que sobra queda tapado por la propia onda.
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
      className="relative bg-galos-black text-white border-y-[3px] border-white
                  overflow-hidden font-anton text-xl tracking-widest uppercase
                  pt-3 pb-[34px] sm:pb-[56px] lg:pb-[78px]"
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
