import { Producto } from "../api/esquemas/productos";

type AccionCarrito = { type: "AGREGAR"; producto: Producto } | { type: "RESTAR"; producto: Producto };

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
        const productoId = accion.producto.id;
        const nuevoItem: ItemCarrito = {
            productoId,
            nombre: accion.producto.nombre,
            precio: accion.producto.precio,
            cantidad: 1,
        };
        const itemExistente = estadoCarrito.find((item) => item.productoId === productoId);
        if (itemExistente) {
            return estadoCarrito.map((item) => item.productoId === productoId
                ? { ...item, cantidad: item.cantidad + 1 }
                : item);
        }
        return [...estadoCarrito, nuevoItem];
    }
    else if (accion.type === "RESTAR") {
        const productoId = accion.producto.id;
        const itemExistente = estadoCarrito.find((item) => item.productoId === productoId);

        if (!itemExistente || itemExistente.cantidad <= 1) {
            return estadoCarrito;
        }

        return estadoCarrito.map((item) => item.productoId === productoId
            ? { ...item, cantidad: item.cantidad - 1 }
            : item);
    }
    return estadoCarrito;
}
