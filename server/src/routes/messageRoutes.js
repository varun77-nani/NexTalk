import { Router } from "express";
import * as conversationController from "../controllers/conversationController.js";
import * as messageController from "../controllers/messageController.js";
import { protect } from "../middleware/authMiddleware.js";
import asyncHandler from "../utils/asyncHandler.js";

const router = Router();
router.use(protect);
router.get("/:conversationId", asyncHandler(conversationController.getMessages));
router.post("/:conversationId", asyncHandler(messageController.sendMessage));

export default router;
