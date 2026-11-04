import type { ItemCarrito } from "../context/carrito.reducer";

export function calcularSubtotalItem(item: ItemCarrito): number {
    return item.precio * item.cantidad;
}
