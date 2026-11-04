import { solicitarValidado } from "./cliente";
import { esquemaProductosBase, type ProductosBase } from "./esquemas/productos";

export async function listarProductos(): Promise<ProductosBase> {
  return solicitarValidado("/productos", esquemaProductosBase);
}
