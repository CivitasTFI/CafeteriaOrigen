import { useCarrito } from "../../hooks/useCarrito";
import { usePedido } from "../../hooks/usePedido";

interface ConfirmarPedidoProps {
    mesaId?: number;
}

export default function ConfirmarPedido({ mesaId }: ConfirmarPedidoProps){
    const { items } = useCarrito();
    const { enviarPedido } = usePedido();

    async function confirmarPedido(){
        const itemsPedido = items.map(({ productoId, cantidad}) => ({
            productoId,
            cantidad,
        }));

        await enviarPedido(itemsPedido, mesaId);
    }

    return(
        <button onClick={() => void confirmarPedido()}>
            Confirmar pedido
        </button>
    );
}