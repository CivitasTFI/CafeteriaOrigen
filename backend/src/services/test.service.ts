import { reiniciarPedidos } from "../data/pedidos";
import { crearPedido } from "./pedidos.service";

export const cargarDatosIniciales = () => {
    reiniciarPedidos ();

    crearPedido(
            [{
                productoId:3,
                cantidad: 1
            }],
            undefined,
            1
        );

        crearPedido(
            [
                {
                    productoId:2,
                    cantidad:4
                },
                {
                    productoId:19,
                    cantidad:4
                }
            ],
            undefined,
            2
        );

        crearPedido(
            [{
                productoId:5,
                cantidad:2
            }],
            undefined,
            3
        );

        crearPedido(
            [
                {
                    productoId: 8,
                    cantidad: 2
                },
                {
                    productoId: 20,
                    cantidad: 2
                }
            ],
            undefined,
            4
        );

        crearPedido(
            [
                {
                    productoId: 18,
                    cantidad: 1
                },
                {
                    productoId: 19,
                    cantidad: 1
                }
            ],
            undefined,
            5
        );

        crearPedido(
            [
                {
                    productoId: 13,
                    cantidad:2
                },
                {
                    productoId:16,
                    cantidad: 2
                },
                {
                    productoId: 20,
                    cantidad: 1
                },
                {
                    productoId: 19,
                    cantidad:3
                }
            ],
            undefined,
            6
        );

        crearPedido(
            [
                {
                    productoId: 5,
                    cantidad: 1
                },
                {
                    productoId: 2,
                    cantidad: 1
                },
                {
                    productoId: 13,
                    cantidad:1
                },
                {
                    productoId:19,
                    cantidad: 3
                }
            ],
            undefined,
            7
        );

        crearPedido(
            [
                {
                    productoId: 14,
                    cantidad: 2
                },
                {
                    productoId:9,
                    cantidad:1
                },
                {
                    productoId: 20,
                    cantidad: 1
                },
                {
                    productoId:19,
                    cantidad:1
                }
            ],
            undefined,
            8
        );
}