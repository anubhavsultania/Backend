import db from "../db.js";
import { getTasksbyUserId , searchTasksByTitle} from "../services/taskService.js";

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

export async function searchTasks(req, res, next) {
    try {
        const {title} = req.query;
        const userId = req.session.userId;
        if(!title || title.trim() === "") {
            return res.status(400).send("Title is required");
        }
        const searchResult = await searchTasksByTitle(title, userId);
        return res.json(searchResult);
    }
    catch (err){
        next(err);
    }
}