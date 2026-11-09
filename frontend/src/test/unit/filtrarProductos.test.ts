import { describe, expect, it } from "vitest";
import { filtrarProductos } from "../../utils/filtrarProductos";
import { catalogoCompleto, cafeApi } from "../fixtures/productos";

describe("filtrarProductos", () => {
  it("devuelve los tres orígenes para expreso mediano", () => {
    const resultados = filtrarProductos(catalogoCompleto, {
      tipoCafe: "expreso",
      tamaño: "mediano",
    });

    expect(resultados).toHaveLength(3);
    expect(resultados.every((p) => p.tipo === "cafe")).toBe(true);
  });

  it("devuelve las dos opciones de pastelería por tipo", () => {
    const resultados = filtrarProductos(catalogoCompleto, {
      tipo: "pasteleria",
    });

    expect(resultados).toHaveLength(2);
  });

  it("reduce a un producto con todos los criterios de café", () => {
    const resultados = filtrarProductos(catalogoCompleto, {
      tipoCafe: cafeApi.tipoCafe,
      tamaño: cafeApi.tamaño,
      variedad: cafeApi.variedad.nombre,
    });

    expect(resultados).toEqual([cafeApi]);
  });

  it("devuelve lista vacía si no hay coincidencias", () => {
    const resultados = filtrarProductos(catalogoCompleto, {
      tipo: "pasteleria",
      variedad: "brasil",
    });

    expect(resultados).toEqual([]);
  });
});
