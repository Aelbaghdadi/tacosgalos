/**
 * ============================================================
 *  Higgsfield · generación de imagen por API
 * ============================================================
 *
 *  Uso:
 *    npm run higgsfield:image -- "un taco francés sobre fondo rojo"
 *    npm run higgsfield:image -- "..." --modelo higgsfield-ai/soul/v2/standard
 *    npm run higgsfield:image -- "..." --opt aspect_ratio=9:16 --opt seed=1234
 *
 *  Hace cuatro cosas, en este orden: envía el prompt, espera a que el trabajo
 *  termine, descarga el resultado y lo guarda en public/generated/.
 *
 *  ── Por qué no hay dependencias nuevas ──────────────────────────────
 *  Node 22 ya trae lo necesario: `--env-file` carga el .env y
 *  `--experimental-strip-types` ejecuta TypeScript directamente. Añadir
 *  `dotenv` + `tsx` a un proyecto que no los necesita son dos dependencias
 *  más que mantener para no ganar nada. Ambos flags van en el script de
 *  package.json.
 *
 *  ⚠️ Esto es un script de SERVIDOR. Las credenciales no pueden salir al
 *  navegador: quien pueda leer el bundle puede gastar tu saldo. Por eso las
 *  variables NO llevan el prefijo NEXT_PUBLIC_.
 *
 *  Endpoints según la documentación oficial (docs.higgsfield.ai, consultada
 *  el 2026-10-01):
 *
 *    POST https://api.higgsfield.ai/{modelo}        → { request_id, status }
 *    GET  https://api.higgsfield.ai/requests/{id}/status
 *
 *    Cabecera: Authorization: Key {KEY_ID}:{KEY_SECRET}
 * ============================================================
 */

import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { randomUUID } from "node:crypto";

const BASE = "https://api.higgsfield.ai";
const MODELO_POR_DEFECTO = "higgsfield-ai/soul/v2/standard";
const DESTINO = join(process.cwd(), "public", "generated");

/** Tiempo máximo de UNA petición HTTP. Lo recomienda la documentación. */
const TIMEOUT_HTTP_MS = 30_000;
/** Tiempo máximo esperando a que el trabajo termine. */
const TIMEOUT_TOTAL_MS = 10 * 60_000;
/** La documentación pide empezar en 2 s y subir gradualmente hasta 10 s. */
const ESPERA_INICIAL_MS = 2_000;
const ESPERA_MAXIMA_MS = 10_000;

/* ── Credenciales ──────────────────────────────────────────────────── */

const KEY_ID = process.env.HIGGSFIELD_API_KEY_ID;
const KEY_SECRET = process.env.HIGGSFIELD_API_KEY_SECRET;

/**
 * Red de seguridad para no filtrar las claves por consola.
 *
 * No basta con "acordarse de no imprimirlas": el que las imprime puede ser el
 * servidor, devolviéndolas dentro del cuerpo de un error, o una traza que
 * arrastre la cabecera. Todo lo que se escribe por pantalla pasa por aquí
 * primero, así que para que una clave se escape tendría que haber un `console`
 * que se saltara esta función.
 */
function redactar(texto: string): string {
  let limpio = texto;
  for (const secreto of [KEY_SECRET, KEY_ID]) {
    if (secreto && secreto.length >= 6) {
      limpio = limpio.split(secreto).join("«oculto»");
    }
  }
  return limpio;
}

const log = (...partes: unknown[]) =>
  console.log(redactar(partes.map((p) => String(p)).join(" ")));
const logError = (...partes: unknown[]) =>
  console.error(redactar(partes.map((p) => String(p)).join(" ")));

/* ── Errores ───────────────────────────────────────────────────────── */

class ErrorHiggsfield extends Error {
  codigo: number;
  /** true = reintentar tiene sentido; false = hay que cambiar algo primero. */
  reintentable: boolean;

  constructor(mensaje: string, codigo: number, reintentable: boolean) {
    super(mensaje);
    this.name = "ErrorHiggsfield";
    this.codigo = codigo;
    this.reintentable = reintentable;
  }
}

/**
 * Traduce los códigos documentados a un mensaje que diga qué hacer.
 *
 * Nota: el saldo insuficiente es **403**, no 402 como en tantas APIs. Si se
 * tratara como "prohibido" genérico, el error que ve quien lo ejecuta sería
 * "credenciales" cuando en realidad lo que falta es dinero en la cuenta.
 */
function explicar(codigo: number, detalle: string): ErrorHiggsfield {
  const guia: Record<number, [string, boolean]> = {
    400: ["Parámetros inválidos, entrada rechazada o límite de concurrencia alcanzado.", false],
    401: [
      "Credenciales inválidas o ausentes. Revisa HIGGSFIELD_API_KEY_ID y " +
        "HIGGSFIELD_API_KEY_SECRET en .env (y que el .env se esté cargando).",
      false,
    ],
    403: [
      "SALDO INSUFICIENTE. La cuenta no tiene créditos para esta generación: " +
        "recarga en console.higgsfield.ai y vuelve a lanzarlo.",
      false,
    ],
    404: ["El modelo o la petición no existen para esta cuenta.", false],
    422: [
      "Validación fallida, o se ha reutilizado una Idempotency-Key con " +
        "parámetros distintos.",
      false,
    ],
    423: ["El modelo está bloqueado temporalmente. Inténtalo más tarde.", false],
    500: ["Error inesperado del servidor.", true],
    503: ["El modelo está deshabilitado o todavía no está listo.", false],
  };
  const [mensaje, reintentable] = guia[codigo] ?? [
    `Respuesta HTTP ${codigo} no esperada.`,
    codigo >= 500,
  ];
  return new ErrorHiggsfield(
    detalle ? `${mensaje}\n   Detalle de la API: ${detalle}` : mensaje,
    codigo,
    reintentable
  );
}

/* ── Cliente HTTP ──────────────────────────────────────────────────── */

type Media = { url: string };

type RespuestaEstado = {
  status: "queued" | "in_progress" | "completed" | "failed" | "nsfw" | "canceled";
  request_id: string;
  error?: string | null;
  images?: Media[];
  video?: Media | null;
  audios?: Media[];
};

function cabeceras(extra: Record<string, string> = {}): Record<string, string> {
  return {
    /* Formato exacto de la documentación: `Key <id>:<secreto>`. */
    Authorization: `Key ${KEY_ID}:${KEY_SECRET}`,
    ...extra,
  };
}

/** Lee el cuerpo del error sin reventar si no es JSON. */
async function detalleDeError(res: Response): Promise<string> {
  try {
    const texto = await res.text();
    if (!texto) return "";
    try {
      const json = JSON.parse(texto) as { detail?: string; error?: string };
      return json.detail ?? json.error ?? texto.slice(0, 300);
    } catch {
      return texto.slice(0, 300);
    }
  } catch {
    return "";
  }
}

const dormir = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** Espera con retroceso exponencial y algo de ruido, como pide la doc. */
function conRuido(ms: number): number {
  return Math.round(ms * (0.75 + Math.random() * 0.5));
}

/* ── Paso 1 · enviar el prompt ─────────────────────────────────────── */

async function enviar(
  modelo: string,
  cuerpo: Record<string, unknown>
): Promise<string> {
  /*
    La Idempotency-Key es la que hace seguro reintentar: si la primera
    petición llegó al servidor pero la respuesta se perdió, repetirla con la
    misma clave devuelve el MISMO trabajo en vez de cobrar una segunda
    generación. Por eso se genera una vez, fuera del bucle.
  */
  const idempotencia = randomUUID();
  const url = `${BASE}/${modelo.replace(/^\/+/, "")}`;

  let intento = 0;
  let espera = 1_000;
  for (;;) {
    intento++;
    let res: Response;
    try {
      res = await fetch(url, {
        method: "POST",
        headers: cabeceras({
          "Content-Type": "application/json",
          "Idempotency-Key": idempotencia,
        }),
        body: JSON.stringify(cuerpo),
        signal: AbortSignal.timeout(TIMEOUT_HTTP_MS),
      });
    } catch (e) {
      /* Fallo de red o timeout: reintentable, pero no eternamente. */
      if (intento >= 4) {
        throw new ErrorHiggsfield(
          `No se pudo contactar con la API tras ${intento} intentos: ${(e as Error).message}`,
          0,
          true
        );
      }
      log(`   red falló (intento ${intento}), reintentando…`);
      await dormir(conRuido((espera *= 2)));
      continue;
    }

    if (res.ok) {
      const json = (await res.json()) as { request_id?: string; status?: string };
      if (!json.request_id) {
        throw new ErrorHiggsfield(
          "La API aceptó la petición pero no devolvió request_id.",
          0,
          false
        );
      }
      return json.request_id;
    }

    const err = explicar(res.status, await detalleDeError(res));
    if (!err.reintentable || intento >= 4) throw err;
    log(`   HTTP ${res.status} (intento ${intento}), reintentando…`);
    await dormir(conRuido((espera *= 2)));
  }
}

/* ── Paso 2 · esperar a que termine ────────────────────────────────── */

async function esperar(requestId: string): Promise<RespuestaEstado> {
  const limite = Date.now() + TIMEOUT_TOTAL_MS;
  let espera = ESPERA_INICIAL_MS;
  let ultimo = "";
  let fallosSeguidos = 0;

  for (;;) {
    if (Date.now() > limite) {
      throw new ErrorHiggsfield(
        `El trabajo ${requestId} sigue sin terminar tras ${TIMEOUT_TOTAL_MS / 60_000} minutos.`,
        0,
        false
      );
    }

    await dormir(conRuido(espera));
    /* Sube de 2 s a 10 s poco a poco, para no castigar la API en trabajos largos. */
    espera = Math.min(ESPERA_MAXIMA_MS, Math.round(espera * 1.4));

    let res: Response;
    try {
      res = await fetch(`${BASE}/requests/${requestId}/status`, {
        headers: cabeceras(),
        signal: AbortSignal.timeout(TIMEOUT_HTTP_MS),
      });
    } catch {
      /* Un fallo de red mientras se espera no invalida el trabajo: sigue vivo
         en el servidor. Se reintenta, que es justo lo que pide la doc. */
      if (++fallosSeguidos >= 6) {
        throw new ErrorHiggsfield(
          "Se perdió la conexión repetidamente mientras se consultaba el estado.",
          0,
          true
        );
      }
      continue;
    }

    if (res.status >= 500) {
      if (++fallosSeguidos >= 6) throw explicar(res.status, await detalleDeError(res));
      continue;
    }
    if (!res.ok) throw explicar(res.status, await detalleDeError(res));
    fallosSeguidos = 0;

    const estado = (await res.json()) as RespuestaEstado;
    if (estado.status !== ultimo) {
      log(`   estado: ${estado.status}`);
      ultimo = estado.status;
    }

    switch (estado.status) {
      case "completed":
        return estado;
      case "failed":
        throw new ErrorHiggsfield(
          `El modelo no pudo generar la imagen: ${estado.error ?? "sin detalle"}`,
          0,
          false
        );
      case "nsfw":
        throw new ErrorHiggsfield(
          "El filtro de contenido ha rechazado el resultado. Reformula el prompt.",
          0,
          false
        );
      case "canceled":
        throw new ErrorHiggsfield("El trabajo fue cancelado.", 0, false);
      default:
        /* queued | in_progress → seguir esperando */
        break;
    }
  }
}

/* ── Paso 3 · descargar y guardar ──────────────────────────────────── */

function trozoDeNombre(prompt: string): string {
  return (
    prompt
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 40) || "imagen"
  );
}

function extensionDe(url: string, contentType: string | null): string {
  if (contentType?.includes("png")) return "png";
  if (contentType?.includes("webp")) return "webp";
  if (contentType?.includes("jpeg") || contentType?.includes("jpg")) return "jpg";
  const porUrl = new URL(url).pathname.match(/\.([a-z0-9]{3,4})$/i);
  return porUrl ? porUrl[1].toLowerCase() : "jpg";
}

async function descargar(url: string, prompt: string, requestId: string): Promise<string> {
  const res = await fetch(url, { signal: AbortSignal.timeout(TIMEOUT_HTTP_MS) });
  if (!res.ok) {
    throw new ErrorHiggsfield(
      `La imagen se generó pero no se pudo descargar (HTTP ${res.status}). ` +
        `URL todavía válida: ${url}`,
      res.status,
      true
    );
  }
  const datos = Buffer.from(await res.arrayBuffer());
  const ext = extensionDe(url, res.headers.get("content-type"));
  const fecha = new Date().toISOString().slice(0, 10);
  const nombre = `${fecha}-${trozoDeNombre(prompt)}-${requestId.slice(0, 8)}.${ext}`;

  await mkdir(DESTINO, { recursive: true });
  const ruta = join(DESTINO, nombre);
  await writeFile(ruta, datos);
  return ruta;
}

/* ── Argumentos ────────────────────────────────────────────────────── */

type Opciones = {
  prompt: string;
  modelo: string;
  extra: Record<string, unknown>;
};

function leerArgumentos(argv: string[]): Opciones {
  const sueltos: string[] = [];
  let modelo = MODELO_POR_DEFECTO;
  const extra: Record<string, unknown> = {};

  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--modelo" || a === "--model") {
      modelo = argv[++i] ?? modelo;
    } else if (a === "--opt") {
      /*
        Pasarela para los parámetros propios de cada modelo (aspect_ratio,
        seed, quality…). No se validan aquí a propósito: la lista depende del
        modelo y vive en su ficha de la consola, así que inventarse un esquema
        aquí solo serviría para quedarse desactualizado y rechazar opciones
        válidas. Si el valor no sirve, la API responde 400 o 422 y el error
        se imprime tal cual.
      */
      const par = argv[++i] ?? "";
      const corte = par.indexOf("=");
      if (corte > 0) {
        const clave = par.slice(0, corte);
        const valor = par.slice(corte + 1);
        extra[clave] = /^-?\d+(\.\d+)?$/.test(valor) ? Number(valor) : valor;
      }
    } else {
      sueltos.push(a);
    }
  }

  return { prompt: sueltos.join(" ").trim(), modelo, extra };
}

/* ── Programa ──────────────────────────────────────────────────────── */

async function principal(): Promise<void> {
  if (!KEY_ID || !KEY_SECRET) {
    logError(
      "✖ Faltan credenciales.\n" +
        "   Define HIGGSFIELD_API_KEY_ID y HIGGSFIELD_API_KEY_SECRET en .env\n" +
        "   (el script las carga con `node --env-file=.env`, ya configurado en el npm run)."
    );
    process.exitCode = 1;
    return;
  }

  const { prompt, modelo, extra } = leerArgumentos(process.argv.slice(2));
  if (!prompt) {
    logError(
      '✖ Falta el prompt.\n   Uso: npm run higgsfield:image -- "tu prompt aquí"'
    );
    process.exitCode = 1;
    return;
  }

  log(`▸ Modelo:  ${modelo}`);
  log(`▸ Prompt:  ${prompt}`);
  if (Object.keys(extra).length) log(`▸ Opciones: ${JSON.stringify(extra)}`);

  try {
    const requestId = await enviar(modelo, { prompt, ...extra });
    log(`▸ Trabajo: ${requestId}`);

    const estado = await esperar(requestId);
    const url = estado.images?.[0]?.url;
    if (!url) {
      throw new ErrorHiggsfield(
        "El trabajo terminó como completado pero no trajo ninguna imagen.",
        0,
        false
      );
    }

    const ruta = await descargar(url, prompt, requestId);
    log(`✔ Guardada en ${ruta.replace(process.cwd(), ".")}`);
  } catch (e) {
    if (e instanceof ErrorHiggsfield) {
      logError(`✖ ${e.message}`);
    } else {
      logError(`✖ Error inesperado: ${(e as Error).message}`);
    }
    process.exitCode = 1;
  }
}

await principal();
