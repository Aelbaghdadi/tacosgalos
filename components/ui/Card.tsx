import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Card base de Tacos Galos: borde negro grueso + sombra hard + radius galos.
 * Es el átomo visual que se repite por toda la web.
 *
 * Fija SU PROPIO color de texto, y eso no es cosmética: la card pinta fondo
 * blanco, pero las secciones que la contienen no. `#carta` y las reseñas son
 * `bg-galos-red text-white`, y ese `text-white` se heredaba hasta dentro de la
 * card — cualquier texto sin color propio salía blanco sobre blanco. Al
 * titular de ProductCard le pasaba exactamente eso: estaba en el DOM, ocupaba
 * su sitio y solo se veía al seleccionarlo con el ratón.
 *
 * Tres sitios ya lo parcheaban a mano con `text-galos-black` en el className.
 * Puesto aquí, ninguno tiene que acordarse.
 */
export function Card({
  children,
  className,
  hover = true,
}: {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}) {
  return (
    <div
      className={cn(
        "bg-white text-galos-black border-[3px] border-galos-black rounded-galos shadow-hard",
        hover && "transition-transform hover:-translate-y-1.5",
        className
      )}
    >
      {children}
    </div>
  );
}
