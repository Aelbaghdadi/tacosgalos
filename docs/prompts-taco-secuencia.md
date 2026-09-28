# Secuencia del taco para «MONTA TU GALOS»

Los 4 prompts que alimentan `components/home/TacoBuilder.tsx`. **Cada uno está
completo**: se copia entero de una vez.

El estilo es el mismo que el de los seis ingredientes
([prompts-ingredientes.md](prompts-ingredientes.md)) a propósito: misma cámara,
misma luz, misma fotografía. Las dos secciones viven en la misma página y si
una fuera render 3D y la otra foto, chocarían.

## Las reglas, y por qué

**No generes los 4 estados por separado.** Gemini / Nano Banana no expone
parámetro `seed`: la API solo tiene `aspect_ratio` e `image_size`, así que el
mismo prompt lanzado dos veces no devuelve la misma imagen. Repetirlo "con
modificaciones" produce cuatro tacos parecidos, no el mismo taco en cuatro
momentos. En un scrub eso se ve como un parpadeo, no como un montaje.

Comprobación que ya tenemos en casa: `public/images/mascots/mascot-chef-taco.png`
y `public/images/configurador.jpg` son la misma idea generada dos veces, y son
dos personajes distintos (cejas, expresión, delantal, zapatillas).

**Encadena, y solo 3 veces.** El estado 1 se genera editando el 0, el 2 editando
el 1, el 3 editando el 2. En Gemini se hace con conversación multi-turno
(`previous_interaction_id`), que Google documenta como la forma recomendada de
iterar. El límite importa: sobre FLUX.1 Kontext está medido que ~5 ediciones
secuenciales aguantan y que a partir de ~10 el sujeto pierde identidad, los
bordes se sobre-afilan y la textura colapsa. Tres saltos va sobrado.

**El tamaño no lo genera la IA.** M → L → XL → XXL es `transform: scale()` en
CSS sobre la misma imagen. Si lo generas, multiplicas por cuatro las imágenes y
metes deriva donde no hacía falta.

**Fondo croma verde, no transparente.** Gemini no genera canal alfa: si pides
fondo transparente devuelve blanco, negro o un damero. Se genera sobre verde
puro y se recorta después. Con el taco en alfa, el rojo `#E30613` de la sección
es un `background-color` de CSS y no puede cambiar de tono entre fotogramas.

---

## 1 · `estado-0-base.webp` — tortilla vacía

Revisa este antes de seguir: **todo lo que salga mal aquí se hereda en los
otros tres.** Si el ángulo o la luz no te convencen, regenera el 0 las veces
que haga falta; es la única generación barata de repetir.

```
STYLE: photorealistic food photography, commercial quality, appetizing,
crisp focus throughout. Warm, saturated, punchy color. No cool or grey cast.
No illustration, no 3D render look.

CAMERA: elevated view, 55 degrees above the horizontal, looking down at
the tortilla. Medium telephoto look (around 85mm), minimal perspective
distortion. Subject perfectly centered, no tilt, no rotation. The tortilla
occupies 85% of the frame width.

LIGHTING: one large soft key light from the upper left at about 45 degrees,
soft gentle fill from the right. Soft specular highlights. NO hard shadows.

CONTENT: one large ROUND wheat flour tortilla, laid open and completely flat,
soft and pale, uncooked-looking, the way it is before being folded and
pressed. NO grill marks, NO char, NO waffle pattern: it has not been
grilled yet. The tortilla is completely EMPTY. No filling, no meat,
no cheese, no sauce, no vegetables. Just the bare open round tortilla.

IMPORTANT: the subject FLOATS in isolation. No plate, no board, no table,
no hands, no props, no garnish, no text. NO cast shadow and NO contact
shadow of any kind.

BACKGROUND: Solid, flat, uniform chromakey green color. Use EXACTLY hex
color #00FF00 (RGB 0,255,0). NO variation, NO gradients, NO shadows,
NO reflections on the background.

OUTPUT: aspect ratio 1:1, 2K.
```

## 2 · `estado-1-carne.webp` — edición sobre el estado 0

Se lanza **en la misma conversación**, sobre la imagen anterior.

```
Add grilled chicken pieces on top of the round tortilla, centered in the
middle of the circle, in a compact strip. Golden-brown seared chicken chunks.
Leave a clear margin of bare tortilla all around them.

Do not change any other element of the image. Keep the tortilla, the camera
angle, the lighting, the shadows and the background pixel-identical.
```

## 3 · `estado-2-queso.webp` — edición sobre el estado 1

```
Add melted cheese pouring over the chicken, glossy and stretchy, warm yellow
and white tones.

Do not change any other element of the image. Keep the tortilla, the chicken,
the camera angle, the lighting, the shadows and the background pixel-identical.
```

## 4 · `estado-3-salsa.webp` — edición sobre el estado 2

```
Add a drizzle of creamy white sauce zigzagging over the melted cheese.

Do not change any other element of the image. Keep the tortilla, the chicken,
the cheese, the camera angle, the lighting, the shadows and the background
pixel-identical.
```

La fórmula de las ediciones es siempre la misma: **una sola acción, más una
cláusula de preservación explícita.** Si pides dos cambios a la vez, el modelo
se toma licencias con el resto.

---

## Post-proceso (obligatorio)

1. **Recorte del croma a alfa.** Por HSV, con dilatación morfológica para
   limpiar el halo verde semitransparente del borde. A ojo siempre queda; sobre
   rojo `#E30613` se ve.

2. **Normalización geométrica.** Los cuatro al **mismo lienzo, mismo centro y
   mismo tamaño**. Este paso se lo salta todo el mundo y es el que decide si
   parece profesional o casero: sin él quedan 2-5 px de salto entre estados y
   en un scrub se percibe como vibración.

   Ancla por un **punto fijo** —el centro de la tortilla—, nunca por el bounding
   box del contenido: la silueta crece al añadir queso y salsa, así que alinear
   por bounding box movería el taco justo cuando no debe moverse.

3. **Export.** WebP calidad 80, **800×800** (cuadrado), mismos ajustes en los cuatro.

   WebP y no AVIF a propósito: AVIF pesa menos pero decodifica más lento, y aquí
   se decodifican varias imágenes seguidas en un móvil. Manda la velocidad de
   decode, no los KB.

   No los pases por `next/image`: con `STATIC_EXPORT` está `images.unoptimized
   = true` y no redimensiona nada. Van ya exportados a su tamaño final.

```
public/taco/estado-0-base.webp
public/taco/estado-1-carne.webp
public/taco/estado-2-queso.webp
public/taco/estado-3-salsa.webp
```

## Antes de darlo por bueno

- [ ] Los cuatro abiertos en pestañas y pasando de uno a otro con las flechas:
      la tortilla **no se mueve ni un píxel**. Es la prueba de fuego.
- [ ] No queda borde verde contra el rojo `#E30613`.
- [ ] Ningún archivo pasa de ~60 KB.
- [ ] El estado 3 se lee como comida apetecible a 300 px de alto, que es el
      tamaño al que se ve de verdad en el móvil.
- [ ] Puestos al lado de `public/ingredientes/tortilla.webp`, **parecen el
      mismo producto**.

Mientras no existan estos archivos, `TacoBuilder` dibuja el taco vectorial de
siempre: la web no se rompe, y en cuanto los dejes en `public/taco/` se
actualiza sola.
