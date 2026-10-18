// Pedido: id, items: [{ productoId, cantidad }, { productoId, cantidad }], estado 
// calcularPrecio() es una función que devuelve el precio de un producto dado su id

import { obtenerProducto } from '../data/catalogo';
export interface Pedido {
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

// Producto más vendido, calculado a partir del resultado anterior. 
export function productoMasVendido(pedidos: Pedido[]): string[] {
    const listaVentasPorProducto = cantidadVendidaPorProducto(pedidos);
    let masVendidos: string[] = [];
    let maxCantidad = 0;
    for (const producto in listaVentasPorProducto) { 
        const cantidadDelProducto = listaVentasPorProducto[producto];
        // Si la cantidad del producto es mayor a la cantidad maxima encontrada hasta ahora: 
        // actualizo la cantidad maxima encontrada y reemplazo todo lo que haya en el array de mas vendidos por el nuevo producto con mas ventas.
        if ( cantidadDelProducto > maxCantidad) {
            maxCantidad = cantidadDelProducto;
            masVendidos = [producto]; 
        } else if (cantidadDelProducto === maxCantidad){
            // Si la cantidad del producto es igual a la cantidad maxima encontrada hasta ahora:
            // agrego el producto al array de mas vendidos.
            masVendidos.push(producto);
        }
    }
    return masVendidos;
}
