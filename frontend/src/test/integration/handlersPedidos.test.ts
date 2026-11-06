import { expect, test } from "vitest";
import {
  esquemaPedido,
  esquemaRespuestaCrearPedido,
} from "../../api/esquemas/pedidos";
import { pedidoApi, respuestaCrearPedidoApi } from "../fixtures/pedidos";
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

test("el handler de consulta responde 200 al GET con el pedido configurado", async () => {
  const pedidoConsultado = { ...pedidoApi, id: 7, estado: "en preparación" };

  expect(crearHandlerConsultaPedido).toBeDefined();
  server.use(crearHandlerConsultaPedido(pedidoConsultado));

  const respuesta = await fetch(new URL("/pedidos/7", window.location.origin));

  expect(respuesta.status).toBe(200);
  const datos: unknown = await respuesta.json();
  expect(esquemaPedido.safeParse(datos).success).toBe(true);
  expect(datos).toEqual(pedidoConsultado);
});
