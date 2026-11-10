import { describe, expect, test } from "vitest";
import { http, HttpResponse } from "msw";
import { buscarProductos } from "../../api/productos";
import { erroresApi } from "../fixtures/errores";
import { catalogoPrueba, cafeApi } from "../fixtures/productos";
import {
  crearHandlerBuscarProductos,
  crearHandlerError,
} from "../mocks/handlers";
import { server } from "../mocks/server";

describe("Consulta de búsqueda de productos", () => {
  test("devuelve cafés que coinciden con tipoCafe y tamaño", async () => {
    server.use(crearHandlerBuscarProductos(catalogoPrueba));

    const resultados = await buscarProductos({
      tipoCafe: "expreso",
      tamaño: "mediano",
    });

    expect(resultados.map((producto) => producto.id)).toEqual([4, 5, 6]);
  });

  test("devuelve pastelería por tipo", async () => {
    server.use(crearHandlerBuscarProductos(catalogoPrueba));

    const resultados = await buscarProductos({ tipo: "pasteleria" });

    expect(resultados.map((producto) => producto.id)).toEqual([19, 20]);
  });

  test("rechaza criterios inválidos con 400", async () => {
    server.use(crearHandlerBuscarProductos(catalogoPrueba));

    await expect(buscarProductos({})).rejects.toThrow(
      "Criterios de búsqueda inválidos o vacíos",
    );
  });

  test.each([
    { criterio: "tipo", primero: "cafe", segundo: "pasteleria" },
    { criterio: "tipoCafe", primero: "expreso", segundo: "filtrado" },
    { criterio: "tamaño", primero: "pocillo", segundo: "mediano" },
    { criterio: "variedad", primero: "colombia", segundo: "brasil" },
  ])("el mock rechaza el criterio repetido $criterio con 400", async ({ criterio, primero, segundo }) => {
    server.use(crearHandlerBuscarProductos(catalogoPrueba));
    const url = new URL("/productos/buscar", window.location.origin);
    url.searchParams.set(criterio === "tipo" ? "tipoCafe" : "tipo", criterio === "tipo" ? "expreso" : "cafe");
    url.searchParams.append(criterio, primero);
    url.searchParams.append(criterio, segundo);

    const respuesta = await fetch(url);

    expect(respuesta.status).toBe(400);
    await expect(respuesta.json()).resolves.toEqual({
      error: "Criterios de búsqueda inválidos o vacíos",
    });
  });

  test("propaga el mensaje de error cuando no hay coincidencias", async () => {
    server.use(crearHandlerBuscarProductos(catalogoPrueba));

    await expect(
      buscarProductos({ tipo: "pasteleria", variedad: "brasil" }),
    ).rejects.toThrow("Producto no encontrado");
  });

  test("propaga el mensaje ante un error del servidor", async () => {
    server.use(
      crearHandlerError("/productos/buscar", erroresApi.errorInterno, 500),
    );

    await expect(
      buscarProductos({ tipoCafe: "expreso", tamaño: "pocillo" }),
    ).rejects.toThrow(erroresApi.errorInterno.error);
  });

  test("combina bebida, tamaño y origen y conserva el producto encontrado", async () => {
    server.use(crearHandlerBuscarProductos(catalogoPrueba));

    const resultados = await buscarProductos({
      tipoCafe: cafeApi.tipoCafe,
      tamaño: cafeApi.tamaño,
      variedad: cafeApi.variedad.nombre,
    });

    expect(resultados).toEqual([cafeApi]);
  });

  test.each([
    { caso: "un objeto en lugar de una lista", cuerpo: cafeApi },
    { caso: "un precio textual", cuerpo: [{ ...cafeApi, precio: "7360" }] },
    { caso: "un producto sin tipo", cuerpo: [{ id: 5, nombre: cafeApi.nombre, precio: 7360 }] },
  ])("rechaza una respuesta 200 con $caso", async ({ cuerpo }) => {
    server.use(http.get(new URL("/productos/buscar", window.location.origin).href,
      () => HttpResponse.json(cuerpo)));

    await expect(buscarProductos({ tipoCafe: "expreso" })).rejects.toThrow(
      "La respuesta del servidor no tiene el formato esperado",
    );
  });
});
