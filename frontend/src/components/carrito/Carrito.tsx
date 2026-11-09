import { useCarrito } from "../../hooks/useCarrito";
import { ItemCarrito } from "./ItemCarrito";
import type { ItemCarrito as ItemCarritoDatos } from "../../context/carrito.reducer";
import { calcularSubtotalCarrito } from "../../utils/subtotalCarrito";
import { formatoPrecio } from "../../utils/formatoPrecio";
import ConfirmarPedido from "../pedidos/ConfirmarPedido";

type CarritoProps = {
    mesaId?: number;
    onCambiarEnvio?: (enviando: boolean) => void;
};

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

export default function Carrito({ mesaId, onCambiarEnvio }: CarritoProps) {
    const { items } = useCarrito();
    const estaVacio = items.length === 0;

    return (
        <>
            {estaVacio ? <CarritoVacio /> : (
                <>
                    <ListaItemsCarrito items={items} />
                    <p>Subtotal orientativo: {formatoPrecio(calcularSubtotalCarrito(items))}</p>
                </>
            )}
            <ConfirmarPedido mesaId={mesaId} onCambiarEnvio={onCambiarEnvio} />
        </>
    );
}
