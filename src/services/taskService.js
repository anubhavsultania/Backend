import * as database from "../database/database.js";

export function getTasksByUserId(
  userId,
  sort = "title",
  order = "asc",
  page = "1",
  limit = "5",
) {
  const allowedColumns = ["title", "completed"];
  const allowedOrder = ["ASC", "DESC"];
  sort = sort.toLowerCase();
  order = order.toUpperCase();
  const pageNum = Number(page);
  const limitNum = Number(limit);
  const maxLimit = 100;
  const invalidSort = !allowedColumns.includes(sort);

  const invalidOrder = !allowedOrder.includes(order.toUpperCase());

  const invalidPage =
    Number.isNaN(pageNum) || !Number.isInteger(pageNum) || pageNum < 1;

  const invalidLimit =
    Number.isNaN(limitNum) ||
    !Number.isInteger(limitNum) ||
    limitNum < 1 ||
    limitNum > maxLimit;

  if (invalidSort || invalidOrder || invalidPage || invalidLimit) {
    const error = new Error("Bad Request");
    error.status = 400;
    throw error;
  }
  const offset = (pageNum - 1) * limitNum;
  return database.all(
    `SELECT * FROM tasks 
        WHERE user_id = ?
        ORDER BY ${sort} ${order}
        LIMIT ? OFFSET ?
        `,
    [userId, limitNum, offset],
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
