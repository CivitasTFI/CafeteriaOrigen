import { useReducer, type ReactNode } from "react";
import { carritoReducer } from "./carrito.reducer";
import { CarritoContext, type CarritoContextValue } from "./carrito.context";
import type { ProductoBase } from "../api/esquemas/productos";

interface CarritoProviderProps {
  children: ReactNode;
}

export function CarritoProvider( props: CarritoProviderProps ) {

    const [items, dispatch] = useReducer(carritoReducer, []);

    function agregarProducto(producto: ProductoBase) {
        dispatch({ type: "AGREGAR", producto });
    }
    function restarProducto(producto: ProductoBase) {
        dispatch({ type: "RESTAR", producto });
    }
    function eliminarProducto(producto: ProductoBase) {
        dispatch({ type: "ELIMINAR", producto });
    }
    function vaciarCarrito() {
        dispatch({ type: "VACIAR" });
    }
    const value: CarritoContextValue = { items, agregarProducto, restarProducto, eliminarProducto, vaciarCarrito };
    return (
    <CarritoContext.Provider value={value}>
      {props.children}
    </CarritoContext.Provider>
  );
}
