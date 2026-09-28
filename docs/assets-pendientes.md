# Assets que faltan

Lo que hoy impide que la web se vea como queremos. **Ninguno de estos huecos se
arregla programando**: el código que los consume ya está escrito y verificado.

Orden de impacto, de más a menos.

---

## 1 · Los 4 estados del taco · BLOQUEANTE

`public/taco/` está vacío, así que la sección «MONTA TU GALOS» lleva desde el
20/09 funcionando con el taco vectorial de reserva. Es la pieza principal de la
home y ahora mismo enseña un dibujo.

Especificación completa, con los prompts encadenados listos para copiar, en
**[prompts-taco-secuencia.md](prompts-taco-secuencia.md)**.

```
public/taco/estado-0-base.webp    640x800  WebP q80  alfa  <60 KB
public/taco/estado-1-carne.webp   idem
public/taco/estado-2-queso.webp   idem
public/taco/estado-3-salsa.webp   idem
```

En cuanto estén los cuatro, el componente los detecta y se actualiza solo. Si
regeneras alguno después, sube el `?v=` de `ESTADOS` en
`components/home/TacoBuilder.tsx`: el `.htaccess` los sirve con
`immutable` a un año y si no la caché del móvil se queda con el viejo.

---

## 2 · El taco protagonista del hero

La columna derecha del hero en escritorio es un hueco de `min-h-[520px]` con
dos pegatinas flotando y **nada en medio**
(`components/home/Hero.tsx`). La mascota que había se quitó porque quedaba
encima de su propio vídeo. Es el «taco grande en portada» de la propuesta.

```
nombre       public/taco/hero-taco.webp
dimensiones  1000 x 1250  (4:5, para pintarse a ~500px de alto en 2x)
formato      WebP q82, con canal alfa
fondo        recortado — el hero tiene vídeo detrás, un fondo opaco lo taparía
encuadre     taco completo, entero dentro del lienzo, sin recortes por el borde
             margen mínimo de 40px por lado para que respire sobre el vídeo
ángulo       3/4 elevado, coherente con los 4 estados del apartado 1
peso         <120 KB
```

Mismo sistema de prompts que el apartado 1: parte fija idéntica, croma verde
`#00FF00`, y recorte a alfa después. Si sale del mismo encadenado que los 4
estados, mejor todavía — sería el mismo taco.

---

## 3 · El vídeo del hero

Ya está anotado en el propio componente. `scooter_video.mp4` son **3852×2152 y
5,0 MB para 5 segundos**: 4K para usarse de fondo. Por eso hoy está excluido
del móvil, y el móvil se queda con una tarjeta de vídeo más abajo en vez de con
el fondo a sangre.

```
nombre       public/videos/hero.mp4  (+ hero.webm si es fácil)
dimensiones  1920 x 1080
duración     5-8 s, en bucle limpio (el último fotograma debe casar con el primero)
peso         <1,5 MB
encuadre     LA ACCIÓN EN LOS DOS TERCIOS DERECHOS.
             El tercio izquierdo tiene que quedar tranquilo o el marcador
             DÍA XX/60 no se lee por encima.
```

Con esto el vídeo puede volver también al móvil.

---

## 4 · Las mascotas, a resolución usable

Las 9 de `public/images/mascots/` van de **151×320 a 402×335** y se pintan a
unos 320 px de alto. En un iPhone a 3x eso es menos de la mitad de los píxeles
que necesita, y se nota.

Regenerar a **3x del tamaño de pintado** (unos 900-1200 px de alto), WebP con
alfa, conservando los nombres de archivo actuales para no tocar código.

Ojo a la consistencia: `mascot-chef-taco.png` y `configurador.jpg` **son dos
personajes distintos** —cejas, expresión, delantal, zapatillas—. Antes de
regenerar hay que decidir cuál es la mascota buena y encadenar el resto a
partir de ella.

---

## 5 · Las fotos de producto

Las **57** de `public/images/products/` son miniaturas de Glovo de 320×320.
Sirven para una rejilla pequeña y para nada más: con ellas no hay fotografía a
sangre ni carta que impresione.

Es el trabajo más grande de la lista y el único que probablemente tenga que
venir de la marca, no de un generador: son los productos reales.

---

## 6 · Ingredientes sueltos · EL MÁS RENTABLE

Salido de analizar CRAV (ver [analisis-crav.md](analisis-crav.md)). Su mejor
sección rodea un titular gigante con **recortes sueltos de ingredientes**
flotando alrededor.

Es con diferencia el mejor cambio por esfuerzo que tenemos, porque **aquí no
hay problema de consistencia**: cada ingrediente es una imagen independiente.
No tienen que casar entre sí, no hay encadenado, no hay deriva. Es justo lo
contrario del apartado 1.

**Sin vegetales**: un french tacos no lleva lechuga ni tomate.

```
public/ingredientes/tortilla.webp     ← el protagonista, el más grande
public/ingredientes/pollo.webp
public/ingredientes/patatas.webp
public/ingredientes/queso.webp
public/ingredientes/algerienne.webp
public/ingredientes/harissa.webp

lado mayor   800 px
formato      WebP q82 CON canal alfa
peso         <50 KB cada uno
```

La sección **ya está montada y comprobada en móvil** (`CadaCapa.tsx`), con
marcos provisionales que enseñan sitio, tamaño y giro. Especificación completa
—encuadre, perspectiva, iluminación y prompts— en
**[prompts-ingredientes.md](prompts-ingredientes.md)**.

---

## Qué se puede hacer sin nada de esto

Más de lo que pensaba, después de ver CRAV de cerca:

- Separadores de **onda** entre secciones (SVG puro).
- Secciones de **tipografía enorme** a pantalla completa, que es la mitad del
  efecto de CRAV. Ya tenemos `tg-sticker` y Anton.
- Alternar fondos crema → rojo → amarillo.
- Rotar el `document.title` («Tacos Galos · Montando…», «· Fundiendo…»).
- Rastro de cursor con gotas de salsa.

Lo que sigue bloqueado es el producto en sí: el TacoBuilder y el hero siguen
enseñando un taco dibujado a mano mientras no existan las imágenes.
