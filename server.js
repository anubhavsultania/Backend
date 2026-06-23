import express from "express";
import path from "path";
import sqlite3 from "sqlite3";
import session from "express-session";
import bcrypt from "bcrypt";
import { fileURLToPath } from "url";

const app = express();

/* =========================
   Database Connection
========================= */

const db = new sqlite3.Database("./database/users.db", (err) => {
    if (err) {
        console.error(err.message);
    } else {
        console.log("Connected to database");
    }
});

db.run(`
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE,
        password TEXT
    )
`);

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
        secret: "mySecretKey",
        resave: false,
        saveUninitialized: false
    })
);

/* =========================
   Routes
========================= */

/* Login Page */

app.get("/", (req, res) => {
    res.sendFile(
        path.join(__dirname, "public", "login.html")
    );
});

/* Register Page */

app.get("/register", (req, res) => {
    res.sendFile(
        path.join(__dirname, "public", "register.html")
    );
});

/* Register User */

app.post("/register", async (req, res) => {
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

                res.status(201).send("Registration successful");
            }
        );
    } catch (error) {
        console.error(error);
        res.status(500).send("Something went wrong");
    }
});

/* Login User */

app.post("/login", (req, res) => {
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

/* Dashboard */

app.get("/dashboard", (req, res) => {
    if (!req.session.userId) {
        return res.status(401).send("Please login first");
    }

    res.send("Welcome to Dashboard");
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
   Start Server
========================= */

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});