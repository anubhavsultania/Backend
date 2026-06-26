import db from "../db.js";
import { getTasksbyUserId } from "../services/taskService.js";

export function getTasks(req, res, next) {
    const userId = req.session.userId;
    getTasksbyUserId(userId, (err, rows) => {
        if(err) {
            return next(err);
        }
        return res.json(rows);
    });
};