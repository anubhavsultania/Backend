import db from "../db.js";

export function getTasks(req, res, next) {
    const userId = req.session.userId;
    db.all(`SELECT * FROM tasks 
        WHERE user_id = "abc"
    `, [userId], (err, rows) => {
        if(err) {
            return next(err);
        }
        return res.json(rows);
    });
};