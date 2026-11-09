import { describe, expect, it } from "vitest";
import { leerMesa } from "../../utils/leerMesa";

describe("leerMesa", () => {
  it.each([1, 2, 3, 4, 5, 6, 7, 8])("lee la mesa válida %i desde ?mesa=", (mesa) => {
    expect(leerMesa(new URLSearchParams(`mesa=${mesa}`))).toBe(mesa);
  });

  it.each([
    { caso: "parámetro ausente", query: "" },
    { caso: "campo HTTP en lugar del parámetro QR", query: "mesaId=4" },
    { caso: "parámetro vacío", query: "mesa=" },
    { caso: "espacios en blanco", query: "mesa=+" },
    { caso: "texto", query: "mesa=abc" },
    { caso: "cero", query: "mesa=0" },
    { caso: "negativo", query: "mesa=-1" },
    { caso: "decimal", query: "mesa=4.5" },
    { caso: "entero con separador decimal", query: "mesa=4.0" },
    { caso: "mesa inexistente", query: "mesa=9" },
    { caso: "entero fuera del rango seguro", query: "mesa=9007199254740992" },
    { caso: "notación exponencial", query: "mesa=4e0" },
    { caso: "notación hexadecimal", query: "mesa=0x4" },
    { caso: "valor no finito", query: "mesa=Infinity" },
    { caso: "mesas repetidas", query: "mesa=4&mesa=5" },
  ])("interpreta $caso como barra sin lanzar errores", ({ query }) => {
    expect(leerMesa(new URLSearchParams(query))).toBeUndefined();
  });
});
