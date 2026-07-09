import * as database from "../database/database.js";
import {
  forbidden,
  notFound,
  translateDatabaseError,
} from "../utils/httpErrors.js";

import * as projectRepositories from "../repositories/projectRepositories.js";
import * as taskRepositories from "../repositories/taskRepositories.js";

export function createDefaultProject(userId) {
  return projectRepositories.createProject(userId, "Inbox", "INBOX");
}

export function getProjectsByUserId(userId) {
  return projectRepositories.listProjects(userId);
}

export async function createNewProject(userId, title) {
  try {
    await projectRepositories.createProject(userId, title, "NORMAL");
  } catch (err) {
    translateDatabaseError(err, "Project");
  }
}

export async function renameProjectById(userId, projectId, title) {
  const project = await projectRepositories.getProjectById(userId, projectId);

  if (!project) {
    throw notFound("Project not found");
  }

  try {
    await projectRepositories.renameProject(userId, projectId, title);
  } catch (err) {
    translateDatabaseError(err, "Project");
  }
}

export async function deleteProjectById(userId, projectId) {
  try {
    await database.beginTransaction();

    const project = await projectRepositories.getProjectById(userId, projectId);

    if (!project) {
      throw notFound("Project not found");
    }

    if (project.type === "INBOX") {
      throw forbidden("Default project cannot be deleted.");
    }

    const inboxProject = await projectRepositories.getInboxProject(userId);

    if (!inboxProject) {
      throw new Error("Inbox project is missing.");
    }

    await taskRepositories.moveTasksToProject(
      userId,
      projectId,
      inboxProject.id,
    );

    await projectRepositories.deleteProject(userId, projectId);

    await database.commitTransaction();
  } catch (err) {
    try {
      await database.rollbackTransaction();
    } catch (rollbackErr) {
      console.error("Rollback failed:", rollbackErr);
    }

    throw err;
  }
}
