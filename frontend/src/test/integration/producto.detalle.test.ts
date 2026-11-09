import { http, HttpResponse } from "msw";
import { expect, test } from "vitest";
import { obtenerProducto } from "../../api/productos";
import { cafeApi, pasteleriaApi } from "../fixtures/productos";
import { erroresApi } from "../fixtures/errores";
import { server } from "../mocks/server";

test.each([cafeApi, pasteleriaApi])(
  "consulta por ID $id y conserva el contrato completo de $nombre",
  async (producto) => {
    const solicitudes: string[] = [];
    server.use(http.get(new URL("/productos/:id", window.location.origin).href, ({ params }) => {
      solicitudes.push(String(params.id));
      return HttpResponse.json(producto);
    }));

    await expect(obtenerProducto(producto.id)).resolves.toEqual(producto);
    expect(solicitudes).toEqual([String(producto.id)]);
  },
);

test("propaga el 404 de un producto inexistente", async () => {
  server.use(http.get(new URL("/productos/999", window.location.origin).href,
    () => HttpResponse.json(erroresApi.productoNoEncontrado, { status: 404 })));

  await expect(obtenerProducto(999)).rejects.toThrow(erroresApi.productoNoEncontrado.error);
});

test("rechaza un detalle 200 cuyo precio no cumple el contrato", async () => {
  server.use(http.get(new URL(`/productos/${cafeApi.id}`, window.location.origin).href,
    () => HttpResponse.json({ ...cafeApi, precio: "7360" })));

  await expect(obtenerProducto(cafeApi.id)).rejects.toThrow(
    "La respuesta del servidor no tiene el formato esperado",
  );
});
