import { Router } from "express";
import * as userController from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";
import asyncHandler from "../utils/asyncHandler.js";

const router = Router();
router.use(protect);
router.get("/", asyncHandler(userController.searchUsers));
router.patch("/me", asyncHandler(userController.updateProfile));

export default router;
