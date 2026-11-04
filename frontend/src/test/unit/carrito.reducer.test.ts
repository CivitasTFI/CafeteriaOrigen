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

const productoMock: Producto = {
  id: 5,
  tipo: "expreso",
  nombre: "Expreso Mediano",
  precio: 7360,
};

const productoMock2: Producto = {
  id: 6,
  tipo: "expreso",
  nombre: "Expreso Grande",
  precio: 8360,
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
    it("agrega un producto distinto al carrito que ya tiene otro", () => {
      const estadoInicial = [
        {
          productoId: productoMock.id,
          nombre: productoMock.nombre,
          precio: productoMock.precio,
          cantidad: 1,
        },
      ];

      const resultado = carritoReducer(estadoInicial, {
        type: "AGREGAR",
        producto: productoMock2
      });
      expect(resultado).toEqual([
        {
          productoId: productoMock.id,
          nombre: productoMock.nombre,
          precio: productoMock.precio,
          cantidad: 1,
        },
        {
          productoId: productoMock2.id,
          nombre: productoMock2.nombre,
          precio: productoMock2.precio,
          cantidad: 1,
        }
      ]);
    });
    // * Caso 3: Incrementar la cantidad al agregar un producto que ya existe en el carrito
    it("Incrementa la cantidad de un producto que ya existe en el carrito", () => {
      const estadoInicial = [
        {
          productoId: productoMock.id,
          nombre: productoMock.nombre,
          precio: productoMock.precio,
          cantidad: 1,
        },
      ];
      const resultado = carritoReducer(estadoInicial, {
        type: "AGREGAR",
        producto: productoMock
      });
      expect(resultado).toEqual([
        {
          productoId: productoMock.id,
          nombre: productoMock.nombre,
          precio: productoMock.precio,
          cantidad: 2,
        },
      ]);
    })
  });
