import { useCarrito } from "../../hooks/useCarrito";
import { ItemCarrito } from "./ItemCarrito";
import type { ItemCarrito as ItemCarritoDatos } from "../../context/carrito.reducer";
import { calcularSubtotalCarrito } from "../../utils/subtotalCarrito";
import { formatoPrecio } from "../../utils/formatoPrecio";

type ListaItemsCarritoProps = {
    items: ItemCarritoDatos[];
};

function ListaItemsCarrito({ items }: ListaItemsCarritoProps) {
    return (
        <>
            {items.map((item) => (
                <ItemCarrito key={item.productoId} item={item} />
            ))}
        </>
    );
}

function CarritoVacio() {
    return <p>Tu carrito está vacio</p>;
}

export default function Carrito() {
    const { items } = useCarrito();

    if (items.length === 0) {
        return <CarritoVacio />;
    }

    const subtotal = calcularSubtotalCarrito(items);

    return (
        <>
            <ListaItemsCarrito items={items} />
            <p>Subtotal: {formatoPrecio(subtotal)}</p>
        </>
    );
}