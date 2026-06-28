import * as database from "../database/database.js"

export function getTasksbyUserId(userId) {
    return database.all(`SELECT * FROM tasks 
        WHERE user_id = ?
        `, [userId]
    );
}

export function searchTasksByTitle(title, userId) {
    const searchPattern = `%${title}%`;
    return database.all(`SELECT id, title FROM tasks
        WHERE LOWER(title) like LOWER(?)
        AND user_id = ?`, [searchPattern, userId]);
}