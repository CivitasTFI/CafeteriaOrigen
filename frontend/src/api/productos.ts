import { solicitarValidado } from "./cliente";
import { esquemaProductos, type Productos } from "./esquemas/productos";

export async function listarProductos(): Promise<Productos> {
  return solicitarValidado("/productos", esquemaProductos);
}
