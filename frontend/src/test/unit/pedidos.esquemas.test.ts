import { expect, test } from "vitest";
import { esquemaPedido } from "../../api/esquemas/pedidos";

test("acepta un pedido de la API actual y conserva sus datos", () => {
  const pedido = {
    id: 1,
    items: [
      { productoId: 5, cantidad: 2 },
      { productoId: 19, cantidad: 1 },
    ],
    estado: "pendiente",
    total: 17220,
  };

  expect(esquemaPedido).toBeDefined();
  expect(esquemaPedido.safeParse(pedido)).toEqual({
    success: true,
    data: pedido,
  });
});
