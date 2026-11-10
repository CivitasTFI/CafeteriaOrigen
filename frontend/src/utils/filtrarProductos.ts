import type { CriteriosBusquedaProducto } from "../api/productos";
import type { Producto, Productos } from "../api/esquemas/productos";

// Filtra el catálogo en memoria. La API valida criterios maliciosos en /productos/buscar.
export function filtrarProductos(
  catalogo: Productos,
  criterios: CriteriosBusquedaProducto,
): Productos {
  return catalogo.filter((producto) => coincideProducto(producto, criterios));
}

function variedadCoincide(producto: Producto, variedad: string): boolean {
  if (producto.tipo === "cafe") {
    return producto.variedad.nombre === variedad;
  }
  return producto.variedad === variedad;
}

function coincideProducto(
  producto: Producto,
  criterios: CriteriosBusquedaProducto,
): boolean {
  if (criterios.tipo !== undefined && producto.tipo !== criterios.tipo) {
    return false;
  }
  if (criterios.variedad !== undefined && !variedadCoincide(producto, criterios.variedad)) {
    return false;
  }
  if (criterios.tipoCafe !== undefined) {
    if (producto.tipo !== "cafe" || producto.tipoCafe !== criterios.tipoCafe) {
      return false;
    }
  }
  if (criterios.tamaño !== undefined) {
    if (producto.tipo !== "cafe" || producto.tamaño !== criterios.tamaño) {
      return false;
    }
  }
  return true;
}
