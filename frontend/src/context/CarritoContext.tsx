import { createContext, useReducer, type ReactNode } from "react";
import { carritoReducer, type ItemCarrito } from "./carrito.reducer";
import type { Producto } from "../api/esquemas/productos";

interface CarritoContextValue {
  items: ItemCarrito[];
  agregarProducto: (producto: Producto) => void;
  restarProducto: (producto: Producto) => void;
  eliminarProducto: (producto: Producto) => void;
}

interface CarritoProviderProps {
  children: ReactNode;
}

export const CarritoContext = createContext<CarritoContextValue | null>(null);

export function CarritoProvider( props: CarritoProviderProps ) {

    const [items, dispatch] = useReducer(carritoReducer, []);

    function agregarProducto(producto: Producto) {
        dispatch({ type: "AGREGAR", producto });
    }
    function restarProducto(producto: Producto) {
        dispatch({ type: "RESTAR", producto });
    }
    function eliminarProducto(producto: Producto) {
        dispatch({ type: "ELIMINAR", producto });
    }
    const value: CarritoContextValue = { items, agregarProducto, restarProducto, eliminarProducto };
    return (
    <CarritoContext.Provider value={value}>
      {props.children}
    </CarritoContext.Provider>
  );
}