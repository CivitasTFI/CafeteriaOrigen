import type { ItemCarrito as ItemCarritoDatos } from "../../context/carrito.reducer";

type ItemCarritoProps = {
    item: ItemCarritoDatos;
};

export function ItemCarrito({ item }: ItemCarritoProps) {
    const { nombre, cantidad } = item;
    return (
        <>
            <p>{nombre}</p>
            <p>Cantidad: {cantidad}</p>
        </>
    );
}
