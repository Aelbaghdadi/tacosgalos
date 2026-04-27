import type { ProductOptionGroup } from "@/types";

/**
 * Grupos de opciones reutilizables para productos personalizables.
 * En Supabase se modelarían como `product_options` + `product_option_values`,
 * referenciados desde `products.option_group_ids`.
 */
export const OPTION_GROUPS: Record<string, ProductOptionGroup> = {
  size: {
    id: "size",
    label: "Tamaño",
    selection: "single",
    required: true,
    values: [
      { id: "m", label: "M", delta: 0 },
      { id: "l", label: "L", delta: 1.5 },
      { id: "xl", label: "XL", delta: 3.0 },
      { id: "xxl", label: "XXL", delta: 5.0 },
    ],
  },
  meat: {
    id: "meat",
    label: "Carne",
    selection: "single",
    required: true,
    values: [
      { id: "pollo", label: "Pollo", delta: 0 },
      { id: "ternera", label: "Ternera", delta: 1.0 },
      { id: "kebab", label: "Kebab", delta: 0.5 },
      { id: "nuggets", label: "Nuggets", delta: 0 },
      { id: "cordon", label: "Cordon Bleu", delta: 1.0 },
      { id: "mix", label: "Mix carnes", delta: 1.5 },
    ],
  },
  cheese: {
    id: "cheese",
    label: "Queso",
    selection: "single",
    required: false,
    values: [
      { id: "cheddar", label: "Cheddar", delta: 0 },
      { id: "mozza", label: "Mozzarella", delta: 0 },
      { id: "raclette", label: "Raclette", delta: 0.5 },
      { id: "doble", label: "Doble fundido", delta: 1.0 },
    ],
  },
  sauces: {
    id: "sauces",
    label: "Salsas",
    selection: "multi",
    max: 3,
    required: false,
    values: [
      { id: "algerienne", label: "Algerienne", delta: 0 },
      { id: "brazil", label: "Brazil", delta: 0 },
      { id: "samurai", label: "Samurái", delta: 0 },
      { id: "bbq", label: "BBQ", delta: 0 },
      { id: "biggy", label: "Biggy", delta: 0 },
      { id: "andaluza", label: "Andaluza", delta: 0 },
      { id: "harissa", label: "Harissa", delta: 0 },
    ],
  },
  extras: {
    id: "extras",
    label: "Extras",
    selection: "multi",
    max: 5,
    required: false,
    values: [
      { id: "queso_extra", label: "Queso extra", delta: 1.0 },
      { id: "carne_extra", label: "Carne extra", delta: 1.5 },
      { id: "patatas_extra", label: "Patatas extra", delta: 1.0 },
      { id: "bacon", label: "Bacon halal", delta: 1.0 },
    ],
  },
};
