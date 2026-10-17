// 1.  Total de un pedido: suma de calcularPrecio() × cantidad. 
// 2.  Facturación total: suma de los totales de todos los pedidos. 
// 3.  Cantidad vendida por producto: { "Espresso": 10, "Filtrado": 4 }. 
// 4.  Producto más vendido: parte del resultado anterior.
import { obtenerProducto } from '../data/catalogo';
interface Pedido {
    id: number;
    items: { productoId: number; cantidad: number }[];
    estado: string;
    calcularTotal: () => number;
}
// * Facturación total (suma de los totales de todos los pedidos) 
// Caso borde: sin pedidos
export function calcularFacturacionTotal(pedidos: Pedido[]): number {
    const facturacionTotal = pedidos.reduce((total, pedido) => {
        return total += pedido.calcularTotal();
    }, 0);
    return facturacionTotal;
}
// Pedido: id, items: [{ productoId, cantidad }, { productoId, cantidad }], estado 
// calcularPrecio() es una función que devuelve el precio de un producto dado su id
// * Cantidad vendida por producto (formato { "Espresso": 10, "Filtrado": 4 }) 
// Caso borde: empate en el mas vendido.
export function cantidadVendidaPorProducto(pedidos: Pedido[]): Record<string, number> { 
    const ventasPorProducto: Record<string, number> = {};
    // Recorro el pedido
    for (const pedido of pedidos) {
        // Recorro items
        for (const item of pedido.items) {
            // Obtengo el nombre del producto a partir de su id
            const producto = obtenerProducto(item.productoId);
            if (!producto) {
                continue;
            }
            const nombreProducto = producto.nombre;
            const cantidadVendida = item.cantidad;
            // Sumo la cantidad vendida al producto correspondiente en el objeto de resultados
            if (ventasPorProducto[nombreProducto]) {
                ventasPorProducto[nombreProducto] += cantidadVendida;
            } else {
                ventasPorProducto[nombreProducto] = cantidadVendida;
            }
        }
    }
    return ventasPorProducto;
}

// * Producto más vendido, calculado a partir del resultado anterior. 
