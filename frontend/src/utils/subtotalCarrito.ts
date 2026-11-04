import type { ItemCarrito } from "../context/carrito.reducer";

export function calcularSubtotal(item: ItemCarrito): number {
    return item.precio * item.cantidad;
}
