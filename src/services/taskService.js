import * as database from "../database/database.js";

export function getTasksByUserId(userId, sort = "title", order = "asc") {
  const allowedColumns = ["title", "completed"];
  const allowedOrder = ["ASC", "DESC"];
  if (
    !allowedColumns.includes(sort) ||
    !allowedOrder.includes(order.toUpperCase())
  ) {
    const error = new Error("Bad Request");
    error.status = 400;
    throw error;
  }
  return database.all(
    `SELECT * FROM tasks 
        WHERE user_id = ?
        ORDER BY ${sort} ${order}
        `,
    [userId],
  );
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
