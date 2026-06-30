import * as database from "../database/database.js";
import { getPaginationData } from "../utils/pagination.js";
import { badRequest } from "../utils/badRequests.js";

export async function getTasksByUserId(
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

  const invalidOrder = !allowedOrder.includes(order);

  const invalidPage =
    Number.isNaN(pageNum) || !Number.isInteger(pageNum) || pageNum < 1;

  const invalidLimit =
    Number.isNaN(limitNum) ||
    !Number.isInteger(limitNum) ||
    limitNum < 1 ||
    limitNum > maxLimit;

  if (invalidSort) throw badRequest("Invalid sort field");
  if (invalidOrder) throw badRequest("Invalid sort order. Use ASC or DESC");
  if (invalidPage) throw badRequest("Page must be a positive integer");
  if (invalidLimit)
    throw badRequest("Limit must be an integer between 1 and 100");
  const offset = (pageNum - 1) * limitNum;
  const [userData, paginationData] = await Promise.all([
    database.all(
      `SELECT * FROM tasks 
        WHERE user_id = ?
        ORDER BY ${sort} ${order}
        LIMIT ? OFFSET ?
        `,
      [userId, limitNum, offset],
    ),
    getPaginationData(userId, pageNum, limitNum),
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
