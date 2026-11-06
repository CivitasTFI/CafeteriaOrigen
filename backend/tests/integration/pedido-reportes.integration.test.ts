import request from "supertest";
import app from "../../src/app";
import { reiniciarPedidos } from "../../src/data/pedidos";

describe("Integración entre pedidos y reportes", () => {
    beforeEach(() => {
        reiniciarPedidos();
    });

    it("actualiza la facturación al crear un pedido", async () => {
        const creacion = await request(app)
            .post("/pedidos")
            .send({
                items: [
                    {
                        productoId: 1,
                        cantidad: 2
                    }
                ],
                estado: "pendiente"
            });

        expect(creacion.status).toBe(201);

        const reporte = await request(app)
            .get("/reportes/facturacion");

        expect(reporte.status).toBe(200);
        expect(reporte.body).toEqual({
            facturacion: 10040
        });
    });

    it("responde 400 si la facturación acumulada supera el rango seguro tras crear pedidos válidos", async () => {
        for (let numeroPedido = 0; numeroPedido < 6; numeroPedido++) {
            const creacion = await request(app)
                .post("/pedidos")
                .send({
                    items: [{ productoId: 1, cantidad: 1_794_262_799_749 }]
                });

            expect(creacion.status).toBe(201);
            expect(creacion.body.pedido.total).toBe(9_007_199_254_739_980);
        }

        const reporte = await request(app)
            .get("/reportes/facturacion");

        expect(reporte.status).toBe(400);
        expect(reporte.body).toEqual({
            error: "La facturación total supera el rango de enteros seguros"
        });
    });

    it("actualiza el producto más vendido al crear un pedido", async () => {
    const creacion = await request(app)
        .post("/pedidos")
        .send({
            items: [
                {
                    productoId: 1,
                    cantidad: 3
                },
                {
                    productoId: 2,
                    cantidad: 1
                }
            ],
            estado: "pendiente"
        });

    expect(creacion.status).toBe(201);

    const reporte = await request(app)
        .get("/reportes/mas-vendido");

    expect(reporte.status).toBe(200);
    expect(reporte.body).toEqual({
        productosMasVendidos: ["Expreso Pocillo Brasil"]
        });
    });
});
