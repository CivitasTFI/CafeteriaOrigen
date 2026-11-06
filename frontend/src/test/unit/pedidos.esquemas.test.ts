import { describe, expect, test } from "vitest";
import { esquemaPedido } from "../../api/esquemas/pedidos";

test("acepta un pedido de la API actual y conserva sus datos", () => {
  const pedido = {
    id: 1,
    items: [
      { productoId: 5, cantidad: 2 },
      { productoId: 19, cantidad: 1 },
    ],
    estado: "pendiente",
    total: 17220,
  };

  expect(esquemaPedido).toBeDefined();
  expect(esquemaPedido.safeParse(pedido)).toEqual({
    success: true,
    data: pedido,
  });
});

describe("Validaciones del contrato de pedidos", () => {
  const pedido = {
    id: 1,
    items: [
      { productoId: 5, cantidad: 2 },
      { productoId: 19, cantidad: 1 },
    ],
    estado: "pendiente",
    total: 17220,
  };

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
