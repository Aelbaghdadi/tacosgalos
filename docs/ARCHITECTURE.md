# Tacos Galos · Arquitectura técnica

Documento operativo. Estado actual de la demo + plan de evolución a MVP real.

---

## 1. Arquitectura actual (demo)

```
┌──────────────────────────────────────────────────────────┐
│                  Next.js 14 (App Router)                 │
│  ─ React 18 + TypeScript + Tailwind                      │
│  ─ Zustand stores (cart / location / order / ui)         │
│  ─ Persistencia: localStorage vía zustand/persist        │
│  ─ Mock API: lib/mockApi.ts (lee /data en memoria)       │
│  ─ Pedidos mock guardados en localStorage para /panel    │
└──────────────────────────────────────────────────────────┘
```

**Estructura de carpetas**

```
app/
  page.tsx                  ← Home con todas las secciones
  carta/page.tsx            ← Carta interactiva
  locales/page.tsx          ← Listado + filtros
  locales/[slug]/page.tsx   ← SSG por local + JSON-LD Restaurant
  pedido/page.tsx           ← Alias → /carta
  checkout/page.tsx         ← Checkout 2 pasos
  gracias/page.tsx          ← Confirmación + tracker
  panel/page.tsx            ← KDS mock para enseñar a la marca
  legal/[slug]/page.tsx     ← Avisos legales placeholder
  layout.tsx                ← TopBar + Header + Footer + drawers globales

components/
  layout/    TopBar · Header · Footer
  home/      Hero · DirectOrderSection · HowItWorks · CreateYourTacoSteps
             PromoSection · ReviewsSection · InstagramGrid · FaqSection
  menu/      MenuSection · CategoryTabs · ProductCard · ProductModal
  cart/      CartDrawer · MobileCartBar · CartItem
  locations/ StoreCard · StoreLocator · LocationSelector
  checkout/  CheckoutForm · OrderSummary · OrderStatusTimeline · ModeSwitch
  ui/        Button · Badge · Card · SectionHeading · StickerTitle · Modal · Toast · Marquee

data/        products · stores · promos · reviews · faqs · navigation · options
lib/         mockApi · pricing · cart · order · seo · storage · utils
store/       cartStore · locationStore · orderStore · uiStore
types/       product · store · order · promo · customer · review · faq
```

**Decisiones clave**

- **App Router**: necesario para `generateMetadata` por local (SEO crítico).
- **SSG en `/locales/[slug]`**: cada local pre-renderizado con su JSON-LD `Restaurant`.
- **Zustand persist**: estado sobrevive entre sesiones sin Redux Toolkit ni Context boilerplate.
- **`mockApi`**: una sola frontera de datos. Se cambia a Supabase tocando solo este archivo.
- **Checkout en página propia**: no en modal. Mejor conversión móvil + analytics + recuperación de carrito.
- **Tipografía sticker**: implementada con `text-stroke` + multi-shadow en `globals.css` (clase `.tg-sticker`). No es trivial en Tailwind sin custom plugin; se mantiene como utility CSS.

---

## 2. Arquitectura MVP real

```
┌─────────────┐    ┌──────────────────┐    ┌────────────────┐
│  Frontend   │ ←→ │  Supabase (BaaS) │ ←→ │  Mini-app local│
│  Next.js    │    │  Postgres + RLS  │    │  (Node.js)     │
│  + Stripe   │    │  + Realtime      │    │  → impresora   │
└─────────────┘    └──────────────────┘    └────────────────┘
                          ↑
                   ┌──────┴──────┐
                   │ Panel KDS   │
                   │ web/tablet  │
                   └─────────────┘
```

**Principios**

1. **Backend mínimo**: Supabase Postgres + RLS + Storage + Realtime + Auth.
2. **Pago externo**: Stripe Checkout (URL hosted, sin PCI scope).
3. **Cocina desacoplada**: la web NO imprime. El panel y/o mini-app local sí.
4. **Multi-local nativo**: cada `order.store_id` enruta a su KDS y su impresora.

---

## 3. Conectar Supabase

### Esquema mínimo

```sql
-- Catálogo
create table product_categories (
  id text primary key,
  label text not null,
  position int default 0
);

create table products (
  id text primary key,
  slug text unique not null,
  name text not null,
  description text,
  category_id text references product_categories(id),
  base_price numeric(10,2) not null,
  image_url text,
  badges text[] default '{}',
  is_halal bool default true,
  customizable bool default false,
  available bool default true,
  created_at timestamptz default now()
);

create table product_options (
  id text primary key,
  product_id text references products(id),
  group_id text not null,        -- 'size', 'meat', 'cheese', 'sauces'
  selection text not null,       -- 'single' | 'multi'
  required bool default false,
  max_choices int
);

create table product_option_values (
  id text primary key,
  option_id text references product_options(id),
  label text not null,
  delta numeric(10,2) default 0,
  position int default 0
);

-- Locales
create table stores (
  id text primary key,
  slug text unique not null,
  name text not null,
  city text,
  address text,
  area text,                     -- 'bcn' | 'metro' | 'vall'
  phone text,
  coords point,
  status text default 'open',
  pickup_eta_minutes int default 8,
  delivery_eta_minutes int default 30,
  delivery_radius_km int default 3,
  google_maps_url text,
  seo_title text,
  seo_description text
);

create table opening_hours (
  store_id text references stores(id),
  day int,                       -- 0..6
  open_time time,
  close_time time,
  primary key (store_id, day)
);

create table delivery_zones (
  id uuid primary key default gen_random_uuid(),
  store_id text references stores(id),
  postal_code text,
  fee numeric(10,2) default 0,
  min_order numeric(10,2) default 0
);

-- Pedidos
create table customers (
  id uuid primary key default gen_random_uuid(),
  name text,
  phone text,
  email text,
  marketing_consent bool default false,
  loyalty_points int default 0,
  loyalty_tier text default 'rookie',
  created_at timestamptz default now()
);

create type order_status as enum (
  'pending','accepted','preparing','ready',
  'out_for_delivery','delivered','cancelled'
);
create type order_type as enum ('delivery','pickup');
create type payment_status as enum ('pending','paid','refunded','failed');

create table orders (
  id text primary key,
  store_id text references stores(id) not null,
  customer_id uuid references customers(id),
  customer_name text,
  customer_phone text,
  customer_email text,
  delivery_address text,
  notes text,
  type order_type not null,
  status order_status default 'pending',
  subtotal numeric(10,2) not null,
  discount numeric(10,2) default 0,
  delivery_fee numeric(10,2) default 0,
  total numeric(10,2) not null,
  payment_method text,
  payment_status payment_status default 'pending',
  payment_provider text,
  payment_intent_id text,
  promo_code text,
  created_at timestamptz default now(),
  estimated_ready_at timestamptz
);

create table order_items (
  id uuid primary key default gen_random_uuid(),
  order_id text references orders(id) on delete cascade,
  product_id text references products(id),
  product_name text not null,    -- snapshot
  qty int not null,
  unit_price numeric(10,2) not null,
  options jsonb                  -- snapshot de selección
);

-- Promos
create table promos (
  id text primary key,
  title text not null,
  description text,
  variant text,
  type text,                     -- 'percent' | 'fixed' | 'free_item' | 'info'
  code text unique,
  percent int,
  amount numeric(10,2),
  channel text default 'web',
  active bool default true,
  expires_at timestamptz,
  min_order numeric(10,2),
  store_ids text[]               -- vacío = todos
);

-- Reseñas (mirror local; fuente de verdad: Google Places API)
create table reviews (
  id uuid primary key default gen_random_uuid(),
  store_id text references stores(id),
  rating int check (rating between 1 and 5),
  author text,
  text text,
  source text,
  external_id text,              -- id de Google
  created_at timestamptz default now()
);
```

### Migración del frontend

Sustituir `lib/mockApi.ts` por:

```ts
// lib/api.ts
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const api = {
  getProducts: async () => {
    const { data, error } = await supabase
      .from("products")
      .select("*, category:product_categories(*)")
      .eq("available", true);
    if (error) throw error;
    return data;
  },
  getStores: async () => {
    const { data, error } = await supabase.from("stores").select("*, opening_hours(*)");
    if (error) throw error;
    return data;
  },
  // ... etc
};
```

Componentes y stores **no cambian**. Es el valor de tener una sola frontera.

### Realtime para `/panel`

```ts
supabase
  .channel("kds")
  .on("postgres_changes",
      { event: "*", schema: "public", table: "orders", filter: `store_id=eq.${storeId}` },
      (payload) => refreshOrders())
  .subscribe();
```

### Auth para staff del panel

- `auth.users` con rol custom (`staff` / `manager`).
- RLS sobre `orders`: staff solo ve pedidos de su `store_id`.
- Manager ve todos.

---

## 4. Conectar Stripe

### Flow recomendado: Stripe Checkout (hosted)

1. Cliente confirma en `/checkout` → frontend llama a `/api/checkout`.
2. Endpoint server-side (Next.js Route Handler):
   ```ts
   // app/api/checkout/route.ts
   import Stripe from "stripe";
   const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2024-06-20" });

   export async function POST(req: Request) {
     const { orderId } = await req.json();
     const order = await getOrderFromSupabase(orderId);

     const session = await stripe.checkout.sessions.create({
       mode: "payment",
       payment_method_types: ["card"],
       line_items: order.items.map(i => ({
         price_data: {
           currency: "eur",
           product_data: { name: i.name },
           unit_amount: Math.round(i.unit_price * 100),
         },
         quantity: i.qty,
       })),
       success_url: `${BASE_URL}/gracias?order=${orderId}`,
       cancel_url: `${BASE_URL}/checkout`,
       metadata: { order_id: orderId, store_id: order.store_id },
     });
     return Response.json({ url: session.url });
   }
   ```
3. Webhook `/api/webhooks/stripe`:
   ```ts
   if (event.type === "checkout.session.completed") {
     await supabase.from("orders").update({
       payment_status: "paid",
       status: "accepted",
       payment_intent_id: event.data.object.payment_intent,
     }).eq("id", event.data.object.metadata.order_id);
   }
   ```

### Variables de entorno

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE=        # solo server
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_BASE_URL=
```

**Nunca** exponer `SUPABASE_SERVICE_ROLE` ni `STRIPE_SECRET_KEY` al cliente.

---

## 5. Redsys / Bizum (fase 2)

España necesita opciones nativas. Plan:

- **Redsys SIS**: TPV virtual de los bancos. Requiere convenio con el banco del comercio. Precio por transacción negociable (típicamente 0.4–0.7% + 0.10€).
- **Bizum**: integrable como método de pago en Redsys o vía agregadores (Mollie, MONEI).
- Recomendación práctica: empezar con **Stripe** (frictionless) y añadir **MONEI** (Bizum + Redsys) cuando volumen lo justifique.

Patrón: `payment_provider` ya está en el modelo de pedido. El flow es idéntico, solo cambia el endpoint de creación de sesión.

---

## 6. Conectar impresora térmica (cocina)

### Por qué NO imprimir desde el navegador

- Web USB / Web Bluetooth no funcionan con impresoras de red.
- Los proveedores serios (Star, Epson, BIXOLON) usan ESC/POS sobre TCP/IP.
- El servidor Next no puede llegar a la red local del restaurante.

### Patrón recomendado

```
Pedido pagado → Supabase → Realtime
                            │
                            ▼
                     Mini-app local (Node.js o Python)
                     instalada en una Raspberry Pi del local
                            │
                            ▼
                  Impresora térmica (Star TSP143 / Epson TM-T20)
                            via ESC/POS (TCP o USB)
```

### Implementación de la mini-app

```js
// printer-agent/index.js (Node)
import { createClient } from "@supabase/supabase-js";
import { ThermalPrinter, PrinterTypes } from "node-thermal-printer";

const STORE_ID = process.env.STORE_ID;
const supabase = createClient(URL, ANON);

const printer = new ThermalPrinter({
  type: PrinterTypes.EPSON,
  interface: "tcp://192.168.1.50:9100",
});

supabase
  .channel("printer")
  .on("postgres_changes",
      { event: "INSERT", schema: "public", table: "orders",
        filter: `store_id=eq.${STORE_ID}` },
      async ({ new: order }) => {
        if (order.status !== "accepted") return;
        await printOrder(order);
      })
  .subscribe();

async function printOrder(o) {
  printer.alignCenter();
  printer.bold(true);
  printer.println("TACOS GALOS");
  printer.println(`Pedido ${o.id}`);
  printer.bold(false);
  // ... líneas de productos
  printer.cut();
  await printer.execute();
}
```

### Alternativas sin mini-app

- **Star Cloud Print** o **Epson Connect**: la impresora hace polling a una URL HTTPS. Más simple, requiere modelos compatibles.
- **Goodtill / Loyverse / Square**: si Tacos Galos ya usa un TPV moderno con KDS, integrar via su API en vez de imprimir directo.

---

## 7. Multi-local: roadmap

| Fase | Estado | Qué implica |
|---|---|---|
| Catálogo único | ✅ ya | Mismos productos en todos los locales |
| Stock por local | 🔜 | Tabla `store_products` con `available: bool` |
| Precios por local | 🔜 | Override en `store_products.price` |
| Promos por local | 🔜 | Ya hay `promos.store_ids` |
| Tiempos por local | ✅ ya | `pickup_eta_minutes`, `delivery_eta_minutes` |
| KDS por local | 🔜 | Filtro RLS por `store_id` |
| Reportes por local | 🔜 | Vista admin con métricas |
| Franquicia (cada uno su tienda) | Fase 3 | Subdominio `raval.tacosgalos.com` opcional |

---

## 8. Próximos pasos para MVP real

1. **Semana 1**: setup Supabase + esquema + seed con `data/*.ts` migrado.
2. **Semana 1–2**: sustituir `mockApi` por adapter real. Tests visuales sin cambiar UI.
3. **Semana 2**: Stripe Checkout + webhook → `payment_status = paid`.
4. **Semana 3**: Auth staff + Panel KDS con Realtime.
5. **Semana 3–4**: Mini-app local de impresión + testing en 1 local piloto.
6. **Semana 4**: Lanzamiento a 1 local. KPIs: % pedidos directos vs apps, AOV, repetición.
7. **Mes 2**: Galos Club (loyalty), notificaciones push (PWA), MONEI/Bizum.
8. **Mes 3**: Roll-out al resto de locales + onboarding del personal.

---

## 9. KPIs a medir desde día 1

- **% de pedidos directos** sobre total (vs Glovo/Uber/Just Eat).
- **Comisión ahorrada** = (pedidos web × 25% mock comisión apps).
- **AOV directo vs apps** — el directo suele ser mayor.
- **Repetición a 30 días** — clave para Galos Club.
- **CR del checkout** (vistas → pago).
- **Páginas de local** posicionadas en Google ("tacos halal raval").

---

## 10. Riesgos / pendientes

- **Datos legales reales** (NIF, razón social, dirección fiscal) → confirmar con la marca.
- **Tabla de alérgenos por producto** → pendiente.
- **Confirmar precios y carta** real (los actuales son plausibles pero mock).
- **Fotografía de productos** — sin fotos, las cards quedan en texto. Sesión de producto pendiente.
- **Render limpio de la mascota** en PNG transparente (hoy usa screenshots de stories).
- **Política de devoluciones / reclamaciones** legal — redacción con asesor.
- **GDPR**: consentimiento de marketing en checkout antes de mailear ofertas.
