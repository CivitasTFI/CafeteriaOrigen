import { describe, expect, test } from "vitest";
import { erroresApi } from "../fixtures/errores";
import { crearHandlerError } from "../mocks/handlers";
import { server } from "../mocks/server";

describe("Handlers compartidos de errores", () => {
  test.each([
    {
      caso: "ID de pedido inválido",
      metodo: "get",
      ruta: "/pedidos/abc",
      estado: 400,
      respuesta: erroresApi.pedidoIdInvalido,
    },
    {
      caso: "producto inexistente",
      metodo: "get",
      ruta: "/productos/999",
      estado: 404,
      respuesta: erroresApi.productoNoEncontrado,
    },
    {
      caso: "pedido sin ítems",
      metodo: "post",
      ruta: "/pedidos",
      estado: 400,
      respuesta: erroresApi.pedidoSinItems,
    },
    {
      caso: "error interno",
      metodo: "get",
      ruta: "/productos",
      estado: 500,
      respuesta: erroresApi.errorInterno,
    },
  ] as const)(
    "responde $estado con el mensaje de la API para $caso",
    async ({ metodo, ruta, estado, respuesta }) => {
      server.use(crearHandlerError(ruta, respuesta, estado, metodo));

      const opciones =
        metodo === "post"
          ? {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ items: [], estado: "pendiente" }),
            }
          : undefined;
      const response = await fetch(
        new URL(ruta, window.location.origin),
        opciones,
      );

      expect(response.status).toBe(estado);
      await expect(response.json()).resolves.toEqual(respuesta);
    },
  );
});
