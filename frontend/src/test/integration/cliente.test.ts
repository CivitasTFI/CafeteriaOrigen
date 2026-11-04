import { http, HttpResponse } from "msw";
import { describe, expect, test } from "vitest";
import { solicitarJson } from "../../api/cliente";
import { server } from "../mocks/server";

function simularGet(ruta: string, responder: () => Response): void {
  const url = new URL(ruta, window.location.origin).href;
  server.use(http.get(url, responder));
}

describe("Cliente HTTP de la API", () => {
  test.each([
    {
      caso: "una página HTML de error",
      cuerpo: "<html><body>Error del servidor</body></html>",
      tipoContenido: "text/html",
      estado: 500,
    },
    {
      caso: "un JSON incompleto",
      cuerpo: '{"error":',
      tipoContenido: "application/json",
      estado: 502,
    },
    {
      caso: "un cuerpo vacío",
      cuerpo: "",
      tipoContenido: "application/json",
      estado: 500,
    },
  ])(
    "informa un mensaje claro si el servidor devuelve $caso",
    async ({ cuerpo, tipoContenido, estado }) => {
      const ruta = "/productos";

      simularGet(ruta, () =>
        new HttpResponse(cuerpo, {
          status: estado,
          headers: { "Content-Type": tipoContenido },
        }),
      );

      await expect(solicitarJson(ruta)).rejects.toThrow(
        new Error("No se pudo interpretar la respuesta del servidor"),
      );
    },
  );

  test.each([
    { caso: "un objeto sin error", cuerpo: {} },
    { caso: "un mensaje que no es texto", cuerpo: { error: 500 } },
    { caso: "una respuesta nula", cuerpo: null },
  ])(
    "informa un mensaje claro si el error de la API contiene $caso",
    async ({ cuerpo }) => {
      const ruta = "/productos";

      simularGet(ruta, () => HttpResponse.json(cuerpo, { status: 500 }));

      await expect(solicitarJson(ruta)).rejects.toThrow(
        new Error("No se pudo interpretar la respuesta de error del servidor"),
      );
    },
  );

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
      simularGet(ruta, () =>
        HttpResponse.json({ error: mensaje }, { status: estado }),
      );

      await expect(solicitarJson(ruta)).rejects.toThrow(new Error(mensaje));
    },
  );
});
