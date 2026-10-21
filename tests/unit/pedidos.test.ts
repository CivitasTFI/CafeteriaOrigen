import {
    crearPedido
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
});