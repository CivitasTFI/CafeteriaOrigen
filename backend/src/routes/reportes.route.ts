import { getFacturacionTotal, getProductoMasVendido } from "../controllers/reportes.controllers";
import { Router } from "express";

const router = Router();

router.get("/facturacion", getFacturacionTotal);
router.get("/mas-vendido", getProductoMasVendido);

export default router;