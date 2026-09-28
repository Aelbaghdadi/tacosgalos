import { SOCIAL } from "./social";

export const NAV_ITEMS = [
  { href: "/carta", label: "Carta" },
  { href: "/#crea", label: "Crea tu taco" },
  { href: "/#promos", label: "Promos" },
  { href: "/locales", label: "Locales" },
  { href: "/#directo", label: "Pide directo" },
  { href: "/#faq", label: "FAQ" },
];

/**
 * OJO: aquí había tres enlaces (/franquicias, /trabaja, /prensa) que NO
 * existen como rutas y devolvían 404 desde el footer de todas las páginas.
 * "Franquicias" es justo el que pulsa un dueño de marca en expansión.
 * Se quitan hasta que existan esas páginas — y la marca no tiene hoy
 * ningún programa público de franquicias que prometer.
 */
export const FOOTER_LINKS = {
  pedidos: [
    { href: "/carta", label: "Carta" },
    { href: "/#crea", label: "Crea tu taco" },
    { href: "/#promos", label: "Promos" },
    { href: "/#directo", label: "Pide directo" },
  ],
  empresa: [
    { href: "/locales", label: "Locales" },
    { href: "/#faq", label: "Preguntas frecuentes" },
  ],
  legal: [
    { href: "/legal/aviso-legal", label: "Aviso legal" },
    { href: "/legal/privacidad", label: "Política de privacidad" },
    { href: "/legal/cookies", label: "Cookies" },
    { href: "/legal/alergenos", label: "Alérgenos" },
    { href: "/legal/condiciones", label: "Condiciones de pedido" },
  ],
  redes: [
    { href: SOCIAL.instagram, label: "Instagram", external: true },
    { href: SOCIAL.tiktok, label: "TikTok", external: true },
    { href: `mailto:${SOCIAL.email}`, label: SOCIAL.email, external: true },
  ],
};
