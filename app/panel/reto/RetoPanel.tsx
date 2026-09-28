"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { StickerTitle, Hl } from "@/components/ui/StickerTitle";
import { useUIStore } from "@/store/uiStore";
import { useRetoStore } from "@/store/retoStore";
import {
  RETO,
  diaDelReto,
  retoCompletado,
  LOCALES_ABIERTOS_BASE,
  LOCALES_PENDIENTES,
} from "@/data/reto";
import {
  generarCreatividad,
  compartirCreatividad,
  type PlantillaId,
} from "@/lib/creative";
import { cn } from "@/lib/utils";

const PLANTILLAS: { id: PlantillaId; label: string }[] = [
  { id: "dia", label: "Día X/60" },
  { id: "apertura", label: "Mañana abrimos en…" },
  { id: "taco1e", label: "Taco a 1 €" },
  { id: "tacos", label: "720.000 tacos" },
];

/**
 * Panel del reto. Tres gestos, y de cada uno sale la creatividad del día.
 *
 * Lo que aquí es mock y hay que decir en voz alta:
 *   - El estado vive en el navegador. Con backend son ~2 días.
 *   - El día NO es mock: se deriva de la fecha de inicio y avanza solo.
 */
export function RetoPanel() {
  const [montado, setMontado] = useState(false);
  const [plantilla, setPlantilla] = useState<PlantillaId>("dia");
  const [preview, setPreview] = useState<string | null>(null);
  const [blob, setBlob] = useState<Blob | null>(null);
  const [generando, setGenerando] = useState(false);

  const showToast = useUIStore((s) => s.showToast);
  const dayOffset = useRetoStore((s) => s.dayOffset);
  const extraOpen = useRetoStore((s) => s.extraOpen);
  const avanzarDia = useRetoStore((s) => s.avanzarDia);
  const abrirLocal = useRetoStore((s) => s.abrirLocal);
  const reset = useRetoStore((s) => s.reset);

  useEffect(() => setMontado(true), []);

  const ahora = Date.now();
  const dia = diaDelReto(ahora, dayOffset);
  const terminado = retoCompletado(ahora, dayOffset);
  // No se suma `extraOpen.length` a pelo: se cuentan solo los pendientes que
  // están marcados como abiertos. Así, el día que la marca confirme Manresa y
  // pase a `status: "open"` en data/stores.ts, un navegador que ya la tuviera
  // guardada en localStorage no la contará dos veces.
  const locales =
    LOCALES_ABIERTOS_BASE +
    LOCALES_PENDIENTES.filter((s) => extraOpen.includes(s.slug)).length;
  const pendientes = LOCALES_PENDIENTES.filter((s) => !extraOpen.includes(s.slug));
  const ultimaCiudad =
    extraOpen.length > 0
      ? LOCALES_PENDIENTES.find((s) => s.slug === extraOpen[extraOpen.length - 1])?.city
      : RETO.proximaApertura.ciudad;

  const regenerar = useCallback(
    async (id: PlantillaId) => {
      setGenerando(true);
      try {
        const nuevo = await generarCreatividad({
          plantilla: id,
          dia,
          totalDias: RETO.totalDias,
          locales,
          ciudad: ultimaCiudad,
          tacos: RETO.tacos2025,
          crecimiento: RETO.crecimientoPct,
        });
        setBlob(nuevo);
        setPreview((anterior) => {
          if (anterior) URL.revokeObjectURL(anterior);
          return URL.createObjectURL(nuevo);
        });
      } catch {
        showToast("No se pudo generar la imagen");
      } finally {
        setGenerando(false);
      }
    },
    [dia, locales, ultimaCiudad, showToast]
  );

  // Primera generación y re-generación cuando cambian los datos.
  useEffect(() => {
    if (!montado) return;
    void regenerar(plantilla);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [montado, plantilla, dia, locales, ultimaCiudad]);

  // Limpieza del object URL al desmontar.
  useEffect(() => {
    return () => {
      setPreview((anterior) => {
        if (anterior) URL.revokeObjectURL(anterior);
        return null;
      });
    };
  }, []);

  const compartir = async () => {
    if (!blob) return;
    const resultado = await compartirCreatividad(blob, `galos-dia-${dia}.png`);
    if (resultado === "descargado") showToast("✔ Imagen descargada");
    if (resultado === "compartido") showToast("✔ Compartido");
  };

  return (
    <>
      <div className="pt-page bg-galos-black" />
      <section className="bg-galos-black text-white py-10">
        <div className="container mx-auto px-4">
          <span className="inline-block bg-galos-gold text-galos-black font-black uppercase tracking-wider text-[11px] px-3.5 py-1.5 rounded-full mb-3">
            Panel · Reto
          </span>
          <StickerTitle as="h1">
            <Hl>DÍA {montado ? dia : "—"}/{RETO.totalDias}</Hl>
          </StickerTitle>
          <p className="text-sm text-neutral-400 mt-2 max-w-2xl">
            Actualiza el marcador de la web y saca la creatividad del día, ya
            montada con vuestra tipografía y vuestros colores.
          </p>
        </div>
      </section>

      <section className="bg-neutral-900 text-white min-h-[60vh] py-8">
        <div className="container mx-auto px-4 grid lg:grid-cols-[1fr_400px] gap-8 items-start">
          {/* ── Controles ── */}
          <div className="flex flex-col gap-6">
            <div>
              <h2 className="font-anton text-xl uppercase mb-3">1 · Actualiza el marcador</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                <Button
                  onClick={() => {
                    avanzarDia();
                    showToast(`Día ${Math.min(RETO.totalDias, dia + 1)}/${RETO.totalDias}`);
                  }}
                  variant="gold"
                  size="xl"
                  className="w-full"
                  disabled={!montado || terminado}
                >
                  Pasa el día →
                </Button>
                <Button
                  onClick={() => reset()}
                  variant="dark"
                  size="xl"
                  className="w-full border-white/30"
                >
                  Reiniciar demo
                </Button>
              </div>
              {montado && terminado && (
                <p className="mt-2 text-xs text-galos-gold font-bold uppercase tracking-wide">
                  Reto completado — la web ya muestra el estado final.
                </p>
              )}
            </div>

            <div>
              <h2 className="font-anton text-xl uppercase mb-1">2 · Abre un local</h2>
              <p className="text-xs text-neutral-400 mb-3">
                {locales} {locales === 1 ? "local abierto" : "locales abiertos"} ahora mismo.
              </p>
              {pendientes.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {pendientes.map((s) => (
                    <button
                      key={s.slug}
                      onClick={() => {
                        abrirLocal(s.slug);
                        showToast(`✔ ${s.city} abierto`);
                      }}
                      className="px-4 py-2.5 rounded-full border-2 border-galos-gold text-galos-gold
                                 font-black uppercase text-xs tracking-wide
                                 hover:bg-galos-gold hover:text-galos-black transition-colors"
                    >
                      Abrir {s.city}
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-neutral-500">
                  No quedan locales pendientes en <code>data/stores.ts</code>. Añade los
                  que falten cuando la marca confirme la lista.
                </p>
              )}
            </div>

            <div>
              <h2 className="font-anton text-xl uppercase mb-3">3 · Elige la plantilla</h2>
              <div className="grid grid-cols-2 gap-2">
                {PLANTILLAS.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setPlantilla(p.id)}
                    aria-pressed={plantilla === p.id}
                    className={cn(
                      "px-4 py-3 rounded-xl border-2 font-black text-sm transition-colors text-left",
                      plantilla === p.id
                        ? "bg-galos-red text-white border-galos-red"
                        : "bg-transparent text-white border-white/25 hover:border-white/60"
                    )}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            <p className="text-xs text-neutral-500 leading-relaxed border-l-2 border-neutral-700 pl-3">
              <strong className="text-neutral-400">Lo que hoy es mock:</strong> el estado
              vive en este navegador, así que un cliente en otro dispositivo no ve estos
              cambios. Con Supabase son ~2 días. El día del reto NO es mock: se deriva de
              la fecha de inicio y avanza solo.
            </p>
          </div>

          {/* ── Previsualización ── */}
          <Card className="p-4 bg-white text-galos-black" hover={false}>
            <h2 className="font-anton text-lg uppercase mb-3">¿Lo publicamos?</h2>
            <div
              className="relative w-full rounded-xl overflow-hidden border-[3px] border-galos-black bg-galos-red"
              style={{ aspectRatio: "9 / 16" }}
            >
              {preview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={preview}
                  alt={`Creatividad del día ${dia} lista para publicar`}
                  className="block w-full h-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 grid place-items-center text-white font-black uppercase text-sm">
                  {generando ? "Generando…" : "…"}
                </div>
              )}
            </div>
            <Button
              onClick={compartir}
              variant="primary"
              size="xl"
              className="w-full mt-4"
              disabled={!blob || generando}
            >
              Compartir
            </Button>
            <p className="text-[11px] text-neutral-500 mt-2 text-center">
              1080×1920 · se abre el menú de compartir del teléfono
            </p>
          </Card>
        </div>
      </section>
    </>
  );
}
