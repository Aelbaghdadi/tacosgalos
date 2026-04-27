# Deploy a Hostinger

Guía paso a paso para desplegar la web en Hostinger automáticamente cada vez que pusheas a `main`.

## Resumen del flujo

```
Push a main (GitHub)
   ↓
GitHub Actions
   ↓ npm ci
   ↓ STATIC_EXPORT=true npm run build  →  /out
   ↓ FTP upload a /public_html/
   ↓
Hostinger sirve la web (Apache)
```

Tiempo total por deploy: **~2-3 minutos** desde el push.

---

## ¿Qué tipo de hosting de Hostinger funciona?

Esta solución usa **export estático** (HTML + JS + imágenes), así que funciona en:

- ✅ **Premium / Business / Cloud Hosting** (cualquier plan compartido)
- ✅ **VPS** (también, aunque ahí podrías incluso correr Next.js dinámico)
- ✅ Cualquier hosting con FTP y Apache/Nginx

**Limitaciones del modo estático** (no es un problema para esta web):
- Sin API routes (no usamos)
- Sin Image Optimization automático (imágenes ya optimizadas como `webp`)
- Sin ISR / SSR en runtime (no hace falta — el catálogo es estático)

Si en el futuro quieres backend real (Supabase + Stripe + KDS), seguiremos teniendo el frontend en Hostinger y el backend en Supabase. Sin coste extra.

---

## 1. Subir el proyecto a GitHub

Si aún no está en GitHub:

```bash
cd f:/tacosgalos
git init
git add .
git commit -m "Initial commit: Tacos Galos web"
git branch -M main
# Crea un repo nuevo en https://github.com/new (privado o público)
git remote add origin git@github.com:TU_USUARIO/tacosgalos.git
git push -u origin main
```

> **Importante:** ya hay un `.gitignore` en `tacosgalos-next/` que excluye `node_modules`, `.next`, `.env*`. No subas secretos.

---

## 2. Conseguir credenciales FTP de Hostinger

1. Entra en **hPanel** → tu hosting → **Archivos** → **FTP Accounts**.
2. Anota o crea un usuario FTP. Verás:
   - **Host FTP**: algo como `ftp.tudominio.com` o `145.14.xxx.xxx`
   - **Usuario FTP**: por ejemplo `u123456789.tacosgalos`
   - **Contraseña FTP** (créala si no la sabes)
   - **Puerto**: `21` (FTP) o `22` (SFTP/SSH si tu plan lo soporta)
3. Verifica también la ruta de upload:
   - Normalmente `/public_html/` para el dominio principal
   - Si quieres un subdominio: `/domains/sub.tudominio.com/public_html/`

---

## 3. Configurar secrets en GitHub

En tu repo de GitHub:

**Settings → Secrets and variables → Actions → New repository secret**

Añade estos tres (obligatorios):

| Nombre | Valor |
|---|---|
| `FTP_HOST` | `ftp.tudominio.com` (sin `ftp://`, sin barras) |
| `FTP_USERNAME` | `u123456789.tacosgalos` |
| `FTP_PASSWORD` | tu contraseña FTP |

Opcional (si subes a otra carpeta que no sea `/public_html/`):

| Nombre | Valor |
|---|---|
| `FTP_REMOTE_DIR` | `/public_html/tacos/` (con barras delante y detrás) |

---

## 4. Hacer el primer deploy

```bash
# Desde local
git add .
git commit -m "Setup deploy a Hostinger"
git push origin main
```

Ve a **GitHub → tu repo → pestaña Actions** y verás el workflow corriendo. Si todo va bien, en ~2 minutos verás el ✅ y la web ya estará en tu dominio.

También puedes lanzarlo manualmente: **Actions → Deploy to Hostinger → Run workflow**.

---

## 5. Verificar en Hostinger

Tras el primer deploy, en **hPanel → Archivos → File Manager** deberías ver dentro de `/public_html/`:

```
public_html/
├── 404.html
├── _next/                  ← assets de Next (JS/CSS hasheados)
├── carta/index.html
├── checkout/index.html
├── gracias/index.html
├── images/                 ← logo, mascotas, productos
├── index.html              ← home
├── locales/
│   ├── index.html
│   ├── raval/index.html
│   ├── sagrada-familia/index.html
│   └── ...
├── panel/index.html
└── .htaccess               ← rules para Apache
```

Abre tu dominio y debería cargar la home con el header rojo, mascota en scooter y todo lo demás.

---

## 6. Probar el build estático localmente (antes del primer push)

Antes de pushear, asegúrate de que el build funciona:

```bash
cd tacosgalos-next
STATIC_EXPORT=true npm run build
# (en Windows PowerShell)
# $env:STATIC_EXPORT="true"; npm run build

# Sirve la carpeta out/ con cualquier servidor estático
npx serve out
# Abre http://localhost:3000
```

Si algo falla en local, fallará en CI también. Soluciónalo antes de pushear.

---

## 7. Custom domain en Hostinger

Si tu dominio ya apunta a Hostinger, **no hace falta hacer nada extra** — el contenido en `/public_html/` se sirve directamente en `https://tudominio.com`.

Si lo registras nuevo:
1. **hPanel → Domains → Manage** → asocia el dominio al hosting.
2. Espera la propagación DNS (suele ser <1h en Hostinger).
3. Activa SSL gratis: **hPanel → SSL → Install** (Let's Encrypt automático).

---

## 8. Hacer un cambio y verlo online

```bash
# Editas un texto, un precio, una imagen…
git add .
git commit -m "Actualizo precios de la carta"
git push
```

GitHub Actions buildea y sube en ~2 minutos. **No necesitas tocar Hostinger nunca más.**

---

## Troubleshooting

### El workflow falla en `Build (static export)`
- Reproduce localmente: `STATIC_EXPORT=true npm run build`
- Mira el error. Casi siempre es un import roto o un `client/server component` mal marcado.

### El workflow falla en `Deploy via FTP`
- **530 Login authentication failed**: secrets `FTP_USERNAME` o `FTP_PASSWORD` mal escritos.
- **Connection timeout**: el `FTP_HOST` no es correcto o Hostinger bloquea tu rango (raro). Usa la IP en vez del dominio.
- **No such directory**: el `FTP_REMOTE_DIR` no existe. Crea la carpeta en hPanel.

### La web sube pero las URLs internas dan 404
- El `.htaccess` está en `tacosgalos-next/public/.htaccess` y Next lo copia automáticamente al `out/`. Comprueba que se subió a `/public_html/`.
- Si tu hosting no tiene `mod_rewrite`, las rutas con `trailingSlash: true` deberían funcionar igualmente porque cada ruta es una carpeta con `index.html`.

### El sticky cart o el localStorage no persisten
- Comprueba que en producción la cookie de privacidad / política de cookies no esté bloqueando localStorage. La web no usa cookies de tracking.

---

## Alternativas

**Si prefieres Vercel** (gratis, deploy más rápido, mejor SEO con SSR):
- Conecta el repo en [vercel.com](https://vercel.com)
- Hostinger pasa a gestionar solo el dominio
- Ventaja: Image Optimization real, ISR, edge functions
- Desventaja: dependencia extra de un proveedor

**Si tienes VPS de Hostinger** y quieres SSR completo:
- Quita `STATIC_EXPORT=true` del workflow
- Instala Node.js + PM2 + Nginx en el VPS
- Deploy con `rsync` o Git pull + `npm run build && pm2 restart`
- Más potente, más mantenimiento

Para presentar la demo a Tacos Galos, **export estático en Hostinger es perfecto**: barato, rápido, y da imagen profesional con dominio propio.
