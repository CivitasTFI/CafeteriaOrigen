import { Request, Response } from "express";
import { catalogoProductos, obtenerProducto } from "../data/catalogo";
import { formarRespuestaArray, formarRespuestaObjeto, normalizarInput } from "../services/formar-respuesta.service";

export const getProductos = (req: Request, res: Response) => {
    const productos = formarRespuestaArray(catalogoProductos.map((producto) => normalizarInput(producto)));

    res.status(200).json(productos);
}

export const getProducto = (req: Request, res: Response) => {
    const producto = obtenerProducto(Number(req.params.id));

    if (!producto) {
        return res.status(404).json({ error: "Producto no encontrado" });
    }

    res.status(200).json(formarRespuestaObjeto(normalizarInput(producto)));
}