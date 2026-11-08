import { buscarProductos, getProducto, getProductos } from "../controllers/productos.controllers";
import { Router } from "express";

const router = Router();

router.get("/", getProductos);
router.get("/buscar", buscarProductos);
router.get("/:id", getProducto);

export default router;