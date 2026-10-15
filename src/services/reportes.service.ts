// * Facturación total (suma de los totales de todos los pedidos), 
// * Cantidad vendida por producto (formato { "Espresso": 10, "Filtrado": 4 }) 
// * Producto más vendido, calculado a partir del resultado anterior.

// Casos borde: sin pedidos y empate en el más vendido.
// Tests unitarios y de endpoints.

// Pedido: id, items: [{ productoId, cantidad }], estado 
// calcularPrecio() es una función que devuelve el precio de un producto dado su id

// 1.  Total de un pedido: suma de calcularPrecio() × cantidad. 
// 2.  Facturación total: suma de los totales de todos los pedidos. 
// 3.  Cantidad vendida por producto: { "Espresso": 10, "Filtrado": 4 }. 
// 4.  Producto más vendido: parte del resultado anterior.

interface Pedido {
    id: number;
    items: { productoId: number; cantidad: number }[];
    estado: string;
    calcularTotal: () => number;
}

export function calcularFacturacionTotal(pedidos: Pedido[]): number {
    const facturacionTotal = pedidos.reduce((total, pedido) => {
        return total += pedido.calcularTotal();
    }, 0);
    return facturacionTotal;
}