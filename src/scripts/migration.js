import sqlite3 from "sqlite3";
const db = new sqlite3.Database("./database/users.db", (err) => {
  if (err) {
    console.error(err.message);
  } else {
    console.log("Connected to database");
  }
});

db.run(`DROP TABLE IF EXISTS projects`, (err) => {
  console.log(`Failed to Drop table Projects error : ${err.message}`);
});

db.run(`
CREATE TABLE IF NOT EXISTS projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL CHECK(TRIM(name) <> ''),
    user_id INTEGER NOT NULL,
    FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,
    UNIQUE(user_id, name),
    type TEXT NOT NULL 
)
`);

db.run(`INSERT INTO projects (name, type, user_id)
  SELECT 'Inbox', 'INBOX', id 
  FROM users
  `);

db.run(`CREATE TABLE IF NOT EXISTS newTasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    user_id INTEGER NOT NULL,
    completed INTEGER NOT NULL DEFAULT 0,
    project_id INTEGER NOT NULL,

    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (project_id) REFERENCES projects(id)
);`);

db.run(`INSERT INTO newTasks (title, completed, user_id, project_id)
SELECT
    tasks.title,
    tasks.completed,
    tasks.user_id,
    projects.id
FROM tasks
JOIN projects
ON tasks.user_id = projects.user_id
WHERE projects.type = 'INBOX'`
);

db.run(`ALTER TABLE newTasks RENAME TO tasks`);

