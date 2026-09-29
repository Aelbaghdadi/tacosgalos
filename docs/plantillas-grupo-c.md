# Plantillas del grupo C

Diseño para reconstruir las 12 creatividades promocionales. **Nada
implementado todavía.**

## El principio

Las 12 no son 12 diseños: son **2 plantillas y 10 juegos de datos**. Un solo
componente, dos variantes, y cada pieza es una fila de `data/`.

```
components/producto/FichaPromo.tsx
  variante="pizarra"   → 6 tacos
  variante="estallido" → 4 bowls
```

De cada creatividad **solo el producto sigue siendo imagen**. Fondo, titulares,
sellos y decoración pasan a CSS y SVG. Eso significa:

- texto real, nítido a cualquier tamaño y **seleccionable e indexable**
- tipografía de marca (**Anton**) en vez de la fuente de grafiti horneada
- un cambio de titular es editar una cadena, no reencargar una imagen
- ~10 KB por pieza en vez de ~12 KB de JPG a 320 px que además se ve blando

---

## PLANTILLA 1 · «PIZARRA» — los 6 tacos

`taco_el_crispy · taco_el_delicioso · taco_el_oriental · taco_el_seductor ·
taco_el_tartiflette · taco_el_vegan`

Las seis comparten **exactamente** el mismo fondo y la misma chapa. Cambian
solo el titular y la foto del producto.

### Esquema

```
┌──────────────────────────────────────────┐
│ ░░░░░░░ pared oscura (CSS) ░░░░░░  ╱chapa│ ← mascota asomando, rotada
│                                    ╱ SVG │
│        EL ORIENTAL                       │ ← Anton, #E30613, HTML
│      ·······························     │
│                                          │
│            ███████████                   │
│          ███ PRODUCTO ███                │ ← PNG recortado (único bitmap)
│           ███████████                    │
│         ╰─ sombra elíptica (CSS) ─╯      │
│ ░░░░░░░░ suelo oscuro (CSS) ░░░░░░░░░░░░ │
└──────────────────────────────────────────┘
```

### Piezas

| Pieza | Tecnología | Detalle |
|---|---|---|
| **Fondo pared** | **CSS** | Base `#171717`. Ladrillo con dos `repeating-linear-gradient` cruzados a muy bajo contraste (±4 % de luminancia) |
| **Fondo suelo** | **CSS** | `#1A1A1A`, banda inferior ~40 %, separada por un borde suavísimo |
| **Foco cenital** | **CSS** | `radial-gradient` desde arriba-centro, blanco al 6 % |
| **Viñeta** | **CSS** | `radial-gradient` a `#000` en las esquinas. Medido: el 79,9 % del ángulo superior es negro puro |
| **Titular** | **HTML** | Anton, mayúsculas, `#E30613`, rotación de −2°, sombra dura negra |
| **Chapa mascota** | **SVG + PNG** | Tarjeta rotada ~35° asomando por la esquina superior derecha, recortada por el marco |
| **Producto** | **PNG con alfa** | Lo único que es imagen |
| **Sombra del producto** | **CSS** | Elipse con `radial-gradient` + `blur`, bajo el producto |

### Colores medidos en los originales

```
pared      #171717      (idéntico en las 6)
suelo      #1A1A1A      (idéntico en las 6)
viñeta     #000000
titular    #EC0604 · #ED030B · #EF0907 · #EE0606
```

El rojo del titular es prácticamente el **`#E30613`** de la marca. Rehacerlo en
Anton rojo es fiel al original, no una reinterpretación.

### Datos por pieza

```ts
{ id: "oriental", titulo: "El Oriental", producto: "/promo/taco-oriental.webp" }
```

---

## PLANTILLA 2 · «ESTALLIDO» — los 4 bowls

`bowls_galos_el_gourmet · el_spicy · el_veggie · el_zidane`

Mismo diseño en las cuatro; cambia **un par de colores** y el producto.

### Esquema

```
┌──────────────────────────────────────────┐
│ ╲  ╱ ╲  ╱ rayos radiales (CSS) ╲ ╱  ⬤sello│ ← gluten free, SVG
│  ╲╱   ╲╱  + trama de puntos      ╲╱      │
│        BOWLS GALOS                       │ ← eyebrow: blanco + rojo
│        EL VEGGIE                         │ ← Anton, crema
│                                          │
│            ╭─────────╮                   │
│           │ PRODUCTO │                   │ ← PNG recortado
│            ╰─────────╯                   │
│  (el logo redondo va en la propia foto)  │
└──────────────────────────────────────────┘
```

### Piezas

| Pieza | Tecnología | Detalle |
|---|---|---|
| **Rayos** | **CSS** | `repeating-conic-gradient` desde el centro, 24 sectores alternando dos tonos |
| **Trama de puntos** | **CSS** | `radial-gradient` repetido, ~6 px, negro al 8 %, encima de los rayos |
| **Eyebrow** | **HTML** | «BOWLS» en blanco + «GALOS» en `#E30613`, Anton pequeño, tracking ancho |
| **Titular** | **HTML** | Anton, `#FFF8F0` (crema de marca), sombra dura |
| **Sello gluten free** | **SVG** | Círculo negro, espiga y texto en anillo. Uno solo, reutilizado |
| **Producto** | **PNG con alfa** | Bol + comida. El logo redondo ya viene en la foto |

### Colores medidos (par de rayos por producto)

| Pieza | Claro | Oscuro |
|---|---|---|
| Gourmet | `#D8A860` | `#C09060` |
| Spicy | `#F06060` | `#D84848` |
| Veggie | `#60D860` | `#60D878` |
| Zidane | `#48A8C0` | `#187890` |

### Datos por pieza

```ts
{ id: "veggie", titulo: "El Veggie", rayoA: "#60D860", rayoB: "#60D878",
  producto: "/promo/bowl-veggie.webp" }
```

**Zidane** lleva además una ilustración de personaje abajo a la izquierda. Se
resuelve como un segundo PNG opcional (`extra`), no como plantilla aparte.

---

## Responsive

Ambas plantillas son **cuadradas** y aparecen a tamaños muy distintos: ~300 px
en la rejilla de la carta y hasta ~600 px en el modal de producto.

Solución: **consultas de contenedor**, no media queries.

```css
.ficha-promo { container-type: inline-size; }
.ficha-promo h3 { font-size: 13cqi; }   /* 13 % del ancho del contenedor */
```

Así la misma pieza se compone sola en cualquier caja, sin puntos de ruptura y
sin que el titular se salga. No hace falta plugin: `cqi` es CSS estándar.

En móvil no cambia la composición, solo encoge — que es lo correcto para una
creatividad cuadrada.

---

## Qué es imagen y qué no

| | Imagen | HTML | SVG | CSS |
|---|:---:|:---:|:---:|:---:|
| Producto | ✅ | | | |
| Fondo (ladrillo / rayos) | | | | ✅ |
| Titular | | ✅ | | |
| Eyebrow | | ✅ | | |
| Sello gluten free | | | ✅ | |
| Chapa mascota | parcial | | ✅ | |
| Sombras y viñeta | | | | ✅ |
| Trama de puntos | | | | ✅ |

**10 bitmaps en total** para las 10 piezas. Todo lo demás es código.

---

## Assets a crear

| Asset | Origen | Herramienta |
|---|---|---|
| 6 tacos recortados | Las 6 originales de 320 px | Recraft `remove_background` + upscale |
| 4 bowls recortados | Las 4 originales de 320 px | Ídem |
| Ilustración de Zidane | `bowls_galos_el_zidane` | Recorte manual |

> **Aviso:** el recorte parte de originales de 320×320. El producto ocupa
> ~60 % del lienzo, así que quedan **~190 px útiles**. Habrá que subirlo de
> resolución, y eso es grupo A (sin texto) → Recraft está autorizado.

## Assets reutilizables que ya existen

| Qué | Dónde | Uso |
|---|---|---|
| **Anton** y **Figtree** | `app/layout.tsx` | Ya cargadas. Titulares y eyebrow |
| **`.tg-sticker`** | `app/globals.css` | Contorno y sombra dura del titular |
| **Paleta de marca** | `tailwind.config.ts` | `galos-red #E30613`, `galos-cream #FFF8F0`, `galos-black #0F0F0F` |
| **`Onda.tsx`** | `components/ui/` | Separador si las fichas van en sección propia |
| **`Iconos.tsx`** | `components/ui/` | El trazo de 2.2 es la referencia para el sello |
| **`mascot-chef-taco.png`** | **borrada en Fase 1, recuperable de git** | Es la familia gráfica de la chapa de la esquina |

Recuperar la mascota:

```
git show c5b3403:public/images/mascots/mascot-chef-taco.png > public/promo/chapa-mascota.png
```

Se eliminó por huérfana y era correcto: no la usaba nadie. Ahora tendría uso.

---

## Las 2 que no entran

| Pieza | Motivo |
|---|---|
| `sides_el_wrapito` | Titular de neón con resplandor (imitable con `text-shadow`) pero el fondo lleva degradado **y un mantel estampado** que no es plantilla. Pieza única |
| `taco_el_infierno` | Llamas, botella de salsa, tres bloques de texto y una línea **cortada por el borde inferior**. Son varias piezas. Mejor pedir el original a la marca |

---

## Orden sugerido

1. Recortar y subir de resolución los 10 productos (Recraft)
2. Montar `FichaPromo.tsx` con la variante **pizarra** y una sola pieza
3. Comparar contra el original al lado, ajustar fondo y sombra
4. Extender a los 6 tacos (solo datos)
5. Variante **estallido** + los 4 bowls
6. Decidir las 2 sueltas
