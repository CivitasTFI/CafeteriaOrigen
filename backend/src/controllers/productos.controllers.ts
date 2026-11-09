import { Request, Response } from "express";
import { catalogoProductos, obtenerProducto } from "../data/catalogo";
import { InterfazBusquedaProducto } from "../data/interfaz-busqueda-producto";
import { buscarProducto } from "../services/buscar-producto.service";
import { formarRespuestaArray, formarRespuestaObjeto, normalizarInput } from "../services/formar-respuesta.service";

const TIPOS = new Set(["cafe", "pasteleria"]);
const TIPOS_CAFE = new Set(["expreso", "filtrado"]);
const TAMANOS = new Set(["pocillo", "mediano", "taza grande"]);
const VARIEDADES = new Set([
    "brasil",
    "colombia",
    "etiopia",
    "muffin de chocolate",
    "torta selva negra",
]);

function leerQueryBusqueda(query: Request["query"]): InterfazBusquedaProducto | null {
    const criterios: InterfazBusquedaProducto = {};
    const tipo = query.tipo;
    const tipoCafe = query.tipoCafe;
    const tamaño = query.tamaño;
    const variedad = query.variedad;

    if (tipo !== undefined) {
        if (typeof tipo !== "string" || !TIPOS.has(tipo)) return null;
        criterios.tipo = tipo as InterfazBusquedaProducto["tipo"];
    }
    if (tipoCafe !== undefined) {
        if (typeof tipoCafe !== "string" || !TIPOS_CAFE.has(tipoCafe)) return null;
        criterios.tipoCafe = tipoCafe as InterfazBusquedaProducto["tipoCafe"];
    }
    if (tamaño !== undefined) {
        if (typeof tamaño !== "string" || !TAMANOS.has(tamaño)) return null;
        criterios.tamaño = tamaño as InterfazBusquedaProducto["tamaño"];
    }
    if (variedad !== undefined) {
        if (typeof variedad !== "string" || !VARIEDADES.has(variedad)) return null;
        criterios.variedad = variedad as InterfazBusquedaProducto["variedad"];
    }

    if (Object.keys(criterios).length === 0) {
        return null;
    }

    return criterios;
}

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

export const buscarProductos = (req: Request, res: Response) => {
    const criterios = leerQueryBusqueda(req.query);

    if (!criterios) {
        return res.status(400).json({ error: "Criterios de búsqueda inválidos o vacíos" });
    }

    const resultado = buscarProducto(criterios);

    if (typeof resultado === "string") {
        return res.status(404).json({ error: resultado });
    }

    res.status(200).json(
        formarRespuestaArray(resultado.map((producto) => normalizarInput(producto))),
    );
};
