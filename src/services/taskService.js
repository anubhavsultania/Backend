import * as database from "../database"

export function getTasksbyUserId(userId) {
    return database.all(`SELECT * FROM tasks 
        WHERE user_id = ?
        `, [userId]
    );
}