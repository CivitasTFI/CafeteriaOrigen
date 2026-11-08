import app from "../../src/app";
import { obtenerPedidos, reiniciarPedidos } from "../../src/data/pedidos";
import request from "supertest";
import { crearPedido } from "../../src/services/pedidos.service";

describe("endpoints de test", () => {
    beforeEach(()=>{
        reiniciarPedidos();
    })

    it("POST/__test__/reset", async () =>{

        crearPedido(
            [{
                productoId: 12,
                cantidad: 2
            }],
            undefined,
            2
        )
        const response = await request(app)
            .post("/__test__/reset")
            
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty(
            "mensaje",
            "Los tests fueron reiniciados correctamente"
        );

        expect(obtenerPedidos()).toHaveLength(0);

        const nuevoPedido = crearPedido(
            [{
                productoId:9,
                cantidad:1
            }]
        )

        expect(nuevoPedido.id).toBe(1);
    });

    it("POST/__test__/seed", async () => {
        const response = await request(app)
            .post("/__test__/seed")

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty(
            "mensaje",
            "Los datos fueron cargados correctamente"
        );

        const pedidos = await request(app)
            .get("/pedidos");

        expect(pedidos.status).toBe(200);
        expect(pedidos.body).toHaveLength(8);
        //pedido id
        expect(pedidos.body[0].id).toBe(1);
        expect(pedidos.body[1].id).toBe(2);
        expect(pedidos.body[2].id).toBe(3);
        expect(pedidos.body[3].id).toBe(4);
        expect(pedidos.body[4].id).toBe(5);
        expect(pedidos.body[5].id).toBe(6);
        expect(pedidos.body[6].id).toBe(7);
        expect(pedidos.body[7].id).toBe(8);
        //mesas
        expect(pedidos.body[0].mesaId).toBe(1);
        expect(pedidos.body[1].mesaId).toBe(2);
        expect(pedidos.body[2].mesaId).toBe(3);
        expect(pedidos.body[3].mesaId).toBe(4);
        expect(pedidos.body[4].mesaId).toBe(5);
        expect(pedidos.body[5].mesaId).toBe(6);
        expect(pedidos.body[6].mesaId).toBe(7);
        expect(pedidos.body[7].mesaId).toBe(8);
        //items
        expect(pedidos.body[0].items).toEqual([
            {
                productoId:3,
                cantidad: 1
            }
        ]);
        expect(pedidos.body[1].items).toEqual([
            {
                productoId:2,
                cantidad:4
            },
            {
                productoId:19,
                cantidad:4
            }
        ]);
        expect(pedidos.body[2].items).toEqual([
            {
                productoId:5,
                cantidad:2
            }
        ]);
        expect(pedidos.body[3].items).toEqual([
            {
                productoId: 8,
                cantidad: 2
            },
            {
                productoId: 20,
                cantidad: 2
            }
        ]);
        expect(pedidos.body[4].items).toEqual([
            {
                productoId: 18,
                cantidad: 1
            },
            {
                productoId: 19,
                cantidad: 1
            }
        ]);
        expect(pedidos.body[5].items).toEqual([
            {
                productoId: 13,
                cantidad:2
            },
            {
                productoId:16,
                cantidad: 2
            },
            {
                productoId: 20,
                cantidad: 1
            },
            {
                productoId: 19,
                cantidad:3
            }
        ]);
        expect(pedidos.body[6].items).toEqual([
            {
                productoId: 5,
                cantidad: 1
            },
            {
                productoId: 2,
                cantidad: 1
            },
            {
                productoId: 13,
                cantidad:1
            },
            {
                productoId:19,
                cantidad: 3
            }
        ]);
        expect(pedidos.body[7].items).toEqual([
            {
                productoId: 14,
                cantidad: 2
            },
            {
                productoId:9,
                cantidad:1
            },
            {
                productoId: 20,
                cantidad: 1
            },
            {
                productoId:19,
                cantidad:1
            }
        ]);
    });
});

describe("rutas de testing deshabilitadas", () => {
  it("responde 404 fuera de entorno test", async () => {
  jest.resetModules();

  process.env.NODE_ENV = "development";

  const app = require("../../src/app").default;

  const response = await request(app)
    .post("/__test__/reset");

  const response2 = await request(app)
    .post("/__test__/seed");

  expect(response.status).toBe(404);
  expect(response2.status).toBe(404);
});
});