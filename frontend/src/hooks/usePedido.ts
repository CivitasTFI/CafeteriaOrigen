import { crearPedido } from "../api/pedidos";

export function usePedido() {
  return { enviarPedido: crearPedido };
}
