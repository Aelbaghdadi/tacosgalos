export type ReviewSource = "Google" | "Tripadvisor" | "Web";

export interface Review {
  id: string;
  rating: 1 | 2 | 3 | 4 | 5;
  author: string;
  storeName: string;
  text: string;
  source: ReviewSource;
  /** Recordatorio: estos datos son MOCK hasta integrar Google Places API real. */
  mock: boolean;
}
