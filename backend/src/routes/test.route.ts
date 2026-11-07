import { postTest } from "../controllers/test.controller";
import { Router } from "express";

const router = Router();

router.post("/reset", postTest);

export default router;