import { obtenerProducto } from "../data/catalogo";
import { Pedido } from "../models/pedido";

// Facturación total: suma de los totales de todos los pedidos.
// Caso borde: sin pedidos.
export function calcularFacturacionTotal(pedidos: Pedido[]): number {
    const facturacionTotal = pedidos.reduce((total, pedido) => {
        return total += pedido.calcularTotal();
    }, 0);

    return facturacionTotal;
}

// Cantidad vendida por producto.
export function cantidadVendidaPorProducto(pedidos: Pedido[]): Record<string, number> {
    const ventasPorProducto: Record<string, number> = {};

    for (const pedido of pedidos) {
        for (const item of pedido.items) {
            const producto = obtenerProducto(item.productoId);

            if (!producto) {
                continue;
            }

            const nombreProducto = producto.nombre;
            const cantidadVendida = item.cantidad;

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

        if (cantidadDelProducto > maxCantidad) {
            maxCantidad = cantidadDelProducto;
            masVendidos = [producto];
        } else if (cantidadDelProducto === maxCantidad) {
            masVendidos.push(producto);
        }
    }

    return masVendidos;
}