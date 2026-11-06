import type { ItemCarrito as ItemCarritoDatos } from "../../context/carrito.reducer";
import { formatoPrecio } from "../../utils/formatoPrecio";
import { calcularSubtotalItem } from "../../utils/subtotalCarrito";
import { useCarrito } from "../../hooks/useCarrito";

type ItemCarritoProps = {
    item: ItemCarritoDatos;
};

export function ItemCarrito({ item }: ItemCarritoProps) {
    const { nombre, cantidad } = item;
    const { agregarProducto, restarProducto, eliminarProducto } = useCarrito();
    const subtotal = calcularSubtotalItem(item);

    const producto = {
        id: item.productoId,
        nombre: item.nombre,
        precio: item.precio,
    };

    function sumarUnidad() {
        agregarProducto(producto);
    }

    function restarUnidad() {
        restarProducto(producto);
    }

    return (
        <>
            <p>{nombre}</p>
            <p>Cantidad: {cantidad}</p>
            <button type="button" aria-label={`Sumar ${item.nombre}`} onClick={sumarUnidad}>+</button>
            <button type="button" aria-label={`Restar ${item.nombre}`} onClick={restarUnidad}>-</button>
            <button type="button" aria-label={`Eliminar ${item.nombre}`} onClick={() => eliminarProducto(producto)}>
                Eliminar
            </button>
            <p>Subtotal ítem: {formatoPrecio(subtotal)}</p>
        </>
    );
}
