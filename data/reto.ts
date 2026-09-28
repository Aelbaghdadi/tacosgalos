import { STORES } from "./stores";

/**
 * ============================================================
 *  EL RETO — fuente única de verdad
 * ============================================================
 *
 *  Tacos Galos narra en TikTok un reto público de 1.000.000 €
 *  para abrir el máximo de locales en 60 días ("DÍA 57/60").
 *
 *  Decisión de arquitectura: el día NO se guarda en ningún sitio.
 *  Se DERIVA de `startDate`, así que avanza solo, es determinista
 *  y es idéntico en todos los navegadores. Nunca se desincroniza.
 *
 *  ⚠️ PENDIENTE DE CONFIRMAR CON LA MARCA:
 *  `startDate` es una estimación a partir de sus publicaciones.
 *  Preguntar la fecha exacta de arranque antes de la presentación.
 * ============================================================
 */
export const RETO = {
  startDate: "2026-07-21",
  totalDias: 60,
  objetivoEuros: 1_000_000,
  /** Cifra cerrada de 2025, verificada en prensa. NO es un contador en vivo. */
  tacos2025: 720_000,
  crecimientoPct: 260,
  proximaApertura: {
    ciudad: "Manresa",
    slug: "manresa",
    fecha: "2026-09-19",
  },
} as const;

export const MS_DIA = 86_400_000;

const parseFecha = (iso: string): number =>
  new Date(`${iso}T00:00:00`).getTime();

/**
 * Día SIN acotar. Es el único que puede decidir si el reto ha terminado.
 *
 * ⚠️ BOMBA DE RELOJERÍA CORREGIDA: antes sólo existía el día acotado y
 * `retoCompletado` comparaba `dia >= totalDias` contra él. Como el clamp
 * fija el valor en 60, en cuanto se llegaba al día 60 —que TODAVÍA es día
 * de reto— quedaba "completado" para siempre, sin vuelta atrás. Y bastaban
 * dos pulsaciones de "Pasa el día" en el panel para dispararlo en la demo.
 */
export function diaCrudo(now: number, offset = 0): number {
  const transcurridos = Math.floor((now - parseFecha(RETO.startDate)) / MS_DIA);
  return Math.max(1, transcurridos + 1 + offset);
}

/** Día que se PINTA, acotado a [1, totalDias]. */
export function diaDelReto(now: number, offset = 0): number {
  return Math.min(RETO.totalDias, diaCrudo(now, offset));
}

/** El reto termina cuando se pasa del último día, no cuando se llega a él. */
export function retoCompletado(now: number, offset = 0): boolean {
  return diaCrudo(now, offset) > RETO.totalDias;
}

/** Días que faltan para la próxima apertura. 0 = hoy. */
export function diasParaApertura(now: number): number {
  return Math.max(0, Math.ceil((parseFecha(RETO.proximaApertura.fecha) - now) / MS_DIA));
}

/** Locales abiertos según los datos. Nunca hardcodear este número. */
export const LOCALES_ABIERTOS_BASE = STORES.filter((s) => s.status === "open").length;

/** Locales que aún no han abierto — los que el panel puede "abrir" en la demo. */
export const LOCALES_PENDIENTES = STORES.filter((s) => s.status !== "open");
