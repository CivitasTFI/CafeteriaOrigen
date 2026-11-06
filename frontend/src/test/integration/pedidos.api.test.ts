import { http, HttpResponse } from "msw";
import { expect, test } from "vitest";
import { crearPedido } from "../../api/pedidos";
import { erroresApi } from "../fixtures/errores";
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

test.each([
  { estado: 400, items: [], errorApi: erroresApi.pedidoSinItems },
  { estado: 500, items: pedidoApi.items, errorApi: erroresApi.errorInterno },
])(
  "rechaza una respuesta $estado y conserva el mensaje de la API",
  async ({ estado, items, errorApi }) => {
    simularPostPedidos(() => HttpResponse.json(errorApi, { status: estado }));

    await expect(crearPedido(items)).rejects.toThrow(new Error(errorApi.error));
  },
);

test("informa un fallo de conexión al crear un pedido", async () => {
  simularPostPedidos(() => HttpResponse.error());

  await expect(crearPedido(pedidoApi.items)).rejects.toThrow(
    new Error("No se pudo conectar con el servidor"),
  );
});

test.each([
  {
    caso: "contiene un pedido directo sin el envoltorio de creación",
    cuerpo: pedidoApi,
  },
  {
    caso: "el pedido contiene un total textual",
    cuerpo: {
      ...respuestaCrearPedidoApi,
      pedido: { ...pedidoApi, total: "17220" },
    },
  },
])("rechaza una respuesta 201 si $caso", async ({ cuerpo }) => {
  simularPostPedidos(() => HttpResponse.json(cuerpo, { status: 201 }));

  await expect(crearPedido(pedidoApi.items)).rejects.toThrow(
    new Error("La respuesta del servidor no tiene el formato esperado"),
  );
});

test("informa un JSON incompleto en la respuesta de creación", async () => {
  simularPostPedidos(() =>
    new HttpResponse('{"mensaje":', {
      status: 201,
      headers: { "Content-Type": "application/json" },
    }),
  );

  await expect(crearPedido(pedidoApi.items)).rejects.toThrow(
    new Error("No se pudo interpretar la respuesta del servidor"),
  );
});

test("informa una respuesta 400 incompatible con el contrato de errores", async () => {
  simularPostPedidos(() =>
    HttpResponse.json({ mensaje: "Pedido rechazado" }, { status: 400 }),
  );

  await expect(crearPedido(pedidoApi.items)).rejects.toThrow(
    new Error("No se pudo interpretar la respuesta de error del servidor"),
  );
});
