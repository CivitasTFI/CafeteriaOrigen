import { useRef, useState } from "react";
import { useCarrito } from "../../hooks/useCarrito";
import { usePedido } from "../../hooks/usePedido";
import ConfirmacionPedido from "./ConfirmacionPedido";
import type { Pedido } from "../../api/esquemas/pedidos";

interface ConfirmarPedidoProps {
  mesaId?: number;
}

export default function ConfirmarPedido({ mesaId }: ConfirmarPedidoProps) {
  const { items, vaciarCarrito } = useCarrito();
  const { enviarPedido } = usePedido();
  const solicitudEnCurso = useRef(false);
  const [enviando, setEnviando] = useState(false);
  const [pedidoCreado, setPedidoCreado] = useState<Pedido | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function confirmarPedido() {
    if (solicitudEnCurso.current || items.length === 0) return;
    solicitudEnCurso.current = true;
    setEnviando(true);
    setError(null);
    setPedidoCreado(null);
    const itemsPedido = items.map(({ productoId, cantidad }) => ({ productoId, cantidad }));

    try {
      const respuesta = await enviarPedido(itemsPedido, mesaId);
      setPedidoCreado(respuesta.pedido);
      vaciarCarrito();
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "No se pudo confirmar el pedido");
    } finally {
      solicitudEnCurso.current = false;
      setEnviando(false);
    }
  }

  return (
    <>
      <button
        type="button"
        className="btn btn-primary"
        disabled={enviando || items.length === 0}
        aria-busy={enviando}
        onClick={() => void confirmarPedido()}
      >
        {enviando ? "Enviando pedido..." : "Confirmar pedido"}
      </button>
      {error !== null && <p className="text-danger mt-3" role="alert">{error}</p>}
      {pedidoCreado !== null && <ConfirmacionPedido pedido={pedidoCreado} />}
    </>
  );
}
