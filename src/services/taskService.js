import db from "../db.js"

export function getTasksbyUserId(userId) {
    return new Promise((resolve, reject) => {
        db.all(`SELECT * FROM tasks 
        WHERE user_id = ?
        `, [userId], (err, row) => {
            if(err) {
                return reject(err);
            }
            resolve(row);
        });
    });
};