import * as taskServices from "../services/taskServices.js";

export async function getTasks(req, res, next) {
  try {
    const userId = req.session.userId;

    const result = await taskServices.getTasksByUserId(
      userId,
      req.validatedData.query,
    );

    return res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function getTask(req, res, next) {
  try {
    const userId = req.session.userId;
    const taskId = req.validatedData.params.id;

    const task = await taskServices.getTaskById(userId, taskId);

    return res.json(task);
  } catch (err) {
    next(err);
  }
}

export async function createTask(req, res, next) {
  try {
    const userId = req.session.userId;
    const { title, projectId } = req.validatedData.body;

    await taskServices.createTask(userId, title, projectId);

    return res.sendStatus(201);
  } catch (err) {
    next(err);
  }
}

export async function renameTask(req, res, next) {
  try {
    const userId = req.session.userId;
    const taskId = req.validatedData.params.id;
    const { title } = req.validatedData.body;

    await taskServices.renameTask(userId, taskId, title);

    return res.sendStatus(204);
  } catch (err) {
    next(err);
  }
}

export async function deleteTask(req, res, next) {
  try {
    const userId = req.session.userId;
    const taskId = req.validatedData.params.id;

    await taskServices.deleteTask(userId, taskId);

    return res.sendStatus(204);
  } catch (err) {
    next(err);
  }
}

export async function completeTask(req, res, next) {
  try {
    const userId = req.session.userId;
    const taskId = req.validatedData.params.id;

    await taskServices.completeTask(userId, taskId);

    return res.sendStatus(204);
  } catch (err) {
    next(err);
  }
}

export async function moveTask(req, res, next) {
  try {
    const userId = req.session.userId;

    const taskId = req.validatedData.params.id;
    const { id: projectId } = req.validatedData.body;

    await taskServices.moveTaskToNewProject(userId, taskId, projectId);

    return res.sendStatus(204);
  } catch (err) {
    next(err);
  }
}
