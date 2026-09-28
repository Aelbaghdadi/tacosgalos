"use client";

/**
 * ============================================================
 *  GENERADOR DE CREATIVIDADES — 1080×1920 para stories
 * ============================================================
 *
 *  Esta es la pieza que quita trabajo de verdad: el equipo
 *  fabrica a mano una pieza vertical cada día del reto.
 *  Aquí sale en dos toques, con la estética exacta de la marca.
 *
 *  Paleta y tratamiento extraídos del propio repo:
 *    - tailwind.config.ts  → rojo #E30613, negro #0F0F0F, oro #F5C518
 *    - globals.css         → .tg-sticker: -webkit-text-stroke 2px + sombra dura
 *    - boxShadow.hard      → 0 8px 0 #0F0F0F (offset sólido, sin blur)
 * ============================================================
 */

export const LIENZO = { w: 1080, h: 1920 } as const;

const ROJO = "#E30613";
const ROJO_HONDO = "#7A0309";
const NEGRO = "#0F0F0F";
const CREMA = "#FFF8F0";
const ORO = "#F5C518";

export type PlantillaId = "dia" | "apertura" | "taco1e" | "tacos";

export interface DatosCreatividad {
  plantilla: PlantillaId;
  dia: number;
  totalDias: number;
  locales: number;
  ciudad?: string;
  tacos: number;
  crecimiento: number;
}

/**
 * ⚠️ LA TRAMPA QUE ROMPE ESTO EN SILENCIO ⚠️
 *
 * `next/font/google` NO registra la familia con el nombre "Anton".
 * Le asigna uno hasheado (tipo `__Anton_a1b2c3`) y lo expone vía
 * la variable CSS --font-anton. Si escribes:
 *
 *     ctx.font = "400 120px Anton"
 *
 * el canvas NO encuentra esa familia, cae a system-ui sin avisar,
 * y el PNG sale con otra tipografía — con cara de plantilla genérica.
 *
 * Por eso resolvemos la familia real desde el DOM, midiendo un nodo
 * que lleve la clase de Tailwind correspondiente.
 */
export function resolverFamilia(className: string, fallback: string): string {
  if (typeof document === "undefined") return fallback;
  const sonda = document.createElement("span");
  sonda.className = className;
  sonda.setAttribute(
    "style",
    "position:absolute;left:-9999px;top:-9999px;visibility:hidden"
  );
  sonda.textContent = "A";
  document.body.appendChild(sonda);
  const familia = getComputedStyle(sonda).fontFamily;
  document.body.removeChild(sonda);
  return familia || fallback;
}

/** Réplica en canvas del efecto .tg-sticker: sombra dura + contorno + relleno. */
function sticker(
  ctx: CanvasRenderingContext2D,
  texto: string,
  x: number,
  y: number,
  tam: number,
  familia: string,
  relleno: string,
  contorno: string
): void {
  ctx.save();
  ctx.font = `400 ${tam}px ${familia}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.lineJoin = "round";
  ctx.miterLimit = 2;

  // Sombra dura sólida (equivalente a boxShadow.hard: 0 8px 0)
  ctx.fillStyle = "rgba(0,0,0,.45)";
  ctx.fillText(texto, x, y + tam * 0.07);

  // Contorno. En canvas el trazo va centrado, así que se dobla el grosor.
  ctx.lineWidth = Math.max(6, tam * 0.085);
  ctx.strokeStyle = contorno;
  ctx.strokeText(texto, x, y);

  ctx.fillStyle = relleno;
  ctx.fillText(texto, x, y);
  ctx.restore();
}

/** Parte un texto en líneas que quepan en `maxAncho`. */
function partirLineas(
  ctx: CanvasRenderingContext2D,
  texto: string,
  tam: number,
  familia: string,
  maxAncho: number
): string[] {
  ctx.font = `400 ${tam}px ${familia}`;
  const palabras = texto.split(" ");
  const lineas: string[] = [];
  let actual = "";
  for (const p of palabras) {
    const prueba = actual ? `${actual} ${p}` : p;
    if (ctx.measureText(prueba).width > maxAncho && actual) {
      lineas.push(actual);
      actual = p;
    } else {
      actual = prueba;
    }
  }
  if (actual) lineas.push(actual);
  return lineas;
}

function pildora(
  ctx: CanvasRenderingContext2D,
  texto: string,
  cx: number,
  cy: number,
  tam: number,
  familia: string,
  fondo: string,
  tinta: string
): void {
  ctx.save();
  ctx.font = `700 ${tam}px ${familia}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  const ancho = ctx.measureText(texto).width + tam * 2.2;
  const alto = tam * 2.4;
  const x = cx - ancho / 2;
  const y = cy - alto / 2;
  const r = alto / 2;

  ctx.fillStyle = NEGRO;
  ctx.beginPath();
  ctx.roundRect(x, y + 10, ancho, alto, r);
  ctx.fill();

  ctx.fillStyle = fondo;
  ctx.strokeStyle = NEGRO;
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.roundRect(x, y, ancho, alto, r);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = tinta;
  ctx.fillText(texto, cx, cy);
  ctx.restore();
}

function textoPlantilla(d: DatosCreatividad): { titular: string; pie: string } {
  switch (d.plantilla) {
    case "apertura":
      return {
        titular: d.ciudad ? `${d.ciudad.toUpperCase()} YA ESTÁ ABIERTO` : "NUEVO LOCAL ABIERTO",
        pie: `${d.locales} LOCALES EN CATALUÑA`,
      };
    case "taco1e":
      return {
        titular: d.ciudad ? `TACO A 1 € EN ${d.ciudad.toUpperCase()}` : "TACO A 1 €",
        pie: "SOLO EL DÍA DE LA APERTURA",
      };
    case "tacos":
      return {
        titular: `${d.tacos.toLocaleString("es-ES")} TACOS`,
        pie: `+${d.crecimiento}% VS EL AÑO PASADO`,
      };
    case "dia":
    default:
      return {
        titular: d.locales === 1 ? "1 LOCAL ABIERTO" : `${d.locales} LOCALES ABIERTOS`,
        pie: `${d.tacos.toLocaleString("es-ES")} TACOS · +${d.crecimiento}%`,
      };
  }
}

/** Dibuja la creatividad y devuelve el PNG como Blob. */
export async function generarCreatividad(d: DatosCreatividad): Promise<Blob> {
  // Sin esto, la primera generación puede dibujarse antes de que la fuente cargue.
  if (typeof document !== "undefined" && document.fonts?.ready) {
    await document.fonts.ready;
  }

  const display = resolverFamilia("font-anton", "Impact, sans-serif");
  const cuerpo = resolverFamilia("font-sans", "system-ui, sans-serif");

  const canvas = document.createElement("canvas");
  canvas.width = LIENZO.w;
  canvas.height = LIENZO.h;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("No se pudo crear el contexto de canvas");

  const { w, h } = LIENZO;
  const cx = w / 2;

  // --- Fondo rojo con profundidad radial (como el hero) ---
  ctx.fillStyle = ROJO;
  ctx.fillRect(0, 0, w, h);
  const halo = ctx.createRadialGradient(w * 0.8, h * 0.18, 0, w * 0.8, h * 0.18, w * 1.1);
  halo.addColorStop(0, "rgba(255,255,255,.14)");
  halo.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = halo;
  ctx.fillRect(0, 0, w, h);
  const sombra = ctx.createRadialGradient(w * 0.1, h * 0.92, 0, w * 0.1, h * 0.92, w);
  sombra.addColorStop(0, "rgba(0,0,0,.35)");
  sombra.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = sombra;
  ctx.fillRect(0, 0, w, h);

  // Textura waffle diagonal, igual que el Hero
  ctx.save();
  ctx.globalAlpha = 0.07;
  ctx.strokeStyle = "#FFFFFF";
  ctx.lineWidth = 14;
  for (let i = -h; i < w + h; i += 80) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i + h, h);
    ctx.stroke();
  }
  ctx.restore();

  const { titular, pie } = textoPlantilla(d);

  // --- Marca arriba ---
  pildora(ctx, "TACOS GALOS", cx, 190, 34, cuerpo, ORO, NEGRO);

  // --- El número del día, protagonista ---
  const completado = d.dia >= d.totalDias;
  if (completado) {
    sticker(ctx, "RETO", cx, 520, 190, display, CREMA, NEGRO);
    sticker(ctx, "COMPLETADO", cx, 690, 130, display, ORO, NEGRO);
  } else {
    ctx.save();
    ctx.font = `700 48px ${cuerpo}`;
    ctx.fillStyle = "rgba(255,255,255,.85)";
    ctx.textAlign = "center";
    ctx.fillText("DÍA", cx, 420);
    ctx.restore();
    sticker(ctx, `${d.dia}/${d.totalDias}`, cx, 610, 260, display, CREMA, NEGRO);
  }

  // --- Titular, hasta 3 líneas ---
  const tamTitular = titular.length > 22 ? 96 : 116;
  const lineas = partirLineas(ctx, titular, tamTitular, display, w - 140).slice(0, 3);
  const alturaLinea = tamTitular * 1.06;
  let y = 1010 - ((lineas.length - 1) * alturaLinea) / 2;
  for (const linea of lineas) {
    sticker(ctx, linea, cx, y, tamTitular, display, ORO, NEGRO);
    y += alturaLinea;
  }

  // --- Banda inferior con el dato de apoyo ---
  ctx.save();
  ctx.fillStyle = NEGRO;
  ctx.fillRect(0, h - 430, w, 200);
  ctx.strokeStyle = CREMA;
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.moveTo(0, h - 430);
  ctx.lineTo(w, h - 430);
  ctx.moveTo(0, h - 230);
  ctx.lineTo(w, h - 230);
  ctx.stroke();

  ctx.font = `400 62px ${display}`;
  ctx.fillStyle = CREMA;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(pie.toUpperCase(), cx, h - 330);
  ctx.restore();

  // --- Pie de marca ---
  ctx.save();
  ctx.font = `700 40px ${cuerpo}`;
  ctx.fillStyle = "rgba(255,255,255,.9)";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("100% HALAL · PIDE DIRECTO", cx, h - 130);
  ctx.restore();

  return await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("toBlob devolvió null"))),
      "image/png"
    );
  });
}

/**
 * Comparte el PNG por el menú nativo del teléfono. Si el dispositivo no
 * soporta compartir ficheros (escritorio), cae a descarga directa.
 * Devuelve cómo acabó para poder decírselo al usuario.
 */
export async function compartirCreatividad(
  blob: Blob,
  nombre: string
): Promise<"compartido" | "descargado" | "cancelado"> {
  const file = new File([blob], nombre, { type: "image/png" });

  const nav = navigator as Navigator & {
    canShare?: (data: ShareData) => boolean;
    share?: (data: ShareData) => Promise<void>;
  };

  if (nav.share && nav.canShare?.({ files: [file] })) {
    try {
      await nav.share({ files: [file], title: "Tacos Galos" });
      return "compartido";
    } catch (e) {
      // El usuario cerró la hoja de compartir: no es un error.
      if (e instanceof DOMException && e.name === "AbortError") return "cancelado";
    }
  }

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = nombre;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  return "descargado";
}
