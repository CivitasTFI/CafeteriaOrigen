import { useId } from "react";
import type { Pedido } from "../../api/esquemas/pedidos";
import { formatoPrecio } from "../../utils/formatoPrecio";
import SeguimientoPedido from "./SeguimientoPedido";

interface ConfirmacionPedidoProps {
  pedido: Pedido;
}

export default function ConfirmacionPedido({ pedido }: ConfirmacionPedidoProps) {
  const tituloId = useId();
  return (
    <section className="mt-3" aria-labelledby={tituloId} aria-live="polite">
      <h2 id={tituloId} className="h5">Pedido confirmado</h2>
      <p>Número de pedido: {pedido.id}</p>
      <p>Estado: {pedido.estado}</p>
      <p>Total: {formatoPrecio(pedido.total)}</p>
      <SeguimientoPedido key={pedido.id} pedidoId={pedido.id} />
    </section>
  );
}
