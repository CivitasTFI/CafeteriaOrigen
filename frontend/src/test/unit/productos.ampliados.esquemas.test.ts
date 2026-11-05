import { describe, expect, test } from "vitest";
import {
  esquemaProducto,
  esquemaProductos,
} from "../../api/esquemas/productos";

const expreso = {
  id: 5,
  nombre: "Expreso Mediano Colombia",
  precio: 7360,
  tipo: "cafe",
  tipoCafe: "expreso",
  tamaño: "mediano",
  variedad: {
    nombre: "colombia",
    descripcion: "Acidez muy viva, cuerpo ligero y notas frutales",
  },
};

const filtrado = {
  id: 10,
  nombre: "Filtrado Pocillo Brasil",
  precio: 4040,
  tipo: "cafe",
  tipoCafe: "filtrado",
  tamaño: "pocillo",
  variedad: {
    nombre: "brasil",
    descripcion: "Acidez media, cuerpo equilibrado, notas citricas y florales",
  },
};

const pasteleria = {
  id: 19,
  nombre: "Muffin de Chocolate",
  precio: 2500,
  tipo: "pasteleria",
  variedad: "muffin de chocolate",
};

describe("Contrato ampliado de productos de la API", () => {
  test.each([
    { caso: "un expreso con tamaño y origen", producto: expreso },
    { caso: "un filtrado con tamaño y origen", producto: filtrado },
    { caso: "pastelería con variedad textual", producto: pasteleria },
  ])("acepta $caso y conserva todos sus campos", ({ producto }) => {
    expect(esquemaProducto.safeParse(producto)).toEqual({
      success: true,
      data: producto,
    });
  });

  test.each([
    {
      caso: "un producto sin tipo",
      producto: { id: 5, nombre: expreso.nombre, precio: 7360 },
    },
    {
      caso: "expreso usado como tipo de producto en vez de cafe",
      producto: { ...expreso, tipo: "expreso" },
    },
    {
      caso: "un café sin tipoCafe",
      producto: { ...expreso, tipoCafe: undefined },
    },
    {
      caso: "una bebida desconocida",
      producto: { ...expreso, tipoCafe: "latte" },
    },
    {
      caso: "un tamaño desconocido",
      producto: { ...expreso, tamaño: "grande" },
    },
    {
      caso: "un origen textual en un café",
      producto: { ...expreso, variedad: "colombia" },
    },
    {
      caso: "un origen desconocido",
      producto: { ...expreso, variedad: { ...expreso.variedad, nombre: "peru" } },
    },
    {
      caso: "un origen sin descripción",
      producto: { ...expreso, variedad: { nombre: "colombia" } },
    },
    {
      caso: "una variedad de pastelería como objeto en vez de texto",
      producto: { ...pasteleria, variedad: expreso.variedad },
    },
    {
      caso: "una variedad de pastelería desconocida",
      producto: { ...pasteleria, variedad: "croissant" },
    },
  ])("rechaza $caso", ({ producto }) => {
    expect(esquemaProducto.safeParse(producto).success).toBe(false);
  });
});

describe("Contrato ampliado del listado de productos", () => {
  test.each([
    {
      caso: "una lista con cafés y pastelería",
      productos: [expreso, filtrado, pasteleria],
    },
    { caso: "una lista vacía", productos: [] },
  ])("acepta $caso y conserva sus datos", ({ productos }) => {
    expect(esquemaProductos.safeParse(productos)).toEqual({
      success: true,
      data: productos,
    });
  });

  test("rechaza toda la lista si un producto tiene un precio textual", () => {
    const productos = [expreso, { ...pasteleria, precio: "2500" }];

    expect(esquemaProductos.safeParse(productos).success).toBe(false);
  });
});
