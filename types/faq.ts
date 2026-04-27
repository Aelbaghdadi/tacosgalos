export interface Faq {
  id: string;
  q: string;
  a: string;
  /** Si aparece solo en una página de local. */
  storeId?: string;
}
