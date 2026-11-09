import type { Pedido } from "../../api/esquemas/pedidos";

interface ConfirmacionPedidoProps {
    pedido: Pedido;
}

export default function ConfirmacionPedido({
    pedido,
}: ConfirmacionPedidoProps) {
    return (
        <div>
            <p>id:{pedido.id}</p>
            <p>estado:{pedido.estado}</p>
            <p>total:{pedido.total}</p>
        </div>
    );
}