import { describe, expect, test } from "vitest";
import {
  esquemaProductoBase,
  esquemaProductosBase,
} from "../../api/esquemas/productos";

const producto = {
  id: 5,
  nombre: "Expreso Mediano Colombia",
  precio: 7360,
};

describe("Contrato base de un producto de la API actual", () => {
  test("acepta un producto válido y conserva sus datos", () => {
    expect(esquemaProductoBase.safeParse(producto)).toEqual({
      success: true,
      data: producto,
    });
  });

  test.each([
    { caso: "un ID decimal", respuesta: { ...producto, id: 5.5 } },
    { caso: "un ID no positivo", respuesta: { ...producto, id: 0 } },
    {
      caso: "un nombre ausente",
      respuesta: { id: producto.id, precio: producto.precio },
    },
    {
      caso: "un precio textual",
      respuesta: { ...producto, precio: "7360" },
    },
    { caso: "un precio negativo", respuesta: { ...producto, precio: -1 } },
    { caso: "una respuesta nula", respuesta: null },
  ])("rechaza $caso", ({ respuesta }) => {
    expect(esquemaProductoBase.safeParse(respuesta).success).toBe(false);
  });
});

describe("Contrato base de la lista de productos", () => {
  test("acepta una lista de productos válidos", () => {
    const productos = [
      producto,
      { id: 19, nombre: "Muffin de Chocolate", precio: 2500 },
    ];

    expect(esquemaProductosBase.safeParse(productos)).toEqual({
      success: true,
      data: productos,
    });
  });

  test("acepta una lista vacía", () => {
    expect(esquemaProductosBase.safeParse([])).toEqual({
      success: true,
      data: [],
    });
  });

  test("rechaza un objeto en lugar de una lista", () => {
    expect(esquemaProductosBase.safeParse(producto).success).toBe(false);
  });

  test("rechaza la lista si uno de sus productos es inválido", () => {
    const productos = [producto, { ...producto, id: 19, precio: "2500" }];

    expect(esquemaProductosBase.safeParse(productos).success).toBe(false);
  });
});
