import {it, describe, expect} from "vitest"; 
import { calcularSubtotalItem, calcularSubtotalCarrito } from "../../utils/subtotalCarrito";
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
    it("calcula el subtotal general del carrito", () => {
    const items: ItemCarrito[] = [
        {
        productoId: 5,
        nombre: "Latte Macchiato",
        precio: 1000,
        cantidad: 2,
        },
        {
        productoId: 6,
        nombre: "Muffin",
        precio: 500,
        cantidad: 3,
        },
    ];

    expect(calcularSubtotalCarrito(items)).toBe(3500);
    });
});
