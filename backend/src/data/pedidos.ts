import { Pedido } from "../models/pedido";

export const pedidos: Pedido[] = [];

let siguienteID = 1;

export function guardarPedidos(
    items: { productoId: number; cantidad: number }[],
    estado: string,
    mesaId?: number
): Pedido {
    const nuevoPedido = new Pedido(siguienteID++, items, estado, mesaId);

    pedidos.push(nuevoPedido);

    return nuevoPedido;
}

export function obtenerPedidos(): Pedido[] {
    return [...pedidos];
}

export function obtenerPedido(id: number): Pedido | undefined {
    return pedidos.find(p => p.id === id);
}

export function reiniciarPedidos(): void {
    pedidos.length = 0;
    siguienteID = 1;
}
