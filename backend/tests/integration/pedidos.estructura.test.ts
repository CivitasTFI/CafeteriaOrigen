import request from "supertest";
import app from "../../src/app";
import { reiniciarPedidos } from "../../src/data/pedidos";

describe("Estructura de los pedidos", () => {
    beforeEach(() => {
        reiniciarPedidos();
    });

    it.each([
        {
            caso: "un ítem nulo",
            cuerpo: { items: [null], estado: "pendiente" },
            errorEsperado: "Cada ítem del pedido debe ser un objeto"
        },
        {
            caso: "items como objeto en lugar de un arreglo",
            cuerpo: {
                items: { productoId: 1, cantidad: 1 },
                estado: "pendiente"
            },
            errorEsperado: "Los items del pedido deben ser un arreglo"
        },
        {
            caso: "una solicitud sin cuerpo",
            cuerpo: undefined,
            errorEsperado: "El cuerpo del pedido debe ser un objeto"
        }
    ])("POST /pedidos rechaza $caso con un error claro y conserva los datos", async ({ cuerpo, errorEsperado }) => {
        const pedidoValido = await request(app)
            .post("/pedidos")
            .send({
                items: [{ productoId: 1, cantidad: 1 }],
                estado: "pendiente"
            })
            .expect(201);

        const solicitud = request(app).post("/pedidos");

        if (cuerpo !== undefined) {
            solicitud.send(cuerpo);
        }

        const respuesta = await solicitud;
        const pedidos = await request(app).get("/pedidos").expect(200);
        const facturacion = await request(app).get("/reportes/facturacion").expect(200);

        expect({
            estadoHTTP: respuesta.status,
            respuesta: respuesta.body,
            pedidos: pedidos.body,
            facturacion: facturacion.body
        }).toEqual({
            estadoHTTP: 400,
            respuesta: { error: errorEsperado },
            pedidos: [pedidoValido.body.pedido],
            facturacion: { facturacion: 5020 }
        });
    });
});
