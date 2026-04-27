import { redirect } from "next/navigation";

/**
 * /pedido es alias de /carta. La carta ES el flujo de pedido en SPA.
 * Mantenemos la URL para compartir/marcar y para futuras métricas.
 */
export default function PedidoPage() {
  redirect("/carta");
}
