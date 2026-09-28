# Los seis ingredientes de «CADA CAPA CUENTA»

Los seis prompts que alimentan `components/home/CadaCapa.tsx`. **Cada uno está
completo**: se copia entero de una vez, sin montar nada.

La composición ya está montada en la web con marcos provisionales: abre la home
y mira la sección para ver sitio, tamaño y giro antes de generar.

**Sin vegetales.** Un french tacos no lleva lechuga ni tomate, y eso es lo que
lo separa de un kebab o una hamburguesa. Los seis salen de `data/options.ts`.

Los prompts se repiten mucho entre sí a propósito: la cámara y la luz idénticas
palabra por palabra son lo que hace que parezcan de la misma sesión de fotos.

> **Sombra:** los prompts la prohíben dos veces porque el componente ya le pone
> a cada recorte su propia `drop-shadow` en CSS. Si viene incrustada salen dos.

---

## 1 · `tortilla.webp` — el protagonista

El más grande de los seis y el único que es producto acabado.

```
STYLE: photorealistic food photography, commercial quality, appetizing,
crisp focus throughout. Warm, saturated, punchy color. No cool or grey cast.
No illustration, no 3D render look.

CAMERA: three-quarter elevated view, 35 degrees above the horizontal.
Medium telephoto look (around 85mm), minimal perspective distortion.
Subject centered, fully inside the frame, nothing cropped by the edges.

LIGHTING: one large soft key light from the upper left at about 45 degrees,
soft gentle fill from the right. Soft specular highlights. NO hard shadows.

CONTENT: one closed French tacos: a rectangular folded wheat flour wrap,
golden, pressed and grilled with a light charred waffle grill pattern on top.
Compact and generously filled. Seen from a three-quarter elevated angle.

IMPORTANT: the subject FLOATS in isolation. No plate, no board, no table,
no hands, no props, no garnish, no text. NO cast shadow and NO contact
shadow of any kind.

BACKGROUND: Solid, flat, uniform chromakey green color. Use EXACTLY hex
color #00FF00 (RGB 0,255,0). NO variation, NO gradients, NO shadows,
NO reflections on the background.

OUTPUT: 2K.
```

## 2 · `pollo.webp` — `options.meat · pollo`

```
STYLE: photorealistic food photography, commercial quality, appetizing,
crisp focus throughout. Warm, saturated, punchy color. No cool or grey cast.
No illustration, no 3D render look.

CAMERA: three-quarter elevated view, 35 degrees above the horizontal.
Medium telephoto look (around 85mm), minimal perspective distortion.
Subject centered, fully inside the frame, nothing cropped by the edges.

LIGHTING: one large soft key light from the upper left at about 45 degrees,
soft gentle fill from the right. Soft specular highlights. NO hard shadows.

CONTENT: a small loose pile of grilled chicken pieces, six to eight chunks,
golden-brown seared edges, juicy, no sauce on them.

IMPORTANT: the subject FLOATS in isolation. No plate, no board, no table,
no hands, no props, no garnish, no text. NO cast shadow and NO contact
shadow of any kind.

BACKGROUND: Solid, flat, uniform chromakey green color. Use EXACTLY hex
color #00FF00 (RGB 0,255,0). NO variation, NO gradients, NO shadows,
NO reflections on the background.

OUTPUT: 2K.
```

## 3 · `patatas.webp` — `options.extras · patatas_extra`

Van **dentro** del tacos, no de guarnición: es la firma del french tacos.

```
STYLE: photorealistic food photography, commercial quality, appetizing,
crisp focus throughout. Warm, saturated, punchy color. No cool or grey cast.
No illustration, no 3D render look.

CAMERA: three-quarter elevated view, 35 degrees above the horizontal.
Medium telephoto look (around 85mm), minimal perspective distortion.
Subject centered, fully inside the frame, nothing cropped by the edges.

LIGHTING: one large soft key light from the upper left at about 45 degrees,
soft gentle fill from the right. Soft specular highlights. NO hard shadows.

CONTENT: a loose handful of French fries, about ten, golden and crisp,
fanned out and slightly overlapping. No container, no ketchup.

IMPORTANT: the subject FLOATS in isolation. No plate, no board, no table,
no hands, no props, no garnish, no text. NO cast shadow and NO contact
shadow of any kind.

BACKGROUND: Solid, flat, uniform chromakey green color. Use EXACTLY hex
color #00FF00 (RGB 0,255,0). NO variation, NO gradients, NO shadows,
NO reflections on the background.

OUTPUT: 2K.
```

## 4 · `queso.webp` — `options.cheese · doble`

```
STYLE: photorealistic food photography, commercial quality, appetizing,
crisp focus throughout. Warm, saturated, punchy color. No cool or grey cast.
No illustration, no 3D render look.

CAMERA: three-quarter elevated view, 35 degrees above the horizontal.
Medium telephoto look (around 85mm), minimal perspective distortion.
Subject centered, fully inside the frame, nothing cropped by the edges.

LIGHTING: one large soft key light from the upper left at about 45 degrees,
soft gentle fill from the right. Soft specular highlights. NO hard shadows.

CONTENT: a pour of molten melted cheese, glossy and flowing, warm yellow
and cream tones, with one short cheese pull strand. No bread, no other food.

IMPORTANT: the subject FLOATS in isolation. No plate, no board, no table,
no hands, no props, no garnish, no text. NO cast shadow and NO contact
shadow of any kind.

BACKGROUND: Solid, flat, uniform chromakey green color. Use EXACTLY hex
color #00FF00 (RGB 0,255,0). NO variation, NO gradients, NO shadows,
NO reflections on the background.

OUTPUT: 2K.
```

## 5 · `algerienne.webp` — `options.sauces · algerienne`

```
STYLE: photorealistic food photography, commercial quality, appetizing,
crisp focus throughout. Warm, saturated, punchy color. No cool or grey cast.
No illustration, no 3D render look.

CAMERA: three-quarter elevated view, 35 degrees above the horizontal.
Medium telephoto look (around 85mm), minimal perspective distortion.
Subject centered, fully inside the frame, nothing cropped by the edges.

LIGHTING: one large soft key light from the upper left at about 45 degrees,
soft gentle fill from the right. Soft specular highlights. NO hard shadows.

CONTENT: a thick zigzag drizzle of creamy pale-orange sauce, glossy,
floating in mid-air. Just the sauce, nothing else.

IMPORTANT: the subject FLOATS in isolation. No plate, no board, no table,
no hands, no props, no garnish, no text. NO cast shadow and NO contact
shadow of any kind.

BACKGROUND: Solid, flat, uniform chromakey green color. Use EXACTLY hex
color #00FF00 (RGB 0,255,0). NO variation, NO gradients, NO shadows,
NO reflections on the background.

OUTPUT: 2K.
```

## 6 · `harissa.webp` — `options.sauces · harissa`

```
STYLE: photorealistic food photography, commercial quality, appetizing,
crisp focus throughout. Warm, saturated, punchy color. No cool or grey cast.
No illustration, no 3D render look.

CAMERA: three-quarter elevated view, 35 degrees above the horizontal.
Medium telephoto look (around 85mm), minimal perspective distortion.
Subject centered, fully inside the frame, nothing cropped by the edges.

LIGHTING: one large soft key light from the upper left at about 45 degrees,
soft gentle fill from the right. Soft specular highlights. NO hard shadows.

CONTENT: a thick swipe of deep red harissa chili paste, coarse texture,
glossy, floating in mid-air. Just the paste, nothing else.

IMPORTANT: the subject FLOATS in isolation. No plate, no board, no table,
no hands, no props, no garnish, no text. NO cast shadow and NO contact
shadow of any kind.

BACKGROUND: Solid, flat, uniform chromakey green color. Use EXACTLY hex
color #00FF00 (RGB 0,255,0). NO variation, NO gradients, NO shadows,
NO reflections on the background.

OUTPUT: 2K.
```

---

## Post-proceso y export

1. **Croma a alfa.** Recorte por HSV con dilatación morfológica para quitar el
   halo verde del borde. Repásalo sobre fondo crema `#FFF8F0`, que es donde van
   a vivir: el fleco verde canta muchísimo sobre crema.

2. **Nada de normalización entre imágenes.** Al revés que la secuencia del taco,
   aquí cada uno va a su aire: distinto tamaño y distinta silueta. No hay que
   alinearlos.

3. **Recorta al contenido.** Sin márgenes transparentes de sobra, o el recorte
   se ve más pequeño de lo que ocupa y descuadra la composición.

```
lado mayor   800 px
formato      WebP calidad 82, CON canal alfa
peso         <50 KB cada uno, <300 KB los seis
ruta         public/ingredientes/<id>.webp
ids          tortilla · pollo · patatas · queso · algerienne · harissa
```

En cuanto aparezcan, la sección los detecta uno a uno y sustituye su marco: no
hay que tocar código. Si regeneras alguno más adelante, sube el `?v=` en
`CadaCapa.tsx` (el `.htaccess` sirve los `.webp` con `immutable` a un año).

## Antes de darlo por bueno

- [ ] Los seis abiertos juntos sobre fondo crema: **parecen de la misma sesión
      de fotos**. Si uno tiene la luz por el otro lado, se nota al instante.
- [ ] Ninguno trae sombra incrustada.
- [ ] Ningún fleco verde en los bordes.
- [ ] La tortilla es la más grande y la más apetecible: es la que manda.
