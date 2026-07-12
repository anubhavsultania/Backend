// import {
//   createNewProject,
//   deleteProjectById,
//   getProjectsByUserId,
//   renameProjectWithId,
// } from "../services/projectServices";
import { projectService } from "../container.js";

export async function getProjects(req, res, next) {
  try {
    const userId = req.session.userId;
    const result = await projectService.getProjectsByUserId(userId);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

export async function createProject(req, res, next) {
  try {
    const userId = req.session.userId;
    const { title } = req.validatedData.body;
    const { lastID: newId } = await projectService.createNewProject(
      userId,
      title,
    );
    return res.status(201).json({
      id: newId,
      name: title,
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteProject(req, res, next) {
  try {
    const userId = req.session.userId;
    const projectId = req.validatedData.params.id;
    await projectService.deleteProjectById(userId, projectId);
    return res.sendStatus(204);
  } catch (error) {
    next(error);
  }
}

export async function renameProject(req, res, next) {
  try {
    const userId = req.session.userId;
    const projectId = req.validatedData.params.id;
    const { title } = req.validatedData.body;
    await projectService.renameProjectById(userId, projectId, title);
    return res.sendStatus(204);
  } catch (error) {
    next(error);
  }
}
