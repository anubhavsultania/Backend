import sqlite3 from "sqlite3";

/* =========================
   Database Connection
========================= */

const db = new sqlite3.Database("./database/users.db", (err) => {
    if (err) {
        console.error(err.message);
    } else {
        console.log("Connected to database");
    }
});

db.run(`
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE,
        password TEXT
    )
`);

export default db;