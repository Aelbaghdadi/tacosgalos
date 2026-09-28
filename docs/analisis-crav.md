# CRAV Burgers — cómo está hecho

Recorrido completo de `cravburgers.shop` (27/09/2026), midiendo el DOM además
de mirar. Página de 13.034 px.

> **Corrección.** En una pasada anterior concluí que CRAV «no tiene animación de
> scroll». Era falso: medí el estado ya asentado de los elementos equivocados.
> Sí tiene reveals por scroll, y bastantes. Lo que no tiene es **scrub**.

---

## La distinción que importa

Todo lo que anima en CRAV es **entrada**: se dispara al entrar en pantalla, se
reproduce una vez y **no revierte al subir**. Medido: los titulares llegan
desplazados (`x=361` frente a `x=379` final, `translateY` de −2 a −5 px,
opacidad 0,98) y a partir de cierto punto quedan clavados en su sitio pase lo
que pase con la rueda.

O sea: **el scrub que ya tiene nuestro TacoBuilder es más avanzado que nada de
lo que hace CRAV.** No hay que copiarles la técnica de movimiento; hay que
copiarles la composición.

Efecto secundario que sí es un defecto suyo: si saltas de golpe a mitad de
página (un ancla, recargar con scroll restaurado), **las secciones se quedan en
blanco** porque el reveal nunca se dispara. Lo reproduje saltando a `y=6100`.

---

## Estructura, de arriba abajo

Cuatro fondos que se alternan: **crema `#F5E3CD` → rojo → crema → amarillo**.
Casi nuestra paleta.

1. **Preloader** (rojo). La hamburguesa se monta ingrediente a ingrediente —
   salsa, queso, carne— con texto de estado que va cambiando
   («MELTING CHEDDAR CHEESE…», «READY TO CRAV!») y barra de progreso abajo.
   La hamburguesa aquí es **ilustración plana**, no foto.

2. **Hero** (crema). Un sándwich de capas:
   tipografía gigante `THE BURGER` detrás → **foto del producto recortada** en
   medio → el logotipo `CRAV` en amarillo delante, tapando parte de las letras.
   Pegatinas rotadas («SMASHED FRESH», «BOLD FLAVOR») y dos ojos de dibujo
   pegados sobre el pan.

3. **`JUICY CHEESY / FULLY LOADED`** — tipografía a pantalla completa, CTA
   `ORDER NOW` en elipse roja, tres fotos en tarjetas con rotación **fija** de
   30° y una mascota en línea.

4. **`EXPERIENCE / FOOD THAT FEELS GOOD`** (rojo). Las cuatro palabras entran
   **escalonadas**, cada una con su escala, rotación y opacidad. Cazado a
   medias: «FOOD» entera, «THAT» al 60 %, «FEELS» más pequeña, «GOOD» apenas
   visible.

5. **La hamburguesa como personaje** (rojo, a sangre). Enorme, con ojos de
   dibujo y **manos de guante blanco** estilo cartoon.

6. **Vídeo a sangre**: manos sujetando una hamburguesa, alguien a punto de
   morderla. Separadores de **onda** arriba y abajo.

7. **`PURE QUALITY / EVERY LAYER PACKED WITH SIGNATURE FLAVOR`** — la sección
   más aprovechable para nosotros. El titular se revela con **máscara
   ascendente** y alrededor flotan **recortes sueltos de cada ingrediente**:
   lechuga, rodaja de tomate, loncha de queso, hamburguesa. Cada uno es una
   foto independiente con fondo transparente.

8. **`TAKE AWAY / QUALITY THAT TRAVELS WITH YOU`** (amarillo). Un avión en
   línea recorre una **ruta de puntos** curva, con etiquetas de ciudad
   (BERLIN) y tarjetas de foto rotadas en los puntos del trayecto.

---

## Detalles técnicos verificados

- **Rastro de cursor.** Cuatro iconos de 25×25 px con ingredientes siguen al
  puntero con retardos distintos, por eso forman una diagonal al mover el
  ratón. Se posicionan en `(ratónX − 13, ratónY − 13)`; parados se apilan en
  el mismo punto. Comprobado: con el ratón en (400, 350) los cuatro saltan a
  (387, 337).

- **El título de la pestaña rota** continuamente: `CRAV | Flipping`,
  `| Grilling`, `| Serving`, `| Enjoy`, `| Sizzling`.

- **Lenis** confirmado (clase `lenis` en el `<html>`). **GSAP no está expuesto
  en `window`**, pero con Next.js bundleado tampoco aparecería, así que no se
  puede afirmar ni descartar desde el navegador.

- Fuentes: **Modak** (la burbujeante del logotipo) y **Mouse Memoirs** (la
  condensada de los titulares). Nuestro `tg-sticker` ya va en esa dirección.

- Next.js con Turbopack.

---

## Qué nos llevamos

**Sin assets nuevos:**
- Separadores de onda entre secciones (SVG).
- Secciones de tipografía enorme a pantalla completa. Ya tenemos `tg-sticker`
  y Anton.
- Rotación del `document.title`.
- Alternar fondos: crema → rojo → amarillo.
- Rastro de cursor (podrían ser gotas de salsa, harissa, queso).

**Con assets fáciles** — y este es el hallazgo importante:
la sección «EVERY LAYER» necesita **recortes sueltos de ingredientes**, no una
secuencia coherente. Son imágenes **independientes**: no existe el problema de
consistencia entre fotogramas que nos bloquea el TacoBuilder. Generarlas es
mucho más barato y el impacto visual es alto.

Ver [assets-pendientes.md](assets-pendientes.md), apartado 6.

**Lo que NO copiamos:** su identidad, sus fotos, sus fuentes ni sus textos.
