import { expect, test } from "vitest";
import {
  esquemaPedido,
  esquemaRespuestaCrearPedido,
} from "../../api/esquemas/pedidos";
import { pedidoConMesaApi, respuestaCrearPedidoConMesaApi } from "../fixtures/pedidos";
import {
  crearHandlerCreacionPedido,
  crearHandlerConsultaPedido,
} from "../mocks/handlers";
import { server } from "../mocks/server";

test("el handler de creación responde al POST con estado 201 y el contrato configurado", async () => {
    const respuestaEsperada = respuestaCrearPedidoConMesaApi;
    const cuerpo = { items: pedidoConMesaApi.items, mesaId: pedidoConMesaApi.mesaId };
    server.use(crearHandlerCreacionPedido(respuestaEsperada));

    const respuesta = await fetch(new URL("/pedidos", window.location.origin), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(cuerpo),
    });

    expect(respuesta.status).toBe(201);
    const datos: unknown = await respuesta.json();
    expect(esquemaRespuestaCrearPedido.safeParse(datos).success).toBe(true);
    expect(datos).toEqual(respuestaEsperada);
});

test("el handler de consulta utiliza el ID configurado y conserva estado y mesa", async () => {
    const pedido = { ...pedidoConMesaApi, id: 7, estado: "en preparación" };
    server.use(crearHandlerConsultaPedido(pedido));

    const respuesta = await fetch(
      new URL(`/pedidos/${pedido.id}`, window.location.origin),
    );

    expect(respuesta.status).toBe(200);
    const datos: unknown = await respuesta.json();
    expect(esquemaPedido.safeParse(datos).success).toBe(true);
    expect(datos).toEqual(pedido);
});
