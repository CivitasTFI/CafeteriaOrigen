import { crearPedido, consultarPedido } from "../api/pedidos";

export function usePedido() {
  return { enviarPedido: crearPedido, consultarEstadoPedido: consultarPedido };
}
