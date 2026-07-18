import express from "express";
import path from "path";
import session from "express-session";
import bcrypt from "bcrypt";
import { fileURLToPath } from "url";
import authRoutes from "./routes/authRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import db from "./db.js";
import { isAuthenticated, isGuest } from "./middleware/auth.js";
import errorHandler from "./middleware/errorHandler.js";
import dotenv from "dotenv";
dotenv.config();
const app = express();

/* =========================
   Path Configuration
========================= */

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* =========================
   Middleware
========================= */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  }),
);

app.use(express.static(path.join(__dirname, "../public")));
app.use("/", authRoutes);
app.use("/tasks", taskRoutes);
app.use("/dashboard", dashboardRoutes);
app.use("/projects", projectRoutes);
/* =========================
   Error Handling
========================= */

app.use(errorHandler);

export default app;
