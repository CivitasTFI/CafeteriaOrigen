import { postSeed, postReset } from "../controllers/test.controller";
import { Router } from "express";

const router = Router();

router.post("/reset", postReset);
router.post("/seed", postSeed);

export default router;