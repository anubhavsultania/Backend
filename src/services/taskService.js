import * as database from "../database/database.js";
import { getPaginationData } from "../utils/pagination.js";
import { badRequest } from "../utils/badRequests.js";
import { getProjectsByProjectID } from "./projectServices.js";

export async function getTasksByUserId(userId, filters) {
  const { title, completed, projectId, sort, order, page, limit } = filters;
  const conditions = ["user_id = ?"];
  const params = [userId];
  if (title) {
    conditions.push("LOWER(title) LIKE LOWER(?)");
    params.push(`%${title}%`);
  }

  if (completed !== undefined) {
    conditions.push("completed = ?");
    params.push(completed ? 1 : 0);
  }

  if (projectId) {
    conditions.push("project_id = ?");
    params.push(projectId);
  }
  const whereClause = conditions.join(" AND ");
  const offset = (page - 1) * limit;
  const [userData, paginationData] = await Promise.all([
    database.all(
      `
        SELECT *
        FROM tasks
        WHERE ${whereClause}
        ORDER BY ${sort} ${order.toUpperCase()}
        LIMIT ?
        OFFSET ?
        `,
      [...params, limit, offset],
    ),
    getPaginationData(
      `
        SELECT COUNT(*) AS totalItems
        FROM tasks
        WHERE ${whereClause}
        `,
      params,
      page,
      limit,
    ),
  ]);
  return {
    data: userData,
    pagination: paginationData,
  };
}

export function searchTasksByTitle(title, userId) {
  const searchPattern = `%${title}%`;
  return database.all(
    `SELECT id, title FROM tasks
        WHERE LOWER(title) like LOWER(?)
        AND user_id = ?`,
    [searchPattern, userId],
  );
}

export function getTasksByTaskId(userId, taskId) {
  return database.get(
    `SELECT * FROM tasks WHERE user_id = ?
        AND id = ?
    `,
    [userId, taskId],
  );
}

export function moveTaskToInbox(userId, oldprojectId, newProjectId) {
  return database.run(
    `
    UPDATE tasks
    SET project_id = ?
    WHERE user_id = ?
    AND project_id = ?
  `,
    [newProjectId, userId, oldprojectId],
  );
}

export async function moveTaskToNewProject(taskId, userId, newProjectId) {
  const task = await getTasksByTaskId(userId, taskId);
  if (!task) {
    const err = new Error("Task not found");
    err.status = 404;
    throw err;
  }
  const project = await getProjectsByProjectID(userId, newProjectId);
  if (!project) {
    const err = new Error("Project not found");
    err.status = 404;
    throw err;
  }

  return database.run(
    `
    UPDATE tasks
    SET project_id = ?
    WHERE user_id = ?
    AND id = ?
  `,
    [newProjectId, userId, taskId],
  );
}
