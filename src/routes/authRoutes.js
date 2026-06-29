import express from "express";
import path from "path";
import session from "express-session";
import bcrypt from "bcrypt";
import { fileURLToPath } from "url";
import { getLoginPage, getRegisterPage, loginUser, logoutUser, registerUser } from "../controllers/authController.js";
import db from "../db.js";
import { isAuthenticated, isGuest } from "../middleware/auth.js";

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* Login Page */

router.get(["/", "/login"], isGuest, getLoginPage);

/* Login User */

router.post("/login", loginUser);

/* Register Page */

router.get("/register", isGuest, getRegisterPage);

/* Register User */

router.post("/register", registerUser);

/* Logout User */

router.get("/logout", logoutUser);

export default router;
