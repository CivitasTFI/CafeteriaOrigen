import { describe, expect, test } from "vitest";
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

    expect(resultados).toHaveLength(3);
    expect(resultados.every((p) => p.tipo === "cafe")).toBe(true);
  });

  test("devuelve pastelería por tipo", async () => {
    server.use(crearHandlerBuscarProductos(catalogoPrueba));

    const resultados = await buscarProductos({ tipo: "pasteleria" });

    expect(resultados).toHaveLength(2);
    expect(resultados.every((p) => p.tipo === "pasteleria")).toBe(true);
  });

  test("rechaza criterios inválidos con 400", async () => {
    server.use(crearHandlerBuscarProductos(catalogoPrueba));

    await expect(buscarProductos({})).rejects.toThrow(
      "Criterios de búsqueda inválidos o vacíos",
    );
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

  test("valida el formato de cada ítem devuelto", async () => {
    server.use(crearHandlerBuscarProductos(catalogoPrueba));

    const resultados = await buscarProductos({
      tipoCafe: cafeApi.tipoCafe,
      tamaño: cafeApi.tamaño,
      variedad: cafeApi.variedad.nombre,
    });

    expect(resultados).toEqual([cafeApi]);
  });
});
