import { http, HttpResponse, type HttpHandler } from "msw";
import type { ErrorApi } from "../../api/esquemas/errores";
import type { RespuestaCrearPedido } from "../../api/esquemas/pedidos";
import type { Productos } from "../../api/esquemas/productos";

export function crearHandlerError(
  ruta: string,
  respuesta: ErrorApi,
  estado: number,
  metodo: "get" | "post" = "get",
): HttpHandler {
  const url = new URL(ruta, window.location.origin).href;

  return http[metodo](url, () => HttpResponse.json(respuesta, { status: estado }));
}

export function crearHandlerProductos(productos: Productos): HttpHandler {
  const url = new URL("/productos", window.location.origin).href;

  return http.get(url, () => HttpResponse.json(productos));
}

export function crearHandlerCreacionPedido(respuesta: RespuestaCrearPedido): HttpHandler {
  const url = new URL("/pedidos", window.location.origin).href;

  return http.post(url, () => HttpResponse.json(respuesta, { status: 201 }));
}
