// * Facturación total (suma de los totales de todos los pedidos), 
// * Cantidad vendida por producto (formato { "Espresso": 10, "Filtrado": 4 }) 
// * Producto más vendido, calculado a partir del resultado anterior.

// Endpoints GET /reportes/facturacion y GET /reportes/mas-vendido.
// Casos borde: sin pedidos y empate en el más vendido.
// Tests unitarios y de endpoints.

// Nombres de productos: Expreso Pocillo Brasil, Expreso Pocillo Colombia, Expreso Pocillo Etiopia, Expreso Mediano Brasil, Expreso Mediano Colombia, Expreso Mediano Etiopia, Expreso Taza Grande Brasil, Expreso Taza Grande Colombia, Expreso Taza Grande Etiopia, Filtrado Pocillo Brasil, Filtrado Pocillo Colombia, Filtrado Pocillo Etiopia, Filtrado Mediano Brasil, Filtrado Mediano Colombia, Filtrado Mediano Etiopia, Filtrado Taza Grande Brasil, Filtrado Taza Grande Colombia, Filtrado Taza Grande Etiopia, Muffin de Chocolate, Torta Selva Negra
// Pedido: id, items: [{ productoId, cantidad }], estado 
// 1.  Total de un pedido: suma de calcularPrecio() × cantidad. 
// 2.  Facturación total: suma de los totales de todos los pedidos. 
// 3.  Cantidad vendida por producto: { "Espresso": 10, "Filtrado": 4 }. 
// 4.  Producto más vendido: parte del resultado anterior.

import { calcularFacturacionTotal } from '../src/services/reportes.service';

interface Pedido {
    id: number;
    items: { productoId: number; cantidad: number }[];
    estado: string;
    calcularTotal: () => number;
}

describe('calcularFacturacionTotal', () => {
    it('verifica que la facturación total (suma de los totales de todos los pedidos) sea 0 cuando no hay pedidos', () => {
        const listaPedidos: Pedido[] = [];
        // Llamo a la función que calcula la facturación total y verifico que el resultado sea 0
        // calcularFacturacionTotal es una funcion que recibe un array de pedidos y devuelve la facturación total
        const facturacionTotal = calcularFacturacionTotal(listaPedidos);
        expect(facturacionTotal).toBe(0);
    });

    it('verifica que la facturación total sea la suma de los totales de todos los pedidos cuando hay pedidos', () => {
        const pedido1: Pedido = {
            id: 1,
            items: [
                { productoId: 1, cantidad: 2 },
                { productoId: 2, cantidad: 3 }
            ],
            estado: 'completado',
            calcularTotal: () => 10000
        };
        const pedido2: Pedido = {
            id: 2,
            items: [
                { productoId: 1, cantidad: 1 },
                { productoId: 3, cantidad: 4 }
            ],
            estado: 'completado',
            calcularTotal: () => 5000
        };
        const pedido3: Pedido = {
            id: 3,
            items: [
                { productoId: 2, cantidad: 2 },
                { productoId: 3, cantidad: 1 }
            ],
            estado: 'completado',
            calcularTotal: () => 3000
        };
        const listaPedidos: Pedido[] = [pedido1, pedido2, pedido3];
        const facturacionTotal = calcularFacturacionTotal(listaPedidos);
        // Suma esperada fija: 10000 + 5000 + 3000 = 18000
        expect(facturacionTotal).toBe(18000);
    });
});
