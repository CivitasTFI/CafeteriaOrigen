import { useCarrito } from "../../hooks/useCarrito";
import { ItemCarrito } from "./ItemCarrito";

function CarritoVacio() {
    return <p>Tu carrito está vacio</p>;
}

export default function Carrito() {
    const { items } = useCarrito();

    if (items.length === 0) {
        return <CarritoVacio />;
    }

    return <ItemCarrito item={items[0]} />;
}