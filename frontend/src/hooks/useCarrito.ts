import { useContext } from "react";
import { CarritoContext } from "../context/carrito.context";

export function useCarrito() {
    const contexto = useContext(CarritoContext);
    if (contexto === null) {
        throw new Error(
            "useCarrito debe ser usado dentro de un CarritoProvider"
        );
    }
    return contexto;
}
