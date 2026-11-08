/** Casos de prueba para el reducer del carrito 
 * 
 * Caso 1: Agregar un producto al carrito vacío
 * Caso 2: Agregar un producto distinto a un carrito que ya tiene otro
 * Caso 3: Incrementar la cantidad al agregar un producto que ya existe en el carrito
 * Caso 4: Restar cantidad del producto que ya existe en el carrito
 * Caso 5: Eliminar el producto cuando se resta y la cantidad del producto es 1
 * Caso 6: Eliminar un producto del carrito
 * 
*/

import { describe, expect, it } from "vitest";
import { carritoReducer } from "../../context/carrito.reducer";
import {
  cafeApi as productoMock,
  pasteleriaApi as productoMock2,
} from "../fixtures/productos";

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
    it("Restar la cantidad del producto que ya existe en el carrito", () => {
      const estadoInicial = [
        {
          productoId: productoMock.id,
          nombre: productoMock.nombre,
          precio: productoMock.precio,
          cantidad: 3,
        },
        {
          productoId: productoMock2.id,
          nombre: productoMock2.nombre,
          precio: productoMock2.precio,
          cantidad: 1,
        }
      ];
      const resultado = carritoReducer( estadoInicial, {
        type: "RESTAR",
        producto: productoMock
      });
      expect(resultado).toEqual([
        {
          productoId: productoMock.id,
          nombre: productoMock.nombre,
          precio: productoMock.precio,
          cantidad: 2,
        },
        {
          productoId: productoMock2.id,
          nombre: productoMock2.nombre,
          precio: productoMock2.precio,
          cantidad: 1,
        }
      ]);
    })
    it("Elimina el producto cuando se resta y la cantidad del producto es 1", () => {
      const estadoInicial = [
        {
          productoId: productoMock.id,
          nombre: productoMock.nombre,
          precio: productoMock.precio,
          cantidad: 1,
        }];
        const resultado = carritoReducer(estadoInicial, {
          type: "RESTAR",
          producto: productoMock
        });
        expect(resultado).toEqual([]);
    });
    it("Elimina un producto del carrito", () => {
      const estadoInicial = [
        {
          productoId: productoMock.id,
          nombre: productoMock.nombre,
          precio: productoMock.precio,
          cantidad: 2,
        },
        {
          productoId: productoMock2.id,
          nombre: productoMock2.nombre,
          precio: productoMock2.precio,
          cantidad: 1,
        }
      ];
      const resultado = carritoReducer(estadoInicial, {
        type: "ELIMINAR",
        producto: productoMock
      });
      expect(resultado).toEqual([
        {
          productoId: productoMock2.id,
          nombre: productoMock2.nombre,
          precio: productoMock2.precio,
          cantidad: 1,
        }
      ]);
    })
  });
