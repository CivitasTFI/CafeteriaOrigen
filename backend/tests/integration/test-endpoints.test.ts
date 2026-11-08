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