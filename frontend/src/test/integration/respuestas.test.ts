import { http, HttpResponse } from "msw";
import { describe, expect, test } from "vitest";
import { z } from "zod";
import { solicitarValidado } from "../../api/cliente";
import { server } from "../mocks/server";

// Esquema local para probar el cliente con el producto que expone hoy la API.
// El contrato ampliado de productos se definirá en su módulo correspondiente.
const esquemaProducto = z.object({
  id: z.number().int().positive(),
  nombre: z.string(),
  precio: z.number().nonnegative(),
});

const producto = {
  id: 5,
  nombre: "Expreso Mediano Colombia",
  precio: 7360,
};
const ruta = "/productos/5";

function simularRespuesta(responder: () => Response): void {
  const url = new URL(ruta, window.location.origin).href;
  server.use(http.get(url, responder));
}

describe("Validación de respuestas exitosas", () => {
  test("devuelve los datos de un producto que cumple el esquema recibido", async () => {
    simularRespuesta(() => HttpResponse.json(producto));

    await expect(solicitarValidado(ruta, esquemaProducto)).resolves.toEqual(
      producto,
    );
  });

  test.each([
    {
      caso: "el precio llega como texto",
      cuerpo: { ...producto, precio: "7360" },
    },
    {
      caso: "falta el nombre del producto",
      cuerpo: { id: producto.id, precio: producto.precio },
    },
    { caso: "la respuesta es nula", cuerpo: null },
  ])("rechaza la respuesta 200 si $caso", async ({ cuerpo }) => {
    simularRespuesta(() => HttpResponse.json(cuerpo));

    await expect(solicitarValidado(ruta, esquemaProducto)).rejects.toThrow(
      new Error("La respuesta del servidor no tiene el formato esperado"),
    );
  });
});
