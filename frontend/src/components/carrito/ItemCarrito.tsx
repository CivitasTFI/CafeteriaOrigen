import type { ItemCarrito as ItemCarritoDatos } from "../../context/carrito.reducer";
import { formatoPrecio } from "../../utils/formatoPrecio";

type ItemCarritoProps = {
    item: ItemCarritoDatos;
};

export function ItemCarrito({ item }: ItemCarritoProps) {
    const { nombre, cantidad } = item;
    return (
        <>
            <p>{nombre}</p>
            <p>Cantidad: {cantidad}</p>
            <p>Subtotal: {formatoPrecio(item.precio * cantidad)}</p>
        </>
    );
}
