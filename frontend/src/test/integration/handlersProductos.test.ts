import { describe, expect, test } from "vitest";
import { esquemaProductosBase } from "../../api/esquemas/productos";
import { productosApi } from "../fixtures/productos";
import { crearHandlerProductos } from "../mocks/handlers";
import { server } from "../mocks/server";

describe("Handler compartido del listado de productos", () => {
  test.each([
    {
      caso: "los productos configurados y sus precios de la API",
      productos: productosApi,
    },
    { caso: "una lista vacía cuando no hay productos configurados", productos: [] },
  ])("responde 200 con $caso", async ({ productos }) => {
    server.use(crearHandlerProductos(productos));

    const response = await fetch(new URL("/productos", window.location.origin));

    expect(response.status).toBe(200);
    const datos: unknown = await response.json();
    expect(esquemaProductosBase.safeParse(datos).success).toBe(true);
    expect(datos).toEqual(productos);
  });
});
