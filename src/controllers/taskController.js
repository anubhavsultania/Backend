import db from "../db.js";
import {
  getTasksByUserId,
  searchTasksByTitle,
  getTasksByTaskId,
  moveTaskToNewProject,
} from "../services/taskService.js";

export async function getTasks(req, res, next) {
  try {
    const userId = req.session.userId;

    const result = await getTasksByUserId(userId, req.validatedData.query);

    return res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function searchTasks(req, res, next) {
  try {
    const { title } = req.validatedData;
    const userId = req.session.userId;
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

export async function moveTask(req, res, next) {
  try {
    const taskId = req.validatedData.params.id;
    const newProjectId = req.validatedData.body.id;
    const userId = req.session.userId;
    await moveTaskToNewProject(taskId, userId, newProjectId);
    return res.sendStatus(204);
  } catch (error) {
    next(error);
  }
}
