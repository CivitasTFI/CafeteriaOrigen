import request from "supertest";
import app from "../../src/app";
import { pedidos } from "../../src/data/pedidos";

describe("Integración entre pedidos y reportes", () => {
    beforeEach(() => {
        pedidos.length = 0;
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