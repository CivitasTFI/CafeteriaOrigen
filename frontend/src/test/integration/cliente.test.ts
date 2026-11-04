import { http, HttpResponse } from "msw";
import { describe, expect, test } from "vitest";
import { solicitarJson } from "../../api/cliente";
import { server } from "../mocks/server";

describe("Cliente HTTP de la API", () => {
  test.each([
    {
      estado: 400,
      ruta: "/pedidos/abc",
      mensaje: "El ID debe ser un número entero positivo",
    },
    {
      estado: 404,
      ruta: "/productos/999",
      mensaje: "Producto no encontrado",
    },
    {
      estado: 500,
      ruta: "/productos",
      mensaje: "Error interno del servidor",
    },
  ])(
    "rechaza una respuesta $estado conservando el mensaje de la API",
    async ({ estado, ruta, mensaje }) => {
      const url = new URL(ruta, window.location.origin).href;

      server.use(
        http.get(url, () =>
          HttpResponse.json({ error: mensaje }, { status: estado }),
        ),
      );

      await expect(solicitarJson(ruta)).rejects.toThrow(new Error(mensaje));
    },
  );
});
