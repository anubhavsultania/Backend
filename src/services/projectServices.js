import * as database from "../database/database.js";
import {
  forbidden,
  notFound,
  translateDatabaseError,
} from "../utils/httpErrors.js";
import { moveTaskToInbox } from "./taskService.js";

export function createDefaultProject(userId) {
  return database.run(
    `INSERT INTO projects (name, user_id, type)
          VALUES ('Inbox', ?, 'INBOX')`,
    [userId],
  );
}

export function getProjectsByUserId(userId) {
  return database.all(
    `
    SELECT id, name
    FROM projects
    WHERE user_id = ?
    `,
    [userId],
  );
}

export async function createNewProject(userId, title) {
  try {
    return database.run(
      `
      INSERT INTO projects (type, name, user_id)
       VALUES ('NORMAL', ?, ?)
       `,
      [title, userId],
    );
  } catch (err) {
    translateDatabaseError(err, "Project");
  }
}

export async function deleteProjectWithID(userId, projectId) {
  try {
    await database.beginTransaction();
    const result = await getProjectsByProjectID(userId, projectId);
    if (!result) {
      // No row matched
      throw notFound("Project not found");
    }
    if (result.type == "INBOX") {
      throw forbidden("This is default project and can't be deleted");
    }
    const { id: newProjectId } = await getProjectsByProjectType(
      userId,
      "INBOX",
    );
    await moveTaskToInbox(userId, projectId, newProjectId);
    await database.run(
      `
    DELETE FROM projects 
    WHERE user_id = ?
    AND id = ?
    `,
      [userId, projectId],
    );
    await database.commitTransaction();
  } catch (error) {
    try {
      await database.rollbackTransaction();
    } catch (error) {
      console.log("Rollback failed during deletion");
    }
    throw error;
  }
}

export async function renameProjectWithId(userId, projectId, title) {
  const project = await getProjectsByProjectID(userId, projectId);
  if (!project) {
    // No row matched
    throw notFound("Project not found");
  }
  return database.run(
    `
      UPDATE projects
      SET name = ?
      WHERE user_id = ?
      AND id = ?
    `,
    [title, userId, projectId],
  );
}

export function getProjectsByProjectID(userId, projectId) {
  return database.get(
    `
      SELECT type, id
      FROM projects
      WHERE user_id = ?
      AND id = ? 
    `,
    [userId, projectId],
  );
}

export function getProjectsByProjectType(userId, type) {
  return database.get(
    `
      SELECT *
      FROM projects
      WHERE user_id = ?
      AND type = ? 
    `,
    [userId, type],
  );
}
