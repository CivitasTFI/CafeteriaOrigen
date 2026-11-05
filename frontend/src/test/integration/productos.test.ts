import { http, HttpResponse } from "msw";
import { describe, expect, test } from "vitest";
import { listarProductos } from "../../api/productos";
import { erroresApi } from "../fixtures/errores";
import { productosApi } from "../fixtures/productos";
import { crearHandlerError, crearHandlerProductos } from "../mocks/handlers";
import { server } from "../mocks/server";

describe("Consulta del listado de productos", () => {
  test("devuelve los productos de GET /productos con sus precios y todos los campos ampliados", async () => {
    server.use(crearHandlerProductos(productosApi));

    await expect(listarProductos()).resolves.toEqual(productosApi);
  });

  test("devuelve una lista vacía cuando la API no tiene productos", async () => {
    server.use(crearHandlerProductos([]));

    await expect(listarProductos()).resolves.toEqual([]);
  });

  test.each([
    {
      caso: "contiene un objeto en lugar de una lista",
      cuerpo: productosApi[0],
    },
    {
      caso: "un producto tiene el precio como texto",
      cuerpo: [productosApi[0], { ...productosApi[1], precio: "2500" }],
    },
    {
      caso: "un producto no incluye tipo",
      cuerpo: [
        { id: 5, nombre: "Expreso Mediano Colombia", precio: 7360 },
      ],
    },
    {
      caso: "un café tiene una bebida desconocida",
      cuerpo: [{ ...productosApi[0], tipoCafe: "latte" }],
    },
    {
      caso: "el origen de un café no incluye descripción",
      cuerpo: [{ ...productosApi[0], variedad: { nombre: "colombia" } }],
    },
  ])("rechaza una respuesta 200 si $caso", async ({ cuerpo }) => {
    const url = new URL("/productos", window.location.origin).href;
    server.use(http.get(url, () => HttpResponse.json(cuerpo)));

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
