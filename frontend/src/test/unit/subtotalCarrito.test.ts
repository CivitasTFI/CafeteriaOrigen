import {it, describe, expect} from "vitest"; 
import { calcularSubtotalItem } from "../../utils/subtotalCarrito";
import type { ItemCarrito } from "../../context/carrito.reducer";

// npm.cmd run test:frontend -- src/test/unit/subtotalCarrito.test.ts

describe("calcularSubtotalItem", () => {
    it("calcula el subtotal de un item", () => {
        const item: ItemCarrito = {
                productoId: 5,
                nombre: "Latte Macchiato",
                precio: 1000,
                cantidad: 2,
        };
        expect(calcularSubtotalItem(item)).toBe(2000);
    });
});
