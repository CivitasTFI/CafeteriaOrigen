import { useState } from "react";
import { useCarrito } from "../../hooks/useCarrito";
import { usePedido } from "../../hooks/usePedido";
import ConfirmacionPedido from "./ConfirmacionPedido";
import type { Pedido } from "../../api/esquemas/pedidos";

interface ConfirmarPedidoProps {
    mesaId?: number;
}

export default function ConfirmarPedido({ mesaId }: ConfirmarPedidoProps) {
    const { items } = useCarrito();
    const { enviarPedido } = usePedido();

    const [enviando, setEnviando] = useState(false);

    const [pedidoCreado, setPedidoCreado] = useState<Pedido | null>(null);

    async function confirmarPedido() {
        if (enviando) return;

        setEnviando(true);

        const itemsPedido = items.map(({ productoId, cantidad }) => ({
            productoId,
            cantidad,
        }));

        try {
            const respuesta = await enviarPedido(itemsPedido, mesaId);
            setPedidoCreado(respuesta.pedido);
        } finally {
            setEnviando(false);
        }
    }

    return (
        <>
            <button
            disabled={enviando}
            onClick={() => void confirmarPedido()}
        >
            {enviando
                ? "Enviando pedido..."
                : "Confirmar pedido"}
        
        </button>
        {pedidoCreado && (
            <ConfirmacionPedido pedido={pedidoCreado} />
        )}
        </>
    );
}