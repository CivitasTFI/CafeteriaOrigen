import { Producto } from "../api/esquemas/productos";

type AccionCarrito = { type: "AGREGAR"; producto: Producto };

type ItemCarrito = {
    productoId: number;
    nombre: string;
    precio: number;
    cantidad: number;
}; 
/**
 * Reducer para gestionar el carrito de compras.
 * 
 * Recibe el estado actual del carrito y una acción (contiene el tipo de accion y el producto)
 * Devuelve el nuevo estado del carrito después de aplicar la acción.
 * 
 * @param estadoCarrito 
 * @param accion 
 */
export function carritoReducer(estadoCarrito: ItemCarrito[], accion: AccionCarrito): ItemCarrito[] {
    if (accion.type === "AGREGAR") {
        const nuevoItem: ItemCarrito = {
            productoId: accion.producto.id,
            nombre: accion.producto.nombre,
            precio: accion.producto.precio,
            cantidad: 1,
        };
        return [...estadoCarrito, nuevoItem];
    }
    return estadoCarrito;
}
