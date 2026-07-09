import * as database from "../database/database.js";

export function getProjectById(userId, projectId) {
  return database.get(
    `
    SELECT *
    FROM projects
    WHERE user_id = ?
      AND id = ?
    `,
    [userId, projectId],
  );
}

export function getProjectByName(userId, name) {
  return database.get(
    `
    SELECT *
    FROM projects
    WHERE user_id = ?
      AND name = ?
    `,
    [userId, name],
  );
}

export function getInboxProject(userId) {
  return database.get(
    `
    SELECT *
    FROM projects
    WHERE user_id = ?
      AND type = 'INBOX'
    `,
    [userId],
  );
}

export function listProjects(userId) {
  return database.all(
    `
    SELECT *
    FROM projects
    WHERE user_id = ?
    ORDER BY name
    `,
    [userId],
  );
}

export function createProject(userId, name, type) {
  return database.run(
    `
    INSERT INTO projects (type, name, user_id)
    VALUES (?, ?, ?)
    `,
    [type, name, userId],
  );
}

export function renameProject(userId, projectId, name) {
  return database.run(
    `
    UPDATE projects
    SET name = ?
    WHERE user_id = ?
      AND id = ?
    `,
    [name, userId, projectId],
  );
}

export function deleteProject(userId, projectId) {
  return database.run(
    `
    DELETE FROM projects
    WHERE user_id = ?
      AND id = ?
    `,
    [userId, projectId],
  );
}
