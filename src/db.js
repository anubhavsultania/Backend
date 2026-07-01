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

db.run(`
    CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        user_id INTEGER NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id)
    )
`);

db.run(`ALTER TABLE tasks ADD COLUMN completed INTEGER DEFAULT 0`, (err) => {
  if (err && !err.message.includes("duplicate column name")) {
    console.error(err.message);
  }
});

db.run(`
CREATE TABLE IF NOT EXISTS projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL CHECK(TRIM(name) <> ''),
    user_id INTEGER NOT NULL,

    FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    UNIQUE(user_id, name)
)
`);
export default db;
