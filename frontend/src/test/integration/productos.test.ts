import { http, HttpResponse } from "msw";
import { describe, expect, test } from "vitest";
import { listarProductos } from "../../api/productos";
import { erroresApi } from "../fixtures/errores";
import { productosApi } from "../fixtures/productos";
import { crearHandlerError, crearHandlerProductos } from "../mocks/handlers";
import { server } from "../mocks/server";

describe("Consulta del listado de productos", () => {
  test("devuelve los productos de GET /productos con sus precios", async () => {
    server.use(crearHandlerProductos(productosApi));

    await expect(listarProductos()).resolves.toEqual(productosApi);
  });

  test("devuelve una lista vacía cuando la API no tiene productos", async () => {
    server.use(crearHandlerProductos([]));

    await expect(listarProductos()).resolves.toEqual([]);
  });

  test("rechaza una respuesta 200 que contiene un objeto en lugar de una lista", async () => {
    const url = new URL("/productos", window.location.origin).href;
    server.use(http.get(url, () => HttpResponse.json(productosApi[0])));

    await expect(listarProductos()).rejects.toThrow(
      new Error("La respuesta del servidor no tiene el formato esperado"),
    );
  });

  test("rechaza una respuesta 200 si un producto tiene el precio como texto", async () => {
    const url = new URL("/productos", window.location.origin).href;
    const productosInvalidos = [
      productosApi[0],
      { ...productosApi[1], precio: "2500" },
    ];
    server.use(http.get(url, () => HttpResponse.json(productosInvalidos)));

    await expect(listarProductos()).rejects.toThrow(
      new Error("La respuesta del servidor no tiene el formato esperado"),
    );
  });

  test("propaga el mensaje de error cuando GET /productos responde 500", async () => {
    server.use(crearHandlerError("/productos", erroresApi.errorInterno, 500));

    await expect(listarProductos()).rejects.toThrow(
      new Error(erroresApi.errorInterno.error),
    );
  });
});
