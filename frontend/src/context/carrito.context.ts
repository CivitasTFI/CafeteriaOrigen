import { createContext } from "react";
import type { Producto } from "../api/esquemas/productos";
import type { ItemCarrito } from "./carrito.reducer";

export interface CarritoContextValue {
  items: ItemCarrito[];
  agregarProducto: (producto: Producto) => void;
  restarProducto: (producto: Producto) => void;
  eliminarProducto: (producto: Producto) => void;
}

export const CarritoContext = createContext<CarritoContextValue | null>(null);
