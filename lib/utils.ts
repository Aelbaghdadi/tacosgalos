/** Formato monetario español. */
export const formatPrice = (n: number): string =>
  n.toFixed(2).replace(".", ",") + "€";

/** ID único corto para líneas de carrito y pedidos guest. */
export const uid = (): string => Math.random().toString(36).slice(2, 9);

/** Concatena clases condicionalmente. Equivalente mínimo a clsx. */
export const cn = (...parts: Array<string | false | null | undefined>): string =>
  parts.filter(Boolean).join(" ");

/** Capitaliza la primera letra. */
export const capitalize = (s: string): string =>
  s.charAt(0).toUpperCase() + s.slice(1);

/** Sleep para mocks asíncronos. */
export const sleep = (ms: number): Promise<void> =>
  new Promise((r) => setTimeout(r, ms));
