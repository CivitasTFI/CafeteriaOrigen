import { solicitarValidado } from "./cliente";
import {
  esquemaProducto,
  esquemaProductos,
  type Producto,
  type Productos,
} from "./esquemas/productos";

export type CriteriosBusquedaProducto = {
  tipo?: "cafe" | "pasteleria";
  tipoCafe?: "expreso" | "filtrado";
  tamaño?: "pocillo" | "mediano" | "taza grande";
  variedad?:
    | "brasil"
    | "colombia"
    | "etiopia"
    | "muffin de chocolate"
    | "torta selva negra";
};

function armarQueryBusqueda(criterios: CriteriosBusquedaProducto): string {
  const params = new URLSearchParams();
  for (const [clave, valor] of Object.entries(criterios)) {
    if (valor !== undefined) {
      params.set(clave, valor);
    }
  }
  return params.toString();
}

export async function listarProductos(): Promise<Productos> {
  return solicitarValidado("/productos", esquemaProductos);
}

export async function buscarProductos(
  criterios: CriteriosBusquedaProducto,
): Promise<Productos> {
  const query = armarQueryBusqueda(criterios);
  return solicitarValidado(`/productos/buscar?${query}`, esquemaProductos);
}

export async function obtenerProducto(id: number): Promise<Producto> {
  return solicitarValidado(`/productos/${id}`, esquemaProducto);
}
