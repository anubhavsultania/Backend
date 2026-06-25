import express from "express";
import path from "path";
import session from "express-session";
import bcrypt from "bcrypt";
import { fileURLToPath } from "url";
import db from "../db.js";
import {
    isAuthenticated,
    isGuest
} from "../middleware/auth.js";


const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* Login Page */

router.get(["/", "/login"], isGuest, (req, res) => {
    res.sendFile(
        path.join(__dirname, "../../public", "login.html")
    );
});

/* Login User */

router.post("/login", (req, res) => {
    const { email, password } = req.body;

    db.get(
        `SELECT * FROM users WHERE email = ?`,
        [email],
        async (err, user) => {
            if (err) {
                console.error(err.message);
                return res.status(500).send("Something went wrong");
            }

            if (!user) {
                return res.status(404).send("User not found");
            }

            try {
                const isMatch = await bcrypt.compare(
                    password,
                    user.password
                );

                if (!isMatch) {
                    return res.status(401).send("Invalid password");
                }

                req.session.userId = user.id;

                // Redirect to dashboard after login
                res.redirect("/dashboard");
            } catch (error) {
                console.error(error);
                res.status(500).send("Something went wrong");
            }
        }
    );
});

/* Register Page */

router.get("/register", isGuest, (req, res) => {
    res.sendFile(
        path.join(__dirname, "../../public", "register.html")
    );
});

/* Register User */

router.post("/register", async (req, res) => {
    const { email, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        db.run(
            `INSERT INTO users (email, password)
             VALUES (?, ?)`,
            [email, hashedPassword],
            (err) => {
                if (err) {
                    console.error(err.message);
                    return res.status(400).send("User already exists");
                }

                // res.status(201).send("Registration successful");
                res.redirect("/login");
            }
        );
    } catch (error) {
        console.error(error);
        res.status(500).send("Something went wrong");
    }
});

export default router;