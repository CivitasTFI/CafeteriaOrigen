import type { ItemCarrito } from "../context/carrito.reducer";

export function calcularSubtotalItem(item: ItemCarrito): number {
    return item.precio * item.cantidad;
}

export function calcularSubtotalCarrito(items: ItemCarrito[]): number {
    return items.reduce((subtotal, item) => subtotal + calcularSubtotalItem(item), 0);
}