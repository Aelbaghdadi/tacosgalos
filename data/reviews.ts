import type { Review } from "@/types";

/**
 * MOCK. No son reseñas reales verificadas. Para producción se debe integrar
 * Google Places API (textual + rating) o un agregador. Marcado con `mock: true`.
 */
export const REVIEWS: Review[] = [
  {
    id: "r1",
    rating: 5,
    author: "Marc",
    storeName: "Poblenou",
    text: "El taco XL es brutal. Llevo pidiéndolos cada finde. La web va mil veces más rápido que las apps.",
    source: "Google",
    mock: true,
  },
  {
    id: "r2",
    rating: 5,
    author: "Sara",
    storeName: "Sagrada Familia",
    text: "Mejor calidad/precio del barrio. La salsa Algerienne es vicio. Pidiendo directo te dan -10%, así que ni Glovo ni nada.",
    source: "Google",
    mock: true,
  },
  {
    id: "r3",
    rating: 4,
    author: "Yassin",
    storeName: "Mataró",
    text: "Muy buenos. Halal, generosos, y que tengan recogida en 8 min es oro puro.",
    source: "Google",
    mock: true,
  },
  {
    id: "r4",
    rating: 5,
    author: "Júlia",
    storeName: "Terrassa",
    text: "Llegué con hambre, salí lleno. El Cordon Bleu se sale.",
    source: "Tripadvisor",
    mock: true,
  },
  {
    id: "r5",
    rating: 5,
    author: "David",
    storeName: "Gavà",
    text: "El XXL para compartir vale cada euro. Pediré por web para sumar al Galos Club.",
    source: "Google",
    mock: true,
  },
  {
    id: "r6",
    rating: 5,
    author: "Núria",
    storeName: "Sabadell",
    text: "Que abran ya en el centro de Sabadell por favor. Vamos siempre a Terrassa por estos.",
    source: "Google",
    mock: true,
  },
];
