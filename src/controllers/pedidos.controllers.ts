import { Request, Response } from "express";
import { crearPedido, listarPedidos, buscarPedidoPorId } from "../services/pedidos.service";

// POST pedidos
export const postPedidos = (req: Request, res: Response) => {
    try {
        const { items, estado } = req.body;

        const pedido = crearPedido(items, estado);

        return res.status(201).json({
            mensaje: "El pedido se guardó correctamente",
            pedido
        });
    } catch (error) {
        return res.status(400).json({
            error: error instanceof Error
                ? error.message
                : "No se pudo guardar el pedido"
        });
    }
}

// GET pedidos
export const getPedido = (_req: Request, res: Response) => {
    return res.status(200).json(listarPedidos());
}

// GET pedidos id
export const getPedidoID = (req: Request, res: Response) => {
    const pedidoId = Number(req.params.id);

    if (!Number.isInteger(pedidoId) || pedidoId <= 0) {
        return res.status(400).json({
            error: "El ID debe ser un número entero positivo"
        });
    }

    const pedido = buscarPedidoPorId(pedidoId);

    if (!pedido) {
        return res.status(404).json({
            error: "No se encontró un pedido con ese ID"
        });
    }

    return res.status(200).json(pedido);
}