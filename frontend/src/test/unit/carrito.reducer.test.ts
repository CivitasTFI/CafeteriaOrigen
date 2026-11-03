/** Casos de prueba para el reducer del carrito 
 * 
 * Caso 1: Agregar un producto al carrito vacío
 * Caso 2: Agregar un producto distinto a un carrito que ya tiene otro
 * Caso 3: Incrementar la cantidad al agregar un producto que ya existe en el carrito
 * Caso 4: Restar cantidad del producto que ya existe en el carrito
 * Caso 5: Eliminar un producto del carrito
 * Caso 6: Calcular subtotal del carrito
 * 
*/

import { describe, expect, it } from "vitest";
import { carritoReducer } from "../../context/carrito.reducer";
import type { Producto } from "../../api/esquemas/productos";

// Esto se implementa en el archivo carrito.reducer.ts
// type AccionCarrito =
//   | { type: "AGREGAR"; producto: Producto }
//   | { type: "QUITAR"; productoId: number };

const productoMock: Producto = {
  id: 5,
  tipo: "expreso",
  nombre: "Expreso Mediano",
  precio: 7360,
};

describe("carritoReducer", () => {
    it("agrega un producto al carrito vacio", () => {
        const resultado =  carritoReducer([], {
          type: "AGREGAR",
          producto: productoMock
        });
        expect(resultado).toEqual([
        {
          productoId: productoMock.id,
          nombre: productoMock.nombre,
          precio: productoMock.precio,
          cantidad: 1,
        },
        ]);
  });
});
