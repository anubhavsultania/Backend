import express from "express"
import db from "../db.js";
import { isAuthenticated } from "../middleware/auth.js";

const router = express.Router();

router.get('/tasks', isAuthenticated, (req, res) => {
    const userId = req.session.userId;
    db.all(`SELECT * FROM tasks 
        where user_id = ?
    `, [userId], (err, rows) => {
        if(err) {
            return res.status(500).send(err.message);
        }
        return res.json(rows);
    });
});

router.post('/tasks', isAuthenticated, (req, res) => {
    const userId = req.session.userId;
    const {title} = req.body;
    if(!title || title.trim() === "") {
        return res.status(400).send("Title is required");
    }
    db.run(`INSERT INTO tasks (title, user_id)
        VALUES (?, ?)`, [title, userId], (err) => {
            if(err) {
                return res.status(500).send(err.message);
            }
            return res.status(201).json({
                message: "Task Created"
            });
        });
});

export default router;