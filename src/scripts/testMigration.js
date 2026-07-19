import db from "../db.js";
import { runStep } from "../utils/logger.js";

export async function migrate(closeDb = true) {
  try {
    await runStep("Enabling foreign keys", "PRAGMA foreign_keys = ON");

    await runStep("Beginning transaction", "BEGIN TRANSACTION");

    // Drop tables (child tables first because of foreign keys)
    await runStep("Dropping tasks table", "DROP TABLE IF EXISTS tasks");

    await runStep("Dropping projects table", "DROP TABLE IF EXISTS projects");

    await runStep("Dropping users table", "DROP TABLE IF EXISTS users");

    // Users
    await runStep(
      "Creating users table",
      `
      CREATE TABLE users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL
      )
      `,
    );

    // Projects
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

    // Tasks (FINAL schema)
    await runStep(
      "Creating tasks table",
      `
      CREATE TABLE tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        completed INTEGER NOT NULL DEFAULT 0,
        user_id INTEGER NOT NULL,
        project_id INTEGER NOT NULL,

        FOREIGN KEY(user_id)
          REFERENCES users(id)
          ON DELETE CASCADE,

        FOREIGN KEY(project_id)
          REFERENCES projects(id)
          ON DELETE CASCADE
      )
      `,
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

    throw err;
  } finally {
    if (closeDb) {
      await new Promise((resolve, reject) => {
        db.close((err) => {
          if (err) reject(err);
          else resolve();
        });
      });
    }
  }
}
