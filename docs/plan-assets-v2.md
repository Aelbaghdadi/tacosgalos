# Plan de assets v2 — sistema visual de Tacos Galos

Auditoría del estado real a 28/09/2026. Medido, no recordado.

---

## 0 · Punto de partida

**`public/` pesa 13,4 MB.** Tres cifras que mandan sobre todo lo demás:

| Cosa | Peso | Estado |
|---|---|---|
| `scooter_video.mp4` | **5,14 MB** | 3852×2152 (4K) usado de fondo. Excluido del móvil por eso. |
| 57 fotos de producto | 795 KB | **todas 320×320** — miniaturas de Glovo |
| 9 mascotas | 1,02 MB | de 151×320 a 402×335, se pintan a ~320 px |
| JS compartido | **87,1 kB** | todo CSS, **cero librerías de animación** |

**1,9 MB son huérfanos** (cero referencias en código):

```
public/images/Gemini_Generated_Image_ebrskcebrskcebrs.png  1351,9 KB
public/images/mascot-sauces.jpeg                            167,6 KB
public/images/mascot-franchise.jpeg                         138,0 KB
public/images/mascots/mascot-chef-taco.png                  136,5 KB
public/images/mascots/mascot-halal-badge.png                102,4 KB
```

**Lo que ya está bien y no se toca:** los 4 estados del taco (760×760, alfa,
~60 KB) y los 6 ingredientes (440 px, alfa, ~44 KB). Verificados en navegador.

---

## 1 · Criterio de tecnología

El orden de decisión, de más barato a más caro:

1. **CSS/HTML** — si se puede dibujar con caja, borde, degradado o sombra.
2. **SVG en código** — formas vectoriales nítidas a cualquier tamaño. Inline
   cuesta bytes de HTML, no una petición.
3. **Asset existente** — antes de generar, mirar si ya está.
4. **Recraft** — fotografía, recortes, reescalado y estilo consistente.
5. **Motion** — solo si CSS no llega.
6. **Spline** — solo donde nada de lo anterior sirve.

**Sobre 3D:** descartado como runtime. El bundle de Spline ronda 1 MB antes de
la escena, contra 87 kB de toda la web, y la demo va en un iPhone. Spline se
usa como **herramienta de render**: se compone aquí, se exporta imagen o vídeo,
la web sirve un archivo plano.

**Sobre Motion:** hoy no hay ninguna librería y todo funciona. `framer-motion`
son ~34 kB comprimidos, un 39 % más de JS. **Recomendación: no instalarla
todavía.** Lo que pide tu esquema —caída de ingredientes, hover, scroll,
transiciones— sale con `@keyframes` y `animation-timeline: view()`, que es lo
que ya usan `tg-entra`, `tg-sube` y el TacoBuilder. Se reevalúa si aparece un
efecto que CSS no pueda.

---

## A · ASSETS CRÍTICOS PARA EL MVP

### A1 · Fotos de producto reescaladas

| | |
|---|---|
| **Nombre** | Catálogo de producto |
| **Archivos** | `public/images/products/*.webp` (los 57, mismos nombres) |
| **Formato** | WebP q82 |
| **Dimensiones** | 960×960 (hoy 320×320) |
| **Transparencia** | No |
| **Herramienta** | **Recraft** (`crisp_upscale`) |
| **Dónde** | `/carta`, `MenuSection`, `ProductCard`, `ProductModal` |
| **Interacción** | Hover: `scale(1.04)` CSS. Clic abre `ProductModal` |
| **Prioridad** | **CRÍTICA** |
| **Reutilizable** | Sí — se reescalan los que hay, no se regeneran |

Es el mayor agujero visual y el más barato de tapar. La carta es el núcleo
comercial y hoy se ve blanda porque las imágenes están a un tercio de la
resolución que necesitan. `crisp_upscale` conserva el producto real; generar
de cero cambiaría los productos, que es peor.

> **Riesgo:** 57 × ~90 KB ≈ 5 MB. Hay que servirlas en rejilla a ~300 px con
> `loading="lazy"`, y el modal a tamaño completo. Si el peso se dispara,
> reescalar solo las ~20 de taco y bowls y dejar bebidas a 320.

### A2 · Taco protagonista del hero

| | |
|---|---|
| **Nombre** | Taco del hero |
| **Archivo** | `public/taco/hero-taco.webp` |
| **Formato** | WebP q82 |
| **Dimensiones** | 1000×1250 (4:5) |
| **Transparencia** | **Sí** |
| **Herramienta** | **Recraft** (`generate_image` + `remove_background`) |
| **Dónde** | `Hero.tsx`, columna derecha de escritorio |
| **Interacción** | Entrada escalonada (`tg-entra`) + parallax suave al scroll |
| **Prioridad** | **CRÍTICA** |
| **Reutilizable** | Parcial — `public/ingredientes/tortilla.webp` sirve de referencia de estilo |

La columna derecha del hero es un `min-h-[520px]` con dos pegatinas y **nada en
medio**. Es el primer hueco que ve el jefe.

### A3 · Vídeo del hero, reencodado

| | |
|---|---|
| **Nombre** | Loop del hero |
| **Archivos** | `public/videos/hero.mp4` + `hero.webm` |
| **Formato** | H.264 + VP9 |
| **Dimensiones** | 1920×1080, 5–8 s en bucle limpio |
| **Transparencia** | No |
| **Herramienta** | Reencodado del existente (ffmpeg), **o Spline** si se rehace |
| **Dónde** | `Hero.tsx` — fondo a sangre, **también en móvil** |
| **Interacción** | `autoplay muted loop playsinline` |
| **Prioridad** | **CRÍTICA** |
| **Reutilizable** | Sí — `scooter_video.mp4` es la fuente |

De 5,14 MB a <1,5 MB. Con eso el fondo vuelve al móvil, que hoy se queda sin
él. **La acción tiene que caer en los dos tercios derechos** o el marcador
DÍA XX/60 no se lee encima.

### A4 · Juego de iconos

| | |
|---|---|
| **Nombre** | Iconos de ventaja |
| **Archivo** | `components/ui/Iconos.tsx` (inline, sin petición) |
| **Formato** | **SVG en código** |
| **Dimensiones** | viewBox 24×24, `currentColor` |
| **Transparencia** | N/A |
| **Herramienta** | **SVG a mano** |
| **Dónde** | `DirectOrderSection` (4), `HowItWorks` (5), `FaqSection` |
| **Interacción** | Heredan color en hover |
| **Prioridad** | **CRÍTICA** |
| **Reutilizable** | No |

Hoy son **emojis** (`⚡ 🎁 🏆 💸`). Un emoji se renderiza distinto en cada
sistema, no se puede colorear y rompe la sensación premium al instante. Son
seis trazados; no merecen ni Recraft ni un paquete de iconos.

### A5 · Limpieza de huérfanos

| | |
|---|---|
| **Acción** | Borrar 5 archivos sin referencias |
| **Ahorro** | **1,9 MB** |
| **Herramienta** | `git rm` |
| **Prioridad** | **CRÍTICA** (coste cero) |

---

## B · ASSETS PARA EL WOW FACTOR

### B1 · Ingredientes cayendo

| | |
|---|---|
| **Nombre** | Lluvia de ingredientes |
| **Archivos** | reutiliza `public/ingredientes/*.webp` |
| **Formato** | — |
| **Herramienta** | **CSS `@keyframes`** |
| **Dónde** | `CadaCapa`, transición hacia `MenuSection` |
| **Interacción** | Caen al entrar en pantalla, con retardo por elemento |
| **Prioridad** | ALTA |
| **Reutilizable** | **Sí, del todo** — cero assets nuevos |

Lo que tu esquema llama «caída ingredientes». Ya tenemos los seis recortes: es
solo una animación. Coste: ~15 líneas de CSS, 0 KB de JS, 0 KB de imagen.

### B2 · Manchas de salsa

| | |
|---|---|
| **Nombre** | Manchas decorativas |
| **Archivo** | `components/ui/Mancha.tsx` |
| **Formato** | **SVG en código** |
| **Dimensiones** | viewBox 200×200, escalable |
| **Transparencia** | Sí (inline) |
| **Herramienta** | **SVG a mano** |
| **Dónde** | Fondo de `CadaCapa`, `PromoSection`, separadores |
| **Interacción** | Parallax lento al scroll |
| **Prioridad** | ALTA |
| **Reutilizable** | No |

3–4 trazados orgánicos en rojo/oro. En SVG pesan ~300 bytes y escalan sin
pixelarse; como PNG serían 40 KB cada una.

### B3 · Mascota a resolución usable

| | |
|---|---|
| **Nombre** | Mascota Galos |
| **Archivos** | `public/images/mascots/*.webp` (mismos nombres, 4 en uso) |
| **Formato** | WebP q82 |
| **Dimensiones** | ~1000 px de alto (3x del pintado) |
| **Transparencia** | **Sí** |
| **Herramienta** | **Recraft** (`crisp_upscale`, o `create_style` + regenerar) |
| **Dónde** | `CartDrawer`, `DirectOrderSection`, `FaqSection`, `/gracias` |
| **Interacción** | `animate-floaty` (ya existe) |
| **Prioridad** | ALTA |
| **Reutilizable** | Sí — las 4 en uso |

Solo 4 de las 9 se usan. **Antes de regenerar hay que decidir cuál es la
mascota buena:** `mascot-chef-taco.png` y `configurador.jpg` son dos personajes
distintos —cejas, delantal, zapatillas—. Con `create_style` de Recraft se fija
una y el resto se encadena.

### B4 · Logo vectorial

| | |
|---|---|
| **Nombre** | Logotipo |
| **Archivo** | `public/logo.svg` |
| **Formato** | **SVG** |
| **Dimensiones** | Escalable |
| **Transparencia** | Sí |
| **Herramienta** | **Recraft** (`vectorize_image`) |
| **Dónde** | `Header`, `Footer`, `layout.tsx` (4 usos) |
| **Interacción** | Hover en el header |
| **Prioridad** | MEDIA |
| **Reutilizable** | Sí — `logo.jpg` 150×150 es la fuente |

150×150 JPG en el header de una web es lo que más delata un montaje rápido.

### B5 · Sello 3D de marca

| | |
|---|---|
| **Nombre** | Sello Galos |
| **Archivo** | `public/images/sello-galos.webp` |
| **Formato** | WebP, render plano |
| **Dimensiones** | 800×800 |
| **Transparencia** | **Sí** |
| **Herramienta** | **Spline** (compuesto aquí, exportado como imagen) |
| **Dónde** | `FranjaApertura` o cierre de `PromoSection` |
| **Interacción** | Giro lento en hover (CSS) |
| **Prioridad** | MEDIA |
| **Reutilizable** | No |

**La única pieza de Spline del plan.** Un sello con relieve y luz real es
exactamente donde el 3D gana a una foto y a un SVG. Se exporta como PNG: coste
en la web, ~60 KB. Cero runtime.

---

## C · PRESCINDIBLES

| Idea | Por qué no |
|---|---|
| **Spline embebido** | ~1 MB de runtime contra 87 kB de toda la web, en un iPhone |
| **framer-motion / GSAP** | +34 kB de JS para efectos que ya hace CSS |
| **Lenis (scroll suave)** | `globals.css` ya tiene `scroll-behavior: smooth` |
| **Rastro de cursor** | Solo escritorio, y la demo es en móvil |
| **Secuencia de 60 fotogramas** | Los 4 estados con fundido ya funcionan, verificado |
| **Preloader tipo CRAV** | Retrasa el LCP a cambio de un gag |
| **Regenerar las 57 fotos** | Cambiaría los productos reales. Reescalar, no regenerar |
| **Mascota 3D interactiva** | El coste del apartado anterior, multiplicado |

---

## Reparto final

```
CSS / SVG          iconos · manchas · ondas · sticker · caída · hover · parallax
RECRAFT            57 fotos (upscale) · taco hero · mascotas · logo vectorial
SPLINE             sello de marca (1 pieza, exportada plana)
MOTION             ninguna librería — CSS keyframes + animation-timeline
REUTILIZADO        4 estados · 6 ingredientes · 9 stories · vídeo (reencodado)
```

---

## Secuencia de producción

**Fase 1 — coste cero, impacto inmediato**
1. Borrar los 5 huérfanos (**−1,9 MB**)
2. Iconos SVG sustituyendo los emojis (A4)
3. Reencodar el vídeo del hero (A3) (**−3,6 MB**)

*Al terminar: `public/` baja de 13,4 MB a ~7,9 MB sin generar nada.*

**Fase 2 — el agujero comercial**

4. Reescalar las 57 fotos de producto con Recraft (A1)
5. Medir el peso; si se dispara, limitar a las ~20 principales

**Fase 3 — la portada**

6. Taco del hero (A2)
7. Montarlo en la columna derecha con entrada y parallax

**Fase 4 — pulido**

8. Caída de ingredientes (B1) — solo CSS
9. Manchas SVG (B2)
10. Mascotas reescaladas (B3) — decidir antes cuál es la buena
11. Logo vectorial (B4)

**Fase 5 — la guinda**

12. Sello en Spline (B5)

Cada fase es independiente y deja la web en un estado mejor que el anterior.
Si hay que parar en cualquier punto, lo hecho ya vale.
