import type { Pedido, RespuestaCrearPedido } from "../../api/esquemas/pedidos";

export const pedidoApi = {
  id: 1,
  items: [
    { productoId: 5, cantidad: 2 },
    { productoId: 19, cantidad: 1 },
  ],
  estado: "pendiente",
  total: 17220,
} satisfies Pedido;

export const respuestaCrearPedidoApi = {
  mensaje: "El pedido se guardó correctamente",
  pedido: pedidoApi,
} satisfies RespuestaCrearPedido;

export const pedidoConMesaApi = {
  ...pedidoApi,
  mesaId: 4,
} satisfies Pedido;

export const respuestaCrearPedidoConMesaApi = {
  ...respuestaCrearPedidoApi,
  pedido: pedidoConMesaApi,
} satisfies RespuestaCrearPedido;
