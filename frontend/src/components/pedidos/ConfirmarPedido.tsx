import { useState } from "react";
import { useCarrito } from "../../hooks/useCarrito";
import { usePedido } from "../../hooks/usePedido";

interface ConfirmarPedidoProps {
    mesaId?: number;
}

export default function ConfirmarPedido({ mesaId }: ConfirmarPedidoProps) {
    const { items } = useCarrito();
    const { enviarPedido } = usePedido();

    const [enviando, setEnviando] = useState(false);

    async function confirmarPedido() {
        if (enviando) return;

        setEnviando(true);

        const itemsPedido = items.map(({ productoId, cantidad }) => ({
            productoId,
            cantidad,
        }));

        try {
            await enviarPedido(itemsPedido, mesaId);
        } finally {
            setEnviando(false);
        }
    }

    return (
        <button
            disabled={enviando}
            onClick={() => void confirmarPedido()}
        >
            {enviando
                ? "Enviando pedido..."
                : "Confirmar pedido"}
        </button>
    );
}