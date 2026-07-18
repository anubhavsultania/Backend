import db from "../db.js";
import { runStep } from "../utils/logger.js";

export async function migrate(closeDb = true) {
  try {
    // Transaction
    await runStep("Enabling foreign keys", "PRAGMA foreign_keys = ON");

    await runStep("Beginning transaction", "BEGIN TRANSACTION");

    // Projects
    await runStep("Dropping projects table", "DROP TABLE IF EXISTS projects");

    await runStep(
      "Creating projects table",
      `
            CREATE TABLE projects (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL CHECK(TRIM(name) <> ''),
                user_id INTEGER NOT NULL,
                type TEXT NOT NULL DEFAULT 'NORMAL',

                FOREIGN KEY(user_id)
                    REFERENCES users(id)
                    ON DELETE CASCADE,

                UNIQUE(user_id, name)
            )
            `,
    );

    await runStep(
      "Creating Inbox projects",
      `
            INSERT INTO projects(name, type, user_id)
            SELECT 'Inbox', 'INBOX', id
            FROM users
            `,
    );

    // Tasks
    await runStep(
      "Creating newTasks table",
      `
            CREATE TABLE newTasks(
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                user_id INTEGER NOT NULL,
                completed INTEGER NOT NULL DEFAULT 0,
                project_id INTEGER NOT NULL,

                FOREIGN KEY(user_id)
                    REFERENCES users(id)
                    ON DELETE CASCADE,

                FOREIGN KEY(project_id)
                    REFERENCES projects(id)
            )
            `,
    );

    await runStep(
      "Copying tasks",
      `
            INSERT INTO newTasks(
                title,
                completed,
                user_id,
                project_id
            )
            SELECT
                tasks.title,
                -- Convert NULL completed values from the old table to 0
                COALESCE(tasks.completed, 0),
                tasks.user_id,
                projects.id
            FROM tasks
            JOIN projects
                ON tasks.user_id = projects.user_id
            WHERE projects.type = 'INBOX'
            `,
    );

    await runStep("Dropping old tasks table", "DROP TABLE tasks");

    await runStep(
      "Renaming newTasks to tasks",
      "ALTER TABLE newTasks RENAME TO tasks",
    );

    await runStep("Committing transaction", "COMMIT");

    console.log("Migration completed successfully.");
  } catch (err) {
    console.error(`Migration failed: ${err.message}`);

    try {
      await runStep("Rolling back transaction", "ROLLBACK");
    } catch (rollbackErr) {
      console.error(`Rollback failed: ${rollbackErr.message}`);
    }
  } finally {
    if (closeDb) {
      db.close();
    }
  }
}
