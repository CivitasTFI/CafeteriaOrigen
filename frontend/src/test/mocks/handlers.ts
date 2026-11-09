import { http, HttpResponse, type HttpHandler } from "msw";
import type { ErrorApi } from "../../api/esquemas/errores";
import type { Pedido, RespuestaCrearPedido } from "../../api/esquemas/pedidos";
import type { Productos } from "../../api/esquemas/productos";
import { filtrarProductos } from "../../utils/filtrarProductos";
import type { CriteriosBusquedaProducto } from "../../api/productos";

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

function leerCriteriosBusqueda(
  parametros: URLSearchParams,
): CriteriosBusquedaProducto | null {
  if (["tipo", "tipoCafe", "tamaño", "variedad"].some(
    (criterio) => parametros.getAll(criterio).length > 1,
  )) {
    return null;
  }

  const criterios: CriteriosBusquedaProducto = {};
  const tipo = parametros.get("tipo");
  const tipoCafe = parametros.get("tipoCafe");
  const tamaño = parametros.get("tamaño");
  const variedad = parametros.get("variedad");

  if (tipo === "cafe" || tipo === "pasteleria") {
    criterios.tipo = tipo;
  } else if (tipo !== null) {
    return null;
  }
  if (tipoCafe === "expreso" || tipoCafe === "filtrado") {
    criterios.tipoCafe = tipoCafe;
  } else if (tipoCafe !== null) {
    return null;
  }
  if (tamaño === "pocillo" || tamaño === "mediano" || tamaño === "taza grande") {
    criterios.tamaño = tamaño;
  } else if (tamaño !== null) {
    return null;
  }
  const variedadesValidas = [
    "brasil",
    "colombia",
    "etiopia",
    "muffin de chocolate",
    "torta selva negra",
  ] as const;
  if (
    variedad !== null &&
    (variedadesValidas as readonly string[]).includes(variedad)
  ) {
    criterios.variedad = variedad as CriteriosBusquedaProducto["variedad"];
  } else if (variedad !== null) {
    return null;
  }

  if (Object.keys(criterios).length === 0) {
    return null;
  }

  return criterios;
}

export function crearHandlerBuscarProductos(catalogo: Productos): HttpHandler {
  const url = new URL("/productos/buscar", window.location.origin).href;

  return http.get(url, ({ request }) => {
    const parametros = new URL(request.url).searchParams;
    const criterios = leerCriteriosBusqueda(parametros);

    if (criterios === null) {
      return HttpResponse.json(
        { error: "Criterios de búsqueda inválidos o vacíos" },
        { status: 400 },
      );
    }

    const coincidencias = filtrarProductos(catalogo, criterios);

    if (coincidencias.length === 0) {
      return HttpResponse.json(
        { error: "Producto no encontrado" },
        { status: 404 },
      );
    }

    return HttpResponse.json(coincidencias);
  });
}

export function crearHandlerProductoPorId(catalogo: Productos): HttpHandler {
  const url = new URL("/productos/:id", window.location.origin).href;

  return http.get(url, ({ params }) => {
    const idTexto = String(params.id);
    if (idTexto === "buscar") {
      return;
    }

    const id = Number(idTexto);
    const producto = catalogo.find((item) => item.id === id);

    if (producto === undefined) {
      return HttpResponse.json(
        { error: "Producto no encontrado" },
        { status: 404 },
      );
    }

    return HttpResponse.json(producto);
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
