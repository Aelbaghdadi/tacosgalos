/**
 * Next.js config con export estático opcional para Hostinger.
 *
 * MODO LOCAL/DEV (por defecto):
 *   npm run dev / npm run build → app dinámica de Next.js
 *
 * MODO STATIC EXPORT (para Hostinger Shared/Premium):
 *   STATIC_EXPORT=true npm run build → genera carpeta /out lista para FTP
 *
 * Limitaciones del modo estático:
 *   - Sin Image Optimization → `images.unoptimized: true`
 *   - Sin API routes (no usamos)
 *   - Sin ISR / on-demand revalidation (no usamos)
 *   - Routing por carpetas con `trailingSlash: true` para máxima compatibilidad
 *     con Apache (Hostinger usa Apache).
 */
const isStaticExport = process.env.STATIC_EXPORT === "true";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
    unoptimized: isStaticExport,
  },
  ...(isStaticExport && {
    output: "export",
    trailingSlash: true,
  }),
};

module.exports = nextConfig;
