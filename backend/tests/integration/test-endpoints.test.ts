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
        const response = await request(app);
            .post("/__test__/seed");

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty(
            "mensaje",
            "los datos fueron cargados correctamente"
        );

        const pedidos = await request(app)
            .get("pedidos");

        expect(pedidos.status).toBe(200);
        expect(pedidos.body).toHaveLength(7);
    });
});