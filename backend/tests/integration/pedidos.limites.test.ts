import request from "supertest";
import app from "../../src/app";
import { reiniciarPedidos } from "../../src/data/pedidos";

describe("Límites numéricos de los pedidos", () => {
    beforeEach(() => {
        reiniciarPedidos();
    });

    it.each([
        {
            caso: "una cantidad que produce un total infinito",
            items: [{ productoId: 1, cantidad: 1e308 }]
        },
        {
            caso: "una cantidad fuera del rango de enteros seguros",
            items: [{ productoId: 1, cantidad: Number.MAX_SAFE_INTEGER + 1 }]
        },
        {
            caso: "una cantidad segura cuyo subtotal supera el rango seguro",
            items: [{
                productoId: 1,
                cantidad: Math.floor(Number.MAX_SAFE_INTEGER / 5020) + 1
            }]
        },
        {
            caso: "subtotales seguros cuya suma supera el rango seguro",
            items: [
                {
                    productoId: 1,
                    cantidad: Math.floor(Number.MAX_SAFE_INTEGER / 5020)
                },
                { productoId: 19, cantidad: 2 }
            ]
        }
    ])("POST /pedidos rechaza $caso sin alterar pedidos ni facturación", async ({ items }) => {
        const pedidoValido = await request(app)
            .post("/pedidos")
            .send({
                items: [{ productoId: 1, cantidad: 1 }],
                estado: "pendiente"
            })
            .expect(201);

        const respuesta = await request(app)
            .post("/pedidos")
            .send({ items, estado: "pendiente" });

        const pedidos = await request(app).get("/pedidos").expect(200);
        const facturacion = await request(app).get("/reportes/facturacion").expect(200);

        expect({
            estadoHTTP: respuesta.status,
            respuesta: respuesta.body,
            pedidos: pedidos.body,
            facturacion: facturacion.body
        }).toEqual({
            estadoHTTP: 400,
            respuesta: { error: expect.stringMatching(/\S/) },
            pedidos: [pedidoValido.body.pedido],
            facturacion: { facturacion: 5020 }
        });
    });
});
