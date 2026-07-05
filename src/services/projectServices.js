import * as database from "../database/database.js";
export async function createDefaultProject(userId) {
  await database.run(
    `INSERT INTO projects (name, user_id, type)
          VALUES ('Inbox', ?, 'INBOX')`,
    [userId],
  );
}
