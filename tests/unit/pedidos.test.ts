import {
    crearPedido,
    listarPedidos,
    buscarPedidoPorId
} from "../../src/services/pedidos.service";
import { reiniciarPedidos } from "../../src/data/pedidos";

describe("Servicio de pedidos", () => {
    beforeEach(() => {
        reiniciarPedidos();
    });

    it("crea un pedido válido con su total calculado", () => {
        const pedido = crearPedido(
            [
                {
                    productoId: 1,
                    cantidad: 2
                }
            ],
            "pendiente"
        );

        expect(pedido).toEqual({
            id: 1,
            items: [
                {
                    productoId: 1,
                    cantidad: 2
                }
            ],
            estado: "pendiente",
            total: 10040
        });
    });

    it("lista los pedidos guardados", () => {
        crearPedido(
            [
                {
                    productoId: 1,
                    cantidad: 1
                }
            ],
            "pendiente"
        );

        crearPedido(
            [
                {
                    productoId: 2,
                    cantidad: 1
                }
            ],
            "pendiente"
        );

        const pedidos = listarPedidos();

        expect(pedidos).toHaveLength(2);
        expect(pedidos[0].id).toBe(1);
        expect(pedidos[1].id).toBe(2);
    });

    it("busca un pedido por su ID", () => {
        const pedidoCreado = crearPedido(
            [
                {
                    productoId: 1,
                    cantidad: 1
                }
            ],
            "pendiente"
        );

        const pedidoEncontrado = buscarPedidoPorId(pedidoCreado.id);

        expect(pedidoEncontrado).toBeDefined();
        expect(pedidoEncontrado?.id).toBe(1);
        expect(pedidoEncontrado?.estado).toBe("pendiente");
    });
});