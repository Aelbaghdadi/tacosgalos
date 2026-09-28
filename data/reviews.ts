import type { Review } from "@/types";

/**
 * ⚠️ TESTIMONIOS DE MUESTRA — NO SON RESEÑAS REALES.
 *
 * Antes iban con `source: "Google"` y `"Tripadvisor"` y se pintaban en la home
 * como "vía Google". Publicar reseñas fabricadas atribuidas a plataformas
 * reales es práctica desleal engañosa (RD-ley 24/2021, Directiva Ómnibus,
 * en vigor desde el 28/05/2022). Con una marca real detrás, eso es riesgo
 * legal y reputacional, no un detalle de maquetación.
 *
 * Ya no se atribuyen a ninguna plataforma y la home no publica nota media.
 *
 * PARA PRODUCCIÓN: pedirle a la marca acceso a su Google Business Profile e
 * integrar Google Places API. Es lo único que permite enseñar una valoración
 * media verdadera. Hasta entonces, esta sección va sin cifras.
 */
export const REVIEWS: Review[] = [
  // Eliminados r1 y r2: uno elogiaba la velocidad de una web que todavía no
  // existe ("va mil veces más rápido que las apps") y el otro repetía la
  // afirmación de precio que hemos tenido que retirar de la home. Eran los
  // dos testimonios que un lector podía desmentir leyendo la propia web.
  {
    id: "r3",
    rating: 4,
    author: "Yassin",
    storeName: "Mataró",
    text: "Muy buenos. Halal, generosos, y que tengan recogida en 8 min es oro puro.",
    source: "Web",
    mock: true,
  },
  {
    id: "r4",
    rating: 5,
    author: "Júlia",
    storeName: "Terrassa",
    text: "Llegué con hambre, salí lleno. El Cordon Bleu se sale.",
    source: "Web",
    mock: true,
  },
  {
    id: "r5",
    rating: 5,
    author: "David",
    storeName: "Gavà",
    text: "El XXL para compartir vale cada euro.",
    source: "Web",
    mock: true,
  },
  {
    id: "r6",
    rating: 5,
    author: "Núria",
    storeName: "Sabadell",
    text: "Crujiente por fuera, fundido por dentro. Justo lo que prometen.",
    source: "Web",
    mock: true,
  },
];
