import { http, HttpResponse } from "msw";
import { expect, test } from "vitest";
import { crearPedido } from "../../api/pedidos";
import { pedidoApi, respuestaCrearPedidoApi } from "../fixtures/pedidos";
import { server } from "../mocks/server";

function simularPostPedidos(responder: () => Response): Request[] {
  const solicitudes: Request[] = [];
  const url = new URL("/pedidos", window.location.origin).href;

  server.use(
    http.post(url, ({ request }) => {
      solicitudes.push(request.clone());
      return responder();
    }),
  );

  return solicitudes;
}

test("envía los ítems por POST /pedidos y devuelve la respuesta de creación", async () => {
  const solicitudes = simularPostPedidos(() =>
    HttpResponse.json(respuestaCrearPedidoApi, { status: 201 }),
  );

  expect(crearPedido).toBeDefined();
  await expect(crearPedido(pedidoApi.items)).resolves.toEqual(respuestaCrearPedidoApi);

  expect(solicitudes).toHaveLength(1);
  expect(solicitudes[0].headers.get("Content-Type")).toContain("application/json");
  await expect(solicitudes[0].json()).resolves.toEqual({
    items: [
      { productoId: 5, cantidad: 2 },
      { productoId: 19, cantidad: 1 },
    ],
  });
});
