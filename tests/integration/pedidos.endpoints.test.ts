import request from "supertest";
import app from "../../src/app";

describe("Endpoints de pedidos", () => {
    it("POST /pedidos crea un pedido válido", async () => {
        const response = await request(app)
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

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty(
            "mensaje",
            "El pedido se guardó correctamente"
        );
        expect(response.body.pedido).toMatchObject({
            items: [
                {
                    productoId: 1,
                    cantidad: 2
                }
            ],
            estado: "pendiente"
        });
        expect(response.body.pedido).toHaveProperty("id");
    });

    it("POST /pedidos devuelve el total calculado", async () => {
        const response = await request(app)
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

        expect(response.status).toBe(201);
        expect(response.body.pedido.total).toBe(10040);
    });

    it("POST /pedidos rechaza un pedido sin items", async () => {
        const response = await request(app)
            .post("/pedidos")
            .send({
                items: [],
                estado: "pendiente"
            });

        expect(response.status).toBe(400);
        expect(response.body).toEqual({
            error: "El pedido debe contener al menos un producto"
        });
    });

    it("POST /pedidos rechaza un producto inexistente", async () => {
        const response = await request(app)
            .post("/pedidos")
            .send({
                items: [
                    {
                        productoId: 999,
                        cantidad: 1
                    }
                ],
                estado: "pendiente"
            });

        expect(response.status).toBe(400);
        expect(response.body).toEqual({
            error: "No existe el producto 999"
        });
    });

    it("POST /pedidos rechaza una cantidad inválida", async () => {
        const response = await request(app)
            .post("/pedidos")
            .send({
                items: [
                    {
                        productoId: 1,
                        cantidad: 0
                    }
                ],
                estado: "pendiente"
            });

        expect(response.status).toBe(400);
        expect(response.body).toEqual({
            error: "La cantidad del producto 1 debe ser un entero positivo"
        });
    });

    it("GET /pedidos devuelve la lista de pedidos", async () => {
        const response = await request(app)
            .get("/pedidos");

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBeGreaterThan(0);
    });

    it("GET /pedidos/:id devuelve un pedido existente", async () => {
        const creacion = await request(app)
            .post("/pedidos")
            .send({
                items: [
                    {
                        productoId: 2,
                        cantidad: 1
                    }
                ],
                estado: "pendiente"
            });

        const pedidoId = creacion.body.pedido.id;

        const response = await request(app)
            .get(`/pedidos/${pedidoId}`);

        expect(response.status).toBe(200);
        expect(response.body).toMatchObject({
            id: pedidoId,
            items: [
                {
                    productoId: 2,
                    cantidad: 1
                }
            ],
            estado: "pendiente"
        });
    });

    it("GET /pedidos/:id devuelve 404 si el pedido no existe", async () => {
    const response = await request(app)
        .get("/pedidos/999999");

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
        error: "No se encontró un pedido con ese ID"
    });
});

    it("GET /pedidos/:id rechaza un ID inválido", async () => {
        const response = await request(app)
            .get("/pedidos/abc");

        expect(response.status).toBe(400);
        expect(response.body).toEqual({
            error: "El ID debe ser un número entero positivo"
        });
    });
});