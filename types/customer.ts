/**
 * Cliente registrado (Galos Club). Hoy guest, mañana cuenta.
 */
export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  /** Direcciones guardadas para checkout rápido. */
  addresses?: SavedAddress[];
  /** Programa de fidelización. */
  loyalty?: {
    points: number;
    tier: "rookie" | "club" | "vip";
  };
  marketingConsent?: boolean;
  createdAt: string;
}

export interface SavedAddress {
  id: string;
  alias: string; // "Casa", "Trabajo"
  address: string;
  city: string;
  postalCode: string;
  notes?: string;
}
