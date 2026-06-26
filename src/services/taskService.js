import db from "../db.js"

export function getTasksbyUserId(userId, callback) {
    db.all(`SELECT * FROM tasks 
        WHERE user_id = ?
    `, [userId], callback
    );
};