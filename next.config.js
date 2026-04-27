/**
 * Next.js config.
 *
 * Por defecto: app dinámica → optimizada para Vercel.
 *
 * Modo "static export" (opcional, p. ej. para Hostinger):
 *   STATIC_EXPORT=true npm run build  →  genera /out
 */

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
  },
};

if (process.env.STATIC_EXPORT === "true") {
  nextConfig.output = "export";
  nextConfig.trailingSlash = true;
  nextConfig.images.unoptimized = true;
}

module.exports = nextConfig;
