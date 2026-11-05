import request from "supertest";
import app from "../../src/app";
import { reiniciarPedidos } from "../../src/data/pedidos";

describe("Validación del estado de los pedidos", () => {
    beforeEach(() => {
        reiniciarPedidos();
    });

    it.each([
        { caso: "un estado numérico", estado: 123 },
        { caso: "un estado como objeto", estado: { texto: "pendiente" } },
        { caso: "un estado vacío", estado: "" }
    ])("POST /pedidos rechaza $caso sin alterar pedidos ni facturación", async ({ estado }) => {
        const pedidoValido = await request(app)
            .post("/pedidos")
            .send({
                items: [{ productoId: 1, cantidad: 1 }],
                estado: "pendiente"
            })
            .expect(201);

        const respuesta = await request(app)
            .post("/pedidos")
            .send({
                items: [{ productoId: 1, cantidad: 1 }],
                estado
            });

        const pedidos = await request(app).get("/pedidos").expect(200);
        const facturacion = await request(app).get("/reportes/facturacion").expect(200);

        expect({
            estadoHTTP: respuesta.status,
            respuesta: respuesta.body,
            pedidos: pedidos.body,
            facturacion: facturacion.body
        }).toEqual({
            estadoHTTP: 400,
            respuesta: { error: "El estado del pedido debe ser un texto no vacío" },
            pedidos: [pedidoValido.body.pedido],
            facturacion: { facturacion: 5020 }
        });
    });
});
