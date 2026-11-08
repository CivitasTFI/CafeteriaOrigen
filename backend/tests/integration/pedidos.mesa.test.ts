import request from "supertest";
import app from "../../src/app";
import { reiniciarPedidos } from "../../src/data/pedidos";

describe("Mesas de los pedidos", () => {
    beforeEach(() => {
        reiniciarPedidos();
    });

    it.each([1, 4, 8])(
        "POST /pedidos conserva la mesa %i en la creación, el listado y la consulta por ID",
        async (mesaId) => {
            const items = [
                { productoId: 5, cantidad: 2 },
                { productoId: 19, cantidad: 1 }
            ];

            const creacion = await request(app)
                .post("/pedidos")
                .send({ mesaId, items })
                .expect(201);

            const consulta = await request(app)
                .get(`/pedidos/${creacion.body.pedido.id}`)
                .expect(200);

            const listado = await request(app).get("/pedidos").expect(200);
            const pedidoEsperado = {
                id: 1,
                items,
                estado: "pendiente",
                mesaId,
                total: 17220
            };

            expect({
                creacion: creacion.body,
                consulta: consulta.body,
                listado: listado.body
            }).toEqual({
                creacion: {
                    mensaje: "El pedido se guardó correctamente",
                    pedido: pedidoEsperado
                },
                consulta: pedidoEsperado,
                listado: [pedidoEsperado]
            });
        }
    );

    it("POST /pedidos sin mesa crea un pedido para barra y conserva su estado explícito en las consultas", async () => {
        const items = [{ productoId: 19, cantidad: 1 }];

        const creacion = await request(app)
            .post("/pedidos")
            .send({ items, estado: "completado" })
            .expect(201);

        const consulta = await request(app)
            .get(`/pedidos/${creacion.body.pedido.id}`)
            .expect(200);

        const listado = await request(app).get("/pedidos").expect(200);
        const pedidoEsperado = {
            id: 1,
            items,
            estado: "completado",
            total: 2500
        };

        expect({
            creacion: creacion.body,
            consulta: consulta.body,
            listado: listado.body
        }).toEqual({
            creacion: {
                mensaje: "El pedido se guardó correctamente",
                pedido: pedidoEsperado
            },
            consulta: pedidoEsperado,
            listado: [pedidoEsperado]
        });
    });

    it.each([
        { caso: "una mesa inexistente", mesaId: 9, errorEsperado: "Mesa inexistente" },
        { caso: "una mesa cero", mesaId: 0, errorEsperado: "Debe ingresar un número válido" },
        { caso: "una mesa negativa", mesaId: -1, errorEsperado: "Debe ingresar un número válido" },
        { caso: "una mesa decimal", mesaId: 4.5, errorEsperado: "Debe ingresar un número válido" },
        { caso: "una mesa textual", mesaId: "4", errorEsperado: "Debe ingresar un número válido" },
        { caso: "una mesa nula", mesaId: null, errorEsperado: "Debe ingresar un número válido" },
        { caso: "una mesa como objeto", mesaId: {}, errorEsperado: "Debe ingresar un número válido" },
        { caso: "una mesa como arreglo", mesaId: [], errorEsperado: "Debe ingresar un número válido" },
        { caso: "una mesa booleana", mesaId: true, errorEsperado: "Debe ingresar un número válido" }
    ])("POST /pedidos rechaza $caso sin alterar pedidos, facturación ni IDs", async ({ mesaId, errorEsperado }) => {
        const items = [{ productoId: 1, cantidad: 1 }];

        await request(app)
            .post("/pedidos")
            .send({ mesaId: 4, items })
            .expect(201);

        const rechazo = await request(app)
            .post("/pedidos")
            .send({ mesaId, items });

        const listado = await request(app).get("/pedidos").expect(200);
        const facturacion = await request(app).get("/reportes/facturacion").expect(200);

        const siguiente = await request(app)
            .post("/pedidos")
            .send({ items })
            .expect(201);

        expect({
            estadoHTTP: rechazo.status,
            rechazo: rechazo.body,
            listado: listado.body,
            facturacion: facturacion.body,
            siguienteId: siguiente.body.pedido.id
        }).toEqual({
            estadoHTTP: 400,
            rechazo: { error: errorEsperado },
            listado: [{
                id: 1,
                items,
                estado: "pendiente",
                mesaId: 4,
                total: 5020
            }],
            facturacion: { facturacion: 5020 },
            siguienteId: 2
        });
    });
});
