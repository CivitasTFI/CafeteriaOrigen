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
import { carritoReducer, type AccionCarrito, type ItemCarrito } from "../../context/carrito.reducer";
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

describe("Vaciado e inmutabilidad del carrito", () => {
  const productoAdicional = { id: 99, nombre: "Producto adicional", precio: 1000 };
  const casos: { caso: string; accion: AccionCarrito }[] = [
    { caso: "agregar un producto existente", accion: { type: "AGREGAR", producto: productoMock } },
    { caso: "agregar un producto nuevo", accion: { type: "AGREGAR", producto: productoAdicional } },
    { caso: "restar una unidad", accion: { type: "RESTAR", producto: productoMock } },
    { caso: "restar la última unidad", accion: { type: "RESTAR", producto: productoMock2 } },
    { caso: "eliminar un producto", accion: { type: "ELIMINAR", producto: productoMock } },
    { caso: "vaciar el carrito", accion: { type: "VACIAR" } },
  ];

  function prepararEstado(): ItemCarrito[] {
    return [
      { productoId: productoMock.id, nombre: productoMock.nombre, precio: productoMock.precio, cantidad: 2 },
      { productoId: productoMock2.id, nombre: productoMock2.nombre, precio: productoMock2.precio, cantidad: 1 },
    ];
  }

  it("vacía todos los productos mediante VACIAR", () => {
    expect(carritoReducer(prepararEstado(), { type: "VACIAR" })).toEqual([]);
  });

  it.each(casos)("conserva el estado anterior al $caso", ({ accion }) => {
    const estado = prepararEstado();
    const anterior = estado.map((item) => ({ ...item }));
    estado.forEach((item) => Object.freeze(item));
    Object.freeze(estado);

    const resultado = carritoReducer(estado, accion);

    expect(estado).toEqual(anterior);
    expect(resultado).not.toBe(estado);
  });
});
