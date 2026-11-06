import type { ItemCarrito as ItemCarritoDatos } from "../../context/carrito.reducer";
import { formatoPrecio } from "../../utils/formatoPrecio";
import { calcularSubtotalItem } from "../../utils/subtotalCarrito";
import { useCarrito } from "../../hooks/useCarrito";

type ItemCarritoProps = {
    item: ItemCarritoDatos;
};

export function ItemCarrito({ item }: ItemCarritoProps) {
    const { nombre, cantidad } = item;
    const { agregarProducto, restarProducto } = useCarrito();
    const subtotal = calcularSubtotalItem(item);

    function sumarUnidad() {
        agregarProducto({
            id: item.productoId,
            nombre: item.nombre,
            precio: item.precio,
        });
    }

    function restarUnidad() {
        restarProducto({
            id: item.productoId,
            nombre: item.nombre,
            precio: item.precio,
        });
    }

    return (
        <>
            <p>{nombre}</p>
            <p>Cantidad: {cantidad}</p>
            <button type="button" aria-label={`Sumar ${item.nombre}`} onClick={sumarUnidad}>+</button>
            <button type="button" aria-label={`Restar ${item.nombre}`} onClick={restarUnidad}>-</button>
            <p>Subtotal ítem: {formatoPrecio(subtotal)}</p>
        </>
    );
}
