import type { ItemCarrito as ItemCarritoDatos } from "../../context/carrito.reducer";
import { formatoPrecio } from "../../utils/formatoPrecio";
import { calcularSubtotalItem } from "../../utils/subtotalCarrito";

type ItemCarritoProps = {
    item: ItemCarritoDatos;
};

export function ItemCarrito({ item }: ItemCarritoProps) {
    const { nombre, cantidad } = item;
    const subtotal = calcularSubtotalItem(item);

    return (
        <>
            <p>{nombre}</p>
            <p>Cantidad: {cantidad}</p>
            <p>Subtotal: {formatoPrecio(subtotal)}</p>
        </>
    );
}
