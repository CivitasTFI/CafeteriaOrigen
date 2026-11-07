import { expect, test } from "vitest";
import {
  esquemaPedido,
  esquemaRespuestaCrearPedido,
} from "../../api/esquemas/pedidos";
import {
  pedidoApi,
  pedidoConMesaApi,
  respuestaCrearPedidoApi,
  respuestaCrearPedidoConMesaApi,
} from "../fixtures/pedidos";
import {
  crearHandlerCreacionPedido,
  crearHandlerConsultaPedido,
} from "../mocks/handlers";
import { server } from "../mocks/server";

test.each([
  {
    caso: "barra",
    respuestaEsperada: respuestaCrearPedidoApi,
    cuerpo: { items: pedidoApi.items },
  },
  {
    caso: "mesa 4",
    respuestaEsperada: respuestaCrearPedidoConMesaApi,
    cuerpo: { items: pedidoConMesaApi.items, mesaId: pedidoConMesaApi.mesaId },
  },
])(
  "el handler de creación responde 201 al POST para $caso con el contrato configurado",
  async ({ respuestaEsperada, cuerpo }) => {
    server.use(crearHandlerCreacionPedido(respuestaEsperada));

    const respuesta = await fetch(new URL("/pedidos", window.location.origin), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(cuerpo),
    });

    expect(respuesta.status).toBe(201);
    const datos: unknown = await respuesta.json();
    expect(esquemaRespuestaCrearPedido.safeParse(datos).success).toBe(true);
    expect(datos).toEqual(respuestaEsperada);
  },
);

test.each([
  {
    caso: "barra",
    pedido: { ...pedidoApi, id: 7, estado: "en preparación" },
  },
  {
    caso: "mesa 4",
    pedido: pedidoConMesaApi,
  },
])(
  "el handler de consulta responde 200 al GET para $caso con el pedido configurado",
  async ({ pedido }) => {
    server.use(crearHandlerConsultaPedido(pedido));

    const respuesta = await fetch(
      new URL(`/pedidos/${pedido.id}`, window.location.origin),
    );

    expect(respuesta.status).toBe(200);
    const datos: unknown = await respuesta.json();
    expect(esquemaPedido.safeParse(datos).success).toBe(true);
    expect(datos).toEqual(pedido);
  },
);
