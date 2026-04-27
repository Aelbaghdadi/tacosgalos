import Link from "next/link";
import Image from "next/image";
import { FOOTER_LINKS } from "@/data/navigation";

/**
 * Footer mobile-first.
 * - Cabecera de marca con badge sticker dorado
 * - Bloque "Conecta" con iconos sociales + delivery
 * - Columnas de enlaces compactas
 * - Copyright + nota legal/alérgenos
 */
export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-galos-black text-white">
      <div className="container mx-auto px-4 pt-12 md:pt-16 pb-6">
        {/* ── CABECERA DE MARCA ─────────────────────────────────────── */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div className="flex items-start gap-4">
            <Image
              src="/images/logo.jpg"
              alt="Tacos Galos"
              width={72}
              height={72}
              className="w-16 h-16 md:w-[72px] md:h-[72px] rounded-full border-[3px] border-white flex-shrink-0"
            />
            <div className="min-w-0">
              <span
                className="inline-block bg-galos-gold text-galos-black
                           font-anton text-base sm:text-lg md:text-xl uppercase tracking-wider
                           px-4 py-1.5 rounded-full
                           shadow-[0_4px_0_0_rgba(255,255,255,0.08)]"
              >
                100% Halal · 100% Galos
              </span>
              <p className="text-sm text-neutral-400 mt-2 max-w-sm">
                El taco francés que está reventando Barcelona.
              </p>
            </div>
          </div>
        </div>

        {/* ── CONECTA: redes + delivery ─────────────────────────────── */}
        <div className="mt-8 grid gap-5 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <h4 className="font-anton text-sm uppercase tracking-widest text-neutral-500 mb-3">
              Conecta
            </h4>
            <div className="flex flex-wrap gap-2">
              <SocialPill href="https://www.instagram.com/" label="Instagram" icon={<InstagramIcon />} />
              <SocialPill href="https://www.tiktok.com/" label="TikTok" icon={<TikTokIcon />} />
              <SocialPill href="mailto:hola@tacosgalos.com" label="hola@tacosgalos.com" icon={<MailIcon />} />
            </div>
          </div>

          <div className="md:text-right">
            <h4 className="font-anton text-sm uppercase tracking-widest text-neutral-500 mb-3">
              También en
            </h4>
            <div className="flex flex-wrap md:justify-end gap-2">
              <DeliveryPill href="https://glovoapp.com" label="Glovo" />
              <DeliveryPill href="https://www.ubereats.com" label="Uber Eats" />
            </div>
          </div>
        </div>

        {/* ── COLUMNAS DE ENLACES ───────────────────────────────────── */}
        <div className="mt-10 border-t border-white/10 pt-8 grid grid-cols-2 md:grid-cols-3 gap-8">
          <FooterCol title="Pedidos" links={FOOTER_LINKS.pedidos} />
          <FooterCol title="Empresa" links={FOOTER_LINKS.empresa} />
          <div className="col-span-2 md:col-span-1">
            <FooterCol title="Legal" links={FOOTER_LINKS.legal} />
          </div>
        </div>

        {/* ── PIE: copyright + halal/alérgenos ──────────────────────── */}
        <div className="mt-10 pt-5 border-t border-white/10 flex flex-col gap-2 text-[11px] text-neutral-500">
          <p>© {year} Tacos Galos. Todos los derechos reservados.</p>
          <p className="leading-relaxed">
            Productos <span className="text-galos-gold/90 font-bold">halal certificados</span>.
            Posibles trazas: gluten, lácteos, huevo, sésamo, frutos secos.
            Información de alérgenos disponible bajo petición o en{" "}
            <Link href="/legal/alergenos" className="underline hover:text-galos-gold">
              esta página
            </Link>
            .
          </p>
        </div>
      </div>
    </footer>
  );
}

/* ── Subcomponentes ──────────────────────────────────────────────── */

function FooterCol({
  title,
  links,
}: {
  title: string;
  links: { href: string; label: string }[];
}) {
  return (
    <div>
      <h4 className="font-anton text-sm uppercase tracking-widest text-neutral-500 mb-3">
        {title}
      </h4>
      <ul className="space-y-1.5">
        {links.map((l) => (
          <li key={l.href}>
            <Link
              href={l.href}
              className="group inline-flex items-center gap-1.5 text-[13.5px] text-neutral-300 hover:text-galos-gold transition-colors"
            >
              <span className="w-1 h-1 rounded-full bg-galos-red group-hover:bg-galos-gold transition-colors" />
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SocialPill({
  href,
  label,
  icon,
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group inline-flex items-center gap-2 bg-white/5 hover:bg-galos-red border border-white/10 hover:border-galos-red text-white text-[13px] font-bold rounded-full px-3.5 py-2 transition-colors"
    >
      <span className="text-galos-gold group-hover:text-white transition-colors">{icon}</span>
      <span className="truncate max-w-[180px]">{label}</span>
    </a>
  );
}

function DeliveryPill({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 bg-transparent border border-white/15 hover:border-white/40 text-neutral-400 hover:text-white text-[12px] font-bold uppercase tracking-wide rounded-full px-3 py-1.5 transition-colors"
    >
      {label}
      <ExternalIcon className="w-3 h-3" />
    </a>
  );
}

/* ── Iconos SVG inline (estilo Lucide) ───────────────────────────── */

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function TikTokIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor" aria-hidden>
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5.8 20.1a6.34 6.34 0 0 0 10.86-4.43V8.41a8.16 8.16 0 0 0 4.77 1.52V6.49a4.85 4.85 0 0 1-1.84-.2z" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  );
}

function ExternalIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}
