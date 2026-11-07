import { describe, expect, test } from "vitest";
import {
  esquemaPedido,
  esquemaRespuestaCrearPedido,
  type Pedido,
} from "../../api/esquemas/pedidos";
import {
  pedidoApi as pedido,
  respuestaCrearPedidoApi,
} from "../fixtures/pedidos";

test("acepta un pedido de la API actual y conserva sus datos", () => {
  expect(esquemaPedido).toBeDefined();
  expect(esquemaPedido.safeParse(pedido)).toEqual({
    success: true,
    data: pedido,
  });
});

test("acepta un pedido con mesa y conserva su identificador", () => {
  const pedidoConMesa = { ...pedido, mesaId: 4 } satisfies Pedido;

  expect(esquemaPedido.safeParse(pedidoConMesa)).toEqual({
    success: true,
    data: pedidoConMesa,
  });
});

test("acepta la respuesta de creación y conserva su mensaje y pedido", () => {
  expect(esquemaRespuestaCrearPedido).toBeDefined();
  expect(esquemaRespuestaCrearPedido.safeParse(respuestaCrearPedidoApi)).toEqual({
    success: true,
    data: respuestaCrearPedidoApi,
  });
});

describe("Validaciones del contrato de pedidos", () => {
  test.each([
    { caso: "una respuesta nula", respuesta: null },
    { caso: "un ID de pedido cero", respuesta: { ...pedido, id: 0 } },
    { caso: "un ID de pedido decimal", respuesta: { ...pedido, id: 1.5 } },
    {
      caso: "un ID de pedido fuera del rango seguro",
      respuesta: { ...pedido, id: Number.MAX_SAFE_INTEGER + 1 },
    },
    { caso: "una lista de ítems vacía", respuesta: { ...pedido, items: [] } },
    {
      caso: "ítems como objeto en lugar de lista",
      respuesta: { ...pedido, items: pedido.items[0] },
    },
    { caso: "un ítem nulo", respuesta: { ...pedido, items: [null] } },
    {
      caso: "un ID de producto textual",
      respuesta: {
        ...pedido,
        items: [{ ...pedido.items[0], productoId: "5" }, pedido.items[1]],
      },
    },
    {
      caso: "un ID de producto cero",
      respuesta: {
        ...pedido,
        items: [{ ...pedido.items[0], productoId: 0 }, pedido.items[1]],
      },
    },
    {
      caso: "una cantidad cero",
      respuesta: {
        ...pedido,
        items: [{ ...pedido.items[0], cantidad: 0 }, pedido.items[1]],
      },
    },
    {
      caso: "una cantidad decimal",
      respuesta: {
        ...pedido,
        items: [{ ...pedido.items[0], cantidad: 1.5 }, pedido.items[1]],
      },
    },
    {
      caso: "una cantidad fuera del rango seguro",
      respuesta: {
        ...pedido,
        items: [
          { ...pedido.items[0], cantidad: Number.MAX_SAFE_INTEGER + 1 },
          pedido.items[1],
        ],
      },
    },
    {
      caso: "un estado formado solo por espacios en blanco",
      respuesta: { ...pedido, estado: " \t\n " },
    },
    { caso: "un estado numérico", respuesta: { ...pedido, estado: 123 } },
    {
      caso: "una mesa fuera del conjunto válido",
      respuesta: { ...pedido, mesaId: 9 },
    },
    { caso: "un total textual", respuesta: { ...pedido, total: "17220" } },
    { caso: "un total negativo", respuesta: { ...pedido, total: -1 } },
    { caso: "un total decimal", respuesta: { ...pedido, total: 17220.5 } },
    {
      caso: "un total fuera del rango seguro",
      respuesta: { ...pedido, total: Number.MAX_SAFE_INTEGER + 1 },
    },
  ])("rechaza $caso", ({ respuesta }) => {
    expect(esquemaPedido.safeParse(respuesta).success).toBe(false);
  });

  test("acepta un estado textual distinto y conserva sus espacios", () => {
    const respuesta = { ...pedido, estado: "  en preparación  " };

    expect(esquemaPedido.safeParse(respuesta)).toEqual({
      success: true,
      data: respuesta,
    });
  });
});

describe("Validaciones de la respuesta de creación de pedidos", () => {
  test.each([
    { caso: "una respuesta nula", respuesta: null },
    { caso: "un mensaje ausente", respuesta: { pedido } },
    {
      caso: "un mensaje numérico",
      respuesta: { ...respuestaCrearPedidoApi, mensaje: 123 },
    },
    {
      caso: "un pedido ausente",
      respuesta: { mensaje: respuestaCrearPedidoApi.mensaje },
    },
    {
      caso: "un pedido nulo",
      respuesta: { ...respuestaCrearPedidoApi, pedido: null },
    },
    {
      caso: "un pedido interno con total textual",
      respuesta: {
        ...respuestaCrearPedidoApi,
        pedido: { ...pedido, total: "17220" },
      },
    },
    {
      caso: "el pedido directo del GET en lugar del envoltorio del POST",
      respuesta: pedido,
    },
  ])("rechaza $caso", ({ respuesta }) => {
    expect(esquemaRespuestaCrearPedido.safeParse(respuesta).success).toBe(false);
  });
});
