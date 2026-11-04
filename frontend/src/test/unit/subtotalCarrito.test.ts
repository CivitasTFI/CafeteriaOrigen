import {it, describe, expect} from "vitest"; 
import { calcularSubtotal } from "../../utils/subtotalCarrito";
import type { ItemCarrito } from "../../context/carrito.reducer";

// npm.cmd run test:frontend -- src/test/unit/subtotalCarrito.test.ts

describe("subtotalCarrito", () => {
    it("calcula el subtotal de un item", () => {
        const item: ItemCarrito = {
                productoId: 5,
                nombre: "Latte Macchiato",
                precio: 1000,
                cantidad: 2,
        };
        expect(calcularSubtotal(item)).toBe(2000);
    });
});