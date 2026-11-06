import { obtenerProducto } from "../data/catalogo";
import { Pedido } from "../models/pedido";
import { validarObjeto } from "../utils/validar-objeto";
import { ErrorValidacion } from "../errors/error-validacion";
import {
    guardarPedidos,
    obtenerPedidos,
    obtenerPedido
} from "../data/pedidos";

const mesasValidas = [1,2,3,4,5,6,7,8];

function validarImporteSeguro(importe: number, mensajeError: string): void {
    if (!Number.isSafeInteger(importe)) {
        throw new ErrorValidacion(mensajeError);
    }
}

function validarEstadoPedido(estado: unknown): void {
    if (typeof estado !== "string" || estado.trim().length === 0) {
        throw new ErrorValidacion("El estado del pedido debe ser un texto no vacío");
    }
}

function validarIdProducto(productoId: unknown): void {
    if (
        typeof productoId !== "number" ||
        !Number.isSafeInteger(productoId) ||
        productoId <= 0
    ) {
        throw new ErrorValidacion("El ID del producto debe ser un entero positivo seguro");
    }
}

// Valida los datos del pedido
export function validarPedido(
    pedido: { productoId: number; cantidad: number }[],
    mesaId?: number
): void {

    // Validar que los items sean un arreglo no vacío
    if (!Array.isArray(pedido)) {
        throw new ErrorValidacion("Los items del pedido deben ser un arreglo");
    }

    if (pedido.length === 0) {
        throw new ErrorValidacion("El pedido debe contener al menos un producto");
    }

    let total = 0;

    for (const item of pedido) {
        validarObjeto(item, "Cada ítem del pedido debe ser un objeto");

        validarIdProducto(item.productoId);

        // Validar que la cantidad sea un entero positivo seguro
        if (!Number.isSafeInteger(item.cantidad) || item.cantidad <= 0) {
            throw new ErrorValidacion(
                `La cantidad del producto ${item.productoId} debe ser un entero positivo`
            );
        }

        // Validar que el producto exista
        const producto = obtenerProducto(item.productoId);

        if (!producto) {
            throw new ErrorValidacion(
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

    if (mesaId !== undefined) {
        if (!Number.isInteger(mesaId) || mesaId < 1) {
            throw new ErrorValidacion("Debe ingresar un número válido");
        }

        if (!mesasValidas.includes(mesaId)) {
            throw new ErrorValidacion("Mesa inexistente");
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
    estado: string = "pendiente",
    mesaId?: number
) {
    validarEstadoPedido(estado);
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
