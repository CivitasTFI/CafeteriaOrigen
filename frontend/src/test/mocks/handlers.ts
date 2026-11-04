import { http, HttpResponse, type HttpHandler } from "msw";
import type { ErrorApi } from "../../api/esquemas/errores";

export function crearHandlerError(
  ruta: string,
  _respuesta: ErrorApi,
  estado: number,
  metodo: "get" | "post" = "get",
): HttpHandler {
  const url = new URL(ruta, window.location.origin).href;

  // Base provisional del RED: todavía no devuelve el cuerpo de error recibido.
  return http[metodo](url, () => HttpResponse.json({}, { status: estado }));
}
