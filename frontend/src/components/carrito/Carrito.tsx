import { useCarrito } from "../../hooks/useCarrito";

function CarritoVacio() {
    return <p>Tu carrito está vacio</p>;
}

export default function Carrito() {
    const { items } = useCarrito();

    if (items.length === 0) {
        return <CarritoVacio />;
    }

    return <p>{items[0].nombre}</p>;
}