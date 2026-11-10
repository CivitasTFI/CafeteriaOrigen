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

test("propaga el mensaje de un error 500 al crear un pedido", async () => {
  simularPostPedidos(() => HttpResponse.json(erroresApi.errorInterno, { status: 500 }));

  await expect(crearPedido(pedidoApi.items)).rejects.toThrow(erroresApi.errorInterno.error);
});

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

test("la creación exige el envoltorio del POST y rechaza un pedido directo", async () => {
  simularPostPedidos(() => HttpResponse.json(pedidoApi, { status: 201 }));
  await expect(crearPedido(pedidoApi.items)).rejects.toThrow(
    "La respuesta del servidor no tiene el formato esperado",
  );
});

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
  "consulta el pedido para $caso por su ID y conserva sus datos",
  async ({ pedido }) => {
    const solicitudes = simularGetPedido(pedido.id, () =>
      HttpResponse.json(pedido),
    );

    await expect(consultarPedido(pedido.id)).resolves.toEqual(pedido);
    expect(solicitudes).toHaveLength(1);
  },
);

test("propaga el mensaje 404 al consultar un pedido inexistente", async () => {
  simularGetPedido(999, () => HttpResponse.json(erroresApi.pedidoNoEncontrado, { status: 404 }));

  await expect(consultarPedido(999)).rejects.toThrow(erroresApi.pedidoNoEncontrado.error);
});

test("la consulta exige un pedido directo y rechaza el envoltorio del POST", async () => {
  simularGetPedido(pedidoApi.id, () => HttpResponse.json(respuestaCrearPedidoApi));

  await expect(consultarPedido(pedidoApi.id)).rejects.toThrow(
    "La respuesta del servidor no tiene el formato esperado",
  );
});
