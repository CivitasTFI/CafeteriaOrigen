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
        expect(pedidos.body).toMatchObject(
            Array.from({ length: 8 }, (_, indice) => ({
                id: indice + 1,
                mesaId: indice + 1,
                estado: "pendiente"
            }))
        );
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

    it("seed reemplaza los pedidos agregados y recupera los ocho casos iniciales", async () => {
        await request(app).post("/__test__/seed").expect(201);
        const primerosPedidos = await request(app).get("/pedidos").expect(200);
        expect(primerosPedidos.body).toHaveLength(8);

        const adicional = await request(app).post("/pedidos")
            .send({ items: [{ productoId: 19, cantidad: 1 }] })
            .expect(201);
        expect(adicional.body.pedido.id).toBe(9);
        const antesDelSeed = await request(app).get("/pedidos").expect(200);
        expect(antesDelSeed.body).toHaveLength(9);

        await request(app).post("/__test__/seed").expect(201);
        const segundosPedidos = await request(app).get("/pedidos").expect(200);
        expect(segundosPedidos.body).toHaveLength(8);
        expect(segundosPedidos.body).toEqual(primerosPedidos.body);

        await request(app).post("/__test__/seed").expect(201);
        const tercerosPedidos = await request(app).get("/pedidos").expect(200);
        expect(tercerosPedidos.body).toEqual(primerosPedidos.body);
    });

    it("verificar regularidad en los ids", async () => {

        await request(app).post("/__test__/seed").expect(201);

        crearPedido(
            [{
                productoId:9,
                cantidad:1
            }]
        )

        const pedidos = await request(app).get("/pedidos").expect(200);

        expect(pedidos.body[8].id).toBe(9);
    })
});


describe("rutas de testing deshabilitadas",() => {
  it("responde 404 fuera de entorno test", async () => {
    const entornoAnterior = process.env.NODE_ENV;
    try {
      jest.resetModules();
      process.env.NODE_ENV = "development";
      const appFueraDeTest = require("../../src/app").default;

      await request(appFueraDeTest).post("/__test__/reset").expect(404);
      await request(appFueraDeTest).post("/__test__/seed").expect(404);
    } finally {
      if (entornoAnterior === undefined) delete process.env.NODE_ENV;
      else process.env.NODE_ENV = entornoAnterior;
      jest.resetModules();
    }
  });
});
