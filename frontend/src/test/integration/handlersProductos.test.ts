import { describe, expect, test } from "vitest";
import { esquemaProductos } from "../../api/esquemas/productos";
import { buscarProductos } from "../../api/productos";
import { cafeApi, pasteleriaApi, productosApi } from "../fixtures/productos";
import {
  crearHandlerBuscarProductos,
  crearHandlerProductoPorId,
  crearHandlerProductos,
} from "../mocks/handlers";
import { server } from "../mocks/server";

describe("Handler compartido del listado de productos", () => {
  test("responde 200 con los productos configurados y su contrato completo", async () => {
    server.use(crearHandlerProductos(productosApi));

    const response = await fetch(new URL("/productos", window.location.origin));

    expect(response.status).toBe(200);
    const datos: unknown = await response.json();
    expect(esquemaProductos.safeParse(datos).success).toBe(true);
    expect(datos).toEqual(productosApi);
  });
});

describe("Handler compartido del detalle de productos", () => {
  test("devuelve el producto configurado por ID", async () => {
    server.use(crearHandlerProductoPorId(productosApi));

    const respuesta = await fetch(new URL(`/productos/${cafeApi.id}`, window.location.origin));

    expect(respuesta.status).toBe(200);
    await expect(respuesta.json()).resolves.toEqual(cafeApi);
  });

  test("devuelve 404 cuando el ID no está en el catálogo configurado", async () => {
    server.use(crearHandlerProductoPorId(productosApi));

    const respuesta = await fetch(new URL("/productos/999", window.location.origin));

    expect(respuesta.status).toBe(404);
    await expect(respuesta.json()).resolves.toEqual({ error: "Producto no encontrado" });
  });

  test.each([true, false])("permite la búsqueda con el handler de detalle registrado primero: %s", async (detallePrimero) => {
    const detalle = crearHandlerProductoPorId(productosApi);
    const busqueda = crearHandlerBuscarProductos([pasteleriaApi]);
    server.use(...(detallePrimero ? [detalle, busqueda] : [busqueda, detalle]));

    await expect(buscarProductos({ tipo: "pasteleria" })).resolves.toEqual([pasteleriaApi]);
  });
});
