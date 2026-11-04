import { describe, expect, test } from "vitest";
import { esquemaProductosBase } from "../../api/esquemas/productos";
import { productosApi } from "../fixtures/productos";
import { crearHandlerProductos } from "../mocks/handlers";
import { server } from "../mocks/server";

describe("Handler compartido del listado de productos", () => {
  test("responde 200 con los productos configurados y sus precios de la API", async () => {
    server.use(crearHandlerProductos(productosApi));

    const response = await fetch(new URL("/productos", window.location.origin));

    expect(response.status).toBe(200);
    const datos: unknown = await response.json();
    expect(esquemaProductosBase.safeParse(datos).success).toBe(true);
    expect(datos).toEqual(productosApi);
  });

  test("responde 200 con una lista vacía cuando no hay productos configurados", async () => {
    server.use(crearHandlerProductos([]));

    const response = await fetch(new URL("/productos", window.location.origin));

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual([]);
  });
});
