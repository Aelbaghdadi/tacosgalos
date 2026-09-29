# Inventario de las 57 fotos de producto

Clasificación para decidir cómo mejorar cada una. Hecha **mirando las 57**, no
deduciendo del nombre de archivo. Hojas de contacto en
`assets-raw/upscale-test/clasificacion/`.

## Totales

| Grupo | Qué es | Nº | Método |
|---|---|---:|---|
| **A** | Sin texto ni logotipo relevante | **16** | Recraft upscale |
| **B** | Texto/logotipo pequeño integrado en el producto | **29** | Upscale local no generativo |
| **C** | Texto grande promocional, separable | **12** | Reconstrucción HTML/CSS/SVG |
| | | **57** | |

## De dónde sale el criterio

La prueba de Fase 2 dejó dos hechos medidos:

- **En textura sin texto, Recraft gana claro.** 4,8× más nitidez que un
  reescalado Lanczos, correlación 0,996 con el original, sin inventar
  geometría.
- **En texto pequeño, falla.** Donde el original de la lata pone
  «Deliciosa y Refrescante», devolvió **«Doliciosa y Rofroscanto»**. Sale más
  nítido *y equivocado*, que es peor que borroso y correcto.

De ahí la línea divisoria: **si hay texto que el cliente necesita leer, Recraft
no lo toca.**

---

## GRUPO A · Sin texto — Recraft upscale (16)

Ninguna lleva texto ni logotipo. Riesgo de alucinación: nulo. Son además las
que más ganan, porque casi todas son textura de comida.

| Archivo | Motivo |
|---|---|
| `Tokyo_kenthaky_el_wrap` | Wrap sobre fondo rojo. Sin texto |
| `Tokyo_kenthaky_tacowebp` | Taco en mano enguantada. Sin texto |
| `Tokyo_kenthaky_tenders_con_dips` | Tenders en bol con salsas. Sin texto |
| `sides_crispy_tenders_3u` | Rebozado sobre plato blanco. Sin texto |
| `sides_crispy_tenders_5u` | **Probado en Fase 2: resultado excelente** |
| `sides_nuggets_4u` | Nuggets sobre fondo oscuro. Sin texto |
| `sides_nuggets_6u` | Nuggets con salsa. Sin texto |
| `sides_nuggets_9u` | Nuggets apilados. Sin texto |
| `sides_onion_rings_5u` | Aros de cebolla. Sin texto |
| `sides_papas_fritas_con_queso` | **Probado: la peor del catálogo, mejora real** |
| `sides_papas_fritas_con_raclette_y_bacon` | Patatas en barqueta. Sin texto |
| `taco_L` | Taco liso sobre rojo. Sin texto |
| `taco_M` | Ídem |
| `taco_XL` | Ídem |
| `taco_XXL` | Ídem |
| `taco_el_pakistani` | Taco abierto sobre oscuro. Sin texto ni chapa |

---

## GRUPO B · Texto pequeño en el producto — upscale local (29)

En todas, **el texto ES el producto**: la marca de la lata o el nombre de la
salsa. Si se deforma, el cliente no puede identificar lo que pide. Y son
exactamente el caso que falló en la prueba.

Método: **reescalado local no generativo** (Lanczos a 640 + máscara de
enfoque suave). Mejora modesta y sin riesgo. Para las que se muestran
pequeñas en rejilla, **dejar el original** es una opción válida.

**Bebidas (14)** — texto de marca impreso en lata o envase:
`bebidas_agua`, `bebidas_capris_sun`, `bebidas_coca_cola`,
`bebidas_coca_cola_zero`, `bebidas_fanta_limo`, `bebidas_fanta_naranja`,
`bebidas_hawai_tropical`, `bebidas_lipton_frambuesa`,
`bebidas_lipton_melocoton`, `bebidas_oasis_fresa_frambuesa`,
`bebidas_oasis_manzana_pera`, `bebidas_oasis_tropical`, `bebidas_redbull`,
`bebidas_sprite`

> `bebidas_coca_cola` es la que falló en la prueba. El resto son el mismo caso.

**Salsas (9)** — el nombre impreso en el sobre es lo único que las distingue,
y va en letra pequeña, repetida y en ángulo. **El caso de mayor riesgo del
catálogo:**
`salsas_algerienne`, `salsas_andalouse`, `salsas_bbq`, `salsas_biggy_burger`,
`salsas_infierno`, `salsas_kebab`, `salsas_ketchup`, `salsas_mayonnaise`,
`salsas_samourai`

**Menús y postres (6)** — llevan latas de marca o etiqueta dentro del bodegón:
| Archivo | Motivo |
|---|---|
| `la_box` | Lata de Oasis en el encuadre |
| `la_megabox_cordon_bleu` | Latas de Oasis + sobres de salsa con texto |
| `menu_loco` | Lata de Pom's |
| `postres_tarta_diam` | Logotipo Daim |
| `postres_tiramisu_kinderbueno` | Etiqueta «Alfiero · Tiramisu Bueno» |
| `taco_el_BBQ` | Sin titular, pero lleva la chapa pequeña de mascota |

---

## GRUPO C · Texto grande separable — reconstrucción (12)

Son **creatividades promocionales**, no fotos de producto: fondo plano +
titular grande + producto recortable. Aquí la mejor jugada no es reescalar,
es **desmontarlas**: recortar el producto, rehacer el fondo en CSS y el titular
en HTML con Anton, que es la tipografía de la marca.

Ganancia doble: resolución infinita en el texto y **coherencia**, porque hoy
esos titulares usan una fuente de grafiti que no es la de la web.

### C1 · Reconstrucción muy viable (10)

**Los cuatro bowls** — fondo de estallido de cómic plano, radial, un color por
producto. Se rehace con `radial-gradient` + `repeating-conic-gradient` en CSS.
Titular en dos líneas, chapa «gluten free» en SVG.

| Archivo | Fondo | Nota |
|---|---|---|
| `bowls_galos_el_gourmet` | Crema | Directo |
| `bowls_galos_el_spicy` | Rosa | Directo |
| `bowls_galos_el_veggie` | Verde | Directo |
| `bowls_galos_el_zidane` | Azul | Lleva además una ilustración de personaje abajo a la izquierda |

**Los seis tacos con titular** — **todos comparten el mismo fondo de pared de
ladrillo oscuro y la misma chapa de mascota**. Un solo fondo sirve para los
seis, y el resultado sería un set por fin consistente.

`taco_el_crispy`, `taco_el_delicioso`, `taco_el_oriental`,
`taco_el_seductor`, `taco_el_tartiflette`, `taco_el_vegan`

### C2 · Reconstrucción posible pero con trabajo (1)

| Archivo | Motivo |
|---|---|
| `sides_el_wrapito` | Titular de neón con resplandor (se imita con `text-shadow`), pero el fondo lleva degradado rojo y un mantel con estampado que hay que recortar o sustituir |

### C3 · No merece reconstruirse (1)

| Archivo | Motivo |
|---|---|
| `taco_el_infierno` | Composición con llamas, botella de salsa, tres bloques de texto y una línea **cortada por el borde inferior**. Son varias piezas, no una. Sale más a cuenta pedir el original a la marca o rehacerla entera |

---

## Resumen operativo

| Método | Nº | Riesgo | Coste |
|---|---:|---|---|
| Recraft upscale | 16 | Ninguno, probado | 16 créditos |
| Upscale local (Lanczos + enfoque) | 29 | Ninguno | 0 |
| Reconstrucción HTML/CSS/SVG | 10 | Bajo | Recorte del producto + maquetación |
| Dejar original / pedir a la marca | 2 | — | 0 |

**Recomendación de orden:** empezar por el grupo A, que es riesgo cero y
resultado probado. El grupo C es el que más cambia la percepción de la web
—pasa de creatividades heredadas a piezas propias— pero toca maquetación.
El grupo B puede quedarse como está mientras se muestre en rejilla pequeña.

---

## DECISIÓN FINAL (cerrada)

| Grupo | Nº | Decisión |
|---|---:|---|
| **A** · sin texto | 16 | **Recraft** para los assets definitivos |
| **B** · texto pequeño | 29 | **Mantener el original.** Ni Recraft ni Real-ESRGAN. Lanczos solo si algún día hace falta una variante retina |
| **C** · promocionales | 12 | **Reconstrucción** con plantilla + HTML/CSS/SVG |

### Por qué el grupo B se queda como está

La Fase 2B montó Real-ESRGAN en local (ncnn-vulkan sobre la GTX 1650, modelo
`realesrgan-x4plus`, 4×) más una tercera vía puramente determinista
(Lanczos 4× + máscara de enfoque). Resultado sobre `bebidas_coca_cola`, cuya
lata dice **«Deliciosa y Refrescante»**:

| Método | Qué escribe | Nitidez (800 px) | Fidelidad al original |
|---|---|---:|---|
| Lanczos + enfoque | **«Deliciosa y Refrescante»** ✓ | 129 | dif. 1,15 · correl. 0,9995 |
| Real-ESRGAN | «Doliciosa y Rofroscanto» ✗ | 419 | dif. 2,77 · correl. 0,9974 |
| Recraft | «Doliciosa y Rofroscanto» ✗ | 491 | dif. 3,05 · correl. 0,9969 |

**Los dos modelos aprendidos fallan igual.** En la Fase 2A yo había señalado
solo a Recraft; era incompleto. El texto original mide unos **6 píxeles de
alto**, está por debajo de lo resoluble, y ningún modelo puede *saber* que
pone «Deliciosa»: ambos convergen en formas redondas y sacan «o».

El único que lo conserva es Lanczos, y lo hace **quedándose borroso**. Entre un
texto nítido y equivocado y uno blando y correcto, en una carta de producto
gana el correcto: un «Rofroscanto» en la lata es un error que se ve.

Riesgo concreto: las **9 salsas** son imágenes donde el nombre impreso es lo
único que distingue un producto de otro. «SAMOURAÏ» y «ALGÉRIENNE» son
exactamente el tipo de palabra que saldría mal.

### Por qué el grupo A sí

Sobre `sides_crispy_tenders_5u`, sin texto: Recraft da **4,8× la nitidez** de
un reescalado normal con correlación 0,996 y sin inventar geometría — misma
forma, mismas piezas, misma composición. Real-ESRGAN empata en nitidez
(152 vs 153) pero deja la superficie más **cérea**; Recraft conserva grano más
fotográfico.

Pruebas y comparaciones en `assets-raw/upscale-test/`.
