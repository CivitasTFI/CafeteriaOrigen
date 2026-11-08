import { postSeed, postTest } from "../controllers/test.controller";
import { Router } from "express";

const router = Router();

router.post("/reset", postTest);
router.post("/seed", postSeed);

export default router;