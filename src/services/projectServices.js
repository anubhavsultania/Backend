import { da } from "zod/locales";
import * as database from "../database/database.js";
import { translateDatabaseError } from "../utils/badRequests.js";
import { moveTaskToInbox } from "./taskService.js";
export function createDefaultProject(userId) {
  database.run(
    `INSERT INTO projects (name, user_id, type)
          VALUES ('Inbox', ?, 'INBOX')`,
    [userId],
  );
}

export function getProjectsByUserId(userId) {
  return database.run(
    `
    SELECT id, name
    FROM project 
    WHERE user_id = ?
    `,
    [userId],
  );
}

export async function createNewProject(userId, title) {
  try {
    await database.run(
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
      const error = new Error("Project not found");
      error.status = 404;
      throw error;
    }
    if (result.type == "INBOX") {
      const error = new Error("This is default project and can't be deleted");
      error.status = 403;
      throw error;
    }
    await moveTaskToInbox(userId, projectId, result.id);
    const result = await database.run(
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
    const error = new Error("Project not found");
    error.status = 404;
    throw error;
  }
  const result = await database.run(
    `
      UPDATE projects
      SET name = ?
      WHERE user_id = ?
      AND id = ?
    `,
    [title, userId, projectId],
  );
}

export function getProjectsByProjectID(userId, ProjectId) {
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
