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

    return (
    <>
        {items.map((item) => (
            <ItemCarrito key={item.productoId} item={item} />
        ))}
    </>
    );
}