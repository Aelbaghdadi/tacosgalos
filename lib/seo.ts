import type { Metadata } from "next";
import type { Store } from "@/types";

/**
 * ⚠️ tacosgalos.com NO ES DE LA MARCA.
 * Está aparcado y a la venta ("This domain may be for sale", verificado por
 * fetch directo), y tacosgalos.es sirve el placeholder de IONOS. Aquí estaba
 * escrito a fuego, así que TODAS las canónicas, todos los Open Graph y el
 * JSON-LD de los once locales apuntaban a un dominio ajeno en venta.
 *
 * Ahora sale de NEXT_PUBLIC_SITE_URL. Defínela en Vercel y en el workflow de
 * deploy. El fallback es localhost a propósito: si falta la variable quiero
 * que se note, no que apunte en silencio al dominio de otro.
 */
const RAW_SITE_URL = process.env.NEXT_PUBLIC_SITE_URL;

/**
 * Aviso ruidoso en build de producción. Sin esto, la ausencia de la variable
 * es silenciosa y se hornean canónicas, Open Graph y JSON-LD apuntando a
 * localhost en TODAS las páginas del export — un fallo invisible hasta que
 * alguien mira el HTML generado o Google lo indexa.
 */
if (
  !RAW_SITE_URL &&
  typeof window === "undefined" &&
  process.env.NODE_ENV === "production"
) {
  console.warn(
    "\n⚠️  NEXT_PUBLIC_SITE_URL no está definida.\n" +
      "   Las canónicas, los Open Graph y el JSON-LD se generarán con http://localhost:3000.\n" +
      "   Defínela antes de desplegar (GitHub Actions o variables de entorno de Vercel).\n"
  );
}

export const SITE_URL = (RAW_SITE_URL ?? "http://localhost:3000").replace(/\/+$/, "");

const SITE_NAME = "Tacos Galos";
const DEFAULT_OG = "/images/mascot-delivery.jpeg";

/**
 * Genera Metadata estándar para una página, con Open Graph + Twitter cards.
 */
export function buildMetadata(opts: {
  title: string;
  description: string;
  path?: string;
  image?: string;
}): Metadata {
  const url = opts.path ? `${SITE_URL}${opts.path}` : SITE_URL;
  const image = opts.image ?? DEFAULT_OG;
  return {
    title: opts.title,
    description: opts.description,
    alternates: { canonical: url },
    openGraph: {
      title: opts.title,
      description: opts.description,
      url,
      siteName: SITE_NAME,
      images: [{ url: image, width: 1200, height: 630, alt: opts.title }],
      type: "website",
      locale: "es_ES",
    },
    twitter: {
      card: "summary_large_image",
      title: opts.title,
      description: opts.description,
      images: [image],
    },
  };
}

/**
 * JSON-LD `Restaurant` por local. Clave para SEO local: aparece en Google
 * con horarios, dirección, valoración. Inyectar en cada página de local.
 */
export function buildStoreJsonLd(store: Store) {
  return {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: store.name,
    image: `${SITE_URL}/images/logo.jpg`,
    address: {
      "@type": "PostalAddress",
      streetAddress: store.address,
      addressLocality: store.city,
      addressCountry: "ES",
    },
    geo: store.coords && {
      "@type": "GeoCoordinates",
      latitude: store.coords.lat,
      longitude: store.coords.lng,
    },
    url: `${SITE_URL}/locales/${store.slug}`,
    telephone: store.phone,
    servesCuisine: ["French Tacos", "Halal", "Fast Food"],
    priceRange: "€€",
    openingHoursSpecification: store.openingHours.map((h) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][h.day],
      opens: h.open,
      closes: h.close,
    })),
  };
}
