import { Request, Response } from "express";
import { calcularFacturacionTotal, productoMasVendido } from "../services/reportes.service";
import { pedidos } from "../data/pedidos";

// GET /reportes/facturacion
export const getFacturacionTotal = (req: Request, res: Response) => {
    const facturacion = calcularFacturacionTotal(pedidos);
    res.status(200).json({ facturacion });
}

// GET /reportes/mas-vendido.
export const getProductoMasVendido = (req: Request, res: Response) => {
    const productosMasVendidos = productoMasVendido(pedidos);
    res.status(200).json({ productosMasVendidos });

 }