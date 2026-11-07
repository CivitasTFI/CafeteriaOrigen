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

test("el handler de creación responde 201 al POST con el contrato configurado", async () => {
  server.use(crearHandlerCreacionPedido(respuestaCrearPedidoApi));

  const respuesta = await fetch(new URL("/pedidos", window.location.origin), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ items: pedidoApi.items }),
  });

  expect(respuesta.status).toBe(201);
  const datos: unknown = await respuesta.json();
  expect(esquemaRespuestaCrearPedido.safeParse(datos).success).toBe(true);
  expect(datos).toEqual(respuestaCrearPedidoApi);
});

test("el handler de creación conserva la mesa en la respuesta 201 al POST", async () => {
  server.use(crearHandlerCreacionPedido(respuestaCrearPedidoConMesaApi));

  const respuesta = await fetch(new URL("/pedidos", window.location.origin), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      items: pedidoConMesaApi.items,
      mesaId: pedidoConMesaApi.mesaId,
    }),
  });

  expect(respuesta.status).toBe(201);
  const datos: unknown = await respuesta.json();
  expect(esquemaRespuestaCrearPedido.safeParse(datos).success).toBe(true);
  expect(datos).toEqual(respuestaCrearPedidoConMesaApi);
});

test("el handler de consulta responde 200 al GET con el pedido configurado", async () => {
  const pedidoConsultado = { ...pedidoApi, id: 7, estado: "en preparación" };

  server.use(crearHandlerConsultaPedido(pedidoConsultado));

  const respuesta = await fetch(new URL("/pedidos/7", window.location.origin));

  expect(respuesta.status).toBe(200);
  const datos: unknown = await respuesta.json();
  expect(esquemaPedido.safeParse(datos).success).toBe(true);
  expect(datos).toEqual(pedidoConsultado);
});

test("el handler de consulta conserva la mesa en la respuesta 200 al GET", async () => {
  server.use(crearHandlerConsultaPedido(pedidoConMesaApi));

  const respuesta = await fetch(
    new URL(`/pedidos/${pedidoConMesaApi.id}`, window.location.origin),
  );

  expect(respuesta.status).toBe(200);
  const datos: unknown = await respuesta.json();
  expect(esquemaPedido.safeParse(datos).success).toBe(true);
  expect(datos).toEqual(pedidoConMesaApi);
});
