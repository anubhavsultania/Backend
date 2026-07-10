import { getPaginationData } from "../utils/pagination.js";
import { notFound } from "../utils/httpErrors.js";

import * as taskRepositories from "../repositories/taskRepositories.js";
import * as projectRepositories from "../repositories/projectRepositories.js";

export async function getTasksByUserId(userId, filters) {
  const { page, limit } = filters;

  const [tasks, { totalItems }] = await Promise.all([
    taskRepositories.listTasks(userId, filters),
    taskRepositories.countTasks(userId, filters),
  ]);

  return {
    data: tasks,
    pagination: getPaginationData(totalItems, page, limit),
  };
}

export function searchTasksByTitle(userId, title) {
  return taskRepositories.listTasks(userId, {
    title,
    completed: undefined,
    projectId: undefined,
    sort: "title",
    order: "asc",
    page: 1,
    limit: 100,
  });
}

export async function getTaskById(userId, taskId) {
  const task = await taskRepositories.getTaskById(userId, taskId);

  if (!task) {
    throw notFound("Task not found");
  }

  return task;
}

export async function createTask(userId, title, projectId = null) {
  return taskRepositories.createTask(userId, title, projectId);
}

export async function renameTask(userId, taskId, title) {
  await getTaskById(userId, taskId);

  return taskRepositories.renameTask(userId, taskId, title);
}

export async function deleteTask(userId, taskId) {
  await getTaskById(userId, taskId);

  return taskRepositories.deleteTask(userId, taskId);
}

export async function completeTask(userId, taskId) {
  await getTaskById(userId, taskId);

  return taskRepositories.completeTask(userId, taskId, true);
}

export async function moveTaskToNewProject(userId, taskId, newProjectId) {
  const [task, project] = await Promise.all([
    taskRepositories.getTaskById(userId, taskId),
    projectRepositories.getProjectById(userId, newProjectId),
  ]);

  if (!task) {
    throw notFound("Task not found");
  }

  if (!project) {
    throw notFound("Project not found");
  }

  return taskRepositories.moveTaskToProject(userId, taskId, newProjectId);
}

export function moveTasksToInbox(userId, oldProjectId, inboxProjectId) {
  return taskRepositories.moveTasksToProject(
    userId,
    oldProjectId,
    inboxProjectId,
  );
}
