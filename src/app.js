import express from "express";
import path from "path";
import session from "express-session";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import authRoutes from "./routes/authRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import db from "./db.js";
import {
    isAuthenticated,
    isGuest
} from "./middleware/auth.js";
import errorHandler from "./middleware/errorHandler.js";

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

app.use(express.urlencoded({ extended: true }));

app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false
    })
);

app.use(express.static(path.join(__dirname, '../public')));
app.use('/', authRoutes);
app.use('/tasks', taskRoutes);


/* =========================
   Routes
========================= */

/* Dashboard */

app.get("/dashboard", isAuthenticated, (req, res) => {
    res.sendFile( path.join(__dirname, "../public", "dashboard.html"));
});

/* Logout */

app.get("/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send("Logout failed");
        }

        res.clearCookie("connect.sid");
        res.send("Logged out successfully");
    });
});

/* =========================
   Error Handling
========================= */

app.use(errorHandler);

/* =========================
   Start Server
========================= */

const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});