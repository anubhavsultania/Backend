import * as database from "../database/database.js";

export async function getPaginationData(sql, params, page, limit) {
  const { totalItems } = await database.get(sql, params);
  const totalPages = Math.max(1, Math.ceil(totalItems / limit));

  return {
    page,
    limit,
    totalItems,
    totalPages,
    hasNext: page < totalPages,
    hasPrevious: page > 1,
  };
}
