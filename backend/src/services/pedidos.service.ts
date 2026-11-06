import { obtenerProducto } from "../data/catalogo";
import { Pedido } from "../models/pedido";
import {
    guardarPedidos,
    obtenerPedidos,
    obtenerPedido
} from "../data/pedidos";

const mesasValidas = [1,2,3,4,5,6,7,8];

// Valida los datos del pedido
export function validarPedido(
    pedido: { productoId: number; cantidad: number }[],
    mesaId?: number
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

    if (mesaId !== undefined) {
        if (!Number.isInteger(mesaId) || mesaId < 1) {
            throw new Error("Debe ingresar un número válido");
        }

        if (!mesasValidas.includes(mesaId)) {
            throw new Error("Mesa inexistente");
        }
    }
}

// Devuelve la representación pública de un pedido
function formatearPedido(pedido: Pedido) {
    return {
        id: pedido.id,
        items: pedido.items,
        estado: pedido.estado,
        mesaId: pedido.mesaId,
        total: pedido.calcularTotal()
    };
}

// Crea un pedido y devuelve sus datos con el total calculado
export function crearPedido(
    items: { productoId: number; cantidad: number }[],
    estado: string,
    mesaId?: number
) {
    validarPedido(items, mesaId);

    const pedido = guardarPedidos(items, estado, mesaId);

    return formatearPedido(pedido);
}

// Devuelve todos los pedidos guardados con su total calculado
export function listarPedidos() {
    return obtenerPedidos().map(formatearPedido);
}

// Busca un pedido por su ID y devuelve su total calculado
export function buscarPedidoPorId(id: number) {
    const pedido = obtenerPedido(id);

    if (!pedido) {
        return undefined;
    }

    return formatearPedido(pedido);
}