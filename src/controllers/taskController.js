import db from "../db.js";

export function getTasks(req, res) {
    const userId = req.session.userId;
    db.all(`SELECT * FROM tasks 
        WHERE user_id = ?
    `, [userId], (err, rows) => {
        if(err) {
            return res.status(500).send(err.message);
        }
        return res.json(rows);
    });
};