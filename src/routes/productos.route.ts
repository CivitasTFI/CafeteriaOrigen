import { catalogoProductos, obtenerProducto } from "../data/catalogo";
import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
    const productos = catalogoProductos.map((producto) => ({
        id: producto.id,
        nombre: producto.nombre,
        precio: producto.calcularPrecio(),
    }));

    res.status(200).json(productos);
});

router.get("/:id", (req, res) => {
    const producto = obtenerProducto(Number(req.params.id));

    if (!producto) {
        return res.status(404).json({ error: "Producto no encontrado" });
    }

    res.status(200).json({
        id: producto.id,
        nombre: producto.nombre,
        precio: producto.calcularPrecio(),
    });
});

export default router;