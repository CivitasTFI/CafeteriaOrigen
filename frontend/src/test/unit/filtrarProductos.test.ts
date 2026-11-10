import { describe, expect, it } from "vitest";
import { filtrarProductos } from "../../utils/filtrarProductos";
import { catalogoCompleto } from "../fixtures/productos";

describe("filtrarProductos", () => {
  it("devuelve los tres orígenes para expreso mediano", () => {
    const resultados = filtrarProductos(catalogoCompleto, {
      tipoCafe: "expreso",
      tamaño: "mediano",
    });

    expect(resultados.map((producto) => producto.id)).toEqual([4, 5, 6]);
  });

  it("devuelve las dos opciones de pastelería por tipo", () => {
    const resultados = filtrarProductos(catalogoCompleto, {
      tipo: "pasteleria",
    });

    expect(resultados.map((producto) => producto.id)).toEqual([19, 20]);
  });

  it.each(catalogoCompleto.filter((producto) => producto.tipo === "cafe"))(
    "encuentra únicamente $nombre (ID $id) con los tres criterios",
    (cafe) => {
      const resultados = filtrarProductos(catalogoCompleto, {
        tipoCafe: cafe.tipoCafe,
        tamaño: cafe.tamaño,
        variedad: cafe.variedad.nombre,
      });

      expect(resultados).toEqual([cafe]);
    },
  );

  it("devuelve lista vacía si no hay coincidencias", () => {
    const resultados = filtrarProductos(catalogoCompleto, {
      tipo: "pasteleria",
      variedad: "brasil",
    });

    expect(resultados).toEqual([]);
  });
});
