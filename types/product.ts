/**
 * Modelo de producto del catálogo.
 * Mapeable 1:1 a una tabla `products` en Supabase.
 */

/**
 * Categorías reales del menú de Tacos Galos (extraídas de su Glovo).
 * Mantienen los nombres tal y como los muestra la marca para preservar identidad.
 */
export type ProductCategoryId =
  | "tokyo"        // Tokyo Kenthaky (la línea viral asiática/americana)
  | "menu_loco"    // Menú económico
  | "tacos_jefe"   // Tacos Recetas del Jefe (los icónicos)
  | "boxes"        // Las Box (megaboxes virales)
  | "tacos"        // Crea tu Tacos (M/L/XL/XXL)
  | "bowls"        // Bowls Galos
  | "sides"        // Sides
  | "desserts"     // Postres
  | "drinks"       // Bebidas
  | "sauces";      // Salsas

export type ProductBadge = "halal" | "new" | "top" | "spicy" | "promo" | "vegan";

export type Allergen =
  | "gluten"
  | "lacteos"
  | "huevo"
  | "sesamo"
  | "frutossecos"
  | "soja"
  | "mostaza";

export interface ProductOptionValue {
  id: string;
  label: string;
  /** Incremento sobre el precio base. 0 si está incluido. */
  delta: number;
}

export type ProductOptionGroupId = "size" | "meat" | "cheese" | "sauces" | "extras";

export interface ProductOptionGroup {
  id: ProductOptionGroupId;
  label: string;
  /** "single" → radio. "multi" → checkbox. */
  selection: "single" | "multi";
  /** Para selection="multi": cuántas se pueden elegir. */
  max?: number;
  /** Si el grupo es obligatorio. */
  required: boolean;
  values: ProductOptionValue[];
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: ProductCategoryId;
  basePrice: number;
  /** Precio "antes" tachado, para mostrar promo (ej: -10% en Glovo). */
  originalPrice?: number;
  imageUrl?: string;
  badges: ProductBadge[];
  isHalal: boolean;
  isPopular?: boolean;
  isNew?: boolean;
  /** Si el producto se puede personalizar con `optionGroups`. */
  customizable: boolean;
  /** Referencias a grupos de opciones (definidos en `data/options.ts`). */
  optionGroupIds?: ProductOptionGroupId[];
  allergens?: Allergen[];
  available: boolean;
}

export interface Category {
  id: ProductCategoryId;
  label: string;
  description?: string;
}
