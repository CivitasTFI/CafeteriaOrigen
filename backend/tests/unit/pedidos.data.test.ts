import {
    guardarPedidos,
    obtenerPedidos,
    reiniciarPedidos
} from "../../src/data/pedidos";

describe("Repositorio de pedidos", () => {
    it("reinicia los pedidos y el contador de IDs", () => {
        guardarPedidos(
            [{ productoId: 1, cantidad: 1 }],
            "pendiente"
        );

        reiniciarPedidos();

        expect(obtenerPedidos()).toHaveLength(0);

        const nuevoPedido = guardarPedidos(
            [{ productoId: 1, cantidad: 1 }],
            "pendiente"
        );

        expect(nuevoPedido.id).toBe(1);
    });
});