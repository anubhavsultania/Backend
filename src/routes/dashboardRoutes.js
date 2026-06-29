import express from "express";
import { isAuthenticated } from "../middleware/auth.js";
import { getDashboardHtml } from "../controllers/dashboardController.js";

const router = express.Router();
router.get("/", isAuthenticated, getDashboardHtml);

export default router;
