import { http, HttpResponse, type HttpHandler } from "msw";
import type { ErrorApi } from "../../api/esquemas/errores";
import type { Pedido, RespuestaCrearPedido } from "../../api/esquemas/pedidos";
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

export function crearHandlerBuscarProductos(catalogo: Productos): HttpHandler {
  const url = new URL("/productos/buscar", window.location.origin).href;

  return http.get(url, ({ request }) => {
    const parametros = new URL(request.url).searchParams;
    const tipo = parametros.get("tipo");
    const tipoCafe = parametros.get("tipoCafe");
    const tamaño = parametros.get("tamaño");
    const variedad = parametros.get("variedad");

    const coincidencias = catalogo.filter((producto) => {
      if (tipo !== null && producto.tipo !== tipo) {
        return false;
      }
      if (tipoCafe !== null || tamaño !== null) {
        if (producto.tipo !== "cafe") {
          return false;
        }
        if (tipoCafe !== null && producto.tipoCafe !== tipoCafe) {
          return false;
        }
        if (tamaño !== null && producto.tamaño !== tamaño) {
          return false;
        }
        if (variedad !== null && producto.variedad.nombre !== variedad) {
          return false;
        }
        return true;
      }
      if (producto.tipo === "pasteleria" && variedad !== null) {
        return producto.variedad === variedad;
      }
      return true;
    });

    if (coincidencias.length === 0) {
      return HttpResponse.json(
        { error: "Producto no encontrado" },
        { status: 404 },
      );
    }

    return HttpResponse.json(coincidencias);
  });
}

export function crearHandlerCreacionPedido(respuesta: RespuestaCrearPedido): HttpHandler {
  const url = new URL("/pedidos", window.location.origin).href;

  return http.post(url, () => HttpResponse.json(respuesta, { status: 201 }));
}

export function crearHandlerConsultaPedido(pedido: Pedido): HttpHandler {
  const url = new URL(`/pedidos/${pedido.id}`, window.location.origin).href;

  return http.get(url, () => HttpResponse.json(pedido));
}
