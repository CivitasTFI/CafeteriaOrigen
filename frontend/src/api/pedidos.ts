import { solicitarValidado } from "./cliente";
import {
  esquemaRespuestaCrearPedido,
  type ItemPedido,
  type RespuestaCrearPedido,
} from "./esquemas/pedidos";

export async function crearPedido(items: ItemPedido[]): Promise<RespuestaCrearPedido> {
  return solicitarValidado("/pedidos", esquemaRespuestaCrearPedido, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ items }),
  });
}
