import { Router } from "express";
import { createFeedback, listFeedback, getFeedback, markViewed } from "../controllers/feedback.controller.js";

const router = Router();

router.post("/submit-feedback", createFeedback);
router.get("/feedback", listFeedback);
router.get("/feedback/:id", getFeedback);
router.post("/feedback/:id/view", markViewed);

export default router;


