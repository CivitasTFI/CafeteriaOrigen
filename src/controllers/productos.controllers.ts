import { Request, Response } from "express";
import { catalogoProductos, obtenerProducto } from "../data/catalogo";

export const getProductos = (req: Request, res: Response) => {
    const productos = catalogoProductos.map((producto) => ({
        id: producto.id,
        nombre: producto.nombre,
        precio: producto.calcularPrecio(),
    }));

    res.status(200).json(productos);
}

export const getProducto = (req: Request, res: Response) => {
    const producto = obtenerProducto(Number(req.params.id));

    if (!producto) {
        return res.status(404).json({ error: "Producto no encontrado" });
    }

    res.status(200).json({
        id: producto.id,
        nombre: producto.nombre,
        precio: producto.calcularPrecio(),
    });
}