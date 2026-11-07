import { http, HttpResponse } from "msw";
import { expect, test } from "vitest";
import { crearPedido, consultarPedido } from "../../api/pedidos";
import { erroresApi } from "../fixtures/errores";
import {
  pedidoApi,
  pedidoConMesaApi,
  respuestaCrearPedidoApi,
  respuestaCrearPedidoConMesaApi,
} from "../fixtures/pedidos";
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

function simularGetPedido(id: number, responder: () => Response): Request[] {
  const solicitudes: Request[] = [];
  const url = new URL(`/pedidos/${id}`, window.location.origin).href;

  server.use(
    http.get(url, ({ request }) => {
      solicitudes.push(request.clone());
      return responder();
    }),
  );

  return solicitudes;
}

test.each([
  {
    caso: "barra",
    pedido: pedidoApi,
    mesaId: undefined,
    respuesta: respuestaCrearPedidoApi,
    cuerpoEsperado: {
      items: [
        { productoId: 5, cantidad: 2 },
        { productoId: 19, cantidad: 1 },
      ],
    },
  },
  {
    caso: "mesa 4",
    pedido: pedidoConMesaApi,
    mesaId: pedidoConMesaApi.mesaId,
    respuesta: respuestaCrearPedidoConMesaApi,
    cuerpoEsperado: {
      mesaId: 4,
      items: [
        { productoId: 5, cantidad: 2 },
        { productoId: 19, cantidad: 1 },
      ],
    },
  },
])(
  "envía el pedido para $caso por POST /pedidos y conserva la respuesta",
  async ({ pedido, mesaId, respuesta, cuerpoEsperado }) => {
    const solicitudes = simularPostPedidos(() =>
      HttpResponse.json(respuesta, { status: 201 }),
    );

    await expect(crearPedido(pedido.items, mesaId)).resolves.toEqual(respuesta);

    expect(solicitudes).toHaveLength(1);
    expect(solicitudes[0].headers.get("Content-Type")).toContain("application/json");
    await expect(solicitudes[0].json()).resolves.toEqual(cuerpoEsperado);
  },
);

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

test("conserva el mensaje de la API al rechazar una mesa inexistente con 400", async () => {
  const solicitudes = simularPostPedidos(() =>
    HttpResponse.json(erroresApi.mesaInexistente, { status: 400 }),
  );

  await expect(crearPedido(pedidoConMesaApi.items, 9)).rejects.toThrow(
    new Error(erroresApi.mesaInexistente.error),
  );

  expect(solicitudes).toHaveLength(1);
  await expect(solicitudes[0].json()).resolves.toEqual({
    items: pedidoConMesaApi.items,
    mesaId: 9,
  });
});

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

test("rechaza una respuesta 201 con una mesa inexistente al crear un pedido", async () => {
  simularPostPedidos(() =>
    HttpResponse.json(
      {
        ...respuestaCrearPedidoConMesaApi,
        pedido: { ...pedidoConMesaApi, mesaId: 9 },
      },
      { status: 201 },
    ),
  );

  await expect(
    crearPedido(pedidoConMesaApi.items, pedidoConMesaApi.mesaId),
  ).rejects.toThrow(
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

test("consulta un pedido por su ID y conserva los datos recibidos", async () => {
  const pedidoConsultado = { ...pedidoApi, id: 7, estado: "en preparación" };
  const solicitudes = simularGetPedido(7, () =>
    HttpResponse.json(pedidoConsultado),
  );

  expect(consultarPedido).toBeDefined();
  await expect(consultarPedido(7)).resolves.toEqual(pedidoConsultado);
  expect(solicitudes).toHaveLength(1);
});

test.each([
  { id: 0, estado: 400, errorApi: erroresApi.pedidoIdInvalido },
  { id: 999, estado: 404, errorApi: erroresApi.pedidoNoEncontrado },
  { id: 7, estado: 500, errorApi: erroresApi.errorInterno },
])(
  "rechaza GET /pedidos/$id con $estado y conserva el mensaje de la API",
  async ({ id, estado, errorApi }) => {
    simularGetPedido(id, () => HttpResponse.json(errorApi, { status: estado }));

    await expect(consultarPedido(id)).rejects.toThrow(new Error(errorApi.error));
  },
);

test("informa un fallo de conexión al consultar un pedido", async () => {
  simularGetPedido(pedidoApi.id, () => HttpResponse.error());

  await expect(consultarPedido(pedidoApi.id)).rejects.toThrow(
    new Error("No se pudo conectar con el servidor"),
  );
});

test.each([
  {
    caso: "contiene el envoltorio de creación en lugar del pedido directo",
    cuerpo: respuestaCrearPedidoApi,
  },
  {
    caso: "el pedido contiene un total textual",
    cuerpo: { ...pedidoApi, total: "17220" },
  },
])("rechaza una consulta 200 si $caso", async ({ cuerpo }) => {
  simularGetPedido(pedidoApi.id, () => HttpResponse.json(cuerpo));

  await expect(consultarPedido(pedidoApi.id)).rejects.toThrow(
    new Error("La respuesta del servidor no tiene el formato esperado"),
  );
});

test("informa un JSON incompleto en la respuesta de consulta", async () => {
  simularGetPedido(pedidoApi.id, () =>
    new HttpResponse('{"id":', {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }),
  );

  await expect(consultarPedido(pedidoApi.id)).rejects.toThrow(
    new Error("No se pudo interpretar la respuesta del servidor"),
  );
});

test("informa una respuesta 404 incompatible con el contrato de errores", async () => {
  simularGetPedido(999, () =>
    HttpResponse.json({ mensaje: "Pedido no encontrado" }, { status: 404 }),
  );

  await expect(consultarPedido(999)).rejects.toThrow(
    new Error("No se pudo interpretar la respuesta de error del servidor"),
  );
});
