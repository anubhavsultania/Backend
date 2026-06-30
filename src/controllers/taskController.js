import db from "../db.js";
import {
  getTasksByUserId,
  searchTasksByTitle,
  getTasksByTaskId,
} from "../services/taskService.js";

export async function getTasks(req, res, next) {
  try {
    const userId = req.session.userId;
    const { sort, order, page, limit } = req.query;
    const rows = await getTasksByUserId(userId, sort, order, page, limit);
    return res.json(rows);
  } catch (error) {
    next(error);
  }
}

export async function searchTasks(req, res, next) {
  try {
    const { title } = req.query;
    const userId = req.session.userId;
    if (!title || title.trim() === "") {
      return res.status(400).send("Title is required");
    }
    const searchResult = await searchTasksByTitle(title, userId);
    return res.json(searchResult);
  } catch (error) {
    next(error);
  }
}

export async function getTasksbyId(req, res, next) {
  try {
    const userId = req.session.userId;
    const taskId = req.params.id;
    const tasks = await getTasksByTaskId(userId, taskId);
    if (!tasks) {
      return res.status(404).json({
        message: "Task not found",
      });
    }
    res.json(tasks);
  } catch (error) {
    next(error);
  }
}
