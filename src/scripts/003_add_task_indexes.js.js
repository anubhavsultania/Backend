import { runStep } from "../utils/logger.js";
import db from "../db.js";

export async function migrate_01(closeDb = true) {
  try {
    await runStep(
      "Creating Index",
      `
           CREATE INDEX IF NOT EXISTS idx_tasks_user_project
ON tasks(user_id, project_id);
            `,
    );
  } catch (error) {
    console.error(`Migration_001 failed: ${error.message}`);
  } finally {
    if (closeDb) db.close();
  }
}
