import type { ItemCarrito as ItemCarritoDatos } from "../../context/carrito.reducer";

type ItemCarritoProps = {
    item: ItemCarritoDatos;
};

export function ItemCarrito({ item }: ItemCarritoProps) {
    return <p>{item.nombre}</p>;
}