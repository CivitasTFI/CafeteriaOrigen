import { obtenerProducto } from "../data/catalogo";
import { Pedido } from "../models/pedido";
import { validarObjeto } from "../utils/validar-objeto";
import {
    guardarPedidos,
    obtenerPedidos,
    obtenerPedido
} from "../data/pedidos";

function validarImporteSeguro(importe: number, mensajeError: string): void {
    if (!Number.isSafeInteger(importe)) {
        throw new Error(mensajeError);
    }
}

// Valida los datos del pedido
export function validarPedido(
    pedido: { productoId: number; cantidad: number }[]
): void {

    // Validar que los items sean un arreglo no vacío
    if (!Array.isArray(pedido)) {
        throw new Error("Los items del pedido deben ser un arreglo");
    }

    if (pedido.length === 0) {
        throw new Error("El pedido debe contener al menos un producto");
    }

    let total = 0;

    for (const item of pedido) {
        validarObjeto(item, "Cada ítem del pedido debe ser un objeto");

        // Validar que la cantidad sea un entero positivo seguro
        if (!Number.isSafeInteger(item.cantidad) || item.cantidad <= 0) {
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

        const subtotal = producto.calcularPrecio() * item.cantidad;

        validarImporteSeguro(
            subtotal,
            `El subtotal del producto ${item.productoId} supera el rango de enteros seguros`
        );

        total += subtotal;

        validarImporteSeguro(total, "El total del pedido supera el rango de enteros seguros");
    }
}

// Devuelve la representación pública de un pedido
function formatearPedido(pedido: Pedido) {
    return {
        id: pedido.id,
        items: pedido.items,
        estado: pedido.estado,
        total: pedido.calcularTotal()
    };
}

// Crea un pedido y devuelve sus datos con el total calculado
export function crearPedido(
    items: { productoId: number; cantidad: number }[],
    estado: string
) {
    validarPedido(items);

    const pedido = guardarPedidos(items, estado);

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
