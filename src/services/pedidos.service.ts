import { obtenerProducto } from "../data/catalogo";
import {
    guardarPedidos,
    obtenerPedidos,
    obtenerPedido
} from "../data/pedidos";

// Valida los datos del pedido
export function validarPedido(
    pedido: { productoId: number; cantidad: number }[]
): void {

    // Validar que haya items
    if (!pedido || pedido.length === 0) {
        throw new Error("El pedido debe contener al menos un producto");
    }

    for (const item of pedido) {

        // Validar que la cantidad sea un entero positivo
        if (!Number.isInteger(item.cantidad) || item.cantidad <= 0) {
            throw new Error(
                `La cantidad del producto ${item.productoId} debe ser un entero positivo`
            );
        }

        // Validar que el producto exista
        const producto = obtenerProducto(item.productoId);

        if (!producto) {
            throw new Error(
                `No existe el producto ${item.productoId}`
            );
        }
    }
}

// Crea un pedido y devuelve sus datos con el total calculado
export function crearPedido(
    items: { productoId: number; cantidad: number }[],
    estado: string
) {
    validarPedido(items);

    const pedido = guardarPedidos(items, estado);

    return {
        id: pedido.id,
        items: pedido.items,
        estado: pedido.estado,
        total: pedido.calcularTotal()
    };
}

// Devuelve todos los pedidos guardados
export function listarPedidos() {
    return obtenerPedidos();
}

// Busca un pedido por su ID
export function buscarPedidoPorId(id: number) {
    return obtenerPedido(id);
}