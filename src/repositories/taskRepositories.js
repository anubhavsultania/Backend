import * as database from "../database/database.js";

export function getTaskById(userId, taskId) {
  return database.get(
    `
    SELECT *
    FROM tasks
    WHERE user_id = ?
      AND id = ?
    `,
    [userId, taskId],
  );
}

export function listTasks(userId, filters) {
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

  return database.all(
    `
    SELECT *
    FROM tasks
    WHERE ${whereClause}
    ORDER BY ${sort} ${order.toUpperCase()}
    LIMIT ?
    OFFSET ?
    `,
    [...params, limit, offset],
  );
}

export function countTasks(userId, filters) {
  const { title, completed, projectId } = filters;

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

  return database.get(
    `
    SELECT COUNT(*) AS totalItems
    FROM tasks
    WHERE ${conditions.join(" AND ")}
    `,
    params,
  );
}

export function createTask(userId, title, projectId = null) {
  return database.run(
    `
    INSERT INTO tasks(title,user_id,project_id)
    VALUES(?,?,?)
    `,
    [title, userId, projectId],
  );
}

export function renameTask(userId, taskId, title) {
  return database.run(
    `
    UPDATE tasks
    SET title = ?
    WHERE user_id = ?
      AND id = ?
    `,
    [title, userId, taskId],
  );
}

export function deleteTask(userId, taskId) {
  return database.run(
    `
    DELETE FROM tasks
    WHERE user_id = ?
      AND id = ?
    `,
    [userId, taskId],
  );
}

export function completeTask(userId, taskId, completed) {
  return database.run(
    `
    UPDATE tasks
    SET completed = ?
    WHERE user_id = ?
      AND id = ?
    `,
    [completed ? 1 : 0, userId, taskId],
  );
}

export function moveTaskToProject(userId, taskId, projectId) {
  return database.run(
    `
    UPDATE tasks
    SET project_id = ?
    WHERE user_id = ?
      AND id = ?
    `,
    [projectId, userId, taskId],
  );
}

export function moveTasksToProject(userId, oldProjectId, newProjectId) {
  return database.run(
    `
    UPDATE tasks
    SET project_id = ?
    WHERE user_id = ?
      AND project_id = ?
    `,
    [newProjectId, userId, oldProjectId],
  );
}
