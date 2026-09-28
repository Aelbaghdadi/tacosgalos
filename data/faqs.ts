import type { Faq } from "@/types";

/**
 * ⚠️ Tres respuestas corregidas porque prometían cosas que no existen:
 *
 *  · f3 decía "pides al precio del local (sin recargos de plataformas)".
 *    Los precios de data/products.ts están sacados de Glovo — verificado
 *    producto a producto — así que HOY son precios de plataforma, con su
 *    comisión dentro. Afirmar lo contrario hunde el argumento central del
 *    proyecto. Recuperar la frase SOLO cuando la marca dé su PVP de local.
 *
 *  · f8 prometía franquicias y remitía a "el formulario del footer", que no
 *    existe. La marca no tiene programa público de franquicias.
 *
 *  · f3 y f10 prometían puntos e historial del "Galos Club": no hay ni auth,
 *    ni tabla de puntos, ni programa aprobado por la marca.
 */
export const FAQS: Faq[] = [
  { id: "f1", q: "¿Sois tacos mexicanos?", a: "No. Tacos Galos sirve tacos franceses: tortilla dorada y crujiente rellena de carne, patatas, salsa y queso fundido. Es otra liga." },
  // "certificada y trazada" afirma un sistema de trazabilidad y una
  // certificadora que nadie ha verificado. Pendiente del certificado real.
  { id: "f2", q: "¿La comida es halal?", a: "Sí, 100% halal." },
  { id: "f3", q: "¿Qué ventaja tiene pedir directo en la web?", a: "Te aplicamos un -10% en tu primer pedido, tienes promos que solo existen aquí y pides sin intermediarios. Más promo, menos apps." },
  { id: "f4", q: "¿Cuánto tarda una recogida?", a: "Tu pedido sale en unos 8 minutos en horario normal. Te avisamos cuando esté listo." },
  { id: "f5", q: "¿Y un delivery?", a: "Entre 25 y 35 min según local y zona. Verás el tiempo estimado al elegir tu local." },
  { id: "f6", q: "¿Dónde tenéis locales?", a: "Por toda Cataluña: Barcelona, área metropolitana, Vallès y más allá. Abrimos cada pocas semanas, así que la lista al día está siempre en la página de Locales." },
  { id: "f7", q: "¿Puedo personalizar mi taco?", a: "Claro. Eliges tamaño (M/L/XL/XXL), carne, queso y hasta 3 salsas. Tu taco a tu manera." },
  { id: "f8", q: "¿Hacéis franquicias?", a: "Estamos creciendo rápido. Si te interesa, escríbenos por Instagram (@tacosgalos) y lo hablamos." },
  { id: "f9", q: "¿Puedo pagar online?", a: "Sí. Tarjeta y Bizum próximamente. También puedes pagar en local si eliges recogida." },
  { id: "f10", q: "¿Puedo repetir un pedido?", a: "Tu carrito se guarda en este dispositivo, así que puedes volver y seguir donde lo dejaste." },
];
