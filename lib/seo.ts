import type { Metadata } from "next";
import type { Store } from "@/types";

const SITE_URL = "https://tacosgalos.com"; // placeholder
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
