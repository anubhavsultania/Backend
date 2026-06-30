import * as database from "../database/database.js";

export async function getPaginationData(userId, pageNum, limitNum) {
  const result = await database.get(
    `
        SELECT COUNT(*) AS totalItems
        FROM tasks
        WHERE user_id = ?
        `,
    [userId],
  );

  const totalItems = result.totalItems;
  const totalPages = Math.max(1, Math.ceil(totalItems / limitNum));

  const paginationData = {
    page: pageNum,
    limit: limitNum,
    totalItems,
    totalPages,
    hasNext: pageNum < totalPages,
    hasPrevious: pageNum > 1,
  };

  return paginationData;
}
