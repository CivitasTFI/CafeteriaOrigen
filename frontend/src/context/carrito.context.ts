import { createContext } from "react";
import type { ProductoBase } from "../api/esquemas/productos";
import type { ItemCarrito } from "./carrito.reducer";

export interface CarritoContextValue {
  items: ItemCarrito[];
  agregarProducto: (producto: ProductoBase) => void;
  restarProducto: (producto: ProductoBase) => void;
  eliminarProducto: (producto: ProductoBase) => void;
  vaciarCarrito: () => void;
}

export const CarritoContext = createContext<CarritoContextValue | null>(null);
