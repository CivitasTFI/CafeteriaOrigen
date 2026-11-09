
import { useState, type FormEvent } from "react";
import { usePedido } from "../../hooks/usePedido";
import type { Pedido } from "../../api/esquemas/pedidos";
import IndicadorCarga from "../comunes/IndicadorCarga";
import MensajeError from "../comunes/MensajeError";

type EstadoSeguimiento =
    | { estado: "inicial" }
    | { estado: "cargando" }
    | { estado: "listo"; pedido: Pedido }
    | { estado: "error"; mensaje: string };

export default function SeguimientoPedido() {
    const { consultarEstadoPedido } = usePedido();

    const [id, setId] = useState("");
    const [estado, setEstado] = useState<EstadoSeguimiento>({
        estado: "inicial",
    });

    async function consultar(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const pedidoId = Number(id);

        if (!Number.isInteger(pedidoId) || pedidoId <= 0) {
            setEstado({
                estado: "error",
                mensaje: "Ingresá un ID válido",
            });
            return;
        }

        setEstado({ estado: "cargando" });

        try {
            const pedido = await consultarEstadoPedido(pedidoId);

            setEstado({
                estado: "listo",
                pedido,
            });
        } catch (error) {
            setEstado({
                estado: "error",
                mensaje: error instanceof Error
                    ? error.message
                    : "No se pudo consultar el pedido",
            });
        }
    }

    return (
        <section>
            <h2>Seguimiento de pedido</h2>

            <form onSubmit={(event) => void consultar(event)}>
                <label htmlFor="id-pedido">
                    ID del pedido
                </label>

                <input
                    id="id-pedido"
                    type="number"
                    min="1"
                    step="1"
                    required
                    value={id}
                    disabled={estado.estado === "cargando"}
                    onChange={(event) => setId(event.target.value)}
                />

                <button
                    type="submit"
                    disabled={estado.estado === "cargando"}
                >
                    Consultar estado
                </button>
            </form>

            {estado.estado === "cargando" && (
                <IndicadorCarga mensaje="Consultando pedido..." />
            )}

            {estado.estado === "error" && (
                <MensajeError mensaje={estado.mensaje} />
            )}

            {estado.estado === "listo" && (
                <div>
                    <p>Pedido: {estado.pedido.id}</p>
                    <p>Estado: {estado.pedido.estado}</p>
                </div>
            )}
        </section>
    );
}
