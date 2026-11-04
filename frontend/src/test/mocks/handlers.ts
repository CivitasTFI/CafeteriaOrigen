import { http, HttpResponse, type HttpHandler } from "msw";
import type { ErrorApi } from "../../api/esquemas/errores";
import type { ProductosBase } from "../../api/esquemas/productos";

export function crearHandlerError(
  ruta: string,
  respuesta: ErrorApi,
  estado: number,
  metodo: "get" | "post" = "get",
): HttpHandler {
  const url = new URL(ruta, window.location.origin).href;

  return http[metodo](url, () => HttpResponse.json(respuesta, { status: estado }));
}

export function crearHandlerProductos(productos: ProductosBase): HttpHandler {
  const url = new URL("/productos", window.location.origin).href;

  return http.get(url, () => HttpResponse.json(productos));
}
