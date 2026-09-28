"use client";

import { useEffect, useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { useRetoStore } from "@/store/retoStore";
import { useUIStore } from "@/store/uiStore";

export type ModoAviso = "aviso" | "local" | null;

/**
 * Dos capturas de contacto en una sola hoja:
 *
 *  · "aviso" → un solo campo, el móvil. Cada apertura mete 800-900 personas
 *    por la puerta y hoy ninguno de esos teléfonos se queda con la marca.
 *
 *  · "local" → en un reto contrarreloj el cuello de botella no es la demanda,
 *    es encontrar locales. Un formulario puede valer más que toda la web.
 *
 * ⚠️ Hoy los datos se guardan en localStorage y NO salen del navegador.
 * Enseñar botones que no llevan a ningún sitio es justo el pecado que ya
 * tenía esta web, así que dilo en voz alta: con backend son ~2 días.
 */
export function AvisoModal({
  modo,
  onClose,
  ciudad,
}: {
  modo: ModoAviso;
  onClose: () => void;
  /**
   * Próxima apertura. Puede no haber ninguna pendiente: el modo "local"
   * ("¿Tienes un local?") sigue teniendo sentido igualmente, y de hecho es
   * el que más, porque el cuello de botella del reto es encontrar locales.
   */
  ciudad?: string;
}) {
  const addAviso = useRetoStore((s) => s.addAviso);
  const addLeadLocal = useRetoStore((s) => s.addLeadLocal);
  const showToast = useUIStore((s) => s.showToast);

  const [telefono, setTelefono] = useState("");
  const [lead, setLead] = useState({ ciudad: "", metros: "", alquiler: "", contacto: "" });
  const [enviado, setEnviado] = useState(false);

  // Cada vez que se abre, empieza limpia.
  useEffect(() => {
    if (modo) {
      setEnviado(false);
      setTelefono("");
      setLead({ ciudad: "", metros: "", alquiler: "", contacto: "" });
    }
  }, [modo]);

  const enviarAviso = () => {
    if (!telefono.trim()) return showToast("Escribe tu móvil");
    addAviso(telefono);
    setEnviado(true);
  };

  const enviarLead = () => {
    if (!lead.ciudad.trim()) return showToast("¿En qué ciudad?");
    if (!lead.contacto.trim()) return showToast("Déjanos un contacto");
    addLeadLocal(lead);
    setEnviado(true);
  };

  return (
    <Modal
      open={modo !== null}
      onClose={onClose}
      ariaLabel={modo === "local" ? "Ofrecer un local" : "Avisadme de la apertura"}
    >
      {modo === "aviso" && !enviado && (
        <>
          <h3 className="font-anton text-2xl sm:text-3xl uppercase pr-12 mb-1">
            Te avisamos
          </h3>
          {/*
            Antes prometía "te escribimos el día antes, con el taco a 1 €
            reservado": dos compromisos que hoy nadie puede cumplir, porque el
            teléfono no sale del navegador y la marca no ha aprobado reservas.
          */}
          <p className="text-neutral-700 font-semibold mb-5 text-sm">
            Abrimos en {ciudad}. Déjanos tu móvil y te avisamos cuando haya fecha.
          </p>
          <label
            htmlFor="aviso-telefono"
            className="text-xs font-black uppercase tracking-wide text-neutral-700"
          >
            Tu móvil
          </label>
          <input
            id="aviso-telefono"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            className="tg-input w-full mt-1.5 mb-5"
            placeholder="612 345 678"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
          />
          <Button onClick={enviarAviso} variant="primary" size="xl" className="w-full">
            Avisadme →
          </Button>
        </>
      )}

      {modo === "local" && !enviado && (
        <>
          <h3 className="font-anton text-2xl sm:text-3xl uppercase pr-12 mb-1">
            ¿Tienes un local?
          </h3>
          <p className="text-neutral-700 font-semibold mb-5 text-sm">
            Estamos abriendo contrarreloj. Si tienes un local o conoces uno,
            cuéntanoslo y lo miramos.
          </p>
          <div className="grid sm:grid-cols-2 gap-3 mb-4">
            <Campo
              id="lead-ciudad"
              label="Ciudad o barrio"
              placeholder="Badalona"
              value={lead.ciudad}
              onChange={(v) => setLead({ ...lead, ciudad: v })}
            />
            <Campo
              id="lead-metros"
              label="Metros (aprox.)"
              placeholder="120 m²"
              value={lead.metros}
              onChange={(v) => setLead({ ...lead, metros: v })}
            />
            <Campo
              id="lead-alquiler"
              label="Alquiler (aprox.)"
              placeholder="2.500 €/mes"
              value={lead.alquiler}
              onChange={(v) => setLead({ ...lead, alquiler: v })}
            />
            <Campo
              id="lead-contacto"
              label="Tu contacto"
              placeholder="Móvil o email"
              value={lead.contacto}
              onChange={(v) => setLead({ ...lead, contacto: v })}
            />
          </div>
          <Button onClick={enviarLead} variant="primary" size="xl" className="w-full">
            Enviar local →
          </Button>
        </>
      )}

      {enviado && (
        <div className="text-center py-4">
          <p className="font-anton text-3xl uppercase text-galos-red mb-2">¡Hecho!</p>
          <p className="text-neutral-700 font-semibold text-sm mb-5">
            {modo === "local"
              ? "Lo revisamos y te escribimos. Gracias por el chivatazo."
              : `Te escribimos antes de abrir en ${ciudad}.`}
          </p>
          <Button onClick={onClose} variant="dark" size="md">
            Cerrar
          </Button>
        </div>
      )}
    </Modal>
  );
}

function Campo({
  id,
  label,
  placeholder,
  value,
  onChange,
}: {
  id: string;
  label: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-xs font-black uppercase tracking-wide text-neutral-700">
        {label}
      </label>
      <input
        id={id}
        className="tg-input w-full"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
