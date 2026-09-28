/**
 * Enlaces de marca en un solo sitio.
 *
 * Antes estaban repetidos en Footer, navigation, InstagramGrid y GraciasContent,
 * y TODOS apuntaban a `instagram.com` / `tiktok.com` a secas — es decir, el
 * tráfico que costó dos años construir se mandaba a la home de la red social.
 *
 * ⚠️ EMAIL PENDIENTE: `hola@tacosgalos.com` cuelga de un dominio que la marca
 * NO controla (tacosgalos.com está aparcado y en venta). Ese buzón no existe:
 * cada mailto es un correo que no llega a nadie. Sustituir por uno real antes
 * de publicar, o quitar el contacto por email.
 */
export const SOCIAL = {
  instagram: "https://www.instagram.com/tacosgalos/",
  tiktok: "https://www.tiktok.com/@tacosgalos",
  /** Cuenta personal del fundador, enlazada desde la bio oficial. */
  jefe: "https://www.instagram.com/eljefetacosgalos/",
  email: "hola@tacosgalos.com",
} as const;

export const EMAIL_CONFIRMADO = false;
