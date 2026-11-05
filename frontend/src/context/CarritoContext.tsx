import { useReducer, type ReactNode } from "react";
import { carritoReducer } from "./carrito.reducer";
import { CarritoContext, type CarritoContextValue } from "./carrito.context";
import type { Producto } from "../api/esquemas/productos";

interface CarritoProviderProps {
  children: ReactNode;
}

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
