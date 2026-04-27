# Tacos Galos · Canal directo de pedidos

Demo profesional para presentar a Tacos Galos: web moderna, móvil-first, con flujo de pedido completo, multi-local y arquitectura preparada para MVP real.

## Stack

- **Next.js 14** App Router · **TypeScript** · **Tailwind CSS**
- **Zustand** + persist middleware (cart / location / order / ui)
- **Mock API** (`lib/mockApi.ts`) — interfaz lista para Supabase
- **SEO**: metadata por página + JSON-LD `Restaurant` por local

## Cómo correrlo

```bash
npm install
npm run dev
```

Abre <http://localhost:3000>.

## Páginas

| Ruta | Qué hace |
|---|---|
| `/` | Home: hero + carta + crea tu taco + promos + reseñas + IG + FAQ |
| `/carta` | Carta dedicada con tabs por categoría |
| `/locales` | Listado de locales con filtros |
| `/locales/[slug]` | Página por local con SEO + JSON-LD |
| `/checkout` | Checkout 2 pasos (datos + pago mock) |
| `/gracias` | Confirmación + tracker en 4 estados |
| `/panel` | KDS mock — para enseñar la operación a la marca |
| `/legal/[slug]` | Avisos legales placeholder |

## Estructura

Ver [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) para el plano completo, plan de migración a Supabase, integración de Stripe, conexión de impresora térmica y roadmap multi-local.

## Lo que la demo cuenta a Tacos Galos

> *Tacos Galos ya tiene marca, locales, comunidad y demanda. Esta web convierte la atención de Instagram, Google y las aperturas virales en pedidos directos, clientes propios, promociones exclusivas y repetición — y reduce la dependencia de Glovo, Uber Eats y Just Eat.*

## Estado

- ✅ UI completa con identidad visual oficial.
- ✅ Flujo de pedido funcional (mock, datos en localStorage).
- ✅ 11 locales con SEO local listo.
- ✅ Panel KDS visible y operable como demo.
- 🔜 Supabase, Stripe, Bizum/Redsys, mini-app de impresión.

Hecho para enseñar. Listo para evolucionar.
