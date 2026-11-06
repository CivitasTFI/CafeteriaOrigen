import { expect, test } from "vitest";
import { esquemaRespuestaCrearPedido } from "../../api/esquemas/pedidos";
import { pedidoApi, respuestaCrearPedidoApi } from "../fixtures/pedidos";
import { crearHandlerCreacionPedido } from "../mocks/handlers";
import { server } from "../mocks/server";

test("el handler de creación responde 201 al POST con el contrato configurado", async () => {
  expect(crearHandlerCreacionPedido).toBeDefined();
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
