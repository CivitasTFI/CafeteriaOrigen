import { getPedido, getPedidoID, postPedidos } from "../controllers/pedidos.controllers";
import { Router } from "express";

const router = Router();

router.get("/", getPedido);
router.get("/:id", getPedidoID);
router.post("/", postPedidos);

export default router;