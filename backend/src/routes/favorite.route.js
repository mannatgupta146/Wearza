import express from "express";
import { toggleFavoriteController, getFavoritesController } from "../controllers/favorite.controller.js";
import { authenticateUser } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", authenticateUser, getFavoritesController);
router.post("/toggle/:productId", authenticateUser, toggleFavoriteController);

export default router;
