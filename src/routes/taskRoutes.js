import express from "express"
import db from "../db.js";
import { isAuthenticated } from "../middleware/auth.js";
import { getTasks, searchTasks } from "../controllers/taskController.js";

const router = express.Router();

router.get('/', isAuthenticated, getTasks);
router.get('/search', isAuthenticated, searchTasks);
router.get("/:id", isAuthenticated, (req, res) => {
    const taskId = req.params.id;
    const userId = req.session.userId;
    db.get(`SELECT * FROM tasks
        WHERE user_id = ?
        AND id = ?
    `, [userId, taskId], (err, row) => {
        if(err) {
            return res.status(500).send(err.message);
        }
        else if(!row) {
            return res.status(404).send("Task not found");
        }
        return res.json(row);
    })
});

router.post('/', isAuthenticated, (req, res) => {
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

router.patch('/:id', isAuthenticated, (req, res) => {
    const userId = req.session.userId;
    const {title} = req.body;
    const taskId = req.params.id;
    if(!title || title.trim() === "") {
        return res.status(400).send("Title is required");
    }
    db.run(`UPDATE tasks
            SET title = ?
            WHERE user_id = ?
            AND id = ?
    `, [title, userId, taskId], function (err) {
        if(err) {
            return res.status(500).send(err.message);
        }
        if (this.changes === 0) {
            return res.status(404).send("Task not found");
        }
        return res.status(201).json({
            message: "Task Created"
        });
    });
});

router.delete('/:id', isAuthenticated, (req, res) => {
    const taskId = req.params.id;
    const userId = req.session.userId;

    db.run(`
        DELETE FROM tasks
        WHERE user_id = ?
        AND id = ?
    `, [userId, taskId], function (err) {
        if(err) {
            return res.status(500).send(err.message);
        }
        if(this.changes === 0) {
            return res.status(404).send("Task not found");
        }
        return res.json({
            message: "Task deleted"
        });
    });
});

router.patch('/:id/complete', isAuthenticated, (req, res) => {
    const userId = req.session.userId;
    const taskId = req.params.id;

    db.run(`UPDATE tasks
        SET completed = 1
        WHERE user_id = ?
        AND id = ?
    `, [userId, taskId], function (err) {
        if(err) {
           return res.status(500).send(err.message);
        }
        if(this.changes === 0) {
            return res.status(404).send("Task not found");
        }
        return res.json({
            message: "Task completed"
        });
    })

});

export default router;