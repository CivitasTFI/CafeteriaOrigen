import type { ItemCarrito as ItemCarritoDatos } from "../../context/carrito.reducer";
import { formatoPrecio } from "../../utils/formatoPrecio";
import { calcularSubtotalItem } from "../../utils/subtotalCarrito";
import { useCarrito } from "../../hooks/useCarrito";

type ItemCarritoProps = {
    item: ItemCarritoDatos;
};

export function ItemCarrito({ item }: ItemCarritoProps) {
    const { nombre, cantidad } = item;
    const { agregarProducto } = useCarrito();
    const subtotal = calcularSubtotalItem(item);

    return (
        <>
            <p>{nombre}</p>
            <p>Cantidad: {cantidad}</p>
            <button type="button" aria-label={`Sumar ${item.nombre}`} onClick={() => agregarProducto({ id: item.productoId, nombre: item.nombre, precio: item.precio })}>+</button>
            <p>Subtotal ítem: {formatoPrecio(subtotal)}</p>
        </>
    );
}
