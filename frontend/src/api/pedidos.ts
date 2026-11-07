import { solicitarValidado } from "./cliente";
import {
  esquemaPedido,
  esquemaRespuestaCrearPedido,
  type ItemPedido,
  type Pedido,
  type RespuestaCrearPedido,
} from "./esquemas/pedidos";

export async function crearPedido(
  items: ItemPedido[],
  mesaId?: number,
): Promise<RespuestaCrearPedido> {
  return solicitarValidado("/pedidos", esquemaRespuestaCrearPedido, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ items, mesaId }),
  });
}

export async function consultarPedido(id: number): Promise<Pedido> {
  return solicitarValidado(`/pedidos/${id}`, esquemaPedido);
}
