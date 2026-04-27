/**
 * Local físico de Tacos Galos. Multi-local listo desde día uno.
 * Mapeable a una tabla `stores` en Supabase.
 */
export type StoreArea = "bcn" | "metro" | "vall";
export type StoreStatus = "open" | "closed" | "coming_soon";
export type ServiceType = "delivery" | "pickup";

export interface OpeningHours {
  /** 0 = domingo, 1 = lunes, ..., 6 = sábado. */
  day: number;
  open: string; // "12:30"
  close: string; // "23:30"
}

export interface Store {
  id: string;
  slug: string;
  name: string;
  city: string;
  address: string;
  area: StoreArea;
  phone?: string;
  /** Lat/Lng para futura geolocalización del cliente. */
  coords?: { lat: number; lng: number };
  openingHours: OpeningHours[];
  services: ServiceType[];
  pickupEtaMinutes: number;
  deliveryEtaMinutes?: number;
  deliveryRadiusKm?: number;
  status: StoreStatus;
  googleMapsUrl: string;
  /** SEO local — clave para captar tráfico orgánico. */
  seoTitle: string;
  seoDescription: string;
}
