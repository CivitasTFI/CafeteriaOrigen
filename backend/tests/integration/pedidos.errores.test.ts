import request from "supertest";
import app from "../../src/app";
import { reiniciarPedidos } from "../../src/data/pedidos";
import * as pedidosService from "../../src/services/pedidos.service";

describe("Clasificación de errores al crear pedidos", () => {
    beforeEach(() => {
        reiniciarPedidos();
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it("POST /pedidos responde 413 cuando el cuerpo supera el tamaño permitido", async () => {
        const items = Array.from({ length: 4000 }, () => ({
            productoId: 1,
            cantidad: 1
        }));

        const respuesta = await request(app)
            .post("/pedidos")
            .send({ items, estado: "pendiente" });

        expect({
            estadoHTTP: respuesta.status,
            respuesta: respuesta.body
        }).toEqual({
            estadoHTTP: 413,
            respuesta: { error: "El cuerpo de la solicitud supera el tamaño permitido" }
        });
    });

    it("POST /pedidos responde 500 con un mensaje genérico ante un fallo interno", async () => {
        const crearPedido = jest.spyOn(pedidosService, "crearPedido")
            .mockImplementationOnce(() => {
                throw new Error("Fallo interno simulado");
            });

        const respuesta = await request(app)
            .post("/pedidos")
            .send({
                items: [{ productoId: 1, cantidad: 1 }],
                estado: "pendiente"
            });

        expect(crearPedido).toHaveBeenCalledTimes(1);
        expect({
            estadoHTTP: respuesta.status,
            respuesta: respuesta.body
        }).toEqual({
            estadoHTTP: 500,
            respuesta: { error: "Error interno del servidor" }
        });
    });
});
