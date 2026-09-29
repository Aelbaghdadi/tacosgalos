/**
 * Fondo del bloque grafico de cada foto de catalogo.
 *
 * Las 57 fotos son de 320x320 y se pintan con `object-contain`, sin ampliarlas
 * nunca por encima de su tamano nativo. Detras hace falta un color plano, y no
 * puede ser el mismo para todas: el catalogo mezcla producto sobre estudio
 * negro con producto sobre blanco puro, y un fondo unico dejaria bandas
 * evidentes en la mitad de las tarjetas.
 *
 * Tampoco vale la categoria: dentro de `drinks` conviven la Coca-Cola sobre
 * blanco (luminancia de borde 253) y el Red Bull sobre ladrillo oscuro.
 *
 * Asi que la clasificacion es por imagen, medida una vez sobre el marco
 * exterior de cada archivo, y lo que se guarda aqui es a cual de los DOS
 * fondos de marca va cada una. El fondo es un token, no un color sacado de los
 * pixeles: la foto no lo elige, solo decide en que grupo cae.
 *
 *   carbon -> 39 fotos, producto sobre estudio oscuro
 *   claro  -> 18 fotos, producto sobre fondo blanco
 *
 * Umbral: luminancia de borde 160.
 */
export type FondoFoto = "carbon" | "claro";

const POR_ARCHIVO: Record<string, FondoFoto> = {
  "Tokyo_kenthaky_el_wrap": "carbon", // borde 27
  "Tokyo_kenthaky_tacowebp": "carbon", // borde 20
  "Tokyo_kenthaky_tenders_con_dips": "carbon", // borde 26
  "bebidas_agua": "carbon", // borde 19
  "bebidas_capris_sun": "carbon", // borde 19
  "bebidas_coca_cola": "claro", // borde 253
  "bebidas_coca_cola_zero": "claro", // borde 253
  "bebidas_fanta_limo": "claro", // borde 253
  "bebidas_fanta_naranja": "claro", // borde 250
  "bebidas_hawai_tropical": "carbon", // borde 19
  "bebidas_lipton_frambuesa": "carbon", // borde 19
  "bebidas_lipton_melocoton": "claro", // borde 255
  "bebidas_oasis_fresa_frambuesa": "carbon", // borde 19
  "bebidas_oasis_manzana_pera": "carbon", // borde 19
  "bebidas_oasis_tropical": "carbon", // borde 19
  "bebidas_redbull": "carbon", // borde 19
  "bebidas_sprite": "claro", // borde 249
  "bowls_galos_el_gourmet": "claro", // borde 174
  "bowls_galos_el_spicy": "carbon", // borde 130
  "bowls_galos_el_veggie": "claro", // borde 187
  "bowls_galos_el_zidane": "carbon", // borde 142
  "la_box": "carbon", // borde 34
  "la_megabox_cordon_bleu": "carbon", // borde 20
  "menu_loco": "carbon", // borde 38
  "postres_tarta_diam": "carbon", // borde 22
  "postres_tiramisu_kinderbueno": "carbon", // borde 0
  "salsas_algerienne": "carbon", // borde 143
  "salsas_andalouse": "claro", // borde 252
  "salsas_bbq": "claro", // borde 255
  "salsas_biggy_burger": "claro", // borde 255
  "salsas_infierno": "claro", // borde 255
  "salsas_kebab": "claro", // borde 206
  "salsas_ketchup": "claro", // borde 251
  "salsas_mayonnaise": "claro", // borde 251
  "salsas_samourai": "claro", // borde 174
  "sides_crispy_tenders_3u": "claro", // borde 193
  "sides_crispy_tenders_5u": "claro", // borde 193
  "sides_el_wrapito": "carbon", // borde 23
  "sides_nuggets_4u": "carbon", // borde 22
  "sides_nuggets_6u": "carbon", // borde 22
  "sides_nuggets_9u": "carbon", // borde 22
  "sides_onion_rings_5u": "carbon", // borde 56
  "sides_papas_fritas_con_queso": "carbon", // borde 141
  "sides_papas_fritas_con_raclette_y_bacon": "carbon", // borde 116
  "taco_L": "carbon", // borde 31
  "taco_M": "carbon", // borde 31
  "taco_XL": "carbon", // borde 30
  "taco_XXL": "carbon", // borde 37
  "taco_el_BBQ": "carbon", // borde 47
  "taco_el_crispy": "carbon", // borde 25
  "taco_el_delicioso": "carbon", // borde 25
  "taco_el_infierno": "carbon", // borde 29
  "taco_el_oriental": "carbon", // borde 25
  "taco_el_pakistani": "carbon", // borde 17
  "taco_el_seductor": "carbon", // borde 25
  "taco_el_tartiflette": "carbon", // borde 25
  "taco_el_vegan": "carbon", // borde 25
};

/** Carbon por defecto: es el fondo mayoritario del catalogo. */
export function fondoDeFoto(imageUrl?: string): FondoFoto {
  if (!imageUrl) return "carbon";
  const archivo = imageUrl.split("/").pop()?.replace(/\.webp$/, "") ?? "";
  return POR_ARCHIVO[archivo] ?? "carbon";
}
