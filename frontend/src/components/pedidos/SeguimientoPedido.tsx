import { useId, useRef, useState } from "react";
import { usePedido } from "../../hooks/usePedido";
import type { Pedido } from "../../api/esquemas/pedidos";
import IndicadorCarga from "../comunes/IndicadorCarga";
import MensajeError from "../comunes/MensajeError";

type EstadoSeguimiento =
    | { estado: "inicial" }
    | { estado: "cargando" }
    | { estado: "actualizado" }
    | { estado: "listo"; pedido: Pedido }
    | { estado: "error"; mensaje: string };

interface SeguimientoPedidoProps {
    pedidoId?: number;
    onActualizarPedido?: (pedido: Pedido) => void;
}

export default function SeguimientoPedido({ pedidoId, onActualizarPedido }: SeguimientoPedidoProps) {
    const { consultarEstadoPedido } = usePedido();
    const tituloId = useId();
    const entradaId = useId();
    const solicitudEnCurso = useRef(false);

    const [id, setId] = useState("");
    const [estado, setEstado] = useState<EstadoSeguimiento>({
        estado: "inicial",
    });
    const cargando = estado.estado === "cargando";
    const Titulo = pedidoId === undefined ? "h2" : "h3";

    async function consultar() {
        if (solicitudEnCurso.current) return;

        const idConsulta = pedidoId ?? Number(id);

        if (!Number.isSafeInteger(idConsulta) || idConsulta <= 0) {
            setEstado({
                estado: "error",
                mensaje: "Ingresá un ID válido",
            });
            return;
        }

        solicitudEnCurso.current = true;
        setEstado({ estado: "cargando" });

        try {
            const pedido = await consultarEstadoPedido(idConsulta);
            if (onActualizarPedido !== undefined) {
                onActualizarPedido(pedido);
                setEstado({ estado: "actualizado" });
            } else {
                setEstado({ estado: "listo", pedido });
            }
        } catch (error) {
            setEstado({
                estado: "error",
                mensaje: error instanceof Error
                    ? error.message
                    : "No se pudo consultar el pedido",
            });
        } finally {
            solicitudEnCurso.current = false;
        }
    }

    return (
        <section className="mt-3" aria-labelledby={tituloId}>
            <Titulo id={tituloId} className="h5">Seguimiento de pedido</Titulo>

            <form
                className="d-flex flex-column gap-2"
                onSubmit={(event) => {
                    event.preventDefault();
                    void consultar();
                }}
            >
                {pedidoId === undefined && (
                    <>
                        <label htmlFor={entradaId}>ID del pedido</label>
                        <input
                            id={entradaId}
                            className="form-control"
                            type="number"
                            min="1"
                            step="1"
                            required
                            value={id}
                            disabled={cargando}
                            onChange={(event) => setId(event.target.value)}
                        />
                    </>
                )}

                <button
                    type="submit"
                    className="btn btn-outline-primary"
                    aria-busy={cargando}
                    disabled={cargando}
                >
                    Consultar estado
                </button>
            </form>

            {cargando && (
                <IndicadorCarga mensaje="Consultando pedido..." />
            )}

            {estado.estado === "error" && (
                <MensajeError mensaje={estado.mensaje} />
            )}

            {estado.estado === "listo" && (
                <div aria-live="polite">
                    <p>Pedido: {estado.pedido.id}</p>
                    <p>{pedidoId === undefined ? "Estado" : "Estado actual"}: {estado.pedido.estado}</p>
                </div>
            )}
        </section>
    );
}
