import db from "../db.js";
import { getTasksbyUserId } from "../services/taskService.js";

export async function getTasks(req, res, next) {
    try {
        const userId = req.session.userId;
        const rows = await getTasksbyUserId(userId);
        return res.json(rows);
    }
    catch (err){
        next(err);
    }
};