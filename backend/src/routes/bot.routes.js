import { Router } from "express";
import { getBotMove } from "../controllers/bot.controller.js";

const router = Router();

router.post("/bot/move", getBotMove);

export default router;


